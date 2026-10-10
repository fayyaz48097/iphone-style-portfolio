/**
 * Best-effort in-memory rate limiter (per server instance) to protect the free AI quota.
 * Serverless instances come and go, so this isn't a hard guarantee, but it stops one
 * visitor or script from draining the quota in a burst. When it trips, the browser
 * simply falls back to the offline Siri.
 */
export function createRateLimiter({ limit, windowMs }) {
  const hits = new Map()

  return function allow(key) {
    const now = Date.now()
    const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs)
    if (recent.length >= limit) {
      hits.set(key, recent)
      return false
    }
    recent.push(now)
    hits.set(key, recent)

    // keep the map small
    if (hits.size > 5000) {
      for (const [entry, times] of hits) if (!times.some((time) => now - time < windowMs)) hits.delete(entry)
    }
    return true
  }
}

/** The caller's IP as seen by Vercel (or the local dev server). */
export function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  return (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0].trim() || req.socket?.remoteAddress || 'unknown'
}
