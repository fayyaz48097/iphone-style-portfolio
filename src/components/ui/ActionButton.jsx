import { cn } from '@/lib/cn'
import { externalLinkProps } from '@/lib/links'
import { glass } from './glass'
import './ActionButton.css'

/**
 * Capsule call-to-action. Renders an anchor when `href` is set, otherwise a button.
 *
 * @param {object} props
 * @param {'primary'|'glass'} [props.variant='glass']
 */
export function ActionButton({ href, variant = 'glass', className, children, ...props }) {
  const classes = cn('action-button', variant === 'primary' ? 'action-button--primary' : glass(), className)

  if (href) {
    return (
      <a href={href} className={classes} {...externalLinkProps(href)} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
