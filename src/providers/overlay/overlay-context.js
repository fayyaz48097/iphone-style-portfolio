import { createContext, useContext } from 'react'

export const OverlayContext = createContext(null)

/**
 * Controls which full-screen overlay (terminal, control centre, ...) is open.
 * Only one overlay is open at a time; opening one closes the other.
 */
export function useOverlay() {
  const context = useContext(OverlayContext)
  if (!context) throw new Error('useOverlay must be used inside <OverlayProvider>')
  return context
}
