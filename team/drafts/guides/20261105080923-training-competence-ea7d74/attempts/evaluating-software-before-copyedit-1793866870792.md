---
slug: evaluating-software
title: Evaluate ICC against the actual decision
description: >-
  Evaluating software capabilities in competency management software: build a
  workflow-based shortlist and test the decision points.
primaryKeyword: competency management software
keywords:
  - evaluate competency management software
  - competency management software
  - training records
  - competency matrix
author: ISO Certification Consultants Editorial Team
date: '2026-11-05'
imageBrief: >-
  A machining supervisor comparing inspection records beside a CNC machine; no
  readable text or logos.
sourceIds:
  - icc-training-competence
  - apg-competence
capabilityIds: []
---
## Translate published descriptions into demonstration tests

A published product page is a starting point for questions, not proof of behavior. The [ICC training and competency module page](https://isocertificationconsultants.ca/solutions/training-competence/) describes a workforce directory built by importing employees, a training library holding PDF, Word, PowerPoint and video content with quizzes and pass scores, and training campaigns delivered online, in a classroom or on the job. It also describes a competency matrix with levels the customer defines and bulk updates for a whole team, supervisor sign-off of on-the-job training, certificates issued on completion, and an employee area called My Learning where people see what training they still owe.

These are published descriptions. The evidence gathered for this guide does not independently verify that any of them is available in a given configuration, so this chapter treats each statement as a claim to be shown. The practical method is to turn every claim that matters to the decision into a short test that the supplier performs while the team watches.

### Start from the map, not from the feature list

The workflow map from the previous chapter is the filter. A feature that does not touch the staffing question, the evidence path or the decision states can wait. For each stage of the map, choose the published description that appears to match it and write the question in operational terms.

| Map stage | Published description to test | Question to put to the supplier |
|---|---|---|
| Know who works here | Workforce directory built by importing employees | Import a sample roster. What happens to a person who changes role? |
| Define what each task needs | Matrix with user-defined levels | Build an inspection task with the team's level definitions. Who can edit them? |
| Close a gap | Campaigns online, in a classroom or on the job | Create a campaign for the alternate inspector and show what the supervisor sees |
| Evaluate in practice | Supervisor sign-off of on-the-job training | Record a sign-off. What does the record show afterward, and who made it? |
| Show the result | Certificates and quiz results | Open the record an auditor would see for one named person |

Write each question so that a supplier can answer it only by operating the system, never by describing it. Keep the questions this specific. “Can the system track training?” invites a yes. “Show the alternate inspector's status for first-article inspection, and show what changes after the practical assessment is recorded” requires a demonstration.

### Prepare a scripted scenario

Give the supplier the representative task, a small set of fictional but realistic records and the exceptions that matter, ahead of the session. Include at least one person with completed learning and no practical assessment, because the system's handling of that case reveals whether completion is separated from demonstrated ability. The Auditing Practices Group makes this distinction in its [guidance on auditing competence](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Competence.pdf): participation in a course does not by itself show that a person is competent, because it may show only that knowledge was gained. A system that marks a person as qualified on attendance alone will not support the decision states defined in the workflow map.

**Illustrative example:** An unnamed Canadian manufacturer asks to see the first-article inspection task, an alternate inspector and a supervisor sign-off in the demonstrated environment. The alternate has a completed measurement course and no practical assessment. The evaluation lead records what the screen shows at each step, whether the supplier needed to change a setting to produce it, and what the supplier said could not be shown.

Invite the people who will use the system daily, not only the buyers. A supervisor who watches the sign-off step will notice friction that a manager does not, such as the number of screens needed to confirm one assessment at the cell. Ask them to score the demonstration against the same sheet.

### Record what was observed

Use a simple results sheet with four columns: the claim, the test, what was observed and the disposition. Dispositions might be shown, shown with configuration, described but not shown, and not available. The difference between the second and third matters. A capability shown with configuration needs a note of who configured it and how long it took. A capability that was only described remains an open question until the supplier writes it down. If a described capability cannot be shown, say so in the results sheet and do not fill the gap with an assumption. Share the finished sheet with the supplier so any disagreement about what happened surfaces before a contract.

> **Key Consideration:** Mapping a product to a standard's clause is not a statement that software alone satisfies the clause. The ICC page maps the module to ISO 9001:2015 clause 7.2 and to clauses in two other standards. Treat that as a pointer to where records may be relevant, and evaluate whether the records support the decision.

## Test evidence, access and human review

A demonstration that stops at the matrix screen misses the questions auditors and managers ask later. After testing the workflow, test how evidence is reviewed, who can see or change it, and how any automated suggestion is handled. None of these is established by the supplied evidence as a product feature; each is an evaluation question.

### Ask who approved the evidence

The Auditing Practices Group [says](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Competence.pdf) documented information should show how sampled persons were deemed competent. For a quality lead, the practical version is whether the system lets a reviewer open one person's record and tell who recorded each item, when, and on what basis. Ask the supplier to open the record of a person with a supervisor sign-off, then answer four questions from the screen alone.

1. Who signed off, and in what role?
2. When was it recorded?
3. Can the entry be edited afterward, and if so, is the earlier version visible?
4. Which version of the task requirement was current when the sign-off was made?

The [ICC module page](https://isocertificationconsultants.ca/solutions/training-competence/) says an auditor can view the competency matrix for a role or person, quiz results and pass scores, supervisor sign-offs and certificates with completion dates. Treat that list as the script for the demonstration. Ask to see each item for the fictional person, then ask about the fourth question above, which the page does not address.

### Test roles and permissions

Competence records are personal and consequential. A system that lets any user change a level can undermine every record it holds. Give IT and quality a short list of roles from the map and ask for a role-based demonstration.

| Role | Should be able to | Should not be able to |
|---|---|---|
| Employee | See their own required and completed learning | Change their own level or sign-off |
| Supervisor | Record on-the-job sign-off for their team | Alter another team's records |
| Quality reviewer | View the evidence behind any assignment | Delete history |
| Administrator | Configure levels and imports | Approve their own assessment |

Do not treat the table as a list of product features. It is a set of local rules to test. Where the supplier answers that a rule can be configured, ask to see it configured, and record who performed the configuration.

### Test human review of automated suggestions

The [ICC page](https://isocertificationconsultants.ca/solutions/training-competence/) states that every AI output in the software is a suggestion a person reviews before it enters a controlled record. It does not say which outputs use AI. If the supplier proposes AI assistance in the workflow, ask which step it touches and watch the review.

- What does the reviewer see before accepting or rejecting?
- Is the rejection recorded, and with what reason?
- Can the suggestion change a record before the person decides?
- Who is allowed to approve it?

If the supplier does not use AI in the workflow being evaluated, record that as an answer.

**Illustrative example:** Quality in the hypothetical plant asks who can review an inspection assessment and how an erroneous suggestion would be rejected. The supplier shows a reviewer opening a record. Quality then asks to see the same action performed by a supervisor, who should not have the permission. The results sheet records the difference.

### Look beyond the software to the people

The Auditing Practices Group notes that auditors sample, observe and interview people, and that existing records are not sufficient on their own. A good system helps, but people must still be able to explain what they are competent to do. Ask the supplier how its customers prepare supervisors and employees to use the records in a conversation with an auditor.

## Resolve commercial and technical unknowns

The [published ICC page](https://isocertificationconsultants.ca/solutions/training-competence/) describes the module's features. As supplied for this guide, it does not describe integrations with human resources or other systems, pricing, trials or self-serve access, and its main call to action is a demonstration request. Those are not criticisms. They are the questions a buyer must put in writing before relying on any assumption.

### Build the unknowns list

Begin with what the page leaves out and add what the project needs. Each item should have an owner and a due date for a written answer.

| Topic | Question to ask in writing | Why it matters |
|---|---|---|
| Employee data | Can the workforce directory be refreshed from the human resources source, and how often? | Stale rosters create false gaps and false assignments |
| Pricing | What is priced per user, per module, per site or per implementation? | Total cost depends on the unit |
| Trial or pilot | Is a configured pilot available, and for how long? | The pilot is where the workflow is tested |
| Setup services | What does consultant review of the configuration include? | The page describes setup as a service, not a feature |
| Exit | In what format can records and history be exported if the organization leaves? | Records must outlive a contract |
| Support | What are the response commitments and who answers? | Staffing decisions happen on every shift |

The ICC page lists setup services separately from the software: mapping processes, configuring fields and routing, importing standards and deploying campaigns, with a certified consultant reviewing the configuration through to an audit. Ask what is included in the quoted scope and what is billed separately, because those services are part of the cost of getting the matrix into use.

### Compare options on the same basis

If ICC is being compared with other suppliers or with improving the current spreadsheet process, use the same scenario, the same records and the same results sheet for each. Add a final column for outstanding questions. A supplier who cannot yet answer is not disqualified, but the answer must arrive before a decision. Include the option of improving the current paper or spreadsheet workflow in the comparison. Sometimes the mapping exercise reveals that a clearer state definition and a named exception owner resolve most of the problem.

Generic procurement criteria apply: total cost over several years, implementation effort on the organization's side, data transfer into and out of the system, security review, supplier stability and the support available to a small team. Weight them by what the map showed. A plant with frequent absences needs fast status checks. A plant with many recognized qualifications needs reliable expiry handling, which is covered in a later chapter.

Ask each supplier for an implementation outline in writing: who on the organization's side must supply data, how many hours of supervisor time the pilot needs, and what the supplier expects the organization to have decided before configuration begins. Plants often underestimate this internal effort, and it belongs in the comparison beside the license price.

### Decide and document the condition of acceptance

The result of evaluation is a recommendation with conditions, not only a name. State which claims were shown, which were configured, which remain described only, and which written answers are outstanding. The decision-maker can then accept, clarify or reject each unresolved condition.

**Illustrative example:** The hypothetical manufacturer asks whether employee data can be transferred from its existing human resources system and at what cost. The supplier promises to reply in writing. The evaluation lead marks the item as outstanding and writes that the recommendation is conditional on a written answer before any contract is signed.

When the team is ready, [request a demonstration](/contact/) using the script prepared for the session. Bring the map, the results sheet and the unknowns list, and ask the supplier to work through them in order.
