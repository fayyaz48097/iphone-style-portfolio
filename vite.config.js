import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import { localApi } from './scripts/vite-local-api.mjs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // all variables, including server-only ones, for the local /api functions
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss(), localApi({ env })],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: Number(env.VITE_PORT) || 5173,
      open: true,
    },
    // preview inherits server.open otherwise; previews are often run by scripts and tests
    preview: {
      open: false,
    },
  }
})
