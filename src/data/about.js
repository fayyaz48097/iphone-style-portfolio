import { GRADIENTS } from './brand'

export const aboutSection = {
  title: "Hello, I'm Fayyaz",
  subtitle: 'Two years of turning business rules into clean, secure, fast Laravel code.',
}

/**
 * Bento widgets.
 * variant: 'text' | 'company' | 'metric' | 'checklist' | 'nowPlaying'
 * size:    'small' (1x1) | 'wide' (2x1) | 'large' (2x2)
 */
export const aboutCards = [
  {
    id: 'about',
    variant: 'text',
    size: 'large',
    title: 'About',
    paragraphs: [
      'I care about structure. Most of my work follows the Action-Repository-Service pattern, which keeps business logic apart from data access so a codebase stays easy to change a year from now.',
      'APIs get Form Requests, API Resources and DTOs, so the frontend always knows exactly what it will receive. I also write React, which makes me easy to work with on full-stack teams.',
      'I plan and track work in Jira sprints, and use Claude Code as an AI pair programmer, reviewing and testing every change it makes.',
    ],
  },
  {
    id: 'current',
    variant: 'company',
    size: 'wide',
    title: 'Currently',
    live: true,
    icon: { glyph: 'DD', background: GRADIENTS.brand },
    heading: 'Dev Dimensions',
    caption: 'Junior Laravel Developer since Dec 2025',
  },
  { id: 'experience', variant: 'metric', size: 'small', title: 'Experience', value: '2+', caption: 'years building for the web' },
  { id: 'degree', variant: 'metric', size: 'small', title: 'Degree', value: '3.67', caption: 'CGPA, BS Software Engineering' },
  {
    id: 'security',
    variant: 'checklist',
    size: 'wide',
    title: 'Security first',
    items: ['Input validation on every request', 'SQL injection prevention', 'Authentication and access control'],
  },
  {
    id: 'now-playing',
    variant: 'nowPlaying',
    size: 'wide',
    title: 'Now playing',
    icon: { glyph: 'M', background: GRADIENTS.brand },
    heading: 'Moneta billing engine',
    caption: 'Laravel 12 and MySQL',
  },
]
