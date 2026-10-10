import { FirebaseConfigError, getFirebaseApp, missingFirebaseKeys } from './app'
import { EMULATOR_HOSTS, useEmulators } from './emulators'

/*
 * Realtime Database access. Every helper takes a slash path ("visitors/count")
 * and lazily loads the database SDK on first use.
 */

let dbPromise = null

/**
 * The database plus its SDK functions, for services that need more than the helpers below.
 * @returns {Promise<{ db: import('firebase/database').Database, sdk: typeof import('firebase/database') }>}
 */
export async function getDatabaseHandle() {
  if (!dbPromise) {
    const missing = missingFirebaseKeys(['apiKey', 'projectId', 'appId', 'databaseURL'])
    if (missing.length) throw new FirebaseConfigError(missing)

    dbPromise = Promise.all([getFirebaseApp(), import('firebase/database')]).then(([app, sdk]) => {
      const db = sdk.getDatabase(app)
      if (useEmulators) sdk.connectDatabaseEmulator(db, EMULATOR_HOSTS.database.host, EMULATOR_HOSTS.database.port)
      return { db, sdk }
    })
  }
  return dbPromise
}

/**
 * Opens or closes the realtime connection. The Spark plan allows 100 simultaneous
 * connections, so features connect only while they are in use.
 */
export async function setConnected(connected) {
  const { db, sdk } = await getDatabaseHandle()
  if (connected) sdk.goOnline(db)
  else sdk.goOffline(db)
}

/** A new time-ordered push key for `path`, without writing anything. */
export async function newKey(path) {
  const { db, sdk } = await getDatabaseHandle()
  return sdk.push(sdk.ref(db, path)).key
}

/**
 * Server-side values to use inside writes: the server's clock and atomic increments.
 * @returns {Promise<{ now: object, increment: (delta: number) => object }>}
 */
export async function sentinels() {
  const { sdk } = await getDatabaseHandle()
  return { now: sdk.serverTimestamp(), increment: sdk.increment }
}

/**
 * Writes `value` at `path` now, and tells the server to write `onDisconnectValue`
 * when this client disconnects (tab closed, network lost). The basis of presence.
 */
export async function setWithDisconnect(path, value, onDisconnectValue) {
  const { db, sdk } = await getDatabaseHandle()
  const target = sdk.ref(db, path)
  await sdk.onDisconnect(target).set(onDisconnectValue)
  await sdk.set(target, value)
}

/** Live "am I connected to the database" flag. Returns unsubscribe. */
export function onConnectionChange(callback) {
  return subscribe('.info/connected', (connected) => callback(connected === true))
}

/** Reads a value once. Resolves to `null` when nothing is stored at `path`. */
export async function readOnce(path) {
  const { db, sdk } = await getDatabaseHandle()
  const snapshot = await sdk.get(sdk.ref(db, path))
  return snapshot.exists() ? snapshot.val() : null
}

/**
 * Listens to a value in real time.
 * Returns an unsubscribe function you can call immediately, even before the SDK has loaded.
 *
 * @param {string} path
 * @param {(value: unknown) => void} onData   receives `null` when the path is empty
 * @param {(error: Error) => void} [onError]
 * @returns {() => void}
 */
export function subscribe(path, onData, onError) {
  let unsubscribe = null
  let cancelled = false

  getDatabaseHandle()
    .then(({ db, sdk }) => {
      if (cancelled) return
      unsubscribe = sdk.onValue(
        sdk.ref(db, path),
        (snapshot) => onData(snapshot.exists() ? snapshot.val() : null),
        (error) => onError?.(error),
      )
    })
    .catch((error) => {
      if (!cancelled) onError?.(error)
    })

  return () => {
    cancelled = true
    unsubscribe?.()
  }
}

/** Replaces the value at `path`. */
export async function write(path, value) {
  const { db, sdk } = await getDatabaseHandle()
  await sdk.set(sdk.ref(db, path), value)
}

/** Merges `values` into the object at `path` (multi-path updates allowed). */
export async function update(path, values) {
  const { db, sdk } = await getDatabaseHandle()
  await sdk.update(sdk.ref(db, path), values)
}

/** Appends a child with a time-ordered unique key. Resolves to that key. */
export async function pushChild(path, value) {
  const { db, sdk } = await getDatabaseHandle()
  const childRef = await sdk.push(sdk.ref(db, path), value)
  return childRef.key
}

/** Deletes the value at `path`. */
export async function remove(path) {
  const { db, sdk } = await getDatabaseHandle()
  await sdk.remove(sdk.ref(db, path))
}

/** Atomically adds `delta` to a number (counters, likes). */
export async function increment(path, delta = 1) {
  const { db, sdk } = await getDatabaseHandle()
  await sdk.set(sdk.ref(db, path), sdk.increment(delta))
}

/** Placeholder the server replaces with its own timestamp (ms since epoch). */
export async function serverTimestamp() {
  const { sdk } = await getDatabaseHandle()
  return sdk.serverTimestamp()
}
