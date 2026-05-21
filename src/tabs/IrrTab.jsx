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

function kappaLabel(k) {
  if (k === null) return { text: 'No data', color: 'var(--txt-3)' }
  if (k >= KAPPA_THRESHOLDS.EXCELLENT) return { text: 'Excellent', color: 'var(--ok)' }
  if (k >= KAPPA_THRESHOLDS.GOOD) return { text: 'Good', color: 'var(--warn)' }
  return { text: 'Below threshold', color: 'var(--critical)' }
}

function kappaColor(k) {
  if (k === null) return 'var(--border)'
  if (k >= KAPPA_THRESHOLDS.EXCELLENT) return 'var(--ok)'
  if (k >= KAPPA_THRESHOLDS.GOOD) return 'var(--warn)'
  return 'var(--critical)'
}

function TrendIndicator({ trend }) {
  if (trend === null) return <span style={{ color: 'var(--txt-3)', fontSize: 12 }}>—</span>
  if (Math.abs(trend) < 0.005) return <span style={{ color: 'var(--txt-3)', fontSize: 12 }}>─ 0.00</span>
  const up = trend > 0
  return (
    <span style={{ color: up ? 'var(--ok)' : 'var(--critical)', fontSize: 12, fontWeight: 500 }}>
      {up ? '▲' : '▼'} {Math.abs(trend).toFixed(2)}
    </span>
  )
}

function MiniSparkline({ data }) {
  const valid = data.filter(v => v !== null)
  if (valid.length < 2) return <span style={{ color: 'var(--txt-3)', fontSize: 11 }}>—</span>
  const chartData = data.map((v, i) => ({ i, v }))
  const min = Math.min(...valid) - 0.02
  const max = Math.max(...valid) + 0.02
  const color = valid[valid.length - 1] >= KAPPA_THRESHOLDS.EXCELLENT ? 'var(--ok)'
    : valid[valid.length - 1] >= KAPPA_THRESHOLDS.GOOD ? 'var(--warn)' : 'var(--critical)'

  return (
    <div style={{ width: 60, height: 22, display: 'inline-block' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone" dataKey="v"
            stroke={color} strokeWidth={1.5}
            dot={false} isAnimationActive={false}
          />
          <YAxis domain={[min, max]} hide />
          <XAxis dataKey="i" hide />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: '#1A1A1A', border: 'none',
      borderRadius: 6, padding: '8px 12px', fontSize: 12, color: '#fff',
    }}>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{d.short}</div>
      <div>κ = {d.kappa !== null ? d.kappa.toFixed(2) : 'N/A'}</div>
      <div style={{ color: '#9B9B9B' }}>{d.tasks_reviewed} tasks · {d.active_experts} expert{d.active_experts !== 1 ? 's' : ''}</div>
    </div>
  )
}

