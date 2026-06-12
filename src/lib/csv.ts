import { ROWS, COUNTRIES } from '../data/dataset'

const nameOf = (iso: string) => COUNTRIES.find((c) => c.iso === iso)?.en ?? iso

export function downloadCsv() {
  const header = ['Year', 'CountryISO', 'CountryName', 'GDP_per_capita_PPP', 'LifeExpectancy', 'CO2_per_capita', 'Unemployment_pct']
  const lines = [header.join(',')]
  for (const r of ROWS) {
    lines.push([r[0], r[1], `"${nameOf(r[1])}"`, r[2], r[3], r[4], r[5]].join(','))
  }
  const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'eu27_wdi_2000_2024.csv'
  a.click()
  URL.revokeObjectURL(url)
}
