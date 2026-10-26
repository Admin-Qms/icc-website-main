---
slug: 'supplier-performance'
title: 'Reviewing supplier performance: Supplier quality management software'
description: 'Reviewing supplier performance in supplier quality software: choosing supported measures, reviewing incomplete records and changing supplier status.'
primaryKeyword: 'supplier quality software'
keywords:
  - 'supplier quality software reviewing supplier performance'
  - 'supplier quality software'
  - 'supplier approval'
  - 'supplier corrective actions'
author: 'ISO Certification Consultants Editorial Team'
date: '2026-10-26'
imageBrief: 'a quality technician isolating a rejected component at a marked inspection bench; authentic manufacturing environment, no readable text or logos'
sourceIds:
  - apg-external-providers
  - icc-supplier-quality-module
capabilityIds: []
---
## Building scorecards grounded in receiving yields, SCARs, and concessions

A scorecard is a decision tool, so it should be built from events that someone can trace. The ISO and IAF [external providers guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) offers a useful starting point because its examples are indicators rather than opinions. It asks how often credit notes are raised for goods that were first rejected and then accepted, and how many concessions allowed acceptance of previously rejected products. Both are countable from records you already create, which is exactly what a scorecard needs.

Choose a small set of measures and define each one in writing. A workable set for most manufacturers has four parts.

- **Lot acceptance.** The share of received lots accepted at first inspection, counted by lot and by line.
- **Defect rate.** Parts-per-million defective on received quantity, calculated the same way for every supplier.
- **Delivery.** The share of lines received by the date the order confirmed.
- **Corrective action performance.** Time to respond to a SCAR and whether the action was verified effective.

Concessions and credit notes sit beside these as flags. A supplier with a strong lot acceptance rate can still show a worrying pattern if many of its rejected lots were accepted under concession. Count them separately, because folding them into acceptance hides the signal.

The supplier quality analyst usually compiles the card each month from receiving totals, nonconformance counts, approved concessions, credit memos and SCAR cycle times. The decision is the rating that each supplier receives, using tiers such as A, B, C or Probationary if your policy defines them. The record is a published scorecard archived in the quality system. Watch for the exception where an excellent delivery score masks serious quality defects because the weights favor delivery. When that happens, change the design, not the supplier's rating.

Weighting needs care. Arbitrary percentages, such as 40 for quality and 30 for delivery, feel scientific but rarely reflect actual risk. A supplier of a safety-critical part should not be able to offset a critical defect with punctual shipping. Many teams solve this with gating rules: a critical nonconformance or an unverified SCAR caps the rating regardless of other scores. Document the rule and its reasoning, and review it when you see results that seem wrong.

When you evaluate software, ask for these abilities:

1. **Data from source records.** Measures draw from receiving inspections, nonconformances, concessions and SCARs without a spreadsheet step.
2. **Configurable weights and thresholds.** A quality administrator can change them without vendor programming, and the change is logged.
3. **Drill-down.** Any score can be opened to show the events behind it.
4. **Comparable periods.** The same definitions apply across months so trends mean something.

