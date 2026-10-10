import { ChatIcon, ClockIcon, CodeIcon, GridIcon, HomeIcon, PersonIcon } from '@/components/icons'
import { SECTION_IDS } from '@/constants'

/**
 * Floating tab bar items.
 * `hideOnMobile` tabs collapse under 620px; their section then highlights `fallback`.
 */
export const tabs = [
  { id: SECTION_IDS.top, label: 'Home', Icon: HomeIcon },
  { id: SECTION_IDS.about, label: 'About', Icon: PersonIcon, hideOnMobile: true, fallback: SECTION_IDS.top },
  { id: SECTION_IDS.work, label: 'Work', Icon: GridIcon },
  { id: SECTION_IDS.build, label: 'Build', Icon: CodeIcon },
  { id: SECTION_IDS.journey, label: 'Journey', Icon: ClockIcon },
  { id: SECTION_IDS.contact, label: 'Chat', Icon: ChatIcon },
]

/** Sections without their own tab borrow a neighbour's. */
export const sectionAliases = {
  [SECTION_IDS.skills]: SECTION_IDS.about,
  [SECTION_IDS.education]: SECTION_IDS.journey,
}

export const sectionOrder = Object.values(SECTION_IDS)
