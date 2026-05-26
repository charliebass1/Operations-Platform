import { useState } from 'react'
import { CAPTURE_FORMATS, CAPTURE_PROGRAMS, COVERAGE_MATRIX, DEPTH_COLORS } from '../data/programData.js'
import { useWindowSize } from '../hooks/useWindowSize.js'

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

function ScaleDots({ value, max = 3, colorVar }) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: i < value ? colorVar : 'var(--border)',
        }} />
      ))}
    </div>
  )
}

const DATA_TYPE_META = {
  'Outcome':                    { color: 'var(--txt-3)', bg: 'var(--bg)',        border: 'var(--border)'          },
  'Outcome + reasoning trace':  { color: 'var(--txt-2)', bg: 'var(--surface-2)', border: 'var(--border)'          },
  'Process':                    { color: 'var(--amber)',  bg: 'var(--amber-lt)',  border: 'var(--amber-border)'    },
  'Process + pedagogy':         { color: 'var(--amber)',  bg: 'var(--amber-lt)',  border: 'var(--amber-border)'    },
  'Process (naturalistic)':     { color: 'var(--accent)', bg: 'var(--accent-lt)', border: 'rgba(196,81,26,0.2)'   },
  'Process (live)':             { color: 'var(--accent)', bg: 'var(--accent-lt)', border: 'rgba(196,81,26,0.2)'   },
}

const PROGRAM_STATUS_META = {
  'ACTIVE':      { color: 'var(--green)', bg: 'var(--green-lt)', border: 'var(--green-border)' },
  'BLOCKED':     { color: 'var(--red)',   bg: 'var(--red-lt)',   border: 'var(--red-border)'   },
  'IN REVIEW':   { color: 'var(--amber)', bg: 'var(--amber-lt)', border: 'var(--amber-border)' },
  'SOURCING':    { color: 'var(--blue)',  bg: 'var(--blue-lt)',  border: 'var(--blue-border)'  },
  'SLA EXTENDED':{ color: 'var(--amber)', bg: 'var(--amber-lt)', border: 'var(--amber-border)' },
  'DEFERRED':    { color: 'var(--txt-3)', bg: 'var(--bg)',       border: 'var(--border)'       },
}

