/**
 * Joins class names, skipping falsy values.
 * Accepts strings, nested arrays and `{ 'class-name': condition }` maps.
 *
 * @example cn('tile', isActive && 'tile--active', { 'tile--wide': wide })
 */
export function cn(...inputs) {
  const classes = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(input)
    } else if (Array.isArray(input)) {
      const nested = cn(...input)
      if (nested) classes.push(nested)
    } else if (typeof input === 'object') {
      for (const [name, enabled] of Object.entries(input)) {
        if (enabled) classes.push(name)
      }
    }
  }

  return classes.join(' ')
}
