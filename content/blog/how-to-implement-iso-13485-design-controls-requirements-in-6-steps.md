---
title: How to Implement ISO 13485 Design Controls Requirements in 6 Steps
slug: how-to-implement-iso-13485-design-controls-requirements-in-6-steps
description: >-
  Master ISO 13485 design controls requirements in 6 practical steps, from
  planning and design inputs to verification, validation, and design transfer.
date: '2026-10-17'
author: ISO Certification Consultants Editorial Team
category: ISO 13485
primaryKeyword: iso 13485 design controls requirements
keywords:
  - iso 13485 design controls requirements
  - Design History File structure
  - Design verification and validation protocols
  - ISO 14971 risk management integration
  - Design transfer to manufacturing
articleType: how-to
readTime: 11
wordCount: 2044
image:
  src: >-
    /images/blog/how-to-implement-iso-13485-design-controls-requirements-in-6-steps/hero.webp
  alt: Technicians in cleanroom garments assembling medical devices
  width: 1200
  height: 675
  source: gemini
  sha256: a6fced680fc89cf93dc7bcb770ed48b7071c46994763f7bbc55bf7b5bfe0d6c1
inlineImages:
  - src: >-
      /images/blog/how-to-implement-iso-13485-design-controls-requirements-in-6-steps/inline-1.webp
    alt: >-
      an engineer calibrating a precision injection mold on a medical device
      molding line
    width: 1200
    height: 675
    source: gemini
    sha256: 45e8bad1be76cedfb6f435dc0d52a64fceb05e05c420f0987e413a371ba1672d
  - src: >-
      /images/blog/how-to-implement-iso-13485-design-controls-requirements-in-6-steps/inline-2.webp
    alt: >-
      a team of engineers and a production supervisor examining a prototype
      surgical instrument beside a machining cell
    width: 1200
    height: 675
    source: gemini
    sha256: b142702a935d6e28819af11bb7225927a5bf9d0dc4a24a0980fbb4dab724f0f0
---

> **Key Takeaways**
>
> - The ISO 13485 design controls requirements sit in clause 7.3 of ISO 13485:2016 and run from planning through transfer to manufacturing and change control.
> - Each step produces records that an auditor can trace, so the work is only finished when the evidence exists in the design file.
> - Verification asks whether the design was built right, while validation asks whether the right device was built for its users.
> - Risk management runs alongside every step rather than sitting at the end as a separate exercise.
> - Most audit findings in this area come from vague inputs, unrecorded reviews and changes made without a documented decision.

What does an auditor want to see when they open the design file for a medical device? The ISO 13485 design controls requirements ask for a traceable chain: a plan, a list of needs, outputs that answer those needs, reviews, proof that the device works, and a controlled handover to production. This guide walks through that chain in six steps, then covers the gaps that turn up most often in audits.

The requirements apply to any organization that designs or develops a medical device under ISO 13485:2016, whether it is a startup with one product or an established plant adding a new line. Shops that only build to a customer's drawings should read the exclusion question in the FAQ.

## Step 1: Formalize Design and Development Planning (Clause 7.3.2)

Planning comes first because every later record points back to it. Clause 7.3.2 of ISO 13485:2016 expects a plan that names the stages of the project, the reviews, verification and validation activities that fit each stage, who is responsible, and how the design team will communicate with the people who work on the interfaces.

**What to do:** Write the plan before engineering starts and update it as the project moves. Keep it short enough that people actually read it.

**What you need:**

- A named project lead with the authority to approve each stage gate.
- A list of the stages, with the review and the verification or validation work tied to each one.
- The competence needed on the team, including regulatory and risk management skills.

**Common mistake:** The plan is written once to satisfy the standard and never revised. When the schedule or scope shifts, the plan should shift with it, and the revision history shows the auditor that it did.

![an engineer calibrating a precision injection mold on a medical device molding line](/images/blog/how-to-implement-iso-13485-design-controls-requirements-in-6-steps/inline-1.webp)

## Step 2: Define Clear and Verifiable Design Inputs (Clause 7.3.3)

Design inputs are the needs the device must meet. Under clause 7.3.3 of ISO 13485:2016, they include functional, performance, usability and safety requirements, applicable regulatory requirements and standards, outputs from risk management, and information from earlier similar designs where it applies.

