# Pilot the workflow with supervisors and learners

## Fixed frontmatter

```json
{
  "slug": "training-rollout",
  "title": "Pilot the workflow with supervisors and learners",
  "description": "Training teams and rolling out the system in competency management software: set role-based learning tasks and pilot with representative users.",
  "primaryKeyword": "competency management software",
  "keywords": [
    "competency management software rollout",
    "competency management software",
    "training records",
    "competency matrix"
  ],
  "author": "ISO Certification Consultants Editorial Team",
  "date": "2026-11-05",
  "imageBrief": "A trainer showing an operator an approved setup instruction on a shop floor; no readable text or logos.",
  "sourceIds": [
    "icc-training-competence",
    "apg-competence"
  ],
  "capabilityIds": []
}
```

Target: 2000 visible words.
Scope: Cover role preparation, pilot evidence and deployment decisions without claiming measured customer outcomes.

## Subsections

### Prepare role-specific tasks
{
  "title": "Prepare role-specific tasks",
  "sourceIds": [
    "icc-training-competence"
  ],
  "keyPoints": [
    "Train supervisors to make staffing decisions, assessors to record outcomes and learners to complete assigned steps.",
    "ICC describes My Learning and supervisor sign-off; verify each role’s actual experience and access."
  ],
  "workflow": {
    "role": "Rollout lead",
    "input": "Approved workflow, user roles and demonstrated configuration",
    "decision": "Select practice tasks and support for each role",
    "record": "Training plan and completion evidence",
    "exception": "A role cannot access or complete its required task"
  },
  "evaluationCriteria": [
    "Observe each role complete a realistic task without relying solely on a presentation or vendor claim."
  ],
  "example": "The supervisor practises locating the alternate’s evidence and the learner practises opening assigned learning."
}

### Pilot normal and exception paths
{
  "title": "Pilot normal and exception paths",
  "sourceIds": [
    "apg-competence"
  ],
  "keyPoints": [
    "Include an available inspector, a missing assessment and an absent primary worker in the pilot.",
    "Compare the resulting decision with the locally approved rules, not only the number of records entered."
  ],
  "workflow": {
    "role": "Pilot supervisor and quality lead",
    "input": "Representative people, task and exception scenarios",
    "decision": "Accept the pilot or assign corrective actions",
    "record": "Observed decisions, issues and owners",
    "exception": "An incomplete record is interpreted as authorization"
  },
  "evaluationCriteria": [
    "Require the pilot to show an evidenced decision and an escalation when evidence is missing."
  ],
  "example": "The team tests the alternate’s incomplete assessment when the usual inspector is unavailable."
}

### Decide whether to expand
{
  "title": "Decide whether to expand",
  "sourceIds": [
    "apg-competence"
  ],
  "keyPoints": [
    "Review user comprehension, workload and unresolved exceptions before adding tasks or sites.",
    "Use locally collected observations rather than invented adoption or return-on-investment figures."
  ],
  "workflow": {
    "role": "Rollout sponsor",
    "input": "Pilot observations, open issues and support capacity",
    "decision": "Expand, repeat the pilot or pause",
    "record": "Readiness decision and action owners",
    "exception": "Users cannot reliably identify who may perform the task"
  },
  "evaluationCriteria": [
    "Set local acceptance thresholds before the pilot and explain how missed thresholds affect expansion."
  ],
  "example": "Expansion is paused until supervisors consistently recognize the awaiting-assessment state."
}

## Chapter boundaries
Cover learning to use the new workflow and deployment readiness; do not redesign task competence criteria.
Leave long-term review and improvement to the final chapter.

## Evidence

