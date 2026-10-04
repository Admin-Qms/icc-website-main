// The model-driven path end to end, with stand-ins for the model and the image
// API: keyword pick -> write -> clean -> grammar -> originality -> links ->
// gate -> patch -> images -> gate -> publish. No keys, no network.
const { root, goodPost } = require("./helpers/env");
process.env.GEMINI_API_KEY = "test-key"; // lets the image step reach the stubbed SDK below

const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const sharp = require("sharp");

const KEYWORD = "iso 9001 internal audit checklist";
const TITLE = "An ISO 9001 Internal Audit Checklist for Hamilton Machine Shops";
const FIRST_PERSON = "We always recommend starting the audit programme early.";
const PASTED_KEYWORD = "Keep an **iso 9001 internal audit checklist** at every workstation and analyse the colour of the tags.";

const calls = [];
let draft = "";

// What each agent gets back, keyed on its system prompt.
function reply(system, user) {
  if (/keyword researcher/i.test(system)) {
    calls.push("keyword");
    // First answer is not in the queue; the researcher must reject it and ask again.
    const attempt = calls.filter((c) => c === "keyword").length;
    return JSON.stringify({
      primaryKeyword: attempt === 1 ? "iso 9001 audit tips" : KEYWORD.toUpperCase(),
      secondaryKeywords: ["internal audit programme", "audit checklist template"],
      articleType: "case-study",
      searchIntent: "informational",
      title: TITLE,
      metaDescription: "An ISO 9001 internal audit checklist for machine shops: what to check, which records to pull and how to report findings clearly.",
      h2Structure: ["Why Internal Audits Matter"],
      faqQuestions: ["How often should a shop audit?"],
      targetCity: "Hamilton",
      reasoning: "test",
    });
  }
  if (/B2B content writer/i.test(system)) {
    calls.push("writer");
    assert.match(user, /CURRENT STANDARD EDITIONS/, "writer is given the current editions");
    assert.match(user, /\/contact/, "writer is offered the contact page");
    // A realistic flawed draft: an H1, first person, a dead link, an off-bank link, three image markers.
    draft = [
      `# ${TITLE}`,
      "",
      goodPost().body.replace("](/assessment)", "](/resources)"),
      "",
      FIRST_PERSON,
      "",
      PASTED_KEYWORD,
      "",
      "See [this unrelated site](https://example.org/not-approved) for more.",
      "",
      "[IMAGE: an auditor checking a gauge calibration label beside a CNC machine]",
      "",
      "[IMAGE: a supervisor reviewing an audit checklist on a production floor]",
      "",
      "[IMAGE: a third scene that should be dropped because only two inline images are allowed]",
    ].join("\n");
    return draft;
  }
  if (/Content Cleaner/i.test(system)) {
    calls.push("cleaner");
    return `Here is the cleaned article:\n\n${draft}`;
  }
  if (/senior copy editor/i.test(system)) {
    calls.push("grammar");
    // The grammar step now takes the article back as plain Markdown.
    return user.split("ARTICLE BODY:\n")[1];
  }
  if (/Plagiarism Checker/i.test(system)) {
    calls.push("originality");
    return JSON.stringify({ score: 96, pass: true, flaggedSentences: [], rewriteInstructions: null });
  }
  if (/compliance editor/i.test(system)) {
    calls.push("claims");
    assert.match(user, /ISO 9001:2026/, "claims audit is given the current editions");
    return { findings: [] };
  }
  if (/surgical edits/i.test(system)) {
    calls.push("patch");
    const article = user.split("ARTICLE:\n")[1].split("\n\nReturn ONLY")[0];
    // Deterministic patches run first and may have re-spelled the sentence, so match loosely.
    return article.replace(/We always recommend[^.]*\./, "Starting the audit program early is the safer choice.");
  }
  throw new Error(`unexpected model call: ${system.slice(0, 60)}`);
}

const text = async (system, user) => String(reply(system, user));
const json = async (system, user) => {
  const out = reply(system, user);
  return typeof out === "string" ? JSON.parse(out) : out;
};
require.cache[require.resolve("../agents/shared/claude")] = {
  id: require.resolve("../agents/shared/claude"),
  filename: require.resolve("../agents/shared/claude"),
  loaded: true,
  exports: { claudeCall: text, claudeCallFast: text, claudeJSON: json, claudeJSONFast: json, hasLLMKey: () => true, LLM_PROVIDER: "stub" },
};

