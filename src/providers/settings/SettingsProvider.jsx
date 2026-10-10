import { useCallback, useLayoutEffect, useMemo } from 'react'
import { flushSync } from 'react-dom'
import { DEFAULT_TINT, MEDIA_QUERIES, STORAGE_KEYS, THEMES } from '@/constants'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { SettingsContext } from './settings-context'

/** Writes the glass tint (0-100) into the CSS variables the .glass material reads. */
function applyTint(value) {
  const style = document.documentElement.style
  style.setProperty('--tint', String(value / 100))
  style.setProperty('--blur', `${(10 + (26 * value) / 100).toFixed(1)}px`)
  style.setProperty('--blur-lens', `${(4 + (20 * value) / 100).toFixed(1)}px`)
}

/** Runs a DOM update inside a circular View Transition that grows from `origin`. */
function withThemeTransition(update, origin, animate) {
  if (!animate || !document.startViewTransition) {
    update()
    return
  }

  if (origin) {
    const style = document.documentElement.style
    style.setProperty('--vx', `${origin.x}px`)
    style.setProperty('--vy', `${origin.y}px`)
  }

  document.startViewTransition(update)
}

export function SettingsProvider({ children }) {
  // null means "follow the operating system"
  const [themePreference, setThemePreference] = useLocalStorage(STORAGE_KEYS.theme, null)
  const [tint, setTint] = useLocalStorage(STORAGE_KEYS.tint, DEFAULT_TINT)
  const [motionEnabled, setMotionEnabled] = useLocalStorage(STORAGE_KEYS.motion, true)

  const systemDark = useMediaQuery(MEDIA_QUERIES.dark)
  const systemReducedMotion = useMediaQuery(MEDIA_QUERIES.reducedMotion)

  const isDark = themePreference ? themePreference === THEMES.dark : systemDark
  const reduceMotion = systemReducedMotion || !motionEnabled

  useLayoutEffect(() => {
    const root = document.documentElement
    if (themePreference) root.dataset.theme = themePreference
    else delete root.dataset.theme
  }, [themePreference])

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('motion-off', !motionEnabled)
  }, [motionEnabled])

  useLayoutEffect(() => {
    applyTint(tint)
  }, [tint])

  const toggleTheme = useCallback(
    (origin) => {
      const next = isDark ? THEMES.light : THEMES.dark
      withThemeTransition(() => flushSync(() => setThemePreference(next)), origin, !reduceMotion)
      return next
    },
    [isDark, reduceMotion, setThemePreference],
  )

  const toggleMotion = useCallback(() => {
    const next = !motionEnabled
    setMotionEnabled(next)
    return next
  }, [motionEnabled, setMotionEnabled])

  const value = useMemo(
    () => ({ isDark, toggleTheme, tint, setTint, motionEnabled, reduceMotion, toggleMotion }),
    [isDark, toggleTheme, tint, setTint, motionEnabled, reduceMotion, toggleMotion],
  )

  return <SettingsContext value={value}>{children}</SettingsContext>
}
