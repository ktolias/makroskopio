import { useState } from 'react'
import { Nav, type NavItem } from './components/layout/Nav'
import { Footer } from './components/layout/Footer'
import { Presentation } from './components/presentation/Presentation'
import { Hero } from './sections/Hero'
import { Data } from './sections/Data'
import { Methodology } from './sections/Methodology'
import { Distributions } from './sections/Distributions'
import { Dashboard } from './sections/Dashboard'
import { Correlations } from './sections/Correlations'
import { Models } from './sections/Models'
import { Insights } from './sections/Insights'
import { AiTools } from './sections/AiTools'

const navItems: NavItem[] = [
  { id: 'hero', label: 'Αρχή' },
  { id: 'data', label: 'Δεδομένα' },
  { id: 'method', label: 'Μεθοδολογία' },
  { id: 'distributions', label: 'Κατανομές' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'correlations', label: 'Συσχετίσεις' },
  { id: 'models', label: 'Μοντέλα' },
  { id: 'insights', label: 'Συμπεράσματα' },
]

export default function App() {
  const [present, setPresent] = useState(false)
  return (
    <>
      <Nav items={navItems} onPresent={() => setPresent(true)} />
      <Presentation open={present} onClose={() => setPresent(false)} />
      <main>
        <Hero />
        <Data />
        <Methodology />
        <Distributions />
        <Dashboard />
        <Correlations />
        <Models />
        <Insights />
        <AiTools />
      </main>
      <Footer />

      {/* Landscape is too cramped on phones — ask the user to rotate back to portrait. */}
      <div className="rotate-guard" aria-hidden>
        <div className="rotate-guard__icon">⟳</div>
        <div className="rotate-guard__title serif">Περίστρεψε τη συσκευή</div>
        <p className="rotate-guard__text">Το ΜΑΚΡΟΣΚΟΠΙΟ είναι σχεδιασμένο για κατακόρυφη προβολή σε κινητό.</p>
      </div>
    </>
  )
}
