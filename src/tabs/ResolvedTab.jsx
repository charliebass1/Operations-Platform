import { UrgencyBadge, StatusBadge, CategoryBadge } from '../components/Badge.jsx'
import { useWindowSize } from '../hooks/useWindowSize.js'

function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function fmtDatetime(ts) {
  return new Date(ts).toLocaleString([], {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function ResolvedTab({ items, history }) {
  const width = useWindowSize()
  const isMobile = width < 768
  const resolved = items.filter(i => i.status !== 'OPEN')

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 340px', gap: 20, alignItems: 'start' }}>
      {/* Resolved items */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          Actioned today
        </div>
        {resolved.length === 0 ? (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '32px 24px',
            textAlign: 'center', color: 'var(--txt-3)', fontSize: 13,
          }}>
            No items resolved yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {resolved.map(item => {
              const entry = history.find(h => h.item_id === item.id)
              return (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '14px 16px',
                    boxShadow: 'var(--shadow-sm)',
                    opacity: 0.85,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <UrgencyBadge level={item.urgency} />
                    <CategoryBadge category={item.category} />
                    <StatusBadge status={item.status} />
                    <span style={{
                      fontSize: 11, color: 'var(--txt-3)',
                      fontFamily: "'JetBrains Mono', monospace",
                      marginLeft: 'auto',
                    }}>
                      {item.id}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)', marginBottom: 4 }}>
                    {item.title}
                  </div>
                  {entry && (
                    <div style={{ fontSize: 12, color: 'var(--txt-2)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--txt-3)' }}>{fmtTime(entry.timestamp)} — </span>
                      {entry.action_taken}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Audit log */}
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          Audit log
        </div>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
        }}>
          {history.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--txt-3)', fontSize: 13 }}>
              No actions recorded yet.
            </div>
          ) : (
            <div>
              {history.map((entry, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 16px',
                    borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{ fontSize: 11, color: 'var(--txt-3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
                    {fmtDatetime(entry.timestamp)} · {entry.item_id}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--txt)', lineHeight: 1.5 }}>
                    {entry.action_taken}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
