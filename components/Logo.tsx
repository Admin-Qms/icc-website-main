import Image from "next/image";
import { SITE } from "@/lib/site";

type Variant = "dark" | "light";

/**
 * The brand mark. Renders the logo file when SITE.logo points at one, otherwise a
 * wordmark; "light" is for dark backgrounds (the footer).
 */
export function Logo({ variant = "dark", tagline = true }: { variant?: Variant; tagline?: boolean }) {
  const nameColor = variant === "light" ? "text-white" : "text-navy-900";
  const tagColor = variant === "light" ? "text-teal-300" : "text-teal-700";

  if (SITE.logo) {
    return (
      <Image
        src={SITE.logo}
        alt={SITE.name}
        width={220}
        height={48}
        priority
        className={`h-10 w-auto ${variant === "light" ? "brightness-0 invert" : ""}`}
      />
    );
  }

  return (
    <span className="flex items-center gap-3">
      <span
        aria-hidden
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg font-heading text-[13px] font-extrabold tracking-tight ${
          variant === "light" ? "bg-white/10 text-teal-300" : "bg-navy-900 text-teal-400"
        }`}
      >
        ICC
      </span>
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
