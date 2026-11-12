---
slug: mapping-workflows
title: Map the calibration decision for every instrument
description: >-
  Mapping the current workflow in calibration management software: define the
  problem, trace records and handoffs, assign owners and set acceptance
  criteria.
primaryKeyword: calibration management software
keywords:
  - calibration management software workflow
  - calibration management software
  - equipment calibration register
  - calibration due date tracking
author: ISO Certification Consultants Editorial Team
date: '2026-11-12'
imageBrief: >-
  a quality technician walking a production line with a clipboard of instrument
  tags beside a CNC machine; authentic manufacturing environment, no readable
  text or logos
sourceIds:
  - icc-calibration-maintenance
  - apg-overview
  - nist-traceability
capabilityIds: []
---
## Start with the instrument that cannot be found

Every calibration program begins with a question that sounds simple and rarely is: Which instruments are in use today, which of them are up to date, and where is the evidence? Before any software enters the conversation, write that question down and answer it for one area of the plant.

A quality lead who cannot list the instruments in a single cell, name the person responsible for each, and point to the latest certificate has found the real starting point for the evaluation. Software that records calibration will only be as accurate as the list it is given.

Begin with a floor walk rather than a spreadsheet. Take the list the team already uses, whether that is a shared workbook, a binder of tags, or a folder of certificates, and compare it with what is physically in use at the workstations. Walk the area with the instrument owners where possible, since they know which items are really in use. The point of the walk is not to audit anyone. It is to learn how reliable the current list is.

