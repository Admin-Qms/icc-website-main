# ICC Software Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task after the Owner authorizes implementation. Steps use checkbox syntax for tracking. This document does not authorize implementation, delegation, an automation or a remote push.

**Goal:** Build independently authored, researched, multi-page software guides for Canadian quality and operations teams, with two complete guides generated each week and publication blocked until all required checks pass.

**Architecture:** Add a dedicated guide queue, evidence register, resumable drafting workflow, shared content contract and Markdown publishing path alongside the existing blog. Next.js reads published guide bundles at build time and exports a guide library, introduction/contents pages and chapter pages. Separate generation, local publication and production release so an incomplete draft or failed check cannot reach the live site.

**Tech Stack:** Existing Next.js 14, React, TypeScript, Tailwind, gray-matter, react-markdown, remark-gfm, Node.js >=22, node:test, commander and the existing team sharp/image providers. No new production dependency is planned.

**Spec:** `docs/superpowers/specs/2026-10-12-icc-guides-design.md`. Read it before executing any task.

**Status:** Proposed implementation plan, October 12, 2026. No production code, guide content, queue, automation or Git configuration was changed to produce this plan.

## Global Constraints

- Pinnacle is a read-only reference. No source code, dependencies, infrastructure, prompts or content are copied from it into ICC.
- The production target is two complete guides per week, in addition to the existing daily blog.
- Initial guides contain nine chapters, each 2,000–2,200 words, and an introduction of at least 1,500 words; the inclusive overall total is 18,000–20,000 words.
- Target 2,000 words per chapter and 1,500 words for the introduction: 19,500 words overall.
- Each chapter has 3–5 top-level body subsections; the page renders its title as its only H1.
- Cover 8–10 distinct FAQs across the guide and end with a software-demonstration invitation linking to `/contact/`.
- Use third person or direct address; use ICC's existing US spelling convention.
- Do not invent features, statistics, testimonials, customer results or quotations. Hypothetical scenarios begin with `**Illustrative example:**` and describe unnamed organizations.
- Every page needs a unique title, a 120–160-character meta description, a target keyword and a unique image brief.
- Every introduction and chapter needs its own unique licensed 1200×675 hero image before publication.
- External URLs must appear in `team/data/external-link-bank.json` and support the associated claims.
- A required claims audit must be completed, current and passing; unavailable credentials or an audit error block publication.
- The legacy mega-article path remains switched off. Existing blogs and their frontmatter contract must continue working.
- The initial implementation does not modify `app/layout.tsx`, `next.config.mjs` or `team/agents/shared/config.js`.
- Before a shared-file change, inspect graph impact if available; otherwise trace imports. A file with more than ten importers requires the Owner's explicit approval under the core-file rule.
- Commits stay local until the Owner asks for a push. Run the build before committing; pull before pushing and rerun checks if the pull changes checked inputs.
- Guide automation and its publication authority are separate from the existing blog's standing approval.

## Review Focus

1. **Partial or malformed bundles:** A manifest referencing a missing, duplicated, out-of-order or path-traversing chapter must fail before local publication. Tasks 1, 5 and 6 own these checks.
2. **Unsupported or stale claims:** Missing evidence, an unverified capability, skipped audits or edits after review must block release. Tasks 2, 4 and 5 own these checks.
3. **Duplicate work after interruption:** Concurrent selectors, expired reservations, retries and repeated weekly slots must not create a second guide for the same topic. Tasks 3, 4 and 9 own these checks.
4. **Publication racing with another machine:** A pulled blog commit must be included in the final checks; a conflicting guide topic or reused image must block the guide release. Tasks 5 and 9 own these checks.
5. **Long-page usability and inherited metadata:** A mobile reader must reach contents, FAQs and adjacent chapters; every chapter must have its own canonical, social preview, title and description. Tasks 6–8 own these checks.

## Observed repository state

The active blog pipeline is documented in `team/README.md`. `keywordResearcher.availableKeywords()` filters published keywords and `pickKeyword()` asks a model to select an eligible queue entry. Guide topic selection should follow that constrained-selection pattern, with its own software-oriented queue and reservations.

`lib/blog.ts` is the site's Markdown reader; `team/agents/shared/contentStore.js` is the pipeline's matching writer. Add the equivalent guide contract without changing either blog frontmatter contract.

`team/agents/content/contentManager.js` contains a legacy mega pipeline that publishes to Sanity and logs publication despite failed QA. Do not call or reactivate it. `contentQA.validateLocal()` has useful exported style checks but treats an unavailable claims audit as skipped/pass. Reuse individual checks only where appropriate; the new guide gate controls its own required audit outcomes.

`lib/site.ts` contains ICC's current module catalogue. The referenced `docs/website-content-refresh-prompt.md` is absent. `AGENT-COMPANY-ORG.md` is also absent. Establish verified replacements during implementation, not invented historical records.

The supplied Pinnacle AWS repository uses a section outline, context digest, source findings and style profile to generate organizational QMS documents. No public guide pipeline was found. This plan uses the Owner's guide structure; exact visual/content parity remains pending a public guide example.

## File ownership and proposed changes

