import { linearGradient } from '@/lib/gradient'
import { GRADIENTS } from './brand'

export const workSection = {
  title: 'Today',
  subtitle: "What I'm building now, and what I've shipped.",
}

/** App Store "Today" card. */
export const featuredProject = {
  id: 'moneta',
  eyebrow: 'Now building',
  name: 'Moneta',
  summary: 'A utility billing platform for a US client, built to handle government-scale operations.',
  highlights: [
    'Multi-tenant management, ERP integration, inventory tracking and bill calculation engines.',
    'Automated rate calculation for municipal electricity, water and gas, producing precise invoices.',
    'Laravel 12 on the Action-Repository-Service architecture.',
  ],
  category: 'Utility billing',
  terminalNote: 'utility billing platform, multi-tenant, Laravel 12',
  status: 'In progress',
  icon: { glyph: 'M', background: GRADIENTS.brand },
}

/**
 * Shipped projects. A `url` renders an "Open" button, otherwise `year` shows as a soft pill.
 * Projects with a `terminalNote` are listed by the terminal's `projects` command.
 */
export const projects = [
  {
    id: 'max-auto-care',
    name: 'Max Auto Care',
    terminalNote: 'live e-commerce',
    description: 'Live e-commerce for automotive parts. Laravel API, React and Tailwind.',
    url: 'https://maxautocare.com.pk',
    icon: { glyph: 'MAC', background: linearGradient(150, '#FF5A5A', '#B3121F') },
  },
  {
    id: 'saraye',
    name: 'Saraye',
    terminalNote: 'clothing e-commerce, React + Laravel',
    description: 'Clothing e-commerce with a Laravel backend and React storefront.',
    url: 'https://saraye-app-obpp.vercel.app',
    icon: { glyph: 'S', background: linearGradient(150, '#C79A6B', '#7A4E2C') },
  },
  {
    id: 'max-auto-care-admin',
    name: 'Max Auto Care admin',
    description: 'Order, product and business data management in Laravel MVC.',
    year: '2025',
    icon: { glyph: '⚙', background: linearGradient(150, '#555', '#222') },
  },
  {
    id: 'skill-sharing',
    name: 'Skill Sharing App',
    terminalNote: 'gigs, live chat, Gemini chatbot',
    description: 'Gigs, profiles, live chat, a Gemini AI chatbot and Firebase auth.',
    url: 'https://skill-sharing-app.vercel.app',
    icon: { glyph: 'SS', background: linearGradient(150, '#34C759', '#0A7D32') },
  },
  {
    id: 'weather',
    name: 'Weather Forecast',
    terminalNote: 'React + OpenWeatherMap',
    description: 'Real-time forecasts with React and the OpenWeatherMap API.',
    url: 'https://weather-app-self-three-67.vercel.app',
    icon: { glyph: '⛅', background: linearGradient(180, '#5AC8FA', '#1E6FD9'), fontSize: '1.5rem' },
  },
]
