import { Section } from '../components/layout/Section'
import { SectionIntro } from '../components/ui/SectionIntro'
import { Reveal } from '../components/ui/Reveal'
import { CountryTable } from '../components/ui/CountryTable'
import { downloadCsv } from '../lib/csv'

const INDICATOR_CARDS = [
  {
    key: 'gdp',
    cssVar: '--c-gdp',
    title: 'Κατά κεφαλήν ΑΕΠ',
    code: 'NY.GDP.PCAP.PP.KD',
    unit: 'σταθερά διεθνή $ 2021 (PPP)',
    desc: 'Ακαθάριστο εγχώριο προϊόν ανά κάτοικο σε σταθερές τιμές 2021, διορθωμένο για Ισοτιμία Αγοραστικής Δύναμης.',
    why: 'Οι σταθερές τιμές αφαιρούν τον πληθωρισμό· η διόρθωση PPP επιτρέπει αξιόπιστη σύγκριση μεταξύ χωρών με διαφορετικό κόστος ζωής.',
    src: 'International Comparison Program / World Bank',
  },
  {
    key: 'life',
    cssVar: '--c-life',
    title: 'Προσδόκιμο ζωής',
    code: 'SP.DYN.LE00.IN',
    unit: 'έτη',
    desc: 'Αναμενόμενος αριθμός ετών ζωής ενός νεογέννητου, με σταθερούς τους τρέχοντες ρυθμούς θνησιμότητας. Συνολικός δείκτης (ανδρών & γυναικών).',
    why: 'Πρώτης τάξεως δείκτης ευημερίας και ποιότητας ζωής, ανεξάρτητος από καθαρά οικονομικούς παράγοντες.',
    src: 'UN World Population Prospects',
  },
  {
    key: 'co2',
    cssVar: '--c-co2',
    title: 'Εκπομπές CO₂ ανά κάτοικο',
    code: 'EN.GHG.CO2.PC.CE.AR5',
    unit: 't CO₂e / κάτοικο',
    desc: 'Κατά κεφαλήν εκπομπές διοξειδίου του άνθρακα (εξαιρουμένων LULUCF), από ενέργεια, βιομηχανία και μεταφορές.',
    why: 'Αποτυπώνει το περιβαλλοντικό «κόστος» της ανάπτυξης — αν δηλαδή η οικονομική μεγέθυνση είναι βιώσιμη.',
    src: 'EDGAR — Emissions Database for Global Atmospheric Research',
  },
  {
    key: 'unemp',
    cssVar: '--c-unemp',
    title: 'Ποσοστό ανεργίας',
    code: 'SL.UEM.TOTL.ZS',
    unit: '% εργατικού δυναμικού',
    desc: 'Άνεργοι ως ποσοστό του συνολικού εργατικού δυναμικού, βάσει μοντελοποιημένων εκτιμήσεων του ILO.',
    why: 'Οι εκτιμήσεις ILO εξασφαλίζουν ενιαία μεθοδολογία για όλες τις χώρες, καθιστώντας τα δεδομένα άμεσα συγκρίσιμα.',
    src: 'ILO Modelled Estimates (ILOEST)',
  },
] as const

