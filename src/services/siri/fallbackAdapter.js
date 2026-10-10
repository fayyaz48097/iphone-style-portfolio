import { isAbortError } from '@/lib/async'

/** After these failures the primary is skipped for a while instead of being retried every question. */
const COOLDOWN_STATUSES = new Set([0, 429, 500, 502, 503, 504])

/**
 * Tries `primary` (the AI) and answers with `backup` (the offline keyword Siri) when it fails:
 * no network, timeout, quota reached, server error or an empty reply.
 *
 * After a quota/server failure the primary is skipped for `cooldownMs`, so visitors
 * don't wait for a failing AI on every question.
 *
 * @param {import('./index').SiriAdapter} primary
 * @param {import('./index').SiriAdapter} backup
 * @returns {import('./index').SiriAdapter}
 */
export function createFallbackAdapter(primary, backup, { cooldownMs = 5 * 60_000 } = {}) {
  let skipPrimaryUntil = 0

  return {
    /** Which brain answers right now: 'remote' or 'local'. */
    get name() {
      return Date.now() < skipPrimaryUntil ? backup.name : primary.name
    },

    async ask(request) {
      if (Date.now() >= skipPrimaryUntil) {
        let streamed = false
        try {
          return await primary.ask({
            ...request,
            onToken: (token) => {
              streamed = true
              request.onToken(token)
            },
          })
        } catch (error) {
          // the visitor cancelled, or half an answer is already on screen: don't switch brains mid-reply
          if (isAbortError(error) || streamed) throw error
          if (COOLDOWN_STATUSES.has(error.status)) skipPrimaryUntil = Date.now() + cooldownMs
          console.info('[siri] AI unavailable, answering offline:', error.message)
        }
      }
      return backup.ask(request)
    },
  }
}
