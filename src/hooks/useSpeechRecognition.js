import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getSpeechRecognition } from '@/lib/speech'

const ERROR_MESSAGES = {
  'not-allowed': 'Microphone access is blocked. Allow it in your browser settings.',
  'service-not-allowed': 'Microphone access is blocked. Allow it in your browser settings.',
  'no-speech': "I didn't hear anything. Try again.",
  'audio-capture': 'No microphone was found.',
  network: 'Voice input needs an internet connection.',
}

/**
 * Single-utterance speech-to-text via the Web Speech API.
 *
 * @param {object} options
 * @param {(transcript: string) => void} options.onResult  called once with the final transcript
 * @param {string} [options.lang='en-US']
 */
export function useSpeechRecognition({ onResult, lang = 'en-US' }) {
  const [supported] = useState(() => Boolean(getSpeechRecognition()))
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState(null)

  const recognition = useRef(null)
  const onResultRef = useRef(onResult)

  useLayoutEffect(() => {
    onResultRef.current = onResult
  })

  const start = useCallback(() => {
    const Recognition = getSpeechRecognition()
    if (!Recognition || recognition.current) return

    const instance = new Recognition()
    instance.lang = lang
    instance.interimResults = true
    instance.continuous = false
    instance.maxAlternatives = 1

    let finalText = ''

    instance.onresult = (event) => {
      let text = ''
      for (const result of event.results) {
        text += result[0].transcript
        if (result.isFinal) finalText = text
      }
      setTranscript(text)
    }

    instance.onerror = (event) => {
      if (event.error !== 'aborted') setError(ERROR_MESSAGES[event.error] ?? 'Voice input stopped unexpectedly.')
    }

    instance.onend = () => {
      recognition.current = null
      setListening(false)
      setTranscript('')
      if (finalText.trim()) onResultRef.current?.(finalText.trim())
    }

    recognition.current = instance
    setError(null)
    setTranscript('')
    setListening(true)
    instance.start()
  }, [lang])

  /** Stops listening and still delivers whatever was heard. */
  const stop = useCallback(() => recognition.current?.stop(), [])

  /** Stops listening and discards the result. */
  const abort = useCallback(() => {
    const instance = recognition.current
    if (!instance) return
    instance.onresult = null
    instance.onend = () => {
      recognition.current = null
      setListening(false)
      setTranscript('')
    }
    instance.abort()
  }, [])

  useEffect(() => abort, [abort])

  return { supported, listening, transcript, error, start, stop, abort }
}
