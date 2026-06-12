import { useState } from 'react'
import { Section } from '../components/layout/Section'
import { SectionIntro } from '../components/ui/SectionIntro'
import { Reveal } from '../components/ui/Reveal'
import { Segmented } from '../components/ui/Segmented'
import { BoxPlot } from '../components/charts/BoxPlot'
import { Histogram } from '../components/charts/Histogram'
import { useChartTheme, colorForIndicator } from '../components/charts/useChartTheme'
import { INDICATORS, INDICATOR_LIST, boxStats, column, type IndicatorKey } from '../lib/stats'
import { fmtInt, fmtDec } from '../lib/format'

const NARRATIVE: Record<IndicatorKey, { read: string; take: string }> = {
  gdp: {
    read: 'Έντονη δεξιά ασυμμετρία: η διάμεσος βρίσκεται κοντά στις 42.700 $, αλλά μια μακριά ουρά ακραίων τιμών εκτείνεται προς τα πάνω — με κορυφαίο, μακράν, το Λουξεμβούργο (έως ~139.000 $).',
    take: 'Ο πλούτος στην ΕΕ είναι έντονα άνισα κατανεμημένος· ο λόγος πλουσιότερης προς φτωχότερη χώρα αγγίζει το 10:1.',
  },
  life: {
    read: 'Η πιο «σφιχτή» κατανομή: σχεδόν όλες οι τιμές συγκεντρώνονται μεταξύ 76 και 82 ετών, με λίγες χαμηλές τιμές (~70) από ανατολικοευρωπαϊκές χώρες στις αρχές της περιόδου.',
    take: 'Ακόμη και οι λιγότερο εύπορες χώρες της ΕΕ διατηρούν υψηλό επίπεδο υγείας — σύγκλιση, όχι απόκλιση.',
  },
  co2: {
    read: 'Συμμετρικός πυρήνας γύρω στους 6–7 τόνους, αλλά με σαφείς ακραίες τιμές προς τα πάνω (Λουξεμβούργο, Εσθονία) που τραβούν τον μέσο πάνω από τη διάμεσο.',
    take: 'Λίγες εντάσεως-άνθρακα οικονομίες κυριαρχούν στο αποτύπωμα — στόχευση εκεί έχει δυσανάλογο όφελος.',
  },
  unemp: {
    read: 'Μεγάλη διασπορά και μακριά άνω ουρά: ακραίες τιμές έως ~28% προέρχονται κυρίως από Ελλάδα και Ισπανία στα χρόνια της κρίσης.',
    take: 'Η ανεργία είναι ο πιο «εκρηκτικός» δείκτης — εθνικές κρίσεις δημιουργούν τεράστιες αποκλίσεις από τον μέσο όρο.',
  },
}

export function Distributions() {
  const c = useChartTheme()
  const [key, setKey] = useState<IndicatorKey>('gdp')
  const ind = INDICATORS[key]
  const values = column(key)
  const stats = boxStats(values)
  const color = colorForIndicator(c, key)
  const fmt = (v: number) => (ind.decimals === 0 ? fmtInt(v) : fmtDec(v, ind.decimals))
  const narr = NARRATIVE[key]

  const summary: { label: string; value: number }[] = [
    { label: 'Ελάχιστο', value: stats.min },
    { label: 'Q1', value: stats.q1 },
    { label: 'Διάμεσος', value: stats.median },
    { label: 'Μέσος', value: stats.mean },
    { label: 'Q3', value: stats.q3 },
    { label: 'Μέγιστο', value: stats.max },
  ]

  return (
    <Section id="distributions">
      <SectionIntro
        index="03"
        eyebrow="Ερευνητικό ερώτημα 1 · Κατανομές"
        title="Πώς κατανέμονται οι τέσσερις δείκτες στην ΕΕ;"
        lede={
          <>
            Πριν από κάθε μοντέλο, χαρτογραφούμε το σχήμα των δεδομένων. Τα <strong>θηκογράμματα</strong> και τα{' '}
            <strong>ιστογράμματα</strong> αποκαλύπτουν διάμεσο, διασπορά, ασυμμετρία και ακραίες τιμές — με μία ματιά.
            Επίλεξε δείκτη για να δεις την κατανομή των <strong>675 παρατηρήσεων</strong>.
          </>
        }
        conclusions={[
          { text: 'ΑΕΠ & ανεργία: μεγάλη διασπορά με μακριές ουρές ακραίων τιμών.', tone: 'down' },
          { text: 'Προσδόκιμο ζωής: στενή, ομοιογενής κατανομή — σύγκλιση στην υγεία.', tone: 'up' },
          { text: 'Οι ακραίες τιμές δεν είναι «θόρυβος» — είναι Λουξεμβούργο, Ελλάδα, Ισπανία.', tone: 'gold' },
        ]}
      />

      <div className="dist-switch">
        <Segmented
          value={key}
          onChange={setKey}
          options={INDICATOR_LIST.map((i) => ({ value: i.key, label: i.short, accent: i.cssVar }))}
        />
      </div>

      <Reveal as="div" className="dist-panel card" key={key}>
        <div className="dist-panel__head">
          <div>
            <div className="chart-card__figlabel mono">Διάγραμμα · {ind.label}</div>
            <h3 className="dist-panel__title">{ind.label} <span className="dist-panel__unit">({ind.unit})</span></h3>
          </div>
          <div className="dist-panel__badges">
            <span className="dist-badge"><em>n</em> = {stats.n}</span>
            <span className="dist-badge">σ = {fmt(stats.sd)}</span>
            <span className="dist-badge dist-badge--out">{stats.outliers.length} ακραίες</span>
          </div>
        </div>

        <div className="dist-panel__summary">
          {summary.map((s) => (
            <div key={s.label} className="fivenum">
              <span className="fivenum__lbl">{s.label}</span>
              <span className="fivenum__val tnum" style={{ color: s.label === 'Διάμεσος' ? color : undefined }}>
                {fmt(s.value)}
              </span>
            </div>
          ))}
        </div>

        <div className="dist-panel__charts">
          <div className="dist-panel__box">
            <div className="dist-panel__chart-h mono">Θηκόγραμμα — πεντάριθμη σύνοψη &amp; ακραίες τιμές</div>
            <BoxPlot stats={stats} color={color} unit={ind.unit} format={fmt} />
          </div>
          <div className="dist-panel__hist">
            <div className="dist-panel__chart-h mono">Ιστόγραμμα — συχνότητα ανά εύρος τιμών</div>
            <Histogram values={values} color={color} median={stats.median} mean={stats.mean} format={fmt} unit={ind.unit} />
          </div>
        </div>

        <div className="dist-panel__legend mono">
          <span><i className="lg lg--median" style={{ background: color }} /> Διάμεσος</span>
          <span><i className="lg lg--mean" /> Μέσος</span>
          <span><i className="lg lg--box" style={{ borderColor: color }} /> Ενδοτεταρτημοριακό εύρος (Q1–Q3)</span>
          <span><i className="lg lg--out" style={{ background: color }} /> Ακραίες τιμές (&gt; 1,5 × IQR)</span>
        </div>

        <div className="dist-panel__narr">
          <div className="dist-panel__narr-col">
            <div className="chart-card__narr-label eyebrow">Ανάγνωση</div>
            <p>{narr.read}</p>
          </div>
          <div className="dist-panel__narr-take">
            <span className="chart-card__takeaway-mark">→</span>
            <span>{narr.take}</span>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
