---
slug: mapping-workflows
title: 'Mapping the current workflow: CAPA software workflows'
description: >-
  Mapping the current workflow in CAPA software: define the operational problem;
  identify records and handoffs; assign owners and decisions.
primaryKeyword: CAPA software
keywords:
  - CAPA software mapping the current workflow
  - CAPA software
  - corrective action workflow
  - effectiveness review
author: ISO Certification Consultants Editorial Team
date: '2026-10-19'
imageBrief: >-
  a fabrication inspector tracing a paper work instruction at a cutting station;
  authentic manufacturing environment, no readable text or logos
sourceIds:
  - nist-rpd-g07
  - apg-documenting
capabilityIds: []
wordCount: 2182
readTime: 11
image:
  src: /images/guides/capa-software/mapping-workflows.webp
  alt: >-
    a fabrication inspector tracing a paper work instruction at a cutting
    station; authentic manufacturing environment, no readable text or logos
  width: 1200
  height: 675
  source: gemini
  sourceId: d051667b49bf0035ecf8d311517d4e79e4b2e6b3dad55dfe38573d20991c6536
  sha256: d051667b49bf0035ecf8d311517d4e79e4b2e6b3dad55dfe38573d20991c6536
  licenseUrl: 'https://ai.google.dev/gemini-api/terms'
---
## Define the operational problem

Most teams that shop for CAPA software start with a feature list. A better starting point is a plain description of what goes wrong today when a finding appears. Findings reach a quality team from many directions: an inspector rejects a part, a customer complains, an internal audit raises an issue, or a supplier delivers material that does not meet the order. Each path ends, in theory, in the same sequence of containment, cause analysis, corrective action and verification. In practice, the sequence often lives in email threads, spreadsheets and the memory of one or two people.

The operational problem is therefore not a missing tool. It is a specific failure in following a finding from the day it is raised to the day it is closed with evidence. Typical symptoms include findings that sit without an owner, containment that is decided verbally and never recorded, root causes that are copied from the last similar report, and closures signed before anyone checks whether the problem returned. Write the problem down in those terms, because a vendor demonstration can only be judged against a problem you have named.

Three terms recur throughout this guide. Corrective action means action to eliminate the cause of a nonconformity and prevent recurrence. Containment means immediate steps that limit the effect of a finding while its cause is investigated. The workflow owner is the role responsible for decisions and records in the defined workflow.

