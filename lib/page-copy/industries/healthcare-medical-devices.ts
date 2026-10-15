import type { PageCopy } from "../types";

const copy: PageCopy = {
  slug: "healthcare-medical-devices",
  overview: [
    "Medical device manufacturers in Canada need an ISO 13485:2016 quality management system. To obtain a Health Canada Medical Device Licence (MDL) for a Class II, III or IV device, the manufacturer must hold an ISO 13485 certificate under the Medical Device Single Audit Program (MDSAP). Importers, distributors and many Class I manufacturers need a Medical Device Establishment Licence (MDEL) instead.",
    "That makes the quality system part of market access, not only a customer preference. A regulator can act on what an audit finds, and an MDL depends on the certificate behind it. The pressure shows up in design records that must explain every decision, complaints that may need to be reported to the regulator, traceability that has to reach the customer who received a device, and suppliers whose processes become part of your product.",
    "ISO 13485:2016 is the current edition; it was reviewed and confirmed in 2025. It is a standalone standard with its own structure, not a supplement to ISO 9001, so the publication of ISO 9001:2026 does not change what an ISO 13485 auditor checks.",
  ],
  sections: [
    {
      heading:
        "Which standards and licenses does a medical device company in Canada need?",
      paragraphs: [
        "Start with what you do: design, manufacture, import, distribute, or supply components to someone who does. The answer sets both the license you need and the scope of your certificate.",
      ],
      points: [
        {
          title: "ISO 13485 through MDSAP",
          detail:
            "Manufacturers of Class II, III and IV devices sold in Canada need an MDSAP certificate to apply for an MDL, even if they sell only in Canada. [ISO 13485 consulting](/services/iso-13485/) prepares the system for that audit.",
        },
        {
          title: "Medical Device Establishment Licence (MDEL)",
          detail:
            "Importers and distributors of all device classes, and Class I manufacturers that do not sell solely through an MDEL holder, need an MDEL. Holders submit an annual license review application to Health Canada before April 1 each year.",
        },
        {
          title: "ISO 9001 for work outside the device scope",
          detail:
            "Healthcare service providers and suppliers of products that are not medical devices may be asked for ISO 9001 instead. It is not a substitute for ISO 13485 where a device customer or the regulator requires ISO 13485.",
        },
        {
          title: "ISO/IEC 27001 for software and health data",
          detail:
            "Companies building device software, connected devices or systems that hold patient information are often asked how that data is protected. [ISO 27001 consulting](/services/iso-27001/) builds an information security management system around those risks.",
        },
      ],
    },
    {
      heading: "What do ISO 13485 and MDSAP auditors look for?",
      paragraphs: [
        "MDSAP auditors assess the quality system against ISO 13485:2016 together with the requirements of the regulators that participate in the program, which include Health Canada and the US Food and Drug Administration. For a manufacturer that sells only in Canada, the other countries' regulatory requirements are not audited.",
        "Expect the audit to follow a device from design to the field. Design and development controls (clause 7.3 of ISO 13485:2016) should show inputs, outputs, reviews, verification, validation and transfer to production, each with a dated record. The medical device file (clause 4.2.3) should hold what a regulator needs to see about each device type. Risk management should run through product realization, not sit in a separate binder, and the risk file should change when complaints or design changes reveal a hazard nobody had considered.",
        "After release, the auditor checks complaint handling and whether complaints were assessed for reporting to the regulator, along with traceability, corrective action and supplier controls. **Software used to run the quality system also has to be validated** for its intended use under clause 4.1.6, which catches organizations that move records into a new system without testing it first. The same discipline applies to software used in production and inspection.",
      ],
    },
    {
      heading: "How should a device company get started?",
      paragraphs: [
        "Confirm the device class first, because it decides whether you need an MDL and an MDSAP audit or an MDEL. Then define the scope: which sites, which device families, and which activities. Write it the way it will appear on the certificate, because customers and the regulator will read it. An organization that does not design devices can usually justify excluding design and development controls; the justification has to be documented.",
        "A gap analysis against ISO 13485:2016 and the Canadian regulatory requirements comes next, followed by the system build, a period of operation to create records, an internal audit and management review, and then the MDSAP audit by a recognized auditing organization. An ISO 13485 project typically takes longer than an ISO 9001 project, because design history, validation and supplier records need time to accumulate. Choose the auditing organization early, since its availability can set the audit date.",
        "**Illustrative example:** A contract manufacturer that machines components for a Class II device maker is told its customer now requires ISO 13485. The manufacturer does no design work, so it scopes design and development out with a written justification and concentrates on process validation, traceability and supplier control.",
      ],
    },
  ],
  faqs: [
    {
      question: "Does Health Canada require ISO 13485 certification?",
      answer:
        "For Class II, III and IV devices, yes in practice: a Medical Device Licence application requires an ISO 13485 certificate issued under MDSAP. Class I devices do not need an MDL, and their manufacturers are not required to hold an MDSAP certificate, though they generally need a Medical Device Establishment Licence (MDEL). Customers may still ask a Class I manufacturer or component supplier for ISO 13485 certification.",
    },
    {
      question: "What is MDSAP?",
      answer:
        "The Medical Device Single Audit Program lets one audit of a manufacturer's quality system satisfy several regulators at once. Participating regulators include Health Canada, the US Food and Drug Administration, Australia's Therapeutic Goods Administration, Brazil's ANVISA and Japan's regulators. The audit covers ISO 13485:2016 plus the regulatory requirements of each market the manufacturer sells into, and it is carried out by a recognized auditing organization.",
    },
    {
      question: "What is an MDEL and who needs one?",
      answer:
        "A Medical Device Establishment Licence (MDEL) is issued by Health Canada to companies that import or sell medical devices in Canada. Importers and distributors of all device classes need one, as do Class I manufacturers unless they sell solely through a company that already holds an MDEL. Manufacturers of Class II to IV devices sell under their Medical Device Licence instead. MDEL holders must apply for an annual license review before April 1.",
    },
    {
      question:
        "Can a component supplier or contract manufacturer get ISO 13485 certification?",
      answer:
        "Yes. ISO 13485 applies to organizations involved in any stage of a medical device's life, including suppliers of components and contract manufacturing services. The certificate scope describes the activities you perform, and requirements that do not apply, such as design and development for a supplier that does no design, can be excluded with a documented justification. Your customer may also set requirements of its own.",
    },
    {
      question: "How long does ISO 13485 certification take?",
      answer:
        "ISO 13485 certification typically takes longer than ISO 9001, because the auditor expects design records, process validation and supplier controls to be running with records behind them. Organizations with no design scope and an existing ISO 9001 system usually move faster. A [free readiness check](/assessment/) shows where your current system stands before you commit to a timeline.",
    },
  ],
};

export default copy;
