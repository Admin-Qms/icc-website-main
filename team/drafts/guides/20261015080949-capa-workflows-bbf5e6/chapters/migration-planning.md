---
slug: migration-planning
title: 'Planning migration and configuration: CAPA software workflows'
description: >-
  Planning migration and configuration in CAPA software: inventory and classify
  existing records; clean data and map relationships.
primaryKeyword: CAPA software
keywords:
  - CAPA software planning migration and configuration
  - CAPA software
  - corrective action workflow
  - effectiveness review
author: ISO Certification Consultants Editorial Team
date: '2026-10-19'
imageBrief: >-
  a receiving inspector sorting traceability records beside incoming material
  racks; authentic manufacturing environment, no readable text or logos
sourceIds:
  - apg-review-closing
  - apg-documenting
  - nist-rpd-g08
capabilityIds: []
---
## Inventory and classify existing records

A migration begins with knowing what exists. Most plants hold [CAPA information](/solutions/nonconformance-capa/) in several places: a spreadsheet log, paper reports in a binder, email threads, attachments on a shared drive, and notes in other systems. Before any software is configured, list these sources and describe what each holds.

The ISO and IAF guidance on [documenting a nonconformity](https://committee.iso.org/files/live/sites/tc176sc2/files/documents/ISO%209001%20Auditing%20Practices%20Group%20docs/Auditing%20General/APG-DocumentNonconformity2015.pdf) offers a useful template for classification. It describes an example report form with separate parts for the details of the finding, root cause analysis, correction, corrective action, review of the plan, verification of implementation, verification of effectiveness, and close-out. Compare each legacy record against that structure. Some records will have most of the parts, while others hold only a description and a closing date. The comparison shows how much of the old information can map to the new fields and where gaps exist.

Classify records by status and by value. Open findings must move into the new workflow so that work continues without loss. Recently closed findings may need to be visible for recurrence checks and audit requests. Older closed findings may be kept in an archive, with an index in the new system pointing to them. Decide the boundaries with the people who answer audit and customer requests, since they know which history gets asked for.

Capture these facts for each source in the inventory:

- **Owner:** The person who maintains the source and understands its conventions.
- **Volume:** The approximate number of records and attachments.
- **Period:** The date range covered and gaps in that range.
- **Structure:** Whether the data is in fields, free text, or scanned images.
- **Status mix:** How many items are open, recently closed, or historical.
- **Sensitivity:** Whether records include customer drawings, supplier terms, or personal information.

The inventory should also record what is not worth moving. Duplicate entries, test records, and abandoned drafts add noise. Agree on retention rules before moving anything, and record who approved leaving items behind. A decision to archive is still a decision, and an auditor may ask for the reasoning.

Involve the people who use the records daily. An inspector knows which columns are reliable, and a customer-facing coordinator knows which old complaints are still referenced. Their knowledge shortens the inventory and prevents the team from discarding records that still matter in practice.

> **Key Consideration:** Ask each vendor what import formats they accept and who performs the import. A format that suits a clean spreadsheet may struggle with scanned reports and email threads.

**Illustrative example:** The unnamed machining manufacturer finds three sources: a spreadsheet of findings, a binder of paper reports, and an email folder of customer complaints. The spreadsheet holds most open findings, but only one column describes closure. The team decides to migrate open findings and the last full year of closed ones, and to scan older paper reports into an archive with an index entry per report.

## Clean data and map relationships

Raw legacy data rarely matches a new structure. Dates use mixed formats, product names vary, causes appear in a column that mixes causes with actions, and the same supplier is spelled four ways. Cleaning is the work of making the data consistent enough to be useful, and mapping is the work of deciding where each piece goes.

Start with a field-by-field map from the old source to the new record. For each target field, name the source column, the transformation needed, and the person who approves the rule. Where the old data has no equivalent, decide whether to leave the target blank, fill it with a clearly marked placeholder, or collect the information from the people involved. Never invent values to make a record look complete. An auditor reading a migrated record must be able to see what was original and what was added later.

Relationships need the same care as fields. A finding may relate to a work order, a part number, a supplier, a drawing revision, and earlier findings. In the legacy source, those links may exist only as text. Decide which links will be rebuilt as references in the new system and which will remain as text. The ISO and IAF paper on [reviewing and closing nonconformities](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ReviewNonconformity.pdf) says cause analysis may identify potential nonconformities in other areas of the organization. Linking findings by process and cause makes that wider look possible, but only if the migrated records share consistent terms.

A controlled list of values helps. Agree on lists for source, significance, process area, and cause category, then map legacy entries to them. Where the old entries are ambiguous, a person who understands the process should decide, and the decision should be logged. For long free-text fields, keep the original text intact in a notes field in addition to any structured fields created from it.

Handle these cleaning tasks in order:

1. **Standardize dates and identifiers:** Convert to one format and keep the old identifier as a reference for traceability.
2. **Merge duplicates:** Combine duplicate entries only after confirming they describe the same event, and record the merge.
3. **Separate mixed fields:** Split causes from actions and containment from corrections, with review for any split that changes meaning.
4. **Map values:** Apply the controlled lists and flag unmatched entries for human review.
5. **Preserve originals:** Keep a copy of each source untouched, so any question about a migrated record can be checked against the original.

Document every transformation rule in plain language so a reviewer can follow it without reading code or formulas. When a rule changes, record the date and the reason, because a later question about a migrated record will depend on knowing which rule applied.

Test the map on a small sample before running it on everything. Mistakes found in ten records cost an afternoon. The same mistakes found in a thousand cost weeks.

**Illustrative example:** In the unnamed manufacturer's spreadsheet, the "action" column contains both containment steps and corrective actions, and dates appear in three formats. The quality supervisor writes mapping rules, splits the column by keyword with manual review of unclear entries, and keeps the original spreadsheet unchanged. The team also finds two entries for the same bracket finding and merges them after confirming the lot numbers match.

## Pilot the import and verify results

A pilot import proves that the map works before the whole archive moves. It is a rehearsal with real data, a defined scope, and a pass or fail result. Skipping it turns the live cutover into the first test.

Choose a pilot set that represents the variety in the data. Include a simple finding, a complex one with many actions, a reopened finding, one with attachments, and one with missing information. The aim is to find out how the import handles the awkward cases, not to confirm that easy ones work. Run the import into a test area, and compare the results with the source.

The NIST [corrective action procedure](https://www.nist.gov/document/guide08v211pdf) says results are monitored to ensure the desired effect has occurred, with monitoring appropriate to the action. The same attitude applies to migration, which is itself a change that needs monitoring. Define what correct means before the pilot: every field populated as mapped, attachments readable, links working, counts matching, and history in the right order.

Verification should be done by people who know the data. Ask a quality supervisor and an investigator to review a sample of migrated records against the originals and sign off on what they checked. Use checks that can be repeated, such as record counts by status, totals of open actions by owner, and a list of findings with missing cause or closure fields. Differences between the source and the target must be explained, not just noted.

Review these points during the pilot:

- **Counts:** The number of records by status in the source matches the target, or each difference is documented.
- **Content:** Sampled records show the same text, dates, and owners as the source.
- **Attachments:** Files open, are linked to the right record, and keep their names.
- **Relationships:** Links between findings, actions, and other records resolve to the right items.
- **Permissions:** Migrated records show the correct visibility for each role.
- **Open work:** Actions that were due before the migration keep their dates and owners.

Time the pilot as well. A full import that takes a weekend in practice cannot be squeezed into an evening, and the cutover plan should reflect the measured duration. Note any manual steps that the vendor or an internal analyst performed, since those steps must be repeated at cutover.

Record failures and fixes in a log, and repeat the pilot after changes until it passes. Define in advance the criteria for approving the full import, and make a named person responsible for approving it.

**Illustrative example:** The unnamed manufacturer pilots twenty findings, including the hole-position series and a reopened complaint. The pilot shows that attachments from the email folder lose their names and that two open actions lose their owners. The team fixes the import rule, repeats the pilot, and records the quality supervisor's approval of the sample before the full import.

## Plan cutover and recovery

Cutover is the moment the plant stops using the old method and starts using the new one. It deserves a written plan because findings keep arriving, actions keep falling due, and the old and new systems must not diverge.

Choose a cutover approach that suits the workload. A single switch on a defined date is simple but leaves little room for error. A phased approach, such as moving one finding type or one site at a time, reduces risk but means two methods run side by side for a while. Whichever is chosen, define a freeze period when no new records are entered in the old source, so that the final import captures everything.

Write the sequence of steps, their owners, and the check after each one. Include a final backup of the legacy data, the final import, verification of counts and samples, a confirmation that open actions and reminders are active, and a communication to the people who will use the system. The ISO and IAF paper on [reviewing and closing nonconformities](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ReviewNonconformity.pdf) says closure needs objective evidence that actions are implemented and effective, so check that migrated closure evidence stays attached and readable after the move. Records that lose their evidence at cutover can no longer support a closure.

Plan recovery as seriously as the cutover. Decide what would count as a failure that requires stopping, such as missing open actions or corrupted attachments, and who has authority to call it. Define how to return to the old method, how to handle records entered in the new system during the attempt, and how long the legacy source stays available. Keep the legacy data read-only for an agreed period, and set a date to review whether it can be retired.

Prepare for the first weeks after cutover. Expect questions, small configuration fixes, and requests for missing reports. Assign someone to collect them, and decide who can approve changes. A short daily review of open issues in the first weeks helps the workflow owner stay ahead of problems.

Communicate the plan in plain terms. Operators and supervisors need to know which date the old method stops, where to raise a finding afterward, and who to ask for help. Short written instructions posted at each workstation reduce the chance that a finding is raised on the wrong system during the changeover.

Address retention and access in the plan too. Confirm who can view migrated records, how long they must be kept, and how they can be exported if the system is ever replaced. The retention choices made now will bind the plant for years.

**Illustrative example:** The unnamed manufacturer chooses a one-weekend cutover with a freeze on Friday afternoon. The quality supervisor runs the final import, the plant manager checks the open-action counts, and the legacy spreadsheet is set to read-only. The team keeps the old file available for three months and holds a short review each morning of the first week to log questions and fixes.
