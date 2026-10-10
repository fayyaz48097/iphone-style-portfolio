import { isAdminAvailable, recentMessages } from '../_lib/chat.js'
import { newMessageEmail } from '../_lib/emailTemplates.js'
import { SERVER_TIMESTAMP, assertChatId, db, verifyIdToken } from '../_lib/firebase.js'
import { HttpError, bearerToken, handler, readJson, siteUrl } from '../_lib/http.js'
import { adminInbox, sendMail } from '../_lib/mailer.js'

/**
 * POST /api/chat/notify  { chatId }   (Authorization: Bearer <visitor ID token>)
 *
 * Emails Fayyaz that a visitor wrote. The visitor's own token is used for every
 * database call, so they can only trigger alerts for their own chat, and the
 * rules allow at most one alert per chat every 5 minutes.
 */
export default handler(async (req) => {
  const token = bearerToken(req)
  await verifyIdToken(token)
  const { chatId } = await readJson(req)
  assertChatId(chatId)

  // readable only by the chat's owner/members: proves the caller belongs to it
  const meta = await db(`chats/${chatId}/meta`, { token })
  if (!meta) throw new HttpError(404, 'Chat not found')

  // Fayyaz is on the admin screen right now: he'll see it live
  const presence = await db('presence/admin', { token, allowDenied: true })
  if (isAdminAvailable(presence)) return { emailed: false, reason: 'admin-online' }

  // claim the alert slot; the rules reject this within 5 minutes of the last alert
  const claimed = await db(`chats/${chatId}/meta/lastNotifiedAt`, { token, method: 'PUT', body: SERVER_TIMESTAMP, allowDenied: true })
  if (claimed === null) return { emailed: false, reason: 'throttled' }

  const messages = await recentMessages(chatId, token, 6)
  const email = newMessageEmail({
    messages,
    visitorEmail: meta.email,
    adminUrl: `${siteUrl(req)}/admin?chat=${encodeURIComponent(chatId)}`,
  })
  await sendMail({ to: adminInbox(), replyTo: meta.email || undefined, ...email })

  return { emailed: true }
})
