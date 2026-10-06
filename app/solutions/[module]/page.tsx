import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader, CTASection } from "@/components/ui";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ArrowRight, Check, Icon } from "@/components/Icons";
import { MODULES, CUSTOMIZATION, SITE, type Module } from "@/lib/site";

export function generateStaticParams() {
  return MODULES.map((m) => ({ module: m.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { module: string };
}): Metadata {
  const m = MODULES.find((x) => x.slug === params.module);
  if (!m) return {};
  return {
    title: `${m.name} — Compliance Management Software Module`,
    description: m.metaDescription,
    alternates: { canonical: `/solutions/${m.slug}` },
  };
}

export default function ModulePage({ params }: { params: { module: string } }) {
  const m = MODULES.find((x) => x.slug === params.module);
  if (!m) notFound();

  const related = m.related
    .map((slug) => MODULES.find((x) => x.slug === slug))
    .filter((x): x is Module => Boolean(x));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: `${m.name} — compliance management software module`,
    name: m.name,
    description: m.summary,
    provider: { "@type": "Organization", name: SITE.legalName },
    areaServed: { "@type": "Country", name: "Canada" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        eyebrow={`Software module · ${m.standardsHint}`}
        title={
          <>
            {m.name.split("&")[0].trim()}{" "}
            <span className="text-teal-700">
              {m.name.includes("&") ? `& ${m.name.split("&")[1].trim()}` : ""}
            </span>
          </>
        }
        intro={m.summary}
      >
        <Link href={m.cta.href} className="btn-primary">
          {m.cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/solutions" className="btn-outline">
          All modules
        </Link>
      </PageHeader>

      <section className="py-16 lg:py-24">
        <div className="container-page grid gap-14 lg:grid-cols-[1.4fr_0.9fr]">
          <div>
            {/* the problem */}
            <Reveal>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700">
                <Icon name={m.icon} className="h-5 w-5" />
                {m.tagline}
              </span>
              <h2 className="mt-4 font-heading text-2xl font-bold text-navy-900">The problem</h2>
              <p className="mt-4 text-slate-600">{m.problem}</p>
            </Reveal>

            {/* how the software handles it */}
            <Reveal className="mt-12">
              <h2 className="font-heading text-2xl font-bold text-navy-900">
                How the software handles it
              </h2>
            </Reveal>
            <Stagger className="mt-6 grid gap-4 sm:grid-cols-2">
              {m.howItWorks.map((f) => (
                <StaggerItem key={f}>
                  <div className="flex h-full items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-sm text-slate-700">{f}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            {/* what the auditor sees */}
            <Reveal className="mt-12">
              <h2 className="font-heading text-2xl font-bold text-navy-900">
                What the auditor sees
              </h2>
              <ul className="mt-6 space-y-3">
                {m.auditorSees.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-600" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* related clauses */}
            {m.clauses.length > 0 && (
              <Reveal className="mt-12">
                <h2 className="font-heading text-2xl font-bold text-navy-900">
                  Related standard clauses
                </h2>
                <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-soft text-xs font-bold uppercase tracking-wide text-slate-600">
                      <tr>
                        <th className="px-4 py-3">Standard</th>
                        <th className="px-4 py-3">Clause</th>
                        <th className="px-4 py-3">What it asks for</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {m.clauses.map((c) => (
                        <tr key={`${c.standard}-${c.clause}`}>
                          <td className="px-4 py-3 font-semibold text-navy-900">{c.standard}</td>
                          <td className="px-4 py-3 font-heading font-bold text-teal-700">{c.clause}</td>
                          <td className="px-4 py-3 text-slate-700">{c.label}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Reveal>
            )}

            {/* how we configure it */}
            <Reveal className="mt-12">
              <h2 className="font-heading text-2xl font-bold text-navy-900">
                How we configure it with you
              </h2>
            </Reveal>
            <div className="mt-6 space-y-4">
              {CUSTOMIZATION.map((c, idx) => (
                <Reveal key={c.n} delay={idx * 0.04}>
                  <div className="flex gap-4 card p-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-50 font-heading text-sm font-bold text-teal-700 ring-1 ring-teal-100">
                      {c.n}
                    </span>
                    <div>
                      <h3 className="font-heading font-bold text-navy-900">{c.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">{c.detail}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <Reveal>
              <div className="card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                  <Icon name={m.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-navy-900">At a glance</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-600">Module</dt>
                    <dd className="text-right font-semibold text-navy-900">{m.name}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-600">Fit</dt>
                    <dd className="font-semibold text-navy-900">Configured with you</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-slate-600">Standards</dt>
                    <dd className="text-right font-semibold text-navy-900">
                      {m.standardsHint.replace("Supports ", "")}
                    </dd>
                  </div>
                </dl>
                <Link href="/contact" className="btn-primary mt-6 w-full">
                  Talk to an expert
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="rounded-2xl border border-dashed border-teal-300 bg-teal-50/50 p-6">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-slate-700">
                  Works with any standard
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  This module links to the clauses of whatever you certify against: ISO, IATF, AS,
                  or a customer-specific or internal standard imported as a custom standard.
                </p>
                <Link
                  href="/services"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
                >
                  See standards <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="card p-6">
                <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-slate-700">
                  A person always signs off
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Every AI output in the software is a suggestion a person reviews before it
                  enters a controlled record.
                </p>
                <Link
                  href="/platform"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
                >
                  How the software is kept in check <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-soft py-16">
          <div className="container-page">
            <h2 className="font-heading text-xl font-bold text-navy-900">Related modules</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((o) => (
                <Link
                  key={o.slug}
                  href={`/solutions/${o.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow-md hover:shadow-glow-cyan"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                    <Icon name={o.icon} className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-heading text-sm font-semibold text-navy-900">{o.name}</span>
                    <span className="block text-xs text-slate-500">{o.tagline}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        title={`${m.cta.label} with a certified consultant`}
        intro="Tell us how this part of your operation runs today. You will get a clear read on what the module changes on Monday morning, and what the auditor will see."
      />
    </>
  );
}
