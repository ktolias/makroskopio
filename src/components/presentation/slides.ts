interface Bullet { text: string; accent?: string }
interface Stat { value: string; label: string; color?: string }

export interface Slide {
  kind: 'title' | 'content'
  eyebrow?: string
  kicker?: string
  title: string
  subtitle?: string
  meta?: string[]
  bullets?: Bullet[]
  stats?: Stat[]
  footer?: string
}

const C = {
  gdp: 'var(--c-gdp)',
  life: 'var(--c-life)',
  co2: 'var(--c-co2)',
  unemp: 'var(--c-unemp)',
  azure: 'var(--azure)',
}

export const SLIDES: Slide[] = [
  {
    kind: 'title',
    eyebrow: 'Δεδομένα Μεγάλης Κλίμακας & Επιχειρηματική Αναλυτική',
    title: 'ΜΑΚΡΟΣΚΟΠΙΟ',
    subtitle: 'Στατιστική απεικόνιση τεσσάρων μακροοικονομικών δεικτών των 27 χωρών της ΕΕ (2000–2024)',
    meta: ['Π.Μ.Σ. Διοίκηση Έργων · Πανεπιστήμιο Πειραιώς', 'Διδάσκων: Π. Ειρηνάκης'],
  },
  {
    kind: 'content',
    kicker: '01 · Τα δεδομένα',
    title: 'Μία πηγή, τέσσερις δείκτες, ένα καθαρό πάνελ',
    bullets: [
      { text: 'Πηγή: World Bank — World Development Indicators (WDI)', accent: C.azure },
      { text: 'Κατά κεφαλήν ΑΕΠ (PPP, σταθερά $ 2021)', accent: C.gdp },
      { text: 'Προσδόκιμο ζωής στη γέννηση (έτη)', accent: C.life },
      { text: 'Εκπομπές CO₂ ανά κάτοικο (t CO₂e)', accent: C.co2 },
      { text: 'Ποσοστό ανεργίας (% εργατικού δυναμικού, ILO)', accent: C.unemp },
    ],
    stats: [
      { value: '27', label: 'χώρες', color: C.azure },
      { value: '25', label: 'έτη', color: C.gdp },
      { value: '675', label: 'παρατηρήσεις', color: C.life },
    ],
    footer: 'Tidy πίνακας 27 × 25 · μηδέν ελλιπείς τιμές · σταθερές τιμές & PPP για συγκρισιμότητα',
  },
  {
    kind: 'content',
    kicker: '02 · Ερωτήματα',
    title: 'Τέσσερα ερευνητικά ερωτήματα',
    bullets: [
      { text: 'Q1 — Ποια η κατανομή των τεσσάρων δεικτών στην ΕΕ;', accent: C.azure },
      { text: 'Q2 — Συσχετίζεται το κατά κεφαλήν εισόδημα με το προσδόκιμο ζωής;', accent: C.life },
      { text: 'Q3 — Συσχετίζεται η ανεργία με χαμηλό προσδόκιμο ζωής;', accent: C.unemp },
      { text: 'Q4 — Συνδέονται οι εκπομπές CO₂ με την οικονομική ανάπτυξη;', accent: C.co2 },
    ],
    footer: 'Στόχος: συσχετίσεις σε περιγραφικό επίπεδο — όχι αιτιώδεις σχέσεις',
  },
  {
    kind: 'content',
    kicker: '03 · Q1 · Κατανομές',
    title: 'Θηκογράμματα — τι αποκαλύπτουν',
    bullets: [
      { text: 'ΑΕΠ: έντονη ασυμμετρία, λόγος 10:1 (Λουξεμβούργο ↔ Βουλγαρία)', accent: C.gdp },
      { text: 'Προσδόκιμο ζωής: στενή, ομοιογενής κατανομή (~12 έτη εύρος)', accent: C.life },
      { text: 'CO₂: ακραίες τιμές προς τα πάνω (εντάσεως-άνθρακα οικονομίες)', accent: C.co2 },
      { text: 'Ανεργία: μεγάλη διασπορά — ακραίες τιμές Ελλάδα & Ισπανία (κρίση)', accent: C.unemp },
    ],
    footer: 'Σύγκλιση στην υγεία · απόκλιση στον πλούτο',
  },
  {
    kind: 'content',
    kicker: '04 · Dashboard',
    title: 'Διαδραστικό dashboard',
    bullets: [
      { text: 'Pivot Tables & PivotCharts ανά δείκτη, κοινά Slicers χώρας/έτους', accent: C.azure },
      { text: 'Διαδραστικός χάρτης της ΕΕ με εναλλαγή δείκτη & έτους (VBA macros)', accent: C.azure },
      { text: 'Web cartogram: χρονικό slider 2000→2024 με αναπαραγωγή', accent: C.gdp },
      { text: 'Διαχρονικές γραμμές ανά χώρα για άμεση σύγκριση τροχιών', accent: C.life },
    ],
    footer: 'Δυτικά-ανατολικά μοτίβο πλούτου που στενεύει · η ανεργία «ανάβει» στον νότο 2010–2014',
  },
  {
    kind: 'content',
    kicker: '05 · Q2–Q4 · Συσχετίσεις',
    title: 'Πίνακας συσχετίσεων Pearson',
    stats: [
      { value: '+0,59', label: 'ΑΕΠ ↔ Προσδόκιμο', color: C.life },
      { value: '+0,53', label: 'ΑΕΠ ↔ CO₂', color: C.gdp },
      { value: '−0,39', label: 'ΑΕΠ ↔ Ανεργία', color: C.unemp },
      { value: '+0,06', label: 'Υγεία ↔ CO₂ (n.s.)', color: C.co2 },
    ],
    bullets: [
      { text: 'Το εισόδημα είναι ο «κόμβος»: συνδέεται με υγεία και περιβάλλον', accent: C.azure },
      { text: 'Με 675 παρατηρήσεις όλες οι σχέσεις είναι σημαντικές — εκτός υγεία × CO₂', accent: C.co2 },
    ],
    footer: 'Έλεγχος σημαντικότητας t (df = 673) · συσχέτιση ≠ αιτιότητα',
  },
  {
    kind: 'content',
    kicker: '06 · Μοντέλα · Ομάδα Α',
    title: 'Προσδόκιμο ζωής ← ΑΕΠ: τρεις παλινδρομήσεις',
    stats: [
      { value: '0,35', label: 'R² Γραμμική', color: C.azure },
      { value: '0,62', label: 'R² Πολυωνυμική', color: C.life },
      { value: '0,55', label: 'R² Λογαριθμική', color: C.gdp },
    ],
    bullets: [
      { text: 'Νικήτρια η πολυωνυμική (2ου) σε R², MAE και MSE', accent: C.life },
      { text: 'Η σχέση έχει «ταβάνι»: το εισόδημα βελτιώνει την υγεία με φθίνοντα ρυθμό', accent: C.life },
    ],
    footer: 'Η γραμμική υπόθεση αποτυγχάνει — η μη γραμμικότητα είναι το εύρημα',
  },
  {
    kind: 'content',
    kicker: '07 · Μοντέλα · Ομάδα Β',
    title: 'Χρονοσειρά μέσου ΑΕΠ ΕΕ-27',
    stats: [
      { value: '0,94', label: 'R² Κινούμενος μέσος', color: C.life },
      { value: '0,88', label: 'R² Εκθετική εξομάλυνση', color: C.gdp },
    ],
    bullets: [
      { text: 'Νικητής ο κινούμενος μέσος (3 ετών): ακολουθεί πιστότερα τη σειρά', accent: C.life },
      { text: 'Η εκθετική εξομάλυνση εισάγει χρονική υστέρηση (lag) στα σοκ 2009 & 2020', accent: C.gdp },
    ],
    footer: 'Το R² goodness-of-fit (Ομ. Β) δεν συγκρίνεται με το R² παλινδρόμησης (Ομ. Α)',
  },
  {
    kind: 'content',
    kicker: '08 · Συμπεράσματα',
    title: 'Τέσσερα ερωτήματα, τέσσερις απαντήσεις',
    bullets: [
      { text: 'Q1 — Σύγκλιση στην υγεία, απόκλιση στον πλούτο (δύο Ευρώπες)', accent: C.azure },
      { text: 'Q2 — Το εισόδημα «αγοράζει» χρόνια ζωής, αλλά με φθίνουσα απόδοση', accent: C.life },
      { text: 'Q3 — Η ανεργία δεν προβλέπει το προσδόκιμο — τα δίχτυα πρόνοιας απορροφούν', accent: C.unemp },
      { text: 'Q4 — Ανάπτυξη & ρύποι αποσυνδέονται: η πράσινη ευημερία είναι εφικτή', accent: C.co2 },
    ],
    footer: 'Προτάσεις: στοχευμένη συνοχή · ποιότητα υγείας · θωράκιση πρόνοιας · διάχυση πράσινων πρακτικών',
  },
  {
    kind: 'content',
    kicker: '09 · Τεχνητή Νοημοσύνη & κλείσιμο',
    title: 'Χρήση Generative AI — με διαφάνεια',
    bullets: [
      { text: 'VBA macros για τη διαδραστικότητα του dashboard', accent: C.azure },
      { text: 'Γλωσσική επιμέλεια & δομή της αναφοράς', accent: C.gdp },
      { text: 'Σχεδιασμός αυτής της διαδραστικής εφαρμογής (TypeScript/React/Vite)', accent: C.life },
    ],
    footer: 'Η αναλυτική κρίση, η ερμηνεία και η αξιολόγηση παραμένουν ευθύνη του αναλυτή · Ευχαριστώ!',
  },
]
