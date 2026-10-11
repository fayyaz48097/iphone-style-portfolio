import { useEffect, useId, useRef } from 'react'
import { glass } from '@/components/ui/glass'
import { useEventListener } from '@/hooks/useEventListener'
import { cn } from '@/lib/cn'

/**
 * iOS-style alert with a destructive action. Escape or a click outside cancels.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {string} props.title
 * @param {import('react').ReactNode} props.message
 * @param {string} props.confirmLabel
 * @param {boolean} [props.busy]   disables the buttons while the action runs
 * @param {() => void} props.onConfirm
 * @param {() => void} props.onCancel
 */
export function ConfirmDialog({ open, title, message, confirmLabel, busy = false, onConfirm, onCancel }) {
  const titleId = useId()
  const cancelRef = useRef(null)

  // the safe choice gets focus, like iOS
  useEffect(() => {
    if (open) cancelRef.current?.focus()
  }, [open])

  useEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && !busy) onCancel()
    },
    document,
    { enabled: open },
  )

  if (!open) return null

  return (
    <div
      className="admin-dialog"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel()
      }}
    >
      <div className={cn(glass({ float: true }), 'admin-dialog__panel')}>
        <h2 id={titleId} className="admin-dialog__title">
          {title}
        </h2>
        <p className="admin-dialog__message">{message}</p>
        <div className="admin-dialog__actions">
          <button ref={cancelRef} type="button" className="admin-dialog__button" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button
            type="button"
            className="admin-dialog__button admin-dialog__button--destructive"
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Deleting…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
