---
slug: migration-planning
title: 'Planning migration and configuration: Internal audit management software'
description: >-
  Planning migration and configuration in internal audit software: inventory and
  classify existing records; clean data and map relationships.
primaryKeyword: internal audit software
keywords:
  - internal audit software planning migration and configuration
  - internal audit software
  - audit scheduling
  - audit evidence
author: ISO Certification Consultants Editorial Team
date: '2026-10-29'
imageBrief: >-
  a receiving inspector sorting traceability records beside incoming material
  racks; authentic manufacturing environment, no readable text or logos
sourceIds:
  - apg-internal-audit
  - apg-audit-planning
capabilityIds: []
---
## Inventory and classify existing records

Migration starts with a list of what exists. Audit records usually sit in several places: spreadsheets, shared folders, email attachments, paper files, and perhaps an earlier tool. The team cannot decide what to move until it knows what it has.

The [ISO 9001 Auditing Practices Group guidance on internal audits](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-InternalAudit.pdf) says the organization should have a process for using past audit results in planning future audits. That gives the team a practical test for each record type: would a planner or auditor need it? The [audit planning guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Audit_Planning.pdf) says areas with past nonconformity should be scheduled as a priority, so open and recent findings are a proposed migration priority, not a ranking the guidance sets.

As a proposed approach, build an inventory with one row per record type and sort each into a class:

1. **Move and use:** needed for planning or follow-up, such as the current program, open findings, and recent audit reports.
2. **Move and archive:** worth keeping and searchable, but not used in daily work.
3. **Leave and reference:** kept where they are, with a pointer from the new system.
4. **Retire:** no longer needed, subject to the team's retention rules.

The team's own procedure and any retention obligations decide which class applies. This guide gives no retention periods, so confirm them locally before retiring anything.

For each record type, note the format, the location, the owner, the volume, and any known quality problem. Note the audit plan reference where one exists, as one possible identifier, and check how each audit, finding, and evidence link is actually recorded.

If the volume is large, a proposed approach is to start with the most recent audit cycle and the open items, and move older records in later batches. Decide how paper records are handled.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The workflow owner, here the quality manager, with process owners confirming their records |
| Inputs | The record map, the list of storage locations, the retention rules, and a sample of each record type |
| Decision | The class for each record type; the quality manager accepts the inventory when every type has a class, an owner, and a location, and returns it otherwise |
| Record | The inventory with class, owner, decision-maker, and date |
| Exception | A record type nobody owns, or one whose retention rule is unclear; top management decides the interim class, and the quality manager records the disposition |

**Illustrative example:** An unnamed Canadian manufacturer asks a vendor to import a sample inventory of audit schedules, reports, and a corrective action log. The team asks the vendor to show how classes are tracked, then to run the exception: a record type with an unclear retention rule is held as "leave and reference" by top management's decision, with the disposition recorded.

## Clean data and map relationships

Imported records are only as useful as their connections. A finding that loses its audit, or an action that loses its finding, may be impossible to trace afterward. Cleaning and mapping are what protect those links.

Begin with the fields the new system needs. Compare them with the old records and note gaps: missing dates, inconsistent names for the same process, findings without owners, and evidence stored under a department rather than a finding. Decide for each gap whether to fix it before import, fix it after import, or accept it as unknown with a visible marker.

Next, map relationships. The chain the team cares about runs from the audit program to the audit plan, the finding, the action, and the follow-up evidence. For each link in the chain, write down how the old records identify it: a number, a file name, a date, or nothing. Where nothing connects them, a person must decide the match, and the decision should be recorded.

The [audit planning guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Audit_Planning.pdf) advises planning around processes rather than clauses. If old records are organized by clause, the team may need to map clause-based findings to processes so that later planning can use them. Record that mapping as a decision, since another person may map the same finding differently.

Build a lookup table that maps old category names to the new list, and keep it as a controlled record. Keep original dates, such as the date a finding was raised, instead of letting the import date replace them, since the original date shows how long an item has been open.

Keep original free text intact and add structured fields beside it, keeping detail.

Ask the vendor how its import handles these cases:

- A finding whose audit cannot be matched.
- Two records that appear to be duplicates.
- A field value that does not fit the new list, such as an old category.
- A record with a name that matches two people.

A useful answer describes what the import does, what it reports, and what a person can correct afterward.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The workflow owner, here the quality manager, with a data steward who prepares the files |
| Inputs | The inventory, the field list for the new system, the old records, and the relationship chain |
| Decision | Whether each gap is fixed, deferred, or accepted as unknown; the quality manager accepts the mapping when each link has a stated basis or an explicit unknown marker approved by top management with stated limits, and returns it otherwise |
| Record | The mapping table with each match, its basis, the decision-maker, and any unresolved items |
| Exception | A link that nobody can establish; the quality manager decides to search further, leave the record out, or propose an unknown marker for top management's approval, and records the disposition |

