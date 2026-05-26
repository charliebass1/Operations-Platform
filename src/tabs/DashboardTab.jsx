import { BarChart, Bar, XAxis, YAxis, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { CAPTURE_FORMATS, COVERAGE_MATRIX, DEPTH_COLORS, DEPTH_LABELS } from '../data/programData.js'
import { RESEARCH_EFFORT } from '../data/research.js'
import { useWindowSize } from '../hooks/useWindowSize.js'

// Pre-compute format totals from the static coverage matrix
const formatTotals = (() => {
  const t = {}
  Object.values(COVERAGE_MATRIX).forEach(row =>
    Object.entries(row).forEach(([f, n]) => { t[f] = (t[f] || 0) + n })
  )
  return t
})()

const chartData = CAPTURE_FORMATS.map(f => ({ ...f, count: formatTotals[f.id] || 0 }))
const totalCaptures = chartData.reduce((s, d) => s + d.count, 0)
const processCaptures = chartData.filter(d => d.process_depth >= 2).reduce((s, d) => s + d.count, 0)
const processPct = totalCaptures > 0 ? Math.round((processCaptures / totalCaptures) * 100) : 0

function ProcessDepthPips({ depth, size = 6 }) {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center', flexShrink: 0 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: size, height: size, borderRadius: '50%',
          background: i < depth ? DEPTH_COLORS[Math.min(depth, 3)] : 'var(--border)',
        }} />
      ))}
    </div>
  )
}

const PROGRAM_STATUS_META = {
  'ACTIVE':      { color: 'var(--green)', bg: 'var(--green-lt)', border: 'var(--green-border)' },
  'BLOCKED':     { color: 'var(--red)',   bg: 'var(--red-lt)',   border: 'var(--red-border)'   },
  'IN REVIEW':   { color: 'var(--amber)', bg: 'var(--amber-lt)', border: 'var(--amber-border)' },
  'SOURCING':    { color: 'var(--blue)',  bg: 'var(--blue-lt)',  border: 'var(--blue-border)'  },
  'SLA EXTENDED':{ color: 'var(--amber)', bg: 'var(--amber-lt)', border: 'var(--amber-border)' },
  'DEFERRED':    { color: 'var(--txt-3)', bg: 'var(--bg)',       border: 'var(--border)'       },
}

const BATCH_ICON = { 'BLOCKED': '⊘', 'SOURCING': '→', 'DEFERRED': '…', 'ON TRACK': '✓', 'SLA EXTENDED': '~' }

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: '#1C1917', borderRadius: 6, padding: '8px 12px',
      fontSize: 12, color: '#fff',
    }}>
      <div style={{ fontWeight: 500, marginBottom: 2 }}>{d.name}</div>
      <div style={{ color: '#A8A29E' }}>
        {d.count.toLocaleString()} captures · {d.data_type}
      </div>
    </div>
  )
}

