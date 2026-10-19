---
slug: effectiveness-review
title: 'Reviewing corrective action effectiveness: CAPA software workflows'
description: >-
  Reviewing corrective action effectiveness in CAPA software: defining
  effectiveness criteria, choosing follow-up evidence and reopening ineffective
  actions.
primaryKeyword: CAPA software
keywords:
  - CAPA software reviewing corrective action effectiveness
  - CAPA software
  - corrective action workflow
  - effectiveness review
author: ISO Certification Consultants Editorial Team
date: '2026-10-19'
imageBrief: >-
  a quality technician isolating a rejected component at a marked inspection
  bench; authentic manufacturing environment, no readable text or logos
sourceIds:
  - apg-review-closing
  - nist-rpd-g08
capabilityIds: []
---
## Defining effectiveness criteria

Completing every planned action shows that the plan was carried out. It does not show that the problem is gone. Effectiveness is a separate question, and the answer needs criteria written before anyone looks at the results. Criteria set in advance protect the team from declaring success because the first few results looked good.

The ISO and IAF paper on [reviewing and closing nonconformities](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ReviewNonconformity.pdf) states the standard plainly. Management system auditors verify the effectiveness of actions taken; effective corrective action should prevent recurrence of the nonconformity by eliminating its cause; and a nonconformity is closed only when objective evidence shows the action was fully implemented and is effective in preventing recurrence. The paper is written for auditors working with ISO 9001:2015, but internal reviewers can borrow its test: did the cause go away, and what evidence says so?

Good criteria describe a measurable result tied to the accepted cause. They state what will be observed, over what scope and for how long. "Hole position stays within the drawing tolerance on every lot from the affected machines over the next defined period" is checkable. "Quality improves" is not. Link each criterion to the expected effect recorded in the action plan, so the review is a comparison between a promise and an outcome.

Consider three elements when writing a criterion:

1. **Measure:** The characteristic, check or record that will show whether the cause is controlled.
2. **Scope:** The products, machines, shifts or suppliers the measure covers, matching the scope of the finding.
3. **Duration:** The period or number of lots long enough for the problem to reappear if the cause remains.