The test for a good input is simple: could someone later prove, with a measurement or an inspection, that it was met? **Every input needs a testable acceptance limit.** "The housing should feel durable" fails that test. "The housing withstands a defined drop onto a hard surface without cracking" passes it, because a test can confirm it.

**What to do:** Collect needs from users, clinicians, regulators and manufacturing, then rewrite each one as a statement that can be tested. Have the inputs reviewed for completeness and for conflicts between them.

**Common mistake:** Inputs are copied from a marketing wish list. Those statements rarely carry acceptance limits, so verification later has nothing to measure against.

> **Important:** Regulatory requirements belong in the inputs. Canada's [Medical Devices Regulations](https://laws-lois.justice.gc.ca/eng/regulations/sor-98-282/) set licensing and quality system expectations that the design must already reflect before it reaches a review.

## Step 3: Generate Measurable Design Outputs (Clause 7.3.4)

Design outputs are what the team produces in answer to the inputs: drawings, specifications, software builds, bills of material, inspection criteria and the labeling content. Clause 7.3.4 of ISO 13485:2016 requires outputs that meet the input requirements, give suitable information for purchasing, production and service, contain or reference acceptance criteria, and specify the characteristics essential for safe and proper use.

**Each output should trace back to at least one input.** A simple traceability matrix does this well, and it also exposes inputs that nothing answers.

**What you need:**

- A matrix linking each input to the outputs and later to the tests that prove it.
- Approved, released drawings and specifications under document control.
- Acceptance criteria that production and inspection can apply without asking the designer.

**Common mistake:** Outputs exist as working files on an engineer's drive and are never formally released, so the version used for testing cannot be proven to match the version built.

## Step 4: Conduct Documented Multi-Disciplinary Design Reviews (Clause 7.3.5)

Design reviews at planned stages evaluate whether the design can meet the requirements and identify problems so that actions can follow. Clause 7.3.5 of ISO 13485:2016 requires that participants include representatives of the functions concerned with the stage being reviewed, plus other specialist personnel as needed.

A review with only engineers in the room misses manufacturing, quality, regulatory and service concerns. A review that nobody records cannot be shown to an auditor, so **every review needs a written record of findings and actions**.

**What to do:** Hold reviews at the gates named in the plan. Record who attended, what was reviewed, what was decided and which actions were assigned, then close those actions with evidence.

> **Key Consideration:** Invite someone from production to every review after the first. Problems with tolerances, fixtures and inspection access are far cheaper to fix on paper than after pilot builds.

**Common mistake:** Reviews are recorded as a signature page with no findings. An auditor reading a file where every review found nothing will reasonably wonder how thorough the reviews were.

![a team of engineers and a production supervisor examining a prototype surgical instrument beside a machining cell](/images/blog/how-to-implement-iso-13485-design-controls-requirements-in-6-steps/inline-2.webp)

## Step 5: Execute Rigorous Design Verification and Validation (Clauses 7.3.6 & 7.3.7)

Verification and validation are two separate activities, and the standard treats them separately. Clause 7.3.6 of ISO 13485:2016 requires verification, which confirms that the design outputs meet the design inputs, against planned and documented protocols. Clause 7.3.7 requires validation, which confirms that the finished device meets the requirements for its specified application or intended use.

| Activity | Question it answers | Typical evidence |
|---|---|---|
| Verification | Did the team build the device right? | Bench tests, dimensional inspection, software test results |
| Validation | Did the team build the right device? | Usability studies, simulated-use testing, clinical evaluation |

**What to do:**

- Write the protocol before the test, with **acceptance criteria taken from the inputs**.
- Use product that represents the final design, built by the process intended for production.
- Record results, deviations and the decision made about each deviation.

