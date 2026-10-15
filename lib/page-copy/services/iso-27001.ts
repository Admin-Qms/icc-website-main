import type { PageCopy } from "../types";

const copy: PageCopy = {
  slug: "iso-27001",
  updated: "2026-10-15",
  overview: [
    "ISO/IEC 27001 is the international standard, published jointly by the International Organization for Standardization (ISO) and the International Electrotechnical Commission (IEC), that sets requirements for an information security management system (ISMS). It applies to any organization that needs to protect the confidentiality, integrity and availability of information, from software companies to manufacturers holding customer drawings.",
    "The current edition is ISO/IEC 27001:2022, with Amendment 1:2024, which adds a requirement to determine whether climate change is a relevant issue when setting the context of the ISMS. The standard is risk-based: it does not prescribe one set of controls for everyone, but requires you to assess your own risks and justify the controls you choose.",
    "In Canada, the push for ISO/IEC 27001 often comes from customers rather than regulators. Enterprise buyers, defense primes, healthcare organizations and procurement teams send long security questionnaires, and a certificate from an accredited body answers many of those questions at once. It supports, but does not replace, obligations under privacy law such as the Personal Information Protection and Electronic Documents Act (PIPEDA).",
  ],
  sections: [
    {
      heading: "What does ISO/IEC 27001:2022 require?",
      paragraphs: [
        "The standard has two parts. Clauses 4 to 10 set out the management system requirements, and every one of them applies to a certified organization. Annex A lists reference controls, which you select from based on your risk assessment rather than implement wholesale.",
        "**The Statement of Applicability is the document that ties the two parts together.** It lists every Annex A control, states whether it applies, explains why, and records whether it is implemented. Auditors use it as a map of the whole ISMS.",
      ],
      points: [
        {
          title: "Scope and context (clauses 4.1 to 4.3)",
          detail:
            "You define the internal and external issues and interested parties that shape your information security needs, and set a scope that states which locations, systems and services the ISMS covers.",
        },
        {
          title: "Risk assessment (clause 6.1.2)",
          detail:
            "You define risk criteria, identify risks to the confidentiality, integrity and availability of information, assign risk owners, and analyze and evaluate each risk in a repeatable way.",
        },
        {
          title: "Risk treatment (clause 6.1.3)",
          detail:
            "You choose how to treat each risk, compare the controls you need against Annex A so none is overlooked, produce the Statement of Applicability, and get risk owners to approve the treatment plan.",
        },
        {
          title: "Annex A controls",
          detail:
            "The 2022 edition groups 93 reference controls into four themes: organizational, people, physical and technological.",
        },
        {
          title: "Performance evaluation (clauses 9.1 to 9.3)",
          detail:
            "You monitor and measure the ISMS, run internal audits at planned intervals, and hold management reviews that lead to decisions and actions.",
        },
        {
          title: "Improvement (clause 10)",
          detail:
            "Nonconformities are corrected, their causes are addressed, and the ISMS is improved over time based on audit results, incidents and changes in risk.",
        },
      ],
    },
    {
      heading: "Who needs ISO 27001 certification in Canada?",
      paragraphs: [
        "ISO/IEC 27001 certification is voluntary. Organizations pursue it when information security becomes part of how they win and keep work.",
        "Software and managed service providers selling to larger organizations meet it in vendor risk reviews. [Aerospace and defense suppliers](/industries/aerospace-defence/) hold controlled drawings and technical data their customers expect them to protect. [Healthcare and medical device companies](/industries/healthcare-medical-devices/) handle patient-related and product data that buyers want handled under a recognized framework.",
        "Privacy law sits alongside the standard. PIPEDA applies to private-sector organizations that collect, use or disclose personal information in the course of commercial activity, and Alberta, British Columbia and Quebec have their own private-sector privacy laws that apply within those provinces. **ISO/IEC 27001 certification shows that information security is managed systematically, but it is not a privacy compliance certificate.** Consent, purpose limits and individual access rights remain separate obligations.",
      ],
    },
    {
      heading: "How long does ISO 27001 certification take?",
      paragraphs: [
        "A first ISO/IEC 27001 certification typically takes four to nine months. The range depends mostly on scope: certifying one product or service is a smaller project than certifying the whole organization, and every location, cloud service and supplier inside the scope must be accounted for.",
        "The other driver is how much evidence already exists. An organization with an asset inventory, documented access reviews, tested backups, security awareness training and an incident log is formalizing and connecting work it already does. An organization without them needs time to put the controls in place and then run them long enough to produce records an auditor can sample.",
        "Certification body fees are quoted in audit days, which depend mainly on the number of people working within the scope and the complexity of the systems involved.",
        "A [free readiness check](/assessment/) gives you a scored view of your current position.",
      ],
    },
    {
      heading: "Preparing for the ISO 27001 certification audit",
      paragraphs: [
        "The certification audit runs in two stages. Stage 1 reviews the documented ISMS: the scope, the information security policy, the risk assessment method and results, the risk treatment plan and the Statement of Applicability. Stage 2 tests whether the controls operate as described.",
        "In Stage 2, auditors sample real records. Expect requests for evidence of joiner and leaver access changes, periodic access reviews, a backup restore test, supplier security assessments, security awareness training and the handling of at least one incident or event. **A control listed as implemented in the Statement of Applicability needs evidence behind it.**",
        "Before Stage 1, complete an internal audit of the whole ISMS and a management review, and close the corrective actions they raise. Keeping the Statement of Applicability, policies and audit program in one compliance system makes it easier to show the auditor that each control has an owner and a current status.",
        "Choose a certification body accredited for ISO/IEC 27001, either by the Standards Council of Canada or by another signatory to the International Accreditation Forum (IAF) Multilateral Recognition Arrangement. After certification, expect annual surveillance audits and a recertification audit in the third year. [The six-stage certification process](/process/) shows how ISO Certification Consultants plan the work from gap analysis to certificate.",
      ],
    },
  ],
  faqs: [
    {
      question: "Is ISO 27001 certification mandatory in Canada?",
      answer:
        "No. ISO/IEC 27001 certification is voluntary in Canada and is not required by general law. It becomes a practical requirement when customers, primes or procurement teams make it a condition of a contract or a vendor approval. Organizations also pursue it to replace repeated security questionnaires with one independently audited certificate from an accredited certification body.",
    },
    {
      question: "What is a Statement of Applicability in ISO 27001?",
      answer:
        "A Statement of Applicability is a required document in ISO/IEC 27001:2022 that lists the Annex A controls, states whether each one is included, justifies inclusions and exclusions, and records whether each included control is implemented. It is the bridge between your risk treatment decisions and the controls the auditor will test, so it needs to stay current as risks and systems change.",
    },
    {
      question: "What is the difference between ISO 27001 and SOC 2?",
      answer:
        "ISO/IEC 27001 is an international standard for an information security management system, and certification is granted by an accredited certification body. SOC 2 is an attestation report issued by a CPA firm under criteria set by the American Institute of Certified Public Accountants. Buyers in the United States often ask for SOC 2, while ISO/IEC 27001 is recognized internationally. Some organizations hold both.",
    },
    {
      question:
        "Does ISO 27001 certification make a company compliant with PIPEDA?",
      answer:
        "No. ISO/IEC 27001 helps you protect personal information with appropriate safeguards, which supports one of the principles of PIPEDA, but certification does not assess privacy obligations such as consent, limits on collection and use, retention or individual access requests. Treat the ISMS as a strong foundation for privacy compliance and address those obligations separately, under PIPEDA or the applicable provincial law.",
    },
    {
      question: "Do all 93 Annex A controls have to be implemented?",
      answer:
        "No. ISO/IEC 27001:2022 requires you to compare your risk treatment against Annex A so that no necessary control is overlooked, but each control is included only where your risks call for it. Excluded controls must be justified in the Statement of Applicability. The management system clauses, 4 to 10, are different: every one of them applies to a certified organization.",
    },
  ],
};

export default copy;
