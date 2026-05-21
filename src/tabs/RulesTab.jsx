import { RULES } from '../data/decisions.js'

export function RulesTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <p style={{ fontSize: 13, color: 'var(--txt-3)', marginBottom: 20, lineHeight: 1.6 }}>
        Five automation rules monitor the expert network continuously and surface operational decisions before they become incidents.
      </p>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
      }}>
        {RULES.map((rule, i) => (
          <div
            key={rule.id}
            style={{
              padding: '18px 20px',
              borderBottom: i < RULES.length - 1 ? '1px solid var(--divider)' : 'none',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10 }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, color: 'var(--txt-3)',
                flexShrink: 0,
              }}>
                {rule.id}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--txt)' }}>
                {rule.name}
              </span>
              <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--txt-3)', flexShrink: 0 }}>
                Fired {rule.fired_30d}× / 30d
              </span>
            </div>

            {/* Two-col detail */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingLeft: 48 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--txt-3)', marginBottom: 4, fontWeight: 500 }}>
                  Trigger condition
                </div>
                <div style={{ fontSize: 12, color: 'var(--txt-2)', lineHeight: 1.65 }}>
                  {rule.trigger}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--txt-3)', marginBottom: 4, fontWeight: 500 }}>
                  Automated action
                </div>
                <div style={{ fontSize: 12, color: 'var(--txt-2)', lineHeight: 1.65 }}>
                  {rule.action}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