| File or directory | Responsibility |
|---|---|
| `lib/guide-contract.js` and `lib/guide-contract.d.ts` | Pure shared parsing, structural validation, word counting, ordering and route helpers; usable by Node and Next.js |
| `lib/guides.ts` | Typed build-time reader for complete published bundles |
| `team/agents/shared/guideConfig.js` | Guide paths, timezone and immutable production policy; isolated test paths |
| `team/agents/shared/guideStore.js` | Draft checkpoints, reservations, published bundles and local filesystem writes |
| `team/agents/content/guideTopicResearcher.js` | Approved topic selection and candidate suggestions |
| `team/agents/content/guideResearch.js` | Evidence snapshots and capability/source validation |
| `team/agents/content/guideOutline.js` | Nine-chapter scope, metadata and word budgets |
| `team/agents/content/guideManager.js` | Brief, resume, checkpoint, review and local publication orchestration |
| `team/agents/content/guideQA.js` | Blocking chapter and whole-guide checks |
| `team/agents/content/guideImages.js` | Per-page image briefs, sourcing, cropping and provenance |
| `team/agents/shared/guideCadence.js` | Two weekly production slots and duplicate/catch-up rules |
| `team/data/software-capabilities.json` | Verified ICC feature statements and limitations |
| `team/data/guide-writing-rules.md` | Software-guide-specific writing requirements |
| `team/memory/guide-topic-queue.json` | Approved software topic candidates; completion derived from published manifests |
| `.agents/skills/write-software-guide/SKILL.md` | Codex instructions for separate introduction/chapter writing and review |
| `content/guides/<slug>/` | Published manifest, introduction and separate chapter Markdown |
| `public/images/guides/<slug>/` | Unique processed guide images |
| `app/guides/page.tsx` | Guide library |
| `app/guides/[guide]/page.tsx` | Introduction and ordered contents |
| `app/guides/[guide]/[chapter]/page.tsx` | Chapter page and metadata |
| `components/guides/GuideCard.tsx` | Library card |
| `components/guides/GuideContents.tsx` | Desktop/mobile contents and current chapter |
| `components/guides/GuideChapterNavigation.tsx` | Previous, next and contents destinations |
| `team/scripts/check-guide-links.js` | Exported page, image and anchor verification |
| `team/scripts/check-guide-metadata.js` | Exported canonical, title, description, share-image and JSON-LD checks |
| `team/scripts/scheduled-guide-run.sh`, `team/GUIDE-ROUTINE.md` | Separate scheduled guide runner and its restricted prompt |
| `team/tests/guide-*.test.js` | Contract, research, selector, checkpoint, QA, publication and cadence tests |

Modify `team/pm.js` only to register the new guide CLI; `app/sitemap.ts` and `components/Navbar.tsx` to expose guides; `team/agents/shared/siteRoutes.js` to discover guide routes; and `team/agents/shared/imageRegistry.js` to discover published guide images. Update `team/README.md`, the relevant knowledge-base records and `team/.gitignore` for the actual workflow. Register guide roles in `AGENT-COMPANY-ORG.md` and `teamAuditor.js` without scheduling the legacy agents.

## Shared contracts

The names below are fixed interfaces for the implementation tasks. Type declarations belong in `lib/guide-contract.d.ts`; Node exports belong in `lib/guide-contract.js`.

```ts
export type GuideImage = {
  src: string; alt: string; width: 1200; height: 675;
  source: string; sourceId: string; sha256: string;
  licenseUrl: string; credit?: string; creditUrl?: string;
};
export type GuidePage = {
  slug: string; title: string; description: string;
  primaryKeyword: string; keywords: string[];
  author: string; date: string; updated?: string;
  body: string; wordCount: number; readTime: number;
  imageBrief: string; image?: GuideImage;
  sourceIds: string[]; capabilityIds: string[];
};
export type SourceEvidence = {
  id: string; title: string; publisher: string; url: string;
  retrievedAt: string; supportedClaims: string[];
};
export type GuideManifest = {
  schemaVersion: 1; topicId: string; slug: string;
  title: string; description: string; primaryKeyword: string;
  keywords: string[]; audience: string; author: string;
  date: string; publishedAt: string; updated?: string;
  introductionFile: 'introduction.md';
  chapters: { slug: string; file: string }[];
  sources: SourceEvidence[];
  capabilitySnapshotHash: string; researchSnapshotHash: string;
  productionSlotId?: string;
};
export type GuideBundle = { manifest: GuideManifest; introduction: GuidePage; chapters: GuidePage[] };
export type GuideDraftManifest = Omit<GuideManifest, 'publishedAt'> & {publishedAt?: string};
export type GuideDraftBundle = Omit<GuideBundle, 'manifest'> & {manifest: GuideDraftManifest};
export type GateCheck = { id: string; pass: boolean; page?: string; message: string };
export type GateReport = { pass: boolean; checks: GateCheck[]; failures: GateCheck[]; wordCount: number };
export type TextAudit = {
  inputHash: string; reviewer: string; reviewedAt: string;
  claims: 'passed' | 'failed' | 'unavailable';
  consistency: 'passed' | 'failed' | 'unavailable';
  repetition: 'passed' | 'failed' | 'unavailable';
  unresolvedFindings: string[];
};
```

Published Markdown contains page metadata in frontmatter and body below it. The publisher calculates `wordCount` and `readTime`. The introduction's slug equals the guide slug; chapter slugs match their manifest entries. `chapters[].file` must equal `chapters/<chapter-slug>.md`; arbitrary paths and symlinks outside the bundle are rejected. Page dates normalize to `YYYY-MM-DD`, and no date may be in the future. `publishedAt` is generated as an ISO timestamp at local publication.

Draft manifests omit publication-only fields until local publication. Maintain a separate `state.json`; do not add draft workflow status to the published contract. The draft schema uses `GuideDraftManifest`; it is validated as a draft until the publisher builds a candidate `GuideBundle` with the actual publication timestamp. Final QA validates that complete candidate before any published content is written.

