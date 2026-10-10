/**
 * Builds a CSS linear-gradient string.
 *
 * @example linearGradient(150, '#FF6B5B', '#E0263C')
 */
export function linearGradient(angle, ...stops) {
  return `linear-gradient(${angle}deg, ${stops.join(', ')})`
}
