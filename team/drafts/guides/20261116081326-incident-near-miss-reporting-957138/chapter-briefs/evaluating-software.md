# Evaluate incident and near-miss reporting software

## Fixed frontmatter

```json
{
  "slug": "evaluating-software",
  "title": "Evaluate incident and near-miss reporting software",
  "description": "Evaluating incident and near-miss reporting software: build a workflow-based shortlist, test decision points, and examine permissions, evidence and support.",
  "primaryKeyword": "incident and near-miss reporting software",
  "keywords": [
    "incident and near-miss reporting software evaluation",
    "incident and near-miss reporting software",
    "near miss reporting",
    "workplace incident log"
  ],
  "author": "ISO Certification Consultants Editorial Team",
  "date": "2026-11-16",
  "imageBrief": "An evaluation team testing a tablet reporting form at a shop-floor workstation; authentic manufacturing environment, no readable text or logos",
  "sourceIds": [
    "icc-safety"
  ],
  "capabilityIds": []
}
```

Target: 2000 visible words.
Scope: Cover a workflow-based evaluation of incident and near-miss reporting software, including what ICC publishes and what remains an evaluation question.

## Subsections

### Build a workflow-based shortlist
{
  "title": "Build a workflow-based shortlist",
  "sourceIds": [
    "icc-safety"
  ],
  "keyPoints": [
    "Shortlist by workflow fit, not feature count: floor reporting, severity, investigation, linked corrective action, auditor view.",
    "The ICC Safety page describes incident and near-miss reporting, QR-code anonymous reporting, a separate safety dashboard and linked corrective actions; confirm each in a demonstration."
  ],
  "workflow": {
    "role": "Evaluation lead",
    "input": "Acceptance criteria",
    "decision": "Decide which vendors can demonstrate the full path",
    "record": "Shortlist with reasons",
    "exception": "A vendor shows features but not the path"
  },
  "evaluationCriteria": [
    "Does every shortlisted vendor handle the end-to-end path with your sample reports?"
  ],
  "example": "A team drops a vendor that cannot show a report becoming an action."
}

### Test the decision points
{
  "title": "Test the decision points",
  "sourceIds": [
    "icc-safety"
  ],
  "keyPoints": [
    "Bring real reports, including an anonymous one and a disputed severity rating, and watch each decision being recorded.",
    "The page states severity is set from the level of harm; ask how the scale is configured and who may change a rating."
  ],
  "workflow": {
    "role": "Safety coordinator",
    "input": "Sample reports and exceptions",
    "decision": "Decide whether each decision is captured and attributable",
    "record": "Scored demonstration sheet",
    "exception": "The demonstration uses clean sample data only"
  },
  "evaluationCriteria": [
    "Were exceptions demonstrated, not just the happy path?"
  ],
  "example": "A scoring sheet marks a rating change as unrecorded."
}

### Examine evidence, permissions and AI use
{
  "title": "Examine evidence, permissions and AI use",
  "sourceIds": [
    "icc-safety"
  ],
  "keyPoints": [
    "The page describes a separate health and safety dashboard with its own permissions, enabled per organization; ask who can see which reports and how anonymous reports are protected.",
    "The page states every AI output is a suggestion a person reviews before it enters a controlled record; ask what AI does in the module."
  ],
  "workflow": {
    "role": "IT and safety lead",
    "input": "Role list and sensitivity requirements",
    "decision": "Decide access rules",
    "record": "Permission matrix",
    "exception": "Safety data needs to be hidden from quality users or the reverse"
  },
  "evaluationCriteria": [
    "Can access be limited by role and reviewed?"
  ],
  "example": "A matrix shows investigators need wider access than floor reporters."
}

### Compare setup, cost and support
{
  "title": "Compare setup, cost and support",
  "sourceIds": [
    "icc-safety"
  ],
  "keyPoints": [
    "The page describes four setup steps: map processes, configure modules, onboard standards, deploy to the floor with a certified consultant reviewing configuration through to audit.",
    "Pricing, notifications and regulatory reporting are not stated on the page; request written answers."
  ],
  "workflow": {
    "role": "Evaluation lead",
    "input": "Vendor answers",
    "decision": "Decide whether setup effort and support fit",
    "record": "Written comparison",
    "exception": "A vendor will not commit answers in writing"
  },
  "evaluationCriteria": [
    "Are cost, setup effort and support responsibilities written down?"
  ],
  "example": "The team lists unanswered questions beside each vendor."
}

## Chapter boundaries
Cover vendor evaluation; the current-state map belongs to the mapping chapter.
Leave configuration of forms and severity to later chapters.

## Evidence

