import { ConfettiProvider } from '@/providers/confetti/ConfettiProvider'
import { IslandProvider } from '@/providers/island/IslandProvider'
import { OverlayProvider } from '@/providers/overlay/OverlayProvider'
import { SettingsProvider } from '@/providers/settings/SettingsProvider'

/** Every app-wide provider, composed in dependency order. */
export function AppProviders({ children }) {
  return (
    <SettingsProvider>
      <IslandProvider>
        <ConfettiProvider>
          <OverlayProvider>{children}</OverlayProvider>
        </ConfettiProvider>
      </IslandProvider>
    </SettingsProvider>
  )
}
