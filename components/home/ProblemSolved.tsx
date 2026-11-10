"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Icon } from "../Icons";
import { PAIN_POINTS } from "@/lib/site";

const PROBLEMS = PAIN_POINTS;

const STEP_MS = 4500;
const easeOut = [0.22, 1, 0.36, 1] as const;

export function ProblemSolved() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const item = PROBLEMS[index];

  useEffect(() => {
    if (reduce || paused) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % PROBLEMS.length), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, reduce]);

  return (
    <div
      className="relative min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-36px_rgba(22,43,77,0.55)] sm:p-7"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">Sound familiar?</p>
      <h2 className="mt-2 font-heading text-2xl font-bold leading-tight text-navy-900 sm:text-[1.7rem]">
        What changes on the platform
      </h2>

      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Common compliance problems">
        {PROBLEMS.map((p, i) => {
          const active = i === index;
          return (
            <button
              key={p.slug}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setIndex(i)}
              className={`relative flex items-center gap-1.5 overflow-hidden rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? "border-teal-600 bg-teal-50 text-teal-800"
                  : "border-slate-200 text-slate-600 hover:border-teal-300 hover:text-teal-700"
              }`}
            >
              <Icon name={p.icon} className="h-3.5 w-3.5" />
              {p.module}
              {active && !reduce && !paused && (
                <motion.span
                  key={`progress-${index}`}
                  className="absolute bottom-0 left-0 h-0.5 bg-teal-600"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="relative mt-5 min-h-[248px] sm:min-h-[228px]" role="tabpanel" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={item.slug}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: easeOut }}
          >
            <div className="rounded-xl border border-red-100 bg-red-50/60 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wide text-red-700/80">Today</p>
              {/* The pain is struck through once the fix is about to appear; works across line wraps. */}
              <motion.p
                className="mt-1 font-heading text-lg font-bold text-navy-900 decoration-2 [text-decoration-line:line-through]"
                initial={{ textDecorationColor: "rgba(248, 113, 113, 0)" }}
                animate={{ textDecorationColor: "rgba(248, 113, 113, 0.85)" }}
                transition={{ delay: reduce ? 0 : 0.9, duration: reduce ? 0 : 0.5 }}
              >
                {item.pain}
              </motion.p>
            </div>

            <motion.div
              className="my-2 flex justify-center text-teal-600"
              initial={reduce ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.3 }}
              aria-hidden
            >
              <ArrowRight className="h-5 w-5 rotate-90" />
            </motion.div>

            <motion.div
              className="rounded-xl border border-teal-200 bg-teal-50 p-4"
              initial={reduce ? false : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3, duration: 0.4, ease: easeOut }}
            >
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-teal-700">
                <Check className="h-3.5 w-3.5" />
                With the platform
              </p>
              <p className="mt-1 text-[15px] font-semibold leading-snug text-navy-900">{item.capability}</p>
              <Link href={`/solutions/${item.slug}`} className="link-arrow mt-2 text-sm">
                See {item.module.toLowerCase()} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
