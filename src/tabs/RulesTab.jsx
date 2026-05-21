import { RULES } from '../data/decisions.js'
import { CategoryBadge } from '../components/Badge.jsx'

export function RulesTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{
        background: 'var(--orange-lt)', border: '1px solid #FDBA74',
        borderRadius: 'var(--radius)', padding: '12px 16px',
        fontSize: 13, color: 'var(--orange)', fontWeight: 500,
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <span>⚡</span>
        These automation rules monitor the expert network and surface operational decisions before they become incidents.
      </div>

      {RULES.map(rule => (
        <div
          key={rule.id}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '16px 18px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, color: 'var(--txt-3)',
            }}>
              {rule.id}
            </span>
            <CategoryBadge category={rule.category} />
            <span style={{
              marginLeft: 'auto', fontSize: 11,
              color: 'var(--txt-3)',
            }}>
              Fired {rule.fired_30d}× last 30d
            </span>
          </div>

          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt)', marginBottom: 10 }}>
            {rule.name}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                Trigger condition
              </div>
              <div style={{ fontSize: 12, color: 'var(--txt-2)', lineHeight: 1.6 }}>
                {rule.trigger}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                Automated action
              </div>
              <div style={{ fontSize: 12, color: 'var(--txt-2)', lineHeight: 1.6 }}>
                {rule.action}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
