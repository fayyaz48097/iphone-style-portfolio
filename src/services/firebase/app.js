import { config } from '@/config/env'

/** Keys Firebase needs before it can start (the rest are optional per product). */
const REQUIRED_KEYS = ['apiKey', 'authDomain', 'projectId', 'appId']

export class FirebaseConfigError extends Error {
  constructor(missing) {
    super(`Firebase is not configured. Missing env: ${missing.map((key) => `VITE_FIREBASE_${toEnvName(key)}`).join(', ')}`)
    this.name = 'FirebaseConfigError'
    this.missing = missing
  }
}

const toEnvName = (key) => key.replace(/([A-Z])/g, '_$1').toUpperCase()

/** Config keys that are empty in the environment. */
export function missingFirebaseKeys(required = REQUIRED_KEYS) {
  return required.filter((key) => !config.firebase[key])
}

export const isFirebaseConfigured = () => missingFirebaseKeys().length === 0

let appPromise = null

/**
 * The Firebase app, created once on first use.
 * The SDK is imported dynamically, so it stays out of the initial bundle and only
 * downloads when a feature actually needs Firebase.
 *
 * @returns {Promise<import('firebase/app').FirebaseApp>}
 */
export function getFirebaseApp() {
  if (!appPromise) {
    const missing = missingFirebaseKeys()
    if (missing.length) return Promise.reject(new FirebaseConfigError(missing))

    appPromise = import('firebase/app').then(({ initializeApp, getApps, getApp }) =>
      getApps().length ? getApp() : initializeApp({ ...config.firebase }),
    )
  }
  return appPromise
}
