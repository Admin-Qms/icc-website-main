import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionHeading, CTASection } from "@/components/ui";
import { Stagger, StaggerItem, Reveal } from "@/components/motion";
import { Icon, ArrowRight, Check } from "@/components/Icons";
import { PLATFORM, DIFFERENTIATORS, AI_PRINCIPLES, SITE } from "@/lib/site";
import { pageTitle } from "@/lib/seo";
import { serializeJsonLd } from "@/lib/blog";

const DESCRIPTION =
  "AI-powered compliance management software for quality, documents, audits, training and suppliers. Stay audit-ready every day, with experts when you want them.";

export const metadata: Metadata = {
  title: pageTitle("AI Compliance Management Software"),
  description: DESCRIPTION,
  alternates: { canonical: "/platform" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Compliance management software",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: DESCRIPTION,
  provider: { "@type": "Organization", name: SITE.legalName, url: SITE.url },
  url: `${SITE.url}/platform/`,
};

const STEPS = [
  {
    title: "Know where you stand",
    detail:
      "A certified consultant walks the floor for the gap analysis and scores every clause. The Standards module then shows the status of each clause and the evidence behind it, so you see your gaps before the auditor does.",
  },
  {
    title: "Set up your system",
    detail:
      "Documents holds your procedures, Processes holds the process maps and their owners, and Training builds the competency matrix. Optional AI drafting helps with first versions, and a person reviews each one.",
  },
  {
    title: "Work as usual, records build themselves",
    detail:
      "Audits, Improvements, Safety, Assets, Vendors and Supplier Quality produce the records as the work happens, with overdue items flagged on your dashboard.",
  },
  {
    title: "Walk into the audit ready",
    detail:
      "The statement of applicability, audit reports and sealed CAPA records are ready for the certification body. If you want a consultant in the room for Stage 1 and Stage 2, they are there.",
  },
];

export default function PlatformPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
      <PageHeader
        eyebrow="The software"
        title={<>The AI-powered operating system for <span className="text-teal-700">quality and compliance</span></>}
        intro="Our compliance management software puts eleven modules in one place and keeps the evidence a certification audit asks for as your team works, instead of leaving it to be assembled in a panic beforehand. AI does the paperwork and flags what is slipping. You stay ready for an audit any day, for any standard you certify against."
      >
        <Link href="/solutions" className="btn-primary">
          See the modules <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/contact" className="btn-ghost">
          Book a demo
        </Link>
      </PageHeader>

      {/* how it works */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Your path to certification"
            title="From first gap to passed audit, in one system"
            align="center"
          />
          <div className="relative mt-14">
            <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent lg:block" />
            <Stagger className="grid gap-6 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <StaggerItem key={s.title}>
                  <div className="card relative h-full p-6 text-center">
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-100 font-heading font-bold">
                      {i + 1}
                    </span>
                    <h3 className="mt-4 font-heading text-lg font-bold text-navy-900">{s.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{s.detail}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="bg-soft py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="What you get"
            title="Less manual work, and early warning before anything slips"
            intro="An AI assistant, optional AI drafting, notifications, a home dashboard and a consultant on call. AI drafts and flags; a person reviews and signs off."
          />
          <Stagger className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PLATFORM.map((f) => (
              <StaggerItem key={f.title}>
                <div className="card card-hover group h-full p-7">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100 transition-colors duration-500 group-hover:bg-teal-600 group-hover:text-white">
                    <Icon name={f.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-bold text-navy-900">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* AI kept in check */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow="How AI is kept in check"
              title="AI does the paperwork. You stay in control."
              intro="You will always know who did what. The assistant works inside the permissions you already set, shows its plan before it acts, and leaves a trail that separates AI from people. Gap assessments and audits are always done by people."
            />
          </div>
          <Stagger className="grid gap-4">
            {AI_PRINCIPLES.map((p) => (
              <StaggerItem key={p.title}>
                <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-5">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-600 text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-bold text-navy-900">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{p.detail}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* hybrid */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Expert help when you want it"
              title="Experts when you want them"
              intro="Use the software on its own, or bring in our certified consultants to set it up with you and guide you to certification. Either way the work is done and defensible, because the software holds the evidence. The certification body certifies; we prepare you."
            />
          </div>
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {DIFFERENTIATORS.map((d) => (
              <StaggerItem key={d.title}>
                <div className="card h-full p-6">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                    <Check className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-bold text-navy-900">{d.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{d.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CTASection />
    </>
  );
}
