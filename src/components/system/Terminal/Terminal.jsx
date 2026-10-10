import { useCallback, useEffect, useEffectEvent, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { NOTIFY_DURATION, OVERLAYS } from '@/constants'
import { profile } from '@/data/profile'
import { useAppActions } from '@/hooks/useAppActions'
import { useDialogFocus } from '@/hooks/useDialogFocus'
import { useEventListener } from '@/hooks/useEventListener'
import { useTimers } from '@/hooks/useTimers'
import { isEditableTarget } from '@/lib/browser'
import { cn } from '@/lib/cn'
import { useOverlay } from '@/providers/overlay/overlay-context'
import { useSettings } from '@/providers/settings/settings-context'
import {
  INTRO_LINES,
  SPECIAL,
  SUGGESTIONS,
  createCommands,
  echoPrompt,
  notFound,
  resolveCommand,
} from './commands'
import './Terminal.css'

const INTRO_STAGGER_MS = 260

/** True for "/" or Cmd/Ctrl+K, the shortcuts that summon the terminal. */
const isOpenShortcut = (event) => event.key === '/' || (event.key === 'k' && (event.metaKey || event.ctrlKey))

/** A playful shell that exposes the portfolio as commands. Open with "/" or Cmd/Ctrl+K. */
export function Terminal() {
  const inputId = useId()
  const { isOpen, open, close } = useOverlay()
  const { reduceMotion } = useSettings()
  const actions = useAppActions()
  const { schedule } = useTimers()

  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const outputRef = useRef(null)
  const lineId = useRef(0)
  const history = useRef({ entries: [], index: 0 })
  const greeted = useRef(false)

  const visible = isOpen(OVERLAYS.terminal)
  useDialogFocus(visible, inputRef)

  const commands = useMemo(
    () =>
      createCommands({
        fireConfetti: actions.fireConfetti,
        toggleTheme: () => actions.toggleTheme(),
        openSiri: () => open(OVERLAYS.siri),
        openResume: () => open(OVERLAYS.resume),
      }),
    [actions, open],
  )

  const print = useCallback((content) => {
    lineId.current += 1
    const id = lineId.current
    setLines((current) => [...current, { id, content }])
  }, [])

  const run = (raw) => {
    const text = raw.trim()
    print(echoPrompt(text))
    if (!text) return

    const { entries } = history.current
    entries.push(text)
    history.current.index = entries.length

    const key = resolveCommand(text)
    if (key === SPECIAL.clear) return setLines([])
    if (key === SPECIAL.close) return close()

    const command = commands[key]
    print(command ? command() : notFound(text))
  }

  const onOpened = useEffectEvent(() => {
    actions.notify({ icon: '>_', title: 'Terminal', subtitle: 'Type help to get started', duration: NOTIFY_DURATION.medium })
    if (greeted.current) return
    greeted.current = true
    INTRO_LINES.forEach((line, index) => schedule(() => print(line), reduceMotion ? 0 : index * INTRO_STAGGER_MS))
  })

  useEffect(() => {
    if (visible) onOpened()
  }, [visible])

  useLayoutEffect(() => {
    const output = outputRef.current
    if (output) output.scrollTop = output.scrollHeight
  }, [lines])

  useEventListener(
    'keydown',
    (event) => {
      if (visible || isEditableTarget(document.activeElement) || !isOpenShortcut(event)) return
      event.preventDefault()
      open(OVERLAYS.terminal)
    },
    document,
  )

  const handleKeyDown = (event) => {
    const state = history.current

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      state.index = Math.max(0, state.index - 1)
      setInput(state.entries[state.index] ?? '')
    } else if (event.key === 'ArrowDown') {
      state.index = Math.min(state.entries.length, state.index + 1)
      setInput(state.entries[state.index] ?? '')
    } else if (event.key === 'Tab') {
      event.preventDefault()
      const match = Object.keys(commands).find((name) => name.startsWith(input))
      if (match) setInput(match)
    }
  }

  return (
    <div
      className={cn('terminal', visible && 'terminal--open')}
      role="dialog"
      aria-modal="true"
      aria-label="Interactive terminal"
      aria-hidden={!visible}
      inert={!visible}
      onClick={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <div className="terminal__window">
        <div className="terminal__bar">
          <i className="terminal__light" />
          <i className="terminal__light" />
          <i className="terminal__light" />
          <span className="terminal__title">{profile.firstName.toLowerCase()}@portfolio: ~</span>
          <button type="button" className="terminal__close" onClick={close}>
            Done
          </button>
        </div>

        <div ref={outputRef} className="terminal__output" aria-live="polite">
          {lines.map(({ id, content }) => (
            <div key={id}>{content}</div>
          ))}
        </div>

        <div className="terminal__chips">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className="terminal__chip"
              onClick={() => {
                run(suggestion)
                inputRef.current?.focus()
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>

        <form
          className="terminal__prompt"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault()
            run(input)
            setInput('')
          }}
        >
          <label htmlFor={inputId}>~ $</label>
          <input
            ref={inputRef}
            id={inputId}
            className="terminal__input"
            value={input}
            spellCheck={false}
            autoCapitalize="off"
            aria-label="Type a command"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
          />
        </form>
      </div>
    </div>
  )
}
