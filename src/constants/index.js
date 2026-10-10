/** localStorage keys. Change the prefix to reset everyone's saved settings. */
export const STORAGE_KEYS = Object.freeze({
  theme: 'fa:theme',
  tint: 'fa:tint',
  motion: 'fa:motion',
  chat: 'fa:chat',
})

export const MEDIA_QUERIES = Object.freeze({
  dark: '(prefers-color-scheme: dark)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  finePointer: '(hover: hover) and (pointer: fine)',
})

export const THEMES = Object.freeze({ light: 'light', dark: 'dark' })

export const OVERLAYS = Object.freeze({
  terminal: 'terminal',
  controlCentre: 'control-centre',
  siri: 'siri',
  resume: 'resume',
})

/** Siri conversation states. They drive the orb and screen-glow animations. */
export const SIRI_STATUS = Object.freeze({
  idle: 'idle',
  listening: 'listening',
  thinking: 'thinking',
  responding: 'responding',
  error: 'error',
})

/** Page section ids, in document order. */
export const SECTION_IDS = Object.freeze({
  top: 'top',
  about: 'about',
  skills: 'skills',
  work: 'work',
  build: 'build',
  journey: 'journey',
  education: 'education',
  contact: 'contact',
})

export const DEFAULT_TINT = 35

/** Dynamic Island notification durations, in ms. */
export const NOTIFY_DURATION = Object.freeze({
  short: 1600,
  medium: 1800,
  default: 2600,
  long: 3200,
})

export const KONAMI_CODE = Object.freeze([
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
])
