---
slug: mapping-workflows
title: Map how incidents and near-misses are reported today
description: >-
  Mapping the current process for incident and near-miss reporting software:
  define the problem, trace reports and handoffs, and assign owners and
  decisions.
primaryKeyword: incident and near-miss reporting software
keywords:
  - incident and near-miss reporting software workflow
  - incident and near-miss reporting software
  - near miss reporting
  - workplace incident log
author: ISO Certification Consultants Editorial Team
date: '2026-11-16'
imageBrief: >-
  A quality lead and a supervisor walking a press line with a paper incident
  log; authentic manufacturing environment, no readable text or logos
sourceIds:
  - icc-safety
  - ontario-jhsc-guide
capabilityIds: []
---
## Define the reporting problem

A plant may already collect reports of incidents and near-misses. The trouble can be how they arrive. A note on a clipboard, a message to a supervisor, an email to the safety coordinator, and a comment at a shift meeting all describe real events, yet none of them lands in one log. Incidents and near-misses reported on paper or by email may not be consistently logged, rated for severity, or linked to corrective action. That sentence is the problem statement for this guide, and every later chapter returns to it.

Write the problem down in operating terms before looking at any product. Ask three plain questions. How many different places can a report start? Who decides whether it is written down? What happens to it afterward? The answers show whether the plant has a reporting process or a collection of habits.

