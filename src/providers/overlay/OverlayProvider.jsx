import { useCallback, useEffect, useMemo, useState } from 'react'
import { useEventListener } from '@/hooks/useEventListener'
import { OverlayActionsContext, OverlayStateContext } from './overlay-context'

export function OverlayProvider({ children }) {
  const [active, setActive] = useState(null)

  const open = useCallback((name) => setActive(name), [])
  const close = useCallback(() => setActive(null), [])
  const toggle = useCallback((name) => setActive((current) => (current === name ? null : name)), [])

  useEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape') close()
    },
    document,
    { enabled: active !== null },
  )

  // lets CSS pause background work (the drifting wallpaper) while an overlay covers the page
  useEffect(() => {
    document.documentElement.classList.toggle('has-overlay', active !== null)
  }, [active])

  const actions = useMemo(() => ({ open, close, toggle }), [open, close, toggle])
  const state = useMemo(() => ({ active, isOpen: (name) => active === name }), [active])

  return (
    <OverlayActionsContext value={actions}>
      <OverlayStateContext value={state}>{children}</OverlayStateContext>
    </OverlayActionsContext>
  )
}
