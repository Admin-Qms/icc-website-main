import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionHeading, CTASection } from "@/components/ui";
import { Stagger, StaggerItem, Reveal } from "@/components/motion";
import { Icon, ArrowRight, Check } from "@/components/Icons";
import { PLATFORM, DIFFERENTIATORS, AI_PRINCIPLES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Compliance Management Software — Configured by Certified Consultants",
  description:
    "Compliance management software with eleven modules, an AI assistant that acts within your permissions, and AI suggestions a person always reviews.",
  alternates: { canonical: "/platform" },
};

const STEPS = [
  {
    title: "Assess",
    detail:
      "A certified consultant walks the floor for the gap analysis and scores every clause. The Standards module then holds the status of each clause and the evidence behind it.",
  },
  {
    title: "Build",
    detail:
      "Documents holds the procedures, Processes holds the process maps and their owners, and Training builds the competency matrix.",
  },
  {
    title: "Operate",
    detail:
      "Audits, Improvements, Safety, Assets, Vendors and Supplier Quality produce the records as the work happens.",
  },
  {
    title: "Certify",
    detail:
      "The statement of applicability, audit reports and sealed CAPA records are ready for the certification body. A consultant is in the room for Stage 1 and Stage 2.",
  },
];

export default function PlatformPage() {
  return (
    <>
      <PageHeader
        eyebrow="The software"
        title={<>Compliance management software, <span className="text-teal-700">configured with you</span></>}
        intro="Eleven modules that hold the evidence a certification audit asks for, produced as a by-product of daily work rather than assembled in a panic beforehand. Our certified consultants configure the modules around how your business runs and map them to any standard you certify against."
      >
        <Link href="/solutions" className="btn-primary">
          See the modules <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/contact" className="btn-ghost">
          Request a walkthrough
        </Link>
      </PageHeader>

      {/* how it works */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="From gap analysis to the certification audit, one system"
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
            eyebrow="Capabilities"
            title="What the software adds on top of the modules"
            intro="The assistant, optional AI drafting, notifications, the home dashboard and a consultant on call. Every AI output is a suggestion a person reviews."
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
              title="AI helps. A person always signs off."
              intro="Regulated buyers need to know who did what. The assistant works inside the permissions you already set, shows its plan before it acts, and leaves a trail that separates AI from people."
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
              eyebrow="The hybrid difference"
              title="Software alone will not pass your audit"
              intro="Software vendors hand you templates and walk away. Consultants hand you a binder no one maintains. We put both on the same system so the work is done and defensible. The certification body certifies; we prepare you and the software holds the evidence."
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