function ProtocolCard({ format }) {
  const [expanded, setExpanded] = useState(false)
  const typeMeta = DATA_TYPE_META[format.data_type] || DATA_TYPE_META['Outcome']
  const depthColor = DEPTH_COLORS[format.process_depth]

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      borderLeft: `3px solid ${depthColor}`,
    }}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(e => !e)}
        onKeyDown={e => e.key === 'Enter' && setExpanded(v => !v)}
        style={{ padding: '14px 16px', cursor: 'pointer', userSelect: 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <ProcessDepthPips depth={format.process_depth} />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)', flex: 1 }}>
            {format.name}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 500, padding: '2px 7px',
            borderRadius: 'var(--radius-xs)', whiteSpace: 'nowrap',
            color: typeMeta.color, background: typeMeta.bg, border: `1px solid ${typeMeta.border}`,
          }}>
            {format.data_type}
          </span>
          <span style={{
            color: 'var(--txt-4)', fontSize: 14,
            transform: expanded ? 'rotate(90deg)' : 'none',
            transition: 'transform var(--transition)',
            display: 'inline-block', flexShrink: 0,
          }}>›</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--txt-3)', lineHeight: 1.5 }}>
          {format.description}
        </div>
      </div>

      {expanded && (
        <div style={{
          borderTop: '1px solid var(--divider)',
          padding: '14px 16px',
          background: 'var(--surface-2)',
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          {/* Scale + burden */}
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--txt-3)', minWidth: 36 }}>Scale</span>
              <ScaleDots value={format.scale_ease} colorVar="var(--blue)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--txt-3)', minWidth: 46 }}>Burden</span>
              <ScaleDots value={format.expert_burden} colorVar="var(--amber)" />
            </div>
          </div>

          {/* Example prompt */}
          <div>
            <div style={{ fontSize: 11, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 6 }}>
              Example prompt
            </div>
            <div style={{
              fontSize: 12, color: 'var(--txt-2)', lineHeight: 1.7,
              padding: '10px 14px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              borderLeft: `3px solid ${depthColor}`,
              fontStyle: 'italic',
            }}>
              "{format.example_prompt}"
            </div>
          </div>

          {format.note && (
            <div style={{ fontSize: 12, color: 'var(--txt-3)', lineHeight: 1.55, fontStyle: 'italic' }}>
              {format.note}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ProgramCard({ program, onGoToOps }) {
  const fmt = CAPTURE_FORMATS.find(f => f.id === program.format_id)
  const pct = program.target > 0 ? Math.round((program.completed / program.target) * 100) : 0
  const isBlocked = program.status === 'BLOCKED'
  const sm = PROGRAM_STATUS_META[program.status] || PROGRAM_STATUS_META['ACTIVE']
  const typeMeta = fmt ? (DATA_TYPE_META[fmt.data_type] || DATA_TYPE_META['Outcome']) : DATA_TYPE_META['Outcome']

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${isBlocked ? 'var(--red-border)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      padding: '16px 18px',
      display: 'flex', flexDirection: 'column', gap: 11,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)', marginBottom: 4 }}>
            {program.name}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: 'var(--txt-3)' }}>{program.domain}</span>
            {program.org && (
              <span style={{
                fontSize: 10, fontWeight: 500, padding: '1px 6px', borderRadius: 10,
                color: 'var(--accent)', background: 'var(--accent-lt)',
                border: '1px solid rgba(196,81,26,0.2)',
              }}>
                {program.org}
              </span>
            )}
          </div>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 500, padding: '2px 8px',
          borderRadius: 'var(--radius-xs)', flexShrink: 0,
          color: sm.color, background: sm.bg, border: `1px solid ${sm.border}`,
        }}>
          {program.status}
        </span>
      </div>

      {/* Format */}
      {fmt && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ProcessDepthPips depth={fmt.process_depth} />
          <span style={{ fontSize: 11, color: 'var(--txt-3)' }}>{fmt.name}</span>
          <span style={{
            fontSize: 10, padding: '1px 6px', borderRadius: 'var(--radius-xs)',
            color: typeMeta.color, background: typeMeta.bg, border: `1px solid ${typeMeta.border}`,
          }}>
            {fmt.data_type}
          </span>
        </div>
      )}

      {/* Progress */}
      {!isBlocked && (
        <div>
          <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginBottom: 5 }}>
            <div style={{
              height: '100%', width: `${pct}%`,
              background: 'var(--green)', opacity: 0.7,
              transition: 'width 0.5s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--txt-3)' }}>
            <span>{program.completed} captured{program.in_review > 0 ? ` · ${program.in_review} in review` : ''}</span>
            <span>{program.completed}/{program.target}</span>
          </div>
        </div>
      )}

      {/* Process depth score */}
      {program.process_depth_score != null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--txt-3)' }}>Process depth score</span>
          <span style={{
            fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500,
            color: program.process_depth_score >= 0.80 ? 'var(--green)'
              : program.process_depth_score >= 0.70 ? 'var(--amber)'
              : 'var(--red)',
          }}>
            {program.process_depth_score.toFixed(2)}
          </span>
          <span style={{ fontSize: 11, color: 'var(--txt-3)' }}>
            {program.process_depth_score >= 0.80 ? '— excellent' : program.process_depth_score >= 0.70 ? '— good' : '— below threshold'}
          </span>
        </div>
      )}

      {/* Blocked banner */}
      {isBlocked && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 10px',
          background: 'var(--red-lt)', border: '1px solid var(--red-border)',
          borderRadius: 'var(--radius-sm)',
        }}>
          <span style={{ fontSize: 11, color: 'var(--red)' }}>Waiting on {program.linked_dq}</span>
          <button
            onClick={onGoToOps}
            style={{
              fontSize: 11, color: 'var(--accent)', background: 'none',
              border: 'none', cursor: 'pointer', fontWeight: 500, padding: 0,
            }}
          >
            Resolve in Ops →
          </button>
        </div>
      )}

      {/* Description */}
      <div style={{ fontSize: 12, color: 'var(--txt-3)', lineHeight: 1.55 }}>
        {program.description}
      </div>
    </div>
  )
}