**Illustrative example:** The hypothetical team gives a vendor a file with two apparent duplicate findings and one finding whose audit is missing. It asks the vendor to show a normal linked chain mapped from program to evidence, then to show how the import flags both. For the exception, the team asks the vendor to run the unmatched finding and show the quality manager proposing an unknown marker, top management approving its limits, and the disposition recorded.

## Pilot the import and verify results

Do not import everything at once. A pilot with a limited, representative set can reveal problems while the cost is small, though not every problem.

Choose a pilot set that includes at least one complete chain from program to follow-up evidence, one open finding, one reopened or disputed finding if any exist, and the awkward cases found during cleaning. The [audit planning guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Audit_Planning.pdf) recommends reviewing available documented information before an audit, so include records that an auditor would actually open when preparing.

Include users in the pilot. Ask an auditor and a process owner to find last year's findings for one process and open the evidence behind a closed action.

Verification should compare the new system with the source. As a proposed approach, check three things:

1. **Completeness:** the counts of records match, or each difference is explained.
2. **Accuracy:** a sample of records shows the same dates, owners, statuses, and text as the source.
3. **Connections:** from each sampled finding, the audit, the owner, the action, and the evidence can be reached.

A person other than the one who prepared the data should perform the check. The [internal audit guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-InternalAudit.pdf) highlights objectivity and impartiality in the audit process, and the same thinking applies to checking one's own import.

Record every discrepancy with its cause and its fix. If a cause is the import rule, change the rule and rerun the pilot. If the cause is the source, correct the source or mark the record. Repeat until a pilot passes cleanly. Top management may instead approve progression with a documented gap, whose cause and fix may stay open. Then decide whether to widen the set, and state the pilot's limits in the verification log.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The workflow owner, here the quality manager, who accepts the pilot; an independent checker verifies it |
| Inputs | The pilot set, the import rules, the source records, and the verification checklist |
| Decision | Whether the pilot passed; the quality manager accepts it when completeness, accuracy, and connections are confirmed, and orders another pilot otherwise |
| Record | The verification log with each check, discrepancy, cause, fix, checker, and decision |
| Exception | A discrepancy that cannot be explained; top management decides whether to stop, fix the source, or accept a documented gap; an accepted gap does not count as a clean pass, but permits progression if top management approves its limits, which the quality manager records |

**Illustrative example:** The hypothetical team runs a pilot of one audit with its findings and follow-up evidence, and an independent checker compares ten records with the source. The vendor demonstrates the pilot import and verification, then the exception: an unexplained date mismatch, held by top management until the source is checked, with the decision recorded.

## Plan cutover and recovery

Cutover is the point at which the new system becomes the working record. It needs a date, a list of tasks, an owner for each, and a way back if something fails.

Choose a quiet point in the audit calendar. The [audit planning guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Audit_Planning.pdf) notes that audit timing may need to suit production cycles, and the same applies to a change of system. Avoid a period when many audits are open or when follow-up evidence is due. Decide whether the old system stays available in read-only form, and for how long.

Plan these tasks in order:

1. Freeze changes in the old records, or agree a method for capturing late changes.
2. Run the final import and the verification checks.
3. Confirm access and roles in the new system.
4. Announce the cutover and where records now live.
5. Handle changes made during the freeze.

Recovery means deciding in advance what would trigger a rollback and how it would work. Possible triggers include failed verification, missing access for key roles, or records that cannot be reached. As a proposed approach, take a copy of the old records before cutover and keep it unchanged until the team accepts the new system. If rollback is ordered, top management orders it, the system administrator restores access to the old records, changes made in the new system since the final import are logged and re-entered in the old records, and the quality manager checks the result against the verification checklist. Ask the vendor how data can be exported, what format the export uses, and whether the export includes history and links.

Tell users briefly what they need at the cutover: where records now live, how to sign in, and whom to ask. For changes made during a freeze, a simple log kept by one person can be entered after the import and checked against the log.

After cutover, check the same three things as in the pilot, on a sample, within an agreed time. Record who accepted the cutover and when.

### Roles, inputs and decisions for this step

| Item | What to define |
|---|---|
| Role | The workflow owner, here the quality manager, who runs cutover; top management approves the date and any rollback |
| Inputs | The audit calendar, the verified import, the access list, the rollback triggers, and a preserved copy of the old records |
| Decision | Whether to proceed on the planned date; top management approves when verification has passed cleanly or any accepted gap has approved limits, provided roles work, and postpones otherwise |
| Record | The cutover plan with tasks, owners, decision-maker, date, and any rollback entry |
| Exception | A trigger is met during cutover; top management decides whether to roll back or continue with a documented gap, and the quality manager records the decision |

**Illustrative example:** The hypothetical team schedules cutover between two audits, keeps the old files read-only, and asks the vendor to show the final import, verification, late-change handling, and an export with history and links. For the exception, a rollback trigger is met, and the vendor shows restoration and reconciliation of representative changes while top management decides and the quality manager records it.
