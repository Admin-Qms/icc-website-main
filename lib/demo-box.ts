import { STANDARDS } from "./site.ts";

export const DEMO_BOX_IMAGE: { src: string; alt: string } | null = null;

const GENERIC_HEADING = "Meeting your compliance requirements?";

export function demoBoxHeading(category?: string): string {
  const wanted = (category ?? "").trim().toLowerCase();
  if (wanted) {
    const match = STANDARDS.find((s) => s.code.toLowerCase() === wanted);
    if (match) return `Meeting ${match.code}?`;
  }
  return GENERIC_HEADING;
}
