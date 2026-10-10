import { config } from '@/config/env'
import { createFallbackAdapter } from './fallbackAdapter'
import { createHttpAdapter } from './httpAdapter'
import { createLocalAdapter } from './localAdapter'

/**
 * The contract every Siri "brain" implements. Swap adapters without touching the UI.
 *
 * @typedef {{ role: 'user' | 'assistant', content: string }} SiriMessage
 *
 * @typedef {object} SiriAdapter
 * @property {string} name  'local' | 'remote' | anything descriptive
 * @property {(request: {
 *   messages: SiriMessage[],
 *   signal: AbortSignal,
 *   onToken: (token: string) => void,
 *   instant?: boolean,
 * }) => Promise<string>} ask  streams tokens through onToken, resolves with the full reply
 */

/**
 * Picks the brain from configuration:
 *  - VITE_SIRI_API_URL set (e.g. /api/siri/chat, Gemini on the server) -> the AI answers,
 *    and the offline keyword Siri takes over whenever the AI fails or hits its quota
 *  - not set -> the offline keyword Siri only
 *
 * @returns {SiriAdapter}
 */
export function createSiriClient({ apiUrl = config.siriApiUrl } = {}) {
  const offline = createLocalAdapter()
  return apiUrl ? createFallbackAdapter(createHttpAdapter({ url: apiUrl }), offline) : offline
}

export const siriClient = createSiriClient()
