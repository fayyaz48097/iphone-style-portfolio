import { config } from '@/config/env'
import { getFirebaseApp, isFirebaseConfigured } from './app'

let analyticsPromise = null

/**
 * Starts Google Analytics for Firebase in production only (local development
 * would pollute the reports). Safe to call more than once; never throws.
 *
 * @returns {Promise<import('firebase/analytics').Analytics | null>}
 */
export function initAnalytics() {
  if (!analyticsPromise) {
    analyticsPromise = (async () => {
      if (!config.isProd || !isFirebaseConfigured() || !config.firebase.measurementId) return null

      const [app, sdk] = await Promise.all([getFirebaseApp(), import('firebase/analytics')])
      // unsupported in some browsers and privacy modes
      return (await sdk.isSupported()) ? sdk.getAnalytics(app) : null
    })().catch(() => null)
  }
  return analyticsPromise
}

/** Logs a custom event (e.g. 'resume_download'). No-op when analytics is off. */
export async function trackEvent(name, params) {
  const analytics = await initAnalytics()
  if (!analytics) return
  const { logEvent } = await import('firebase/analytics')
  logEvent(analytics, name, params)
}
