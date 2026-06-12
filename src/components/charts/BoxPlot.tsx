import { useMemo, useState } from 'react'
import type { BoxStats } from '../../lib/stats'
import { useChartTheme } from './useChartTheme'

interface BoxPlotProps {
  stats: BoxStats
  color: string
  unit: string
  format: (n: number) => string
  /** override domain (else padded around data) */
  domain?: [number, number]
  height?: number
}

/**
 * Horizontal Tukey box-and-whisker plot rendered as crisp SVG.
 * Whiskers reach the most extreme non-outlier values; outliers shown as dots.
 */
export function BoxPlot({ stats, color, unit, format, domain, height = 132 }: BoxPlotProps) {
  const c = useChartTheme()
  const [hover, setHover] = useState<{ x: number; label: string; value: number } | null>(null)

  const padL = 14, padR = 14
  const W = 760
  const innerW = W - padL - padR
  const lo = domain ? domain[0] : Math.min(stats.min, stats.whiskerLo)
  const hi = domain ? domain[1] : Math.max(stats.max, stats.whiskerHi)
  const pad = (hi - lo) * 0.04
  const d0 = lo - pad
  const d1 = hi + pad
  const sx = (v: number) => padL + ((v - d0) / (d1 - d0)) * innerW

  const midY = height / 2 - 8
  const boxH = 46
  const boxTop = midY - boxH / 2

  const ticks = useMemo(() => {
    const n = 6
    return Array.from({ length: n + 1 }, (_, i) => d0 + ((d1 - d0) * i) / n)
  }, [d0, d1])

  const marker = (v: number, label: string) => (
    <g
      onMouseEnter={() => setHover({ x: sx(v), label, value: v })}
      onMouseLeave={() => setHover(null)}
      style={{ cursor: 'pointer' }}
    />
  )

  return (
    <div className="boxplot">
      <svg viewBox={`0 0 ${W} ${height}`} width="100%" preserveAspectRatio="xMidYMid meet" role="img">
        {/* baseline ticks */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={sx(t)} x2={sx(t)} y1={height - 22} y2={height - 18} stroke={c.grid} />
            <text x={sx(t)} y={height - 6} fontSize={11} fill={c.text3} textAnchor="middle" className="mono">
              {format(t)}
            </text>
          </g>
        ))}

        {/* whisker line */}
        <line x1={sx(stats.whiskerLo)} x2={sx(stats.whiskerHi)} y1={midY} y2={midY} stroke={color} strokeWidth={1.5} opacity={0.5} />
        {/* whisker caps */}
        {[stats.whiskerLo, stats.whiskerHi].map((v, i) => (
          <line key={i} x1={sx(v)} x2={sx(v)} y1={midY - 13} y2={midY + 13} stroke={color} strokeWidth={1.5} opacity={0.7} />
        ))}

        {/* box */}
        <rect
          x={sx(stats.q1)}
          y={boxTop}
          width={sx(stats.q3) - sx(stats.q1)}
          height={boxH}
          rx={7}
          fill={color}
          fillOpacity={0.18}
          stroke={color}
          strokeWidth={1.5}
        />
        {/* median */}
        <line x1={sx(stats.median)} x2={sx(stats.median)} y1={boxTop} y2={boxTop + boxH} stroke={color} strokeWidth={3} />
        {/* mean (dashed) */}
        <line x1={sx(stats.mean)} x2={sx(stats.mean)} y1={boxTop - 4} y2={boxTop + boxH + 4} stroke={c.text2} strokeWidth={1.4} strokeDasharray="3 3" />

        {/* outliers */}
        {stats.outliers.map((v, i) => (
          <circle
            key={i}
            cx={sx(v)}
            cy={midY}
            r={3.4}
            fill={color}
            fillOpacity={0.5}
            stroke={color}
            onMouseEnter={() => setHover({ x: sx(v), label: 'Ακραία τιμή', value: v })}
            onMouseLeave={() => setHover(null)}
          />
        ))}

        {/* invisible hover zones for the five-number summary */}
        {([
          [stats.whiskerLo, 'Κάτω «μουστάκι»'],
          [stats.q1, '1ο τεταρτημόριο (Q1)'],
          [stats.median, 'Διάμεσος'],
          [stats.q3, '3ο τεταρτημόριο (Q3)'],
          [stats.whiskerHi, 'Άνω «μουστάκι»'],
        ] as [number, string][]).map(([v, label], i) => (
          <rect
            key={i}
            x={sx(v) - 8}
            y={boxTop - 6}
            width={16}
            height={boxH + 12}
            fill="transparent"
            onMouseEnter={() => setHover({ x: sx(v), label, value: v })}
            onMouseLeave={() => setHover(null)}
          />
        ))}
        {marker(stats.mean, '')}
      </svg>

      {hover && (
        <div className="boxplot__tip" style={{ left: `${(hover.x / W) * 100}%` }}>
          <span className="boxplot__tip-label">{hover.label}</span>
          <span className="boxplot__tip-value tnum">
            {format(hover.value)} <em>{unit}</em>
          </span>
        </div>
      )}
    </div>
  )
}
