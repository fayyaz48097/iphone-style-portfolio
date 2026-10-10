import { cn } from '@/lib/cn'
import { shortTime, visitorLabel } from './format'

/** Sidebar of conversations, newest first, with unread badges and online dots. */
export function ConversationList({ chats, presence, selectedId, onSelect }) {
  if (!chats.length) {
    return (
      <div className="admin-list__empty">
        <p>No conversations yet.</p>
        <small>New chats from your portfolio appear here instantly.</small>
      </div>
    )
  }

  return (
    <ul className="admin-list" role="listbox" aria-label="Conversations">
      {chats.map((chat) => {
        const unread = chat.meta.unreadForAdmin ?? 0
        const online = presence[chat.id]?.online === true
        const preview = chat.meta.lastMessage
        return (
          <li key={chat.id} role="option" aria-selected={chat.id === selectedId}>
            <button
              type="button"
              className={cn('admin-list__item', chat.id === selectedId && 'admin-list__item--active')}
              onClick={() => onSelect(chat.id)}
            >
              <span className="admin-list__avatar" aria-hidden="true">
                {visitorLabel(chat).slice(0, 1).toUpperCase()}
                {online ? <span className="admin-list__online" /> : null}
              </span>
              <span className="admin-list__text">
                <span className="admin-list__top">
                  <b className="admin-list__name">{visitorLabel(chat)}</b>
                  <time className="admin-list__time">{shortTime(chat.meta.updatedAt)}</time>
                </span>
                <span className={cn('admin-list__preview', unread && 'admin-list__preview--unread')}>
                  {preview ? `${preview.from === 'admin' ? 'You: ' : ''}${preview.text}` : 'No messages'}
                </span>
              </span>
              {unread ? (
                <span className="admin-list__badge" aria-label={`${unread} unread`}>
                  {unread}
                </span>
              ) : null}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
