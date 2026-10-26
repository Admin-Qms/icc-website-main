---
slug: mapping-workflows
title: 'Mapping the current workflow: Supplier quality management software'
description: >-
  Mapping the current workflow in supplier quality software: define the
  operational problem; identify records and handoffs; assign owners and
  decisions.
primaryKeyword: supplier quality software
keywords:
  - supplier quality software mapping the current workflow
  - supplier quality software
  - supplier approval
  - supplier corrective actions
author: ISO Certification Consultants Editorial Team
date: '2026-10-26'
imageBrief: >-
  a fabrication inspector tracing a paper work instruction at a cutting station;
  authentic manufacturing environment, no readable text or logos
sourceIds:
  - apg-external-providers
  - icc-supplier-quality-module
capabilityIds: []
wordCount: 2184
readTime: 11
image:
  src: /images/guides/supplier-quality-software/mapping-workflows.webp
  alt: >-
    a fabrication inspector tracing a paper work instruction at a cutting
    station; authentic manufacturing environment, no readable text or logos
  width: 1200
  height: 675
  source: gemini
  sourceId: 50bdfc1c07909f87bc5e7bdd1393b1321ff19e4a7d5386098bdc7e91d97574ee
  sha256: 50bdfc1c07909f87bc5e7bdd1393b1321ff19e4a7d5386098bdc7e91d97574ee
  licenseUrl: 'https://ai.google.dev/gemini-api/terms'
---
## Defining the operational problem across qualification, receiving, and corrective actions

Most supplier quality problems do not start at the supplier. They start in the gaps between three activities that different people own: deciding who may supply, checking what arrives, and chasing what went wrong. Qualification usually lives with purchasing and quality. Receiving inspection lives at the dock. Corrective action requests live in an inbox or a spreadsheet. When each activity keeps its own records, a rejected lot at the dock does not change what purchasing sees on the approved list, and an open corrective action does not slow the next purchase order.

Before comparing any software, write down that gap in plain terms. The ISO and IAF Auditing Practices Group paper on [external providers](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) gives a useful frame. It says an auditor may find it sufficient to check that a list of approved external providers exists and is kept up to date, that orders went to providers who met the defined criteria, that outsourced-process providers are monitored, and that the activities needed to meet requirements were carried out. It then adds that this may not be enough to show that what arrives meets specifications, and that a review of the wider procurement, outsourcing and supply chain processes is preferable. The paper was written for ISO 9001:2015 auditors and carries a disclaimer that it has not been endorsed by ISO, ISO/TC 176 or IAF, so treat it as guidance on what a reasonable review looks at, not as a statement of the current edition.

That second point is the operational problem in one sentence: a list is a record, not a control. A workable description of the problem names three things.

- **Where evidence is disconnected.** List every place where a supplier fact is stored, such as the approved list, the receiving log, the corrective action tracker and the supplier folders, and note which of them can be updated without the others knowing.
- **Where a decision waits for a person.** Note each point where a nonconformance sits until someone remembers to change a supplier's status, place a hold or ask for a response.
- **Where the history cannot be rebuilt.** Identify the questions that take hours to answer, such as which lots came from a supplier during an open corrective action.

