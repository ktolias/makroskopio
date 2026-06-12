import { ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts'
import { useChartTheme } from './useChartTheme'
import { TooltipBox } from './ChartTooltip'
import { fmtInt, fmtDec } from '../../lib/format'
import type { Model } from '../../lib/stats'

interface ScatterRegressionProps {
  points: { x: number; y: number; iso: string }[]
  models: { model: Model; color: string; visible: boolean }[]
  height?: number
}

export function ScatterRegression({ points, models, height = 380 }: ScatterRegressionProps) {
  const c = useChartTheme()
  const xMin = Math.min(...points.map((p) => p.x))
  const xMax = Math.max(...points.map((p) => p.x))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 14, right: 16, bottom: 26, left: 4 }}>
        <XAxis
          type="number"
          dataKey="x"
          name="ΑΕΠ/κάτοικο"
          domain={['dataMin', 'dataMax']}
          tickFormatter={(v) => `${Math.round(v / 1000)}K`}
          tick={{ fontSize: 11 }}
          stroke={c.grid}
          label={{ value: 'Κατά κεφαλήν ΑΕΠ (PPP, $)', position: 'insideBottom', offset: -14, fill: c.text3, fontSize: 12 }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Προσδόκιμο ζωής"
          domain={[68, 88]}
          ticks={[68, 72, 76, 80, 84, 88]}
          allowDataOverflow
          tick={{ fontSize: 11 }}
          stroke={c.grid}
          label={{ value: 'Προσδόκιμο ζωής (έτη)', angle: -90, position: 'insideLeft', offset: 16, fill: c.text3, fontSize: 12 }}
        />
        <ZAxis range={[26, 26]} />
        <Tooltip
          cursor={{ stroke: c.grid }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null
            const p = payload[0].payload
            if (p.iso) {
              return (
                <TooltipBox
                  title={p.iso}
                  rows={[
                    { label: 'ΑΕΠ/κάτοικο', value: `${fmtInt(p.x)} $`, color: c.gdp },
                    { label: 'Προσδόκιμο', value: `${fmtDec(p.y, 1)} έτη`, color: c.life },
                  ]}
                />
              )
            }
            return null
          }}
        />
        {/* point cloud */}
        <Scatter data={points} fill={c.azure} fillOpacity={0.42} />
        {/* regression curves drawn as connected scatter lines without markers */}
        {models.map(
          ({ model, color, visible }, i) =>
            visible && (
              <Scatter
                key={i}
                data={model.curve(xMin, xMax, 90).map((d) => ({ x: d.x, y: d.y }))}
                line={{ stroke: color, strokeWidth: 2.6 }}
                lineType="joint"
                shape={() => <g />}
                legendType="none"
                isAnimationActive={false}
              />
            ),
        )}
      </ScatterChart>
    </ResponsiveContainer>
  )
}
