import { useRef, useState } from 'react'
import { CopyIcon, MoonIcon, TerminalIcon, WaveIcon } from '@/components/icons'
import { OVERLAYS } from '@/constants'
import { profile } from '@/data/profile'
import { useAppActions } from '@/hooks/useAppActions'
import { useDialogFocus } from '@/hooks/useDialogFocus'
import { cn } from '@/lib/cn'
import { useOverlay } from '@/providers/overlay/overlay-context'
import { useSettings } from '@/providers/settings/settings-context'
import { ControlTile } from './ControlTile'
import { TintSlider } from './TintSlider'
import './ControlCentre.css'

/** Quick settings: glass tint, theme, motion, terminal, copy email and "hire mode". */
export function ControlCentre() {
  const { isOpen, open, close } = useOverlay()
  const { isDark, motionEnabled, tint, setTint } = useSettings()
  const actions = useAppActions()
  const [hireMode, setHireMode] = useState(false)
  const sliderRef = useRef(null)

  const visible = isOpen(OVERLAYS.controlCentre)
  useDialogFocus(visible, sliderRef)

  const handleHire = () => {
    const next = !hireMode
    setHireMode(next)
    if (next) actions.hire()
  }

  return (
    <div
      className={cn('control-centre', visible && 'control-centre--open')}
      role="dialog"
      aria-modal="true"
      aria-label="Control centre"
      aria-hidden={!visible}
      inert={!visible}
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div className="control-centre__panel">
        <TintSlider ref={sliderRef} value={tint} onChange={setTint} />

        <ControlTile
          toggle
          active={isDark}
          aria-label="Dark mode"
          onClick={(event) => actions.toggleTheme(event.currentTarget)}
        >
          <MoonIcon />
        </ControlTile>
        <ControlTile toggle active={motionEnabled} aria-label="Motion" onClick={actions.toggleMotion}>
          <WaveIcon />
        </ControlTile>
        <ControlTile aria-label="Terminal" onClick={() => open(OVERLAYS.terminal)}>
          <TerminalIcon />
        </ControlTile>
        <ControlTile aria-label="Copy email" onClick={actions.copyEmail}>
          <CopyIcon />
        </ControlTile>

        <ControlTile
          shape="wide"
          toggle
          active={hireMode}
          title="Hire mode"
          caption={hireMode ? 'Great choice. Opening email…' : `Turn on to hire ${profile.firstName}`}
          onClick={handleHire}
        />
      </div>
    </div>
  )
}
