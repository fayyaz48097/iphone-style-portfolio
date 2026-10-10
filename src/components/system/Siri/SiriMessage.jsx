import { LinkifiedText } from '@/components/ui/LinkifiedText'
import { cn } from '@/lib/cn'

/**
 * One transcript entry. Questions read like Siri's echoed request;
 * answers are cards that stream in with a caret.
 */
export function SiriMessage({ message }) {
  const { role, content, pending, error } = message

  if (role === 'user') return <p className="siri-message siri-message--user">{content}</p>

  if (pending && !content) {
    return (
      <p className="siri-message siri-message--thinking" role="status">
        Thinking…
      </p>
    )
  }

  return (
    <div className={cn('siri-message siri-message--assistant', error && 'siri-message--error')}>
      <LinkifiedText text={content} />
      {pending ? <span className="siri-caret" aria-hidden="true" /> : null}
    </div>
  )
}
