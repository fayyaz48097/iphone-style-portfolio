import { cn } from '@/lib/cn'
import { Reveal } from './Reveal'
import './SectionHeading.css'

/**
 * Large iOS-style section title with an optional subtitle.
 *
 * @param {object} props
 * @param {'start'|'center'} [props.align='start']
 */
export function SectionHeading({ title, subtitle, align = 'start', className }) {
  return (
    <div className={cn('section-heading', align === 'center' && 'section-heading--center', className)}>
      <Reveal as="h2" className="section-heading__title">
        {title}
      </Reveal>
      {subtitle ? (
        <Reveal as="p" className="section-heading__subtitle">
          {subtitle}
        </Reveal>
      ) : null}
    </div>
  )
}
