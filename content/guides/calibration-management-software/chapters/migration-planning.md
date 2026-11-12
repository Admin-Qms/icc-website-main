---
slug: migration-planning
title: Migrate the register and certificates without losing evidence
description: >-
  Planning migration for calibration management software: inventory records,
  clean data, pilot the import, plan cutover and roll out to teams with
  training.
primaryKeyword: calibration management software
keywords:
  - calibration management software migration
  - calibration management software
  - equipment calibration register
  - calibration due date tracking
author: ISO Certification Consultants Editorial Team
date: '2026-11-12'
imageBrief: >-
  a receiving inspector sorting calibration records beside incoming material
  racks; authentic manufacturing environment, no readable text or logos
sourceIds:
  - icc-calibration-maintenance
capabilityIds: []
wordCount: 2056
readTime: 11
image:
  src: /images/guides/calibration-management-software/migration-planning.webp
  alt: >-
    a receiving inspector sorting calibration records beside incoming material
    racks; authentic manufacturing environment, no readable text or logos
  width: 1200
  height: 675
  source: openai
  sourceId: b032db198defcd95d5fb93ca110e81bbcc9f79f7485800b418f2111fa82ed2fe
  sha256: b032db198defcd95d5fb93ca110e81bbcc9f79f7485800b418f2111fa82ed2fe
  licenseUrl: 'https://openai.com/policies/terms-of-use/'
---
## Inventory and clean existing records

Moving calibration records into a new system is a records project before it is a software project. The register will only be as reliable as the data placed in it, and the existing data lives in several forms: spreadsheets, folders of certificates, paper files, tags on the instruments and the memory of the people who look after them. The calibration coordinator leads this section's work, with the quality lead deciding what is migrated, what is archived and what is left behind.

Begin with an inventory. List every place that holds calibration information, and for each one record what it contains, who maintains it, how current it is and whether it is the source of truth or a copy. Include the informal sources: a supervisor's notebook, an email folder of certificates, a shared drive with several versions of the same workbook. The aim is to find out where the facts really are before deciding what to carry over.

Classify each source and each record. A useful set of categories is migrate now, migrate later, archive and leave behind. Instruments in current use with a certificate on file belong in the first category. Retired instruments, with their certificates, may belong in the archive category, where the team keeps them accessible but outside the active register. Records with unresolved questions, such as an instrument that cannot be located, are held until the question is answered. Write the classification down, and record who made each decision.

