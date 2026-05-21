import { useEffect } from 'react'

const ROADMAP = [
  {
    id: '01',
    name: 'Decision Queue',
    status: 'BUILT',
    description: "The ops manager's inbox: every situation requiring a human call, framed as situation → decision → deadline. Rules surface problems; humans decide.",
  },
  {
    id: '02',
    name: 'IRR Quality Monitor',
    status: 'BUILT',
    description: 'Inter-rater reliability by domain and task type. Automated flagging when agreement drops below threshold. Calibration scheduling. The data quality heartbeat.',
  },
  {
    id: '03',
    name: 'Expert Wellbeing Dashboard',
    status: 'PLANNED',
    description: 'Composite wellbeing index: session sentiment trends, workload distribution, time-since-check-in, distress signal history. Proactive, not reactive.',
  },
  {
    id: '04',
    name: 'Cohort Analytics',
    status: 'PLANNED',
    description: 'Retention curves by cohort, onboarding path, domain, and tier. Week 1/4/12 drop-off analysis. Prove process improvements are working — or find out they\'re not.',
  },
  {
    id: '05',
    name: 'Vendor Reconciliation',
    status: 'PLANNED',
    description: 'Automated weekly diff between internal records and vendor records. Conflict resolution workflows. Payment dispute prevention. Audit trail.',
  },
  {
    id: '06',
    name: 'Domain Coverage Map',
    status: 'PLANNED',
    description: 'Real-time expert-to-request coverage ratios by domain. Automated sourcing triggers when ratios fall below threshold.',
  },
  {
    id: '07',
    name: 'Onboarding Funnel',
    status: 'PLANNED',
    description: 'Step-completion rates, bottleneck detection, automated nudge campaigns. Most expert networks lose 40% of pipeline before first task. This finds where.',
  },
  {
    id: '08',
    name: 'Task Assignment Intelligence',
    status: 'PLANNED',
    description: 'Match quality scoring — not just availability, but fit, domain depth, workload balance, IRR history. Feedback loops that improve future matches automatically.',
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
        background: 'rgba(28,25,23,0.5)',
        backdropFilter: 'blur(3px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          borderRadius: 12,
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
          width: '100%', maxWidth: 800,
          maxHeight: '90vh', overflowY: 'auto',
          padding: '32px',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 20, right: 20,
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--bg)', border: '1px solid var(--border)',
            color: 'var(--txt-3)', fontSize: 16, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 10 }}>
            Human Data Operations Platform
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: 'var(--txt)', marginBottom: 10, lineHeight: 1.25, letterSpacing: '-0.02em' }}>
            This is one tab of eight.
          </h2>
          <p style={{ fontSize: 14, color: 'var(--txt-2)', lineHeight: 1.75, maxWidth: 520 }}>
            The Decision Queue is the load-bearing structure — if the ops manager can action every decision fast, everything downstream improves. Six more tabs build the full operational picture.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(216px, 1fr))',
          gap: 10,
        }}>
          {ROADMAP.map(tab => {
            const isBuilt = tab.status === 'BUILT'
            return (
              <div
                key={tab.id}
                style={{
                  border: `1px solid ${isBuilt ? 'var(--green-border)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius)',
                  padding: '14px 16px',
                  background: isBuilt ? 'var(--green-lt)' : 'var(--surface-2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, color: 'var(--txt-3)',
                  }}>
                    {tab.id}
                  </span>
                  <span style={{
                    fontSize: 10, fontWeight: 600, padding: '2px 7px',
                    borderRadius: 4, letterSpacing: '0.04em',
                    background: isBuilt ? 'var(--green)' : 'var(--border)',
                    color: isBuilt ? '#fff' : 'var(--txt-3)',
                  }}>
                    {tab.status}
                  </span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)', marginBottom: 6, lineHeight: 1.3 }}>
                  {tab.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--txt-3)', lineHeight: 1.65 }}>
                  {tab.description}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--divider)',
          fontSize: 13, color: 'var(--txt-3)', lineHeight: 1.75,
        }}>
          <strong style={{ color: 'var(--txt)', fontWeight: 500 }}>Built by Charlie Bass</strong> — applying for Program Operations Manager, Human Data.
          {' '}At Palate Insights, this operational architecture scaled an expert network from 50 to 2,300 contributors.
          {' '}The domains differ. The architecture is identical.
        </div>
      </div>
    </div>
  )
}
