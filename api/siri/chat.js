import { geminiConfigured, streamGemini } from '../_lib/gemini.js'
import { HttpError, handler, readJson, siteUrl } from '../_lib/http.js'
import { clientIp, createRateLimiter } from '../_lib/rateLimit.js'
import { siriSystemInstruction } from '../_lib/siriPrompt.js'

/*
 * POST /api/siri/chat  { messages: [{ role: 'user' | 'assistant', content }] }
 * -> streamed plain-text answer from Gemini, as Siri.
 *
 * Any error status tells the browser to fall back to the offline keyword Siri.
 */

const LIMITS = Object.freeze({
  history: 12, // messages of context sent to the model
  messageChars: 800,
  totalChars: 6000,
  timeoutMs: 25_000,
})

// per visitor IP: 20 questions per 10 minutes (per server instance)
const allow = createRateLimiter({ limit: 20, windowMs: 10 * 60_000 })

/** Keeps only well-formed, size-limited user/assistant turns, ending with the user's question. */
function sanitize(messages) {
  if (!Array.isArray(messages)) throw new HttpError(400, 'messages must be an array')

  const turns = messages
    .filter((m) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-LIMITS.history)
    .map(({ role, content }) => ({ role, content: content.trim().slice(0, LIMITS.messageChars) }))

  // the model expects to start with the user and end with the user's latest question
  while (turns.length && turns[0].role !== 'user') turns.shift()
  if (!turns.length || turns.at(-1).role !== 'user') throw new HttpError(400, 'The last message must be a question')

  let total = 0
  const kept = []
  for (const turn of turns.toReversed()) {
    total += turn.content.length
    if (total > LIMITS.totalChars) break
    kept.unshift(turn)
  }
  return kept
}

/** Only this site may use the endpoint (blocks other websites embedding it). */
function assertSameOrigin(req) {
  const origin = req.headers.origin
  if (!origin) return
  const allowed = [siteUrl(req), process.env.SITE_URL].filter(Boolean).map((url) => new URL(url).host)
  if (!allowed.includes(new URL(origin).host)) throw new HttpError(403, 'Not allowed')
}

export default handler(async (req, res) => {
  if (!geminiConfigured()) throw new HttpError(503, 'AI is not configured')
  assertSameOrigin(req)
  if (!allow(clientIp(req))) throw new HttpError(429, 'Too many questions, please slow down')

  const { messages } = await readJson(req)
  const turns = sanitize(messages)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), LIMITS.timeoutMs)
  // visitor stopped or closed Siri: the connection closes before we finished writing
  // (req's own 'close' fires as soon as the body is read, so watch the response instead)
  res.on('close', () => {
    if (!res.writableEnded) controller.abort()
  })

  try {
    const chunks = await streamGemini({ system: siriSystemInstruction(), messages: turns, signal: controller.signal })

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('X-Content-Type-Options', 'nosniff')

    for await (const text of chunks) res.write(text)
    res.end()
  } catch (error) {
    // once streaming has started we can only stop; before that, report a status the client can act on
    if (res.headersSent) return res.end()
    if (error.name === 'AbortError') throw new HttpError(504, 'The AI took too long')
    throw error
  } finally {
    clearTimeout(timer)
  }
})
