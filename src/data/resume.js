import { linearGradient } from '@/lib/gradient'
// written by `npm run resume` alongside the PDF in public/resume
import meta from './resume.meta.json'

const base = import.meta.env.BASE_URL

export const resumeFile = Object.freeze({
  ...meta,
  title: 'Résumé',
  href: `${base}resume/${meta.fileName}`,
  preview: `${base}resume/resume-preview.jpg`,
  icon: { glyph: 'PDF', background: linearGradient(150, '#FF5A5A', '#B3121F'), fontSize: '0.85rem' },
  highlights: ['Laravel 12', 'REST APIs', 'Jira', 'Claude Code'],
})

/** Absolute URL, for places that print the link as text (Siri, terminal). */
export const resumeUrl = () => new URL(resumeFile.href, window.location.origin).href
