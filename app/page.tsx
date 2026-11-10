import type { Metadata } from "next";
import Image from "next/image";
import { Hero } from "@/components/home/Hero";
import { Benefits } from "@/components/home/Benefits";
import { SectionHeading, CTASection } from "@/components/ui";
import { Check } from "@/components/Icons";
import { ANTHONY_MANNELLA } from "@/lib/people";

export const metadata: Metadata = {
  title: { absolute: "AI Compliance Management Software for ISO 9001 & IATF 16949" },
  description:
    "AI-powered compliance management software that unifies quality, documents, audits, training and suppliers. Stay audit-ready for ISO 9001, IATF 16949 and AS9100.",
  alternates: { canonical: "/" },
};

const AUDITOR_POINTS = [
  {
    title: "Designed around what auditors ask to see",
    detail: "Each record keeps the clause, the owner and the proof together, the way an auditor checks it.",
  },
  {
    title: "AI drafts, a person signs off",
    detail: "The AI Assistant works within your permissions, and nothing becomes a record until someone approves it.",
  },
  {
    title: "Fits the way you already work",
    detail: "Forms, fields, approvals and terms match how your business already runs.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      <Benefits />

      {/* BUILT BY ISO AUDITORS */}
      <section className="border-b border-slate-200 bg-white py-16 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <Image
                src={ANTHONY_MANNELLA.photo}
                alt={ANTHONY_MANNELLA.photoAlt}
                width={80}
                height={80}
                className="h-20 w-20 shrink-0 rounded-full object-cover object-[center_38%]"
              />
              <div>
                <p className="font-heading text-lg font-bold text-navy-900">{ANTHONY_MANNELLA.name}</p>
                <p className="text-sm text-slate-600">CEO and certified lead auditor</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-slate-600">{ANTHONY_MANNELLA.experience}</p>
            <ul className="mt-5 grid gap-2">
              {ANTHONY_MANNELLA.credentials?.map((c) => (
                <li key={c} className="flex gap-2 text-sm font-semibold text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  {c}
                </li>
              ))}
              {ANTHONY_MANNELLA.publisher && (
                <li className="flex gap-2 text-sm font-semibold text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  Writes on quality for {ANTHONY_MANNELLA.publisher.name}
                </li>
              )}
            </ul>
          </div>
          <div>
            <SectionHeading
              eyebrow="Built by ISO auditors"
              title="Made by the people who audit quality systems"
              intro="The platform was designed by certified lead auditors, so it keeps the evidence the way an auditor will ask for it."
            />
            <div className="mt-8 grid gap-4">
              {AUDITOR_POINTS.map((p) => (
                <div key={p.title} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-5">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-600 text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-bold text-navy-900">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{p.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
