import { AppIcon } from '@/components/ui/AppIcon'
import { glass } from '@/components/ui/glass'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'

/* ---------- card bodies, one per `variant` ---------- */

function TextBody({ paragraphs }) {
  return paragraphs.map((paragraph) => (
    <p key={paragraph} className="bento-card__paragraph">
      {paragraph}
    </p>
  ))
}

function MetricBody({ value, caption }) {
  return (
    <>
      <div className="bento-card__metric">{value}</div>
      <div className="bento-card__caption">{caption}</div>
    </>
  )
}

function ChecklistBody({ items }) {
  return (
    <ul className="bento-card__checklist">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

function AppRowBody({ icon, heading, caption, children }) {
  return (
    <div className="bento-card__row">
      <AppIcon icon={icon} />
      <div className="bento-card__row-body">
        <h3 className="bento-card__heading">{heading}</h3>
        <div className="bento-card__caption">{caption}</div>
        {children}
      </div>
    </div>
  )
}

function NowPlayingBody(props) {
  return (
    <AppRowBody {...props}>
      <div className="now-playing-bar" aria-hidden="true">
        <i className="now-playing-bar__progress" />
      </div>
    </AppRowBody>
  )
}

const BODIES = {
  text: TextBody,
  metric: MetricBody,
  checklist: ChecklistBody,
  company: AppRowBody,
  nowPlaying: NowPlayingBody,
}

/**
 * One bento widget. Add a new card type by adding a body component to BODIES.
 *
 * @param {object} props
 * @param {object} props.card  an entry from `aboutCards`
 * @param {number} [props.delay] reveal stagger, in seconds
 */
export function BentoCard({ card, delay }) {
  const { variant, size = 'small', title, live, ...content } = card
  const Body = BODIES[variant]

  return (
    <Reveal as="article" delay={delay} className={cn(glass(), 'bento-card', size !== 'small' && `bento-card--${size}`)}>
      <div className="bento-card__title">
        {live ? <i className="bento-card__live-dot" aria-hidden="true" /> : null}
        {title}
      </div>
      {Body ? <Body {...content} /> : null}
    </Reveal>
  )
}
