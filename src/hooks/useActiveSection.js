import { useEffect, useState } from 'react'

/**
 * Scroll-spy: returns the id of the section crossing the middle band of the viewport.
 *
 * @param {string[]} ids          section element ids, in document order
 * @param {object} [options]
 * @param {Record<string,string>} [options.aliases]  map a section id onto another (e.g. skills -> about)
 * @param {string} [options.rootMargin]
 */
export function useActiveSection(ids, { aliases = {}, rootMargin = '-45% 0px -50% 0px' } = {}) {
  const [active, setActive] = useState(ids[0])
  const idsKey = ids.join('|')
  const aliasesKey = JSON.stringify(aliases)

  useEffect(() => {
    const aliasMap = JSON.parse(aliasesKey)
    const sections = idsKey
      .split('|')
      .map((id) => document.getElementById(id))
      .filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(aliasMap[entry.target.id] ?? entry.target.id)
        }
      },
      { rootMargin },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [idsKey, aliasesKey, rootMargin])

  return active
}
