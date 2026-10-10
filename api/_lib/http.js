/*
 * Minimal HTTP helpers that work on plain Node req/res, so the same handlers run on
 * Vercel and in the local Vite dev/preview server. (Files under api/_lib are not routes.)
 */

export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export function sendJson(res, status, data) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(data))
}

/** Parsed JSON body. Vercel may have parsed it already; otherwise read the stream. */
export async function readJson(req, { limit = 10_000 } = {}) {
  if (req.body !== undefined) return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body

  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > limit) throw new HttpError(413, 'Request body too large')
  }
  try {
    return raw ? JSON.parse(raw) : {}
  } catch {
    throw new HttpError(400, 'Invalid JSON')
  }
}

export function bearerToken(req) {
  const header = req.headers.authorization ?? ''
  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) throw new HttpError(401, 'Missing sign-in token')
  return token
}

/** Public origin for links in emails: SITE_URL, else the request's own origin. */
export function siteUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '')
  const proto = req.headers['x-forwarded-proto'] ?? 'http'
  return `${proto}://${req.headers['x-forwarded-host'] ?? req.headers.host}`
}

/** Wraps a handler with method checks and uniform error responses. */
export function handler(fn, { methods = ['POST'] } = {}) {
  return async (req, res) => {
    if (!methods.includes(req.method)) {
      res.setHeader('Allow', methods.join(', '))
      return sendJson(res, 405, { error: 'Method not allowed' })
    }
    try {
      const result = await fn(req, res)
      if (!res.writableEnded) sendJson(res, 200, result ?? { ok: true })
    } catch (error) {
      const status = error instanceof HttpError ? error.status : 500
      if (status === 500) console.error('[api]', error)
      sendJson(res, status, { error: status === 500 ? 'Something went wrong' : error.message })
    }
  }
}
