import { STANDARDS, INDUSTRIES, MODULES, SITE } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { getAllGuides } from "@/lib/guides";

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
    "ISO Certification Consultants help manufacturing and service companies prepare for and pass ISO and sector certification audits: gap analysis, management system build, internal audits and support through the certification body's Stage 1 and Stage 2 audits. Engagements pair a certified lead consultant with compliance management software that tracks every clause, document, audit and corrective action.",
    "",
    `- Contact: ${SITE.email}, ${SITE.phone}`,
    `- Free readiness check: ${url("/assessment/")}`,
    `- Certification process: ${url("/process/")}`,
    "",
    "## Certification consulting by standard",
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
    "## Compliance management software",
    "",
    `- [Platform overview](${url("/platform/")})`,
    ...MODULES.map(
      (m) => `- [${m.name}](${url(`/solutions/${m.slug}/`)}): ${m.tagline}`,
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
    `- [Contact](${url("/contact/")})`,
    `- [Better Business Bureau profile](${SITE.bbb.profileUrl})`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
