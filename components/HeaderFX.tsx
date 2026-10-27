"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Icon } from "./Icons";

const easeOut = [0.22, 1, 0.36, 1] as const;

/**
 * Word-by-word animated page title with a drawn underline beneath the accent phrase.
 * Pass the full headline as `text`; the substring `accent` is rendered teal + underlined.
 */
export function AnimatedTitle({ text, accent }: { text: string; accent: string }) {
  const idx = text.indexOf(accent);
  const before = idx >= 0 ? text.slice(0, idx).trim() : text;
  const after = idx >= 0 ? text.slice(idx + accent.length).trim() : "";
  const parts: { word: string; accent: boolean }[] = [
    ...before.split(/\s+/).filter(Boolean).map((w) => ({ word: w, accent: false })),
    ...(idx >= 0 ? accent.split(/\s+/).filter(Boolean).map((w) => ({ word: w, accent: true })) : []),
    ...after.split(/\s+/).filter(Boolean).map((w) => ({ word: w, accent: false })),
  ];
  const accentWords = parts.filter((p) => p.accent).length;
  let accentSeen = 0;

  return (
    <motion.span
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
      className="inline"
    >
      {parts.map((p, i) => {
        const isLastAccent = p.accent && ++accentSeen === accentWords;
        return (
          <motion.span
            key={`${p.word}-${i}`}
            variants={{
              hidden: { opacity: 0, y: 22 },
              show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
            }}
            className={`relative inline-block ${p.accent ? "text-teal-700" : ""}`}
          >
            {p.word}
            {isLastAccent && (
              <motion.svg
                className="absolute -bottom-2 right-0 w-[220%] max-w-[280px]"
                height="10"
                viewBox="0 0 200 10"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden
              >
                <motion.path
                  d="M2 7 Q 50 2 100 6 T 198 5"
                  stroke="#D97706"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: easeOut, delay: 0.15 * i + 0.5 }}
                />
              </motion.svg>
            )}
            {i < parts.length - 1 && <span>&nbsp;</span>}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

/**
 * Floating field of module/process icons for page-header banners.
 * Sits on the right side of the banner, behind content. Desktop only.
 */
export function HeaderIconsFX({ icons }: { icons: string[] }) {
  const reduce = useReducedMotion();
  // Up to 6 icons sit evenly on the dashed ring, starting at the top. The cluster lives
  // below the fixed navbar (top-32 / lg:top-40 match PageHeader's top padding), so no
  // icon slides under the menu.
  const shown = icons.slice(0, 6);
  const RADIUS = 128; // half of the 256px ring
  const SIZES = [52, 46, 48, 44, 50, 42];
  const DURS = [7, 9, 8, 10, 7.5, 9.5];
  return (
    <div className="pointer-events-none absolute bottom-0 right-0 top-32 hidden w-1/2 lg:top-40 lg:block" aria-hidden>
      <div className="absolute right-[8%] top-1/2 h-64 w-64 -translate-y-1/2">
        {/* slow rotating dashed ring anchoring the cluster */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed border-teal-200/70"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        {shown.map((name, i) => {
          const angle = (i / shown.length) * 2 * Math.PI - Math.PI / 2;
          const size = SIZES[i];
          const p = {
            left: RADIUS + RADIUS * Math.cos(angle) - size / 2,
            top: RADIUS + RADIUS * Math.sin(angle) - size / 2,
            size,
            dur: DURS[i],
          };
          return (
            <motion.span
              key={name}
              className="absolute grid place-items-center rounded-2xl border border-slate-200 bg-white text-teal-700 shadow-[0_12px_30px_-12px_rgba(22,43,77,0.35)]"
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              initial={{ opacity: 0, scale: 0.6, y: 14 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: reduce ? 0 : [0, -9, 0],
              }}
              transition={{
                opacity: { duration: 0.5, delay: 0.3 + i * 0.1 },
                scale: { duration: 0.5, delay: 0.3 + i * 0.1, ease: easeOut },
                y: { duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 },
              }}
            >
              <Icon name={name} style={{ width: p.size * 0.45, height: p.size * 0.45 }} />
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
