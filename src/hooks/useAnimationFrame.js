import { useEffect, useEffectEvent } from 'react'

/** Runs `callback(time)` on every animation frame while `enabled` is true. */
export function useAnimationFrame(callback, enabled = true) {
  const onFrame = useEffectEvent(callback)

  useEffect(() => {
    if (!enabled) return undefined

    let frame = 0
    const loop = (time) => {
      onFrame(time)
      frame = requestAnimationFrame(loop)
    }

    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [enabled])
}
