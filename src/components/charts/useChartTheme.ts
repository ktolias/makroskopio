import { useEffect, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'

export interface ChartColors {
  azure: string
  azureDeep: string
  azureGlow: string
  gdp: string
  gdpSoft: string
  life: string
  lifeSoft: string
  co2: string
  co2Soft: string
  unemp: string
  unempSoft: string
  grid: string
  text2: string
  text3: string
  surface: string
  stroke: string
  heat0: string
}

function read(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

function compute(): ChartColors {
  return {
    azure: read('--azure', '#4f9df0'),
    azureDeep: read('--azure-deep', '#2f6fd0'),
    azureGlow: read('--azure-glow', '#7cc0ff'),
    gdp: read('--c-gdp', '#e8b04b'),
    gdpSoft: read('--c-gdp-soft', '#f2c976'),
    life: read('--c-life', '#46c79b'),
    lifeSoft: read('--c-life-soft', '#74dab8'),
    co2: read('--c-co2', '#ec6a5e'),
    co2Soft: read('--c-co2-soft', '#f2917f'),
    unemp: read('--c-unemp', '#9b8cf0'),
    unempSoft: read('--c-unemp-soft', '#b8aef5'),
    grid: read('--grid', 'rgba(150,175,225,0.09)'),
    text2: read('--text-2', '#8b99ba'),
    text3: read('--text-3', '#5d6b8c'),
    surface: read('--surface-solid', '#0f1528'),
    stroke: read('--stroke-strong', 'rgba(150,180,240,0.28)'),
    heat0: read('--heat-0', '#0e1428'),
  }
}

export function useChartTheme(): ChartColors {
  const { theme } = useTheme()
  const [colors, setColors] = useState<ChartColors>(() => compute())
  useEffect(() => {
    const id = requestAnimationFrame(() => setColors(compute()))
    return () => cancelAnimationFrame(id)
  }, [theme])
  return colors
}

export function colorForIndicator(c: ChartColors, key: string): string {
  return key === 'gdp' ? c.gdp : key === 'life' ? c.life : key === 'co2' ? c.co2 : c.unemp
}
