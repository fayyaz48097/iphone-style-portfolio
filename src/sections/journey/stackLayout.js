/** How many cards stay visible behind the front one when collapsed. */
const VISIBLE_DEPTH = 2
/** Vertical peek (px) of each card behind the front one. */
const PEEK = 11
/** Scale step per card of depth. */
const SCALE_STEP = 0.05
/** Card bottom margin, from the stylesheet. */
const CARD_GAP = 12

/**
 * Lays out a list of cards either as a normal list (expanded) or as an iOS
 * notification stack (collapsed): every card is pulled up behind the first one,
 * scaled down a little and peeking out at the bottom.
 *
 * Works on measured DOM positions, so it must run after layout.
 *
 * @param {HTMLElement | null} list
 * @param {boolean} collapsed
 */
export function layoutStack(list, collapsed) {
  const cards = list ? [...list.children] : []
  if (!cards.length) return

  if (!collapsed) {
    list.style.height = ''
    for (const card of cards) {
      card.style.transform = 'none'
      card.style.opacity = '1'
      card.style.zIndex = ''
    }
    return
  }

  const front = cards[0]
  const frontBottom = front.offsetTop + front.offsetHeight

  cards.forEach((card, index) => {
    const depth = Math.min(index, VISIBLE_DEPTH)
    const offset = frontBottom + depth * PEEK - (card.offsetTop + card.offsetHeight)

    card.style.transformOrigin = 'bottom center'
    card.style.transform = `translateY(${offset}px) scale(${1 - depth * SCALE_STEP})`
    card.style.opacity = index > VISIBLE_DEPTH ? '0' : '1'
    card.style.zIndex = String(cards.length - index)
  })

  list.style.height = `${front.offsetHeight + VISIBLE_DEPTH * PEEK + CARD_GAP}px`
}
