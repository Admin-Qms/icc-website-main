const { root, testImage } = require("./helpers/env");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const store = require("../agents/shared/contentStore");

test("slugify: lowercase, hyphens, trimmed, capped at 80 on a word boundary", () => {
  assert.equal(store.slugify("ISO 9001 vs IATF 16949: Which One?"), "iso-9001-vs-iatf-16949-which-one");
  assert.equal(store.slugify("  --Café & Résumé--  "), "cafe-and-resume");
  const long = store.slugify("word ".repeat(40));
  assert.ok(long.length <= 80 && !long.endsWith("-"));
});

test("countWords counts what a reader sees", () => {
  const md = "## Heading\n\n> **Key:** see [the guide](https://example.org/a-very-long-url) now\n\n![alt text here](/images/x.webp)\n\n- one two\n\n[IMAGE: a factory floor]";
  assert.equal(store.countWords(md), 8); // Heading Key: see the guide now one two
  assert.equal(store.readTimeMinutes(1999), 10);
  assert.equal(store.readTimeMinutes(10), 1);
});

test("normalizeBody removes wrappers, preamble and H1s", () => {
  const raw = "```markdown\nHere is the article:\n\n# My Title\n\n# Another H1\n\nText {: target=\"_blank\"}\n\n\n\nMore\n```";
  const out = store.normalizeBody(raw, "My Title");
  assert.ok(!out.includes("```"));
  assert.ok(!/^# /m.test(out));
  assert.ok(out.startsWith("## Another H1"));
  assert.ok(!out.includes("{:"));
  assert.ok(!out.includes("\n\n\n"));
});

test("extractLinks ignores images and sorts internal from external", () => {
  const links = store.extractLinks("[a](/contact) ![img](/images/blog/x/hero.webp) [b](https://www.iso.org/standard/9001) [c](https://isocertificationconsultants.ca/process)");
  assert.deepEqual(links.internal.map((l) => l.url), ["/contact", "https://isocertificationconsultants.ca/process"]);
  assert.deepEqual(links.external.map((l) => l.url), ["https://www.iso.org/standard/9001"]);
});

test("unlinkWhere keeps the anchor text and leaves images alone", () => {
  const out = store.unlinkWhere("See [this](/gone) and ![pic](/gone)", (url) => url === "/gone");
  assert.equal(out, "See this and ![pic](/gone)");
});

test("keywordCovered: numbers required, inflection and order free, places optional", () => {
  assert.ok(store.keywordCovered("iso 9001 certification cost ontario", "What ISO 9001 Certification Really Costs a 50-Person Shop"));
  assert.ok(!store.keywordCovered("iso 9001 certification cost ontario", "What ISO 14001 Certification Costs"));
  assert.ok(!store.keywordCovered("iso 45001 internal audit checklist", "A 10-Point Internal Audit Checklist"));
});

test("todayLocal is a Toronto calendar date", () => {
  assert.equal(store.todayLocal(new Date("2026-10-03T02:00:00Z")), "2026-10-02");
  assert.equal(store.todayLocal(new Date("2026-10-03T12:00:00Z")), "2026-10-03");
});

test("processImage always yields 1200x675 WebP", async () => {
  const sharp = require("sharp");
  const img = await testImage();
  const meta = await sharp(img.buffer).metadata();
  assert.deepEqual([meta.width, meta.height, meta.format], [1200, 675, "webp"]);
  assert.match(img.sha256, /^[a-f0-9]{64}$/);
});

test("publishPost writes images and Markdown, reads back, and never overwrites", async () => {
  const post = {
    slug: "round-trip-post",
    title: "Round Trip: A Post With a Colon",
    description: "A description.",
    date: "2026-10-01",
    author: "Test Author",
    category: "Auditing",
    primaryKeyword: "round trip",
    keywords: ["round trip"],
    body: "## Section\n\nBody text with a [link](/contact).\n\n![An inline image](/images/blog/round-trip-post/inline-1.webp)",
    hero: await testImage(),
    inlineImages: [{ ...(await testImage({ r: 200, g: 10, b: 10 })), file: "inline-1.webp" }],
  };
  const result = store.publishPost(post);
  assert.ok(result.path.startsWith(root), "writes inside the test folder, not the real site");
  assert.ok(fs.existsSync(path.join(process.env.BLOG_IMAGE_DIR, "round-trip-post", "hero.webp")));
  assert.ok(fs.existsSync(path.join(process.env.BLOG_IMAGE_DIR, "round-trip-post", "inline-1.webp")));

  const saved = store.getPost("round-trip-post");
  assert.equal(saved.title, post.title);
  assert.equal(saved.date, "2026-10-01");
  assert.equal(saved.image.src, "/images/blog/round-trip-post/hero.webp");
  assert.equal(saved.image.width, 1200);
  assert.equal(saved.inlineImages.length, 1);
  assert.equal(saved.readTime, 1);
  assert.equal(store.listPosts().length, 1);

  assert.throws(() => store.publishPost(post), /already exists/);
  assert.equal(store.getPost("round-trip-post").title, post.title, "the original post is untouched");
});

test("publishPost refuses a post without a hero image and leaves nothing behind", () => {
  assert.throws(() => store.publishPost({ slug: "no-hero-post", title: "t", body: "b", date: "2026-10-01" }), /hero image/);
  assert.equal(store.slugExists("no-hero-post"), false);
});
