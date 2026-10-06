// Central site data — standards, industries, process, software, stats.
// Source of truth mirrors docs/knowledge-base/page-registry.md + brand-guide.md.
// Product claims come from the verified feature fact sheet in
// docs/website-content-refresh-prompt.md; do not add capabilities that are not listed there.

export const SITE = {
  name: "ISO Certification Consultants",
  legalName: "ISO Certification Consultants Inc.",
  domain: "isocertificationconsultants.ca",
  url: "https://isocertificationconsultants.ca",
  tagline:
    "ISO certification consulting for Canadian companies, with compliance management software configured by certified consultants",
  // Shown on the contact page and in the footer; swap for a shared inbox when one exists.
  email: "anthony.mannella@isocertificationconsultants.ca",
  phone: "+1 (416) 622-0022",
  region: "Ontario, Canada",
  // Brand artwork under /public: the square "ICC" mark shown beside the name, and the
  // full logo with the company name beneath it.
  logoMark: "/images/logo-mark.png",
  logo: "/images/logo.png",
  forms: {
    // Web3Forms access key; it is public by design and bound to the inbox it was generated for.
    web3formsKey: "",
  },
  bbb: {
    businessId: "1408097",
    profileUrl:
      "https://www.bbb.org/ca/on/toronto/profile/compliance-consulting/iso-certification-consultants-inc-0107-1408097",
  },
};

// Positioning constants — customization first, any standard.
export const ANY_STANDARD = {
  title: "Your standard not listed?",
  detail:
    "ISO, IATF and AS are the start. Customer-specific requirements, regulatory frameworks and internal quality standards are added as custom standards: the clauses are imported from a workbook and tracked with the same status, evidence links and coverage view.",
};

export type StandardSupport = {
  summary: string;
  moduleSlugs: string[];
  inCatalogue: boolean;
};

export type Standard = {
  slug: string;
  code: string;
  name: string;
  category: string;
  summary: string;
  keyword: string;
  clauses: string;
  tools: string[];
  platformSupport: StandardSupport;
};

export const STANDARDS: Standard[] = [
  {
    slug: "iso-9001",
    code: "ISO 9001",
    name: "Quality Management",
    category: "Quality",
    summary:
      "The foundation of every certified operation. Risk-based thinking, document control, and continual improvement built around your real production floor.",
    keyword: "iso 9001 certification canada",
    clauses: "10 clauses · 7 quality principles",
    tools: ["Documents", "Internal Auditing", "Management Review", "CAPA"],
    platformSupport: {
      summary:
        "ISO 9001:2015 is loaded clause by clause in the Standards workspace. Documented information, internal audit, nonconformity and corrective action, competence and externally provided processes each map to a module that produces the records the auditor asks for.",
      moduleSlugs: [
        "standards",
        "document-control",
        "audits-management-review",
        "nonconformance-capa",
        "training-competence",
        "supplier-quality",
      ],
      inCatalogue: true,
    },
  },
  {
    slug: "iatf-16949",
    code: "IATF 16949",
    name: "Automotive Quality",
    category: "Automotive",
    summary:
      "The automotive supplement to ISO 9001, with the core tools your OEM customers audit against: APQP, PPAP, FMEA, MSA and SPC.",
    keyword: "iatf 16949 certification canada",
    clauses: "Built on ISO 9001 + automotive core tools",
    tools: ["APQP", "PPAP", "FMEA", "SPC", "MSA"],
    platformSupport: {
      summary:
        "IATF 16949 sits in the catalogue beside ISO 9001. Supplier Quality holds APQP, PPAP, PFMEA, Process Flow and Control Plan records linked to each other, and SCARs reach suppliers through the portal instead of an inbox.",
      moduleSlugs: [
        "supplier-quality",
        "nonconformance-capa",
        "processes",
        "audits-management-review",
        "calibration-maintenance",
      ],
      inCatalogue: true,
    },
  },
  {
    slug: "as9100",
    code: "AS9100",
    name: "Aerospace Quality",
    category: "Aerospace",
    summary:
      "Aerospace, space and defence quality with configuration management, counterfeit-part prevention and FOD control layered onto ISO 9001.",
    keyword: "as9100 consulting canada",
    clauses: "AS9100D · aligned to ISO 9001",
    tools: ["FOD Prevention", "Configuration Management", "Counterfeit Parts Control"],
    platformSupport: {
      summary:
        "AS9100D is in the catalogue. First article inspection (FAI) packages are tracked in Supplier Quality, controlled documents carry the revision history configuration control depends on, and every clause links to the evidence behind it.",
      moduleSlugs: [
        "standards",
        "document-control",
        "supplier-quality",
        "calibration-maintenance",
        "audits-management-review",
      ],
      inCatalogue: true,
    },
  },
  {
    slug: "iso-13485",
    code: "ISO 13485",
    name: "Medical Devices",
    category: "Medical",
    summary:
      "Design controls, MDSAP readiness and Health Canada MDEL alignment for device makers who cannot afford a nonconformance.",
    keyword: "iso 13485 consulting canada",
    clauses: "Medical device QMS · MDSAP ready",
    tools: ["Design Controls", "MDSAP", "MDEL", "Supplier Management"],
    platformSupport: {
      summary:
        "ISO 13485 is in the catalogue. Documents covers control of documents and records, Assets covers monitoring and measuring equipment, Training holds personnel records, and Improvements carries corrective action to a verified close.",
      moduleSlugs: [
        "document-control",
        "calibration-maintenance",
        "training-competence",
        "nonconformance-capa",
        "supplier-quality",
      ],
      inCatalogue: true,
    },
  },
  {
    slug: "iso-14001",
    code: "ISO 14001",
    name: "Environmental Management",
    category: "Environment",
    summary:
      "Environmental aspects, lifecycle thinking and legal-compliance tracking that stand up to regulators and customer sustainability audits.",
    keyword: "iso 14001 certification canada",
    clauses: "Environmental management system",
    tools: ["Aspects & Impacts", "Legal Compliance", "Emergency Preparedness"],
    platformSupport: {
      summary:
        "ISO 14001 is in the catalogue. Clause status, evidence links and the statement of applicability live in the Standards workspace, and audits, corrective actions and training records come from the same modules used for ISO 9001, so one system carries both.",
      moduleSlugs: [
        "standards",
        "audits-management-review",
        "nonconformance-capa",
        "training-competence",
        "document-control",
      ],
      inCatalogue: true,
    },
  },
  {
    slug: "iso-45001",
    code: "ISO 45001",
    name: "OH&S Management",
    category: "Safety",
    summary:
      "Occupational health and safety built on hazard identification, the hierarchy of controls and worker participation — not just paperwork.",
    keyword: "iso 45001 certification canada",
    clauses: "Occupational health & safety",
    tools: ["Hazard Identification", "Hierarchy of Controls", "Emergency Response"],
    platformSupport: {
      summary:
        "ISO 45001 is in the catalogue. Safety captures incidents and near-misses, including anonymous reports from the floor, and Improvements carries them to root cause and corrective action.",
      moduleSlugs: [
        "safety",
        "nonconformance-capa",
        "training-competence",
        "audits-management-review",
        "standards",
      ],
      inCatalogue: true,
    },
  },
  {
    slug: "iso-27001",
    code: "ISO 27001",
    name: "Information Security",
    category: "Security",
    summary:
      "An information security management system with a risk-driven Statement of Applicability, ready for the customers demanding proof.",
    keyword: "iso 27001 consulting canada",
    clauses: "ISMS · Annex A controls",
    tools: ["Risk Assessment", "Statement of Applicability", "Access Control"],
    platformSupport: {
      summary:
        "ISO 27001 is in the catalogue. The Standards workspace tracks the status of each requirement and exports the statement of applicability the standard calls for, Documents holds the policies, and Audits holds the internal audit programme.",
      moduleSlugs: [
        "standards",
        "document-control",
        "audits-management-review",
        "nonconformance-capa",
      ],
      inCatalogue: true,
    },
  },
  {
    slug: "iso-22000",
    code: "ISO 22000",
    name: "Food Safety",
    category: "Food",
    summary:
      "Food safety management integrating HACCP, prerequisite programs and CFIA compliance for Canadian processors and manufacturers.",
    keyword: "iso 22000 consulting canada",
    clauses: "Food safety management system",
    tools: ["HACCP", "Prerequisite Programs", "CFIA Compliance"],
    platformSupport: {
      summary:
        "ISO 22000 is in the catalogue. Supplier Quality holds supplier approval gates and compliance documents with expiry dates, Improvements records complaints with containment and effectiveness checks, and Documents keeps prerequisite programme documents current.",
      moduleSlugs: [
        "supplier-quality",
        "vendors",
        "nonconformance-capa",
        "document-control",
        "training-competence",
      ],
      inCatalogue: true,
    },
  },
  {
    slug: "iso-22301",
    code: "ISO 22301",
    name: "Business Continuity",
    category: "Continuity",
    summary:
      "Business continuity management — impact analysis, recovery strategies and tested plans that keep production running through disruption.",
    keyword: "iso 22301 consulting canada",
    clauses: "Business continuity management",
    tools: ["Business Impact Analysis", "Recovery Strategy", "Continuity Testing"],
    platformSupport: {
      summary:
        "ISO 22301 is not in the standard catalogue. It is supported as a custom standard: the clauses are imported from a workbook, then tracked with the same status, evidence links and coverage view as any catalogue standard.",
      moduleSlugs: ["standards", "document-control", "audits-management-review"],
      inCatalogue: false,
    },
  },
  {
    slug: "iso-17025",
    code: "ISO/IEC 17025",
    name: "Lab Accreditation",
    category: "Laboratory",
    summary:
      "Testing and calibration laboratory accreditation with measurement traceability, method validation and competence you can defend.",
    keyword: "iso 17025 accreditation canada",
    clauses: "Laboratory competence & accreditation",
    tools: ["Measurement Traceability", "Method Validation", "Proficiency Testing"],
    platformSupport: {
      summary:
        "ISO/IEC 17025 is in the catalogue. Assets holds the equipment register, calibration intervals and certificates, Training holds personnel competence records, and Audits and Improvements cover internal audits and corrective actions.",
      moduleSlugs: [
        "calibration-maintenance",
        "training-competence",
        "document-control",
        "audits-management-review",
        "nonconformance-capa",
      ],
      inCatalogue: true,
    },
  },
];