{
  "topicId": "training-competence",
  "sources": [
    {
      "id": "apg-competence",
      "sourceType": "primary",
      "title": "ISO 9001 Auditing Practices Group: Guidance on auditing Competence (Edition 2, 2022-06-01)",
      "publisher": "ISO/TC 176 and International Accreditation Forum (IAF)",
      "url": "https://committee.iso.org/files/live/sites/tc176/files/PDF%20APG%20New%20Disclaimer%2012-2023/ISO-TC%20176-TF_APG-Competence.pdf",
      "retrievedAt": "2026-11-05",
      "supportedClaims": [
        "Auditor guidance written for ISO 9001:2015 clause 7.2; it is not an additional standard and does not establish the requirements of any later edition.",
        "Competence is defined as the ability to apply knowledge and skills to achieve intended results (ISO 9000:2015, 3.10.4).",
        "Clause 7.2 d requires retaining appropriate documented information as evidence of competence; the word appropriate leaves the organization to decide which records have value.",
        "The competence cycle has four parts: determining necessary competence, taking actions to acquire it (training, hiring, on-the-job training, mentoring, reassigning, adjusting the job, subcontracting), evaluating the effectiveness of those actions, and retaining documented information.",
        "Evaluation techniques may include role-play, peer review, observation, review of training and employment records, or interviews; attending a course does not by itself prove the person is competent.",
        "Qualifications are not always required, but competence is; where statutes or other requirements demand qualifications (for example welders for specific welding conditions) the organization should determine them and demonstrate they are maintained.",
        "Records may include training needs identification, training plans and records, effectiveness evaluation records, cross-training charts to mitigate staff shortages, and prompts for when refresher training is due for revalidation of a qualification.",
        "Auditors may sample people, observe performance, interview them about the competence requirements and verify that adequate replacements exist when the usual person is absent.",
        "People under the organization's control may include individuals at external providers; the organization may need to communicate its competence requirements to them (clause 8.4).",
        "Existence of training plans and records alone is not sufficient to show how competence is ensured; sampling, observing and interviewing remain key audit activities.",
        "Competence may be documented centrally (for example in Human Resources) or locally at each process.",
        "Competence verification may need to be monitored or repeated; corrective actions and internal audit results often identify training needs.",
        "ISO 10015:2019 gives guidelines for competence management and people development; it is not a required standard and should not be used as audit criteria in an ISO 9001:2015 audit.",
        "Knowledge needed for processes (clause 7.1.1) is an input to competence.",
        "Not every activity needs documented information; the need depends on factors such as complexity, size, products and services, statutory context and the personnel employed."
      ]
    },
    {
      "id": "icc-training-competence",
      "sourceType": "primary",
      "title": "Training Management Software | ISO Certification Consultants (published ICC module page)",
      "publisher": "ISO Certification Consultants Inc.",
      "url": "https://isocertificationconsultants.ca/solutions/training-competence/",
      "retrievedAt": "2026-11-05",
      "supportedClaims": [
        "The published ICC page describes a workforce directory built by importing employees, a training library with quizzes and pass scores, training campaigns online, in a classroom or on the job, a competency matrix with user-defined levels and bulk updates, supervisor sign-off of on-the-job training, certificates on completion, and an employee area called My Learning. These are published descriptions; availability and configuration must be confirmed in a demonstration and no capability is advertised as verified.",
        "The page states every AI output in the software is a suggestion a person reviews before it enters a controlled record.",
        "The page maps the module to ISO 9001:2015 clause 7.2, ISO 13485:2016 clause 6.2 and ISO/IEC 17025:2017 clause 6.2; a mapping is not a statement that software alone satisfies a clause.",
        "The page does not describe HR-system integrations, pricing or trials; those are evaluation questions."
      ]
    }
  ],
  "capabilityIds": [],
  "capabilities": [],
  "researchSnapshotHash": "de1ce323dc531dc6f1a2597bd6ab3f473a570dffe4c53e4b27f9ab31eaa86b76",
  "capabilitySnapshotHash": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}

## Entire outline

