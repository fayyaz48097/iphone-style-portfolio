import { SIRI_STATUS } from '@/constants'
import { cn } from '@/lib/cn'
import { SiriOrb } from './SiriOrb'
import './Siri.css'

/**
 * Loading indicator: the Siri orb in its "thinking" spin.
 * Announced to screen readers through `label`.
 */
export function SiriLoader({ label = 'Loading', size = 'lg', className }) {
  return (
    <div className={cn('siri-loader', className)} role="status" aria-live="polite">
      <SiriOrb state={SIRI_STATUS.thinking} size={size} />
      <span className="sr-only">{label}</span>
    </div>
  )
}
