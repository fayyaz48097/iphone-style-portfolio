import { profile } from '@/data/profile'

export function Footer() {
  return (
    <footer className="px-4 pt-4 pb-32 text-center text-[0.85rem] text-fg-muted">
      {profile.name}, {profile.role.toLowerCase()}. Press <b>/</b> for the terminal.
    </footer>
  )
}
