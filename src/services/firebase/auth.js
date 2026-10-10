import { getFirebaseApp } from './app'
import { EMULATOR_HOSTS, useEmulators } from './emulators'

let authPromise = null

/** @returns {Promise<{ auth: import('firebase/auth').Auth, sdk: typeof import('firebase/auth') }>} */
export function getAuthHandle() {
  if (!authPromise) {
    authPromise = Promise.all([getFirebaseApp(), import('firebase/auth')]).then(async ([app, sdk]) => {
      const auth = sdk.getAuth(app)
      if (useEmulators) sdk.connectAuthEmulator(auth, EMULATOR_HOSTS.auth, { disableWarnings: true })
      // the saved session (IndexedDB) is restored before anyone reads currentUser
      await auth.authStateReady()
      return { auth, sdk }
    })
  }
  return authPromise
}

/**
 * The visitor's identity: an anonymous Firebase account, created silently on first
 * use and remembered by the browser, so returning visitors keep their conversation.
 *
 * @returns {Promise<import('firebase/auth').User>}
 */
export async function ensureAnonymousUser() {
  const { auth, sdk } = await getAuthHandle()
  if (auth.currentUser) return auth.currentUser
  const { user } = await sdk.signInAnonymously(auth)
  return user
}

/** Signs in with Google in a popup (the admin screen). */
export async function signInWithGoogle() {
  const { auth, sdk } = await getAuthHandle()
  const provider = new sdk.GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })
  const { user } = await sdk.signInWithPopup(auth, provider)
  return user
}

export async function signOutUser() {
  const { auth, sdk } = await getAuthHandle()
  await sdk.signOut(auth)
}

/**
 * Calls `callback(user | null)` now and whenever the signed-in user changes.
 * @returns {() => void} unsubscribe, safe to call before the SDK has loaded
 */
export function onUserChanged(callback) {
  let unsubscribe = null
  let cancelled = false
  getAuthHandle()
    .then(({ auth, sdk }) => {
      if (!cancelled) unsubscribe = sdk.onAuthStateChanged(auth, callback)
    })
    .catch(() => callback(null))
  return () => {
    cancelled = true
    unsubscribe?.()
  }
}

/** A fresh ID token for calling our /api functions, or null when signed out. */
export async function getIdToken() {
  const { auth } = await getAuthHandle()
  return auth.currentUser ? auth.currentUser.getIdToken() : null
}
