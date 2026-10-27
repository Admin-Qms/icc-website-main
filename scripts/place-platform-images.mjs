#!/usr/bin/env node
// Optimizes the Owner's platform photos into public/images/platform/*.webp,
// builds the share card (public/images/og-default.jpg), then moves the source
// PNGs to ~/Downloads/icc-platform-images/ (never deletes them).
// Usage: node scripts/place-platform-images.mjs [sourceDir]
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, renameSync, copyFileSync, unlinkSync, statSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(new URL("../team/package.json", import.meta.url));
const sharp = require("sharp");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/images/platform");
const sourceDir = path.resolve(process.argv[2] ?? outDir);
const archiveDir = path.join(homedir(), "Downloads/icc-platform-images");

const PHOTOS = [
  "fabrication", "automotive", "medical-device", "aerospace", "food-beverage",
  "electronics", "receiving", "training", "environmental", "safety",
  "infosec", "continuity", "lab",
].map((n) => `platform-${n}`);
const NAMES = [...PHOTOS, "og-platform-bg", "demo-box-tablet"]; // the 15 inputs

// Find each input in the source dir, falling back to the archive (re-runs).
const found = new Map();
const missing = [];
for (const n of NAMES) {
  const f = `${n}.png`;
  const a = path.join(sourceDir, f);
  const b = path.join(archiveDir, f);
  if (existsSync(a)) found.set(n, a);
  else if (existsSync(b)) found.set(n, b);
  else missing.push(f);
}
if (missing.length) {
  console.error(`Missing source files (nothing written): ${missing.join(", ")}`);
  process.exit(1);
}

const kb = (p) => `${(statSync(p).size / 1024).toFixed(0)} KB`;
const report = (p) => console.log(`${path.relative(root, p)}  ${kb(p)}`);

mkdirSync(outDir, { recursive: true });

for (const n of PHOTOS.concat("og-platform-bg")) {
  const out = path.join(outDir, `${n}.webp`);
  await sharp(found.get(n))
    .resize(1672, 941, { fit: "cover", position: sharp.strategy.attention })
    .webp({ quality: 80 })
    .toFile(out);
  report(out);
}
{
  const out = path.join(outDir, "demo-box-tablet.webp");
  await sharp(found.get("demo-box-tablet")).resize(600, 600, { fit: "cover" }).webp({ quality: 82 }).toFile(out);
  report(out);
}

// Share card: darkened photo, logo mark, name, headline, standards line.
const W = 1200, H = 630;
const bg = await sharp(found.get("og-platform-bg"))
  .resize(W, H, { fit: "cover", position: sharp.strategy.attention })
  .toBuffer();
const mark = await sharp(path.join(root, "public/images/logo-mark.png")).resize(80, 80).toBuffer();
const FONT = "'DejaVu Sans', Helvetica, Arial, sans-serif";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<rect width="${W}" height="${H}" fill="#0d1a30" fill-opacity="0.55"/>
<g font-family="${FONT}">
<text x="176" y="212" font-size="29" fill="#ffffff">ISO Certification Consultants</text>
<text x="74" y="330" font-size="60" fill="#ffffff">Stop managing compliance.</text>
<text x="74" y="405" font-size="60" fill="#ffffff">Start automating it.</text>
<text x="74" y="474" font-size="23" fill="#8be9dc">ISO 9001 · IATF 16949 · AS9100 · ISO 13485 · ISO 14001 · ISO 45001</text>
</g></svg>`;
const card = path.join(root, "public/images/og-default.jpg");
await sharp(bg)
  .composite([{ input: Buffer.from(svg) }, { input: mark, left: 74, top: 152 }])
  .jpeg({ quality: 85 })
  .toFile(card);
report(card);

// Move the sources out of public/ (never delete; never overwrite different content).
mkdirSync(archiveDir, { recursive: true });
const skipped = [];
let moved = 0;
for (const n of NAMES) {
  const src = found.get(n);
  if (path.dirname(src) === archiveDir) continue;
  const dest = path.join(archiveDir, `${n}.png`);
  if (existsSync(dest)) {
    if (readFileSync(dest).equals(readFileSync(src))) {
      unlinkSync(src); // identical copy already archived
      moved++;
    } else {
      skipped.push(src);
    }
    continue;
  }
  try {
    renameSync(src, dest);
  } catch {
    copyFileSync(src, dest);
    unlinkSync(src);
  }
  moved++;
}
console.log(`Sources archived in ${archiveDir}: ${moved}`);
if (skipped.length) console.warn(`SKIPPED (different file already in archive, left in place): ${skipped.join(", ")}`);