{
  "title": "Training and competency management software: showing who is qualified for each task",
  "description": "How to choose and implement competency management software: map the workflow, compare capabilities, configure reviews, migrate records and train teams.",
  "primaryKeyword": "competency management software",
  "introductionWords": 1500,
  "estimatedWords": 19500,
  "introductionImageBrief": "A manufacturing quality technician confirming a controlled work instruction at a production cell; authentic industrial setting, no text or logos.",
  "glossary": [
    {
      "term": "Competence",
      "definition": "The ability to apply knowledge and skills to achieve intended results, as cited in the APG guidance from ISO 9000:2015."
    },
    {
      "term": "Competency matrix",
      "definition": "A way to relate people and their assessed levels to tasks or competencies; the organization must define what each level means."
    },
    {
      "term": "Qualification",
      "definition": "A recognized qualification where one is applicable; it is distinct from the broader ability to perform competently."
    },
    {
      "term": "Documented information",
      "definition": "Information retained as evidence; the APG guidance says the organization decides what evidence of competence is appropriate."
    },
    {
      "term": "Workflow owner",
      "definition": "The role accountable for decisions and records in a defined workflow."
    }
  ],
  "example": {
    "label": "Illustrative example",
    "description": "An unnamed Canadian manufacturer evaluates training and competency management software for one production workflow; all situations and records are hypothetical, not customer results."
  },
  "chapters": [
    {
      "slug": "mapping-workflows",
      "title": "Map the qualification decision at the production cell",
      "description": "Mapping the current workflow in competency management software: define the operational problem; identify records and handoffs; assign owners and decisions.",
      "targetWords": 2000,
      "chapterKeyword": "competency management software workflow",
      "boundaries": [
        "Map the existing decision and its handoffs; define detailed task criteria in the competency matrix chapter.",
        "Leave vendor comparisons to the software evaluation chapter and migration mechanics to the migration chapter."
      ],
      "subsections": [
        {
          "title": "Start with the staffing question",
          "sourceIds": [
            "apg-competence"
          ],
          "keyPoints": [
            "Identify the task, shift, required scope and person making the staffing decision.",
            "APG guidance notes that auditors may check whether adequate replacements exist when the usual person is absent."
          ],
          "workflow": {
            "role": "Production supervisor",
            "input": "Task schedule, available people and existing competence evidence",
            "decision": "Select a person supported by current evidence or hold the assignment",
            "record": "Decision owner and evidence consulted, as locally appropriate",
            "exception": "No evidenced replacement is available"
          },
          "evaluationCriteria": [
            "Can a user identify the task, person, evidence and unresolved gaps without treating a blank as approval?"
          ],
          "example": "The supervisor checks whether an alternate can inspect the cell’s output when the usual inspector is absent."
        },
        {
          "title": "Trace evidence and handoffs",
          "sourceIds": [
            "apg-competence"
          ],
          "keyPoints": [
            "Map the path from task requirements through learning or other action, effectiveness evaluation and retained evidence.",
            "APG guidance says evidence may be held centrally or locally; training plans alone do not establish competence."
          ],
          "workflow": {
            "role": "Quality lead",
            "input": "Local checklists, training records and assessment files",
            "decision": "Identify the authoritative evidence and the person responsible for each handoff",
            "record": "Current-state map and unresolved evidence locations",
            "exception": "Records conflict or an assessment cannot be located"
          },
          "evaluationCriteria": [
            "Can reviewers trace one decision back to its evidence and identify the responsible handoff?"
          ],
          "example": "The team finds an attendance sheet in a central file and a practical assessment at the cell."
        },
        {
          "title": "Define decision states and acceptance",
          "sourceIds": [
            "apg-competence"
          ],
          "keyPoints": [
            "Propose clear local states such as evidenced, awaiting assessment and evidence missing; these are design choices, not claimed ICC fields.",
            "Agree who resolves uncertainty and how the operational team obtains a safe replacement."
          ],
          "workflow": {
            "role": "Workflow owner",
            "input": "Mapped handoffs and representative incomplete records",
            "decision": "Approve state definitions and escalation rules",
            "record": "Agreed decision rules and exception owner",
            "exception": "A team cannot distinguish an incomplete record from an approved decision"
          },
          "evaluationCriteria": [
            "Test an incomplete record and require an explicit, understandable disposition rather than an assumed qualification."
          ],
          "example": "The alternate remains awaiting assessment until quality resolves the missing practical evidence."
        }
      ],
      "imageBrief": "A fabrication inspector tracing a paper work instruction at a cutting station; no readable text or logos.",
      "scope": "Cover the current operational decision, evidence path and acceptance rules without prescribing product configuration."
    },
    {
      "slug": "evaluating-software",
      "title": "Evaluate ICC against the actual decision",
      "description": "Evaluating software capabilities in competency management software: build a workflow-based shortlist and test the decision points.",
      "targetWords": 2000,
      "chapterKeyword": "evaluate competency management software",
      "boundaries": [
        "Compare the published module and open evaluation questions; do not treat a page description as verified availability.",
        "Leave detailed assessment design and implementation to later chapters."
      ],
      "subsections": [
        {
          "title": "Translate published descriptions into demonstration tests",
          "sourceIds": [
            "icc-training-competence"
          ],
          "keyPoints": [
            "ICC describes employee import, a training library with quizzes and pass scores, campaigns, a matrix with user-defined levels and bulk updates, supervisor sign-off, certificates and My Learning.",
            "Ask ICC to demonstrate availability and configuration for the representative task; the supplied evidence does not independently verify those capabilities."
          ],
          "workflow": {
            "role": "Evaluation lead",
            "input": "Published module description and representative task scenario",
            "decision": "Select claims to verify in a demonstration",
            "record": "Test script and observed results",
            "exception": "A described capability is unavailable or cannot be shown"
          },
          "evaluationCriteria": [
            "Ask to see the matrix, a learning campaign and supervisor sign-off using representative records; note configuration and limitations."
          ],
          "example": "The team asks to see the inspection task, an alternate and a sign-off in the demonstrated environment."
        },
        {
          "title": "Test evidence, access and human review",
          "sourceIds": [
            "icc-training-competence",
            "apg-competence"
          ],
          "keyPoints": [
            "Ask how decision evidence can be reviewed and who can see or change it; permissions and audit-history functionality are evaluation questions, not established ICC features.",
            "ICC states that every AI output is a suggestion reviewed by a person before entering a controlled record; test how that review is performed if AI is used."
          ],
          "workflow": {
            "role": "Quality and IT reviewers",
            "input": "Representative assessment evidence, user roles and any AI-assisted suggestion",
            "decision": "Determine whether review and access arrangements meet local needs",
            "record": "Observed review steps, gaps and follow-up questions",
            "exception": "A reviewer cannot establish who approved the evidence or access is unsuitable"
          },
          "evaluationCriteria": [
            "Request a role-based access demonstration and, if applicable, a traceable human review of an AI suggestion; do not assume either mechanism."
          ],
          "example": "Quality asks who can review an inspection assessment and how an erroneous suggestion would be rejected."
        },
        {
          "title": "Resolve commercial and technical unknowns",
          "sourceIds": [
            "icc-training-competence"
          ],
          "keyPoints": [
            "The supplied ICC page does not describe HR-system integrations, pricing or trials; request written details rather than assuming them.",
            "Compare support, data transfer, exit arrangements and total costs as generic procurement criteria."
          ],
          "workflow": {
            "role": "Procurement and IT leads",
            "input": "Vendor proposal, support terms and integration requirements",
            "decision": "Accept, clarify or reject unresolved commercial and technical conditions",
            "record": "Comparison and outstanding questions",
            "exception": "A necessary cost, integration or support commitment is not documented"
          },
          "evaluationCriteria": [
            "Request a priced scope, implementation assumptions, support terms and a demonstration or trial arrangement where available."
          ],
          "example": "The manufacturer asks whether employee data can be transferred from its existing HR system and at what cost."
        }
      ],
      "imageBrief": "A machining supervisor comparing inspection records beside a CNC machine; no readable text or logos.",
      "scope": "Cover evidence-based product evaluation and procurement questions, distinguishing published claims from confirmed behaviour."
    },
    {
      "slug": "competency-matrix",
      "title": "Define task requirements and the competency matrix",
      "description": "Defining roles and competency requirements in competency management software: mapping operational tasks and defining qualification criteria.",
      "targetWords": 2000,
      "chapterKeyword": "competency matrix task requirements",
      "boundaries": [
        "Define requirements and matrix meanings, not the conduct of individual assessments.",
        "Leave renewal execution to the qualification chapter."
      ],
      "subsections": [
        {
          "title": "Map tasks to necessary competence",
          "sourceIds": [
            "apg-competence"
          ],
          "keyPoints": [
            "APG guidance describes determining necessary competence as the first part of the competence cycle.",
            "Define the task’s intended result, relevant knowledge and skills, and operating scope before assigning a person."
          ],
          "workflow": {
            "role": "Process owner",
            "input": "Work instructions, task outcomes and applicable requirements",
            "decision": "Approve the competence needed for each task",
            "record": "Task-to-competence mapping and owner",
            "exception": "A task’s scope or intended result is unclear"
          },
          "evaluationCriteria": [
            "Check whether the proposed matrix can distinguish tasks with different operating scopes; confirm the actual configuration in a demonstration."
          ],
          "example": "Inspection of one product family is defined separately from inspection of a different, unfamiliar family."
        },
        {
          "title": "Define levels and qualification conditions",
          "sourceIds": [
            "icc-training-competence",
            "apg-competence"
          ],
          "keyPoints": [
            "ICC describes a competency matrix with user-defined levels and bulk updates; confirm how these are configured.",
            "APG guidance distinguishes competence from formal qualifications: qualifications are not always required, but applicable statutory or other qualification requirements must be determined and maintained."
          ],
          "workflow": {
            "role": "Quality lead and process owner",
            "input": "Task requirements and applicable qualification conditions",
            "decision": "Define level meanings, evidence thresholds and any required qualification",
            "record": "Approved level definitions and applicable conditions",
            "exception": "A required qualification or its scope cannot be confirmed"
          },
          "evaluationCriteria": [
            "Ask whether levels can be distinguished clearly and how evidence and applicable conditions would be associated with them; do not assume a particular data model."
          ],
          "example": "The team defines an independent-inspector level only after agreeing what evidence supports it."
        },
        {
          "title": "Assign ownership and control changes",
          "sourceIds": [
            "apg-competence"
          ],
          "keyPoints": [
            "Assign an owner for task definitions and a separate decision path for a person’s competence status.",
            "When work changes, review whether the old requirement and existing evidence still cover the revised task."
          ],
          "workflow": {
            "role": "Process owner",
            "input": "Proposed task or level change and existing matrix",
            "decision": "Approve the revised requirement and identify affected people",
            "record": "Change decision and affected task list",
            "exception": "The effect on existing competence cannot yet be determined"
          },
          "evaluationCriteria": [
            "Walk through a changed inspection method and ask how affected people and decisions would be identified."
          ],
          "example": "A revised inspection method prompts review of the alternate’s existing evidence."
        }
      ],
      "imageBrief": "A production operator reviewing a controlled checklist at an assembly station; no readable text or logos.",
      "scope": "Cover task requirements, matrix definitions and ownership; treat ICC’s matrix description as a claim to verify."
    },
    {
      "slug": "training-assignments",
      "title": "Choose actions to close competence gaps",
      "description": "Assigning training and learning tasks in competency management software: choosing task-specific learning; assigning trainers and learners.",
      "targetWords": 2000,
      "chapterKeyword": "training records and competency gaps",
      "boundaries": [
        "Cover actions to acquire competence and completion records, not final competence assessment.",
        "Leave software-user rollout training to the rollout chapter."
      ],
      "subsections": [
        {
          "title": "Choose an action suited to the gap",
          "sourceIds": [
            "apg-competence",
            "icc-training-competence"
          ],
          "keyPoints": [
            "APG guidance lists training, hiring, on-the-job training, mentoring, reassignment, job adjustment and subcontracting as possible actions.",
            "ICC describes online, classroom and on-the-job campaigns and a library with quizzes and pass scores; confirm the relevant options."
          ],
          "workflow": {
            "role": "Supervisor",
            "input": "Task requirement, person’s current evidence and identified gap",
            "decision": "Select a proportionate action and responsible trainer or provider",
            "record": "Action, owner and intended outcome",
            "exception": "No suitable action or trainer is available"
          },
          "evaluationCriteria": [
            "Ask whether the proposed process can distinguish learning delivery from other gap-closing actions without assuming a product feature."
          ],
          "example": "The supervisor chooses coached on-the-job practice for the inspection alternate."
        },
        {
          "title": "Assign people and record completion",
          "sourceIds": [
            "icc-training-competence",
            "apg-competence"
          ],
          "keyPoints": [
            "ICC describes supervisor sign-off for on-the-job training, completion certificates and an employee area called My Learning.",
            "A completion record documents an action; it is not automatically proof that the person can perform the task."
          ],
          "workflow": {
            "role": "Trainer or supervisor",
            "input": "Assigned action, learner and completion evidence",
            "decision": "Confirm completion or identify incomplete work",
            "record": "Appropriate completion and sign-off evidence",
            "exception": "Training is incomplete or the sign-off is disputed"
          },
          "evaluationCriteria": [
            "Demonstrate how a learner and supervisor would complete their respective steps and confirm any limitations."
          ],
          "example": "The trainer signs off practice completion, while the practical assessment remains outstanding."
        },
        {
          "title": "Handle overdue or unavailable learning",
          "sourceIds": [
            "apg-competence",
            "icc-training-competence"
          ],
          "keyPoints": [
            "Define a local escalation for missed learning and an alternate staffing plan; do not infer automatic reminders from the supplied ICC page.",
            "Consider people under the organization’s control at external providers and communicate relevant requirements where needed."
          ],
          "workflow": {
            "role": "Supervisor",
            "input": "Incomplete action and staffing schedule",
            "decision": "Reschedule the action and select an evidenced replacement",
            "record": "Exception owner and revised plan",
            "exception": "No qualified replacement or suitable provider is available"
          },
          "evaluationCriteria": [
            "Test how an overdue action is found and escalated, including any manual steps; confirm whether notifications exist."
          ],
          "example": "A missed coaching session is rescheduled and the usual inspector covers the task."
        }
      ],
      "imageBrief": "Two inspectors reviewing an inspection record beside a fabrication cell; no readable text or logos.",
      "scope": "Cover selecting and completing competence-building actions, while keeping completion distinct from verification."
    },
    {
      "slug": "competence-verification",
      "title": "Verify competence in practical work",
      "description": "Verifying competence in practical work in competency management software: defining practical assessment and recording assessment evidence.",
      "targetWords": 2000,
      "chapterKeyword": "verify competence after training",
      "boundaries": [
        "Cover initial effectiveness evaluation and evidence; leave ongoing validity and renewal to the next chapter.",
        "Do not equate ICC completion certificates or quiz pass scores with demonstrated practical competence."
      ],
      "subsections": [
        {
          "title": "Select an assessment method",
          "sourceIds": [
            "apg-competence"
          ],
          "keyPoints": [
            "APG guidance lists observation, role-play, peer review, interviews and review of training or employment records as possible techniques.",
            "Select methods against the task’s intended result and document the local acceptance decision."
          ],
          "workflow": {
            "role": "Competent assessor designated by the organization",
            "input": "Task criteria and candidate’s completed action",
            "decision": "Choose and conduct a suitable assessment",
            "record": "Method, criteria, assessor and outcome",
            "exception": "The task cannot be observed or an assessor is unavailable"
          },
          "evaluationCriteria": [
            "Test whether assessors can access the criteria and preserve enough information to explain the outcome; verify product support rather than assuming it."
          ],
          "example": "An assessor observes the alternate inspecting representative output against the approved criteria."
        },
        {
          "title": "Separate completion from effectiveness",
          "sourceIds": [
            "apg-competence",
            "icc-training-competence"
          ],
          "keyPoints": [
            "APG guidance states that attending a course does not by itself prove competence and that plans and records alone are insufficient.",
            "ICC’s described quiz scores and certificates may be useful completion evidence, but their adequacy for a task requires organizational judgment."
          ],
          "workflow": {
            "role": "Quality reviewer",
            "input": "Completion certificate, quiz result and practical assessment",
            "decision": "Determine whether the combined evidence supports the task decision",
            "record": "Rationale and evidence references",
            "exception": "Only attendance or a certificate is available for a task needing further evidence"
          },
          "evaluationCriteria": [
            "Present a completed course without an assessment and check that the local decision process does not automatically call the person competent."
          ],
          "example": "The alternate has a certificate but remains unapproved for independent inspection pending observation."
        },
        {
          "title": "Respond to an unsuccessful assessment",
          "sourceIds": [
            "apg-competence"
          ],
          "keyPoints": [
            "Record the gap and decide on further action, reassessment and interim coverage.",
            "Retain appropriate evidence of competence decisions; what is appropriate is determined by the organization."
          ],
          "workflow": {
            "role": "Assessor and supervisor",
            "input": "Unsuccessful assessment and task schedule",
            "decision": "Plan further action and restrict independent assignment until criteria are met",
            "record": "Outcome, action owner and reassessment plan",
            "exception": "Repeated failure or no available coverage requires escalation"
          },
          "evaluationCriteria": [
            "Walk through a failed assessment and confirm the decision, follow-up and interim coverage can be explained."
          ],
          "example": "The alternate receives additional coaching and is reassessed before independent assignment."
        }
      ],
      "imageBrief": "An assessor observing an operator at a guarded production station; no readable text or logos.",
      "scope": "Cover assessment method, effectiveness evidence and unsuccessful outcomes without inventing ICC assessment features."
    },
    {
      "slug": "qualification-renewal",
      "title": "Maintain validity and retrieve evidence",
      "description": "Maintaining qualifications and renewal evidence in competency management software: reviewing qualification validity and responding to process changes.",
      "targetWords": 2000,
      "chapterKeyword": "qualification renewal and competence evidence",
      "boundaries": [
        "Cover ongoing validity, reassessment triggers and retrieval; do not repeat initial assessment design.",
        "Leave system-wide improvement metrics to the final chapter."
      ],
      "subsections": [
        {
          "title": "Review applicable qualification conditions",
          "sourceIds": [
            "apg-competence"
          ],
          "keyPoints": [
            "Where a statute or other requirement calls for a qualification, APG guidance says the organization should determine it and demonstrate that it is maintained.",
            "Identify scope and validity conditions from applicable requirements; do not invent Canadian legal obligations or renewal periods."
          ],
          "workflow": {
            "role": "Qualification owner",
            "input": "Applicable requirement and qualification evidence",
            "decision": "Confirm validity and scope or withhold reliance on the qualification",
            "record": "Review outcome and supporting evidence",
            "exception": "The requirement, scope or validity cannot be confirmed"
          },
          "evaluationCriteria": [
            "Ask how a reviewer would find the applicable evidence and distinguish an unresolved qualification from a current one."
          ],
          "example": "The manufacturer checks whether a separately applicable qualification covers the work before relying on it."
        },
        {
          "title": "Trigger review after change or over time",
          "sourceIds": [
            "apg-competence",
            "icc-training-competence"
          ],
          "keyPoints": [
            "APG guidance notes that competence verification may need monitoring or repetition and that corrective actions or internal audits can identify training needs.",
            "The guidance mentions prompts for refresher training; whether ICC offers reminders is an open demonstration question."
          ],
          "workflow": {
            "role": "Process owner",
            "input": "Changed method, audit finding or locally determined review date",
            "decision": "Determine whether reassessment or another action is needed",
            "record": "Review trigger and resulting plan",
            "exception": "An affected person cannot be reviewed before the next assignment"
          },
          "evaluationCriteria": [
            "Test a changed method and ask how review is initiated, including any manual tracking or verified notifications."
          ],
          "example": "A revised inspection method leads the owner to schedule a review of both inspectors’ competence."
        },
        {
          "title": "Retrieve evidence for a sampled person",
          "sourceIds": [
            "apg-competence"
          ],
          "keyPoints": [
            "APG guidance describes auditors sampling people, observing work, interviewing them and checking replacement arrangements.",
            "Records can be central or local and should be appropriate to the organization; software records do not replace observation and interviews."
          ],
          "workflow": {
            "role": "Quality representative",
            "input": "Sampled task and person",
            "decision": "Identify and explain the evidence supporting the decision",
            "record": "Evidence references and unresolved gaps",
            "exception": "The supporting assessment is missing or inconsistent"
          },
          "evaluationCriteria": [
            "Time a representative evidence retrieval and check completeness against local criteria, without claiming a universal benchmark."
          ],
          "example": "Quality retrieves the alternate’s assessment and explains how the supervisor selects coverage."
        }
      ],
      "imageBrief": "A quality technician reviewing records beside a final inspection bench; no readable text or logos.",
      "scope": "Cover continued validity, review triggers and evidence retrieval, with no assumed renewal automation."
    },
    {
      "slug": "migration-planning",
      "title": "Migrate records without creating false qualifications",
      "description": "Planning migration and configuration in competency management software: inventory and classify existing records; clean data and map relationships.",
      "targetWords": 2000,
      "chapterKeyword": "training records migration",
      "boundaries": [
        "Cover data preparation, verification and cutover; leave end-user training to the rollout chapter.",
        "ICC’s employee import description does not establish import support for every historical record."
      ],
      "subsections": [
        {
          "title": "Inventory and classify legacy evidence",
          "sourceIds": [
            "apg-competence"
          ],
          "keyPoints": [
            "Separate attendance, assessment, qualification and task requirement records before mapping them to a new process.",
            "APG guidance allows central or local competence records and leaves the organization to determine appropriate evidence."
          ],
          "workflow": {
            "role": "Records owner",
            "input": "Legacy files, local records and retention decisions",
            "decision": "Classify records as usable, needing review or unsuitable for reliance",
            "record": "Inventory and disposition",
            "exception": "A record lacks a person, task, date or other locally necessary context"
          },
          "evaluationCriteria": [
            "Sample incomplete and conflicting legacy records and verify that none is silently treated as approved competence."
          ],
          "example": "A course attendance sheet is classified separately from the inspector’s observed assessment."
        },
        {
          "title": "Map and test transfers",
          "sourceIds": [
            "icc-training-competence"
          ],
          "keyPoints": [
            "ICC describes building a workforce directory by importing employees; confirm formats, scope and other import options.",
            "As generic migration practice, reconcile person identity, task scope and evidence against the source before accepting transferred data."
          ],
          "workflow": {
            "role": "Migration lead",
            "input": "Approved sample records and proposed field mapping",
            "decision": "Accept the pilot transfer or correct the mapping",
            "record": "Mapping, reconciliation and unresolved errors",
            "exception": "A person is duplicated or evidence is linked to the wrong task"
          },
          "evaluationCriteria": [
            "Ask ICC to demonstrate supported employee import and explain how other historical evidence would be transferred or retained."
          ],
          "example": "A small employee sample is reconciled before the team decides how to handle assessment files."
        },
        {
          "title": "Approve cutover and fallback",
          "sourceIds": [
            "icc-training-competence",
            "apg-competence"
          ],
          "keyPoints": [
            "Define which source is authoritative during transition and who resolves discrepancies.",
            "Plan a fallback for access failure or incomplete transfer; recovery arrangements are evaluation questions, not claimed ICC features."
          ],
          "workflow": {
            "role": "Workflow and IT owners",
            "input": "Pilot reconciliation, outstanding exceptions and fallback plan",
            "decision": "Authorize cutover, delay it or use the agreed fallback",
            "record": "Cutover approval and exception list",
            "exception": "Critical evidence cannot be verified or accessed"
          },
          "evaluationCriteria": [
            "Rehearse finding the authorized source during an outage and confirm recovery responsibilities and vendor commitments."
          ],
          "example": "Cutover is delayed until the alternate’s assessment can be reconciled to the correct task."
        }
      ],
      "imageBrief": "A receiving inspector sorting traceability records beside material racks; no readable text or logos.",
      "scope": "Cover safe migration and cutover as implementation advice, not as a claim of ICC import, backup or recovery functionality."
    },
    {
      "slug": "training-rollout",
      "title": "Pilot the workflow with supervisors and learners",
      "description": "Training teams and rolling out the system in competency management software: set role-based learning tasks and pilot with representative users.",
      "targetWords": 2000,
      "chapterKeyword": "competency management software rollout",
      "boundaries": [
        "Cover learning to use the new workflow and deployment readiness; do not redesign task competence criteria.",
        "Leave long-term review and improvement to the final chapter."
      ],
      "subsections": [
        {
          "title": "Prepare role-specific tasks",
          "sourceIds": [
            "icc-training-competence"
          ],
          "keyPoints": [
            "Train supervisors to make staffing decisions, assessors to record outcomes and learners to complete assigned steps.",
            "ICC describes My Learning and supervisor sign-off; verify each role’s actual experience and access."
          ],
          "workflow": {
            "role": "Rollout lead",
            "input": "Approved workflow, user roles and demonstrated configuration",
            "decision": "Select practice tasks and support for each role",
            "record": "Training plan and completion evidence",
            "exception": "A role cannot access or complete its required task"
          },
          "evaluationCriteria": [
            "Observe each role complete a realistic task without relying solely on a presentation or vendor claim."
          ],
          "example": "The supervisor practises locating the alternate’s evidence and the learner practises opening assigned learning."
        },
        {
          "title": "Pilot normal and exception paths",
          "sourceIds": [
            "apg-competence"
          ],
          "keyPoints": [
            "Include an available inspector, a missing assessment and an absent primary worker in the pilot.",
            "Compare the resulting decision with the locally approved rules, not only the number of records entered."
          ],
          "workflow": {
            "role": "Pilot supervisor and quality lead",
            "input": "Representative people, task and exception scenarios",
            "decision": "Accept the pilot or assign corrective actions",
            "record": "Observed decisions, issues and owners",
            "exception": "An incomplete record is interpreted as authorization"
          },
          "evaluationCriteria": [
            "Require the pilot to show an evidenced decision and an escalation when evidence is missing."
          ],
          "example": "The team tests the alternate’s incomplete assessment when the usual inspector is unavailable."
        },
        {
          "title": "Decide whether to expand",
          "sourceIds": [
            "apg-competence"
          ],
          "keyPoints": [
            "Review user comprehension, workload and unresolved exceptions before adding tasks or sites.",
            "Use locally collected observations rather than invented adoption or return-on-investment figures."
          ],
          "workflow": {
            "role": "Rollout sponsor",
            "input": "Pilot observations, open issues and support capacity",
            "decision": "Expand, repeat the pilot or pause",
            "record": "Readiness decision and action owners",
            "exception": "Users cannot reliably identify who may perform the task"
          },
          "evaluationCriteria": [
            "Set local acceptance thresholds before the pilot and explain how missed thresholds affect expansion."
          ],
          "example": "Expansion is paused until supervisors consistently recognize the awaiting-assessment state."
        }
      ],
      "imageBrief": "A trainer showing an operator an approved setup instruction on a shop floor; no readable text or logos.",
      "scope": "Cover role preparation, pilot evidence and deployment decisions without claiming measured customer outcomes."
    },
    {
      "slug": "ongoing-operation",
      "title": "Review performance and prepare the next decision",
      "description": "Maintaining the system and choosing next steps in competency management software: review the workflow and evidence; evaluate improvements without invented ROI.",
      "targetWords": 2000,
      "chapterKeyword": "competency management software ongoing review",
      "boundaries": [
        "Cover system-level review and next steps; individual qualification renewal belongs in the qualification chapter.",
        "Use the FAQ questions in the outline and distinguish ISO guidance from product claims."
      ],
      "subsections": [
        {
          "title": "Review decision quality and improve",
          "sourceIds": [
            "apg-competence"
          ],
          "keyPoints": [
            "Sample staffing decisions and missing-evidence exceptions; compare observed performance with locally established measures.",
            "APG guidance notes that internal audits and corrective actions can identify competence needs; avoid invented ROI or compliance guarantees."
          ],
          "workflow": {
            "role": "Quality and operations owners",
            "input": "Sample decisions, exceptions and internal audit findings",
            "decision": "Prioritize corrective action or a workflow improvement",
            "record": "Review findings, action owner and follow-up",
            "exception": "Evidence is too incomplete to assess decision quality"
          },
          "evaluationCriteria": [
            "Define a baseline and collection method before comparing retrieval time, unresolved gaps or other locally chosen measures."
          ],
          "example": "The team samples inspection assignments and investigates one missing assessment reference."
        },
        {
          "title": "Answer common questions without overstating compliance",
          "sourceIds": [
            "apg-competence",
            "icc-training-competence"
          ],
          "keyPoints": [
            "Address the nine FAQ questions listed below, including the difference between training evidence and competence.",
            "APG guidance concerns ISO 9001:2015 clause 7.2 and is not an additional standard; ISO 10015:2019 is guidance, not required ISO 9001 audit criteria.",
            "ICC maps its module to ISO 9001:2015, ISO 13485:2016 and ISO/IEC 17025:2017 clauses; mapping does not mean software alone satisfies them."
          ],
          "workflow": {
            "role": "Quality lead",
            "input": "FAQ questions, applicable requirements and supplied source claims",
            "decision": "Answer within the evidence and identify questions requiring further review",
            "record": "Approved answers and source references",
            "exception": "A question requires legal or standards interpretation beyond the supplied evidence"
          },
          "evaluationCriteria": [
            "Check that answers cite the relevant supplied source and do not claim certification or a later-edition requirement."
          ],
          "example": "The team answers that a completion certificate alone does not establish practical competence."
        },
        {
          "title": "Prepare a focused ICC demonstration",
          "sourceIds": [
            "icc-training-competence",
            "apg-competence"
          ],
          "keyPoints": [
            "Bring a task definition, two people, one incomplete assessment and a replacement scenario.",
            "Request confirmation of described functions and written answers on integrations, pricing, trials, access and support; those remain open questions where the page is silent."
          ],
          "workflow": {
            "role": "Evaluation lead",
            "input": "Scenario, acceptance criteria and open vendor questions",
            "decision": "Proceed, seek clarification or reject based on observed fit",
            "record": "Demonstration results, limitations and follow-up commitments",
            "exception": "A critical decision path cannot be demonstrated"
          },
          "evaluationCriteria": [
            "Require a traceable demonstration of the staffing decision and its exception, and distinguish observed behaviour from a future promise."
          ],
          "example": "The manufacturer asks ICC to show how a supervisor would distinguish the usual inspector from an alternate awaiting assessment."
        }
      ],
      "imageBrief": "A quality lead reviewing completed evidence beside a final inspection station; no readable text or logos.",
      "scope": "Cover ongoing system-level review, FAQ guidance and a concrete next-step demonstration."
    }
  ],
  "faqQuestions": [
    "What operational question should competency management software answer first?",
    "How is training completion different from demonstrated competence?",
    "When is a formal qualification required in addition to competence?",
    "What evidence should support a competency matrix entry?",
    "How should a supervisor handle a missing assessment or an absent qualified worker?",
    "Which legacy training records should be migrated, reviewed or retained separately?",
    "What might an auditor ask to see beyond training plans and records?",
    "Does ICC’s standards mapping mean the software guarantees conformity or certification?",
    "What should the team ask ICC to demonstrate and confirm in writing?"
  ]
}

