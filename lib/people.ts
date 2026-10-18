// People shown on the site, with their published work elsewhere. Only state what can be
// checked: titles as published, articles that carry the person's byline. Add
// credentials (certifications, years of experience) only once the person confirms them.

import { SITE } from "./site";

export type Publication = {
  title: string;
  url: string;
  // Publication date as YYYY-MM-DD.
  date: string;
  // One-sentence summary in the site's own words.
  summary: string;
  // Site pages where the article is offered as further reading.
  featuredOn: string[];
};

export type Person = {
  slug: string;
  name: string;
  jobTitle: string;
  photo: string;
  photoAlt: string;
  // Profiles that identify the same person elsewhere (used as sameAs).
  profiles: string[];
  // Topics the person writes and advises on.
  topics: string[];
  publisher?: { name: string; url: string };
  publications: Publication[];
};

export const ANTHONY_MANNELLA: Person = {
  slug: "anthony-mannella",
  name: "Anthony Mannella",
  // As published on his Canadian Metalworking author profile ("CEO/Consultant").
  jobTitle: "CEO and Consultant",
  photo: "/images/anthony-consultant.jpg",
  photoAlt:
    "Anthony Mannella, CEO and consultant at ISO Certification Consultants Inc.",
  profiles: ["https://www.canadianmetalworking.com/author/anthony-mannella"],
  topics: [
    "ISO 9001 certification",
    "Metrology and calibration",
    "Measurement system analysis",
    "Lean manufacturing",
    "Supplier and outsourced process control",
    "Quality management systems",
  ],
  publisher: {
    name: "Canadian Metalworking",
    url: "https://www.canadianmetalworking.com/",
  },
  // Newest first. Bylines confirmed on canadianmetalworking.com on 2026-10-15.
  publications: [
    {
      title: "Strong processes build strong quality systems",
      url: "https://www.canadianmetalworking.com/canadianmetalworking/blog/management/strong-processes-build-strong-quality-systems",
      date: "2026-08-24",
      summary:
        "How defined processes, controls and documentation let a quality system meet customer requirements consistently.",
      featuredOn: ["/services/iso-9001/", "/solutions/processes/", "/industries/manufacturing/"],
    },
    {
      title: "Supplied products and services must meet your end requirements",
      url: "https://www.canadianmetalworking.com/canadianmetalworking/blog/management/supplied-products-and-services-must-meet-your-end-requirements",
      date: "2026-04-24",
      summary:
        "Identifying, controlling and monitoring suppliers and outsourced work under clause 8.4 of ISO 9001:2015.",
      featuredOn: ["/solutions/supplier-quality/", "/services/iatf-16949/", "/industries/automotive/"],
    },
    {
      title: "Lean manufacturing and ISO 9001",
      url: "https://www.canadianmetalworking.com/canadianmetalworking/blog/management/lean-manufacturing-and-iso-9001",
      date: "2026-03-27",
      summary:
        "Where 5S, error proofing and continuous improvement support an ISO 9001 management system.",
      featuredOn: ["/services/iso-9001/", "/industries/manufacturing/"],
    },
    {
      title: "A primer on metrology: Part II",
      url: "https://www.canadianmetalworking.com/canadianmetalworking/article/measurement/a-primer-on-metrology-part-ii",
      date: "2026-01-21",
      summary:
        "Measurement system analysis in more depth, including calibration frequency and traceability.",
      featuredOn: ["/services/iso-17025/", "/solutions/calibration-maintenance/"],
    },
    {
      title: "A primer on metrology: Part I",
      url: "https://www.canadianmetalworking.com/canadianmetalworking/blog/measurement/a-primer-on-metrology-part-i",
      date: "2025-12-31",
      summary:
        "Why calibration and measurement system analysis matter to product quality on the shop floor.",
      featuredOn: ["/services/iso-17025/", "/solutions/calibration-maintenance/"],
    },
    {
      title: "Why become ISO 9001 certified?",
      url: "https://www.canadianmetalworking.com/canadianmetalworking/article/management/why-become-iso-9001-certified",
      date: "2025-10-24",
      summary:
        "The business case for ISO 9001 certification for Canadian manufacturers.",
      featuredOn: ["/services/iso-9001/"],
    },
  ],
};

export const PEOPLE: Person[] = [ANTHONY_MANNELLA];

export const personPath = (p: Person) => `/about/${p.slug}/`;
export const personId = (p: Person) => `${SITE.url}${personPath(p)}#person`;

/** schema.org Person for structured data, tied to the company. */
export function personJsonLd(p: Person) {
  return {
    "@type": "Person",
    "@id": personId(p),
    name: p.name,
    jobTitle: p.jobTitle,
    url: `${SITE.url}${personPath(p)}`,
    image: `${SITE.url}${p.photo}`,
    worksFor: { "@type": "Organization", name: SITE.legalName, url: SITE.url },
    knowsAbout: p.topics,
    sameAs: p.profiles,
  };
}

export const formatDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

/** Published articles to offer as further reading on a site page (path with slashes). */
export function publicationsFor(path: string) {
  return PEOPLE.flatMap((person) =>
    person.publications.filter((p) => p.featuredOn.includes(path)).map((p) => ({ person, publication: p })),
  );
}
