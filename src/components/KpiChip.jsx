export function KpiChip({ label, value, accent, sub }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '14px 20px',
      boxShadow: 'var(--shadow-sm)',
      minWidth: 140,
      flex: '1 1 140px',
    }}>
      <div style={{
        fontSize: 26, fontWeight: 600,
        color: accent ?? 'var(--txt)',
        lineHeight: 1,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: 'var(--txt-2)', marginTop: 4, fontWeight: 500 }}>
        {label}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 2 }}>{sub}</div>
      )}
    </div>
  )
}
