import { existsSync } from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Vite plugin: serves the Vercel functions in /api during `vite dev` and `vite preview`,
 * so the chat works locally without the Vercel CLI. In production Vercel runs /api itself.
 *
 * Server-only env vars (MAIL_*, ...) are passed in from Vite's loadEnv; they are never
 * exposed to the browser bundle (only VITE_* variables are).
 */
export function localApi({ env = {}, root = process.cwd() } = {}) {
  const apiDir = path.join(root, 'api')

  const resolveHandler = (url) => {
    const route = url.split('?')[0].replace(/^\/api\//, '')
    // routes are files like api/chat/notify.js; underscore folders are private helpers
    if (!/^[a-z0-9/-]+$/i.test(route) || route.split('/').some((part) => part.startsWith('_'))) return null
    const file = path.join(apiDir, `${route}.js`)
    return existsSync(file) ? file : null
  }

  const middleware = (load) => async (req, res, next) => {
    if (!req.url?.startsWith('/api/')) return next()
    const file = resolveHandler(req.url)
    if (!file) {
      res.statusCode = 404
      return res.end(JSON.stringify({ error: 'Not found' }))
    }
    try {
      const { default: handler } = await load(file)
      await handler(req, res)
    } catch (error) {
      console.error('[local api]', error)
      res.statusCode = 500
      res.end(JSON.stringify({ error: 'Local API error' }))
    }
  }

  const exposeServerEnv = () => {
    for (const [key, value] of Object.entries(env)) if (!(key in process.env)) process.env[key] = value
  }

  return {
    name: 'local-api',
    configureServer(server) {
      exposeServerEnv()
      server.middlewares.use(middleware((file) => server.ssrLoadModule(file)))
    },
    configurePreviewServer(server) {
      exposeServerEnv()
      server.middlewares.use(middleware((file) => import(pathToFileURL(file).href)))
    },
  }
}
