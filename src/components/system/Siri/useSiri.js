import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from 'react'
import { SIRI_STATUS } from '@/constants'
import { siriContent } from '@/data/siri'
import { isAbortError } from '@/lib/async'

const INITIAL_STATE = { status: SIRI_STATUS.idle, messages: [] }

/** Status after a reply settles: stay busy only if another reply is still pending. */
const settle = (messages, fallback) => (messages.some((message) => message.pending) ? SIRI_STATUS.thinking : fallback)

function reducer(state, action) {
  switch (action.type) {
    case 'ask':
      return {
        status: SIRI_STATUS.thinking,
        messages: [
          ...state.messages,
          { id: action.questionId, role: 'user', content: action.question },
          { id: action.replyId, role: 'assistant', content: '', pending: true },
        ],
      }

    case 'token':
      return {
        status: SIRI_STATUS.responding,
        messages: state.messages.map((message) =>
          message.id === action.replyId ? { ...message, content: message.content + action.token } : message,
        ),
      }

    case 'done': {
      const messages = state.messages.map((message) =>
        message.id === action.replyId ? { ...message, pending: false } : message,
      )
      return { status: settle(messages, SIRI_STATUS.idle), messages }
    }

    case 'error': {
      const messages = state.messages.map((message) =>
        message.id === action.replyId ? { ...message, content: action.message, pending: false, error: true } : message,
      )
      return { status: settle(messages, SIRI_STATUS.error), messages }
    }

    case 'cancel': {
      // drop the reply if nothing arrived yet, otherwise keep the partial answer
      const messages = state.messages
        .filter((message) => !(message.id === action.replyId && !message.content))
        .map((message) => (message.id === action.replyId ? { ...message, pending: false } : message))
      return { status: settle(messages, SIRI_STATUS.idle), messages }
    }

    case 'reset':
      return INITIAL_STATE

    default:
      return state
  }
}

/** Conversation history in the shape adapters expect. */
const toHistory = (messages) =>
  messages.filter((message) => !message.error && message.content).map(({ role, content }) => ({ role, content }))

/**
 * Siri conversation state machine: idle -> thinking -> responding -> idle (or error).
 * Talks to any adapter that implements the SiriAdapter contract (see services/siri).
 *
 * @param {{ client: import('@/services/siri').SiriAdapter, instant?: boolean }} options
 */
export function useSiri({ client, instant = false }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)
  const controller = useRef(null)
  const nextId = useRef(0)
  const messagesRef = useRef(state.messages)

  useLayoutEffect(() => {
    messagesRef.current = state.messages
  }, [state.messages])

  const cancel = useCallback(() => {
    controller.current?.abort()
    controller.current = null
  }, [])

  /**
   * Sends a question and streams the reply into the transcript.
   * @returns {Promise<string | null>} the full reply, or null if cancelled or failed
   */
  const ask = useCallback(
    async (text) => {
      const question = text.trim()
      if (!question) return null

      cancel()
      const request = new AbortController()
      controller.current = request

      nextId.current += 2
      const questionId = nextId.current - 1
      const replyId = nextId.current
      const messages = [...toHistory(messagesRef.current), { role: 'user', content: question }]

      dispatch({ type: 'ask', question, questionId, replyId })

      try {
        const reply = await client.ask({
          messages,
          signal: request.signal,
          instant,
          onToken: (token) => dispatch({ type: 'token', replyId, token }),
        })
        dispatch({ type: 'done', replyId })
        return reply
      } catch (error) {
        if (isAbortError(error)) dispatch({ type: 'cancel', replyId })
        else dispatch({ type: 'error', replyId, message: siriContent.errorReply })
        return null
      } finally {
        if (controller.current === request) controller.current = null
      }
    },
    [client, instant, cancel],
  )

  const reset = useCallback(() => {
    cancel()
    dispatch({ type: 'reset' })
  }, [cancel])

  useEffect(() => cancel, [cancel])

  const busy = state.status === SIRI_STATUS.thinking || state.status === SIRI_STATUS.responding

  return { ...state, busy, ask, cancel, reset }
}
