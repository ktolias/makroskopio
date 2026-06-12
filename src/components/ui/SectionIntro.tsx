import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

export interface Conclusion {
  text: ReactNode
  tone?: 'up' | 'down' | 'neutral' | 'gold'
}

interface SectionIntroProps {
  index: string
  eyebrow: string
  title: string
  lede: ReactNode
  conclusions: Conclusion[]
  panelTitle?: string
}

const toneGlyph: Record<string, string> = { up: '▲', down: '▼', gold: '★', neutral: '◆' }

export function SectionIntro({ index, eyebrow, title, lede, conclusions, panelTitle = 'Βασικά συμπεράσματα' }: SectionIntroProps) {
  return (
    <div className="section-intro">
      <div className="section-intro__lead">
        <Reveal>
          <div className="section-intro__eyebrow">
            <span className="section-intro__idx mono">{index}</span>
            <span className="eyebrow">{eyebrow}</span>
          </div>
          <h2 className="section-intro__title serif">{title}</h2>
          <p className="section-intro__lede">{lede}</p>
        </Reveal>
      </div>
      <Reveal delay={0.12} className="section-intro__panel card">
        <div className="section-intro__panel-h eyebrow">{panelTitle}</div>
        <ul className="section-intro__list">
          {conclusions.map((c, i) => (
            <li key={i} className={`takeaway takeaway--${c.tone ?? 'neutral'}`}>
              <span className="takeaway__glyph">{toneGlyph[c.tone ?? 'neutral']}</span>
              <span>{c.text}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  )
}
