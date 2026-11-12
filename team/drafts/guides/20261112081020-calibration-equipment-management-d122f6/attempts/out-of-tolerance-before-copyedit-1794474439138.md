---
slug: out-of-tolerance
title: Handle out-of-tolerance results and instruments out of service
description: >-
  Handling exceptions in calibration management software: recognize
  out-of-tolerance results, contain affected work, assign action and preserve
  evidence.
primaryKeyword: calibration management software
keywords:
  - calibration management software exceptions
  - calibration management software
  - equipment calibration register
  - calibration due date tracking
author: ISO Certification Consultants Editorial Team
date: '2026-11-12'
imageBrief: >-
  a quality technician isolating a rejected gauge at a marked inspection bench;
  authentic manufacturing environment, no readable text or logos
sourceIds:
  - icc-calibration-maintenance
  - nist-traceability
  - apg-overview
capabilityIds: []
---
## Recognize an exception

Up to this point, the workflow assumes that calibrations go as planned. This chapter covers the cases where they do not. An exception is any event that stops the normal path: a result outside the limits the organization accepts, a certificate that never arrives, an instrument used after its due date, or equipment found damaged. The first task is to recognize each kind when it happens, and the second is to follow the same response process each time, with a first action suited to the type.

Begin by writing a short list of exception types for the team's own register. A workable list includes a failed or out-of-tolerance result, a missing or unusable certificate, an overdue instrument found in use, a lost or unlocated instrument, and physical damage reported by an operator. Give each a name, an owner for the first response, and a first action. For an out-of-tolerance result, the first action is to remove the instrument from service and tag it. For a missing certificate, it is to hold the instrument until the evidence has been reviewed and an authorized person has decided its status. Writing these down turns a judgment call at a stressful moment into a routine step.

