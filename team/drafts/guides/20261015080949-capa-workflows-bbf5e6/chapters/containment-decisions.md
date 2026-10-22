---
slug: containment-decisions
title: 'Recording findings and containment: CAPA software workflows'
description: >-
  Recording findings and containment in CAPA software: classifying the finding,
  assigning immediate containment and linking affected records.
primaryKeyword: CAPA software
keywords:
  - CAPA software recording findings and containment
  - CAPA software
  - corrective action workflow
  - effectiveness review
author: ISO Certification Consultants Editorial Team
date: '2026-10-19'
imageBrief: >-
  a production operator completing a controlled checklist at an assembly
  station; authentic manufacturing environment, no readable text or logos
sourceIds:
  - apg-documenting
  - nist-rpd-g07
  - apg-review-closing
capabilityIds: []
wordCount: 2035
readTime: 11
image:
  src: /images/guides/capa-software/containment-decisions.webp
  alt: >-
    a production operator completing a controlled checklist at an assembly
    station; authentic manufacturing environment, no readable text or logos
  width: 1200
  height: 675
  source: gemini
  sourceId: ea82a9767eac472591f3a1fe3e52ede85d21852b3e2771de1d33810a8117581e
  sha256: ea82a9767eac472591f3a1fe3e52ede85d21852b3e2771de1d33810a8117581e
  licenseUrl: 'https://ai.google.dev/gemini-api/terms'
---
## Classifying the finding

The first minutes after a finding appears decide how well the rest of the workflow runs. Someone has to decide what kind of finding it is, whether it is real, and how serious it might be. Software should support that judgment with structured fields and clear rules, without replacing it.

