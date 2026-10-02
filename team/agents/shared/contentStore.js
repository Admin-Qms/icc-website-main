// Blog content store — posts are Markdown files in the site repo
// (content/blog/<slug>.md, images in public/images/blog/<slug>/).
// The frontmatter contract here mirrors lib/blog.ts on the site side.
// The posts are also the pipeline's memory: what was published, which
// keywords, links and images were used are all read back from these files.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const matter = require("gray-matter");
const { CONTENT_DIR, BLOG_IMAGE_DIR, MEMORY_DIR, REPORTS_DIR, SITE_URL, BLOG_TIMEZONE } = require("./config");

const IMAGE_WIDTH = 1200;
const IMAGE_HEIGHT = 675;
const IMAGE_URL_BASE = "/images/blog";

function ensureDirs() {
  for (const dir of [
    CONTENT_DIR,
    BLOG_IMAGE_DIR,
    MEMORY_DIR,
    path.join(REPORTS_DIR, "daily"),
    path.join(REPORTS_DIR, "content"),
  ]) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ── Text helpers ─────────────────────────────────────────────────

/** The one slug rule for the whole pipeline: lowercase, hyphens, max 80 chars. */
function slugify(text) {
  const slug = String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug.length <= 80) return slug;
  const cut = slug.slice(0, 80);
  const lastHyphen = cut.lastIndexOf("-");
  return (lastHyphen > 40 ? cut.slice(0, lastHyphen) : cut).replace(/-+$/g, "");
}

