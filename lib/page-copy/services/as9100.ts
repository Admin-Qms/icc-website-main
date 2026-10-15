import type { PageCopy } from "../types";

const copy: PageCopy = {
  slug: "as9100",
  overview: [
    "AS9100 is the quality management system standard for organizations that design, produce or support products for the aviation, space and defense industries. It is developed by the International Aerospace Quality Group (IAQG) and published in the Americas by SAE International. It contains every requirement of ISO 9001:2015 and adds requirements specific to aerospace work.",
    "AS9100D, released in September 2016, is the current revision. A successor revision is in development at the IAQG but has not been published, so certification audits continue against AS9100D. Customer and regulatory requirements sit alongside it, and where they conflict with the standard, the customer or regulatory requirement takes precedence.",
    "For a Canadian machine shop, special-process house or assembler, AS9100 certification is often the condition for quoting work from aerospace primes and their larger suppliers. In Canada, the Standards Council of Canada (SCC) runs an accreditation program, recognized by the IAQG, for the certification bodies that audit AS9100. Every valid certificate is then listed in the IAQG's OASIS database, which is where buyers check it.",
  ],
  sections: [
    {
      heading: "What does AS9100D require beyond ISO 9001?",
      paragraphs: [
        "AS9100D follows the same ten-clause structure as ISO 9001:2015 and adds aerospace requirements within it. The additions reflect what goes wrong in aerospace supply chains: parts built to the wrong revision, suspect parts entering stock, debris left in assemblies and late deliveries that hold up a build. These are the areas an aerospace auditor tests that an ISO 9001 audit does not.",
      ],
      points: [
        {
          title: "Configuration management",
          detail:
            "You control the product's configuration through its life, so the drawing, the revision and the part on the bench always match.",
        },
        {
          title: "Product safety",
          detail:
            "You plan, implement and control the processes needed to keep the product safe across its life cycle, and people know how their work affects it.",
        },
        {
          title: "Prevention of counterfeit parts",
          detail:
            "Purchasing, receiving and stores have controls to keep counterfeit or suspect parts out of the product, including buying from original or authorized sources.",
        },
        {
          title: "Foreign object prevention",
          detail:
            "Production and assembly include controls to prevent, detect and remove foreign objects before they reach the customer.",
        },
        {
          title: "Operational risk and first article inspection",
          detail:
            "Risks to delivery and conformity are managed through operations, and a representative item from the first production run is used to verify the process, repeated when a change invalidates the result.",
        },
        {
          title: "On-time delivery and human factors",
          detail:
            "Supplier and internal performance include on-time delivery as well as quality, and root cause analysis considers human factors rather than stopping at operator error.",
        },
      ],
    },
    {
      heading: "AS9100, AS9110 or AS9120: which standard fits your business?",
      paragraphs: [
        "The IAQG publishes a family of standards, and choosing the wrong one wastes an audit cycle. AS9100 covers organizations that design and manufacture aviation, space and defense products, which takes in machine shops, sheet metal and composite fabricators, special-process suppliers and assemblers. AS9110 is written for maintenance, repair and overhaul organizations, and AS9120 for distributors that buy and resell parts without altering them.",
        "Organizations that design, develop or produce deliverable software can add AS9115, which supplements AS9100 for software. The [Aerospace & Defence industry page](/industries/aerospace-defence/) covers which standards each kind of supplier tends to be asked for.",
        "AS9100 certification also does not cover security obligations. If your work involves examining, possessing or transferring controlled goods, you must register with Canada's Controlled Goods Program, administered by Public Services and Procurement Canada. That registration is separate from your quality certificate, and a defense contract may require both.",
      ],
    },
    {
      heading: "How long does AS9100 certification take in Canada?",
      paragraphs: [
        "For a shop that already runs a working ISO 9001 system, AS9100 certification typically takes six to nine months. A shop starting without a certified system should plan for nine to twelve months or more. The [six-stage certification process](/process/) shows where that time goes.",
        "The audit itself follows rules set for the aerospace scheme. Certification bodies audit to AS9101, which defines how aerospace audits are conducted and reported, under the certification requirements in AS9104/1. Expect a Stage 1 audit of readiness and documentation, a Stage 2 audit of implementation and an auditor who follows real part numbers through contract review, purchasing, production and inspection.",
        "Duration and cost depend on headcount, the number of sites, whether you hold design responsibility, how many special processes you run in-house and how much of the aerospace-specific system already exists. Once certified, you are entered in OASIS, and surveillance audits keep the certificate active through its three-year cycle.",
      ],
    },
    {
      heading: "Where do AS9100 audits commonly find nonconformities?",
      paragraphs: [
        "Findings in a first AS9100 audit tend to cluster where aerospace requirements meet daily habits on the floor. Configuration control is a common one: a traveler references a superseded drawing revision, or a customer's engineering change reached purchasing but not the machine. Controlled documents that carry their full revision history, as they do in the software's document control, make that trail easier to prove.",
        "Other recurring findings include first article records that were not repeated after a process or tooling change, counterfeit-part controls written into a procedure but not applied at receiving, and corrective actions that blame the operator without examining human factors. Flow-down is another: requirements on your customer's purchase order have to reach your own suppliers, including special-process houses. A [free readiness check](/assessment/) shows which of these gaps apply to your shop.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is AS9100 the same as ISO 9001?",
      answer:
        "No. AS9100D includes all of ISO 9001:2015 and adds aerospace requirements, such as configuration management, product safety, counterfeit part prevention and foreign object controls. An AS9100 audit therefore covers the ISO 9001 requirements as well. An ISO 9001 certificate does not cover AS9100, and an aerospace customer that requires AS9100 will not normally accept ISO 9001 in its place.",
    },
    {
      question: "How do you check whether a supplier is AS9100 certified?",
      answer:
        "Search the IAQG's OASIS database. Certification bodies accredited for the aerospace scheme enter each certificate there, along with its scope and status. If a supplier's certificate is not listed in OASIS, it should not be treated as a valid AS9100 certification, whatever the paper certificate says. Checking the listing at supplier approval, and again when the certificate is renewed, keeps your approved supplier list current.",
    },
    {
      question: "Is a new revision of AS9100 coming?",
      answer:
        "A successor to AS9100D is in development at the IAQG, but it has not been published, and AS9100D remains the revision certification audits use. When the new revision is published, the IAQG will set the transition period. Until then, build and maintain your system to AS9100D, and confirm timing with your certification body.",
    },
    {
      question: "Does AS9100 certification cover the Controlled Goods Program?",
      answer:
        "No. AS9100 is a quality management standard, while the Controlled Goods Program is a federal security registration administered by Public Services and Procurement Canada. Anyone who examines, possesses or transfers controlled goods in Canada must register unless an exemption applies. A defense supplier may need both, and each has its own application, audit or assessment and records.",
    },
    {
      question: "Do you need AS9100 to supply the aerospace industry?",
      answer:
        "It depends on the customer. No Canadian law requires AS9100, but aerospace primes and larger suppliers commonly make it a condition of their approved supplier lists and flow it down through purchase orders. Some buyers accept ISO 9001 for lower-risk items. If a customer asks for it, [talk to a consultant](/contact/) about the scope and timeline before the next quote is due.",
    },
  ],
};

export default copy;
