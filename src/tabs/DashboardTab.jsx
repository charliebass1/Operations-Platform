import { useState } from 'react'
import { JOBS } from '../data/jobs.js'

const STATUS_META = {
  'ACTIVE': { color: 'var(--green)', bg: 'var(--green-lt)', border: 'var(--green-border)', label: 'Active' },
  'DESIGN': { color: 'var(--blue)',  bg: 'var(--blue-lt)',  border: 'var(--blue-border)',  label: 'Study Design' },
  'CLOSED': { color: 'var(--txt-3)', bg: 'var(--bg)',       border: 'var(--border)',       label: 'Closed' },
}

const HEALTH_META = {
  'ON TRACK':  { color: 'var(--green)', bg: 'var(--green-lt)', border: 'var(--green-border)', icon: '●' },
  'WATCH':     { color: 'var(--amber)', bg: 'var(--amber-lt)', border: 'var(--amber-border)', icon: '◐' },
  'AT RISK':   { color: 'var(--red)',   bg: 'var(--red-lt)',   border: 'var(--red-border)',   icon: '●' },
  'COMPLETE':  { color: 'var(--txt-3)', bg: 'var(--bg)',       border: 'var(--border)',       icon: '✓' },
}

const METRIC_STATUS_COLOR = {
  'ok':       'var(--green)',
  'warn':     'var(--amber)',
  'critical': 'var(--red)',
}

function SessionSparkline({ scores, threshold, calibrationAt }) {
  if (!scores || scores.length === 0) return null
  const barWidth = 8
  const barGap = 3
  const maxHeight = 36

  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 8 }}>
        Session quality over time
      </div>
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: barGap,
        padding: '8px 0 4px',
        position: 'relative',
      }}>
        {/* Threshold line */}
        <div style={{
          position: 'absolute', left: 0, right: 0,
          bottom: `${4 + threshold * maxHeight}px`,
          height: 1,
          borderTop: '1px dashed var(--txt-4)',
          zIndex: 1,
        }}>
          <span style={{
            position: 'absolute', right: 0, top: -14,
            fontSize: 9, color: 'var(--txt-4)',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            {threshold.toFixed(2)} threshold
          </span>
        </div>

        {scores.map((score, i) => {
          if (score === null) {
            return (
              <div key={i} style={{
                width: barWidth, height: maxHeight,
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              }}>
                <div style={{
                  width: barWidth, height: 3,
                  borderRadius: 1,
                  background: 'var(--border)',
                }} />
              </div>
            )
          }

          const h = Math.max(score * maxHeight, 3)
          const belowThreshold = score < threshold
          const isCalibrationGap = calibrationAt !== undefined && i === calibrationAt

          return (
            <div key={i} style={{ position: 'relative' }}>
              {isCalibrationGap && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  fontSize: 8, color: 'var(--blue)', fontWeight: 600, whiteSpace: 'nowrap',
                }}>
                  ↓ cal
                </div>
              )}
              <div
                title={`Session ${i + 1}: ${score.toFixed(2)}`}
                style={{
                  width: barWidth, height: h,
                  borderRadius: 2,
                  background: belowThreshold ? 'var(--red)' : 'var(--green)',
                  opacity: belowThreshold ? 0.7 : 0.6,
                  transition: 'height 0.3s ease',
                }}
              />
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--txt-4)', marginTop: 2 }}>
        <span>Session 1</span>
        <span>Session {scores.length}</span>
      </div>
    </div>
  )
}

function HealthBadge({ health }) {
  if (!health) return null
  const hm = HEALTH_META[health.status]
  return (
    <span style={{
      fontSize: 11, fontWeight: 500, padding: '3px 8px',
      borderRadius: 'var(--radius-xs)', whiteSpace: 'nowrap',
      color: hm.color, background: hm.bg, border: `1px solid ${hm.border}`,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      <span style={{ fontSize: 8 }}>{hm.icon}</span>
      {health.status === 'COMPLETE' ? 'Complete' :
       health.status === 'ON TRACK' ? 'On Track' :
       health.status === 'WATCH' ? 'Watch' :
       'At Risk'}
    </span>
  )
}

function MetricChip({ metric }) {
  const dotColor = METRIC_STATUS_COLOR[metric.status] || 'var(--txt-4)'

  return (
    <div
      title={metric.detail}
      style={{
        padding: '9px 12px',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)',
        flex: 1, minWidth: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: dotColor, flexShrink: 0,
        }} />
        <span style={{ fontSize: 10, color: 'var(--txt-3)', fontWeight: 500 }}>{metric.name}</span>
      </div>
      <div style={{
        fontSize: 15, fontWeight: 600, color: 'var(--txt)',
        fontFamily: "'JetBrains Mono', monospace", letterSpacing: '-0.02em',
      }}>
        {metric.value}
      </div>
    </div>
  )
}

function HealthPanel({ health }) {
  if (!health) return null

  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 8 }}>
        Study health
      </div>

      {/* Reason callout */}
      <div style={{
        padding: '10px 14px', marginBottom: 14,
        borderRadius: 'var(--radius-sm)',
        fontSize: 12, color: 'var(--txt-2)', lineHeight: 1.6,
        ...(health.status === 'AT RISK' ? {
          background: 'var(--red-lt)', border: '1px solid var(--red-border)',
        } : health.status === 'WATCH' ? {
          background: 'var(--amber-lt)', border: '1px solid var(--amber-border)',
        } : health.status === 'COMPLETE' ? {
          background: 'var(--green-lt)', border: '1px solid var(--green-border)',
        } : {
          background: 'var(--surface)', border: '1px solid var(--border)',
        }),
      }}>
        {health.reason}
      </div>

      {/* Metrics row */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {health.metrics.map(m => (
          <MetricChip key={m.name} metric={m} />
        ))}
      </div>

      {/* Sparkline */}
      <SessionSparkline
        scores={health.session_scores}
        threshold={health.score_threshold}
        calibrationAt={health.calibration_at}
      />
    </div>
  )
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

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <HealthBadge health={job.health} />
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

      {/* Progress bar */}
      {job.status !== 'DESIGN' && (
        <div style={{ height: 3, background: 'var(--border)' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: job.status === 'CLOSED' ? 'var(--txt-4)' : 'var(--green)',
            opacity: 0.7,
          }} />
        </div>
      )}

      {/* Expanded panel */}
      {expanded && (
        <div style={{
          borderTop: '1px solid var(--divider)',
          background: 'var(--surface-2)',
        }}>
          {/* Top row: summary + health side by side */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
          }}>
            {/* Left: summary + signals */}
            <div style={{ padding: '18px 20px', borderRight: '1px solid var(--divider)' }}>
              <div style={{ fontSize: 11, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 6 }}>
                Summary
              </div>
              <div style={{ fontSize: 13, color: 'var(--txt-2)', lineHeight: 1.75, marginBottom: 16 }}>
                {job.summary}
              </div>

              {/* Early signals (active) */}
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

              {/* Design stage (design) */}
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

              {/* Closed outcomes */}
              {job.status === 'CLOSED' && job.outcomes && (
                <div>
                  <div style={{ fontSize: 11, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 8 }}>
                    Key findings
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

            {/* Right: study health */}
            <div style={{ padding: '18px 20px' }}>
              <HealthPanel health={job.health} />
            </div>
          </div>
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
