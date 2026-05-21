import {
  BarChart, Bar, XAxis, YAxis, Cell, Tooltip,
  ReferenceLine, ResponsiveContainer,
  LineChart, Line,
} from 'recharts'
import { DOMAINS, PROGRAM_KAPPA, KAPPA_THRESHOLDS } from '../data/irr.js'
import { useWindowSize } from '../hooks/useWindowSize.js'

const sorted = [...DOMAINS].sort((a, b) => {
  if (a.kappa === null) return 1
  if (b.kappa === null) return -1
  return b.kappa - a.kappa
})

const flagged = DOMAINS.filter(d => d.kappa !== null && d.kappa < KAPPA_THRESHOLDS.GOOD)
const noExperts = DOMAINS.filter(d => d.active_experts === 0)
const totalTasks = DOMAINS.reduce((s, d) => s + d.tasks_reviewed, 0)
const activeDomains = DOMAINS.filter(d => d.active_experts > 0).length

function kappaColor(k) {
  if (k === null) return 'var(--border)'
  if (k >= KAPPA_THRESHOLDS.EXCELLENT) return 'var(--green)'
  if (k >= KAPPA_THRESHOLDS.GOOD)      return 'var(--amber)'
  return 'var(--red)'
}

function kappaLabel(k) {
  if (k === null) return { text: 'No data', color: 'var(--txt-3)' }
  if (k >= KAPPA_THRESHOLDS.EXCELLENT) return { text: 'Excellent', color: 'var(--green)' }
  if (k >= KAPPA_THRESHOLDS.GOOD)      return { text: 'Good',      color: 'var(--amber)' }
  return { text: 'Below threshold', color: 'var(--red)' }
}

function TrendIndicator({ trend }) {
  if (trend === null) return <span style={{ color: 'var(--txt-3)', fontSize: 12 }}>—</span>
  if (Math.abs(trend) < 0.005) return <span style={{ color: 'var(--txt-3)', fontSize: 12 }}>—</span>
  const up = trend > 0
  return (
    <span style={{ color: up ? 'var(--green)' : 'var(--red)', fontSize: 12 }}>
      {up ? '↑' : '↓'} {Math.abs(trend).toFixed(2)}
    </span>
  )
}

function MiniSparkline({ data }) {
  const valid = data.filter(v => v !== null)
  if (valid.length < 2) return <span style={{ color: 'var(--txt-3)', fontSize: 11 }}>—</span>
  const chartData = data.map((v, i) => ({ i, v: v ?? 0 }))
  const min = Math.min(...valid) - 0.02
  const max = Math.max(...valid) + 0.02
  const last = valid[valid.length - 1]
  const color = last >= KAPPA_THRESHOLDS.EXCELLENT ? 'var(--green)'
    : last >= KAPPA_THRESHOLDS.GOOD ? 'var(--amber)' : 'var(--red)'

  return (
    <div style={{ width: 56, height: 20, display: 'inline-block' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
          <YAxis domain={[min, max]} hide />
          <XAxis dataKey="i" hide />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: '#1C1917', borderRadius: 6, padding: '8px 12px',
      fontSize: 12, color: '#fff', border: 'none',
    }}>
      <div style={{ fontWeight: 500, marginBottom: 3 }}>{d.short}</div>
      <div style={{ color: '#A8A29E' }}>
        {d.kappa !== null ? `κ = ${d.kappa.toFixed(2)}` : 'No data'} · {d.tasks_reviewed} tasks
      </div>
    </div>
  )
}