`hashGuideInputs()` uses canonically serialized title/description/keyword assignments, Markdown prose with standalone image markers/image blocks removed, ordered link targets, source/capability assignments, chapter order and research/capability snapshot hashes. Object keys are sorted; arrays retain their meaningful order. Exclude generated image metadata, word counts, reading times and publication timestamps. This permits image-only replacements to reuse text reviews while a changed claim, link, chapter order or source invalidates them. The final publication report additionally hashes the complete serialized bundle and every image, so all final checks refer to the exact release artifact. These hashes catch stale checks; they are not a claim that the evidence itself is authentic.

Public APIs:

```ts
export function countGuideWords(markdown: string): number;
export function parseGuidePage(raw: string): GuidePage;
export function validateGuideStructure(bundle: GuideBundle | GuideDraftBundle, options?: {now?: Date; phase?: 'draft' | 'published'}): GateReport;
export function guideRoutes(manifest: GuideManifest): string[];
export function chapterNeighbors(manifest: GuideManifest, slug: string): {
  previous: string | null; next: string | null; contents: string;
};
export function hashGuideInputs(bundle: GuideBundle): string;
```

The pipeline adds `validateGuide(bundle, {audit, evidence, existingContent, existingImages})`, returning `Promise<GateReport>`. The structural validator's default phase is published; draft checks explicitly use the draft phase, and local publication always uses published. Production always uses the fixed policy; no CLI flag disables a check or lowers word limits.

## Proposed command surface

These commands are implementation targets and do not exist yet. All paths are fixture/job inputs, never shell-interpolated commands.

| Command | Behavior and successful output |
|---|---|
| `node team/pm.js guide topics list` | Show candidate approval, priority, evidence readiness, reservation and publication status |
| `node team/pm.js guide topics suggest` | Print researchable software topic candidates; do not approve or publish them |
| `node team/pm.js guide brief --topic-id document-control` | Reserve the selected approved topic and create its draft job and initial briefs |
| `node team/pm.js guide brief --next` | Select the next eligible approved topic; print `GUIDE_BRIEF <folder>` or `NOTHING_TO_GENERATE` |
| `node team/pm.js guide research --fixture <research.json>` | Validate and checkpoint freshly retrieved primary-source evidence for the assigned job; cannot edit the capability register or link bank |
| `node team/pm.js guide checkpoint --job <job-id> --page <slug>` | Parse the written page, save its content hash and report chapter checks |
| `node team/pm.js guide resume --job <job-id>` | Print the next incomplete stage/page and invalidate checks whose inputs changed |
| `node team/pm.js guide validate --fixture <guide.json>` | Run current required audits and deterministic checks; exit nonzero on any required failure |
| `node team/pm.js guide preview --fixture <guide.json>` | Produce a report/staged preview without exposing content as a published guide |
| `node team/pm.js guide publish --fixture <guide.json> --dry-run` | Run the complete final gate and image steps; write only draft/report artifacts |
| `node team/pm.js guide publish --fixture <guide.json>` | Write one complete validated guide locally and print its exact new-file allowlist; does not push |

After topic reservation, primary sources are freshly retrieved from already approved URLs. The research command checkpoints those findings before final outline/brief freezing and chapter writing. The routine may prepare a research fixture using its authorized web tools; it cannot invent capabilities or add an unapproved external URL. A changed source can block the job for a pre-run facts/link-bank update. The initial brief is a job-level assignment; only the research-ready final chapter briefs authorize chapter writing.

## Task 1 — Establish the shared contract and filesystem reader

**Files:** Create the three `lib/guide*` files, `guideConfig.js`, the read/checkpoint portion of `guideStore.js`, `team/tests/helpers/guideFixture.js`, and `team/tests/guide-contract.test.js`.

**Consumes:** The contracts and fixed policy above. **Produces:** The shared functions above and `getAllGuides()`, `getGuide(slug)`, `getGuideChapter(guideSlug, chapterSlug)` from `lib/guides.ts`.

- [ ] Write structural fixtures that deliberately contain synthetic repeated text only for counting, ordering and malformed-input tests. Do not submit these fixtures to an editorial audit or treat them as publishable writing.
- [ ] Implement the fixture helper with an exact visible-word budget: divide each chapter's requested count between four H2 subsections, account for heading words, and fill the remainder with neutral test words. `structuralBundle({chapters = 9, chapterWords = 2000, introductionWords = 1500})` returns a complete in-memory bundle with legal slugs, dates, metadata and distinct synthetic image/source metadata used only in isolated tests.
- [ ] Write the following tests before the production functions exist, and verify that they fail for the missing behavior.

```js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { structuralBundle } = require('./helpers/guideFixture');
const { validateGuideStructure, chapterNeighbors } = require('../../lib/guide-contract');

test('nine chapters plus introduction fit the inclusive word budget', () => {
  const report = validateGuideStructure(structuralBundle());
  assert.equal(report.wordCount, 19500);
  assert.equal(report.pass, true);
});
test('individually valid chapter lengths cannot exceed the overall budget', () => {
  const report = validateGuideStructure(structuralBundle({chapterWords: 2200}));
  assert.equal(report.pass, false);
  assert.ok(report.failures.some(x => x.id === 'total-words'));
});
test('the last chapter has no next destination', () => {
  const bundle = structuralBundle();
  const last = bundle.manifest.chapters.at(-1).slug;
  assert.equal(chapterNeighbors(bundle.manifest, last).next, null);
});
```

