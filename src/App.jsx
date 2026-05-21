import { useState, useCallback } from 'react'
import { INITIAL_ITEMS, SPARKLINE_DATA } from './data/decisions.js'
import { loadItems, saveItems, loadHistory, appendHistory, clearAll } from './lib/storage.js'
import { KpiChip } from './components/KpiChip.jsx'
import { Toast } from './components/Toast.jsx'
import { VisionModal } from './components/VisionModal.jsx'
import { QueueTab } from './tabs/QueueTab.jsx'
import { ResolvedTab } from './tabs/ResolvedTab.jsx'
import { RulesTab } from './tabs/RulesTab.jsx'
import { IrrTab } from './tabs/IrrTab.jsx'
import { useWindowSize } from './hooks/useWindowSize.js'
import {
  LineChart, Line, ResponsiveContainer, Tooltip,
} from 'recharts'

const TABS = [
  { label: 'Open Queue',       shortLabel: 'Queue'    },
  { label: 'Data Quality',     shortLabel: 'Quality'  },
  { label: 'Automation Rules', shortLabel: 'Rules'    },
  { label: 'Resolved',         shortLabel: 'Resolved' },
]

function Sparkline() {
  return (
    <div style={{ width: 100, height: 32 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={SPARKLINE_DATA}>
          <Line
            type="monotone" dataKey="resolved"
            stroke="var(--ok)" strokeWidth={2}
            dot={false} isAnimationActive={false}
          />
          <Tooltip
            contentStyle={{
              background: '#1A1A1A', border: 'none',
              borderRadius: 4, fontSize: 11, color: '#fff',
              padding: '4px 8px',
            }}
            itemStyle={{ color: '#fff' }}
            cursor={{ stroke: 'var(--border-mid)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

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
        boxShadow: 'var(--shadow-sm)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          padding: '0 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 54,
          gap: 12,
        }}>
          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 5,
              background: 'var(--orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 13,
              flexShrink: 0,
            }}>
              A
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt)' }}>
              {isMobile ? 'HD Ops' : 'Human Data Operations'}
            </span>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {!isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkline />
                <div style={{ fontSize: 11, color: 'var(--txt-3)', textAlign: 'right' }}>
                  <div style={{ color: 'var(--ok)', fontWeight: 600 }}>{resolvedCount} resolved today</div>
                  <div>7-day trend</div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowVision(true)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--orange-lt)',
                border: '1px solid #FDBA74',
                color: 'var(--orange)',
                fontSize: 12, fontWeight: 600,
                cursor: 'pointer',
                transition: 'background var(--transition)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#FCECD9'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--orange-lt)'}
            >
              About this prototype
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '20px 16px' : '28px 24px' }}>
        {/* KPI chips */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: 10,
          marginBottom: 24,
        }}>
          <KpiChip
            label="Open Decisions"
            value={openCount}
            accent={openCount > 0 ? 'var(--orange)' : 'var(--ok)'}
            sub={openCount === 0 ? 'Queue clear' : 'Require action'}
          />
          <KpiChip
            label="SLA at Risk"
            value={slaRiskCount}
            accent={slaRiskCount > 0 ? 'var(--critical)' : 'var(--txt-3)'}
            sub="Breach < 20h"
          />
          <KpiChip
            label="Resolved Today"
            value={resolvedCount}
            accent={resolvedCount > 0 ? 'var(--ok)' : 'var(--txt-3)'}
            sub="All channels"
          />
          <KpiChip
            label="Active Rules"
            value={5}
            accent="var(--info)"
            sub="Automation layer"
          />
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: 2,
          borderBottom: '1px solid var(--border)',
          marginBottom: 20,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {TABS.map((tab, i) => {
            const label = isMobile ? tab.shortLabel : tab.label
            const badge = i === 0 && openCount > 0 ? openCount
              : i === 3 && resolvedCount > 0 ? resolvedCount
              : null
            const badgeBg = i === 0
              ? (slaRiskCount > 0 ? 'var(--critical)' : 'var(--orange)')
              : 'var(--ok)'

            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                style={{
                  padding: '8px 14px',
                  fontSize: 13, fontWeight: 500,
                  background: 'none', border: 'none',
                  borderBottom: activeTab === i
                    ? '2px solid var(--orange)'
                    : '2px solid transparent',
                  color: activeTab === i ? 'var(--orange)' : 'var(--txt-2)',
                  cursor: 'pointer', marginBottom: -1,
                  transition: 'color var(--transition)',
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {label}
                {badge !== null && (
                  <span style={{
                    marginLeft: 6,
                    background: badgeBg, color: '#fff',
                    borderRadius: 10, padding: '1px 6px',
                    fontSize: 11, fontWeight: 600,
                  }}>
                    {badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        {activeTab === 0 && (
          <QueueTab items={items} onAction={handleAction} onReset={handleReset} />
        )}
        {activeTab === 1 && <IrrTab />}
        {activeTab === 2 && <RulesTab />}
        {activeTab === 3 && <ResolvedTab items={items} history={history} />}
      </main>

      {/* Modals / overlays */}
      {showVision && <VisionModal onClose={() => setShowVision(false)} />}

      {/* Toast */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  )
}
