import { useEffect, useRef } from 'react'
import { useEventListener } from './useEventListener'

const root = () => document.documentElement

/** Degrees the pointer angle must move before the rim is repainted. */
const ANGLE_STEP = 3

/**
 * Rotates the glass specular rim (--la) so it faces the pointer.
 * --la lives on :root, so every write restyles all glass surfaces: updates are
 * batched to one per frame and skipped unless the angle moved by ANGLE_STEP.
 */
export function usePointerLightAngle() {
  const frame = useRef(0)
  const pointer = useRef(null)
  const lastAngle = useRef(null)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const apply = () => {
    frame.current = 0
    const { x, y } = pointer.current
    const angle = (Math.atan2(y - window.innerHeight / 2, x - window.innerWidth / 2) * 180) / Math.PI + 90
    const stepped = Math.round(angle / ANGLE_STEP) * ANGLE_STEP
    if (stepped === lastAngle.current) return
    lastAngle.current = stepped
    root().style.setProperty('--la', `${stepped}deg`)
  }

  useEventListener(
    'pointermove',
    (event) => {
      // a finger has no hover position; restyling every glass surface mid-swipe only costs frames
      if (event.pointerType === 'touch') return
      pointer.current = { x: event.clientX, y: event.clientY }
      if (!frame.current) frame.current = requestAnimationFrame(apply)
    },
    window,
    { passive: true },
  )
}

const ACTIVITY_EVENTS = ['pointermove', 'pointerdown', 'keydown', 'wheel', 'scroll', 'touchstart']

/**
 * Adds `is-idle` to <html> after `delay` ms without any interaction, removing it on the
 * next one. The wallpaper drift pauses while idle (see Wallpaper.css), so the GPU can rest.
 * One timer at most: activity only records a timestamp, the timer re-checks it.
 */
export function usePauseWhenIdle(delay = 8000) {
  useEffect(() => {
    let lastActivity = performance.now()
    let timer = 0

    const check = () => {
      const quietFor = performance.now() - lastActivity
      if (quietFor >= delay) {
        timer = 0
        root().classList.add('is-idle')
      } else {
        timer = window.setTimeout(check, delay - quietFor)
      }
    }

    const onActivity = () => {
      lastActivity = performance.now()
      if (!timer) {
        root().classList.remove('is-idle')
        timer = window.setTimeout(check, delay)
      }
    }

    timer = window.setTimeout(check, delay)
    for (const type of ACTIVITY_EVENTS) window.addEventListener(type, onActivity, { passive: true })

    return () => {
      window.clearTimeout(timer)
      for (const type of ACTIVITY_EVENTS) window.removeEventListener(type, onActivity)
      root().classList.remove('is-idle')
    }
  }, [delay])
}

/** Pauses every CSS animation while the tab is hidden, to save battery. */
export function usePauseWhenHidden() {
  useEventListener(
    'visibilitychange',
    () => {
      root().classList.toggle('is-paused', document.hidden)
    },
    document,
  )
}
