import { resume } from '../resume/resume.data.mjs'
import { seo } from '../seo.config.mjs'

/**
 * Vite plugin: search-engine and social-preview tags, generated at build time.
 *
 * Social robots (LinkedIn, WhatsApp, X, Facebook) don't run JavaScript, so everything
 * they need is written straight into index.html:
 *   - title, description, canonical, robots, theme colours
 *   - Open Graph + Twitter card (with the 1200x630 preview image)
 *   - JSON-LD structured data (Person, WebSite, ProfilePage) for Google
 *   - a <noscript> text version of the profile
 * and robots.txt + sitemap.xml are emitted into the build.
 *
 * Absolute URLs need the site address: VITE_SITE_URL, else SITE_URL, else Vercel's
 * production domain (VERCEL_PROJECT_PRODUCTION_URL, set automatically on Vercel builds).
 */
export function seoPlugin({ env = {} } = {}) {
  const rawSite =
    env.VITE_SITE_URL ||
    env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
  const site = rawSite.replace(/\/+$/, '')
  const absolute = (path) => (site ? `${site}${path}` : path)
  const today = new Date().toISOString().slice(0, 10)

  const sameAs = [
    resume.contact.find((item) => /linkedin\.com/.test(item.href))?.href,
    env.VITE_GITHUB_URL,
  ].filter(Boolean)
  const email = resume.contact.find((item) => item.href.startsWith('mailto:'))?.href

  return {
    name: 'seo',

    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const meta = (attrs) => ({ tag: 'meta', attrs, injectTo: 'head' })
        const link = (attrs) => ({ tag: 'link', attrs, injectTo: 'head' })
        const image = absolute(seo.image.path)

        const tags = [
          meta({ name: 'description', content: seo.description }),
          meta({ name: 'keywords', content: seo.keywords.join(', ') }),
          meta({ name: 'author', content: resume.name }),
          meta({ name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1', 'data-static-robots': true }),
          meta({ name: 'theme-color', media: '(prefers-color-scheme: light)', content: seo.themeColor.light }),
          meta({ name: 'theme-color', media: '(prefers-color-scheme: dark)', content: seo.themeColor.dark }),
          site && link({ rel: 'canonical', href: `${site}/` }),

          // Open Graph (LinkedIn, WhatsApp, Facebook, Slack, Discord…)
          meta({ property: 'og:type', content: 'profile' }),
          meta({ property: 'og:site_name', content: seo.siteName }),
          meta({ property: 'og:title', content: seo.title }),
          meta({ property: 'og:description', content: seo.description }),
          meta({ property: 'og:locale', content: seo.locale }),
          site && meta({ property: 'og:url', content: `${site}/` }),
          meta({ property: 'og:image', content: image }),
          meta({ property: 'og:image:width', content: String(seo.image.width) }),
          meta({ property: 'og:image:height', content: String(seo.image.height) }),
          meta({ property: 'og:image:alt', content: seo.image.alt }),
          meta({ property: 'profile:first_name', content: resume.name.split(' ')[0] }),
          meta({ property: 'profile:last_name', content: resume.name.split(' ').slice(1).join(' ') }),

          // X / Twitter
          meta({ name: 'twitter:card', content: 'summary_large_image' }),
          meta({ name: 'twitter:title', content: seo.title }),
          meta({ name: 'twitter:description', content: seo.description }),
          meta({ name: 'twitter:image', content: image }),
          meta({ name: 'twitter:image:alt', content: seo.image.alt }),

          { tag: 'script', attrs: { type: 'application/ld+json' }, children: jsonLd(), injectTo: 'head' },
          { tag: 'noscript', children: noscriptProfile(), injectTo: 'body-prepend' },
        ].filter(Boolean)

        return { html: html.replace(/<title>[\s\S]*?<\/title>/, `<title data-static-title>${escapeHtml(seo.title)}</title>`), tags }
      },
    },

    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robotsTxt() })
      if (site) this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemapXml() })
      else this.warn('VITE_SITE_URL is not set: skipped sitemap.xml and absolute URLs in social tags')
    },
  }

  /** Structured data: who the site is about, for Google's knowledge features. */
  function jsonLd() {
    const id = (fragment) => `${site}/#${fragment}`
    const currentJob = resume.experience[0]
    const data = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': id('website'),
          ...(site && { url: `${site}/` }),
          name: seo.siteName,
          description: seo.description,
          inLanguage: 'en',
          publisher: { '@id': id('person') },
        },
        {
          '@type': 'ProfilePage',
          '@id': id('profile'),
          ...(site && { url: `${site}/` }),
          name: seo.title,
          dateModified: today,
          isPartOf: { '@id': id('website') },
          mainEntity: { '@id': id('person') },
        },
        {
          '@type': 'Person',
          '@id': id('person'),
          name: resume.name,
          jobTitle: currentJob.role,
          description: resume.summary,
          ...(site && { url: `${site}/`, image: absolute(seo.image.path) }),
          ...(email && { email }),
          sameAs,
          worksFor: { '@type': 'Organization', name: currentJob.company },
          alumniOf: resume.education.map((item) => ({
            '@type': 'CollegeOrUniversity',
            name: item.school.split(' — ')[0],
          })),
          knowsAbout: resume.skills.flatMap(([, value]) => value.split(/,\s*/)).slice(0, 30),
        },
      ],
    }
    // escape "<" so the JSON can never close the <script> tag early
    return JSON.stringify(data).replace(/</g, '\\u003c')
  }

  /** Readable profile for crawlers and visitors without JavaScript. */
  function noscriptProfile() {
    const links = resume.contact
      .map(({ label, href }) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`)
      .join(' · ')
    const jobs = resume.experience
      .map((job) => `<li>${escapeHtml(job.role)}, ${escapeHtml(job.company)} (${escapeHtml(job.period)})</li>`)
      .join('')
    const projects = resume.projects
      .map((project) => `<li><strong>${escapeHtml(project.name)}</strong>: ${escapeHtml(stripHtml(project.bullets[0]))}</li>`)
      .join('')
    return `<main style="max-width:720px;margin:40px auto;padding:0 16px;font-family:system-ui,sans-serif;line-height:1.5">
      <h1>${escapeHtml(resume.name)}: ${escapeHtml(resume.title)}</h1>
      <p>${escapeHtml(resume.summary)}</p>
      <p>${links}</p>
      <h2>Experience</h2><ul>${jobs}</ul>
      <h2>Projects</h2><ul>${projects}</ul>
      <p><a href="/resume/Fayyaz_Ali_Backend_Resume.pdf">Download the résumé (PDF)</a></p>
    </main>`
  }

  function robotsTxt() {
    return [
      'User-agent: *',
      'Allow: /',
      // /admin is NOT disallowed on purpose: crawlers must be able to read its "noindex" to drop it
      'Disallow: /api/',
      '',
      site ? `Sitemap: ${site}/sitemap.xml` : '# Sitemap: set VITE_SITE_URL to publish the sitemap address',
      '',
    ].join('\n')
  }

  function sitemapXml() {
    const url = (loc, priority) =>
      `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${url(`${site}/`, '1.0')}
${url(`${site}/resume/Fayyaz_Ali_Backend_Resume.pdf`, '0.6')}
</urlset>
`
  }
}

const stripHtml = (text) => text.replace(/<[^>]+>/g, '')
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
