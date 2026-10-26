---
slug: receiving-controls
title: 'Connecting receiving inspection records: Supplier quality management software'
description: >-
  Connecting receiving inspection records in supplier quality software: linking
  orders and inspection records; defining acceptance criteria.
primaryKeyword: supplier quality software
keywords:
  - supplier quality software connecting receiving inspection records
  - supplier quality software
  - supplier approval
  - supplier corrective actions
author: ISO Certification Consultants Editorial Team
date: '2026-10-26'
imageBrief: >-
  two quality inspectors reviewing a weld inspection record beside a fabrication
  cell; authentic manufacturing environment, no readable text or logos
sourceIds:
  - apg-external-providers
  - icc-supplier-quality-module
capabilityIds: []
---
## Linking purchase orders, engineering revisions, and receiving inspection criteria

The dock is where a supplier's promise meets the real part. Everything agreed earlier, including the drawing, the revision and the approved scope, should be visible to the person who opens the box. In many plants it is not. The inspector sees a packing slip and a purchase order number, then walks to a drawing cabinet or asks an engineer which revision is current.

The ISO and IAF [external providers guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) lists practical checks that start before shipment: confirm that the specification quoted on a purchase order matches the design or customer specification, and check whether the order refers to statutory or regulatory requirements. Receiving is where those earlier checks either pay off or fail quietly, because a wrong revision on the order becomes a wrong part on the pallet.

Software should therefore present, on the receiving screen, the facts the inspector needs for that line item:

- **The confirmed purchase order line.** Part number, quantity, supplier and the revision the order cited.
- **The current controlled revision.** The latest released drawing, pulled from the controlled part record, so a mismatch is visible rather than discovered later. Retyped revision fields drift out of date quickly, and a stale field gives false assurance.
- **The inspection criteria.** The plan assigned to the part's risk level, with characteristics, methods and acceptance limits.
- **The supplier's standing.** Whether the delivering supplier is approved for this commodity, conditional or suspended.

The receiving inspector works from the bill of lading, the supplier packing slip, the purchase order lines and the active drawings. The decision at this step is simple and strict: does the arriving shipment match what was ordered and approved? The record is an electronic receiving log entry that ties the shipment to an internal lot number. The exception to design for is a mismatch, such as parts built to an older revision than the order requires, which should hold the intake until engineering and purchasing decide what to do.

Pay attention to supplier substitution. A purchase order may name an approved supplier while the goods ship from a different site or a sub-tier source. Ask whether the system compares the delivering source with the approved scope for that commodity and flags a difference when the receipt is entered, instead of leaving it to the inspector's memory.

> **Key Consideration:** Decide who may override a revision mismatch at the dock. If any inspector can accept a lot against the wrong revision with one click, the check exists on screen but not in practice. Reserve the override for engineering and record the reason.