export function IrrTab() {
  const width = useWindowSize()
  const isMobile = width < 768

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Explainer */}
      <div style={{
        background: 'var(--info-lt)', border: '1px solid #BFDBFE',
        borderRadius: 'var(--radius)', padding: '12px 16px',
        fontSize: 13, color: 'var(--info)', lineHeight: 1.6,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <span style={{ flexShrink: 0, marginTop: 1 }}>ℹ</span>
        <span>
          <strong>Inter-rater reliability (κ)</strong> measures how consistently experts agree when independently annotating the same content. κ ≥ 0.80 = excellent; 0.70–0.80 = good; below 0.70 requires calibration. Anthropic's training data quality depends directly on this metric.
        </span>
      </div>

      {/* KPI chips */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: 12 }}>
        {[
          {
            label: 'Program κ (weighted)', value: PROGRAM_KAPPA.toFixed(2),
            accent: PROGRAM_KAPPA >= 0.80 ? 'var(--ok)' : PROGRAM_KAPPA >= 0.70 ? 'var(--warn)' : 'var(--critical)',
            sub: PROGRAM_KAPPA >= 0.80 ? 'Excellent agreement' : PROGRAM_KAPPA >= 0.70 ? 'Good agreement' : 'Needs calibration',
          },
          { label: 'Active Domains', value: activeDomains, accent: 'var(--txt)', sub: `${DOMAINS.length} total tracked` },
          {
            label: 'Below Threshold', value: flagged.length,
            accent: flagged.length > 0 ? 'var(--critical)' : 'var(--ok)',
            sub: flagged.length > 0 ? 'Require calibration' : 'All within range',
          },
          { label: 'Tasks Reviewed', value: totalTasks.toLocaleString(), accent: 'var(--txt)', sub: '30-day rolling window' },
        ].map(chip => (
          <div key={chip.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '14px 16px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: chip.accent, fontVariantNumeric: 'tabular-nums' }}>
              {chip.value}
            </div>
            <div style={{ fontSize: 12, color: 'var(--txt-2)', marginTop: 4, fontWeight: 500 }}>{chip.label}</div>
            <div style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 2 }}>{chip.sub}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(flagged.length > 0 || noExperts.length > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {flagged.map(d => (
            <div key={d.domain} style={{
              background: d.kappa < KAPPA_THRESHOLDS.GOOD ? 'var(--crit-lt)' : 'var(--warn-lt)',
              border: `1px solid ${d.kappa < KAPPA_THRESHOLDS.GOOD ? '#FECACA' : '#FDE68A'}`,
              borderRadius: 'var(--radius)', padding: '10px 14px',
              fontSize: 13,
              color: d.kappa < KAPPA_THRESHOLDS.GOOD ? 'var(--critical)' : 'var(--warn)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span>⚠</span>
              <span>
                <strong>{d.domain}</strong> — κ = {d.kappa.toFixed(2)} (
                {d.trend !== null && d.trend < 0 ? `↓ ${Math.abs(d.trend).toFixed(2)} trend · ` : ''}
                {d.threshold_breaches_30d} breach{d.threshold_breaches_30d !== 1 ? 'es' : ''} last 30d
                ) — calibration session recommended.
              </span>
            </div>
          ))}
          {noExperts.map(d => (
            <div key={d.domain} style={{
              background: '#F5F3FF', border: '1px solid #DDD6FE',
              borderRadius: 'var(--radius)', padding: '10px 14px',
              fontSize: 13, color: '#7C3AED',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span>○</span>
              <span><strong>{d.domain}</strong> — no active experts. IRR not measurable. Coverage gap active.</span>
            </div>
          ))}
        </div>
      )}

      {/* Bar chart */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)',
        padding: '20px 20px 12px 4px',
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 16, paddingLeft: 16 }}>
          κ Score by Domain — 30-day rolling
        </div>
        <ResponsiveContainer width="100%" height={sorted.length * 38 + 40}>
          <BarChart
            data={sorted.map(d => ({ ...d, kappa: d.kappa ?? 0 }))}
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
              width={isMobile ? 110 : 150}
              tick={{ fontSize: isMobile ? 11 : 12, fill: 'var(--txt-2)' }}
              axisLine={false} tickLine={false}
            />
            <ReferenceLine
              x={KAPPA_THRESHOLDS.GOOD} stroke="var(--warn)"
              strokeDasharray="4 3" strokeWidth={1}
              label={{ value: '0.70', position: 'insideTopRight', fontSize: 10, fill: 'var(--warn)', dy: -6 }}
            />
            <ReferenceLine
              x={KAPPA_THRESHOLDS.EXCELLENT} stroke="var(--ok)"
              strokeDasharray="4 3" strokeWidth={1}
              label={{ value: '0.80', position: 'insideTopRight', fontSize: 10, fill: 'var(--ok)', dy: -6 }}
            />
            <Bar dataKey="kappa" radius={[0, 4, 4, 0]} maxBarSize={22}>
              {sorted.map((d, i) => (
                <Cell key={i} fill={kappaColor(d.kappa)} />
              ))}
            </Bar>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 20, paddingLeft: isMobile ? 120 : 160, fontSize: 11, color: 'var(--txt-3)', marginTop: 4 }}>
          <span><span style={{ color: 'var(--ok)' }}>■</span> Excellent ≥0.80</span>
          <span><span style={{ color: 'var(--warn)' }}>■</span> Good ≥0.70</span>
          <span><span style={{ color: 'var(--critical)' }}>■</span> Below threshold</span>
        </div>
      </div>

      {/* Domain detail table */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 600, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Domain Detail
        </div>
        {sorted.map((d, i) => {
          const { text, color } = kappaLabel(d.kappa)
          return (
            <div
              key={d.domain}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 80px 80px 70px 90px 90px 70px',
                gap: 8, alignItems: 'center',
                padding: '12px 16px',
                borderBottom: i < sorted.length - 1 ? '1px solid var(--border)' : 'none',
                background: d.kappa !== null && d.kappa < KAPPA_THRESHOLDS.GOOD ? 'rgba(220,38,38,0.02)' : 'transparent',
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
                  <div style={{ fontSize: 12, color: 'var(--txt-2)', textAlign: 'center' }}>{d.active_experts}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13, fontWeight: 600, color: kappaColor(d.kappa), textAlign: 'center',
                  }}>
                    {d.kappa !== null ? d.kappa.toFixed(2) : '—'}
                  </div>
                  <div style={{ textAlign: 'center' }}><TrendIndicator trend={d.trend} /></div>
                  <div style={{ textAlign: 'center' }}><MiniSparkline data={d.sparkline} /></div>
                  <div style={{ fontSize: 12, color: 'var(--txt-2)', textAlign: 'center' }}>{d.tasks_reviewed}</div>
                </>
              )}
              <div style={{ display: 'flex', justifyContent: isMobile ? 'flex-end' : 'center', alignItems: 'center' }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px',
                  borderRadius: 4, background: color === 'var(--ok)' ? 'var(--ok-lt)' : color === 'var(--warn)' ? 'var(--warn-lt)' : color === 'var(--critical)' ? 'var(--crit-lt)' : 'var(--bg)',
                  color, border: `1px solid ${color === 'var(--ok)' ? '#BBF7D0' : color === 'var(--warn)' ? '#FDE68A' : color === 'var(--critical)' ? '#FECACA' : 'var(--border)'}`,
                }}>
                  {text}
                </span>
              </div>
            </div>
          )
        })}
        {!isMobile && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 80px 80px 70px 90px 90px 70px',
            gap: 8, padding: '8px 16px',
            borderTop: '1px solid var(--border)',
            background: 'var(--bg)',
          }}>
            {['Domain', 'Experts', 'κ Score', 'Trend', '4-week', 'Tasks', 'Status'].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 600, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: h === 'Domain' ? 'left' : 'center' }}>
                {h}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
