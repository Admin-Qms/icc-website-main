import type { PageCopy } from "../types";

const copy: PageCopy = {
  slug: "aerospace-defence",
  updated: "2026-10-15",
  overview: [
    "Aerospace and defense suppliers in Canada are typically asked for AS9100D, the aerospace quality management standard built on ISO 9001 that primes and their supply chains require. Defense work adds registration in the federal Controlled Goods Program for anyone handling controlled goods, and information security expectations that an ISO/IEC 27001 management system helps you meet.",
    "Aerospace customers judge suppliers on evidence that lasts as long as the aircraft. A precision machine shop has to show which revision of a drawing a part was built to, prove that every characteristic was verified on the first article, keep counterfeit material out of the supply chain, and control foreign objects on the floor. Purchase orders carry quality clauses that flow down to your own suppliers, and a lapse on any one of them can cost a supplier its approval.",
    "AS9100D is the current revision. The IAQG is revising the standard, and the next edition is expected to carry the name IA9100; until it is published, AS9100D is the revision certification bodies audit against. ISO/IEC 27001:2022 is the current edition of the information security standard.",
  ],
  sections: [
    {
      heading:
        "Which standards do aerospace and defense suppliers in Canada need?",
      paragraphs: [
        "The combination depends on what you make, who you sell to, and whether defense programs are involved. These are the requirements that commonly apply, and when each one comes into play.",
      ],
      points: [
        {
          title: "AS9100D: aerospace quality management",
          detail:
            "This applies to organizations that design or make aerospace and defense products, and it adds aerospace requirements to the full ISO 9001 text. [AS9100 consulting](/services/as9100/) covers the gap analysis, system build and audit preparation.",
        },
        {
          title: "AS9110 and AS9120: the rest of the family",
          detail:
            "Maintenance, repair and overhaul organizations certify to AS9110, and distributors that sell aerospace parts without manufacturing them certify to AS9120. Choosing the wrong one wastes an audit cycle.",
        },
        {
          title: "ISO/IEC 27001: information security",
          detail:
            "Defense and aerospace customers may ask how technical data, drawings and models are protected. [ISO 27001 consulting](/services/iso-27001/) builds a risk-based information security management system with a statement of applicability for the controls you select.",
        },
        {
          title: "Controlled Goods Program registration",
          detail:
            "Individuals and organizations must register in this federal program before they examine, possess or transfer controlled goods in Canada. It is a legal requirement under the Defence Production Act, not a certification, and it needs its own designated official and security plan.",
        },
      ],
    },
    {
      heading: "What do AS9100 auditors look for?",
      paragraphs: [
        "An AS9100 auditor tests the same system an ISO 9001 auditor would, then goes deeper on the risks particular to aviation, space and defense. Expect questions on product safety (clause 8.1.3 of AS9100D) and prevention of counterfeit parts (clause 8.1.4), along with configuration management, foreign object prevention and first article inspection.",
        "In practice, the auditor picks a part and follows it. Was the first article inspection done to the drawing revision on the purchase order, and was it repeated after a change to the design or process? Can you trace the raw material back to its certificate and an approved source? Are the purchase order clauses your customer gave you passed on to your own suppliers? Are tools and loose items in the work area controlled so that nothing ends up inside an assembly? Each answer should come from a record made at the time, not from memory.",
        "AS9100D also asks you to measure on-time delivery and product conformity, and to make people aware of their contribution to product safety and the importance of ethical behavior. **A supplier with weak delivery performance and no action plan will be asked about it**, whatever the documents say.",
      ],
    },
    {
      heading: "How does defense work change the quality system?",
      paragraphs: [
        "Defense programs add security obligations that sit beside the quality system. Under the Controlled Goods Program, a registered business appoints a designated official who completes a security assessment and training, and it develops a security plan for safeguarding controlled goods. Visitors and temporary workers who need access to controlled goods require an exemption from registration.",
        "Cyber security is the newer pressure. Public Services and Procurement Canada introduced Level 1 of the Canadian Program for Cyber Security Certification in 2026 for select defense contracts, based on an annual self-assessment, with an externally assessed Level 2 to follow for contracts involving controlled defense information. That program is separate from ISO/IEC 27001 certification, but the asset inventory, risk assessment and access controls an ISO 27001 system requires are the same groundwork.",
        "**Run these obligations through one management system rather than three.** Document control, training records, internal audit and corrective action can serve AS9100, ISO 27001 and the controlled goods security plan together, so an access-control lapse and a nonconforming part are handled with the same discipline.",
        "**Illustrative example:** An Ontario machine shop that holds AS9100D is invited to quote on a defense subcontract. Before it can receive the bid package, it registers in the Controlled Goods Program, appoints a designated official and writes a security plan that its existing document control and training processes then maintain.",
      ],
    },
  ],
  faqs: [
    {
      question: "What is the difference between AS9100 and ISO 9001?",
      answer:
        "AS9100D contains the full ISO 9001:2015 requirements and adds aerospace and defense requirements on top. The additions include product safety, prevention of counterfeit parts, configuration management, foreign object prevention, first article inspection and measurement of on-time delivery. A supplier certified to AS9100 meets the ISO 9001 requirements as part of it, but an ISO 9001 certificate alone does not satisfy a customer that requires AS9100.",
    },
    {
      question:
        "How do aerospace customers check a supplier's AS9100 certification?",
      answer:
        "AS9100 certificates issued under the IAQG certification scheme are recorded in the IAQG OASIS database, which customers use to confirm that a supplier's certificate is current and what scope it covers. Certified organizations set up an OASIS account, and audit results are shared in the database. If your certificate is not listed, a prime or Tier 1 customer may not treat it as valid.",
    },
    {
      question: "Is AS9100 being replaced by IA9100?",
      answer:
        "The IAQG is revising AS9100, and the next edition is expected to be published under the name IA9100. Until it is published, AS9100D remains the current revision, and certificates issued to it remain valid. A transition period will follow publication, so a supplier certifying to AS9100D now does not lose that work. Confirm transition dates with your certification body once the new edition is released.",
    },
    {
      question:
        "Does every defense supplier need to register in the Controlled Goods Program?",
      answer:
        "Registration is required for individuals and organizations that need to examine, possess or transfer controlled goods in Canada, including technical data defined as controlled goods. It is also required before receiving bid solicitation documents that contain controlled goods. A supplier whose work never involves controlled goods does not need to register, so start by confirming with your customer whether the program's parts or data are controlled.",
    },
    {
      question: "How long does AS9100 certification take?",
      answer:
        "For a single-site machine shop, AS9100 certification typically takes longer than an ISO 9001 project, because configuration management, first article inspection, counterfeit part controls and supplier flow-down all need to run and produce records before the audit. A shop already certified to ISO 9001 starts further ahead. [Talk to an aerospace consultant](/contact/) for an estimate based on your current system.",
    },
  ],
};

export default copy;