function CoverageHeatmap() {
  const domains = Object.keys(COVERAGE_MATRIX)
  const allCounts = Object.values(COVERAGE_MATRIX).flatMap(r => Object.values(r)).filter(v => v > 0)
  const maxCount = allCounts.length > 0 ? Math.max(...allCounts) : 1

  function cellOpacity(count) {
    if (count === 0) return 0
    return 0.1 + (count / maxCount) * 0.75
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{
              padding: '8px 16px 8px 0', textAlign: 'left',
              fontSize: 11, color: 'var(--txt-3)', fontWeight: 500,
              borderBottom: '1px solid var(--border)', minWidth: 130,
            }}>
              Domain
            </th>
            {CAPTURE_FORMATS.map(f => (
              <th key={f.id} style={{
                padding: '6px 8px', textAlign: 'center',
                fontSize: 11, color: 'var(--txt-3)', fontWeight: 500,
                borderBottom: '1px solid var(--border)',
                minWidth: 68,
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <ProcessDepthPips depth={f.process_depth} size={5} />
                  <span>{f.short}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {domains.map((domain, di) => {
            const row = COVERAGE_MATRIX[domain]
            return (
              <tr key={domain}>
                <td style={{
                  padding: '10px 16px 10px 0',
                  fontSize: 12, color: 'var(--txt-2)', fontWeight: 500,
                  borderBottom: di < domains.length - 1 ? '1px solid var(--divider)' : 'none',
                  whiteSpace: 'nowrap',
                }}>
                  {domain}
                </td>
                {CAPTURE_FORMATS.map(f => {
                  const count = row[f.id] || 0
                  const opacity = cellOpacity(count)
                  const textLight = opacity > 0.5
                  return (
                    <td key={f.id} style={{
                      padding: '8px',
                      textAlign: 'center',
                      borderBottom: di < domains.length - 1 ? '1px solid var(--divider)' : 'none',
                    }}>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: 44, height: 28, borderRadius: 'var(--radius-xs)',
                        background: count > 0 ? `rgba(196,81,26,${opacity})` : 'transparent',
                        border: count === 0 ? '1px dashed var(--divider)' : '1px solid transparent',
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 11,
                        color: count > 0 ? (textLight ? '#fff' : 'var(--txt-2)') : 'var(--txt-4)',
                      }}>
                        {count > 0 ? count : '—'}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function ResearchDesignTab({ programs, items, onGoToOps }) {
  const width = useWindowSize()
  const isMobile = width < 768

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Capture programs */}
      <div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)', marginBottom: 3 }}>
            Capture programs
          </div>
          <div style={{ fontSize: 12, color: 'var(--txt-3)' }}>
            Each program defines a target expertise, a capture format, and a quality target.
            Org-specific programs produce non-transferable data.
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 10,
        }}>
          {programs.map(p => (
            <ProgramCard key={p.id} program={p} onGoToOps={onGoToOps} />
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* Protocol library */}
      <div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)', marginBottom: 3 }}>
            Protocol library
          </div>
          <div style={{ fontSize: 12, color: 'var(--txt-3)' }}>
            Six capture formats ordered by process fidelity. Expand any card to see the exact prompt
            wording and scale/burden tradeoffs.
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {CAPTURE_FORMATS.map(f => (
            <ProtocolCard key={f.id} format={f} />
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--border)' }} />

      {/* Coverage map */}
      <div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)', marginBottom: 3 }}>
            Coverage map
          </div>
          <div style={{ fontSize: 12, color: 'var(--txt-3)' }}>
            Capture counts by domain and format. Cell intensity = relative volume.
            Dashed = not yet collected — the white space.
          </div>
        </div>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '16px 18px',
        }}>
          <CoverageHeatmap />
        </div>
        <p style={{ fontSize: 11, color: 'var(--txt-3)', marginTop: 10, lineHeight: 1.6 }}>
          Process depth score measures reasoning completeness and authenticity of captured narrations —
          distinct from IRR (which measures agreement on outcomes). Scores below 0.70 trigger a protocol review.
        </p>
      </div>

    </div>
  )
}
