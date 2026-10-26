---
slug: supplier-qualification
title: 'Qualifying and approving suppliers: Supplier quality management software'
description: >-
  Qualifying and approving suppliers in supplier quality software: defining
  supplier risk, collecting qualification evidence and assigning approval
  authority.
primaryKeyword: supplier quality software
keywords:
  - supplier quality software qualifying and approving suppliers
  - supplier quality software
  - supplier approval
  - supplier corrective actions
author: ISO Certification Consultants Editorial Team
date: '2026-10-26'
imageBrief: >-
  a production operator completing a controlled checklist at an assembly
  station; authentic manufacturing environment, no readable text or logos
sourceIds:
  - apg-external-providers
  - icc-supplier-quality-module
capabilityIds: []
---
## Defining supplier risk tiers and criticality beyond commercial pricing

Qualification effort should follow risk, not habit. A plant that sends the same questionnaire to a stationery vendor and to the sole source of a structural casting spends too much on one and too little on the other. The first design decision in any [supplier quality system](/solutions/supplier-quality/) is therefore the tier: a small set of levels that tells everyone how much evidence a supplier must provide before it receives a purchase order.

The ISO and IAF [external providers guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) puts the question plainly. Providers of critical components or services should be considered for their ability to supply consistently to specification, and not selected only because they can supply at an economical price. The paper is auditor guidance written for ISO 9001:2015, so it shows what a reviewer may ask rather than prescribing a method, but the question applies to any tiering scheme.

Build tiers from three factors that your risk matrix already holds.

- **Product consequence.** What happens to safety, function or compliance if the item fails, and can the failure be found by inspection at receiving?
- **Process dependence.** Does the provider perform a process, such as heat treatment, whose result cannot be fully verified afterward?
- **Supply exposure.** Is the provider a sole source, a long lead-time source or a single point of failure for a family of parts?

A supplier quality specialist normally assigns the tier from the vendor application, a capability survey, the part's risk classification and any financial stability information the company collects. The decision sets the tier and the mandatory qualification evidence for it. The record is a supplier risk assessment held in the quality database. A sole-source supplier of a critical structural component should land in the highest tier and trigger an on-site audit requirement.

| Tier | Typical scope | Minimum qualification evidence |
| :--- | :--- | :--- |
| 1 Critical | Structural parts, special processes, sole sources | Capability review, on-site or remote audit, certificate scope check, first-article approval |
| 2 Important | Functional parts with inspectable features | Questionnaire, certificate review, sample or first-article approval |
| 3 Standard | Catalog items and commodities | Basic registration, supplier agreement, receiving checks |

