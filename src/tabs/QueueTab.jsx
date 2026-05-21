import { useState } from 'react'
import { UrgencyBadge, CategoryBadge, RuleBadge } from '../components/Badge.jsx'
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
        padding: '9px 18px',
        borderRadius: 'var(--radius-sm)',
        fontSize: 13, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background var(--transition), box-shadow var(--transition)',
        opacity: disabled ? 0.5 : 1,
        ...(isPrimary ? {
          background: hover ? 'var(--orange-mid)' : 'var(--orange)',
          color: '#fff',
          border: 'none',
          boxShadow: hover ? '0 2px 8px rgba(207,105,53,0.4)' : 'none',
        } : {
          background: hover ? '#F5F4F2' : 'var(--surface)',
          color: 'var(--txt)',
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

  const borderColor = item.urgency === 'CRITICAL'
    ? '#FECACA'
    : item.urgency === 'HIGH'
    ? '#FDE68A'
    : 'var(--border)'

  const urgencyAccent = item.urgency === 'CRITICAL'
    ? '#DC2626'
    : item.urgency === 'HIGH'
    ? '#D97706'
    : '#2563EB'

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${borderColor}`,
      borderLeft: `3px solid ${urgencyAccent}`,
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
      transition: 'box-shadow var(--transition)',
    }}>
      {/* Header row — always visible */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded(e => !e)}
        onKeyDown={e => e.key === 'Enter' && setExpanded(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 18px', cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{
          transform: `rotate(${expanded ? 90 : 0}deg)`,
          transition: 'transform var(--transition)',
          color: 'var(--txt-3)', fontSize: 12, flexShrink: 0,
        }}>▶</div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <UrgencyBadge level={item.urgency} />
            <CategoryBadge category={item.category} />
            <span style={{
              fontSize: 11, color: 'var(--txt-3)',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {item.id}
            </span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt)', lineHeight: 1.4 }}>
            {item.title}
          </div>
          {item.expert && (
            <div style={{ fontSize: 12, color: 'var(--txt-2)', marginTop: 2 }}>
              {item.expert.name} · {item.expert.id} · {item.expert.domain} · {item.expert.tier}
            </div>
          )}
        </div>

        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <SlaCountdown deadline={item.sla_deadline} urgency={item.urgency} />
        </div>
      </div>

      {/* Expanded detail panel */}
      {expanded && (
        <div style={{
          borderTop: '1px solid var(--border)',
          padding: '20px 20px 20px 42px',
          display: 'flex', flexDirection: 'column', gap: 18,
          background: '#FDFCFB',
        }}>
          {/* Situation */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Situation
            </div>
            <div style={{ fontSize: 13, color: 'var(--txt)', lineHeight: 1.7 }}>
              {item.situation}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              Timeline
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {item.timeline.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, fontSize: 13 }}>
                  <span style={{
                    flexShrink: 0, width: 72,
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

          {/* Rule that fired */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Automation
            </div>
            <RuleBadge text={item.rule} />
          </div>

          {/* Links */}
          {item.links?.length > 0 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {item.links.map((l, i) => (
                <a
                  key={i}
                  href={l.href}
                  onClick={e => e.preventDefault()}
                  style={{
                    fontSize: 12, color: 'var(--orange)',
                    textDecoration: 'none', fontWeight: 500,
                    borderBottom: '1px solid var(--orange-lt)',
                    paddingBottom: 1,
                  }}
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          )}

          {/* Actions */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
              Decision Required
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
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
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '80px 32px', textAlign: 'center', gap: 16,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'var(--ok-lt)', border: '1px solid #BBF7D0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, color: 'var(--ok)',
        }}>
          ✓
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--txt)', marginBottom: 6 }}>
            Queue clear
          </div>
          <div style={{ fontSize: 14, color: 'var(--txt-2)', maxWidth: 360, lineHeight: 1.6 }}>
            All decisions have been actioned. The operations engine is running smoothly.
          </div>
        </div>
        <button
          onClick={onReset}
          style={{
            marginTop: 8, padding: '9px 18px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--txt-2)', fontSize: 13, fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Reset demo
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {open.map(item => (
        <DecisionItem key={item.id} item={item} onAction={(opt) => onAction(item.id, opt)} />
      ))}
    </div>
  )
}
