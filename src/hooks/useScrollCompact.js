import { useRef, useState } from 'react'
import { useEventListener } from './useEventListener'

/**
 * Returns true while the user scrolls down past `offset`, false when scrolling back up.
 * Used to minimise floating chrome (the tab bar) while reading.
 */
export function useScrollCompact({ offset = 200, tolerance = 6 } = {}) {
  const [compact, setCompact] = useState(false)
  const lastY = useRef(0)

  useEventListener(
    'scroll',
    () => {
      const y = window.scrollY
      if (Math.abs(y - lastY.current) <= tolerance) return

      setCompact(y > lastY.current && y > offset)
      lastY.current = y
    },
    window,
    { passive: true },
  )

  return compact
}
