import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SLIDES } from './slides'

interface PresentationProps {
  open: boolean
  onClose: () => void
}

export function Presentation({ open, onClose }: PresentationProps) {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const total = SLIDES.length

  const next = useCallback(() => setI((p) => { setDir(1); return Math.min(p + 1, total - 1) }), [total])
  const prev = useCallback(() => setI((p) => { setDir(-1); return Math.max(p - 1, 0) }), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); next() }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev() }
      else if (e.key === 'Escape') onClose()
      else if (e.key === 'Home') setI(0)
      else if (e.key === 'End') setI(total - 1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, next, prev, onClose, total])

  useEffect(() => { if (open) setI(0) }, [open])

  if (!open) return null
  const slide = SLIDES[i]

  return (
    <div className="deck" role="dialog" aria-modal="true" aria-label="Παρουσίαση">
      {/* On-screen single-slide view */}
      <div className="deck__stage screen-only">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={i}
            className={`slide slide--${slide.kind}`}
            custom={dir}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragSnapToOrigin
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(_, info) => {
              const { offset, velocity } = info
              if (offset.x < -70 || velocity.x < -480) next()
              else if (offset.x > 70 || velocity.x > 480) prev()
            }}
            style={{ touchAction: 'pan-y' }}
          >
            <SlideContent slide={slide} index={i} total={total} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Print-only: every slide stacked, one per page */}
      <div className="deck__print print-only">
        {SLIDES.map((s, k) => (
          <div key={k} className={`slide slide--${s.kind} slide--print`}>
            <SlideContent slide={s} index={k} total={total} />
          </div>
        ))}
      </div>

      {i === 0 && <div className="deck__hint screen-only" aria-hidden>‹ σύρε για εναλλαγή ›</div>}

      <div className="deck__controls screen-only">
        <button className="deck__btn" onClick={prev} disabled={i === 0} aria-label="Προηγούμενη">‹</button>
        <div className="deck__dots">
          {SLIDES.map((_, k) => (
            <button
              key={k}
              className={`deck__dot ${k === i ? 'is-on' : ''}`}
              onClick={() => { setDir(k > i ? 1 : -1); setI(k) }}
              aria-label={`Διαφάνεια ${k + 1}`}
            />
          ))}
        </div>
        <button className="deck__btn" onClick={next} disabled={i === total - 1} aria-label="Επόμενη">›</button>
      </div>

      <div className="deck__top screen-only">
        <span className="deck__counter mono">{String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
        <div className="deck__top-actions">
          <button className="deck__action" onClick={() => window.print()}>↧ Εξαγωγή PDF</button>
          <button className="deck__action deck__action--close" onClick={onClose}>✕ Έξοδος</button>
        </div>
      </div>
    </div>
  )
}

function SlideContent({ slide, index, total }: { slide: (typeof SLIDES)[number]; index: number; total: number }) {
  if (slide.kind === 'title') {
    return (
      <div className="slide__inner slide__inner--title">
        <div className="slide__eyebrow eyebrow">{slide.eyebrow}</div>
        <h1 className="slide__megatitle serif">{slide.title}</h1>
        <p className="slide__subtitle">{slide.subtitle}</p>
        <div className="slide__title-meta">
          {slide.meta?.map((m) => <span key={m}>{m}</span>)}
        </div>
      </div>
    )
  }
  return (
    <div className="slide__inner">
      <div className="slide__head">
        <span className="slide__kicker mono">{slide.kicker}</span>
        <h2 className="slide__title serif">{slide.title}</h2>
      </div>
      <div className="slide__body">
        {slide.bullets && (
          <ul className="slide__bullets">
            {slide.bullets.map((b, k) => (
              <li key={k}><span className="slide__bullet-mark" style={b.accent ? { background: b.accent } : undefined} />{b.text}</li>
            ))}
          </ul>
        )}
        {slide.stats && (
          <div className="slide__stats">
            {slide.stats.map((s) => (
              <div key={s.label} className="slide__stat" style={{ ['--sc' as string]: s.color ?? 'var(--azure)' }}>
                <div className="slide__stat-v tnum">{s.value}</div>
                <div className="slide__stat-l">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      {slide.footer && <div className="slide__footer">{slide.footer}</div>}
      <div className="slide__pageno mono print-only">{index + 1} / {total}</div>
    </div>
  )
}
