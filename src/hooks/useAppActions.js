import { useCallback, useMemo } from 'react'
import { NOTIFY_DURATION, THEMES } from '@/constants'
import { profile } from '@/data/profile'
import { centerOf } from '@/lib/browser'
import { copyToClipboard } from '@/lib/clipboard'
import { mailto, navigateTo } from '@/lib/links'
import { useConfetti } from '@/providers/confetti/confetti-context'
import { useIsland } from '@/providers/island/island-context'
import { useSettings } from '@/providers/settings/settings-context'

const HIRE_REDIRECT_DELAY = 1100

/**
 * High-level actions shared by the Control Centre, terminal and contact section.
 * Each one updates state *and* gives feedback (island notification, confetti).
 */
export function useAppActions() {
  const settings = useSettings()
  const { notify } = useIsland()
  const fireConfetti = useConfetti()

  const toggleTheme = useCallback(
    (originElement) => {
      const next = settings.toggleTheme(originElement ? centerOf(originElement) : undefined)
      const dark = next === THEMES.dark
      notify({
        icon: dark ? '🌙' : '☀️',
        title: dark ? 'Dark mode' : 'Light mode',
        subtitle: 'Appearance changed',
        duration: NOTIFY_DURATION.medium,
      })
      return next
    },
    [settings, notify],
  )

  const toggleMotion = useCallback(() => {
    const enabled = settings.toggleMotion()
    notify({
      icon: enabled ? '▶️' : '⏸',
      title: enabled ? 'Motion on' : 'Motion off',
      subtitle: enabled ? 'Animations back on' : 'Animations paused',
      duration: NOTIFY_DURATION.medium,
    })
    return enabled
  }, [settings, notify])

  const copyEmail = useCallback(async () => {
    const copied = await copyToClipboard(profile.email)
    if (copied) {
      notify({ icon: '✓', title: 'Email copied', subtitle: profile.email })
      fireConfetti(40)
    } else {
      notify({ icon: '✉️', title: 'My email', subtitle: profile.email, duration: NOTIFY_DURATION.long })
    }
  }, [notify, fireConfetti])

  const hire = useCallback(() => {
    fireConfetti(180)
    notify({ icon: '🎉', title: 'Hire mode on', subtitle: 'Let’s build something' })
    window.setTimeout(() => navigateTo(mailto(profile.email, { subject: profile.hireSubject })), HIRE_REDIRECT_DELAY)
  }, [notify, fireConfetti])

  return useMemo(
    () => ({ toggleTheme, toggleMotion, copyEmail, hire, notify, fireConfetti }),
    [toggleTheme, toggleMotion, copyEmail, hire, notify, fireConfetti],
  )
}
