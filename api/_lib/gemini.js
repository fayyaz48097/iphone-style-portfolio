import { HttpError } from './http.js'

/*
 * Minimal Gemini (Google AI) client for the Siri function.
 * The key is sent in a header, never in the URL, so it doesn't end up in logs.
 */

const API = 'https://generativelanguage.googleapis.com/v1beta'
const env = (name, fallback = '') => process.env[name]?.trim() || fallback

export const geminiConfigured = () => Boolean(env('GEMINI_API_KEY'))

/**
 * Streams a reply from Gemini. Resolves once the upstream request is accepted
 * (so the caller can still answer with an error status before streaming starts),
 * returning an async iterator of text chunks.
 *
 * @param {object} options
 * @param {string} options.system                       system instruction
 * @param {{ role: 'user' | 'assistant', content: string }[]} options.messages
 * @param {AbortSignal} [options.signal]
 */
export async function streamGemini({ system, messages, signal }) {
  const model = env('GEMINI_MODEL', 'gemini-flash-lite-latest')

  const response = await fetch(`${API}/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env('GEMINI_API_KEY') },
    signal,
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map(({ role, content }) => ({
        role: role === 'assistant' ? 'model' : 'user',
        parts: [{ text: content }],
      })),
      generationConfig: { temperature: 0.4, maxOutputTokens: 700 },
    }),
  })

  if (!response.ok) {
    // details stay in the server log; visitors only learn that the AI is unavailable
    const detail = await response.text().catch(() => '')
    console.warn(`[siri] Gemini ${response.status}: ${detail.slice(0, 300)}`)
    // 429: quota/rate limit reached; the browser falls back to the offline Siri
    throw new HttpError(response.status === 429 ? 429 : 502, 'AI unavailable')
  }

  return readTextChunks(response.body)
}

/** Parses Gemini's server-sent events and yields the answer text (skipping "thought" parts). */
async function* readTextChunks(body) {
  const decoder = new TextDecoder()
  let buffer = ''

  for await (const bytes of body) {
    buffer += decoder.decode(bytes, { stream: true })
    let newline
    while ((newline = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newline).trim()
      buffer = buffer.slice(newline + 1)
      if (!line.startsWith('data:')) continue

      let event
      try {
        event = JSON.parse(line.slice(5))
      } catch {
        continue
      }
      for (const part of event.candidates?.[0]?.content?.parts ?? []) {
        if (part.text && !part.thought) yield part.text
      }
    }
  }
}
