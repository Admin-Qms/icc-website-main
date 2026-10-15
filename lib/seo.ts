import type { Metadata } from "next";
import { SITE } from "./site";

// The root layout's title template appends " | ISO Certification Consultants"
// (32 characters). Search results show roughly 60-65 characters, so the brand is
// only appended when the whole title still fits; longer page titles stand alone.
const BRAND_SUFFIX = ` | ${SITE.name}`;
export const MAX_TITLE_LENGTH = 65;

export function pageTitle(title: string): NonNullable<Metadata["title"]> {
  return title.length + BRAND_SUFFIX.length > MAX_TITLE_LENGTH
    ? { absolute: title }
    : title;
}
