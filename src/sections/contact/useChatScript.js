import { useCallback, useRef, useState } from 'react'
import { useTimers } from '@/hooks/useTimers'
import { useSettings } from '@/providers/settings/settings-context'

export const SENDER = Object.freeze({ me: 'outgoing', them: 'incoming' })

/**
 * State machine for a scripted chat: a message list plus a typing indicator.
 * Typing delays collapse to zero when motion is off.
 */
export function useChatScript() {
  const { reduceMotion } = useSettings()
  const { schedule } = useTimers()
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const nextId = useRef(0)

  const push = useCallback((from, content) => {
    nextId.current += 1
    const id = nextId.current
    setMessages((current) => [...current, { id, from, content }])
  }, [])

  /** Shows the typing indicator for `ms`, then posts an incoming message. */
  const reply = useCallback(
    (content, ms, then) => {
      setTyping(true)
      schedule(
        () => {
          setTyping(false)
          push(SENDER.them, content)
          then?.()
        },
        reduceMotion ? 0 : ms,
      )
    },
    [push, schedule, reduceMotion],
  )

  /** Plays a list of `{ text, typingMs }` incoming messages one after another. */
  const play = useCallback(
    (script) => {
      const playFrom = (index) => {
        const step = script[index]
        if (step) reply(step.text, step.typingMs, () => playFrom(index + 1))
      }
      playFrom(0)
    },
    [reply],
  )

  const send = useCallback((content) => push(SENDER.me, content), [push])

  return { messages, typing, send, reply, play, schedule }
}
