import { STANDARDS, INDUSTRIES, MODULES, SITE, ADDRESS_LINE } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { getAllGuides } from "@/lib/guides";
import { PEOPLE, personPath } from "@/lib/people";

// /llms.txt (llmstxt.org): a plain Markdown overview of the company and its key
// pages for AI assistants and answer engines. Built at export time like sitemap.xml,
// so new posts and guides are listed without editing this file.
export const dynamic = "force-static";

export function GET() {
  const url = (path: string) => `${SITE.url}${path}`;
  const posts = getAllPosts();
  const guides = getAllGuides();

  const lines = [
    `# ${SITE.legalName}`,
    "",
    `> ${SITE.tagline}. Based in ${SITE.region}, serving companies across Canada.`,
    "",
    "ISO Certification Consultants provides AI-powered compliance management software for quality and compliance teams in manufacturing and service companies. The platform connects standards clauses, controlled documents, processes, audits, corrective actions, training, suppliers and equipment in one system, so a team can see where it stands before an auditor does. AI features draft and suggest, and a person reviews and approves; gap assessments and audits are carried out by people. Certified consultants are available when a company wants help with gap analysis, building the management system, internal audits and preparing for the certification body's Stage 1 and Stage 2 audits. ISO Certification Consultants is a consultancy and software provider, not a certification body or registrar.",
    "",
    `- Book a demo: ${url("/contact/")}`,
    `- Platform overview: ${url("/platform/")}`,
    `- Contact: ${SITE.email}, ${SITE.phone}`,
    `- Office: ${ADDRESS_LINE}`,
    `- Free readiness check: ${url("/assessment/")}`,
    `- Certification process: ${url("/process/")}`,
    "",
    "## Compliance management software by module",
    "",
    ...MODULES.map(
      (m) =>
        `- [${m.name}](${url(`/solutions/${m.slug}/`)}): ${m.seoTitle}. ${m.tagline}`,
    ),
    "",
    "## By standard",
    "",
    ...STANDARDS.map(
      (s) =>
        `- [${s.code} — ${s.name}](${url(`/services/${s.slug}/`)}): ${s.summary}`,
    ),
    "",
    "## Industries",
    "",
    ...INDUSTRIES.map(
      (i) => `- [${i.name}](${url(`/industries/${i.slug}/`)}): ${i.blurb}`,
    ),
    "",
  ];

  if (guides.length) {
    lines.push(
      "## Guides",
      "",
      ...guides.map(
        (g) =>
          `- [${g.manifest.title}](${url(`/guides/${g.manifest.slug}/`)}): ${g.manifest.description}`,
      ),
      "",
    );
  }

  lines.push(
    "## Articles",
    "",
    ...posts.map(
      (p) => `- [${p.title}](${url(`/blog/${p.slug}/`)}): ${p.description}`,
    ),
    "",
    "## Company",
    "",
    `- [About](${url("/about/")})`,
    ...PEOPLE.flatMap((person) => [
      `- [${person.name}, ${person.jobTitle}](${url(personPath(person))})`,
      ...person.publications.map(
        (pub) =>
          `  - ${person.publisher?.name ?? "Article"}: [${pub.title}](${pub.url}) (${pub.date})`,
      ),
    ]),
    `- [Contact](${url("/contact/")})`,
    `- [Better Business Bureau profile](${SITE.bbb.profileUrl})`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
