---
slug: 'supplier-actions'
title: 'Following supplier corrective actions: Supplier quality management software'
description: 'Following supplier corrective actions in supplier quality software: describing the supplier finding and requesting supporting evidence.'
primaryKeyword: 'supplier quality software'
keywords:
  - 'supplier quality software following supplier corrective actions'
  - 'supplier quality software'
  - 'supplier approval'
  - 'supplier corrective actions'
author: 'ISO Certification Consultants Editorial Team'
date: '2026-10-26'
imageBrief: 'a line operator scanning an approved instruction beside a guarded press; authentic manufacturing environment, no readable text or logos'
sourceIds:
  - icc-supplier-quality-module
  - apg-external-providers
capabilityIds: []
---
## Triggering SCARs directly from receiving and in-process nonconformance records

A supplier corrective action request is only as good as the facts it carries. When the request is typed from memory into a form days after the event, the supplier receives a vague complaint and responds with a vague answer. The remedy is to create the request from the nonconformance record itself, so the evidence travels with it.

The ISO and IAF [external providers guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) does not describe a corrective action form, but its concern is relevant. It notes that checking an approved list and a few controls may not be sufficient to show that purchased products meet their specifications, and that a wider review of the supply chain may be preferable. A repeated defect from the same source is exactly the situation where a one-off return does not address the cause. A SCAR is the formal way to ask the supplier to find and remove it.

Not every rejection deserves one, and a system that issues requests for every minor defect trains suppliers to ignore them. A single low-severity defect that the supplier replaces without argument may be handled through the normal return. The decision belongs to the [supplier quality](/solutions/supplier-quality/) engineer, who looks at severity, recurrence and the part's risk tier. Consistency matters for fairness between suppliers as well as for workload. Write the thresholds down: what severity always triggers a SCAR, how many repeats of the same defect within a period trigger one, and which characteristics are always escalated.

The initiating package should carry the following without re-keying:

- **Defect description and code.** The characteristic, the requirement and the measured result, using the same codes that receiving uses.
- **Evidence.** Photographs, measurement logs and the inspection record that proved the nonconformance.
- **Scope of the problem.** Rejected quantity, lots and purchase order lines affected, and whether suspect material may already be in production.
- **Response requirements.** The date by which containment, root cause and a corrective action plan are due.

The engineer works from the verified nonconformance, the photographs, the dimensional log and the order details. The decision is whether severity or trend warrants a formal request. The record is the SCAR, pre-populated with those details, a classification and response deadlines. The routine exception is the isolated low-severity case that is closed by replacement, and the log should show that the engineer considered a SCAR and decided against it.

