"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Icon } from "../Icons";

const easeOut = [0.22, 1, 0.36, 1] as const;

// One brand colour per benefit, so the three read as distinct at a glance.
const TONES = {
  teal: { bar: "bg-teal-600", tile: "bg-teal-600", label: "text-teal-700", check: "text-teal-600", link: "text-teal-700 hover:text-teal-600" },
  navy: { bar: "bg-navy-700", tile: "bg-navy-800", label: "text-navy-700", check: "text-navy-600", link: "text-navy-700 hover:text-navy-600" },
  gold: { bar: "bg-gold-600", tile: "bg-gold-600", label: "text-gold-700", check: "text-gold-600", link: "text-gold-700 hover:text-gold-800" },
} as const;

// Outcomes any organization gets, stated without figures we cannot back up.
const BENEFITS: {
  icon: string;
  tone: keyof typeof TONES;
  title: string;
  headline: string;
  points: string[];
  link?: { href: string; label: string };
}[] = [
  {
    icon: "certificate",
    tone: "teal",
    title: "Quality",
    headline: "Fewer surprises at audit time",
    points: [
      "Corrective actions close only after the fix is checked",
      "Gaps found clause by clause, before the auditor finds them",
      "One approved version of every document",
    ],
  },
  {
    icon: "loop",
    tone: "navy",
    title: "Efficiency",
    headline: "Hours back for your team every week",
    points: [
      "Evidence is captured as work happens, not rebuilt before audits",
      "Reminders and a daily summary replace chasing people",
      "AI drafts the paperwork, your team reviews and approves",
    ],
  },
  {
    icon: "dashboard",
    tone: "gold",
    title: "ROI",
    headline: "A return you can point to",
    points: [
      "Keep the customers and contracts that require certification",
      "Catch issues before they become scrap, rework or complaints",
      "Audit-ready without hiring a full-time coordinator",
    ],
    link: { href: "/roi", label: "Estimate your ROI" },
  },
];

/** Quality, efficiency and ROI: what solving the audit headaches is worth to any organization. */
export function Benefits() {
  const reduce = useReducedMotion();
  const still = { hidden: {}, show: {} };
  const shown = { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } };

  return (
    <section className="bg-soft py-16 lg:py-24">
      <div className="container-page">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <span className="label">
              <span className="h-px w-7 bg-teal-600" />
              Why teams switch
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">
              Fix the audit headaches you know by heart
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-slate-600">
            Whatever you make and whichever standard you work to, the platform pays off in
            three ways your leadership will recognize.
          </p>
        </div>

        <motion.div
          className="mt-12 grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-40px_rgba(22,43,77,0.45)] md:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={reduce ? still : { show: { transition: { staggerChildren: 0.18 } } }}
        >
          {BENEFITS.map((b, i) => {
            const tone = TONES[b.tone];
            return (
              <motion.article
                key={b.title}
                // Reduced motion still needs explicit visible values: the server render starts
                // from "hidden" before the preference is known.
                variants={reduce ? shown : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } } }}
                className={`relative flex flex-col p-7 lg:p-9 ${i > 0 ? "border-t border-slate-200 md:border-l md:border-t-0" : ""}`}
              >
                {/* Accent rule in the benefit's colour, drawn across the top as it appears. */}
                <motion.span
                  aria-hidden
                  className={`absolute left-0 top-0 h-1 ${tone.bar}`}
                  variants={{
                    hidden: { width: reduce ? "100%" : "0%" },
                    show: { width: "100%", transition: { delay: reduce ? 0 : 0.25, duration: reduce ? 0 : 0.7, ease: easeOut } },
                  }}
                />
                <span className="flex items-center gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-lg text-white ${tone.tile}`}>
                    <Icon name={b.icon} className="h-5 w-5" />
                  </span>
                  <span className={`text-sm font-bold uppercase tracking-[0.16em] ${tone.label}`}>{b.title}</span>
                </span>

                <h3 className="mt-6 font-heading text-xl font-bold leading-snug text-navy-900 lg:text-2xl">{b.headline}</h3>

                <ul className="mt-5 flex-1 divide-y divide-slate-100 border-t border-slate-100">
                  {b.points.map((point) => (
                    <li key={point} className="flex gap-3 py-3 text-[15px] leading-snug text-slate-700">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${tone.check}`} />
                      {point}
                    </li>
                  ))}
                </ul>

                {b.link && (
                  <Link href={b.link.href} className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${tone.link}`}>
                    {b.link.label} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
