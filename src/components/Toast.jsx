import { useEffect, useState } from 'react'

export function Toast({ message, onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10)
    const hide = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 280)
    }, 3500)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 10}px)`,
      opacity: visible ? 1 : 0,
      transition: 'transform 260ms ease, opacity 260ms ease',
      background: '#1C1917',
      color: '#FAFAF9',
      padding: '11px 18px',
      borderRadius: 'var(--radius)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
      fontSize: 13, fontWeight: 400,
      maxWidth: 440, textAlign: 'center',
      zIndex: 999,
      display: 'flex', alignItems: 'center', gap: 10,
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 16, height: 16, borderRadius: '50%',
        background: 'var(--green)', flexShrink: 0, fontSize: 9, color: '#fff', fontWeight: 700,
      }}>✓</span>
      {message}
    </div>
  )
}
