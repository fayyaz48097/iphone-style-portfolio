import { useCallback, useEffect, useRef } from 'react'

/**
 * Fires a callback when the pointer is held down for `delay` ms.
 * Spread the returned handlers onto the target element.
 */
export function useLongPress(onLongPress, { delay = 550 } = {}) {
  const timer = useRef(0)

  const cancel = useCallback(() => window.clearTimeout(timer.current), [])

  const start = useCallback(() => {
    cancel()
    timer.current = window.setTimeout(() => onLongPress?.(), delay)
  }, [cancel, delay, onLongPress])

  useEffect(() => cancel, [cancel])

  return {
    onPointerDown: start,
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
  }
}
