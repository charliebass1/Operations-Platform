import { RESEARCH_EFFORT } from '../data/research.js'
import { useWindowSize } from '../hooks/useWindowSize.js'

const BATCH_STATUS_META = {
  'ON TRACK':     { color: 'var(--green)', bg: 'var(--green-lt)', border: 'var(--green-border)' },
  'AT RISK':      { color: 'var(--amber)', bg: 'var(--amber-lt)', border: 'var(--amber-border)' },
  'BLOCKED':      { color: 'var(--red)',   bg: 'var(--red-lt)',   border: 'var(--red-border)'   },
  'SOURCING':     { color: 'var(--blue)',  bg: 'var(--blue-lt)',  border: 'var(--blue-border)'  },
  'SLA EXTENDED': { color: 'var(--amber)', bg: 'var(--amber-lt)', border: 'var(--amber-border)' },
  'DEFERRED':     { color: 'var(--txt-3)', bg: 'var(--bg)',       border: 'var(--border)'       },
}

const EXPERT_STATUS_META = {
  'ACTIVE':             { color: 'var(--green)', bg: 'var(--green-lt)', border: 'var(--green-border)' },
  'UNDER REVIEW':       { color: 'var(--amber)', bg: 'var(--amber-lt)', border: 'var(--amber-border)' },
  'ON COOLDOWN':        { color: 'var(--txt-3)', bg: 'var(--bg)',       border: 'var(--border)'       },
  'CHECK-IN SCHEDULED': { color: 'var(--amber)', bg: 'var(--amber-lt)', border: 'var(--amber-border)' },
  'BLOCKED':            { color: 'var(--red)',   bg: 'var(--red-lt)',   border: 'var(--red-border)'   },
  'IT ESCALATED':       { color: 'var(--amber)', bg: 'var(--amber-lt)', border: 'var(--amber-border)' },
  'ACCESS GRANTED':     { color: 'var(--green)', bg: 'var(--green-lt)', border: 'var(--green-border)' },
  'SUSPENDED':          { color: 'var(--red)',   bg: 'var(--red-lt)',   border: 'var(--red-border)'   },
  'RECON IN PROGRESS':  { color: 'var(--amber)', bg: 'var(--amber-lt)', border: 'var(--amber-border)' },
}

function StatusPill({ status, meta }) {
  const m = meta[status] || { color: 'var(--txt-3)', bg: 'var(--bg)', border: 'var(--border)' }
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap',
      padding: '2px 8px', borderRadius: 'var(--radius-xs)',
      color: m.color, background: m.bg, border: `1px solid ${m.border}`,
    }}>
      {status}
    </span>
  )
}

function SegmentedBar({ complete, in_progress, pending, blocked, total }) {
  if (total === 0) return null
  return (
    <div style={{
      height: 5, borderRadius: 3, background: 'var(--border)',
      display: 'flex', overflow: 'hidden',
    }}>
      {complete > 0 && (
        <div style={{ width: `${(complete / total) * 100}%`, background: 'var(--green)', opacity: 0.8 }} />
      )}
      {in_progress > 0 && (
        <div style={{ width: `${(in_progress / total) * 100}%`, background: 'var(--blue)', opacity: 0.65 }} />
      )}
      {pending > 0 && (
        <div style={{ width: `${(pending / total) * 100}%`, background: 'var(--txt-4)' }} />
      )}
      {blocked > 0 && (
        <div style={{ width: `${(blocked / total) * 100}%`, background: 'var(--red)', opacity: 0.45 }} />
      )}
    </div>
  )
}

function BatchCard({ batch, experts, onGoToQueue }) {
  const meta = BATCH_STATUS_META[batch.status] || BATCH_STATUS_META['ON TRACK']
  const isBlocked = batch.status === 'BLOCKED'
  const pctDone = batch.total > 0 ? Math.round((batch.complete / batch.total) * 100) : 0
  const batchExperts = experts.filter(e => batch.expert_ids.includes(e.id))

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${isBlocked ? 'var(--red-border)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      padding: '16px 18px',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)', marginBottom: 2 }}>
            {batch.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--txt-3)' }}>{batch.domain}</div>
        </div>
        <StatusPill status={batch.status} meta={BATCH_STATUS_META} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <SegmentedBar {...batch} />
        <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--txt-3)', flexWrap: 'wrap' }}>
          {batch.complete > 0 && (
            <span><span style={{ color: 'var(--green)', fontWeight: 500 }}>{batch.complete}</span> done</span>
          )}
          {batch.in_progress > 0 && (
            <span><span style={{ color: 'var(--blue)', fontWeight: 500 }}>{batch.in_progress}</span> active</span>
          )}
          {batch.pending > 0 && <span>{batch.pending} pending</span>}
          {batch.blocked > 0 && (
            <span><span style={{ color: 'var(--red)', fontWeight: 500 }}>{batch.blocked}</span> blocked</span>
          )}
          <span style={{ marginLeft: 'auto' }}>{pctDone}% complete</span>
        </div>
      </div>

      {isBlocked ? (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 10px',
          background: 'var(--red-lt)', border: '1px solid var(--red-border)',
          borderRadius: 'var(--radius-sm)',
        }}>
          <span style={{ fontSize: 11, color: 'var(--red)' }}>
            Waiting on {batch.linked_dq}
          </span>
          <button
            onClick={onGoToQueue}
            style={{
              fontSize: 11, color: 'var(--accent)', background: 'none',
              border: 'none', cursor: 'pointer', fontWeight: 500, padding: 0,
            }}
          >
            Resolve in Queue →
          </button>
        </div>
      ) : (
        <div style={{ fontSize: 11, color: 'var(--txt-3)', minHeight: 16 }}>
          {batchExperts.length > 0 ? (
            <span>Experts: {batchExperts.map(e => e.name).join(', ')}</span>
          ) : batch.status === 'SOURCING' ? (
            <span style={{ color: 'var(--blue)' }}>Emergency expert sourcing underway</span>
          ) : batch.status === 'DEFERRED' ? (
            <span>Deferred — requestors notified, checkpoint in 30 days</span>
          ) : batch.status === 'SLA EXTENDED' ? (
            <span style={{ color: 'var(--amber)' }}>SLA extended 24h — sourcing continues</span>
          ) : (
            <span>No experts assigned</span>
          )}
        </div>
      )}
    </div>
  )
}

