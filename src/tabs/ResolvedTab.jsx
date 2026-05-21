import { StatusBadge } from '../components/Badge.jsx'
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
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 300px', gap: 20, alignItems: 'start' }}>
      {/* Resolved items */}
      <div>
        <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 12 }}>
          Actioned this session
        </div>
        {resolved.length === 0 ? (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '40px 24px',
            textAlign: 'center', color: 'var(--txt-3)', fontSize: 13,
          }}>
            No decisions actioned yet.
          </div>
        ) : (
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
          }}>
            {resolved.map((item, i) => {
              const entry = history.find(h => h.item_id === item.id)
              return (
                <div
                  key={item.id}
                  style={{
                    padding: '14px 18px',
                    borderBottom: i < resolved.length - 1 ? '1px solid var(--divider)' : 'none',
                    opacity: 0.85,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)', flex: 1, minWidth: 0 }}>
                      {item.title}
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                  {entry && (
                    <div style={{ fontSize: 12, color: 'var(--txt-3)', lineHeight: 1.5 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                        {fmtTime(entry.timestamp)}
                      </span>
                      {' — '}
                      <span style={{ color: 'var(--txt-2)' }}>{entry.action_taken}</span>
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
        <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 12 }}>
          Audit log
        </div>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', overflow: 'hidden',
        }}>
          {history.length === 0 ? (
            <div style={{ padding: '24px 18px', textAlign: 'center', color: 'var(--txt-3)', fontSize: 13 }}>
              No actions recorded yet.
            </div>
          ) : (
            history.map((entry, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 18px',
                  borderBottom: i < history.length - 1 ? '1px solid var(--divider)' : 'none',
                }}
              >
                <div style={{
                  fontSize: 11, color: 'var(--txt-3)',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: 3,
                }}>
                  {fmtDatetime(entry.timestamp)} · {entry.item_id}
                </div>
                <div style={{ fontSize: 12, color: 'var(--txt-2)', lineHeight: 1.5 }}>
                  {entry.action_taken}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
