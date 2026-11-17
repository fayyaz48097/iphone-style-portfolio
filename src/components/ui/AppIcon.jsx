import { cn } from '@/lib/cn'
import './AppIcon.css'

/**
 * iOS app icon: a squircle with a gradient, a glyph (or a logo image) and a glossy highlight.
 *
 * @param {object} props
 * @param {{ glyph?: string, image?: string, imageSize?: string, background: string, color?: string, fontSize?: string }} props.icon
 *   `image` (an imported asset URL) replaces the glyph; `imageSize` is its share of the icon, e.g. '60%'
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='xl'] 44 / 48 / 52 / 64 / 68 px
 */
export function AppIcon({ icon, size = 'xl', className, style, ...props }) {
  const { glyph, image, imageSize, background, color, fontSize } = icon

  return (
    <span
      className={cn('app-icon', size !== 'xl' && `app-icon--${size}`, className)}
      style={{ background, color, fontSize, ...style }}
      aria-hidden="true"
      {...props}
    >
      {image ? (
        <img
          className="app-icon__image"
          src={image}
          alt=""
          draggable="false"
          decoding="async"
          style={imageSize ? { width: imageSize, height: imageSize } : undefined}
        />
      ) : (
        glyph
      )}
    </span>
  )
}