export type Industry = {
  slug: string;
  name: string;
  blurb: string;
  standards: string[];
  keyword: string;
  moduleSlugs: string[];
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "manufacturing",
    name: "Manufacturing",
    blurb:
      "Discrete and process manufacturers building a compliance management system that survives customer audits and scales with the line.",
    standards: ["ISO 9001", "ISO 14001", "ISO 45001"],
    keyword: "iso consulting manufacturing canada",
    moduleSlugs: [
      "standards",
      "processes",
      "audits-management-review",
      "nonconformance-capa",
      "document-control",
    ],
  },
  {
    slug: "automotive",
    name: "Automotive",
    blurb:
      "Tier 1 and Tier 2 suppliers meeting IATF 16949 and the core tools their OEM customers demand.",
    standards: ["IATF 16949", "ISO 9001", "ISO 14001"],
    keyword: "iso consulting automotive canada",
    moduleSlugs: [
      "supplier-quality",
      "nonconformance-capa",
      "audits-management-review",
      "document-control",
      "processes",
    ],
  },
  {
    slug: "aerospace-defence",
    name: "Aerospace & Defence",
    blurb:
      "Precision machine shops and assemblies achieving AS9100 with configuration control and first article evidence their primes accept.",
    standards: ["AS9100", "ISO 9001", "ISO 27001"],
    keyword: "iso consulting aerospace canada",
    moduleSlugs: [
      "supplier-quality",
      "calibration-maintenance",
      "document-control",
      "standards",
      "audits-management-review",
    ],
  },
  {
    slug: "healthcare-medical-devices",
    name: "Healthcare & Medical Devices",
    blurb:
      "Device manufacturers navigating ISO 13485, MDSAP and Health Canada licensing without stalling the pipeline.",
    standards: ["ISO 13485", "ISO 9001", "ISO 27001"],
    keyword: "iso 13485 medical device canada",
    moduleSlugs: [
      "document-control",
      "calibration-maintenance",
      "training-competence",
      "nonconformance-capa",
      "supplier-quality",
    ],
  },
  {
    slug: "food-beverage",
    name: "Food & Beverage",
    blurb:
      "Processors and packagers integrating ISO 22000, HACCP and CFIA requirements into one auditable system.",
    standards: ["ISO 22000", "ISO 9001", "ISO 14001"],
    keyword: "iso consulting food beverage canada",
    moduleSlugs: [
      "supplier-quality",
      "vendors",
      "nonconformance-capa",
      "safety",
      "document-control",
      "training-competence",
    ],
  },
  {
    slug: "oil-gas-energy",
    name: "Oil, Gas & Energy",
    blurb:
      "Energy operators managing quality, environment and safety across high-consequence, heavily-regulated operations.",
    standards: ["ISO 9001", "ISO 14001", "ISO 45001"],
    keyword: "iso consulting oil gas canada",
    moduleSlugs: [
      "standards",
      "document-control",
      "audits-management-review",
      "nonconformance-capa",
      "safety",
      "training-competence",
    ],
  },
  {
    slug: "construction",
    name: "Construction",
    blurb:
      "Contractors and fabricators winning tenders with integrated quality, safety and environmental management.",
    standards: ["ISO 9001", "ISO 45001", "ISO 14001"],
    keyword: "iso consulting construction canada",
    moduleSlugs: [
      "standards",
      "document-control",
      "safety",
      "supplier-quality",
      "training-competence",
      "audits-management-review",
    ],
  },
  {
    slug: "mining-natural-resources",
    name: "Mining & Natural Resources",
    blurb:
      "Extractive and resource operations proving environmental stewardship and safety leadership under scrutiny.",
    standards: ["ISO 14001", "ISO 45001", "ISO 9001"],
    keyword: "iso consulting mining canada",
    moduleSlugs: [
      "safety",
      "standards",
      "audits-management-review",
      "nonconformance-capa",
      "training-competence",
      "document-control",
    ],
  },
];

