/**
 * Firebase entry point. Import from '@/services/firebase'.
 *
 * Config comes from VITE_FIREBASE_* variables (see .env.example); nothing is hard-coded.
 * Every SDK is loaded on demand, so pages that never touch Firebase never download it.
 */
export { FirebaseConfigError, getFirebaseApp, isFirebaseConfigured } from './app'
export {
  getDatabaseHandle,
  increment,
  newKey,
  onConnectionChange,
  pushChild,
  readOnce,
  remove,
  sentinels,
  serverTimestamp,
  setConnected,
  setWithDisconnect,
  subscribe,
  update,
  write,
} from './database'
export { ensureAnonymousUser, getIdToken, onUserChanged, signInWithGoogle, signOutUser } from './auth'
export { initAnalytics, trackEvent } from './analytics'
