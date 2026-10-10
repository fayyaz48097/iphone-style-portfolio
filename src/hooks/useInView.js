import { useEffect, useState } from 'react'

/**
 * Tracks whether an element intersects the viewport.
 *
 * @param {{ current: Element | null }} ref
 * @param {object} [options]
 * @param {number | number[]} [options.threshold=0]
 * @param {string} [options.rootMargin='0px']
 * @param {boolean} [options.once=false]        stop observing after the first hit
 * @param {boolean} [options.includePassed=false] treat elements already scrolled past as in view
 */
export function useInView(ref, { threshold = 0, rootMargin = '0px', once = false, includePassed = false } = {}) {
  const [inView, setInView] = useState(false)
  const thresholdKey = JSON.stringify(threshold)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting || (includePassed && entry.boundingClientRect.top < 0)
        setInView(visible)
        if (visible && once) observer.disconnect()
      },
      { threshold: JSON.parse(thresholdKey), rootMargin },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, thresholdKey, rootMargin, once, includePassed])

  return inView
}