- [ ] Add tests for ten chapters, 1,999/2,201-word chapters, a 1,499-word introduction, duplicate filenames/slugs, missing chapters, `../../` file paths, invalid frontmatter, future dates, duplicate titles and first-chapter previous navigation. Date-specific tests pass a fixed `options.now`; production uses the actual clock and the CLI offers no date-check override.
- [ ] Implement strict parsing and typed errors; fail the build on a malformed published bundle. An absent guide directory returns an empty list. Read chapters in manifest order, not alphabetical filename order. The build-time reader must validate completeness but perform no network/model calls or writes.
- [ ] Match visible word counting to ICC's tested blog behavior, with tests covering tables, headings, links, image markers and YAML removal. Keep the new shared module independent of `team/` so the site build cannot load credentials or agent infrastructure.
- [ ] Run `node --test team/tests/guide-contract.test.js`, `npm --prefix team test`, and `npm run build`. Commit only this task after a passing build; describe the shared contract and its purpose.

## Task 2 — Establish software evidence and guide writing rules

**Files:** Create `software-capabilities.json`, `guide-writing-rules.md`, `guideResearch.js`, and `team/tests/guide-research.test.js`. Review and extend `external-link-bank.json` only with verified primary sources. Add the new writing skill after reading the applicable skill-creation instructions at execution time.

**Consumes:** ICC module candidates and primary-source material. **Produces:** `validateResearchPack(pack, capabilityRegister, allowedUrls)` and `prepareResearchSnapshot(topic, pack)`, each returning explicit evidence findings; the latter returns a frozen snapshot/hash only if the former passes.

- [ ] Establish a register entry schema: `id`, `moduleSlug`, `allowedClaim`, `limitations`, `evidence`, `verifiedBy`, `verifiedAt`, and `status` (`pending`, `verified`, `retired`). Seed candidates from `MODULES`; mark them pending until validated by product evidence or the Owner's domain verification.
- [ ] Research the selected software workflow using standards publishers, official government sources and official product documentation. Record exactly what each source supports. Do not use search snippets as final evidence or claim ISO certification is guaranteed by software.
- [ ] Add required external URLs to the link bank before generating briefs. Record failed retrievals as unresolved; do not replace inaccessible technical requirements with guessed clause references.
- [ ] Write the rule file and skill around software actions, roles, inputs, approval decisions, records, exceptions, implementation and evaluation. Preserve the no-fabrication/voice/spelling rules but do not blindly inherit blog-specific section, source-count or closing rules. Every chapter brief assigns its own useful links.
- [ ] Use this research test and add missing-source, retired-capability, missing-limitation and non-allowlisted-URL cases.

```js
test('a pending feature cannot become a product claim', () => {
  const register = [{id: 'doc-approval', moduleSlug: 'document-control',
    allowedClaim: 'Configured document approval workflow', limitations: [],
    evidence: [], verifiedBy: '', verifiedAt: '', status: 'pending'}];
  const pack = {sourceIds: [], capabilityIds: ['doc-approval'], sources: []};
  const report = validateResearchPack(pack, register, new Set());
  assert.equal(report.pass, false);
  assert.ok(report.failures.some(x => x.id === 'capability-unverified'));
});
```

- [ ] The writing skill reads the frozen brief, writes only its assigned Markdown, performs its self-check and checkpoints it. It cannot approve a capability, edit a brief, change the queue or relax the gate.
- [ ] Run the focused research tests, full team tests and build; commit the evidence/rules task. If a feature remains unverified, exclude it from the guide rather than treating it as established.

## Task 3 — Implement topic selection, reservations and guide briefs

**Files:** Create `guide-topic-queue.json`, `guideTopicResearcher.js`, `guideOutline.js`, `team/tests/guide-topics.test.js` and `team/tests/guide-outline.test.js`; extend draft storage with reservations. Register initial `guide` commands in `team/pm.js`.

**Consumes:** Approved queue entries, published manifests, active jobs and verified evidence. **Produces:** `selectGuideTopic({topicId, topicText, queue, publishedTopicIds, reservedTopicIds})`, `reserveGuideTopic(topic, jobRoot)`, `validateGuideOutline(outline)` and `prepareGuideBrief(topic, research)`.

- [ ] Queue entries use `id`, `topic`, `aliases`, `primaryKeyword`, `secondaryKeywords`, `moduleSlugs`, `audience`, `problem`, `priority`, `approval`, and `evidenceIds`. Only `approval: approved` entries qualify for automatic selection.
- [ ] Seed a small proposed backlog covering document control, CAPA, supplier quality, audit management and training competence. Match aliases using normalized case, whitespace and punctuation; do not collapse genuinely different topics solely because they share a keyword.
- [ ] `--topic` matches an approved topic/alias. An unknown topic is reported as a candidate requiring research and approval rather than silently substituted. A direct Owner assignment can create an explicitly recorded approved topic through the interactive preparation path; scheduled runs cannot perform that administrative operation.
- [ ] Filter published/reserved IDs first, then order by explicit priority and stable topic ID. Candidate suggestions may use a model; core selection remains deterministic and explainable. Published blog topics remain eligible unless guide-level scope/overlap review finds duplication.
- [ ] Reserve through an exclusive filesystem create in the persistent draft store. Save topic ID, job ID, host, creation time and progress. A second process gets a clear reservation conflict. An interrupted reservation is reconciled with its checkpoint; it is never silently deleted on a timer.

```js
test('a published or reserved topic cannot be selected again', () => {
  const queue = [
    {id: 'document-control', approval: 'approved', priority: 1},
    {id: 'supplier-quality', approval: 'approved', priority: 2},
    {id: 'audit-workflows', approval: 'approved', priority: 3}
  ];
  const picked = selectGuideTopic({queue,
    publishedTopicIds: new Set(['document-control']),
    reservedTopicIds: new Set(['supplier-quality'])});
  assert.equal(picked.id, 'audit-workflows');
});
```

