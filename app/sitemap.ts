import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { STANDARDS, INDUSTRIES, MODULES, SITE } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";
import { getAllGuides } from "@/lib/guides";

// Fixed pages are found by scanning app/ for page.tsx at build time, so a new page
// is listed without editing this file. Dynamic segments ([slug]) are listed below
// from their data; "moved" pages that render a RedirectStub are left out; /blog and
// /guides are added with their posts and guides.
const PRIORITY: Record<string, number> = {
  "": 1.0,
  "/custom-solutions": 0.95,
  "/solutions": 0.95,
  "/roi": 0.9,
  "/services": 0.9,
  "/industries": 0.9,
  "/platform": 0.9,
  "/process": 0.8,
  "/assessment": 0.8,
  "/about": 0.7,
  "/contact": 0.7,
};
const LISTED_ELSEWHERE = new Set(["/blog", "/guides"]);

function findStaticPages(dir = path.join(process.cwd(), "app"), route = ""): string[] {
  const found: string[] = [];
  const page = path.join(dir, "page.tsx");
  if (existsSync(page) && !readFileSync(page, "utf8").includes("RedirectStub")) found.push(route);
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || /^[[(_.]/.test(entry.name)) continue;
    found.push(...findStaticPages(path.join(dir, entry.name), `${route}/${entry.name}`));
  }
  return found;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date("2026-10-15");

  const staticRoutes = findStaticPages()
    .filter((p) => !LISTED_ELSEWHERE.has(p))
    .map((p) => ({ path: p, priority: PRIORITY[p] ?? 0.7 }))
    .sort((x, y) => y.priority - x.priority || x.path.localeCompare(y.path))
    .map((r) => ({
      url: `${base}${r.path}/`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: r.priority,
    }));

  const moduleRoutes = MODULES.map((m) => ({
    url: `${base}/solutions/${m.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const serviceRoutes = STANDARDS.map((s) => ({
    url: `${base}/services/${s.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const industryRoutes = INDUSTRIES.map((i) => ({
    url: `${base}/industries/${i.slug}/`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const posts = getAllPosts();
  const day = (d: string) => new Date(`${d}T12:00:00Z`);

  const blogRoutes = [
    {
      url: `${base}/blog/`,
      lastModified: posts.length ? day(posts[0].date) : now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}/`,
      lastModified: day(p.updated ?? p.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  const guides = getAllGuides();
  const guideRoutes = [
    { url: `${base}/guides/`, lastModified: guides.length ? day(guides[0].manifest.updated || guides[0].manifest.date) : now, changeFrequency: "weekly" as const, priority: 0.8 },
    ...guides.flatMap(g => [
      { url: `${base}/guides/${g.manifest.slug}/`, lastModified: day(g.manifest.updated || g.manifest.date), changeFrequency: "monthly" as const, priority: 0.8 },
      ...g.chapters.map(c => ({ url: `${base}/guides/${g.manifest.slug}/${c.slug}/`, lastModified: day(c.updated || c.date), changeFrequency: "monthly" as const, priority: 0.7 })),
    ]),
  ];
  return [...staticRoutes, ...moduleRoutes, ...serviceRoutes, ...industryRoutes, ...blogRoutes, ...guideRoutes];
}
