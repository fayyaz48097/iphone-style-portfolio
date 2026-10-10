import { useEffect, useId, useRef, useState } from 'react'
import { ArrowUpIcon } from '@/components/icons'
import { glass } from '@/components/ui/glass'
import { Reveal } from '@/components/ui/Reveal'
import { CHAT_HANDOFF_DELAY_MS, CHAT_REPLY_TYPING_MS, chatGreeting } from '@/data/contact'
import { profile } from '@/data/profile'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/cn'
import { mailto, navigateTo } from '@/lib/links'
import { useChatScript } from './useChatScript'

const MAX_LENGTH = 600

function TypingIndicator() {
  return (
    <div className="typing-indicator" aria-label={`${profile.firstName} is typing`}>
      <i className="typing-indicator__dot" />
      <i className="typing-indicator__dot" />
      <i className="typing-indicator__dot" />
    </div>
  )
}

/**
 * iMessage-style chat. Greets the visitor when it scrolls into view, then hands
 * the visitor's message off to their email app.
 */
export function ChatWindow() {
  const inputId = useId()
  const chatRef = useRef(null)
  const started = useRef(false)
  const [draft, setDraft] = useState('')
  const { messages, typing, send, reply, play, schedule } = useChatScript()
  const inView = useInView(chatRef, { threshold: 0.4, once: true })

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    play(chatGreeting)
  }, [inView, play])

  const handleSubmit = (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return

    send(text)
    setDraft('')
    reply(
      <>
        Love it. Opening your email app so this reaches me directly. You can also write to{' '}
        <a href={mailto(profile.email)}>{profile.email}</a>
      </>,
      CHAT_REPLY_TYPING_MS,
      () =>
        schedule(
          () => navigateTo(mailto(profile.email, { subject: profile.messageSubject, body: text })),
          CHAT_HANDOFF_DELAY_MS,
        ),
    )
  }

  return (
    <Reveal ref={chatRef} className={cn(glass(), 'chat')}>
      <div className="chat__header">
        <img className="chat__avatar" src={profile.avatar} alt="" />
        <b className="chat__name">{profile.name}</b>
      </div>

      <div className="chat__body" aria-live="polite">
        <div className="chat__stamp">Today</div>
        {messages.map(({ id, from, content }) => (
          <div key={id} className={`chat-bubble chat-bubble--${from}`}>
            {content}
          </div>
        ))}
        {typing ? <TypingIndicator /> : null}
      </div>

      <form className="chat-composer" autoComplete="off" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor={inputId}>
          Your message to {profile.firstName}
        </label>
        <input
          id={inputId}
          className="chat-composer__input"
          placeholder="Message"
          maxLength={MAX_LENGTH}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" className="chat-composer__send" aria-label="Send message" disabled={!draft.trim()}>
          <ArrowUpIcon />
        </button>
      </form>
    </Reveal>
  )
}
