# Platform Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the Owner's 15 Codex images on the site: the home hero wall, the industry and standard page headers, the "Book a demo" box and the share card. The images are optimized so the site ships light files.

**Architecture:**
- A one-off Node script (`scripts/place-platform-images.mjs`) uses `sharp` from `team/node_modules` to read the Owner's PNGs and write optimized files into `public/images/`. The outputs are WebP for photos, plus a composited JPG share card with the headline drawn from SVG.
- A small mapping module (`lib/header-images.ts`) assigns a photo to every industry and standard slug.
- `PageHeader`'s existing `visual` slot shows the photo through a `HeaderPhoto` component.
- The Owner's large source PNGs move out of `public/` so they are not shipped.

**Tech Stack:** Next.js 14 static export, `sharp` (already a `team/` dependency), `node --test`.

**Spec:**
- `docs/superpowers/specs/2026-10-26-platform-positioning-images.md` (the 15-image placement table).
- `docs/image-prompts/README.md`.
- Plan Task 15 of `docs/superpowers/plans/2026-10-26-platform-positioning.md`.
- The imagery artifact `https://claude.ai/artifact/2stDLWatyLVTdxwQwrKfsD`, which shows the industry header with its photo.

## Global Constraints

- **Source files.** These are `public/images/platform/*.png`: 14 images at 1536×1024 and `demo-box-tablet.png` at 1254×1254. The `platform-*.png` names match `docs/image-prompts/README.md`.
- **Outputs.**
  - Photos go to `public/images/platform/<name>.webp` at 1672×941 (cover, `attention` gravity), quality 80.
  - `demo-box-tablet.webp` is 600×600, quality 82.
  - `public/images/og-default.jpg` is 1200×630, quality 85, and replaces the old card.
  - Each WebP should be at most about 300 KB.
- **Source PNGs are not shipped.** After processing, they move to `~/Downloads/icc-platform-images/`, the location the image brief named. They are never deleted. `public/images/platform/` then holds only the WebP outputs.
- **Old hero PNGs stay** in `public/images/hero/`. Only references change.
- **Layout.**
  - The home hero wall keeps its layout and its 8 captions (label + standard). Only `src` and `alt` change.
  - Industry and standard headers use `PageHeader`'s `visual` slot. Module pages keep their loops, and nothing else changes.
- **Alt text.** Each photo describes its scene in plain words, with no brand.
- **Share card.** It reads "ISO Certification Consultants", then the headline "Stop managing compliance. Start automating it.", then "ISO 9001 · IATF 16949 · AS9100 · ISO 13485 · ISO 14001 · ISO 45001". The logo mark comes from `public/images/logo-mark.png`. Text is white or light teal on a darkened photo (navy overlay `#0d1a30` at about 55%). The fonts are an available sans (DejaVu Sans or Helvetica via SVG `font-family` fallback), at the layout of the current card.
- **Process rules.**
  - Run `npm run build` only in the last task.
  - Commits are one line, with no co-author trailer.
  - Don't push.
  - Never commit `out/` or `.next/`.

## Review Focus

- A missing source file: the script must exit non-zero and name it, not write partial output.
- An industry or standard slug without a mapping: the header must render normally, with no empty column. A test asserts that every slug is mapped.
- Large-file regressions: no file over 400 KB under `public/images/platform/` after processing (test).
- Share-card text overflow: the headline must stay inside 1200×630 with margins. The task's one visual check covers it.
- Narrow screens: the header photo fits 360px with no horizontal scroll.

---

### Task 1: Process the images and update the home wall, demo box and share card

**Files:**
- Create: `scripts/place-platform-images.mjs`, `tests/platform-images.test.mjs`
- Modify: `components/home/Hero.tsx` (`HERO_IMAGES` src/alt), `lib/demo-box.ts` (`DEMO_BOX_IMAGE`), `package.json` (add the test to `test:site`), `public/images/og-default.jpg` (regenerated)
- Generated: `public/images/platform/*.webp` (15)

**Interfaces:**
- Produces:
  - `scripts/place-platform-images.mjs [sourceDir]`. The default source is `public/images/platform`. It loads `sharp` via `createRequire(new URL("../team/package.json", import.meta.url))`, writes the outputs and then moves the PNGs to `~/Downloads/icc-platform-images/`, creating the folder if needed.
  - The script checks that all 15 inputs exist before writing anything. It prints one line per output with its size.
  - It is safe to re-run, because it reads from `~/Downloads/icc-platform-images/` when the PNGs have already moved.

