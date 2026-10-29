---
slug: evaluating-software
title: 'Evaluating software capabilities: Internal audit management software'
description: >-
  Evaluating software capabilities in internal audit software: build a
  workflow-based shortlist; test the decision points; examine evidence and
  permissions.
primaryKeyword: internal audit software
keywords:
  - internal audit software evaluating software capabilities
  - internal audit software
  - audit scheduling
  - audit evidence
author: ISO Certification Consultants Editorial Team
date: '2026-10-29'
imageBrief: >-
  a machining supervisor comparing inspection records beside a CNC machine;
  authentic manufacturing environment, no readable text or logos
sourceIds:
  - apg-internal-audit
  - apg-audit-planning
  - icc-audits-module
capabilityIds: []
---
## Build a workflow-based shortlist

A shortlist should come from the workflow, not from a list of product names. The acceptance criteria from the mapping step already describe what the team needs to see. Use them to decide which products deserve a demonstration and which do not.

Start with a broad list of candidates, then screen them against the must-have criteria using public material and a short written questionnaire. The screening question is simple: does the vendor claim to support each must-have, and can it show how? A claim with no demonstration path is a risk to note, not a reason to proceed. Candidates that miss several must-haves can be dropped without a full demonstration.

The [ISO 9001 Auditing Practices Group guidance on internal audits](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-InternalAudit.pdf) states that ISO 9001 does not require the use of ISO 19011. This matters when screening because a vendor may describe its product in terms of one particular auditing standard. Ask what the product assumes, and whether the team can configure it to follow its own documented audit process. The same guidance says the organization defines audit frequency, duration and scope, so a product that hard-codes these choices deserves a closer look.

The [audit planning guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Audit_Planning.pdf) distinguishes the audit program from the audit plan for a single audit. A useful screening check is whether a product handles both levels, and whether the link between them is visible. A tool that stores only individual audit reports may leave program-level coverage to a separate spreadsheet.

### Screening questions that separate products

- Can a user start from a finding and reach the audit, the action, the evidence and the verifier?
- Can the team plan around processes, not only around clauses of a standard?
- Can the schedule change, with a record of why it changed?
- What does the product hold natively, and what does it expect the team to attach as files?
- How are roles represented, including a backup owner?

Keep a scoring sheet, but avoid false precision. Mark each must-have as demonstrated, claimed but not shown, or not supported. A numeric total can hide a missing must-have behind a long list of minor features.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The workflow owner, with the quality manager reviewing the screening sheet |
| Inputs | The agreed acceptance criteria, the record map and the vendor questionnaire responses |
| Decision | Which candidates proceed to a demonstration; the workflow owner accepts the shortlist when each remaining candidate has no unexplained gap on a must-have, and removes it otherwise |
| Record | The screening sheet with the status of each must-have, the reason for each removal and the name of the decision-maker |
| Exception | A promising product with one must-have not shown; the workflow owner decides whether to request a trial or drop it, and records the reason |

**Illustrative example:** An unnamed Canadian manufacturer screens five candidates against four must-haves. Two products cannot show how a rejected action is reassigned, so they are removed with that reason recorded. A third offers the feature but only through a separate paid service, so the team marks it "claimed but not shown" and asks for a trial. All scenarios here are hypothetical.

## Test the decision points

A demonstration should be run by the team, with the team's records. Vendor-scripted tours may show only the best path through a product. The team needs to see the decisions: accepting an action, rejecting evidence, escalating a finding that remains open, and rescheduling an audit.

Prepare a test script before the session. Take the acceptance criteria and write one scenario for each must-have, including at least one exception. Give the script to the vendor in advance so the right person attends, and ask them to follow it. If a step cannot be shown, record that fact.

The [audit planning guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Audit_Planning.pdf) notes that an audit program can change with circumstances while still achieving its intent, and that timing may need to suit production cycles. Turn this into a test. Ask the vendor to move a scheduled audit to a different week, enter a reason, and show that the original plan and the change are both visible afterward. A product that overwrites the original date without a trace makes later program review harder.

The [internal audit guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-InternalAudit.pdf) also says that areas with problems, or likely problems, should get priority in the program. Test whether the product lets a planner raise the priority of a process after a nonconformity and show the rationale. The goal is not to confirm that software calculates risk. The organization sets its own approach, and the product should record the planner's decision and reasoning.

### Decision points worth testing

| Decision point | What to ask the vendor to show | What a weak result looks like |
|---|---|---|
| Accept or reject an action | A reviewer rejects an action with a comment, and the owner sees it | Rejection happens by email outside the product |
| Escalate an open finding | A finding passes a due date and the next role is notified or can see it | Overdue items appear only in a report |
| Reschedule an audit | The schedule changes and the reason is stored | The old date disappears |
| Reassign an owner | A role holder is replaced and history stays intact | Past records show the new name |
| Verify closure | A different person verifies the evidence | The product cannot enforce the team's chosen separation rule |

Treat this table as a starting point and add rows from the team's own map. Each row should be tied to the role that makes the decision in the team's workflow.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The workflow owner, here the quality manager, leads the session; a process owner and an auditor attend as testers |
| Inputs | The test script, sample records prepared in advance and the vendor's access to a trial or demonstration environment |
| Decision | Whether each scenario passed, failed or was not shown; the quality manager accepts a result only when the team saw it, not when it was described |
| Record | A completed test script with a result, an observer and the decision-maker for each scenario, including exception decisions |
| Exception | A scenario the vendor cannot run live; the quality manager decides whether to request a recording, a trial period or a failed result, and writes it on the script |

