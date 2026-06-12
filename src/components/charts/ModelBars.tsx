import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useChartTheme } from './useChartTheme'
import { fmtDec } from '../../lib/format'

interface ModelBarsProps {
  metric: 'r2' | 'mae' | 'mse'
  data: { name: string; r2: number; mae: number; mse: number }[]
  height?: number
}

const META = {
  r2: { label: 'R² — όσο υψηλότερο, τόσο καλύτερο', better: 'high' as const },
  mae: { label: 'MAE — όσο χαμηλότερο, τόσο καλύτερο', better: 'low' as const },
  mse: { label: 'MSE — όσο χαμηλότερο, τόσο καλύτερο', better: 'low' as const },
}

export function ModelBars({ metric, data, height = 230 }: ModelBarsProps) {
  const c = useChartTheme()
  const meta = META[metric]
  const vals = data.map((d) => d[metric])
  const best = meta.better === 'high' ? Math.max(...vals) : Math.min(...vals)

  return (
    <div>
      <div className="modelbars__cap mono">{meta.label}</div>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 48, bottom: 4, left: 4 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={140} stroke={c.grid} />
          <Bar dataKey={metric} radius={[0, 6, 6, 0]} barSize={26}>
            {data.map((d, i) => (
              <Cell key={i} fill={d[metric] === best ? c.life : c.azure} fillOpacity={d[metric] === best ? 0.95 : 0.5} />
            ))}
            <LabelList
              dataKey={metric}
              position="right"
              formatter={(v: number) => (metric === 'mse' && v > 1000 ? Math.round(v).toLocaleString('el-GR') : fmtDec(v, metric === 'r2' ? 3 : 2))}
              className="mono"
              fill={c.text2}
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
