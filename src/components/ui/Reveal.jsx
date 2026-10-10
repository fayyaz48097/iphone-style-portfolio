import { useMemo, useRef } from 'react'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/cn'
import { mergeRefs } from '@/lib/refs'

const REVEAL_OPTIONS = {
  threshold: [0, 0.15],
  rootMargin: '0px 0px -6% 0px',
  once: true,
  includePassed: true,
}

/**
 * Fades and springs its content in the first time it scrolls into view.
 * Polymorphic: <Reveal as="h2">, <Reveal as="ul">, ...
 *
 * @param {object} props
 * @param {number} [props.delay] stagger delay in seconds
 */
export function Reveal({ as: Component = 'div', delay = 0, className, style, ref, ...props }) {
  const localRef = useRef(null)
  const visible = useInView(localRef, REVEAL_OPTIONS)
  const combinedRef = useMemo(() => mergeRefs(localRef, ref), [ref])

  return (
    <Component
      ref={combinedRef}
      className={cn('reveal', visible && 'is-visible', className)}
      style={delay ? { ...style, '--reveal-delay': `${delay}s` } : style}
      {...props}
    />
  )
}
