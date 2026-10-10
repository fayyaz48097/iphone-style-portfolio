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
 * @type {(options: { url: string, headers?: Record<string, string> }) => import('./index').SiriAdapter}
 */
export function createHttpAdapter({ url, headers = {} }) {
  return {
    name: 'remote',

    async ask({ messages, signal, onToken }) {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ messages }),
        signal,
      })

      if (!response.ok) throw new Error(`Siri API responded with ${response.status}`)

      const contentType = response.headers.get('content-type') ?? ''
      if (contentType.includes('application/json') || !response.body) {
        const data = await response.json()
        const reply = data.reply ?? data.message ?? data.content ?? ''
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

      return reply
    },
  }
}
