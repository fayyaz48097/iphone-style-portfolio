import { glass } from '@/components/ui/glass'
import { cn } from '@/lib/cn'
import { externalLinkProps } from '@/lib/links'
import { useOverlayActions } from '@/providers/overlay/overlay-context'
import './LockWidget.css'

const RING_RADIUS = 30

function ProgressRing() {
  return (
    <svg className="lock-widget__ring" viewBox="0 0 66 66" aria-hidden="true">
      <circle className="lock-widget__ring-track" cx="33" cy="33" r={RING_RADIUS} />
      <circle className="lock-widget__ring-progress" cx="33" cy="33" r={RING_RADIUS} />
    </svg>
  )
}

/**
 * One round lock-screen widget, rendered from a `lockScreenWidgets` entry.
 * type: 'link' (anchor) | 'overlay' (opens an overlay) | 'stat' | 'ring'
 */
export function LockWidget({ widget }) {
  const { open } = useOverlayActions()
  const base = cn(glass({ lens: true }), 'lock-widget')

  switch (widget.type) {
    case 'link': {
      const { href, label, Icon } = widget
      return (
        <a className={cn(base, 'lock-widget--interactive')} href={href} aria-label={label} {...externalLinkProps(href)}>
          <Icon />
        </a>
      )
    }

    case 'overlay': {
      const { overlay, label, Icon } = widget
      return (
        <button type="button" className={cn(base, 'lock-widget--interactive')} aria-label={label} onClick={() => open(overlay)}>
          <Icon />
        </button>
      )
    }

    case 'ring':
      return (
        <div className={cn(base, 'lock-widget--ring')} title={widget.title}>
          <ProgressRing />
          <b className="lock-widget__value">{widget.value}</b>
          <span className="lock-widget__caption">{widget.caption}</span>
        </div>
      )

    default:
      return (
        <div className={base}>
          <b className="lock-widget__value">{widget.value}</b>
          <span className="lock-widget__caption">{widget.caption}</span>
        </div>
      )
  }
}