{
  "topicId": "incident-near-miss-reporting",
  "sources": [
    {
      "id": "icc-safety",
      "sourceType": "primary",
      "title": "ICC Safety module (ISO 45001) page",
      "publisher": "ISO Certification Consultants Inc.",
      "url": "https://isocertificationconsultants.ca/solutions/safety/",
      "retrievedAt": "2026-11-19",
      "supportedClaims": [
        "The published ICC page describes incident and near-miss reporting in which severity is set from the level of harm. These are published descriptions; availability and configuration must be confirmed in a demonstration and no capability is advertised as verified.",
        "The page describes a QR code on the floor that opens an anonymous report form with no login, and anonymous reports appear in the safety dashboard marked as anonymous.",
        "The page describes a health and safety dashboard with its own permissions, separate from quality, switched on per organization.",
        "The page states incidents that need corrective action are carried into the Improvements module, and the auditor view shows corrective actions linked to each incident.",
        "The page describes an auditor view with the incident and near-miss log showing severity and status, floor reports including anonymous ones, and linked corrective actions.",
        "The page maps the module to ISO 45001:2018 clauses 10.2 (incident, nonconformity and corrective action), 5.4 (consultation and participation of workers) and 6.1.2 (hazard identification and assessment of risks and opportunities); a mapping is not a statement that software alone satisfies a clause.",
        "The page describes setup in four steps: map processes with named owners, configure modules (fields, checklists, terminology, routing), onboard standards, and deploy to the floor with training and a certified consultant reviewing configuration through to audit.",
        "The page states every AI output is a suggestion that a person reviews before it enters a controlled record.",
        "The page describes the problem as near-misses going unreported because reporting needs a form and a supervisor, investigations starting from a blank page, and committees not seeing patterns early.",
        "The page does not state pricing, notifications or alerts, injury classification beyond severity, regulatory or authority reporting, e-signatures or PIN access; those are evaluation questions.",
        "ROOT-BROWSER-VERIFIED on 2026-11-19: the owner directly viewed the primary ICC Safety page in Chrome. It describes severity by harm, an anonymous QR no-login form, separate dashboard and permissions, corrective-action handoff, and numbered configuration sections 01–04 for mapping, configuring modules including fields, checklists, terminology and routing, onboarding standards, and deployment and training. These are vendor descriptions, not a verified plant condition or guaranteed implementation workflow. Exact anonymous-form field configuration, selectable severity levels and handoff mechanics remain unconfirmed."
      ]
    },
    {
      "id": "ontario-jhsc-guide",
      "sourceType": "primary",
      "title": "Guide for health and safety committees and representatives",
      "publisher": "Government of Ontario, Ministry of Labour",
      "url": "https://www.ontario.ca/page/guide-health-and-safety-committees-and-representatives",
      "retrievedAt": "2026-11-19",
      "supportedClaims": [
        "ROOT-BROWSER-VERIFIED: The owner directly viewed this primary Ontario government page in Chrome on 2026-11-19. The displayed title is Guide for health and safety committees and representatives and the page showed Updated August 17, 2026. Automated HTTP retrieval remains blocked with 403; no successful automated fetch is claimed.",
        "Ontario thresholds generally use regularly employed workers. Workplaces with 6–19 generally select a representative where no joint health and safety committee is required. Designated-substance rules and director or minister orders can require committees below 20; construction and farming have specific provisions.",
        "At least half of committee members are workers who do not exercise managerial functions.",
        "Joint health and safety committees meet at least every three months. Worker workplace inspections are monthly, subject to the stated inspector, regulatory and impracticability exceptions.",
        "Employers respond to written recommendations within 21 calendar days, providing an implementation timetable for accepted recommendations and written reasons for rejected recommendations.",
        "These are Ontario-specific guide descriptions with qualifications and exceptions; legislation governs."
      ]
    }
  ],
  "capabilityIds": [],
  "capabilities": [],
  "researchSnapshotHash": "bce7188b3e3100368abcd2d151dc949607d7ddf8b06d72e9561efb7950ef2bed",
  "capabilitySnapshotHash": "4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945"
}

## Entire outline

