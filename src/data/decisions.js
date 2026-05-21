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
    title: 'Particle Physics request approaching SLA breach',
    expert: null,
    situation:
      'REQ-041 (advanced particle physics annotation, 6 tasks) was submitted 38h ago. SLA window is 54h. Current match count: 0 qualified experts available. Domain has 2 registered experts; both are on active cooldown.',
    rule: 'Request unmatched with <20h to SLA → Decision Queue',
    sla_deadline: h(16),
    status: 'OPEN',
    links: [
      { label: 'REQ-041 detail', href: '#' },
      { label: 'Domain coverage report', href: '#' },
    ],
    timeline: [
      { at: 'T+0h', event: 'REQ-041 submitted by research team' },
      { at: 'T+2h', event: 'Auto-match attempted — 0 available experts found' },
      { at: 'T+38h', event: 'Escalation rule triggered — entering Decision Queue' },
    ],
    options: [
      {
        label: 'Escalate to sourcing team',
        variant: 'primary',
        confirms_to: 'Escalated — sourcing team notified. Emergency expert search initiated for Particle Physics.',
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
    expert: { id: 'E-019', name: 'James Okafor', domain: 'Biomedical Ethics', tier: 'Tier 2' },
    situation:
      'E-019 (James Okafor) completed onboarding 8 days ago. Access provisioning job (JIRA IT-8842) has been in "Pending" state since Day 1 with no updates. Expert has sent 2 follow-up emails. No tasks have been assigned; expert is effectively inactive.',
    rule: 'Access provisioning silent >5 days → Decision Queue',
    sla_deadline: h(8),
    status: 'OPEN',
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
  {
    id: 'DQ-004',
    urgency: 'MEDIUM',
    category: 'Vendor Reconciliation',
    title: 'Record conflict with vendor: E-022 status mismatch',
    expert: { id: 'E-022', name: 'Priya Nair', domain: 'International Law', tier: 'Tier 2' },
    situation:
      'Weekly vendor sync detected a record conflict for E-022 (Priya Nair). Our system shows status: Offboarded (voluntary, 3 weeks ago). Vendor (Scale AI) shows status: Active, with 4 tasks assigned in the past 7 days. Risk: payment disputes, data integrity, and potential expert re-engagement without consent.',
    rule: 'Vendor status mismatch detected → Decision Queue',
    sla_deadline: h(48),
    status: 'OPEN',
    links: [
      { label: 'E-022 offboarding record', href: '#' },
      { label: 'Vendor sync log', href: '#' },
    ],
    timeline: [
      { at: 'W-3', event: 'E-022 submits voluntary offboarding — marked Offboarded internally' },
      { at: 'W-1', event: 'Vendor weekly sync — mismatch first detectable (not flagged)' },
      { at: 'Today', event: 'Automated reconciliation rule detects conflict — Decision Queue' },
    ],
    options: [
      {
        label: 'Trigger vendor recon sync',
        variant: 'primary',
        confirms_to: 'Vendor notified — recon sync initiated. E-022 record to be corrected and task assignments reviewed.',
      },
      {
        label: 'Flag for manual review',
        variant: 'secondary',
        confirms_to: 'Flagged for ops review — assigned to vendor management team for investigation.',
      },
    ],
  },
  {
    id: 'DQ-005',
    urgency: 'MEDIUM',
    category: 'Domain Coverage',
    title: 'Cybersecurity domain at zero coverage — 3 open requests',
    expert: null,
    situation:
      'The Cybersecurity domain currently has 0 active experts (2 offboarded last month, 1 on leave). There are 3 open requests (REQ-044, REQ-045, REQ-047) totalling 14 tasks that cannot be matched. Projected new requests next 30 days: 5–8 based on historical rate.',
    rule: 'Domain active expert count = 0 with open requests → Decision Queue',
    sla_deadline: h(72),
    status: 'OPEN',
    links: [
      { label: 'Domain coverage dashboard', href: '#' },
      { label: 'Open requests list', href: '#' },
      { label: 'Sourcing pipeline', href: '#' },
    ],
    timeline: [
      { at: 'M-30d', event: 'E-011 (Cybersecurity) voluntary offboarding' },
      { at: 'M-14d', event: 'E-034 (Cybersecurity) voluntary offboarding' },
      { at: 'M-7d', event: 'E-056 (Cybersecurity) granted 30-day leave' },
      { at: 'Today', event: 'Zero-coverage rule fires — Decision Queue' },
    ],
    options: [
      {
        label: 'Open sourcing pipeline',
        variant: 'primary',
        confirms_to: 'Sourcing pipeline opened — recruiting team tasked with 3 Cybersecurity expert targets. REQ-044/045/047 set to "Pending Source".',
      },
      {
        label: 'Defer requests 30 days',
        variant: 'secondary',
        confirms_to: 'Requests deferred — requestors notified of delay. Review checkpoint set in 30 days.',
      },
    ],
  },
]

export const RULES = [
  {
    id: 'RULE-01',
    name: '3+ distress flags → Decision Queue',
    trigger: 'Expert logs ≥3 distress signals within a 7-day rolling window',
    action: 'Creates DQ item (CRITICAL urgency). Pauses new task assignment during review.',
    category: 'Expert Wellbeing',
    fired_30d: 2,
  },
  {
    id: 'RULE-02',
    name: 'Unmatched request <20h to SLA → Decision Queue',
    trigger: 'Request has 0 matched experts and SLA deadline is within 20 hours',
    action: 'Creates DQ item (HIGH urgency). Notifies sourcing team.',
    category: 'SLA Risk',
    fired_30d: 5,
  },
  {
    id: 'RULE-03',
    name: 'Access provisioning silent >5 days → Decision Queue',
    trigger: 'Provisioning job has no status update for 5+ days',
    action: 'Creates DQ item (HIGH urgency). Sends summary of open comms to ops manager.',
    category: 'Access Provisioning',
    fired_30d: 1,
  },
  {
    id: 'RULE-04',
    name: 'Vendor status mismatch → Decision Queue',
    trigger: 'Weekly sync detects conflicting status between internal record and vendor record',
    action: 'Creates DQ item (MEDIUM urgency). Logs full diff for audit.',
    category: 'Vendor Reconciliation',
    fired_30d: 3,
  },
  {
    id: 'RULE-05',
    name: 'Domain at zero coverage with open requests → Decision Queue',
    trigger: 'Active expert count in a domain drops to 0 while ≥1 open request exists',
    action: 'Creates DQ item (MEDIUM urgency). Cc\'s sourcing and research lead.',
    category: 'Domain Coverage',
    fired_30d: 1,
  },
]

export const SPARKLINE_DATA = [
  { day: 'Mon', resolved: 3 },
  { day: 'Tue', resolved: 5 },
  { day: 'Wed', resolved: 2 },
  { day: 'Thu', resolved: 7 },
  { day: 'Fri', resolved: 4 },
  { day: 'Sat', resolved: 1 },
  { day: 'Sun', resolved: 0 },
]
