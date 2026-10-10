import { GRADIENTS } from './brand'

export const journeySection = {
  title: 'Notifications',
  subtitle: 'My career so far, newest first. Tap the stack to expand it.',
}

/** Newest first. `code` is the short label used by the terminal's `experience` command. */
export const experience = [
  {
    id: 'dev-dimensions',
    company: 'Dev Dimensions',
    role: 'Junior Laravel Developer',
    period: 'Now',
    code: '2025 12',
    current: true,
    summary:
      'Scalable Laravel apps on the Action-Repository-Service pattern, RESTful APIs with strict data contracts, and Eloquent query tuning across large modules.',
    icon: { glyph: 'DD', background: GRADIENTS.brand },
  },
  {
    id: 'algo-soft-tech',
    company: 'Algo Soft Tech',
    role: 'React and Laravel Developer',
    period: 'May to Nov 2025',
    code: '2025 05',
    summary: 'Laravel backends and React frontends for two live e-commerce platforms, with authentication and input validation built in.',
    icon: { glyph: 'AS', background: GRADIENTS.orange },
  },
  {
    id: 'innvobyte',
    company: 'Innvobyte',
    role: 'Backend Developer Intern',
    period: 'Feb to Apr 2025',
    code: '2025 02',
    summary: 'Controllers, routes and Eloquent models, plus Blade interfaces wired to backend APIs.',
    icon: { glyph: 'In', background: GRADIENTS.ocean },
  },
  {
    id: 'zaions',
    company: 'Zaions',
    role: 'Web Developer',
    period: 'Feb to Dec 2024',
    code: '2024 02',
    summary:
      'Started as an intern building prototypes, then moved on to data-driven PHP and MySQL apps, reusable modules and faster queries.',
    icon: { glyph: 'Z', background: GRADIENTS.green },
  },
]
