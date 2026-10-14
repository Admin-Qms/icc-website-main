# Implementation ledger — ICC guides

Plan: `docs/superpowers/plans/2026-10-12-icc-guides-implementation.md`
Branch: `codex/icc-software-guides`
Authorization: October 13, 2026 — Owner requested a new branch and implementation. No push or schedule activation requested.

Baseline: 33 team tests and 24 chat tests passed.

Ruling: Work on the explicitly requested new branch in the existing checkout; preserve the Owner's untracked AGENTS.md and .agents files. No extra worktree or production push is needed for implementation.
Ruling: Implement inline using executing-plans; one independent review after implementation. The graph tools are unavailable, so inspect shared-file imports directly.
Pre-flight: Contract → reader/store/QA use one shared module; drafts omit publication timestamp, final publication fills it before validation. Text audit hashes exclude imagery but include prose, metadata, links, order and research/capability snapshots. Completed-generation reports consume weekly slots even before remote release.

## Tasks

1. Shared contract and reader — complete: nine tests, full team suite (42) and build passed; local commit 52e2a8d.
2. Evidence and writing rules — research validator and rule file implemented; three research tests passing; capability candidates remain pending verification.
3. Topic queue, reservations and briefs — queue and outline implemented; Owner steering: reuse keywordResearcher for blogs/guides and query generation. Separate topic helper is now a shared utility, not an agent.
4. Resumable generation and review — reservations/checkpoints implemented; three tests pass.
5. QA, images and local publication — implemented; complete synthetic round-trip, dry-run, uniqueness and refusal-to-overwrite tests pass. Real content still needs independent editorial acceptance.
6. Website reader — implemented; empty library and ordered introduction/chapter views export. Draft renderer checks pass at 12 viewport profiles.
7. Metadata, discovery and export checks — implemented; canonical, social preview, schema JSON, sitemap and link checkers added.
8. Pilot and acceptance — real pilot remains unpublished after the earlier API writer length failure. Synthetic fixtures establish system behavior only.
9. Weekly runner — implemented for local Monday/Thursday Toronto slots; activation excluded.
10. Documentation and branch review — operating docs and one independent review completed; final important findings covered by regression tests.

Ruling: Reuse keywordResearcher at the Owner's request; retain separate guide queue and software eligibility. No separate Guide Topic Researcher role. Moved the uncommitted helper to shared/guideTopics.js after confirming no live imports of its old path.
Ruling: Next.js 14 static export rejects empty standalone dynamic parameter lists, even with force-static. Use one optional catch-all route with a guaranteed library entry; retain separate library/introduction/chapter view components and the same planned public URLs. Verified zero live imports before moving the new page files.
Ruling: Owner reproduced Next 14's dev static-export fallback error; concurrent next build also collided with the preview's .next artifacts. The custom development server now inherits production settings while omitting export-only enforcement and using .next-dev. Production next.config.mjs remains unchanged. Added a failing-then-passing development configuration test.

## Editorial improvements — Owner authorization 2026-10-13

All seven approved improvements are implemented: topic-specific research-linked outlines and rich subsection briefs; required sequential chapter review; glossary/hypothetical scenario/decision context; remaining-budget allowances and targeted subsection revisions; actual-renderer unpublished preview; substantive FAQ, evidence and scope checks. Existing cleaner/grammar/model/research/image infrastructure is reused. No new dependency was installed.

Verification: 94/94 team tests, 24/24 chat tests and 1/1 development configuration test pass. Browser QA exercised 48 guide page checks across 12 viewport profiles with a synthetic unpublished guide; confirmed no horizontal overflow, keyboard contents, chapter boundaries, actual Markdown tables/callouts, draft banner and noindex metadata/headers. This is Chromium viewport evidence, not physical-device/cross-browser or field performance evidence.

Final review: one independent reviewer. Image-root containment, signed measurements/reference-style citations, stale reviewed word counts and missing outline fields were reproduced in failing tests and corrected. Chapter-specific keyword metadata is retained. Full suite returned green after the fix pass.

Ruling: Additional inline images remain unsupported; creation rules and gates reject unresolved markers/untracked assets. Managed unique heroes meet the page-image requirement. This prevents silent loss or unlicensed inline publication.
Ruling: The real pilot and automation activation remain separate editorial/operational work; no actual article, content fixture or remote release was published as part of these code changes.

Repository-owned source, documentation, skill and retained generated briefs contain no references to the removed company. The case-insensitive scan excludes version-control internals, installed dependencies and generated Next/export artifacts. The protected skill was synchronized through approved filesystem access.

Final build: `npm run build` exit 0. Guide export checks: library 1 page, 53 internal references, metadata/canonical/schema checks pass. Existing blog export: 485 references, 0 new broken references; existing missing privacy/terms routes remain outside this change. Code diff whitespace check passes. Field performance and production deployment were not tested or performed.

Populated static-export verification: a complete synthetic guide under temporary roots exported 11 library/introduction/chapter pages; 695 internal references and all 11 metadata/canonical/schema checks passed. Synthetic images were copied only into the generated test export. A final build without the temporary content override restores the real empty guide library. No fixture entered content/ or public/.
