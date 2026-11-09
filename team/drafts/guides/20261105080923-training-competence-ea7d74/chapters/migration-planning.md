---
slug: migration-planning
title: Migrate records without creating false qualifications
description: >-
  Planning migration and configuration in competency management software:
  inventory and classify existing records; clean data and map relationships.
primaryKeyword: competency management software
keywords:
  - training records migration
  - competency management software
  - training records
  - competency matrix
author: ISO Certification Consultants Editorial Team
date: '2026-11-05'
imageBrief: >-
  A receiving inspector sorting traceability records beside material racks; no
  readable text or logos.
sourceIds:
  - apg-competence
  - icc-training-competence
capabilityIds: []
wordCount: 2053
readTime: 11
image:
  src: /images/guides/competency-management-software/migration-planning.webp
  alt: >-
    A receiving inspector sorting traceability records beside material racks; no
    readable text or logos.
  width: 1200
  height: 675
  source: openai
  sourceId: c3f151d9d1bad0adb292e0a60bea26ec63348fd4ba552f7f2723cf50b4132c8f
  sha256: c3f151d9d1bad0adb292e0a60bea26ec63348fd4ba552f7f2723cf50b4132c8f
  licenseUrl: 'https://openai.com/policies/terms-of-use/'
---
## Inventory and classify legacy evidence

Moving to new software does not create competence. It moves records, and a careless move can turn an old attendance sheet into what looks like an approved qualification. The goal of this chapter is to bring forward only what the team can rely on, label what it cannot, and keep the rest accessible without pretending it is current. Migration here means data preparation, verification, and cutover. Training the people who will use the system is covered in the next chapter.

Start with an honest inventory of what exists. The Auditing Practices Group, in its [guidance on auditing competence](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Competence.pdf), observes that documented information on competence may be held centrally or locally at each process, and that the organization decides which documented information is appropriate. Records may be held in several places and formats. The mapping chapter produced a location list; use it as the starting point.

### Separate the kinds of record

Different records answer different questions, and a migration that flattens them loses meaning. Sort each item into one of four groups before deciding anything else.

| Record kind | What it shows | Risk if mislabeled |
|---|---|---|
| Task requirement | What a task demands | A person is judged against an outdated definition |
| Attendance or completion | A learning action took place | Treated as proof of competence |
| Practical assessment | Demonstrated performance at a point in time | Carried forward without its criteria or date |
| Qualification | Standing against an outside requirement, where one applies | Used without confirming scope or validity |

The same sheet may hold more than one kind. A binder page may list attendance at the top and a supervisor's practical sign-off at the bottom. Split it in the inventory so each part can be classified on its own.

Assign the inventory to a named records owner and give the work a time limit. An inventory with no deadline can run for months. Begin with the tasks that matter most: those with high consequence, frequent substitution, or required qualifications. Records for tasks that are rarely performed can follow later, with a note that they have not yet been reviewed. A phased approach lets the team start using the system on its highest-risk tasks while the long tail waits.

Involve supervisors in the review. Ask them to flag any record they would not defend if an assessor asked, and then classify each flagged record using the three dispositions.

### Classify by reliability

For each record, the records owner decides on one of three dispositions.

1. **Usable.** The record has the context its kind needs: a person-specific record identifies the person, the task, the date, and the person who confirmed it, while a task requirement identifies the task and its owner; each refers to a requirement the team still recognizes, and, for an assessment, it shows the criteria applied and the context.
2. **Needs review.** The record is plausible but incomplete—for example, an assessment with no criteria noted or a sign-off dated before a method change.
3. **Unsuitable for reliance.** The record cannot be tied to a person or task, conflicts with another record, or has no evident source.

Unsuitable records are not deleted without a retention decision. Keep them, label them, and make clear that they must not support a staffing decision. The inventory should note the disposition and the reason, so that the next person does not repeat the analysis.

**Illustrative example:** An unnamed Canadian manufacturer of machined components finds a course attendance sheet for a measurement course in the central file and a signed checklist in the cell binder for the alternate inspector. The records owner classifies the attendance sheet as completion evidence and the checklist as a practical assessment, notes that the checklist refers to a superseded instruction and marks it as needing review.

Document the classification rules with a one-page guide of usable, needs-review, and unsuitable examples, so the rules outlast the people who know them.

### Test with incomplete and conflicting records

Before the transfer, sample the awkward cases. Pick records with a missing date, an unreadable signature, two conflicting entries for the same person, and a task name that changed over time. Check what each would look like in the new system and verify that none is silently treated as approved competence. If the only way to import a record is to give it a status, apply the decision states the team defined earlier and confirm with the supplier which statuses the system can represent. If a record cannot be represented safely, retain it outside the system with a reference, and never import it as evidence.

## Map and test transfers

With records classified, plan the transfer in small, checkable steps. The migration lead owns the mapping from old fields to new ones and the reconciliation that proves the transfer worked.

### Start with people

