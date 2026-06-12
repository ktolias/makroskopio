import { useMemo, useState } from 'react'
import { COUNTRIES } from '../../data/dataset'
import { column, INDICATORS, type IndicatorKey, valueFor } from '../../lib/stats'
import { colorForIndicator, useChartTheme } from './useChartTheme'
import { fmtInt, fmtDec } from '../../lib/format'

interface TileCartogramProps {
  indicator: IndicatorKey
  year: number
}

const ROWS = 7
const COLS = 8

export function TileCartogram({ indicator, year }: TileCartogramProps) {
  const c = useChartTheme()
  const ind = INDICATORS[indicator]
  const base = colorForIndicator(c, indicator)
  const [hover, setHover] = useState<string | null>(null)

  // Global min/max for this indicator across ALL years — keeps colour comparable as the year changes.
  const [lo, hi] = useMemo(() => {
    const col = column(indicator)
    return [Math.min(...col), Math.max(...col)]
  }, [indicator])

  const fmt = (v: number) => (ind.decimals === 0 ? fmtInt(v) : fmtDec(v, ind.decimals))

  const tiles = COUNTRIES.map((co) => {
    const v = valueFor(co.iso, year, indicator)
    const t = v == null ? 0 : (v - lo) / (hi - lo || 1)
    const bg = v == null ? c.heat0 : `color-mix(in srgb, ${base} ${Math.round(14 + t * 80)}%, ${c.heat0})`
    return { co, v, t, bg }
  })

  const ranked = [...tiles].filter((x) => x.v != null).sort((a, b) => (b.v as number) - (a.v as number))
  const top = ranked[0]
  const bottom = ranked[ranked.length - 1]
  const hovered = hover ? tiles.find((x) => x.co.iso === hover) : null

  return (
    <div className="cartogram">
      <div
        className="cartogram__grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
      >
        {tiles.map(({ co, v, bg }) => {
          const strong = hover === co.iso
          const dim = hover && !strong
          return (
            <button
              key={co.iso}
              className={`tile ${strong ? 'is-hover' : ''} ${dim ? 'is-dim' : ''} ${co.iso === top?.co.iso ? 'is-top' : ''}`}
              style={{ gridRow: co.grid[0] + 1, gridColumn: co.grid[1] + 1, background: bg, borderColor: strong ? base : undefined }}
              onMouseEnter={() => setHover(co.iso)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(co.iso)}
              onBlur={() => setHover(null)}
            >
              <span className="tile__iso mono">{co.iso}</span>
              <span className="tile__val tnum">{v == null ? '—' : fmt(v)}</span>
            </button>
          )
        })}
      </div>

      <div className="cartogram__side">
        <div className="cartogram__readout card">
          {hovered && hovered.v != null ? (
            <>
              <div className="cartogram__readout-c">{hovered.co.el}</div>
              <div className="cartogram__readout-v tnum" style={{ color: base }}>
                {fmt(hovered.v)} <em>{ind.unit}</em>
              </div>
              <div className="cartogram__readout-rank mono">
                #{ranked.findIndex((x) => x.co.iso === hovered.co.iso) + 1} / 27 · {year}
              </div>
            </>
          ) : (
            <>
              <div className="cartogram__readout-hint">Δείξε μια χώρα για λεπτομέρειες</div>
              <div className="cartogram__legend">
                <span className="mono">{fmt(lo)}</span>
                <span className="cartogram__legend-bar" style={{ background: `linear-gradient(90deg, ${c.heat0}, ${base})` }} />
                <span className="mono">{fmt(hi)}</span>
              </div>
              <div className="cartogram__extremes">
                {top && (
                  <div>
                    <span className="cartogram__extreme-tag">Υψηλότερη</span>
                    <strong>{top.co.el}</strong> · <span className="tnum">{fmt(top.v as number)}</span>
                  </div>
                )}
                {bottom && (
                  <div>
                    <span className="cartogram__extreme-tag">Χαμηλότερη</span>
                    <strong>{bottom.co.el}</strong> · <span className="tnum">{fmt(bottom.v as number)}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
