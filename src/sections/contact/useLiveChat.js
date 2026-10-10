import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react'
import { SECTION_IDS } from '@/constants'
import { useEventListener } from '@/hooks/useEventListener'
import { notifyNewMessage } from '@/services/chat/chatApi'
import {
  CHAT_LIMITS,
  isAdminAvailable,
  joinChatWithKey,
  markReadByVisitor,
  openVisitorSession,
  saveVisitorEmail,
  sendVisitorMessage,
  startVisitorPresence,
  storedChatId,
  subscribeAdminPresence,
  subscribeChat,
} from '@/services/chat/chatService'
import { isFirebaseConfigured, setConnected } from '@/services/firebase'

/** Disconnect after the tab has been hidden this long (Spark plan: 100 connections). */
const HIDDEN_DISCONNECT_MS = 60_000

/** Ask for an email when an "available" admin hasn't answered within this time. */
export const NO_REPLY_PROMPT_MS = 2 * 60_000

export const LIVE_STATUS = Object.freeze({
  unavailable: 'unavailable', // Firebase not configured or failed: mailto fallback
  idle: 'idle', // not connected yet
  connecting: 'connecting',
  live: 'live',
})

/** Reads and removes ?chat=…&key=… from the "Continue the chat" email link. */
function takeResumeLink() {
  const url = new URL(window.location.href)
  const chatId = url.searchParams.get('chat')
  const key = url.searchParams.get('key')
  if (!chatId || !key) return null
  url.searchParams.delete('chat')
  url.searchParams.delete('key')
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  return { chatId, key }
}

const scrollToChat = () => document.getElementById(SECTION_IDS.contact)?.scrollIntoView({ behavior: 'smooth' })

/**
 * Visitor side of the live chat.
 *
 * @param {object} options
 * @param {boolean} options.inView           the chat window is on screen
 * @param {(n: object) => void} options.notify  Dynamic Island notifier
 */
export function useLiveChat({ inView, notify }) {
  const [status, setStatus] = useState(() => (isFirebaseConfigured() ? LIVE_STATUS.idle : LIVE_STATUS.unavailable))
  const [session, setSession] = useState(null) // { uid, chatId }
  const [messages, setMessages] = useState([])
  const [meta, setMeta] = useState(undefined) // undefined = not loaded, null = no chat yet
  const [adminPresence, setAdminPresence] = useState(null)

  const connecting = useRef(null)
  const unreadAlerted = useRef(false)

  /** Connects once; later calls reuse the same session. */
  const connect = useCallback(async (resume) => {
    if (!connecting.current) {
      connecting.current = (async () => {
        setStatus(LIVE_STATUS.connecting)
        const next = resume ? await joinChatWithKey(resume.chatId, resume.key) : await openVisitorSession()
        await setConnected(true)
        setSession(next)
        setStatus(LIVE_STATUS.live)
        return next
      })().catch((error) => {
        console.warn('[chat] live chat unavailable, falling back to email', error)
        setStatus(LIVE_STATUS.unavailable)
        connecting.current = null
        return null
      })
    }
    return connecting.current
  }, [])

  const onMount = useEffectEvent(() => {
    if (status === LIVE_STATUS.unavailable) return
    const resume = takeResumeLink()
    if (resume) {
      connect(resume).then((joined) => joined && window.setTimeout(scrollToChat, 400))
    } else if (storedChatId()) {
      // returning visitor: connect now so a waiting reply can be announced
      connect()
    }
  })

  useEffect(() => {
    onMount()
  }, [])

  // first-time visitors connect when the chat scrolls into view
  useEffect(() => {
    if (inView && status === LIVE_STATUS.idle) connect()
  }, [inView, status, connect])

  // live subscriptions for the session
  useEffect(() => {
    if (!session) return undefined
    const { chatId } = session
    const stopChat = subscribeChat(chatId, { onMessages: setMessages, onMeta: setMeta })
    const stopPresence = subscribeAdminPresence(setAdminPresence)
    startVisitorPresence(chatId).catch(() => {})
    return () => {
      stopChat()
      stopPresence()
    }
  }, [session])

  // a reply arrived while the chat is off screen: tell them via the Dynamic Island
  useEffect(() => {
    const unread = meta?.unreadForVisitor ?? 0
    if (!unread) {
      unreadAlerted.current = false
      return
    }
    if (inView || unreadAlerted.current) return
    unreadAlerted.current = true
    notify({
      icon: '💬',
      title: 'New message from Fayyaz',
      subtitle: 'Tap to open the chat',
      duration: 6000,
      onTap: scrollToChat,
    })
  }, [meta?.unreadForVisitor, inView, notify])

  // reading the chat clears the unread badge
  useEffect(() => {
    if (session && inView && meta?.unreadForVisitor > 0 && !document.hidden) {
      markReadByVisitor(session.chatId).catch(() => {})
    }
  }, [session, inView, meta?.unreadForVisitor])

  // release the connection while the tab is hidden
  const hiddenTimer = useRef(0)
  useEventListener(
    'visibilitychange',
    () => {
      if (!session) return
      window.clearTimeout(hiddenTimer.current)
      if (document.hidden) {
        hiddenTimer.current = window.setTimeout(() => setConnected(false), HIDDEN_DISCONNECT_MS)
      } else {
        setConnected(true).then(() => startVisitorPresence(session.chatId)).catch(() => {})
      }
    },
    document,
  )
  useEffect(() => () => window.clearTimeout(hiddenTimer.current), [])

  const send = useCallback(
    async (rawText) => {
      const text = rawText.trim().slice(0, CHAT_LIMITS.message)
      if (!text) return false
      const active = session ?? (await connect())
      if (!active) return false
      await sendVisitorMessage({ chatId: active.chatId, uid: active.uid, text, isNewChat: !meta })
      notifyNewMessage(active.chatId)
      return true
    },
    [session, connect, meta],
  )

  const saveEmail = useCallback(
    async (email) => {
      const active = session ?? (await connect())
      if (!active) return false
      await saveVisitorEmail(active.chatId, email)
      return true
    },
    [session, connect],
  )

  return {
    status,
    live: status === LIVE_STATUS.live,
    messages,
    meta,
    email: meta?.email ?? null,
    adminAvailable: isAdminAvailable(adminPresence),
    adminPresence,
    send,
    saveEmail,
  }
}
