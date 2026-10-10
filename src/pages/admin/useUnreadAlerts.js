import { useEffect, useRef } from 'react'

const BASE_TITLE = 'Messages · Admin'

/**
 * Background alerts for the admin tab: "(3) Messages" in the tab title, and a
 * system notification when a new visitor message arrives while the tab is hidden.
 */
export function useUnreadAlerts(chats) {
  const previous = useRef(null)
  const total = chats.reduce((sum, chat) => sum + (chat.meta.unreadForAdmin ?? 0), 0)

  useEffect(() => {
    document.title = total ? `(${total}) ${BASE_TITLE}` : BASE_TITLE
  }, [total])

  useEffect(() => {
    const before = previous.current
    previous.current = total
    if (before === null || total <= before || !document.hidden) return
    if (!('Notification' in window) || Notification.permission !== 'granted') return

    const latest = chats.find((chat) => chat.meta.unreadForAdmin)
    new Notification('New chat message', {
      body: latest?.meta.lastMessage?.text ?? 'A visitor wrote to you',
      icon: '/icons/icon-192.png',
      tag: 'portfolio-chat',
    })
  }, [total, chats])

  useEffect(() => () => (document.title = BASE_TITLE), [])
}
