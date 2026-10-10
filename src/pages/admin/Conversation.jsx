import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowUpIcon, TrashIcon } from '@/components/icons'
import { useEventListener } from '@/hooks/useEventListener'
import { cn } from '@/lib/cn'
import { emailReplyToVisitor } from '@/services/chat/chatApi'
import { CHAT_LIMITS, deleteChat, markReadByAdmin, sendAdminMessage } from '@/services/chat/chatService'
import { ConfirmDialog } from './ConfirmDialog'
import { clockTime, visitorLabel } from './format'

const EMAIL_RESULT = {
  emailed: (chat) => `Emailed to ${chat.meta.email} ✓`,
  'visitor-online': () => 'Visitor is online, they see it live',
  'no-email': () => 'No email left: they’ll see it when they come back',
  'nothing-to-send': () => '',
}

/** One conversation: thread, visitor details and the reply box. */
export function Conversation({ chat, online, adminUid, onBack }) {
  const bodyRef = useRef(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [delivery, setDelivery] = useState(null) // { chatId, text }

  const unread = chat.meta.unreadForAdmin ?? 0

  // opening the chat (with the window focused) marks it read, as does coming back to the tab
  useEffect(() => {
    if (unread > 0 && document.hasFocus()) markReadByAdmin(chat.id).catch(() => {})
  }, [chat.id, unread])

  useEventListener('focus', () => {
    if (unread > 0) markReadByAdmin(chat.id).catch(() => {})
  })

  useLayoutEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [chat.id, chat.messages.length])

  const send = async (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || sending) return

    setSending(true)
    setDelivery(null)
    try {
      await sendAdminMessage({ chatId: chat.id, uid: adminUid, text })
      setDraft('')
      const result = await emailReplyToVisitor(chat.id).catch((error) => ({ emailed: false, error: error.message }))
      const message = result.error ?? (result.emailed ? EMAIL_RESULT.emailed(chat) : EMAIL_RESULT[result.reason]?.(chat))
      setDelivery({ chatId: chat.id, text: message })
    } finally {
      setSending(false)
    }
  }

  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const remove = async () => {
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteChat(chat.id)
      setConfirmingDelete(false)
      onBack?.()
    } catch (error) {
      setDeleteError(error.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <section className="admin-thread" aria-label={`Conversation with ${visitorLabel(chat)}`}>
      <header className="admin-thread__header">
        <button type="button" className="admin-thread__back" onClick={onBack} aria-label="Back to conversations">
          ‹
        </button>
        <div className="admin-thread__who">
          <b>{visitorLabel(chat)}</b>
          <small className={cn(online && 'admin-thread__online')}>
            {online ? 'Online now' : 'Offline'}
            {chat.meta.email ? ' · replies are emailed when offline' : ' · no email left'}
          </small>
        </div>
        <button type="button" className="admin-thread__delete" onClick={() => setConfirmingDelete(true)}>
          <TrashIcon />
          <span>Delete chat</span>
        </button>
      </header>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this chat?"
        message={
          <>
            The whole conversation with <b>{visitorLabel(chat)}</b> is removed for both of you, including their saved
            email. This can’t be undone.
            {deleteError ? <span className="admin-error">{deleteError}</span> : null}
          </>
        }
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={remove}
        onCancel={() => {
          setConfirmingDelete(false)
          setDeleteError(null)
        }}
      />

      <div ref={bodyRef} className="admin-thread__body">
        {chat.messages.map((message) => (
          <div
            key={message.id}
            className={cn('admin-bubble', message.from === 'admin' ? 'admin-bubble--mine' : 'admin-bubble--theirs')}
          >
            <span>{message.text}</span>
            <time>{clockTime(message.at)}</time>
          </div>
        ))}
      </div>

      {delivery?.chatId === chat.id && delivery.text ? <p className="admin-thread__delivery">{delivery.text}</p> : null}

      <form className="admin-composer" onSubmit={send}>
        <textarea
          className="admin-composer__input"
          rows={1}
          placeholder="Reply…"
          maxLength={CHAT_LIMITS.message}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) send(event)
          }}
        />
        <button type="submit" className="admin-composer__send" aria-label="Send reply" disabled={!draft.trim() || sending}>
          <ArrowUpIcon />
        </button>
      </form>
    </section>
  )
}