export function Data() {
  return (
    <Section id="data">
      <SectionIntro
        index="01"
        eyebrow="Τα δεδομένα"
        title="Τέσσερις δείκτες, μία πηγή, ένα καθαρό πάνελ"
        lede={
          <>
            Τα δεδομένα προέρχονται από τη βάση <strong>World Development Indicators (WDI)</strong> της Παγκόσμιας
            Τράπεζας — την πληρέστερη συλλογή αναπτυξιακών δεικτών παγκοσμίως, με πηγές ILO, ΟΗΕ και Eurostat. Καλύπτουν
            και τα <strong>27 κράτη-μέλη</strong> της ΕΕ για την περίοδο <strong>2000–2024</strong>.
          </>
        }
        conclusions={[
          { text: 'Ισορροπημένο πάνελ 27 × 25 = 675 παρατηρήσεων, χωρίς ελλιπείς τιμές.', tone: 'up' },
          { text: 'Όλοι οι δείκτες είναι συνεχείς αριθμητικοί — έτοιμοι για pivot, γραφήματα και μοντέλα.', tone: 'neutral' },
          { text: 'Σταθερές τιμές & PPP εξασφαλίζουν διαχρονική και διακρατική συγκρισιμότητα.', tone: 'gold' },
        ]}
      />

      <div className="data-grid">
        {INDICATOR_CARDS.map((ind, i) => (
          <Reveal key={ind.key} delay={i * 0.07} as="article" className="indcard card" >
            <div className="indcard__head" style={{ ['--ind' as string]: `var(${ind.cssVar})` }}>
              <span className="indcard__dot" />
              <h3 className="indcard__title">{ind.title}</h3>
            </div>
            <div className="indcard__code mono">{ind.code}</div>
            <div className="indcard__unit">{ind.unit}</div>
            <p className="indcard__desc">{ind.desc}</p>
            <div className="indcard__why">
              <span className="indcard__why-tag">Γιατί επιλέχθηκε</span>
              {ind.why}
            </div>
            <div className="indcard__src mono">{ind.src}</div>
          </Reveal>
        ))}
      </div>

      <Reveal as="div" className="data-structure card">
        <div className="data-structure__col">
          <div className="eyebrow">Δομή &amp; μορφή</div>
          <p>
            Τα δεδομένα κατέβηκαν από το <strong>DataBank</strong> σε μορφή Excel και οργανώθηκαν σε <strong>tidy
            πίνακα</strong>: κάθε γραμμή είναι μία παρατήρηση (χώρα × έτος) και κάθε στήλη μία μεταβλητή. Πραγματοποιήθηκε{' '}
            <strong>unpivot</strong> των πρωτογενών πινάκων ώστε τα έτη να γίνουν γραμμές αντί στηλών — προϋπόθεση για
            δυναμικούς πίνακες (Pivot Tables) και μοντέλα.
          </p>
          <button className="btn-download" onClick={downloadCsv}>
            <span className="btn-download__icon">↓</span> Λήψη δεδομένων (CSV · 675 γραμμές)
          </button>
        </div>
        <div className="data-structure__schema">
          <div className="schema-row schema-row--head mono">
            <span>Time</span><span>Country</span><span>GDP</span><span>Life</span><span>CO₂</span><span>Unemp</span>
          </div>
          <div className="schema-row mono"><span>2000</span><span>Austria</span><span>53.534</span><span>78,1</span><span>8,32</span><span>4,69</span></div>
          <div className="schema-row mono"><span>2000</span><span>Belgium</span><span>50.456</span><span>77,7</span><span>12,18</span><span>6,59</span></div>
          <div className="schema-row mono"><span>…</span><span>…</span><span>…</span><span>…</span><span>…</span><span>…</span></div>
          <div className="schema-row mono"><span>2024</span><span>Sweden</span><span>62.979</span><span>84,1</span><span>3,57</span><span>8,40</span></div>
          <div className="schema-caption mono">675 παρατηρήσεις · 6 στήλες · type: continuous</div>
        </div>
      </Reveal>

      <Reveal as="div" className="data-table-block">
        <h3 className="block-title serif">Το πάνελ με μια ματιά — μέσοι όροι ανά χώρα</h3>
        <p className="block-sub">
          Ταξινόμησε με κλικ σε οποιαδήποτε στήλη. Οι μπάρες δείχνουν τη θέση κάθε χώρας στο εύρος της ΕΕ. Ήδη εδώ
          ξεχωρίζει το <strong>Λουξεμβούργο</strong> στο ΑΕΠ και η διαχρονική <strong>ανεργία σε Ελλάδα &amp; Ισπανία</strong>.
        </p>
        <CountryTable />
      </Reveal>
    </Section>
  )
}