The [ICC training and competency module page](https://isocertificationconsultants.ca/solutions/training-competence/) describes a workforce directory built by importing employees. That is a published description, and it does not establish which file formats, fields, or volumes are supported, or whether other historical evidence can be imported. Ask ICC to demonstrate the supported employee import with a small sample and to explain how other historical evidence would be transferred or retained. Do not assume that an employee import also brings in assessments, certificates, or qualification data.

People are the foundation because every other record attaches to one. Reconcile identity first: names that appear in more than one form, people who changed roles or left, and contractors who appear in some files and not others. A duplicated person splits a history in two and makes a gap look like a pass or a pass look like a gap.

Keep the source untouched while testing. Work from a copy, and do not delete or overwrite anything in the original files until the transfer has been accepted and a retention decision has been made. If the mapping changes, rerun the transfer from the unchanged source rather than patching the new data by hand, so that the result can be reproduced and explained.

Include a second reviewer who did not build the mapping. The person who wrote a field mapping tends to read the results as intended. A colleague from quality, given the sample and the source files, will more readily notice a certificate attached to the wrong product family or a date that moved by a month.

### Reconcile before accepting

As a generic migration practice, compare the transferred data against the source before accepting it. For a sample of people, check three things.

- **Identity.** Each person appears once, with the correct role and status.
- **Task scope.** Each transferred item is linked to the correct task, including the product family or equipment it covers.
- **Evidence.** Each item still shows its date, its source, and who confirmed it.

Record the mapping, the reconciliation results, and every unresolved error. The migration lead then accepts the pilot transfer or corrects the mapping and runs it again. Two clean pilots in a row give more confidence than one.

| Check | Question | Pass condition |
|---|---|---|
| Count | Does the number of people match the source? | Differences explained |
| Identity | Is anyone duplicated or missing? | None unexplained |
| Linkage | Is evidence attached to the right task? | Sample checked by a second person |
| Status | Did any record gain a status it did not have? | None; promotions only through the agreed rules |

The last check is the most important. A migration must not upgrade anyone. If a person appears more qualified after the transfer than before it, stop and find out why.

**Illustrative example:** The hypothetical team reconciles a small employee sample first. Two people appear twice under different name formats and one contractor is missing. The migration lead corrects the mapping, reruns the sample and only then decides how to handle the assessment files, which the supplier says will be discussed separately.

Pay attention to dates. Moving a record into a new system can overwrite its original date with the import date, which makes an old assessment look recent. Ask the supplier, using the sample, whether original dates and the identity of the person who confirmed each item are preserved, and look at the result on screen. If they are not, decide whether the original date can be recorded in a note field or whether the record should be retained outside.

### Decide what is transferred and what is retained

Not every record needs to enter the system. Some can stay in a controlled archive with a reference from the new record. Decide this item by item, using the classification. Practical assessments that are usable may be entered with their criteria and dates. Needs-review items may be entered with a status that shows they await review, or retained outside until reviewed. Record the decision for each group and the reason. Whatever is retained outside must still be findable when a reviewer asks for it, so note its location in the new record.

## Approve cutover and fallback

Cutover is the moment the new system becomes the place where staffing decisions are made. Before it, two sources exist, and both may be consulted for reconciliation, but staffing decisions use only the designated authoritative source. After it, the team needs one authoritative source and a clear answer to what happens if that source fails. This is a decision for the workflow owner and the IT owner together.

### Name the authoritative source during transition

Write down, for each kind of record, which source is authoritative on each day of the transition. Many teams run in parallel for a short period. During that time, state who resolves discrepancies between the old and new records and how quickly. A discrepancy that stays unresolved is an exception with an owner, not a footnote.

Before authorizing cutover, check the pilot reconciliation and the outstanding exceptions list. Critical evidence that cannot be verified, such as the practical assessment behind an independent status, should hold the cutover for the affected tasks. A partial cutover that covers well-reconciled tasks first is a reasonable alternative to waiting for everything.

**Illustrative example:** Cutover in the hypothetical plant is delayed for first-article inspection of the second bracket family until the alternate's assessment is reconciled to the correct task. Other tasks proceed. The exception list records the delayed item, its owner, and the date to review it, and the supervisor keeps using the usual inspector for the delayed task.

Define criteria for rolling back in advance. A reasonable rule might be that if reconciliation of a critical sample fails after cutover, or if supervisors cannot retrieve status for a defined set of tasks within the agreed time, the team reverts to the previous source for those tasks while the cause is found. Agreeing the rule before cutover removes pressure to continue with a system that is not yet reliable.

### Plan a fallback

Plan for failure before it happens. Typical failures are loss of access to the system, an incomplete transfer discovered after cutover, and a decision to roll back. For each, write the response: where the supervisor looks for the status, who can authorize work without it (only on sufficient alternative evidence and applicable qualification conditions; otherwise the work is restricted or held), and how records made during the outage are entered afterward. Keep a current export or printout of the statuses for the highest-consequence tasks, if the team's security rules permit, so that the staffing decision does not depend on a single system being available.

The supplied evidence on the [ICC module page](https://isocertificationconsultants.ca/solutions/training-competence/) does not describe recovery arrangements, availability commitments, or data export, so these are evaluation questions rather than claimed features. Ask the supplier in writing what recovery responsibilities and commitments apply, how records can be exported and in what format, and what the team does during an outage.

### Rehearse and record

Rehearse finding the authorized source during a simulated outage. Ask a supervisor to answer the staffing question for a named task using only the fallback route, and time it. Record what went wrong. Then approve cutover with a written record: who approved it, the date, the reconciliation results, the open exceptions, and the fallback plan.

The [APG paper](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Competence.pdf) reminds organizations that records are one part of showing competence, alongside the observation and interview of real people. A well-run migration protects that by making sure that no record gains authority it did not have and that the people who rely on the records know where the limits are.
