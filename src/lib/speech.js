/* Thin wrappers over the Web Speech API (recognition + synthesis). */

/** The browser's SpeechRecognition constructor, or null where unsupported (e.g. Firefox). */
export function getSpeechRecognition() {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

export function isSpeechSynthesisSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/** Text that reads well aloud: URLs and email addresses become short words. */
function toSpeakable(text) {
  return text
    .replace(/https?:\/\/\S+/g, 'the link')
    .replace(/[•→]/g, ',')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Speaks `text`, interrupting anything already being spoken. */
export function speak(text, { lang = 'en-US', rate = 1.03, pitch = 1 } = {}) {
  if (!isSpeechSynthesisSupported() || !text) return

  const utterance = new SpeechSynthesisUtterance(toSpeakable(text))
  utterance.lang = lang
  utterance.rate = rate
  utterance.pitch = pitch

  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (isSpeechSynthesisSupported()) window.speechSynthesis.cancel()
}
