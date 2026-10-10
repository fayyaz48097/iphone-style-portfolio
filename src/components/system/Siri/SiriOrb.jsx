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
 * Petals of light, grouped into three layers. Each layer is drawn once and then
 * rotated/scaled with CSS transforms, which the GPU animates without repainting,
 * so the bloom stays at 60fps even on modest phones.
 * `angle` is the petal's rotation, `size` its scale, `flip` mirrors its curl.
 */
const LAYERS = [
  [
    { id: 'crimson', color: '#ff2d55', shape: 'leaf', angle: 0, size: 1.15 },
    { id: 'blue', color: '#0a84ff', shape: 'blade', angle: 186, size: 1.2, flip: true },
  ],
  [
    { id: 'magenta', color: '#ff3b9a', shape: 'blade', angle: 58, size: 0.95, flip: true },
    { id: 'cyan', color: '#32d4e6', shape: 'leaf', angle: 242, size: 0.9 },
  ],
  [
    { id: 'purple', color: '#a855f7', shape: 'leaf', angle: 122, size: 1.1 },
    { id: 'teal', color: '#2fe0a8', shape: 'blade', angle: 300, size: 1.05, flip: true },
  ],
]

const petalTransform = ({ angle, size, flip }) => `rotate(${angle}) scale(${flip ? -size : size} ${size})`

/**
 * Siri orb (iOS 14+ style) in Liquid Glass: a frosted glass sphere where petals of
 * coloured light bloom around a glowing white core. The motion follows `state`
 * (see Siri.css: idle, listening, thinking, responding).
 *
 * @param {object} props
 * @param {keyof typeof SIRI_STATUS} [props.state='idle']
 * @param {'sm'|'md'|'lg'} [props.size='md']  34 / 44 / 58 px
 */
export function SiriOrb({ state = SIRI_STATUS.idle, size = 'md', className }) {
  // unique ids so several orbs can live on the page without sharing gradient defs
  const uid = useId().replace(/:/g, '')
  const gradientId = (id) => `petal-${id}-${uid}`

  return (
    <span className={cn('siri-orb', `siri-orb--${size}`, className)} data-state={state} aria-hidden="true">
      <span className="siri-orb__halo" />
      <span className="siri-orb__ripple" />
      <span className="siri-orb__ripple siri-orb__ripple--late" />
      {/* the sphere itself is Liquid Glass, so it follows the theme and tint slider */}
      <span className={cn(glass(), 'siri-orb__glass')} />

      <span className="siri-orb__body">
        {LAYERS.map((petals, index) => (
          <span key={index} className={`siri-orb__layer siri-orb__layer--${index + 1}`}>
            <svg viewBox="-50 -50 100 100" focusable="false">
              <defs>
                {/* white-hot at the centre, saturated colour, fading at the tip */}
                {petals.map(({ id, color }) => (
                  <radialGradient key={id} id={gradientId(id)} cx="0" cy="0" r="46" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
                    <stop offset="0.28" stopColor={color} stopOpacity="0.75" />
                    <stop offset="0.75" stopColor={color} stopOpacity="0.5" />
                    <stop offset="1" stopColor={color} stopOpacity="0.15" />
                  </radialGradient>
                ))}
              </defs>
              {petals.map((petal) => (
                <path
                  key={petal.id}
                  d={PETAL[petal.shape]}
                  transform={petalTransform(petal)}
                  fill={`url(#${gradientId(petal.id)})`}
                  stroke={petal.color}
                  strokeOpacity="0.35"
                  strokeWidth="0.6"
                />
              ))}
            </svg>
          </span>
        ))}
        <span className="siri-orb__core" />
      </span>
    </span>
  )
}
