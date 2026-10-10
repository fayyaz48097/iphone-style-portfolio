import { cn } from '@/lib/cn'

/**
 * Apple Intelligence screen-edge glow: a rainbow rim rotating around the viewport,
 * with soft light bleeding in from the edges. Its speed follows the Siri status.
 */
export function SiriEdgeGlow({ active, state }) {
  return (
    <div className={cn('siri-glow', active && 'siri-glow--active')} data-state={state} aria-hidden="true">
      <span className="siri-glow__haze" />
      <span className="siri-glow__ring">
        <span className="siri-glow__spinner" />
      </span>
    </div>
  )
}
