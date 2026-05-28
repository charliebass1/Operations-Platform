import { useState, useRef, useEffect } from 'react'
import { STUDY_DESIGNS, JOBS } from '../data/jobs.js'

const jobMap = Object.fromEntries(JOBS.map(j => [j.id, j]))

const JOB_STATUS_META = {
  'ACTIVE': { color: 'var(--green)', bg: 'var(--green-lt)', border: 'var(--green-border)', label: 'Active' },
  'DESIGN': { color: 'var(--blue)',  bg: 'var(--blue-lt)',  border: 'var(--blue-border)',  label: 'Study Design' },
  'CLOSED': { color: 'var(--txt-3)', bg: 'var(--bg)',       border: 'var(--border)',       label: 'Closed' },
}

const ROLE_AVATAR = {
  'Research Lead': { bg: 'var(--accent)', color: '#fff' },
  'Ops':           { bg: 'var(--blue)',   color: '#fff' },
}

function formatAt(iso) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
    ' · ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function MessageBubble({ msg }) {
  const av = ROLE_AVATAR[msg.role] || { bg: 'var(--border)', color: 'var(--txt-2)' }
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        background: av.bg, color: av.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700,
      }}>
        {msg.author[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 7, alignItems: 'baseline', marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--txt)' }}>{msg.author}</span>
          <span style={{ fontSize: 11, color: 'var(--txt-4)' }}>{msg.role}</span>
          <span style={{ fontSize: 11, color: 'var(--txt-4)', marginLeft: 'auto' }}>{formatAt(msg.at)}</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--txt-2)', lineHeight: 1.65 }}>
          {msg.text}
        </div>
      </div>
    </div>
  )
}

function MessageThread({ studyId, messages, onSend }) {
  const [text, setText] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  function handleSend() {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
  }

  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 14 }}>
        Thread · {messages.length} {messages.length === 1 ? 'message' : 'messages'}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
        {messages.map((msg, i) => (
          <MessageBubble key={msg.id ?? i} msg={msg} />
        ))}
        <div ref={endRef} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
          placeholder="Add a note to this study..."
          style={{
            flex: 1, padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            fontSize: 13, color: 'var(--txt)',
            outline: 'none', fontFamily: 'inherit',
          }}
          onFocus={e => { e.target.style.borderColor = 'var(--accent)' }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)' }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          style={{
            padding: '8px 16px',
            borderRadius: 'var(--radius-sm)',
            background: text.trim() ? 'var(--accent)' : 'var(--surface)',
            color: text.trim() ? '#fff' : 'var(--txt-3)',
            border: text.trim() ? 'none' : '1px solid var(--border)',
            fontSize: 13, fontWeight: 500,
            cursor: text.trim() ? 'pointer' : 'not-allowed',
            transition: 'background var(--transition), color var(--transition)',
            fontFamily: 'inherit',
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

function DesignField({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 5 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: 'var(--txt-2)', lineHeight: 1.7 }}>
        {children}
      </div>
    </div>
  )
}

function StudyCard({ design, job, messages, onSendMessage }) {
  const sm = JOB_STATUS_META[job?.status] || JOB_STATUS_META['DESIGN']

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--divider)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--txt)', flex: 1 }}>
            {job?.title}
          </div>
          <span style={{
            fontSize: 11, fontWeight: 500, padding: '2px 8px',
            borderRadius: 'var(--radius-xs)', flexShrink: 0,
            color: sm.color, background: sm.bg, border: `1px solid ${sm.border}`,
          }}>
            {sm.label}
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--txt-3)' }}>
          {job?.domain} · {job?.lead}
        </div>
      </div>

      {/* Study design fields */}
      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--divider)', display: 'flex', flexDirection: 'column', gap: 16 }}>

        <DesignField label="Core research problem">
          {design.research_problem}
        </DesignField>

        <DesignField label="Target expert profile">
          {design.target_profile}
        </DesignField>

        {/* Meta chips: n, format, timeline */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { label: 'Participants', value: design.n_participants },
            { label: 'Data format', value: design.data_format },
            { label: 'Timeline', value: design.timeline.note },
          ].map(({ label, value }) => (
            <div key={label} style={{
              padding: '8px 12px',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', flex: 1, minWidth: 120,
            }}>
              <div style={{ fontSize: 10, color: 'var(--txt-3)', fontWeight: 500, marginBottom: 3 }}>
                {label}
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--txt)' }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message thread */}
      <div style={{ padding: '18px 20px', background: 'var(--surface-2)' }}>
        <MessageThread
          studyId={design.id}
          messages={messages}
          onSend={onSendMessage}
        />
      </div>
    </div>
  )
}

export function ResearchDesignTab({ messageThreads, onSendMessage }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {STUDY_DESIGNS.map(design => (
        <StudyCard
          key={design.id}
          design={design}
          job={jobMap[design.job_id]}
          messages={messageThreads[design.id] ?? design.messages}
          onSendMessage={text => onSendMessage(design.id, text)}
        />
      ))}
    </div>
  )
}
