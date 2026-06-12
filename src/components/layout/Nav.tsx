import { useEffect, useState } from 'react'
import { useTheme } from '../../theme/ThemeContext'

export interface NavItem {
  id: string
  label: string
}

export function Nav({ items, onPresent }: { items: NavItem[]; onPresent: () => void }) {
  const { theme, toggle } = useTheme()
  const [active, setActive] = useState(items[0]?.id)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    items.forEach((it) => {
      const el = document.getElementById(it.id)
      if (el) obs.observe(el)
    })
    const onScroll = () => {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      obs.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [items])

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(false)
  }

  return (
    <header className="nav">
      <div className="nav__inner shell">
        <button className="brand" onClick={() => go(items[0].id)} aria-label="ΜΑΚΡΟΣΚΟΠΙΟ — αρχή">
          <img src={`${import.meta.env.BASE_URL}macroscope-mark.svg`} alt="" className="brand__mark" />
          <span className="brand__text">
            <span className="brand__word serif">ΜΑΚΡΟΣΚΟΠΙΟ</span>
            <span className="brand__sub">EU-27 · 2000–2024</span>
          </span>
        </button>

        <nav className={`nav__links ${open ? 'is-open' : ''}`}>
          {items.map((it) => (
            <button key={it.id} className={`nav__link ${active === it.id ? 'is-active' : ''}`} onClick={() => go(it.id)}>
              {it.label}
            </button>
          ))}
        </nav>

        <div className="nav__controls">
          <button className="nav__present" onClick={onPresent} title="Λειτουργία παρουσίασης">
            <span className="nav__present-icon">▦</span>
            <span className="nav__present-label">Παρουσίαση</span>
          </button>
          <button className="theme-toggle" onClick={toggle} aria-label="Εναλλαγή θέματος" title="Φωτεινό / Σκοτεινό">
            <span className="theme-toggle__icon">{theme === 'dark' ? '☾' : '☀'}</span>
          </button>
          <button className="nav__burger" aria-label="Μενού" onClick={() => setOpen((o) => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
      <div className="nav__progress" style={{ width: `${progress}%` }} />
    </header>
  )
}
