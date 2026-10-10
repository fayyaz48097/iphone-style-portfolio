import { useEffect, useRef } from 'react'

export const ADMIN_TITLE = 'Messages · Admin'

/**
 * Background alerts for the admin tab: a system notification when a new visitor
 * message arrives while the tab is hidden.
 *
 * @returns {{ total: number, title: string }} unread count and the tab title, e.g. "(3) Messages · Admin"
 */
export function useUnreadAlerts(chats) {
  const previous = useRef(null)
  const total = chats.reduce((sum, chat) => sum + (chat.meta.unreadForAdmin ?? 0), 0)

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

  return { total, title: total ? `(${total}) ${ADMIN_TITLE}` : ADMIN_TITLE }
}
