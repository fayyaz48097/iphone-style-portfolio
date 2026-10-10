import { getIdToken } from '@/services/firebase'

/**
 * Calls a chat function in /api (Vercel serverless) with the caller's Firebase ID token,
 * so the server can verify who is asking. Email credentials live only on the server.
 */
async function callChatApi(endpoint, body) {
  const token = await getIdToken()
  const response = await fetch(`/api/chat/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error ?? `Chat API ${endpoint} failed (${response.status})`)
  return data
}

/** Emails Fayyaz about a new visitor message (throttled server-side). Never throws. */
export function notifyNewMessage(chatId) {
  return callChatApi('notify', { chatId }).catch(() => null)
}

/**
 * Emails the visitor the admin's latest reply with a "Continue the chat" link,
 * when they're offline and left an email.
 * @returns {Promise<{ emailed: boolean, reason?: string }>}
 */
export function emailReplyToVisitor(chatId) {
  return callChatApi('reply', { chatId })
}
