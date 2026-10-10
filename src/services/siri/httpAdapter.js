/**
 * Remote adapter for your own AI endpoint.
 *
 * Request:  POST {url}  body: { messages: [{ role: 'user' | 'assistant', content: string }] }
 * Response (either):
 *   - a streamed text body (text/plain, chunked): rendered token by token
 *   - JSON: { reply } | { message } | { content }
 *
 * Keep provider API keys on the server. This runs in the browser, so anything
 * passed in `headers` here is public.
 *
 * @type {(options: { url: string, headers?: Record<string, string>, firstByteTimeoutMs?: number }) => import('./index').SiriAdapter}
 */
export function createHttpAdapter({ url, headers = {}, firstByteTimeoutMs = 12_000 }) {
  return {
    name: 'remote',

    async ask({ messages, signal, onToken }) {
      // give up (and let the fallback answer) if the AI doesn't start replying in time
      const timeout = new AbortController()
      const timer = window.setTimeout(() => timeout.abort(new DOMException('Siri AI timed out', 'TimeoutError')), firstByteTimeoutMs)
      const onAbort = () => timeout.abort(signal.reason)
      signal?.addEventListener('abort', onAbort, { once: true })

      let response
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...headers },
          body: JSON.stringify({ messages }),
          signal: timeout.signal,
        })
      } catch (error) {
        // the visitor cancelled: keep it an AbortError; a timeout becomes a normal failure
        if (signal?.aborted) throw error
        throw Object.assign(new Error('Siri AI unreachable'), { status: 0, cause: error })
      } finally {
        window.clearTimeout(timer)
      }

      try {
        if (!response.ok) throw Object.assign(new Error(`Siri API responded with ${response.status}`), { status: response.status })

        const contentType = response.headers.get('content-type') ?? ''
        if (contentType.includes('application/json') || !response.body) {
          const data = await response.json()
          const reply = data.reply ?? data.message ?? data.content ?? ''
          if (!reply.trim()) throw Object.assign(new Error('Empty reply'), { status: 502 })
          onToken(reply)
          return reply
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let reply = ''

        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          reply += chunk
          onToken(chunk)
        }

        if (!reply.trim()) throw Object.assign(new Error('Empty reply'), { status: 502 })
        return reply
      } finally {
        signal?.removeEventListener('abort', onAbort)
      }
    },
  }
}