**Hero wall mapping** (captions unchanged):

| Hero card | New file |
| --- | --- |
| Fabrication / ISO 9001 | `platform-fabrication.webp` |
| Automotive / IATF 16949 | `platform-automotive.webp` |
| Medical devices / ISO 13485 | `platform-medical-device.webp` |
| Aerospace / AS9100 | `platform-aerospace.webp` |
| Food & beverage / ISO 22000 | `platform-food-beverage.webp` |
| Electronics / ISO 9001 | `platform-electronics.webp` |
| Receiving / ISO 9001 | `platform-receiving.webp` |
| Training / Implementation | `platform-training.webp` |

Alt text follows the scene in `docs/image-prompts/0N-*.md`.

`DEMO_BOX_IMAGE` is `{ src: "/images/platform/demo-box-tablet.webp", alt: "Tablet showing a compliance dashboard beside a machined part and caliper on a workbench" }`.

- [ ] **Step 1: Failing test** in `tests/platform-images.test.mjs`:
  - `"hero wall points at the new platform photos"`: read `components/home/Hero.tsx` and assert that it references all 8 `platform-*.webp` names above, and no `qms-*.png`.
  - `"demo box image is set and exists"`: the `DEMO_BOX_IMAGE` src exists in `public`.
  - `"platform images are web-sized"`: every file in `public/images/platform/` is `.webp` and at most 400 KB.
- [ ] **Step 2:** Run it and expect a FAIL.
- [ ] **Step 3:** Write and run the script, then update `Hero.tsx` and `demo-box.ts`.
- [ ] **Step 4: One visual check.** Read the new `og-default.jpg` and two hero WebPs, and fix any text overflow in the card.
- [ ] **Step 5:** Run `npm run test:site` and expect PASS. Commit with `git commit -m "Platform images: optimized photos, home wall, demo box and share card"`.

### Task 2: Industry and standard page header photos

**Files:**
- Create: `lib/header-images.ts`, `components/HeaderPhoto.tsx`
- Modify: `app/industries/[industry]/page.tsx`, `app/services/[standard]/page.tsx` (pass `visual`), `tests/platform-images.test.mjs`

**Interfaces:**
- Produces:
  - `INDUSTRY_PHOTOS: Record<string, string>` and `STANDARD_PHOTOS: Record<string, string>`, keyed by slug, with values that are file names under `/images/platform/`.
  - `PHOTO_ALT: Record<string, string>`, keyed by file name.
  - `HeaderPhoto({ src, alt }: { src: string; alt: string })` is a rounded, bordered 16:10 `next/image` (`unoptimized`, `fill`, `object-cover`, sizes for about 520px). It matches the home wall cards' look, without the caption band. Use `priority` because it is above the fold.
- **Industries:**
  - manufacturing → fabrication
  - automotive → automotive
  - aerospace-defence → aerospace
  - healthcare-medical-devices → medical-device
  - food-beverage → food-beverage
  - oil-gas-energy → continuity
  - construction → safety
  - mining-natural-resources → environmental
- **Standards:**
  - iso-9001 → electronics
  - iatf-16949 → automotive
  - as9100 → aerospace
  - iso-13485 → medical-device
  - iso-14001 → environmental
  - iso-45001 → safety
  - iso-27001 → infosec
  - iso-22000 → food-beverage
  - iso-22301 → continuity
  - iso-17025 → lab

- [ ] **Step 1: Failing tests:**
  - `"every industry and standard slug has a header photo that exists"`: import `INDUSTRIES`, `STANDARDS` from `../lib/site.ts` and the maps from `../lib/header-images.ts`. Every slug must be mapped, every file must exist and every alt must be non-empty.
  - `"industry and standard pages pass the header photo"`: a string check that both pages reference `HeaderPhoto`.
- [ ] **Step 2:** Implement, then check one industry page and one standard page at 360px and 1440px (DevTools-protocol method, see `.superpowers/sdd/2026-10-27-product-loops/task-1-report.md`).
- [ ] **Step 3:** Update `docs/superpowers/specs/2026-10-26-platform-positioning-images.md` and `docs/image-prompts/README.md` "Used on" columns so they match the final mapping.
- [ ] **Step 4:** Run `npm run test:site`, `npm --prefix team test`, `npm run build` and `node --test tests/positioning-build.test.mjs`. All must PASS.
- [ ] **Step 5:** Commit with `git commit -m "Platform images: industry and standard page header photos"`.
