/**
 * Local testing against the Firebase emulators (`npm run emulators`).
 * Enabled only when VITE_FIREBASE_EMULATORS=true, so production never takes this path.
 */
export const useEmulators = import.meta.env.VITE_FIREBASE_EMULATORS === 'true'

export const EMULATOR_HOSTS = Object.freeze({
  auth: 'http://127.0.0.1:9099',
  database: { host: '127.0.0.1', port: 9000 },
})
