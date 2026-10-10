import { useState } from 'react'
import { useEventListener } from './useEventListener'

/** True once the page has scrolled further than `offset` px; false again when back above it. */
export function useScrollPast(offset = 0) {
  const [past, setPast] = useState(() => typeof window !== 'undefined' && window.scrollY > offset)

  // React skips the re-render when the boolean hasn't changed, so this is cheap per scroll event
  useEventListener('scroll', () => setPast(window.scrollY > offset), window, { passive: true })

  return past
}
