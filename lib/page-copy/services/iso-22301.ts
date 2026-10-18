import type { PageCopy } from "../types";

const copy: PageCopy = {
  slug: "iso-22301",
  updated: "2026-10-15",
  overview: [
    "ISO 22301:2019 is the international standard for business continuity management systems, published by the International Organization for Standardization (ISO). It sets requirements for planning, running and improving the arrangements that let an organization keep delivering its products and services through a disruption, and it applies to organizations of any type and size.",
    "The 2019 edition is current, and Amendment 1:2024 adds a requirement to determine whether climate change is a relevant issue for the organization. For a Canadian manufacturer or service provider, the standard turns continuity from a plan written once and filed into a tested system: you know which activities matter most, how long each can stop before the damage becomes unacceptable, and how you will bring it back.",
    "Customers often ask suppliers how they would recover from a fire, a flood, a ransomware attack or the loss of a single-source supplier. An ISO 22301 certificate answers that question with evidence an independent auditor has checked, rather than a page of assurances in a supplier questionnaire.",
  ],
  sections: [
    {
      heading: "What does ISO 22301:2019 require?",
      paragraphs: [
        "ISO 22301:2019 uses the same harmonized structure as ISO 9001:2015 and ISO 27001, so leadership, planning, internal audit and management review follow a familiar pattern. The continuity-specific requirements sit in clause 8, Operation, and they build on each other in a fixed order.",
        "Auditors trace a chain through these elements: the recovery targets set in the impact analysis should drive the strategies, the strategies should be reflected in the plans, and the exercises should prove the plans meet the targets. A break anywhere in that chain is where findings usually land.",
      ],
      points: [
        {
          title: "Business impact analysis (clause 8.2)",
          detail:
            "You identify the activities that deliver your products and services, assess how the impact of stopping them grows over time, and set prioritized timeframes for resuming each one.",
        },
        {
          title: "Risk assessment (clause 8.2)",
          detail:
            "The risks of disruption to those prioritized activities and the resources they depend on are identified, analyzed and evaluated, and the ones needing treatment are selected.",
        },
        {
          title: "Strategies and solutions (clause 8.3)",
          detail:
            "For each prioritized activity you choose how it will be protected and recovered, such as a second source of supply, an alternate site or redundant equipment, and confirm the resources each option needs.",
        },
        {
          title: "Plans and procedures (clause 8.4)",
          detail:
            "A response structure with named teams, warning and communication procedures, business continuity plans and recovery procedures must be documented and usable under pressure.",
        },
        {
          title: "Exercises and evaluation (clauses 8.5 and 8.6)",
          detail:
            "Plans are exercised to show they work, results are reported and acted on, and the continuity documentation and capabilities are evaluated for suitability and effectiveness.",
        },
      ],
    },
    {
      heading: "Who needs ISO 22301 certification in Canada?",
      paragraphs: [
        "No Canadian law requires ISO 22301 certification. The demand comes from customers and contracts. **A supplier that would halt a customer's production if it stopped is the organization most likely to be asked for evidence of continuity planning**, and certification is the strongest form that evidence can take.",
        "Organizations that commonly pursue it include single-plant suppliers to automotive and other assembly customers, contract manufacturers and co-packers, logistics and warehousing providers, and IT, data center and managed service providers whose outages stop their clients. Public sector and critical infrastructure tenders also ask about continuity arrangements.",
        "ISO 22301 often sits alongside other management systems. Organizations already certified to [ISO 27001 for information security](/services/iso-27001/) can extend their risk assessment and incident response into continuity, and manufacturers on ISO 9001 can add it to the same internal audit and management review cycle rather than running a separate system.",
      ],
    },
    {
      heading: "How long does ISO 22301 take, and what drives the cost?",
      paragraphs: [
        "For a single site with a defined scope, ISO 22301 certification typically takes four to nine months. Organizations with several sites, heavy dependence on outsourced IT, or recovery options that have to be bought or contracted before they can be planned around should expect the longer end or beyond.",
        "Scope is the biggest lever. ISO 22301 lets you define which products, services and sites are covered, and a scope that matches what customers actually ask about keeps the impact analysis and the exercise program manageable.",
        "Other factors include the number of prioritized activities, how many critical suppliers and IT services the analysis has to reach, whether an existing ISO management system can carry the audit and review cycle, and how much exercise evidence must be generated before the certification audit. The [six-stage certification process](/process/) sets out how that work is sequenced from gap analysis to certificate.",
      ],
    },
    {
      heading: "Preparing for the ISO 22301 certification audit",
      paragraphs: [
        "Certification is a two-stage audit by an accredited certification body. Stage 1 reviews whether the system is designed and documented to meet the standard; stage 2 tests whether it operates as described. **Exercise records are the evidence auditors weigh most, because they show the plans have been tried, not just written.**",
        "Common gaps found during preparation include an impact analysis completed by the IT team alone, recovery times that do not match what customer contracts promise, plans that name people who have since left, and exercises that ended without a report or follow-up actions. Each one is straightforward to fix if it is found early.",
        "ISO 22301 is not in the software's standard catalogue, so ISO Certification Consultants import its clauses as a custom standard from a workbook. Each clause is then tracked with a status, linked evidence and a coverage view, the same as a catalogue standard. A [free readiness check](/assessment/) shows how far your current arrangements are from audit-ready.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is ISO 22301 certification mandatory in Canada?",
      answer:
        "No. ISO 22301 certification is voluntary, and no Canadian law requires it. The pressure comes from customers, contracts and tenders that ask suppliers to show how they would keep delivering through a disruption. Certification gives that answer independent backing, because an accredited certification body has audited the impact analysis, the plans and the exercise records rather than relying on a questionnaire response.",
    },
    {
      question: "What is a business impact analysis under ISO 22301?",
      answer:
        "A business impact analysis identifies the activities that deliver your products and services, assesses how the impact of a disruption to each grows over time, and sets a prioritized timeframe for resuming each one. It also identifies the resources and dependencies, such as suppliers, equipment, people and IT systems, that each activity relies on. Every strategy and plan in ISO 22301:2019 builds on its results.",
    },
    {
      question:
        "How often must business continuity plans be exercised under ISO 22301?",
      answer:
        "ISO 22301:2019 does not set a fixed frequency. It requires an exercise program that tests the continuity arrangements at planned intervals and when significant changes occur, with each exercise reported and its findings acted on. Many organizations exercise at least once a year and build up from tabletop walkthroughs to live recovery tests, so the full set of plans is covered over the certification cycle.",
    },
    {
      question: "How does ISO 22301 relate to ISO 27001?",
      answer:
        "ISO 27001 manages information security risk, while ISO 22301 manages the organization's ability to keep delivering products and services through any disruption, not only information security incidents. The two share the same harmonized structure, so leadership, risk assessment, internal audit and management review can run as one integrated system. Many organizations certified to ISO 27001 add ISO 22301 to cover operational and supply chain disruption.",
    },
    {
      question:
        "What is the difference between business continuity and disaster recovery?",
      answer:
        "Disaster recovery restores IT systems and data after an outage. Business continuity is broader: it keeps the prioritized activities of the whole organization running, including production, people, suppliers, facilities and customer communication, as well as IT. Under ISO 22301, IT disaster recovery is one of the solutions that may support the continuity strategy, but it does not satisfy the standard on its own.",
    },
  ],
};

export default copy;