Duration deserves thought. A problem that appears once a month cannot be judged from one week of clean results. The NIST Radiation Physics Division [corrective action procedure](https://www.nist.gov/document/guide08v211pdf) says monitoring should be appropriate to the nature of the corrective action, which is a useful rule: infrequent problems need longer monitoring than frequent ones. Record the reasoning with the criterion, because a reviewer will ask why that period was chosen.

When evaluating software, check where criteria live. They should be fields on the action or the finding, set at the planning stage, and locked or tracked once work begins. If criteria can be rewritten after the results arrive, the review loses its value. Also ask whether the system shows the criteria next to the results at review time.

> **Important:** Effectiveness criteria are a decision of the investigation team and the reviewer. Software can hold them, but it cannot tell you whether they are adequate for a given cause.

**Illustrative example:** The unnamed machining manufacturer sets its criterion for the bracket finding: no hole-position deviation beyond the drawing tolerance on any lot produced on the affected machines for the next set of production runs, measured at the revised in-process check and at final inspection. The team records that this period covers several fixture changes, which is when the deviation first appeared.

## Choosing follow-up evidence

Once the criteria are set, the team must decide what evidence will show whether they are met. The strongest evidence comes from the same process that produced the finding, measured after the change, using the same method. Evidence that is easy to collect but unrelated to the cause, such as a satisfaction comment from the supervisor, carries little weight.

The ISO and IAF paper on [reviewing and closing nonconformities](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ReviewNonconformity.pdf) notes that nonconformities are individual in nature, so a variety of methods may be used to demonstrate effectiveness. Some require direct examination on site, while others can be closed remotely by reviewing submitted documentary evidence. A plant faces the same choice. Some findings need someone to watch the process, measure parts or audit a station. Others can be confirmed from inspection records and trend data.

Match the evidence to the action. A revised instruction is best checked by observing the task and by reviewing the first inspection results after release. A new inspection step is checked by reviewing what it caught. A supplier action is checked through incoming inspection data from later deliveries. Direct verification of the corrected item or process beats an assumption.

Plan the collection as work, not hope. Each piece of follow-up evidence should have an owner, a date and a place to attach the result. Schedule the review date when the plan is approved, so the follow-up appears on someone's calendar and does not depend on memory.

Check these features when comparing software:

- **Scheduled follow-up:** The system creates an effectiveness task with a due date when implementation is confirmed.
- **Evidence types:** Measurements, inspection records, audit notes and photographs can be attached and described.
- **Independent reviewer:** The person who checks effectiveness can be someone other than the action owner.
- **Data links:** Where the evidence sits in inspection or production records, the finding can link to it.
- **Monitoring period:** The task can stay open across the monitoring period without being closed early.

Keep the evidence proportionate. A minor, isolated finding may need one inspection record, while a recurring or high-significance finding deserves several independent sources. Record why the chosen evidence is enough for this finding.

Be honest about the limits of evidence. If a result is based on a small sample or a short period, say so in the record. A reviewer can then decide to extend monitoring or accept the result with a stated caveat, instead of reading false certainty from a table of clean numbers.

Also consider whether the action created new problems. The same ISO and IAF paper says an auditor should verify that the corrective action does not itself create further problems relating to product or service quality or to the management system. The follow-up review should therefore ask about side effects, such as slower throughput from added checks or confusion from a changed instruction.

**Illustrative example:** For the bracket finding, the unnamed manufacturer's quality supervisor schedules two checks: a review of in-process and final inspection records for the monitoring period, and an observation of a fixture change at each shift to confirm the new clamping method is followed. The plant manager asks for a note on whether the added sampling slowed the line, and the supervisor records that it did not affect shipment dates.

## Reopening ineffective actions

Sometimes the evidence says the action did not work. The deviation returns, the cause was incomplete or the change was not followed. How the workflow handles that moment shows whether it supports learning or only paperwork.

The first requirement is that an ineffective result can be recorded without embarrassment or workaround. If the only way to respond to a failed check is to open a new finding, the connection to the original investigation is lost, and the plant has two records that appear unrelated. The software should let the reviewer mark the effectiveness check as failed, reopen the original finding and keep the full history together.

The ISO and IAF paper on [reviewing and closing nonconformities](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ReviewNonconformity.pdf) warns that if a systematic failure is treated as an accidental one-off, the corrective action will not be successful and the problem may recur. A failed check is often the signal of that error. The right response is to return to the cause analysis, ask what was missed and test the remaining candidate causes again, not to repeat the same action with a firmer deadline.

A reopening should trigger a defined sequence:

1. **Record the failure:** State what was observed, when, and which criterion was not met.
2. **Check containment:** Confirm whether suspect product is again at risk and reapply containment if needed.
3. **Return to the cause:** Review the earlier candidate causes and evidence, and decide whether the accepted cause was incomplete or wrong.
4. **Replan:** Create revised actions linked to the updated cause, with new owners, dates and criteria.
5. **Notify:** Inform the people who approved the original plan and anyone affected by the recurrence.

Make the history visible. A finding reopened twice tells management something about the quality of its investigations, and a reviewer should see the earlier attempts at a glance. Look for features that count reopenings, show the original and later criteria side by side and flag repeat findings on the same process. Those views help the workflow owner identify where investigations are too shallow.

Culture matters here as much as software. If staff fear blame for a failed action, they may delay the check or choose evidence that looks safe. Set the expectation that a failed check is useful information, and have the workflow owner review reopened findings to learn from them, not to assign fault.

Persistent recurrence also deserves a wider look at the process itself, so name who reviews it. Finally, decide limits. Some problems resist repeated attempts. Define how many failed cycles trigger escalation to a manager or a wider review of the process, and check that the software can enforce or at least display that rule.

**Illustrative example:** During the monitoring period, the unnamed manufacturer's follow-up inspection finds one lot with the hole position at the edge of tolerance on an evening shift. The quality supervisor marks the effectiveness check as not met and reopens the finding. Review of the earlier evidence shows the evening shift used a different fixture, which the first investigation did not consider, and the team adds it to the cause analysis.

## Authorizing final closure

Closure is a decision with consequences. After it, the finding leaves the active list, the team stops watching, and the record becomes the evidence an auditor or customer will see. The workflow should make closure deliberate, attributable and difficult to do by accident.

Closing should depend on a short list of conditions. The containment was completed and released, the cause was reviewed and accepted, every action was implemented with evidence, and the effectiveness criteria were met by evidence gathered over the planned period. The ISO and IAF paper on [reviewing and closing nonconformities](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ReviewNonconformity.pdf) says that before closing, an auditor should review what the organization did about containment, correction, cause analysis and corrective action results, and should close the nonconformity only when the situation is satisfactory. A closure checklist built into the workflow follows that logic.

The NIST procedure shows how acceptance can be formal. Once it has been demonstrated that quality has been restored, regular service may resume, and after the corrective action has succeeded, the investigator, group leader, quality manager and division chief sign the corrective action plan form. Your plant may need fewer signatures, but the principle holds: closure is acknowledged by named roles, not left to implication. The quality manager then files the original plan, giving the record a defined keeper.

Separate the closer from the doer. The person who implemented the actions should not be the only person who accepts that they worked, unless a documented exception applies. Check that the software can enforce this by role and record any override with a reason.

Use this list when reviewing closure features:

- **Preconditions:** The system checks that containment, cause, actions and effectiveness records are complete before it allows closure.
- **Named approver:** The closing role is defined by finding type or significance, and the decision is dated.
- **Summary:** A closure summary pulls together the finding, cause, actions and results for quick reading.
- **Lock after closure:** Closed records cannot be changed silently, and any later amendment is tracked.
- **Reporting:** The workflow owner can see closure times, reopened findings and repeated causes.

ICC publishes a description of its [nonconformance and CAPA module](/solutions/nonconformance-capa/), and the availability and configuration of any capability should be confirmed in a demonstration before a team relies on it.

Think also about what closure leads to. Lessons from the finding may feed risk assessments, training, supplier reviews or the management review. The workflow should let the closer flag follow-up items without keeping the finding open.

**Illustrative example:** After the monitoring period ends with the evening-shift fixture addressed, the unnamed manufacturer's plant manager reviews the closure summary. Containment is released, the accepted cause is recorded, all actions have evidence, and the criterion is met. The plant manager closes the finding, and the system records the date, the role and the summary.
