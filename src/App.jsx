import { useState, useCallback } from 'react'
import { INITIAL_ITEMS } from './data/decisions.js'
import { loadItems, saveItems, loadHistory, appendHistory, clearAll } from './lib/storage.js'
import { KpiChip } from './components/KpiChip.jsx'
import { Toast } from './components/Toast.jsx'
import { VisionModal } from './components/VisionModal.jsx'
import { QueueTab } from './tabs/QueueTab.jsx'
import { ResolvedTab } from './tabs/ResolvedTab.jsx'
import { RulesTab } from './tabs/RulesTab.jsx'
import { IrrTab } from './tabs/IrrTab.jsx'
import { useWindowSize } from './hooks/useWindowSize.js'

const TABS = [
  { label: 'Open Queue',       shortLabel: 'Queue'    },
  { label: 'Data Quality',     shortLabel: 'Quality'  },
  { label: 'Automation Rules', shortLabel: 'Rules'    },
  { label: 'Resolved',         shortLabel: 'Resolved' },
]

export default function App() {
  const width = useWindowSize()
  const isMobile = width < 768

  const [items, setItems] = useState(() => loadItems(INITIAL_ITEMS))
  const [history, setHistory] = useState(() => loadHistory())
  const [activeTab, setActiveTab] = useState(0)
  const [toast, setToast] = useState(null)
  const [showVision, setShowVision] = useState(false)

  const openCount = items.filter(i => i.status === 'OPEN').length
  const slaRiskCount = items.filter(i =>
    i.status === 'OPEN' && (i.sla_deadline - Date.now()) < 20 * 3_600_000
  ).length
  const resolvedCount = items.filter(i => i.status !== 'OPEN').length

  const handleAction = useCallback((itemId, option) => {
    const newStatus = option.label.toLowerCase().includes('defer') ? 'DEFERRED'
      : option.label.toLowerCase().includes('escalat') ? 'ESCALATED'
      : 'RESOLVED'

    const updated = items.map(i =>
      i.id === itemId ? { ...i, status: newStatus } : i
    )
    setItems(updated)
    saveItems(updated)

    const entry = {
      timestamp: Date.now(),
      item_id: itemId,
      action_taken: option.confirms_to,
      actor: 'Ops Manager',
    }
    const newHistory = appendHistory(entry)
    setHistory(newHistory)
    setToast(option.confirms_to)
  }, [items])

  const handleReset = useCallback(() => {
    clearAll()
    setItems(INITIAL_ITEMS)
    setHistory([])
    setToast(null)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '0 24px',
          display: 'flex', alignItems: 'center',
          height: 60, gap: 20,
        }}>
          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="5" fill="var(--accent)" />
              <text x="12" y="17" textAnchor="middle" fill="white"
                fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600">A</text>
            </svg>
            <span style={{
              fontSize: 14, fontWeight: 600, color: 'var(--txt)',
              letterSpacing: '-0.01em',
            }}>
              {isMobile ? 'HD Ops' : 'Human Data Operations'}
            </span>
          </div>

          <div style={{ flex: 1 }} />

          <button
            onClick={() => setShowVision(true)}
            style={{
              background: 'none', border: 'none',
              fontSize: 13, color: 'var(--txt-3)',
              cursor: 'pointer', padding: '4px 0',
              fontWeight: 400,
              transition: 'color var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--txt)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-3)'}
          >
            Platform vision →
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '24px 16px' : '32px 24px' }}>
        {/* KPI chips */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: 12,
          marginBottom: 32,
        }}>
          <KpiChip
            label="Open Decisions"
            value={openCount}
            dotColor={openCount > 0 ? 'var(--accent)' : 'var(--green)'}
            sub={openCount === 0 ? 'Queue clear' : 'Require action'}
          />
          <KpiChip
            label="SLA at Risk"
            value={slaRiskCount}
            dotColor={slaRiskCount > 0 ? 'var(--red)' : null}
            sub={slaRiskCount > 0 ? 'Breach window < 20h' : 'All within SLA'}
          />
          <KpiChip
            label="Resolved Today"
            value={resolvedCount}
            dotColor={resolvedCount > 0 ? 'var(--green)' : null}
            sub={resolvedCount > 0 ? 'Decisions actioned' : 'Nothing resolved yet'}
          />
          <KpiChip
            label="Active Rules"
            value={5}
            dotColor={null}
            sub="Automation layer"
          />
        </div>

        {/* Tab navigation */}
        <div style={{
          display: 'flex', gap: 0,
          borderBottom: '1px solid var(--border)',
          marginBottom: 24,
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {TABS.map((tab, i) => {
            const label = isMobile ? tab.shortLabel : tab.label
            const isActive = activeTab === i
            const count = i === 0 && openCount > 0 ? openCount
              : i === 3 && resolvedCount > 0 ? resolvedCount
              : null

            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                style={{
                  padding: '10px 16px',
                  fontSize: 13, fontWeight: isActive ? 500 : 400,
                  background: 'none', border: 'none',
                  borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  color: isActive ? 'var(--txt)' : 'var(--txt-3)',
                  cursor: 'pointer', marginBottom: -1,
                  transition: 'color var(--transition)',
                  whiteSpace: 'nowrap', flexShrink: 0,
                  display: 'flex', alignItems: 'center', gap: 7,
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--txt-2)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--txt-3)' }}
              >
                {label}
                {count !== null && (
                  <span style={{
                    background: isActive ? 'var(--accent)' : 'var(--border)',
                    color: isActive ? '#fff' : 'var(--txt-3)',
                    borderRadius: 10, padding: '1px 6px',
                    fontSize: 11, fontWeight: 500,
                    transition: 'background var(--transition), color var(--transition)',
                  }}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {activeTab === 0 && <QueueTab items={items} onAction={handleAction} onReset={handleReset} />}
        {activeTab === 1 && <IrrTab />}
        {activeTab === 2 && <RulesTab />}
        {activeTab === 3 && <ResolvedTab items={items} history={history} />}
      </main>

      {showVision && <VisionModal onClose={() => setShowVision(false)} />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