/** Today's date (YYYY-MM-DD) where the business is, not in UTC. */
function todayLocal(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BLOG_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** Markdown to the words a reader sees: no URLs, image lines or syntax. */
function toPlainText(markdown) {
  return String(markdown || "")
    .replace(/^!\[[^\]]*\]\([^)]*\)\s*$/gm, " ")
    .replace(/^\[(?:IMAGE|SANITY_IMAGE):[^\]]*\]\s*$/gm, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
    .replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, " ")
    .replace(/[*_`|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(markdown) {
  const text = toPlainText(markdown);
  return text ? text.split(" ").length : 0;
}

function readTimeMinutes(wordCount) {
  return Math.max(1, Math.ceil(wordCount / 200));
}

const PREAMBLE_RE = /^(here(?:'s| is)\b.*|certainly[!.,].*|sure[!.,].*|i(?:'ve| have) (?:written|cleaned|revised|updated)\b.*)$/i;

/**
 * Deterministic clean-up applied before QA and again before publishing:
 * drops model wrappers, removes or demotes H1s (the page renders the title as
 * the only H1), strips kramdown attributes and collapses whitespace.
 */
function normalizeBody(markdown, title = "") {
  let body = String(markdown || "").replace(/\r\n/g, "\n").trim();

  // A reply wrapped in one code fence
  const fenced = /^```(?:markdown|md)?\n([\s\S]*?)\n```$/.exec(body);
  if (fenced) body = fenced[1].trim();

  const lines = body.split("\n");
  while (lines.length && (!lines[0].trim() || PREAMBLE_RE.test(lines[0].trim()))) lines.shift();

  const titleKey = title.trim().toLowerCase();
  const out = [];
  for (const raw of lines) {
    const line = raw.replace(/[ \t]+$/g, "");
    const h1 = /^#\s+(.+?)\s*#*$/.exec(line);
    if (h1) {
      if (h1[1].replace(/[*_`]/g, "").trim().toLowerCase() === titleKey) continue;
      out.push(`## ${h1[1]}`);
      continue;
    }
    out.push(line.replace(/\{:\s*[^}]*\}/g, ""));
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** Drops image markers that were never turned into images. */
function stripImageMarkers(markdown) {
  return String(markdown || "")
    .replace(/^\[(?:IMAGE|SANITY_IMAGE):[^\]]*\]\s*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeUrl(url) {
  return String(url || "").trim().replace(/[#?].*$/, "").replace(/\/+$/, "").toLowerCase();
}

/** Text links only — `![alt](src)` images are not links. */
function extractLinks(markdown) {
  const internal = [];
  const external = [];
  const re = /(?<!!)\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let m;
  while ((m = re.exec(String(markdown || "")))) {
    const link = { text: m[1], url: m[2] };
    if (/^https?:\/\//i.test(link.url)) {
      if (SITE_URL && normalizeUrl(link.url).startsWith(normalizeUrl(SITE_URL))) internal.push(link);
      else external.push(link);
    } else if (link.url.startsWith("/")) {
      internal.push(link);
    }
  }
  return { internal, external };
}

/** Replaces `[text](url)` with `text` for every link whose url fails `keep`. */
function unlinkWhere(markdown, shouldRemove) {
  return String(markdown || "").replace(/(?<!!)\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (all, text, url) =>
    shouldRemove(url) ? text : all
  );
}

const KEYWORD_STOP_WORDS = new Set([
  "a", "an", "the", "for", "and", "or", "of", "to", "in", "on", "at", "by", "with", "your", "how", "what", "why", "is", "are", "do", "does", "vs",
  "guide", "canada", "canadian", "ontario", "toronto", "mississauga", "hamilton", "brampton", "kitchener", "windsor", "london", "ottawa",
  "oakville", "burlington", "guelph", "cambridge", "barrie", "oshawa", "markham",
]);

/**
 * Does `text` cover the keyword? Word order and inflection are free: every
 * number in the keyword (the standard) must appear, plus most of its other
 * significant words. Place names are optional — a title may name the city instead.
 */
function keywordCovered(keyword, text) {
  const haystack = String(text || "").toLowerCase();
  const hayWords = haystack.split(/[^a-z0-9]+/).filter(Boolean);
  const words = String(keyword || "").toLowerCase().split(/[^a-z0-9]+/).filter((w) => w && !KEYWORD_STOP_WORDS.has(w));
  if (words.length === 0) return true;
  if (haystack.includes(String(keyword).toLowerCase())) return true;

  const numbers = words.filter((w) => /\d/.test(w));
  const others = words.filter((w) => !/\d/.test(w));
  if (!numbers.every((n) => hayWords.includes(n))) return false;

  const stem = (w) => (w.length > 5 ? w.slice(0, 5) : w.length > 3 ? w.slice(0, 4) : w);
  const matched = others.filter((w) => hayWords.some((h) => h === w || (w.length > 3 && h.startsWith(stem(w)))));
  return matched.length >= Math.ceil(others.length * 0.6);
}

// ── Reading posts ────────────────────────────────────────────────

function toDay(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  return "";
}

function postPath(slug) {
  return path.join(CONTENT_DIR, `${slug}.md`);
}

function readPostFile(file) {
  const { data, content } = matter(fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8"));
  const slug = file.replace(/\.md$/, "");
  return {
    ...data,
    slug,
    date: toDay(data.date),
    updated: toDay(data.updated) || undefined,
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    inlineImages: Array.isArray(data.inlineImages) ? data.inlineImages : [],
    body: content.trim(),
    url: `/blog/${slug}`,
  };
}

/** Every published post, oldest first (so slice(-n) is "the most recent n"). */
function listPosts() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readPostFile)
    .sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));
}

function getPost(slug) {
  return fs.existsSync(postPath(slug)) ? readPostFile(`${slug}.md`) : null;
}

function slugExists(slug) {
  return fs.existsSync(postPath(slug)) || fs.existsSync(path.join(BLOG_IMAGE_DIR, slug));
}

// ── Images ───────────────────────────────────────────────────────

/**
 * Any source image to the one published format: 1200x675 WebP, centre-cropped.
 * Doing this locally is what guarantees the 16:9 rule regardless of source.
 */
async function processImage(input) {
  const sharp = require("sharp");
  const buffer = await sharp(input)
    .rotate()
    .resize(IMAGE_WIDTH, IMAGE_HEIGHT, { fit: "cover", position: "attention" })
    .webp({ quality: 78 })
    .toBuffer();
  return {
    buffer,
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    sha256: crypto.createHash("sha256").update(buffer).digest("hex"),
  };
}

function imageUrl(slug, file) {
  return `${IMAGE_URL_BASE}/${slug}/${file}`;
}

