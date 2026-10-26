// Run manually after `npm run build`: node --test tests/positioning-build.test.mjs
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import test from "node:test";
import { POSITIONING_PATTERNS } from "./positioning-copy.test.mjs";

const OUT = new URL("../out/", import.meta.url).pathname;
const SKIP = ["blog/", "guides/", "_next/"];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}
const rel = (f) => relative(OUT, f).split(sep).join("/");
const files = existsSync(OUT) ? walk(OUT).filter((f) => !SKIP.some((p) => rel(f).startsWith(p))) : [];

test("build output exists", () => {
  assert.ok(files.length > 0, "out/ is empty or missing: run npm run build first");
});

test("built pages have 120–160 character meta descriptions", () => {
  const offenders = [];
  for (const f of files.filter((f) => f.endsWith("index.html"))) {
    const m = readFileSync(f, "utf8").match(/<meta name="description" content="([^"]*)"/);
    if (!m) { offenders.push(`${rel(f)}: no meta description`); continue; }
    const d = m[1].replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"');
    if (d.length < 120 || d.length > 160) offenders.push(`${rel(f)} (${d.length}): ${d}`);
  }
  assert.deepEqual(offenders, [], `Descriptions outside 120–160:\n${offenders.join("\n")}`);
});

test("built output carries no banned positioning terms", () => {
  const hits = [];
  for (const f of files.filter((f) => /\.(html|txt|xml|json)$/.test(f))) {
    const text = readFileSync(f, "utf8");
    for (const re of POSITIONING_PATTERNS) {
      const m = text.match(re);
      if (m) hits.push(`${rel(f)}: "${m[0]}"`);
    }
  }
  assert.deepEqual(hits, [], `Banned terms in build output:\n${hits.join("\n")}`);
});