The published [ICC calibration and maintenance page](https://isocertificationconsultants.ca/solutions/calibration-maintenance/) states that the equipment register can be loaded in bulk from Excel, and that each piece of equipment carries its calibration interval and certificates. It gives no detail on how the import works, so the team should plan its data preparation around the questions that any bulk load raises: which columns are accepted, how identifiers are matched, how errors are reported and whether an import can be undone. Put these questions to the vendor in writing before the team spends time arranging data.

Clean the data against a single standard. Agree on the unique identifier first, and make sure each instrument has one. Merge duplicates, which often arise when the same gauge appears under two names in two sheets. Standardize the instrument class values, the location names and the date format. Treat a date written in an ambiguous format as a question to resolve from the certificate, not a guess. Where the source is a certificate, use the certificate date.

Handle the gaps honestly. An instrument with no certificate on file should be flagged as lacking evidence, not given an invented one. An instrument with no known interval should be given an interval through the decision process described in the register chapter, with the reason recorded. A due date that cannot be established should be left blank and shown as needing attention, which supports the rule that an empty value must never display as in date.

Plan how certificates are brought across. Decide whether the files are attached to each record at import, attached afterward in a separate step or kept in the old location with a link. Ask the vendor which of these is supported. Whatever method is used, check a sample to confirm that each certificate is linked to the right instrument and that the serial numbers and dates match.

Decide who may approve a change to a record during cleaning. The quality lead can authorize corrections that rest on evidence, such as a certificate date, and can ask the coordinator to hold any change that rests only on memory. Keep the approver's name in the log.

Record the cleaning work in a log. For each change, note what was changed, why and by whom. The log protects the team if someone later asks why a date differs from an old spreadsheet, and it shows that the migration was a controlled activity.

**Illustrative example:** An unnamed Canadian manufacturer inventories four sources: a shared workbook, two certificate folders and a supervisor's notebook. It finds eleven instruments listed under two names. The coordinator merges them after checking serial numbers on the certificates, flags six instruments with no certificate on file and moves nine retired gauges to an archive list. All situations in this chapter are hypothetical, and none describes a customer result.

## Pilot the import and verify

A pilot is a small, controlled trial of the migration with real data, run before anything is committed. It shows what the import does to records and how long the preparation takes. The quality lead decides whether the pilot passes, and the calibration coordinator carries it out.

Choose the pilot scope deliberately. Select one instrument class or one area of the plant, and include a mix of easy and awkward records. Add at least one instrument with a missing serial number, one with an ambiguous date and one with a certificate that covers several instruments. These awkward records are the ones most likely to reveal how the system behaves under pressure. A pilot of only clean records proves little.

Before importing, write the checks the team will perform afterward. For each pilot record, compare the imported identifier, description, class, owner, interval, last calibration date, next due date and certificate link with the source. Decide how many records will be checked, and define what counts as a pass. A simple rule is that every checked record must match the source or have a documented, accepted reason for the difference. Write the rule before the import, not after seeing the results.

The [NIST metrological traceability page](https://www.nist.gov/metrology/metrological-traceability) is a useful reminder for the certificate part of the check. It states that traceability depends on a documented unbroken chain of calibrations, and that the documentation must allow a user to assess the claim. A migration that attaches the wrong certificate to an instrument, or loses the certificate that supports an earlier calibration, damages that documentation. Include in the pilot a check that the certificate attached to each record is the one for that instrument and that event, with matching serial number and date.

Run the import and examine the results in layers. First, look at what the system reports: how many rows were accepted, how many were rejected and what reasons it gives. Second, spot check records against the source, especially the awkward ones. Third, look at the schedule and status views, since a date that shifts during import will show up as an unexpected status. Fourth, test a retrieval: pick an instrument and see whether its record, certificate and history can be found as the team will need them.

Decide how to handle failures. If the import changes a value, find out why, correct the source or the mapping and run the pilot again. Do not correct imported records by hand to make the pilot appear to pass, since that hides a problem the full import will repeat. Keep the pilot results, including failures, as a record of what was tested and what was changed as a result.

Ask the vendor about reversal. If the full import goes wrong, can it be undone, and what is the process? The published [ICC calibration and maintenance page](https://isocertificationconsultants.ca/solutions/calibration-maintenance/) gives no import detail, so this question needs a written answer. A team that knows it can reverse an import approaches the cutover with more confidence than one that does not.

Review the pilot with the people who will use the register. Show the coordinator, a reviewer and an owner what the imported records look like, and ask whether anything is missing or confusing. Their comments often reveal field names or layouts that make sense to the vendor and not to the floor. Adjust the configuration where the vendor can, and note the limits where it cannot.

**Illustrative example:** The unnamed manufacturer pilots one class of fifty hand gauges. Checking against the source, the team finds that three due dates shifted because the workbook mixed day-first and month-first formats, and one certificate was attached to a gauge with a similar serial number. The coordinator corrects the source and the mapping, repeats the pilot and records the date check and serial check in the preparation steps. The second run matches on all fifty records.

## Plan cutover and train teams

Cutover is the point at which the new register becomes the working record and the old sources stop being updated. Done well, it is uneventful. Done badly, it leaves two versions of the truth. The workflow owner approves the cutover plan, and the training matters as much as the data.

The published [ICC calibration and maintenance page](https://isocertificationconsultants.ca/solutions/calibration-maintenance/) describes setup with the vendor: processes are mapped, modules are configured, standards are onboarded and the rollout includes training, with a certified consultant reviewing the configuration through to the audit. Use that description as a checklist of questions for any vendor, ICC included. Who does each task, what is included in the scope, what the team must prepare and how the work is scheduled? Get the answers in writing, since a verbal description of setup is hard to hold anyone to later.

Write a cutover plan with dates, owners and a decision point. The plan should say what is frozen and when: after a stated date, no one updates the old workbook. It should say who enters changes during the gap, if any, and how they are carried across. It should name who confirms that the final import matches the source and who signs off the switch. Avoid a cutover at a time when the coordinator is away or a large batch of calibrations is due.

Decide what happens to the old sources. Keep them read-only for a stated period, and record where they are stored and who may open them. Do not delete them at cutover. If a question arises about a migrated record, the old source is the evidence. Mark them clearly as superseded so nobody continues to update them by mistake.

Plan a fallback. If something serious goes wrong in the first days, the team should know whether it can return to the old workbook, how current that workbook would be and who decides. Even if the fallback is never used, writing it down reduces risk and gives people confidence.

Train by role, not by feature. Operators need to know how to scan a label, read the status and report a concern. Instrument owners need to know how to see their instruments and what to do when one is due. Reviewers need to know how to record a decision on a certificate. The coordinator needs to know how to schedule, import, correct and report. Write a short job aid for each role, with the three or four steps that matter most.

Train with the team's own records. A session built on sample data from the vendor teaches the screens. A session built on the team's real instruments teaches the work. Include the awkward cases from the pilot, such as a missing certificate or an overdue instrument, so people practice the exceptions as well as the routine.

Check understanding afterward. Ask a few people to perform a task without help: find the status of an instrument, record a certificate review or report a damaged gauge. Where someone struggles, change the job aid or the training, not the person. Repeat after the first month, when real use has raised new questions.

Give people a place to ask. Name a contact for questions in the first weeks and a short way to report problems. Keep a list of issues and review it weekly, deciding which need configuration changes and which need clarification. Close the loop with the people who raised them.

**Illustrative example:** The unnamed manufacturer sets a cutover date at the start of a quiet week. The coordinator freezes the workbook, imports the final data and checks twenty records against the source. The quality lead signs off, and the old files are marked superseded and made read-only. Operators, trained the previous week, scan labels on day one, and the coordinator keeps an issues list that is reviewed each Friday.

By the end of this chapter, the team has an inventory and a cleaned data set, a pilot with recorded results, a cutover plan with a fallback and role-based training. The final chapter turns to running the system over time, answering common questions and preparing a focused demonstration.
