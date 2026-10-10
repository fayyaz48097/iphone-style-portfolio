import { Section } from '@/components/layout/Section'
import { ActionButton } from '@/components/ui/ActionButton'
import { OVERLAYS, SECTION_IDS } from '@/constants'
import { contactSection } from '@/data/contact'
import { profile } from '@/data/profile'
import { useAppActions } from '@/hooks/useAppActions'
import { mailto, tel } from '@/lib/links'
import { useOverlay } from '@/providers/overlay/overlay-context'
import { ChatWindow } from './ChatWindow'
import './ContactSection.css'

export function ContactSection() {
  const { copyEmail } = useAppActions()
  const { open } = useOverlay()

  return (
    <Section id={SECTION_IDS.contact} heading={contactSection} align="center">
      <ChatWindow />

      <div className="contact-actions">
        <ActionButton variant="primary" href={mailto(profile.email)}>
          Email me
        </ActionButton>
        <ActionButton onClick={() => open(OVERLAYS.resume)}>Résumé</ActionButton>
        <ActionButton onClick={copyEmail}>Copy email</ActionButton>
        <ActionButton href={tel(profile.phone)}>Call</ActionButton>
      </div>
    </Section>
  )
}
