import { createContext, useContext } from 'react'

/** Which overlay is open. Changes on every open/close. */
export const OverlayStateContext = createContext(null)

/** Stable open/close/toggle actions. Never changes, so consumers don't re-render. */
export const OverlayActionsContext = createContext(null)

/**
 * Only the open/close actions. Use this in components that open overlays but don't
 * care which one is showing (buttons, widgets), so they skip re-renders.
 *
 * @returns {{ open: (name: string) => void, close: () => void, toggle: (name: string) => void }}
 */
export function useOverlayActions() {
  const context = useContext(OverlayActionsContext)
  if (!context) throw new Error('useOverlayActions must be used inside <OverlayProvider>')
  return context
}

/**
 * Controls which full-screen overlay (terminal, control centre, ...) is open.
 * Only one overlay is open at a time; opening one closes the other.
 */
export function useOverlay() {
  const state = useContext(OverlayStateContext)
  const actions = useOverlayActions()
  if (!state) throw new Error('useOverlay must be used inside <OverlayProvider>')
  return { ...state, ...actions }
}
