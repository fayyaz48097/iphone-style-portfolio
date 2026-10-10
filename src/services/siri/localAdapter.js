import { wait } from '@/lib/async'
import { randomBetween } from '@/lib/math'
import { answerFor } from './knowledge'
import { streamText } from './streamText'

/**
 * Offline adapter: answers from the portfolio data with a short "thinking" pause
 * and a word-by-word stream, so the UI behaves exactly as it will with a real model.
 *
 * @type {(options?: { thinkingMs?: [number, number] }) => import('./index').SiriAdapter}
 */
export function createLocalAdapter({ thinkingMs = [450, 950] } = {}) {
  return {
    name: 'local',

    async ask({ messages, signal, onToken, instant }) {
      const question = messages.findLast((message) => message.role === 'user')?.content ?? ''
      const answer = answerFor(question)

      if (!instant) await wait(randomBetween(...thinkingMs), signal)
      return streamText(answer, onToken, { signal, instant })
    },
  }
}
