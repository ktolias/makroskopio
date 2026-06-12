import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { GDP_TIMESERIES } from '../../data/dataset'
import { useChartTheme } from './useChartTheme'
import { TooltipBox } from './ChartTooltip'
import { fmtInt } from '../../lib/format'

interface ForecastChartProps {
  show: { actual: boolean; ma: boolean; exp: boolean }
  height?: number
}

export function ForecastChart({ show, height = 380 }: ForecastChartProps) {
  const c = useChartTheme()
  const data = GDP_TIMESERIES.map(([year, actual, ma, exp]) => ({ year, actual, ma, exp }))

  const series = [
    { key: 'actual', name: 'Πραγματικός μέσος ΕΕ-27', color: c.azure, on: show.actual, width: 2.8, dash: undefined as string | undefined },
    { key: 'ma', name: 'Κινούμενος μέσος (3 ετών)', color: c.life, on: show.ma, width: 2.4, dash: undefined },
    { key: 'exp', name: 'Εκθετική εξομάλυνση (α=0,3)', color: c.gdp, on: show.exp, width: 2.4, dash: '5 4' },
  ]

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 14, right: 18, bottom: 4, left: 6 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke={c.grid} interval={2} />
        <YAxis
          tick={{ fontSize: 11 }}
          stroke={c.grid}
          domain={[36000, 58000]}
          tickFormatter={(v) => `${Math.round(v / 1000)}K`}
          width={44}
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null
            return (
              <TooltipBox
                title={`Έτος ${label}`}
                rows={payload
                  .filter((p) => p.value != null)
                  .map((p) => ({
                    label: series.find((s) => s.key === p.dataKey)?.name ?? p.dataKey,
                    value: `${fmtInt(p.value as number)} $`,
                    color: p.color,
                  }))}
              />
            )
          }}
        />
        {series.map(
          (s) =>
            s.on && (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={s.width}
                strokeDasharray={s.dash}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
                connectNulls
              />
            ),
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
