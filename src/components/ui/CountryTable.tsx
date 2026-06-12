import { useMemo, useState } from 'react'
import { COUNTRIES } from '../../data/dataset'
import { INDICATOR_LIST, type IndicatorKey } from '../../lib/stats'
import { fmtInt, fmtDec } from '../../lib/format'
import { useChartTheme, colorForIndicator } from '../charts/useChartTheme'

type SortKey = IndicatorKey | 'name'

const meanIdx: Record<IndicatorKey, 0 | 1 | 2 | 3> = { gdp: 0, life: 1, co2: 2, unemp: 3 }

export function CountryTable() {
  const c = useChartTheme()
  const [sort, setSort] = useState<SortKey>('gdp')
  const [dir, setDir] = useState<1 | -1>(-1)

  const ranges = useMemo(() => {
    const r = {} as Record<IndicatorKey, [number, number]>
    for (const ind of INDICATOR_LIST) {
      const m = COUNTRIES.map((co) => co.mean[meanIdx[ind.key]])
      r[ind.key] = [Math.min(...m), Math.max(...m)]
    }
    return r
  }, [])

  const rows = useMemo(() => {
    const arr = [...COUNTRIES]
    arr.sort((a, b) => {
      if (sort === 'name') return dir * a.el.localeCompare(b.el, 'el')
      return dir * (a.mean[meanIdx[sort]] - b.mean[meanIdx[sort]])
    })
    return arr
  }, [sort, dir])

  const click = (k: SortKey) => {
    if (sort === k) setDir((d) => (d === 1 ? -1 : 1))
    else {
      setSort(k)
      setDir(k === 'name' ? 1 : -1)
    }
  }

  const fmtVal = (ind: (typeof INDICATOR_LIST)[number], v: number) =>
    ind.decimals === 0 ? fmtInt(v) : fmtDec(v, ind.decimals)

  return (
    <div className="ctable-wrap">
      <table className="ctable">
        <thead>
          <tr>
            <th className={`ctable__th ctable__th--name ${sort === 'name' ? 'is-sorted' : ''}`} onClick={() => click('name')}>
              Χώρα {sort === 'name' && <span className="ctable__caret">{dir === 1 ? '▲' : '▼'}</span>}
            </th>
            {INDICATOR_LIST.map((ind) => (
              <th
                key={ind.key}
                className={`ctable__th ${sort === ind.key ? 'is-sorted' : ''}`}
                onClick={() => click(ind.key)}
                style={{ ['--th' as string]: `var(${ind.cssVar})` }}
              >
                {ind.short}
                {sort === ind.key && <span className="ctable__caret">{dir === 1 ? '▲' : '▼'}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((co) => (
            <tr key={co.iso}>
              <td className="ctable__name">
                <span className="ctable__iso mono">{co.iso}</span>
                {co.el}
              </td>
              {INDICATOR_LIST.map((ind) => {
                const v = co.mean[meanIdx[ind.key]]
                const [lo, hi] = ranges[ind.key]
                const t = (v - lo) / (hi - lo || 1)
                const col = colorForIndicator(c, ind.key)
                return (
                  <td key={ind.key} className="ctable__cell">
                    <div className="ctable__bar-track">
                      <div className="ctable__bar" style={{ width: `${8 + t * 92}%`, background: col, opacity: 0.28 }} />
                      <span className="ctable__num tnum">{fmtVal(ind, v)}</span>
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ctable__foot mono">
        Μέσοι όροι 25 ετών (2000–2024) ανά χώρα · κλικ σε επικεφαλίδα για ταξινόμηση ·{' '}
        {INDICATOR_LIST.map((i) => `${i.short} (${i.unit})`).join(' · ')}
      </div>
    </div>
  )
}