function imageMeta(slug, file, img) {
  const meta = {
    src: imageUrl(slug, file),
    alt: img.alt,
    width: img.width,
    height: img.height,
    source: img.source,
    sourceId: img.sourceId != null ? String(img.sourceId) : undefined,
    credit: img.credit,
    creditUrl: img.creditUrl,
    sha256: img.sha256,
  };
  for (const key of Object.keys(meta)) if (meta[key] === undefined || meta[key] === null) delete meta[key];
  return meta;
}

// ── Publishing ───────────────────────────────────────────────────

/**
 * Writes one post: images first, Markdown last, and rolls everything back if
 * any write fails. An existing slug is never overwritten.
 *
 * @param {object} post  { slug, title, description, date, author, category, primaryKeyword,
 *                         keywords[], articleType, targetCity, body, hero, inlineImages[] }
 *                       hero / inlineImages[] items: { buffer, alt, width, height, sha256, source, ... }
 */
function publishPost(post) {
  ensureDirs();
  const { slug } = post;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid slug "${slug}"`);
  if (slugExists(slug)) throw new Error(`Slug "${slug}" already exists — refusing to overwrite a published post`);
  if (!post.hero?.buffer) throw new Error("Cannot publish without a hero image");

  const imageDir = path.join(BLOG_IMAGE_DIR, slug);
  const mdPath = postPath(slug);
  const wordCount = countWords(post.body);
  const inlineImages = post.inlineImages || [];

  const frontmatter = {
    title: post.title,
    slug,
    description: post.description,
    date: post.date,
    author: post.author,
    category: post.category,
    primaryKeyword: post.primaryKeyword,
    keywords: post.keywords || [],
    articleType: post.articleType,
    targetCity: post.targetCity,
    readTime: readTimeMinutes(wordCount),
    wordCount,
    image: imageMeta(slug, "hero.webp", post.hero),
    inlineImages: inlineImages.map((img) => imageMeta(slug, img.file, img)),
  };
  for (const key of Object.keys(frontmatter)) {
    if (frontmatter[key] === undefined || frontmatter[key] === null || frontmatter[key] === "") delete frontmatter[key];
  }

  try {
    fs.mkdirSync(imageDir, { recursive: true });
    fs.writeFileSync(path.join(imageDir, "hero.webp"), post.hero.buffer);
    for (const img of inlineImages) fs.writeFileSync(path.join(imageDir, img.file), img.buffer);
    // "wx" fails instead of overwriting if the file appeared since the check above.
    fs.writeFileSync(mdPath, matter.stringify(`\n${post.body.trim()}\n`, frontmatter), { flag: "wx" });
  } catch (err) {
    fs.rmSync(imageDir, { recursive: true, force: true });
    if (err.code !== "EEXIST") fs.rmSync(mdPath, { force: true });
    throw err;
  }

  // Read it back the way the site will, so a post that can't be parsed never lands.
  const saved = getPost(slug);
  if (!saved || saved.title !== post.title || !saved.body || saved.image?.src !== imageUrl(slug, "hero.webp")) {
    fs.rmSync(imageDir, { recursive: true, force: true });
    fs.rmSync(mdPath, { force: true });
    throw new Error(`Post "${slug}" did not read back correctly after writing`);
  }

  return {
    slug,
    path: mdPath,
    url: `${SITE_URL}/blog/${slug}`,
    localUrl: `/blog/${slug}`,
    wordCount,
    readTime: frontmatter.readTime,
    files: [mdPath, path.join(imageDir, "hero.webp"), ...inlineImages.map((i) => path.join(imageDir, i.file))],
  };
}

module.exports = {
  IMAGE_WIDTH,
  IMAGE_HEIGHT,
  ensureDirs,
  slugify,
  todayLocal,
  toPlainText,
  countWords,
  readTimeMinutes,
  normalizeBody,
  stripImageMarkers,
  normalizeUrl,
  extractLinks,
  unlinkWhere,
  keywordCovered,
  listPosts,
  getPost,
  slugExists,
  processImage,
  imageUrl,
  publishPost,
};
