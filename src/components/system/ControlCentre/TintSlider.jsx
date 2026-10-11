import { useId } from 'react'
import { glass } from '@/components/ui/glass'
import { bucket } from '@/lib/math'
import { cn } from '@/lib/cn'

const TINT_LABELS = [
  { max: 20, label: 'Clear' },
  { max: 71, label: 'Default' },
  { label: 'Tinted' },
]

/** iOS 26 Liquid Glass "Clear / Tinted" slider. */
export function TintSlider({ value, onChange, ref }) {
  const labelId = useId()

  return (
    <div className={cn(glass({ float: true }), 'cc-slider')}>
      <div className="cc-slider__header">
        <b id={labelId} className="cc-slider__title">
          Liquid Glass
        </b>
        <small className="cc-slider__value">{bucket(value, TINT_LABELS)}</small>
      </div>
      <input
        ref={ref}
        className="liquid-range"
        type="range"
        min="0"
        max="100"
        value={value}
        style={{ '--value': value }}
        aria-labelledby={labelId}
        aria-describedby={`${labelId}-scale`}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div id={`${labelId}-scale`} className="cc-slider__scale">
        <span>Clear</span>
        <span>Tinted</span>
      </div>
    </div>
  )
}
