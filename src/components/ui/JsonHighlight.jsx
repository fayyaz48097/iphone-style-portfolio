import { Fragment } from 'react'

const indent = (depth) => '  '.repeat(depth)

/** Renders a value as pretty-printed JSON (2-space indent) with syntax-highlight spans. */
function renderValue(value, depth) {
  if (Array.isArray(value)) {
    if (!value.length) return '[]'
    return (
      <>
        {'[\n'}
        {value.map((item, index) => (
          <Fragment key={index}>
            {indent(depth + 1)}
            {renderValue(item, depth + 1)}
            {index < value.length - 1 ? ',' : ''}
            {'\n'}
          </Fragment>
        ))}
        {indent(depth)}]
      </>
    )
  }

  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value)
    if (!entries.length) return '{}'
    return (
      <>
        {'{\n'}
        {entries.map(([key, item], index) => (
          <Fragment key={key}>
            {indent(depth + 1)}
            <span className="token-key">&quot;{key}&quot;</span>: {renderValue(item, depth + 1)}
            {index < entries.length - 1 ? ',' : ''}
            {'\n'}
          </Fragment>
        ))}
        {indent(depth)}
        {'}'}
      </>
    )
  }

  if (typeof value === 'string') return <span className="token-string">&quot;{value}&quot;</span>
  return <span className="token-number">{String(value)}</span>
}

/** Syntax-highlighted JSON. Token colours come from the surrounding stylesheet (.token-*). */
export function JsonHighlight({ value }) {
  return renderValue(value, 0)
}