export type ProcessStage = {
  n: string;
  title: string;
  duration: string;
  detail: string;
};

export const PROCESS: ProcessStage[] = [
  {
    n: "01",
    title: "Gap Analysis",
    duration: "Weeks 1–2",
    detail:
      "A structured assessment of your current operations against the target standard. Every clause scored, every gap mapped to an owner and a due date.",
  },
  {
    n: "02",
    title: "System Design",
    duration: "Weeks 2–5",
    detail:
      "A compliance management system designed around how your business runs. Processes are mapped with owners in Processes, and clauses are marked in or out of scope in the Standards workspace, not copied from a template.",
  },
  {
    n: "03",
    title: "Documentation",
    duration: "Weeks 4–9",
    detail:
      "Procedures, work instructions and records drafted in Documents, with optional AI drafting and consultant review. Lean documentation your team will use.",
  },
  {
    n: "04",
    title: "Implementation",
    duration: "Weeks 8–16",
    detail:
      "Roll-out with training campaigns, competency records and evidence capture. My actions and the daily summary show who still owes what, so nothing slips before the audit.",
  },
  {
    n: "05",
    title: "Internal Audit",
    duration: "Weeks 14–18",
    detail:
      "A full internal audit in the Audits workspace and a management review that surface findings early. Corrective actions are closed in Improvements before the certification body arrives.",
  },
  {
    n: "06",
    title: "Certification",
    duration: "Weeks 18–24",
    detail:
      "Stage 1 and Stage 2 audit support with your registrar. We are in the room, and we stay on for surveillance-audit readiness.",
  },
];

export type PlatformFeature = {
  title: string;
  detail: string;
  icon: string;
};

// What the compliance management software adds on top of the modules. Every AI
// capability is a suggestion a person reviews; say so on every card.
export const PLATFORM: PlatformFeature[] = [
  {
    icon: "assistant",
    title: "AI Assistant",
    detail:
      "Carries out tasks in the software within the permissions of the person asking. A multi-step request becomes a visible plan the user approves, and destructive steps need extra confirmation.",
  },
  {
    icon: "loop",
    title: "Notifications and daily summary",
    detail:
      "Email notifications when work is assigned or due, and a daily summary of pending work, so nothing waits in someone's inbox unnoticed.",
  },
  {
    icon: "document",
    title: "Optional AI drafting",
    detail:
      "AI drafting of controlled documents is off until the organization turns it on. Every draft enters the normal review and approval lifecycle before it is published.",
  },
  {
    icon: "dashboard",
    title: "Home dashboard",
    detail:
      "An attention-required panel and a coverage overview on sign-in, with My actions, email notifications and a daily summary of pending work behind it.",
  },
  {
    icon: "expert",
    title: "Consultant On Call",
    detail:
      "The software holds the evidence; a certified lead consultant reviews the work and joins you for the audit that matters.",
  },
];

export const STATS = [
  { value: 11, suffix: "", label: "compliance software modules" },
  { value: 100, suffix: "%", label: "configured to your workflow — no rigid templates" },
  { value: 8, suffix: "", label: "industries served across Canada" },
  { value: 24, suffix: "wk", label: "typical path to certification" },
];

export const DIFFERENTIATORS = [
  {
    title: "Configured, not templated",
    detail:
      "Every module adapts to your forms, fields, routing and terminology. The system fits how your business runs, not the other way around.",
  },
  {
    title: "Any standard, onboarded",
    detail:
      "ISO, IATF and AS are the start. Customer-specific, regulatory or internal standards are imported from a workbook as custom standards and tracked clause by clause.",
  },
  {
    title: "Your processes first",
    detail:
      "Processes are mapped as they run, with named owners and the documents and clauses linked to each one, instead of being forced into generic business software.",
  },
  {
    title: "Hybrid delivery",
    detail:
      "Compliance management software plus certified consultants configuring it with you, from the first process map to a passed certification audit.",
  },
];

// ── Modules — what the compliance management software does today. Each entry
//    carries the full page copy for /solutions/<slug>. Order leads with the
//    quality manager's daily priorities and decides which six appear in the footer.
export type ModuleClause = {
  standard: string;
  clause: string;
  label: string;
};

export type Module = {
  slug: string;
  name: string;
  icon: string;
  tagline: string;
  summary: string;
  features: string[];
  standardsHint: string;
  metaDescription: string;
  problem: string;
  howItWorks: string[];
  auditorSees: string[];
  clauses: ModuleClause[];
  related: string[];
  cta: { label: string; href: string };
};