- [ ] Validate the model's outline rather than truncating or repairing its structure silently. Require nine chapter scopes, distinct titles/slugs, 3–5 subsection briefs, source/capability assignments, 8–10 FAQ questions and the allocated overall budget. Freeze valid metadata and stable URLs.
- [ ] Emit `brief.md`, `guide.json`, `research.json`, `state.json`, `introduction-brief.md` and `chapter-briefs/<slug>.md` into `team/drafts/guides/<job-id>/`. Print `GUIDE_BRIEF <folder>` or an explicit failure/skipped result. No content enters the published directories.
- [ ] Run topic, reservation and outline tests, all team tests and the build; commit this task locally.

## Task 4 — Implement resumable chapter generation and review

**Files:** Create `guideManager.js` and `team/tests/guide-checkpoints.test.js`; extend `guideStore.js`; complete `.agents/skills/write-software-guide/SKILL.md` and `guide` checkpoint/resume commands.

**Consumes:** Frozen brief/research files and individually written Markdown. **Produces:** `prepareGuide(options)`, `checkpointGuidePage(jobId, pageSlug)`, `resumeGuide(jobId)`, and `reviewGuide(jobId, reviewers)`.

- [ ] Use the job states `reserved → research-ready → outlined → writing → reviewing → ready-for-images → ready-for-publication → locally-published → released`. Failure records the failed stage and retained valid checkpoints. A page separately records `pending`, `written`, `validated`, and `reviewed`.
- [ ] Generate chapter bodies individually through the writing skill. A chapter's context includes the guide's terminology and scope, its own research, assigned links, boundaries against neighboring chapters and summaries of completed chapters. Write sequentially for the initial pilot. Write the final introduction against the completed guide, then verify its promised coverage.
- [ ] Save each checkpoint atomically using a temporary state file and rename. Track exact body hashes, brief hash, research hash, capability hash and summary. A changed scope invalidates dependent summaries and whole-guide review; a changed body invalidates its own review and whole-guide review.

```js
test('editing a reviewed chapter invalidates publication readiness', async () => {
  const job = await createCheckpointTestJob();
  await checkpointGuidePage(job.id, job.chapterSlug);
  await storeTestAudit(job.id, {inputHash: job.currentHash,
    claims: 'passed', consistency: 'passed', repetition: 'passed'});
  await appendChapterText(job.id, job.chapterSlug, '\n\nAdditional workflow detail.');
  const resumed = await resumeGuide(job.id);
  assert.equal(resumed.publicationReady, false);
  assert.ok(resumed.invalidated.includes('whole-guide-review'));
});
```

Implement `createCheckpointTestJob`, `storeTestAudit` and `appendChapterText` as isolated test utilities in `team/tests/helpers/guideFixture.js`; they write to a fresh temporary directory and never bypass a production gate. The stale-audit case deliberately fails before editorial publication is attempted.

- [ ] Add crash/resume, changed-source, changed-capability, unchanged-page and rejected-checkpoint-path tests. Unchanged reviewed pages must not be rewritten. API errors preserve drafts and exit nonzero. Limit correction to two passes per failed stage.
- [ ] Required reviewers produce findings by page and paragraph: unsupported claims, unlabelled examples, conflicting workflow terminology, repeated explanations, source mismatches and missing evaluation/implementation coverage. An unavailable required reviewer returns `unavailable`, never pass. Manual reviews are recorded with reviewer identity, findings and the reviewed hashes; scheduled writers cannot invent a manual sign-off.
- [ ] Run the focused checkpoint tests, full team tests and build; commit this task locally.

## Task 5 — Implement blocking QA, images and local publication

**Files:** Create `guideQA.js`, `guideImages.js`, `team/tests/guide-qa.test.js`, `team/tests/guide-publish.test.js`; complete publication in `guideStore.js` and `guideManager.js`. Extend existing `imageRegistry.js` to include published guide assets without removing its blog API.

**Consumes:** Completed draft bundle, current audits, evidence and existing site content/images. **Produces:** `validateGuide(bundle, context)`, `sourceGuideImages(bundle)`, `publishGuide({fixture, dryRun})`.

- [ ] Implement text gates first: all ten applicable ICC content standards, actual budgets, heading hierarchy, metadata uniqueness, assigned keyword coverage, author/dates, hypothetical examples, primary-source support, verified capability use, useful internal links, allowable URL schemes and complete FAQs/demo invitation.
- [ ] Run distinct guide-wide checks for contradictory statements and repetition. Flag substantial matching passages for editorial review using five-word shingles over prose windows of at least 150 words; a Jaccard score of 0.35 or higher is an initial review trigger, not proof of plagiarism. Exclude source citations and declared standard wording. Record each reviewed flag and its disposition; unresolved flags block publication. Calibrate on the pilot before automation activation.
- [ ] Enforce exact review hashes and fail a required audit marked `unavailable`, missing, stale or failed. Reuse ICC's exported voice/spelling/quote checks where useful, but do not call the legacy mega QA path or accept the blog gate's skipped-audit result.

```js
test('a missing claims reviewer blocks publication', async () => {
  const bundle = structuralBundle();
  const report = await validateGuide(bundle, {
    audit: {inputHash: hashGuideInputs(bundle), reviewer: 'test boundary',
      reviewedAt: '2026-10-12T12:00:00Z', claims: 'unavailable',
      consistency: 'passed', repetition: 'passed', unresolvedFindings: []},
    evidence: emptyEvidence(), existingContent: [], existingImages: []
  });
  assert.equal(report.pass, false);
  assert.ok(report.failures.some(x => x.id === 'claims-audit-required'));
});
```

Define `emptyEvidence()` in the test fixture module as empty allowed-source/capability collections. This is a negative audit test; it is expected to have other failures and never simulates a publishable guide.

