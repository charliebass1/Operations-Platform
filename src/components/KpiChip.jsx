export function KpiChip({ label, value, dotColor, sub }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '18px 20px 16px',
    }}>
      <div style={{
        fontSize: 30,
        fontWeight: 600,
        color: 'var(--txt)',
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--txt-2)', marginTop: 7, fontWeight: 500 }}>
        {label}
      </div>
      {sub && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
          {dotColor && (
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: dotColor, flexShrink: 0, display: 'inline-block',
            }} />
          )}
          <span style={{ fontSize: 11, color: 'var(--txt-3)' }}>{sub}</span>
        </div>
      )}
    </div>
  )
}