The [ISO 9001 Auditing Practices Group](https://committee.iso.org/home/tc176/iso-9001-auditing-practices-group.html) page, published by ISO/TC 176 and the International Accreditation Forum, describes the group as an informal source of papers on auditing quality management systems and says the papers are non-definitive and are not required criteria for an audit. This guide does not rely on them for statements about audit practice.

The page lists papers on monitoring and measuring resources and on measurement traceability, but it does not summarize their content, so nothing in this chapter should be read as a statement of what those papers say. For the purposes of mapping, the recommendation is narrower: the team should be able to show how it identifies and controls the resources it uses to monitor and measure.

Use five elements to describe each decision in the workflow. They carry through the rest of this guide.

| Element | What to capture | Example prompt |
|---|---|---|
| Role | Who makes the decision | Calibration coordinator, instrument owner, quality lead |
| Input | What that person looks at today | Spreadsheet row, tag on the instrument, supplier certificate |
| Decision | The choice that results | Keep in service, send for calibration, hold or remove |
| Record | What remains afterward | Certificate, date, reviewer and next due date |
| Exception | What happens when the usual path fails | Instrument missing, certificate late or result unacceptable |

Decide which instruments are in scope and write down the reason for every exclusion. A reasoned exclusion is a decision; an instrument that is simply missing from the list is a gap. The reason should sit next to the item so that a new coordinator or an auditor can see it without asking.

**Illustrative example:** An unnamed Canadian manufacturer of machined components keeps its calibration list in one workbook. During a floor walk, a supervisor finds a dial caliper at an assembly station that appears nowhere in the workbook, and a second caliper in the workbook that nobody can locate.

The team records both as scoping gaps, asks the station owner whether the first instrument is used for acceptance decisions, and marks the second as missing until it is found or formally retired. All situations in this chapter are hypothetical, and none describes a customer result.

Two questions expose most weak points at this stage. Who may say that an instrument is fit to be used today, and what happens when that person is away? If the answers are unclear, a software evaluation will inherit the confusion.

A good outcome from the first section is modest: a list the team trusts for one area, an owner for every entry, and a short list of unanswered questions.

## Trace records and handoffs

Once the list of instruments is credible, follow one instrument through a full calibration event. The aim is to see every handoff between people, because handoffs are where certificates go missing and due dates are lost. Choose an instrument that has been through the cycle recently so that people can remember what actually happened rather than what the procedure says.

A typical path has these stages. Someone notices that an instrument is approaching its due date or that it has been damaged. A request is raised and the instrument is collected. It travels to an internal check or to an external laboratory.

A certificate or report is issued and returned, sometimes by email to one person and sometimes in the box with the instrument. Someone reviews the result, decides whether the instrument may return to service, and updates the register or the tag. Finally, the next due date is calculated and communicated to the owner.

Write each stage on a card, name the person who holds the instrument or the paper at that moment, and mark where two people have to agree.

The National Institute of Standards and Technology explains on its [metrological traceability page](https://www.nist.gov/metrology/metrological-traceability) that NIST adopts the international vocabulary definition: traceability is the property of a measurement result whereby the result can be related to a reference through a documented unbroken chain of calibrations, each contributing to the measurement uncertainty.

For a workflow map, the useful word is documented. The chain only helps a team if the documentation exists where someone can find it, so the map should show where each piece of documentation is created, where it is stored, and who is responsible for keeping it.

NIST also makes a distinction that changes how the map should be read. Traceability is a property of a measurement result, not of an instrument or a certificate, and merely having an instrument calibrated is not enough to make a result traceable.

That does not mean every team needs to become a metrology laboratory. It means that the review step, where someone looks at the certificate and decides whether the result is acceptable for the intended use, deserves its own place on the map. If the map shows only that a certificate is received and filed, it describes storage, not review.

Pay attention to these handoffs in particular:

- Request to collection: who decides that an instrument is due and who physically takes it out of service.
- Return of the certificate: who receives it, how it arrives, and how long it takes to reach the reviewer.
- Review to release: who confirms the result is acceptable and returns the instrument to the floor.
- Release to register: who updates the status and the next due date, and how the instrument's user finds out.

Count the days between stages as well as the people. If certificates arrive by email at one desk and are filed by another person weeks later, the instrument may be in use during that time without any recorded decision that it is acceptable. That is a finding about the workflow, not the people.

**Illustrative example:** The calibration coordinator at an unnamed manufacturer traces one torque wrench. The request is raised on a paper form, the wrench is sent to an outside laboratory, and the certificate returns by email to the purchasing mailbox. A purchasing clerk forwards it when someone asks.

The coordinator notes three handoffs that depend on a person remembering to act, and one period of several days when the wrench is back in use with no recorded review. These hypothetical observations become inputs to the acceptance criteria later in this chapter.

When the map is complete, mark each point where information is retyped. Retyping is a signal that two records exist for the same fact, and the more copies there are, the more likely they are to disagree. A good map leaves the team with a short list of failure points that a new system must remove.

The [ICC calibration and maintenance page](/solutions/calibration-maintenance/) describes an equipment register in which each piece of equipment sits with its calibration interval and certificates attached, and a calibration record that shows the calibration recorded, a certificate attached and the next due date set. These are published descriptions.

Use them as a list of things to look for when the workflow map is compared with software, not as statements about how any particular installation behaves.

## Assign owners and set acceptance criteria

A workflow map shows what happens. Ownership says who is answerable for it. Every in-scope instrument needs an owner, and every calibration decision needs a reviewer and a backup. Without those, the best software in the world will record decisions that nobody made.

The roles should be named by job, not by person, so that holidays and promotions do not break the chain.

Three roles are a practical starting point. The instrument owner is the person who uses or looks after the instrument and who answers for its condition between calibrations. The certificate reviewer is the person who checks the returned evidence and decides whether the result is acceptable for the intended use.

The calibration coordinator manages the schedule, the suppliers, and the register. In a small plant, one person may fill more than one role, but the decisions should still be written as separate steps, and the reviewer should not be the only person who knows how the register works.

Write the backup arrangements beside each role. If the reviewer is on leave, who may accept a certificate, and under what limits? If the answer today is that nobody does, instruments may wait or return to service informally.

A written backup removes that ambiguity. It also gives the evaluation a testable requirement: the software should let a named deputy act, and it should record who did.

Next, decide what an acceptable workflow looks like before looking at any vendor. Acceptance criteria written in advance protect the team from being persuaded by a polished demonstration of features it does not need. Phrase them as observable outcomes, for example:

1. Every in-scope instrument has an interval, an owner, and a next due date on one record.
2. Every calibration event has a certificate attached and a reviewer's decision recorded.
3. Anyone with access can see which instruments are up to date, due soon, or overdue without asking the coordinator.
4. An instrument found overdue or out of tolerance is visible as such before the next use.
5. An auditor can retrieve the history of a single instrument without help.

Each criterion should have a way to test it. For the first, pick ten instruments and ask for their records. For the fourth, ask the vendor to show what a user sees when an instrument is overdue. Criteria that cannot be tested are wishes.

Resist copying a standard's wording into the criteria. The published [ICC calibration and maintenance page](https://isocertificationconsultants.ca/solutions/calibration-maintenance/) maps the module to ISO 9001:2015 clauses 7.1.5 and 7.1.3, ISO 13485:2016 clause 7.6, and ISO/IEC 17025:2017 clause 6.4, but a mapping is not a statement that software alone satisfies a clause.

Which clauses apply depends on the standards a plant works to, so the criteria should describe what the team needs to show, and the mapping can then be checked against that list.

Finally, decide who signs off the criteria and who will judge the demonstrations. Ideally, this is a small group: the quality lead, the calibration coordinator, and one person from the floor who uses the instruments. The person from the floor matters because a system that suits the coordinator but not the operator risks leaving instruments unrecorded in practice.

**Illustrative example:** An unnamed manufacturer writes three acceptance criteria for its inspection instruments: every in-scope instrument has an interval, an owner, and a next due date; every returned certificate has a recorded reviewer decision; and an operator can see the status of an instrument at the point of use.

The team names a deputy reviewer for each criterion and agrees to use these three statements to judge every demonstration in the next chapter.

By the end of this chapter, the team holds four things: a list of in-scope instruments with reasons for exclusions, a map of one full calibration event with its handoffs, named owners with backups, and written acceptance criteria. Those four items are the input to the evaluation.

The next chapter uses them to compare candidates against the real workflow rather than against a feature list.
