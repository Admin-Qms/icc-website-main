---
slug: migration-planning
title: 'Planning migration and configuration: Supplier quality management software'
description: >-
  Planning migration and configuration in supplier quality software: inventory
  and classify existing records; clean data and map relationships.
primaryKeyword: supplier quality software
keywords:
  - supplier quality software planning migration and configuration
  - supplier quality software
  - supplier approval
  - supplier corrective actions
author: ISO Certification Consultants Editorial Team
date: '2026-10-26'
imageBrief: >-
  a receiving inspector sorting traceability records beside incoming material
  racks; authentic manufacturing environment, no readable text or logos
sourceIds:
  - apg-external-providers
  - icc-supplier-quality-module
capabilityIds: []
---
## Auditing and classifying legacy supplier records and quality history

Every plant that adopts supplier quality software already has a supplier system. It is just spread across places: an approved vendor list in a spreadsheet, certificates in a shared drive, rejection notes in the ERP system, corrective action requests in email and a binder of paper inspection logs. Migration starts by finding all of it. Moving only what is easy to export creates a new system that looks complete and is not.

The ISO and IAF [external providers guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) says an auditor may look for documented information, such as a list, showing which external providers are approved and for it to be kept up to date. A migration is an ideal moment to make that statement true, because it forces someone to check each name on the list against reality. The paper is auditor guidance written for ISO 9001:2015, so use it as a prompt for questions about your records, not as a prescription.

Build an inventory first, before anyone writes an import file. A quality data analyst can do this with the legacy approved vendor lists, open nonconformance logs, active SCAR spreadsheets and file share archives. For each source, record where it lives, who owns it, how current it is and what it contains. The decision is which records deserve migration into the live database. The record is a data inventory that sorts each source into one of three groups.

- **Active migration.** Records that people use now: approved suppliers with valid evidence, open SCARs, current certificates and recent inspection history that feeds scorecards.
- **Reference archive.** Historical records that must stay retrievable but need not be editable, such as closed SCARs from earlier years and superseded audit reports.
- **Obsolete purge candidates.** Suppliers that have not been used for years, duplicate entries and files with no continuing purpose, subject to your retention rules.

Check retention rules before purging anything. Customer contracts, regulators and your own records procedure may require some history to stay available, so a purge decision belongs to the quality owner and should be written down. When in doubt, archive.

Legacy suppliers without qualification evidence are a common finding. Perhaps a machine shop has supplied parts for fifteen years, but no one can find its survey or certificate. The exception handling should be clear: give the supplier a temporary quarantine status, set a deadline to complete qualification and apply extra receiving checks until that is done. Do not import it as approved because it appeared on an old list.

For the evaluation, ask for the vendor's import templates and compare them with your inventory. Do the templates carry certification histories, expiry dates, qualification scope and the link between a supplier and the parts it makes? Does the software distinguish live records from read-only history? The [Supplier Quality module page](https://isocertificationconsultants.ca/solutions/supplier-quality/) describes the module's records, but it does not describe data import, so ask any vendor, including ICC, to show the process on a sample of your data.

**Illustrative example:** A hypothetical migration team inventories 450 legacy vendor files. After checking purchasing activity and evidence, it designates 180 as active providers for full-history migration, 120 as reference archive and the rest as candidates to retire after the retention check. The inventory becomes the scope document for the project.

## Sanitizing data and mapping relational links between parts, vendors, and defects

Clean data is the cheapest improvement in the project and the most often skipped. Software enforces relationships, and relationships fail when names, part numbers and defect codes are inconsistent. A supplier entered four ways in four spreadsheets becomes four suppliers, each with a partial history, and every report on it is wrong.

Start with four standards, and write them before cleaning.

1. **Supplier identity.** One legal entity, one profile, with sites listed beneath it. Define the naming convention and the key that identifies a supplier, such as a vendor number from the ERP system.
2. **Part identity.** One format for part numbers and revisions, so receiving, engineering and purchasing refer to the same item.
3. **Defect taxonomy.** A short list of defect categories used for receiving inspection and SCARs, instead of free text from years of habit.
4. **Process qualification.** A list of processes a supplier is approved for, such as plating or heat treatment, kept separate from the supplier's general status.

The last point matters because the [external providers guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) asks whether outsourced processes are considered in the supply chain with relevant controls. A plating shop approved for zinc plating has not been approved for anodizing. If the import flattens that into a single approved flag, the software will allow orders the company never qualified. Map each outsourced provider to the processes it is actually qualified for.

The systems integration engineer builds the mapping. The inputs are cleaned vendor master files, normalized defect tables and the list of active parts with cross-references. The decision is how each legacy column maps to a field in the target schema, and what transformation rules apply. The record is a mapping specification with validation rules. When two profiles for the same supplier carry conflicting statuses, one approved and one suspended, the exception is manual review and consolidation, with the more cautious status holding until the review is complete.

| Legacy item | Target relationship | Validation rule |
| :--- | :--- | :--- |
| Vendor name variants | One supplier, many sites | Match on vendor number, then review |
| Part numbers across sheets | One part with revisions | Check against the controlled part list |
| Free-text defects | Coded defect categories | Map each phrase, flag unmapped |
| Plater listed once | Supplier linked to each qualified process | Require process scope per link |

Evaluate whether the software supports many-to-many relationships. One supplier may have several sites, and several suppliers may make the same part. A tool that allows only one supplier per part will force awkward workarounds. Also look at the import validator: before data is loaded, does it list rows that fail, with the reason, so errors can be fixed in the source instead of discovered after go-live?

