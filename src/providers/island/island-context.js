import { createContext, useContext } from 'react'

/** Current island content. Only the island itself should subscribe to this. */
export const IslandStateContext = createContext(null)

/** Stable `notify` action, safe to consume anywhere without extra re-renders. */
export const IslandActionsContext = createContext(null)

export function useIslandState() {
  const context = useContext(IslandStateContext)
  if (!context) throw new Error('useIslandState must be used inside <IslandProvider>')
  return context
}

/**
 * @returns {{ notify: (n: { icon?: string|null, title: string, subtitle?: string, duration?: number }) => void }}
 */
export function useIsland() {
  const context = useContext(IslandActionsContext)
  if (!context) throw new Error('useIsland must be used inside <IslandProvider>')
  return context
}
