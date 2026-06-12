import { useMemo, useState } from 'react'
import { Section } from '../components/layout/Section'
import { SectionIntro } from '../components/ui/SectionIntro'
import { Reveal } from '../components/ui/Reveal'
import { ScatterRegression } from '../components/charts/ScatterRegression'
import { ModelBars } from '../components/charts/ModelBars'
import { ForecastChart } from '../components/charts/ForecastChart'
import { useChartTheme } from '../components/charts/useChartTheme'
import { ROWS } from '../data/dataset'
import { gdpLifeSample, linearModel, poly2Model, logModel } from '../lib/stats'
import { fmtDec, fmtInt } from '../lib/format'

export function Models() {
  const c = useChartTheme()
  const { xs, ys } = gdpLifeSample()
  const lin = useMemo(() => linearModel(xs, ys), [xs, ys])
  const poly = useMemo(() => poly2Model(xs, ys), [xs, ys])
  const log = useMemo(() => logModel(xs, ys), [xs, ys])
  const points = useMemo(() => ROWS.map((r) => ({ x: r[2] as number, y: r[3] as number, iso: r[1] as string })), [])

  const [vis, setVis] = useState({ linear: true, poly: true, log: true })
  const [tsVis, setTsVis] = useState({ actual: true, ma: true, exp: true })

  const groupA = [
    { name: 'Γραμμική', ...lin.metrics, color: c.azure, on: vis.linear, k: 'linear' as const },
    { name: 'Πολυωνυμική (2ου)', ...poly.metrics, color: c.life, on: vis.poly, k: 'poly' as const },
    { name: 'Λογαριθμική', ...log.metrics, color: c.gdp, on: vis.log, k: 'log' as const },
  ]
  const barData = groupA.map((m) => ({ name: m.name, r2: m.r2, mae: m.mae, mse: m.mse }))

  // Group B time-series metrics (from the validated Excel workbook).
  const groupB = [
    { name: 'Κινούμενος μέσος (3 ετών)', r2: 0.9396, mae: 1033.19, mse: 1405483.98, note: 'Καλύτερη εξομάλυνση' },
    { name: 'Εκθετική εξομάλυνση (α=0,3)', r2: 0.8756, mae: 1561.62, mse: 3470627.42, note: 'Υστερεί λόγω χρονικής υστέρησης (lag)' },
  ]

  return (
    <Section id="models" tint>
      <SectionIntro
        index="06"
        eyebrow="Μοντέλα πρόβλεψης"
        title="Από τη συσχέτιση στην πρόβλεψη — και πώς ξεχωρίζουμε ένα καλό μοντέλο"
        lede={
          <>
            Κατασκευάστηκαν δύο ομάδες μοντέλων. <strong>Ομάδα Α</strong>: τρεις παλινδρομήσεις που προβλέπουν το
            προσδόκιμο ζωής από το ΑΕΠ. <strong>Ομάδα Β</strong>: δύο μέθοδοι χρονοσειρών για τη διαχρονική εξέλιξη του
            μέσου ΑΕΠ της ΕΕ-27. Κάθε μοντέλο κρίνεται με <strong>R²</strong>, <strong>MAE</strong> και <strong>MSE</strong>.
          </>
        }
        panelTitle="Τι κερδίζει σε κάθε ομάδα"
        conclusions={[
          { text: <>Ομάδα Α: νικά η <strong>πολυωνυμική</strong> (R² = {fmtDec(poly.metrics.r2, 2)}) — η σχέση έχει «ταβάνι».</>, tone: 'gold' },
          { text: 'Ομάδα Β: νικά ο κινούμενος μέσος (R² = 0,94)· η εκθετική εξομάλυνση υστερεί λόγω lag.', tone: 'up' },
          { text: 'Το R² συγκρίνεται μόνο μεταξύ μοντέλων ίδιας εξαρτημένης μεταβλητής.', tone: 'neutral' },
        ]}
      />

      {/* GROUP A */}
      <Reveal as="div" className="model-block card">
        <div className="model-block__tag mono">Ομάδα Α</div>
        <h3 className="model-block__title serif">Προσδόκιμο ζωής ως συνάρτηση του κατά κεφαλήν ΑΕΠ</h3>
        <p className="model-block__intro">
          675 σημεία (χώρα × έτος), τρεις καμπύλες στο ίδιο διάγραμμα διασποράς. Εναλλάξτε τα μοντέλα για να συγκρίνετε
          οπτικά την προσαρμογή τους.
        </p>

        <div className="model-toggles">
          {[
            { k: 'linear', label: 'Γραμμική', color: c.azure },
            { k: 'poly', label: 'Πολυωνυμική (2ου)', color: c.life },
            { k: 'log', label: 'Λογαριθμική', color: c.gdp },
          ].map((m) => (
            <button
              key={m.k}
              className={`mtoggle ${vis[m.k as keyof typeof vis] ? 'is-on' : ''}`}
              style={{ ['--mt' as string]: m.color }}
              onClick={() => setVis((v) => ({ ...v, [m.k]: !v[m.k as keyof typeof v] }))}
            >
              <span className="mtoggle__swatch" style={{ background: m.color }} />
              {m.label}
            </button>
          ))}
        </div>

        <div className="model-block__split">
          <div className="model-block__chart">
            <ScatterRegression
              points={points}
              models={[
                { model: lin, color: c.azure, visible: vis.linear },
                { model: poly, color: c.life, visible: vis.poly },
                { model: log, color: c.gdp, visible: vis.log },
              ]}
            />
          </div>
          <div className="model-block__metrics">
            <table className="metric-table">
              <thead>
                <tr><th>Μοντέλο</th><th>R²</th><th>MAE</th><th>MSE</th></tr>
              </thead>
              <tbody>
                {groupA.map((m) => {
                  const best = m.r2 === Math.max(...groupA.map((g) => g.r2))
                  return (
                    <tr key={m.name} className={best ? 'is-best' : ''} style={{ opacity: m.on ? 1 : 0.4 }}>
                      <td><span className="metric-swatch" style={{ background: m.color }} />{m.name}{best && <span className="metric-win">νικητής</span>}</td>
                      <td className="tnum">{fmtDec(m.r2, 3)}</td>
                      <td className="tnum">{fmtDec(m.mae, 2)}</td>
                      <td className="tnum">{fmtDec(m.mse, 2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="model-block__read">
              <span className="chart-card__takeaway-mark">→</span>
              <span>
                Η <strong>πολυωνυμική</strong> υπερτερεί σε <strong>όλα</strong> τα μέτρα. Η ερμηνεία: το ΑΕΠ βελτιώνει το
                προσδόκιμο ζωής με <strong>φθίνοντα ρυθμό</strong> — πέρα από ένα σημείο, παραπάνω εισόδημα δίνει ελάχιστα
                επιπλέον έτη ζωής. Η γραμμική υπόθεση αποτυγχάνει ακριβώς εκεί.
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* GROUP B */}
      <Reveal as="div" className="model-block card" delay={0.08}>
        <div className="model-block__tag mono">Ομάδα Β</div>
        <h3 className="model-block__title serif">Χρονοσειρά του μέσου ΑΕΠ της ΕΕ-27 (2000–2024)</h3>
        <p className="model-block__intro">
          Δύο κλασικές μέθοδοι εξομάλυνσης χρονοσειρών παρακολουθούν τον μέσο όρο των 27 χωρών. Εναλλάξτε τις σειρές για να
          δείτε πόσο πιστά ακολουθεί η καθεμία τις πραγματικές τιμές — ιδίως στο σοκ του 2009 και του 2020.
        </p>

        <div className="model-toggles">
          {[
            { k: 'actual', label: 'Πραγματικός μέσος', color: c.azure },
            { k: 'ma', label: 'Κινούμενος μέσος (3 ετών)', color: c.life },
            { k: 'exp', label: 'Εκθετική εξομάλυνση', color: c.gdp },
          ].map((m) => (
            <button
              key={m.k}
              className={`mtoggle ${tsVis[m.k as keyof typeof tsVis] ? 'is-on' : ''}`}
              style={{ ['--mt' as string]: m.color }}
              onClick={() => setTsVis((v) => ({ ...v, [m.k]: !v[m.k as keyof typeof v] }))}
            >
              <span className="mtoggle__swatch" style={{ background: m.color }} />
              {m.label}
            </button>
          ))}
        </div>

        <div className="model-block__split">
          <div className="model-block__chart">
            <ForecastChart show={tsVis} />
          </div>
          <div className="model-block__metrics">
            <table className="metric-table">
              <thead>
                <tr><th>Μοντέλο</th><th>R²</th><th>MAE ($)</th><th>MSE</th></tr>
              </thead>
              <tbody>
                {groupB.map((m, i) => (
                  <tr key={m.name} className={i === 0 ? 'is-best' : ''}>
                    <td>{m.name}{i === 0 && <span className="metric-win">νικητής</span>}</td>
                    <td className="tnum">{fmtDec(m.r2, 3)}</td>
                    <td className="tnum">{fmtInt(m.mae)}</td>
                    <td className="tnum">{fmtInt(m.mse)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="model-block__read">
              <span className="chart-card__takeaway-mark">→</span>
              <span>
                Ο <strong>κινούμενος μέσος</strong> ακολουθεί πιστότερα τη χρονοσειρά. Η εκθετική εξομάλυνση εισάγει{' '}
                <strong>χρονική υστέρηση</strong>: αργεί να «προλάβει» τις απότομες μεταβολές (π.χ. την πτώση του 2009).
              </span>
            </div>
          </div>
        </div>

        <div className="model-note">
          <strong>Σημείωση μεθόδου:</strong> το R² της Ομάδας Β είναι μέτρο <em>καταλληλότητας</em> (goodness of fit) και
          δεν συγκρίνεται απευθείας με το R² της παλινδρόμησης της Ομάδας Α — μετρούν διαφορετικά πράγματα.
        </div>
      </Reveal>

      <div className="model-metrics-grid">
        <Reveal as="div" className="metricdef card">
          <div className="metricdef__sym mono">R²</div>
          <div className="metricdef__name">Συντελεστής προσδιορισμού</div>
          <p>Το ποσοστό της διακύμανσης που εξηγεί το μοντέλο. 1 = τέλεια, 0 = καθόλου. Υψηλότερο = καλύτερο.</p>
          <ModelBars metric="r2" data={barData} />
        </Reveal>
        <Reveal as="div" className="metricdef card" delay={0.06}>
          <div className="metricdef__sym mono">MAE</div>
          <div className="metricdef__name">Μέσο απόλυτο σφάλμα</div>
          <p>Ο μέσος όρος των απόλυτων αποκλίσεων. Ανθεκτικό σε ακραίες τιμές. Χαμηλότερο = καλύτερο.</p>
          <ModelBars metric="mae" data={barData} />
        </Reveal>
        <Reveal as="div" className="metricdef card" delay={0.12}>
          <div className="metricdef__sym mono">MSE</div>
          <div className="metricdef__name">Μέσο τετραγωνικό σφάλμα</div>
          <p>Τετραγωνίζει τα σφάλματα, τιμωρώντας βαρύτερα τις μεγάλες αποκλίσεις. Χαμηλότερο = καλύτερο.</p>
          <ModelBars metric="mse" data={barData} />
        </Reveal>
      </div>
    </Section>
  )
}
