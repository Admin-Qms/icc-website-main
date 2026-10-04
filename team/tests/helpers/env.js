// Required first by every test file: points the content store at a throwaway
// folder and blanks the API keys, so tests never touch the real site content
// and never make a network call.
const fs = require("fs");
const os = require("os");
const path = require("path");

const root = fs.mkdtempSync(path.join(os.tmpdir(), "icc-blog-test-"));
process.env.ICC_ENV_FILE = path.join(root, "no-env-file"); // keep team/.env (real keys) out of tests
process.env.BLOG_CONTENT_DIR = path.join(root, "content", "blog");
process.env.BLOG_IMAGE_DIR = path.join(root, "public", "images", "blog");
process.env.LLM_PROVIDER = "claude";
for (const key of ["CLAUDE_API_KEY", "GEMINI_API_KEY", "PEXELS_API_KEY", "OPENAI_API_KEY", "TELEGRAM_BOT_TOKEN", "TELEGRAM_ADMIN_ID"]) {
  process.env[key] = "";
}

const DRAFT = path.resolve(__dirname, "../../drafts/iso-certification-audit-stage-1-vs-stage-2/draft.json");

/** The seed article as an in-memory post, the shape validateLocal expects. */
function goodPost(overrides = {}) {
  const draft = JSON.parse(fs.readFileSync(DRAFT, "utf-8"));
  const body = fs.readFileSync(path.join(path.dirname(DRAFT), draft.bodyFile), "utf-8");
  return {
    slug: "iso-certification-audit-stage-1-vs-stage-2-what-each-audit-checks",
    title: draft.title,
    description: draft.metaDescription,
    date: "2026-10-01",
    author: "ISO Certification Consultant Editorial Team",
    primaryKeyword: draft.primaryKeyword,
    body,
    ...overrides,
  };
}

/** A 1200x675 image buffer with the given colour, as the image agents would return it. */
async function testImage(color = { r: 20, g: 60, b: 110 }) {
  const sharp = require("sharp");
  const { processImage } = require("../../agents/shared/contentStore");
  const raw = await sharp({ create: { width: 1600, height: 1000, channels: 3, background: color } }).png().toBuffer();
  return { ...(await processImage(raw)), alt: "Test image of a solid colour", source: "local", sourceId: `test-${color.r}` };
}

module.exports = { root, DRAFT, goodPost, testImage };
