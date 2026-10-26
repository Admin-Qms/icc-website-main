import type { Industry, Standard } from "./site.ts";

// Certification and consultant terms come first; the software follows. Both
// templates are held to 120-160 characters by tests/positioning-copy.test.mjs.
export function standardMetaDescription(s: Pick<Standard, "code">): string {
  return `${s.code} certification support for Canadian companies: consultants for gap analysis and audits, plus compliance management software.`;
}

export function industryMetaDescription(i: Pick<Industry, "name">): string {
  return `ISO certification for ${i.name} in Canada: consultants for gap analysis and audits, plus compliance management software for your records.`;
}