The ICC [Safety module page](https://isocertificationconsultants.ca/solutions/safety/) describes the same pattern from the vendor's side. It says near-misses go unreported because reporting means finding a form and a supervisor; investigations start from a blank page after an incident; and a safety committee may not see patterns early. Read this as the vendor's description of a common problem, not as measured data about any plant. Use it to prompt questions in the plant being studied.

Definitions come next, because software cannot log what the team has not defined. Agree on wording for three categories:

- **Incident:** an event that caused harm, damage, or a stoppage.
- **Near-miss:** an event that could have caused harm but did not.
- **Hazard report:** a condition someone noticed before any event occurred.

Some teams combine the second and third categories; others keep them apart. Either choice works if it is written down and the floor understands it. A person with a clipboard should be able to say which category fits without calling anyone.

Assign an owner to the definitions. This is usually the quality or safety lead, who also decides the doubtful cases. Record the decision about each doubtful case as a short example so the next person can see the reasoning.

**Illustrative example:** An unnamed Canadian manufacturer finds three differently worded notes about the same missing guard fastener on one line. One sits on a clipboard, one in an email, and one in a shift handover sheet. Nobody is certain whether the three notes count as one near-miss or three. The safety lead writes a rule that reports describing the same condition and location are linked to a single record, and adds the three notes to the log as one entry with three sources.

Test the definitions against recent history. Take the last ten reports the plant received, in whatever form, and sort each one into a category. Where two people sort the same report differently, the definition is not yet clear enough. Adjust the wording until the sorting agrees, then keep the ten reports as training examples for the floor. This small exercise also reveals how many events never became reports at all, which is useful context even when the exact number cannot be known.

The result of this step is a one-page problem statement and a short definitions sheet. Keep both. They become the first inputs to the acceptance criteria later in this chapter.

## Trace reports, records and handoffs

Next, follow one real report from the moment someone sees an event to the moment it is closed. Pick a recent report, ideally one that involved some back-and-forth, and collect every document it produced. Include the clipboard note, any email, any photo, the investigation notes, and the action that followed, if there was one.

For each step, write down five things: who did it, what they looked at, what they decided, what record resulted, and what happened when something went wrong. These five elements—role, input, decision, record, and exception—describe every workflow in this guide and give a consistent way to compare the current process with what software must support.

| Element | What to capture | Example prompt |
|---|---|---|
| Role | Who acts at this step | Reporter, supervisor, safety coordinator |
| Input | What that person has in hand | Floor note, photo, equipment tag |
| Decision | The choice made | Log it, rate it, escalate it, set aside |
| Record | What remains afterward | Log entry, email, form, action |
| Exception | What happens when the usual path fails | Supervisor absent, report unclear, nobody replies |

The [ICC Safety page](https://isocertificationconsultants.ca/solutions/safety/) names the same friction in its own description: finding a form and a supervisor is a barrier to reporting. Look for three kinds of weakness in the finished map.

**Retyping.** If the same facts are copied from a form to an email to a spreadsheet, every copy is a chance for error and delay. Mark each copy.

**Waiting.** Note every place a report sits until a particular person is available. A floor report that waits for a supervisor to return from a meeting is one example. These delays shape how willing people are to report at all.

**Dead ends.** Some reports go nowhere. A person submits a note, nothing visibly happens, and the reporter learns that reporting is pointless. Mark any step after which no record shows a decision.

Map the sad paths as carefully as the happy ones. Ask what happens to a report that arrives at night, one that names a person, one that is anonymous, and one that describes a condition outside the reporter's own area. The answers usually show that the process depends on a few individuals who know what to do, which is a risk the plant should name.

Capture the timing as well. For the sample report, note when the event happened, when it was first written down, when someone with authority saw it, and when the first decision was made. The gaps between those times show where the process loses speed. They also give a baseline that later chapters can use when judging whether any new tool helped, so record them now rather than reconstructing them after the new process is running.

Keep the map to one page. A map that needs three pages describes a process nobody can follow, and software will not fix that. If the team finds more than one parallel path, such as one for the main plant and one for a warehouse, map each separately and compare them. The differences are useful evidence about what the future design must allow.

## Assign owners and decisions

A map shows steps; a decision table shows accountability. Convert the map into a table with one row per decision and a named owner plus a backup for each. At minimum, assign owners for four decisions: whether a report is accepted into the log, how severe it is, who investigates, and whether corrective action is required.

Give every owner a backup. Safety work crosses shifts, and a decision that waits for one person's return is a reporting failure waiting to happen. Where the plant runs nights, name someone on nights, even if the authority is limited to holding the report until the day team arrives.

Think about authority as well as availability. An owner who cannot stop a machine, approve a repair, or commit a budget will pass the decision upward, so the table should say who has the authority in each case. Writing that down early prevents a stalled action later.

Regulation shapes some of these assignments. Where a joint health and safety committee or health and safety representative exists, the committee or representative has a defined role. The Government of Ontario's [guide to health and safety committees and representatives](https://www.ontario.ca/page/guide-health-and-safety-committees-and-representatives) describes that role for Ontario workplaces, including rules based on the number of workers. Other provinces and federally regulated workplaces have their own rules. Do not assume Ontario's requirements apply elsewhere; confirm the rules that apply to each site with the relevant authority. The ICC page mentioned earlier also does not describe regulatory duties, so those remain a separate question for the plant to answer.

Add the people outside the safety function. Maintenance often fixes the condition, production supervisors adjust work, and the quality team may track the resulting action. If those people are not in the table, the first corrective action will stall at a handoff nobody owns.

Include the reporter in the table. The person who sees the event is the first owner of the report and often the last to hear what happened to it. Decide who tells the reporter that the report was received and what became of it. Skipping this step may discourage reporting if nothing visibly follows.

The finished table is short but strong. Each row says who decides, what they need, what they record, and who steps in when they cannot. Review it with the owners themselves, not only with their managers, because the people doing the work will spot decisions the table missed.

## Set acceptance criteria for the software

Now convert the problem statement, map, and decision table into acceptance criteria. These are statements a demonstration can prove or fail to prove, and they keep the evaluation tied to the plant's own workflow rather than to a vendor's feature list.

Good criteria describe a path, not a feature. Compare these two:

- A weak criterion: "The software has a reporting form."
- A stronger criterion: "A floor worker files a report from the shop floor without logging in, the report appears in the log with a severity rating set from the level of harm, and a corrective action can be linked to it."

The stronger version matches what the [ICC Safety page](https://isocertificationconsultants.ca/solutions/safety/) publishes: incident and near-miss reporting, anonymous reporting from a QR code on the floor with no login, severity set from the level of harm, and corrective actions for incidents that need them carried into the Improvements module. It also matches the auditor view the page describes, which shows the log with severity and status, floor reports including anonymous ones, and the corrective actions linked to each incident.

Treat each of those descriptions as a question for a demonstration, not as a verified promise. The page is a published description. Capabilities should be seen working with the plant's own sample reports before anyone relies on them.

Write five to eight criteria. A workable first set might include:

1. A report can be filed from the floor, with and without identifying the reporter.
2. Every report is stored in one log with a status.
3. Severity is recorded, and a change to it is attributable.
4. A corrective action can be linked to an incident and viewed from it.
5. An auditor can follow one report from filing to closure.
6. Permissions separate who can file, review, and investigate.

Add the open questions the published page does not answer: pricing, notifications or alerts, regulatory reporting, and how existing logs would be imported. Putting these on the list now saves a surprise later.

**Illustrative example:** An unnamed Canadian manufacturer lists a criterion asking the vendor to show an anonymous floor report becoming a rated record with a linked corrective action. During the demonstration, the team uses a sample report about a wet floor near a loading dock. The criterion passes only if every step is shown with the plant's own wording and a named owner, so a generic screen does not count.

Rank the criteria so the evaluation team knows which ones are mandatory and which are desirable. Mandatory criteria are those the plant cannot operate without, such as filing a report from the floor and linking an action. Desirable criteria improve the work but have a workaround. Scoring against this ranking keeps a long, impressive demonstration from hiding a missing essential step. Record the ranking and the reasons, and have the owners agree to them before the first vendor call.

Decide, too, who attends each demonstration. At least one floor reporter, one investigator, and one action owner should watch, because each sees different weaknesses. Collect their written comments straight afterward, while the details are fresh, and attach them to the scoring sheet used in the next chapter.

Finish the chapter by sharing the criteria with the owners from the decision table. If one of them says a criterion misses how the work really happens, fix the criterion before a vendor sees it. The next chapter turns these criteria into a shortlist and a structured demonstration.
