import { wait } from '@/lib/async'
import { randomBetween } from '@/lib/math'

/**
 * Emits `text` word by word through `onToken`, like a streaming LLM response.
 * Resolves with the full text; rejects with an AbortError if `signal` aborts.
 *
 * @param {string} text
 * @param {(token: string) => void} onToken
 * @param {{ signal?: AbortSignal, minDelay?: number, maxDelay?: number, instant?: boolean }} [options]
 */
export async function streamText(text, onToken, { signal, minDelay = 14, maxDelay = 36, instant = false } = {}) {
  if (instant) {
    onToken(text)
    return text
  }

  // one token per word, carrying its trailing whitespace so line breaks survive
  for (const token of text.match(/\s*\S+\s*/g) ?? []) {
    await wait(randomBetween(minDelay, maxDelay), signal)
    onToken(token)
  }

  return text
}