{
  "title": "Incident and near-miss reporting software for Canadian quality and operations teams",
  "description": "How to choose and implement incident and near-miss reporting software: map the workflow, compare capabilities, rate severity, link actions and train teams.",
  "primaryKeyword": "incident and near-miss reporting software",
  "introductionWords": 1500,
  "estimatedWords": 19500,
  "introductionImageBrief": "A manufacturing safety coordinator reviewing a floor report beside a production cell; authentic industrial setting, no text or logos",
  "glossary": [
    {
      "term": "Near-miss",
      "definition": "An event that could have caused harm but did not."
    },
    {
      "term": "Severity",
      "definition": "A rating set from the level of harm, actual or potential, defined by the organization."
    },
    {
      "term": "Corrective action",
      "definition": "An action taken to remove the cause of an incident so it does not recur."
    },
    {
      "term": "Workflow owner",
      "definition": "The role accountable for decisions and records in a defined workflow."
    }
  ],
  "example": {
    "label": "Illustrative example",
    "description": "An unnamed Canadian manufacturer evaluates incident and near-miss reporting software for one production area; all situations and records are hypothetical, not customer results."
  },
  "chapters": [
    {
      "slug": "mapping-workflows",
      "title": "Map how incidents and near-misses are reported today",
      "description": "Mapping the current process for incident and near-miss reporting software: define the problem, trace reports and handoffs, and assign owners and decisions.",
      "targetWords": 2000,
      "chapterKeyword": "incident and near-miss reporting software workflow",
      "boundaries": [
        "Map the existing reporting path and handoffs; leave vendor comparison to the evaluation chapter.",
        "Leave form design, severity rules and corrective action mechanics to their own chapters."
      ],
      "subsections": [
        {
          "title": "Define the reporting problem",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Describe the problem in operating terms: incidents and near-misses reported on paper or by email are not consistently logged, rated for severity or linked to corrective action.",
            "The ICC Safety page describes the same pattern: near-misses go unreported because reporting needs a form and a supervisor, investigations start from a blank page, and committees see patterns late. Present it as the vendor's description of the problem, not as measured data."
          ],
          "workflow": {
            "role": "Quality or safety lead",
            "input": "Paper forms, emails, whiteboard notes and any existing log",
            "decision": "Decide what counts as an incident, a near-miss and a hazard report in this organization",
            "record": "Written definitions with an owner",
            "exception": "A report arrives that fits no definition"
          },
          "evaluationCriteria": [
            "Can the team state which events must be logged and who decides in a doubtful case?"
          ],
          "example": "A supervisor finds three differently worded notes about the same guard gap in three places."
        },
        {
          "title": "Trace reports, records and handoffs",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Follow one real report from the person who saw the event to closure and note every record, hand-off and delay.",
            "Note where information is retyped, lost or left only in an email thread."
          ],
          "workflow": {
            "role": "Supervisor and safety coordinator",
            "input": "One recent report and every document it produced",
            "decision": "Decide which steps are required and which are habit",
            "record": "Current-state process map",
            "exception": "A report stalls because the supervisor is absent"
          },
          "evaluationCriteria": [
            "Does the map show every place a report can be lost or delayed?"
          ],
          "example": "A map shows that a floor report waits for the supervisor to return from a meeting before anyone logs it."
        },
        {
          "title": "Assign owners and decisions",
          "sourceIds": [
            "icc-safety",
            "ontario-jhsc-guide"
          ],
          "keyPoints": [
            "Name an owner for intake, severity rating, investigation and corrective action follow-up.",
            "Where a joint health and safety committee or representative exists, Ontario's guide describes its role; check the rules for the relevant province instead of assuming Ontario's apply nationally."
          ],
          "workflow": {
            "role": "Operations manager",
            "input": "Process map and organization chart",
            "decision": "Assign a named owner and a backup to each decision",
            "record": "Role and decision table",
            "exception": "An owner leaves or is unavailable"
          },
          "evaluationCriteria": [
            "Can every step name an owner and a backup?"
          ],
          "example": "A table shows no owner for rating reports that arrive on night shift."
        },
        {
          "title": "Set acceptance criteria for the software",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Turn the map into measurable acceptance criteria for a demonstration: report filed from the floor, severity recorded, action linked.",
            "Treat each criterion as an evaluation question, because published descriptions are not verified capabilities."
          ],
          "workflow": {
            "role": "Evaluation lead",
            "input": "Process map and decision table",
            "decision": "Decide which steps the software must support first",
            "record": "Acceptance criteria list",
            "exception": "A criterion cannot be tested with sample records"
          },
          "evaluationCriteria": [
            "Is each criterion testable with a real report and its exceptions?"
          ],
          "example": "The list asks a demonstration to show an anonymous floor report becoming a linked action."
        }
      ],
      "imageBrief": "A quality lead and a supervisor walking a press line with a paper incident log; authentic manufacturing environment, no readable text or logos",
      "scope": "Cover the current-state map of incident and near-miss reporting, its records, handoffs and owners."
    },
    {
      "slug": "evaluating-software",
      "title": "Evaluate incident and near-miss reporting software",
      "description": "Evaluating incident and near-miss reporting software: build a workflow-based shortlist, test decision points, and examine permissions, evidence and support.",
      "targetWords": 2000,
      "chapterKeyword": "incident and near-miss reporting software evaluation",
      "boundaries": [
        "Cover vendor evaluation; the current-state map belongs to the mapping chapter.",
        "Leave configuration of forms and severity to later chapters."
      ],
      "subsections": [
        {
          "title": "Build a workflow-based shortlist",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Shortlist by workflow fit, not feature count: floor reporting, severity, investigation, linked corrective action, auditor view.",
            "The ICC Safety page describes incident and near-miss reporting, QR-code anonymous reporting, a separate safety dashboard and linked corrective actions; confirm each in a demonstration."
          ],
          "workflow": {
            "role": "Evaluation lead",
            "input": "Acceptance criteria",
            "decision": "Decide which vendors can demonstrate the full path",
            "record": "Shortlist with reasons",
            "exception": "A vendor shows features but not the path"
          },
          "evaluationCriteria": [
            "Does every shortlisted vendor handle the end-to-end path with your sample reports?"
          ],
          "example": "A team drops a vendor that cannot show a report becoming an action."
        },
        {
          "title": "Test the decision points",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Bring real reports, including an anonymous one and a disputed severity rating, and watch each decision being recorded.",
            "The page states severity is set from the level of harm; ask how the scale is configured and who may change a rating."
          ],
          "workflow": {
            "role": "Safety coordinator",
            "input": "Sample reports and exceptions",
            "decision": "Decide whether each decision is captured and attributable",
            "record": "Scored demonstration sheet",
            "exception": "The demonstration uses clean sample data only"
          },
          "evaluationCriteria": [
            "Were exceptions demonstrated, not just the happy path?"
          ],
          "example": "A scoring sheet marks a rating change as unrecorded."
        },
        {
          "title": "Examine evidence, permissions and AI use",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "The page describes a separate health and safety dashboard with its own permissions, enabled per organization; ask who can see which reports and how anonymous reports are protected.",
            "The page states every AI output is a suggestion a person reviews before it enters a controlled record; ask what AI does in the module."
          ],
          "workflow": {
            "role": "IT and safety lead",
            "input": "Role list and sensitivity requirements",
            "decision": "Decide access rules",
            "record": "Permission matrix",
            "exception": "Safety data needs to be hidden from quality users or the reverse"
          },
          "evaluationCriteria": [
            "Can access be limited by role and reviewed?"
          ],
          "example": "A matrix shows investigators need wider access than floor reporters."
        },
        {
          "title": "Compare setup, cost and support",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "The page describes four setup steps: map processes, configure modules, onboard standards, deploy to the floor with a certified consultant reviewing configuration through to audit.",
            "Pricing, notifications and regulatory reporting are not stated on the page; request written answers."
          ],
          "workflow": {
            "role": "Evaluation lead",
            "input": "Vendor answers",
            "decision": "Decide whether setup effort and support fit",
            "record": "Written comparison",
            "exception": "A vendor will not commit answers in writing"
          },
          "evaluationCriteria": [
            "Are cost, setup effort and support responsibilities written down?"
          ],
          "example": "The team lists unanswered questions beside each vendor."
        }
      ],
      "imageBrief": "An evaluation team testing a tablet reporting form at a shop-floor workstation; authentic manufacturing environment, no readable text or logos",
      "scope": "Cover a workflow-based evaluation of incident and near-miss reporting software, including what ICC publishes and what remains an evaluation question."
    },
    {
      "slug": "reporting-intake",
      "title": "Design reporting intake for incident and near-miss reporting software",
      "description": "Designing intake in incident and near-miss reporting software: define report fields, enable anonymous floor reporting, and make the report easy to start.",
      "targetWords": 2000,
      "chapterKeyword": "incident and near-miss reporting software intake",
      "boundaries": [
        "Cover how a report is started and captured; rating and triage belong to the severity chapter.",
        "Leave investigation methods to the investigation chapter."
      ],
      "subsections": [
        {
          "title": "Define the report fields",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Keep the first form short: what happened, where, when, who was affected and whether anyone was hurt.",
            "Separate required fields from those added later by the investigator."
          ],
          "workflow": {
            "role": "Safety coordinator",
            "input": "Sample reports",
            "decision": "Decide required versus optional fields",
            "record": "Report form specification",
            "exception": "Reporters skip fields"
          },
          "evaluationCriteria": [
            "Can a floor reporter finish the form quickly?"
          ],
          "example": "A form drops six optional fields after a test."
        },
        {
          "title": "Support anonymous floor reporting",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "The ICC page describes a QR code on the floor that opens an anonymous report form with no login, and anonymous reports shown in the dashboard marked as anonymous.",
            "Decide when anonymity is allowed and how follow-up questions are handled when the reporter is unknown."
          ],
          "workflow": {
            "role": "Safety lead",
            "input": "Anonymity policy",
            "decision": "Decide whether anonymous reports are accepted and who reads them",
            "record": "Policy and routing rule",
            "exception": "An anonymous report names a person"
          },
          "evaluationCriteria": [
            "Does the tool mark anonymous reports and keep them in the same log?"
          ],
          "example": "A policy allows anonymous reports and assigns the safety coordinator to read them first."
        },
        {
          "title": "Make reporting reachable on the floor",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Place access points where events happen; test lighting, gloves, connectivity and language.",
            "The page does not mention PIN access or notifications; treat those as questions."
          ],
          "workflow": {
            "role": "Operations supervisor",
            "input": "Floor layout",
            "decision": "Decide placement of access points",
            "record": "Placement list",
            "exception": "Poor connectivity at a station"
          },
          "evaluationCriteria": [
            "Can a report be filed at the point of work?"
          ],
          "example": "A trial shows one dock has no signal and needs a different access point."
        },
        {
          "title": "Review new reports on arrival",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Set a response time for first review and an owner for each shift.",
            "Record that a person reviewed the report, even when no action follows."
          ],
          "workflow": {
            "role": "Safety coordinator",
            "input": "New report queue",
            "decision": "Decide to rate, investigate or close",
            "record": "Review entry",
            "exception": "Report arrives off shift"
          },
          "evaluationCriteria": [
            "Is there evidence that each report was reviewed?"
          ],
          "example": "Every report in the queue shows a reviewer and a date."
        }
      ],
      "imageBrief": "A floor operator scanning a posted QR code beside a machine cell; authentic manufacturing environment, no readable text or logos",
      "scope": "Cover report fields, anonymous floor reporting, shop-floor access and first review of a new report."
    },
    {
      "slug": "severity-triage",
      "title": "Rate severity and triage in incident and near-miss reporting software",
      "description": "Severity and triage in incident and near-miss reporting software: set a harm-based scale, rate reports consistently, route them and handle disputed ratings.",
      "targetWords": 2000,
      "chapterKeyword": "incident and near-miss reporting software severity",
      "boundaries": [
        "Cover rating and routing; the investigation itself belongs to the next chapter.",
        "Avoid legal reporting thresholds; they depend on jurisdiction."
      ],
      "subsections": [
        {
          "title": "Define a harm-based scale",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "The ICC page states severity is set from the level of harm; define each level in plain words with examples before configuring anything.",
            "Rate near-misses by potential harm, and say so explicitly."
          ],
          "workflow": {
            "role": "Safety lead",
            "input": "Past reports",
            "decision": "Decide level definitions",
            "record": "Severity scale",
            "exception": "A level has no clear boundary"
          },
          "evaluationCriteria": [
            "Do two raters give the same rating to the same report?"
          ],
          "example": "Two coordinators rate the same report differently and rewrite the definition."
        },
        {
          "title": "Route reports by rating",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Decide who is told about each level and how fast.",
            "The page does not state notifications or alerts; ask how routing and reminders work."
          ],
          "workflow": {
            "role": "Operations manager",
            "input": "Severity scale",
            "decision": "Decide routing and response time",
            "record": "Routing table",
            "exception": "Higher-rated report sits unread"
          },
          "evaluationCriteria": [
            "Does a higher rating reach the right person quickly?"
          ],
          "example": "A routing table sends the highest level to the plant manager the same shift."
        },
        {
          "title": "Handle disputed ratings",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Allow a rating change with a reason and a name.",
            "Keep the original rating visible."
          ],
          "workflow": {
            "role": "Safety lead",
            "input": "Disputed report",
            "decision": "Decide the final rating",
            "record": "Rating history",
            "exception": "Rating changed without a reason"
          },
          "evaluationCriteria": [
            "Is every rating change attributable?"
          ],
          "example": "A report is re-rated and the log shows both ratings and the reason."
        },
        {
          "title": "Separate regulatory duties from the log",
          "sourceIds": [
            "icc-safety",
            "ontario-jhsc-guide"
          ],
          "keyPoints": [
            "Reporting duties to authorities depend on the province and the event; the ICC page does not describe regulatory reporting, so treat it as an open question.",
            "Ontario's guide describes committees and representatives, not reporting deadlines; confirm duties with the relevant authority."
          ],
          "workflow": {
            "role": "Safety lead",
            "input": "Applicable regulations",
            "decision": "Decide which events need external notice",
            "record": "Regulatory checklist",
            "exception": "Rules differ by province"
          },
          "evaluationCriteria": [
            "Does the team keep its external reporting checklist separate and current?"
          ],
          "example": "A checklist lists the authority contact for each province of operation."
        }
      ],
      "imageBrief": "A safety coordinator reviewing reports at a dock office desk; authentic manufacturing environment, no readable text or logos",
      "scope": "Cover a harm-based severity scale, triage routing, rating disputes and escalation."
    },
    {
      "slug": "investigation",
      "title": "Run investigations from a structured record",
      "description": "Running investigations in incident and near-miss reporting software: assign an investigator, gather evidence, find causes and record conclusions.",
      "targetWords": 2000,
      "chapterKeyword": "incident and near-miss reporting software investigation",
      "boundaries": [
        "Cover the investigation; corrective action tracking belongs to its own chapter.",
        "Do not specify a single root cause method as required."
      ],
      "subsections": [
        {
          "title": "Assign and scope the investigation",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "The ICC page says investigations otherwise start from a blank page; ask how the record carries the original report into the investigation.",
            "Match investigation depth to severity."
          ],
          "workflow": {
            "role": "Safety coordinator",
            "input": "Rated report",
            "decision": "Decide who investigates and how deeply",
            "record": "Assignment record",
            "exception": "Investigator has a conflict"
          },
          "evaluationCriteria": [
            "Does the investigation begin with the original report attached?"
          ],
          "example": "A medium report gets a short investigation; a higher one a team."
        },
        {
          "title": "Collect evidence",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "List evidence types: statements, photos, equipment records, training records.",
            "Keep evidence with the incident record."
          ],
          "workflow": {
            "role": "Investigator",
            "input": "Scene, people, records",
            "decision": "Decide what is sufficient",
            "record": "Evidence list",
            "exception": "Witness unavailable"
          },
          "evaluationCriteria": [
            "Is evidence retrievable from the incident record?"
          ],
          "example": "An investigator links the machine record and the operator's training record."
        },
        {
          "title": "Analyze causes without blame",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Use a method the organization already trains on; the software should record, not dictate.",
            "Look at process and condition causes first."
          ],
          "workflow": {
            "role": "Investigator and supervisor",
            "input": "Evidence",
            "decision": "Decide causes",
            "record": "Cause statement",
            "exception": "Pressure to name an individual"
          },
          "evaluationCriteria": [
            "Does the record separate facts from conclusions?"
          ],
          "example": "A cause statement points to a missing guard check, not a person."
        },
        {
          "title": "Record conclusions and review",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Require a reviewer to accept the investigation before closing.",
            "Where AI drafts anything, a person reviews it before it enters the record, as the ICC page states."
          ],
          "workflow": {
            "role": "Safety lead",
            "input": "Draft investigation",
            "decision": "Accept or return",
            "record": "Reviewed conclusion",
            "exception": "Conclusions unsupported by evidence"
          },
          "evaluationCriteria": [
            "Is there a visible review step?"
          ],
          "example": "A reviewer returns an investigation lacking evidence."
        }
      ],
      "imageBrief": "An investigator interviewing an operator beside a machine guard; authentic manufacturing environment, no readable text or logos",
      "scope": "Cover investigation assignment, evidence, cause analysis and recording conclusions."
    },
    {
      "slug": "corrective-actions",
      "title": "Link incidents to corrective action and follow-up",
      "description": "Linking incident and near-miss reporting software to corrective action: decide which reports need action, assign owners, track due dates and verify results.",
      "targetWords": 2000,
      "chapterKeyword": "incident and near-miss reporting software corrective action",
      "boundaries": [
        "Cover action from incidents; general corrective action practice belongs to the CAPA guide.",
        "Leave committee trend review to the committee chapter."
      ],
      "subsections": [
        {
          "title": "Decide which reports need action",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "The ICC page says incidents that need corrective action are carried into Improvements; ask what is carried across.",
            "Set criteria: severity, repeat occurrence, open hazard."
          ],
          "workflow": {
            "role": "Safety lead",
            "input": "Reviewed investigation",
            "decision": "Decide whether action is needed",
            "record": "Decision with reason",
            "exception": "Action not needed but concern remains"
          },
          "evaluationCriteria": [
            "Is the reason for no action recorded?"
          ],
          "example": "A low-rated repeat event gets an action."
        },
        {
          "title": "Assign owners and due dates",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Name one owner and a date.",
            "Ask whether reminders exist; the page does not state them."
          ],
          "workflow": {
            "role": "Action owner",
            "input": "Action description",
            "decision": "Accept the action and date",
            "record": "Action record",
            "exception": "Owner lacks authority or budget"
          },
          "evaluationCriteria": [
            "Does every action have an accountable owner?"
          ],
          "example": "A maintenance lead accepts a guard fix with a date."
        },
        {
          "title": "Keep the link to the incident",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "The page says auditors can see corrective actions linked to each incident.",
            "Check that an incident cannot close while its action is open."
          ],
          "workflow": {
            "role": "Safety coordinator",
            "input": "Incident and action",
            "decision": "Decide closure",
            "record": "Linked records",
            "exception": "Action tracked outside the system"
          },
          "evaluationCriteria": [
            "Can one incident show all its actions?"
          ],
          "example": "An incident shows two linked actions, one open."
        },
        {
          "title": "Verify effectiveness",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Check after a set period that the hazard is controlled and similar reports have stopped.",
            "Record who checked."
          ],
          "workflow": {
            "role": "Safety lead",
            "input": "Closed action",
            "decision": "Decide effective or reopen",
            "record": "Effectiveness check",
            "exception": "Similar report appears again"
          },
          "evaluationCriteria": [
            "Is effectiveness checked, not only completion?"
          ],
          "example": "A check finds a repeat report and reopens the action."
        }
      ],
      "imageBrief": "A supervisor and maintenance technician reviewing a fixed machine guard; authentic manufacturing environment, no readable text or logos",
      "scope": "Cover the decision to act, linking to Improvements, ownership, effectiveness checks and closure."
    },
    {
      "slug": "committee-visibility",
      "title": "Give committees and workers visibility into incident data",
      "description": "Using incident and near-miss reporting software with safety committees: share dashboards, review patterns, support worker participation and respect permissions.",
      "targetWords": 2000,
      "chapterKeyword": "incident and near-miss reporting software committee",
      "boundaries": [
        "Cover committee and worker visibility; do not restate investigation steps.",
        "Treat provincial rules as examples; confirm applicable law."
      ],
      "subsections": [
        {
          "title": "Share the right dashboard",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "The ICC page describes a separate health and safety dashboard with its own permissions; ask what a committee member can see.",
            "Decide whether anonymous reports show to the committee."
          ],
          "workflow": {
            "role": "Safety lead",
            "input": "Dashboard options",
            "decision": "Decide committee access",
            "record": "Access rule",
            "exception": "Sensitive details exposed"
          },
          "evaluationCriteria": [
            "Does the committee see what it needs and no more?"
          ],
          "example": "Committee members see counts and statuses, not names."
        },
        {
          "title": "Review patterns on a set rhythm",
          "sourceIds": [
            "icc-safety",
            "ontario-jhsc-guide"
          ],
          "keyPoints": [
            "Ontario's guide describes a joint health and safety committee meeting at least once every three months and a worker member inspecting the workplace at least once a month, for the workplaces it covers.",
            "Use the log to prepare each meeting; the page says committees otherwise see patterns too late."
          ],
          "workflow": {
            "role": "Committee chair",
            "input": "Log and dashboard",
            "decision": "Decide which patterns to raise",
            "record": "Meeting record",
            "exception": "Rules differ outside Ontario"
          },
          "evaluationCriteria": [
            "Does the meeting pack come from the log?"
          ],
          "example": "A chair lists three repeat locations for discussion."
        },
        {
          "title": "Handle committee recommendations",
          "sourceIds": [
            "ontario-jhsc-guide"
          ],
          "keyPoints": [
            "Ontario's guide says an employer must respond in writing within 21 days to written committee recommendations; confirm current requirements.",
            "Track recommendations like actions."
          ],
          "workflow": {
            "role": "Operations manager",
            "input": "Written recommendation",
            "decision": "Accept or explain",
            "record": "Written response",
            "exception": "Response overdue"
          },
          "evaluationCriteria": [
            "Is each recommendation answered and tracked?"
          ],
          "example": "A recommendation is logged with a response date."
        },
        {
          "title": "Support worker participation",
          "sourceIds": [
            "icc-safety",
            "ontario-jhsc-guide"
          ],
          "keyPoints": [
            "The ICC page maps the module to ISO 45001:2018 clause 5.4, consultation and participation of workers; a mapping is not proof of compliance.",
            "Share outcomes with reporters."
          ],
          "workflow": {
            "role": "Supervisor",
            "input": "Closed reports",
            "decision": "Decide feedback to reporters",
            "record": "Feedback record",
            "exception": "Anonymous reporter cannot be reached"
          },
          "evaluationCriteria": [
            "Do reporters see that reports lead to action?"
          ],
          "example": "A board shows fixes made from floor reports."
        }
      ],
      "imageBrief": "A joint safety committee reviewing a wall display of open actions on a plant floor; authentic manufacturing environment, no readable text or logos",
      "scope": "Cover dashboards, trend review, worker participation, and committee duties as described by Ontario guidance."
    },
    {
      "slug": "audit-evidence-migration",
      "title": "Prepare audit evidence and migrate existing incident logs",
      "description": "Preparing audit evidence in incident and near-miss reporting software: map ISO 45001 clauses, clean and import old logs, and verify records before cutover.",
      "targetWords": 2000,
      "chapterKeyword": "incident and near-miss reporting software audit evidence migration",
      "boundaries": [
        "Cover audit evidence and migration; keep day-to-day workflow in earlier chapters.",
        "Do not claim software alone satisfies a clause."
      ],
      "subsections": [
        {
          "title": "Know what an auditor sees",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "The page describes an auditor view with the incident and near-miss log, severity and status, floor reports including anonymous ones, and linked corrective actions.",
            "Rehearse the audit view with sample records."
          ],
          "workflow": {
            "role": "Safety lead",
            "input": "Audit view",
            "decision": "Decide gaps",
            "record": "Gap list",
            "exception": "Records incomplete"
          },
          "evaluationCriteria": [
            "Can one report be traced end to end?"
          ],
          "example": "A rehearsal finds a report without a linked action."
        },
        {
          "title": "Map clauses without overclaiming",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "The page maps the module to ISO 45001:2018 clauses 10.2, 5.4 and 6.1.2.",
            "A mapping is a pointer to evidence, not a guarantee."
          ],
          "workflow": {
            "role": "Management representative",
            "input": "Clause list",
            "decision": "Decide evidence per clause",
            "record": "Evidence map",
            "exception": "Clause needs more than the module"
          },
          "evaluationCriteria": [
            "Does each clause list real evidence?"
          ],
          "example": "A map lists clause 10.2 evidence as linked actions."
        },
        {
          "title": "Clean and import existing logs",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Decide which historical records to import; ask how the import works, as the page does not describe it.",
            "Keep originals."
          ],
          "workflow": {
            "role": "Data owner",
            "input": "Old logs",
            "decision": "Decide scope and mapping",
            "record": "Import plan",
            "exception": "Inconsistent old data"
          },
          "evaluationCriteria": [
            "Was a sample import verified?"
          ],
          "example": "A pilot imports 50 old records and finds date errors."
        },
        {
          "title": "Plan cutover and training",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "The page describes deployment to the floor with training campaigns and a consultant review.",
            "Run old and new in parallel briefly."
          ],
          "workflow": {
            "role": "Implementation lead",
            "input": "Pilot results",
            "decision": "Decide cutover date",
            "record": "Cutover plan",
            "exception": "Pilot fails"
          },
          "evaluationCriteria": [
            "Is there a rollback step?"
          ],
          "example": "A plan keeps paper forms for two weeks."
        }
      ],
      "imageBrief": "An auditor and safety coordinator reviewing printed incident log pages at a table; authentic manufacturing environment, no readable text or logos",
      "scope": "Cover the auditor view, ISO 45001 clause mapping, migration of old logs and cutover."
    },
    {
      "slug": "ongoing-operation",
      "title": "Review performance, answer common questions and prepare a demonstration",
      "description": "Operating incident and near-miss reporting software over time: review the workflow, answer common questions without overclaiming and prepare a demonstration.",
      "targetWords": 2000,
      "chapterKeyword": "incident and near-miss reporting software ongoing review",
      "boundaries": [
        "Cover system-level review, FAQs and the demonstration invitation.",
        "Do not guarantee compliance outcomes."
      ],
      "subsections": [
        {
          "title": "Review the workflow and evidence",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Sample reports each quarter for completeness, rating consistency and action closure.",
            "Set baselines before judging improvement."
          ],
          "workflow": {
            "role": "Safety lead",
            "input": "Sampled records",
            "decision": "Decide improvements",
            "record": "Review findings",
            "exception": "Evidence too thin"
          },
          "evaluationCriteria": [
            "Are baselines recorded?"
          ],
          "example": "The team samples ten reports each quarter."
        },
        {
          "title": "Answer common questions without overclaiming",
          "sourceIds": [
            "icc-safety",
            "ontario-jhsc-guide"
          ],
          "keyPoints": [
            "Answer the outline FAQs using the supplied sources.",
            "The page maps to ISO 45001 clauses; software alone does not satisfy them."
          ],
          "workflow": {
            "role": "Safety lead",
            "input": "FAQ list",
            "decision": "Answer within evidence",
            "record": "Approved answers",
            "exception": "Question needs legal advice"
          },
          "evaluationCriteria": [
            "Do answers avoid guarantees?"
          ],
          "example": "The team explains that anonymity rules need a policy."
        },
        {
          "title": "Prepare a focused ICC demonstration",
          "sourceIds": [
            "icc-safety"
          ],
          "keyPoints": [
            "Bring a real report, an anonymous report and an open action.",
            "Request written answers on notifications, import, pricing and regulatory reporting."
          ],
          "workflow": {
            "role": "Evaluation lead",
            "input": "Scenario and open questions",
            "decision": "Proceed, clarify or reject",
            "record": "Demonstration results",
            "exception": "A path cannot be shown"
          },
          "evaluationCriteria": [
            "Does the demonstration show the full path with limits stated?"
          ],
          "example": "The team asks to see an anonymous report become a linked action."
        }
      ],
      "imageBrief": "A safety lead reviewing a printed monthly summary beside a production line; authentic manufacturing environment, no readable text or logos",
      "scope": "Cover periodic review, FAQs and the demonstration invitation."
    }
  ],
  "faqQuestions": [
    "What problem should incident and near-miss reporting software solve first?",
    "What is the difference between an incident and a near-miss?",
    "How should severity be rated?",
    "Should anonymous reporting be allowed?",
    "Which old logs should be migrated?",
    "How should incidents link to corrective actions?",
    "What evidence should be ready for an auditor?",
    "How do safety committees use the log?",
    "Does software guarantee ISO 45001 compliance?",
    "What should be prepared for a software demonstration?"
  ]
}

