import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { EngagementFlow } from "@/components/EngagementFlow";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { SectionHeading, StandardCard, IndustryCard, ModuleCard, AnyStandardCard, CTASection } from "@/components/ui";
import { ROIPanel } from "@/components/ROIPanel";
import { Icon, ArrowRight, Check } from "@/components/Icons";
import {
  STANDARDS,
  INDUSTRIES,
  MODULES,
  DIFFERENTIATORS,
  PAIN_POINTS,
} from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "AI Compliance Management Software for ISO 9001 & IATF 16949" },
  description:
    "AI-powered compliance management software that unifies quality, documents, audits, training and suppliers. Stay audit-ready for ISO 9001, IATF 16949 and AS9100.",
  alternates: { canonical: "/" },
};

const WHY = [
  {
    icon: "certificate",
    title: "Audit-ready every day",
    detail:
      "Evidence is saved as your team works, so you never rebuild records the week before an audit.",
  },
  {
    icon: "assistant",
    title: "Less manual work",
    detail:
      "AI drafts procedures, answers questions about your records and handles routine tasks. You review and approve.",
  },
  {
    icon: "dashboard",
    title: "Early warnings",
    detail:
      "Overdue actions, expiring training, calibration due dates and clause gaps are flagged on your dashboard and in a daily summary.",
  },
  {
    icon: "expert",
    title: "Expert help when you want it",
    detail:
      "Certified consultants can set the software up with you and guide you all the way to certification.",
  },
];

const HOME_AI_PRINCIPLES = [
  {
    title: "Acts within your permissions",
    detail: "The assistant can only do what the person asking is allowed to do.",
  },
  {
    title: "Shows its plan first",
    detail: "For a multi-step request, you see the plan and approve it before anything happens.",
  },
  {
    title: "Asks before deleting",
    detail: "Anything that deletes or overwrites data needs your extra confirmation.",
  },
  {
    title: "AI drafting is your choice",
    detail: "Document drafting is off until your organization turns it on.",
  },
  {
    title: "A person always signs off",
    detail: "AI drafts are suggestions until someone on your team reviews and accepts them.",
  },
];

const HOME_STEP_SUMMARIES: Record<string, string> = {
  "Gap Analysis": "Find out exactly what you are missing, clause by clause, with an owner for every gap.",
  "System Design": "Your processes are mapped as they really run, and the clauses that apply are marked.",
  Documentation: "Procedures and work instructions are drafted, with optional AI help and expert review.",
  Implementation: "Your team is trained, and the software tracks who still owes what.",
  "Internal Audit": "A full internal audit and management review catch problems early, while there is time to fix them.",
  Certification: "Support through your Stage 1 and Stage 2 audits, then help staying ready for surveillance audits.",
};

