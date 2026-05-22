export const RESEARCH_EFFORT = {
  id: 'RE-2026-Q2',
  name: 'AI Safety Evaluation — Q2 2026',
  sponsor: 'Alignment Research',
  lead: 'Dr. Sarah Kim',
  deadline: new Date('2026-06-30').getTime(),
  started: new Date('2026-05-01').getTime(),
}

export const BATCHES_SEED = [
  {
    id: 'BATCH-A',
    name: 'Constitutional AI Alignment',
    domain: 'AI Safety',
    total: 18,
    complete: 16,
    in_progress: 2,
    pending: 0,
    blocked: 0,
    expert_ids: ['E-007', 'E-031'],
    linked_dq: 'DQ-001',
  },
  {
    id: 'BATCH-B',
    name: 'Adversarial Robustness',
    domain: 'AI Safety',
    total: 24,
    complete: 7,
    in_progress: 6,
    pending: 11,
    blocked: 0,
    expert_ids: ['E-031', 'E-044'],
    linked_dq: null,
  },
  {
    id: 'BATCH-C',
    name: 'Particle Physics Validation',
    domain: 'Particle Physics',
    total: 6,
    complete: 0,
    in_progress: 0,
    pending: 0,
    blocked: 6,
    expert_ids: [],
    linked_dq: 'DQ-002',
  },
  {
    id: 'BATCH-D',
    name: 'Cybersecurity Threat Modeling',
    domain: 'Cybersecurity',
    total: 14,
    complete: 0,
    in_progress: 0,
    pending: 0,
    blocked: 14,
    expert_ids: [],
    linked_dq: 'DQ-005',
  },
]

export const EXPERTS_SEED = [
  { id: 'E-007', name: 'Dr. Mei Chen',  domain: 'AI Safety',          tier: 'Tier 1', linked_dq: 'DQ-001', base_status: 'UNDER REVIEW' },
  { id: 'E-019', name: 'James Okafor',  domain: 'Biomedical Ethics',  tier: 'Tier 2', linked_dq: 'DQ-003', base_status: 'BLOCKED' },
  { id: 'E-022', name: 'Priya Nair',    domain: 'International Law',  tier: 'Tier 2', linked_dq: 'DQ-004', base_status: 'SUSPENDED' },
  { id: 'E-031', name: 'Yuki Tanaka',   domain: 'AI Safety',          tier: 'Tier 2', linked_dq: null,      base_status: 'ACTIVE' },
  { id: 'E-044', name: 'Marcus Webb',   domain: 'ML / Deep Learning', tier: 'Tier 1', linked_dq: null,      base_status: 'ACTIVE' },
]

export function deriveResearchState(items) {
  const byId = Object.fromEntries(items.map(i => [i.id, i]))

  const experts = EXPERTS_SEED.map(e => {
    if (!e.linked_dq) return { ...e, status: e.base_status }
    const dq = byId[e.linked_dq]
    if (!dq || dq.status === 'OPEN') return { ...e, status: e.base_status }

    if (dq.id === 'DQ-001') {
      return { ...e, status: dq.resolution?.includes('cooldown') ? 'ON COOLDOWN' : 'CHECK-IN SCHEDULED' }
    }
    if (dq.id === 'DQ-003') {
      return { ...e, status: dq.resolution?.includes('Manual') ? 'ACCESS GRANTED' : 'IT ESCALATED' }
    }
    if (dq.id === 'DQ-004') {
      return { ...e, status: 'RECON IN PROGRESS' }
    }
    return { ...e, status: e.base_status }
  })

  const batches = BATCHES_SEED.map(b => {
    const baseStatus = b.blocked > 0 ? 'BLOCKED' : 'ON TRACK'
    if (!b.linked_dq) return { ...b, status: baseStatus }

    const dq = byId[b.linked_dq]
    if (!dq || dq.status === 'OPEN') return { ...b, status: baseStatus }

    if (b.id === 'BATCH-C') {
      if (dq.resolution?.includes('Escalate')) {
        return { ...b, status: 'SOURCING', blocked: 0, pending: b.total - b.complete }
      }
      return { ...b, status: 'SLA EXTENDED' }
    }

    if (b.id === 'BATCH-D') {
      if (dq.resolution?.includes('Open sourcing')) {
        return { ...b, status: 'SOURCING', blocked: 0, pending: b.total - b.complete }
      }
      return { ...b, status: 'DEFERRED' }
    }

    return { ...b, status: baseStatus }
  })

  // DQ-001 cooldown: remove Dr. Mei Chen from BATCH-A assignments
  const dq001 = byId['DQ-001']
  if (dq001 && dq001.status !== 'OPEN' && dq001.resolution?.includes('cooldown')) {
    const batchA = batches.find(b => b.id === 'BATCH-A')
    if (batchA) {
      batchA.expert_ids = batchA.expert_ids.filter(id => id !== 'E-007')
    }
  }

  return { experts, batches }
}
