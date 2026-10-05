import { SITE } from "@/lib/site";

// BBB's embed code, as issued for the business profile: the seal must stay unmodified and
// link to the profile, so it is a plain <img> from BBB's seal host rather than next/image.
const SEALS = {
  wide: { file: "blue-seal-280-80-bbb", width: 280, height: 80 },
  compact: { file: "blue-seal-293-61-bbb", width: 293, height: 61 },
} as const;

export function BbbSeal({ size = "wide", className = "" }: { size?: keyof typeof SEALS; className?: string }) {
  const seal = SEALS[size];
  return (
    <a
      href={SITE.bbb.profileUrl}
      target="_blank"
      rel="nofollow noopener noreferrer"
      className={`inline-block ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://seal-mwco.bbb.org/seals/${seal.file}-${SITE.bbb.businessId}.png`}
        alt={`${SITE.legalName} BBB Business Review`}
        width={seal.width}
        height={seal.height}
        loading="lazy"
        style={{ border: 0 }}
      />
    </a>
  );
}
