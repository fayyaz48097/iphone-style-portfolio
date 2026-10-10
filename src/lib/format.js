/** 84012 -> "82 KB", 2400000 -> "2.3 MB" */
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value >= 10 || unit === 0 ? Math.round(value) : value.toFixed(1)} ${units[unit]}`
}

/** "2026-10-10" -> "October 2026" */
export function formatMonthYear(isoDate, locale = 'en-US') {
  try {
    return new Date(`${isoDate}T00:00:00`).toLocaleDateString(locale, { month: 'long', year: 'numeric' })
  } catch {
    return isoDate
  }
}

/** 1 -> "1 page", 2 -> "2 pages" */
export const pluralize = (count, singular, plural = `${singular}s`) => `${count} ${count === 1 ? singular : plural}`
