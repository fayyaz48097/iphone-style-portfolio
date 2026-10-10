import { linearGradient } from '@/lib/gradient'
import { GRADIENTS } from './brand'

export const skillsSection = {
  title: 'My home screen',
  subtitle: 'The tools I open every day. Press and hold an icon.',
}

/** Home-screen grid. `icon` is rendered by <AppIcon>. */
export const homeScreenApps = [
  { id: 'laravel', name: 'Laravel 12', icon: { glyph: 'L', background: GRADIENTS.laravel } },
  { id: 'php', name: 'PHP 8+', icon: { glyph: 'php', background: linearGradient(150, '#8D96E6', '#4F5B93') } },
  { id: 'mysql', name: 'MySQL', icon: { glyph: 'SQL', background: GRADIENTS.ocean } },
  {
    id: 'react',
    name: 'React',
    icon: { glyph: '⚛', background: linearGradient(150, '#2B2F3A', '#0E1117'), color: '#61DAFB', fontSize: '1.8rem' },
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: { glyph: 'JS', background: linearGradient(150, '#FFE55C', '#F2C300'), color: '#1b1b1b' },
  },
  { id: 'rest', name: 'REST APIs', icon: { glyph: 'API', background: GRADIENTS.orange } },
  { id: 'eloquent', name: 'Eloquent', icon: { glyph: 'ORM', background: GRADIENTS.pink } },
  { id: 'architecture', name: 'Architecture', icon: { glyph: 'ARS', background: GRADIENTS.violet } },
  {
    id: 'firebase',
    name: 'Firebase',
    icon: { glyph: '🔥', background: linearGradient(150, '#FFCA28', '#F57C00'), fontSize: '1.7rem' },
  },
  { id: 'nginx', name: 'Nginx', icon: { glyph: 'N', background: GRADIENTS.green } },
  {
    id: 'security',
    name: 'Security',
    icon: { glyph: '🔒', background: linearGradient(150, '#6E7BFF', '#2A2FB8'), fontSize: '1.6rem' },
  },
  { id: 'tailwind', name: 'Tailwind', icon: { glyph: 'tw', background: linearGradient(150, '#38BDF8', '#0EA5E9') } },
  { id: 'jira', name: 'Jira', icon: { glyph: 'J', background: linearGradient(150, '#2684FF', '#0052CC') } },
  {
    id: 'claude-code',
    name: 'Claude Code',
    icon: { glyph: '✳', background: linearGradient(150, '#E08B6D', '#C15F3C'), fontSize: '1.7rem' },
  },
]

export const homeScreenDock = [
  { id: 'git', name: 'Git', icon: { glyph: 'git', background: linearGradient(150, '#FF7A50', '#E44D26') } },
  { id: 'github', name: 'GitHub', icon: { glyph: 'GH', background: linearGradient(150, '#3a3a44', '#111') } },
  { id: 'postman', name: 'Postman', icon: { glyph: 'P', background: linearGradient(150, '#FF8A50', '#FF6C37') } },
  { id: 'laragon', name: 'Laragon', icon: { glyph: 'Lg', background: linearGradient(150, '#4FC3F7', '#1565C0') } },
]

export const HOME_SCREEN_PAGES = 3
