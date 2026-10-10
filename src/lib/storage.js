/**
 * JSON-safe wrapper around localStorage.
 * Every access is guarded because storage can throw (private mode, blocked site data, quota).
 */
export const storage = {
  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? fallback : JSON.parse(raw)
    } catch {
      return fallback
    }
  },

  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage unavailable: the setting simply won't persist
    }
  },

  remove(key) {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // storage unavailable
    }
  },
}
