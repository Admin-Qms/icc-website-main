const { root, DRAFT } = require("./helpers/env");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const contentManager = require("../agents/content/contentManager");
const store = require("../agents/shared/contentStore");

const SLUG = "iso-certification-audit-stage-1-vs-stage-2-what-each-audit-checks";

test("a dry run passes every check and writes nothing to the site", async () => {
  const result = await contentManager.publishDaily({ fixture: DRAFT, dryRun: true });
  assert.equal(result.success, true, result.reason);
  assert.equal(result.dryRun, true);
  assert.equal(store.listPosts().length, 0);
  assert.equal(store.slugExists(SLUG), false);
});

test("a draft publishes through the gate into the content folder", async () => {
  const result = await contentManager.publishDaily({ fixture: DRAFT });
  assert.equal(result.success, true, `${result.reason} ${(result.issues || []).join(" | ")}`);
  assert.equal(result.slug, SLUG);
  assert.ok(result.files.every((f) => f.startsWith(root)), "published into the test folder");

  const post = store.getPost(SLUG);
  assert.equal(post.primaryKeyword, "iso certification audit stage 1 vs stage 2");
  assert.equal(post.category, "Auditing");
  assert.equal(post.readTime, Math.ceil(post.wordCount / 200));
  assert.ok(post.wordCount >= 1500);
  assert.equal(post.image.width, 1200);
  assert.equal(post.image.height, 675);
  assert.ok(fs.existsSync(path.join(process.env.BLOG_IMAGE_DIR, SLUG, "hero.webp")));
  assert.ok(!/^# /m.test(post.body), "no H1 in the body");
  assert.ok(!post.body.includes("[IMAGE:"));
});

test("a second run the same day is skipped, and --force cannot overwrite the post", async () => {
  const skipped = await contentManager.publishDaily({ fixture: DRAFT });
  assert.equal(skipped.skipped, true);

  const before = fs.readFileSync(path.join(process.env.BLOG_CONTENT_DIR, `${SLUG}.md`), "utf-8");
  const forced = await contentManager.publishDaily({ fixture: DRAFT, force: true });
  assert.equal(forced.success, false);
  assert.match(forced.reason, /already published/);
  assert.equal(fs.readFileSync(path.join(process.env.BLOG_CONTENT_DIR, `${SLUG}.md`), "utf-8"), before);
});

test("the published keyword leaves the queue", () => {
  const { getQueueStatus } = require("../agents/content/keywordResearcher");
  const status = getQueueStatus();
  assert.equal(status.published, 1);
  assert.equal(status.remaining, status.total - 1);
  assert.ok(!status.next.includes("iso certification audit stage 1 vs stage 2"));
});

test("a draft that fails the gate leaves the site untouched", async () => {
  const dir = fs.mkdtempSync(path.join(root, "bad-draft-"));
  fs.writeFileSync(path.join(dir, "draft.json"), JSON.stringify({
    title: "ISO 9001 Internal Audit Checklist for Machine Shops",
    metaDescription: "An ISO 9001 internal audit checklist for machine shops: what to check, what records to pull and how to report findings clearly.",
    primaryKeyword: "iso 9001 internal audit checklist",
    body: "We wrote this short draft.\n\nIt is far too short and links to [nowhere](/nope).",
  }));
  const result = await contentManager.publishDaily({ fixture: path.join(dir, "draft.json"), force: true });
  assert.equal(result.success, false);
  assert.ok(result.issues.some((i) => i.startsWith("voice")));
  assert.ok(result.issues.some((i) => i.startsWith("word-count")));
  assert.equal(store.slugExists("iso-9001-internal-audit-checklist-for-machine-shops"), false);
  assert.equal(store.listPosts().length, 1);
});
