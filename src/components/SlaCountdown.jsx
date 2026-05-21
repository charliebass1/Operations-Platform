import { useState, useEffect } from 'react'

function fmt(ms) {
  if (ms <= 0) return 'Breached'
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  if (h > 23) return `${Math.floor(h / 24)}d ${h % 24}h`
  return `${h}h ${m}m`
}

export function SlaCountdown({ deadline }) {
  const [remaining, setRemaining] = useState(deadline - Date.now())

  useEffect(() => {
    const t = setInterval(() => setRemaining(deadline - Date.now()), 30_000)
    return () => clearInterval(t)
  }, [deadline])

  const isBreached = remaining <= 0
  const isCritical = remaining < 4 * 3_600_000
  const color = isBreached ? 'var(--red)'
    : isCritical ? 'var(--amber)'
    : 'var(--txt-3)'

  return (
    <span style={{
      fontSize: 12,
      color,
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: isBreached || isCritical ? 500 : 400,
      letterSpacing: '-0.01em',
    }}>
      {fmt(remaining)}
    </span>
  )
}
