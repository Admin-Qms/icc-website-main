---
slug: certificates-traceability
title: Review certificates and keep the traceability chain
description: >-
  Reviewing certificates in calibration management software: attach evidence,
  check traceability, accept or reject results and keep records retrievable.
primaryKeyword: calibration management software
keywords:
  - calibration management software certificates
  - calibration management software
  - equipment calibration register
  - calibration due date tracking
author: ISO Certification Consultants Editorial Team
date: '2026-11-12'
imageBrief: >-
  a quality lead reviewing a calibration certificate beside an inspection
  station; authentic manufacturing environment, no readable text or logos
sourceIds:
  - icc-calibration-maintenance
  - nist-traceability
capabilityIds: []
---
## Attach and identify the certificate

This guide treats a calibration certificate as the team's evidence that a calibration event took place and produced a result. The register is only as trustworthy as the link between each certificate and the instrument it describes. This section covers how to receive, identify and attach certificates so that the link holds up when someone asks for the evidence a year later.

The [ICC calibration and maintenance page](https://isocertificationconsultants.ca/solutions/calibration-maintenance/) describes a calibration record showing the event, an attached certificate and the next due date. That sequence is a useful way to think about the event. A proposed team rule is that three things must be true together before the instrument returns to service: the event is recorded, the evidence is attached and the next due date is set. If any one is missing, the team can treat the record as incomplete. Ask any candidate system whether it can display an event as incomplete until all three are present.

Decide how certificates arrive. Suppliers send them by email, in the box with the instrument, through a portal or on request. Name a single point of receipt, normally the calibration coordinator, so that every certificate passes through one person or one mailbox before it is routed. Certificates that land with whoever asked for the calibration can be misfiled or forgotten, which is a risk a single point of receipt reduces. Write the rule down and tell the suppliers where to send the evidence.

Check identification before attaching. A certificate should carry the instrument's serial number or another identifier that matches the register, the date of the calibration and the name of the issuing laboratory. If the certificate lacks an identifier, or the serial number does not match the register, do not attach it. Hold the instrument and query the supplier, returning the certificate for correction if needed. A mismatch might be a typing error at the supplier or an instrument that was swapped, and the reviewer cannot tell which without asking. Record the query and the answer so that the history shows the correction.

File naming matters if certificates are also stored outside the register. Use the unique identifier and the calibration date in the file name, for example, the identifier followed by the date, so that a certificate can be found even if the link is lost. Keep an unchanged copy of the file exactly as the supplier issued it, with its original file name, and use a separate copy for working edits. Store the original in a protected location so the evidence stays as received.

Set a target for how quickly a returned certificate is reviewed, and measure it. A certificate that sits unreviewed for weeks leaves the instrument in an unclear state: it may be back on the floor with no recorded decision, or it may be waiting unnecessarily. A simple weekly list of certificates received but not yet reviewed gives the coordinator something to act on. Ask whether the system can produce that list without a manual search.

Each link between an instrument and a calibration event must be individually traceable. When one document covers several instruments, link it to each instrument's event so a reviewer opening any one record sees the certificate and the right page of it. Ask the vendor how the system handles a multi-instrument certificate, because the answer shows whether the design assumes a simple one-to-one pairing.

**Illustrative example:** An unnamed Canadian manufacturer receives a certificate for a micrometer whose serial number differs from the register by one digit. The coordinator does not attach it. She asks the supplier to confirm the serial number, records the query on the event and holds the instrument in a quarantine area until the corrected certificate arrives. All situations in this chapter are hypothetical, and none describes a customer result.

## Check what traceability means

Traceability is a word that appears often on certificates and rarely gets examined. A reviewer who understands what it means can ask better questions of a certificate than one who treats it as a stamp of approval. This section sets out what the National Institute of Standards and Technology says about it, and what that implies for a review step.

On its [metrological traceability page](https://www.nist.gov/metrology/metrological-traceability), NIST adopts the international vocabulary definition: traceability is the property of a measurement result whereby the result can be related to a reference through a documented unbroken chain of calibrations, each contributing to the measurement uncertainty. Three parts of that definition are worth separating. The chain must be documented. It must be unbroken. And each link contributes to the uncertainty of the result.

NIST also states that traceability is a property of a measurement result, not of an instrument, a report or a laboratory, and that merely having an instrument calibrated is not enough to make a result traceable. This distinction changes how a reviewer reads a certificate. A certificate shows that a calibration took place. Whether the result it supports can be called traceable depends on the documented chain behind it, in which each calibration contributes to the uncertainty. Whether a certificate must also state an uncertainty is the team's own review rule, not an unqualified NIST requirement. The quality lead, who owns the evidence decision in this workflow, therefore looks for signs that the chain exists and checks whether it runs through the intermediate references to the highest reference claimed: the reference used, the measured property, a description of the measurement system and, under the team's own review rule, a stated uncertainty.

The page explains that each link in the chain needs a defined measured property, a description of the measurement system and a specification of the reference used, and that the reference is typically a national or international standard. It also says the provider of a result is responsible for supporting its traceability claim, and the user is responsible for assessing that claim. In practical terms, the supplier supports the claim with documentation, and the team's reviewer assesses whether that documentation is enough for the team's use. The assessment stays with a person. A system might prompt it and record what was checked and by whom; test whether it does.

Use that division of responsibility to write a short review checklist, adapted to the team's own procedures:

- Does the certificate identify the instrument by serial number or identifier?
- Does it state the date and the calibrating laboratory?
- Does it identify the reference or standard used?
- Under the team's own review rule, does it state an uncertainty for the results?
- Does it give the measured values, not only a pass statement?
- Does the documented chain run through each intermediate reference to the highest reference claimed?
- Is anything missing that the team's own procedure requires?

Two further points from the same page help avoid false comfort. NIST states that laboratory accreditation shows competence but does not certify the traceability of a specific result. It also says that using a standard reference material does not by itself make a user's results traceable. A reviewer who sees an accreditation mark on a certificate should treat it as one input, not as the end of the review. The reviewer still looks at the content of the certificate in front of them.

Ask candidate systems how the review step is presented. A good design shows the reviewer the certificate and the checklist together, requires a decision, records who made it and keeps a record of which chain and uncertainty checks were completed. A weak design allows a file to be attached and a status to be set without any evidence that someone read it. The test is simple: attach a certificate with a missing uncertainty statement and see whether the system makes the gap visible.

**Illustrative example:** The unnamed manufacturer's reviewer receives a certificate with measured values but no stated uncertainty, although its own review rule requires one. She uses the checklist, records that the uncertainty is missing and asks the supplier for a corrected certificate. The register shows the event as awaiting evidence and the instrument remains out of service until the reviewer has the corrected document.

Train reviewers with real examples. Pick two or three past certificates, one complete and one with a gap, and walk through the checklist together. The aim is a shared reading of what a complete certificate looks like, so that two reviewers reach the same decision from the same document.

Keep the review proportionate. A reference standard used to calibrate other instruments warrants a closer look than a gauge used for a loose indication. The team can set review depth by instrument class and record the rule in the register, so reviewers apply it the same way each time.

## Decide acceptance and fitness for use

A reviewer's decision has two parts that are easy to confuse. The first is whether the certificate is complete and credible. The second is whether the result is good enough for the way the instrument is used. Both need to be recorded, and they should be recorded separately.

On the second part, the [NIST page](https://www.nist.gov/metrology/metrological-traceability) is direct. It states that traceability does not signify or guarantee fitness for purpose, and that traceability does not limit the size of the uncertainty, so a result can be traceable and still inadequate for a given use. A certificate showing an unbroken chain and a small shift from nominal can be accepted as evidence yet unsuitable for a tight tolerance. The reviewer therefore compares the stated uncertainty and the measured values with the tolerance the instrument must support, and decides whether the instrument may be used for its intended task.

Record three possible outcomes. The instrument may be accepted for use as intended. It may be accepted with a restriction, for example for a looser tolerance or a particular task only. Or it may be rejected and sent for adjustment, repair or replacement. Each outcome should carry the reviewer's name, the date and a short rationale. A restriction should appear on the record and at the point of use, not only in the reviewer's view.

The ICC page describes an auditor view that includes calibration certificates attached to each instrument, along with the equipment register and the next due date. Use that description as a prompt when testing a system. Ask the vendor to show a rejected certificate and a restriction as the auditor would see them, and check that the reason is visible beside the certificate.

Write the decision rules down before the first certificate arrives. State which outcomes the reviewer may decide alone and which need the quality lead. For example, the reviewer might accept a certificate with no issues, while a restriction or a rejection is confirmed by a second person. Rules like these reduce the pressure on a single reviewer and make the process easier to explain to an auditor.

Think about the reviewer's independence. Where possible, the person who accepts a certificate should not be the person who arranged the calibration or who benefits from the instrument returning quickly. In a small plant that separation may not be possible, and the team can compensate with a periodic sample review by the quality lead. Record the arrangement in the procedure so that the choice is visible to anyone reviewing it.

Finally, consider what happens to earlier results when a new certificate arrives. If an instrument has drifted, the team may need to look back at what it measured since its last good calibration. That is the subject of a later chapter, but the register should make the history easy to see: the previous certificate, the previous values and the dates between events. Check that a new certificate does not overwrite the old one.

**Illustrative example:** The reviewer at the unnamed manufacturer finds that a gauge returned with a valid certificate and a stated uncertainty larger than the tolerance of the tightest part it measures. She accepts the certificate as complete, restricts the gauge to a looser tolerance and records the reason. She confirms the looser tolerance suits the gauge's restricted use. The restriction stays until a new calibration is obtained and the reviewer reassesses the measured values and uncertainty against the original task's tolerance; the quality lead reviews it at each monthly check. The register shows it on the gauge's record and the shop floor label.

By the end of this chapter, the team should have a receiving rule, an identification check, a review checklist and a recorded decision with three outcomes. The next chapter turns to the schedule, and to how the register keeps due dates current once these decisions are in place.
