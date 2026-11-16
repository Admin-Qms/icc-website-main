---
slug: severity-triage
title: Rate severity and triage in incident and near-miss reporting software
description: >-
  Severity and triage in incident and near-miss reporting software: set a
  harm-based scale, rate reports consistently, route them and handle disputed
  ratings.
primaryKeyword: incident and near-miss reporting software
keywords:
  - incident and near-miss reporting software severity
  - incident and near-miss reporting software
  - near miss reporting
  - workplace incident log
author: ISO Certification Consultants Editorial Team
date: '2026-11-16'
imageBrief: >-
  A safety coordinator reviewing reports at a dock office desk; authentic
  manufacturing environment, no readable text or logos
sourceIds:
  - icc-safety
  - ontario-jhsc-guide
capabilityIds: []
---
## Define a harm-based scale

A severity scale turns a pile of reports into a list the plant can act on in order. Without one, the loudest report or the most recent one gets the attention. The safety lead owns the scale and the decisions behind it, and should build it from the plant's past reports rather than from an abstract template.

The [ICC Safety module page](https://isocertificationconsultants.ca/solutions/safety/) states that severity is set from the level of harm. That is a sound starting principle for any tool, and it gives the plant a direct question for a demonstration: how many levels exist, and can the plant name and describe each one in its own words?

Begin with the plant's own history. Gather a sample of past reports from paper logs, email, and handover sheets, and sort them by how much harm each caused or could have caused. Three or four levels are a reasonable illustrative starting point, which the plant can adjust after testing. Fewer levels may blur important differences, and more levels may invite arguments about the boundary between neighbors. A simple pattern might read as follows.

| Level | Plain description | Typical example prompt |
|---|---|---|
| Low | No harm; a condition that could contribute to harm later | A cable across a walkway, caught before anyone tripped |
| Medium | Minor harm, or a close call with the potential for it | A near-miss with a lift truck at a blind corner |
| High | Serious harm, or a close call with the potential for it | A guard missing during a running cycle |

These three levels are an illustration for building a scale, not a recommended standard, and each plant should write definitions that match its own hazards and its own approach to risk. The research reviewed for this guide does not confirm which levels the product offers or whether the plant can change them.

Decide how near-misses are rated. A near-miss caused no harm, so a rating based on actual harm would always be the lowest. Most plants rate a near-miss by the harm that could reasonably have occurred, and the scale should say so in plain words. The same event can then receive the same rating whether or not someone happened to be standing in the wrong place.

Test the scale before relying on it. Give two people the same ten past reports and ask each to rate them without conferring. Where their ratings differ, the definition at that boundary is unclear. Rewrite it, using the disputed reports as examples, and test again. Keep the examples with the definitions so that new reviewers can learn the scale from real cases rather than from adjectives.

The exception to plan for is the report that fits no level cleanly. The safety lead should decide in advance who rules on such a report and where the ruling is recorded, so the answer becomes a worked example rather than a one-off judgment.

**Illustrative example:** An unnamed Canadian manufacturer finds that two coordinators rate the same forklift near-miss differently, one as Low and one as Medium. The safety lead rewrites the boundary to say that a near-miss involving moving equipment and a pedestrian path is at least Medium, and adds the report to the scale as an example. The scenario is invented and shows no real outcome.

## Route reports by rating

Once reports carry a rating, routing decides who is told and how quickly. The operations manager is usually the right owner for this decision, because it sets expectations for supervisors, maintenance, and managers across shifts. The input is the severity scale. The decision is who receives each rating and how soon someone must respond. The record is a routing table.

Write the table plainly. For each level, name the role that is told, the expected time for a first response, and the role that steps in if the first person does not respond. Keep the number of people at each level small; a notice sent to everyone is easy for everyone to ignore.

An illustrative routing table might read as follows, to be adapted to the plant.

| Rating | Told | Expected first response | If no response |
|---|---|---|---|
| Low | Area supervisor | Within the working week | Safety coordinator |
| Medium | Area supervisor and safety coordinator | Within the working day | Operations manager |
| High | Operations manager and safety lead | Same shift | Plant manager |

The times in this table are placeholders for the plant to set, not recommended values. The point is that every row names a role, a time, and a fallback, so a stalled report is easier to identify and address.

The [ICC Safety page](https://isocertificationconsultants.ca/solutions/safety/) describes a health and safety dashboard with its own permissions, separate from quality, but it does not state notifications or alerts. Ask the vendor how routing is configured: whether a rating can trigger a message to named roles, how a message is delivered, whether the reader must acknowledge it, and what happens if nobody does. Ask the vendor to show the fallback step with a sample report left unread. If routing depends on someone checking a screen, record that as a limitation and decide how the plant will cover it.

Test the table with a sample report at each level before the plant relies on it. Walk the report through the table with the named roles and ask each whether they would see it in time and know what to do next. Adjust any row where the answer is no. Think about shifts and absences. A rule that sends a High report to one named manager fails when that manager is on leave. Route to a role with a named person behind it, and keep the list of people behind each role current. Review the routing table whenever the organization changes.

Consider the reporter's side too. A reporter who sees that a serious report received a quick response learns that reporting is worthwhile. Where the reporter is known, the plant may choose to tell them the rating category and who has taken it on, within what the plant's policy allows.

Finally, include an unreviewed-report check. A weekly look at reports that have no rating, or that have sat at one level beyond the expected response time, catches the cases where routing failed quietly. The check does not need new software; it needs an owner and a calendar entry. Assign it to the safety coordinator and record each check, including the result, so it becomes part of the plant's evidence.

## Handle disputed ratings

Ratings will be questioned. A supervisor may believe a report is more serious than the first reviewer decided, and a reviewer may think a report was inflated. The process should treat disagreement as normal and make it visible, not bury it.

The safety lead normally holds the final say in a dispute. The input is the disputed report together with the rating history and the scale. The decision is the final rating. The record is the rating history, which should show the original rating, any change, who made it, when, and why.

The [ICC Safety page](https://isocertificationconsultants.ca/solutions/safety/) describes severity as set from the level of harm but does not describe rating history or who may change a rating, so those are questions for the vendor. Begin by deciding who can change a rating. If anyone with access can change a rating silently, the log loses its value as evidence. A better rule is that only named roles can change a rating, and that a change requires a short reason. Ask the vendor how permissions apply to ratings, whether the original rating stays visible after a change, and whether the reason is a required field.

Keep both ratings. The first rating shows what was understood at the time of the report; the later one shows what was concluded after review. Both are useful. A pattern of upward changes might indicate that the first review is too cautious about harm, and a pattern of downward changes might indicate pressure to play events down. Neither pattern can be seen if the original is overwritten.

Write the dispute rules into the scale itself, so reviewers and supervisors read the same document. Plan how a dispute is raised. A supervisor who disagrees should be able to say so in the record, with a reason, without calling a meeting. The safety lead then reviews the report, rules on it, and records the ruling. If the matter is still contested, the plant should have a defined next step, such as taking it to the operations manager or to the safety committee where one exists.

Protect against pressure on ratings. In some plants, a low rating avoids scrutiny and a high one invites it, so people may be tempted to adjust the number. Reviewing a sample of rating changes each quarter and comparing them with the descriptions on the scale can show whether the plant is rating consistently. Do not use rating counts alone to judge individuals, since the mix of events differs by area.

The exception to plan for is a rating change made without a reason. Decide whether the system should block it, and if it cannot, how the plant will detect and correct it. Add that behavior to the demonstration criteria.

**Illustrative example:** An unnamed Canadian manufacturer re-rates a near-miss from Low to Medium after a supervisor questions it. The log shows both ratings, the name of the safety lead who changed it, and a one-line reason about a blind corner. The scenario is hypothetical and not a customer result.

## Separate regulatory duties from the log

The incident log is an internal management tool. Duties to notify a government authority, an insurer, or a customer are a different matter, and the two should not be confused. A log entry alone does not establish that a required external notice was sent.

The safety lead owns this separation. The input is the set of regulations and contractual requirements that apply to the plant. The decision is which events require external notice and by when. The record is a regulatory checklist kept apart from the severity scale. The exception is that rules differ by province and may change, so the checklist needs a named owner and a review date.

The [ICC Safety page](https://isocertificationconsultants.ca/solutions/safety/) does not describe regulatory or authority reporting, so the plant should not assume the product handles it. Ask the vendor directly whether the software can flag events for external notice, whether it can produce information for a notice, and whether the plant remains responsible for deciding and filing. Record the answers in writing.

Provincial and federal rules differ, and the sources reviewed for this guide do not set out reporting deadlines. The Government of Ontario's [guide to health and safety committees and representatives](https://www.ontario.ca/page/guide-health-and-safety-committees-and-representatives) describes committees and representatives for Ontario workplaces, and it is not a statement of when an incident must be reported to the province. Plants in other provinces and federally regulated sites need to consult the authority that applies to them. Where in doubt, the plant should ask the authority or a qualified adviser.

Build the checklist from the plant's own situation. List each province or jurisdiction where the plant operates, the authority that applies, and the contact for questions. Add contractual duties, such as notice to a customer or insurer, where they exist. For each, note who decides, who files, and where the filing is recorded. Link the filing to the incident record so the log shows what external steps followed.

Keep the severity scale and the checklist apart. A rating describes harm for internal prioritization, and an external duty may be triggered by facts the rating does not capture. The reviewer should check each report against the checklist as a separate step, and should record the answer even when the answer is that no external notice is needed.

Train reviewers on the checklist with two or three worked examples from the plant's own history, so the extra step is understood and not skipped under time pressure. Review the checklist on a schedule. Rules and contacts change, and a checklist that was correct two years ago may not be today. Assign an owner, set a date for the next review, and record each review in the plant's document control, so there is evidence the checklist is maintained.
