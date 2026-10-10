// Central access point for environment variables.
// Only variables prefixed with VITE_ are exposed to the client, so never put secrets here.
const read = (key, fallback = '') => import.meta.env[key]?.trim() || fallback

export const config = Object.freeze({
  appName: read('VITE_APP_NAME', 'Fayyaz Ali'),
  appUrl: read('VITE_APP_URL', 'http://localhost:5173'),
  apiUrl: read('VITE_API_URL'),
  contactEmail: read('VITE_CONTACT_EMAIL', 'iam.fayyazali@gmail.com'),
  contactPhone: read('VITE_CONTACT_PHONE', '+92 321 6886133'),
  githubUrl: read('VITE_GITHUB_URL'),
  linkedinUrl: read('VITE_LINKEDIN_URL'),
  // Siri: leave empty to answer from local portfolio data, set to your AI endpoint to go live.
  siriApiUrl: read('VITE_SIRI_API_URL'),
  // Firebase web config. Not secret (it ships in the bundle) but kept out of the repo;
  // real protection comes from Realtime Database rules and API-key restrictions.
  firebase: Object.freeze({
    apiKey: read('VITE_FIREBASE_API_KEY'),
    authDomain: read('VITE_FIREBASE_AUTH_DOMAIN'),
    databaseURL: read('VITE_FIREBASE_DATABASE_URL'),
    projectId: read('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: read('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: read('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: read('VITE_FIREBASE_APP_ID'),
    measurementId: read('VITE_FIREBASE_MEASUREMENT_ID'),
  }),
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
})
