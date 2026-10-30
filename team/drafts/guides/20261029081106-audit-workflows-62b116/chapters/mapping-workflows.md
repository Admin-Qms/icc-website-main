---
slug: mapping-workflows
title: 'Mapping the current workflow: Internal audit management software'
description: >-
  Mapping the current workflow in internal audit software: define the
  operational problem; identify records and handoffs; assign owners and
  decisions.
primaryKeyword: internal audit software
keywords:
  - internal audit software mapping the current workflow
  - internal audit software
  - audit scheduling
  - audit evidence
author: ISO Certification Consultants Editorial Team
date: '2026-10-29'
imageBrief: >-
  a fabrication inspector tracing a paper work instruction at a cutting station;
  authentic manufacturing environment, no readable text or logos
sourceIds:
  - apg-internal-audit
  - apg-audit-planning
  - icc-audits-module
capabilityIds: []
---
## Define the operational problem

Describing the audit process first helps the team see which problems software should address. Before any vendor conversation, state plainly what is going wrong. In many organizations, the problem may not be a lack of audit activity. It may be that the audit plan, the findings, and the follow-up evidence live in different places and are connected by memory, email, or a spreadsheet that one person maintains.

State the problem as a link that breaks. For example: "A finding is raised in the audit report, but the corrective action is tracked in a different file, and the evidence that the action worked sits in a shared folder that the auditor never sees." That sentence names three records and two handoffs to test. A statement such as "the audit tool is inadequate" gives the team nothing.

ISO 9001 clause 9.2.2 requires the organization to plan, establish, implement, and maintain an audit program, including frequency, methods, responsibilities, planning requirements, and reporting. The program has to consider the importance of the processes concerned, changes affecting the organization, and the results of previous audits, as described in the [ISO 9001 Auditing Practices Group guidance on internal audits](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-InternalAudit.pdf). That last point matters for software. If past results are hard to bring into planning, the team has a practical problem to describe, whatever method it uses to retrieve them.

The same guidance is explicit that ISO 9001 does not specify audit frequency, duration, or scope; the organization defines them. Software should make the team's own decisions easy to record and find.

The [guidance on audit planning](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Audit_Planning.pdf) separates two levels of planning: the audit program and the audit plan for a single audit. A useful problem statement identifies which level is failing. Some teams struggle to keep a program-level view of coverage. Others have a sound program but lose detail when a single audit is planned, run, and reported.

The internal audit guidance states that it is for educational purposes and has not been through an ISO, TC 176, or IAF endorsement process.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The workflow owner, usually the quality manager or the person who maintains the audit program |
| Inputs | The current audit schedule, the last two or three audit reports, the corrective action log, and any open follow-up items |
| Decision | Which break to solve first; the workflow owner accepts the problem statement when it names records and handoffs, and sends it back when it only names a tool |
| Record | A one-page problem statement signed off by the workflow owner |
| Exception | Records that cannot be found, or people who disagree about where the real record lives; the workflow owner decides the disposition and records it in the problem statement |

**Illustrative example:** An unnamed Canadian manufacturer with two production shifts reviews its last three internal audits. The team finds that every audit produced a report, but only some findings appear in the corrective action log, and the follow-up evidence for several actions was filed under the department rather than the finding. The problem statement becomes: "Findings cannot be traced from the audit report to the verified closure." All records and situations in this example are hypothetical and describe no actual customer outcome.

When you evaluate software against this step, ask a vendor to show the broken link being repaired. A demonstration should use representative records and at least one exception, such as a finding whose action was rejected. A clean path alone shows little.

## Identify records and handoffs

Once the problem is stated, list every record the audit workflow creates, reads, or changes. Auditors, process owners, and whoever files the paperwork should all contribute.

Start from the audit program and walk forward through one complete audit. At each step, write down what record exists, who creates it, where it is stored today, and who needs it next. A handoff is any point where a record moves from one person or system to another.

The [audit planning guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Audit_Planning.pdf) recommends that the team review available documented information before the audit and notes that checklists can improve audit quality if they are designed to promote it. As practical advice, get the prior documents to the auditor in time and prepare the checklist before the audit. Map each handoff between people, including where each document, checklist, or record comes from today and who is responsible for getting it to the auditor.

The guidance also advises planning around processes rather than clauses, and auditing linked processes together so that linkages and interdependencies can be explored. For mapping, this has a practical consequence. A record may belong to more than one process. A nonconforming product report might matter to an incoming inspection audit and to a production audit. Note these shared records now, and test in demonstrations whether a product can link one record to more than one process.

The same guidance reminds teams to consider evening and night shifts. If night-shift evidence is scanned the next morning, show that handoff on the map.

### A simple record map

**Illustrative example:** The hypothetical map below shows one possible set of storage locations and authority decisions. Validate every entry locally; none is a requirement.

| Stage | Record | Created by | Stored today | Needed next by | Authoritative or copy; decided by |
|---|---|---|---|---|---|
| Program | Annual audit schedule | Quality manager | Spreadsheet | Auditors, process owners | Authoritative; quality manager |
| Planning | Audit plan for one audit | Lead auditor | Email attachment | Auditee, management | Authoritative once agreed with the auditee; lead auditor |
| Execution | Checklist and notes | Auditor | Paper or local file | Lead auditor | Working notes; lead auditor |
| Reporting | Audit report | Lead auditor | Shared folder | Management, process owners | Authoritative; quality manager accepts |
| Follow-up | Action and evidence | Process owner | Separate log | Quality manager, auditor | Authoritative; quality manager |

