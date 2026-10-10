import { useCallback, useMemo, useRef, useState } from 'react'
import { NOTIFY_DURATION } from '@/constants'
import { profile } from '@/data/profile'
import { useTimers } from '@/hooks/useTimers'
import { IslandActionsContext, IslandStateContext } from './island-context'

const INITIAL_STATE = {
  open: false,
  icon: null,
  title: profile.status.title,
  subtitle: profile.status.subtitle,
}

export function IslandProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE)
  const { schedule, cancel } = useTimers()
  const closeTimer = useRef(0)

  /** `onTap` makes the expanded island actionable (e.g. "New message" -> open the chat). */
  const notify = useCallback(
    ({ icon = null, title, subtitle = '', duration = NOTIFY_DURATION.default, onTap = null }) => {
      setState({ open: true, icon, title, subtitle, onTap })
      cancel(closeTimer.current)
      closeTimer.current = schedule(() => setState((current) => ({ ...current, open: false })), duration)
    },
    [schedule, cancel],
  )

  const actions = useMemo(() => ({ notify }), [notify])

  return (
    <IslandActionsContext value={actions}>
      <IslandStateContext value={state}>{children}</IslandStateContext>
    </IslandActionsContext>
  )
}
