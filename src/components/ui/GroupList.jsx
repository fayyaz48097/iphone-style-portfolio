import { cn } from '@/lib/cn'
import { AppIcon } from './AppIcon'
import { glass } from './glass'
import { Reveal } from './Reveal'
import './GroupList.css'

/** Glass grouped list container. Children should be <GroupListItem>s. */
export function GroupList({ className, children, ...props }) {
  return (
    <Reveal as="ul" className={cn(glass(), 'group-list', className)} {...props}>
      {children}
    </Reveal>
  )
}

/**
 * One row: icon, title + subtitle, and a trailing accessory.
 * Pass `value` for right-aligned text, `accessory` for any node, or neither for a chevron.
 */
export function GroupListItem({ icon, title, subtitle, value, accessory }) {
  let trailing = accessory
  if (trailing === undefined) {
    trailing = value ? (
      <span className="group-list__value">{value}</span>
    ) : (
      <span className="group-list__chevron" aria-hidden="true">
        ›
      </span>
    )
  }

  return (
    <li className="group-list__item">
      {icon ? <AppIcon icon={icon} size="md" /> : null}
      <div className="group-list__text">
        <b className="group-list__title">{title}</b>
        {subtitle ? <small className="group-list__subtitle">{subtitle}</small> : null}
      </div>
      {trailing}
    </li>
  )
}
