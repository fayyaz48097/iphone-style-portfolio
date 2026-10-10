import { useState } from 'react'
import { ArrowUpIcon, MicIcon, StopIcon } from '@/components/icons'
import { siriContent } from '@/data/siri'
import { cn } from '@/lib/cn'

const MAX_LENGTH = 500

/**
 * "Type to Siri" field. Like iOS, the trailing button changes with context:
 * stop while answering, send when there's text, otherwise the microphone.
 */
export function SiriComposer({ inputRef, busy, speech, onAsk, onCancel }) {
  const [draft, setDraft] = useState('')
  const hasDraft = draft.trim().length > 0

  // a new question while Siri is answering interrupts the current answer
  const submit = (event) => {
    event.preventDefault()
    if (!hasDraft) return
    onAsk(draft)
    setDraft('')
  }

  let action
  if (busy && !hasDraft) {
    action = (
      <button type="button" className="siri-composer__button" aria-label="Stop answering" onClick={onCancel}>
        <StopIcon />
      </button>
    )
  } else if (hasDraft || !speech.supported) {
    action = (
      <button type="submit" className="siri-composer__button" aria-label="Ask Siri" disabled={!hasDraft}>
        <ArrowUpIcon />
      </button>
    )
  } else {
    action = (
      <button
        type="button"
        className={cn(
          'siri-composer__button',
          speech.listening ? 'siri-composer__button--listening' : 'siri-composer__button--mic',
        )}
        aria-label={speech.listening ? 'Stop listening' : 'Speak to Siri'}
        aria-pressed={speech.listening}
        onClick={speech.listening ? speech.stop : speech.start}
      >
        <MicIcon />
      </button>
    )
  }

  return (
    <form className="siri-composer" autoComplete="off" onSubmit={submit}>
      <input
        ref={inputRef}
        className="siri-composer__input"
        placeholder={speech.listening ? 'Listening…' : siriContent.placeholder}
        aria-label="Type to Siri"
        maxLength={MAX_LENGTH}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
      />
      {action}
    </form>
  )
}
