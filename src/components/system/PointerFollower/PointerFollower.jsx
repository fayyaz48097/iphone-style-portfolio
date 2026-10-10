import { useEffect, useRef } from 'react'
import { MEDIA_QUERIES } from '@/constants'
import { useEventListener } from '@/hooks/useEventListener'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { lerp } from '@/lib/math'
import './PointerFollower.css'

const INTERACTIVE = 'a, button, input'
const EASING = 0.3
const REST_DISTANCE = 0.3

/** Trailing pointer for mouse/trackpad users. Not rendered on touch devices. */
export function PointerFollower() {
  const finePointer = useMediaQuery(MEDIA_QUERIES.finePointer)
  return finePointer ? <Follower /> : null
}

function Follower() {
  const dotRef = useRef(null)
  const target = useRef({ x: -100, y: -100 })
  const current = useRef({ x: -100, y: -100 })
  const frame = useRef(0)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const step = () => {
    const t = target.current
    const c = current.current
    c.x = lerp(c.x, t.x, EASING)
    c.y = lerp(c.y, t.y, EASING)
    if (dotRef.current) dotRef.current.style.transform = `translate(${c.x}px, ${c.y}px)`

    frame.current = Math.abs(t.x - c.x) + Math.abs(t.y - c.y) > REST_DISTANCE ? requestAnimationFrame(step) : 0
  }

  useEventListener(
    'pointermove',
    (event) => {
      target.current = { x: event.clientX, y: event.clientY }
      if (!frame.current) frame.current = requestAnimationFrame(step)
    },
    window,
    { passive: true },
  )

  useEventListener(
    'pointerover',
    (event) => {
      dotRef.current?.classList.toggle('pointer-follower--hover', Boolean(event.target.closest?.(INTERACTIVE)))
    },
    document,
  )

  return <div ref={dotRef} className="pointer-follower" aria-hidden="true" />
}
