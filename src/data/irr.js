export const DOMAINS = [
  {
    domain: 'Machine Learning',
    short: 'ML / Deep Learning',
    active_experts: 6,
    kappa: 0.88,
    trend: 0.00,
    tasks_reviewed: 218,
    threshold_breaches_30d: 0,
    sparkline: [0.87, 0.86, 0.88, 0.88],
  },
  {
    domain: 'AI Safety',
    short: 'AI Safety',
    active_experts: 4,
    kappa: 0.91,
    trend: +0.03,
    tasks_reviewed: 142,
    threshold_breaches_30d: 0,
    sparkline: [0.85, 0.87, 0.89, 0.91],
  },
  {
    domain: 'Philosophy of Mind',
    short: 'Philosophy of Mind',
    active_experts: 3,
    kappa: 0.83,
    trend: +0.01,
    tasks_reviewed: 67,
    threshold_breaches_30d: 0,
    sparkline: [0.80, 0.81, 0.82, 0.83],
  },
  {
    domain: 'Biomedical Ethics',
    short: 'Biomedical Ethics',
    active_experts: 3,
    kappa: 0.78,
    trend: -0.04,
    tasks_reviewed: 89,
    threshold_breaches_30d: 1,
    sparkline: [0.82, 0.81, 0.80, 0.78],
  },
  {
    domain: 'Clinical Psychology',
    short: 'Clinical Psychology',
    active_experts: 2,
    kappa: 0.76,
    trend: +0.01,
    tasks_reviewed: 51,
    threshold_breaches_30d: 0,
    sparkline: [0.73, 0.74, 0.75, 0.76],
  },
  {
    domain: 'International Law',
    short: 'International Law',
    active_experts: 2,
    kappa: 0.71,
    trend: -0.07,
    tasks_reviewed: 44,
    threshold_breaches_30d: 2,
    sparkline: [0.81, 0.77, 0.74, 0.71],
  },
  {
    domain: 'Particle Physics',
    short: 'Particle Physics',
    active_experts: 1,
    kappa: 0.61,
    trend: -0.12,
    tasks_reviewed: 23,
    threshold_breaches_30d: 4,
    sparkline: [0.77, 0.72, 0.67, 0.61],
  },
  {
    domain: 'Cybersecurity',
    short: 'Cybersecurity',
    active_experts: 0,
    kappa: null,
    trend: null,
    tasks_reviewed: 0,
    threshold_breaches_30d: 0,
    sparkline: [null, null, null, null],
  },
]

export const KAPPA_THRESHOLDS = {
  EXCELLENT: 0.80,
  GOOD: 0.70,
}

export const PROGRAM_KAPPA = (() => {
  const active = DOMAINS.filter(d => d.kappa !== null)
  const weighted = active.reduce((sum, d) => sum + d.kappa * d.tasks_reviewed, 0)
  const total = active.reduce((sum, d) => sum + d.tasks_reviewed, 0)
  return total > 0 ? weighted / total : 0
})()