# ICC software guide writing rules

Write for Canadian quality and operations teams evaluating or implementing software. Explain roles, inputs, decisions, records, exceptions, evaluation criteria and rollout. Use ISO requirements as supporting context rather than the main structure.

- Write the introduction and chapters in separate Markdown files. The page shell supplies the H1; body subsections use H2, and FAQ questions use H3.
- Nine chapters, each 2,000–2,200 visible words. Introduction at least 1,500 words. Entire guide at most 20,000 words including introduction, FAQs and closing invitation. Target 19,500; never use repetitive filler.
- Use third person or direct address, US spelling and naturally capitalized terminology. Avoid the blog rule file's banned filler phrases. Do not paste or bold raw SEO keywords.
- The introduction states the reader benefit in one sentence: what a team gains from managing the work in compliance management software in general, not a promise about ICC's product. Describe AI only as preparing drafts that a person reviews and approves, and never claim a capability that is not in the verified register.
- Never write the product brand as one word, "Quro", the product's web address, "AI gap assessment/analysis" or "AI audit finding(s)"; call it "compliance management software", a module's name, or "AI Assistant".
- Titles, descriptions, keywords and URLs are fixed by the final brief. Descriptions must be 120–160 characters. Chapter order comes from the manifest.
- Use only the frozen primary sources and capability register entries. A primary source's existence is not proof of an unrelated claim. Cite the precise source that supports the point. Do not call historical ISO guidance the current edition; resolve edition conflicts before making edition claims.
- Distinguish software evaluation criteria from product features. Pending or retired ICC capabilities cannot be advertised. Use verified ICC-specific evidence for every advertised capability.
- Do not invent quotations, statistics, named clients, testimonials, client results or product behavior. Begin hypothetical scenarios with `**Illustrative example:**` and use unnamed businesses. Illustrative calculations must expose their assumptions and never describe actual results.
- Cover each chapter's distinct scope. Use paragraphs, practical tables, steps and decision criteria where helpful. Avoid repeating definitions, introductions, examples or closing language across chapters.
- Include 8–10 distinct FAQ answers across the guide. Put them in the assigned FAQ subsection; do not repeat the same FAQ on every chapter. The last chapter closes with an invitation to request a software demonstration at `/contact/`: the closing paragraph uses the core message ("Stop managing compliance. Start automating it."), contains "demo" or "demonstration", and links `/contact/` (for example `[book a demo](/contact/)`). The `demonstration-invitation` check blocks the guide otherwise.
- Each page has its own managed industrial hero brief. Use manufacturing workflow scenes; no generic office scenes, fabricated product screenshots, logos or readable invented interface text. Do not emit inline image markers or untracked image links; the guide pipeline rejects them until inline provenance is supported.
- Use short paragraphs, clear role/input/decision/record/exception explanations and practical evaluation criteria. A table, list or Important/Key Consideration callout should help the decision, never fill a formatting quota. Each FAQ answer must give actionable detail, rather than a question heading with a token answer.
- Read `guide-context.json` and the exact subsection brief. Preserve the reviewed glossary, example and decisions. Review each chapter before writing the next; edits to an earlier chapter require re-review of affected downstream chapters.
- Aim near 2,000 chapter words, but use `guide budget` to determine the actual allowed maximum. Reserve at least 2,000 for each unwritten chapter and 1,500 for the introduction. Length or editorial corrections target named subsections; preserve exact citations and factual quantities.
- Source and chapter reviews are required. Missing audit credentials, stale review hashes, unresolved accuracy/repetition findings or broken links block publication. Never edit checks or evidence to make a failed draft pass.

Before checkpointing a page, count visible words, check its assigned scope and evidence, remove duplicate explanations, verify internal destinations and flag any statement the frozen evidence does not support.
