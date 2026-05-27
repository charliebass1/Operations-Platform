export const DEPTH_COLORS = ['#D6D3D1', '#A8A29E', '#F59E0B', '#C4511A']
export const DEPTH_LABELS = ['Outcome only', 'Outcome + trace', 'Process', 'Deep process']

export const CAPTURE_FORMATS = [
  {
    id: 'static_task',
    name: 'Static Task',
    short: 'Static',
    description: 'Expert completes a defined problem — a label, rating, or final answer.',
    data_type: 'Outcome',
    process_depth: 0,
    scale_ease: 3,
    expert_burden: 1,
    example_prompt: 'Label this response as accurate, partially accurate, or inaccurate. Provide a one-sentence rationale.',
    note: 'The dominant industry format. Essential for volume; captures no process signal.',
  },
  {
    id: 'structured_problem',
    name: 'Structured Problem',
    short: 'Structured',
    description: 'Expert solves a defined problem with required step-by-step reasoning before a final answer.',
    data_type: 'Outcome + reasoning trace',
    process_depth: 1,
    scale_ease: 2,
    expert_burden: 2,
    example_prompt: 'Solve this problem. Walk through every reasoning step before giving your final answer.',
    note: null,
  },
  {
    id: 'process_narration',
    name: 'Process Narration',
    short: 'Narration',
    description: 'Expert narrates their thinking while working through a problem — including dead ends.',
    data_type: 'Process',
    process_depth: 2,
    scale_ease: 2,
    expert_burden: 2,
    example_prompt: 'Work through this problem and narrate your thinking as you go — including uncertainty, second-guessing, and wrong turns.',
    note: null,
  },
  {
    id: 'teaching_demo',
    name: 'Teaching Demo',
    short: 'Teaching',
    description: 'Expert records themselves explaining a concept to a smart non-expert.',
    data_type: 'Process + pedagogy',
    process_depth: 2,
    scale_ease: 1,
    expert_burden: 2,
    example_prompt: 'Record a 5–10 min explanation of [concept] aimed at a PhD in an adjacent field — someone who is sharp but unfamiliar with this domain.',
    note: 'Experts naturally surface hidden assumptions when forced to explain clearly. Yields unusually clean reasoning chains.',
  },
  {
    id: 'retrospective_walkthrough',
    name: 'Retrospective Walkthrough',
    short: 'Retrospective',
    description: 'Expert narrates how they approached a real problem they recently solved — in their own work.',
    data_type: 'Process (naturalistic)',
    process_depth: 3,
    scale_ease: 1,
    expert_burden: 3,
    example_prompt: 'Walk us through a challenging problem you solved in the last 3 months — the full arc, including dead ends, what you got wrong first, and what finally worked.',
    note: 'Captures tacit knowledge that synthetic tasks cannot reproduce. Hard to quality-control — authenticity varies.',
  },
  {
    id: 'live_thinkaloud',
    name: 'Live Think-Aloud',
    short: 'Think-Aloud',
    description: 'Expert works on a live, unseen task from the research queue while narrating reasoning in real time.',
    data_type: 'Process (live)',
    process_depth: 3,
    scale_ease: 0,
    expert_burden: 3,
    example_prompt: "We'll give you a real, unseen task from our current research queue. Work on it as you normally would — narrate your thinking as you go. No preparation.",
    note: 'Highest-fidelity signal available. Most expensive to run and hardest to standardize across experts.',
  },
]

