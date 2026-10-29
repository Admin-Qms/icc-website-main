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

Software cannot fix an audit process that nobody has described. Before any vendor conversation, the team needs a plain statement of what is going wrong today. For most manufacturers, the problem is not a lack of audit activity. It is that the audit plan, the findings and the follow-up evidence live in different places and are connected by memory, email and a spreadsheet that one person maintains.

State the problem as a link that breaks. For example: "A finding is raised in the audit report, but the corrective action is tracked in a different file, and the evidence that the action worked sits in a shared folder that the auditor never sees." That sentence names three records and two handoffs, and it gives the evaluation team something to test. A statement such as "the audit tool is inadequate" gives them nothing.

ISO 9001 clause 9.2.2 requires the organization to plan, establish, implement and maintain an audit program, including frequency, methods, responsibilities, planning requirements and reporting. The program has to consider the importance of the processes concerned, changes affecting the organization and the results of previous audits, as described in the [ISO 9001 Auditing Practices Group guidance on internal audits](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-InternalAudit.pdf). That last point matters for software. If past results cannot be pulled into planning without manual searching, the workflow is already working against the requirement.

The same guidance is explicit that ISO 9001 does not specify audit frequency, duration or scope. The organization defines them. Software therefore should not decide these for the team. It should make the team's own decisions easy to record and easy to find later.

The [guidance on audit planning](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Audit_Planning.pdf) separates two levels of planning: the audit program and the audit plan for a single audit. A useful problem statement identifies which level is failing. Some teams struggle to keep a program-level view of coverage. Others have a sound program but lose detail when a single audit is planned, run and reported.

The internal audit guidance states that it has not been through an ISO, TC 176 or IAF endorsement process and is for educational purposes. Treat it as practical guidance, not as requirements to quote in a contract.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The workflow owner, usually the quality manager or the person who maintains the audit program |
| Inputs | The current audit schedule, the last two or three audit reports, the corrective action log and any open follow-up items |
| Decision | Which break in the workflow is worth solving first, and which are deferred |
| Record | A one-page problem statement signed off by the workflow owner |
| Exception | Records that cannot be found, or people who disagree about where the real record lives |

**Illustrative example:** An unnamed Canadian manufacturer with two production shifts reviews its last three internal audits. The team finds that every audit produced a report, but only some findings appear in the corrective action log, and the follow-up evidence for several actions was filed under the department rather than the finding. The problem statement becomes: "Findings cannot be traced from the audit report to the verified closure." All records and situations in this example are hypothetical and describe no actual customer outcome.

When you evaluate software against this step, ask a vendor to show the broken link being repaired. A demonstration should use representative records and at least one exception, such as a finding whose action was rejected. A clean path alone shows little.

## Identify records and handoffs

Once the problem is stated, list every record the audit workflow creates, reads or changes. This is a mapping exercise, and it works best at a whiteboard or on a shared sheet with the people who do the work. Auditors, process owners and whoever files the paperwork should all contribute.

Start from the audit program and walk forward through one complete audit. At each step, write down what record exists, who creates it, where it is stored today and who needs it next. A handoff is any point where a record moves from one person or system to another. Handoffs are where records get delayed, duplicated or lost, so they deserve more attention than the records themselves.

The [audit planning guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Audit_Planning.pdf) recommends that the team review available documented information before the audit and notes that checklists can improve audit quality if they are designed to promote it. Both are records with handoffs. The prior documents must reach the auditor in time, and the checklist must be built before the audit rather than improvised on the floor. Map where each one comes from today and who is responsible for getting it to the auditor.

The guidance also advises planning around processes rather than clauses, and auditing linked processes together so that linkages and interdependencies can be explored. For mapping, this has a practical consequence. A record may belong to more than one process. A nonconforming product report might matter to an incoming inspection audit and to a production audit. Note these shared records now, because software that stores each record in only one place may force awkward duplication later.

Consider shifts and sites too. The same guidance reminds teams to consider what happens on evening and night shifts. If night-shift evidence is gathered on paper and scanned the next morning, that is a handoff the map should show, along with the delay it creates.

### A simple record map

| Stage | Record | Created by | Stored today | Needed next by |
|---|---|---|---|---|
| Program | Annual audit schedule | Quality manager | Spreadsheet | Auditors, process owners |
| Planning | Audit plan for one audit | Lead auditor | Email attachment | Auditee, management |
| Execution | Checklist and notes | Auditor | Paper or local file | Lead auditor |
| Reporting | Audit report | Lead auditor | Shared folder | Management, process owners |
| Follow-up | Action and evidence | Process owner | Separate log | Quality manager, auditor |

The stages here are a generic starting point. Replace them with the stages your team actually uses.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The workflow owner, with input from each person who touches a record |
| Inputs | Walkthroughs of one recent audit from planning to closure, plus samples of each record type |
| Decision | Which records are authoritative, and which are copies or working notes |
| Record | The completed record map, with each handoff marked |
| Exception | Records with no clear owner, or records stored in a personal location |

