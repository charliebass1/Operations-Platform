import { QueueTab } from './QueueTab.jsx'
import { RULES } from '../data/decisions.js'
import { useWindowSize } from '../hooks/useWindowSize.js'

function RulesSidebar() {
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 10 }}>
        Automation rules
      </div>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', overflow: 'hidden',
      }}>
        {RULES.map((rule, i) => (
          <div key={rule.id} style={{
            padding: '10px 13px',
            borderBottom: i < RULES.length - 1 ? '1px solid var(--divider)' : 'none',
          }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--txt-4)',
              }}>
                {rule.id}
              </span>
              <span style={{ fontSize: 11, color: 'var(--txt-3)', marginLeft: 'auto' }}>
                {rule.fired_30d}× /30d
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--txt-2)', lineHeight: 1.4 }}>
              {rule.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AuditSidebar({ history }) {
  if (history.length === 0) return null
  const recent = history.slice(0, 6)
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 10 }}>
        Audit log
      </div>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', overflow: 'hidden',
      }}>
        {recent.map((entry, i) => (
          <div key={i} style={{
            padding: '9px 13px',
            borderBottom: i < recent.length - 1 ? '1px solid var(--divider)' : 'none',
          }}>
            <div style={{
              fontSize: 10, color: 'var(--txt-3)', fontFamily: "'JetBrains Mono', monospace", marginBottom: 3,
            }}>
              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {' · '}{entry.item_id}
            </div>
            <div style={{ fontSize: 11, color: 'var(--txt-2)', lineHeight: 1.45 }}>
              {entry.action_taken}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function OpsTab({ items, history, onAction, onReset }) {
  const width = useWindowSize()
  const isMobile = width < 768

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 252px',
      gap: 20, alignItems: 'start',
    }}>
      <QueueTab items={items} onAction={onAction} onReset={onReset} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <RulesSidebar />
        <AuditSidebar history={history} />
      </div>
    </div>
  )
}
