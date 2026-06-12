import { Section } from '../components/layout/Section'
import { Reveal } from '../components/ui/Reveal'

const USES = [
  {
    where: 'Διαδραστικότητα dashboard',
    what: 'Κατασκευή VBA macros για τα κουμπιά εναλλαγής δείκτη/έτους στον διαδραστικό χάρτη της ΕΕ.',
    how: 'Περιγραφή της επιθυμητής λειτουργίας σε φυσική γλώσσα· το εργαλείο παρήγαγε και διόρθωσε τον κώδικα VBA.',
  },
  {
    where: 'Σύνταξη αναφοράς',
    what: 'Διαμόρφωση και γλωσσική επιμέλεια του συνοδευτικού κειμένου, δομή κεφαλαίων.',
    how: 'Επανειλημμένη βελτίωση διατύπωσης με διατήρηση της ακρίβειας των ευρημάτων.',
  },
  {
    where: 'Οπτικοποίηση δεδομένων',
    what: 'Σχεδιασμός αυτής της διαδραστικής εφαρμογής παρουσίασης (TypeScript / React / Vite).',
    how: 'Τα πραγματικά δεδομένα και οι υπολογισμοί επαληθεύτηκαν ώστε να συμφωνούν με το Excel workbook.',
  },
]

export function AiTools() {
  return (
    <Section id="ai" tint>
      <Reveal as="div" className="ai-block">
        <div className="ai-block__head">
          <span className="eyebrow">Κεφάλαιο 4 · Εργαλεία Τεχνητής Νοημοσύνης</span>
          <h2 className="ai-block__title serif">Πού — και πώς — χρησιμοποιήθηκε Generative AI</h2>
          <p className="ai-block__lede">
            Με πνεύμα διαφάνειας, καταγράφονται όλα τα σημεία όπου αξιοποιήθηκαν εργαλεία τεχνητής νοημοσύνης. Η{' '}
            <strong>αναλυτική κρίση</strong>, η επιλογή δεικτών, η ερμηνεία και η αξιολόγηση των μοντέλων παραμένουν
            ευθύνη του αναλυτή· τα εργαλεία λειτούργησαν επιταχυντικά.
          </p>
        </div>
        <div className="ai-grid">
          {USES.map((u, i) => (
            <Reveal key={u.where} delay={i * 0.08} as="article" className="aicard card">
              <div className="aicard__where">{u.where}</div>
              <div className="aicard__what">{u.what}</div>
              <div className="aicard__how"><span className="aicard__how-tag mono">πώς</span>{u.how}</div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
