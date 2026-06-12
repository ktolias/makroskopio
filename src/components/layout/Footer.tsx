export function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__inner">
        <div className="footer__brand">
          <img src={`${import.meta.env.BASE_URL}macroscope-mark.svg`} alt="" className="footer__mark" />
          <div>
            <div className="serif footer__word">ΜΑΚΡΟΣΚΟΠΙΟ</div>
            <div className="footer__tag">EU-27 Macro Observatory · 2000–2024</div>
          </div>
        </div>
        <p className="footer__note">
          Διαδραστική μελέτη τεσσάρων μακροοικονομικών δεικτών των 27 κρατών-μελών της Ευρωπαϊκής Ένωσης.
          Δεδομένα: <strong>World Bank — World Development Indicators (WDI)</strong> · 675 παρατηρήσεις.
          Εργασία για το μάθημα «Δεδομένα Μεγάλης Κλίμακας &amp; Επιχειρηματική Αναλυτική»,
          Π.Μ.Σ. Διοίκηση Έργων, Πανεπιστήμιο Πειραιώς.
        </p>
        <div className="footer__meta mono">
          <span>27 χώρες</span>
          <span>·</span>
          <span>25 έτη</span>
          <span>·</span>
          <span>4 δείκτες</span>
          <span>·</span>
          <span>675 παρατηρήσεις</span>
        </div>
      </div>
    </footer>
  )
}
