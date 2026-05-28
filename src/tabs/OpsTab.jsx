import { QueueTab } from './QueueTab.jsx'
import { AUTOMATIONS, JOBS } from '../data/jobs.js'

const jobMap = Object.fromEntries(JOBS.map(j => [j.id, j]))

const AUTO_STATUS_META = {
  'LIVE':   { color: 'var(--green)', bg: 'var(--green-lt)', border: 'var(--green-border)' },
  'IN DEV': { color: 'var(--blue)',  bg: 'var(--blue-lt)',  border: 'var(--blue-border)'  },
}

function AutomationStack() {
  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 10 }}>
        Automation stack
      </div>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', overflow: 'hidden',
      }}>
        {AUTOMATIONS.map((auto, i) => {
          const sm = AUTO_STATUS_META[auto.status]
          const job = auto.study_scope ? jobMap[auto.study_scope] : null

          return (
            <div key={auto.id} style={{
              padding: '13px 16px',
              borderBottom: i < AUTOMATIONS.length - 1 ? '1px solid var(--divider)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)', flex: 1 }}>
                  {auto.name}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 500, padding: '2px 7px',
                  borderRadius: 'var(--radius-xs)', flexShrink: 0,
                  color: sm.color, background: sm.bg, border: `1px solid ${sm.border}`,
                }}>
                  {auto.status}
                </span>
              </div>

              <div style={{ fontSize: 12, color: 'var(--txt-3)', lineHeight: 1.55, marginBottom: 7 }}>
                {auto.description}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                <span style={{
                  padding: '1px 7px', borderRadius: 'var(--radius-xs)',
                  background: 'var(--bg)', border: '1px solid var(--border)',
                  color: 'var(--txt-3)',
                }}>
                  {auto.category}
                </span>
                <span style={{ color: 'var(--txt-4)' }}>→</span>
                {job ? (
                  <span style={{
                    padding: '1px 7px', borderRadius: 'var(--radius-xs)',
                    background: 'var(--accent-lt)', border: '1px solid rgba(196,81,26,0.2)',
                    color: 'var(--accent)', fontWeight: 500,
                    maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {job.title}
                  </span>
                ) : (
                  <span style={{ color: 'var(--txt-3)' }}>All studies</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function OpsTab({ items, history, onAction, onReset }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 10 }}>
          Decision queue
        </div>
        <QueueTab items={items} onAction={onAction} onReset={onReset} />
      </div>
      <AutomationStack />
    </div>
  )
}
