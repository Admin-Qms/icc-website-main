// Blog content — reads content/blog/*.md at build time.
// Posts are written by the team/ content pipeline; the frontmatter contract
// here mirrors team/agents/shared/contentStore.js.

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  source?: string;
  sourceId?: string;
  credit?: string;
  creditUrl?: string;
};

export type Post = {
  slug: string;
  title: string;
  description: string;
  /** Publication day, YYYY-MM-DD (America/Toronto). */
  date: string;
  /** Last substantive edit, YYYY-MM-DD. */
  updated?: string;
  author: string;
  category: string;
  primaryKeyword?: string;
  keywords: string[];
  /** Minutes, from word count at 200 wpm. */
  readTime: number;
  wordCount: number;
  image: PostImage;
  body: string;
};

export type Heading = { depth: 2 | 3; text: string; id: string };

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function toDay(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  return undefined;
}

// A malformed post should fail the build, not ship a broken page.
function readPost(file: string): Post {
  const fail = (msg: string): never => {
    throw new Error(`content/blog/${file}: ${msg}`);
  };
  const { data, content } = matter(fs.readFileSync(path.join(BLOG_DIR, file), "utf8"));
  const slug = file.replace(/\.md$/, "");

  for (const key of ["title", "slug", "description", "author", "category"]) {
    if (typeof data[key] !== "string" || !data[key].trim()) fail(`missing "${key}"`);
  }
  if (data.slug !== slug) fail(`slug "${data.slug}" does not match the filename`);

  const date = toDay(data.date) ?? fail(`"date" must be YYYY-MM-DD`);
  const image = data.image;
  if (!image || typeof image.src !== "string" || !image.src.startsWith("/")) {
    fail(`missing "image.src"`);
  }
  const body = content.trim();
  if (!body) fail("empty body");

  return {
    slug,
    title: data.title,
    description: data.description,
    date,
    updated: toDay(data.updated),
    author: data.author,
    category: data.category,
    primaryKeyword: typeof data.primaryKeyword === "string" ? data.primaryKeyword : undefined,
    keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
    readTime: Number(data.readTime) || Math.max(1, Math.ceil(body.split(/\s+/).length / 200)),
    wordCount: Number(data.wordCount) || body.split(/\s+/).length,
    image: {
      src: image.src,
      alt: typeof image.alt === "string" ? image.alt : data.title,
      width: Number(image.width) || 1200,
      height: Number(image.height) || 675,
      source: image.source,
      sourceId: image.sourceId != null ? String(image.sourceId) : undefined,
      credit: image.credit,
      creditUrl: image.creditUrl,
    },
    body,
  };
}

let cache: Post[] | null = null;

/** All posts, newest first. */
export function getAllPosts(): Post[] {
  if (cache) return cache;
  const files = fs.existsSync(BLOG_DIR)
    ? fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"))
    : [];
  const posts = files
    .map(readPost)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  // Dev server should pick up newly published posts without a restart.
  if (process.env.NODE_ENV === "production") cache = posts;
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/** Same category first, then most recent. */
export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const others = getAllPosts().filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, limit);
}

export function formatDate(day: string): string {
  return new Date(`${day}T12:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** JSON-LD for an inline <script>; "<" is escaped so content can't close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Strip inline Markdown so heading text matches what is rendered. */
function plainText(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

export function headingSlug(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

/** Issues unique ids in document order; shared by the TOC and the renderer. */
export function createHeadingIds(): (text: string) => string {
  const seen = new Map<string, number>();
  return (text) => {
    const base = headingSlug(text);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n + 1}`;
  };
}

/** h2/h3 headings in document order, with the ids the renderer will assign. */
export function getHeadings(body: string): Heading[] {
  const nextId = createHeadingIds();
  const headings: Heading[] = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    if (/^```/.test(line)) inFence = !inFence;
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (!m) continue;
    const text = plainText(m[2]);
    headings.push({ depth: m[1].length as 2 | 3, text, id: nextId(text) });
  }
  return headings;
}
