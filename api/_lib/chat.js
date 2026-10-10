import { db } from './firebase.js'

/** The most recent messages of a chat, oldest first (REST results come back unordered). */
export async function recentMessages(chatId, token, count = 10) {
  const raw = await db(`chats/${chatId}/messages`, { token, query: { orderBy: '$key', limitToLast: count } })
  return Object.entries(raw ?? {})
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([id, message]) => ({ id, ...message }))
}

/** "Fayyaz is here right now": connected, active, and set to Available. */
export const isAdminAvailable = (presence) => presence?.state === 'online' && presence?.status === 'available'
