import { useCallback, useEffect, useMemo, useRef } from 'react'

/**
 * setTimeout that is cleaned up automatically when the component unmounts.
 *
 * @example const { schedule } = useTimers(); schedule(() => setOpen(false), 2000)
 */
export function useTimers() {
  const timers = useRef(new Set())

  const clearAll = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current.clear()
  }, [])

  const schedule = useCallback((callback, delay = 0) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id)
      callback()
    }, delay)
    timers.current.add(id)
    return id
  }, [])

  const cancel = useCallback((id) => {
    window.clearTimeout(id)
    timers.current.delete(id)
  }, [])

  useEffect(() => clearAll, [clearAll])

  return useMemo(() => ({ schedule, cancel, clearAll }), [schedule, cancel, clearAll])
}
