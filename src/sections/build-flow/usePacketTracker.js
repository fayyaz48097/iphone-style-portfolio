import { useState } from 'react'
import { useAnimationFrame } from '@/hooks/useAnimationFrame'
import { centerOf } from '@/lib/browser'

/** How close (as a fraction of the target size) the packet must be to count as a hit. */
const HIT_X = 0.8
const HIT_Y = 0.9

/**
 * Follows a CSS-animated element (the packet) every frame and reports which
 * target it is passing over. Returns the index of that target, or -1.
 *
 * @param {{ current: HTMLElement | null }} packetRef
 * @param {{ current: (HTMLElement | null)[] }} targetRefs
 * @param {boolean} enabled  pause tracking while off screen or when motion is off
 */
export function usePacketTracker(packetRef, targetRefs, enabled) {
  const [activeIndex, setActiveIndex] = useState(-1)

  useAnimationFrame(() => {
    const packet = packetRef.current
    if (!packet) return

    const { x, y } = centerOf(packet)
    const hit = targetRefs.current.findIndex((target) => {
      if (!target) return false
      const rect = target.getBoundingClientRect()
      const center = centerOf(target)
      return Math.abs(x - center.x) < rect.width * HIT_X && Math.abs(y - center.y) < rect.height * HIT_Y
    })

    // React bails out when the value is unchanged, so this only re-renders on a step change.
    setActiveIndex(hit)
  }, enabled)

  return enabled ? activeIndex : -1
}