export const CAPTURE_PROGRAMS = [
  {
    id: 'CP-001',
    name: 'AI Safety Reasoning Walkthroughs',
    description: 'How leading AI safety researchers reason through novel alignment problems — including uncertainty and revision.',
    format_id: 'process_narration',
    domain: 'AI Safety',
    org: null,
    target: 30,
    completed: 12,
    in_review: 4,
    status: 'ACTIVE',
    process_depth_score: 0.76,
    expert_ids: ['E-007', 'E-031'],
    linked_dq: null,
    researcher_note: {
      author: 'Dr. Sarah Kim',
      role: 'Alignment Research',
      date: 'May 20',
      text: "Prioritise researchers who've published on mesa-optimisation or inner alignment. We need genuine uncertainty in the narrations, not polished takes.",
    },
  },
  {
    id: 'CP-002',
    name: 'Clinical Expert Judgment Series',
    description: 'Expert teaching demonstrations for clinical diagnostic reasoning — foundational through advanced case reviews.',
    format_id: 'teaching_demo',
    domain: 'Clinical Medicine',
    org: null,
    target: 20,
    completed: 0,
    in_review: 0,
    status: 'BLOCKED',
    process_depth_score: null,
    expert_ids: [],
    linked_dq: 'DQ-002',
    researcher_note: {
      author: 'Dr. Priya Rajan',
      role: 'Clinical AI Research',
      date: 'May 22',
      text: 'Two of our three pending evals are blocked on clinical expert availability. Even 5 high-quality captures would unblock the study.',
    },
  },
  {
    id: 'CP-003',
    name: 'M&A Reasoning — Meridian Capital',
    description: 'Retrospective walkthroughs of real deal analyses from Meridian senior associates. Org-specific; data non-transferable.',
    format_id: 'retrospective_walkthrough',
    domain: 'Legal Reasoning',
    org: 'Meridian Capital',
    target: 15,
    completed: 6,
    in_review: 2,
    status: 'ACTIVE',
    process_depth_score: 0.84,
    expert_ids: ['E-022'],
    linked_dq: null,
    researcher_note: {
      author: 'Marcus Chen',
      role: 'Partnerships Research',
      date: 'May 18',
      text: 'The Meridian partnership gives us naturalistic data no one else has. Protect the relationship — do not rush their associates.',
    },
  },
  {
    id: 'CP-004',
    name: 'Legal Expert Evals — Think-Aloud',
    description: 'Live think-aloud sessions of legal experts reasoning through complex statutory interpretation and case analysis.',
    format_id: 'live_thinkaloud',
    domain: 'Legal Reasoning',
    org: null,
    target: 25,
    completed: 0,
    in_review: 0,
    status: 'BLOCKED',
    process_depth_score: null,
    expert_ids: [],
    linked_dq: 'DQ-005',
    researcher_note: {
      author: 'Marcus Chen',
      role: 'Enterprise Research',
      date: 'May 24',
      text: 'Legal reasoning is our biggest coverage gap for Claude 4 deployment in enterprise. This program is P0 for Q2.',
    },
  },
  {
    id: 'CP-005',
    name: 'Biomedical Ethics Case Reviews',
    description: 'Structured problem-solving on clinical ethics scenarios with mandatory reasoning chains.',
    format_id: 'structured_problem',
    domain: 'Biomedical Ethics',
    org: null,
    target: 20,
    completed: 14,
    in_review: 3,
    status: 'IN REVIEW',
    process_depth_score: 0.71,
    expert_ids: ['E-019'],
    linked_dq: null,
    researcher_note: {
      author: 'Tom Weber',
      role: 'Evaluation Research',
      date: 'May 21',
      text: 'IRR has been drifting — the last batch had two annotators who clearly weren\'t calibrated. Consider a mid-program calibration session.',
    },
  },
]

export const COVERAGE_MATRIX = {
  'AI Safety':          { static_task: 142, structured_problem: 67, process_narration: 12, teaching_demo: 4,  retrospective_walkthrough: 2,  live_thinkaloud: 0 },
  'ML / Deep Learning': { static_task: 218, structured_problem: 82, process_narration: 8,  teaching_demo: 2,  retrospective_walkthrough: 1,  live_thinkaloud: 0 },
  'Philosophy of Mind': { static_task: 67,  structured_problem: 31, process_narration: 5,  teaching_demo: 3,  retrospective_walkthrough: 2,  live_thinkaloud: 1 },
  'Biomedical Ethics':  { static_task: 89,  structured_problem: 14, process_narration: 3,  teaching_demo: 0,  retrospective_walkthrough: 0,  live_thinkaloud: 0 },
  'Legal Reasoning':    { static_task: 44,  structured_problem: 18, process_narration: 6,  teaching_demo: 0,  retrospective_walkthrough: 6,  live_thinkaloud: 0 },
  'Clinical Medicine':  { static_task: 23,  structured_problem: 9,  process_narration: 0,  teaching_demo: 0,  retrospective_walkthrough: 0,  live_thinkaloud: 0 },
  'Medical Ethics':     { static_task: 0,   structured_problem: 0,  process_narration: 0,  teaching_demo: 0,  retrospective_walkthrough: 0,  live_thinkaloud: 0 },
}

export function deriveProgramState(programs, items) {
  const byId = Object.fromEntries(items.map(i => [i.id, i]))
  return programs.map(p => {
    if (!p.linked_dq) return p
    const dq = byId[p.linked_dq]
    if (!dq || dq.status === 'OPEN') return p
    if (p.linked_dq === 'DQ-002') {
      return { ...p, status: dq.resolution?.includes('Escalate') ? 'SOURCING' : 'SLA EXTENDED' }
    }
    if (p.linked_dq === 'DQ-005') {
      return { ...p, status: dq.resolution?.includes('Open sourcing') ? 'SOURCING' : 'DEFERRED' }
    }
    return p
  })
}
