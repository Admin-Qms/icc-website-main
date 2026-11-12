---
slug: due-dates-scheduling
title: Run due-date tracking and the calibration schedule
description: >-
  Running due-date tracking in calibration management software: set the
  schedule, notify owners, handle late items and use shop floor access for
  status.
primaryKeyword: calibration management software
keywords:
  - calibration management software due date tracking
  - calibration management software
  - equipment calibration register
  - calibration due date tracking
author: ISO Certification Consultants Editorial Team
date: '2026-11-12'
imageBrief: >-
  a line operator scanning an instrument label beside a guarded press; authentic
  manufacturing environment, no readable text or logos
sourceIds:
  - icc-calibration-maintenance
capabilityIds: []
---
## Turn intervals into a schedule

An interval in the register is a statement of intent. A schedule turns it into work that people can plan, assign, and complete. The distance between the two is where due dates are missed, so this section covers how to move from intervals to a working calendar and what to ask of software that is meant to help.

The [ICC calibration and maintenance page](https://isocertificationconsultants.ca/solutions/calibration-maintenance/) describes each piece of equipment in a register with its calibration interval and attached certificates, status labels such as due soon and in date, and an auditor view that includes the next due date. Those descriptions point to the minimum a schedule needs: an interval, a last calibration date, a next due date, and a status derived from them. Ask any candidate to show how the next due date is produced. Is it calculated from the date the calibration was performed, from the date the certificate was received, or entered by hand? Each choice produces a different date, and the team should decide which one its procedure intends before the system is configured.

Define the status values in plain language before looking at screens. A small set works well: in date, due soon, overdue, and out of service. Decide how many days ahead an instrument becomes due soon, and whether that window differs by class. A longer window suits an instrument that travels to an external laboratory. Write the windows next to the class definitions so that coordinators set them the same way every time.

The [NIST metrological traceability page](https://www.nist.gov/metrology/metrological-traceability) states that internal measurement assurance programs must establish the status of the measurement system and the reference at the relevant times; keeping the schedule current is this guide's own recommendation. Plan the workload, not only the dates. If many instruments were calibrated together when the program began, their next due dates will cluster, and the coordinator will face a spike. The team can spread the load by assigning slightly different intervals within an agreed range when instruments are next calibrated, or by calibrating a group early. Record any such adjustment and its reason on the instrument's record, so that a shortened interval is not mistaken for a mistake. Ask whether the system can show the schedule by week or month, filtered by owner or class, so the coordinator can see a spike before it arrives.

Treat external laboratories as part of the schedule. An instrument sent away leaves a gap on the floor, so the plan needs a loan instrument, a substitute, or a window in the production plan. Record the expected return date on the event. Ask whether the system can mark an instrument as out for calibration and keep it visible on the register, rather than letting it disappear from the list while it is away.

Decide who owns the calendar. The calibration coordinator may own the calendar, but the instrument owners need to agree to release their instruments. A short review each week, covering what is due in the coming period and what is overdue, keeps the schedule honest. Keep the review brief and written, using the register's own view.

Keep a record of how the schedule performed. At the end of each month, note how many calibrations were due, how many were completed on time, and how many were late, with the reason for each late item. These counts are for the team's own use and need a stated baseline before they are compared with anything. A late item with a recurring reason, such as a slow supplier or an unavailable loan instrument, points to a change in the workflow rather than a reminder to try harder. Ask whether the system can produce these counts from the register without manual tallying.

Decide how the team handles a calibration done early. If an instrument is calibrated well ahead of its due date, does the next due date move from the new calibration date or stay on the old cycle? The answer affects the workload spike discussed above, and it should be a written rule the coordinator can apply without asking. Test the rule in the demonstration with a record that has been calibrated early, and check that the system does what the procedure says.

**Illustrative example:** An unnamed Canadian manufacturer finds that twenty-two hand gauges fall due within the same two weeks because they were all calibrated together at the start of the program. The coordinator calibrates half of them a few weeks early, records the reason on each event, and sets the next due date from the new calibration date. The register's monthly view now shows an even spread. All situations in this chapter are hypothetical, and none describes a customer result.

## Notify and escalate

A due date that nobody sees does not protect anything. Notification is the link between the register and the people who must act, and it is also the part of the workflow where published descriptions say the least. The published [ICC calibration and maintenance page](https://isocertificationconsultants.ca/solutions/calibration-maintenance/) does not state whether due-date alerts or reminders exist, so the question belongs in writing to any vendor, including ICC.

Start by deciding who needs to know and when. The instrument owner needs to know that a calibration is coming so that the instrument can be released. The coordinator needs to know what is due across the plant. The quality lead needs to know what is overdue. Write these as three separate needs, because a single message to everyone becomes noise. Then decide how far ahead each person is told. An owner may need a few weeks to arrange a loan instrument, while a coordinator may need a monthly view.

Ask the vendor specific questions about notification:

- What triggers a message: a date, a status change, or a manual action?
- Who receives it, and can the recipient list be set by role?
- How far in advance does it arrive, and can the lead time differ by class?
- What happens if nobody responds: is there a second message or an escalation?
- Is the message recorded, so that the team can show it was sent?

If the answers are that the system displays status but sends nothing, that is not necessarily a reason to reject it. The team can design a manual routine, such as a weekly report that the coordinator circulates. What matters is that the team knows which it has and plans accordingly. A manual routine that is not written down depends on one person, so write it down and name a backup.

Escalation needs its own rule. Decide what happens when an instrument passes its due date without a calibration. A workable rule has three steps. First, the owner is told that the instrument is overdue and should not be used for acceptance decisions. Second, if no plan is recorded within a stated time, the coordinator raises it with the quality lead. Third, the quality lead decides whether to remove the instrument from service, authorize a short documented extension, or arrange urgent calibration. Each step should be recorded.

Be careful with extensions. An extension is a deliberate decision that someone with authority makes and records, with a reason and an end date. It is not a way to hide a late calibration. The register should show an extension as an extension, with the approver's name, so that anyone reviewing the record can see the difference between a controlled decision and an unexplained overdue item. Ask the vendor how an extension is recorded and whether it is visible on the instrument's status.

Review the notification rules after the first quarter of operation. Look at which messages led to action and which were ignored. A message that is routinely ignored should be changed or removed, because a crowded inbox hides the one message that matters. Record the changes, and the reason for each, so the rules evolve deliberately.

Consider how notification handles absence. If the coordinator is away, who receives the messages? A deputy should be named in the register, and the person who covers should be able to act without borrowing a colleague's login. Test this with a real absence scenario in the demonstration.

**Illustrative example:** At an unnamed manufacturer, a torque tool passes its due date while its owner is on leave. The register shows it as overdue, the backup owner is told, and the coordinator raises it with the quality lead. The quality lead records a decision to remove the tool from service until it is calibrated and tags it. The record shows who decided, when, and why.

## Use shop floor status

The people who use instruments see the schedule last, and they are the ones who can prevent an overdue instrument from being used. Shop floor status is therefore the final line of defense, and the design should favor speed and clarity over detail.

The published [ICC calibration and maintenance page](https://isocertificationconsultants.ca/solutions/calibration-maintenance/) describes QR labels on equipment that open its record on the shop floor, and PIN access for people without a desk login. Use these descriptions as a prompt for a trial in the team's own area. Print a label for one instrument and scan it with the device an operator would use. Check what appears first. An operator needs to know in seconds whether the instrument is in date, due soon, overdue, or out of service. The calibration certificate and the maintenance history can sit one step further in.

Define what an operator should do with each status. In date: use. Due soon: use, and tell the owner if a gauge is needed for a special job. Overdue: stop and report. Out of service: do not use. Put the instructions where the operator will see them, whether on the label, in the work instruction, or in a short card at the station. A status that nobody has been told how to act on is only information.

Make reporting easy. An operator who finds an instrument that looks damaged, reads oddly, or has no label should be able to say so without logging in to a full account. The ICC page mentions PIN access for people without a desk login, so ask how a report made that way is attributed and how it reaches the owner. An unattributed report is hard to follow up, and a report that reaches nobody is worse.

Think about areas with no device. A cell may have no tablet, and phones may not be allowed. In that case, the team may need a printed status board, updated weekly from the register, or a color-coded tag applied when an instrument is calibrated. Decide whether tags are part of the system or a backup, and who applies and removes them. If the tag disagrees with the register, the team should know which one governs.

Repeat the label trial after each change to labels or devices; the [module page](/solutions/calibration-maintenance/) is a starting reference. The trial is cheap, and it catches problems that no demonstration will.

Involve the operators in the design of the status display. Ask two or three of them what they look at first and what they would ignore. They will use the display every shift. Adjust wording, colors, and layout based on that feedback, and confirm that status is not conveyed by color alone, since some people cannot distinguish certain colors and a monochrome screen hides them entirely.

Finally, review how the floor sees the schedule at shift start. A short list of instruments due in the next few days, shown in the area, lets operators and supervisors plan around a calibration instead of discovering it on the day. Ask whether the system can produce an area view or printable list.

**Illustrative example:** An operator at the unnamed manufacturer scans the label on a bore gauge and sees it marked overdue. The card at the station says to stop and report, so the operator uses a PIN to flag the gauge, and the coordinator is told. The supervisor moves the job to a station with an in-date gauge. The record shows who reported the problem and when.

By the end of this chapter, the team has a schedule rule, a notification plan, an escalation path, and a tested floor view. The next chapter turns to what happens when a calibration result is not acceptable, and how the team contains the effects.
