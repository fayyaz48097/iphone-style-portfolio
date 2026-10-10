import { useEffect, useState } from 'react'
import { Seo } from '@/components/seo/Seo'
import { SiriLoader } from '@/components/system/Siri/SiriLoader'
import { cn } from '@/lib/cn'
import { subscribeChatList, subscribeVisitorsPresence } from '@/services/chat/chatService'
import { signOutUser } from '@/services/firebase'
import { Conversation } from './Conversation'
import { ConversationList } from './ConversationList'
import { ADMIN_STATUSES, useAdminPresence } from './useAdminPresence'
import { useUnreadAlerts } from './useUnreadAlerts'

const initialChatId = () => new URLSearchParams(window.location.search).get('chat')

/** Remembers the open conversation in the URL (?chat=…), e.g. from the email alert link. */
function selectInUrl(chatId) {
  const url = new URL(window.location.href)
  if (chatId) url.searchParams.set('chat', chatId)
  else url.searchParams.delete('chat')
  window.history.replaceState(null, '', url)
}

/** iMessage-for-Mac style inbox: conversations on the left, the thread on the right. */
export function AdminInbox({ user }) {
  const [loadedChats, setLoadedChats] = useState(null) // null until the first snapshot arrives
  const [presence, setPresence] = useState({})
  const [selectedId, setSelectedId] = useState(initialChatId)
  const [error, setError] = useState(null)
  const [permission, setPermission] = useState(() => ('Notification' in window ? Notification.permission : 'unsupported'))

  const chats = loadedChats ?? []
  const { status, setStatus, state } = useAdminPresence(true)
  const { title } = useUnreadAlerts(chats)

  useEffect(() => subscribeChatList(setLoadedChats, setError), [])
  useEffect(() => subscribeVisitorsPresence(setPresence), [])

  const select = (chatId) => {
    setSelectedId(chatId)
    selectInUrl(chatId)
  }

  const selected = chats.find((chat) => chat.id === selectedId) ?? null

  return (
    <div className={cn('admin-window', selected && 'admin-window--thread-open')}>
      <Seo title={title} noIndex />
      <header className="admin-window__bar">
        <span className="admin-window__lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <b className="admin-window__title">Messages</b>

        <div className="admin-status" role="radiogroup" aria-label="Your availability">
          {ADMIN_STATUSES.map((option) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={status === option.id}
              className={cn('admin-status__option', `admin-status__option--${option.id}`, status === option.id && 'is-active')}
              onClick={() => setStatus(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <span className={cn('admin-window__state', `admin-window__state--${state}`)}>
          {state === 'online' ? 'Active' : 'Idle'}
        </span>

        {permission === 'default' ? (
          <button
            type="button"
            className="admin-window__link"
            onClick={() => Notification.requestPermission().then(setPermission)}
          >
            Enable alerts
          </button>
        ) : null}

        <button type="button" className="admin-window__link" onClick={signOutUser} title={user.email ?? ''}>
          Sign out
        </button>
      </header>

      <div className="admin-window__body">
        <aside className="admin-window__sidebar">
          {error ? <p className="admin-error">Couldn’t load conversations: {error.message}</p> : null}
          {loadedChats === null && !error ? (
            <SiriLoader label="Loading conversations" size="md" />
          ) : (
            <ConversationList chats={chats} presence={presence} selectedId={selectedId} onSelect={select} />
          )}
        </aside>

        <main className="admin-window__main">
          {selected ? (
            <Conversation
              key={selected.id}
              chat={selected}
              online={presence[selected.id]?.online === true}
              adminUid={user.uid}
              onBack={() => select(null)}
            />
          ) : (
            <div className="admin-placeholder">
              <p>Select a conversation</p>
              <small>
                Visitors see you as <b>{status === 'available' && state === 'online' ? 'online' : 'away'}</b>.
              </small>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
