import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, CTASection } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ArrowRight, Check, Icon } from "@/components/Icons";
import { INDUSTRIES, STANDARDS, MODULES, type Module } from "@/lib/site";

export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ industry: i.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { industry: string };
}): Metadata {
  const i = INDUSTRIES.find((x) => x.slug === params.industry);
  if (!i) return {};
  return {
    title: `ISO Consulting for ${i.name} in Canada`,
    description: `ISO consulting for ${i.name} in Canada: gap analysis, a compliance management system built around your processes, and evidence to prove it.`,
    alternates: { canonical: `/industries/${i.slug}` },
  };
}

type Challenge = { pain: string; module: string; slug: string; capability: string };

// Each pressure names the module and the concrete capability that answers it.
// Construction, mining and oil & gas use the general modules; no sector template is claimed.
const CHALLENGES: Record<string, Challenge[]> = {
  manufacturing: [
    {
      pain: "Customer audits demand documented, repeatable processes.",
      module: "Processes",
      slug: "processes",
      capability: "Every process has a named owner, a flowchart and the documents linked to it.",
    },
    {
      pain: "Nobody can say how ready the business is until the auditor arrives.",
      module: "Standards",
      slug: "standards",
      capability: "A status per clause and a coverage percentage against your target.",
    },
    {
      pain: "Scrap, rework and nonconformances recur because the fix never reaches root cause.",
      module: "Improvements",
      slug: "nonconformance-capa",
      capability: "Containment, root cause analysis and an effectiveness check before closure.",
    },
  ],
  automotive: [
    {
      pain: "OEM customers require IATF 16949 and full core-tool evidence.",
      module: "Supplier Quality",
      slug: "supplier-quality",
      capability: "PFMEA, Process Flow and Control Plan kept linked, so a change in one is visible in the others.",
    },
    {
      pain: "PPAP submissions and APQP timing cannot slip.",
      module: "Supplier Quality",
      slug: "supplier-quality",
      capability: "APQP, PPAP and FAI tracked per supplier and part, answered through the portal task inbox.",
    },
    {
      pain: "Supplier corrective actions drag on by email.",
      module: "Improvements",
      slug: "nonconformance-capa",
      capability: "A SCAR raised from the nonconformance and answered by the supplier in the portal, with the full record kept.",
    },
  ],
  "aerospace-defence": [
    {
      pain: "AS9100 demands configuration control and change control that hold up.",
      module: "Documents",
      slug: "document-control",
      capability: "Approval chains, version comparison and frozen, hash-verified approved copies.",
    },
    {
      pain: "Primes expect first article evidence in the format they specify.",
      module: "Supplier Quality",
      slug: "supplier-quality",
      capability: "FAI packages tracked per supplier and part.",
    },
    {
      pain: "Inspection records must show who performed and who reviewed.",
      module: "Assets",
      slug: "calibration-maintenance",
      capability: "E-signatures for performed and reviewed on every inspection record.",
    },
  ],
  "healthcare-medical-devices": [
    {
      pain: "ISO 13485 document and record control must survive a regulator's review.",
      module: "Documents",
      slug: "document-control",
      capability: "A Draft to Obsolete lifecycle, sequential or parallel approvers, and approved copies that are frozen.",
    },
    {
      pain: "Measuring equipment must be in calibration, with certificates on hand.",
      module: "Assets",
      slug: "calibration-maintenance",
      capability: "Calibration intervals and certificates attached to each instrument in the register.",
    },
    {
      pain: "Competence must be proven per person and per task.",
      module: "Training",
      slug: "training-competence",
      capability: "A competency matrix with custom levels, quiz results and supervisor sign-off.",
    },
  ],
  "food-beverage": [
    {
      pain: "Supplier approval has to be documented, with certificates that do not expire unnoticed.",
      module: "Supplier Quality",
      slug: "supplier-quality",
      capability: "Onboarding with approval gates and compliance documents with expiry dates.",
    },
    {
      pain: "Complaints and deviations need containment and a verified corrective action.",
      module: "Improvements",
      slug: "nonconformance-capa",
      capability: "Containment first, root cause analysis, and an effectiveness check before closure.",
    },
    {
      pain: "Near-misses on the floor go unreported.",
      module: "Safety",
      slug: "safety",
      capability: "Anonymous QR-code reporting that needs no login.",
    },
  ],
  "oil-gas-energy": [
    {
      pain: "Quality, environment and safety are managed together in high-consequence work.",
      module: "Standards",
      slug: "standards",
      capability: "ISO 9001, 14001 and 45001 tracked clause by clause in one workspace.",
    },
    {
      pain: "Regulatory scrutiny spans multiple jurisdictions.",
      module: "Documents",
      slug: "document-control",
      capability: "One controlled revision of every procedure, with the approval chain on record.",
    },
    {
      pain: "Contractor and supply-chain compliance at scale.",
      module: "Supplier Quality",
      slug: "supplier-quality",
      capability: "Qualification status, compliance documents with expiry dates and evaluations for every contractor.",
    },
  ],
  construction: [
    {
      pain: "Tenders require certified management systems.",
      module: "Standards",
      slug: "standards",
      capability: "Coverage against the standard the tender names, with evidence linked to each clause.",
    },
    {
      pain: "Site safety and environmental compliance under ISO 45001 and ISO 14001.",
      module: "Safety",
      slug: "safety",
      capability: "Incident and near-miss reporting from any site, with severity based on the level of harm.",
    },
    {
      pain: "Subcontractor quality and document control across projects.",
      module: "Supplier Quality",
      slug: "supplier-quality",
      capability: "Subcontractors onboarded with approval gates and tracked on scorecards.",
    },
  ],
  "mining-natural-resources": [
    {
      pain: "Environmental stewardship must be proven under public scrutiny.",
      module: "Standards",
      slug: "standards",
      capability: "ISO 14001 clauses with status, linked evidence and a statement of applicability export.",
    },
    {
      pain: "Safety leadership in inherently high-risk operations.",
      module: "Safety",
      slug: "safety",
      capability: "Near-miss and incident reporting with its own dashboard and permissions.",
    },
    {
      pain: "Integrated management across remote, multi-site operations.",
      module: "Audits",
      slug: "audits-management-review",
      capability: "An annual audit programme with the checklist, findings and evidence in one workspace.",
    },
  ],
};