**Illustrative example:** The hypothetical team asks each vendor to reject a corrective action because the evidence is a photograph without a date. One vendor shows the rejection, the reassignment and the history. Another sends the rejection by email. The team marks the second result as failed for that scenario, since the decision happened outside the product, and the failure counts against that must-have.

## Examine evidence and permissions

Audit software may store or link sensitive records and the evidence that supports decisions, and products differ in how they do it. The team should test how evidence is attached and linked, and who can see or change it, before any commitment.

ICC publishes a [description of its audits and management review module](https://isocertificationconsultants.ca/solutions/audits-management-review/) that mentions a single audit workspace for a checklist, findings and evidence, a checklist library, findings with owners and closure status, a PDF report and audit trends. These are published descriptions only. Their availability and behavior should be confirmed in a demonstration, so treat each statement as an evaluation question and apply the same questions to every other candidate.

For evidence, check the following in a live session. The workflow owner runs these tests with the existing test script, records each result as passed, failed or not shown, accepts or rejects the result, and writes any exception decision on the script:

- Can a file be attached to a specific finding or checklist item, not only to the audit as a whole?
- Is the evidence linked to the criterion it supports?
- Does the product keep a record of who added or removed an item and when?
- Can an evidence item be replaced without losing the original if the team's procedure requires that?

The [internal audit guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-InternalAudit.pdf) describes an auditor of the internal audit process looking at competence, objectivity and impartiality. Permissions are one practical way to protect those qualities. For example, test whether an auditor can be blocked from editing the records of their own area, and whether a process owner can see findings against their process without editing the auditor's notes. Whether that is needed depends on the team's own rules; the point is to confirm that the product can enforce whichever rule the team chooses.

Also test the less visible permission cases: a contractor with temporary access, a user who leaves, and a read-only view for top management. Ask how access is removed and whether past actions remain attributed.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The workflow owner, here the quality manager, with the IT contact or system administrator advising on access |
| Inputs | The responsibility table, the team's separation rules (if none exist, the workflow owner asks top management to set them before testing) and a list of user types |
| Decision | Whether permissions can enforce each separation rule; the quality manager accepts the configuration when each rule holds under test and sends it back otherwise |
| Record | A permissions test log naming the user type, the action tried, the result and the decision-maker for each exception |
| Exception | A rule the product cannot enforce; top management decides whether to reject the product, change the rule, or accept a procedural control through a recorded change to the criterion; an accepted control does not count as the product meeting the original criterion |

**Illustrative example:** The hypothetical team creates three test users: an auditor, a process owner and a viewer. It tries to have the auditor close a finding that the same auditor raised. One product blocks it. Another allows it and relies on a procedure. The team records the difference as an exception for top management to decide.

## Compare cost and support

Cost and support come last in this chapter because they only matter for products that meet the must-haves. They still need structure, since a quoted price may omit costs.

Ask each shortlisted vendor for the same information in writing, so offers can be compared on equal terms. This guide does not state prices for any product, and no price is implied by any description here. Use the vendor's written quote.

Questions to put in writing include:

1. What is included in the base price, and what is charged separately, such as extra users, storage, modules or integrations?
2. What are the terms for renewal, price changes and ending the contract?
3. How can data be exported if the team leaves, and in what format?
4. What implementation help is included, and what is billed by the hour?
5. What training is provided, and for which roles?
6. What support channels and hours apply, and how are urgent issues handled?
7. Where is data hosted, and what does the vendor state about security and backups?

In the session, ask each vendor to walk through a representative support request, export a set of representative records and show any capability charged separately, so the quote can be matched to what was demonstrated. Then separate one-time costs from recurring costs and include internal effort. Time spent by quality staff on migration, configuration and training is a real cost even though it does not appear on the quote. Estimate it with the team's own numbers, and label the estimate as an assumption.

The [audit planning guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Audit_Planning.pdf) suggests that checklists can improve audit quality when designed to promote it. If a product's checklist library is part of the offer, ask how checklists are created and edited, who owns them, and whether the team's own checklists can be imported. A library the team cannot adapt may add little to its own workflow.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The workflow owner and a finance or purchasing contact |
| Inputs | Written quotes, contract terms, support descriptions and the test results from earlier steps |
| Decision | Which product to recommend; top management accepts the recommendation when it meets every must-have and the total cost is understood, and sends it back if a cost or term is unclear |
| Record | A comparison sheet with quotes side by side, the assumptions behind internal effort, the recommendation and its decision-maker |
| Exception | A quote that omits a requested item; the workflow owner asks again in writing and records the answer, or treats the gap as a negative result |

**Illustrative example:** The hypothetical team lists the same seven questions for two remaining vendors. One answers all of them in writing. The other leaves data export unanswered. The team treats the missing answer as a gap and asks again before recommending either product. No actual prices or customer outcomes are described here.

Close the evaluation with a short written recommendation that points back to the acceptance criteria. It should say which must-haves were demonstrated, which were claimed but not shown, and what decisions remain open. If any must-have was only claimed, label the recommendation provisional and state what evidence is needed before top management approves it. That document hands the choice over to whoever plans the audit program.
