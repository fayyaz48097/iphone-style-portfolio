import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { ArrowUpIcon } from '@/components/icons'
import { glass } from '@/components/ui/glass'
import { Reveal } from '@/components/ui/Reveal'
import { CHAT_HANDOFF_DELAY_MS, CHAT_REPLY_TYPING_MS, chatGreeting, liveChatCopy } from '@/data/contact'
import { profile } from '@/data/profile'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/cn'
import { mailto, navigateTo } from '@/lib/links'
import { useIsland } from '@/providers/island/island-context'
import { CHAT_LIMITS } from '@/services/chat/chatService'
import { EmailCapture } from './EmailCapture'
import { useChatScript } from './useChatScript'
import { LIVE_STATUS, NO_REPLY_PROMPT_MS, useLiveChat } from './useLiveChat'

function TypingIndicator() {
  return (
    <div className="typing-indicator" aria-label={`${profile.firstName} is typing`}>
      <i className="typing-indicator__dot" />
      <i className="typing-indicator__dot" />
      <i className="typing-indicator__dot" />
    </div>
  )
}

/** Header status line: who's there and what to expect. */
function presenceLine(chat) {
  if (chat.status === LIVE_STATUS.unavailable) return { tone: 'muted', text: liveChatCopy.fallbackStatus }
  if (chat.status !== LIVE_STATUS.live) return { tone: 'muted', text: liveChatCopy.connecting }
  if (chat.adminAvailable) return { tone: 'online', text: liveChatCopy.online }
  if (chat.adminPresence?.state === 'online' && chat.adminPresence?.status === 'busy') {
    return { tone: 'busy', text: liveChatCopy.busy }
  }
  return { tone: 'away', text: liveChatCopy.away }
}

/**
 * True once an "available" admin has left the visitor's latest message unanswered
 * for NO_REPLY_PROMPT_MS. Re-renders exactly when that moment arrives.
 */
function useNoReplyTimeout(lastVisitorAt, waiting) {
  const [expiredFor, setExpiredFor] = useState(null)

  useEffect(() => {
    if (!waiting || !lastVisitorAt) return undefined
    const remaining = lastVisitorAt + NO_REPLY_PROMPT_MS - Date.now()
    const timer = window.setTimeout(() => setExpiredFor(lastVisitorAt), Math.max(0, remaining))
    return () => window.clearTimeout(timer)
  }, [lastVisitorAt, waiting])

  return waiting && expiredFor === lastVisitorAt
}

/**
 * iMessage-style live chat backed by the Firebase Realtime Database.
 * Falls back to handing the message to the visitor's email app if Firebase is unavailable.
 */
export function ChatWindow() {
  const inputId = useId()
  const chatRef = useRef(null)
  const bodyRef = useRef(null)
  const greeted = useRef(false)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  const { notify } = useIsland()
  const script = useChatScript()
  const inView = useInView(chatRef, { threshold: 0.4 })
  const chat = useLiveChat({ inView, notify })

  // the scripted greeting plays once, the first time the chat is seen
  useEffect(() => {
    if (!inView || greeted.current) return
    greeted.current = true
    script.play(chatGreeting)
  }, [inView, script])

  // keep the newest message in view
  useLayoutEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [chat.messages.length, script.messages.length, script.typing])

  const lastMessage = chat.messages.at(-1)
  const lastVisitor = chat.messages.findLast((message) => message.from === 'visitor')
  const waitingForReply = lastMessage?.from === 'visitor'
  const noReplyYet = useNoReplyTimeout(lastVisitor?.at, waitingForReply && chat.adminAvailable)

  const showAwayNote = chat.live && waitingForReply && !chat.adminAvailable
  const showBusyNote = chat.live && noReplyYet
  const askForEmail = (showAwayNote || showBusyNote) && !chat.email
  const status = presenceLine(chat)

  const fallbackSend = (text) => {
    script.send(text)
    script.reply(
      <>
        {liveChatCopy.fallbackReply} <a href={mailto(profile.email)}>{profile.email}</a>
      </>,
      CHAT_REPLY_TYPING_MS,
      () =>
        script.schedule(
          () => navigateTo(mailto(profile.email, { subject: profile.messageSubject, body: text })),
          CHAT_HANDOFF_DELAY_MS,
        ),
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || sending) return

    if (chat.status === LIVE_STATUS.unavailable) {
      setDraft('')
      fallbackSend(text)
      return
    }

    setSending(true)
    try {
      const sent = await chat.send(text)
      if (sent) setDraft('')
      else fallbackSend(text)
    } catch (error) {
      console.warn('[chat] send failed', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <Reveal ref={chatRef} className={cn(glass(), 'chat')}>
      <div className="chat__header">
        <span className="chat__avatar-wrap">
          <img className="chat__avatar" src={profile.avatar} alt="" />
          {status.tone === 'online' ? <span className="chat__presence-dot" aria-hidden="true" /> : null}
        </span>
        <b className="chat__name">{profile.name}</b>
        <span className={`chat__status chat__status--${status.tone}`} aria-live="polite">
          {status.text}
        </span>
      </div>

      {chat.live && !chat.messages.length ? (
        <div className="chat__hint">
          <p>{liveChatCopy.hint}</p>
          <EmailCapture email={chat.email} onSave={chat.saveEmail} />
        </div>
      ) : null}

      <div ref={bodyRef} className="chat__body" aria-live="polite">
        <div className="chat__stamp">Today</div>

        {script.messages.map(({ id, from, content }) => (
          <div key={`intro-${id}`} className={`chat-bubble chat-bubble--${from}`}>
            {content}
          </div>
        ))}
        {script.typing ? <TypingIndicator /> : null}

        {chat.messages.map((message) => (
          <div
            key={message.id}
            className={cn('chat-bubble', message.from === 'visitor' ? 'chat-bubble--outgoing' : 'chat-bubble--incoming')}
          >
            {message.text}
          </div>
        ))}

        {lastMessage?.from === 'visitor' ? (
          <span className="chat__receipt">{chat.meta?.unreadForAdmin === 0 ? 'Read' : 'Delivered'}</span>
        ) : null}

        {showAwayNote ? <div className="chat-note">{liveChatCopy.awayNote}</div> : null}
        {showBusyNote ? <div className="chat-note">{liveChatCopy.busyNote}</div> : null}
        {askForEmail ? (
          <EmailCapture variant="card" email={chat.email} onSave={chat.saveEmail} prompt={liveChatCopy.emailPrompt} />
        ) : null}
        {chat.email && (showAwayNote || showBusyNote) ? (
          <EmailCapture variant="card" email={chat.email} onSave={chat.saveEmail} />
        ) : null}
      </div>

      <form className="chat-composer" autoComplete="off" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor={inputId}>
          Your message to {profile.firstName}
        </label>
        <input
          id={inputId}
          className="chat-composer__input"
          placeholder={chat.status === LIVE_STATUS.unavailable ? 'Message (opens your email app)' : 'Message'}
          maxLength={CHAT_LIMITS.message}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="submit"
          className="chat-composer__send"
          aria-label="Send message"
          disabled={!draft.trim() || sending}
        >
          <ArrowUpIcon />
        </button>
      </form>
    </Reveal>
  )
}