export const MODULES: Module[] = [
  {
    slug: "standards",
    name: "Standards",
    icon: "assessment",
    tagline: "Know your clause coverage before the auditor does",
    summary:
      "A clause-by-clause workspace for every standard you certify against, with a status per clause, a coverage percentage against a target, and the evidence linked behind each one.",
    features: [
      "Status per clause: Compliant, Partial, Review overdue, No evidence",
      "Overall coverage percentage against a target",
      "Documents and records linked to clauses as evidence",
      "Statement of applicability export (.xlsx)",
    ],
    standardsHint: "Supports every catalogue standard, plus custom standards",
    metaDescription:
      "Standards module with a status for every clause, coverage against a target, evidence linked to each clause and a statement of applicability export.",
    problem:
      "You cannot see which clauses are covered until an auditor points at the gap. The standard lives in a spreadsheet someone built years ago, the evidence lives in a shared drive, and nobody can say with confidence how ready the business is.",
    howItWorks: [
      "Every clause of the standard is listed with a status: Compliant, Partial, Review overdue or No evidence.",
      "Overall coverage is shown as a percentage against a target you set.",
      "Controlled documents and records are linked to clauses as evidence, so the proof sits behind the clause it satisfies.",
      "Clauses can be marked in or out of scope, with a written justification that stays on record.",
      "The statement of applicability exports to Excel (.xlsx).",
      "Customer-specific or regulatory standards are added as custom standards, with clauses imported from a workbook.",
    ],
    auditorSees: [
      "A status for every clause, with the date it was last reviewed.",
      "The documents and records linked to each clause, opened from the clause itself.",
      "Scope exclusions with the justification written at the time.",
      "The exported statement of applicability.",
    ],
    clauses: [
      { standard: "ISO 9001:2015", clause: "4.3", label: "Determining the scope of the quality management system" },
      { standard: "ISO 9001:2015", clause: "4.4", label: "Quality management system and its processes" },
      { standard: "ISO 9001:2015", clause: "6.1", label: "Actions to address risks and opportunities" },
      { standard: "ISO 9001:2015", clause: "9.1", label: "Monitoring, measurement, analysis and evaluation" },
    ],
    related: ["document-control", "audits-management-review", "processes"],
    cta: { label: "See the Standards workspace", href: "/contact" },
  },
  {
    slug: "document-control",
    name: "Documents",
    icon: "document",
    tagline: "One current revision, and proof of which one it is",
    summary:
      "Controlled documents move through Draft, In review, Approved, Published and Obsolete. Approved copies are frozen and hash-verified, so the revision an auditor opens is the one you approved.",
    features: [
      "Lifecycle: Draft, In review, Approved, Published, Obsolete",
      "Sequential or parallel approvers; owners cannot approve their own documents",
      "Word and Excel edited in the browser, PDF and PowerPoint previewed",
      "Approved copies frozen and hash-verified",
    ],
    standardsHint: "Foundation for every standard",
    metaDescription:
      "Document control software: Draft to Obsolete lifecycle, sequential or parallel approvers, in-browser Word and Excel editing, hash-verified approved copies.",
    problem:
      "Nobody knows which revision is current. The procedure on the floor is two versions behind the one on the server, approvals happen by email, and the week before the audit someone has to reconstruct who approved what, and when.",
    howItWorks: [
      "Every document follows one lifecycle: Draft, In review, Approved, Published, Obsolete.",
      "Approvers are set in sequence or in parallel. An owner cannot approve their own document.",
      "Word and Excel files are edited in the browser. PDF and PowerPoint files are previewed. Legacy .doc and .xls files are converted to an editable copy.",
      "Versions are compared with the changes marked, and reviewers leave comments on the document.",
      "Approved copies are frozen and hash-verified. Branded letterheads, translations and bulk upload are built in.",
      "Deleted documents sit in a trash with a 30-day recovery window.",
      "AI drafting is optional and off until the organization turns it on. Every draft is reviewed by a person before it enters the lifecycle.",
    ],
    auditorSees: [
      "The published revision, frozen at approval, with its hash.",
      "The approval chain: who approved, in what order, and when.",
      "A version comparison showing what changed between revisions.",
      "Obsolete revisions kept for the record and clearly marked.",
    ],
    clauses: [
      { standard: "ISO 9001:2015", clause: "7.5", label: "Documented information" },
      { standard: "ISO 13485:2016", clause: "4.2.4", label: "Control of documents" },
      { standard: "ISO 13485:2016", clause: "4.2.5", label: "Control of records" },
      { standard: "ISO/IEC 17025:2017", clause: "8.3", label: "Control of management system documents" },
      { standard: "AS9100D", clause: "8.1.2", label: "Configuration management" },
    ],
    related: ["standards", "processes", "training-competence"],
    cta: { label: "Talk about document control", href: "/contact" },
  },
  {
    slug: "processes",
    name: "Processes",
    icon: "design",
    tagline: "Your processes, with owners, drawn once",
    summary:
      "A Level-1 map of the business grouped by category, a Level-2 flowchart for each process, a named owner per process, and the documents and clauses linked to it.",
    features: [
      "Level-1 map: Management, Customer-facing, Core, Support",
      "Level-2 flowchart canvas per process",
      "Owner per process; documents and clauses linked",
      "Industry process templates; supported PDF charts imported for review",
    ],
    standardsHint: "Supports every management-system standard",
    metaDescription:
      "Process mapping software with a Level-1 process map, Level-2 flowcharts, named owners, linked documents and clauses, and industry process templates.",
    problem:
      "The process map was drawn for the last audit and has not been opened since. Nobody owns half the processes on it, and the documents that describe them are not connected to it, so the auditor's first question, show me how this process runs, takes an afternoon to answer.",
    howItWorks: [
      "The Level-1 map groups processes into Management, Customer-facing, Core and Support.",
      "Each process opens into a Level-2 flowchart canvas.",
      "Every process has a named owner.",
      "Controlled documents and standard clauses are linked to the processes they belong to.",
      "Industry process templates give a starting map for aerospace, automotive, medical devices, food and beverage and other sectors.",
      "Existing process charts in supported PDF formats can be imported for review before they are accepted.",
    ],
    auditorSees: [
      "The Level-1 map with the category and owner of each process.",
      "The flowchart for any process, opened from the map.",
      "The documents and clauses linked to each process.",
    ],
    clauses: [
      { standard: "ISO 9001:2015", clause: "4.4", label: "Quality management system and its processes" },
      { standard: "ISO 9001:2015", clause: "5.3", label: "Organizational roles, responsibilities and authorities" },
    ],
    related: ["document-control", "standards", "audits-management-review"],
    cta: { label: "Map your processes with a consultant", href: "/contact" },
  },
  {
    slug: "audits-management-review",
    name: "Audits",
    icon: "audit",
    tagline: "Findings captured on the floor, not retyped later",
    summary:
      "Plan the annual audit programme, run each audit in a workspace where the checklist, findings and evidence sit together, and produce a branded PDF report when it closes.",
    features: [
      "Scheduling wizard and annual audit programme",
      "Execution workspace with checklist, findings and evidence",
      "Findings recorded by the auditor in the workspace, with evidence attached",
      "Branded PDF report, audit trends, reusable checklist library",
    ],
    standardsHint: "Supports every ISO, IATF and AS standard",
    metaDescription:
      "Internal audit software with a scheduling wizard, annual programme, execution workspace for checklist, findings and evidence, and branded PDF reports.",
    problem:
      "Checklists are on paper. Findings are retyped into a report afterwards, evidence photos are lost on a phone, and the annual programme is a spreadsheet that drifts from reality by the second quarter.",
    howItWorks: [
      "A scheduling wizard builds the annual audit programme.",
      "Each audit runs in an execution workspace: the checklist, the findings and the evidence sit together.",
      "Checklists are kept in a reusable library.",
      "A branded PDF report is produced when the audit closes.",
      "Audit trends show where findings recur.",
    ],
    auditorSees: [
      "The annual programme and the status of each planned audit.",
      "The completed checklist with the evidence attached to each item.",
      "Findings with their owners and closure status.",
      "The PDF report for every closed audit.",
    ],
    clauses: [
      { standard: "ISO 9001:2015", clause: "9.2", label: "Internal audit" },
      { standard: "ISO 13485:2016", clause: "8.2.4", label: "Internal audit" },
      { standard: "ISO/IEC 17025:2017", clause: "8.8", label: "Internal audits" },
      { standard: "IATF 16949:2016", clause: "8.4.2.4.1", label: "Second-party audits" },
    ],
    related: ["nonconformance-capa", "standards", "supplier-quality"],
    cta: { label: "Plan your audit programme", href: "/contact" },
  },
  {
    slug: "nonconformance-capa",
    name: "Improvements",
    icon: "capa",
    tagline: "Every finding has an owner and a verified fix",
    summary:
      "Record nonconformities, complaints and improvements, contain them, work them to root cause with 8D, 5 Whys, Fishbone or Fault tree, and close them only after the corrective action is verified effective.",
    features: [
      "Nonconformities, complaints and improvements in one register",
      "Containment, then root cause analysis: 8D, 5 Whys, Fishbone, Fault tree",
      "CAPA with effectiveness verification before closure",
      "SCAR raised to a supplier directly; sealed, printable report after closure",
    ],
    standardsHint: "Supports ISO 9001, ISO 13485, IATF 16949",
    metaDescription:
      "Nonconformance and CAPA software: containment, root cause analysis with 8D, 5 Whys, Fishbone or Fault tree, effectiveness verification and sealed reports.",
    problem:
      "CAPAs stall with no owner. A nonconformance is raised, a quick fix is applied, and the root cause analysis never happens because nothing forces it. At the audit, the open items list is longer than anyone expected.",
    howItWorks: [
      "Nonconformities, customer complaints and improvement ideas are recorded in one place.",
      "Containment actions are recorded first, with the person responsible.",
      "Root cause analysis uses 8D, 5 Whys, Fishbone or Fault tree, and the method and its working stay on the record.",
      "Corrective actions carry an owner and a due date, and closure requires an effectiveness verification.",
      "A SCAR can be raised to a supplier directly from the nonconformance.",
      "After closure the report is sealed and printable.",
      "The dashboard shows open items by age and owner. Custom fields capture what your process needs.",
    ],
    auditorSees: [
      "The containment record and who carried it out.",
      "The root cause analysis with the method used.",
      "The corrective action, its owner, and the effectiveness check that closed it.",
      "The sealed report for every closed item.",
    ],
    clauses: [
      { standard: "ISO 9001:2015", clause: "8.7", label: "Control of nonconforming outputs" },
      { standard: "ISO 9001:2015", clause: "10.2", label: "Nonconformity and corrective action" },
      { standard: "ISO 13485:2016", clause: "8.5.2", label: "Corrective action" },
      { standard: "ISO/IEC 17025:2017", clause: "8.7", label: "Corrective actions" },
      { standard: "IATF 16949:2016", clause: "10.2.3", label: "Problem solving" },
    ],
    related: ["audits-management-review", "supplier-quality", "safety"],
    cta: { label: "See how CAPA closes the loop", href: "/contact" },
  },
  {
    slug: "safety",
    name: "Safety",
    icon: "certificate",
    tagline: "Near-misses reported from the floor, before they become incidents",
    summary:
      "Incident and near-miss reporting with severity based on the level of harm, anonymous QR-code reporting that needs no login, and a separate dashboard and permissions. Enabled per organization.",
    features: [
      "Incident and near-miss reporting",
      "Anonymous, no-login QR-code reporting from the floor",
      "Severity based on the level of harm",
      "Separate dashboard and permissions",
    ],
    standardsHint: "Supports ISO 45001",
    metaDescription:
      "Health and safety reporting software: incident and near-miss reports, anonymous no-login QR-code reporting from the floor and harm-based severity.",
    problem:
      "Near-misses go unreported because reporting means finding a form and a supervisor. When an incident does happen, the investigation starts from a blank page, and the safety committee cannot see the pattern until it is too late.",
    howItWorks: [
      "Incidents and near-misses are reported in the system.",
      "A QR code on the floor opens an anonymous report form. No login is needed.",
      "Severity is set from the level of harm.",
      "Health and safety has its own dashboard and its own permissions, separate from quality.",
      "Incidents that need corrective action are carried into Improvements.",
      "The module is enabled per organization.",
    ],
    auditorSees: [
      "The incident and near-miss log with severity and status.",
      "Reports raised from the floor, including anonymous ones.",
      "The corrective actions linked to each incident.",
    ],
    clauses: [
      { standard: "ISO 45001:2018", clause: "10.2", label: "Incident, nonconformity and corrective action" },
      { standard: "ISO 45001:2018", clause: "5.4", label: "Consultation and participation of workers" },
      { standard: "ISO 45001:2018", clause: "6.1.2", label: "Hazard identification and assessment of risks and opportunities" },
    ],
    related: ["nonconformance-capa", "training-competence"],
    cta: { label: "Turn on safety reporting", href: "/contact" },
  },
  {
    slug: "training-competence",
    name: "Training",
    icon: "training",
    tagline: "Who is qualified, and the record that proves it",
    summary:
      "A workforce directory, a training library with quizzes and pass scores, campaigns for online, classroom and on-the-job training, and a competency matrix that shows who can do what.",
    features: [
      "Workforce directory with employee import",
      "Training library (PDF, DOC, PPT, video) with quizzes and pass scores",
      "Online, classroom and on-the-job campaigns with supervisor sign-off",
      "Competency matrix with custom levels, bulk updates and certificates",
    ],
    standardsHint: "Supports every management-system standard",
    metaDescription:
      "Training and competence software: workforce directory, training library with quizzes, online, classroom and on-the-job campaigns, competency matrix.",
    problem:
      "Employees never know which training they still owe. Supervisors sign off on-the-job training from memory, certificates sit in a filing cabinet, and the auditor's question, show me this person is competent for this task, has no single answer.",
    howItWorks: [
      "The workforce directory is built by importing employees.",
      "The training library holds PDF, Word, PowerPoint and video content with quizzes and pass scores.",
      "Campaigns run training online, in a classroom or on the job.",
      "The competency matrix uses levels you define, with bulk updates for a whole team.",
      "Supervisors sign off on-the-job training in the system.",
      "Certificates are issued on completion.",
      "Employees see what they owe and what they have completed in My Learning.",
    ],
    auditorSees: [
      "The competency matrix for any role or person.",
      "Quiz results and pass scores against each training item.",
      "Supervisor sign-offs for on-the-job training.",
      "Certificates with completion dates.",
    ],
    clauses: [
      { standard: "ISO 9001:2015", clause: "7.2", label: "Competence" },
      { standard: "ISO 13485:2016", clause: "6.2", label: "Human resources" },
      { standard: "ISO/IEC 17025:2017", clause: "6.2", label: "Personnel" },
    ],
    related: ["document-control", "calibration-maintenance"],
    cta: { label: "Build your competency matrix", href: "/contact" },
  },
  {
    slug: "supplier-quality",
    name: "Supplier Quality",
    icon: "supplier",
    tagline: "SCARs answered in a portal, not an inbox",
    summary:
      "Supplier onboarding with approval gates, scorecards, SCARs, supplier audits and self-assessments, APQP, PPAP and FAI, and PFMEA, Process Flow and Control Plan kept linked. Suppliers respond through a portal with no access to your internal data.",
    features: [
      "Supplier directory and onboarding with approval gates",
      "Scorecards and performance reports per supplier",
      "SCAR, supplier audits, self-assessments, APQP, PPAP and FAI",
      "PFMEA, Process Flow and Control Plan kept linked; change and deviation requests",
    ],
    standardsHint: "Supports ISO 9001, IATF 16949, AS9100, ISO 13485",
    metaDescription:
      "Supplier quality software with approval gates, scorecards, SCAR, supplier audits, APQP, PPAP, FAI, linked PFMEA and Control Plan, and a supplier portal.",
    problem:
      "SCARs, PPAP and FAI packages live in email threads. Supplier responses arrive late, in the wrong format, and the record of what was asked and when is scattered across three inboxes.",
    howItWorks: [
      "Supplier onboarding moves through approval gates.",
      "Scorecards and performance reports track each supplier over time.",
      "A SCAR is raised from a nonconformance and sent to the supplier.",
      "Supplier audits and self-assessments are scheduled and recorded.",
      "APQP, PPAP and FAI packages are tracked per supplier and part.",
      "PFMEA, Process Flow and Control Plan stay linked to each other, so a change in one is visible in the others.",
      "Change and deviation requests are recorded and decided in the system.",
      "Suppliers sign in to the portal with an email code. They answer SCARs, PPAP and APQP items, audits, self-assessments and document requests from a task inbox, and never see your internal data.",
    ],
    auditorSees: [
      "The approved supplier list with qualification status and the expiry of compliance documents.",
      "Scorecards and the evaluation history.",
      "Every SCAR with the supplier's response and the closure decision.",
      "PPAP, APQP and FAI packages with their approval status.",
      "The PFMEA, Process Flow and Control Plan for a part, and the links between them.",
    ],
    clauses: [
      { standard: "ISO 9001:2015", clause: "8.4", label: "Control of externally provided processes, products and services" },
      { standard: "IATF 16949:2016", clause: "8.4.2.4", label: "Supplier monitoring" },
      { standard: "IATF 16949:2016", clause: "8.3.4.4", label: "Product approval process" },
      { standard: "IATF 16949:2016", clause: "8.5.1.1", label: "Control plan" },
      { standard: "AS9100D", clause: "8.4", label: "Control of externally provided processes, products and services" },
      { standard: "AS9100D", clause: "8.5.1.3", label: "Production process verification" },
      { standard: "ISO 13485:2016", clause: "7.4", label: "Purchasing" },
    ],
    related: ["nonconformance-capa", "document-control", "audits-management-review"],
    cta: { label: "Talk about supplier quality", href: "/contact" },
  },
  {
    slug: "calibration-maintenance",
    name: "Assets",
    icon: "calibration",
    tagline: "Every instrument in date, every inspection signed",
    summary:
      "An equipment register with calibration intervals and certificates, maintenance records, inspection checklists and programmes, and e-signatures on inspection records for the person who performed and the person who reviewed.",
    features: [
      "Equipment register with calibration intervals and certificates",
      "Maintenance records against each asset",
      "Inspection checklists and programmes with e-signatures for performed and reviewed",
      "QR labels and PIN access on the shop floor; bulk Excel import",
    ],
    standardsHint: "Supports ISO 9001, ISO 13485, ISO/IEC 17025",
    metaDescription:
      "Equipment, calibration and inspection software: equipment register, calibration intervals and certificates, inspection checklists, e-signatures and QR labels.",
    problem:
      "Calibration due dates live in a spreadsheet that is only checked when something fails. Inspection records are paper forms filed by month, and finding the one the auditor asks for means a trip to the cabinet.",
    howItWorks: [
      "Every piece of equipment sits in a register with its calibration interval and certificates attached.",
      "Maintenance is recorded against the same equipment record.",
      "Inspection checklists are built once and scheduled as programmes.",
      "Inspection records carry e-signatures for performed and reviewed.",
      "QR labels on equipment open its record on the shop floor, with PIN access for people without a desk login.",
      "The register is loaded in bulk from Excel.",
    ],
    auditorSees: [
      "The equipment register with calibration status and the next due date.",
      "Calibration certificates attached to each instrument.",
      "Completed inspection records with both signatures and timestamps.",
      "Maintenance history for each asset.",
    ],
    clauses: [
      { standard: "ISO 9001:2015", clause: "7.1.5", label: "Monitoring and measuring resources" },
      { standard: "ISO 9001:2015", clause: "7.1.3", label: "Infrastructure" },
      { standard: "ISO 13485:2016", clause: "7.6", label: "Control of monitoring and measuring equipment" },
      { standard: "ISO/IEC 17025:2017", clause: "6.4", label: "Equipment" },
    ],
    related: ["nonconformance-capa", "training-competence"],
    cta: { label: "Set up your equipment register", href: "/contact" },
  },
  {
    slug: "vendors",
    name: "Vendors",
    icon: "dashboard",
    tagline: "Every vendor's status and documents in one directory",
    summary:
      "A vendor directory with qualification status, compliance documents with expiry dates and evaluations, loaded in bulk from a generated Excel template.",
    features: [
      "Vendor directory with qualification status",
      "Compliance documents with expiry dates",
      "Vendor evaluations",
      "Excel import from a generated template",
    ],
    standardsHint: "Supports ISO 9001, ISO 13485, ISO 22000",
    metaDescription:
      "Vendor management software with a vendor directory, qualification status, compliance documents with expiry dates, evaluations and Excel import from a template.",
    problem:
      "Vendor certificates expire without anyone noticing. Evaluations are done once at onboarding and never repeated, and the question of whether a vendor is approved is answered from memory.",
    howItWorks: [
      "Every vendor sits in a directory with its qualification status.",
      "Compliance documents are attached with expiry dates, so a lapsed certificate is visible before an auditor finds it.",
      "Evaluations are recorded against the vendor and kept as history.",
      "Vendors are loaded in bulk from an Excel template the software generates.",
    ],
    auditorSees: [
      "The vendor directory with the qualification status of each vendor.",
      "Compliance documents with their expiry dates.",
      "The evaluation history for any vendor.",
    ],
    clauses: [
      { standard: "ISO 9001:2015", clause: "8.4", label: "Control of externally provided processes, products and services" },
      { standard: "ISO 13485:2016", clause: "7.4", label: "Purchasing" },
    ],
    related: ["supplier-quality", "nonconformance-capa", "document-control"],
    cta: { label: "Set up your vendor directory", href: "/contact" },
  },
  {
    slug: "ai-assistant",
    name: "AI Assistant",
    icon: "assistant",
    tagline: "Does the task, within your permissions, with you signing off",
    summary:
      "An assistant inside the software that carries out tasks within the user's own permissions. Multi-step requests become a visible plan the user approves, and destructive steps need extra confirmation.",
    features: [
      "Carries out tasks within the user's own permissions",
      "Multi-step requests become a visible plan the user approves",
      "Destructive steps need extra confirmation",
      "Every AI output is a suggestion a person reviews",
    ],
    standardsHint: "Works across every module",
    metaDescription:
      "An AI assistant for compliance management software that acts within the user's permissions, shows multi-step plans for approval and confirms destructive steps.",
    problem:
      "Compliance software is full of menus, and a quality manager's day is full of small tasks across all of them. An assistant helps only if it stays inside the rules the organization has already set, and only if a person stays in control of what it changes.",
    howItWorks: [
      "The assistant carries out tasks in the software, such as finding records, drafting content and moving work forward, within the permissions of the person asking.",
      "A multi-step request becomes a visible plan. The user reads it and approves it before anything runs.",
      "Steps that delete or overwrite data need extra confirmation.",
      "Optional AI drafting follows the same rule: every draft is a suggestion a person reviews before it enters the document lifecycle.",
      "The audit trail records what the assistant did and separates its actions from those of people and the system.",
    ],
    auditorSees: [
      "Every assistant action in the audit trail, marked as AI rather than a person.",
      "The approved plan behind any multi-step change.",
      "Review and acceptance decisions on AI drafts.",
    ],
    clauses: [],
    related: ["standards", "audits-management-review", "document-control"],
    cta: { label: "See the assistant in a walkthrough", href: "/contact" },
  },
];

