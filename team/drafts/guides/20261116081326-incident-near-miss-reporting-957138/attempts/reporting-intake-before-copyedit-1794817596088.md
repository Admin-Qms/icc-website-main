---
slug: "reporting-intake"
title: "Design reporting intake for incident and near-miss reporting software"
description: "Designing intake in incident and near-miss reporting software: define report fields, enable anonymous floor reporting, and make the report easy to start."
primaryKeyword: "incident and near-miss reporting software"
keywords:
  - "incident and near-miss reporting software intake"
  - "incident and near-miss reporting software"
  - "near miss reporting"
  - "workplace incident log"
author: "ISO Certification Consultants Editorial Team"
date: "2026-11-16"
imageBrief: "A floor operator scanning a posted QR code beside a machine cell; authentic manufacturing environment, no readable text or logos"
sourceIds:
  - icc-safety
capabilityIds: []
---
## Define the report fields

The first screen a reporter sees decides whether the report is filed at all. A long form invites abandonment, and a short one invites vague answers. The aim is a first report that a person can finish in a minute or two at the point of work, with the detail added later by someone whose job is to ask follow-up questions.

Start with the minimum that makes a report useful: what happened, where it happened, when it happened, who was affected, and whether anyone was hurt or equipment damaged. Add a free-text field for anything else the reporter wants to say. Resist adding more required fields until the plant has evidence that they are needed, because every required field is a reason to stop.

Separate three groups of fields:

- **Reporter fields,** completed at the floor: description, location, time, a yes or no on injury or damage, and an optional photo.
- **Reviewer fields,** completed when someone first reads the report: category, severity and routing.
- **Investigator fields,** completed later: causes, evidence and conclusions, covered in a later chapter.

Keeping the groups apart protects the reporter from questions only an investigator can answer. It also keeps ownership clear, because each group has a named role.