export function ResearchTab({ batches, experts, onGoToQueue }) {
  const width = useWindowSize()
  const isMobile = width < 768

  const totalTasks    = batches.reduce((s, b) => s + b.total, 0)
  const totalComplete = batches.reduce((s, b) => s + b.complete, 0)
  const totalActive   = batches.reduce((s, b) => s + b.in_progress, 0)
  const totalPending  = batches.reduce((s, b) => s + b.pending, 0)
  const totalBlocked  = batches.reduce((s, b) => s + b.blocked, 0)
  const overallPct    = totalTasks > 0 ? Math.round((totalComplete / totalTasks) * 100) : 0
  const daysLeft      = Math.ceil((RESEARCH_EFFORT.deadline - Date.now()) / 86_400_000)
  const blockedBatches = batches.filter(b => b.status === 'BLOCKED').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Project header */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '20px 22px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--txt)', marginBottom: 4, letterSpacing: '-0.01em' }}>
              {RESEARCH_EFFORT.name}
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--txt-3)', flexWrap: 'wrap' }}>
              <span>Lead: {RESEARCH_EFFORT.lead}</span>
              <span>·</span>
              <span>Sponsor: {RESEARCH_EFFORT.sponsor}</span>
              <span>·</span>
              <span style={{ color: daysLeft < 21 ? 'var(--amber)' : 'var(--txt-3)' }}>
                {daysLeft}d to deadline
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 26, fontWeight: 600, color: 'var(--txt)', lineHeight: 1, letterSpacing: '-0.02em' }}>
              {overallPct}%
            </div>
            <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 3 }}>complete</div>
          </div>
        </div>

        {/* Overall progress bar */}
        <SegmentedBar
          complete={totalComplete}
          in_progress={totalActive}
          pending={totalPending}
          blocked={totalBlocked}
          total={totalTasks}
        />
        <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'var(--txt-3)', marginTop: 8, flexWrap: 'wrap' }}>
          <span><span style={{ color: 'var(--green)', fontWeight: 500 }}>{totalComplete}</span> done</span>
          {totalActive > 0 && <span><span style={{ color: 'var(--blue)', fontWeight: 500 }}>{totalActive}</span> active</span>}
          {totalPending > 0 && <span>{totalPending} pending</span>}
          {totalBlocked > 0 && (
            <span><span style={{ color: 'var(--red)', fontWeight: 500 }}>{totalBlocked}</span> blocked</span>
          )}
          <span style={{ marginLeft: 'auto', color: 'var(--txt-3)' }}>{totalTasks} tasks total</span>
        </div>

        {blockedBatches > 0 && (
          <div style={{
            marginTop: 14,
            padding: '8px 12px',
            background: 'var(--red-lt)', border: '1px solid var(--red-border)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 12, color: 'var(--red)',
          }}>
            {blockedBatches} batch{blockedBatches !== 1 ? 'es' : ''} blocked — open decisions in the Queue require your attention.
          </div>
        )}
      </div>

      {/* Batch grid */}
      <div>
        <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 12 }}>
          Task batches
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 10,
        }}>
          {batches.map(batch => (
            <BatchCard
              key={batch.id}
              batch={batch}
              experts={experts}
              onGoToQueue={onGoToQueue}
            />
          ))}
        </div>
      </div>

      {/* Expert roster */}
      <div>
        <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 12 }}>
          Expert roster
        </div>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 120px' : '1fr 160px 70px 160px',
            gap: 12, padding: '9px 18px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface-2)',
            fontSize: 11, color: 'var(--txt-3)', fontWeight: 500,
          }}>
            <span>Expert</span>
            {!isMobile && <span>Domain</span>}
            {!isMobile && <span>Tier</span>}
            <span style={{ textAlign: 'right' }}>Status</span>
          </div>

          {experts.map((expert, i) => {
            const m = EXPERT_STATUS_META[expert.status] || EXPERT_STATUS_META['ACTIVE']
            return (
              <div
                key={expert.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr 120px' : '1fr 160px 70px 160px',
                  gap: 12, alignItems: 'center',
                  padding: '12px 18px',
                  borderBottom: i < experts.length - 1 ? '1px solid var(--divider)' : 'none',
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)' }}>{expert.name}</div>
                  {isMobile && (
                    <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 1 }}>{expert.domain} · {expert.tier}</div>
                  )}
                </div>
                {!isMobile && <div style={{ fontSize: 12, color: 'var(--txt-2)' }}>{expert.domain}</div>}
                {!isMobile && <div style={{ fontSize: 12, color: 'var(--txt-3)' }}>{expert.tier}</div>}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{
                    fontSize: 11, fontWeight: 500, padding: '2px 8px',
                    borderRadius: 'var(--radius-xs)', whiteSpace: 'nowrap',
                    color: m.color, background: m.bg, border: `1px solid ${m.border}`,
                  }}>
                    {expert.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
