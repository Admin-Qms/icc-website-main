import type { PageCopy } from "../types";

const copy: PageCopy = {
  slug: "iatf-16949",
  overview: [
    "IATF 16949 is the quality management system standard for automotive production and service part suppliers, published by the International Automotive Task Force (IATF), a group of vehicle manufacturers and their trade associations. It is not a stand-alone standard: it supplements ISO 9001:2015 and is implemented together with it.",
    "IATF 16949:2016 is the current edition. The IATF has announced a second edition in development, but it has not been published, and IATF 16949:2016 remains the standard certification audits use. Only certification bodies recognized by the IATF can issue an IATF 16949 certificate, and each certificate can be checked by its IATF number in the IATF customer portal.",
    "For a parts maker in Ontario's automotive supply chain, the certificate is usually what keeps the plant on a customer's approved list. Vehicle manufacturers and Tier 1 suppliers write it into sourcing requirements, then layer their own customer-specific requirements on top. The audit tests both, which is why IATF 16949 asks more of a plant than ISO 9001 alone.",
  ],
  sections: [
    {
      heading: "What does IATF 16949 add to ISO 9001?",
      paragraphs: [
        "IATF 16949 keeps the ISO 9001:2015 clause structure and adds automotive requirements inside it. The additions focus on preventing defects at the launch and production stages, and on proving that controls work across every shift. These are the requirements a certification auditor spends the most time on, cited from IATF 16949:2016.",
      ],
      points: [
        {
          title: "Customer-specific requirements (clause 4.3.2)",
          detail:
            "Each customer's requirements are evaluated and built into the system, with a record of where each one is met.",
        },
        {
          title: "Product safety (clause 4.4.1.2)",
          detail:
            "Product-safety-related parts and processes need documented controls, from identifying statutory requirements to special approvals and reaction plans.",
        },
        {
          title: "Contingency plans (clause 6.1.2.3)",
          detail:
            "You plan how to keep supplying a customer through events such as equipment failure, utility interruption or loss of a key supplier, and you test those plans.",
        },
        {
          title:
            "Special characteristics and control plans (clauses 8.3.3.3 and 8.5.1.1)",
          detail:
            "Characteristics that affect safety, fit or function are identified, carried into the control plan and controlled at the station where they are made.",
        },
        {
          title: "Measurement system analysis (clause 7.1.5.1.1)",
          detail:
            "Gauges named in the control plan need studies showing that measurement variation is small enough to trust the reading.",
        },
        {
          title:
            "Problem solving and internal auditor competency (clauses 10.2.3 and 7.2.3)",
          detail:
            "Problems are solved through a disciplined method to root cause, and internal auditors must show automotive-specific competence, including knowledge of the core tools and customer requirements.",
        },
      ],
    },
    {
      heading: "Who can get IATF 16949 certification, and who cannot",
      paragraphs: [
        "Under the IATF's certification rules, IATF 16949 certification is open to sites where value-added manufacturing of customer-specified production parts, service parts or accessory parts takes place. A site that only designs parts, only warehouses them or only sells them cannot hold a certificate on its own. Those functions can be included as remote support locations of a certified manufacturing site.",
        "That rule matters for companies that sit near, but not inside, the automotive supply chain. A toolmaker, a calibration lab or a builder of production equipment is usually not eligible. Its customers may still require a quality management system, and clause 8.4.2.3 of IATF 16949:2016 makes an [ISO 9001-certified system](/services/iso-9001/) the initial minimum for suppliers unless the customer authorizes otherwise.",
        "Inside the supply chain, the request usually arrives with a new program award or a sourcing review. Tier 1 suppliers commonly need certification to quote vehicle manufacturers, and many pass the same expectation down to their Tier 2 suppliers. The [automotive industry page](/industries/automotive/) covers how that pressure plays out for parts makers.",
      ],
    },
    {
      heading: "How long does IATF 16949 certification take?",
      paragraphs: [
        "From a standing start, IATF 16949 certification typically takes nine to fifteen months. A plant with a working ISO 9001 system and current PPAP records can often move faster. The timeline is set by evidence: the certification body expects records that show the system has been running, including performance trends, a complete internal audit program covering the system, manufacturing processes and products, and a management review.",
        "Launch evidence is a frequent gap. Auditors follow a part number from APQP through the PFMEA, the control plan and the PPAP to the station on the floor, so those records have to agree with each other. In the software, Supplier Quality holds APQP, PPAP, PFMEA, Process Flow and Control Plan records linked to each other, which keeps that trail easy to show.",
        "Under the IATF Rules 6th Edition, in force since 1 January 2025, the first audit is a Stage 1 readiness review. The certification body decides whether the site is ready for Stage 2 or needs to repeat Stage 1, and the Stage 2 audit is scheduled within a set window after it. Any nonconformities raised must be closed, or verified as fully resolved, within 90 days of the last audit day before a certificate can be issued.",
        "Cost and duration grow with headcount, including contract and temporary workers, the number of shifts, the number of remote support locations and how many customers' requirements you must map. The [readiness check](/assessment/) gives an early read on where your plant stands.",
      ],
    },
  ],
  faqs: [
    {
      question: "Do you need ISO 9001 certification before IATF 16949?",
      answer:
        "Not as a separate certificate. IATF 16949 is implemented together with ISO 9001:2015, so the IATF 16949 certification audit covers the ISO 9001 requirements as well as the automotive ones. Many plants do start with ISO 9001 because it puts the basic system in place, but there is no rule that you hold an ISO 9001 certificate first.",
    },
    {
      question: "What are customer-specific requirements in IATF 16949?",
      answer:
        "Customer-specific requirements are the additional rules each automotive customer publishes on top of IATF 16949, such as required problem-solving formats, PPAP submission levels or early production containment. Clause 4.3.2 of IATF 16949:2016 requires you to evaluate them and include them in your system. The certification auditor samples them, so each one needs a clear place where it is met.",
    },
    {
      question:
        "Can a company that only designs parts get IATF 16949 certified?",
      answer:
        "No. IATF 16949 certification is limited to sites where value-added manufacturing of automotive production, service or accessory parts takes place. A design center, sales office or warehouse can be included only as a remote support location of a certified manufacturing site. A company with no manufacturing site of its own would usually look at ISO 9001 instead.",
    },
    {
      question:
        "How can you check whether a supplier's IATF 16949 certificate is valid?",
      answer:
        "Use the IATF customer portal. Every valid certificate is issued by an IATF-recognized certification body and carries an IATF number, and the portal lets you search by that number or by the site's unique identifier. A certificate that cannot be found there, or that comes from a body the IATF does not recognize, should not be accepted as IATF 16949 certification.",
    },
    {
      question: "Is a new edition of IATF 16949 coming?",
      answer:
        "The IATF has announced that a second edition is in development, but it has not been published. IATF 16949:2016 remains the valid standard, and certification audits continue against it. Until the IATF publishes the new edition and its transition rules, there is nothing to change in your system on account of it. Building to the current edition is the right course.",
    },
  ],
};

export default copy;
