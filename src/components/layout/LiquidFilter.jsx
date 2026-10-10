/**
 * SVG displacement filter referenced by `.glass--lens` (backdrop-filter: url(#liquid)).
 * Gives Liquid Glass surfaces real refraction in Chromium.
 */
export function LiquidFilter() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <filter id="liquid" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="noise" />
        <feGaussianBlur in="noise" stdDeviation="2" result="soft" />
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="38" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  )
}
