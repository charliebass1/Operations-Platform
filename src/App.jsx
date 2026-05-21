import { useState, useCallback } from 'react'
import { INITIAL_ITEMS, SPARKLINE_DATA } from './data/decisions.js'
import { loadItems, saveItems, loadHistory, appendHistory, clearAll } from './lib/storage.js'
import { KpiChip } from './components/KpiChip.jsx'
import { Toast } from './components/Toast.jsx'
import { QueueTab } from './tabs/QueueTab.jsx'
import { ResolvedTab } from './tabs/ResolvedTab.jsx'
import { RulesTab } from './tabs/RulesTab.jsx'
import {
  LineChart, Line, ResponsiveContainer, Tooltip,
} from 'recharts'

const TABS = ['Open Queue', 'Resolved', 'Automation Rules']

function Sparkline() {
  return (
    <div style={{ width: 120, height: 36 }}>
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
  const [items, setItems] = useState(() => loadItems(INITIAL_ITEMS))
  const [history, setHistory] = useState(() => loadHistory())
  const [activeTab, setActiveTab] = useState(0)
  const [toast, setToast] = useState(null)

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

    if (activeTab === 0 && updated.filter(i => i.status === 'OPEN').length === 0) {
      setTimeout(() => setActiveTab(0), 400)
    }
  }, [items, activeTab])

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
          padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 56,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Anthropic-style wordmark */}
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: 'var(--orange)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 14,
              flexShrink: 0,
            }}>
              A
            </div>
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--txt)' }}>
                Human Data Operations
              </span>
              <span style={{
                fontSize: 13, color: 'var(--txt-3)', marginLeft: 10,
                display: 'none',
              }}
                className="header-subtitle"
              >
                Decision Queue
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Sparkline />
            <div style={{ fontSize: 11, color: 'var(--txt-3)', textAlign: 'right' }}>
              <div style={{ color: 'var(--ok)', fontWeight: 600 }}>
                {resolvedCount} resolved today
              </div>
              <div>7-day trend</div>
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
        {/* KPI chips */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
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
          display: 'flex', gap: 4,
          borderBottom: '1px solid var(--border)',
          marginBottom: 20,
        }}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                padding: '8px 16px',
                fontSize: 13, fontWeight: 500,
                background: 'none',
                border: 'none',
                borderBottom: activeTab === i
                  ? '2px solid var(--orange)'
                  : '2px solid transparent',
                color: activeTab === i ? 'var(--orange)' : 'var(--txt-2)',
                cursor: 'pointer',
                marginBottom: -1,
                transition: 'color var(--transition)',
              }}
            >
              {tab}
              {i === 0 && openCount > 0 && (
                <span style={{
                  marginLeft: 6,
                  background: openCount > 0 ? (slaRiskCount > 0 ? 'var(--critical)' : 'var(--orange)') : 'var(--ok)',
                  color: '#fff',
                  borderRadius: 10, padding: '1px 6px',
                  fontSize: 11, fontWeight: 600,
                }}>
                  {openCount}
                </span>
              )}
              {i === 1 && resolvedCount > 0 && (
                <span style={{
                  marginLeft: 6,
                  background: 'var(--ok)',
                  color: '#fff',
                  borderRadius: 10, padding: '1px 6px',
                  fontSize: 11, fontWeight: 600,
                }}>
                  {resolvedCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 0 && (
          <QueueTab items={items} onAction={handleAction} onReset={handleReset} />
        )}
        {activeTab === 1 && (
          <ResolvedTab items={items} history={history} />
        )}
        {activeTab === 2 && (
          <RulesTab />
        )}
      </main>

      {/* Toast */}
      {toast && (
        <Toast message={toast} onDone={() => setToast(null)} />
      )}
    </div>
  )
}
