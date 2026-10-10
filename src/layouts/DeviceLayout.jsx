import { Footer } from '@/components/layout/Footer'
import { LiquidFilter } from '@/components/layout/LiquidFilter'
import { Wallpaper } from '@/components/layout/Wallpaper'
import { ControlCentre } from '@/components/system/ControlCentre/ControlCentre'
import { DynamicIsland } from '@/components/system/DynamicIsland/DynamicIsland'
import { PointerFollower } from '@/components/system/PointerFollower/PointerFollower'
import { ResumeSheet } from '@/components/system/ResumeSheet/ResumeSheet'
import { Siri } from '@/components/system/Siri/Siri'
import { TabBar } from '@/components/system/TabBar/TabBar'
import { Terminal } from '@/components/system/Terminal/Terminal'
import { KONAMI_CODE } from '@/constants'
import { useAppActions } from '@/hooks/useAppActions'
import { usePauseWhenHidden, usePointerLightAngle } from '@/hooks/useDocumentEffects'
import { useKeySequence } from '@/hooks/useKeySequence'

/**
 * The "phone": wallpaper, system chrome (island, tab bar, Siri, Control Centre, terminal)
 * and page-wide behaviours. Pages render their sections as children.
 *
 * @param {{ hero?: import('react').ReactNode, children: import('react').ReactNode }} props
 */
export function DeviceLayout({ hero, children }) {
  const { notify, fireConfetti } = useAppActions()

  usePointerLightAngle()
  usePauseWhenHidden()
  useKeySequence(KONAMI_CODE, () => {
    fireConfetti(220)
    notify({ icon: '🕹️', title: 'Cheat code unlocked', subtitle: 'You have great taste in developers', duration: 3000 })
  })

  return (
    <>
      <LiquidFilter />
      <Wallpaper />
      <PointerFollower />
      <DynamicIsland />

      {hero}
      <main>{children}</main>
      <Footer />

      <TabBar />
      <Siri />
      <ControlCentre />
      <ResumeSheet />
      <Terminal />
    </>
  )
}
