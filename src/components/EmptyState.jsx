export function EmptyState({ onReset }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '80px 32px', textAlign: 'center', gap: 16,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--ok-lt)', border: '1px solid #BBF7D0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24,
      }}>
        ✓
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--txt)', marginBottom: 6 }}>
          Queue clear
        </div>
        <div style={{ fontSize: 14, color: 'var(--txt-2)', maxWidth: 320, lineHeight: 1.6 }}>
          All decisions have been actioned. The operations engine is running smoothly.
        </div>
      </div>
      <button
        onClick={onReset}
        style={{
          marginTop: 8,
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          color: 'var(--txt-2)',
          fontSize: 13, fontWeight: 500,
          cursor: 'pointer',
          transition: 'border-color var(--transition)',
        }}
        onMouseEnter={e => e.target.style.borderColor = 'var(--border-mid)'}
        onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
      >
        Reset demo
      </button>
    </div>
  )
}
