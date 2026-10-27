import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const ROOT = new URL("..", import.meta.url).pathname;
const LOOPS = join(ROOT, "components/loops");

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

/** Bodies of every `@media (prefers-reduced-motion: reduce) { … }` block, braces balanced. */
function reducedMotionBlocks(css) {
  const blocks = [];
  const re = /@media\s*\(\s*prefers-reduced-motion\s*:\s*reduce\s*\)\s*\{/g;
  let m;
  while ((m = re.exec(css))) {
    let depth = 1;
    let i = re.lastIndex;
    for (; i < css.length && depth > 0; i++) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}") depth--;
    }
    blocks.push(css.slice(re.lastIndex, i - 1));
  }
  return blocks.join("\n");
}

test("loops css has a reduced-motion final frame for every step class", () => {
  const css = readFileSync(join(LOOPS, "loops.module.css"), "utf8");
  const reduced = reducedMotionBlocks(css);
  assert.ok(reduced.length > 0, "no prefers-reduced-motion: reduce block");
  for (let k = 1; k <= 5; k++) {
    for (const cls of [`on${k}`, `until${k}`]) {
      assert.match(reduced, new RegExp(`\\.${cls}\\b`), `.${cls} has no reduced-motion rule`);
    }
  }
  assert.match(reduced, /\.fill\b/, ".fill has no reduced-motion rule");
});

test("LoopFrame carries the neutral title and the sample-data chip", () => {
  const text = readFileSync(join(LOOPS, "LoopFrame.tsx"), "utf8");
  for (const needle of ["Compliance Management Software", "Sample data", 'role="img"', "aria-hidden"]) {
    assert.ok(text.includes(needle), `LoopFrame.tsx is missing ${needle}`);
  }
});

test("no loop uses the product name", () => {
  const hits = walk(LOOPS).filter((f) => /yourqms|quro/i.test(readFileSync(f, "utf8")));
  assert.deepEqual(hits, []);
});

test("every registered loop file exists and modules are registered", () => {
  const index = readFileSync(join(LOOPS, "index.ts"), "utf8");
  const body = index.slice(index.indexOf("MODULE_LOOPS"));
  const keys = [...body.matchAll(/^\s*(?:"([a-z0-9-]+)"|([a-z0-9]+))\s*:/gm)].map((m) => m[1] ?? m[2]);
  for (const slug of ["standards", "document-control", "processes", "audits-management-review", "nonconformance-capa", "safety", "training-competence", "supplier-quality"]) {
    assert.ok(keys.includes(slug), `MODULE_LOOPS is missing ${slug}`);
  }
  const files = [...index.matchAll(/from\s+"\.\/([A-Za-z0-9]+)"/g)].map((m) => m[1]);
  assert.ok(files.length >= 8, "index.ts imports fewer loops than expected");
  for (const f of files) {
    assert.ok(statSync(join(LOOPS, `${f}.tsx`)).isFile(), `${f}.tsx does not exist`);
  }
});

test("LoopFrame puts the active tab right after Home", async () => {
  const { orderTabs } = await import("../components/loops/tabs.ts");
  assert.equal(orderTabs("Audits")[1], "Audits");
  assert.equal(orderTabs("Processes")[1], "Processes");
  assert.equal(orderTabs("Home")[0], "Home");
  for (const a of ["Home", "Audits", "AI Assistant"]) {
    const t = orderTabs(a);
    assert.equal(new Set(t).size, t.length, `duplicate tabs for ${a}`);
  }
  assert.match(readFileSync(join(LOOPS, "LoopFrame.tsx"), "utf8"), /orderTabs\(active\)/);
});

test("every MODULES slug is registered in MODULE_LOOPS", async () => {
  const { MODULES } = await import("../lib/site.ts");
  const index = readFileSync(join(LOOPS, "index.ts"), "utf8");
  const body = index.slice(index.indexOf("MODULE_LOOPS"));
  const keys = [...body.matchAll(/^\s*(?:"([a-z0-9-]+)"|([a-z0-9]+))\s*:/gm)].map((m) => m[1] ?? m[2]);
  const missing = MODULES.map((m) => m.slug).filter((s) => !keys.includes(s));
  assert.deepEqual(missing, []);
  assert.equal(keys.length, MODULES.length);
});
