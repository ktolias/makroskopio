import { useState } from 'react'
import { correlationMatrix, INDICATOR_LIST, N_OBS, pearsonPValue, sigStars } from '../../lib/stats'
import { useChartTheme } from './useChartTheme'
import { fmtDec } from '../../lib/format'

function pLabel(p: number): string {
  return p < 0.001 ? 'p < 0,001' : `p = ${fmtDec(p, 3)}`
}

/** Diverging colour for a correlation in [-1, 1]: jade (+) ↔ coral (−). */
function corrColor(r: number, c: ReturnType<typeof useChartTheme>): string {
  const t = Math.min(Math.abs(r), 1)
  const base = r >= 0 ? c.life : c.co2
  // blend base toward the heat background by strength
  return `color-mix(in srgb, ${base} ${Math.round(18 + t * 72)}%, ${c.heat0})`
}

export function CorrelationHeatmap() {
  const c = useChartTheme()
  const m = correlationMatrix()
  const labels = INDICATOR_LIST.map((i) => i.short)
  const [hover, setHover] = useState<[number, number] | null>(null)

  return (
    <div className="heatmap">
      <div className="heatmap__grid" style={{ gridTemplateColumns: `minmax(0,1.2fr) repeat(${labels.length}, minmax(0, 1fr))` }}>
        <div className="heatmap__corner" />
        {labels.map((l, j) => (
          <div key={j} className="heatmap__colh">{l}</div>
        ))}
        {m.map((row, i) => (
          <div key={i} className="heatmap__row" style={{ display: 'contents' }}>
            <div className="heatmap__rowh">{labels[i]}</div>
            {row.map((r, j) => {
              const isDiag = i === j
              const strong = Math.abs(r) >= 0.5
              const p = pearsonPValue(r, N_OBS)
              const stars = sigStars(p)
              return (
                <div
                  key={j}
                  className={`heatmap__cell ${isDiag ? 'is-diag' : ''} ${hover && (hover[0] === i || hover[1] === j) ? 'is-axis' : ''}`}
                  style={{ background: isDiag ? 'transparent' : corrColor(r, c) }}
                  onMouseEnter={() => setHover([i, j])}
                  onMouseLeave={() => setHover(null)}
                  title={isDiag ? labels[i] : `${labels[i]} × ${labels[j]} · r = ${fmtDec(r, 3)} · ${pLabel(p)} (${stars})`}
                >
                  <span className={`heatmap__val tnum ${strong && !isDiag ? 'is-strong' : ''}`}>
                    {isDiag ? '1' : fmtDec(r, 2)}
                  </span>
                  {!isDiag && (
                    <span className={`heatmap__sig ${stars === 'n.s.' ? 'is-ns' : ''}`}>{stars}</span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div className="heatmap__legend">
        <span>−1</span>
        <span className="heatmap__bar" style={{ background: `linear-gradient(90deg, ${c.co2}, ${c.heat0}, ${c.life})` }} />
        <span>+1</span>
        <span className="heatmap__legend-note">Pearson r · 675 παρατηρήσεις</span>
      </div>
      <div className="heatmap__sig-legend mono">
        <span><strong>***</strong> p&lt;0,001</span>
        <span><strong>**</strong> p&lt;0,01</span>
        <span><strong>*</strong> p&lt;0,05</span>
        <span className="is-ns"><strong>n.s.</strong> μη σημαντική</span>
        <span className="heatmap__sig-note">Έλεγχος t δύο όψεων, df = 673</span>
      </div>
    </div>
  )
}
