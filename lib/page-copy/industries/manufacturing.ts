import type { PageCopy } from "../types";

const copy: PageCopy = {
  slug: "manufacturing",
  overview: [
    "Manufacturers in Canada are commonly asked for ISO 9001 first, because customers name it in supplier questionnaires and purchasing terms. ISO 14001 for environmental management and ISO 45001 for occupational health and safety follow when a customer, a public tender or the owners want proof that environmental and safety risks are managed as carefully as quality.",
    "The pressure on a plant is rarely the standard itself. It is a customer audit landing in the same month as a registrar visit, a high mix of part numbers changing faster than the work instructions, and a second shift that learns the process from whoever trained them. A certified system has to hold up on every shift, not only on the day the auditor walks the floor.",
    "Editions matter when you start. ISO 9001:2026 was published in September 2026 and ISO 14001:2026 in April 2026; certificates to the 2015 editions stay valid through transitions that end in 2029, so many certified plants are still on the 2015 editions. ISO 45001:2018 remains the current edition.",
  ],
  sections: [
    {
      heading:
        "Which ISO standards does a manufacturing company in Canada need?",
      paragraphs: [
        "The answer depends on who is asking. Start with the requirement written into your largest customer's purchase terms, then add standards where a second customer, a tender or a real business risk calls for one. Each standard below can be certified on its own or audited together with the others.",
      ],
      points: [
        {
          title: "ISO 9001: quality management",
          detail:
            "This is a common baseline in supply relationships, covering how you plan production, control documents, handle nonconforming product and improve. [ISO 9001 certification](/services/iso-9001/) is the usual starting point for a manufacturer.",
        },
        {
          title: "ISO 14001: environmental management",
          detail:
            "It applies when customers ask about waste, emissions, spills and chemical handling, or when your permits and environmental obligations need a reliable system to stay current. [ISO 14001 certification](/services/iso-14001/) adds a register of environmental aspects and a check on legal compliance.",
        },
        {
          title: "ISO 45001: occupational health and safety",
          detail:
            "It suits plants where press work, forklifts, welding or confined spaces carry real risk, and where leadership wants hazard control built into daily work. [ISO 45001 certification](/services/iso-45001/) requires worker consultation and participation, not only a safety committee binder.",
        },
        {
          title: "A sector standard instead of ISO 9001",
          detail:
            "If you supply automotive, aerospace or medical device customers, they may require IATF 16949, AS9100 or ISO 13485, which carry their own sector requirements. Check this before building an ISO 9001 system you would later have to extend.",
        },
      ],
    },
    {
      heading: "What do auditors look for on a manufacturing floor?",
      paragraphs: [
        "A certification auditor tests whether the system you wrote down is the system the floor runs. Expect them to pick a part on a machine, ask the operator how it is checked, and then follow that trail back through the records.",
        "Under ISO 9001:2015, that trail usually touches control of nonconforming outputs (clause 8.7), monitoring and measuring resources (clause 7.1.5), competence (clause 7.2) and nonconformity and corrective action (clause 10.2). In practice, the questions sound like this: is the work instruction at the station the current revision? Is the rejected material tagged and segregated, or sitting on the line? Is the micrometer in calibration, and can you show the certificate? Does the training record cover the person actually running the job?",
        "Auditors also look for **internal audits that found something**. An internal audit program that reports no findings for a full year raises more questions than one that found and fixed real problems. The same applies to management review: it should show decisions based on scrap, delivery and complaint data, not a meeting agenda signed after the fact. Expect the auditor to compare dates as well: a stack of records completed the week before the audit tells its own story.",
      ],
    },
    {
      heading: "How should a plant get started with certification?",
      paragraphs: [
        "Begin with a gap analysis against the standard your customers require, scoped to the sites, product lines and processes the certificate must cover. A clear scope keeps the project from growing into areas no customer has asked about.",
        "If you need more than one standard, **build one management system, not three**. ISO 9001, ISO 14001 and ISO 45001 share ISO's harmonized structure for management system standards, so context, leadership, internal audit, management review and corrective action can each be handled once, with the environmental and safety requirements added where they apply. One document set and one audit program are easier for a plant to keep current than three parallel binders.",
        "For a single-site plant certifying to ISO 9001, the path from gap analysis to certificate typically runs around six months, from system design and documentation through implementation and an internal audit. Adding ISO 14001 or ISO 45001 in the same project extends the timeline, but less than running a second project later.",
        "**Illustrative example:** A family-owned machine shop with two shifts needs ISO 9001 for a new customer and expects a safety-focused customer to ask for ISO 45001 within a year. The gap analysis covers both, the system is designed once, and ISO 45001 is added at the next surveillance audit instead of starting over.",
      ],
    },
  ],
  faqs: [
    {
      question: "How long does ISO 9001 certification take for a manufacturer?",
      answer:
        "For a single-site plant, ISO 9001 certification typically takes around six months from gap analysis to certificate. The timeline depends on how much of the system already exists, how many processes are in scope and how quickly records build up. Before the main certification audit, the certification body checks that internal audits and management review are being planned and performed, so the system has to run for a while first.",
    },
    {
      question:
        "Should a manufacturer certify to ISO 9001:2015 or ISO 9001:2026?",
      answer:
        "ISO 9001:2026 was published in September 2026 and replaces ISO 9001:2015. Certificates to the 2015 edition remain valid during a three-year transition ending in September 2029. A plant starting now should confirm with its certification body which edition it can be audited against, and plan new work around the 2026 edition so the system does not need a second round of changes.",
    },
    {
      question: "Can ISO 9001, ISO 14001 and ISO 45001 be audited together?",
      answer:
        "Yes. Many certification bodies offer combined audits of an integrated management system, because the three standards share a common structure. You still receive a certificate for each standard, and each set of requirements is audited, but shared elements such as internal audit, management review and corrective action are reviewed once. Combined audits can reduce the number of days your team spends hosting auditors.",
    },
    {
      question: "Does ISO 45001 replace compliance with provincial safety law?",
      answer:
        "No. ISO 45001 does not replace provincial occupational health and safety legislation. The standard requires you to identify the legal requirements that apply to your operation and evaluate whether you meet them. A certified system is a way of managing those obligations consistently, but the law still sets the minimum, and inspectors enforce the law, not the standard.",
    },
    {
      question:
        "What should a manufacturer have ready before the first consultant visit?",
      answer:
        "Have the customer requirement that triggered the project, a list of sites and product lines to include, and whatever procedures, work instructions and records already exist. An organization chart and a rough process map help. Nothing needs to be polished first. A [free readiness check](/assessment/) gives you a quick view of where the gaps are likely to sit before the full gap analysis.",
    },
  ],
};

export default copy;