The published [ICC calibration and maintenance page](https://isocertificationconsultants.ca/solutions/calibration-maintenance/) describes an equipment register with calibration status, certificates attached to each instrument, and maintenance recorded against the same equipment record. The page does not describe how exceptions are raised, classified, or routed, so those are questions for a demonstration. Ask the vendor to show how a coordinator records an out-of-tolerance result, whether the status of the instrument changes automatically or by a manual decision, and where the exception appears on the record afterward.

The [National Institute of Standards and Technology](https://www.nist.gov/metrology/metrological-traceability) offers a reminder that matters here. Its metrological traceability page states that traceability does not guarantee fitness for purpose, and that results can be traceable yet have uncertainty too large for a given use. An exception therefore does not have to be a dramatic failure. A certificate can be complete and the chain documented, yet the result can still be unsuitable for the task. The team's exception list should include that case, labeled as a result not fit for the intended use, so that the reviewer has a path to follow when a valid certificate does not support the work.

Decide who can declare an exception. Any operator should be able to report a concern, and the coordinator or reviewer should be able to confirm it. A report is not yet a confirmed exception, and the register should treat the two stages differently. Ask whether the system distinguishes a reported problem from a confirmed one, and whether the confirmation records who made it. Without that distinction, a casual comment can pull an instrument from service, or a serious concern can sit unactioned in a general notes field.

Consider the timing of recognition. Build the check into the review step so that a reviewer compares each returned result with the instrument's limits as a routine part of the decision. If the result is outside those limits, the review ends in an exception record, not in an accepted status.

Think about how the exception appears to others. The instrument's status should change visibly, and the people who use it should see the change at the point of use. Chapter five described the status values and the floor display. An out-of-tolerance instrument needs to display as out of service wherever the status is shown, including the QR view described on the ICC page, or the exception will exist on paper only.

**Illustrative example:** At an unnamed Canadian manufacturer, a returned certificate shows that a bore gauge read outside its accepted limits at the as-found check. The reviewer records an exception; the status changes to out of service, and the gauge is tagged and moved to a quarantine shelf. The owner is told, and the quality lead is asked to assess what the gauge measured. All situations in this chapter are hypothetical, and none describes a customer result.

## Contain affected work

When an instrument is found out of tolerance, the instrument itself is only part of the problem. The larger question is what it measured while it was out of tolerance. Containment means identifying that work, deciding what review it needs, and recording the decision. It is a quality decision, not a software feature, but the register can make it faster by holding the history that the decision depends on.

Start by establishing the period of doubt. The last calibration that showed the instrument within its limits marks one end. The date the problem was found marks the other. Everything the instrument measured between those dates is potentially affected, though the team will judge how much it matters. The register should show both dates clearly. Ask whether the system displays the previous calibration result and date next to the failed one, so the reviewer does not have to search for them.

Next, identify what was measured. The register holds the instrument's identity and history, but the measurements themselves may sit in inspection records, work orders, or production logs held elsewhere. Decide in advance where the team will look. If the inspection records name the instrument used, a search by identifier will list the lots or jobs involved. If they do not, the team will need another route, such as the area and shift where the instrument was kept. This is a reason to name the instrument on inspection records from the start, and it is a good question for a demonstration: can the system link an instrument to the inspection records it was used for?

The published [ICC calibration and maintenance page](https://isocertificationconsultants.ca/solutions/calibration-maintenance/) describes inspection checklists built once and scheduled as programs, with performed and reviewed signatures on inspection records, and an auditor view of completed inspection records with both signatures and timestamps. It does not state whether an inspection record can be linked to a specific instrument or whether a search by instrument is available, so that remains an evaluation question. Ask the vendor to demonstrate the search with a sample instrument.

Decide on the review options and who chooses among them. For each affected lot or job, the quality lead may accept the result after assessing the as-found shift against that work's own acceptance criteria and recording the rationale, recheck the work with an in-date instrument, hold the work pending further review, or notify a customer where the agreement requires it. The options are the team's own and depend on the product and the contract. A sensible team requirement is that the record shows which option was chosen, by whom, and why, and the vendor should be asked to demonstrate where the system supports that. An undocumented decision is difficult to defend later.

Think about the size of the shift. The consequences of a shift may differ, so assess it against the affected work's acceptance criteria and circumstances. The reviewer should record the as-found values and compare them with the tolerance of the work the instrument supported. This assessment belongs to a person, and the team should name who makes it. A system may hold the values and the comparison, and the team should test whether it does; the judgment about significance remains human.

Keep the containment record simple and complete. It should state the instrument, the period of doubt, the work identified, the options considered, and the decision. Link it to the exception and to any corrective action. If the instrument is to be repaired, adjusted, or replaced, link the record of that work as well, so the history of the equipment tells the whole story.

**Illustrative example:** The quality lead at the unnamed manufacturer asks which lots were checked with the failed bore gauge since its last good calibration. A search of inspection records by instrument identifier returns six lots. Four were checked again with an in-date gauge and found acceptable, and two were held for review. The lead records the period of doubt, the lots, and each decision on the exception record.

## Preserve evidence and follow through

An exception is not complete when the instrument is tagged and the affected work reviewed. It is complete when the cause has been considered, the action has been taken, and the record shows how it was closed. This section covers how to keep the evidence together and follow the exception through to closure.

Keep everything on one record: the certificate that showed the failure, the as-found values, the instrument's status change, the containment decision, and the follow-up. The ICC page describes an auditor view that includes the equipment register with calibration status and next due date, certificates attached to each instrument, and maintenance history for each asset. An exception record on the same instrument fits naturally into that picture. Ask the vendor to show what an auditor would see for an instrument with a past exception, and whether the exception, the decision, and the closure appear together.

The [ISO 9001 Auditing Practices Group](https://committee.iso.org/home/tc176/iso-9001-auditing-practices-group.html) page describes its papers as non-definitive and not required audit criteria. It lists papers on monitoring and measuring resources and on measurement traceability, but does not summarize their contents. The team should therefore not treat any paper as a checklist for exception handling. A better approach is to write the team's own procedure, based on its standards and its risks, and to make sure the register can show that the procedure was followed.

Consider the cause. An exception may result from wear, damage, a poor interval, rough handling, or an error in the calibration. The team does not need a full investigation for every case, but it should decide which cases warrant one and who decides. A repeated result close to the limit on the same instrument class, for example, may point to an interval that is too long. The register's history should make that pattern visible.

Set a clear closure rule. Define closure by exception type. A failed result closes when the instrument has been repaired, adjusted, recalibrated, or replaced and the reviewer has accepted the evidence. A missing certificate closes when the certificate arrives, a documented review outcome is recorded, and an authorized person decides the instrument's status. A lost instrument closes when it is found and its status confirmed, or retired with a reason. In every case, the decisions on affected work are recorded before closure. Record the closing person and date. Ask whether the system can show open exceptions and how long each has been open, since an exception left open indefinitely is a signal that something has stalled.

Link to corrective action where the team uses one. Where the team already manages corrective actions elsewhere, check that an exception can reference one, so the record does not exist in two places that disagree. Where it does not, a simple field for the follow-up owner and due date serves the same purpose. Whichever route is used, name the person who confirms that the action was effective, and record the date, since an action that was taken but never checked leaves the exception only partly closed.

Brief the people who use the instruments on what an exception means for them. Operators should know that a tagged instrument is not to be used, that a report of a concern is welcome, and that the aim is to protect the work, not to assign blame. Fear of blame is a risk to reporting, and unreported problems are a risk to customers.

Review exceptions periodically. At a regular meeting, the quality lead can look at the exceptions recorded since the last review, their causes, their status, and any pattern. The aim is to use them as input to interval decisions and supplier choices.

**Illustrative example:** The unnamed manufacturer closes the bore gauge exception after the gauge is replaced and the new one's certificate is reviewed and accepted. The record shows the original certificate, the as-found values, the containment decision, the replacement, and the closure date. At the quarterly review, the quality lead notes two exceptions on the same class of gauge and asks the coordinator to reassess the class interval.

By the end of this chapter, the team has a list of exception types, a containment routine and a closure rule. The next chapter turns to maintenance and inspection records and to how they sit alongside calibration on the same equipment record.
