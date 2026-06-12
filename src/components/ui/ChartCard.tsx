import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface ChartCardProps {
  title: string
  subtitle?: string
  source?: string
  /** The analytical narrative — every chart earns a reading. */
  narrative: ReactNode
  takeaway?: ReactNode
  children: ReactNode
  wide?: boolean
  delay?: number
  /** Place the narrative beside the chart instead of below. */
  side?: boolean
  controls?: ReactNode
  figureLabel?: string
}

export function ChartCard({
  title, subtitle, source, narrative, takeaway, children, wide, delay = 0, side, controls, figureLabel,
}: ChartCardProps) {
  return (
    <Reveal delay={delay} as="article" className={`chart-card card ${wide ? 'chart-card--wide' : ''} ${side ? 'chart-card--side' : ''}`}>
      <div className="chart-card__main">
        <header className="chart-card__head">
          <div>
            {figureLabel && <div className="chart-card__figlabel mono">{figureLabel}</div>}
            <h3 className="chart-card__title">{title}</h3>
            {subtitle && <p className="chart-card__subtitle">{subtitle}</p>}
          </div>
          {controls && <div className="chart-card__controls">{controls}</div>}
        </header>
        <div className="chart-card__viz">{children}</div>
        {source && <div className="chart-card__source">{source}</div>}
      </div>
      <div className="chart-card__aside">
        <div className="chart-card__narr-label eyebrow">Ανάγνωση</div>
        <div className="chart-card__narrative">{narrative}</div>
        {takeaway && (
          <div className="chart-card__takeaway">
            <span className="chart-card__takeaway-mark">→</span>
            <span>{takeaway}</span>
          </div>
        )}
      </div>
    </Reveal>
  )
}
