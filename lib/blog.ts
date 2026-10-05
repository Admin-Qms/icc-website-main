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

// ── FAQ section ───────────────────────────────────────────────────────────────

export type FaqItem = { question: string; answer: string };

export type FaqSplit = {
  /** The body before the FAQ section. */
  main: string;
  /** Any sections after the FAQ (some article types close with a short `##` section). */
  after: string;
  /** Heading text and id of the FAQ section, matching getHeadings(); null when there is none. */
  heading: { text: string; id: string } | null;
  /** Markdown between the FAQ heading and the first question, usually empty. */
  intro: string;
  items: FaqItem[];
  /** The closing paragraph(s) after the last answer — the call to action linking /contact — when the FAQ ends the article. */
  outro: string;
};

const FAQ_HEADING_RE = /^##\s+(frequently asked questions|faqs?)\s*#*$/i;
const CONTACT_LINK_RE = /\]\(\/contact\/?[)#?]/;

function paragraphs(md: string): string[] {
  return md
    .split(/\n[ \t]*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Pulls the "## Frequently Asked Questions" section (each `### question` and its
 * answer) out of a body so the page can render it as an accordion. The writing
 * rules put the closing paragraph, with its /contact link, after the last answer;
 * it is returned separately as `outro` so it stays outside the accordion.
 */
export function splitFaq(body: string): FaqSplit {
  const none: FaqSplit = { main: body, after: "", heading: null, intro: "", items: [], outro: "" };
  const lines = body.split("\n");

  let start = -1;
  let end = lines.length;
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^```/.test(lines[i])) inFence = !inFence;
    if (inFence) continue;
    if (start === -1) {
      if (FAQ_HEADING_RE.test(lines[i])) start = i;
    } else if (/^##\s/.test(lines[i])) {
      end = i;
      break;
    }
  }
  if (start === -1) return none;

  const intro: string[] = [];
  const items: { question: string; answer: string[] }[] = [];
  for (const line of lines.slice(start + 1, end)) {
    const m = /^###\s+(.+?)\s*#*$/.exec(line);
    if (m) items.push({ question: plainText(m[1]), answer: [] });
    else if (items.length) items[items.length - 1].answer.push(line);
    else intro.push(line);
  }
  if (!items.length) return none;

  let outro = "";
  const last = items[items.length - 1];
  if (end === lines.length) {
    const paras = paragraphs(last.answer.join("\n"));
    const cta = paras.findIndex((p) => CONTACT_LINK_RE.test(p));
    if (cta > 0) {
      outro = paras.slice(cta).join("\n\n");
      last.answer = [paras.slice(0, cta).join("\n\n")];
    }
  }

  const heading = getHeadings(body).find((h) => h.depth === 2 && FAQ_HEADING_RE.test(`## ${h.text}`)) ?? null;
  return {
    main: lines.slice(0, start).join("\n").trimEnd(),
    after: lines.slice(end).join("\n").trim(),
    heading: heading ? { text: heading.text, id: heading.id } : { text: "Frequently Asked Questions", id: "frequently-asked-questions" },
    intro: intro.join("\n").trim(),
    items: items.map((i) => ({ question: i.question, answer: i.answer.join("\n").trim() })),
    outro,
  };
}

/** FAQ answers as plain text for the FAQPage structured data. */
export function faqPlainText(md: string): string {
  return plainText(
    md
      .replace(/^>\s?/gm, "")
      .replace(/^\s*[-*]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ""),
  ).replace(/\s*\n\s*/g, " ");
}
