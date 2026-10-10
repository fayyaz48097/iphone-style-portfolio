/** Builds a mailto: URL. Uses encodeURIComponent so spaces don't turn into "+" in mail clients. */
export function mailto(email, { subject, body } = {}) {
  const params = Object.entries({ subject, body })
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)

  return `mailto:${email}${params.length ? `?${params.join('&')}` : ''}`
}

/** Builds a tel: URL from a human-formatted phone number. */
export function tel(phone) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export function isExternalUrl(href = '') {
  return /^https?:\/\//i.test(href)
}

/** Props that make an anchor open safely in a new tab when it points off-site. */
export function externalLinkProps(href) {
  return isExternalUrl(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {}
}

/** Navigates the current window (used to hand off to mail and phone apps). */
export function navigateTo(href) {
  window.location.href = href
}
