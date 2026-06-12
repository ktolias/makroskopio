import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ROWS } from '../../data/dataset'
import { COUNTRIES } from '../../data/dataset'
import { INDICATORS, type IndicatorKey } from '../../lib/stats'
import { colorForIndicator, useChartTheme } from './useChartTheme'
import { TooltipBox } from './ChartTooltip'
import { fmtInt, fmtDec } from '../../lib/format'

interface LineByCountryProps {
  indicator: IndicatorKey
  selected: string[]
  height?: number
}

const elOf = (iso: string) => COUNTRIES.find((c) => c.iso === iso)?.el ?? iso

export function LineByCountry({ indicator, selected, height = 360 }: LineByCountryProps) {
  const c = useChartTheme()
  const ind = INDICATORS[indicator]
  const accent = colorForIndicator(c, indicator)
  const palette = [accent, c.azure, c.gdp, c.unemp, c.co2, c.life, c.azureGlow, c.gdpSoft]
  const fmt = (v: number) => (ind.decimals === 0 ? fmtInt(v) : fmtDec(v, ind.decimals))

  // Pivot to wide format: one object per year with a column per selected country.
  const years = [...new Set(ROWS.map((r) => r[0]))].sort((a, b) => a - b)
  const data = years.map((y) => {
    const obj: Record<string, number> = { year: y }
    for (const iso of selected) {
      const r = ROWS.find((row) => row[0] === y && row[1] === iso)
      if (r) obj[iso] = r[ind.idx] as number
    }
    return obj
  })

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 12, right: 14, bottom: 4, left: -8 }}>
        <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke={c.grid} interval={3} />
        <YAxis tick={{ fontSize: 11 }} stroke={c.grid} tickFormatter={(v) => (ind.idx === 2 ? `${Math.round(v / 1000)}K` : `${v}`)} width={44} />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null
            const sorted = [...payload].sort((a, b) => (b.value as number) - (a.value as number))
            return (
              <TooltipBox
                title={label}
                rows={sorted.map((p) => ({ label: elOf(p.dataKey as string), value: fmt(p.value as number), color: p.color }))}
              />
            )
          }}
        />
        {selected.map((iso, i) => (
          <Line
            key={iso}
            type="monotone"
            dataKey={iso}
            stroke={palette[i % palette.length]}
            strokeWidth={2.2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