- [ ] Only source images after text passes. Reuse the existing local `sourceImage()` and `processImage()` APIs, adapting their output paths to guides. Generate one unique hero per introduction/chapter. Additional inline images are optional; all must be licensed, industrial, provenance-recorded and 1200×675 where rendered by the existing Markdown component.
- [ ] Compare provider IDs and SHA-256 hashes across existing blogs, existing guides and all pages in the new bundle. Reject reused content imagery in both directions: future blog image sourcing must also see guide assets. Do not fake a software screenshot; a UI illustration must be explicitly conceptual and use verified labels.
- [ ] Run final QA on the exact post-image bundle. A dry run writes only under the draft/report directory. Local publication takes a job lock, rechecks collisions, writes the guide's new unique assets first and exposes the complete content directory last using an atomic rename. It never overwrites existing content. A crash before exposure leaves an explicit recoverable staged state, not a half-published manifest.
- [ ] `publishGuide()` returns a precise allowlist of newly written files. Record the canonical topic and slot in the manifest. Reconcile draft reservations from the published manifest; a crash between content publication and reservation cleanup must not republish the topic.
- [ ] Test stale audits, reused blog images, duplicated images inside the bundle, missing chapters, invalid links, dry-run writes, competing publishers and second publication refusal. Use injected failing review/image-service boundaries for failure tests; use the actual pilot fixture for the full successful publication integration test in Task 8.
- [ ] Run focused QA/publication/image tests, all team tests and build; commit this task locally. No production push occurs.

## Task 6 — Build the guide library and chapter reading experience

**Files:** Create the three guide routes and three guide components listed above. Add Guides to `components/Navbar.tsx`. Reuse `components/Markdown.tsx`, existing page headers and ICC motion/spacing primitives.

**Consumes:** Typed reader APIs and manifest ordering. **Produces:** Statically exported library, introduction and chapter pages with valid adjacent destinations.

- [ ] Export static params from published manifests. Unknown guides/chapters call `notFound()`. Missing or malformed published chapters fail the build rather than falling back to empty content.
- [ ] The library shows topic, concise summary, chapter count, actual overall reading time and the guide's own hero. Empty-library behavior remains informative and has no dead guide links. Treat `/guides/` as a navigational collection rather than a primary long-form chapter; if the Owner wants a standalone SEO pillar introduction there, add the required original 1,500-word content as a separately scoped editorial task.
- [ ] The guide root renders a real 1,500-word introduction and ordered contents. Contents links use manifest slugs; visible chapter numbers come from order and never enter URLs. A chapter page supplies one H1, its 3–5 H2 subsections and reading time.
- [ ] Implement desktop contents and an accessible mobile disclosure using native details/summary or the established ICC pattern. Show current-page state. Add previous/next links at the bottom plus a persistent contents destination; first previous is the introduction and final next is absent.
- [ ] Use this route/navigation assertion in `guide-contract.test.js`, then verify the same destinations in rendered HTML.

```js
test('contents and chapter destinations preserve stable slugs', () => {
  const bundle = structuralBundle();
  const first = bundle.manifest.chapters[0].slug;
  const nav = chapterNeighbors(bundle.manifest, first);
  assert.equal(nav.previous, `/guides/${bundle.manifest.slug}/`);
  assert.equal(nav.contents, `/guides/${bundle.manifest.slug}/`);
  assert.equal(nav.next, `/guides/${bundle.manifest.slug}/${bundle.manifest.chapters[1].slug}/`);
});
```

- [ ] Check keyboard operation, focus state, long titles, table overflow and deep-link heading offsets. Keep the actual software demo invitation in the last chapter and avoid an unrelated consulting-only closing CTA.
- [ ] Run the static export with an isolated test/pilot bundle, inspect pages at desktop and phone widths, rerun team tests and build, and commit this task locally.

## Task 7 — Add metadata, discovery and exported checks

**Files:** Modify `app/sitemap.ts` and `siteRoutes.js`; add `check-guide-links.js`, `check-guide-metadata.js`, `team/tests/guide-links.test.js` and `team/tests/guide-metadata.test.js`. Generate metadata and JSON-LD in the new guide pages; do not modify root layout.

**Consumes:** Published manifests/pages and the generated `out/` tree. **Produces:** Guide sitemap entries, internal-link targets, exported link report and exported metadata report.

- [ ] Generate per-page absolute canonical URLs with trailing slashes, unique title/description, the legal publisher name, actual publish/update dates and explicit Open Graph/Twitter hero images with correct dimensions and alt text. Restate required site-level fields when a child Open Graph object replaces inherited metadata.
- [ ] Add CollectionPage metadata for the guide library, Article for introduction/chapter pages and BreadcrumbList for visible breadcrumbs. If FAQPage JSON-LD is added, generate it from visible FAQ content and review its current primary-source documentation before deployment; do not claim guaranteed rich results.
- [ ] Sitemap timestamps use the guide's actual substantive dates. Internal-link discovery includes the library, guide roots and every chapter, so future blog briefs can link to guides. Validate sibling draft links against the full planned bundle before it exists in the published reader.
- [ ] The link checker verifies contents/previous/next destinations, images and heading anchors from exported HTML. It rejects escaped paths and broken sibling references; it does not assume that an HTTP 200 alone proves a source supports its claim.
- [ ] The metadata checker parses the exported head and JSON-LD; rejects missing/multiple canonicals, description lengths outside 120–160, a different page's canonical, missing share images and invalid schema JSON. Test it against small HTML strings before pointing it at the pilot export.

