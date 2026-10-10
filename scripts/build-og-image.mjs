/**
 * Builds the social preview image (1200x630) shown when the portfolio link is shared
 * on LinkedIn, WhatsApp, X, Slack…  Matches the site: indigo-to-pink wallpaper,
 * Liquid Glass card, avatar, name and role.
 *
 *   npm run og        -> public/og-image.png
 *
 * Uses the locally installed Chrome (set CHROME_PATH to override).
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { resume } from '../resume/resume.data.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const avatarFile = path.join(root, 'public', 'icons', 'icon-512.png')
const outFile = path.join(root, 'public', 'og-image.png')

const escapeHtml = (value) => String(value).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

const TAGS = ['Laravel 12', 'PHP 8+', 'REST APIs', 'MySQL']

function template(avatar) {
  const [role, specialty] = resume.title.split('|').map((part) => part.trim())
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    * { box-sizing: border-box; margin: 0 }
    body { width: 1200px; height: 630px; overflow: hidden; font-family: 'Segoe UI', -apple-system, Inter, system-ui, sans-serif; color: #fff;
      background: #0b0340; position: relative }
    .blob { position: absolute; border-radius: 50%; filter: blur(90px); opacity: .9 }
    .b1 { width: 720px; height: 720px; background: #3a12c9; top: -320px; left: -200px }
    .b2 { width: 680px; height: 680px; background: #8c0b6f; bottom: -360px; right: -160px }
    .b3 { width: 420px; height: 420px; background: #1a067f; top: 180px; left: 520px }
    .card { position: absolute; inset: 70px 80px; display: flex; align-items: center; gap: 56px; padding: 56px 64px;
      border-radius: 48px; background: rgba(40, 26, 105, .38); box-shadow: inset 0 1px 0 rgba(255,255,255,.35), inset 0 0 0 1px rgba(255,255,255,.1), 0 40px 80px -30px rgba(0,0,0,.6) }
    .avatar { width: 260px; height: 260px; flex: none; border-radius: 50%; background: #fff url(${avatar}) center/cover;
      box-shadow: 0 0 0 8px rgba(255,255,255,.18), 0 24px 60px -16px rgba(0,0,0,.6) }
    .eyebrow { font-size: 26px; font-weight: 600; color: #c9b8ff; letter-spacing: .02em }
    h1 { font-size: 92px; font-weight: 800; letter-spacing: -.04em; line-height: 1.12; margin-top: 6px; padding-bottom: 6px;
      background: linear-gradient(180deg, #fff, rgba(255,255,255,.72)); -webkit-background-clip: text; color: transparent }
    .role { font-size: 36px; font-weight: 600; margin-top: 18px }
    .tags { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px }
    .tag { padding: 9px 20px; border-radius: 999px; font-size: 22px; font-weight: 600; background: rgba(255,255,255,.14); box-shadow: inset 0 1px 0 rgba(255,255,255,.3) }
    .open { position: absolute; top: 34px; right: 40px; display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 600; color: #b8f5c8 }
    .dot { width: 14px; height: 14px; border-radius: 50%; background: #30d158; box-shadow: 0 0 0 6px rgba(48,209,88,.25) }
  </style></head><body>
    <i class="blob b1"></i><i class="blob b2"></i><i class="blob b3"></i>
    <div class="card">
      <div class="open"><span class="dot"></span>Open to work</div>
      <div class="avatar"></div>
      <div>
        <div class="eyebrow">${escapeHtml(specialty ?? 'Portfolio')}</div>
        <h1>${escapeHtml(resume.name)}</h1>
        <div class="role">${escapeHtml(role)}</div>
        <div class="tags">${TAGS.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
      </div>
    </div>
  </body></html>`
}

async function main() {
  const avatar = `data:image/png;base64,${(await readFile(avatarFile)).toString('base64')}`
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' })
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
    await page.setContent(template(avatar), { waitUntil: 'load' })
    await page.screenshot({ path: outFile, type: 'png' })
    console.log(`✓ ${path.relative(root, outFile)} (1200x630)`)
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
