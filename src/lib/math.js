export const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export const lerp = (from, to, amount) => from + (to - from) * amount

export const randomBetween = (min, max) => min + Math.random() * (max - min)

/**
 * Picks the label of the first threshold the value falls under.
 *
 * @example bucket(10, [{ max: 20, label: 'Clear' }, { max: 71, label: 'Default' }, { label: 'Tinted' }])
 */
export function bucket(value, thresholds) {
  return thresholds.find(({ max = Infinity }) => value < max)?.label
}
