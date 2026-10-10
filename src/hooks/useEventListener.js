import { useEffect, useEffectEvent } from 'react'

/**
 * Subscribes to a DOM event for the lifetime of the component.
 * The handler always sees fresh props/state without re-subscribing.
 *
 * @param {string} eventName
 * @param {(event: Event) => void} handler
 * @param {Window | Document | HTMLElement | { current: EventTarget | null } | null} [target=window]
 * @param {{ passive?: boolean, capture?: boolean, enabled?: boolean }} [options]
 */
export function useEventListener(eventName, handler, target = window, { passive, capture, enabled = true } = {}) {
  const onEvent = useEffectEvent(handler)

  useEffect(() => {
    if (!enabled) return undefined

    const element = target && 'current' in target ? target.current : target
    if (!element?.addEventListener) return undefined

    const listener = (event) => onEvent(event)
    const options = { passive, capture }
    element.addEventListener(eventName, listener, options)
    return () => element.removeEventListener(eventName, listener, options)
  }, [eventName, target, passive, capture, enabled])
}
