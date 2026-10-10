import { useId } from 'react'
import { glass } from '@/components/ui/glass'
import { SIRI_STATUS } from '@/constants'
import { cn } from '@/lib/cn'

/* Petal shapes, drawn from the centre outwards (viewBox is -50..50, centre 0,0). */
const PETAL = {
  // curved blade with a rounded tip
  blade: 'M0 0 C-4 -20 8 -40 30 -38 C40 -37 44 -28 40 -20 C30 -24 16 -18 0 0 Z',
  // broader folded leaf
  leaf: 'M0 0 C-14 -14 -10 -40 10 -44 C24 -46 32 -36 28 -26 C18 -30 8 -20 0 0 Z',
}

/**
 * Overlapping petals of light, as in the iOS 14+ Siri orb.
 * `angle` is the resting rotation, `size` scales the petal, `flip: true` mirrors
 * its curl (so the bloom isn't a regular pinwheel), and `delay` (s) staggers
 * the motion so the petals never move in lockstep.
 */
const PETALS = [
  { id: 'crimson', color: '#ff2d55', shape: 'leaf', angle: 0, size: 1.15, delay: 0 },
  { id: 'magenta', color: '#ff3b9a', shape: 'blade', angle: 58, size: 0.95, flip: true, delay: -1.3 },
  { id: 'purple', color: '#a855f7', shape: 'leaf', angle: 122, size: 1.1, delay: -2.6 },
  { id: 'blue', color: '#0a84ff', shape: 'blade', angle: 186, size: 1.2, flip: true, delay: -0.7 },
  { id: 'cyan', color: '#32d4e6', shape: 'leaf', angle: 242, size: 0.9, delay: -3.4 },
  { id: 'teal', color: '#2fe0a8', shape: 'blade', angle: 300, size: 1.05, flip: true, delay: -1.9 },
]

/**
 * Siri orb (iOS 14+ style) in Liquid Glass: a frosted glass sphere where folded
 * petals of coloured light bloom around a glowing white core. The motion follows
 * `state` (see Siri.css: idle, listening, thinking, responding).
 *
 * @param {object} props
 * @param {keyof typeof SIRI_STATUS} [props.state='idle']
 * @param {'sm'|'md'|'lg'} [props.size='md']  34 / 44 / 58 px
 */
export function SiriOrb({ state = SIRI_STATUS.idle, size = 'md', className }) {
  // unique ids so several orbs can live on the page without sharing defs
  const uid = useId().replace(/:/g, '')
  const ref = (name) => `${name}-${uid}`
  const url = (name) => `url(#${ref(name)})`

  const petals = (withEdges) =>
    PETALS.map(({ id, color, shape, angle, size, flip, delay }) => (
      <path
        key={id}
        className="siri-orb__petal"
        d={PETAL[shape]}
        fill={url(`petal-${id}`)}
        stroke={withEdges ? color : undefined}
        strokeOpacity={withEdges ? 0.35 : undefined}
        strokeWidth={withEdges ? 0.6 : undefined}
        style={{ '--angle': `${angle}deg`, '--size': size, '--flip': flip ? -1 : 1, '--delay': `${delay}s` }}
      />
    ))

  return (
    <span className={cn('siri-orb', `siri-orb--${size}`, className)} data-state={state} aria-hidden="true">
      <span className="siri-orb__halo" />
      <span className="siri-orb__ripple" />
      <span className="siri-orb__ripple siri-orb__ripple--late" />
      {/* the sphere itself is Liquid Glass, so it follows the theme and tint slider */}
      <span className={cn(glass(), 'siri-orb__glass')} />

      <svg className="siri-orb__body" viewBox="-50 -50 100 100" focusable="false">
        <defs>
          {/* faint brand-violet light inside the glass */}
          <radialGradient id={ref('sphere')} cx="0" cy="0" r="50" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#7b4dff" stopOpacity="0.28" />
            <stop offset="0.7" stopColor="#7b4dff" stopOpacity="0.08" />
            <stop offset="1" stopColor="#7b4dff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id={ref('core')} cx="0" cy="0" r="18" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.3" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="0.65" stopColor="#f3eaff" stopOpacity="0.3" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* each petal: white-hot at the centre, saturated colour, fading at the tip */}
          {PETALS.map(({ id, color }) => (
            <radialGradient key={id} id={ref(`petal-${id}`)} cx="0" cy="0" r="46" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="0.28" stopColor={color} stopOpacity="0.75" />
              <stop offset="0.75" stopColor={color} stopOpacity="0.5" />
              <stop offset="1" stopColor={color} stopOpacity="0.15" />
            </radialGradient>
          ))}

          <filter id={ref('haze')} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id={ref('soften')} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" />
          </filter>
          <clipPath id={ref('clip')}>
            <circle r="48.5" />
          </clipPath>
        </defs>

        <circle r="50" fill={url('sphere')} />

        <g clipPath={url('clip')}>
          <g className="siri-orb__bloom siri-orb__bloom--haze" filter={url('haze')}>
            {petals(false)}
          </g>
          <g className="siri-orb__bloom" filter={url('soften')}>
            {petals(true)}
          </g>
          <circle className="siri-orb__core" r="18" fill={url('core')} />
        </g>

      </svg>
    </span>
  )
}
