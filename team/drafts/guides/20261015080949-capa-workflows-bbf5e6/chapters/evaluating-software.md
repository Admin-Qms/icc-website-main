---
slug: evaluating-software
title: 'Evaluating software capabilities: CAPA software workflows'
description: >-
  Evaluating software capabilities in CAPA software: build a workflow-based
  shortlist; test the decision points; examine evidence and permissions.
primaryKeyword: CAPA software
keywords:
  - CAPA software evaluating software capabilities
  - CAPA software
  - corrective action workflow
  - effectiveness review
author: ISO Certification Consultants Editorial Team
date: '2026-10-19'
imageBrief: >-
  a machining supervisor comparing inspection records beside a CNC machine;
  authentic manufacturing environment, no readable text or logos
sourceIds:
  - apg-documenting
  - nist-rpd-g08
capabilityIds: []
---
## Build a workflow-based shortlist

A shortlist built from vendor websites compares marketing pages. A shortlist built from your workflow compares how each product handles the path your findings actually take. The mapping work from the previous chapter supplies the raw material: a problem statement, a handoff map, owned decisions and acceptance criteria. Turn those into a requirements sheet before contacting any vendor.

Split the requirements into three groups. **Must-have** items are the criteria without which the workflow fails, such as recording the requirement that was not met alongside the evidence, or keeping the person who implements an action separate from the person who confirms it. **Should-have** items improve the workflow but have a workable manual substitute. **Nice-to-have** items are conveniences that would not change the decision. Vendors tend to emphasize the third group, so the sheet keeps the conversation anchored on the first.

