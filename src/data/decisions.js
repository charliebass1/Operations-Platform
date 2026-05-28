const now = Date.now()
const h = (n) => now + n * 3_600_000

export const INITIAL_ITEMS = [
  {
    id: 'DQ-001',
    urgency: 'CRITICAL',
    category: 'Expert Wellbeing',
    title: 'Expert showing repeated distress signals — decision required',
    expert: { id: 'E-007', name: 'Dr. Mei Chen', domain: 'AI Safety', tier: 'Tier 1' },
    situation:
      'E-007 (Dr. Mei Chen) has triggered the distress-flag rule 3 times in 7 days. Flags sourced from session sentiment analysis and post-task survey responses. No prior flags in 14 months of engagement. Current active tasks: 2.',
    rule: '3+ distress flags in 7 days → Decision Queue',
    sla_deadline: h(4),
    status: 'OPEN',
    lifecycle: {
      stages: ['Screening', 'Monitoring', 'Flag Review', 'Decision', 'Resolution'],
      blocked_at: 3,
    },
    links: [
      { label: 'Expert profile', href: '#' },
      { label: 'Session history', href: '#' },
      { label: 'Flag details', href: '#' },
    ],
    timeline: [
      { at: 'Day 1', event: 'Flag 1 — post-task survey: "felt rushed, unclear instructions"' },
      { at: 'Day 4', event: 'Flag 2 — session sentiment: negative affect detected' },
      { at: 'Day 7', event: 'Flag 3 — post-task survey: "emotionally draining content"' },
    ],
    options: [
      {
        label: 'Approve 14-day cooldown',
        variant: 'primary',
        confirms_to: 'Cooldown approved — E-007 removed from active rotation for 14 days.',
      },
      {
        label: 'Schedule wellbeing check-in',
        variant: 'secondary',
        confirms_to: 'Check-in scheduled — E-007 notified. Follow-up in 48h.',
      },
    ],
  },
  {
    id: 'DQ-002',
    urgency: 'HIGH',
    category: 'SLA Risk',
    title: 'Clinical medicine eval requests approaching SLA breach',
    expert: null,
    situation:
      'REQ-041 (clinical diagnostic reasoning annotation, 6 tasks) was submitted 38h ago. SLA window is 54h. Current match count: 0 qualified experts available. Domain has 2 registered experts; both are on active cooldown. Tasks require MD-level expertise with diagnostics experience.',
    rule: 'Request unmatched with <20h to SLA → Decision Queue',
    sla_deadline: h(16),
    status: 'OPEN',
    lifecycle: {
      stages: ['Request', 'Auto-match', 'Expert Gap', 'Assignment', 'Collection'],
      blocked_at: 2,
    },
    links: [
      { label: 'REQ-041 detail', href: '#' },
      { label: 'Domain coverage report', href: '#' },
    ],
    timeline: [
      { at: 'T+0h', event: 'REQ-041 submitted — clinical diagnostic reasoning study (6 tasks)' },
      { at: 'T+2h', event: 'Auto-match attempted — 0 available clinical experts found' },
      { at: 'T+38h', event: 'Escalation rule triggered — entering Decision Queue' },
    ],
    options: [
      {
        label: 'Escalate to sourcing team',
        variant: 'primary',
        confirms_to: 'Escalated — sourcing team notified. Emergency expert search initiated for Clinical Medicine.',
      },
      {
        label: 'Extend SLA by 24h',
        variant: 'secondary',
        confirms_to: 'SLA extended — research team notified of revised timeline. New deadline set.',
      },
    ],
  },
  {
    id: 'DQ-003',
    urgency: 'HIGH',
    category: 'Access Provisioning',
    title: 'Expert access provisioning stuck — 8 days silent',
    expert: { id: 'E-019', name: 'James Okafor', domain: 'Medical Ethics', tier: 'Tier 2' },
    situation:
      'E-019 (James Okafor) completed onboarding 8 days ago. Access provisioning job (JIRA IT-8842) has been in "Pending" state since Day 1 with no updates. Expert has sent 2 follow-up emails. No tasks have been assigned; expert is effectively inactive.',
    rule: 'Access provisioning silent >5 days → Decision Queue',
    sla_deadline: h(8),
    status: 'OPEN',
    lifecycle: {
      stages: ['Onboarding', 'IT Provisioning', 'Access Active', 'First Task'],
      blocked_at: 1,
    },
    links: [
      { label: 'Onboarding record', href: '#' },
      { label: 'IT-8842 (Jira)', href: '#' },
      { label: 'Expert comms thread', href: '#' },
    ],
    timeline: [
      { at: 'Day 0', event: 'Onboarding completed — provisioning job auto-created (IT-8842)' },
      { at: 'Day 3', event: 'Expert sends first follow-up email' },
      { at: 'Day 6', event: 'Expert sends second follow-up email' },
      { at: 'Day 8', event: 'Silence rule fires — entering Decision Queue' },
    ],
    options: [
      {
        label: 'Trigger IT escalation',
        variant: 'primary',
        confirms_to: 'IT-8842 escalated to P1 — IT manager notified. E-019 sent acknowledgment email.',
      },
      {
        label: 'Manual provision (bypass)',
        variant: 'secondary',
        confirms_to: 'Manual provision initiated — E-019 granted interim access. IT ticket flagged for root-cause audit.',
      },
    ],
  },
]