```js
test('a chapter cannot inherit the guide root canonical', () => {
  const html = '<head><link rel="canonical" href="https://isocertificationconsultants.ca/guides/document-control-software/"></head>';
  const report = checkGuidePageMetadata(html,
    '/guides/document-control-software/evaluating-approval-workflows/');
  assert.equal(report.pass, false);
  assert.ok(report.failures.some(x => x.id === 'canonical-url'));
});
```

Implement `checkGuidePageMetadata(html, route)` as an exported pure helper in the metadata script; executing the script performs the filesystem walk only under `require.main === module`.

- [ ] Run all guide tests, the build, `node team/scripts/check-links.js`, `node team/scripts/check-guide-links.js` and `node team/scripts/check-guide-metadata.js`. Validate structured-data and SEO changes through the Technical SEO review before committing locally.

## Task 8 — Produce and verify one complete pilot guide

**Files:** Draft under `team/drafts/guides/<job-id>/`; only after QA, publish the new guide bundle/images through the new guide command. Save a pilot report under `team/reports/guides/` and add operating documentation to `team/README.md`.

**Proposed pilot:** Document control software for Canadian quality and operations teams. This is a proposed first topic, not a declaration that all candidate document-control capabilities have been verified.

- [ ] Verify the capability register and sources; prepare an approved topic and frozen nine-chapter outline. The initial scopes cover workflow mapping, software evaluation, document structure/ownership, reviews/approvals, revisions/obsolete records, access/evidence, migration, training/rollout, and ongoing operation/FAQs/demo next steps.
- [ ] Write each chapter separately, using only verified capabilities. Where a feature is unverified, discuss it as an evaluation question rather than an ICC feature. Write the final introduction after the chapters establish the actual coverage.
- [ ] Produce all ten unique page metadata sets and image briefs, run chapter QA, run whole-guide review, source images and rerun the exact final gate. Publish locally through `guide publish --fixture`; do not hand-write files into the published guide directory.
- [ ] Use the real reviewed pilot bundle for successful round-trip publication, route-order and idempotency integration tests. Keep every test's output under temporary test roots; never publish a test guide into the real site. The full-success test reads back all ten pages, checks their calculated reading times and image hashes, then refuses a second write to the same guide slug.
- [ ] Run the full team test suite, root chat tests, build and both existing/new export checkers. Root chat tests matter here because navigation/source discovery changes can affect the existing site's contextual links.
- [ ] Verify twelve responsive profiles: 1920×1080, 1366×768, 375×667, 390×844, 430×932, 412×915, 360×740, 768×1024, 820×1180, 1024×1366, 844×390 and 800×1280. These are exact viewport requirements, not claims that every named Playwright device descriptor exists. Inspect library, introduction, middle chapter, FAQ/final chapter and contents navigation. Use an available browser/Playwright runtime; if absent, report the unavailable gate before requesting any dependency.
- [ ] Check accessibility, visual regression against existing blog/navigation, no new script/URL injection, and page performance against the site's documented thresholds. If thresholds/baselines are absent, establish and document measurements before release; do not label the performance gate passed without evidence or infer interaction latency solely from a static build.
- [ ] Only after all checks pass, create a local commit describing the pilot and guide system. Production push requires the Owner's explicit instruction; perform the required pull and revalidation first.

## Task 9 — Add and activate the two-guides-per-week workflow

**Files:** Create `guideCadence.js`, `scheduled-guide-run.sh`, `GUIDE-ROUTINE.md`, `team/tests/guide-cadence.test.js` and `team/tests/guide-release.test.js`. Update organization/operations documentation. Do not edit the daily blog routine or its standing approval.

**Consumes:** Persistent jobs, published manifests and explicit activation settings. **Produces:** `weeklyGuideSlots(date, timezone)`, `claimGuideSlot(slotId)`, slot reconciliation and a restricted scheduled runner.

- [ ] Use two stable weekly slot IDs, such as `2026-W42-slot-1` and `2026-W42-slot-2`. Proposed generation days are Monday and Thursday; exact times are an activation setting. Account by ISO week in `America/Toronto`, with timezone-aware conversion for the Owner's local display.
- [ ] Select one designated persistent production host. Store resumable jobs outside disposable checkouts and serialize guide work there. Use isolated per-run workspaces for Git/build operations. Do not use the blog script's force-reset preparation in a shared checkout.
- [ ] The runner reconciles manifest slot IDs, persisted job completion reports and topic IDs before choosing work. A fully validated job records `generationCompletedAt` and its slot ID even when production release is manual. Resume an interrupted, incomplete job for the same slot; do not rewrite a completed guide merely because it has not been pushed. An already-completed slot returns `NOTHING_TO_GENERATE`; it does not pick another topic. Owner-requested extra guides need explicit approval rather than `--force` bypasses.

```js
test('a completed weekly slot cannot create a third guide', () => {
  const slots = ['2026-W42-slot-1', '2026-W42-slot-2'];
  const published = slots.map(productionSlotId => ({productionSlotId}));
  assert.equal(nextGuideSlot(slots, published, []), null);
});
```

`nextGuideSlot(slots, published, jobs)` is an exported helper of `guideCadence.js`. Incomplete active jobs win over fresh selection; jobs with a valid completed-generation report consume their slot even without a released manifest. Add completed-but-not-released tests, Toronto Sunday/Monday boundary and daylight-saving conversion tests, failed-slot retry tests and a manifest-written/reservation-not-cleared crash test.

