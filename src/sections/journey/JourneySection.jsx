import { Section } from '@/components/layout/Section'
import { SECTION_IDS } from '@/constants'
import { experience, journeySection } from '@/data/experience'
import { NotificationStack } from './NotificationStack'
import './JourneySection.css'

export function JourneySection() {
  return (
    <Section id={SECTION_IDS.journey} heading={journeySection}>
      <NotificationStack items={experience} />
    </Section>
  )
}
