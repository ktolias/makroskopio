import { ROWS, type Row } from '../data/dataset'

/** The four indicators, indexed by their position in a Row (2..5). */
export type IndicatorKey = 'gdp' | 'life' | 'co2' | 'unemp'

export interface Indicator {
  key: IndicatorKey
  idx: 2 | 3 | 4 | 5
  short: string
  label: string
  unit: string
  /** CSS custom-property name for this indicator's colour. */
  cssVar: string
  decimals: number
  /** Higher value = better outcome? (drives map colour direction & framing) */
  higherIsBetter: boolean
}

export const INDICATORS: Record<IndicatorKey, Indicator> = {
  gdp: {
    key: 'gdp', idx: 2, short: 'ΑΕΠ/κάτοικο', label: 'Κατά κεφαλήν ΑΕΠ (PPP)',
    unit: 'σταθ. $ 2021', cssVar: '--c-gdp', decimals: 0, higherIsBetter: true,
  },
  life: {
    key: 'life', idx: 3, short: 'Προσδόκιμο ζωής', label: 'Προσδόκιμο ζωής στη γέννηση',
    unit: 'έτη', cssVar: '--c-life', decimals: 1, higherIsBetter: true,
  },
  co2: {
    key: 'co2', idx: 4, short: 'Εκπομπές CO₂', label: 'Εκπομπές CO₂ ανά κάτοικο',
    unit: 't CO₂e/κάτοικο', cssVar: '--c-co2', decimals: 2, higherIsBetter: false,
  },
  unemp: {
    key: 'unemp', idx: 5, short: 'Ανεργία', label: 'Ποσοστό ανεργίας',
    unit: '% εργατικού δυναμικού', cssVar: '--c-unemp', decimals: 1, higherIsBetter: false,
  },
}

export const INDICATOR_LIST: Indicator[] = [INDICATORS.gdp, INDICATORS.life, INDICATORS.co2, INDICATORS.unemp]

export const YEARS: number[] = [...new Set(ROWS.map((r) => r[0]))].sort((a, b) => a - b)
export const YEAR_MIN = YEARS[0]
export const YEAR_MAX = YEARS[YEARS.length - 1]

export function column(key: IndicatorKey): number[] {
  const i = INDICATORS[key].idx
  return ROWS.map((r) => r[i] as number)
}

export function rowsForYear(year: number): Row[] {
  return ROWS.filter((r) => r[0] === year)
}

export function valueFor(iso: string, year: number, key: IndicatorKey): number | undefined {
  const i = INDICATORS[key].idx
  const r = ROWS.find((row) => row[0] === year && row[1] === iso)
  return r ? (r[i] as number) : undefined
}

export function seriesForCountry(iso: string, key: IndicatorKey): { year: number; value: number }[] {
  const i = INDICATORS[key].idx
  return ROWS.filter((r) => r[1] === iso).map((r) => ({ year: r[0], value: r[i] as number }))
}

/* ---------- Distribution statistics ---------- */

/** Excel PERCENTILE.INC — linear interpolation between order statistics. */
export function quantile(sorted: number[], p: number): number {
  const n = sorted.length
  const idx = p * (n - 1)
  const lo = Math.floor(idx)
  const hi = Math.ceil(idx)
  if (lo === hi) return sorted[lo]
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo)
}

export interface BoxStats {
  n: number
  min: number
  q1: number
  median: number
  q3: number
  max: number
  iqr: number
  whiskerLo: number
  whiskerHi: number
  mean: number
  sd: number
  outliers: number[]
}

export function boxStats(values: number[]): BoxStats {
  const s = [...values].sort((a, b) => a - b)
  const n = s.length
  const q1 = quantile(s, 0.25)
  const median = quantile(s, 0.5)
  const q3 = quantile(s, 0.75)
  const iqr = q3 - q1
  const loFence = q1 - 1.5 * iqr
  const hiFence = q3 + 1.5 * iqr
  const inFence = s.filter((v) => v >= loFence && v <= hiFence)
  const outliers = s.filter((v) => v < loFence || v > hiFence)
  const mean = s.reduce((a, b) => a + b, 0) / n
  const variance = s.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1)
  return {
    n,
    min: s[0],
    q1,
    median,
    q3,
    max: s[n - 1],
    iqr,
    whiskerLo: inFence[0],
    whiskerHi: inFence[inFence.length - 1],
    mean,
    sd: Math.sqrt(variance),
    outliers,
  }
}

/** Histogram bins (count) for a numeric column. */
export function histogram(values: number[], bins = 22): { x0: number; x1: number; mid: number; count: number }[] {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const w = (max - min) / bins || 1
  const out = Array.from({ length: bins }, (_, i) => ({
    x0: min + i * w,
    x1: min + (i + 1) * w,
    mid: min + (i + 0.5) * w,
    count: 0,
  }))
  for (const v of values) {
    let b = Math.floor((v - min) / w)
    if (b >= bins) b = bins - 1
    if (b < 0) b = 0
    out[b].count++
  }
  return out
}

/* ---------- Correlation ---------- */

