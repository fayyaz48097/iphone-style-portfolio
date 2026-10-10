import { AppIcon } from '@/components/ui/AppIcon'
import { useLongPress } from '@/hooks/useLongPress'

/**
 * Home-screen app: icon plus label. Tap to "open", press and hold to enter edit mode.
 *
 * @param {object} props
 * @param {{ name: string, icon: object }} props.app
 * @param {boolean} [props.showLabel=true] dock apps hide their label
 */
export function AppLauncher({ app, showLabel = true, onOpen, onLongPress }) {
  const longPress = useLongPress(onLongPress)

  return (
    <button
      type="button"
      className="app-launcher"
      aria-label={showLabel ? undefined : app.name}
      onClick={() => onOpen?.(app)}
      onContextMenu={(event) => event.preventDefault()}
      {...longPress}
    >
      <AppIcon icon={app.icon} />
      {showLabel ? <span className="app-launcher__label">{app.name}</span> : null}
    </button>
  )
}
