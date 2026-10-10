import { useCallback, useEffect, useEffectEvent, useId, useRef } from 'react'
import { MEDIA_QUERIES, OVERLAYS, SIRI_STATUS } from '@/constants'
import { siriContent } from '@/data/siri'
import { useDialogFocus } from '@/hooks/useDialogFocus'
import { useLongPress } from '@/hooks/useLongPress'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'
import { cn } from '@/lib/cn'
import { speak, stopSpeaking } from '@/lib/speech'
import { useOverlay } from '@/providers/overlay/overlay-context'
import { useSettings } from '@/providers/settings/settings-context'
import { siriClient } from '@/services/siri'
import { SiriEdgeGlow } from './SiriEdgeGlow'
import { SiriOrb } from './SiriOrb'
import { SiriPanel } from './SiriPanel'
import { useSiri } from './useSiri'
import './Siri.css'

/**
 * Siri assistant: bottom-right orb, Apple Intelligence edge glow and a chat panel.
 * Tap the orb to open; press and hold it to start talking straight away.
 * The "brain" is pluggable: see src/services/siri.
 */
export function Siri() {
  const panelId = useId()
  const inputRef = useRef(null)
  const longPressed = useRef(false)

  const { isOpen, open, close } = useOverlay()
  const { reduceMotion } = useSettings()
  const finePointer = useMediaQuery(MEDIA_QUERIES.finePointer)
  const visible = isOpen(OVERLAYS.siri)

  const siri = useSiri({ client: siriClient, instant: reduceMotion })
  const { ask: askSiri } = siri

  /** Voice questions get spoken answers, like the real Siri. */
  const ask = useCallback(
    async (text, { voice = false } = {}) => {
      stopSpeaking()
      const reply = await askSiri(text)
      if (voice && reply) speak(reply)
    },
    [askSiri],
  )

  const speech = useSpeechRecognition({ onResult: (text) => ask(text, { voice: true }) })
  const status = speech.listening ? SIRI_STATUS.listening : siri.status

  // auto-focus only with a mouse; on phones it would pop the keyboard over the panel
  useDialogFocus(visible && finePointer, inputRef)

  const onClosed = useEffectEvent(() => {
    speech.abort()
    siri.cancel()
    stopSpeaking()
  })

  useEffect(() => {
    if (!visible) onClosed()
  }, [visible])

  const longPress = useLongPress(() => {
    longPressed.current = true
    open(OVERLAYS.siri)
    if (speech.supported) speech.start()
  })

  const handleLauncherClick = () => {
    if (longPressed.current) {
      longPressed.current = false
      return
    }
    if (visible) close()
    else open(OVERLAYS.siri)
  }

  const footnote = siriClient.name === 'local' ? siriContent.footnote.local : siriContent.footnote.remote

  return (
    <>
      <SiriEdgeGlow active={visible} state={status} />
      <div className={cn('siri-scrim', visible && 'siri-scrim--visible')} onClick={close} aria-hidden="true" />

      <div className={cn('siri', visible && 'siri--open')}>
        <SiriPanel
          id={panelId}
          visible={visible}
          status={status}
          siri={siri}
          speech={speech}
          inputRef={inputRef}
          footnote={footnote}
          onAsk={ask}
          onClose={close}
        />

        <button
          type="button"
          className="siri-launcher"
          aria-label={visible ? 'Close Siri' : 'Open Siri (press and hold to talk)'}
          aria-expanded={visible}
          aria-controls={panelId}
          onClick={handleLauncherClick}
          onContextMenu={(event) => event.preventDefault()}
          {...longPress}
        >
          <SiriOrb state={visible ? status : SIRI_STATUS.idle} size="lg" />
        </button>
      </div>
    </>
  )
}
