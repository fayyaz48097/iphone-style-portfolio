import { cn } from '@/lib/cn'
import { SectionHeading } from '../ui/SectionHeading'
import './Section.css'

/** Centred, max-width content column. */
export function Container({ className, ...props }) {
  return <div className={cn('page-container', className)} {...props} />
}

/**
 * Page section with consistent spacing, an optional large heading and a content container.
 *
 * @param {object} props
 * @param {string} props.id                   anchor id used by the tab bar
 * @param {{ title: string, subtitle?: string }} [props.heading]
 * @param {'start'|'center'} [props.align]    heading alignment
 * @param {boolean} [props.flushTop=true]     sections after the first sit tight under the previous one
 */
export function Section({ id, heading, align, flushTop = true, className, children }) {
  return (
    <section id={id} className={cn('section', flushTop && 'section--flush-top', className)}>
      <Container>
        {heading ? <SectionHeading title={heading.title} subtitle={heading.subtitle} align={align} /> : null}
        {children}
      </Container>
    </section>
  )
}
