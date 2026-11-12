---
slug: evaluating-software
title: Evaluate calibration management software against real instruments
description: >-
  Evaluating software capabilities in calibration management software: build a
  workflow shortlist, test decision points, examine evidence and compare
  support.
primaryKeyword: calibration management software
keywords:
  - calibration management software evaluation
  - calibration management software
  - equipment calibration register
  - calibration due date tracking
author: ISO Certification Consultants Editorial Team
date: '2026-11-12'
imageBrief: >-
  two quality inspectors comparing a calibration certificate with an instrument
  tag at a bench; authentic manufacturing environment, no readable text or logos
sourceIds:
  - icc-calibration-maintenance
  - apg-overview
  - nist-traceability
capabilityIds: []
---
## Build a workflow-based shortlist

The previous chapter ended with four artifacts: a list of in-scope instruments, a map of one full calibration event, named owners with backups, and written acceptance criteria. This chapter uses them to compare software candidates against the real workflow instead of a feature list. A feature list rewards breadth. A workflow comparison rewards the ability to complete the decisions the team actually makes.

Start by writing the shortlist criteria in the order the work happens. A request is raised, an instrument leaves service, a certificate returns, a reviewer decides, the register is updated, and the owner learns the new due date. For each step, write one sentence describing what the software must let a person do. Then add a column for the evidence the team will accept as proof, such as a live demonstration with the team's own sample records. Statements in a brochure or on a web page are a starting point for questions, not proof.

