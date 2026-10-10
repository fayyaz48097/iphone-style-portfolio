import { useCallback, useLayoutEffect, useRef } from 'react'

const STRETCH_CLASS = 'tab-bar__indicator--stretching'
const STRETCH_MS = 180

/** Box of `element` relative to `container`, along the x axis. */
function horizontalBox(container, element) {
  const outer = container.getBoundingClientRect()
  const inner = element.getBoundingClientRect()
  return { left: inner.left - outer.left, right: inner.right - outer.left }
}

function place(indicator, { left, right }) {
  indicator.style.width = `${right - left}px`
  indicator.style.transform = `translateX(${left}px)`
}

/**
 * Drives the liquid tab indicator imperatively (it depends on measured layout).
 * When the active tab changes, the pill first stretches to cover both the old and
 * new tab, then springs onto the new one, like iOS 26's tab bar.
 *
 * @returns {{ indicatorRef, barRef, realign: () => void }}
 */
export function useIndicator(activeElement) {
  const barRef = useRef(null)
  const indicatorRef = useRef(null)
  const previous = useRef(null)

  const realign = useCallback(() => {
    const bar = barRef.current
    const indicator = indicatorRef.current
    if (bar && indicator && activeElement) place(indicator, horizontalBox(bar, activeElement))
  }, [activeElement])

  useLayoutEffect(() => {
    const bar = barRef.current
    const indicator = indicatorRef.current
    if (!bar || !indicator || !activeElement) return undefined

    const target = horizontalBox(bar, activeElement)
    const isFirstPlacement = previous.current === null
    previous.current = activeElement

    if (isFirstPlacement) {
      place(indicator, target)
      return undefined
    }

    const current = horizontalBox(bar, indicator)
    indicator.classList.add(STRETCH_CLASS)
    place(indicator, { left: Math.min(target.left, current.left), right: Math.max(target.right, current.right) })

    const timer = window.setTimeout(() => {
      indicator.classList.remove(STRETCH_CLASS)
      place(indicator, horizontalBox(bar, activeElement))
    }, STRETCH_MS)

    return () => window.clearTimeout(timer)
  }, [activeElement])

  return { barRef, indicatorRef, realign }
}
