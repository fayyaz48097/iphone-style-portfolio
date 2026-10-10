import { STORAGE_KEYS } from '@/constants'
import { storage } from '@/lib/storage'
import {
  ensureAnonymousUser,
  newKey,
  readOnce,
  remove,
  sentinels,
  setWithDisconnect,
  subscribe,
  update,
  write,
} from '@/services/firebase'

/*
 * Live chat on the Firebase Realtime Database. Data shape (see database.rules.json):
 *
 *   chats/{chatId}/meta           { createdAt, updatedAt, email?, lastMessage, unreadForAdmin, unreadForVisitor, ... }
 *   chats/{chatId}/messages/{id}  { from: 'visitor' | 'admin', text, at, uid }
 *   chats/{chatId}/members/{uid}  resume key, for the visitor's other devices
 *   chatKeys/{chatId}             secret resume key (owner + admin only)
 *   presence/admin                { state, status, lastActiveAt, updatedAt }
 *   presence/visitors/{chatId}    { online, lastSeenAt }
 *
 * chatId is the visitor's anonymous Firebase uid on the device that started the chat.
 */

export const CHAT_LIMITS = Object.freeze({ message: 1000, preview: 140, email: 120 })

export const PATHS = Object.freeze({
  chats: 'chats',
  chat: (chatId) => `chats/${chatId}`,
  meta: (chatId) => `chats/${chatId}/meta`,
  messages: (chatId) => `chats/${chatId}/messages`,
  member: (chatId, uid) => `chats/${chatId}/members/${uid}`,
  chatKey: (chatId) => `chatKeys/${chatId}`,
  adminPresence: 'presence/admin',
  visitorPresence: (chatId) => `presence/visitors/${chatId}`,
  visitorsPresence: 'presence/visitors',
  admin: (uid) => `admins/${uid}`,
})

/** 24 random bytes as URL-safe base64 (32 chars): unguessable resume key. */
function randomKey() {
  const bytes = crypto.getRandomValues(new Uint8Array(24))
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** RTDB returns children as an object keyed by push id; push ids sort chronologically. */
export function toMessageList(messages) {
  return Object.entries(messages ?? {})
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([id, message]) => ({ id, ...message }))
}

/* ------------------------------ visitor ------------------------------ */

/** The chat this browser belongs to (its own, or one joined through an email link). */
export function storedChatId() {
  return storage.get(STORAGE_KEYS.chat)?.chatId ?? null
}

/**
 * Signs the visitor in (anonymously, silently) and works out their chat id.
 * @returns {Promise<{ uid: string, chatId: string }>}
 */
export async function openVisitorSession() {
  const user = await ensureAnonymousUser()
  const chatId = storedChatId() ?? user.uid
  storage.set(STORAGE_KEYS.chat, { chatId })
  return { uid: user.uid, chatId }
}

/**
 * Joins an existing chat from the "Continue the chat" email link, e.g. on another device.
 * The rules accept the membership only when `key` matches the chat's secret key.
 */
export async function joinChatWithKey(chatId, key) {
  const user = await ensureAnonymousUser()
  if (user.uid !== chatId) {
    try {
      await write(PATHS.member(chatId, user.uid), key)
    } catch (error) {
      // already a member from an earlier visit: fine; anything else is a bad/expired link
      const alreadyMember = await readOnce(PATHS.meta(chatId)).then(() => true, () => false)
      if (!alreadyMember) throw error
    }
  }
  storage.set(STORAGE_KEYS.chat, { chatId })
  return { uid: user.uid, chatId }
}

/** Creates the chat's resume key once (owner only; later attempts are rejected and ignored). */
async function ensureChatKey(chatId, uid) {
  if (uid !== chatId) return
  try {
    await write(PATHS.chatKey(chatId), randomKey())
  } catch {
    // already exists
  }
}

/**
 * Sends a visitor message: the message, the conversation summary and the unread
 * counter are written together in one atomic multi-path update.
 */
export async function sendVisitorMessage({ chatId, uid, text, isNewChat }) {
  const { now, increment } = await sentinels()
  const key = await newKey(PATHS.messages(chatId))
  const meta = PATHS.meta(chatId)

  await update('/', {
    [`${PATHS.messages(chatId)}/${key}`]: { from: 'visitor', text, at: now, uid },
    [`${meta}/lastMessage`]: { text: text.slice(0, CHAT_LIMITS.preview), from: 'visitor', at: now },
    [`${meta}/lastVisitorAt`]: now,
    [`${meta}/updatedAt`]: now,
    [`${meta}/unreadForAdmin`]: increment(1),
    ...(isNewChat ? { [`${meta}/createdAt`]: now } : {}),
  })

  if (isNewChat) await ensureChatKey(chatId, uid)
}

