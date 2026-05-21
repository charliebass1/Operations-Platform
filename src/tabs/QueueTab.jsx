import { useState } from 'react'
import { UrgencyDot, CategoryBadge, RuleBadge } from '../components/Badge.jsx'
import { SlaCountdown } from '../components/SlaCountdown.jsx'

const URGENCY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }

function ActionButton({ option, onAction, disabled }) {
  const isPrimary = option.variant === 'primary'
  const [hover, setHover] = useState(false)

  return (
    <button
      disabled={disabled}
      onClick={() => onAction(option)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '8px 16px',
        borderRadius: 'var(--radius-sm)',
        fontSize: 13, fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--transition)',
        opacity: disabled ? 0.45 : 1,
        ...(isPrimary ? {
          background: hover ? 'var(--accent-mid)' : 'var(--accent)',
          color: '#fff',
          border: 'none',
        } : {
          background: hover ? 'var(--surface-2)' : 'var(--surface)',
          color: 'var(--txt-2)',
          border: '1px solid var(--border)',
        }),
      }}
    >
      {option.label}
    </button>
  )
}

function DecisionItem({ item, onAction }) {
  const [expanded, setExpanded] = useState(false)
  const [hover, setHover] = useState(false)

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}>
      {/* Collapsed row */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(e => !e)}
        onKeyDown={e => e.key === 'Enter' && setExpanded(v => !v)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '15px 18px',
          cursor: 'pointer', userSelect: 'none',
          background: expanded ? 'var(--surface-2)' : hover ? 'var(--surface-2)' : 'var(--surface)',
          transition: 'background var(--transition)',
        }}
      >
        {/* Urgency dot */}
        <UrgencyDot level={item.urgency} />

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14, fontWeight: 500, color: 'var(--txt)',
            lineHeight: 1.35, marginBottom: 3,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {item.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--txt-3)' }}>
            {item.expert && (
              <span>{item.expert.name} · {item.expert.domain}</span>
            )}
            {item.expert && <span style={{ color: 'var(--divider)' }}>·</span>}
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{item.id}</span>
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
          <CategoryBadge category={item.category} />
          <SlaCountdown deadline={item.sla_deadline} urgency={item.urgency} />
          <span style={{
            color: 'var(--txt-4)', fontSize: 16, lineHeight: 1,
            transform: expanded ? 'rotate(90deg)' : 'none',
            transition: 'transform var(--transition)',
            display: 'inline-block',
          }}>›</span>
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div style={{
          borderTop: '1px solid var(--divider)',
          background: 'var(--surface)',
        }}>
          {/* Situation + Timeline in a 2-col layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            <div style={{ padding: '20px 24px', borderRight: '1px solid var(--divider)' }}>
              <div style={{ fontSize: 11, color: 'var(--txt-3)', marginBottom: 8, fontWeight: 500 }}>
                Situation
              </div>
              <div style={{ fontSize: 13, color: 'var(--txt-2)', lineHeight: 1.75 }}>
                {item.situation}
              </div>
            </div>

            <div style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 11, color: 'var(--txt-3)', marginBottom: 8, fontWeight: 500 }}>
                Timeline
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {item.timeline.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, fontSize: 13 }}>
                    <span style={{
                      flexShrink: 0, width: 40,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11, color: 'var(--txt-3)', paddingTop: 1,
                    }}>
                      {t.at}
                    </span>
                    <span style={{ color: 'var(--txt-2)', lineHeight: 1.5 }}>{t.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer: rule + links + actions */}
          <div style={{
            borderTop: '1px solid var(--divider)',
            padding: '16px 24px',
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            background: 'var(--surface-2)',
          }}>
            <RuleBadge text={item.rule} />

            {item.links?.map((l, i) => (
              <a
                key={i}
                href={l.href}
                onClick={e => e.preventDefault()}
                style={{
                  fontSize: 12, color: 'var(--accent)',
                  textDecoration: 'none', fontWeight: 500,
                }}
              >
                {l.label} ↗
              </a>
            ))}

            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {item.options.map((opt, i) => (
                <ActionButton key={i} option={opt} onAction={onAction} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function QueueTab({ items, onAction, onReset }) {
  const open = items
    .filter(i => i.status === 'OPEN')
    .sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency])

  if (open.length === 0) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '80px 32px', textAlign: 'center', gap: 14,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'var(--green-lt)', border: '1px solid var(--green-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, color: 'var(--green)',
        }}>
          ✓
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--txt)', marginBottom: 5 }}>
            Queue clear
          </div>
          <div style={{ fontSize: 13, color: 'var(--txt-3)', maxWidth: 320, lineHeight: 1.65 }}>
            All decisions have been actioned.
          </div>
        </div>
        <button
          onClick={onReset}
          style={{
            marginTop: 4, padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--txt-3)', fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Reset demo
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Column headers — subtle, only on wider view */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '0 18px 6px',
        fontSize: 11, color: 'var(--txt-3)', fontWeight: 500,
      }}>
        <span style={{ width: 8, flexShrink: 0 }} />
        <span style={{ flex: 1 }}>Decision</span>
        <span style={{ width: 120, textAlign: 'right' }}>Category</span>
        <span style={{ width: 64, textAlign: 'right' }}>SLA</span>
        <span style={{ width: 16 }} />
      </div>
      {open.map(item => (
        <DecisionItem key={item.id} item={item} onAction={(opt) => onAction(item.id, opt)} />
      ))}
    </div>
  )
}
