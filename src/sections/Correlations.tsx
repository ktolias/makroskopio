import { Section } from '../components/layout/Section'
import { SectionIntro } from '../components/ui/SectionIntro'
import { ChartCard } from '../components/ui/ChartCard'
import { Reveal } from '../components/ui/Reveal'
import { CorrelationHeatmap } from '../components/charts/CorrelationHeatmap'
import { pearson, column } from '../lib/stats'
import { fmtDec } from '../lib/format'

const r = (a: Parameters<typeof column>[0], b: Parameters<typeof column>[0]) => pearson(column(a), column(b))

const PAIRS = [
  {
    q: 'Q2',
    title: 'Πλούτος → Υγεία',
    a: 'gdp' as const,
    b: 'life' as const,
    value: r('gdp', 'life'),
    strength: 'Μέτρια θετική',
    read: 'Οι πλουσιότερες χώρες τείνουν να έχουν υψηλότερο προσδόκιμο ζωής. Είναι η ισχυρότερη συσχέτιση του πίνακα — αλλά, όπως θα δούμε, η σχέση δεν είναι γραμμική.',
    tone: 'up' as const,
  },
  {
    q: 'Q4',
    title: 'Ανάπτυξη → Περιβάλλον',
    a: 'gdp' as const,
    b: 'co2' as const,
    value: r('gdp', 'co2'),
    strength: 'Μέτρια θετική',
    read: 'Η οικονομική ανάπτυξη συνοδεύεται μερικώς από αυξημένες εκπομπές — όμως αρκετές πλούσιες χώρες (Σουηδία, Γαλλία) τη «σπάνε» με χαμηλό αποτύπωμα. Η ανάπτυξη δεν επιβάλλει ρύπανση.',
    tone: 'neutral' as const,
  },
  {
    q: 'Q3',
    title: 'Ανεργία → Υγεία',
    a: 'unemp' as const,
    b: 'life' as const,
    value: r('unemp', 'life'),
    strength: 'Ασθενής αρνητική',
    read: 'Σχεδόν μηδενική σχέση: εντός της ΕΕ η ανεργία δεν προβλέπει το προσδόκιμο ζωής. Πιθανή εξήγηση — τα ισχυρά δίχτυα κοινωνικής πρόνοιας απορροφούν το πλήγμα της ανεργίας στην υγεία.',
    tone: 'down' as const,
  },
]

export function Correlations() {
  return (
    <Section id="correlations">
      <SectionIntro
        index="05"
        eyebrow="Ερευνητικά ερωτήματα 2–4 · Συσχετίσεις"
        title="Ποιοι δείκτες κινούνται μαζί;"
        lede={
          <>
            Ο πίνακας συσχετίσεων <strong>Pearson</strong> δίνει μια τυποποιημένη, γρήγορη εικόνα των γραμμικών σχέσεων
            μεταξύ των τεσσάρων δεικτών, σε όλες τις 675 παρατηρήσεις. Θυμίζουμε: ο <strong>r</strong> μετρά γραμμική
            σχέση — χαμηλή τιμή δεν αποκλείει μη γραμμική σχέση, και καμία συσχέτιση δεν συνεπάγεται αιτιότητα.
          </>
        }
        conclusions={[
          { text: <>ΑΕΠ ↔ Προσδόκιμο ζωής: η ισχυρότερη σχέση (r = {fmtDec(r('gdp', 'life'), 2)}).</>, tone: 'up' },
          { text: <>ΑΕΠ ↔ Εκπομπές CO₂: μέτρια θετική (r = {fmtDec(r('gdp', 'co2'), 2)}).</>, tone: 'neutral' },
          { text: <>Ανεργία ↔ Προσδόκιμο ζωής: σχεδόν καμία (r = {fmtDec(r('unemp', 'life'), 2)}).</>, tone: 'down' },
        ]}
      />

      <ChartCard
        figureLabel="Πίνακας · Συσχετίσεις Pearson"
        title="Θερμικός χάρτης συσχετίσεων"
        subtitle="r ∈ [−1, +1] · πράσινο = θετική, κόκκινο = αρνητική, ένταση = ισχύς"
        narrative={
          <>
            Η διαγώνιος είναι πάντα 1 (κάθε μεταβλητή με τον εαυτό της). Εκτός διαγωνίου, ξεχωρίζουν δύο έντονα πράσινα
            κελιά — <strong>ΑΕΠ–προσδόκιμο</strong> και <strong>ΑΕΠ–CO₂</strong>. Η ανεργία συσχετίζεται{' '}
            <strong>αρνητικά</strong> με όλους τους άλλους δείκτες, ισχυρότερα με το ΑΕΠ (r = {fmtDec(r('gdp', 'unemp'), 2)}).
            Με <strong>675 παρατηρήσεις</strong>, κάθε συσχέτιση συνοδεύεται από έλεγχο σημαντικότητας: τα αστεράκια δείχνουν
            το p-value. <strong>Όλες</strong> οι σχέσεις είναι στατιστικά σημαντικές — με <em>μοναδική εξαίρεση</em> το ζεύγος{' '}
            <strong>προσδόκιμο ζωής ↔ CO₂</strong> (r = {fmtDec(r('life', 'co2'), 2)}, n.s.).
          </>
        }
        takeaway="Το εισόδημα είναι ο «κόμβος» του συστήματος. Η μόνη μη-σημαντική σχέση — υγεία × ρύποι — δείχνει ότι οι δύο αποσυνδέονται εντός της ΕΕ."
        side
      >
        <CorrelationHeatmap />
      </ChartCard>

      <div className="corr-pairs">
        {PAIRS.map((p, i) => (
          <Reveal key={p.q} delay={i * 0.08} as="article" className="corrpair card">
            <div className="corrpair__head">
              <span className="corrpair__q mono">{p.q}</span>
              <span className="corrpair__title">{p.title}</span>
            </div>
            <div className={`corrpair__value tnum corrpair__value--${p.tone}`}>
              r = {fmtDec(p.value, 2)}
            </div>
            <div className="corrpair__strength">{p.strength}</div>
            <p className="corrpair__read">{p.read}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