ISO and IAF auditor guidance gives a useful vocabulary for the discussion. The ISO 9001 Auditing Practices Group paper on [documenting a nonconformity](https://committee.iso.org/files/live/sites/tc176sc2/files/documents/ISO%209001%20Auditing%20Practices%20Group%20docs/Auditing%20General/APG-DocumentNonconformity2015.pdf) quotes the ISO 9000 definition of a nonconformity as non-fulfillment of a requirement. The same paper explains that a well-documented nonconformity has three parts: the audit evidence, the requirement that was not met, and a statement of nonconformity. That paper was written for auditors working with ISO 9001:2015, so treat it as a model of good record structure rather than as a statement of what any current edition requires. Its value for this chapter is practical. If your current process cannot show the evidence, the requirement and a clear statement for a single finding, software will only store the same gaps in a database.

> **Key Consideration:** Define the problem in one or two sentences that a shop-floor supervisor and a quality manager would both recognize. If the statement needs software vocabulary to make sense, it is describing a solution rather than a problem.

Use the following prompts to test whether the problem is defined well enough to shop for software:

- **Where do findings start?** List every source that can create a finding, such as final inspection, receiving inspection, customer complaints, internal audits and process monitoring. Each source needs a defined entry point.
- **What does "closed" mean today?** Write the actual closure rule people follow, even if it is informal. The gap between the informal rule and the intended one is usually where the real problem sits.
- **What evidence is hardest to produce?** Ask which records an auditor or customer asks for and which take longest to find. These are the first candidates for a structured record in the new workflow.

**Illustrative example:** An unnamed Canadian manufacturer of machined metal components finds the same hole-position deviation on a bracket three times in one quarter. Each time, the inspector sets the parts aside and an email goes to the production supervisor. Nobody can say, without searching inboxes, whether the earlier findings were investigated or only fixed in the moment. The team states its problem as "a recurring dimensional finding is treated as a new event each time, so the cause is never confirmed and the closure is never checked." That sentence becomes the test for every software demonstration that follows.

## Identify records and handoffs

Once the problem is named, trace the path one real finding takes through the organization. Choose a recent finding that was handled reasonably well and another that went badly. Follow each from the first observation to the last record, and list every document, message and decision along the way. The goal is a map of records and handoffs, not an idealized flowchart.

One public example shows how these paths are written down in a quality system. A National Institute of Standards and Technology laboratory publishes its procedure for [nonconforming work](https://www.nist.gov/document/guide07v211pdf), which says that nonconforming work may be identified through internal or external audits, management reviews, the calibration or testing process itself, client feedback or staff observation, and that complaints may also reveal it. The procedure then routes different situations differently. Some are resolved by notifying the client and documenting the result, while others, such as equipment malfunction, stop the work and move to corrective action. This is one laboratory's process for calibration and testing, not guidance for manufacturers, but it demonstrates a point worth borrowing: not every finding needs the same path, and the routing rules should be explicit.

A useful map has one row per handoff. For each handoff, note who passes the finding, who receives it, what record travels with it and what the receiver must decide. The table below shows the shape of that map for a generic finding. Replace the entries with the roles and records in your own plant.

| Handoff | From | To | Record that travels | Decision the receiver makes |
| :--- | :--- | :--- | :--- | :--- |
| Raise the finding | Inspector or auditor | Quality owner | Description, evidence, affected product | Is this a real nonconformity? |
| Contain | Quality owner | Production supervisor | Hold tag, quantity, location | What must be isolated now? |
| Investigate | Quality owner | Investigation lead | Containment record, process data | What question will the investigation answer? |
| Act | Investigation lead | Action owners | Cause statement, proposed actions | Who does what by when? |
| Verify | Action owners | Quality owner | Implementation evidence | Was the action carried out as described? |
| Close | Quality owner | Management or auditor | Effectiveness evidence | Is the finding closed, or reopened? |

Handoffs are where records get lost. Look for places where a finding changes medium, such as a paper tag becoming a spreadsheet row, or where it crosses a department boundary. Each crossing risks a dropped detail, so the software should carry the same record forward rather than ask someone to retype it.

Finally, capture the exceptions. Ask what happens when a finding is raised against a supplier rather than an internal process, when the product has already shipped, when the responsible manager is away, or when two findings share a cause. An exception that is handled by a phone call today needs a defined path tomorrow.

**Illustrative example:** The unnamed machining manufacturer traces its hole-position finding and finds three handoffs where the record changes medium: a paper hold tag, an email to the supervisor and a spreadsheet row. It also finds that a supplier-caused finding has no defined route at all. Both become requirements for the future workflow.

## Assign owners and decisions

Maps of records are only half the picture. The other half is who holds authority at each step. CAPA workflows fail more often from unclear ownership than from missing tools: a finding is "with quality" or "with production," and nobody can say who must act next.

Start with decisions rather than job titles. List the decisions that move a finding forward, then name the role that makes each one. The core decisions are usually these:

1. **Is it a nonconformity?** Someone must confirm that a requirement was not met and state which requirement. The NIST [nonconformance procedure](https://www.nist.gov/document/guide07v211pdf) begins here too, asking personnel to identify whether the work is truly nonconforming before evaluating its significance.
2. **How significant is it?** Significance decides how fast and how deeply the team responds, and who must be informed.
3. **What is contained, and by whom?** Containment needs an owner with authority over the affected product or process.
4. **Who investigates?** The investigation lead should understand the process, and may differ from the person who raised the finding.
5. **Who approves the action plan?** A named role reviews the plan before work begins, so that actions fit the stated cause.
6. **Who confirms closure?** The closer should not be the person who implemented the action, which keeps the check independent.

Assign each decision to a role, a backup role, and a time expectation. A decision with no backup is a stalled finding waiting for a holiday. Then ask what the software would need to enforce. If only the quality manager may close a finding, the system must be able to restrict that step by role. If a supervisor must acknowledge containment within a shift, the system needs a reminder or escalation. These become concrete evaluation criteria rather than general hopes.

> **Important:** Role-based restrictions and escalation reminders are evaluation criteria, not facts about any product. ICC publishes a description of its [nonconformance and CAPA module](/solutions/nonconformance-capa/), and the availability and configuration of any capability should be confirmed in a demonstration before it is relied on.

Be realistic about small teams. In a regional fabricator, one person may hold several roles. That is workable if the record shows which role is acting and closure is not performed by the person who carried out the action. Document any exception openly.

Ownership also applies to the workflow design itself. Appoint a workflow owner who answers for how findings move through the system, who approves changes to the process, and who reviews performance. Without that owner, a configured system drifts as exceptions accumulate. The workflow owner is the person who will sit across the table from the vendor, so involve them in every demonstration.

**Illustrative example:** Returning to the unnamed machining manufacturer, the team assigns the quality supervisor to confirm the hole-position finding and rate its significance, the production supervisor to own containment, a process engineer to lead the investigation, and the plant manager to confirm closure. Each role has a named backup. During the mapping exercise, the team discovers that, in practice, the person who implements the fix has always signed the closure. They decide the new workflow must prevent that.

## Set acceptance criteria

The final step in mapping is to turn what you have learned into criteria that a workflow, with or without software, must meet. Acceptance criteria are testable statements. They let the team judge a demonstration, a pilot and the live system against the same standard.

Good criteria describe observable behavior in the language of the workflow. "The system is user-friendly" cannot be tested. "An inspector can raise a finding from the inspection station with the evidence attached, and the quality supervisor is notified without retyping anything" can. Draw criteria directly from the problem statement, the handoff map and the decision list. For each symptom you named, write at least one criterion that would show the symptom has been removed.

Group criteria into a short list that reviewers can score. The categories below work for most plants:

- **Capture:** A finding can be raised from where the work happens, with evidence, the requirement that was not met and a clear statement of the nonconformity, matching the three-part structure of audit evidence, requirement and statement described in the ISO and IAF [guidance on documenting nonconformities](https://committee.iso.org/files/live/sites/tc176sc2/files/documents/ISO%209001%20Auditing%20Practices%20Group%20docs/Auditing%20General/APG-DocumentNonconformity2015.pdf).
- **Routing:** Each finding type follows its defined path, and exceptions such as supplier-caused or shipped-product findings reach the right owner.
- **Ownership:** Every open item shows its current owner, due date and next decision, and overdue items are visible without a manual report.
- **Records:** Containment, cause, actions and closure evidence stay linked to the finding and cannot be silently altered after closure.
- **Independence:** The role that implements an action cannot also confirm its effectiveness, unless a documented exception applies.
- **Retrieval:** An auditor or customer request can be answered by pulling the full history of one finding in a few steps.

Add a pass condition and an owner for each criterion, and agree on how it will be tested. Mark which criteria a demonstration can show and which need a pilot, because a scripted demonstration can succeed where real records fail.

Keep a list of what the criteria deliberately exclude. If the first release will not handle customer complaints or supplier corrective action requests, say so, and record the date to revisit that choice. Written exclusions prevent later disagreement about whether the project met its goals.

**Illustrative example:** For the recurring hole-position finding, the unnamed manufacturer writes the pass condition that a closed finding must show the confirmed cause and a follow-up inspection result. It will test this in a pilot with real records rather than a scripted demonstration.

> **Key Consideration:** Ask each reviewer to score criteria independently before the group meets. Agreement reached in discussion often reflects the loudest voice, while separate scores expose real disagreement about what the workflow must do.

When the criteria are agreed upon, the mapping work is complete. You will hold a problem statement, a map of records and handoffs, a set of owned decisions and a scored list of acceptance criteria. Those four items are the input to the next stage, where software capabilities are compared against your workflow instead of against a vendor's feature sheet. Keep them in one controlled document so that they can be revised as the project learns, and so that the team can show later why a particular decision was made.