The ICC page for the [Supplier Quality module](https://isocertificationconsultants.ca/solutions/supplier-quality/) describes the same set of topics: onboarding through approval gates, scorecards, corrective action requests raised from nonconformances, and scheduled supplier audits. Treat that page as a list of questions to bring to a demonstration. The capability register for the supplier portal is still pending, so none of it is a verified promise in this guide, and every item should be confirmed against the software as offered and configured.

| Activity | Typical owner | Where records live today | Question to answer in the map |
| :--- | :--- | :--- | :--- |
| Qualification | Purchasing and quality | Approved list, certificates in folders | Who can change a supplier's status, and on what evidence? |
| Receiving | Receiving inspector | Paper slips, inspection log | Does a rejected lot reach anyone who can act on the supplier? |
| Corrective action | Supplier quality engineer | Email, spreadsheet | Who sees an open request when a purchase order is released? |

The quality assurance manager usually leads this work, starting from current flowcharts, vendor incident logs and receiving nonconformance slips. The decision is whether the handoffs justify an integrated workflow, and the record is a short gap assessment. If historical traceability is missing, the exception is a manual hold at receiving until the gaps close.

**Illustrative example:** An unnamed Canadian machinery manufacturer traces one fabricated bracket that failed at the dock. The paper inspection sheet went into a binder, purchasing placed the next purchase order the same week, and the supplier's status on the approved list did not change. The map shows three separate records for one event and no step where anyone connects them. That finding becomes the problem statement for the software evaluation.

## Identifying records and cross-departmental handoffs between purchasing and quality

The word "supplier" hides a range of relationships. The same [Auditing Practices Group paper](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) notes that external providers can be a supplier, a partner, a sister or parent organization, or even a customer. In a plant, that means material distributors, machine shops, plating or heat treatment contractors and sister plants, so the map should list provider types before it lists forms.

The paper also points out that procurement starts earlier than most teams assume. It begins during design and development, when a specification is prepared. The organization should make sure the purchase requirements are correct before they go to the provider, and that statutory and regulatory requirements are included. This matters for software because the strongest link in a [supplier quality system](/solutions/supplier-quality/) is the one between the purchase order and the specification it is meant to enforce.

Walk one real order from requisition to receipt and record every handoff. The following sequence is a useful template.

1. **Engineering releases a specification.** Note the drawing number, revision, material callout and acceptance standard that the supplier must see.
2. **Purchasing prepares the order.** Check that the requirement on the order matches the design or customer specification, a check the paper lists among its practical suggestions.
3. **Quality reviews risk.** Record whether the component is critical and what inspection or documents it requires.
4. **The supplier confirms.** Capture whether the supplier acknowledged the revision and any deviation requests.
5. **Receiving verifies.** Record what was checked against which revision and who accepted or rejected the lot.

Each step produces a record, and most teams find that two or three are informal. A mapping exercise exposes those cases without software and prevents automating a handoff that was never reliable.

The procurement lead owns this part of the map and decides whether each order carries the verified drawing number, acceptance standard and statutory clauses. The record is an order specification package with engineering sign-off, and a mismatch between model and requisition halts release.

> **Important:** The Auditing Practices Group paper asks whether the specification was approved before the order was confirmed to the provider and whether the order refers to statutory or regulatory requirements. Software that cannot show those two facts on the order record leaves the handoff undocumented.

When you evaluate candidates later, ask whether the software can attach the engineering specification to the purchasing record and require sign-off from engineering, purchasing and quality before an order leaves. Those are evaluation criteria, not product claims.

**Illustrative example:** A hypothetical team follows a revised drawing with tighter flatness limits to an outsourced plating provider. Engineering updated the drawing, but the purchase order still cited the earlier revision, and the provider confirmed the order without noticing. Mapping the handoff shows no step where the revision number is checked against the order, which becomes a requirement for the software evaluation.

## Assigning decision ownership and approval thresholds across the supply chain

A map of records is only half the picture. The other half is who may decide. Many supplier systems fail because everyone can edit the approved list, or because only one overloaded person can. The map should state, for every status change, who has authority to add a supplier, suspend one, or reinstate one, and which evidence they must see.

The [Auditing Practices Group paper](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) raises the question that makes this concrete. It asks whether providers of critical components or services are selected only on their ability to supply at an economical price, or whether their ability to supply consistently to specification is also considered. A purchasing manager alone cannot answer that question for a critical casting. The map should therefore separate commercial approval from technical approval, and record both.

Set decision authority in layers rather than listing names. A reasonable pattern uses three levels.

- **Routine suppliers of standard items.** A supplier quality engineer can approve after reviewing a questionnaire and certificate scope, with no further sign-off.
- **Suppliers of critical components.** Quality and engineering both approve, and the evidence should include a technical capability review, not just commercial terms.
- **Outsourced special processes.** The director of quality and compliance approves, because the output cannot be fully verified by inspection after the fact.

The paper also cautions against approving providers solely because they hold registration to a recognized quality standard. It suggests that the scope of that registration be reviewed. For the map, that means the approval record should say which scope was checked, not merely that a certificate is on file. It adds that auditing the intended provider can be advantageous to establish clear lines of communication, specifications and delivery parameters, so record who decides when an on-site or remote audit is needed.

| Decision | Who decides | Evidence required | Review interval |
| :--- | :--- | :--- | :--- |
| Add a standard-item supplier | Supplier quality engineer | Questionnaire, certificate with scope reviewed | Set by risk level |
| Add a critical-component supplier | Quality and engineering | Capability review, audit or sample approval | Shorter than routine |
| Suspend a supplier | Director of quality and compliance | Open corrective action or audit result | Until reinstated |
| Reinstate a supplier | Same role that suspended | Verified corrective action | Re-evaluate after return |

The record for each decision is an authorization entry with a review interval. If a critical supplier was chosen on price alone, the exception is an executive risk escalation rather than a quiet approval.

Automated suggestions deserve their own rule. The ICC product page states that AI outputs are suggestions a person reviews before they enter a controlled record. Whether the software you evaluate behaves that way is a question for the demonstration, and the map should already state the policy: **an automated risk summary or recommended status is a draft until an authorized person accepts it.** Define that acceptance step now, along with the role allowed to give it.

**Illustrative example:** An unnamed plant sets dual approval for structural castings, requiring both quality engineering and plant management to sign. During mapping, the team finds that purchasing can add a casting supplier by email request to an administrator, bypassing both approvals. The software requirement becomes role-based control over status changes, tested with a trial change request.

## Setting risk-based acceptance criteria for externally provided processes and materials

The final part of the map defines what acceptance means for each type of purchase. The [Auditing Practices Group paper](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) says auditors have to verify that risk-based thinking has been applied in determining appropriate controls over external providers. It also says the degree of risk associated with a component, product or part of a service, and the controls needed to ensure it meets the design specification, should be assessed. That assessment belongs in the map, because it determines how much inspection each purchase receives.

Start with a simple classification. A product risk matrix places each part or service into a level based on what a failure would do to the end product, to safety and to compliance. A fastener used in a guard may rank lower than a pressure-bearing weld. Canadian and provincial requirements may apply to some products, such as pressure equipment, so the matrix should note where a statute or regulation shapes acceptance. Do not guess at specific regulatory clauses; ask the regulatory owner to confirm which ones apply and include them in the purchase requirements, as the paper advises.

For each level, define the acceptance elements in writing. Four elements cover most manufacturing cases.

- **Inspection level and sampling.** State whether the part gets full inspection, a defined sample, or a certificate review only, and who may change that level.
- **First-article requirements.** Say which parts need a first-article inspection before production lots are accepted, and what triggers a repeat.
- **Material documentation.** List the documents that must accompany material, such as mill test reports, and who checks them against the specification.
- **Process controls for outsourced work.** For special processes, state what evidence is required from the provider and how performance will be monitored.

The supplier quality engineer owns this work and records a component inspection plan linked to the part and the provider. When a high-risk structural component has no impact-test criteria defined, the exception is an engineering revision, not a lower inspection level.

The paper offers a few indicators that fit this stage because they reveal whether acceptance criteria are real. It asks how often credit notes are raised for products initially rejected but later accepted, and how many concessions allow acceptance of previously rejected products. A high number of either suggests that criteria are being bent at the dock. Decide now how those events will be counted, because the software will need a place to record them.

When you evaluate software, test whether inspection criteria can differ by risk level and by part, and whether it can require specific compliance documents before material is released.

**Illustrative example:** A hypothetical equipment builder assigns full inspection to high-pressure hydraulic manifolds and reduced sampling to standard hardware. It requires mill test reports for structural plate and a first-article report for every new fixture-cut bracket. The resulting table of risk level, inspection level and required documents becomes the acceptance requirement that every candidate system is asked to represent.

The output of this chapter is a one-page workflow map with owners, records, thresholds and acceptance criteria. The next chapter turns it into a shortlist and a demonstration plan.
