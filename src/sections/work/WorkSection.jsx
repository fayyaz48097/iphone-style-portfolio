import { Section } from '@/components/layout/Section'
import { GroupList, GroupListItem } from '@/components/ui/GroupList'
import { Pill } from '@/components/ui/Pill'
import { SECTION_IDS } from '@/constants'
import { featuredProject, projects, workSection } from '@/data/projects'
import { TodayCard } from './TodayCard'
import './WorkSection.css'

/** Trailing action: "Open" for live projects, otherwise the year. */
function ProjectAccessory({ project }) {
  if (project.url) {
    return (
      <Pill href={project.url} aria-label={`Open ${project.name}`}>
        Open
      </Pill>
    )
  }
  return <Pill variant="soft">{project.year}</Pill>
}

export function WorkSection() {
  return (
    <Section id={SECTION_IDS.work} heading={workSection}>
      <TodayCard project={featuredProject} />

      <GroupList>
        {projects.map((project) => (
          <GroupListItem
            key={project.id}
            icon={project.icon}
            title={project.name}
            subtitle={project.description}
            accessory={<ProjectAccessory project={project} />}
          />
        ))}
      </GroupList>
    </Section>
  )
}