export default function Home() {
  return (
    <>
      <Hero />

      {/* PAIN → SOLUTION */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="What changes for you"
            title="The compliance problems you have today, solved"
            intro="If any of these sound familiar, this is what they look like once your compliance runs on the software."
          />
          <Stagger className="mt-12 grid gap-4">
            {PAIN_POINTS.map((p, i) => (
              <StaggerItem key={p.slug}>
                <Link
                  href={`/solutions/${p.slug}`}
                  className="group grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md md:grid-cols-[1fr_auto_1.3fr] md:items-center md:gap-6"
                >
                  <div>
                    {i === 0 && (
                      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">
                        Today
                      </span>
                    )}
                    <p className="font-heading text-base font-bold text-navy-900">{p.pain}</p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-teal-700 ring-1 ring-teal-100">
                    {p.module}
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <div>
                    {i === 0 && (
                      <span className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-teal-700">
                        With the software
                      </span>
                    )}
                    <p className="text-sm leading-relaxed text-slate-600">{p.capability}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* WHY / TRUST */}
      <section className="bg-soft py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="What you get"
            title="Everything you need to meet your compliance requirements, in one system"
            intro="No more spreadsheets, binders and separate tools that someone has to pull together before every audit."
          />
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <StaggerItem key={w.title}>
                <div className="card h-full p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-lg bg-navy-900 text-teal-400">
                    <Icon name={w.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-bold text-navy-900">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{w.detail}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* SOLUTIONS / MODULES */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="The compliance management software"
              title="One platform for quality, compliance, people, processes, suppliers and operations"
              intro="Turn on the modules you need now and add more as you grow. Each one is set up to match the forms and approvals your team already uses."
            />
            <Reveal delay={0.1}>
              <Link href="/solutions" className="btn-outline">
                See all modules <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MODULES.map((m) => (
              <StaggerItem key={m.slug}>
                <ModuleCard m={m} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CUSTOMIZATION */}
      <section className="bg-soft py-16 lg:py-24">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-end">
            <SectionHeading
              eyebrow="Built around you"
              title="Have a requirement that doesn't fit? We'll build it."
              intro="If you are audited against something unusual, or a process still lives on paper, our experts assess your operation and set up or build a module that matches how you work."
            />
            <Reveal delay={0.1}>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm leading-relaxed text-slate-600">
                  Not sure where to start? We begin with an onsite gap assessment, design the
                  solution around what we find, and credit the assessment fee toward it.
                </p>
                <Link href="/custom-solutions" className="link-arrow mt-3">
                  Explore custom solutions <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>

          <EngagementFlow />

          <div className="mt-14">
            <ROIPanel showEstimatorLink />
          </div>

          <Reveal delay={0.1} className="mt-10 text-center">
            <Link href="/custom-solutions" className="btn-navy">
              See how customization works <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="How it works"
            title="How you get certified, in six steps"
            intro="You always know where you are and what comes next. Consultants run the gap analysis and audits with you, and the software keeps the evidence from day one."
            align="center"
          />
          <ProcessTimeline summaries={HOME_STEP_SUMMARIES} />
          <Reveal delay={0.1} className="mt-12 text-center">
            <Link href="/process" className="btn-navy">
              Walk through the full process <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* STANDARDS */}
      <section className="bg-soft py-16 lg:py-24">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Standards"
              title="Meet ISO 9001, IATF 16949, AS9100 and any other standard"
              intro="Common standards are ready to use. Customer-specific or regulatory requirements are added and tracked clause by clause in the same way."
            />
            <Reveal delay={0.1}>
              <Link href="/services" className="btn-outline">
                All standards <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STANDARDS.slice(0, 5).map((s) => (
              <StaggerItem key={s.slug}>
                <StandardCard s={s} />
              </StaggerItem>
            ))}
            <StaggerItem>
              <AnyStandardCard />
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Industries"
              title="Built for organizations of every size and industry"
              intro="Whether you run one plant or many, the software is set up for your sector's requirements and your customers' demands."
            />
            <Reveal delay={0.1}>
              <Link href="/industries" className="btn-outline">
                All industries <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((i) => (
              <StaggerItem key={i.slug}>
                <IndustryCard i={i} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* AI: a person always signs off */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow="How AI helps"
              title="AI does the paperwork. You stay in control."
              intro="AI works only within the permissions you set. It prepares drafts and handles routine tasks, and nothing becomes an official record until a person approves it. Gap assessments and audits are always done by people."
            />
            <Link href="/platform" className="link-arrow mt-6">
              How the software is kept in check <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <Stagger className="grid gap-4">
            {HOME_AI_PRINCIPLES.map((p) => (
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

      {/* REASSURANCE BAND */}
      <section className="border-y border-slate-200 bg-soft py-16 lg:py-20">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <Reveal>
              <span className="label">
                <span className="h-px w-7 bg-teal-600" />
                What you can count on
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">
                Stay audit-ready all year, not just the week before
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">
                Because records build up as part of daily work, your next audit is a review of what
                already exists. If you want hands-on help, our consultants are there from your
                first process map to a passed audit.
              </p>
              <Link href="/about" className="link-arrow mt-6">
                More about how we work <ArrowRight className="h-4 w-4" />
              </Link>
            </Reveal>
            <Stagger className="grid gap-4 sm:grid-cols-2">
              {DIFFERENTIATORS.map((d) => (
                <StaggerItem key={d.title}>
                  <div className="flex h-full gap-3 rounded-xl border border-slate-200 bg-white p-5">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-600 text-white">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <div>
                      <h3 className="font-heading text-base font-bold text-navy-900">{d.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{d.detail}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
