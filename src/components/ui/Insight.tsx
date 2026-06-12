import type { ReactNode } from 'react'
import { Reveal } from './Reveal'

interface InsightProps {
  question?: string
  insight: ReactNode
  policy: ReactNode
  delay?: number
}

/** "Εύρημα → Πρόταση" bridge — every finding earns a recommendation. */
export function Insight({ question, insight, policy, delay = 0 }: InsightProps) {
  return (
    <Reveal delay={delay} as="article" className="insight card">
      <div className="insight__col insight__col--finding">
        <div className="insight__tag eyebrow">{question ? `Ερώτημα · ${question}` : 'Εύρημα'}</div>
        <p className="insight__text">{insight}</p>
      </div>
      <div className="insight__arrow" aria-hidden>→</div>
      <div className="insight__col insight__col--policy">
        <div className="insight__tag insight__tag--gold eyebrow">Πρόταση</div>
        <p className="insight__text">{policy}</p>
      </div>
    </Reveal>
  )
}
