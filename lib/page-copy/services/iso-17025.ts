import type { PageCopy } from "../types";

const copy: PageCopy = {
  slug: "iso-17025",
  updated: "2026-10-15",
  overview: [
    "ISO/IEC 17025:2017 is the international standard for the competence, impartiality and consistent operation of testing and calibration laboratories, published jointly by ISO and the International Electrotechnical Commission (IEC). It applies to any organization that performs testing, calibration or sampling linked to later testing or calibration, from in-plant labs to independent commercial laboratories.",
    "Unlike most ISO standards, ISO/IEC 17025 leads to **accreditation, not certification.** An accreditation body assesses the laboratory and grants accreditation for a defined scope of tests or calibrations. In Canada, the Standards Council of Canada (SCC) and the Canadian Association for Laboratory Accreditation (CALA) both accredit laboratories to ISO/IEC 17025.",
    "For a Canadian laboratory, accreditation is what lets customers, regulators and certification bodies rely on a result without repeating the work. SCC is a signatory to the International Laboratory Accreditation Cooperation (ILAC) mutual recognition arrangement, which helps accredited results gain acceptance with customers outside Canada.",
  ],
  sections: [
    {
      heading: "What does ISO/IEC 17025:2017 require?",
      paragraphs: [
        "The standard has two halves. Clauses 4 to 7 cover the technical and structural requirements that make a result trustworthy, and clause 8 covers the management system. Clause 8.1 lets a laboratory meet the management system requirements either directly (Option A) or through a management system that already meets ISO 9001 (Option B).",
        "Assessors spend most of their time on the technical clauses. They pick results from your reports and trace each one back to the method, the analyst, the equipment and the calibration behind it. The requirements below are the ones that take the most preparation.",
      ],
      points: [
        {
          title: "Impartiality and confidentiality (clause 4)",
          detail:
            "Risks to impartiality are identified on an ongoing basis and removed or minimized, and client information is protected under a legally enforceable commitment.",
        },
        {
          title: "Personnel competence (clause 6.2)",
          detail:
            "Competence requirements are defined for each function that affects results, and staff are authorized for specific tasks only once their competence is demonstrated and recorded.",
        },
        {
          title:
            "Equipment and metrological traceability (clauses 6.4 and 6.5)",
          detail:
            "Equipment is calibrated where it affects the validity of results, and each measurement result is linked to a reference through a documented, unbroken chain of calibrations.",
        },
        {
          title: "Method selection, verification and validation (clause 7.2)",
          detail:
            "Standard methods are verified before use in your lab, and non-standard or modified methods are validated to show they are fit for their intended use.",
        },
        {
          title: "Measurement uncertainty (clause 7.6)",
          detail:
            "Laboratories identify the contributions to measurement uncertainty and evaluate it, and calibration laboratories must evaluate it for every calibration they perform.",
        },
        {
          title: "Ensuring the validity of results (clause 7.7)",
          detail:
            "Results are monitored internally, and where available and appropriate the lab compares its performance with other labs through proficiency testing or interlaboratory comparisons.",
        },
      ],
    },
    {
      heading: "Is ISO/IEC 17025 accreditation or certification?",
      paragraphs: [
        "It is accreditation. A certification body can certify a laboratory to ISO 9001, but that certificate says the quality management system is in place. It says nothing about whether a particular test or calibration is done competently. **ISO/IEC 17025 accreditation is a statement of technical competence for specific tests or calibrations**, granted by an accreditation body after its assessors, including technical experts in the methods, have reviewed the work.",
        "Accreditation is tied to a scope. The scope of accreditation lists the tests or calibrations covered, the methods used and, for calibration laboratories, the measurement ranges and capabilities. A result outside that scope is not an accredited result, even when it comes from an accredited laboratory.",
        "Many laboratories hold both. A plant already certified to [ISO 9001](/services/iso-9001/) can use Option B, so the existing document control, internal audit and management review carry the management system half of ISO/IEC 17025, and the project concentrates on the technical requirements.",
      ],
    },
    {
      heading: "Who needs ISO/IEC 17025 accreditation in Canada?",
      paragraphs: [
        "Commercial testing and calibration laboratories pursue accreditation because their customers, and in some sectors their regulators, accept only accredited results. Environmental, food, materials, mineral and petroleum testing are areas where accreditation is commonly expected.",
        "In-house laboratories at manufacturing plants have a different reason. When a lab issues results that a customer relies on for product release, or calibrates the gauges used for final inspection, accreditation gives that customer confidence in the numbers without a separate lab audit. Automotive suppliers should also note that [IATF 16949:2016](/services/iatf-16949/) expects the external laboratories they use for inspection, test or calibration to be accredited to ISO/IEC 17025, so labs serving that supply chain are often asked for it.",
        "Accreditation is not required for every lab. A lab whose results are used only for internal process control may be better served by tight calibration and method control under ISO 9001. The right answer depends on who relies on the results and what they have written into contracts.",
      ],
    },
    {
      heading: "How long does accreditation take, and what drives the cost?",
      paragraphs: [
        "A laboratory with established methods and calibrated equipment typically needs nine to eighteen months to reach accreditation, including the time the accreditation body takes to schedule and complete its assessment. A lab that must validate methods or build measurement uncertainty estimates from the start should plan for the longer end.",
        "**The size of the scope is the biggest cost driver**, because each method in it needs verification or validation evidence, an uncertainty estimate and competence records for every analyst who performs it. Starting with a narrow scope of the methods customers ask about most, then extending it after accreditation, is a common approach.",
        "Other factors are the availability of suitable proficiency testing for your methods, the state of equipment calibration records, and how much internal audit and management review history exists. The compliance software keeps the equipment register, calibration intervals and certificates in Assets, so traceability evidence is ready when assessors ask; the [calibration and maintenance module](/solutions/calibration-maintenance/) shows how. To scope your project, [talk to ISO Certification Consultants](/contact/).",
      ],
    },
  ],
  faqs: [
    {
      question:
        "What is the difference between ISO/IEC 17025 accreditation and ISO 9001 certification?",
      answer:
        "ISO 9001 certification confirms that an organization runs a quality management system. ISO/IEC 17025 accreditation confirms that a laboratory is technically competent to produce valid results for the specific tests or calibrations listed in its scope. Accreditation is granted by an accreditation body using assessors with technical expertise in the methods, and it covers measurement traceability, method validation and measurement uncertainty, which ISO 9001 does not address.",
    },
    {
      question: "Who accredits laboratories to ISO/IEC 17025 in Canada?",
      answer:
        "The Standards Council of Canada (SCC) and the Canadian Association for Laboratory Accreditation (CALA) both accredit laboratories to ISO/IEC 17025. SCC runs a testing and calibration laboratory accreditation program and is a signatory to the ILAC mutual recognition arrangement. CALA accredits testing laboratories in areas including environmental analysis. The right body depends on your sector and on what your customers or regulators recognize.",
    },
    {
      question: "How long does ISO/IEC 17025 accreditation take?",
      answer:
        "A laboratory with established methods and calibrated equipment typically reaches accreditation in nine to eighteen months, including the accreditation body's assessment. The timeline depends mainly on how many tests or calibrations are in scope, whether methods still need validation, whether measurement uncertainty has been estimated, and whether suitable proficiency testing is available. Starting with a narrow scope and extending it later often shortens the first cycle.",
    },
    {
      question: "Does an in-house plant laboratory need ISO/IEC 17025?",
      answer:
        "Not always. An in-house lab whose results are used only for internal process control can usually meet customer expectations through calibration and method control under ISO 9001. Accreditation becomes worth pursuing when customers rely on the lab's results for product release, when contracts or customer requirements call for ISO/IEC 17025, or when the lab calibrates equipment used for final inspection.",
    },
    {
      question: "What is a scope of accreditation?",
      answer:
        "A scope of accreditation is the formal list of tests or calibrations a laboratory is accredited to perform, published by the accreditation body. It names the methods, the materials or products tested and, for calibration labs, the measurement ranges and capabilities. Only results within that scope are accredited results, so customers should check the scope, not just the accreditation certificate.",
    },
  ],
};

export default copy;
