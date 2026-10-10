import { cn } from '@/lib/cn'
import './AppIcon.css'

/**
 * iOS app icon: a squircle with a gradient, a glyph and a glossy highlight.
 *
 * @param {object} props
 * @param {{ glyph: string, background: string, color?: string, fontSize?: string }} props.icon
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='xl'] 44 / 48 / 52 / 64 / 68 px
 */
export function AppIcon({ icon, size = 'xl', className, style, ...props }) {
  const { glyph, background, color, fontSize } = icon

  return (
    <span
      className={cn('app-icon', size !== 'xl' && `app-icon--${size}`, className)}
      style={{ background, color, fontSize, ...style }}
      aria-hidden="true"
      {...props}
    >
      {glyph}
    </span>
  )
}
