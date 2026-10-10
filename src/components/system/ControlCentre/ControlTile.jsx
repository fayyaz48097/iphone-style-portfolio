import { glass } from '@/components/ui/glass'
import { cn } from '@/lib/cn'

/**
 * Control Centre button. Round tiles show an icon; wide tiles show a title and caption.
 *
 * @param {object} props
 * @param {'round'|'wide'} [props.shape='round']
 * @param {boolean} [props.active]  filled blue "on" state (also sets aria-pressed when `toggle`)
 * @param {boolean} [props.toggle]  true for on/off switches
 */
export function ControlTile({ shape = 'round', active = false, toggle = false, title, caption, children, className, ...props }) {
  return (
    <button
      type="button"
      className={cn(glass(), 'cc-tile', `cc-tile--${shape}`, active && 'cc-tile--active', className)}
      aria-pressed={toggle ? active : undefined}
      {...props}
    >
      {children}
      {title ? <b className="cc-tile__title">{title}</b> : null}
      {caption ? <small className="cc-tile__caption">{caption}</small> : null}
    </button>
  )
}