# ICC software guide writing rules

Write for Canadian quality and operations teams evaluating or implementing software. Explain roles, inputs, decisions, records, exceptions, evaluation criteria and rollout. Use ISO requirements as supporting context rather than the main structure.

- Write the introduction and chapters in separate Markdown files. The page shell supplies the H1; body subsections use H2, and FAQ questions use H3.
- Nine chapters, each 2,000–2,200 visible words. Introduction at least 1,500 words. Entire guide at most 20,000 words including introduction, FAQs and closing invitation. Target 19,500; never use repetitive filler.
- Use third person or direct address, US spelling and naturally capitalized terminology. Avoid the blog rule file's banned filler phrases. Do not paste or bold raw SEO keywords.
- The introduction states the reader benefit in one sentence: what a team gains from managing the work in compliance management software in general, not a promise about ICC's product. Describe AI only as preparing drafts that a person reviews before they enter a controlled record (the ICC evidence supports review, not approval), and never claim a capability that is not in the verified register.
- Never write the product brand as one word, "Quro", the product's web address, "AI gap assessment/analysis" or "AI audit finding(s)"; call it "compliance management software", a module's name, or "AI Assistant".
- Titles, descriptions, keywords and URLs are fixed by the final brief. Descriptions must be 120–160 characters. Chapter order comes from the manifest.
- Use only the frozen primary sources and capability register entries. A primary source's existence is not proof of an unrelated claim. Cite the precise source that supports the point. Do not call historical ISO guidance the current edition; resolve edition conflicts before making edition claims.
- Distinguish software evaluation criteria from product features. Pending or retired ICC capabilities cannot be advertised. Use verified ICC-specific evidence for every advertised capability.
- Do not invent quotations, statistics, named clients, testimonials, client results or product behavior. Begin hypothetical scenarios with `**Illustrative example:**` and use unnamed businesses. Illustrative calculations must expose their assumptions and never describe actual results.
- Cover each chapter's distinct scope. Use paragraphs, practical tables, steps and decision criteria where helpful. Avoid repeating definitions, introductions, examples or closing language across chapters.
- Include 8–10 distinct FAQ answers across the guide. Put them in the assigned FAQ subsection; do not repeat the same FAQ on every chapter. The last chapter closes with an invitation to request a software demonstration at `/contact/`: the closing paragraph contains "demo" or "demonstration" and links `/contact/` (for example `[book a demo](/contact/)`). The `demonstration-invitation` check blocks the guide otherwise. Do not put the slogan "Stop managing compliance. Start automating it." in the text: the page's demo box already shows it, and the chapter reviewer rejects it as an unsupported claim.
- Each page has its own managed industrial hero brief. Use manufacturing workflow scenes; no generic office scenes, fabricated product screenshots, logos or readable invented interface text. Do not emit inline image markers or untracked image links; the guide pipeline rejects them until inline provenance is supported.
- Use short paragraphs, clear role/input/decision/record/exception explanations and practical evaluation criteria. A table, list or Important/Key Consideration callout should help the decision, never fill a formatting quota. Each FAQ answer must give actionable detail, rather than a question heading with a token answer.
- Read `guide-context.json` and the exact subsection brief. Preserve the reviewed glossary, example and decisions. Review each chapter before writing the next; edits to an earlier chapter require re-review of affected downstream chapters.
- Aim near 2,000 chapter words, but use `guide budget` to determine the actual allowed maximum. Reserve at least 2,000 for each unwritten chapter and 1,500 for the introduction. Length or editorial corrections target named subsections; preserve exact citations and factual quantities.
- Every page links at least one site page (a path such as `/solutions/training-competence/` or the full site URL; both count as internal and must resolve) and at least one assigned primary source. The `useful-links` check runs at each chapter checkpoint and again at publication.
- Source and chapter reviews are required. Missing audit credentials, stale review hashes, unresolved accuracy/repetition findings or broken links block publication. Never edit checks or evidence to make a failed draft pass.

Before checkpointing a page, count visible words, check its assigned scope and evidence, remove duplicate explanations, verify internal destinations and flag any statement the frozen evidence does not support.