export default function IndustryPage({ params }: { params: { industry: string } }) {
  const ind = INDUSTRIES.find((x) => x.slug === params.industry);
  if (!ind) notFound();

  const challenges = CHALLENGES[ind.slug] ?? [];
  const stds = ind.standards
    .map((code) => STANDARDS.find((s) => s.code === code))
    .filter((s): s is (typeof STANDARDS)[number] => Boolean(s));
  const modules = ind.moduleSlugs
    .map((slug) => MODULES.find((m) => m.slug === slug))
    .filter((m): m is Module => Boolean(m));
  const otherIndustries = INDUSTRIES.filter((x) => x.slug !== ind.slug).slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow="Industry focus"
        title={
          <>
            ISO consulting for{" "}
            <span className="text-teal-700">{ind.name}</span>
          </>
        }
        intro={ind.blurb}
      >
        <Link href="/contact" className="btn-primary">
          Talk to a {ind.name.toLowerCase()} specialist <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/assessment" className="btn-ghost">
          Free readiness check
        </Link>
      </PageHeader>

      <section className="bg-white py-16 lg:py-24">
        <div className="container-page grid gap-14 lg:grid-cols-2">
          <div>
            <Reveal>
              <h2 className="font-heading text-2xl font-bold text-navy-900">
                The pressures you are under
              </h2>
              <p className="mt-4 text-slate-600">
                {ind.name} operations face requirements that generic consultants miss. Each one
                below names the module in the compliance management software that answers it.
              </p>
            </Reveal>
            <Stagger className="mt-8 space-y-4">
              {challenges.map((c) => (
                <StaggerItem key={c.pain}>
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-50 text-gold-700">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-sm font-semibold text-navy-900">{c.pain}</p>
                    </div>
                    <p className="ml-9 mt-2 text-sm text-slate-600">
                      <Link
                        href={`/solutions/${c.slug}`}
                        className="font-semibold text-teal-700 hover:text-teal-800"
                      >
                        {c.module}
                      </Link>
                      : {c.capability}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div>
            <Reveal>
              <h2 className="font-heading text-2xl font-bold text-navy-900">
                Standards we implement here
              </h2>
              <p className="mt-4 text-slate-600">
                Most {ind.name.toLowerCase()} clients integrate two or three standards
                into a single management system rather than running them in parallel.
              </p>
            </Reveal>
            <Stagger className="mt-8 space-y-4">
              {stds.map((s) => (
                <StaggerItem key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="card card-hover group flex items-center gap-4 p-5"
                  >
                    <span className="rounded-lg bg-navy-50 px-2.5 py-1 font-heading text-sm font-bold text-navy-900">
                      {s.code}
                    </span>
                    <div className="flex-1">
                      <p className="font-heading text-sm font-semibold text-navy-900">{s.name}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-teal-700 transition-transform group-hover:translate-x-1" />
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* modules used in this industry */}
      <section className="bg-soft py-16">
        <div className="container-page">
          <h2 className="font-heading text-xl font-bold text-navy-900">
            Software modules used in {ind.name.toLowerCase()}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <Link
                key={m.slug}
                href={`/solutions/${m.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <Icon name={m.icon} className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-heading text-sm font-semibold text-navy-900">{m.name}</span>
                  <span className="block text-xs text-slate-500">{m.tagline}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <h2 className="font-heading text-xl font-bold text-navy-900">Other industries we serve</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {otherIndustries.map((o) => (
              <Link
                key={o.slug}
                href={`/industries/${o.slug}`}
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md"
              >
                <span className="font-heading text-sm font-semibold text-navy-900">{o.name}</span>
                <ArrowRight className="h-4 w-4 text-teal-700 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection title={`Get your ${ind.name.toLowerCase()} operation certified`} />
    </>
  );
}
