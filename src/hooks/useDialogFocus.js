import { useEffect } from 'react'

/**
 * Focus management for modal surfaces: moves focus inside when `open`
 * becomes true and gives it back to the previously focused element on close.
 */
export function useDialogFocus(open, initialFocusRef, { delay = 80 } = {}) {
  useEffect(() => {
    if (!open) return undefined

    const previouslyFocused = document.activeElement
    const timer = window.setTimeout(() => initialFocusRef.current?.focus(), delay)

    return () => {
      window.clearTimeout(timer)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [open, initialFocusRef, delay])
}