For evaluation, ask the vendor to create a complete SCAR from an open nonconformance in front of you, without copying anything by hand. Check whether the system notifies the supplier and tracks response due dates against the terms in your supplier agreement. The [Supplier Quality module page](https://isocertificationconsultants.ca/solutions/supplier-quality/) describes a SCAR raised from a nonconformance and sent to the supplier. Confirm that behavior with your own records, as it is a description and not a verified commitment.

| Check | Pass condition |
| :--- | :--- |
| SCAR created from a nonconformance | Defect details, evidence and quantities carry over |
| Severity and recurrence rules | Thresholds produce a suggestion that a person confirms |
| Due dates | Response dates are set and tracked from issue |
| Link back | Nonconformance shows the SCAR and its status |

**Illustrative example:** A hypothetical engineer finds three consecutive dimensional rejections of a stamped bracket in the receiving log. The software offers to raise a SCAR from the latest rejection and lists the earlier two as related records. The engineer accepts, adds a severity rating, and the supplier receives one request that shows the whole pattern.

## Capturing supplier root-cause analysis and objective containment evidence

The supplier's first response should answer three separate questions. What was done to protect your plant and its other customers right now? Why did the defect happen? What will prevent it from happening again? Mixing them is the commonest reason responses are weak. A containment report with no cause analysis leaves the problem open, and a cause analysis with no containment leaves suspect material in circulation.

Ask for disciplined methods without prescribing a single one. A structured eight-discipline report, a 5-Why chain, a cause-and-effect diagram or a process analysis can each work if the analysis reaches a system cause and shows evidence. The coordinator who reviews the response sees supplier reports, sort sheets, containment records and tracking for replacement shipments. The decision is whether containment and the proposed cause are technically credible. The record is a review that accepts the response or rejects it, with reasons. A cause stated as "operator error" with no process explanation is the typical exception, and it should lead to rejection and a request for deeper analysis.

Containment evidence should be objective. Sorting results, counts, lot identification of cleared stock, and proof that goods in transit and at the supplier's other locations were checked all qualify. A statement that stock was checked does not. The [ICC product page](https://isocertificationconsultants.ca/solutions/supplier-quality/) lists suppliers answering SCARs and other tasks from an inbox in a portal. The capability register entry for supplier portal tasks is pending, so that functionality must be confirmed in a demonstration before anyone relies on it. A company can still run the same discipline without a portal if the software lets staff enter the supplier's response on its behalf, attach the supplier's own report and keep the original document.

Test the following during evaluation:

1. **Response channel.** Establish whether suppliers respond in a live portal, by email that staff transcribe, or both, and how each is recorded.
2. **Structured fields.** Confirm there are fields for containment, cause and corrective action, so reviewers are not reading unstructured text.
3. **Attachments.** Check that supplier reports, photographs and certificates can be attached to the SCAR and remain linked.
4. **Rejection and resubmission.** Reject a weak response and confirm the supplier is asked to resubmit, with both versions retained.
5. **Overdue handling.** Let a due date pass and check who is alerted.

> **Important:** The root-cause review is a technical judgment. A system can organize the evidence, but a qualified person decides whether the explanation is credible for that process.

Think about confidentiality too. If suppliers can reach a portal, ask how access is limited so each supplier sees only its own requests. If the supplier cannot reach the system, ask how you protect the evidence you send out and receive. Either way, the files should be stored with the SCAR so the history survives staff changes.

**Illustrative example:** A hypothetical coordinator rejects an outsourced coater's first response because the containment plan covered stock on site but not parcels already shipped to the customer's second plant. The coordinator records the reason, requests a revised plan, and keeps the first response for the history.

## Reviewing proposed corrective actions and human review of automated summaries

Once the cause is accepted, the supplier proposes permanent changes: a tooling modification, an updated control plan, a revised work instruction or a retrained team. Reviewing these is different from reviewing the cause. The question is whether the proposed action removes the accepted cause and whether it can be verified.

The quality assurance manager typically approves. The inputs are the supplier's proposed actions, any updated process failure mode analysis, revised work instructions and, where the software provides one, an automated summary of the response. The decision is to approve the plan or require revision and resubmission. The record is an approval with the reviewer's comments and the verification milestones. A common exception is a proposed tooling change that, under your customer contract, requires the customer's engineering change approval before the supplier may implement it. The review should check this, and the plan should not proceed until it is cleared.

Automated summaries deserve special handling here because reviewers are tempted to read the summary instead of the response. The ICC product page states that each AI output is a suggestion that a person reviews before it enters a controlled record. Use that as a standard when you ask any vendor how summaries work. The summary may help a busy reviewer find the main points, but the approval must rest on the underlying response. Require that the reviewer opens the source document, that the summary is never stored as the approval itself and that every approval carries the reviewer's identity.

> **Key Consideration:** If the software summarizes a supplier response, test it with a response that contains a deliberate gap, such as a missing containment step. A useful summary shows the gap, and a poor one smooths it over.

The [external providers guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) says auditors have to verify that risk-based thinking was applied in determining controls over external providers. For corrective action review, that means the depth of review should match the risk of the part. A cosmetic defect on a catalog item and a weld defect on a pressure component should not get the same scrutiny.

Evaluate the approval trail with these checks:

- **Reviewer accountability.** The record shows who approved, when and against which version of the supplier's plan.
- **Version control.** If the supplier revises the plan, the earlier version stays retrievable.
- **Milestones.** Approval creates dated verification tasks, so the plan does not end at signature.
- **Manual approval for summaries.** An automated summary cannot be approved on its own, and the audit log shows the human decision.

**Illustrative example:** A hypothetical quality manager reads an AI-generated summary of a vendor's revised CNC program changes. The summary mentions an updated offset routine but not the changed fixture. The manager opens the vendor's document, finds the fixture change, and requests a second-article check before approving.

## Verifying corrective action effectiveness and recurrence prevention

A corrective action is not complete when the supplier says it is implemented. It is complete when your own evidence shows the problem has not come back. Closing at implementation is the commonest cause of repeat SCARs.

Define the proof before the supplier starts. Typical forms are enhanced sampling on the next several receipts, review of process capability data, a follow-up audit of the changed process, or a defined observation period. The right form depends on the defect. A dimensional defect may be proven by measured results over consecutive lots. A process change at a special process supplier may need an on-site visit.

The supplier quality engineer owns the verification. The inputs are receiving inspection logs for later lots, capability data and audit check sheets. The decision is whether the action has prevented recurrence over the agreed period. A plant might choose a 90-day window or a number of receipts, whichever suits its volume and risk. The record is a closure entry signed by quality with the effectiveness data attached. If the defect returns during monitoring, the exception is that the SCAR reopens and the supplier's standing is reviewed.

Ask the software to demonstrate these controls:

1. **Scheduled verification.** Closing the action plan creates follow-up tasks triggered by elapsed time or by received lot counts.
2. **Enhanced sampling.** The receiving screen shows the extra inspection required for the next lots from that supplier.
3. **Closure block.** A SCAR cannot close while verification tasks are open or a recurrence has been logged.
4. **Reopening.** A repeat defect reopens the original SCAR, instead of silently creating an unrelated one.
5. **History.** Closed SCARs keep every response, review, evidence file and decision for later audits.

The [ICC product page](https://isocertificationconsultants.ca/solutions/supplier-quality/) describes closure decisions among the SCAR records an auditor can see. Treat the statement as something to verify with your own closed examples, since the related capability is pending. Ask also whether the closure screen shows the original defect, the accepted cause and the proof side by side, so the closing reviewer does not need to hunt through attachments. Check how long records are retained and whether a former supplier's history remains accessible after the relationship ends.

> **Did You Know?** The external providers guidance treats the frequency of rejected items later accepted as an indicator of control. Closing SCARs on evidence, not on assertion, keeps that indicator honest.

**Illustrative example:** A hypothetical quality engineer monitors five consecutive receipts of modified wire harnesses over three months before closing the SCAR. The fourth receipt shows a marginal crimp pull result, so the engineer extends the monitoring by two receipts and documents why. Closure follows only when all seven are within limits.

The next chapter takes the outputs of receiving, SCARs and audits and turns them into supplier performance reviews.
