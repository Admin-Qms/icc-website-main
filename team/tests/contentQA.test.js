const { goodPost, testImage } = require("./helpers/env");
const { test } = require("node:test");
const assert = require("node:assert/strict");
const qa = require("../agents/content/contentQA");

const block = (text, style = "normal") => [{ _type: "block", style, children: [{ text }] }];
const failed = (result) => result.checks.filter((c) => !c.pass).map((c) => c.id);

test("voice: first person fails; country, labels and abbreviations pass", () => {
  for (const text of ["When we audit a plant.", "Our process has six stages.", "Tell us about the line.", "I recommend starting early.", "In my experience."]) {
    assert.equal(qa.checkVoice(block(text)).pass, false, text);
  }
  for (const text of ["Suppliers in the US and Canada.", "A Class I medical device.", "Type I and Type II errors.", "Wire the I/O module.", "Phases I, II and III."]) {
    assert.equal(qa.checkVoice(block(text)).pass, true, text);
  }
});

test("fabricated quotes: attributed speech fails, ordinary callouts pass", () => {
  assert.equal(qa.checkFabricatedQuotes(block('"That audit changed how the team works," said the plant manager.')).pass, false);
  assert.equal(qa.checkFabricatedQuotes(block("— Jane Smith, Quality Manager")).pass, false);
  assert.equal(qa.checkFabricatedQuotes(block("Important: the plant manager must sign the quality policy.", "blockquote")).pass, true);
});

test("published date: future dates fail", () => {
  assert.equal(qa.checkPublishedAt({ publishedAt: "2026-10-01" }).pass, true);
  assert.equal(qa.checkPublishedAt({ publishedAt: "2099-01-01" }).pass, false);
  assert.equal(qa.checkPublishedAt({ publishedAt: "not a date" }).pass, false);
});

test("toBlocks maps headings, callouts, lists and images", () => {
  const blocks = qa.toBlocks("# One\n\n## Two\n\n> **Note:** a callout\n\n- item\n\nA paragraph.\n\n![alt](/x.webp)");
  assert.deepEqual(blocks.map((b) => b.style || b._type), ["h1", "h2", "blockquote", "normal", "normal", "image"]);
});

test("the seed article passes every text check", async () => {
  const result = await qa.validateLocal(goodPost(), { phase: "text", claimsAudit: false });
  assert.deepEqual(failed(result), []);
  assert.ok(result.wordCount >= 1500);
});

test("final phase requires a 1200x675 hero", async () => {
  const withoutHero = await qa.validateLocal(goodPost(), { phase: "final", claimsAudit: false });
  assert.ok(failed(withoutHero).includes("hero-image"));

  const withHero = await qa.validateLocal(goodPost({ hero: await testImage() }), { phase: "final", claimsAudit: false });
  assert.deepEqual(failed(withHero), []);

  const wrongSize = await qa.validateLocal(goodPost({ hero: { ...(await testImage()), width: 1024, height: 1024 } }), { phase: "final", claimsAudit: false });
  assert.ok(failed(wrongSize).includes("hero-image"));
});

test("each rule blocks on its own", async () => {
  const base = goodPost();
  const cases = [
    ["voice", { body: `${base.body}\n\nWe help plants prepare for both stages.` }],
    ["voice", { description: "How we run an ISO certification audit: what Stage 1 vs Stage 2 audits check, what auditors ask to see, and how to prepare." }],
    ["fabricated-quotes", { body: `${base.body}\n\n"The second stage surprised everyone on the floor," said the plant manager.` }],
    ["single-h1", { body: `# A Second Title\n\n${base.body}` }],
    ["meta-description", { description: "Too short to be a meta description." }],
    ["meta-keyword", { description: "A long description about preparing a plant for a visit from a certification body, covering documents, records, interviews and findings." }],
    ["slug", { slug: "Bad_Slug" }],
    ["published-date", { date: "2099-01-01" }],
    ["author", { author: "" }],
    ["word-count", { body: base.body.split("## What a Stage 2 Audit Checks")[0] }],
    ["keyword-in-title", { title: "What Auditors Look For During a Site Visit" }],
    ["topic-allowed", { title: "ISO Certification Audit Stage 1 vs Stage 2 for AS9100 Suppliers" }],
    ["internal-links", { body: base.body.replace("](/contact)", "](/privacy)") }],
    ["external-links", { body: base.body.replace("https://www.iafcertsearch.org/", "https://example.org/made-up-source") }],
    ["banned-phrases", { body: `${base.body}\n\nThis step is crucial for every plant.` }],
    ["no-artifacts", { body: `Here is the article:\n\n${base.body}` }],
  ];
  for (const [id, overrides] of cases) {
    const result = await qa.validateLocal(goodPost(overrides), { phase: "text", claimsAudit: false });
    assert.equal(result.pass, false, `${id} should fail the gate`);
    assert.ok(failed(result).includes(id), `expected "${id}" to fail, got: ${failed(result).join(", ") || "none"}`);
  }
});

test("unprocessed image markers are fine before images, an error after", async () => {
  const body = `${goodPost().body}\n\n[IMAGE: an auditor on a shop floor]`;
  const text = await qa.validateLocal(goodPost({ body }), { phase: "text", claimsAudit: false });
  assert.ok(!failed(text).includes("no-artifacts"));
  const final = await qa.validateLocal(goodPost({ body, hero: await testImage() }), { phase: "final", claimsAudit: false });
  assert.ok(failed(final).includes("no-artifacts"));
});

test("claims audit is reported as skipped, not passed silently, when no key is set", async () => {
  const result = await qa.validateLocal(goodPost(), { phase: "text" });
  const claims = result.checks.find((c) => c.id === "claims-audit");
  assert.equal(claims.skipped, true);
  assert.match(claims.message, /Skipped/);
});
