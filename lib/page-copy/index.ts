import type { PageCopy } from "./types";
import { getAllPosts, type Post } from "@/lib/blog";

import iso9001 from "./services/iso-9001";
import iatf16949 from "./services/iatf-16949";
import as9100 from "./services/as9100";
import iso13485 from "./services/iso-13485";
import iso14001 from "./services/iso-14001";
import iso45001 from "./services/iso-45001";
import iso27001 from "./services/iso-27001";
import iso22000 from "./services/iso-22000";
import iso22301 from "./services/iso-22301";
import iso17025 from "./services/iso-17025";

import manufacturing from "./industries/manufacturing";
import automotive from "./industries/automotive";
import aerospaceDefence from "./industries/aerospace-defence";
import healthcareMedicalDevices from "./industries/healthcare-medical-devices";
import foodBeverage from "./industries/food-beverage";
import oilGasEnergy from "./industries/oil-gas-energy";
import construction from "./industries/construction";
import miningNaturalResources from "./industries/mining-natural-resources";

export type { PageCopy, CopySection, PageFaq } from "./types";

const bySlug = (list: PageCopy[]) =>
  Object.fromEntries(list.map((c) => [c.slug, c]));

const SERVICE_COPY: Record<string, PageCopy> = bySlug([
  iso9001,
  iatf16949,
  as9100,
  iso13485,
  iso14001,
  iso45001,
  iso27001,
  iso22000,
  iso22301,
  iso17025,
]);

const INDUSTRY_COPY: Record<string, PageCopy> = bySlug([
  manufacturing,
  automotive,
  aerospaceDefence,
  healthcareMedicalDevices,
  foodBeverage,
  oilGasEnergy,
  construction,
  miningNaturalResources,
]);

export function getServiceCopy(slug: string): PageCopy | undefined {
  return SERVICE_COPY[slug];
}

export function getIndustryCopy(slug: string): PageCopy | undefined {
  return INDUSTRY_COPY[slug];
}

/** Newest posts that mention any of the given terms (e.g. "ISO 9001") in the title or keywords. */
export function getPostsAbout(terms: string[], limit = 3): Post[] {
  const needles = terms.map((t) => t.toLowerCase());
  return getAllPosts()
    .filter((p) => {
      const hay = [p.title, p.primaryKeyword ?? "", ...p.keywords]
        .join(" ")
        .toLowerCase();
      return needles.some((n) => hay.includes(n));
    })
    .slice(0, limit);
}