The structure of a good record is a sensible place to ground the must-have list. The ISO and IAF guidance on [documenting a nonconformity](https://committee.iso.org/files/live/sites/tc176sc2/files/documents/ISO%209001%20Auditing%20Practices%20Group%20docs/Auditing%20General/APG-DocumentNonconformity2015.pdf) describes an example report form that separates the details of the finding, the root cause analysis, the correction with completion dates, the corrective action with completion dates, review of the plan, verification of implementation, verification of effectiveness and close-out. That form is auditor guidance written for ISO 9001:2015, not a product specification, but it is a handy checklist. If a candidate product cannot represent those separate stages as distinct, dated records, the gap deserves a direct question.

Filter candidates in two passes. The first pass is a paper screen against must-have items, using public documentation, and it should reduce a long list to a handful. The second pass is a scripted demonstration, covered in the next section. When screening, treat every capability statement as a claim to confirm. ICC publishes a description of its [nonconformance and CAPA module](/solutions/nonconformance-capa/), and as with any vendor, availability and configuration should be confirmed in a demonstration before a team relies on a feature.

> **Key Consideration:** Include at least one option that is not a dedicated CAPA product, such as an extension of the system you already use. A fair comparison needs a baseline, and sometimes the existing tool covers the first release.

Keep the shortlist small enough that every candidate receives a real demonstration. Three to five is usually manageable. Record why each rejected product was rejected, citing the requirement it missed. That note saves time when a stakeholder later asks why a familiar brand was not considered.

**Illustrative example:** The unnamed Canadian machining manufacturer from the previous chapter lists four must-have items: a finding record with evidence and a stated requirement, containment recorded before investigation, separation of implementer and closer, and a one-step history report for a single finding. It screens six products against those items using public documentation, drops three that show no way to record the requirement, and invites the remaining three, plus its current spreadsheet-based process as a baseline, to a scripted demonstration.

## Test the decision points

A demonstration is persuasive when it follows the vendor's script and informative when it follows yours. Write the script around the decisions identified earlier, using sample data drawn from your own findings with names and part numbers changed. The aim is to see each decision point handled, including the awkward cases.

Walk each candidate through the same sequence. A useful script covers the decisions in order:

1. **Raise and confirm a finding.** Ask the presenter to enter a finding with evidence and the requirement it fails, then show how a reviewer confirms or rejects it as a true nonconformity.
2. **Rate significance and route.** Show how significance changes the people notified and the time allowed, and whether routing rules can be changed by the workflow owner without vendor help.
3. **Record containment.** Show that containment can be recorded as a separate action with its own owner and date before cause analysis begins.
4. **Plan and approve actions.** Show a plan linked to a stated cause, then a named reviewer approving or returning it.
5. **Verify and close.** Show implementation evidence, a separate effectiveness check and the closing decision, including what happens when the check fails.

The NIST Radiation Physics Division [corrective action procedure](https://www.nist.gov/document/guide08v211pdf) offers a compact model for this sequence in one laboratory's quality system. Its steps have the responsible party investigate the root cause and record it, select corrective actions that fit the cause and prevent recurrence, and have the group leader review and sign the plan. After completion, results are monitored to confirm the desired effect, and the investigator, group leader, quality manager and division chief sign the plan once the problem is rectified. This describes a calibration laboratory, not a manufacturer, so adapt the roles. The reusable idea is that approval and verification are separate, recorded decisions.

Include failure paths in the script, because a product that handles only the smooth path will fail in daily use. Ask what happens when an action is rejected at review, when a due date passes, when an owner leaves the company and when a follow-up check shows the problem has returned. Ask the presenter to show these live rather than describe them. If a feature depends on configuration that the vendor performs, ask what the customer can change independently after go-live.

> **Important:** A feature is not demonstrated until the presenter performs it with your sample data and you can see the resulting record. Statements such as "that can be configured" are evaluation questions to record, not capabilities to score.

Score each decision point immediately after the demonstration, using the criteria written during mapping, and have each reviewer score independently. Note the evidence for each score, such as a screen, a report or a recorded answer. Scores without evidence become opinion by the time the comparison meeting arrives.

**Illustrative example:** During a scripted demonstration, the unnamed manufacturer asks the presenter to reject an action plan at review and then reopen a closed finding when a follow-up inspection shows the hole-position deviation again. One product handles the first but requires the reopened finding to be entered as a new record with no link to the old one. The reviewers score the reopening criterion as unmet and record the screen as evidence.

## Examine evidence and permissions

CAPA records are evidence. An auditor, a customer or a regulator may ask to see how a specific finding was handled, and the answer is only as good as the record's integrity. Evaluate software for how well it protects that integrity, not just for how easily it captures data.

Start with traceability. For a single closed finding, you should be able to see who raised it, what evidence was attached, which requirement was cited, who confirmed it, what containment was applied, what cause was accepted, what actions were taken, who approved them and what evidence closed the finding. Ask each vendor to produce that history for one finding in a few steps and to export it in a form that can be handed to an auditor. The same ISO and IAF [documenting guidance](https://committee.iso.org/files/live/sites/tc176sc2/files/documents/ISO%209001%20Auditing%20Practices%20Group%20docs/Auditing%20General/APG-DocumentNonconformity2015.pdf) says systematic recording gives traceability, supports progress reviews and provides evidence that corrective actions were completed and effective. Software that scatters this evidence across screens makes that check slow.

Then examine permissions. Permissions decide who may create, edit, approve and close records, and whether those actions are logged. Work through the following questions with each vendor:

- **Role control:** Can access be set by role for each stage, so that only the right people can approve a plan or close a finding?
- **Separation of duties:** Can the system stop the person who implemented an action from confirming its effectiveness, and can a documented exception be recorded when a small team cannot avoid overlap?
- **Change history:** Is every edit to a finding recorded with the user and time, and can a closed record be changed afterward? If so, is the change visible?
- **Attachments:** Are evidence files stored with the finding, and what happens to them if the finding is reopened?
- **External participants:** Can a supplier or customer contact respond to a request without receiving access to unrelated records?

Ask about retention and export too. Findings may need to remain retrievable for years, long after a software contract changes. Find out how records leave the system, in what format and whether links between a finding, its actions and its evidence survive the export. A product that traps records in a proprietary format creates a quiet risk that appears only at renewal or replacement.

Permissions and evidence handling also interact with Canadian business needs. If findings include customer drawings, personal information about staff or supplier commercial data, ask where the data is stored and who can reach it. Capture the answers in writing, and have your own information technology or privacy contacts review them. Do not assume a vendor's default arrangement fits your obligations.

**Illustrative example:** The unnamed manufacturer requests the full history of one closed hole-position finding. Product A produces a single timeline with evidence attached at each step. Product B shows five separate screens, and the effectiveness check is a free-text comment with no date. The team notes that Product B would require a manual summary before an audit and adds that to its comparison sheet.

## Compare cost and support

Cost comparison is easy to get wrong because the quoted price covers only part of what a team will spend. Compare total cost over a fixed period, such as three years, and list each element separately so the comparison is honest.

Build the comparison from these categories:

| Cost element | What to ask | Why it matters |
| :--- | :--- | :--- |
| Licensing | How are users counted, and do occasional participants such as supervisors count? | Many people touch a finding briefly, and counting them all changes the price. |
| Implementation | Who configures workflows, and what is included in the quote? | Configuration effort often exceeds the license cost in the first year. |
| Data migration | Can existing findings be imported, and who does the work? | Open findings must continue through the new workflow without loss. |
| Training | What is provided, and for which roles? | Different roles need different learning, as a later chapter explains. |
| Changes after go-live | Can the workflow owner edit routing, forms and roles, or does each change need vendor work? | Workflows evolve, and per-change fees add up. |
| Support | What are the hours, channels and response expectations? | Plants running several shifts need help when the issue occurs. |

Avoid forecasting savings. A claim that software will reduce recurrence or save a specific number of hours is a hypothesis, and neither the sources used in this guide nor a vendor brochure can establish it for your plant. Instead, compare costs openly and judge value by whether the product meets your acceptance criteria. If a benefit case is required internally, build it from your own measured data, such as how long closing a finding takes today, and label it as an estimate with its assumptions.

Retention is a cost question too. In the NIST [corrective action procedure](https://www.nist.gov/document/guide08v211pdf), the quality manager files the original plan, which shows that someone is accountable for keeping the record. Ask who holds that responsibility in the new system and what archive storage costs.

Support deserves as much attention as price. Ask for references from organizations of similar size and industry, and ask those references how problems were handled after go-live, not only how the sale went. Ask how product changes are communicated, how long versions are supported and what happens to your configuration during upgrades. A strong demonstration followed by weak support leaves the workflow owner alone with every exception.

Consider fit with your existing systems. A CAPA workflow connects to inspection records, document control, supplier files and training records. Ask which connections exist today, which are planned and which are only possible through custom work. Planned features are not capabilities, so score only what can be shown.

Close the evaluation with a weighted comparison. Weight the must-have criteria highest, apply the independent scores and review the totals together. A close result is a reason to run a pilot with real records rather than a reason to prefer the lower price. The following chapters assume a product has been chosen and move into the records and decisions that the chosen workflow must handle.

**Illustrative example:** After scoring, the unnamed manufacturer finds two products within a few points of each other. Instead of choosing on price, it asks both vendors for a short pilot using ten anonymized past findings, including the hole-position series. The product that preserves links between the original and the repeat finding becomes the preferred candidate, subject to agreed support terms.