Validation also draws on the regulatory pathway. Health Canada explains how it classifies and licenses devices on its page [about medical devices](https://www.canada.ca/en/health-canada/services/drugs-health-products/medical-devices/about-medical-devices.html), and the class often shapes how much clinical evidence the validation needs.

**Common mistake:** Tests are run first and the acceptance limits are adjusted afterward to fit the results. Protocols approved before testing prevent that problem.

### Where risk management fits

Risk management does not wait until verification. ISO 14971 is the companion standard for medical device risk management, and ISO 13485:2016 expects risk management to be applied across product realization. In practice, **hazards identified during the risk analysis become design inputs**, risk controls become design outputs, and verification confirms that each control works.

The Design History File should therefore show a living link: a hazard, the control that addresses it, the test that proved the control and the residual risk decision.

## Step 6: Control Design Transfer and Engineering Changes (Clauses 7.3.8 & 7.3.9)

A design is not finished when the last test passes. Clause 7.3.8 of ISO 13485:2016 requires procedures for transferring design outputs to manufacturing, with verification that the outputs are suitable for production before they become final specifications. Clause 7.3.9 requires that changes are identified, reviewed, verified and validated as appropriate, and approved before they are put into effect.

**What to do:** Build a transfer checklist that covers released drawings, process validation plans, inspection methods, training, supplier readiness and labeling. Then **route every later change through the same review path** used for the original design.

> **Did You Know?** Clause 7.3.9 of ISO 13485:2016 also requires evaluating the effect of a change on the device's components and on product already delivered, not only on the part being changed.

**Common mistake:** A shop-floor adjustment is made to improve yield and never enters the change process. Months later, the released drawing and the product no longer match.

## Step 7: Common Design Control Audit Deficiencies and How to Avoid Them

The final piece is the file itself. Clause 7.3.10 of ISO 13485:2016 requires a design and development file for each device type or family, holding or referencing the records that show conformity with the requirements and the history of changes. Many organizations call this the Design History File.

Auditors tend to raise the same kinds of gaps:

- Inputs that cannot be tested, which leaves verification with no clear pass or fail line.
- Review records that list attendees but no findings, actions or closure.
- Traceability that stops at the output and never reaches the test report.
- Risk files that are updated at the end of the project and do not reflect decisions made along the way.
- Changes made after release without a recorded evaluation of their effect.

**Illustrative example:** A regional manufacturer of reusable surgical instrument trays adds a stiffer plastic to its latch after a customer complaint. The engineer swaps the material on the drawing, but the risk file still describes the original material and no new verification is run. The file now shows a design that no longer matches what ships.

Closing these gaps usually means a short internal audit of one product file against clause 7.3 before the certification body visits. The full journey is described in [the medical device manufacturer's roadmap to ISO 13485 certification in Canada](/blog/the-medical-device-manufacturer-s-roadmap-to-iso-13485-certification-in-canada), and the [ISO 13485 medical devices service page](/services/iso-13485) outlines how the standard is supported in practice.

## Frequently Asked Questions

### What is the difference between design verification and design validation under ISO 13485?

Verification confirms that the design outputs meet the design inputs, usually through bench testing, inspection and analysis. Validation confirms that the finished device meets the needs of its intended use, usually through simulated use, usability testing or clinical evaluation. **Both are required**, and one does not replace the other.

### Does a contract medical device manufacturer need to comply with ISO 13485 design controls?

It depends on whether the manufacturer is responsible for the design. A shop that builds strictly to a customer's released drawings may document that design and development does not apply, with a justification. A manufacturer that modifies the design, proposes changes or owns any part of the specification should expect clause 7.3 to apply to that work.

### What documents must be included in an ISO 13485 Design History File (DHF)?

The file holds or references the design plan, design inputs, outputs, review records, verification and validation protocols and reports, transfer records and change records. It also includes the risk management file or a reference to it. The standard asks for records showing conformity and the history of changes rather than a fixed list of document titles.

### How does ISO 14971 risk management integrate into ISO 13485 design controls?

Risk analysis feeds the design inputs, risk controls appear in the outputs, and verification and validation confirm that the controls work. Design reviews and change control then revisit the risk file whenever the design moves. The Design History File should show this connection from hazard to control to test.

### Can an ISO 13485 certified manufacturer exclude Clause 7.3 design and development?

Yes, but only when the organization does not design or develop the product and can justify that in its quality manual. The scope of the quality management system should state the exclusion and the reason. If any design activity exists, even a minor modification, the exclusion becomes hard to defend. The official page for [ISO 13485:2016 on iso.org](https://www.iso.org/standard/59752.html) confirms the current edition for anyone checking the text.

Design controls work best when they are treated as a working record of how the device came to exist, not as paperwork added at the end. A device maker that wants a second opinion on its design file before a certification body reviews it can [book a consultation](/contact) with ISO Certification Consultants, who work with Ontario medical device manufacturers on exactly this part of the standard.
