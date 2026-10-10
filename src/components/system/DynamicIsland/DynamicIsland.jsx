import { useEffect } from 'react'
import { NOTIFY_DURATION } from '@/constants'
import { profile } from '@/data/profile'
import { cn } from '@/lib/cn'
import { useIsland, useIslandState } from '@/providers/island/island-context'
import './DynamicIsland.css'

const WELCOME_DELAY = 1700
const WAVE_BARS = 4

/** The black pill at the top of the screen. Expands to show notifications sent via `useIsland().notify`. */
export function DynamicIsland() {
  const { open, icon, title, subtitle, onTap } = useIslandState()
  const { notify } = useIsland()

  useEffect(() => {
    const timer = window.setTimeout(
      () => notify({ title: profile.name, subtitle: 'Welcome to my portfolio', duration: NOTIFY_DURATION.default }),
      WELCOME_DELAY,
    )
    return () => window.clearTimeout(timer)
  }, [notify])

  const showStatus = (subtitleText, duration) =>
    notify({ title: profile.status.title, subtitle: subtitleText, duration })

  return (
    <button
      type="button"
      className={cn('island', open && 'island--open')}
      aria-label={`Status: ${profile.firstName} is ${profile.status.title.toLowerCase()}`}
      onClick={() => {
        if (open && onTap) onTap()
        else showStatus(profile.status.detail, 3000)
      }}
      onMouseEnter={() => {
        if (!open) showStatus(profile.status.subtitle, 2400)
      }}
    >
      <span className="island__idle">
        <img className="island__avatar" src={profile.avatar} alt="" />
        <span className="island__wave" aria-hidden="true">
          {Array.from({ length: WAVE_BARS }, (_, index) => (
            <b key={index} className="island__wave-bar" />
          ))}
        </span>
      </span>

      <span className="island__live" aria-live="polite">
        <span className="island__icon">{icon ?? <img src={profile.avatar} alt="" />}</span>
        <span>
          <strong className="island__title">{title}</strong>
          <span className="island__subtitle">{subtitle}</span>
        </span>
      </span>
    </button>
  )
}
