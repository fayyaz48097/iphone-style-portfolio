import { useCallback, useState } from 'react'
import { Section } from '@/components/layout/Section'
import { glass } from '@/components/ui/glass'
import { Reveal } from '@/components/ui/Reveal'
import { NOTIFY_DURATION, SECTION_IDS } from '@/constants'
import { HOME_SCREEN_PAGES, homeScreenApps, homeScreenDock, skillsSection } from '@/data/skills'
import { useEventListener } from '@/hooks/useEventListener'
import { cn } from '@/lib/cn'
import { useIsland } from '@/providers/island/island-context'
import { AppLauncher } from './AppLauncher'
import './SkillsSection.css'

export function SkillsSection() {
  const { notify } = useIsland()
  const [editing, setEditing] = useState(false)

  const startEditing = useCallback(() => {
    setEditing(true)
    notify({ icon: '📱', title: 'Editing home screen', subtitle: 'Just kidding. Tap anywhere to stop' })
  }, [notify])

  const openApp = useCallback(
    (app) => {
      if (editing) return
      notify({ icon: app.icon.glyph, title: app.name, subtitle: 'Part of my daily stack', duration: NOTIFY_DURATION.short })
    },
    [editing, notify],
  )

  // Like iOS: tapping anywhere outside an app leaves edit mode.
  useEventListener(
    'pointerdown',
    (event) => {
      if (!event.target.closest('.app-launcher')) setEditing(false)
    },
    document,
    { enabled: editing },
  )

  const launcher = (app, showLabel) => (
    <AppLauncher key={app.id} app={app} showLabel={showLabel} onOpen={openApp} onLongPress={startEditing} />
  )

  return (
    <Section id={SECTION_IDS.skills} heading={skillsSection}>
      <Reveal className={cn(glass(), 'home-screen', editing && 'home-screen--editing')}>
        <div className="home-screen__grid">{homeScreenApps.map((app) => launcher(app, true))}</div>

        <div className="home-screen__dots" aria-hidden="true">
          {Array.from({ length: HOME_SCREEN_PAGES }, (_, index) => (
            <i key={index} className="home-screen__dot" />
          ))}
        </div>

        <div className={cn(glass(), 'home-screen__dock')} aria-label="Tools">
          {homeScreenDock.map((app) => launcher(app, false))}
        </div>
      </Reveal>
    </Section>
  )
}
