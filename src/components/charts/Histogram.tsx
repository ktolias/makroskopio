import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { histogram } from '../../lib/stats'
import { useChartTheme } from './useChartTheme'
import { TooltipBox } from './ChartTooltip'

interface HistogramProps {
  values: number[]
  color: string
  median: number
  mean: number
  format: (n: number) => string
  unit: string
  bins?: number
  height?: number
}

export function Histogram({ values, color, median, mean, format, unit, bins = 24, height = 260 }: HistogramProps) {
  const c = useChartTheme()
  const data = histogram(values, bins)
  const maxCount = Math.max(...data.map((d) => d.count))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 12, right: 8, bottom: 4, left: -18 }} barCategoryGap={1}>
        <XAxis
          dataKey="mid"
          tickFormatter={(v) => format(v)}
          tick={{ fontSize: 11 }}
          interval={Math.ceil(bins / 6)}
          stroke={c.grid}
        />
        <YAxis tick={{ fontSize: 11 }} stroke={c.grid} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const d = payload[0].payload as (typeof data)[number]
            return (
              <TooltipBox
                title={`${format(d.x0)} – ${format(d.x1)} ${unit}`}
                rows={[{ label: 'Παρατηρήσεις', value: d.count, color }]}
              />
            )
          }}
        />
        <ReferenceLine x={mean} stroke={c.text2} strokeDasharray="3 3" strokeWidth={1.2} />
        <ReferenceLine x={median} stroke={color} strokeWidth={2} />
        <Bar dataKey="count" radius={[3, 3, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={color} fillOpacity={0.35 + 0.5 * (d.count / maxCount)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
