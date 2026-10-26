import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import test from "node:test";

const ROOT = new URL("..", import.meta.url).pathname;

// Mirrors POSITIONING_PATTERNS in team/agents/content/contentQA.js — keep both in sync.
const POSITIONING_PATTERNS = [
  /\byourqms\b/i,
  /\bquro\b/i,
  /yourqms\.com/i,
  /\bAI[- ](?:powered |driven |assisted |led |generated )?gap (?:assessments?|analys[ie]s)\b/i,
  /\bAI[- ](?:suggested |generated |powered )?audit findings?\b/i,
];

const SKIP_DIRS = new Set(["node_modules", ".next", "out", ".git"]);
// Published text under these is unchanged by Owner decision.
const SKIP_PREFIXES = ["content/blog/", "content/guides/"];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

const rel = (f) => relative(ROOT, f).split(sep).join("/");

test("site copy carries no product name or AI audit claims", () => {
  const files = [
    ...["app", "components", "lib", "api"].flatMap((d) => {
      try { return walk(join(ROOT, d)); } catch { return []; }
    }),
    join(ROOT, "content/chatbot-context.md"),
  ].filter((f) => /\.(tsx?|mjs|cjs|js|json|md|txt)$/.test(f))
    .filter((f) => !SKIP_PREFIXES.some((p) => rel(f).startsWith(p)));

  const hits = [];
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    for (const re of POSITIONING_PATTERNS) {
      const m = text.match(re);
      if (m) hits.push(`${rel(f)}: "${m[0]}"`);
    }
  }
  assert.deepEqual(hits, [], `Banned positioning terms found:\n${hits.join("\n")}`);
});

test("hand-written meta descriptions are 120–160 characters", () => {
  const files = walk(join(ROOT, "app")).filter((f) => /(^|\/)page\.tsx$/.test(rel(f)) || rel(f) === "app/layout.tsx");
  files.push(join(ROOT, "components/guides/GuideLibraryPage.tsx"));
  // description: "…" / '…' in object literals, and const description = "…" / '…'
  const re = /\bdescription\s*(?::|=)\s*(?:"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)')/g;
  const offenders = [];
  for (const f of files) {
    const text = readFileSync(f, "utf8");
    for (const m of text.matchAll(re)) {
      const value = (m[1] ?? m[2]).replace(/\\(['"])/g, "$1");
      if (value.length < 120 || value.length > 160) {
        offenders.push(`${rel(f)} (${value.length}): ${value}`);
      }
    }
  }
  assert.deepEqual(offenders, [], `Descriptions outside 120–160 characters:\n${offenders.join("\n")}`);
});

test("module meta descriptions are 120–160 characters", async () => {
  const { MODULES } = await import("../lib/site.ts");
  const offenders = MODULES.filter((m) => m.metaDescription.length < 120 || m.metaDescription.length > 160).map(
    (m) => `${m.slug} (${m.metaDescription.length}): ${m.metaDescription}`,
  );
  assert.equal(MODULES.length, 11);
  const OWNED = ["capa software", "document control software", "supplier quality software", "internal audit software", "calibration management software", "competency management software", "incident and near-miss reporting software", "process mapping software for quality management"];
  for (const m of MODULES) {
    assert.ok(typeof m.seoTitle === "string" && m.seoTitle.trim(), `${m.slug} needs a seoTitle`);
    for (const text of [m.seoTitle, m.metaDescription]) {
      for (const phrase of OWNED) assert.ok(!text.toLowerCase().includes(phrase), `${m.slug} uses guide-owned phrase "${phrase}"`);
    }
  }
  assert.deepEqual(offenders, [], `Module descriptions outside 120–160 characters:\n${offenders.join("\n")}`);
});
