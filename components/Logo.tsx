import Image from "next/image";
import { SITE } from "@/lib/site";

type Variant = "dark" | "light";

/**
 * The brand block: the square "ICC" mark beside the company name. "light" is for
 * dark backgrounds (the footer). The mark is transparent, so it works on both.
 */
export function Logo({ variant = "dark", tagline = true }: { variant?: Variant; tagline?: boolean }) {
  const nameColor = variant === "light" ? "text-white" : "text-navy-900";
  const tagColor = variant === "light" ? "text-teal-300" : "text-teal-700";

  return (
    <span className="flex items-center gap-3">
      <Image
        src={SITE.logoMark}
        alt=""
        aria-hidden
        width={48}
        height={48}
        priority
        className="h-12 w-12 shrink-0"
      />
      <span className="flex flex-col leading-tight">
        <span className={`font-heading text-[16px] font-bold ${nameColor}`}>{SITE.name}</span>
        {tagline && (
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${tagColor}`}>
            ISO Management Systems · Canada
          </span>
        )}
      </span>
    </span>
  );
}
