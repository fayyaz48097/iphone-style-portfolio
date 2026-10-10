import { DocumentIcon, MailIcon, TerminalIcon } from '@/components/icons'
import { OVERLAYS } from '@/constants'
import { mailto } from '@/lib/links'
import { profile } from './profile'

/**
 * Round lock-screen widgets under the tagline.
 * type: 'link' | 'stat' | 'ring' | 'overlay'
 */
export const lockScreenWidgets = [
  { id: 'email', type: 'link', href: mailto(profile.email), label: `Email ${profile.firstName}`, Icon: MailIcon },
  { id: 'resume', type: 'overlay', overlay: OVERLAYS.resume, label: 'View and download résumé', Icon: DocumentIcon },
  { id: 'years', type: 'stat', value: '2+', caption: 'years' },
  { id: 'laravel', type: 'stat', value: 'L12', caption: 'Laravel' },
  { id: 'status', type: 'ring', value: 'Open', caption: 'to work', title: 'Open to new work' },
  { id: 'terminal', type: 'overlay', overlay: OVERLAYS.terminal, label: 'Open terminal', Icon: TerminalIcon },
]
