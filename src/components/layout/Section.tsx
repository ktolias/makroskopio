import type { ReactNode } from 'react'

export function Section({ id, children, tint }: { id: string; children: ReactNode; tint?: boolean }) {
  return (
    <section id={id} className={`section ${tint ? 'section--tint' : ''}`}>
      <div className="shell">{children}</div>
    </section>
  )
}
