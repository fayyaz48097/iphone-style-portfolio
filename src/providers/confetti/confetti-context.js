import { createContext, useContext } from 'react'

export const ConfettiContext = createContext(null)

/** @returns {(count?: number) => void} fires a confetti burst (no-op when motion is off) */
export function useConfetti() {
  const context = useContext(ConfettiContext)
  if (!context) throw new Error('useConfetti must be used inside <ConfettiProvider>')
  return context
}
