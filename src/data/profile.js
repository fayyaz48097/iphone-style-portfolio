import avatar from '@/assets/images/avatar.jpg'
import portrait from '@/assets/images/portrait.webp'
import { config } from '@/config/env'

export const profile = Object.freeze({
  name: 'Fayyaz Ali',
  firstName: 'Fayyaz',
  role: 'Backend developer',
  headline: 'Laravel and PHP, from database schema to API.',
  tagline: 'I build the part of the app you never see, so the part you do see never breaks.',
  email: config.contactEmail,
  phone: config.contactPhone,
  avatar,
  portrait,
  status: {
    title: 'Available for work',
    subtitle: 'Now building Laravel APIs',
    detail: 'Currently at Dev Dimensions',
  },
  hireSubject: "Let's work together",
  messageSubject: 'Hello from your portfolio',
})
