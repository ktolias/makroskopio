import { motion } from 'framer-motion'
import { Kpi } from '../components/ui/Kpi'
import { INDICATOR_LIST } from '../lib/stats'

const QUESTIONS = [
  {
    n: 'Q1',
    text: 'Ποια είναι η κατανομή της ανεργίας, του ΑΕΠ, του προσδόκιμου ζωής και των εκπομπών CO₂ στην ΕΕ;',
    tag: 'Κατανομές',
  },
  {
    n: 'Q2',
    text: 'Υπάρχει συσχέτιση μεταξύ του κατά κεφαλήν εισοδήματος και του προσδόκιμου ζωής;',
    tag: 'Πλούτος → Υγεία',
  },
  {
    n: 'Q3',
    text: 'Συσχετίζεται η ανεργία με χαμηλό προσδόκιμο ζωής εντός της ΕΕ;',
    tag: 'Ανεργία → Υγεία',
  },
  {
    n: 'Q4',
    text: 'Συνδέονται οι εκπομπές CO₂ με την οικονομική ανάπτυξη (κατά κεφαλήν εισόδημα);',
    tag: 'Ανάπτυξη → Περιβάλλον',
  },
]

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="shell hero__inner">
        <motion.div
          className="hero__eyebrow"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="eyebrow">Δεδομένα Μεγάλης Κλίμακας &amp; Επιχειρηματική Αναλυτική</span>
        </motion.div>

        <motion.h1
          className="hero__title serif"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease }}
        >
          ΜΑΚΡΟΣΚΟΠΙΟ
        </motion.h1>

        <motion.p
          className="hero__lede"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          Μια στατιστική απεικόνιση τεσσάρων θεμελιωδών μακροοικονομικών δεικτών —{' '}
          <strong>κατά κεφαλήν ΑΕΠ</strong>, <strong>προσδόκιμο ζωής</strong>, <strong>εκπομπές CO₂</strong> και{' '}
          <strong>ανεργία</strong> — για τα <strong>27 κράτη-μέλη</strong> της Ευρωπαϊκής Ένωσης, σε βάθος{' '}
          <strong>25 ετών</strong> (2000–2024). Από την περιγραφική στατιστική στα μοντέλα πρόβλεψης, με δεδομένα της
          Παγκόσμιας Τράπεζας.
        </motion.p>

        <motion.div
          className="hero__indicators"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.34, ease }}
        >
          {INDICATOR_LIST.map((ind) => (
            <span key={ind.key} className="hero__chip" style={{ ['--chip' as string]: `var(${ind.cssVar})` }}>
              <span className="hero__chip-dot" />
              {ind.short}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="hero__kpis"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.46, ease }}
        >
          <Kpi value={27} label="Κράτη-μέλη ΕΕ" sub="πλήρες πάνελ" accent="azure" />
          <Kpi value={25} label="Έτη παρατήρησης" sub="2000 – 2024" accent="gdp" />
          <Kpi value={4} label="Μακροοικονομικοί δείκτες" sub="World Bank WDI" accent="life" />
          <Kpi value={675} label="Παρατηρήσεις" sub="27 × 25, μηδέν κενά" accent="unemp" />
        </motion.div>

        <motion.div
          className="hero__questions"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.58, ease }}
        >
          <div className="hero__questions-h eyebrow">Τα τέσσερα ερευνητικά ερωτήματα</div>
          <div className="hero__questions-grid">
            {QUESTIONS.map((q) => (
              <article key={q.n} className="qcard card">
                <div className="qcard__n mono">{q.n}</div>
                <p className="qcard__text">{q.text}</p>
                <div className="qcard__tag">{q.tag}</div>
              </article>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hero__scope"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8, ease }}
        >
          <span className="hero__scope-mark">◆</span>
          <span>
            Η μελέτη αναδεικνύει <strong>συσχετίσεις σε περιγραφικό επίπεδο</strong> — όχι αιτιώδεις σχέσεις. Στόχος είναι
            να εντοπιστούν ενδείξεις και να τεθούν ερωτήματα για περαιτέρω διερεύνηση.
          </span>
        </motion.div>
      </div>
    </section>
  )
}