export function IrrTab() {
  const width = useWindowSize()
  const isMobile = width < 768

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Alerts */}
      {(flagged.length > 0 || noExperts.length > 0) && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
        }}>
          {flagged.map((d, i) => (
            <div key={d.domain} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '12px 16px',
              borderBottom: i < flagged.length - 1 || noExperts.length > 0
                ? '1px solid var(--divider)' : 'none',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: d.kappa < KAPPA_THRESHOLDS.GOOD ? 'var(--red)' : 'var(--amber)',
                flexShrink: 0, marginTop: 5,
              }} />
              <div style={{ fontSize: 13, color: 'var(--txt-2)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--txt)', fontWeight: 500 }}>{d.domain}</strong>
                {' '}— κ = {d.kappa.toFixed(2)}
                {d.trend !== null && d.trend < 0 && ` (↓ ${Math.abs(d.trend).toFixed(2)} trend)`}
                {' '}· {d.threshold_breaches_30d} threshold breach{d.threshold_breaches_30d !== 1 ? 'es' : ''} last 30d. Calibration session recommended.
              </div>
            </div>
          ))}
          {noExperts.map((d, i) => (
            <div key={d.domain} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '12px 16px',
              borderBottom: i < noExperts.length - 1 ? '1px solid var(--divider)' : 'none',
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--txt-3)',
                flexShrink: 0, marginTop: 5,
              }} />
              <div style={{ fontSize: 13, color: 'var(--txt-2)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--txt)', fontWeight: 500 }}>{d.domain}</strong>
                {' '}— no active experts. IRR not measurable. Coverage gap active.
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12 }}>
        {[
          {
            label: 'Program κ (weighted)',
            value: PROGRAM_KAPPA.toFixed(2),
            sub: PROGRAM_KAPPA >= 0.80 ? 'Excellent agreement' : PROGRAM_KAPPA >= 0.70 ? 'Good agreement' : 'Needs calibration',
            dot: PROGRAM_KAPPA >= 0.80 ? 'var(--green)' : PROGRAM_KAPPA >= 0.70 ? 'var(--amber)' : 'var(--red)',
          },
          { label: 'Active Domains', value: activeDomains, sub: `${DOMAINS.length} total tracked`, dot: null },
          {
            label: 'Below Threshold',
            value: flagged.length,
            sub: flagged.length > 0 ? 'Require calibration' : 'All within range',
            dot: flagged.length > 0 ? 'var(--red)' : 'var(--green)',
          },
          { label: 'Tasks Reviewed', value: totalTasks.toLocaleString(), sub: '30-day rolling window', dot: null },
        ].map(chip => (
          <div key={chip.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '18px 20px 16px',
          }}>
            <div style={{
              fontSize: 30, fontWeight: 600, color: 'var(--txt)',
              lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
            }}>
              {chip.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--txt-2)', marginTop: 7, fontWeight: 500 }}>
              {chip.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
              {chip.dot && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: chip.dot, display: 'inline-block' }} />
              )}
              <span style={{ fontSize: 11, color: 'var(--txt-3)' }}>{chip.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '20px 16px 16px 4px',
      }}>
        <div style={{
          fontSize: 12, fontWeight: 500, color: 'var(--txt-3)',
          marginBottom: 16, paddingLeft: 16,
        }}>
          Inter-rater reliability by domain — 30-day rolling κ
        </div>
        <ResponsiveContainer width="100%" height={sorted.length * 38 + 40}>
          <BarChart
            data={sorted.map(d => ({ ...d, kappaVal: d.kappa ?? 0 }))}
            layout="vertical"
            margin={{ top: 0, right: 48, left: 8, bottom: 20 }}
          >
            <XAxis
              type="number" domain={[0, 1]}
              tickFormatter={v => v.toFixed(1)}
              tick={{ fontSize: 11, fill: 'var(--txt-3)', fontFamily: "'JetBrains Mono', monospace" }}
              axisLine={{ stroke: 'var(--border)' }}
              tickLine={false}
            />
            <YAxis
              type="category" dataKey="short"
              width={isMobile ? 110 : 148}
              tick={{ fontSize: 12, fill: 'var(--txt-2)' }}
              axisLine={false} tickLine={false}
            />
            <ReferenceLine
              x={KAPPA_THRESHOLDS.GOOD} stroke="var(--amber)"
              strokeDasharray="3 3" strokeWidth={1}
            />
            <ReferenceLine
              x={KAPPA_THRESHOLDS.EXCELLENT} stroke="var(--green)"
              strokeDasharray="3 3" strokeWidth={1}
            />
            <Bar dataKey="kappaVal" radius={[0, 4, 4, 0]} maxBarSize={20}>
              {sorted.map((d, i) => (
                <Cell key={i} fill={kappaColor(d.kappa)} opacity={d.kappa === null ? 0.3 : 0.85} />
              ))}
            </Bar>
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{
          display: 'flex', gap: 18, paddingLeft: isMobile ? 116 : 158,
          fontSize: 11, color: 'var(--txt-3)', marginTop: 2,
        }}>
          <span><span style={{ color: 'var(--green)' }}>■</span> Excellent ≥ 0.80</span>
          <span><span style={{ color: 'var(--amber)' }}>■</span> Good ≥ 0.70</span>
          <span><span style={{ color: 'var(--red)' }}>■</span> Below threshold</span>
        </div>
      </div>

      {/* Domain table */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', overflow: 'hidden',
      }}>
        {/* Column headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 80px' : '1fr 64px 72px 64px 64px 72px 100px',
          gap: 8, padding: '10px 18px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface-2)',
          fontSize: 11, color: 'var(--txt-3)', fontWeight: 500,
        }}>
          <span>Domain</span>
          {!isMobile && <><span style={{ textAlign: 'center' }}>Experts</span><span style={{ textAlign: 'center' }}>κ</span><span style={{ textAlign: 'center' }}>Trend</span><span style={{ textAlign: 'center' }}>4-week</span><span style={{ textAlign: 'center' }}>Tasks</span></>}
          <span style={{ textAlign: 'right' }}>Status</span>
        </div>

        {sorted.map((d, i) => {
          const { text, color } = kappaLabel(d.kappa)
          return (
            <div
              key={d.domain}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 80px' : '1fr 64px 72px 64px 64px 72px 100px',
                gap: 8, alignItems: 'center',
                padding: '13px 18px',
                borderBottom: i < sorted.length - 1 ? '1px solid var(--divider)' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)' }}>{d.domain}</div>
                {isMobile && (
                  <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 2 }}>
                    {d.active_experts} expert{d.active_experts !== 1 ? 's' : ''} · {d.tasks_reviewed} tasks
                  </div>
                )}
              </div>
              {!isMobile && (
                <>
                  <div style={{ fontSize: 12, color: 'var(--txt-3)', textAlign: 'center' }}>{d.active_experts}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13, fontWeight: 500, color: kappaColor(d.kappa),
                    textAlign: 'center',
                  }}>
                    {d.kappa !== null ? d.kappa.toFixed(2) : '—'}
                  </div>
                  <div style={{ textAlign: 'center' }}><TrendIndicator trend={d.trend} /></div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}><MiniSparkline data={d.sparkline} /></div>
                  <div style={{ fontSize: 12, color: 'var(--txt-3)', textAlign: 'center' }}>{d.tasks_reviewed}</div>
                </>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <span style={{
                  fontSize: 11, fontWeight: 500, padding: '2px 8px',
                  borderRadius: 'var(--radius-xs)',
                  color,
                  background: color === 'var(--green)' ? 'var(--green-lt)'
                    : color === 'var(--amber)' ? 'var(--amber-lt)'
                    : color === 'var(--red)' ? 'var(--red-lt)' : 'var(--bg)',
                  border: `1px solid ${color === 'var(--green)' ? 'var(--green-border)'
                    : color === 'var(--amber)' ? 'var(--amber-border)'
                    : color === 'var(--red)' ? 'var(--red-border)' : 'var(--border)'}`,
                }}>
                  {text}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Explainer footnote */}
      <p style={{ fontSize: 12, color: 'var(--txt-3)', lineHeight: 1.65 }}>
        κ (Cohen's kappa) measures pairwise expert agreement independent of chance. κ ≥ 0.80 = excellent; 0.70–0.80 = acceptable; below 0.70 triggers a calibration review. Weights are task-count proportional.
      </p>
    </div>
  )
}