// Home page: the buyer's pain, the module that answers it, the concrete capability.
export const PAIN_POINTS = [
  {
    pain: "Nobody knows which document revision is current.",
    module: "Documents",
    slug: "document-control",
    capability:
      "Approved copies are frozen and hash-verified. The revision an auditor opens is the one you approved.",
  },
  {
    pain: "Audit prep is a last-minute scramble.",
    module: "Audits",
    slug: "audits-management-review",
    capability:
      "Checklist, findings and evidence sit in one workspace, and the PDF report comes out when the audit closes.",
  },
  {
    pain: "CAPAs stall with no owner.",
    module: "Improvements",
    slug: "nonconformance-capa",
    capability:
      "Every corrective action has an owner and a due date, and nothing closes without an effectiveness check.",
  },
  {
    pain: "Clause gaps show up only when the auditor points at them.",
    module: "Standards",
    slug: "standards",
    capability:
      "A status per clause, coverage against a target, and the evidence linked behind each one.",
  },
  {
    pain: "SCARs and PPAP packages live in inbox threads.",
    module: "Supplier Quality",
    slug: "supplier-quality",
    capability:
      "Suppliers answer from a portal task inbox with an email code, and never see your internal data.",
  },
];

// How AI is kept in check. A person always signs off.
export const AI_PRINCIPLES = [
  {
    title: "Acts within your permissions",
    detail: "The assistant can only do what the person asking is allowed to do.",
  },
  {
    title: "Plans before it acts",
    detail: "A multi-step request becomes a visible plan that the user approves first.",
  },
  {
    title: "Confirms destructive steps",
    detail: "Anything that deletes or overwrites data needs extra confirmation.",
  },
  {
    title: "Drafting is off until you turn it on",
    detail: "AI drafting of documents is an organization-level setting, off by default.",
  },
  {
    title: "A person always signs off",
    detail:
      "Drafts produced with AI are suggestions. A person reviews and accepts each one before it enters a controlled record.",
  },
];

