import type { PageCopy } from "../types";

const copy: PageCopy = {
  slug: "iso-22000",
  updated: "2026-10-15",
  overview: [
    "ISO 22000:2018 is the international standard for food safety management systems, published by the International Organization for Standardization (ISO). It combines the HACCP principles, prerequisite programs and a management system structure, and it applies to any organization in the food chain, from ingredient suppliers and processors to packaging, storage and transport operators.",
    "The 2018 edition, with Amendment 1:2024, is the current version. For a Canadian food business, certification gives retail, food service and export customers independent evidence that hazards are identified, controlled and verified in a system that keeps running between audits, not just in a binder prepared for the visit.",
    "Certification is voluntary, while the Safe Food for Canadians Regulations (SFCR) are law. A well-built ISO 22000 system holds the hazard analysis, supplier controls, traceability and recall procedures in one place, so the same records answer a customer audit, a certification audit and a Canadian Food Inspection Agency inspection.",
  ],
  sections: [
    {
      heading: "What does ISO 22000:2018 require from a food business?",
      paragraphs: [
        "ISO 22000:2018 follows the same high-level structure as ISO 9001:2015, so context, leadership, planning, support, performance evaluation and improvement will look familiar to anyone who has run a quality system. The food-specific work sits in clause 8, Operation, and that is where most of the build effort goes.",
        "Auditors look for a clear line from each hazard to the control that manages it and the record that proves the control worked. The requirements below are the ones that take the most time to get right on a plant floor.",
      ],
      points: [
        {
          title: "Prerequisite programs (clause 8.2)",
          detail:
            "Sanitation, pest control, allergen management, maintenance, water quality and personnel hygiene must be defined for your site and kept current as equipment and products change.",
        },
        {
          title: "Hazard analysis (clause 8.5.2)",
          detail:
            "Every biological, chemical and physical hazard reasonably expected for each product and process step is identified, assessed and assigned a control measure.",
        },
        {
          title: "Hazard control plan (clause 8.5.4)",
          detail:
            "Hazards are managed either at critical control points with critical limits or through operational prerequisite programs with action criteria, each with monitoring and corrective action.",
        },
        {
          title: "Traceability (clause 8.3)",
          detail:
            "You must be able to trace incoming materials and ingredients through production to the first customer, and the system is tested to prove it works.",
        },
        {
          title: "Emergency preparedness and withdrawal",
          detail:
            "Clause 8.4 covers response to emergencies that affect food safety, and clause 8.9.5 requires a tested procedure for withdrawing or recalling unsafe product.",
        },
      ],
    },
    {
      heading:
        "ISO 22000, FSSC 22000 or HACCP: which one will your customers accept?",
      paragraphs: [
        "These three are often confused. **HACCP is a method, not a management system.** It is the seven-principle approach to hazard analysis and critical control points set out by the Codex Alimentarius, and it sits inside both ISO 22000 and FSSC 22000.",
        "ISO 22000 is a certifiable management system standard, but **ISO 22000 on its own is not recognized by the Global Food Safety Initiative (GFSI).** FSSC 22000 is. It is built on ISO 22000, adds sector-specific prerequisite programs from the ISO 22002 series, and adds its own scheme requirements. FSSC 22000 Version 7 was released on 1 May 2026, and audits against Version 6 are permitted until 30 April 2027.",
        "The deciding question is what your customers write into their supplier requirements. If a retailer or brand owner asks for a GFSI-recognized certificate, ISO 22000 alone will not meet that requirement. If customers ask for a certified food safety management system without naming GFSI, ISO 22000 is often enough.",
      ],
    },
    {
      heading:
        "How does ISO 22000 fit with the Safe Food for Canadians Regulations?",
      paragraphs: [
        "Under the SFCR, a business that holds a Safe Food for Canadians license to manufacture, process or package food for interprovincial trade, or to import food, generally must prepare, keep and implement a written preventive control plan (PCP). Some small businesses are exempt, and the CFIA publishes an interactive tool for checking which requirements apply.",
        "**ISO 22000 certification does not replace your SFCR license or your preventive control plan.** The CFIA inspects against the regulations, not against a certificate. What ISO 22000 does is give the PCP a management system around it: internal audits, management review, competence records and corrective action that keep the plan accurate as products and lines change.",
        "The overlap is large. A PCP covers hazards, control measures, critical control points with critical limits, monitoring, corrective action, verification and records kept for two years. Those are the same building blocks as the ISO 22000 hazard control plan, so one set of documents can serve both, provided it is written to meet the stricter wording of each.",
        "Supplier control is shared too: in the compliance software, Supplier Quality holds supplier approval gates and compliance documents with expiry dates. The [food and beverage industry page](/industries/food-beverage/) shows how this fits across the sector.",
      ],
    },
    {
      heading:
        "How long does ISO 22000 certification take, and what drives the cost?",
      paragraphs: [
        "For a single-site processor that already runs a working PCP, certification typically takes six to twelve months from gap analysis to certificate. A site starting with informal prerequisite programs, or one that needs facility repairs before sanitation and pest control can be signed off, should plan for longer.",
        "Certification bodies want to see the system operating, not just written. Before the stage 2 audit you need monitoring records, at least one full internal audit cycle and a management review, which sets a floor on how fast any project can move.",
        "The main factors that move the timeline and the budget are the number of products and process lines in scope, how many sites are included, the state of the existing prerequisite programs, how much validation evidence exists for critical limits, and the time your own team can give the project each week. A [free readiness check](/assessment/) gives a first view of where your site stands before you commit to a plan.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is ISO 22000 recognized by GFSI?",
      answer:
        "No. ISO 22000 on its own is not a GFSI-recognized certification program. FSSC 22000, which is built on ISO 22000 and adds sector-specific prerequisite programs from the ISO 22002 series plus its own scheme requirements, is recognized by GFSI. If a customer requires a GFSI-recognized certificate, ISO 22000 alone will not meet that requirement, but it gives you most of the foundation FSSC 22000 needs.",
    },
    {
      question:
        "Does ISO 22000 certification replace a CFIA preventive control plan?",
      answer:
        "No. The Safe Food for Canadians Regulations are a legal requirement, and a license holder generally still needs a written preventive control plan whatever certificates it holds. ISO 22000 is voluntary. The two work well together, though: the ISO 22000 hazard analysis and hazard control plan can be written so the same documents and records satisfy the PCP requirements and the certification audit.",
    },
    {
      question: "What is the difference between HACCP and ISO 22000?",
      answer:
        "HACCP is a method for identifying hazards and controlling them at critical control points, based on seven principles set out by the Codex Alimentarius. ISO 22000:2018 is a full management system standard that includes HACCP and adds prerequisite programs, leadership responsibilities, internal audit, management review, traceability, emergency preparedness and continual improvement. HACCP controls the process; ISO 22000 manages the system that keeps those controls working.",
    },
    {
      question: "How long does ISO 22000 certification take in Canada?",
      answer:
        "A single-site food processor with a working preventive control plan typically reaches certification in six to twelve months. The timeline depends on the number of products and lines in scope, the condition of prerequisite programs, and how much validation evidence already exists. The certification body also needs to see operating records, a completed internal audit and a management review before the stage 2 audit.",
    },
    {
      question:
        "Should a food processor start with ISO 22000 or go straight to FSSC 22000?",
      answer:
        "Start from what your customers require. If retail or brand-owner customers ask for a GFSI-recognized certificate, go straight to FSSC 22000, since ISO 22000 alone will not satisfy them. If no customer names GFSI, ISO 22000 is a sound first step, and upgrading later means adding the ISO 22002 sector prerequisite programs and the FSSC 22000 scheme requirements rather than rebuilding the system.",
    },
  ],
};

export default copy;
