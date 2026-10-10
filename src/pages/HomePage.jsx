import { DeviceLayout } from '@/layouts/DeviceLayout'
import { AboutSection } from '@/sections/about/AboutSection'
import { BuildFlowSection } from '@/sections/build-flow/BuildFlowSection'
import { ContactSection } from '@/sections/contact/ContactSection'
import { EducationSection } from '@/sections/education/EducationSection'
import { HeroSection } from '@/sections/hero/HeroSection'
import { JourneySection } from '@/sections/journey/JourneySection'
import { SkillsSection } from '@/sections/skills/SkillsSection'
import { WorkSection } from '@/sections/work/WorkSection'

export function HomePage() {
  return (
    // the home page's title and meta tags are written into index.html at build time (scripts/vite-seo.mjs)
    <DeviceLayout hero={<HeroSection />}>
      <AboutSection />
      <SkillsSection />
      <WorkSection />
      <BuildFlowSection />
      <JourneySection />
      <EducationSection />
      <ContactSection />
    </DeviceLayout>
  )
}
