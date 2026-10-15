import type { PageCopy } from "../types";

const copy: PageCopy = {
  slug: "iso-13485",
  overview: [
    "ISO 13485:2016 is the international standard, published by the International Organization for Standardization (ISO), that sets quality management system requirements for regulatory purposes in the medical device sector. It applies to organizations at any stage of a device's life cycle, from design and production to storage, distribution, installation and servicing, and to the suppliers that support them.",
    "For a Canadian device maker, the standard is not optional in practice. Health Canada requires manufacturers of Class II, III and IV medical devices sold in Canada to hold an ISO 13485 certificate issued under the Medical Device Single Audit Program (MDSAP) to obtain or keep a Medical Device Licence (MDL). A plain ISO 13485 certificate issued outside that program does not meet the requirement.",
    "Because MDSAP is a joint program, a single audit can also address the requirements of the other participating regulators in Australia, Brazil, Japan and the United States.",
  ],
  sections: [
    {
      heading: "What does ISO 13485:2016 require?",
      paragraphs: [
        "ISO 13485:2016 has the familiar shape of a quality management system, but it is written for regulators rather than for continual improvement alone. Where a general quality system asks whether customers are satisfied, ISO 13485 asks whether every device can be traced, every process that cannot be fully inspected has been validated, and every regulatory obligation has an owner.",
        "Risk management runs through product realization, and many device makers use ISO 14971 as the method. Documentation is heavier than in a general quality system, because an auditor must be able to reconstruct how any device on the market was designed, built and released.",
      ],
      points: [
        {
          title: "Medical device file (clause 4.2.3)",
          detail:
            "For each device type or family, you keep a file that describes the device, its intended use, labeling, specifications and the procedures for manufacturing, handling, installation and servicing.",
        },
        {
          title: "Design and development (clause 7.3)",
          detail:
            "Design work is planned in stages, with documented inputs, outputs, reviews, verification, validation, transfer to production and control of design changes.",
        },
        {
          title: "Purchasing controls (clause 7.4)",
          detail:
            "Suppliers are evaluated, selected and monitored on their ability to meet your requirements, with controls proportionate to the risk the purchased product carries for the finished device.",
        },
        {
          title: "Process validation (clause 7.5.6)",
          detail:
            "Any production or service process whose output cannot be fully verified afterward, such as sterilization or package sealing, must be validated before use and revalidated when it changes.",
        },
        {
          title:
            "Complaints and regulatory reporting (clauses 8.2.2 and 8.2.3)",
          detail:
            "Complaints are handled promptly under a documented procedure, and those that meet the criteria for mandatory problem reporting go to the relevant regulator, which in Canada is Health Canada.",
        },
        {
          title: "Nonconforming product (clause 8.3)",
          detail:
            "Product that does not conform is identified, segregated and dispositioned, including defined action when a problem is found after the device has been delivered.",
        },
      ],
    },
    {
      heading: "Who needs ISO 13485 certification in Canada?",
      paragraphs: [
        "The answer depends on what you do with the device and on its risk class. Canada's Medical Devices Regulations sort devices into four classes, with Class I the lowest risk and Class IV the highest.",
        "**Manufacturers of Class II, III and IV devices need a Medical Device Licence (MDL), which depends on a valid MDSAP certificate covering ISO 13485:2016.** That certificate must come from an auditing organization recognized or authorized under MDSAP, so confirm that status before you sign with a registrar.",
        "Importers, distributors and Class I manufacturers are licensed differently. They need a Medical Device Establishment Licence (MDEL), which authorizes importing or distributing devices in Canada. Health Canada's MDSAP guidance states that distributors and retailers do not need an MDSAP certificate.",
        "Contract manufacturers and component suppliers form a third group: the regulations may not require certification, but device makers' purchasing controls often push it down every tier of the [healthcare and medical device](/industries/healthcare-medical-devices/) supply chain.",
      ],
    },
    {
      heading: "How long does ISO 13485 certification take in Canada?",
      paragraphs: [
        "A first-time ISO 13485 project typically takes six to twelve months from gap analysis to certificate, and it can run longer for a company that designs its own higher-risk devices. The calendar is driven less by writing procedures than by generating evidence: the auditor needs to see the system operating, with records of training, supplier evaluation, internal audit and management review.",
        "Design responsibility is the largest single factor. A company that only builds to a customer's design can justify excluding design and development controls where the regulations allow it, while a company that owns its designs must show design history for each device. The number of sites, processes that need validation and outsourced work also shape the effort.",
        "If you already hold ISO 9001 certification, much of the structure carries over: document control, internal audit, corrective action and management review. The gaps usually sit in design controls, process validation and regulatory reporting. A [free readiness check](/assessment/) shows where your system stands before you commit to an audit date.",
      ],
    },
    {
      heading: "Preparing for the MDSAP certification audit",
      paragraphs: [
        "The initial certification audit runs in two stages. Stage 1 reviews your documented system and readiness: the quality manual, procedures, medical device files and the scope you want on the certificate. Stage 2 tests whether the system works in practice by following devices and records through design, purchasing, production, complaints and corrective action.",
        "**Before Stage 1, the internal audit and management review should be complete, and the corrective actions they raised should show evidence of closure.** Auditors check that corrective action reaches root cause and that effectiveness is verified.",
        "A mock audit that traces one device from design inputs to a shipped lot and a complaint record exposes traceability gaps quickly. After certification, the auditing organization returns for annual surveillance audits and a recertification audit in the third year. ISO Certification Consultants take device makers through each step of [the six-stage certification process](/process/), from gap analysis to the certificate.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is ISO 13485 certification mandatory in Canada?",
      answer:
        "It is mandatory for manufacturers of Class II, III and IV medical devices. Health Canada requires these manufacturers to hold an ISO 13485 certificate issued under the Medical Device Single Audit Program (MDSAP) to obtain or keep a Medical Device Licence. Class I manufacturers, importers and distributors are licensed through a Medical Device Establishment Licence instead and do not need an MDSAP certificate, although their customers may still ask for a certified quality system.",
    },
    {
      question: "What is the difference between ISO 13485 and MDSAP?",
      answer:
        "ISO 13485:2016 is the quality management system standard; MDSAP is an audit program. MDSAP is run jointly by Health Canada, Australia's TGA, Brazil's ANVISA, Japan's MHLW and PMDA, and the US FDA. An MDSAP audit assesses your system against ISO 13485 together with the regulatory requirements of the participating jurisdictions, and it is carried out by an auditing organization those regulators have recognized or authorized.",
    },
    {
      question: "Can ISO 9001 and ISO 13485 run as one quality system?",
      answer:
        "Yes, many organizations run both from one set of procedures and records. ISO 13485 shares core elements with [ISO 9001](/services/iso-9001/), such as document control, internal audit and corrective action, so those can be written once. The medical device requirements, including the medical device file, design controls, process validation and regulatory reporting, are added on top. Each certificate is still audited against its own standard.",
    },
    {
      question: "How long is an ISO 13485 certificate valid?",
      answer:
        "An ISO 13485 certificate is typically issued for a three-year cycle. During that time the auditing organization returns for surveillance audits, normally once a year, and then conducts a recertification audit before the certificate expires. Keeping the system running between audits matters, because each surveillance visit samples recent records such as complaints, internal audits, supplier evaluations and corrective actions.",
    },
    {
      question: "Do contract manufacturers need ISO 13485 certification?",
      answer:
        "Not always by regulation, but often by contract. Health Canada's licensing obligation sits with the manufacturer that places the device on the market under its own name. That manufacturer must evaluate and monitor its suppliers under the purchasing requirements of ISO 13485:2016, so a contract manufacturer with its own certificate can usually answer those supplier requirements faster and with less duplicate auditing.",
    },
  ],
};

export default copy;