**Illustrative example:** In the hypothetical manufacturer's map, the team finds that the audit checklist is created by one auditor on a laptop and emailed to the lead auditor. The completed checklist comes back as a scanned image. No one has a rule about which version is the record. The map marks this as an exception to resolve before any software configuration begins.

For the software evaluation, the record map becomes a test script. Each row can be turned into a question: can the product hold this record, link it to the next one, and show who handled it? Ask a vendor to walk through the rows using sample data, including a record that arrives late and one that is rejected.

## Assign owners and decisions

A record map shows what moves. This step shows who decides. Every handoff should have a named role on each side, and every point where someone can accept, reject or escalate a record should have a named decision owner. Software can enforce routing, but it cannot supply accountability that the organization has not assigned.

Roles are easier to maintain than names. Assign decisions to roles such as lead auditor, process owner and quality manager, then list the people currently in each role.

The internal audit guidance describes what an auditor of the internal audit process would look at: competence, objectivity and impartiality, risk-based planning, management involvement, and how audit outcomes are used to evaluate QMS effectiveness and identify improvement. Each of those becomes a role question. Who confirms an auditor is competent for a given audit? Who confirms the auditor is not auditing their own work? Who in management reviews the results? Name the role for each, and record the decision where it can be found later.

ICC publishes a [description of its audits and management review module](https://isocertificationconsultants.ca/solutions/audits-management-review/) that mentions findings with owners and closure status. These are published descriptions only. Treat them as questions for a demonstration: can findings carry an owner, and is closure status visible to the people who need it? Availability and behavior should be confirmed in the demonstration, not assumed from a web page, and the same standard applies to any other vendor.

### Separating decision rights

Decide early which decisions must be separate from each other. Common separations include separating the person who raises a finding from the person who accepts the action, and separating the person who performs the action from the person who verifies it. In a small company one person may hold several roles, and that is acceptable when it is a conscious, recorded choice. What the map should expose is where separation is missing by accident.

Also decide who covers when an owner is on leave. Later chapters cover disputes in detail.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The quality manager, with top management confirming authority |
| Inputs | The record map, the current organization chart and any existing procedure on internal audits |
| Decision | Which role owns each handoff and each accept, reject or escalate decision |
| Record | A responsibility table that lists roles, current holders and backup holders |
| Exception | Unfilled roles, conflicts of interest or owners who cannot be reached |

**Illustrative example:** The hypothetical manufacturer finds that the quality manager both raises findings and accepts their closure. The team decides that a second reviewer, such as a production manager, will verify closure for any finding the quality manager raised. The rule is recorded as a decision owner on the responsibility table, ready to be configured later.

When you evaluate software, ask to see role-based assignment with representative users. Check whether the product can represent a backup owner, and whether it records who made each decision and when. Ask what happens when a role is empty, because that exception occurs in real operations more often than a demonstration usually shows.

## Set acceptance criteria

The last step turns the map into a standard against which any software can be judged. Acceptance criteria are statements the team can test. They should be written before the first demonstration, so that vendors answer to the team's workflow and not the other way around.

Write each criterion in terms of the problem statement. If the problem is that findings cannot be traced from the report to verified closure, then a criterion might read: "Starting from any finding, a user can see the audit it came from, the owner of the action, the evidence submitted and who verified it." That criterion can be tested in a demonstration with sample records, and it either passes or does not.

Good criteria have a few shared traits:

- They describe an outcome the user can observe, not a feature name.
- They name the role performing the check.
- They include at least one exception case, such as a missing record or a rejected action.
- They can be answered with a demonstration, a trial or documentary evidence from the vendor.

The [audit planning guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Audit_Planning.pdf) supports a flexible view of the program. It notes that audit timing may need to suit production cycles, and that a program can change with circumstances while still achieving its intent. Add criteria that reflect this. A reasonable test is whether the team can reschedule an audit and keep a record of why, without losing the original plan. Whether that behavior is available is a question to put to every product, including any ICC capability.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The workflow owner, reviewed by the quality manager and a process owner |
| Inputs | The problem statement, the record map and the responsibility table |
| Decision | Which criteria are must-haves, should-haves or could-haves, and what counts as a pass |
| Record | The signed acceptance criteria list, kept with the evaluation file |
| Exception | Criteria the team cannot test, or criteria that conflict with each other |

**Illustrative example:** The hypothetical manufacturer writes seven criteria. Four are must-haves, including traceability from a finding to verified closure and a record of who verified it. Two are should-haves, such as seeing last year's findings while planning this year's schedule. One is a could-have: a trend view. The list goes into the evaluation file, and the quality manager signs it before any vendor is invited.

Keep the list short enough to use. Fifty items turn every demonstration into a feature tour.

For related workflow thinking in another area, the guide on [CAPA software](/guides/capa-software/) walks through a similar mapping exercise for corrective actions. Findings from internal audits often feed that process, so the two maps should agree on where an audit finding ends and a corrective action begins.

Finish by checking the criteria against the problem statement. If every criterion passed, would the original broken link be repaired? If not, add the missing criterion.
