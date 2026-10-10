import { useCallback, useState } from 'react'
import { useTimers } from '@/hooks/useTimers'

export const DOWNLOAD_STATE = Object.freeze({ idle: 'idle', downloading: 'downloading', done: 'done' })

/**
 * Drives a download button through idle -> downloading -> done -> idle.
 * The real download starts immediately; the timings only pace the animation.
 */
export function useDownloadState({ progressMs = 900, resetMs = 2600, instant = false } = {}) {
  const [state, setState] = useState(DOWNLOAD_STATE.idle)
  const { schedule, clearAll } = useTimers()

  const start = useCallback(
    (onDone) => {
      clearAll()
      setState(DOWNLOAD_STATE.downloading)
      schedule(
        () => {
          setState(DOWNLOAD_STATE.done)
          onDone?.()
          schedule(() => setState(DOWNLOAD_STATE.idle), resetMs)
        },
        instant ? 0 : progressMs,
      )
    },
    [schedule, clearAll, progressMs, resetMs, instant],
  )

  return [state, start]
}