- [ ] Scheduled Codex reads the brief and writes introduction/chapters individually. Its prompt prohibits edits to code, metadata assignments, rules, sources, capabilities, queues and standards. Errors preserve checkpoints; corrections remain capped at two passes for a failed stage. Reports distinguish `generated`, `locally-published`, `released`, `nothing-to-generate` and `failed`.
- [ ] Generation-only operation needs no remote push. Before automatic release is enabled, the Owner must explicitly authorize a guide-specific standing scope: which commands, artifacts, branch and frequency may be committed/pushed. Do not extend blog authority by implication or create an automation during implementation before this activation step.
- [ ] Release stages only the exact new guide's manifest, Markdown and images. It builds and checks the guide alongside current site content, commits after the passing build, pulls before push, checks topic/image collisions against the pulled state, and rebuilds/rechecks when anything changed. Merge conflicts stop for resolution; unrelated files and draft artifacts never enter the release commit.
- [ ] Test release commands with an isolated temporary Git repository and local bare remote, not real GitHub. Verify a simulated concurrent blog commit is retained and changes trigger revalidation; a duplicate guide topic or reused image from a concurrent commit blocks release. No remote API credentials are needed for these tests.
- [ ] After pilot/release tests pass and activation is authorized, use the native Codex automation tool. Default to a heartbeat in this chat unless the Owner explicitly requests standalone jobs/cloud execution. Persist draft checkpoints on the designated host; cloud execution requires separately verified durable storage. Do not create duplicate automations; inspect/update any matching existing schedule first.
- [ ] Track two completed generation bundles per week and release outcomes separately. An incomplete week produces a meaningful exception report, not an automatic low-quality catch-up batch. Remain quiet on unchanged status unless the Owner requests periodic reports.

## Task 10 — Document ownership and complete the release review

**Files:** Establish `AGENT-COMPANY-ORG.md`; register guide roles in `teamAuditor.js`; update `team/README.md`, `docs/knowledge-base/architecture.md`, `page-registry.md`, `internal-linking-map.md`, `content-calendar.md` and `decisions.md`. Ignore regenerable draft/report checkpoints appropriately without ignoring published content or required operating facts.

- [ ] Record the actual guide roles: Guide Content Manager (`guideManager.js`), Guide Topic Researcher (`guideTopicResearcher.js`), Guide Research/Outline responsibilities and Guide QA (`guideQA.js`), reporting through Content Manager/CMO to CTO. These are pipeline responsibilities, not permission to start extra subagents or schedule the dormant departments.
- [ ] Document topic approval, evidence verification, checkpoint recovery, failed QA, image exhaustion, stable chapter URLs, local publication and authorized production release. Include the difference between two weekly generation slots and production deployment.
- [ ] Review code impact using code-review-graph if available, otherwise changed-file/import analysis. Verify no Pinnacle files, copied prompts, infrastructure or dependencies were introduced, no secret was added, no source/published URL was deleted and no core file was changed without the required approval.
- [ ] Complete the final independent code/content review through the Owner-selected execution method. Resolve findings, rerun checks affected by fixes and report every unavailable gate honestly.
- [ ] Run the release checklist below; commit documentation only after the build passes. No production push without its separately established authority.

## Final release checklist

- [ ] All contract, selection, research, checkpoint, QA, image, publication and cadence tests pass.
- [ ] `npm --prefix team test` passes, including existing blog tests.
- [ ] `npm run test:chat` passes.
- [ ] `npm run build` completes with no errors.
- [ ] Existing `check-links.js` passes; new guide link and metadata scripts pass.
- [ ] All ten pilot pages exist with valid contents/previous/next navigation and stable URLs.
- [ ] Per-page and overall actual counts satisfy the fixed budget; no repeated filler is used.
- [ ] Required text/research/capability reviews are completed and match the released hashes.
- [ ] All page imagery is unique across blogs/guides, licensed and correctly processed.
- [ ] Canonicals, share images, visible FAQs, JSON-LD and sitemap entries match the actual pages.
- [ ] Twelve viewport/device checks and appropriate accessibility, visual, security and performance gates have recorded evidence.
- [ ] Pilot guide is validated before recurring automation activation.
- [ ] Generation-only versus automatic publication is explicitly selected; any remote push scope is authorized.
- [ ] One designated host, durable checkpoints, two weekly slots and retry behavior are verified.
- [ ] The final checked state includes any changes introduced by the required pre-push pull.

## Rollout order and operational expectations

Implement Tasks 1–7 first, complete the pilot and acceptance review in Task 8, then implement/activate Task 9 and finish operational documentation in Task 10. Do not enable recurring guide release before the pilot succeeds. Documentation can be kept current throughout; the final task reconciles the finished behavior.

One normal week produces two introductions and eighteen chapters, approximately 39,000 words of new body content, plus review and image work. Each guide needs at least ten unique hero images, so the weekly minimum is twenty. These are workload calculations from the planned format, not forecasts of API price or generation duration. Measure the pilot's runtime, model usage and image-provider consumption before proposing any paid capacity change; budget decisions remain with the Owner.

The first backlog priorities are proposed as document control, CAPA workflows, supplier quality, audit management and training competence. Owner priority and verified evidence can reorder them. A useful topic that cannot support nine distinct chapters should become a blog or a smaller resource, rather than be padded to guide length.

## Owner review and execution handoff

This plan is ready for review, not execution. The open decisions are the exact Pinnacle public-guide reference, the proposed first topic, weekdays/start times for the two slots, the designated persistent host and whether guide release should stay manual or receive explicit standing authority.

After the Owner authorizes implementation, preserve their chosen execution method. Either execute task-by-task in this session using `superpowers:executing-plans`, or use `superpowers:subagent-driven-development` if the Owner explicitly chooses delegation. During either method, obey the repository's core-file approval and local-commit rules. Do not ask for permission again for work already explicitly authorized, but do not treat acceptance of this plan as authorization to create a schedule or push production changes.
