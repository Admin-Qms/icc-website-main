"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Icon } from "../Icons";
import { MODULES } from "@/lib/site";
import { ProblemSolved } from "./ProblemSolved";

const easeOut = [0.22, 1, 0.36, 1] as const;
const INDUSTRY_WORDS = ["automotive", "aerospace", "medical device", "food and beverage", "manufacturing"];

export function Hero() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-blueprint pt-28 lg:pt-36">
      <HeroBackground reduce={!!reduce} />

      <div className="container-page relative pb-16 lg:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left — message. Rendered without a fade-in: this text is the largest
              paint on phones, so hiding it until scripts load delayed LCP. */}
          <div>
            <IndustryTagline reduce={!!reduce} />

            <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.07] text-navy-900 sm:text-5xl lg:text-[3.4rem]">
              <AnimatedHeadline />
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Documents, corrective actions, audits, training and suppliers in
              one place. AI drafts the paperwork, your team approves it, and
              you are ready for an audit any day of the year.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/contact" className="btn-primary group">
                Book a call
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
              {[
                "Ready for an audit any day",
                "Less paperwork for your team",
                "You approve everything AI prepares",
              ].map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <Check className="h-4 w-4 text-teal-600" />
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Right — the problems buyers recognise, and what the platform changes. */}
          <ProblemSolved />
        </div>
      </div>

      {/* Modules strip: everything the platform covers, one click from here. */}
      <div className="relative border-t border-slate-200 bg-white/80 backdrop-blur">
        <div className="container-page py-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-5 text-center text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
          >
            Everything your quality system needs, in one platform
          </motion.p>
          <motion.ul
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {MODULES.map((m) => (
              <motion.li
                key={m.slug}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  show: { opacity: 1, y: 0 },
                }}
              >
                <Link
                  href={`/solutions/${m.slug}`}
                  className="group flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-navy-800 shadow-sm transition-colors hover:border-teal-300 hover:text-teal-700"
                >
                  <span className="grid h-6 w-6 place-items-center rounded bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                    <Icon name={m.icon} className="h-4 w-4" />
                  </span>
                  {m.name}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

/* ---- eyebrow: a tagline with the industry word rotating ---- */
function IndustryTagline({ reduce }: { reduce: boolean }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => setI((n) => (n + 1) % INDUSTRY_WORDS.length), 2400);
    return () => window.clearInterval(timer);
  }, [reduce]);

  return (
    <p className="inline-flex flex-wrap items-center gap-x-1.5 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-teal-700">
      <span className="relative mr-1 flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-600" />
      </span>
      Less paperwork for
      <span className="relative inline-flex overflow-hidden text-navy-900">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={INDUSTRY_WORDS[i]}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: easeOut }}
            className="inline-block"
          >
            {INDUSTRY_WORDS[i]}
          </motion.span>
        </AnimatePresence>
      </span>
      quality teams
    </p>
  );
}

/* ---- headline with a highlighted, underline-drawing accent ---- */
function AnimatedHeadline() {
  return (
    <span className="inline">
      <span className="block">
        The compliance platform
        {/* The lines are block spans; the trailing space keeps the words apart in
            the page text that crawlers and screen readers read. */}{" "}
      </span>
      <span className="relative inline-block text-teal-700">
        built by ISO auditors
        <motion.svg
          className="absolute -bottom-1.5 left-0 w-full"
          height="10"
          viewBox="0 0 200 10"
          preserveAspectRatio="none"
          fill="none"
        >
          <motion.path
            d="M2 7 Q 50 2 100 6 T 198 5"
            stroke="#D97706"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: easeOut, delay: 0.9 }}
          />
        </motion.svg>
      </span>
    </span>
  );
}

/* ---- layered animated background (subtle, industrial, professional) ---- */
function HeroBackground({ reduce }: { reduce: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-teal-50/70 to-transparent" />
      <motion.div
        className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl"
        animate={reduce ? undefined : { x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-32 h-80 w-80 rounded-full bg-gold-200/25 blur-3xl"
        animate={reduce ? undefined : { x: [0, -30, 0], y: [0, 24, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
