import type { ReactNode } from 'react'

interface Row {
  label: ReactNode
  value: ReactNode
  color?: string
}

export function TooltipBox({ title, rows }: { title?: ReactNode; rows: Row[] }) {
  return (
    <div className="ttip">
      {title != null && <div className="ttip__title">{title}</div>}
      {rows.map((r, i) => (
        <div key={i} className="ttip__row">
          {r.color && <span className="ttip__dot" style={{ background: r.color }} />}
          <span className="ttip__label">{r.label}</span>
          <span className="ttip__value tnum">{r.value}</span>
        </div>
      ))}
    </div>
  )
}
