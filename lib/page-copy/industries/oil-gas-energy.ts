import type { PageCopy } from "../types";

const copy: PageCopy = {
  slug: "oil-gas-energy",
  overview: [
    "Oil, gas and energy companies in Canada typically certify to ISO 9001, ISO 14001 and ISO 45001, often as one integrated system, because operators and project owners prequalify contractors on them and regulators expect hazards and compliance obligations to be managed systematically. Federally regulated pipeline companies must also maintain a management system under the Canadian Energy Regulator Onshore Pipeline Regulations.",
    "The work is high-consequence and spread out. A loss of containment, a spill or a failed lift has consequences far beyond the site, and the people doing the work are often contractors on rotation at remote locations. Interprovincial pipelines answer to the federal regulator, while upstream and provincial facilities answer to provincial bodies, so one company can carry several sets of obligations at once.",
    "On editions: ISO 45001:2018 is current. ISO 9001:2026 and ISO 14001:2026 were published in 2026, and many certified organizations remain on the 2015 editions, whose certificates stay valid during the transition periods that end in 2029.",
  ],
  sections: [
    {
      heading:
        "Which ISO standards do energy companies and their contractors need in Canada?",
      paragraphs: [
        "The answer usually comes from a prequalification questionnaire or a contract clause, so read those first. Operators can ask service companies for evidence of a safety program, an environmental program and quality control on the work itself, and an integrated certificate answers all three.",
      ],
      points: [
        {
          title: "ISO 45001:2018",
          detail:
            "The occupational health and safety standard, built on hazard identification, the hierarchy of controls, worker participation and control of contractors, and the core of any [ISO 45001](/services/iso-45001/) program in this sector.",
        },
        {
          title: "ISO 14001",
          detail:
            "Covers environmental aspects such as emissions, spills, waste and land disturbance, together with a register of compliance obligations that includes permits and approvals.",
        },
        {
          title: "ISO 9001",
          detail:
            "Covers whether fabrication, inspection, maintenance and field services meet the specification, which matters wherever a defect becomes a safety or environmental event.",
        },
        {
          title: "COR in Alberta",
          detail:
            "The Certificate of Recognition is a separate provincial health and safety program, and Energy Safety Canada is a certifying partner for the oil and gas industry in Alberta, so check whether a client asks for COR, ISO 45001 or either.",
        },
        {
          title: "Regulatory management systems",
          detail:
            "The Onshore Pipeline Regulations require a company to establish, implement and maintain a management system matched to the size of the company and the hazards and risks of its activities, alongside any ISO certificate.",
        },
      ],
    },
    {
      heading: "What do auditors look for in oil and gas operations?",
      paragraphs: [
        "Auditors test whether controls work in the field, not only at head office. Under ISO 14001:2015 they expect an evaluation of compliance with each obligation, with the date and result recorded. Under ISO 45001:2018 they ask how contractors are selected and coordinated, how changes to equipment, procedures or crews are assessed before they take effect, and how workers take part in identifying hazards.",
        "Emergency preparedness gets close attention in both standards. A written spill or emergency response plan is the starting point; the evidence is the drill, the gaps it exposed and the actions taken afterward.",
        "**Illustrative example:** A well-servicing contractor has a sound procedure for pressure testing, but its field crews work from a printed copy two revisions old. The auditor finds the gap by comparing the truck copy with the controlled version. The fix is controlled field access to the current revision, not another procedure.",
        "Competence is the other area auditors probe. For safety-critical tasks such as confined space entry, ground disturbance or energy isolation, expect to show who is qualified, the training or assessment that proves it, and how a supervisor confirms that a crew member arriving from another contractor holds the same qualification.",
      ],
    },
    {
      heading:
        "How do you run quality, environment and safety as one management system?",
      paragraphs: [
        "ISO 9001, ISO 14001 and ISO 45001 share a harmonized structure: the same clause numbers and titles, common terms and definitions, and identical core text. One document control process, one internal audit program, one corrective action process and one management review can serve all three, while aspects, hazards and quality controls stay specific to each.",
        "Integration also helps with change. A new well pad, a modified compressor station or a change of contractor can be reviewed once for its quality, environmental and safety effects, instead of three times by three departments that may not compare notes.",
        "Scope comes next. Decide which offices, yards, field operations and project sites the certificate covers, because the certification body plans its site visits from that scope. Each field location needs to show the same controls as the head office, since the auditor may choose any of them, and contractors working under your direction should be covered by the same controls. For an integrated system across a head office and field operations, certification typically takes nine to fifteen months. The [six-stage process](/process/) sets out how that work is sequenced.",
      ],
    },
  ],
  faqs: [
    {
      question:
        "Is ISO 45001 the same as COR for oil and gas contractors in Alberta?",
      answer:
        "No. COR is a provincial health and safety program, and Energy Safety Canada is a certifying partner for the oil and gas industry in Alberta. ISO 45001:2018 is an international standard certified by an accredited certification body. The two cover similar ground, such as hazard assessment, inspections and incident investigation, but they are audited differently. Check each client's prequalification requirements to see which one it accepts.",
    },
    {
      question:
        "Does the Canadian Energy Regulator require ISO 14001 certification?",
      answer:
        "The Onshore Pipeline Regulations set out their own management system requirements and do not require ISO certification. A company must establish, implement and maintain a management system that fits its size and the hazards and risks of its activities. An ISO 14001 and ISO 45001 system can supply much of that structure and evidence, but it has to be mapped against the regulatory requirements rather than assumed to satisfy them.",
    },
    {
      question:
        "Can one ISO certificate cover a head office and several field locations?",
      answer:
        "Yes. A single certificate can cover a head office, yards and field operations, provided they run under the same management system and are named in the scope. The certification body plans which locations to visit at each audit. Every location in scope has to work to the same controlled documents and feed the same internal audit and corrective action processes, or the multi-site arrangement falls apart at audit.",
    },
    {
      question:
        "How long does integrated ISO certification take for an energy services company?",
      answer:
        "For an integrated ISO 9001, ISO 14001 and ISO 45001 system, certification typically takes nine to fifteen months. The range depends on how many locations are in scope, whether existing safety and environmental programs can be adapted, and how quickly field records start showing the controls in use. A company with a mature safety program can often adapt it to ISO 45001 rather than start again.",
    },
    {
      question:
        "Should an energy company certify to ISO 14001:2015 or ISO 14001:2026?",
      answer:
        "ISO 14001:2026 was published in April 2026, and certificates to ISO 14001:2015 remain valid during a 36-month transition ending in 2029. A company building a new system can design it to the 2026 edition. A company already certified to the 2015 edition can plan its transition with its certification body. ISO 9001 follows a similar pattern, with ISO 9001:2026 published in September 2026.",
    },
  ],
};

export default copy;
