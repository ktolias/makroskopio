import { CountUp } from './CountUp'

interface KpiProps {
  value: number
  label: string
  sub?: string
  accent?: 'azure' | 'gdp' | 'life' | 'co2' | 'unemp'
  decimals?: number
  prefix?: string
  suffix?: string
  big?: boolean
}

export function Kpi({ value, label, sub, accent = 'azure', decimals = 0, prefix = '', suffix = '', big }: KpiProps) {
  return (
    <div className={`kpi kpi--${accent} ${big ? 'kpi--big' : ''}`}>
      <div className="kpi__value tnum">
        <CountUp to={value} decimals={decimals} prefix={prefix} suffix={suffix} />
      </div>
      <div className="kpi__label">{label}</div>
      {sub && <div className="kpi__sub">{sub}</div>}
    </div>
  )
}