> **Key Consideration:** Never clean data inside the new system as a first step. Fix the source, keep a record of every change and import again. A cleanup done only in production cannot be repeated or audited.

**Illustrative example:** A hypothetical team finds three separate legacy entries for one multi-facility machining company, each with a different address and an approval date. It merges them into one corporate profile with two sites, and the earliest approval date becomes a historical note with the review that confirmed it.

## Executing phased pilot imports and verifying data integrity

A pilot import is a rehearsal with real data. It tests the mapping, the import tool and the team's ability to judge whether the result is right. Run it on a representative sample, not on the easiest records.

Choose the sample to include the awkward cases: high-risk and low-risk suppliers, suppliers with several sites, records with attachments, and closed SCARs linked to old nonconformances. A pilot might include 25 active suppliers, a hundred inspection logs and thirty closed SCAR files, though the right size depends on your volume. The quality systems lead owns validation. The decision is whether the import is accurate enough to approve the script for the full load. The record is a pilot verification report that compares source data with imported records.

Verify the results against the source, line by line, for a defined sample. Counting records is not enough, since an import can load the right number of rows with the wrong content. Check these items.

- **Metadata.** Original approval dates, reviewer names and sign-off dates are preserved and not replaced by the import date.
- **Attachments.** Certificates, reports and photographs are present, open correctly and attach to the right record.
- **Relationships.** A closed SCAR still links to its nonconformance, supplier and part, and the links can be navigated.
- **Statuses and dates.** Supplier status, certificate expiry and audit due dates match the source.
- **Signature notation.** Migrated entries are marked as legacy, so no one mistakes an imported approval for a signature made in the new system.

That last point is a matter of integrity. If the software stamps imported records with the migration date and the importer's name, an auditor may reasonably ask who approved what and when. Ask the vendor how legacy status is displayed, and check that the original reviewer and date remain visible.

Missing attachments are the typical exception. File paths break, names change and some documents turn out never to have been saved. Halt the cutover plan until the missing files are located or the gaps are documented and accepted by the quality owner.

> **Important:** Treat a failed pilot as useful evidence, not a setback. Each error found now is one that will not appear in front of a customer auditor later.

The [external providers guidance](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ExternalProviders.pdf) asks whether approved lists are current and whether controls exist for the providers on them. After the pilot, run the same questions against the imported data: can you list the approved suppliers, their scopes and their evidence, and do they match the legacy records you verified?

**Illustrative example:** A hypothetical team validates a pilot import of 25 critical suppliers. The line-by-line check finds that certificate expiry dates shifted by a day because of a date format conversion. The team corrects the mapping rule, reruns the pilot and records both runs in the verification report.

## Planning cutover sequences, fallback plans, and parallel run protocols

Cutover is the moment the old method stops and the new one starts. It deserves a plan because the receiving dock does not stop when the project does. Material arrives, purchase orders go out and nonconformances occur during the change.

Plan the sequence in layers. First comes preparation: data loaded, users trained, roles tested and integrations proven in a test environment. Second comes the switch: a defined time when new transactions begin in the new system. Third comes stabilization: heightened support while the team resolves early issues. Pick the switch time to avoid peak receiving periods; a scheduled maintenance weekend suits many plants.

Define the fallback before you need it. The plan should state what conditions trigger a rollback, who decides, how new transactions made since the switch are preserved and how long the legacy system remains available. An integration timeout between purchase orders and receiving inspection is a realistic trigger. If receiving cannot see orders, the dock must return to the manual method while the fault is fixed.

The operations project manager gives the final go or no-go, using the cutover checklist, information technology readiness sign-offs and the parallel run results as inputs. The decision covers all plants or a single site if you stage the release. The record is a signed cutover authorization and a post-go-live support schedule.

A parallel run reduces risk at critical stations. For a defined period, inspectors record each lot in both the old and new methods, and a reviewer compares the results daily. It costs extra effort, so limit it to the stations and suppliers that carry the most risk, and set the end date in advance. Five working days of dual entry may be enough for low-volume stations, while a high-volume dock may need longer.

Use this checklist when assessing the vendor's support for cutover:

1. **Checkpoints.** The vendor's method includes explicit go or no-go criteria rather than a single go-live date.
2. **Rollback.** Procedures exist to return to a prior state, and the vendor describes what data can and cannot be restored.
3. **Availability.** The vendor commits in writing to technical escalation support during the cutover window, including the hours it covers.
4. **Integration monitoring.** Failed transactions between ERP purchase orders and receiving are logged and visible to the team.
5. **Post-go-live review.** A scheduled review of issues, data corrections and user feedback closes the project.

> **Key Consideration:** Hold a short daily review during the parallel run. Differences between old and new records are only useful if someone examines them while the cause is still fresh.

Keep customers and suppliers informed. If suppliers will begin responding to requests through a new channel, tell them when and how, and keep the old channel working until they have confirmed the change. The [module page](https://isocertificationconsultants.ca/solutions/supplier-quality/) describes supplier-facing tasks, but supplier portal functionality is pending in the capability register, so confirm what exists before promising anything to suppliers.

**Illustrative example:** A hypothetical plant executes cutover over a scheduled maintenance weekend and logs inspections in both methods for five working days. On day three, the comparison reveals a difference in how a unit of measure is stored. The team fixes the mapping, and the go-live review records the correction.

The next chapter covers how to prepare people to use the system once the data is in place.