Replace these generic stages with the ones your team uses.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The workflow owner, with input from each person who touches a record |
| Inputs | Walkthroughs of one recent audit from planning to closure, plus samples of each record type |
| Decision | Which records are authoritative, and which are copies or working notes; the quality manager accepts the map when every handoff has a source and a destination, and sends it back otherwise |
| Record | The completed record map, with each handoff marked |
| Exception | Records with no clear owner, or records stored in a personal location; the workflow owner decides and notes the outcome beside the record map |

**Illustrative example:** In the hypothetical manufacturer's map, the team finds that the audit checklist is created by one auditor on a laptop and emailed to the lead auditor. The completed checklist comes back as a scanned image. No one has a rule about which version is the record. The map marks this as an exception to resolve before any software configuration begins.

For the software evaluation, the record map becomes a test script. Each row can be turned into a question: can the product hold this record, link it to the next one, and show who handled it? Ask a vendor to walk through the rows with sample data, including a late record and a rejected one.

## Assign owners and decisions

A record map shows what moves. This step shows who decides. Every handoff should have a named role on each side, and every point where someone can accept, reject, or escalate a record should have a named decision owner. Software can enforce routing, but it cannot supply accountability that the organization has not assigned.

Roles are easier to maintain than names. Assign decisions to roles such as lead auditor, process owner, and quality manager, then list the people currently in each role.

The [internal audit guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-InternalAudit.pdf) describes what an auditor of the internal audit process would look at: competence, objectivity, and impartiality, risk-based planning, management involvement, and how audit outcomes are used to evaluate QMS effectiveness and identify improvement. Each of those becomes a role question. Who confirms an auditor is competent for a given audit? Who confirms the auditor is not auditing their own work? Who in management reviews the results? Name the role for each, and record the decision where it can be found later.

ICC publishes a [description of its audits and management review module](https://isocertificationconsultants.ca/solutions/audits-management-review/) that mentions findings with owners and closure status. This is a published description only. Treat it as a question for a demonstration: can findings carry an owner, and is closure status visible to the people who need it? Availability and behavior should be confirmed in the demonstration, not assumed from a web page, and the same standard applies to any other vendor.

### Separating decision rights

Common separations include separating the person who raises a finding from the person who accepts the action, and separating the person who performs the action from the person who verifies it. In a small company one person may hold several roles, but a recorded choice does not by itself resolve a conflict with auditor objectivity and impartiality, so check each combination against those expectations. The map should expose where separation is missing by accident.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The quality manager, with top management confirming authority |
| Inputs | The record map, the current organization chart, and any existing procedure on internal audits |
| Decision | Which role owns each handoff; top management accepts the table when every decision has a primary and a backup owner, and sends it back otherwise |
| Record | A responsibility table that lists roles, current holders, and backup holders |
| Exception | Unfilled roles, conflicts of interest, or owners who cannot be reached; top management decides the disposition and the quality manager records it |

**Illustrative example:** The hypothetical manufacturer finds that the quality manager both raises findings and accepts their closure. The team decides that a second reviewer, such as a production manager, will verify closure for any finding the quality manager raised. The responsibility table records the closure-verification rule and names the second reviewer as its decision owner, ready to be configured later.

When you evaluate software, ask to see role-based assignment with representative users. Check whether the product can represent a backup owner, and whether it records who made each decision and when. Ask what happens when a role is empty, since a role can be empty in real operations.

## Set acceptance criteria

The last step turns the map into a standard against which any software can be judged. Acceptance criteria are statements the team can test. They should be written before the first demonstration, so that vendors answer to the team's workflow and not the other way around.

Write each criterion in terms of the problem statement. If the problem is that findings cannot be traced from the report to verified closure, then a criterion might read: "Starting from any finding, the quality manager can see the audit it came from, the action owner, the evidence submitted, and who verified it. For a finding whose action was rejected, the record shows the rejection and the reassigned owner." A demonstration with sample records either meets this or does not.

Good criteria share a few traits:

- They describe an outcome the user can observe, not a feature name.
- They name the role performing the check.
- They include at least one exception case, such as a missing record or a rejected action.
- They can be answered with a demonstration, a trial, or documentary evidence from the vendor.

The [audit planning guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Audit_Planning.pdf) supports a flexible view of the program. It notes that audit timing may need to suit production cycles, and that a program can change with circumstances while still achieving its intent. Add criteria that reflect this. A reasonable test is whether the team can reschedule an audit and keep a record of why, without losing the original plan. Whether that behavior is available is a question to put to every product, including any ICC capability.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The workflow owner, reviewed by the quality manager and a process owner |
| Inputs | The problem statement, the record map, and the responsibility table |
| Decision | Which criteria are must-haves, should-haves, or could-haves, and what counts as a pass; the quality manager accepts the list when each criterion has a test and an exception case |
| Record | The signed acceptance criteria list, kept with the evaluation file |
| Exception | Criteria the team cannot test, or criteria that conflict with each other; the workflow owner decides and records the outcome in the evaluation file |

**Illustrative example:** The hypothetical manufacturer writes seven criteria. Four are must-haves, including traceability from a finding to verified closure and a record of who verified it. Two are should-haves, such as seeing last year's findings while planning this year's schedule. One is a could-have: a trend view. The list goes into the evaluation file, and the quality manager signs it before any vendor is invited.

Keep the list short enough to use. A very long list risks turning each demonstration into a feature tour.
