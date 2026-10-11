import { useLayoutEffect, useRef } from 'react'
import { CloseIcon, ComposeIcon } from '@/components/icons'
import { glass } from '@/components/ui/glass'
import { SIRI_STATUS } from '@/constants'
import { siriContent, siriStatusLabels } from '@/data/siri'
import { cn } from '@/lib/cn'
import { SiriComposer } from './SiriComposer'
import { SiriMessage } from './SiriMessage'
import { SiriOrb } from './SiriOrb'

function Welcome({ onSuggestion }) {
  return (
    <div className="siri-welcome">
      <p className="siri-welcome__title">{siriContent.greeting}</p>
      <p className="siri-welcome__intro">{siriContent.intro}</p>
      <div className="siri-suggestions">
        {siriContent.suggestions.map((suggestion, index) => (
          <button
            key={suggestion}
            type="button"
            className="siri-suggestion"
            style={{ '--i': index }}
            onClick={() => onSuggestion(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

/** The Siri card: header with live status, streaming transcript and composer. */
export function SiriPanel({ id, visible, status, siri, speech, inputRef, footnote, onAsk, onClose }) {
  const transcriptRef = useRef(null)
  const { messages, busy } = siri

  // keep the newest words in view while the answer streams
  useLayoutEffect(() => {
    const transcript = transcriptRef.current
    if (transcript) transcript.scrollTop = transcript.scrollHeight
  }, [messages, speech.transcript])

  const listeningTranscript = status === SIRI_STATUS.listening && speech.transcript

  return (
    <section
      id={id}
      className={cn(glass({ float: true }), 'siri-panel')}
      role="dialog"
      aria-label="Siri"
      aria-hidden={!visible}
      inert={!visible}
    >
      <header className="siri-panel__header">
        <SiriOrb state={status} size="sm" />
        <div className="siri-panel__heading">
          <b className="siri-panel__title">{siriContent.name}</b>
          <span className="siri-panel__status" aria-live="polite">
            {siriStatusLabels[status]}
          </span>
        </div>
        <div className="siri-panel__actions">
          {messages.length ? (
            <button type="button" className="siri-icon-button" aria-label="New conversation" onClick={siri.reset}>
              <ComposeIcon />
            </button>
          ) : null}
          <button type="button" className="siri-icon-button" aria-label="Close Siri" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
      </header>

      <div ref={transcriptRef} className="siri-panel__transcript" aria-live="polite">
        {messages.length ? (
          messages.map((message) => <SiriMessage key={message.id} message={message} />)
        ) : (
          <Welcome onSuggestion={onAsk} />
        )}
        {listeningTranscript ? (
          <p className="siri-message siri-message--user siri-message--interim">{speech.transcript}</p>
        ) : null}
      </div>

      <SiriComposer inputRef={inputRef} busy={busy} speech={speech} onAsk={onAsk} onCancel={siri.cancel} />

      <p className="siri-panel__footnote" role={speech.error ? 'alert' : undefined}>
        {speech.error ?? footnote}
      </p>
    </section>
  )
}
