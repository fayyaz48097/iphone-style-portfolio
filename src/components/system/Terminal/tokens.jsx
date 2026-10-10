import { externalLinkProps } from '@/lib/links'

/* Syntax-coloured spans for terminal output. Colours live in Terminal.css (.token-*). */

export const Cmd = ({ children }) => <span className="token-command">{children}</span>
export const Key = ({ children }) => <span className="token-key">{children}</span>
export const Str = ({ children }) => <span className="token-string">{children}</span>
export const Num = ({ children }) => <span className="token-number">{children}</span>
export const Dim = ({ children }) => <span className="token-dim">{children}</span>

export const Link = ({ href, children }) => (
  <a href={href} {...externalLinkProps(href)}>
    {children}
  </a>
)
