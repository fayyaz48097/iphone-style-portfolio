import { linearGradient } from '@/lib/gradient'
import { GRADIENTS } from './brand'

export const educationSection = {
  title: 'Education',
  subtitle: 'Minhaj University Lahore, 2021 to 2025.',
}

/** A `value` shows on the right; items without one get a chevron. */
export const education = [
  {
    id: 'bs-se',
    title: 'BS Software Engineering',
    issuer: 'Minhaj University Lahore',
    value: 'CGPA 3.67',
    icon: { glyph: '🎓', background: linearGradient(150, '#0A84FF', '#0040DD') },
  },
  { id: 'js-2025', title: 'The Complete JavaScript Course 2025', issuer: 'Udemy', icon: { glyph: 'U', background: GRADIENTS.udemy } },
  { id: 'css-sass', title: 'Advanced CSS and Sass', issuer: 'Udemy', icon: { glyph: 'U', background: GRADIENTS.udemy } },
  { id: 'tailwind', title: 'Tailwind CSS From Scratch', issuer: 'Udemy', icon: { glyph: 'U', background: GRADIENTS.udemy } },
  { id: 'php-cms', title: 'PHP for Beginners (CMS project)', issuer: 'Udemy', icon: { glyph: 'U', background: GRADIENTS.udemy } },
  {
    id: 'fcc-js',
    title: 'JavaScript Algorithms and Data Structures',
    issuer: 'freeCodeCamp certificate',
    icon: { glyph: 'fCC', background: linearGradient(150, '#1b1b32', '#0a0a23') },
  },
  { id: 'laravel-mvc', title: 'Laravel MVC Architecture', issuer: 'Code-Step-by-Step', icon: { glyph: 'L', background: GRADIENTS.laravel } },
]
