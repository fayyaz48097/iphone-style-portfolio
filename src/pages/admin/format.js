/** Compact iMessage-style time: "now", "5m", "3h", "Mon", "Oct 4". */
export function shortTime(ms, now = Date.now()) {
  if (!ms) return ''
  const diff = now - ms
  if (diff < 60_000) return 'now'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`
  const date = new Date(ms)
  if (diff < 6 * 86_400_000) return date.toLocaleDateString('en-US', { weekday: 'short' })
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const clockTime = (ms) => (ms ? new Date(ms).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '')

/** A readable name for a visitor without an email: "Visitor 7F3A". */
export const visitorLabel = (chat) => chat.meta.email || `Visitor ${chat.id.slice(-4).toUpperCase()}`