The [ICC Safety module page](https://isocertificationconsultants.ca/solutions/safety/) describes incident and near-miss reporting in the product and a severity set from the level of harm. The page does not list the fields on the form. That detail is a question for a demonstration: which fields are standard, which can the plant add or remove, and can the wording be changed to match how the floor talks? The page's setup description mentions configuring fields, checklists, terminology and routing, so ask the vendor to show a field being renamed or added with an example from the plant.

Choose wording carefully. A field called "incident category" means little to someone who has just seen a forklift nearly strike a rack. "What happened?" with a short pick list of the plant's most common event types works better. Test the draft form on three or four people who did not help write it and watch where they hesitate.

**Illustrative example:** An unnamed Canadian manufacturer drafts a form with eleven required fields. In a trial, a floor operator spends several minutes on it, then gives up and tells a supervisor instead. The team cuts the required fields to five, moves the rest to the reviewer, and the next trial takes about a minute.

Think about how the form handles the reporter's own words. Free text is valuable because it captures detail nobody anticipated, but it is hard to count. A short pick list for event type, combined with a free-text description, gives the plant both. Review the pick list after a few months and add the types people keep writing in the free-text box, so that the list follows the plant's reality rather than an early guess.

Record the final form as a specification: field name, who completes it, whether it is required and what values it accepts. Review it again after the first month of use, using the reports actually received to see which fields were skipped, which were misread and which were never used.

## Support anonymous floor reporting

Some people will not report under their own name. They may fear blame, worry about a colleague or doubt that anything will change. An anonymous route can recover reports that would otherwise be lost, but it needs a policy as well as a button.

The [ICC Safety page](https://isocertificationconsultants.ca/solutions/safety/) describes a QR code on the floor that opens an anonymous report form, with no login needed, and says anonymous reports appear in the dashboard marked as anonymous. Those statements describe how the product is published. The plant should confirm them in a demonstration and then decide how to use them.

Begin with the policy question: when is anonymous reporting accepted, and what does the plant promise a person who uses it? A common approach is to accept anonymous reports for any event or condition, state clearly that the plant will act on the content without trying to identify the reporter, and make sure supervisors know not to hunt for the source. That promise only works if the system and the people uphold it. Ask the vendor what information is recorded with an anonymous report and who can see it.

Decide who reads anonymous reports first. If they go straight to the supervisor of the area named in the report, the reporter may be identifiable by elimination. Many plants route them to a safety coordinator or a small group outside the line. Whatever the choice, write it down and tell the floor.

Protect the reporter's identity beyond the form. If a photo shows a person's face or a name tag, the report is no longer anonymous in practice. Add a short line to the form reminding reporters to avoid including names or identifying details, and give reviewers a way to remove such details from an attachment before it is shared more widely.

Follow-up is the hardest part. An anonymous reporter cannot be asked what they meant. Plan for that by making the form itself ask for the details an investigator will want, such as exact location and what the reporter saw, and consider a visible way of showing what happened afterward. A board near the entry showing recent anonymous reports and the actions taken lets the reporter see the result without being identified.

Watch for misuse as well as underuse. A small number of anonymous reports may be personal complaints, or may name a colleague. Decide in advance how the plant handles a report that is really about a person rather than a condition. Often the right step is to route it to human resources under that function's own process and to record in the log that it was redirected and by whom.

Check what the page does not say. It does not describe how an anonymous reporter receives a reply or how anonymity is protected if only a few people use a given area. Add both to the open-questions list.

## Make reporting reachable on the floor

A good form is useless if it cannot be reached when the event happens. The plant's old process, a form kept in an office and a supervisor who may be elsewhere, is exactly the barrier the ICC page describes when it says, on its [Safety module page](https://isocertificationconsultants.ca/solutions/safety/), that near-misses go unreported because reporting needs finding a form and a supervisor. The design goal is to remove that barrier.

Walk the floor with the form in hand. Choose access points where events actually occur: beside machine cells, at dock doors, near storage racks and in maintenance areas. A QR code on a post at eye level is cheap to place, but the plant should test it rather than assume. Check lighting, whether people wear gloves, whether phones are permitted in the area and whether the signal is reliable at that spot. A dock door at the edge of a building may have poor coverage, and a clean room may not allow phones at all.

Provide an alternative where a phone is not possible. This might be a shared tablet at a station, a terminal at the entrance, or a paper card that a supervisor enters on the same shift. The point is that every route ends in the same log. A paper card that sits in a drawer for a week reintroduces the old problem, so name the person responsible for entering cards and the deadline for doing so.

Think about language. Many plants have workers who read different languages with different levels of confidence. Ask whether the form can be shown in more than one language and whether the plant's own terms can be used. The page mentions configuring terminology, so ask for a demonstration of that with an example. Use plain words and avoid abbreviations only the safety team understands.

Check the page's list of what it does not state, including PIN access and notifications. For plants where some people have no personal device and no login, those details matter, so put them in writing as questions for the vendor.

Maintain the access points once they are placed. Posters fade, codes get covered by dirt or removed during repainting, and a code that no longer scans looks like a sign that nobody cares. Assign someone to check each access point on a regular schedule and to record the check, so a broken one is found by the plant before a reporter finds it.

Keep the form and the access points consistent across shifts and areas. A person who moves from one area to another should find the same layout, the same wording and the same steps, so that the routine learned once works everywhere.

Pilot the access points in one area first. Ask the people who work there to file a few test reports, and ask them what was awkward. Adjust placement and wording before extending to the rest of the plant. Keep the signs short and consistent, so a person who learns the routine in one area can use it in another.

## Review new reports on arrival

A report that is filed and then ignored does more harm than a report that was never filed, because the reporter learns that reporting is pointless. First review is where the process shows people that their report was read.

Set a target for first review, such as the same shift or the next working day, and name an owner for every shift. The target should reflect the plant's rhythm. A plant running three shifts needs a reviewer, or at least a defined holder, on each. Where a role cannot be present, name a backup and state what the backup may do, such as acknowledging the report, flagging anything urgent and passing it on.

At first review, the reviewer makes a short set of decisions:

1. Is the report complete enough to act on, or does it need a question?
2. Which category fits: incident, near-miss or hazard report?
3. What is the severity, using the plant's scale, covered in the next chapter?
4. Does it need immediate attention, an investigation or only a record?
5. Who is told?

Each decision should leave a trace. Recording that a named person reviewed the report, on a given date, is itself evidence. Even when the answer is "no action needed," the reason should be written, because that reason will matter if a similar event occurs later.

Duplicates are common. Several people may report the same condition in different words, and the reviewer should link them to one record rather than create several. Ask the vendor to show how related reports are connected, and whether the original wording of each is kept. Counting each report separately would hide the fact that the same hazard was seen by many people, and that fact has meaning for severity and priority.

Measure first review from the log rather than from impressions. The time between a report being filed and being reviewed, and the share of reports reviewed within the target, are simple figures the plant can compute from its own records. Look at them by shift as well as in total, because an average can hide a night shift where reports routinely wait until morning.

Give feedback to the reporter wherever the identity is known. A short message, such as "received, rated, assigned to maintenance," costs little and keeps people reporting. The [published page](https://isocertificationconsultants.ca/solutions/safety/) does not state notifications or alerts, so ask the vendor how a reporter or a reviewer is told something has happened, and make that a scored criterion.

Close the chapter's work by testing the whole intake path with the plant's sample reports: file one from the floor, file one anonymously, review both and check that the log shows the reviewer and the date. Plants in Ontario that have a joint health and safety committee may also need to consider what the committee sees; the Government of Ontario's [guide to health and safety committees and representatives](https://www.ontario.ca/page/guide-health-and-safety-committees-and-representatives) describes that role, and the plant should confirm its own obligations with the authority that applies to its site.