For the evaluation, ask the vendor to show the receiving interface reading the active revision from the controlled part record, not from a field someone retypes. Then test a deliberate error: receive a shipment against an obsolete revision and an unapproved supplier, and watch what the screen does. The [Supplier Quality module page](https://isocertificationconsultants.ca/solutions/supplier-quality/) describes records connecting supplier approval to quality events. Verify any such link on your own data, because the supplier portal entry in the capability register is still pending.

**Illustrative example:** A hypothetical receiving dock scans an arriving shipment of laser-cut brackets. The packing slip carries an obsolete drawing revision, and the screen flags the difference against the current revision before any inspection starts. The inspector places the lot on hold, and engineering is notified.

## Defining sampling plans and executing receiving verification against specifications

Once the shipment matches the order, the inspector verifies the product. Chapter one set the principle that inspection effort follows risk. This section covers the execution: how the plan is configured, what the inspector records and how the result reaches the supplier's history.

Plans usually fall into three modes. Reduced sampling suits low-risk items from suppliers with a clean history. Normal sampling is the default. Full inspection applies to critical features, new suppliers, conditional approvals or items returning after a problem. The software should let a quality engineer assign a mode to a part and a supplier, and it should explain why a change happened. If a recent rejection moves a supplier from reduced to normal sampling, the system or a person should record the trigger.

Material documents are part of verification. A mill test report or certificate of conformance should be checked against the specification, and for regulated products, against the applicable Canadian requirements that the regulatory owner has identified. The [external providers guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) asks whether purchase orders include statutory and regulatory requirements; the receiving check closes that loop by confirming the delivered paperwork satisfies them.

The quality control inspector works with sample parts, calibrated measuring equipment, material test reports and inspection work instructions. The decision is whether dimensional, mechanical and material results meet the engineering acceptance criteria. The record is a completed receiving inspection report with the measured values and the attached material documents. If the material test report shows tensile strength below the minimum, the exception is quarantine, not a judgment call at the bench.

| Inspection element | What to record | Why it matters later |
| :--- | :--- | :--- |
| Characteristic and method | Name, gauge or method, limits | Defends the result in an audit |
| Sample size and basis | Plan used and reason | Explains reduced or full inspection |
| Measured values | Actual readings, not only pass or fail | Allows trend review |
| Documents checked | Report or certificate and reviewer | Links evidence to the lot |
| Disposition | Accept, reject or hold | Drives the supplier record |

When you evaluate software, look for enforcement more than for form fields. Ask whether a lot can be accepted while required measurements are blank, or whether mandatory fields block acceptance until they are complete. Ask whether the plan supports both attribute checks (conforms or not) and variable measurements, and whether you can reference a published sampling standard in the plan instead of retyping a table. Finally, confirm that a saved inspection result updates the supplier's history at once, since performance review depends on it. Also ask how a corrected result is handled: the original entry should remain visible with the correction, the reviewer and the reason, so an auditor can follow what the inspector first saw and what changed.

> **Key Consideration:** Record actual measurements for critical characteristics, not only pass or fail. Trend data shows a supplier drifting toward a limit long before a rejection happens.

**Illustrative example:** A hypothetical technician records hardness readings for a batch of fasteners and attaches the vendor laboratory certificate directly to the inspection record. The system will not close the inspection until both are present, so the lot cannot be released on a partial check.

## Quarantining nonconforming material and documenting technical concessions

A rejection only protects the plant if the material stops. The commonest weakness is physical: parts tagged as rejected sit near good stock, and a keen operator uses them. The second weakness is informational: the nonconformance is logged, but the inventory system still shows the lot as available.

Quarantine therefore has a physical part and a system part. Assign a controlled location, label the material, and set a status that prevents issue to production. Ask whether the software changes the status in your inventory or warehouse system as soon as a nonconformance is raised at receiving, or whether someone must make the change by hand. Where an integration is not available, document the manual step and the person who owns it.

The material review board lead handles what happens next, using the receiving nonconformance report, confirmation of the quarantine location and any concession request. The decision is the disposition: rework, return to the supplier, scrap or accept under a concession with technical justification. The record is a controlled nonconformance report with the board's authorization. A concession on a safety-critical dimension is the exception that needs the highest authority, which in many plants means engineering approval and notice to the customer under their contract.

The [external providers guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) offers a pointed indicator here. It asks how many concessions have been raised that allow acceptance of products or services that were initially rejected. A high count suggests either unrealistic specifications or weak supplier control, and either deserves attention. For software, that means concessions must be recorded as data with a reason, an approver and the lot affected, so they can be counted and reviewed.

Check these capabilities in the demonstration:

1. **Mandatory justification.** A concession cannot be saved without a technical reason and the named approvers for the part's risk level.
2. **Scope.** The concession applies to a defined lot or quantity and expires, rather than becoming a standing permission.
3. **Linkage.** The concession record links to the nonconformance, the supplier and the lots affected.
4. **Customer implications.** The workflow prompts a check of whether the customer contract requires notification or approval.
5. **Disposition block.** Material cannot be released from quarantine until a disposition is recorded.

> **Important:** Treat the concession count as a management signal. A supplier whose rejected lots are routinely accepted under concession is not being controlled, however clean its rejection rate looks.

**Illustrative example:** A hypothetical review board dispositions undersized aluminum tubing as return to vendor. The warehouse cannot release the lot until the vendor's return authorization is attached, and the record shows who made the decision and when.

## Tracking credit notes and maintaining end-to-end material traceability

Rejections have a commercial side. The supplier credits the invoice, replaces the goods or disputes the finding. If finance handles credit notes and quality handles rejections, neither sees the whole pattern. The external providers guidance points to it: it asks how often credit notes are raised for products or services that were initially rejected but then accepted, which again compares the commercial record with the quality record.

The quality systems analyst usually does the reconciliation. The inputs are nonconformance dispositions, return shipping records and accounts payable credit memos. The decision is whether the physical returns and the credits agree, and how supplier metrics change as a result. The record is a link between the supplier lot, the internal nonconformance report and the credit memo. If a supplier disputes a rejection and withholds credit, the exception is a review of the inspection method itself, because a weak method gives the supplier a legitimate argument.

Linking those records makes the cost of poor quality visible without inventing figures. A supplier with few rejections but many returned-and-credited lots might look fine on a scorecard until the credits are counted. Ask whether the software can attach credit notes or chargebacks to the rejection that caused them, and whether you can report on them by supplier and period without a spreadsheet export.

Traceability is the other half of this section. When a defect is found late, the question is which parts contain the suspect material. A usable chain connects the supplier's lot or heat number to the internal lot, the work orders that consumed it and the finished assemblies shipped. Test it in both directions.

- **Backward.** Start with a finished assembly and find every supplier lot and certificate behind it.
- **Forward.** Start with a rejected supplier lot and find every work order and shipment that used material from it.

Time the trace during the demonstration using a sample lot. If the answer takes a day in a spreadsheet and a minute in the software, that is a benefit you observed, not one you assumed. If the software depends on data held in your ERP system, record who supplies the lot numbers and what happens when the receiving step does not capture them.

The [ICC supplier module description](https://isocertificationconsultants.ca/solutions/supplier-quality/) mentions records that connect supplier events. Treat any traceability claim as a test to run on your own sample data, since no capability has been verified for this guide.

**Illustrative example:** A hypothetical manufacturer reconciles three credit notes for rejected weldments against the monthly scorecard inputs. Two credits match rejections already counted, while the third relates to a lot accepted under concession and had been missing from the supplier's count. The analyst adds it, and the supplier's record now reflects the full picture.

This chapter connected the order, the inspection, the quarantine and the credit. The next chapter follows a nonconformance outward, into the corrective action request sent to the supplier.