// How customization actually happens — the delivery model that sets us apart.
export const CUSTOMIZATION = [
  {
    n: "01",
    title: "Map your process",
    detail:
      "Your processes are mapped in Processes as they run, with named owners and the forms and approvals your team already uses, instead of starting from a generic template.",
  },
  {
    n: "02",
    title: "Configure the modules",
    detail:
      "Fields, checklists, terminology and routing are configured to match your operation. The software speaks your language, not software jargon.",
  },
  {
    n: "03",
    title: "Onboard your standards",
    detail:
      "Catalogue standards are switched on. Customer-specific or internal standards are imported from a workbook as custom standards. Every clause links to the modules and evidence that satisfy it.",
  },
  {
    n: "04",
    title: "Deploy to the floor",
    detail:
      "Roll out with training campaigns, competency records and evidence capture, with a certified consultant reviewing the configuration through to your audit.",
  },
];

// ── CUSTOM SOLUTIONS — the engagement model. The software is configured to the
//    specific challenge a client faces: onsite assessment → gaps → a solution
//    built (new or adapted) by experts and engineers. Gap fee credited to solution.
export type CustomStep = {
  n: string;
  title: string;
  icon: string;
  detail: string;
};

export const CUSTOM_STEPS: CustomStep[] = [
  {
    n: "01",
    title: "Onsite assessment",
    icon: "inspection",
    detail:
      "Our engineers come to your facility and walk the floor with your team to see exactly how work gets done and where the standard is at risk.",
  },
  {
    n: "02",
    title: "Gap analysis & scope",
    icon: "audit",
    detail:
      "We document every gap against the target standard and your business goals, then scope precisely what must be built or configured, delivered as a clear findings report and a fixed-price proposal.",
  },
  {
    n: "03",
    title: "Built by experts & engineers",
    icon: "design",
    detail:
      "Our industry experts and engineers create a new solution, or configure an existing module, to fit your challenge, terminology and workflow. Nothing generic, nothing off the shelf.",
  },
  {
    n: "04",
    title: "Delivery & support",
    icon: "rollout",
    detail:
      "We deploy and configure the solution on your floor, train your people, and stay on through your certification audit.",
  },
];

