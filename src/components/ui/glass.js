import { cn } from '@/lib/cn'

/**
 * Class names for the Liquid Glass material.
 * Use this when a component already owns its element (e.g. <Reveal as="article">);
 * otherwise prefer the <Glass> component.
 *
 * @param {object} [options]
 * @param {boolean} [options.float] real backdrop blur, for glass that floats over moving
 *   content (tab bar, overlays). Costs GPU every frame, so leave it off for page cards.
 * @param {boolean} [options.lens]  adds SVG refraction (implies float). Heavy: use sparingly.
 */
export function glass({ float = false, lens = false } = {}) {
  return cn('glass', (float || lens) && 'glass--float', lens && 'glass--lens')
}
