/**
 * Renders résumé data into print-ready HTML (US Letter), matching the original
 * single-column, ATS-friendly layout: navy headings, ruled sections, right-aligned dates.
 */

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

const link = ({ label, href, underline = true }) =>
  `<a href="${escapeHtml(href)}"${underline ? '' : ' class="plain"'}>${escapeHtml(label)}</a>`

const section = (title, body) => `
  <section>
    <h2>${escapeHtml(title)}</h2>
    ${body}
  </section>`

// Bullets are authored content and may contain <b> for emphasis, so they're inserted as HTML.
const bullets = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`

const entryHeader = (title, date) => `
  <div class="entry-head">
    <h3>${title}</h3>
    <span class="date">${escapeHtml(date)}</span>
  </div>`

const STYLES = `
  @page { size: Letter; margin: 0.45in 0.55in; }
  * { box-sizing: border-box; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body {
    margin: 0;
    color: #333;
    font: 10pt/1.28 Calibri, Carlito, 'Segoe UI', Arial, sans-serif;
  }
  a { color: #1f3a6e; }
  a.plain { color: inherit; text-decoration: none; }
  header { text-align: center; margin-bottom: 11pt; }
  h1 { margin: 0; color: #1f3a6e; font-size: 23pt; letter-spacing: 0.02em; text-transform: uppercase; }
  .title { margin-top: 2pt; color: #555; font-size: 12pt; }
  .contact { margin-top: 3pt; color: #555; font-size: 9.6pt; }
  .contact .sep { margin: 0 5pt; }
  section { margin-bottom: 9pt; }
  h2 {
    margin: 0 0 6pt;
    padding-bottom: 2pt;
    border-bottom: 1.3pt solid #1f3a6e;
    color: #1f3a6e;
    font-size: 11pt;
    text-transform: uppercase;
  }
  h3 { margin: 0; color: #1f3a6e; font-size: 10.8pt; }
  h3 .company { color: #1f3a6e; }
  h3 .bar { margin: 0 5pt; }
  .summary { margin: 0; }
  .skills p { margin: 0 0 2pt; }
  .skills b { color: #1f3a6e; }
  .entry { margin-bottom: 5pt; break-inside: avoid; }
  .entry-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12pt; }
  .date { flex: none; color: #555; font-style: italic; font-size: 10pt; }
  ul { margin: 2pt 0 0; padding-left: 20pt; }
  li { margin-bottom: 1pt; }
  li b { color: #333; }
  .links { margin-top: 2pt; font-size: 9pt; }
  .links b { color: #1f3a6e; }
  .muted { color: #555; }
`

/**
 * @param {typeof import('./resume.data.mjs').resume} data
 * @param {{ references?: string[] | null }} options  null/empty -> "available upon request"
 */
export function renderResume(data, { references = null } = {}) {
  const contact = data.contact.map(link).join('<span class="sep">|</span>')

  const skills = data.skills.map(([label, value]) => `<p><b>${escapeHtml(label)}:</b> ${escapeHtml(value)}</p>`).join('')

  const experience = data.experience
    .map(
      (job) => `
      <div class="entry">
        ${entryHeader(`${escapeHtml(job.role)}<span class="bar">|</span><span class="company">${escapeHtml(job.company)}</span>`, job.period)}
        ${bullets(job.bullets)}
      </div>`,
    )
    .join('')

  const projects = data.projects
    .map(
      (project) => `
      <div class="entry">
        ${entryHeader(escapeHtml(project.name), project.period)}
        ${bullets(project.bullets)}
        ${project.links ? `<div class="links"><b>Links:</b> ${project.links.map(link).join(' <span class="muted">|</span> ')}</div>` : ''}
      </div>`,
    )
    .join('')

  const education = data.education
    .map(
      (item) => `
      <div class="entry">
        ${entryHeader(escapeHtml(item.degree), item.period)}
        <div>${escapeHtml(item.school)}</div>
      </div>`,
    )
    .join('')

  const referenceBody = references?.length
    ? bullets(references.map(escapeHtml))
    : '<p class="summary">Available upon request.</p>'

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(data.name)} — Résumé</title>
  <style>${STYLES}</style>
</head>
<body>
  <header>
    <h1>${escapeHtml(data.name)}</h1>
    <div class="title">${escapeHtml(data.title)}</div>
    <div class="contact">${contact}</div>
  </header>
  ${section('Professional Summary', `<p class="summary">${escapeHtml(data.summary)}</p>`)}
  ${section('Core Technical Skills', `<div class="skills">${skills}</div>`)}
  ${section('Professional Experience', experience)}
  ${section('Key Projects', projects)}
  ${section('Education', education)}
  ${section('Certifications & Courses', bullets(data.certifications.map(escapeHtml)))}
  ${section('References', referenceBody)}
</body>
</html>`
}
