const DOT_COLOR = {
  CRITICAL: 'var(--dot-critical)',
  HIGH:     'var(--dot-high)',
  MEDIUM:   'var(--dot-medium)',
  LOW:      'var(--dot-low)',
}

const STATUS_STYLES = {
  OPEN:      { color: 'var(--accent)',  bg: 'var(--accent-lt)',  border: '#F6C9B0' },
  RESOLVED:  { color: 'var(--green)',   bg: 'var(--green-lt)',   border: 'var(--green-border)' },
  ESCALATED: { color: 'var(--amber)',   bg: 'var(--amber-lt)',   border: 'var(--amber-border)' },
  DEFERRED:  { color: '#7C3AED',        bg: '#F5F3FF',           border: '#DDD6FE' },
}

export function UrgencyDot({ level }) {
  return (
    <span style={{
      display: 'inline-block',
      width: 8, height: 8, borderRadius: '50%',
      background: DOT_COLOR[level] ?? DOT_COLOR.MEDIUM,
      flexShrink: 0,
    }} />
  )
}

export function UrgencyBadge({ level }) {
  return <UrgencyDot level={level} />
}

export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.OPEN
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 7px', borderRadius: 'var(--radius-xs)',
      fontSize: 11, fontWeight: 500,
      background: s.bg, color: s.color,
      border: `1px solid ${s.border}`,
    }}>
      {status}
    </span>
  )
}

export function CategoryBadge({ category }) {
  return (
    <span style={{ fontSize: 12, color: 'var(--txt-3)', fontWeight: 400 }}>
      {category}
    </span>
  )
}

export function RuleBadge({ text }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px', borderRadius: 'var(--radius-xs)',
      fontSize: 11, fontWeight: 500,
      background: 'var(--accent-lt)', color: 'var(--accent)',
      border: '1px solid #F6C9B0',
    }}>
      Rule: {text}
    </span>
  )
}