export async function saveVisitorEmail(chatId, email) {
  const { now } = await sentinels()
  await update(PATHS.meta(chatId), { email: email.trim().toLowerCase(), updatedAt: now })
}

export const markReadByVisitor = (chatId) => write(`${PATHS.meta(chatId)}/unreadForVisitor`, 0)

/** Marks the visitor online now, and offline automatically when they disconnect. */
export async function startVisitorPresence(chatId) {
  const { now } = await sentinels()
  await setWithDisconnect(PATHS.visitorPresence(chatId), { online: true, lastSeenAt: now }, { online: false, lastSeenAt: now })
}

/* ------------------------------ shared ------------------------------ */

/**
 * Live conversation: messages and summary.
 * @returns {() => void} unsubscribe
 */
export function subscribeChat(chatId, { onMessages, onMeta, onError }) {
  const stopMessages = subscribe(PATHS.messages(chatId), (value) => onMessages(toMessageList(value)), onError)
  const stopMeta = subscribe(PATHS.meta(chatId), (value) => onMeta(value), onError)
  return () => {
    stopMessages()
    stopMeta()
  }
}

/** Live admin availability, as visitors see it. */
export function subscribeAdminPresence(callback, onError) {
  return subscribe(PATHS.adminPresence, callback, onError)
}

/** "Fayyaz is here right now": connected, active, and set to Available. */
export const isAdminAvailable = (presence) => presence?.state === 'online' && presence?.status === 'available'

/* ------------------------------ admin ------------------------------ */

export async function isAdmin(uid) {
  try {
    return (await readOnce(PATHS.admin(uid))) === true
  } catch {
    return false
  }
}

/** Every conversation, newest first. */
export function subscribeChatList(callback, onError) {
  return subscribe(
    PATHS.chats,
    (value) => {
      const chats = Object.entries(value ?? {})
        .filter(([, chat]) => chat?.meta)
        .map(([id, chat]) => ({ id, meta: chat.meta, messages: toMessageList(chat.messages) }))
        .sort((a, b) => (b.meta.updatedAt ?? 0) - (a.meta.updatedAt ?? 0))
      callback(chats)
    },
    onError,
  )
}

export function subscribeVisitorsPresence(callback, onError) {
  return subscribe(PATHS.visitorsPresence, (value) => callback(value ?? {}), onError)
}

export async function sendAdminMessage({ chatId, uid, text }) {
  const { now, increment } = await sentinels()
  const key = await newKey(PATHS.messages(chatId))
  const meta = PATHS.meta(chatId)

  await update('/', {
    [`${PATHS.messages(chatId)}/${key}`]: { from: 'admin', text, at: now, uid },
    [`${meta}/lastMessage`]: { text: text.slice(0, CHAT_LIMITS.preview), from: 'admin', at: now },
    [`${meta}/updatedAt`]: now,
    [`${meta}/unreadForVisitor`]: increment(1),
  })
}

export const markReadByAdmin = (chatId) => write(`${PATHS.meta(chatId)}/unreadForAdmin`, 0)

/**
 * Deletes a conversation: messages and summary first (this is the delete that matters),
 * then the visitor's presence entry and resume key as best-effort cleanup.
 * They're separate writes on purpose: an atomic multi-path delete fails completely
 * if any one path is refused by the rules (e.g. older published rules).
 */
export async function deleteChat(chatId) {
  await remove(PATHS.chat(chatId))
  const cleanup = await Promise.allSettled([remove(PATHS.visitorPresence(chatId)), remove(PATHS.chatKey(chatId))])
  if (cleanup.some((result) => result.status === 'rejected')) {
    console.warn('[admin] chat deleted; presence/key cleanup needs the latest database.rules.json')
  }
}

/**
 * Publishes the admin's availability; the server flips it to "offline" if the
 * admin's connection drops.
 */
export async function setAdminPresence({ state, status, lastActiveAt }) {
  const { now } = await sentinels()
  await setWithDisconnect(
    PATHS.adminPresence,
    { state, status, lastActiveAt, updatedAt: now },
    { state: 'offline', status, lastActiveAt, updatedAt: now },
  )
}
