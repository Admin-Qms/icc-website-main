# Guide Editorial Improvements Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans inline. The Owner explicitly authorized all seven recommendations in this conversation.

**Goal:** Improve guide creation through researched topic outlines, substantive briefs, chapter review, shared context, budget-aware corrections, actual-renderer previews and meaningful content checks.

**Architecture:** Extend the existing guide workflow on `codex/icc-software-guides`. Reuse the existing outline architect, cleaner, grammar agent, image provider and model wrapper with guide-specific instructions. Guide editorial utilities enforce content/evidence/review contracts; the website renders a development-only managed draft through its existing guide views.

**Tech Stack:** Existing Next.js 14 static export, Markdown, CommonJS Node pipeline and node:test. No new dependencies.

**Spec:** Owner-approved seven-item table in this chat; existing `docs/superpowers/specs/2026-10-12-icc-guides-design.md` supplies publication and content safeguards.

## Constraints

- Nine chapters with 3–5 subsections; each 2,000–2,200 words; introduction >=1,500; inclusive guide <=20,000.
- Only primary-source supported factual claims and verified product capabilities. Hypothetical examples must be labeled; no invented customer results.
- Preserve existing blog defaults, public URLs and published content. Use independently authored ICC code and prompts.
- A missing/skipped/failed chapter or whole-guide review blocks progression/publication. Reviews bind actual prose, briefs, research and shared context.
- Production remains a static export; preview is development-only, noindex and cannot write live content.
- No pushes, deployment or automation activation. Existing dirty/untracked Owner files remain intact.

## Review Focus

1. Changed earlier chapters invalidate downstream context/review; an old review cannot authorize a new draft.
2. A copy-edit must preserve exact links and factual numbers; skipped/rolled-back helper passes are not successful reviews.
3. A permitted chapter may still exhaust the total budget; reserve the minimum for every unwritten page.
4. Evidence references must be assigned to the relevant subsection, not simply exist somewhere in a global source list.
5. Preview environment and assets cannot become production content or leak arbitrary filesystem paths.

## Task 1 — Research-linked outlines and briefs

Files: `guideOutline.js`, existing `outlineArchitect.js`, `guideManager.js`, new `guideEditorial.js`; tests `guide-editorial.test.js`.

- [x] RED: document-control and CAPA produce different operational scopes; subsection briefs contain evidence IDs, key points, workflow decisions, evaluation criteria and neighboring boundaries. Unknown source IDs/custom malformed briefs fail.
- [x] GREEN: topic profiles plus supplied research produce validated enriched outlines; optional existing outline architect generates enriched plans from frozen evidence. Chapter-specific keywords are carried into frontmatter.

## Task 2 — Review, context and budget

Files: `guideManager.js`, `guideStore.js`, `guideEditorial.js`, existing cleaner/grammar helpers, CLI/runner; tests `guide-chapter-review.test.js`, `guide-budget.test.js`.

- [x] RED: unrevised/missing/changed predecessor reviews block the next chapter; passed reviews update a hashed glossary/example/decision context; failed/skipped helper/model passes do not advance state.
- [x] RED: accept 2,150 words when the remaining total permits it; reject impossible remaining budgets; correction addresses only named sections and preserves citations/numbers.
- [x] GREEN: chapter review runs deterministic checks, preserved copy-edit helpers and a required evidence/scope review. Existing pages require explicit review; writer does not overwrite them. Final whole-guide audit remains mandatory.

## Task 3 — Meaningful checks

Files: editorial utility, `guideQA.js`, writing skill/rules; tests `guide-editorial.test.js` and negative publication tests.

- [x] RED: empty FAQ answers, unassigned/uncited evidence and leftover image/scaffolding markers fail. A chapter lacking assigned subsections/workflow coverage fails review even at the correct length.
- [x] GREEN: combine deterministic coverage/citation/FAQ checks with explicit semantic evidence verdicts. Optional inline image markers are rejected until a provenance-aware inline workflow exists; hero briefs remain supported.

## Task 4 — Actual-renderer preview

Files: `lib/guide-preview.js` + declarations, `lib/guides.ts`, metadata/views, new `scripts/preview-guide.mjs`, CLI; tests `guide-preview.test.js` and browser QA.

- [x] RED: production preview is rejected; unsafe job/assets fail; development loads unpublished drafts without publishing them.
- [x] GREEN: the preview serves actual guide views, Markdown tables/callouts/images/TOC/navigation and a draft banner. Copy no draft into content/public; stream only allowlisted job images. Header and metadata are noindex.

## Task 5 — Verification and documentation

- [x] Run full team suite, chat/development tests, build and export link/metadata checkers; exercise actual draft preview at desktop/mobile widths.
- [x] Update writer/routine docs and progress ledger with actual results. Real pilot editorial acceptance remains separate from synthetic system tests.
- [x] One independent final review (per executing-plans), address important findings with regression tests; leave changes local.

Verification: 94/94 team tests, 24/24 chat tests and 1/1 development configuration test pass. Production build and guide/blog export checkers pass. Actual unpublished preview passed 48 page checks across 12 Chromium viewport profiles, including tables, callouts, keyboard contents, noindex and chapter boundaries. One independent review completed; important findings received RED→GREEN regressions. Real pilot/editorial acceptance and automation activation remain outside this code change.
