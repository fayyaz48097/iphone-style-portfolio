/** "Saturday, October 10" style date, like the iOS lock screen. Returns null if Intl fails. */
export function formatLockScreenDate(date = new Date(), locale = 'en-US') {
  try {
    return date.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })
  } catch {
    return null
  }
}
