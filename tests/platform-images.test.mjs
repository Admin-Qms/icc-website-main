import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import { DEMO_BOX_IMAGE } from "../lib/demo-box.ts";
import { INDUSTRIES, STANDARDS } from "../lib/site.ts";
import { INDUSTRY_PHOTOS, STANDARD_PHOTOS, PHOTO_ALT } from "../lib/header-images.ts";

const root = new URL("../", import.meta.url);
const WALL = [
  "fabrication",
  "automotive",
  "medical-device",
  "aerospace",
  "food-beverage",
  "electronics",
  "receiving",
  "training",
];

test("hero wall points at the new platform photos", () => {
  const hero = readFileSync(new URL("components/home/Hero.tsx", root), "utf8");
  for (const name of WALL) {
    assert.ok(hero.includes(`/images/platform/platform-${name}.webp`), name);
  }
  assert.ok(!/qms-[a-z-]+\.png/.test(hero), "old qms-*.png still referenced");
});

test("demo box image is set and exists", () => {
  assert.ok(DEMO_BOX_IMAGE, "DEMO_BOX_IMAGE is null");
  assert.ok(DEMO_BOX_IMAGE.alt.length > 10);
  assert.ok(existsSync(new URL(`public${DEMO_BOX_IMAGE.src}`, root)));
});

test("platform images are web-sized", () => {
  const dir = new URL("public/images/platform/", root);
  const files = readdirSync(dir);
  assert.ok(files.length > 0);
  for (const f of files) {
    assert.ok(f.endsWith(".webp"), `${f} is not .webp`);
    assert.ok(statSync(new URL(f, dir)).size <= 400 * 1024, `${f} over 400 KB`);
  }
});

test("every industry and standard slug has a header photo that exists", () => {
  for (const [list, map, kind] of [
    [INDUSTRIES, INDUSTRY_PHOTOS, "industry"],
    [STANDARDS, STANDARD_PHOTOS, "standard"],
  ]) {
    for (const { slug } of list) {
      const file = map[slug];
      assert.ok(file, `${kind} ${slug} has no photo`);
      assert.ok(existsSync(new URL(`public/images/platform/${file}`, root)), `${file} missing`);
      assert.ok(PHOTO_ALT[file] && PHOTO_ALT[file].length > 10, `${file} has no alt`);
    }
  }
});

test("industry and standard pages pass the header photo", () => {
  for (const f of ["app/industries/[industry]/page.tsx", "app/services/[standard]/page.tsx"]) {
    assert.ok(readFileSync(new URL(f, root), "utf8").includes("HeaderPhoto"), f);
  }
});

test("the unused share-card background is not shipped", () => {
  assert.ok(!existsSync(new URL("public/images/platform/og-platform-bg.webp", root)));
});

test("demo box image dimensions match the square photo", () => {
  const box = readFileSync(new URL("components/SoftwareDemoBox.tsx", root), "utf8");
  assert.ok(box.includes("width={600}") && box.includes("height={600}"));
});
