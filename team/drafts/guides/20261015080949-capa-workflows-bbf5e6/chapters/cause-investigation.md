---
slug: cause-investigation
title: 'Investigating root causes: CAPA software workflows'
description: >-
  Investigating root causes in CAPA software: defining the investigation
  question, collecting evidence before conclusions and testing competing causes.
primaryKeyword: CAPA software
keywords:
  - CAPA software investigating root causes
  - CAPA software
  - corrective action workflow
  - effectiveness review
author: ISO Certification Consultants Editorial Team
date: '2026-10-19'
imageBrief: >-
  two quality inspectors reviewing a weld inspection record beside a fabrication
  cell; authentic manufacturing environment, no readable text or logos
sourceIds:
  - apg-review-closing
  - apg-documenting
capabilityIds: []
---
## Defining the investigation question

A root cause investigation goes wrong most often at the very start, when the question is vague. "Why did this happen?" invites a list of everything that could have contributed. A sharper question narrows the work and gives the software something concrete to record. Before anyone collects data, the workflow should capture the question the investigation is meant to answer.

The ISO and IAF guidance on [documenting a nonconformity](https://committee.iso.org/files/live/sites/tc176sc2/files/documents/ISO%209001%20Auditing%20Practices%20Group%20docs/Auditing%20General/APG-DocumentNonconformity2015.pdf) explains why the starting statement matters. It says the statement of nonconformity drives the cause analysis, correction and corrective action, so it should be precise, unambiguous and not a restatement of the evidence. The same principle applies to internal findings. If the statement says "bracket out of tolerance," the investigation could wander through every operation in the plant. If it says "hole position on the bracket exceeded the drawing tolerance on parts from one machine over a defined period," the team knows where to look.

Frame the question around the requirement that was not met, the place and time the deviation appeared, and what is known to be different from when it did not appear. Good questions have a boundary. They ask what changed, where the process could have allowed the deviation and why existing controls did not stop it. That last part is easy to forget. A finding usually passed through at least one control that should have caught it, and the failure of that control is part of the cause.

The ISO and IAF paper on [reviewing and closing nonconformities](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ReviewNonconformity.pdf) adds two points that belong in the question. It says corrective action cannot be taken without first determining the cause, and it says the need for full root cause analysis should be judged from the nature of the finding and whether it appears to indicate a systemic failure. Not every finding warrants a deep investigation. A software workflow should let the investigation lead record the chosen depth, along with the reason, so that a minor, isolated finding is not forced through the same process as a recurring one.

Evaluate what the software asks at the opening of an investigation. Look for these features:

- **Question field:** A required, editable statement of what the investigation will answer, linked to the finding's statement of nonconformity.
- **Depth selection:** A recorded choice of investigation depth with a reason, so reviewers can challenge a shallow approach to a recurring problem.
- **Team and owner:** A named investigation lead and the people consulted, with dates.
- **Recurrence check:** A view of earlier findings against the same process, so the team can see whether the question has been asked before.

> **Key Consideration:** Ask the vendor to show how the investigation question is changed midway. Investigations often start with the wrong question, and a system that locks it hides the correction instead of recording it.

**Illustrative example:** The unnamed machining manufacturer's investigation lead, a process engineer, writes the question as: "Why did hole position on the bracket exceed the drawing tolerance on parts from one machine, and why did the in-process check not catch it?" The recurrence view shows two earlier findings on the same feature, so the lead records a full investigation, not a quick correction, and notes the reason.

## Collecting evidence before conclusions

Teams are tempted to name a cause in the first meeting. The senior operator remembers a similar problem, a plausible explanation circulates, and the investigation turns into a search for confirming facts. Good workflows slow that instinct and make the team gather evidence first.

The ISO and IAF paper on [reviewing and closing nonconformities](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ReviewNonconformity.pdf) is direct about the risk. It says the organization should not identify the first failure factor it finds as being the root cause, and that an iterative process should be used to decide which factor is the actual one. For a software buyer, the implication is that the system should hold evidence as a body of material, not a single comment box.

Evidence in a manufacturing investigation takes many forms. It can include measurement data, machine settings, maintenance records, tooling changes, operator and shift information, material certificates, inspection history, photographs of the part and notes from interviews with the people who ran the process. Each item should be attached to the investigation with a description of what it shows and who collected it. Evidence gathered from the work area soon after the event is worth more than evidence reconstructed weeks later, so the workflow should prompt for collection while the situation is fresh.

Pay attention to what is missing. If the process does not record a variable that might matter, such as coolant condition or fixture wear, the investigation will hit a wall. Record the gap as a finding in its own right and consider a follow-up action to start collecting that data. A mature workflow turns an undetermined cause into a future improvement instead of a dead end.

The following items help evaluate how a system supports evidence collection:

1. **Structured attachments:** Files, measurements and photos linked to the investigation, each with a source and a description.
2. **Collection tasks:** Assignable tasks to gather specific evidence, with owners and dates.
3. **Gap recording:** A way to log evidence that could not be obtained and why.
4. **Interview notes:** A place for statements from operators and supervisors that does not mix opinion with measured fact.
5. **Separation of stages:** A clear divide between collecting evidence and stating a conclusion, so the second does not appear before the first is complete.

Think too about who reads the evidence. A second reviewer should be able to follow the trail from the finding to the data without asking the investigator to explain it. If the trail depends on the investigator's memory, the record has failed its purpose.

**Illustrative example:** For the bracket finding, the investigation lead assigns three collection tasks: pull the machine's offset history, retrieve tool change records and gather measurement data for every lot since the last in-tolerance check. The maintenance record shows a fixture was replaced shortly before the first deviation. The lead also records that the process does not log fixture clamping force, noting it as a data gap.

## Testing competing causes

Most real problems have more than one plausible explanation. The discipline of a good investigation is to keep several candidates in play, test each against the evidence and retire those that do not hold. Software can make that discipline visible, or hide it if it only offers a single field labeled "root cause."

The ISO and IAF paper on [reviewing and closing nonconformities](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-ReviewNonconformity.pdf) describes a practical method. Possible factors are listed and examined against the nonconformity, then categorized as "not able to confirm," "possible" or "confirmed." The factor and its category are recorded. For factors in the first category, records should also show the analysis performed and the conclusions that led to the categorization. Further work then determines whether the possible or confirmed factors are the actual root cause. The paper is guidance for auditors working with ISO 9001:2015, but the method is a useful model for any plant.

The same paper names common techniques, from simple brainstorming to more systematic approaches such as root cause analysis, fish-bone diagrams and the "5 Whys." The choice of technique should fit the problem. A fish-bone diagram helps when many categories of cause are possible, while a short chain of why-questions suits a problem with a clear path. Evaluate whether the software supports the techniques your team uses, but do not let the tool drive the method. A diagram that looks complete is not evidence that the causes were tested.

A competing-cause table is a simple way to keep the work honest. A line for each candidate cause records the test applied, the result and the status.

| Candidate cause | Test applied | Result | Status |
| :--- | :--- | :--- | :--- |
| Worn fixture locating pin | Measure pin and compare with drawing | Within limits | Not a cause |
| Offset change at setup | Review offset history and setup sheet | Offset shifted after setup | Possible |
| Replacement fixture clamped differently | Repeat run with controlled clamping | Deviation reproduced | Confirmed |
| Inspection frequency too low | Review sampling plan against shift data | Sampling missed the affected period | Possible contributing cause |

Check also for systemic origins. The same paper advises asking whether the cause was systematic or merely accidental, and warns that treating a systematic failure as a one-off means the corrective action will not succeed. For a plant, this means asking whether the setup instruction, training, fixture control or sampling plan allowed the event, not only which person made the error.

Ask each vendor to show a competing-cause record in a demonstration. The reviewer should be able to see rejected causes and the reasoning behind each, and the final status should be a result of recorded testing rather than a free choice.

**Illustrative example:** The unnamed manufacturer's team lists four candidate causes. Two are retired after measurement and testing, one remains possible, and one is confirmed when a controlled repeat run reproduces the deviation. The team notes that the sampling plan is a contributing cause because it missed the affected period, and it records that as a separate item so it is not lost when the main cause is named.

## Recording the accepted cause

When the evidence supports a conclusion, the team must write it down in a form that others can understand, challenge and act on. The accepted cause is the hinge of the whole workflow: actions are planned against it, effectiveness is judged against it, and future investigations may look it up. A weak statement here weakens everything after it.

A good cause statement is specific and testable. It describes the mechanism, not just the area. "Operator error" says little and points toward retraining by default, while "the replacement fixture was clamped with a different method than the setup instruction describes, and the instruction did not specify clamping force" points toward a process and document fix. The ISO and IAF paper on [documenting a nonconformity](https://committee.iso.org/files/live/sites/tc176sc2/files/documents/ISO%209001%20Auditing%20Practices%20Group%20docs/Auditing%20General/APG-DocumentNonconformity2015.pdf) shows an example report form with a separate section for the root cause analysis, asking how and why the event happened, apart from the correction and the corrective action. That separation is worth keeping in any software configuration.

Record the supporting evidence with the statement. Each accepted cause should list the tests and facts that justify it, the candidate causes that were rejected and any contributing causes. Add the confidence of the conclusion where the evidence is incomplete. The review paper categorizes factors as possible or confirmed and asks for the analysis and conclusions to be recorded. A system that allows only a confirmed cause forces teams to overstate their certainty.

Review before acceptance. Someone other than the investigation lead should read the cause statement against the evidence and decide whether it is supported. This review is a decision with an owner, a date and a record, and the software should treat it that way. The reviewer should have the power to return the investigation for more work, and the return should be visible in the history.

Finally, consider reach. Cause analysis can show that similar problems may exist elsewhere, and the review paper notes this can feed risk-based planning. The workflow should therefore let the team flag other processes, products or sites that may share the cause, and assign follow-up. Without that step, the plant fixes one machine and leaves the same weakness on the others.

Use these questions to evaluate the system's handling of the accepted cause:

- **Statement quality:** Does the form prompt for a mechanism, supporting evidence and rejected alternatives, or only a short text box?
- **Confidence levels:** Can a cause be marked possible or confirmed, with the next step recorded?
- **Independent review:** Is there a separate approval step for the cause, and can it return the work?
- **Wider impact:** Can the team flag other processes that may share the cause and assign checks?
- **Link to actions:** Does each action refer to the cause it addresses, so unrelated actions are visible?

**Illustrative example:** The unnamed manufacturer records the accepted cause as: "The replacement fixture was clamped using a method not described in the setup instruction, and the instruction did not state a clamping requirement." The quality supervisor reviews the evidence, accepts the statement, and flags two other machines that use the same fixture type for a follow-up check.
