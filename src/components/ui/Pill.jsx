import { cn } from '@/lib/cn'
import { externalLinkProps } from '@/lib/links'
import './Pill.css'

/**
 * App Store style capsule. Renders a link when `href` is given, a button with `onClick`,
 * otherwise a static label.
 *
 * @param {object} props
 * @param {'default'|'soft'} [props.variant='default']
 */
export function Pill({ href, onClick, variant = 'default', className, children, ...props }) {
  const classes = cn('pill', variant === 'soft' && 'pill--soft', className)

  if (href) {
    return (
      <a href={href} className={classes} {...externalLinkProps(href)} {...props}>
        {children}
      </a>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes} {...props}>
        {children}
      </button>
    )
  }

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  )
}
