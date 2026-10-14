import Image from "next/image";
import { SITE } from "@/lib/site";

type Variant = "dark" | "light";

/**
 * The brand block: the square "ICC" mark beside the company name. "light" is for
 * dark backgrounds (the footer). The mark is transparent, so it works on both.
 */
export function Logo({ variant = "dark", tagline = true, singleLine = false }: { variant?: Variant; tagline?: boolean; singleLine?: boolean }) {
  const nameColor = variant === "light" ? "text-white" : "text-navy-900";
  const tagColor = variant === "light" ? "text-teal-300" : "text-teal-700";

  return (
    <span className={`flex items-center ${singleLine ? 'gap-2 sm:gap-3' : 'gap-3'}`}>
      <Image
        src={SITE.logoMark}
        alt=""
        aria-hidden
        width={48}
        height={48}
        priority
        className={singleLine ? "h-8 w-8 shrink-0 sm:h-12 sm:w-12" : "h-12 w-12 shrink-0"}
      />
      <span className="flex flex-col leading-tight">
        <span className={`font-heading font-bold ${singleLine ? 'whitespace-nowrap text-xs min-[375px]:text-sm sm:text-base' : 'text-[16px]'} ${nameColor}`}>{SITE.name}</span>
        {tagline && (
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${tagColor}`}>
            ISO Management Systems · Canada
          </span>
        )}
      </span>
    </span>
  );
}
