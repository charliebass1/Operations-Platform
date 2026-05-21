# Cover Letter — Program Operations Manager, Human Data

**Charlie Bass** · basscharlie7@gmail.com

---

I built the prototype before writing this letter.

The repository you're reading from contains a Decision Queue — a single-page ops tool designed around the specific operational architecture I'd use at Anthropic. It isn't a demonstration of React proficiency. It's a working sketch of how I think about the job. Every item in the queue maps to a real failure mode in expert network operations: an expert showing distress signals, a domain going dark before a request deadline, a vendor record drifting out of sync. Each decision has two paths and an audit trail. That's the whole interface — because that's the whole job.

---

## Why this role is exactly what I do

At Palate Insights I built and ran an expert network from scratch. When I joined, the panel had 50 contributors. When I left, it had 2,300. That growth wasn't a hiring sprint — it was an operational architecture problem: how do you source, vet, onboard, match, retain, and off-board at volume without losing quality or harming the people in the network?

The answer I found — and the answer I'd bring to Anthropic — is that expert operations require the same systems-thinking discipline as supply chain management. You need leading indicators, not lagging ones. You need rules that fire before problems become incidents. You need a single interface where an ops manager can see everything that requires a decision, action it, and move on.

The Decision Queue in this prototype is that interface. It pulls five canonical failure scenarios from Anthropic's operational context and frames each one as: here's what happened, here's the rule that caught it, here's the deadline, here are your two options. The ops manager doesn't need to dig through Jira or Slack. The system surfaces what needs a human.

---

## What I'd build next

The Decision Queue is one tab of eight I'd design for the full Human Data Operations platform:

**IRR & Quality Module** — Inter-rater reliability tracking per domain and task type, with flagging when scores drop below threshold. This is the Scale AI data quality problem: you can have 500 experts and still ship bad labels if you're not measuring agreement at the annotation level. IRR gives you that signal early.

**Expert Cohort Analysis** — Cohort-based retention curves (Week 1, Week 4, Week 12 drop-off rates) broken out by domain, tier, onboarding path, and task type. The goal: prove that process improvements are actually improving expert experience, not just hope they are.

**Psychological Safety Protocol Dashboard** — A structured welfare monitoring layer with session sentiment scoring, voluntary check-in tooling, and escalation paths for distress signals. Not a checkbox — a genuine protocol. Anthropic's work involves difficult content, and the experts processing that content need real support infrastructure.

**Domain Coverage & Proactive Sourcing** — Real-time coverage map showing active-expert-to-open-request ratios by domain, with automated sourcing triggers when ratios fall below threshold. EOQ theory applied to expert networks: you don't wait until the shelf is empty.

**Vendor Reconciliation** — Automated weekly diff between internal records and vendor (Scale AI) records, with conflict resolution workflows. The transition risk here is real: record drift creates payment disputes, data integrity issues, and re-engagement without consent.

**Onboarding Funnel Tracker** — Step-completion rates by cohort, with bottleneck detection and automated nudges. Onboarding is where most expert networks lose 40% of their pipeline before the first task.

**Task Assignment Intelligence** — Match quality scoring (not just availability — fit, domain depth, workload balance) with feedback loops that improve future matches. The difference between good expert networks and great ones is match quality over time.

---

## The operational philosophy underneath all of this

Every tab in that list is a different surface, but the same idea: the ops manager's job is to convert ambiguous situations into clear decisions, and to do that before the situation becomes a crisis.

The Decision Queue isn't the only thing I'd build. It's the first thing, because it's the load-bearing structure everything else sits on. If the ops manager can see every decision that needs to be made, and make them fast, everything downstream gets better — expert experience, data quality, SLA compliance, vendor relationships, program reputation.

I've done this job before. The domains differ. The architecture is identical.

I'd love to talk about what the first 90 days would look like.

— Charlie Bass