Begin with confirmation. The NIST Radiation Physics Division [nonconformance procedure](https://www.nist.gov/document/guide07v211pdf) asks personnel to identify whether the work is truly nonconforming before they evaluate its significance. That order matters in a plant, too. A rejected part may reflect a worn gauge, a misread drawing, or a real process drift, and each leads to a different response. A workflow that creates a full CAPA record for every rejected part buries real problems, while one that never asks the question lets false alarms consume investigation time.

Next, record what was found in a way that another person can understand without a phone call. The ISO and IAF guidance on [documenting a nonconformity](https://committee.iso.org/files/live/sites/tc176sc2/files/documents/ISO%209001%20Auditing%20Practices%20Group%20docs/Auditing%20General/APG-DocumentNonconformity2015.pdf) says a well-documented nonconformity has three parts: the evidence, the requirement that was not met, and a statement of the nonconformity. It adds that requirements can come from the standard, from the organization's own management system, from regulations, or from the customer. In a production setting, that means the form should ask for the drawing, specification, work instruction, or contract clause that the part or process failed. Without it, the finding is an observation, and nobody can later judge whether the fix addressed the right requirement.

> **Important:** The three-part record comes from auditor guidance written for ISO 9001:2015. It is a good model for any finding, but it does not tell your team which findings must be opened as formal corrective actions. That threshold is a decision your quality system must make and document.

Classification fields should be few and meaningful. Useful fields include the source of the finding, the product or process affected, the requirement not met, and a significance rating. Each field should drive something in the workflow. If a rating does not change who is notified or how quickly containment must happen, it is decoration. Evaluate whether the software lets the workflow owner define the rating scale and attach rules to it, instead of fixing a scale that does not match your risk language.

Think about routing as well. The NIST procedure sends different situations down different paths: some are resolved by notifying the client and documenting the result, while others, such as equipment malfunction, stop work and proceed to corrective action. Your classification should support the same kind of branching. Findings that affect shipped product, safety, or a customer requirement deserve a faster path than a cosmetic deviation on internal scrap.

Use these checks when reviewing how a candidate system supports classification:

- **Confirmation step:** Can a reviewer reject a finding as not a true nonconformity, with a recorded reason, rather than deleting it?
- **Requirement field:** Is the requirement a required entry, and can it point to a controlled document?
- **Significance rules:** Can ratings trigger different notifications and deadlines?
- **Duplicates:** Can the system show earlier findings against the same part, process, or requirement before a new one is created?

**Illustrative example:** An inspector at the unnamed machining manufacturer measures a bracket with the hole position outside tolerance. Before raising a formal finding, the quality supervisor re-measures with a second gauge to confirm the deviation is real. The finding record cites the drawing revision as the requirement, attaches the measurement, and rates the finding high because shipped lots may be affected. The duplicate check shows two earlier findings against the same feature, which the supervisor links.

## Assigning immediate containment

Containment limits the effect of a finding while the cause is still unknown. It is separate from fixing the underlying problem, and it is often decided in a hurry. A workflow earns its keep when it makes containment fast, assigned, and recorded.

The ISO and IAF paper on [reviewing and closing nonconformities](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ReviewNonconformity.pdf) describes the organization's response as having three parts: correction, analysis of cause, and corrective action. The paper also says correction or corrective action alone may be sufficient in some cases. It is written for ISO 9001:2015 auditors, but the lesson carries over: containment is the step that protects customers and operations without committing to a fix that might address the wrong thing.

Decide what containment can include in your plant, then make the choices visible in the workflow. Typical actions are placing suspect stock on hold, stopping a machine or line, sorting or re-inspecting a lot, recalling shipped product, and notifying a customer. Each action needs an owner with the authority to carry it out. A quality technician can tag stock but may not be able to stop a production line, and the workflow should show who holds that authority at each hour of each shift.

Time matters, so evaluate how the software supports speed. Ask whether [containment tasks](/solutions/nonconformance-capa/) can be created from templates, whether the right people are notified at once, and whether an unacknowledged task escalates. Ask also whether the system can start containment before the full finding record is complete, since the inspector may need to act while still gathering details.

The NIST procedure illustrates how situations call for different immediate responses. When calibration equipment or software malfunctions, the instructions say to stop all calibration work and proceed to corrective action. Where the client chooses to accept nonconforming work, that acceptance must be in writing and placed in the client's file. Both examples show containment as a set of recorded decisions and notifications, not just physical actions.

Containment decisions to configure and test include these:

1. **Scope:** Which lots, serial numbers, machines, shifts, or suppliers are suspect, and how was that boundary chosen?
2. **Action:** What is held, stopped, sorted, or recalled, and who authorized it?
3. **Notification:** Which internal roles and which customers or suppliers must be informed, and by when?
4. **Release:** What evidence is needed before held product is released or work resumes?

**Illustrative example:** After confirming the bracket finding, the unnamed manufacturer's quality supervisor opens the containment task. The production supervisor places all brackets from the affected machine since the last good inspection on hold, and the quality supervisor records the boundary and the reason for it. The system notifies the plant manager because the rating is high. Shipped lots are flagged for a customer notification decision that the plant manager must make and record that day.

## Linking affected records

A finding touches more than itself. It involves a part, a lot, a work order, a machine, an inspection record, a supplier, perhaps a customer order, and a controlled document. The ability to link these records is what lets a team answer the questions that follow every finding: what else is affected, and what evidence shows it?

Start from the requirement field. If the finding cites a drawing or work instruction, the link should lead to the controlled version in force at the time. Linking to a document without regard to revision creates a record that quietly changes meaning when the document is updated. Ask vendors how links behave when a linked document is revised or retired, and whether the finding keeps a pointer to the specific revision.

The NIST [nonconformance procedure](https://www.nist.gov/document/guide07v211pdf) shows the habit in practice: client acceptance of nonconforming work is placed in the client's file, so the decision stays tied to the affected work. Linking supports scope decisions during containment. Suppose the suspect lot also used material from a particular supplier lot. A system that connects the finding to receiving records lets the team check whether other products used the same material. In the ISO and IAF paper on [reviewing and closing nonconformities](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ReviewNonconformity.pdf), the observation that cause analysis may identify potential nonconformities in other areas of the organization applies here. Links make that wider look practical. Without them, the team relies on memory and informal searches.

Links should work in both directions. From the finding, a user should reach the affected records. From the affected record, such as a work order or inspection result, a user should see the findings tied to it. This reverse view tells an inspector at the next station that a lot is on hold, and it tells an auditor which findings relate to a given process.

Be realistic about integration. Many plants keep production, inspection, and supplier data in different systems. Decide which links must be live connections and which can be manual references, such as a lot number typed into a field. Manual references are acceptable if they are required and validated, but they are more fragile. Ask what the product can connect to today, and rely on demonstrations rather than roadmap statements.

Consider also what links do to access. A finding linked to customer drawings, supplier pricing, or personnel records brings those sensitivities along. Confirm that the permissions on linked records still apply when viewed through the finding.

**Illustrative example:** In the unnamed manufacturer's workflow, the bracket finding links to the drawing revision, the work orders for the affected period, the inspection records, and the receiving record for the bar stock. When the quality supervisor opens the stock record, the system shows a second work order that used the same material. That work order is added to the containment scope the same afternoon, before any parts from it are shipped.

## Checking containment evidence

Containment that is not evidenced is only a claim. Someone should be able to show, after the fact, that suspect product was isolated, that the right people were told, and that nothing left the building that should not have. The workflow should collect that proof as part of the work, rather than expecting someone to assemble it before an audit.

The ISO and IAF [closing guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ReviewNonconformity.pdf) sets a clear expectation. Before agreeing to close a nonconformity, an auditor should review what the organization did about containment, correction, cause analysis, and the results of corrective action, and should see objective evidence, including supporting documentation, for the action. That is guidance for audit findings under ISO 9001:2015, but the same logic suits internal findings: containment is part of the story that has to be told when a finding is closed. Software that records containment in a free-text comment makes that story harder to tell.

Specify what evidence a containment action should leave behind. Examples include a hold record with quantities and locations, a count or sort result, a photograph of segregated stock, a customer notification and its acknowledgment, and a release decision with the name of the person who made it. Each should be attached to the action, dated, and attributable. The system should also make gaps visible, for example, by showing a containment task marked complete without any attachment or by flagging held stock with no release decision.

Review the evidence at defined points. The first is when containment is declared complete, and the reviewer should be someone other than the person who performed it. The second is at the point of cause analysis, when the team confirms that the containment boundary still matches what the investigation learns. If the cause turns out to be wider than assumed, containment must grow, and the workflow should make that easy and record the change.

Evaluate how the software handles incomplete or late evidence. Ask whether it can block the next stage until containment evidence is present, or whether it only warns. A block is stricter and may frustrate staff during urgent events, so decide the rule deliberately and allow a documented override with a reason and an approver.

Lastly, plan for release. Held product needs a defined path back into use, rework, or scrap, and each path needs its own record. A hold that is never formally released clutters the shop floor and the data, and an informal release undermines the whole control.

**Illustrative example:** For the bracket finding, the unnamed manufacturer's containment task shows a hold record, a sort result listing the brackets measured, and a note that shipped lots are subject to a customer decision. The plant manager, not the production supervisor, reviews the evidence and marks containment complete. Three days later, the investigation finds the problem began earlier than assumed, and the quality supervisor extends the containment boundary, with the change recorded and dated.