// A fake image API: every call returns a different solid-colour picture.
let imageCalls = 0;
class FakeGenAI {
  constructor() {
    this.models = {
      generateContent: async ({ config, contents }) => {
        assert.equal(config.imageConfig.aspectRatio, "16:9");
        assert.match(String(contents), /Photorealistic editorial photograph/, "the house style is in every image prompt");
        imageCalls++;
        const png = await sharp({ create: { width: 1344, height: 768, channels: 3, background: { r: 40 * imageCalls, g: 90, b: 150 } } }).png().toBuffer();
        return { candidates: [{ content: { parts: [{ inlineData: { data: png.toString("base64") } }] } }] };
      },
    };
  }
}
require.cache[require.resolve("@google/genai")] = {
  id: require.resolve("@google/genai"),
  filename: require.resolve("@google/genai"),
  loaded: true,
  exports: { GoogleGenAI: FakeGenAI },
};

const contentManager = require("../agents/content/contentManager");
const store = require("../agents/shared/contentStore");

test("a flawed model draft is repaired, illustrated and published", async () => {
  const result = await contentManager.publishDaily();
  assert.equal(result.success, true, `${result.reason} ${(result.issues || []).join(" | ")}`);

  assert.equal(calls.filter((c) => c === "keyword").length, 2, "an off-queue keyword is rejected and re-asked");
  assert.equal(result.primaryKeyword, KEYWORD, "the keyword is stored exactly as queued");
  assert.equal(result.articleType, "deep-guide", "case studies are not published");
  for (const step of ["writer", "cleaner", "grammar", "originality", "claims", "patch"]) {
    assert.ok(calls.includes(step), `${step} ran`);
  }
  assert.ok(result.files.every((f) => f.startsWith(root)));

  const post = store.getPost(result.slug);
  assert.equal(post.slug, "an-iso-9001-internal-audit-checklist-for-hamilton-machine-shops");
  assert.equal(post.targetCity, "Hamilton");
  assert.ok(!/^# /m.test(post.body), "the H1 was removed");
  assert.ok(!post.body.includes("Here is the cleaned article"), "model preamble was removed");
  assert.ok(!post.body.includes(FIRST_PERSON), "first person was patched out");
  assert.ok(!post.body.includes("**iso 9001 internal audit checklist**"), "the pasted bold keyword was unbolded");
  assert.ok(post.body.includes("ISO 9001 internal audit checklist"), "the standard name was capitalized");
  assert.ok(post.body.includes("analyze the color"), "British spelling was changed to US");
  assert.match(post.body, /^## /m);
  assert.ok(post.body.includes("](/contact)"), "the contact link survived the patches");
  assert.ok(!post.body.includes("](/resources)"), "the dead internal link was unlinked");
  assert.ok(!post.body.includes("example.org"), "the off-bank link was unlinked");
  assert.ok(post.body.includes("this unrelated site"), "its anchor text was kept");
  assert.ok(!post.body.includes("[IMAGE:"), "no image markers are left");

  assert.equal(post.inlineImages.length, 2, "two inline images, the third marker dropped");
  assert.equal(imageCalls, 3, "one hero and two inline images were generated");
  assert.equal((post.body.match(/^!\[[^\]]+\]\(\/images\/blog\/[^)]+\/inline-\d\.webp\)$/gm) || []).length, 2);
  const hashes = [post.image.sha256, ...post.inlineImages.map((i) => i.sha256)];
  assert.equal(new Set(hashes).size, 3, "every image is different");
  assert.equal(post.image.source, "gemini");
  assert.ok(post.inlineImages[0].alt.includes("calibration"), "alt text describes the image");
  for (const img of [post.image, ...post.inlineImages]) {
    const meta = await sharp(path.join(process.env.BLOG_IMAGE_DIR, "..", "..", img.src.replace("/images/", "images/"))).metadata();
    assert.deepEqual([meta.width, meta.height], [1200, 675]);
  }
});

test("an image already used by a post is not accepted again", async () => {
  const { isBlogImageUsed, usedBlogImages } = require("../agents/shared/imageRegistry");
  const post = store.listPosts()[0];
  assert.equal(isBlogImageUsed({ sha256: post.image.sha256 }, usedBlogImages()), true);
  assert.equal(isBlogImageUsed({ sha256: "0".repeat(64) }, usedBlogImages()), false);
});
