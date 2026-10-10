/** Copies text to the clipboard. Resolves to `true` on success, `false` when unavailable or denied. */
export async function copyToClipboard(text) {
  if (!navigator.clipboard?.writeText) return false

  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
