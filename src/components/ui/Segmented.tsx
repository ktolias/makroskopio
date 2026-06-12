interface Option<T extends string> {
  value: T
  label: string
  /** Optional indicator key, to tint the active pill. */
  accent?: string
}

interface SegmentedProps<T extends string> {
  options: Option<T>[]
  value: T
  onChange: (v: T) => void
  size?: 'sm' | 'md'
}

export function Segmented<T extends string>({ options, value, onChange, size = 'md' }: SegmentedProps<T>) {
  return (
    <div className={`segmented segmented--${size}`} role="tablist">
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            className={`segmented__btn ${active ? 'is-active' : ''}`}
            style={active && o.accent ? { ['--seg-accent' as string]: `var(${o.accent})` } : undefined}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
