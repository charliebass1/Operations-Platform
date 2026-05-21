const URGENCY_STYLES = {
  CRITICAL: { bg: 'var(--crit-lt)', color: 'var(--critical)', border: '#FECACA' },
  HIGH:     { bg: 'var(--warn-lt)', color: 'var(--warn)',     border: '#FDE68A' },
  MEDIUM:   { bg: 'var(--info-lt)', color: 'var(--info)',     border: '#BFDBFE' },
  LOW:      { bg: 'var(--ok-lt)',   color: 'var(--ok)',       border: '#BBF7D0' },
}

const STATUS_STYLES = {
  OPEN:     { bg: 'var(--orange-lt)', color: 'var(--orange)', border: '#FDBA74' },
  RESOLVED: { bg: 'var(--ok-lt)',     color: 'var(--ok)',     border: '#BBF7D0' },
  ESCALATED:{ bg: 'var(--warn-lt)',   color: 'var(--warn)',   border: '#FDE68A' },
  DEFERRED: { bg: '#F5F3FF',          color: '#7C3AED',       border: '#DDD6FE' },
}

export function UrgencyBadge({ level }) {
  const s = URGENCY_STYLES[level] ?? URGENCY_STYLES.MEDIUM
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 'var(--radius-xs)',
      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
    }}>
      {level === 'CRITICAL' && <span style={{ fontSize: 8 }}>●</span>}
      {level}
    </span>
  )
}

export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.OPEN
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px', borderRadius: 'var(--radius-xs)',
      fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
    }}>
      {status}
    </span>
  )
}

export function CategoryBadge({ category }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px', borderRadius: 'var(--radius-xs)',
      fontSize: 11, fontWeight: 500,
      background: 'var(--bg)', color: 'var(--txt-2)',
      border: '1px solid var(--border)',
    }}>
      {category}
    </span>
  )
}

export function RuleBadge({ text }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 'var(--radius-xs)',
      fontSize: 11, fontWeight: 500,
      background: 'var(--orange-lt)', color: 'var(--orange)',
      border: '1px solid #FDBA74',
    }}>
      <span style={{ fontSize: 9 }}>⚡</span>
      Rule: {text}
    </span>
  )
}
