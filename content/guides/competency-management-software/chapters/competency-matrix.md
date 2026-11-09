---
slug: competency-matrix
title: Define task requirements and the competency matrix
description: >-
  Defining roles and competency requirements in competency management software:
  mapping operational tasks and defining qualification criteria.
primaryKeyword: competency management software
keywords:
  - competency matrix task requirements
  - competency management software
  - training records
  - competency matrix
author: ISO Certification Consultants Editorial Team
date: '2026-11-05'
imageBrief: >-
  A production operator reviewing a controlled checklist at an assembly station;
  no readable text or logos.
sourceIds:
  - apg-competence
  - icc-training-competence
capabilityIds: []
wordCount: 2036
readTime: 11
image:
  src: /images/guides/competency-management-software/competency-matrix.webp
  alt: >-
    A production operator reviewing a controlled checklist at an assembly
    station; no readable text or logos.
  width: 1200
  height: 675
  source: openai
  sourceId: de6165d8b82fec13bde2bb361903bed1267963d883d66e0e11d70d54291eb8ec
  sha256: de6165d8b82fec13bde2bb361903bed1267963d883d66e0e11d70d54291eb8ec
  licenseUrl: 'https://openai.com/policies/terms-of-use/'
---
## Map tasks to necessary competence

A competency matrix is only as good as the task definitions behind it. Before any person is rated, the team has to say what each task is, what result it must achieve, and what a person needs to know and do to achieve it. The Auditing Practices Group describes this as the first part of the competence cycle in its [guidance on auditing competence](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Competence.pdf): determine the necessary competence, take actions to acquire it, evaluate whether those actions worked, and retain documented information.

The guidance was written for auditors working with ISO 9001:2015 clause 7.2, and it frames competence as the ability to apply knowledge and skills to achieve intended results. That definition points to the right starting question. What result is this task meant to achieve?

### Define the task before the person

Start from the work instructions, process specifications, and customer or regulatory requirements that already govern the cell. For each task, write down four things.

1. **The intended result.** For example, an inspection that correctly accepts or rejects a part against its drawing.
2. **The knowledge and skills needed.** Reading the drawing, selecting and using the gauge, recognizing a marginal result, and knowing when to escalate.
3. **The operating scope.** Which product families, equipment, shifts, or conditions the task covers.
4. **The owner.** The process owner who approves the definition and answers questions about it.

The operating scope is easy to skip and costly to omit. A change in work can change what competence is needed. Inspecting one product family does not automatically qualify a person to inspect a different, unfamiliar one. If the matrix has a single row called "inspection," it cannot tell a supervisor which kind of inspection a person may do.

If a task's scope or intended result is unclear, the process owner resolves the ambiguity, and approval of that task requirement waits until both are stated.

**Illustrative example:** An unnamed Canadian manufacturer of machined components defines first-article inspection of one bracket family as one task and first-article inspection of a different, unfamiliar family as another. Both use the same gauges, but the second family has tolerances and features the first does not. The process owner approves both definitions and records the owner and date.

### Separate knowledge from the task

The APG paper notes that knowledge is an input to competence, and that knowledge needed for processes under clause 7.1.1 is one input to it. When defining a task, list the knowledge it relies on, such as how to read a drawing or interpret a gauge reading, so that learning content can be matched to it later. Keep the task definition short enough that a supervisor can read it at the cell. A page of narrative that nobody consults does not help the staffing decision.

| Task element | Question to answer | Typical source |
|---|---|---|
| Intended result | What must be true when the task is done correctly? | Drawing, specification, customer requirement |
| Knowledge and skills | What must the person know and be able to do? | Work instruction, process owner |
| Operating scope | Where does this definition apply and where does it stop? | Product family, equipment, shift |
| Exceptions | What triggers escalation or a stop? | Control plan, reaction plan |

### Test the definitions against the matrix

