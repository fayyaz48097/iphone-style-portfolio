import { Fragment } from 'react'
import { externalLinkProps, mailto } from '@/lib/links'

// URLs (without trailing punctuation) and email addresses, captured so split() keeps them.
const LINKABLE = /(https?:\/\/[^\s]*[^\s.,!?;:)]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g

/** Renders plain text with URLs and email addresses turned into links. Safe: never uses innerHTML. */
export function LinkifiedText({ text }) {
  return text.split(LINKABLE).map((part, index) => {
    if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>

    const href = part.startsWith('http') ? part : mailto(part)
    return (
      <a key={index} href={href} {...externalLinkProps(href)}>
        {part}
      </a>
    )
  })
}
