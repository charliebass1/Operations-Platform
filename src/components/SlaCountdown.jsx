import { useState, useEffect } from 'react'

function fmt(ms) {
  if (ms <= 0) return 'BREACHED'
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  if (h > 23) return `${Math.floor(h / 24)}d ${h % 24}h`
  return `${h}h ${m}m`
}

export function SlaCountdown({ deadline, urgency }) {
  const [remaining, setRemaining] = useState(deadline - Date.now())

  useEffect(() => {
    const t = setInterval(() => setRemaining(deadline - Date.now()), 30_000)
    return () => clearInterval(t)
  }, [deadline])

  const isBreached = remaining <= 0
  const isCritical = remaining < 4 * 3_600_000
  const color = isBreached ? 'var(--critical)' : isCritical ? 'var(--warn)' : 'var(--txt-2)'

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 12, color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 500,
    }}>
      <span style={{ fontSize: 10 }}>⏱</span>
      SLA: {fmt(remaining)}
    </span>
  )
}