Published descriptions are useful for building the question list. The [ICC calibration and maintenance page](https://isocertificationconsultants.ca/solutions/calibration-maintenance/) describes an equipment register in which each piece of equipment carries its calibration interval and attached certificates, with status labels such as due soon and in date. It also describes a calibration record that shows the calibration recorded, a certificate attached, and the next due date set; maintenance recorded against the same equipment record; and an auditor view. Treat each of these as a prompt: ask to see it, with sample data, and ask what it does when the record is incomplete. The same approach applies to any other vendor's published material.

The [ISO 9001 Auditing Practices Group](https://committee.iso.org/home/tc176/iso-9001-auditing-practices-group.html) page adds one framing point. It describes its papers as non-definitive and not required audit criteria, and it lists papers on monitoring and measuring resources and on measurement traceability. A shortlist should therefore not be built around the idea that a tool satisfies a published paper. It should be built around what the team needs to show and what the team's own procedures say.

Use a simple scoring sheet. List the workflow steps down the left side and the candidates across the top. For each cell, record one of four outcomes: shown live with the team's data, shown with the vendor's data, described but not shown, or not available. Only the first outcome counts as full evidence. Keep a separate column for questions that remain open, because the number of open questions per candidate is itself a useful measure of how much work remains before a decision.

Limit the shortlist to the candidates that can plausibly show the whole decision path. A tool that handles scheduling well but cannot attach and review a certificate will leave the team with a second system and a new handoff. Ask early whether the candidate holds the register, the certificates, and the maintenance history in one place, or whether the team would need to link several tools.

**Illustrative example:** An unnamed Canadian manufacturer sends each shortlisted vendor the same request: take one instrument from due date to released certificate, using a sample record the manufacturer supplies. One vendor's demonstration uses its own data throughout and skips the certificate review step. The team records that step as described but not shown and adds a follow-up question rather than assuming it works. All situations in this chapter are hypothetical, and none describes a customer result.

Finally, agree on who scores. Individual scoring invites the loudest voice to win. Have each member of the evaluation group score independently, then compare. Differences are the most informative part of the exercise, because they usually reveal a disagreement about the workflow rather than about the software.

## Test the decision points

A demonstration that shows a complete, tidy record proves very little. The records that stress a system are the incomplete ones: a certificate that has not arrived, an instrument that failed, a due date that passed while the instrument was in use. Ask each vendor to show these cases and bring the sample records to the session instead of relying on the vendor's.

Prepare three test records in advance. The first is a normal case with a certificate that is complete and acceptable. The second has no certificate, because the supplier has not returned it. The third has a result the reviewer would not accept. For each record, ask the vendor to walk through what a coordinator sees, what the reviewer sees, and what the instrument's user sees. Write down what happens at each step and, importantly, what does not happen. If a missing certificate causes no visible change on the register, that is a finding.

Certificate review deserves its own test. On its [metrological traceability page](https://www.nist.gov/metrology/metrological-traceability), the National Institute of Standards and Technology states that traceability is the property of a measurement result whereby it can be related to a reference through a documented unbroken chain of calibrations, each contributing to the measurement uncertainty. NIST also explains that merely having an instrument calibrated is not enough to make a result traceable. For a software evaluation, that translates into a practical question: does the review step prompt the reviewer to look at the evidence, or does it only allow a file to be attached? Software cannot assess a chain of calibrations on the team's behalf, but it can make the reviewer's decision explicit, attributable, and dated. Ask to see where the decision is recorded and who is shown as having made it.

Due dates are the next test. The ICC page describes status labels such as due soon and in date, and the auditor view includes the next due date. The page does not state whether due-date alerts or reminders exist, so that is a question to put to the vendor in writing. The same question applies to any candidate. Ask what triggers a notification, who receives it, how far ahead it arrives, and what happens if nobody responds. Ask whether the due date is calculated from the calibration date or entered by hand, and what happens to the date when a calibration is recorded late. A system that cannot answer these questions precisely will leave the coordinator doing the work in a spreadsheet beside it.

Use a checklist for each demonstration:

- Show an instrument that is overdue. What does a user see at the point of use?
- Show an instrument with no certificate attached. Can it be marked in service?
- Show a reviewer rejecting a certificate. Where is the reason recorded?
- Show a change to an interval. Who made it, and is the earlier value kept?
- Show a retrieval of one instrument's full history. How many steps does it take?

Record the answers in the scoring sheet in the same four categories described earlier. If a vendor offers to follow up later with an answer, record that as a commitment with a date, and treat an answer that never arrives as a negative result.

**Illustrative example:** The unnamed manufacturer brings one instrument with no certificate on file and asks each vendor to show what the register displays. One candidate shows the instrument as in date because the previous calibration date is still in the future. The team notes that the status depends on the date alone and asks whether a status can reflect a missing or unreviewed certificate. That question becomes a scored criterion for the remaining candidates.

Keep the session time-boxed and focused on the team's records. A vendor who insists on a prepared tour has chosen the path, and the team learns only what the vendor wants to show. Assign one person to take notes in the scoring sheet during the session, and a second person to ask the follow-up questions. Splitting those roles keeps the conversation moving and avoids the common problem of a record that reflects only the note-taker's recollection. After the session, circulate the notes within a day and ask the vendor to correct anything that misstates what was shown.

## Examine evidence, access and support

The last part of the evaluation concerns what surrounds the workflow: who can see and change records, what an auditor can retrieve, and what support the team can expect. These are also the areas where published pages say the least, so written answers matter.

Begin with evidence. Ask the vendor to show what an auditor would see for a single instrument. The published [ICC calibration and maintenance page](https://isocertificationconsultants.ca/solutions/calibration-maintenance/) lists an auditor view that includes the equipment register with calibration status and the next due date, calibration certificates attached to each instrument, completed inspection records with both signatures and timestamps, and maintenance history for each asset. These are the sorts of items to compare across candidates. Ask whether an auditor needs a login or whether a report can be produced, whether the history can be exported, and whether past versions of a record can be viewed. Test with one instrument and time the retrieval.

Next, access. List the people who need to touch the register: the coordinator, instrument owners, reviewers, operators who only need to see status, and a deputy for each role. The ICC page describes QR labels on equipment that open its record on the shop floor and PIN access for people without a desk login. Use these descriptions as prompts for questions about the team's own floor: how would an operator in the machining area see an instrument's status, what would they be able to change, and how would their actions be attributed? A shared login that hides who made a change defeats the purpose of a record.

Ask about change control. When a coordinator edits an interval or a due date, is the earlier value retained? When a certificate is replaced, is the earlier one kept? A team does not need every feature, but it does need to know the answer, because an unexplained change in a calibration record is the kind of event that auditors ask about.

Support and setup come next. The ICC page describes setup with the vendor: processes mapped, modules configured, standards onboarded, and training included, with a certified consultant reviewing the configuration through to the audit. Compare that description with what each candidate offers and ask what is included, what is extra, and who carries out each task. The page does not state pricing, so it is a question for the vendor in writing, as is the detail of how the register import from Excel works beyond the statement that bulk loading is possible.

Treat any artificial intelligence feature with the same discipline. The ICC page states that every AI output is a suggestion that a person reviews before it enters a controlled record. Whatever a vendor says about automation, ask where a human reviews the output and how that review is recorded. A draft that enters a calibration record without a named reviewer is a gap, not an efficiency.

Keep the summaries together in one shared folder so every member of the group reads the same version. Collect the answers in a short written summary for each candidate and ask the vendor to confirm it in writing. The summary should state, in plain language, what the vendor has shown, what they have promised, and what is still unknown. A decision made on a summary of this kind can be explained later, which matters when someone asks why a particular tool was chosen.

**Illustrative example:** The unnamed manufacturer sends each shortlisted vendor a list of six written questions: how access is assigned, whether earlier values are retained, what an auditor can export, how the Excel import handles duplicate identifiers, what support is included, and what the total cost covers. Two vendors answer in full. One answers verbally and promises to follow up. The team records the third as incomplete and does not advance it until the answers arrive in writing.

When the evaluation closes, the team should hold a ranked shortlist, a scoring sheet with evidence for each score, and a list of commitments and open questions for the preferred candidate. The next chapter turns to the design of the register itself, starting with the fields and the intervals the chosen system must hold.
