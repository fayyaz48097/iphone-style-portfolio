import { createContext, useContext } from 'react'

export const SettingsContext = createContext(null)

/**
 * Appearance settings: theme, glass tint and motion.
 * @returns {{
 *   isDark: boolean, toggleTheme: (origin?: {x:number,y:number}) => 'light'|'dark',
 *   tint: number, setTint: (value: number) => void,
 *   motionEnabled: boolean, reduceMotion: boolean, toggleMotion: () => boolean,
 * }}
 */
export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used inside <SettingsProvider>')
  return context
}
