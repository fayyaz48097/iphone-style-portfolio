import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useEventListener } from '@/hooks/useEventListener'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { setAdminPresence } from '@/services/chat/chatService'
import { onConnectionChange, setConnected } from '@/services/firebase'

/** Minutes without any activity on the admin screen (here or after switching away) before "away". */
export const IDLE_AFTER_MS = 5 * 60_000
const CHECK_EVERY_MS = 15_000

export const ADMIN_STATUSES = [
  { id: 'available', label: 'Available' },
  { id: 'busy', label: 'Busy' },
  { id: 'away', label: 'Away' },
]

/**
 * Publishes the admin's presence for visitors:
 *  - state "online": signed in on the admin screen and active within the last 5 minutes.
 *    Switching to another tab or app does NOT change it straight away; the 5 minutes
 *    start counting from the moment you leave.
 *  - state "away": no activity for 5 minutes (still connected).
 *  - state "offline": set by the Firebase server when the tab closes or the connection drops.
 *  - status: the manual Available / Busy / Away switch.
 */
export function useAdminPresence(enabled) {
  const [status, setStatus] = useLocalStorage('fa:admin-status', 'available')
  const [state, setState] = useState('online')
  const [openedAt] = useState(() => Date.now())
  const lastActivity = useRef(openedAt)

  const evaluate = () => {
    setState(Date.now() - lastActivity.current > IDLE_AFTER_MS ? 'away' : 'online')
  }

  const markActive = () => {
    lastActivity.current = Date.now()
    setState('online') // React skips the render when it already is
  }

  useEventListener('pointermove', markActive, window, { passive: true, enabled })
  useEventListener('pointerdown', markActive, window, { passive: true, enabled })
  useEventListener('keydown', markActive, window, { enabled })
  useEventListener('focus', markActive, window, { enabled })
  useEventListener(
    'visibilitychange',
    // leaving counts as your last activity (the 5-minute countdown starts now); coming back is activity
    markActive,
    document,
    { enabled },
  )

  useEffect(() => {
    if (!enabled) return undefined
    const timer = window.setInterval(evaluate, CHECK_EVERY_MS)
    return () => window.clearInterval(timer)
  }, [enabled])

  const publish = useEffectEvent(() => {
    setAdminPresence({ state, status, lastActiveAt: lastActivity.current }).catch((error) =>
      console.warn('[admin] presence update failed', error),
    )
  })

  useEffect(() => {
    if (enabled) publish()
  }, [enabled, state, status])

  // after a reconnect the server forgot our onDisconnect handler: register it again
  useEffect(() => {
    if (!enabled) return undefined
    setConnected(true)
    return onConnectionChange((connected) => {
      if (connected) publish()
    })
  }, [enabled])

  return { status, setStatus, state }
}
