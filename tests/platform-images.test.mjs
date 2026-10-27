import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import { DEMO_BOX_IMAGE } from "../lib/demo-box.ts";

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
