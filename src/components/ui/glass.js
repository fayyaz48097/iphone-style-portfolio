import { cn } from '@/lib/cn'

/**
 * Class names for the Liquid Glass material.
 * Use this when a component already owns its element (e.g. <Reveal as="article">);
 * otherwise prefer the <Glass> component.
 *
 * @param {{ lens?: boolean }} [options] lens adds real SVG refraction in Chromium
 */
export function glass({ lens = false } = {}) {
  return cn('glass', lens && 'glass--lens')
}
