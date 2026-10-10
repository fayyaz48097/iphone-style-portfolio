import { Section } from '@/components/layout/Section'
import { SECTION_IDS } from '@/constants'
import { aboutCards, aboutSection } from '@/data/about'
import { BentoCard } from './BentoCard'
import './AboutSection.css'

/** Reveal stagger: first card immediately, then 0.08s, 0.14s, 0.20s... */
const staggerDelay = (index) => (index ? 0.02 + index * 0.06 : 0)

export function AboutSection() {
  return (
    <Section id={SECTION_IDS.about} heading={aboutSection} flushTop={false}>
      <div className="bento">
        {aboutCards.map((card, index) => (
          <BentoCard key={card.id} card={card} delay={staggerDelay(index)} />
        ))}
      </div>
    </Section>
  )
}
