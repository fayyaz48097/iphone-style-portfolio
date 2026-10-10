import { recentMessages } from '../_lib/chat.js'
import { replyEmail } from '../_lib/emailTemplates.js'
import { SERVER_TIMESTAMP, assertChatId, db, verifyIdToken } from '../_lib/firebase.js'
import { HttpError, bearerToken, handler, readJson, siteUrl } from '../_lib/http.js'
import { mailSender, sendMail } from '../_lib/mailer.js'

/**
 * POST /api/chat/reply  { chatId, force? }   (Authorization: Bearer <admin ID token>)
 *
 * Emails the visitor Fayyaz's latest reply with a "Continue the chat" link.
 * Admin only. The recipient is read from the database, never from the request,
 * so this can't be used to email arbitrary addresses.
 */
export default handler(async (req) => {
  const token = bearerToken(req)
  const { uid } = await verifyIdToken(token)
  const { chatId, force = false } = await readJson(req)
  assertChatId(chatId)

  const admin = await db(`admins/${uid}`, { token, allowDenied: true })
  if (admin !== true) throw new HttpError(403, 'Admins only')

  const [meta, key, presence, messages] = await Promise.all([
    db(`chats/${chatId}/meta`, { token }),
    db(`chatKeys/${chatId}`, { token, allowDenied: true }),
    db(`presence/visitors/${chatId}`, { token, allowDenied: true }),
    recentMessages(chatId, token, 12),
  ])

  if (!meta) throw new HttpError(404, 'Chat not found')
  if (!meta.email) return { emailed: false, reason: 'no-email' }
  if (presence?.online && !force) return { emailed: false, reason: 'visitor-online' }

  // the visitor's last message for context, then every admin reply after it
  const lastVisitorIndex = messages.findLastIndex((message) => message.from === 'visitor')
  const replies = messages.slice(lastVisitorIndex + 1).filter((message) => message.from === 'admin')
  if (!replies.length) return { emailed: false, reason: 'nothing-to-send' }
  const thread = lastVisitorIndex >= 0 ? [messages[lastVisitorIndex], ...replies] : replies

  const site = siteUrl(req)
  const continueUrl = key
    ? `${site}/?chat=${encodeURIComponent(chatId)}&key=${encodeURIComponent(key)}#contact`
    : `${site}/#contact`

  await sendMail({ to: meta.email, replyTo: mailSender().address, ...replyEmail({ messages: thread, continueUrl }) })
  await db(`chats/${chatId}/meta/lastEmailedAt`, { token, method: 'PUT', body: SERVER_TIMESTAMP })

  return { emailed: true }
})
