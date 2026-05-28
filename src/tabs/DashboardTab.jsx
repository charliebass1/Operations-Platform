import { useState } from 'react'
import { JOBS } from '../data/jobs.js'

const STATUS_META = {
  'ACTIVE': { color: 'var(--green)', bg: 'var(--green-lt)', border: 'var(--green-border)', label: 'Active' },
  'DESIGN': { color: 'var(--blue)',  bg: 'var(--blue-lt)',  border: 'var(--blue-border)',  label: 'Study Design' },
  'CLOSED': { color: 'var(--txt-3)', bg: 'var(--bg)',       border: 'var(--border)',       label: 'Closed' },
}

function JobCard({ job }) {
  const [expanded, setExpanded] = useState(false)
  const sm = STATUS_META[job.status]
  const pct = job.target > 0 ? Math.round((job.complete / job.target) * 100) : 0

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}>
      {/* Header row */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(e => !e)}
        onKeyDown={e => e.key === 'Enter' && setExpanded(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 20px', cursor: 'pointer', userSelect: 'none',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--txt)', marginBottom: 5, lineHeight: 1.3 }}>
            {job.title}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12, color: 'var(--txt-3)', flexWrap: 'wrap' }}>
            <span>{job.domain}</span>
            <span style={{ color: 'var(--divider)' }}>·</span>
            <span>{job.lead}</span>
            {job.status === 'ACTIVE' && (
              <>
                <span style={{ color: 'var(--divider)' }}>·</span>
                <span style={{ color: 'var(--green)', fontWeight: 500 }}>{job.complete}/{job.target} tasks</span>
              </>
            )}
            {job.status === 'CLOSED' && (
              <>
                <span style={{ color: 'var(--divider)' }}>·</span>
                <span>Closed {job.closed}</span>
              </>
            )}
            {job.status === 'DESIGN' && (
              <>
                <span style={{ color: 'var(--divider)' }}>·</span>
                <span style={{ color: 'var(--blue)' }}>Target {job.target} participants</span>
              </>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span style={{
            fontSize: 11, fontWeight: 500, padding: '3px 9px',
            borderRadius: 'var(--radius-xs)',
            color: sm.color, background: sm.bg, border: `1px solid ${sm.border}`,
          }}>
            {sm.label}
          </span>
          <span style={{
            color: 'var(--txt-4)', fontSize: 16, lineHeight: 1,
            transform: expanded ? 'rotate(90deg)' : 'none',
            transition: 'transform var(--transition)',
            display: 'inline-block',
          }}>›</span>
        </div>
      </div>

      {/* Progress bar — active and closed only */}
      {job.status !== 'DESIGN' && (
        <div style={{ height: 2, background: 'var(--border)' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: job.status === 'CLOSED' ? 'var(--txt-4)' : 'var(--green)',
            opacity: 0.7,
          }} />
        </div>
      )}

      {/* Dropdown content */}
      {expanded && (
        <div style={{
          borderTop: '1px solid var(--divider)',
          padding: '18px 20px',
          background: 'var(--surface-2)',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>

          {/* Summary */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 6 }}>
              Summary
            </div>
            <div style={{ fontSize: 13, color: 'var(--txt-2)', lineHeight: 1.75 }}>
              {job.summary}
            </div>
          </div>

          {/* ACTIVE — early signals */}
          {job.status === 'ACTIVE' && job.current_insights && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 8 }}>
                Early signals
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {job.current_insights.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--txt-2)', lineHeight: 1.55 }}>
                    <span style={{ color: 'var(--green)', flexShrink: 0, fontWeight: 600 }}>→</span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DESIGN — design stage */}
          {job.status === 'DESIGN' && (
            <div style={{
              padding: '10px 14px',
              background: 'var(--blue-lt)', border: '1px solid var(--blue-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 13, color: 'var(--txt-2)', lineHeight: 1.65,
            }}>
              <span style={{ color: 'var(--blue)', fontWeight: 500 }}>{job.design_stage}</span>
              {' — '}{job.design_notes}
            </div>
          )}

          {/* CLOSED — outcomes */}
          {job.status === 'CLOSED' && job.outcomes && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 10 }}>
                Outcomes
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                {[
                  { label: 'Completion', value: job.outcomes.completion },
                  { label: 'Depth score', value: job.outcomes.avg_depth_score?.toFixed(2) },
                  { label: 'Final IRR', value: job.outcomes.final_irr?.toFixed(2) },
                ].filter(x => x.value).map(({ label, value }) => (
                  <div key={label} style={{
                    padding: '10px 12px', background: 'var(--surface)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontSize: 16, fontWeight: 600, color: 'var(--txt)',
                      fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.02em',
                    }}>
                      {value}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--txt-3)', marginTop: 3 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {job.outcomes.key_findings?.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--txt-2)', lineHeight: 1.55 }}>
                    <span style={{ color: 'var(--txt-4)', flexShrink: 0 }}>→</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function DashboardTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {JOBS.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