When the team evaluates software, the question is whether the proposed matrix can distinguish tasks with different operating scopes. The [ICC training and competency module page](https://isocertificationconsultants.ca/solutions/training-competence/) describes a competency matrix that shows who can do what. Confirm in a demonstration that two tasks with the same equipment but different scopes can be represented separately. Do not assume that a matrix built for roles will also handle tasks, and do not assume a particular data structure. Ask the supplier to build your two inspection tasks live.

## Define levels and qualification conditions

Once tasks are defined, the matrix needs a scale. A level is a statement about what a person has demonstrated, and it must mean the same thing to every supervisor who reads it. The ICC page describes a competency matrix with levels the customer defines and bulk updates for a whole team. Those two points together create a design responsibility: if the customer defines the levels, the customer must define them well, and if updates can be made in bulk, the definitions must be strict enough that a bulk change cannot casually promote a team.

### Write level meanings in terms of evidence

Avoid vague labels such as beginner, intermediate, and expert unless each one is tied to what a person has shown. A level definition should state what the person may do, under what supervision, and on what evidence. A simple four-level scale illustrates the idea.

| Level | Meaning | Evidence threshold |
|---|---|---|
| Not assessed | No practical evaluation recorded | None |
| Working under supervision | May perform the task with a qualified colleague present | Learning complete and a first practical evaluation recorded |
| Independent | May perform the task without supervision | Practical evaluation by an authorized assessor against the current instruction |
| Can assess others | May evaluate and sign off colleagues | Independent level plus assessor authorization approved by the process owner |

The quality lead and process owner retain the approved definitions, evidence thresholds, and applicable qualification conditions as a record. These labels are examples to adapt, not product settings. The point is that every level carries an evidence threshold the team agreed on in advance. In the previous chapter, the decision states evidenced, awaiting assessment, and evidence missing described one person's status for one task. Levels describe how much the person has shown. Keep the two ideas distinct. A level whose evidence has been invalidated no longer authorizes independent work, whatever the grid still shows.

**Illustrative example:** The hypothetical manufacturer defines an independent-inspector level only after the quality lead and the process owner agree what evidence supports it: completed learning, a recorded practical evaluation on the current instruction, and a second review by quality. A bulk update that would raise an entire team to that level is stopped until the evidence exists for each person.

### Keep competence and qualification apart

The [APG paper](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Competence.pdf) distinguishes between competence and formal qualification. It says qualifications are not always required but competencies are, and it gives welders for specific welding conditions as an example where a qualification may be required.

The organization should determine such qualification requirements and be able to demonstrate that people have acquired and maintained them.

For the matrix, this means a task may carry two kinds of requirement. One is a competence the plant assesses itself. The other is a formal qualification, where one applies, with its own scope and conditions. Record both, and do not let the first stand in for the second. A person assessed as independent on a welding task who lacks the qualification a statute or customer requires must not be shown as clear to weld.

The team should therefore ask three things for each task.

- Does any statute, standard, customer, or other requirement call for a recognized qualification?
- What scope does that qualification cover, and what conditions apply?
- Who confirms that the qualification is current, and how?

When the answer to the last question is unknown, the matrix should show the qualification as unconfirmed. This chapter proposes a conservative rule: a required qualification, or its scope, that cannot be confirmed blocks assignment until someone resolves it.

Review the scale after a few weeks of use. If supervisors keep asking what a level means, the definition is too vague. Change a definition only through the same approval path that created it, and note which people the change affects.

### Ask how the system holds levels and conditions

During evaluation, ask the supplier how levels, evidence, and applicable conditions would be associated. The published description says levels are user defined; it does not describe how evidence or qualification conditions attach to them. Do not assume a data model. Provide the table above and ask the supplier to configure it, then check three points.

1. Can the levels be given the meanings written by the team, rather than only generic labels?
2. Can a reviewer see which evidence supports a person's level?
3. Can a required qualification be recorded separately from the level, with its own status?

If the answer to any is no or not shown, record it as an open question. A matrix that cannot show the evidence behind a level only repeats the claim. The APG paper says the existence of training plans and records is not sufficient, on its own, to show how an organization ensures competence, and the same applies to a colored cell in a grid.

## Assign ownership and control changes

A matrix drifts when nobody owns it. Tasks change, equipment is replaced, instructions are revised, and people move. The third task of this chapter is to decide who is accountable for the definitions, who decides a person's status, and what happens when work changes.

### Separate two decisions

Two different decisions are easy to blur. One is what the task requires. The other is whether a particular person meets that requirement. They need different owners.

| Decision | Typical owner | Why separate |
|---|---|---|
| Define or change the task requirement and levels | Process owner, with quality review | Requires knowledge of the work and its risks |
| Decide a person's competence status | Authorized assessor or supervisor, confirmed by quality as defined | Requires observation of that person |
| Maintain the matrix configuration and access | Workflow owner and administrator | Requires control of who can change what |

A process owner who can both rewrite a requirement and promote a person against it can quietly make the gap disappear. The [APG paper](https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Competence.pdf) notes that competence information may exist locally at each process or at a central function such as human resources. Whichever applies, write down which role controls which decision, and name a backup for each so the workflow does not stall during an absence.

### Review the matrix when work changes

As a local rule, a new contract, process, product, or piece of equipment should trigger a short review of the matrix. The APG paper itself says competence verification may need to be monitored or repeated. When a task or level changes, the process owner should answer four questions.

1. Which task definitions does the change touch?
2. Which people hold a status for those tasks?
3. Does the existing evidence still cover the revised task?
4. If it does not, what is the interim rule for those people?

Where the answer to the third question cannot yet be determined, record the effect as unresolved and apply the interim rule rather than leaving statuses untouched. Placing affected people on supervised work until the review finishes is a conservative choice the team can adopt in advance. A level whose evidence has been invalidated does not authorize independent work.

**Illustrative example:** In the hypothetical plant, a revised inspection method adds a new gauge. The process owner approves the revised task definition, lists the people who hold the independent level on that task, and requires supervised work until a practical evaluation on the new gauge is recorded. The alternate's existing evidence is reviewed first, and the change decision is filed with the affected task list.

Name an owner for the matrix itself as well as for the tasks. That person checks on a schedule—for example, quarterly—that every task has a current owner, that no task refers to a retired instruction, and that people who left the cell no longer appear as available. A short checklist for this review keeps it from becoming a debate each time.

### Record the change decision

Keep a record of each change: what was changed, why, who approved it, and which people were affected. The record does not need to be elaborate, but it must let a reviewer reconstruct why a person's status shifted on a particular date. During a demonstration, walk through a changed inspection method and ask the supplier to show how affected people and decisions would be identified. If the system cannot list the people tied to a revised task, the team will need a manual step, and the results sheet should say so.

> **Important:** Treat bulk updates with care. A feature that updates a whole team at once is useful for a real, evidenced change, such as a revised target level, and risky when used to clear a backlog. Require a recorded reason for every bulk change.
