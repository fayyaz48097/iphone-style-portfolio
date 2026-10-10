import { config } from '@/config/env'
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
 * Picks the adapter from configuration:
 * VITE_SIRI_API_URL set -> your AI endpoint, otherwise the offline portfolio brain.
 *
 * @returns {SiriAdapter}
 */
export function createSiriClient({ apiUrl = config.siriApiUrl } = {}) {
  return apiUrl ? createHttpAdapter({ url: apiUrl }) : createLocalAdapter()
}

export const siriClient = createSiriClient()
