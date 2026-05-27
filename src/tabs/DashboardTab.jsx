import { UrgencyDot } from '../components/Badge.jsx'
import { SlaCountdown } from '../components/SlaCountdown.jsx'
import { useWindowSize } from '../hooks/useWindowSize.js'

const URGENCY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }

const BATCH_STATUS_META = {
  'ON TRACK':    { color: 'var(--green)', bg: 'var(--green-lt)', border: 'var(--green-border)' },
  'BLOCKED':     { color: 'var(--red)',   bg: 'var(--red-lt)',   border: 'var(--red-border)'   },
  'SOURCING':    { color: 'var(--blue)',  bg: 'var(--blue-lt)',  border: 'var(--blue-border)'  },
  'SLA EXTENDED':{ color: 'var(--amber)', bg: 'var(--amber-lt)', border: 'var(--amber-border)' },
  'DEFERRED':    { color: 'var(--txt-3)', bg: 'var(--bg)',       border: 'var(--border)'       },
}

function StudyCard({ batch, onGoToOps }) {
  const sm = BATCH_STATUS_META[batch.status] || BATCH_STATUS_META['ON TRACK']
  const isBlocked = batch.status === 'BLOCKED'
  const completePct  = batch.total > 0 ? (batch.complete    / batch.total) * 100 : 0
  const progressPct  = batch.total > 0 ? (batch.in_progress / batch.total) * 100 : 0
  const pendingPct   = batch.total > 0 ? (batch.pending     / batch.total) * 100 : 0

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${isBlocked ? 'var(--red-border)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)', marginBottom: 2, lineHeight: 1.3 }}>
            {batch.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--txt-3)' }}>{batch.domain}</div>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 500, padding: '2px 7px',
          borderRadius: 'var(--radius-xs)', flexShrink: 0,
          color: sm.color, background: sm.bg, border: `1px solid ${sm.border}`,
        }}>
          {batch.status}
        </span>
      </div>

      <div>
        <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', display: 'flex' }}>
          <div style={{ width: `${completePct}%`, background: 'var(--green)', opacity: 0.7 }} />
          <div style={{ width: `${progressPct}%`, background: 'var(--amber)', opacity: 0.6 }} />
          <div style={{ width: `${pendingPct}%`, background: 'var(--txt-4)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--txt-3)', marginTop: 4 }}>
          <span>
            {batch.complete}/{batch.total} tasks
            {batch.researcher && <span> · {batch.researcher}</span>}
          </span>
          {isBlocked && (
            <button
              onClick={onGoToOps}
              style={{
                fontSize: 11, color: 'var(--accent)', background: 'none',
                border: 'none', cursor: 'pointer', fontWeight: 500, padding: 0,
              }}
            >
              1 action needed →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function NeedsAttentionWidget({ items, onGoToOps }) {
  const open = items
    .filter(i => i.status === 'OPEN')
    .sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency])
    .slice(0, 3)

  if (open.length === 0) {
    return (
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--green-border)',
        borderRadius: 'var(--radius)', padding: '20px 18px',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'var(--green-lt)', border: '1px solid var(--green-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, color: 'var(--green)', flexShrink: 0,
        }}>
          ✓
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)' }}>All clear</div>
          <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 2 }}>No open decisions</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', overflow: 'hidden',
    }}>
      {open.map((item, i) => (
        <div key={item.id} style={{
          padding: '11px 14px',
          borderBottom: i < open.length - 1 ? '1px solid var(--divider)' : 'none',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <UrgencyDot level={item.urgency} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 12, fontWeight: 500, color: 'var(--txt)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {item.title}
            </div>
            <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 1 }}>
              {item.category}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <SlaCountdown deadline={item.sla_deadline} urgency={item.urgency} />
            <button
              onClick={onGoToOps}
              style={{
                fontSize: 11, color: 'var(--accent)', background: 'none',
                border: 'none', cursor: 'pointer', fontWeight: 500, padding: 0,
              }}
            >
              → Ops
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function DashboardTab({ batches, experts, programs, items, onGoToOps }) {
  const width = useWindowSize()
  const isMobile = width < 768

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Plain-language stat */}
      <div style={{
        padding: '11px 16px',
        background: 'var(--accent-lt)', border: '1px solid rgba(196,81,26,0.15)',
        borderRadius: 'var(--radius)',
        fontSize: 12, color: 'var(--txt-2)', lineHeight: 1.6,
      }}>
        <strong style={{ color: 'var(--accent)', fontWeight: 600 }}>6%</strong> of captures include expert reasoning traces, not just final answers — the most valuable signal for alignment research remains largely uncollected.
      </div>

      {/* Two-column: Active Studies + Needs Attention */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 300px',
        gap: 20, alignItems: 'start',
      }}>

        {/* Active Studies */}
        <div>
          <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 10 }}>
            Active studies
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {batches.map(b => (
              <StudyCard key={b.id} batch={b} onGoToOps={onGoToOps} />
            ))}
          </div>
        </div>

        {/* Needs Attention */}
        <div>
          <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 10 }}>
            Needs attention
          </div>
          <NeedsAttentionWidget items={items} onGoToOps={onGoToOps} />
        </div>

      </div>
    </div>
  )
}
