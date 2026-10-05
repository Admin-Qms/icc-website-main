import { ChevronDown } from "./Icons";
import { Markdown } from "./Markdown";
import type { FaqItem } from "@/lib/blog";

/**
 * The article's FAQ section as collapsible questions. Native <details> needs no
 * JavaScript, works in the static export, and still opens for find-in-page.
 */
export function FaqAccordion({
  heading,
  intro,
  items,
}: {
  heading: { text: string; id: string };
  intro?: string;
  items: FaqItem[];
}) {
  if (!items.length) return null;
  return (
    <section aria-labelledby={heading.id}>
      <h2
        id={heading.id}
        className="mt-12 scroll-mt-28 font-heading text-2xl font-bold leading-snug text-navy-900 sm:text-[1.7rem]"
      >
        {heading.text}
      </h2>
      {intro && (
        <div className="mt-5">
          <Markdown>{intro}</Markdown>
        </div>
      )}
      <div className="mt-6 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200">
        {items.map((item) => (
          <details key={item.question} className="group bg-white open:bg-slate-50/60">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-heading text-[17px] font-bold leading-snug text-navy-900 transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <ChevronDown className="h-5 w-5 shrink-0 text-teal-700 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5 [&_p]:mt-3 [&_p:first-child]:mt-0">
              <Markdown>{item.answer}</Markdown>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
