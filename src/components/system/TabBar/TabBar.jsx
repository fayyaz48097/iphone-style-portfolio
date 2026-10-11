import { useEffect, useRef, useState } from 'react'
import { SlidersIcon } from '@/components/icons'
import { glass } from '@/components/ui/glass'
import { OVERLAYS } from '@/constants'
import { sectionAliases, sectionOrder, tabs } from '@/data/navigation'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useEventListener } from '@/hooks/useEventListener'
import { useScrollCompact } from '@/hooks/useScrollCompact'
import { isRendered } from '@/lib/browser'
import { cn } from '@/lib/cn'
import { useOverlay } from '@/providers/overlay/overlay-context'
import { useIndicator } from './useIndicator'
import './TabBar.css'

/** Matches the width/padding transition in TabBar.css, so we re-measure once it settles. */
const COMPACT_SETTLE_MS = 470

/** Floating Liquid Glass tab bar with scroll-spy and the Control Centre button. */
export function TabBar() {
  const { isOpen, toggle } = useOverlay()
  const compact = useScrollCompact()
  const activeSection = useActiveSection(sectionOrder, { aliases: sectionAliases })

  const itemRefs = useRef(new Map())
  const [activeTabId, setActiveTabId] = useState(tabs[0].id)
  const [activeElement, setActiveElement] = useState(null)
  const { barRef, indicatorRef, realign } = useIndicator(activeElement)

  // Map the visible section onto a rendered tab (some tabs are hidden on phones).
  useEffect(() => {
    const tab = tabs.find(({ id }) => id === activeSection)
    if (!tab) return
    const id = isRendered(itemRefs.current.get(tab.id)) ? tab.id : tab.fallback
    if (!id) return
    setActiveTabId(id)
    setActiveElement(itemRefs.current.get(id))
  }, [activeSection])

  useEffect(() => {
    const timer = window.setTimeout(realign, COMPACT_SETTLE_MS)
    return () => window.clearTimeout(timer)
  }, [compact, realign])

  useEventListener('resize', realign)

  useEffect(() => {
    document.fonts?.ready.then(realign)
  }, [realign])

  const controlCentreOpen = isOpen(OVERLAYS.controlCentre)

  return (
    <div className={cn('tab-dock', compact && 'tab-dock--compact')}>
      <nav ref={barRef} className={cn(glass({ float: true }), 'tab-bar')} aria-label="Sections">
        <span ref={indicatorRef} className="tab-bar__indicator" aria-hidden="true" />
        {tabs.map(({ id, label, Icon, hideOnMobile }) => (
          <a
            key={id}
            ref={(node) => {
              if (node) itemRefs.current.set(id, node)
              else itemRefs.current.delete(id)
            }}
            href={`#${id}`}
            className={cn(
              'tab-bar__item',
              id === activeTabId && 'tab-bar__item--active',
              hideOnMobile && 'tab-bar__item--optional',
            )}
            aria-current={id === activeTabId ? 'true' : undefined}
          >
            <Icon />
            <span className="tab-bar__label">{label}</span>
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={cn(glass({ float: true }), 'control-centre-toggle')}
        aria-label="Open control centre"
        aria-expanded={controlCentreOpen}
        onClick={() => toggle(OVERLAYS.controlCentre)}
      >
        <SlidersIcon />
      </button>
    </div>
  )
}
