---
slug: audit-evidence-migration
title: Prepare audit evidence and migrate existing incident logs
description: >-
  Preparing audit evidence in incident and near-miss reporting software: map ISO
  45001 clauses, clean and import old logs, and verify records before cutover.
primaryKeyword: incident and near-miss reporting software
keywords:
  - incident and near-miss reporting software audit evidence migration
  - incident and near-miss reporting software
  - near miss reporting
  - workplace incident log
author: ISO Certification Consultants Editorial Team
date: '2026-11-16'
imageBrief: >-
  An auditor and safety coordinator reviewing printed incident log pages at a
  table; authentic manufacturing environment, no readable text or logos
sourceIds:
  - icc-safety
capabilityIds: []
---
## Know what an auditor sees

An auditor, whether internal, from a customer, or from a certification body, wants to follow a thread from an event to its result. For incident and near-miss records, that means being able to open a report, see how it was rated, see what was investigated, see what was done, and see whether it worked. The safety lead owns the readiness of that thread. The input is the audit view. The decision is what gaps to close before an audit. The record is a gap list. The exception to plan for is incomplete records.

The [ICC Safety module page](https://isocertificationconsultants.ca/solutions/safety/) describes an auditor view. According to the page, it shows the incident and near-miss log with severity and status, floor reports including anonymous ones, and the corrective actions linked to each incident. That is a published description. Ask the vendor to show the view with the plant's own sample records, including an anonymous report and an incident with two actions, and check whether it gives the reviewer what they would ask for.

Think about the questions a reviewer might bring. Which events were reported in a period? How were they rated, and by whom? What happened to the higher-rated ones? Which actions are open, and are any overdue? Can the plant show that actions were checked for effectiveness? Do the records show that people were consulted about hazards? Prepare an answer to each from the log, and note any that need a manual search or a second system.

Rehearse the audit. Choose a few incidents from the last year, including one with a rating dispute, one anonymous report, and one that led to action, and walk through each as a reviewer would. Open the report, follow every link, and ask what is missing. Note anything that takes more than a minute to find. A rehearsal with a colleague who did not work on the records is more revealing than one done by the person who wrote them.

Record the rehearsal results in the gap list with an owner and a date for each item.

Keep the audit view honest. It should show the records as they are, including gaps and late items. Tidying records just before an audit or removing awkward entries damages trust and breaks the principle that records are evidence.

Check access for auditors. Decide how an external reviewer will see the records: a supervised session, a read-only account, or an exported set. Ask the vendor which are supported and how access is recorded. The page describes permissions for the safety dashboard, but the research reviewed for this guide does not describe external reviewer access, so add it to the open-questions list.

**Illustrative example:** In a hypothetical rehearsal, an unnamed Canadian manufacturer opens a near-miss report and finds that it has no linked action, although a repair was made. The gap list records the missing link, the safety coordinator adds it, and the team checks other reports from the same month. The scenario is invented and shows no real result.

## Map clauses without overclaiming

Clause mappings help a team see where its records might support a requirement. They can also mislead if read as a promise. The management representative, or whoever manages the plant's management system, owns this work. The input is a clause list. The decision is what evidence the plant holds for each clause. The record is an evidence map. The exception to plan for is a clause that needs more than the software can supply.

The [ICC Safety page](https://isocertificationconsultants.ca/solutions/safety/) maps its safety module to ISO 45001:2018 clauses 10.2, 5.4, and 6.1.2. Clause 10.2 concerns incident, nonconformity, and corrective action. Clause 5.4 concerns consultation and participation of workers. Clause 6.1.2 concerns hazard identification and the assessment of risks and opportunities. These are the page's own descriptions. A mapping of this kind says that the module may produce records relevant to the clause. It does not say that using the module satisfies the clause, and the plant remains responsible for meeting its requirements.

Build the plant's own evidence map. For each clause the plant has in scope, list what the requirement asks, what records the plant holds, where they are kept, and who owns them. Include records from outside the incident log, such as training records, risk assessments, committee minutes, and inspection reports. A clause such as 6.1.2 depends on a hazard identification process and risk assessments that the log alone does not provide, and the map should say so.

Be specific about how the log supports each clause. For 10.2, the log may hold the incident record, the investigation, the corrective action, and the effectiveness check. For 5.4, it may hold evidence that workers can report, that anonymous reporting is available, and that feedback reaches reporters. For 6.1.2, a near-miss or hazard report may feed hazard identification, but the assessment and decisions about risk sit elsewhere in the plant's system.

Take care with edition and scope. The page names the 2018 edition of the standard. Standards are revised, and a plant's certification scope may include different standards. Check the edition the plant is working to, and confirm clause numbers against the standard itself, which this guide does not reproduce.

Date the map and name its owner, so it can be updated when the log, the standard, or the plant's scope changes.

Review the map with an auditor's eye. For each clause, ask whether a reviewer could find the evidence without help, whether the evidence is current, and whether any statement in the map goes further than the records support. Remove anything that overclaims. A modest, accurate map serves the plant better than an ambitious one that a reviewer takes apart.

**Illustrative example:** An unnamed Canadian manufacturer's hypothetical evidence map lists the linked corrective actions as evidence for clause 10.2 and the committee minutes for clause 5.4, and marks clause 6.1.2 as needing the plant's risk assessment records. The scenario is invented and shows no real result.

## Clean and import existing logs

Many plants hold some history in paper files, spreadsheets, and email. Deciding what to bring into a new system is an important choice, not an automatic one. The data owner leads this work. The input is the old logs. The decision is the scope and the mapping of old fields to new ones. The record is an import plan. The exception to plan for is inconsistent old data.

Start with an inventory. List every place incident and near-miss records are kept, the period each covers, the format, and the owner. Note which records are complete and which are patchy. Decide the scope by purpose: the plant may want enough history to see patterns, to support open actions, and to answer an auditor's questions about the past year or two. Importing everything may cost more than it returns.

The [ICC Safety page](https://isocertificationconsultants.ca/solutions/safety/) is not backed by research in this guide that describes import capability or procedures, so ask the vendor directly. Can records be loaded in bulk, and in what format? Which fields are required? How are ratings from an old scale mapped to the new one? What happens to attachments? Are imported records marked as imported, so they can be told apart from records made in the system? Get the answers in writing.

Clean the data before it moves. Fix obvious errors, agree on one date format, standardize area names and equipment references, and merge duplicates. Keep the original files untouched as the source of record. Where a field cannot be mapped reliably, such as a free-text severity word, decide on a rule and apply it consistently, and note it.

Treat open actions with extra care. An action that is still open in an old spreadsheet must not be lost in the move. List every open action, confirm its owner and date, and make sure it appears in the new system and is checked against the old one. Keep the old list available until the check is complete.

Decide what will not be imported, say why, and note in the import plan where the archive is and who can open it.

Run a pilot import with a small sample. Check each field against the source, count records in and out, and look at how dates, ratings, and attachments appear. Note errors and fix the mapping before the full import. Repeat until the results are accurate, and ask someone who was not involved to check a sample.

**Illustrative example:** In a hypothetical pilot, an unnamed Canadian manufacturer imports 50 old records and finds that a date format error placed several events in the wrong month. The data owner corrects the mapping, repeats the pilot, and checks a sample against the paper files. The scenario is invented and shows no real result.

## Plan cutover and training

Cutover makes the new system the record; a plan prevents reports being left in two places. The implementation lead owns it. The input is the pilot results. The decision is the date and the method. The record is a cutover plan. The exception to plan for is a failed pilot or a problem found after the switch.

The [ICC Safety page](https://isocertificationconsultants.ca/solutions/safety/) describes a four-step setup: mapping processes with named owners, configuring modules, onboarding standards, and deploying to the floor with training, with a certified consultant reviewing configuration through to audit. These numbered descriptions do not establish a mandatory sequence or a verified implementation workflow. Ask which activities apply, their order and dependencies, and request a written plan that shows who does what and when. Compare that plan with the plant's responsibilities.

Choose a cutover method. Some plants switch on one date, and others run old and new processes side by side for a short time or move one area at a time. A parallel period costs extra effort but reduces the risk of lost reports. Decide how long it lasts, who checks that nothing is missed, and what ends it. Keep one authoritative log: the new system. During a parallel period, a paper form is temporary intake only. The supervisor enters it into the system the same shift, marks the paper as entered with the reference number, and the paper form is an intake record reconciled to the system log, not a second authoritative log. The old method closes to new entries on a stated date.

Plan training by role. Floor reporters need a short, practical session on how to file a report, including anonymous ones. Supervisors need to know how to review a report and give feedback. Investigators and action owners need to know how to use the investigation and action records. Committee members need to read the dashboard. Keep each session short and use the plant's own examples. Record who has been trained, since training records can be evidence.

Prepare for the first weeks. Name a person on each shift who can answer questions, publish a short guide, and collect problems in one place. Review them daily at first, and fix wording, access, or settings quickly.

Define the signs of success and of trouble. Success might be reports arriving from all shifts, first reviews meeting the target, and no reports being found outside the system. Trouble might be paper reports that are unentered, entered late, or still arriving after the permitted intake period, long gaps in review, or owners who do not open their actions. Check these at set points and decide in advance what will trigger a rollback or extra support. If the pilot fails, stop the cutover and keep the old method as the only intake until the cause is fixed and the pilot passes. If a serious problem appears after the switch, the implementation lead returns intake to the designated method, such as paper forms, and reconciles every report filed in the meantime against the log.

**Illustrative example:** An unnamed Canadian manufacturer's hypothetical plan keeps paper forms available for two weeks. Supervisors enter any paper form into the system the same shift, and the implementation lead reviews both sources daily. The scenario is invented and shows no real result.

Where a joint health and safety committee exists, tell it about the change. The Government of Ontario's [guide to health and safety committees and representatives](https://www.ontario.ca/page/guide-health-and-safety-committees-and-representatives) describes committees for Ontario workplaces, and plants elsewhere should check the rules that apply to their sites.
