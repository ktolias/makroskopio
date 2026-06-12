const EL = 'el-GR'

export function fmt(n: number, opts: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat(EL, opts).format(n)
}

export function fmtInt(n: number): string {
  return fmt(Math.round(n), { maximumFractionDigits: 0 })
}

export function fmtDec(n: number, digits = 2): string {
  return fmt(n, { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

export function fmtPct(n: number, digits = 1): string {
  return `${fmtDec(n, digits)}%`
}

/** Compact thousands for axis labels: 51993 → 52K, 128818 → 129K. */
export function fmtK(n: number): string {
  const abs = Math.abs(n)
  if (abs >= 1000) return `${n < 0 ? '−' : ''}${Math.round(abs / 1000)}K`
  return `${Math.round(n)}`
}

/** Euro-style compact for money. */
export function fmtEuro(n: number): string {
  return `${fmtInt(n)} $`
}
