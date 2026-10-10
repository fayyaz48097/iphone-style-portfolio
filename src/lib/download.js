/**
 * Starts a browser download of a same-origin file without navigating away.
 * (The `download` attribute is ignored for cross-origin URLs, which open instead.)
 */
export function downloadFile(href, fileName = '') {
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = fileName
  anchor.rel = 'noopener'
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
}
