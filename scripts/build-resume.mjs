/**
 * Builds the résumé PDFs from resume/resume.data.mjs using a locally installed Chrome.
 *
 *   npm run resume
 *
 * Outputs
 *   public/resume/Fayyaz_Ali_Backend_Resume.pdf   public download (references when showReferencesPublicly is on)
 *   public/resume/resume-preview.jpg              first-page thumbnail for the site
 *   src/data/resume.meta.json                     page count, size, build date for the UI
 *   resume/output/..._with_references.pdf         private copy (git-ignored), only if
 *                                                 resume/references.local.json exists
 *
 * Set CHROME_PATH to use a specific browser binary.
 */
import { existsSync } from 'node:fs'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { resume, showReferencesPublicly } from '../resume/resume.data.mjs'
import { renderResume } from '../resume/template.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const FILE_NAME = 'Fayyaz_Ali_Backend_Resume'
const publicDir = path.join(root, 'public', 'resume')
const privateDir = path.join(root, 'resume', 'output')
const referencesFile = path.join(root, 'resume', 'references.local.json')
const metaFile = path.join(root, 'src', 'data', 'resume.meta.json')

const launchOptions = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' }

async function renderPdf(page, html, outFile) {
  await page.setContent(html, { waitUntil: 'load' })
  await page.pdf({ path: outFile, format: 'Letter', preferCSSPageSize: true, printBackground: true })
  // count pages from the PDF itself
  const pdf = await readFile(outFile, 'latin1')
  return (pdf.match(/\/Type\s*\/Page[^s]/g) ?? []).length
}

async function main() {
  await mkdir(publicDir, { recursive: true })

  const browser = await chromium.launch(launchOptions)
  const page = await browser.newPage()

  try {
    const references = existsSync(referencesFile) ? JSON.parse(await readFile(referencesFile, 'utf8')) : null

    // public version (references only when showReferencesPublicly is on)
    const publicPdf = path.join(publicDir, `${FILE_NAME}.pdf`)
    const html = renderResume(resume, { references: showReferencesPublicly ? references : null })
    const pages = await renderPdf(page, html, publicPdf)
    const { size } = await stat(publicPdf)

    // first-page thumbnail (US Letter at 96dpi is 816 x 1056)
    await page.setViewportSize({ width: 816, height: 1056 })
    await page.setContent(html.replace('<style>', '<style>body{padding:48px 53px}'), { waitUntil: 'load' })
    await page.screenshot({
      path: path.join(publicDir, 'resume-preview.jpg'),
      type: 'jpeg',
      quality: 82,
      clip: { x: 0, y: 0, width: 816, height: 1056 },
    })

    await writeFile(
      metaFile,
      `${JSON.stringify({ fileName: `${FILE_NAME}.pdf`, pages, bytes: size, updatedAt: new Date().toISOString().slice(0, 10) }, null, 2)}\n`,
    )
    console.log(`✓ public résumé: ${path.relative(root, publicPdf)} (${pages} pages, ${(size / 1024).toFixed(0)} KB)`)

    // private version with references
    if (references) {
      await mkdir(privateDir, { recursive: true })
      const privatePdf = path.join(privateDir, `${FILE_NAME}_with_references.pdf`)
      await renderPdf(page, renderResume(resume, { references }), privatePdf)
      console.log(`✓ private résumé: ${path.relative(root, privatePdf)}`)
    }
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
