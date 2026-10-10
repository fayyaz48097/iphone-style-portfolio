import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { seo } from '../../../seo.config.mjs'

/**
 * index.html carries build-time <title> and robots tags (scripts/vite-seo.mjs).
 * Remove the ones this page overrides, so the page never has two competing versions.
 */
function useReplaceStaticTags(noIndex) {
  useEffect(() => {
    document.head.querySelector('title[data-static-title]')?.remove()
    if (noIndex) document.head.querySelector('meta[data-static-robots]')?.remove()
  }, [noIndex])
}

/**
 * Per-page head tags at runtime (react-helmet-async).
 *
 * The site-wide tags that link-preview robots need (description, Open Graph, Twitter,
 * structured data) are written into index.html at build time by scripts/vite-seo.mjs.
 * This component only sets what changes per page: the title and, for private pages,
 * a "noindex" robots tag.
 *
 * @param {object} props
 * @param {string} [props.title]    page title; defaults to the site title
 * @param {boolean} [props.noIndex] keep this page out of search results
 */
export function Seo({ title = seo.title, noIndex = false }) {
  useReplaceStaticTags(noIndex)
  return (
    <Helmet>
      <title>{title}</title>
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : null}
    </Helmet>
  )
}
