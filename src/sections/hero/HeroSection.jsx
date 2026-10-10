import { useMemo } from 'react'
import { glass } from '@/components/ui/glass'
import { SECTION_IDS } from '@/constants'
import { lockScreenWidgets } from '@/data/hero'
import { profile } from '@/data/profile'
import { cn } from '@/lib/cn'
import { formatLockScreenDate } from '@/lib/date'
import { LockWidget } from './LockWidget'
import './HeroSection.css'

/** Name split into letters so each one can animate in on a stagger (--i). */
function ClockName({ text }) {
  return (
    <span aria-hidden="true">
      {[...text].map((char, index) => (
        <span key={index} className="lock-screen__char" style={{ '--i': index }}>
          {char}
        </span>
      ))}
    </span>
  )
}

export function HeroSection() {
  const date = useMemo(() => formatLockScreenDate() ?? profile.role, [])

  return (
    <header id={SECTION_IDS.top} className="lock-screen">
      <div className="lock-screen__content">
        <div className="lock-screen__date">{date}</div>

        <div className="lock-screen__depth">
          <h1 className="lock-screen__clock" aria-label={profile.name}>
            <ClockName text={profile.firstName} />
          </h1>
          <img
            className="lock-screen__portrait"
            src={profile.portrait}
            alt={`Portrait of ${profile.name} in a black hoodie`}
            width="460"
            height="460"
            fetchPriority="high"
          />
        </div>

        <p className={cn(glass(), 'lock-screen__tagline')}>
          {profile.tagline}
          <small>
            {profile.name}. {profile.headline}
          </small>
        </p>

        <div className="lock-screen__widgets" aria-label="Quick facts">
          {lockScreenWidgets.map((widget) => (
            <LockWidget key={widget.id} widget={widget} />
          ))}
        </div>
      </div>
    </header>
  )
}
