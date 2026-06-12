import { useEffect, useRef, useState } from 'react'
import { Section } from '../components/layout/Section'
import { SectionIntro } from '../components/ui/SectionIntro'
import { Reveal } from '../components/ui/Reveal'
import { Segmented } from '../components/ui/Segmented'
import { TileCartogram } from '../components/charts/TileCartogram'
import { LineByCountry } from '../components/charts/LineByCountry'
import { COUNTRIES } from '../data/dataset'
import { INDICATORS, INDICATOR_LIST, YEAR_MIN, YEAR_MAX, type IndicatorKey } from '../lib/stats'

const DEFAULT_COUNTRIES = ['LU', 'DE', 'GR', 'ES', 'BG', 'SE']

export function Dashboard() {
  const [key, setKey] = useState<IndicatorKey>('gdp')
  const [year, setYear] = useState(YEAR_MAX)
  const [playing, setPlaying] = useState(false)
  const [selected, setSelected] = useState<string[]>(DEFAULT_COUNTRIES)
  const ind = INDICATORS[key]
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (!playing) return
    timer.current = window.setInterval(() => {
      setYear((y) => {
        if (y >= YEAR_MAX) return YEAR_MIN
        return y + 1
      })
    }, 700)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [playing])

  const toggleCountry = (iso: string) =>
    setSelected((s) => (s.includes(iso) ? s.filter((x) => x !== iso) : s.length >= 8 ? s : [...s, iso]))

  return (
    <Section id="dashboard" tint>
      <SectionIntro
        index="04"
        eyebrow="Διαδραστικό Dashboard"
        title="Ολόκληρη η ΕΕ, σε έναν χάρτη που αναπνέει"
        lede={
          <>
            Η ίδια διαδραστική λογική του Excel dashboard — Pivot, Slicers, χάρτης — ανασχεδιασμένη για τον ιστό. Διάλεξε
            δείκτη, σύρε το έτος ή πάτησε «αναπαραγωγή» για να δεις την ΕΕ να μεταβάλλεται από το <strong>2000</strong> στο{' '}
            <strong>2024</strong>. Κάθε πλακίδιο είναι μια χώρα· το χρώμα εντείνεται με την τιμή.
          </>
        }
        panelTitle="Τι αποκαλύπτει ο χάρτης"
        conclusions={[
          { text: 'Σαφές δυτικά-ανατολικά μοτίβο πλούτου — αλλά που στενεύει με τον χρόνο.', tone: 'neutral' },
          { text: 'Η ανεργία «ανάβει» σε νότο κατά την κρίση 2010–2014 και υποχωρεί έκτοτε.', tone: 'down' },
          { text: 'Το προσδόκιμο ζωής γίνεται ομοιόμορφα πράσινο — γενικευμένη βελτίωση.', tone: 'up' },
        ]}
      />

      <Reveal as="div" className="dash card">
        <div className="dash__controls">
          <div className="dash__control-group">
            <span className="dash__control-lbl eyebrow">Δείκτης</span>
            <Segmented
              value={key}
              onChange={setKey}
              options={INDICATOR_LIST.map((i) => ({ value: i.key, label: i.short, accent: i.cssVar }))}
            />
          </div>
          <div className="dash__control-group dash__control-group--year">
            <span className="dash__control-lbl eyebrow">Έτος · <strong className="tnum" style={{ color: `var(${ind.cssVar})` }}>{year}</strong></span>
            <div className="dash__year">
              <button className={`dash__play ${playing ? 'is-playing' : ''}`} onClick={() => setPlaying((p) => !p)} aria-label="Αναπαραγωγή">
                {playing ? '❚❚' : '▶'}
              </button>
              <input
                type="range"
                min={YEAR_MIN}
                max={YEAR_MAX}
                value={year}
                onChange={(e) => {
                  setPlaying(false)
                  setYear(Number(e.target.value))
                }}
                className="dash__slider"
                style={{ ['--fill' as string]: `${((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 100}%`, ['--accent' as string]: `var(${ind.cssVar})` }}
              />
              <span className="dash__year-range mono">{YEAR_MIN}–{YEAR_MAX}</span>
            </div>
          </div>
        </div>

        <div className="dash__map">
          <TileCartogram indicator={key} year={year} />
        </div>
        <div className="dash__caption mono">
          {ind.label} ({ind.unit}) · {year} · χρωματική ένταση κανονικοποιημένη στο εύρος όλων των ετών
        </div>
      </Reveal>

      <Reveal as="div" className="dash-lines card" delay={0.08}>
        <div className="dash-lines__head">
          <div>
            <div className="chart-card__figlabel mono">Διάγραμμα γραμμής · ανά χώρα &amp; έτος</div>
            <h3 className="dash-lines__title">Διαχρονική εξέλιξη — {ind.short}</h3>
            <p className="dash-lines__sub">Επίλεξε έως 8 χώρες για σύγκριση τροχιών (αντιστοιχεί στα slicers του dashboard).</p>
          </div>
        </div>
        <div className="dash-lines__picker">
          {COUNTRIES.map((co) => (
            <button
              key={co.iso}
              className={`cpick ${selected.includes(co.iso) ? 'is-on' : ''}`}
              onClick={() => toggleCountry(co.iso)}
              title={co.el}
            >
              <span className="mono">{co.iso}</span>
            </button>
          ))}
        </div>
        <LineByCountry indicator={key} selected={selected} />
      </Reveal>
    </Section>
  )
}
