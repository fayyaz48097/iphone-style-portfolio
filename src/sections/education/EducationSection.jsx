import { Section } from '@/components/layout/Section'
import { GroupList, GroupListItem } from '@/components/ui/GroupList'
import { SECTION_IDS } from '@/constants'
import { education, educationSection } from '@/data/education'

export function EducationSection() {
  return (
    <Section id={SECTION_IDS.education} heading={educationSection}>
      <GroupList>
        {education.map((item) => (
          <GroupListItem key={item.id} icon={item.icon} title={item.title} subtitle={item.issuer} value={item.value} />
        ))}
      </GroupList>
    </Section>
  )
}
