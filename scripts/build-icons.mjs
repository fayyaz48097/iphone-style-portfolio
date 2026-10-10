/**
 * Builds the favicon and app icons from the avatar artwork.
 *
 *   npm run icons
 *
 * Source:  public/fayyaz_avatar.jpg (full-body artwork, not deployed as-is: 2 MB)
 * Outputs: public/icons/favicon-32.png, favicon-48.png      round, transparent corners
 *          public/icons/apple-touch-icon.png (180)         square, iOS rounds it itself
 *          public/icons/icon-192.png, icon-512.png          for the web app manifest
 *
 * Uses the locally installed Chrome to crop and resize with high-quality smoothing.
 */
import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'public', 'fayyaz_avatar.jpg')
const outDir = path.join(root, 'public', 'icons')

/**
 * Face crop, as fractions of the source image (centre x/y and square size).
 * Tuned for the 1696x2528 artwork: head and shoulders.
 */
const CROP = { cx: 0.543, cy: 0.205, size: 0.56 }

const ICONS = [
  { file: 'favicon-32.png', size: 32, round: true },
  { file: 'favicon-48.png', size: 48, round: true },
  { file: 'apple-touch-icon.png', size: 180, round: false },
  { file: 'icon-192.png', size: 192, round: false },
  { file: 'icon-512.png', size: 512, round: false },
]

async function main() {
  if (!existsSync(source)) throw new Error(`Missing source artwork: ${path.relative(root, source)}`)
  await mkdir(outDir, { recursive: true })

  const dataUrl = `data:image/jpeg;base64,${(await readFile(source)).toString('base64')}`
  const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' })
  const page = await browser.newPage()

  try {
    const results = await page.evaluate(
      async ({ dataUrl, crop, icons }) => {
        const image = new Image()
        image.src = dataUrl
        await image.decode()

        const side = image.naturalWidth * crop.size
        const sx = image.naturalWidth * crop.cx - side / 2
        const sy = image.naturalHeight * crop.cy - side / 2

        return icons.map(({ size, round }) => {
          const canvas = document.createElement('canvas')
          canvas.width = canvas.height = size
          const ctx = canvas.getContext('2d')
          ctx.imageSmoothingQuality = 'high'
          if (round) {
            ctx.beginPath()
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
            ctx.clip()
          }
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, size, size)
          ctx.drawImage(image, sx, sy, side, side, 0, 0, size, size)
          return canvas.toDataURL('image/png')
        })
      },
      { dataUrl, crop: CROP, icons: ICONS },
    )

    for (const [index, { file }] of ICONS.entries()) {
      await writeFile(path.join(outDir, file), Buffer.from(results[index].split(',')[1], 'base64'))
      console.log(`✓ public/icons/${file}`)
    }
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