export const CUSTOM_FEEDBACK = {
  title: "A feedback loop at every step, until it fits",
  detail:
    "Customization is not a hand-off. We walk each draft of the solution through your actual processes with your team, gather their feedback, and refine, repeating until it matches your needs and clears the challenges you started with. The result is built around your organization, never a template bent to fit.",
  cycle: ["Walk it through your process", "Gather your team's feedback", "Refine and re-check"],
};

export const GAP_CREDIT = {
  title: "Your gap assessment fee is credited toward your solution",
  detail:
    "Start with a paid onsite gap assessment, a fixed, no-surprises fee. When you move forward, its full cost is applied to your customized solution. The assessment effectively pays for itself, and you never commit blind.",
};

// ROI focus for customization — honest value drivers, no fabricated figures.
// Framed for the businesses that need it most: shops without a large quality department.
export const ROI = {
  eyebrow: "The return — custom solutions",
  title: "Customization that pays for itself",
  intro:
    "For growing shops and operations without a large quality department, a custom-built solution is not a cost centre. It protects the revenue you have, wins the contracts you are chasing, and gives your lean team back the hours certification usually eats. This is where the return shows up.",
  cta: { href: "/contact", label: "Book an onsite assessment" },
  footnote: "Fixed-fee assessment — credited in full toward your solution.",
  drivers: [
    {
      icon: "certificate",
      title: "The assessment fee, credited back",
      detail:
        "The onsite gap assessment is a fixed fee, and its full value is applied to your solution. You never pay for it twice.",
    },
    {
      icon: "audit",
      title: "Faster, cleaner certification",
      detail:
        "Gaps are found and fixed once, correctly, so you spend less on failed audits, repeat visits and last-minute rework before Stage 2.",
    },
    {
      icon: "inspection",
      title: "Fewer costly nonconformances",
      detail:
        "Issues get caught before they become scrap, rework, recalls or customer complaints, the failures that quietly drain margin.",
    },
    {
      icon: "supplier",
      title: "Contracts won and protected",
      detail:
        "Meet the certification your customers require, keep the accounts that mandate it, and qualify for tenders that were closed to you before.",
    },
    {
      icon: "dashboard",
      title: "Hours your team gets back",
      detail:
        "Audit prep, evidence-gathering and paperwork that used to consume days are produced by the system as work happens, freeing skilled people for real work.",
    },
  ],
};

