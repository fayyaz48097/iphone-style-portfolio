import { useRef } from 'react'
import { useEventListener } from './useEventListener'

/** Calls `onMatch` when the user types the given key sequence (e.g. the Konami code). */
export function useKeySequence(sequence, onMatch) {
  const position = useRef(0)

  useEventListener(
    'keydown',
    (event) => {
      if (event.key === sequence[position.current]) position.current += 1
      else position.current = event.key === sequence[0] ? 1 : 0

      if (position.current === sequence.length) {
        position.current = 0
        onMatch()
      }
    },
    document,
  )
}
