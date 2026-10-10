import { AppIcon } from '@/components/ui/AppIcon'
import { glass } from '@/components/ui/glass'
import { Pill } from '@/components/ui/Pill'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'

const BAR_COUNT = 4

/** App Store "Today" editorial card for the featured project. */
export function TodayCard({ project }) {
  const { eyebrow, name, summary, highlights, category, status, icon } = project

  return (
    <Reveal as="article" className={cn(glass(), 'today-card')}>
      <div className="today-card__art">
        <div className="today-card__bars" aria-hidden="true">
          {Array.from({ length: BAR_COUNT }, (_, index) => (
            <b key={index} className="today-card__bar" />
          ))}
        </div>
        <div className="today-card__eyebrow">{eyebrow}</div>
        <h3 className="today-card__title">{name}</h3>
        <p className="today-card__summary">{summary}</p>
      </div>

      <div className="today-card__info">
        <ul className="today-card__highlights">
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>

        <div className="today-card__footer">
          <AppIcon icon={icon} size="sm" />
          <div>
            <b className="today-card__app-name">{name}</b>
            <small className="today-card__app-category">{category}</small>
          </div>
          <Pill variant="soft">{status}</Pill>
        </div>
      </div>
    </Reveal>
  )
}