The [Supplier Quality module page](https://isocertificationconsultants.ca/solutions/supplier-quality/) mentions scorecards and performance reports that track each supplier over time. Treat that as a demonstration item. Ask the vendor to produce a scorecard from your sample data and explain every number on it.

**Illustrative example:** A hypothetical manufacturer reviews a supplier's monthly card after two concessions were approved without the usual technical review and a SCAR response arrived late. The score falls sharply, and the drill-down shows exactly which events caused it. The supplier quality analyst can explain the rating to the supplier line by line.

## Identifying incomplete records, audit nonconformances, and certificate gaps

Performance data covers what suppliers delivered. Compliance data covers whether you still have grounds to trust them. A supplier can ship perfect parts for a year while its certificate lapses, its audit becomes overdue and its self-assessment goes unanswered. If nobody looks, the file decays quietly.

The external providers guidance notes that reviewing an approved list at regular intervals may not be enough to show effective control, and that approval should not rest solely on a recognized registration. A periodic gap review is the practical answer: a scheduled look at each approved supplier for what is missing, expired or overdue.

The gap review typically covers five items.

| Gap type | What to check | Typical response |
| :--- | :--- | :--- |
| Expired or expiring certificates | Expiry dates against today and the next 30 to 90 days | Request renewal, set a deadline |
| Overdue audits | Audit schedule by risk tier | Schedule audit or document justification |
| Unanswered self-assessments | Questionnaires sent without reply | Escalate to supplier contact and buyer |
| Open audit findings | Findings past due date | Link to a SCAR or hold approval |
| Missing documents | Items required for the supplier's tier | Request and track receipt |

The quality compliance auditor works from compliance registers, audit schedules, questionnaires and certificate logs. The decision is whether a deficiency is serious enough to need intervention. The record is a gap report listing missing documents, overdue audits and non-responsive contacts. The sharpest exception is an expired quality certificate for a high-risk component provider, where policy may require an automatic purchasing block. Decide in advance which gaps block orders and which only trigger reminders.

Software helps when it makes gaps visible without a search. Ask to see dashboards that display warnings for upcoming and overdue audit milestones, with filters by supplier, tier and category. Ask how reminders reach people: whether supplier contacts and internal category managers receive escalating messages, how many reminders are sent and what happens when none are answered. Ask what a user sees on the supplier record itself, since that is where a buyer will notice a problem.

> **Key Consideration:** Separate informational flags from blocking rules. If every gap blocks orders, buyers will find ways around the system. If nothing blocks, the flags become wallpaper.

A self-assessment or an audit has limited value if the result sits in a folder. Check that audit findings from supplier audits turn into tracked actions with owners and dates, and that they appear on the supplier's record next to performance data. The module page lists scheduled and recorded supplier audits and self-assessments among its described topics, and a trial with an audit of your own is the way to confirm how findings are carried forward.

**Illustrative example:** A hypothetical compliance officer filters the supplier list and finds four suppliers whose quality certificates expire within 30 days. One of them supplies a tier 1 part. The system sends reminders to all four and the officer calls the critical supplier directly, recording the outcome.

## Governing supplier status transitions from approved to probation or disqualification

Status is the mechanism by which supplier quality data changes behavior. If a supplier performs poorly and nothing changes in purchasing or receiving, the data is a report, not a control. Governing transitions means defining when status changes, who decides and what follows automatically.

Start with the states. The earlier qualification chapter defined in review, approved, conditional and suspended. Performance management usually adds probation, a supervised state for a supplier whose results have slipped, and disqualification, the end of the relationship for a category. Write the entry and exit conditions for each. For example, a supplier might move to probation after three rejected lots in a quarter, or after a SCAR is closed ineffective, and return to approved only after a defined number of clean receipts.

The consequences should be specific. Probation might require full inspection of every lot, a manager's sign-off for new orders and a monthly review. Disqualification should stop new purchase orders in every connected purchasing system. The [external providers guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) asks whether providers are selected only for price or also for their ability to supply consistently to specification. A status system enforces the second half of that question in daily practice.

The chair of the supplier review committee typically makes the decision, with quarterly scorecards, repeat SCAR history, risk reviews and the costs of defects as inputs. The record is a status change authorization that states the reason, the restrictions and the terms for recovery. A frequent exception is purchasing trying to bypass a hold for emergency parts. The process should send that request to the quality director, who signs the exception and records the risk accepted.

Evaluate the software with these tests:

1. **Automatic consequences.** Changing a supplier to probation updates receiving rules to the stricter inspection level without manual configuration.
2. **Purchasing block.** Disqualification prevents new orders, and the block is visible to buyers on the order screen.
3. **Permission control.** Only designated roles can reinstate a suspended or disqualified supplier, and the same person cannot propose and approve.
4. **Notification.** The supplier, buyers and inspectors learn of the change through defined messages.
5. **Recovery path.** The conditions for returning to approved are recorded and tracked.

> **Important:** Tell the supplier what it must do to recover. A probation with no stated exit criteria is difficult to defend to the supplier and to an auditor.

The module page describes supplier onboarding through approval gates and notes that a person signs off on decisions. Confirm in a demonstration that status changes you define behave the same way after onboarding, because many products enforce gates for new suppliers but treat later changes loosely.

**Illustrative example:** A hypothetical manufacturer moves a machine shop to probationary status after three rejected batches in one quarter. Purchasing cannot release new orders without a manager's approval, and receiving applies full inspection on every lot. The shop's recovery terms are set at five consecutive accepted lots.

## Retaining defensible performance evidence for customer and ISO audits

When an auditor or customer asks how you control a supplier, the answer is the record. The external providers guidance says auditors have to verify that risk-based thinking has been applied in determining controls over external providers, and it suggests looking at documented information such as approved lists, evidence of monitoring and activities carried out to ensure requirements are met. The guidance was written for ISO 9001:2015 auditors, so confirm which edition and which customer requirements apply to you before building an evidence package.

Think of defensibility as three questions an auditor can ask about any supplier.

- **What did you decide, and why?** The risk tier, the approval basis and each status change should be traceable to a decision and a decision-maker.
- **How do you know it is still true?** Scorecards, audits, certificate checks and monitoring results should show the supplier was watched.
- **What happened when it was not?** Nonconformances, SCARs, concessions and status changes should show action taken.

The quality assurance director assembles this package from historical scorecards, audit reports, SCAR closure files and status records. The decision is whether the package is complete enough to present. The record is a controlled supplier governance package. If a historical concession lacks proper approval, the exception is to document the correction before the audit and to be open about the gap, not to backfill signatures.

Retention rules matter. Decide how long supplier records must remain available, which may exceed the life of a contract, and who can retrieve them. Customer contracts and regulations can set minimums, and the company's records procedure should state them. The software must keep the history unbroken. Ask whether archived records can be altered or deleted, and if an administrator can purge them, whether that action is logged with a reason.

Test these reports in the demonstration:

1. **Supplier history.** A single report showing a supplier's approvals, audits, scorecards, SCARs and status changes across several years.
2. **Decision trace.** The ability to open any scorecard or status change and see who approved it and what evidence they used.
3. **Exports.** A readable export that a registrar or customer auditor can review without system access.
4. **Evidence of use.** Examples showing that evaluation results changed purchasing decisions, such as increased inspection or reduced orders.

The last point is the one teams neglect. Evaluation that never affects a decision looks like paperwork. Keep records showing that scores, audits and findings changed something: an order moved, an inspection increased or a supplier was challenged.

**Illustrative example:** A hypothetical quality team extracts three years of audit reports, scorecards and SCAR files for a customer surveillance audit. The report shows an approval, two audits, one probation and a recovery. The auditor sampled one SCAR and traced it to the receiving record that triggered it, and the review closed without a finding on supplier control.

The next chapter turns from using the system to bringing existing supplier data into it.