export function pearson(xs: number[], ys: number[]): number {
  const n = xs.length
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  let sxy = 0, sxx = 0, syy = 0
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx
    const dy = ys[i] - my
    sxy += dx * dy
    sxx += dx * dx
    syy += dy * dy
  }
  return sxy / Math.sqrt(sxx * syy)
}

export function correlationMatrix(): number[][] {
  const cols = (['gdp', 'life', 'co2', 'unemp'] as IndicatorKey[]).map(column)
  return cols.map((a) => cols.map((b) => pearson(a, b)))
}

/** Standard normal CDF via the Abramowitz–Stegun erf approximation. */
function normCdf(z: number): number {
  const x = Math.abs(z) / Math.SQRT2
  const t = 1 / (1 + 0.3275911 * x)
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x)
  const erf = z >= 0 ? y : -y
  return 0.5 * (1 + erf)
}

/**
 * Two-tailed p-value for a Pearson r given sample size n.
 * Uses t = r·√((n−2)/(1−r²)); with df = n−2 = 673 the t-distribution ≈ standard normal.
 */
export function pearsonPValue(r: number, n: number): number {
  if (Math.abs(r) >= 1) return 0
  const t = Math.abs(r) * Math.sqrt((n - 2) / (1 - r * r))
  return Math.min(1, 2 * (1 - normCdf(t)))
}

/** Significance stars: *** p<0.001 · ** p<0.01 · * p<0.05 · n.s. otherwise. */
export function sigStars(p: number): string {
  if (p < 0.001) return '***'
  if (p < 0.01) return '**'
  if (p < 0.05) return '*'
  return 'n.s.'
}

export const N_OBS = ROWS.length

/* ---------- Regression models ---------- */

export interface FitMetrics {
  r2: number
  mae: number
  mse: number
}

export interface Model {
  name: string
  predict: (x: number) => number
  metrics: FitMetrics
  /** Sampled curve for plotting. */
  curve: (xMin: number, xMax: number, steps?: number) => { x: number; y: number }[]
}

function metricsOf(pred: number[], act: number[]): FitMetrics {
  const n = act.length
  const am = act.reduce((a, b) => a + b, 0) / n
  let ssr = 0, sst = 0, sae = 0
  for (let i = 0; i < n; i++) {
    const e = pred[i] - act[i]
    ssr += e * e
    sae += Math.abs(e)
    sst += (act[i] - am) ** 2
  }
  return { r2: 1 - ssr / sst, mae: sae / n, mse: ssr / n }
}

function sample(predict: (x: number) => number, xMin: number, xMax: number, steps = 80) {
  const out: { x: number; y: number }[] = []
  for (let i = 0; i <= steps; i++) {
    const x = xMin + ((xMax - xMin) * i) / steps
    out.push({ x, y: predict(x) })
  }
  return out
}

export function linearModel(xs: number[], ys: number[]): Model {
  const n = xs.length
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  let num = 0, den = 0
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my)
    den += (xs[i] - mx) ** 2
  }
  const b = num / den
  const a = my - b * mx
  const predict = (x: number) => a + b * x
  return {
    name: 'Γραμμική',
    predict,
    metrics: metricsOf(xs.map(predict), ys),
    curve: (lo, hi, s) => sample(predict, lo, hi, s),
  }
}

export function logModel(xs: number[], ys: number[]): Model {
  const lx = xs.map((x) => Math.log(x))
  const lin = linearModel(lx, ys)
  const predict = (x: number) => lin.predict(Math.log(x))
  return {
    name: 'Λογαριθμική',
    predict,
    metrics: metricsOf(xs.map(predict), ys),
    curve: (lo, hi, s) => sample(predict, lo, hi, s),
  }
}

/** Polynomial degree-2 fit via normal equations + Gaussian elimination. */
export function poly2Model(xs: number[], ys: number[]): Model {
  const S = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  const T = [0, 0, 0]
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i]
    const basis = [1, x, x * x]
    for (let r = 0; r < 3; r++) {
      T[r] += basis[r] * ys[i]
      for (let c = 0; c < 3; c++) S[r][c] += basis[r] * basis[c]
    }
  }
  const M = S.map((row, i) => [...row, T[i]])
  for (let col = 0; col < 3; col++) {
    let piv = col
    for (let r = col + 1; r < 3; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r
    ;[M[col], M[piv]] = [M[piv], M[col]]
    const pv = M[col][col]
    M[col] = M[col].map((v) => v / pv)
    for (let r = 0; r < 3; r++) {
      if (r !== col) {
        const f = M[r][col]
        M[r] = M[r].map((v, k) => v - f * M[col][k])
      }
    }
  }
  const [c0, c1, c2] = [M[0][3], M[1][3], M[2][3]]
  const predict = (x: number) => c0 + c1 * x + c2 * x * x
  return {
    name: 'Πολυωνυμική (2ου)',
    predict,
    metrics: metricsOf(xs.map(predict), ys),
    curve: (lo, hi, s) => sample(predict, lo, hi, s),
  }
}

/** Pooled (x = GDP per capita, y = life expectancy) sample for the regression study. */
export function gdpLifeSample(): { xs: number[]; ys: number[] } {
  return { xs: column('gdp'), ys: column('life') }
}
