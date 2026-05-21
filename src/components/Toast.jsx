import { useEffect, useState } from 'react'

export function Toast({ message, onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10)
    const hide = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 300)
    }, 3500)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [onDone])

  return (
    <div style={{
      position: 'fixed', bottom: 28, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 12}px)`,
      opacity: visible ? 1 : 0,
      transition: 'transform 280ms ease, opacity 280ms ease',
      background: '#1A1A1A',
      color: '#FFFFFF',
      padding: '12px 20px',
      borderRadius: 'var(--radius)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      fontSize: 13, fontWeight: 500,
      maxWidth: 480, textAlign: 'center',
      zIndex: 999,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 18, height: 18, borderRadius: '50%',
        background: 'var(--ok)', flexShrink: 0, fontSize: 10, fontWeight: 700,
      }}>✓</span>
      {message}
    </div>
  )
}
