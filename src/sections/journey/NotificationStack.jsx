import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { AppIcon } from '@/components/ui/AppIcon'
import { glass } from '@/components/ui/glass'
import { Reveal } from '@/components/ui/Reveal'
import { useEventListener } from '@/hooks/useEventListener'
import { cn } from '@/lib/cn'
import { layoutStack } from './stackLayout'

function NotificationCard({ item }) {
  return (
    <li className={cn(glass(), 'notification-card')}>
      <AppIcon icon={item.icon} size="xs" />
      <div className="notification-card__inner">
        <header className="notification-card__header">
          <b className="notification-card__app">{item.company}</b>
          <time className="notification-card__time">{item.period}</time>
        </header>
        <h3 className="notification-card__title">{item.role}</h3>
        <p className="notification-card__body">{item.summary}</p>
      </div>
    </li>
  )
}

/** Collapsible stack of notification cards. Tap the stack (or the toggle) to fan it out. */
export function NotificationStack({ items }) {
  const listId = useId()
  const listRef = useRef(null)
  const [collapsed, setCollapsed] = useState(true)

  const relayout = useCallback(() => layoutStack(listRef.current, collapsed), [collapsed])

  useLayoutEffect(relayout, [relayout])
  useEventListener('resize', relayout)
  useEventListener('load', relayout)

  // Card heights change when web fonts load or text reflows.
  useEffect(() => {
    const front = listRef.current?.firstElementChild
    if (!front) return undefined

    document.fonts?.ready.then(relayout)
    const observer = new ResizeObserver(relayout)
    observer.observe(front)
    return () => observer.disconnect()
  }, [relayout])

  return (
    <>
      <Reveal
        as="ol"
        ref={listRef}
        id={listId}
        className={cn('notification-stack', collapsed && 'notification-stack--collapsed')}
        onClick={() => {
          if (collapsed) setCollapsed(false)
        }}
      >
        {items.map((item) => (
          <NotificationCard key={item.id} item={item} />
        ))}
      </Reveal>

      <button
        type="button"
        className={cn(glass(), 'stack-toggle')}
        aria-controls={listId}
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((value) => !value)}
      >
        {collapsed ? 'Show all' : 'Show less'}
      </button>
    </>
  )
}
