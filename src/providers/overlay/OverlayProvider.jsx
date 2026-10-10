import { useCallback, useMemo, useState } from 'react'
import { useEventListener } from '@/hooks/useEventListener'
import { OverlayContext } from './overlay-context'

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

  const value = useMemo(
    () => ({ active, open, close, toggle, isOpen: (name) => active === name }),
    [active, open, close, toggle],
  )

  return <OverlayContext value={value}>{children}</OverlayContext>
}
