#!/usr/bin/env node
// After `npm run build`: checks that every internal link, image and in-page
// anchor on the built blog pages points at something that exists in out/.
//
//   node team/scripts/check-links.js            all blog pages
//   node team/scripts/check-links.js <slug>     one article
//
// Exits 1 on any broken reference, so a scheduled run can stop before pushing.

const fs = require("fs");
const path = require("path");

const OUT = path.resolve(__dirname, "../../out");
const slugArg = process.argv[2];

// Footer links to pages the site does not have yet. They are reported but do
// not fail the run, so a site-wide gap can't block the daily article. Remove an
// entry once its page exists.
const KNOWN_MISSING = new Set(["/privacy", "/terms"]);

function pageFile(route) {
  const clean = route.replace(/[#?].*$/, "").replace(/\/+$/, "");
  const candidates = clean === ""
    ? ["index.html"]
    : [`${clean}.html`, `${clean}/index.html`, clean];
  return candidates.map((c) => path.join(OUT, c)).find((f) => fs.existsSync(f) && fs.statSync(f).isFile());
}

function blogPages() {
  if (slugArg) return [`/blog/${slugArg}`];
  const dir = path.join(OUT, "blog");
  const pages = ["/blog"];
  if (fs.existsSync(dir)) {
    for (const entry of fs.readdirSync(dir)) {
      if (entry.endsWith(".html")) pages.push(`/blog/${entry.replace(/\.html$/, "")}`);
      else if (fs.existsSync(path.join(dir, entry, "index.html"))) pages.push(`/blog/${entry}`);
    }
  }
  return pages;
}

if (!fs.existsSync(OUT)) {
  console.error("out/ not found — run `npm run build` first");
  process.exit(1);
}

let broken = 0;
let checked = 0;
const known = new Set();

for (const page of blogPages()) {
  const file = pageFile(page);
  if (!file) {
    console.error(`MISSING PAGE  ${page}`);
    broken++;
    continue;
  }
  const html = fs.readFileSync(file, "utf-8");
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  const refs = new Set([...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&")));

  for (const ref of refs) {
    if (/^(https?:)?\/\//.test(ref) || /^(mailto:|tel:|data:)/.test(ref)) continue;
    checked++;
    if (ref.startsWith("#")) {
      if (ref.length > 1 && !ids.has(decodeURIComponent(ref.slice(1)))) {
        console.error(`BROKEN ANCHOR ${page} -> ${ref}`);
        broken++;
      }
      continue;
    }
    if (ref.startsWith("/_next/")) {
      if (!fs.existsSync(path.join(OUT, decodeURIComponent(ref.replace(/[#?].*$/, ""))))) {
        console.error(`MISSING ASSET ${page} -> ${ref}`);
        broken++;
      }
      continue;
    }
    if (!ref.startsWith("/")) continue;
    if (!pageFile(ref)) {
      if (KNOWN_MISSING.has(ref.replace(/[#?].*$/, "").replace(/\/+$/, ""))) {
        known.add(ref);
        continue;
      }
      console.error(`BROKEN LINK   ${page} -> ${ref}`);
      broken++;
    }
  }
  console.log(`checked ${page}`);
}

if (known.size) console.log(`known missing pages (site-wide, not counted): ${[...known].join(", ")}`);
console.log(`${checked} internal references checked, ${broken} broken`);
process.exit(broken ? 1 : 0);