export function DashboardTab({ batches, experts, programs, onGoToOps }) {
  const width = useWindowSize()
  const isMobile = width < 768
  const daysLeft = Math.ceil((RESEARCH_EFFORT.deadline - Date.now()) / 86_400_000)
  const blockedBatches = batches.filter(b => b.status === 'BLOCKED')

  const expertCounts = {
    active:  experts.filter(e => e.status === 'ACTIVE').length,
    atRisk:  experts.filter(e => ['UNDER REVIEW', 'CHECK-IN SCHEDULED', 'IT ESCALATED', 'RECON IN PROGRESS'].includes(e.status)).length,
    blocked: experts.filter(e => ['BLOCKED', 'SUSPENDED', 'ON COOLDOWN'].includes(e.status)).length,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Signal portfolio */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '20px 20px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)', marginBottom: 3 }}>
              Signal portfolio
            </div>
            <div style={{ fontSize: 12, color: 'var(--txt-3)' }}>
              All captures by format type — ordered by process fidelity
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <div style={{
              padding: '5px 10px', borderRadius: 'var(--radius-sm)',
              background: 'var(--bg)', border: '1px solid var(--border)',
              fontSize: 11, color: 'var(--txt-3)',
            }}>
              <span style={{ color: 'var(--txt)', fontWeight: 600 }}>{100 - processPct}%</span> outcome
            </div>
            <div style={{
              padding: '5px 10px', borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-lt)', border: '1px solid rgba(196,81,26,0.2)',
              fontSize: 11, color: 'var(--accent)',
            }}>
              <span style={{ fontWeight: 600 }}>{processPct}%</span> process
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="short"
              tick={{ fontSize: 11, fill: 'var(--txt-3)' }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'var(--txt-3)', fontFamily: "'JetBrains Mono', monospace" }}
              axisLine={false} tickLine={false} width={32}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={52}>
              {chartData.map((d, i) => (
                <Cell key={i} fill={DEPTH_COLORS[d.process_depth]} />
              ))}
            </Bar>
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.025)' }} />
          </BarChart>
        </ResponsiveContainer>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 11, color: 'var(--txt-3)', marginTop: 8 }}>
          {DEPTH_LABELS.map((label, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: DEPTH_COLORS[i], display: 'inline-block' }} />
              {label}
            </span>
          ))}
        </div>

        {processPct < 15 && (
          <div style={{
            marginTop: 14, padding: '9px 12px',
            background: 'var(--accent-lt)', border: '1px solid rgba(196,81,26,0.15)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 12, color: 'var(--txt-2)', lineHeight: 1.55,
          }}>
            <strong style={{ color: 'var(--accent)', fontWeight: 500 }}>Process data frontier largely untapped.</strong>{' '}
            {100 - processPct}% of {totalCaptures.toLocaleString()} captures are outcome-only.
            Retrospective walkthroughs and process narration are the formats where no existing vendor has meaningful coverage.
          </div>
        )}
      </div>

      {/* Two-column: programs + status */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 20 }}>

        {/* Capture programs — compact */}
        <div>
          <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 12 }}>
            Capture programs
          </div>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', overflow: 'hidden',
          }}>
            {programs.map((p, i) => {
              const fmt = CAPTURE_FORMATS.find(f => f.id === p.format_id)
              const pct = p.target > 0 ? Math.round((p.completed / p.target) * 100) : 0
              const isBlocked = p.status === 'BLOCKED'
              const sm = PROGRAM_STATUS_META[p.status] || PROGRAM_STATUS_META['ACTIVE']
              return (
                <div key={p.id} style={{
                  padding: '12px 16px',
                  borderBottom: i < programs.length - 1 ? '1px solid var(--divider)' : 'none',
                  opacity: isBlocked ? 0.75 : 1,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <ProcessDepthPips depth={fmt?.process_depth ?? 0} />
                    <span style={{
                      fontSize: 12, fontWeight: 500, color: 'var(--txt)', flex: 1,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {p.name}
                    </span>
                    <span
                      onClick={isBlocked ? onGoToOps : undefined}
                      style={{
                        fontSize: 10, fontWeight: 500, padding: '2px 6px',
                        borderRadius: 'var(--radius-xs)', whiteSpace: 'nowrap',
                        color: sm.color, background: sm.bg, border: `1px solid ${sm.border}`,
                        cursor: isBlocked ? 'pointer' : 'default',
                      }}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div style={{ height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginBottom: 5 }}>
                    <div style={{
                      height: '100%', width: `${pct}%`,
                      background: isBlocked ? 'var(--red)' : 'var(--green)', opacity: 0.6,
                    }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--txt-3)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                      {p.domain}
                      {p.org && <span style={{ color: 'var(--accent)', fontWeight: 500 }}> · {p.org}</span>}
                    </span>
                    <span>{p.completed}/{p.target}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right column: research effort + expert network */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Research effort */}
          <div>
            <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 12 }}>
              Research effort
            </div>
            <div style={{
              background: 'var(--surface)', border: `1px solid ${blockedBatches.length > 0 ? 'var(--red-border)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)', padding: '14px 16px',
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)', marginBottom: 10 }}>
                {RESEARCH_EFFORT.name}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                {batches.map(b => (
                  <span key={b.id} style={{
                    fontSize: 11, padding: '3px 8px', borderRadius: 'var(--radius-xs)', fontWeight: 500,
                    ...(b.status === 'BLOCKED'
                      ? { color: 'var(--red)', background: 'var(--red-lt)', border: '1px solid var(--red-border)' }
                      : b.status === 'SOURCING'
                        ? { color: 'var(--blue)', background: 'var(--blue-lt)', border: '1px solid var(--blue-border)' }
                      : b.status === 'DEFERRED'
                        ? { color: 'var(--txt-3)', background: 'var(--bg)', border: '1px solid var(--border)' }
                      : { color: 'var(--green)', background: 'var(--green-lt)', border: '1px solid var(--green-border)' }),
                  }}>
                    {b.id.replace('BATCH-', '')} {BATCH_ICON[b.status] ?? ''}
                  </span>
                ))}
              </div>
              {blockedBatches.length > 0 && (
                <button
                  onClick={onGoToOps}
                  style={{
                    fontSize: 11, color: 'var(--accent)', background: 'none',
                    border: 'none', cursor: 'pointer', fontWeight: 500, padding: 0,
                  }}
                >
                  {blockedBatches.length} batch{blockedBatches.length !== 1 ? 'es' : ''} blocked — resolve in Ops →
                </button>
              )}
              {blockedBatches.length === 0 && (
                <div style={{ fontSize: 11, color: 'var(--txt-3)' }}>{daysLeft}d to deadline · {RESEARCH_EFFORT.lead}</div>
              )}
            </div>
          </div>

          {/* Expert network */}
          <div>
            <div style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 12 }}>
              Expert network
            </div>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '16px',
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8,
            }}>
              {[
                { label: 'Active',  count: expertCounts.active,  color: 'var(--green)' },
                { label: 'At risk', count: expertCounts.atRisk,  color: 'var(--amber)' },
                { label: 'Blocked', count: expertCounts.blocked, color: expertCounts.blocked > 0 ? 'var(--red)' : 'var(--txt-3)' },
              ].map(({ label, count, color }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 600, color, lineHeight: 1, letterSpacing: '-0.02em' }}>
                    {count}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
