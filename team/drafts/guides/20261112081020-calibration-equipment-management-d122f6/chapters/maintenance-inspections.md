---
slug: maintenance-inspections
title: Link maintenance history and inspections to the equipment record
description: >-
  Linking maintenance in calibration management software: record asset history,
  schedule inspection programmes, capture signatures and present audit evidence.
primaryKeyword: calibration management software
keywords:
  - calibration management software maintenance history
  - calibration management software
  - equipment calibration register
  - calibration due date tracking
author: ISO Certification Consultants Editorial Team
date: '2026-11-12'
imageBrief: >-
  two inspectors reviewing a completed inspection record beside a fabrication
  cell; authentic manufacturing environment, no readable text or logos
sourceIds:
  - icc-calibration-maintenance
  - apg-overview
capabilityIds: []
---
## Keep maintenance on the same record

Calibration gives the team measurement results at a point in time to compare with its acceptance criteria. Maintenance tells the team what has happened to the equipment since. When the two histories sit in different places, a reviewer looking at a drifting result cannot easily see that the instrument was repaired, adjusted, or dropped a month earlier. This section covers why the team may want maintenance on the same equipment record and how to test whether a system supports it.

The published [ICC calibration and maintenance page](https://isocertificationconsultants.ca/solutions/calibration-maintenance/) states that maintenance is recorded against the same equipment record, and it lists maintenance history for each asset in the auditor view. That is a description of a design choice worth examining on its own terms. One record per piece of equipment may let a person read calibration and maintenance events together, but the supplied description does not specify how the events are displayed. Ask any candidate to show the combined history for one instrument, with at least one calibration and one maintenance event, and check that the order of events is clear.

Decide which maintenance events matter to the calibration decision. The maintenance lead reviews the maintenance logs and the equipment list and decides which events belong in each asset's maintenance history. The effect of an event depends on the instrument and the event: cleaning a gauge case, a repair, an adjustment, a replacement part, or a drop are examples for the team to assess case by case. Write a short rule that lists the events that should prompt a calibration check before the instrument returns to use, and name who decides. The rule might say that any repair that touches a measuring surface, scale, or sensor requires a calibration check before release. Record the rule in the register's procedure notes so that technicians apply it consistently.

Define what a maintenance record should hold. At minimum, record the date, the person who did the work, a description of what was done, any parts used, and the outcome. Add a link to the exception record if the work followed a failed result. Decide whether the record carries a field for an after-work check, such as a verification against a reference, and whether the reviewer signs it off. Ask the vendor which fields the maintenance record has and which can be added.

Think about planned and unplanned maintenance. Planned maintenance, such as cleaning or lubrication, follows a schedule much like calibration. Unplanned maintenance follows a fault or a report. The register should handle both, and the team should decide whether planned maintenance has its own interval and status. The supplied description does not specify a separate maintenance schedule, so ask how planned tasks are set up and how they appear on the equipment record.

Consider who writes maintenance records. In some plants, the calibration coordinator and the maintenance technician are different people in different departments. Each needs access to the shared record, with permissions that match their role. The technician should be able to add a maintenance event without changing the calibration data, and the coordinator should be able to see the event without editing it. Test this with real roles during the demonstration.

Keep descriptions specific. A line such as “repaired” is of little use to a later reader, while a line naming the part replaced and the check made afterward lets a reviewer judge whether a calibration check is needed.

Finally, check what happens to the calibration status when a maintenance event is recorded. A system could leave the status unchanged, flag the instrument for review, or place it out of service until a calibration check is recorded. The team's rule should determine which behavior it wants. Ask the vendor to show what happens and whether the behavior can be configured.

**Illustrative example:** At an unnamed Canadian manufacturer, a technician replaces the anvil on a bench micrometer and records the repair on the equipment record. The team's rule says a repair to a measuring surface requires a calibration check before release, so the coordinator schedules one and the instrument stays out of service. The timeline on the record shows the repair followed by the new calibration. All situations in this chapter are hypothetical, and none describes a customer result.

## Schedule inspections and sign-offs

Inspections sit beside calibration and maintenance as the third kind of event on an equipment record. An inspection is a planned check of condition, such as looking at a gauge for wear or confirming that a guard is in place, and it produces a record with a result. This section covers how to plan inspection programs and how sign-offs can be organized.

The [ICC calibration and maintenance page](https://isocertificationconsultants.ca/solutions/calibration-maintenance/) describes inspection checklists that are built once and scheduled as programs, and inspection records that carry e-signatures for the person who performed the inspection and the person who reviewed it. Those descriptions suggest a structure for the team's own design: a checklist template, a schedule that applies it to a group of equipment, and a record with two signatures. Ask the vendor to demonstrate each part with a sample, and check what the record shows when only one signature is present.

Design the checklist with the person who will use it. A checklist that is too long is skimmed, and one that is too vague produces nothing useful. Write each item as a question with a clear answer, such as whether the gauge face is free of damage, and decide what an unsatisfactory answer triggers. A useful design links an unsatisfactory result to an exception or a maintenance request, so the finding does not end on the form. Ask whether the system can raise a follow-up from a checklist result.

Decide who performs and who reviews. The person who performs the inspection is often the operator or the owner, and the reviewer is a supervisor or someone in a quality role. Separating the two gives a second look and makes the signature more meaningful. In a small team, the same person may have to do both, and the team should say so in its procedure and add a periodic check by someone else. Name a backup for each role so that an absence does not stop the program.

Decide how often each checklist runs and whether the frequency differs by equipment class. A checklist applied to a hundred gauges needs a way to show which ones are done and which are not. Ask the vendor to show a program view: which inspections are due, which are complete, and which are overdue. Without a view like this, the coordinator may need a separate spreadsheet as a workaround.

Test what the signature means. An e-signature should identify the person, the time, and the action, and it should be tied to the specific record. Ask how the signature is created, whether it can be applied by someone else, and what happens if a record is changed after signing. The page describes timestamps in the auditor view, so ask to see them on a completed record, and ask how a correction is made and shown.

Consider floor access again. The ICC page describes QR labels that open an equipment record on the shop floor and PIN access for people without a desk login. If operators perform inspections, test whether they can open the checklist from the label, complete it, and sign using the access the plant would actually provide. A checklist that needs a desk login is an access risk to test at the machine.

Review the checklist itself on a schedule. Change the template deliberately, record the change and date, and note which version a given inspection used, so that older records are still understood.

Keep a record of missed inspections as well as completed ones. A missed inspection is information. It shows where the program is not working, whether because of workload, access, or unclear ownership. Ask whether the system can list overdue inspections by area or owner.

**Illustrative example:** The unnamed manufacturer builds one weekly checklist for its torque tools, with six questions. An operator completes it at the station by scanning the label and signing with a PIN. A supervisor reviews and signs the same day. One answer, a cracked handle, raises a maintenance request on the tool's record. The completed inspection shows both signatures and timestamps.

## Prepare what an auditor sees

An auditor may observe activities, talk with staff, and review records. The final test of a calibration and maintenance design is whether a person who was not involved can pick an instrument, ask for its history, and understand it without help. This section covers how to prepare for that and how to practice it.

The [ICC calibration and maintenance page](https://isocertificationconsultants.ca/solutions/calibration-maintenance/) lists an auditor view that includes the equipment register with calibration status and the next due date, calibration certificates attached to each instrument, completed inspection records with both signatures and timestamps, and maintenance history for each asset. Use that list as a template for the team's own evidence set, whatever system it uses. For any instrument, the team should be able to show its status, its latest certificate, its recent inspections, and its maintenance history, and explain any exception in between.

The [ISO 9001 Auditing Practices Group](https://committee.iso.org/home/tc176/iso-9001-auditing-practices-group.html) page, published by ISO/TC 176 and the International Accreditation Forum, describes its papers as non-definitive and not required criteria for an audit. An August 2024 item on the page says a paper on resources was revised, that resources are a key element of a quality management system, and that auditors should consider how the resource requirements in clause 7.1 relate to other requirements. That is context for the team, not a checklist. It supports a general habit: be ready to show how measuring equipment connects to the rest of the system.

Run a retrieval test before an audit. Choose three instruments at random, one from each of several classes, and ask a colleague who did not set up the register to find each instrument's status, certificate, last inspection, and maintenance history. Set a target in minutes for retrieving one instrument's evidence, time each retrieval against it, and note where the person hesitated. If a record cannot be found, log it, investigate where it should have been filed, and escalate it to the quality lead. Hesitation shows where the record is unclear.

Check completeness as well as findability. For each of the three instruments, ask whether every event in the timeline has its evidence. A calibration with no certificate, an inspection with one signature, or a repair with no description is a gap a reviewer may question. Fix gaps by completing the record where the facts are known, and note any that cannot be corrected, with the reason. Do not backdate entries to cover a gap, since an honest note is better than an altered record.

Prepare people as well as records. The coordinator, the reviewer, and the quality lead should be able to explain how the process works in a few sentences, and operators should be able to say how they check an instrument's status before using it.

Decide how an auditor is given access. The page describes an auditor view, and the team should ask any vendor how it is provided: a login with limited rights, a report, or a guided session. Whichever form is used, confirm that the auditor can see the record without being able to change it, and that the access is recorded.

**Illustrative example:** Before a scheduled audit, the unnamed manufacturer's quality lead asks a colleague to retrieve the history of three instruments. The colleague finds one complete record, one inspection with a missing reviewer signature, and one repair with no description of the work. The coordinator completes the repair record from the technician's notes, marks the date of the correction, and asks the reviewer to sign the inspection with the current date.

By the end of this chapter, the team has a view of maintenance and inspection records on the equipment record, a plan for sign-offs, and a tested retrieval of evidence. The next chapter turns to migrating existing records into a new system and rolling it out to the people who use it.
