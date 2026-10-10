import { cn } from '@/lib/cn'

/**
 * Apple Intelligence screen-edge glow: a rotating rainbow rim around the viewport,
 * with a blurred haze behind it. Its speed follows the Siri status.
 */
export function SiriEdgeGlow({ active, state }) {
  return (
    <div className={cn('siri-glow', active && 'siri-glow--active')} data-state={state} aria-hidden="true">
      <span className="siri-glow__haze">
        <span className="siri-glow__ring siri-glow__ring--wide" />
      </span>
      <span className="siri-glow__ring" />
    </div>
  )
}
