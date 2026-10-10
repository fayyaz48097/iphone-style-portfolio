import { useEventListener } from './useEventListener'

const root = () => document.documentElement

/** Rotates the glass specular rim (--la) so it faces the pointer. */
export function usePointerLightAngle() {
  useEventListener(
    'pointermove',
    (event) => {
      const angle =
        (Math.atan2(event.clientY - window.innerHeight / 2, event.clientX - window.innerWidth / 2) * 180) / Math.PI + 90
      root().style.setProperty('--la', `${angle}deg`)
    },
    window,
    { passive: true },
  )
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
