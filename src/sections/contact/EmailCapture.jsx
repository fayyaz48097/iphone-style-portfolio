import { useId, useState } from 'react'
import { CheckIcon } from '@/components/icons'
import { cn } from '@/lib/cn'

// mirrors the check in database.rules.json
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const MAX_EMAIL = 120

/**
 * Optional "leave your email" control. Collapsed to a link in the pre-chat hint,
 * shown as a card when it matters (Fayyaz is away / hasn't answered yet), and a
 * confirmation chip once saved, so nobody is asked twice.
 *
 * @param {object} props
 * @param {string | null} props.email   the saved email, if any
 * @param {(email: string) => Promise<boolean>} props.onSave
 * @param {'hint' | 'card'} [props.variant='hint']
 * @param {string} [props.prompt]       card heading
 */
export function EmailCapture({ email, onSave, variant = 'hint', prompt }) {
  const inputId = useId()
  const [expanded, setExpanded] = useState(variant === 'card')
  const [value, setValue] = useState('')
  const [state, setState] = useState('idle') // idle | saving | error

  if (email) {
    return (
      <p className={cn('email-capture__saved', variant === 'card' && 'email-capture__saved--card')}>
        <CheckIcon className="email-capture__check" />
        I'll email you at <b>{email}</b>
      </p>
    )
  }

  if (!expanded) {
    return (
      <button type="button" className="email-capture__toggle" onClick={() => setExpanded(true)}>
        Add your email (optional)
      </button>
    )
  }

  const submit = async (event) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (!EMAIL_PATTERN.test(trimmed)) {
      setState('error')
      return
    }
    setState('saving')
    const saved = await onSave(trimmed).catch(() => false)
    setState(saved ? 'idle' : 'error')
  }

  return (
    <form className={cn('email-capture', variant === 'card' && 'email-capture--card')} onSubmit={submit} noValidate>
      {prompt ? (
        <label className="email-capture__prompt" htmlFor={inputId}>
          {prompt}
        </label>
      ) : (
        <label className="sr-only" htmlFor={inputId}>
          Your email
        </label>
      )}
      <div className="email-capture__row">
        <input
          id={inputId}
          className="email-capture__input"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          maxLength={MAX_EMAIL}
          value={value}
          aria-invalid={state === 'error'}
          onChange={(event) => {
            setValue(event.target.value)
            if (state === 'error') setState('idle')
          }}
        />
        <button type="submit" className="email-capture__save" disabled={state === 'saving' || !value.trim()}>
          {state === 'saving' ? 'Saving…' : 'Save'}
        </button>
      </div>
      {state === 'error' ? <small className="email-capture__error">Please enter a valid email address.</small> : null}
    </form>
  )
}