// Software ROI — for businesses running on spreadsheets, binders and a stretched
// (or absent) quality department.
export const ROI_PLATFORM = {
  eyebrow: "The return — the software",
  title: "Compliance management sized for your business",
  intro:
    "Family-owned shops and growing operations rarely have a quality department. They have a few overloaded people and a wall of binders. The compliance management software gives them a working system without an enterprise price tag or headcount.",
  cta: { href: "/assessment", label: "Start the free readiness assessment" },
  footnote: "Free, no signup — see where you stand in minutes.",
  drivers: [
    {
      icon: "dashboard",
      title: "A fraction of a full-time hire",
      detail:
        "The software does the tracking, notifications and evidence-gathering a quality coordinator would, so you get audit-ready without headcount you cannot justify.",
    },
    {
      icon: "document",
      title: "Retire the spreadsheets and binders",
      detail:
        "One system replaces the scattered spreadsheets, shared drives and paper logs that eat hours and fail audits. No more hunting for records the week before the auditor arrives.",
    },
    {
      icon: "audit",
      title: "Evidence as a by-product of daily work",
      detail:
        "Audit evidence is produced as the work happens, in the same records people use every day, so surveillance and re-certification audits stop being an annual fire drill.",
    },
    {
      icon: "training",
      title: "Configured with you, usable day one",
      detail:
        "Our consultants configure the modules to your workflow and train your team. You are not left alone with empty software and a manual.",
    },
    {
      icon: "rollout",
      title: "Grows as you grow",
      detail:
        "Start with the modules and standard you need now; add modules and standards as customers demand them, without replacing the system.",
    },
  ],
};

export const EXPERTS = {
  title: "Built by industry experts and engineers, not a ticket queue",
  detail:
    "Every custom solution is designed and built by people who have run quality inside real businesses. Certified lead auditors, process engineers and software engineers work your problem together, so the solution fits the standard and the shop.",
  points: [
    "Certified lead auditors who know what the registrar looks for",
    "Process engineers who understand your production reality",
    "Software engineers who build and configure the solution",
    "One accountable team from onsite visit to passed audit",
  ],
};

export type CustomExample = {
  industry: string;
  icon: string;
  challenge: string;
  solution: string;
  tags: string[];
};

// Illustrative scenarios built from real module capabilities. They are not named
// client case studies, and the page labels them that way.
export const CUSTOM_EXAMPLES: CustomExample[] = [
  {
    industry: "Metal Fabrication",
    icon: "calibration",
    challenge:
      "A structural steel fabricator could not satisfy customer and CWB audits. Weld inspection records and welder qualifications lived on paper, clipboards and whiteboards.",
    solution:
      "Inspection checklists in Assets were configured for weld inspection and NDT results, with e-signatures for performed and reviewed, and welder qualifications were tracked in the competency matrix.",
    tags: ["Inspections", "Competence", "ISO 9001"],
  },
  {
    industry: "Contract Manufacturing",
    icon: "supplier",
    challenge:
      "A contract manufacturer kept failing customer audits of its supply base. PPAP packages from its own suppliers arrived incomplete, and SCARs went unanswered in email.",
    solution:
      "Supplier Quality was configured with approval gates and PPAP tracking per supplier and part, and suppliers were moved onto the portal, where SCARs and PPAP items are answered from a task inbox.",
    tags: ["Supplier Quality", "PPAP", "IATF 16949"],
  },
  {
    industry: "Food & Beverage",
    icon: "capa",
    challenge:
      "A food processor was drowning in paper HACCP logs and dreaded every CFIA inspection. Records were hard to find and corrective actions were easy to miss.",
    solution:
      "Monitoring records were brought into Documents, complaints and deviations into Improvements with containment and effectiveness checks, and supplier approvals into Supplier Quality with document expiry dates.",
    tags: ["CAPA", "Supplier approval", "ISO 22000"],
  },
  {
    industry: "Precision Machining",
    icon: "document",
    challenge:
      "An aerospace machine shop needed AS9100 configuration control and first article evidence that its primes would accept. Its manual system did not scale.",
    solution:
      "Documents was configured for revision control with approval chains and version comparison, FAI packages were tracked in Supplier Quality, and the AS9100D clauses were mapped to evidence in the Standards workspace.",
    tags: ["Documents", "FAI", "AS9100"],
  },
];
