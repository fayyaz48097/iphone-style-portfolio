import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose'
import { HttpError } from './http.js'

/*
 * Firebase access for the functions without a service account:
 *  - ID tokens are verified against Google's public signing keys
 *  - the database is read/written over REST *as the caller*, so the same
 *    database.rules.json that protects the browser also protects the server.
 */

const env = (name) => process.env[name]?.trim() || ''

const projectId = () => env('FIREBASE_PROJECT_ID') || env('VITE_FIREBASE_PROJECT_ID')
const databaseUrl = () => (env('FIREBASE_DATABASE_URL') || env('VITE_FIREBASE_DATABASE_URL')).replace(/\/+$/, '')

// set only when testing locally against the Firebase emulators
const authEmulator = () => env('FIREBASE_AUTH_EMULATOR_HOST')
const databaseEmulator = () => env('FIREBASE_DATABASE_EMULATOR_HOST')

const googleKeys = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'),
)

/**
 * Verifies a Firebase ID token and returns its claims ({ uid, ... }).
 * @throws {HttpError} 401 when the token is missing, expired or forged
 */
export async function verifyIdToken(token) {
  const project = projectId()
  if (!project) throw new Error('FIREBASE_PROJECT_ID / VITE_FIREBASE_PROJECT_ID is not set')

  try {
    // the auth emulator issues unsigned tokens; never accepted outside emulator mode
    const claims = authEmulator()
      ? decodeJwt(token)
      : (
          await jwtVerify(token, googleKeys, {
            issuer: `https://securetoken.google.com/${project}`,
            audience: project,
            algorithms: ['RS256'],
          })
        ).payload

    if (!claims.sub) throw new Error('no subject')
    return { ...claims, uid: claims.sub }
  } catch {
    throw new HttpError(401, 'Invalid or expired sign-in token')
  }
}

function restUrl(path, token, query = {}) {
  const base = databaseEmulator() ? `http://${databaseEmulator()}` : databaseUrl()
  if (!base) throw new Error('FIREBASE_DATABASE_URL / VITE_FIREBASE_DATABASE_URL is not set')

  const url = new URL(`${base}/${path.replace(/^\/+/, '')}.json`)
  url.searchParams.set('auth', token)
  if (databaseEmulator()) url.searchParams.set('ns', projectId())
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, JSON.stringify(value))
  return url
}

/**
 * Database REST call made with the caller's ID token (rules apply).
 * Resolves to the JSON value; `null` when denied and `allowDenied` is set.
 */
export async function db(path, { token, method = 'GET', body, query, allowDenied = false } = {}) {
  const response = await fetch(restUrl(path, token, query), {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (response.status === 401 || response.status === 403) {
    if (allowDenied) return null
    throw new HttpError(403, 'Not allowed')
  }
  if (!response.ok) throw new Error(`Database ${method} ${path} failed: ${response.status} ${await response.text()}`)
  return response.json()
}

/** The database's own clock, for timestamp fields the rules check against `now`. */
export const SERVER_TIMESTAMP = { '.sv': 'timestamp' }

/** Chat ids are Firebase uids: letters, digits, '-' and '_' only. */
export function assertChatId(chatId) {
  if (typeof chatId !== 'string' || !/^[A-Za-z0-9_-]{6,128}$/.test(chatId)) throw new HttpError(400, 'Invalid chat id')
  return chatId
}
