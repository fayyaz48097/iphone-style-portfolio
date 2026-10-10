import { useCallback, useEffect, useRef } from 'react'
import { useEventListener } from '@/hooks/useEventListener'
import { createConfetti } from '@/lib/confetti'
import { useSettings } from '../settings/settings-context'
import { ConfettiContext } from './confetti-context'

export function ConfettiProvider({ children }) {
  const canvasRef = useRef(null)
  const engine = useRef(null)
  const { reduceMotion } = useSettings()

  useEffect(() => {
    engine.current = createConfetti(canvasRef.current)
    return () => {
      engine.current.destroy()
      engine.current = null
    }
  }, [])

  useEventListener('resize', () => engine.current?.resize())

  const fire = useCallback(
    (count = 80) => {
      if (!reduceMotion) engine.current?.burst(count)
    },
    [reduceMotion],
  )

  return (
    <ConfettiContext value={fire}>
      {children}
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-[120] size-full" aria-hidden="true" />
    </ConfettiContext>
  )
}