For software, the evaluation question is whether the tier drives the workflow. Check that you can define your own risk categories and link a part's risk to the supplier's profile. Then confirm that assigning a high tier automatically adds the deliverables for that tier, such as an audit task, rather than relying on a person to remember them. The [Supplier Quality module page](https://isocertificationconsultants.ca/solutions/supplier-quality/) describes onboarding through approval gates, and this guide treats that description as a question to test against your tiers in a demonstration.

**Illustrative example:** A hypothetical team classifies an outsourced heat treater as Tier 1 because the result cannot be fully inspected afterward. The tier requires a review of furnace survey records before any purchase order is released, and the buyer sees that requirement on the supplier record.

## Capturing qualification evidence and evaluating standard certification scopes

Evidence is what turns a qualification from an opinion into a record. A useful checklist separates what the supplier says about itself from what your people verified.

The [external providers guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) warns against placing providers on an approved list solely because they hold registration to a recognized quality standard. It suggests asking whether the scope of that registration was reviewed. That distinction affects how software should capture a certificate. A file attached to a record proves a document exists. A reviewed certificate proves someone read the scope statement, compared it with the contracted work and wrote down the result.

The quality assurance coordinator usually performs this review. Inputs include ISO 9001 certificates and their scope statements, welding procedure qualifications, insurance certificates and, where they apply, Canadian regulatory registrations. The decision is whether the certified scope covers the services you buy. The record is a validation entry with the verified expiry date and a note on the scope. The classic exception is a certificate that covers distribution only, while the contracted work is precision machining. In that case, the certificate does not support the approval, and the record should say so.

Capture evidence in a consistent structure so that anyone can read it later.

1. **Document type and issuer.** Record what the document is and who issued it, such as the certification body or the testing authority.
2. **Scope text.** Copy or attach the scope wording and note the matching purchased service.
3. **Validity dates.** Enter the issue and expiry dates as data, not only as a file name.
4. **Reviewer and date.** Record who verified the content and when.
5. **Result.** State whether it supports the approval, supports it with limits, or does not.

> **Important:** Treat a certificate as evidence of scope, not as approval. The auditor guidance expects an organization to know what the registration covers, and the record should show that someone checked.

Keep the structure short enough that reviewers actually complete it under time pressure. A form that takes an hour per certificate will be skipped on busy days, and a skipped check leaves no evidence at all. Then evaluate the software against the same list. Ask for a demonstration of how expiry dates are tracked and how administrators are alerted before a lapse. Ask whether the qualification workflow forces the reviewer to confirm the scope text before the approval can proceed, rather than allowing an upload to count as a review. Check whether the same document can be attached once and used for several parts without losing its review status.

The ICC product page lists tracking of qualification status and document expiry dates among the topics the supplier module covers. Because the related capability entry is pending, treat the point as a demonstration question, and test it with certificates from your own suppliers.

**Illustrative example:** A hypothetical coordinator reads a supplier's quality certificate and finds that design is excluded from the scope. The supplier machines to the buyer's drawings, so the exclusion does not affect the order, but the note prompts the team to confirm that no design responsibility is assumed. The coordinator records the check and its conclusion.

## Structuring multi-tiered approval authority and qualification gates

A gate is a point where work stops until the right people sign. Without gates, qualification becomes a set of parallel activities that no one finishes, and a supplier receives its first order because the buyer was in a hurry. The previous chapter assigned decision rights to roles. This section turns them into a sequence.

Design the gates to match the tier. A common pattern uses a technical evaluation, a commercial review and a final quality decision, each by a different function, so that no single person can approve a supplier alone. Engineering confirms the supplier can meet the specification. Purchasing confirms commercial terms and the supplier agreement. Quality confirms evidence and risk. The quality director gives the final approval from the completed technical evaluation, the audit findings and the commercial review. The record is a controlled approved supplier list entry that shows each signature and the approval date. When engineering sign-off is missing, the package cannot move to the active register.

A status vocabulary keeps the gates visible. Four statuses cover most cases.

| Status | Meaning | Purchasing effect |
| :--- | :--- | :--- |
| In review | Qualification started, gates open | No production orders |
| Approved | All gates signed for named scope | Orders allowed within scope |
| Conditional | Limited approval with expiry or lot limit | Orders allowed under stated conditions |
| Suspended | Approval withdrawn pending action | No new orders |

The [Supplier Quality page](https://isocertificationconsultants.ca/solutions/supplier-quality/) describes supplier onboarding that moves through approval gates. Confirm that behavior against your own design. The critical test is the link to purchasing: can an order be confirmed for a supplier whose gates are incomplete? If the software only displays status but does not stop the order, the control depends on people noticing, which is the situation you are trying to leave.

Also test visibility. The status should appear wherever a buyer, an inspector or an engineer makes a decision, not only on the supplier master screen. A receiving inspector who sees "Conditional" on the inspection screen knows to apply the extra checks that condition requires.

> **Key Consideration:** Define what "approved" covers. Approval for machining carbon steel brackets does not approve the same supplier for plating or for stainless fabrication. Record scope on the approval, and ask how the software stores it.

The external providers guidance also notes that auditing an intended provider can establish clear lines of communication, specifications and delivery parameters. Where your tier requires an audit, make it a gate with its own task, due date and owner, so the approval cannot be signed while the audit is open.

**Illustrative example:** A hypothetical manufacturer configures three sequential approvals for its highest tier: quality engineering, then procurement, then operations. During a trial, an administrator tries to skip the second approval for an urgent supplier, and the system holds the record in review. The team keeps that test as a standard acceptance case.

## Managing conditional approvals, document expiries, and temporary waivers

Real operations cannot wait for every supplier to finish qualification. A line is down, a primary source has failed, and an alternate supplier needs to ship something this month. A conditional approval lets the company act while keeping control, if it is limited, recorded and set to end.

The quality systems manager normally grants it. The inputs are the emergency requisition, a preliminary audit or evidence review and a plan to reduce the remaining risk. The decision limits the approval to a quantity or a window, for example, one purchase order or a short calendar period. The record is an authorization showing what is allowed, who approved it, the expiry date and the extra inspection that applies. If the date passes and open items remain, the exception is automatic suspension of the supplier, not a quiet extension.

Write the conditions as rules that the software can enforce.

- **Time or lot limit.** State the end date or the maximum quantity, and require a documented reason for any extension by an authorized technical authority.
- **Enhanced inspection.** Specify the receiving checks, such as inspecting every incoming lot, while the condition lasts.
- **Open actions.** List the qualification items still outstanding, such as an audit or a first-article submission, each with an owner and a date.
- **Escalation.** Name who is notified when the condition is within a defined period of expiry.

Document expiries need the same discipline. A supplier approved last year on a certificate that has since lapsed is, for practical purposes, no longer fully approved. Ask the vendor how it handles a lapse: whether the system alerts the owner before expiry, whether it changes the status on its own and whether it lets a buyer continue to order in the meantime. Compare each answer with your policy.

> **Did You Know?** The external providers guidance asks whether approved lists are reviewed at regular intervals, and then points out that a list review alone may not show effective control. A conditional approval that expires on its own is one way to show control between reviews.

Evaluation criteria for this part are straightforward to test. Confirm that conditional status ends automatically at the set date without manual intervention. Confirm that it forces the enhanced receiving inspection you defined, and that the inspector sees the requirement on the receiving screen. Confirm that any extension requires a named approver and a written justification, and that the history of extensions is visible on the supplier record. The supplier module description on the [ICC product page](https://isocertificationconsultants.ca/solutions/supplier-quality/) mentions qualification status and expiry tracking, and a trial using your sample dates is the way to verify it.

**Illustrative example:** A hypothetical plant grants an alternate stamping vendor a 45-day conditional approval while the final first-article package is pending. Every lot receives full inspection until the package is accepted. When the package arrives on day 40, the quality engineer converts the status to Approved, and the record keeps the conditional period for audit.

This chapter has set out how to tier suppliers, capture evidence, structure gates and control exceptions. The next chapter follows the material that arrives from approved and conditional suppliers and connects it to receiving inspection records.
