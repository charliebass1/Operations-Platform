import { useEffect } from 'react'

const ROADMAP = [
  {
    id: '01',
    name: 'Decision Queue',
    status: 'BUILT',
    description:
      'The ops manager\'s inbox: every situation that requires a human call, framed as situation → decision → deadline. Rules surface problems; humans decide.',
    icon: '⬡',
  },
  {
    id: '02',
    name: 'IRR Quality Monitor',
    status: 'BUILT',
    description:
      'Inter-rater reliability by domain and task type. Automated flagging when agreement drops below threshold. Calibration scheduling. The data quality heartbeat.',
    icon: '◈',
  },
  {
    id: '03',
    name: 'Expert Wellbeing Dashboard',
    status: 'PLANNED',
    description:
      'Composite wellbeing index: session sentiment trends, workload distribution, time-since-check-in, distress signal history. Proactive, not reactive.',
    icon: '◎',
  },
  {
    id: '04',
    name: 'Cohort Analytics',
    status: 'PLANNED',
    description:
      'Retention curves by cohort, onboarding path, domain, and tier. Week 1/4/12 drop-off analysis. Prove process improvements are working — or find out they\'re not.',
    icon: '◻',
  },
  {
    id: '05',
    name: 'Vendor Reconciliation',
    status: 'PLANNED',
    description:
      'Automated weekly diff between internal records and vendor (Scale AI) records. Conflict resolution workflows. Payment dispute prevention. Audit trail.',
    icon: '◬',
  },
  {
    id: '06',
    name: 'Domain Coverage Map',
    status: 'PLANNED',
    description:
      'Real-time expert-to-request coverage ratios by domain. Automated sourcing triggers when ratios fall below threshold. EOQ theory applied to expert networks.',
    icon: '◱',
  },
  {
    id: '07',
    name: 'Onboarding Funnel',
    status: 'PLANNED',
    description:
      'Step-completion rates, bottleneck detection, automated nudge campaigns. Most expert networks lose 40% of their pipeline before the first task. This finds where.',
    icon: '◩',
  },
  {
    id: '08',
    name: 'Task Assignment Intelligence',
    status: 'PLANNED',
    description:
      'Match quality scoring — not just availability, but fit, domain depth, workload balance, IRR history. Feedback loops that improve future matches automatically.',
    icon: '◦',
  },
]

export function VisionModal({ onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'rgba(15, 12, 9, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          borderRadius: 12,
          boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10)',
          width: '100%', maxWidth: 820,
          maxHeight: '90vh', overflowY: 'auto',
          padding: '32px 32px 28px',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--bg)', border: '1px solid var(--border)',
            color: 'var(--txt-3)', fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6, background: 'var(--orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
            }}>
              A
            </div>
            <span style={{ fontSize: 13, color: 'var(--txt-3)', fontWeight: 500 }}>
              Human Data Operations Platform — Vision
            </span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--txt)', marginBottom: 8, lineHeight: 1.3 }}>
            This is one tab of eight.
          </h2>
          <p style={{ fontSize: 14, color: 'var(--txt-2)', lineHeight: 1.7, maxWidth: 560 }}>
            The Decision Queue is the load-bearing structure everything else sits on — if the ops manager can action every decision fast, everything downstream improves. The remaining six tabs build the full operational picture.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 12,
        }}>
          {ROADMAP.map(tab => {
            const isBuilt = tab.status === 'BUILT'
            return (
              <div
                key={tab.id}
                style={{
                  border: `1px solid ${isBuilt ? '#BBF7D0' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)',
                  padding: '14px 16px',
                  background: isBuilt ? 'var(--ok-lt)' : 'var(--bg)',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 10, color: 'var(--txt-3)',
                    }}>
                      {tab.id}
                    </span>
                    <span style={{ fontSize: 16, color: isBuilt ? 'var(--ok)' : 'var(--txt-3)' }}>
                      {tab.icon}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '2px 7px',
                    borderRadius: 4, letterSpacing: '0.05em',
                    background: isBuilt ? 'var(--ok)' : 'var(--border)',
                    color: isBuilt ? '#fff' : 'var(--txt-3)',
                  }}>
                    {tab.status}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--txt)', marginBottom: 6, lineHeight: 1.3 }}>
                  {tab.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--txt-2)', lineHeight: 1.6 }}>
                  {tab.description}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)',
          fontSize: 13, color: 'var(--txt-2)', lineHeight: 1.7,
        }}>
          <strong style={{ color: 'var(--txt)' }}>Built by Charlie Bass</strong> — applying for Program Operations Manager, Human Data.
          {' '}At Palate Insights, this operational architecture scaled an expert network from 50 to 2,300 contributors.
          {' '}The domains differ. The architecture is identical.
        </div>
      </div>
    </div>
  )
}
