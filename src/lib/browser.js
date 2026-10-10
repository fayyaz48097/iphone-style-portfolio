/** SVG backdrop-filter refraction only renders in Chromium-based browsers. */
export function isChromium() {
  return Boolean(navigator.userAgentData?.brands?.some(({ brand }) => /Chromium/.test(brand)))
}

/** True when the element is rendered (not inside a display:none subtree). */
export function isRendered(element) {
  return Boolean(element && element.offsetParent !== null)
}

/** True while the user is typing into a form field, so global shortcuts should stand down. */
export function isEditableTarget(element) {
  if (!element) return false
  return element.isContentEditable || /^(input|textarea|select)$/i.test(element.tagName)
}

/** Centre point of an element's box, in viewport coordinates. */
export function centerOf(element) {
  const rect = element.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}
