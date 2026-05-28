import { useState, useCallback } from 'react'
import { INITIAL_ITEMS } from './data/decisions.js'
import { JOBS, STUDY_DESIGNS } from './data/jobs.js'
import { loadItems, saveItems, loadHistory, appendHistory, clearAll } from './lib/storage.js'
import { KpiChip } from './components/KpiChip.jsx'
import { Toast } from './components/Toast.jsx'
import { VisionModal } from './components/VisionModal.jsx'
import { DashboardTab } from './tabs/DashboardTab.jsx'
import { OpsTab } from './tabs/OpsTab.jsx'
import { ResearchDesignTab } from './tabs/ResearchDesignTab.jsx'
import { useWindowSize } from './hooks/useWindowSize.js'

const TABS = [
  { label: 'Dashboard',       shortLabel: 'Dashboard' },
  { label: 'Ops',             shortLabel: 'Ops'       },
  { label: 'Research Design', shortLabel: 'Research'  },
]

export default function App() {
  const width = useWindowSize()
  const isMobile = width < 768

  const [items, setItems] = useState(() => {
    if (localStorage.getItem('ops_version') !== 'v3') {
      clearAll()
      localStorage.setItem('ops_version', 'v3')
      return INITIAL_ITEMS
    }
    return loadItems(INITIAL_ITEMS)
  })
  const [history, setHistory] = useState(() => loadHistory())
  const [activeTab, setActiveTab] = useState(0)
  const [toast, setToast] = useState(null)
  const [showVision, setShowVision] = useState(false)
  const [messageThreads, setMessageThreads] = useState(
    () => Object.fromEntries(STUDY_DESIGNS.map(sd => [sd.id, sd.messages]))
  )

  const openCount    = items.filter(i => i.status === 'OPEN').length
  const slaRiskCount = items.filter(i =>
    i.status === 'OPEN' && (i.sla_deadline - Date.now()) < 20 * 3_600_000
  ).length
  const resolvedCount = items.filter(i => i.status !== 'OPEN').length
  const activeStudies = JOBS.filter(j => j.status === 'ACTIVE').length

  const handleAction = useCallback((itemId, option) => {
    const newStatus = option.label.toLowerCase().includes('defer') ? 'DEFERRED'
      : option.label.toLowerCase().includes('escalat') ? 'ESCALATED'
      : 'RESOLVED'

    const updated = items.map(i =>
      i.id === itemId ? { ...i, status: newStatus, resolution: option.label } : i
    )
    setItems(updated)
    saveItems(updated)

    const newHistory = appendHistory({
      timestamp: Date.now(),
      item_id: itemId,
      action_taken: option.confirms_to,
      actor: 'Ops Manager',
    })
    setHistory(newHistory)
    setToast(option.confirms_to)
  }, [items])

  const handleSendMessage = useCallback((studyId, text) => {
    setMessageThreads(prev => ({
      ...prev,
      [studyId]: [
        ...prev[studyId],
        { id: Date.now(), author: 'Ops Manager', role: 'Ops', at: new Date().toISOString(), text },
      ],
    }))
  }, [])

  const handleReset = useCallback(() => {
    clearAll()
    setItems(INITIAL_ITEMS)
    setHistory([])
    setToast(null)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1160, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', height: 60, gap: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="5" fill="var(--accent)" />
              <text x="12" y="17" textAnchor="middle" fill="white"
                fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600">A</text>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt)', letterSpacing: '-0.01em' }}>
              {isMobile ? 'HD Ops' : 'Human Data Operations'}
            </span>
          </div>

          <div style={{ flex: 1 }} />

          <button
            onClick={() => setShowVision(true)}
            style={{
              background: 'none', border: 'none', fontSize: 13, color: 'var(--txt-3)',
              cursor: 'pointer', padding: '4px 0', fontWeight: 400,
              transition: 'color var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--txt)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--txt-3)'}
          >
            Platform vision →
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1160, margin: '0 auto', padding: isMobile ? '24px 16px' : '32px 24px' }}>
        {/* KPI chips */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: 12, marginBottom: 32,
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
            label="Studies"
            value={activeStudies}
            dotColor={null}
            sub={`${JOBS.filter(j => j.status === 'CLOSED').length} closed`}
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
            const count = i === 1 && openCount > 0 ? openCount : null

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
        {activeTab === 0 && <DashboardTab />}
        {activeTab === 1 && (
          <OpsTab
            items={items}
            history={history}
            onAction={handleAction}
            onReset={handleReset}
          />
        )}
        {activeTab === 2 && (
          <ResearchDesignTab
            messageThreads={messageThreads}
            onSendMessage={handleSendMessage}
          />
        )}
      </main>

      {showVision && <VisionModal onClose={() => setShowVision(false)} />}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
