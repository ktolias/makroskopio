import { useEffect, useRef, useState } from 'react'
import { fmt } from '../../lib/format'

interface CountUpProps {
  to: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
}

export function CountUp({ to, duration = 1400, decimals = 0, prefix = '', suffix = '' }: CountUpProps) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setVal(to * eased)
            if (p < 1) requestAnimationFrame(tick)
            else setVal(to)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])

  const display = fmt(val, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return (
    <span ref={ref} className="tnum">
      {prefix}
      {display}
      {suffix}
    </span>
  )
}
