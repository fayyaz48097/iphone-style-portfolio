import { useRef } from 'react'
import { Section } from '@/components/layout/Section'
import { AppIcon } from '@/components/ui/AppIcon'
import { glass } from '@/components/ui/glass'
import { Reveal } from '@/components/ui/Reveal'
import { SECTION_IDS } from '@/constants'
import { buildFlowSection, buildFlowSteps } from '@/data/buildFlow'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/cn'
import { useSettings } from '@/providers/settings/settings-context'
import { usePacketTracker } from './usePacketTracker'
import './BuildFlowSection.css'

export function BuildFlowSection() {
  const { reduceMotion } = useSettings()
  const boxRef = useRef(null)
  const packetRef = useRef(null)
  const iconRefs = useRef([])

  const inView = useInView(boxRef)
  const activeIndex = usePacketTracker(packetRef, iconRefs, inView && !reduceMotion)

  return (
    <Section id={SECTION_IDS.build} heading={buildFlowSection}>
      <Reveal ref={boxRef} className={cn(glass(), 'endpoint-flow')}>
        <ol className="endpoint-flow__steps">
          {buildFlowSteps.map((step, index) => (
            <li
              key={step.id}
              className={cn('endpoint-flow__step', index === activeIndex && 'endpoint-flow__step--active')}
            >
              <AppIcon
                ref={(node) => {
                  iconRefs.current[index] = node
                }}
                className="endpoint-flow__icon"
                size="lg"
                icon={{ glyph: index + 1, background: step.background, color: step.color }}
              />
              <div>
                <b className="endpoint-flow__title">{step.title}</b>
                <small className="endpoint-flow__description">{step.description}</small>
              </div>
            </li>
          ))}
          <li ref={packetRef} className="endpoint-flow__packet" aria-hidden="true" />
        </ol>
      </Reveal>
    </Section>
  )
}
