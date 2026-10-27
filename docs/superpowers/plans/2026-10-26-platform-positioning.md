# Platform-First Positioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition isocertificationconsultants.ca as platform-first ("Stop managing compliance. Start automating it.") across the shell, home page, commercial pages, blog/guide pipeline and search surfaces, with "Book a demo" as the main lead.

**Architecture:** Copy-only changes in the existing Next.js 14 static export (`lib/site.ts`, `app/**`, `components/**`). There are three small code additions: a `request` field on the contact API and form, a template-rendered `SoftwareDemoBox` for blog and guide pages, and one positioning check shared by the blog and guide quality gates. Images arrive from the Owner and are cropped with `sharp` (already a `team/` dependency).

**Tech Stack:** Next.js 14 App Router (`output: "export"`), TypeScript, Tailwind, `node --test` (site: `--experimental-strip-types`; pipeline: CommonJS under `team/`), Resend via `api/contact.ts`, `sharp` from `team/node_modules`.

**Spec:** `docs/superpowers/specs/2026-10-26-platform-positioning-design.md` (wording in its Appendix A) and `docs/superpowers/specs/2026-10-26-platform-positioning-images.md`.

## Global Constraints

- Product name is "compliance management software". The strings `YourQMS`, `Quro`, `yourqms.com`, "AI gap assessment" and "AI audit finding(s)" never appear in site or pipeline copy.
- AI wording always keeps a person reviewing and signing off; gap assessments and audits are done by people.
- No layout changes: same sections, order and components. A new element is allowed only where the spec names one: the `/contact/` request field and `SoftwareDemoBox`.
- No slug or URL changes. JSON-LD is only added (`SoftwareApplication` on `/platform/`), never removed.
- Hand-written meta descriptions are 120–160 characters.
- Keyword ownership: `/platform/` owns "compliance management software"; module pages use "[x] management software" or module-name variants; guides keep "CAPA software", "document control software" and the other queued terms. Standard and industry page titles keep certification/consultant terms first.
- Blog body voice is unchanged: third person, no "we/our", US spelling, no sales page. Only the closing paragraph and optional module mentions change.
- Don't edit `team/data/software-capabilities.json`.
- Work happens on branch `platform-positioning`. Make one commit per phase (1 → 3 → 2 → 4, then images) with a single-line message and no co-author trailer. Run `npm run build` before each commit. Don't push until the Owner says so.

## Review Focus

- Hero compact form sends no `request` → API treats it as Demo (subject "Demo request — …"), never 400.
- Blog `category` values that aren't standard codes ("Auditing", "ISO Certification", "") or differ only in case/spacing ("iso 9001 ") → demo box falls back or matches correctly.
- Honest copy that mentions the banned terms' neighbors ("a person runs the gap assessment", "audit findings are recorded by the auditor") must pass the positioning check; only AI-attributed versions fail.
- Closing paragraph links written as `/contact`, `/contact/` or `https://isocertificationconsultants.ca/contact/` all count; a demo link inside the FAQ (not the final paragraph) does not.
- Dynamic page titles/descriptions built from `lib/site.ts` data (11 modules, 10 standards, 8 industries) stay within limits after the rewording. Pinned by the build-output scan in Task 13.

---

## Phase 1 — Site-wide shell and home page

### Task 1: Contact API accepts a request type

**Files:**
- Modify: `api/contact.ts:68-112` (allow-list, `enquiry` type, subject, text body)
- Test: `tests/contact-api.test.mjs`

**Interfaces:**
- Produces: request JSON accepts optional `request: "demo" | "consultation" | "assessment"` (missing → `"demo"`). Subject becomes ``${label} request — ${standard} — ${company}`` with label `Demo` / `Consultation` / `Assessment`; text gains a line `Request: <Label>`.

- [ ] **Step 1: Write failing tests** in `tests/contact-api.test.mjs`:
  - `"a missing request type is sent as a demo request"`: post `enquiry` unchanged and assert `email.subject` matches `/^Demo request — ISO 9001 — Example Ltd\.$/` and `email.text` includes `"Request: Demo"`.
  - `"consultation and assessment requests are labelled in the subject"`: post `{ ...enquiry, request: "consultation" }` and `{ ...enquiry, request: "assessment" }`, then assert subjects start with `"Consultation request — "` and `"Assessment request — "`.
  - `"an unknown request type is rejected"`: post `{ ...enquiry, request: "pricing" }` and assert status `400`, with fetch never called.
- [ ] **Step 2: Run** `npm run test:contact`. Expected: the 3 new tests FAIL; existing tests pass.
- [ ] **Step 3: Implement.** Add `"request"` to the allow-list, read it with `field(data, "request", 20, true)`, map it through `{ demo: "Demo", consultation: "Consultation", assessment: "Assessment" }`, and throw `"Invalid request"` for any other non-empty value.
- [ ] **Step 4: Run** `npm run test:contact`. Expected: all PASS.

### Task 2: Contact form asks what the visitor wants

**Files:**
- Modify: `components/ContactForm.tsx`, `app/contact/page.tsx`

**Interfaces:**
- Consumes: Task 1's `request` field.
- Produces: `ContactForm` props `askRequest?: boolean` (default `false`) and `submitLabel?: string` (default `"Send message"`). With `askRequest`, it renders a radio group: legend "What would you like?", options Demo (checked) · Consultation · Assessment, values `demo` / `consultation` / `assessment`, ids from the existing `id` prefix. It sends `request` only when `askRequest` is true.

- [ ] **Step 1: Implement** the props and the radio group, styled with the form's existing `Label` and input classes and placed before the name field.
- [ ] **Step 2:** On `app/contact/page.tsx`, use `<ContactForm askRequest title="Book a demo" submitLabel="Book my demo" />`. Rewrite the page's header and intro so they lead with the demo, keeping consultation and assessment as options. Set the metadata description to 120–160 chars.
- [ ] **Step 3: Verify** with `npm run test:contact` (still PASS). Then `grep -n "askRequest" components/ContactForm.tsx app/contact/page.tsx` should show both files.

### Task 3: Home page wording

**Files:**
- Modify: `components/home/Hero.tsx`, `app/page.tsx`, `lib/site.ts` (`PAIN_POINTS`, `DIFFERENTIATORS`)

**Interfaces:**
- Consumes: `ContactForm` `submitLabel` (Task 2).
- Produces: none for later tasks.

- [ ] **Step 1: Hero.** Apply Appendix A hero text verbatim: badge, H1 (accent span + gold underline now on "Start automating it."), lede, buttons ("Book a demo" → `/contact`, "See how it works" → `/platform`), three ticks, trust-strip line. Use `<ContactForm compact title="Book a demo" submitLabel="Book my demo" />` and rename the panel `aria-label` to "Book a demo". The image wall stays as it is until Task 15.
- [ ] **Step 2: Pain rows.** Update `PAIN_POINTS[].pain` and `.capability` to the Appendix A "Today → With the software" text. In `app/page.tsx`, add two small uppercase labels ("Today", "With the software") inside the existing first and last grid cells. Use `text-[11px] font-bold uppercase tracking-wide text-slate-500` / `text-teal-700`. The grid stays the same. `PAIN_POINTS` is used only by the home page.
- [ ] **Step 3: Sections.** In `app/page.tsx`, apply the Appendix A eyebrow, H2 and intro for every section.
  - `WHY` cards: Audit-ready every day (`certificate`), Less manual work (`assistant`), Early warnings (`dashboard`), Expert help when you want it (`expert`).
  - Add a page-local `HOME_AI_PRINCIPLES` with the five Appendix A titles and details. `AI_PRINCIPLES` in `lib/site.ts` stays unchanged for `/platform/`.
  - The process intro is from Appendix A. `ProcessTimeline`/`PROCESS` are not changed, because `PROCESS` is shared with `/process/` and the standard pages.
- [ ] **Step 4: Differentiators.** Retitle `DIFFERENTIATORS` to Appendix A: Fits how you work · Any standard · Your processes first · Software plus experts. Also apply its one-line details. Check `app/about/page.tsx` and `app/platform/page.tsx`, which also render them; the new titles must read correctly there too.
- [ ] **Step 5: Metadata.** Home `metadata`: title (absolute) "AI Compliance Management Software for ISO 9001 & IATF 16949". The description is the Appendix A search description (verify it's 120–160 chars).

### Task 4: Site shell — nav, footer, CTA band, tagline, layout metadata

**Files:**
- Modify: `components/Navbar.tsx:93,198,293`, `components/Footer.tsx:18-20,110`, `components/ui.tsx:195-219` (`CTASection` defaults), `lib/site.ts:11-13` (`SITE.tagline`), `app/layout.tsx:24-90`

- [ ] **Step 1:** Navbar top strip "AI-powered compliance management software · {SITE.region}". Both "Book a Consultation" buttons → "Book a demo".
- [ ] **Step 2:** Footer blurb → "AI-powered compliance management software that keeps quality, compliance, people, suppliers and operations audit-ready every day, with certified consultants when you want them." Button → "Book a demo".
- [ ] **Step 3:** `CTASection` defaults to the Appendix A closing band (title, intro, primary "Book a demo"). The secondary stays "Take the free assessment". Pages that pass their own `title` keep it until Phase 2.
- [ ] **Step 4:** `SITE.tagline` = "AI-powered compliance management software for quality and compliance, with certified consultants when you want them".
- [ ] **Step 5:** `app/layout.tsx`:
  - Default title: "Compliance Management Software | ISO 9001, IATF 16949".
  - Description, `openGraph.title`/`description` and the org JSON-LD `description`: the platform message, 120–160 chars where it is a meta description.
  - `keywords`: lead with "compliance management software", "AI compliance software", "ISO 9001 software" and "IATF 16949 software"; keep the consulting terms after them.
- [ ] **Step 6: Verify** with `grep -rn "Book a Consultation\|Book a free consultation" app components`. Expected: no matches except page-level overrides queued for Phase 2 (list them in the commit message body notes for Task 11).
- [ ] **Step 7: Commit Phase 1**

```bash
npm run build
git add api/contact.ts tests/contact-api.test.mjs components app lib
git commit -m "Phase 1: platform-first home page, site shell and demo request on the contact form"
```

---

## Phase 3 — Blogs and guides

### Task 5: Positioning check in both quality gates

**Files:**
- Modify: `team/agents/content/contentQA.js` (new export near `BANNED_PHRASES`; call it in `validateLocal`), `team/agents/content/guideQA.js:56` (call per page)
- Test: `team/tests/contentQA.test.js`, `team/tests/guide-qa.test.js`

**Interfaces:**
- Produces: `findPositioningTerms(text: string): string[]` (exported from `contentQA.js`) and `POSITIONING_PATTERNS: RegExp[]`. `validateLocal` adds a check `{ id: "positioning-terms", pass, detail }`, and `validateGuide` adds `add('positioning-terms', …, 'Remove product names and AI audit claims', page.slug)`.

- [ ] **Step 1: Write failing tests** in `team/tests/contentQA.test.js`:
  - `"positioning terms: product names and AI audit claims fail"`: each of `"Try YourQMS today."`, `"Ask Quro."`, `"See yourqms.com."`, `"An AI gap assessment scores every clause."`, `"AI-powered gap assessments save time."`, `"AI audit findings appear instantly."` and `"AI-suggested audit findings."` must return a non-empty array.
  - `"positioning terms: honest neighbors pass"`: each of `"A person runs the gap assessment."`, `"Audit findings are recorded by the auditor."`, `"AI drafting is off until you turn it on."` and `"Quorum rules for the management review."` must return `[]`.
  - In `team/tests/guide-qa.test.js`, add a case to the existing table: `["positioning-terms", { body: `${base.body}\n\nAsk Quro for help.` }]`.
- [ ] **Step 2: Run** `npm --prefix team test`. Expected: the new cases FAIL.
- [ ] **Step 3: Implement** `POSITIONING_PATTERNS`, all case-insensitive: `/\byour\s?qms\b/`, `/\bquro\b/`, `/yourqms\.com/`, `/\bAI[- ](?:powered |driven |assisted |led )?gap assessments?\b/` and `/\bAI[- ](?:suggested |generated |powered )?audit findings?\b/`. Wire the check into both gates as blocking.
- [ ] **Step 4: Run** `npm --prefix team test`. Expected: all PASS.

### Task 6: Blog closing paragraph must invite a demo

**Files:**
- Modify: `team/agents/content/contentQA.js` (new check in `validateLocal`)
- Test: `team/tests/contentQA.test.js`

**Interfaces:**
- Produces: `checkClosingDemo(body: string): { id: "closing-demo", pass: boolean, detail: string }`. This takes the last non-empty paragraph of the Markdown body. It passes when the paragraph contains `demo` (word) and a link whose route is `/contact` (reuse the route normaliser used by `guideQA.extractLinks`/`toRoute`, or move it into `contentQA.js` and import it back).

- [ ] **Step 1: Write failing tests** `"closing demo: last paragraph must invite a demo at /contact"`. These pass:
  - `[book a demo](/contact)`
  - `[book a demo](/contact/)`
  - `[a demo](https://isocertificationconsultants.ca/contact/)`

  These fail:
  - a last paragraph linking `/contact/` with no "demo";
  - a body whose demo link is in a FAQ answer followed by a final paragraph without one.
- [ ] **Step 2: Run** `npm --prefix team test` and expect FAIL. **Step 3: Implement**, add to `validateLocal`'s blocking checks, and make sure `goodPost` in `team/tests/helpers/env.js` ends with a passing closing paragraph. **Step 4: Run** and expect PASS.

### Task 7: Writer rules and prompts

**Files:**
- Modify: `team/data/writing-rules.md:17,49`, `.claude/skills/write-blog-article/SKILL.md:14`, `team/agents/content/articleWriter.js:51,174`, `team/agents/content/outlineArchitect.js:92`, `team/agents/content/contentManager.js:673` (label only), `team/data/guide-writing-rules.md:13`, `team/GUIDE-WRITER.md`, `.claude/skills/write-software-guide/SKILL.md`

- [ ] **Step 1: Blog rules.**
  - The closing paragraph frames the reader's problem as one the compliance management software removes and invites them to **book a demo** at `/contact/`. Third person only: "ISO Certification Consultants", never "we".
  - Optional: 1–2 module mentions by software name (Documents, Audits, Improvements, Training, Supplier Quality, Assets, Standards, Processes, Safety, Vendors, AI Assistant). Each mention links `/solutions/<slug>/`, says what the reader gains, and claims nothing beyond that module page.
  - Banned: the five positioning terms.
- [ ] **Step 2: API writer prompts.** Change `/contact — Book a consultation` → `/contact — Book a demo of the compliance management software`, and make the final-chapter instruction ask for a demo invitation.
- [ ] **Step 3: Guide rules.**
  - The last chapter's invitation uses the core message ("Stop managing compliance. Start automating it.") and asks the reader to book a demo at `/contact/`.
  - The introduction states the reader benefit in one sentence.
  - Keep "a person reviews" wording and the verified-capability rule unchanged.
- [ ] **Step 4: Verify** with `npm --prefix team test` (PASS). `grep -rn "Book a consultation" team .claude` should return no matches.

### Task 8: SoftwareDemoBox on blog and guide pages

**Files:**
- Create: `lib/demo-box.ts`, `components/SoftwareDemoBox.tsx`, `tests/demo-box.test.mjs`
- Modify: `app/blog/[slug]/page.tsx:143-162`, `components/guides/GuideChapterPage.tsx:28-30`, `components/guides/GuideIntroductionPage.tsx` (after `GuideBody`), `package.json` (script `"test:site": "node --experimental-strip-types --test tests/demo-box.test.mjs tests/positioning-copy.test.mjs"`)

**Interfaces:**
- Produces:
  - `demoBoxHeading(category?: string): string`. Returns `` `Meeting ${code}?` `` when `category.trim()` equals a `STANDARDS[].code` case-insensitively (returning the canonical code). Otherwise it returns `"Meeting your compliance requirements?"`.
  - `DEMO_BOX_IMAGE: { src: string; alt: string } | null`, set to `null` until Task 15.
  - `<SoftwareDemoBox category?: string />`

- [ ] **Step 1: Write failing tests** in `tests/demo-box.test.mjs`. Import `../lib/demo-box.ts` and assert:
  - `"ISO 9001"` → `"Meeting ISO 9001?"`
  - `" iso 9001 "` → `"Meeting ISO 9001?"`
  - `"IATF 16949"` → `"Meeting IATF 16949?"`
  - `"Auditing"`, `"ISO Certification"`, `""` and `undefined` → `"Meeting your compliance requirements?"`
- [ ] **Step 2: Run** `node --experimental-strip-types --test tests/demo-box.test.mjs`. Expected: FAIL (module missing).
- [ ] **Step 3: Implement** `lib/demo-box.ts`, importing only `STANDARDS` from `./site`. Then build the component to match the spec's 3a wireframe:
  - heading from `demoBoxHeading`, followed by " Stop managing compliance. Start automating it.";
  - the body line "Documents, audits, training, suppliers and corrective actions in one place. AI does the paperwork; your team signs off.";
  - buttons `btn-primary` "Book a demo" → `/contact/` and `link-arrow` "Take the free assessment" → `/assessment/`;
  - the image on the right only when `DEMO_BOX_IMAGE` is set;
  - card styling taken from existing `ui.tsx` cards (`rounded-xl border border-slate-200 bg-white p-6`).
- [ ] **Step 4:** Render it after the article body:
  - blog: after the FAQ and closing paragraph, inside `<article>`, with `category={post.category}`;
  - guide chapter and introduction pages: after `GuideBody`, with no category.
- [ ] **Step 5: Run** `npm run test:site`. Expected: demo-box tests PASS. (The positioning test arrives in Task 9 — until then run only the demo-box file.)

### Task 9: Static positioning guard and index pages

**Files:**
- Create: `tests/positioning-copy.test.mjs`
- Modify: `app/blog/page.tsx:1-20` (header + metadata), `components/guides/GuideLibraryPage.tsx` (header copy, empty state), guides library metadata (wherever `app/guides/[[...path]]` builds it)

**Interfaces:**
- Consumes: `POSITIONING_PATTERNS` (Task 5). Copy the five patterns into the test; don't import CommonJS from `team/`.

- [ ] **Step 1: Write the test.**
  - `"site copy carries no product name or AI audit claims"` walks `app/`, `components/`, `lib/`, `content/chatbot-context.md` and `api/`. It skips `content/blog/` and `content/guides/`, whose published text is unchanged by decision. It asserts no file matches any pattern.
  - `"hand-written meta descriptions are 120–160 characters"` extracts every `description:\s*"([^"]+)"` string literal from `app/**/page.tsx` and `app/layout.tsx`. It asserts each length is within 120–160 and lists the offenders in the message.
- [ ] **Step 2: Run** `npm run test:site`. Expected: the description test FAILS on pages not yet rewritten. Record the list; Phase 2 tasks fix them, so it isn't fixed here.
- [ ] **Step 3: Blog index.**
  - Header title: "Practical compliance guidance, and the software that automates it".
  - Intro: one sentence on standards how-tos plus a demo mention.
  - Metadata title: "Compliance Blog: ISO 9001, IATF 16949 and AS9100 Guidance".
  - Description: 120–160 chars.
- [ ] **Step 4: Guides library.** Do the same for the header and metadata, keeping the empty-state links ("Explore software modules", "Book a demo").
- [ ] **Step 5: Commit Phase 3** (`npm run build`, then `npm --prefix team test`, `npm run test:site` (description failures limited to Phase 2 pages are expected and noted), `git commit -m "Phase 3: demo box, positioning check and demo-led writer rules for blogs and guides"`).

---

## Phase 2 — Commercial pages

Wording per page is left to the builder, in the Appendix A voice: each heading says what the reader gets, consulting is framed as optional expert help, and CTAs say "Book a demo". Every rewritten hand-written description is 120–160 chars. Each task's verification is: `npm run test:site`, where the description test reports no offenders from that task's files.

### Task 10: `/platform/` and SoftwareApplication JSON-LD

**Files:** Modify `app/platform/page.tsx`

- [ ] **Step 1:** Copy direction from the spec's Phase 2 table.
  - Title: "AI Compliance Management Software".
  - Header: "The AI-powered operating system for quality and compliance".
  - Assess → Build → Operate → Certify is reworded as the visitor's journey.
  - "Software alone will not pass your audit" → "Experts when you want them".
  - The final `<CTASection />` uses the default.
- [ ] **Step 2:** Add a `<script type="application/ld+json">` using `serializeJsonLd` from `lib/blog`, with:

```json
{ "@context": "https://schema.org", "@type": "SoftwareApplication",
  "name": "Compliance management software", "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web", "description": "<page meta description>",
  "provider": { "@type": "Organization", "name": "<SITE.legalName>", "url": "<SITE.url>" },
  "url": "<SITE.url>/platform/" }
```

No `offers`/price.
- [ ] **Step 3: Verify:** `npm run test:site`.

### Task 11: Module pages and solutions index

**Files:** Modify `lib/site.ts` (`MODULES[].cta.label`, `.metaDescription`), `app/solutions/[module]/page.tsx:23,267-270`, `app/solutions/page.tsx:10-15,89`

- [ ] **Step 1:**
  - `cta.label` for every module → `` `See ${m.name} in a demo` ``. The `href` stays `/contact`.
  - The bottom `CTASection` title → `` `See ${m.name} in a demo` ``, replacing "… with a certified consultant".
- [ ] **Step 2:** Page title pattern `` pageTitle(`${m.name} Management Software`) ``. For `m.name === "AI Assistant"`, use `"AI Assistant for Compliance Management"`. Keep each `metaDescription` within 120–160 and benefit-first.
- [ ] **Step 3:**
  - Solutions index metadata title: "Compliance Management Software Modules".
  - The `CTASection` override is removed, so it uses the default.
- [ ] **Step 4: Verify.** Add a test to `tests/positioning-copy.test.mjs`, `"module meta descriptions are 120–160 characters"`, that imports `MODULES` from `../lib/site.ts` and checks every `metaDescription`. Run `npm run test:site` and expect PASS.

### Task 12: Standards and industries

**Files:** Modify `app/services/page.tsx`, `app/services/[standard]/page.tsx:33-34,287`, `app/industries/page.tsx`, `app/industries/[industry]/page.tsx:26-27,401`

- [ ] **Step 1: Standard pages.**
  - Title `` pageTitle(`${s.code} Certification Consultants & Software`) ``.
  - Description template: `` `${s.code} certification support for Canadian companies: consultants for the gap analysis and audits, and compliance management software that keeps you audit-ready.` ``
  - Hero heading gains the software angle: `` `Meet ${s.code} with less paperwork` ``.
  - CTA title `` `Ready to meet ${s.code}? Book a demo` ``.
- [ ] **Step 2: Industry pages.**
  - Title `` pageTitle(`${i.name} ISO Certification & Compliance Software`) ``.
  - Heading `` `Compliance management software for ${i.name}` ``.
  - The description keeps "ISO" and certification terms first.
  - The CTA override is reworded to demo.
- [ ] **Step 3: Index pages.** `/services/` and `/industries/` headers and metadata follow the same rule: certification terms first in titles, benefit-led intros.
- [ ] **Step 4: Verify.** Add the test `"templated standard and industry descriptions are 120–160 characters"`. It imports `STANDARDS`/`INDUSTRIES` and evaluates the two templates (exported as `standardMetaDescription(s)` / `industryMetaDescription(i)` from a new `lib/seo-copy.ts`, which the two pages call). Run `npm run test:site` and expect PASS.

### Task 13: Process, about, custom solutions, ROI, assessment

**Files:** Modify `app/process/page.tsx`, `app/about/page.tsx`, `app/about/anthony-mannella/page.tsx` (CTA only), `app/custom-solutions/page.tsx:172`, `app/roi/page.tsx:88`, `app/assessment/page.tsx`, `components/Assessment.tsx` (result CTA only)

- [ ] **Step 1:**
  - `/process/`: header "How you get certified, in six steps" plus the Appendix A intro.
  - `/about/`: the company is described as software plus certified experts. Bios stay unchanged.
  - ROI and assessment results: end with a "Book a demo" CTA, and the assessment's result screen offers the demo first.
  - `custom-solutions` CTA override: reworded to demo.
- [ ] **Step 2: Verify** with `npm run test:site`. Expected: the description test PASS with no offenders left anywhere.
- [ ] **Step 3: Build-output scan.** Add `tests/positioning-build.test.mjs` (run manually after a build). For every `out/**/index.html` except under `out/blog/` and `out/guides/`, it asserts the `<meta name="description">` content length is 120–160. It also asserts no file contains a positioning pattern. Run `npm run build && node --test tests/positioning-build.test.mjs` and expect PASS.
- [ ] **Step 4: Commit Phase 2** with `git commit -m "Phase 2: platform-first wording and demo CTAs on platform, module, standard, industry and support pages"`.

---

## Phase 4 — Search and answer engines

### Task 14: llms.txt, chat assistant context, scout priorities

**Files:** Modify `app/llms.txt/route.ts:16-45`, `content/chatbot-context.md` ("Who the company is" and any consulting-first summary), `team/SCOUT-ROUTINE.md`

- [ ] **Step 1: llms.txt.**
  - The opening paragraph leads with the software (the platform message, then consultants as optional help).
  - Section order: "Compliance management software by module" (from `MODULES`), "By standard", "Industries", then posts and guides.
  - Add a `- Book a demo: ${url("/contact/")}` line.
- [ ] **Step 2: chatbot-context.md.**
  - "Who the company is" puts the platform first and consulting second.
  - When a visitor asks about software, the assistant offers a demo at `/contact/`.
  - Keep the "consultancy, not a certification body" paragraph.
- [ ] **Step 3: SCOUT-ROUTINE.md.** Add a "Priority search terms" list the proposer considers first when topics are needed: "training matrix software", "audit management software", "IATF 16949 compliance software", "ISO 9001 software for small manufacturers" and "compliance management software for manufacturers". Note that terms already queued (see `guide-topic-queue.json`) are skipped. The queue and approvals stay untouched.
- [ ] **Step 4: Verify.**
  - Run `npm run test:chat` and expect PASS (chat tests read the context file).
  - Run `npm run test:site` and expect PASS.
  - `npm run build`, then `grep -c "Book a demo" out/llms.txt` should be ≥ 1.
- [ ] **Step 5: Commit Phase 4** with `git commit -m "Phase 4: software-first llms.txt, chat assistant context and scout search priorities"`.

---

## Images (when the Owner's files are in `~/Downloads/icc-platform-images/`)

### Task 15: Place hero, share-card and demo-box images

**Files:**
- Create: `scripts/place-platform-images.mjs`, `public/images/hero/platform-*.png` (8), `public/images/demo-box-tablet.webp`
- Modify: `public/images/og-default.jpg`, `components/home/Hero.tsx:287-336` (`HERO_IMAGES`), `lib/demo-box.ts` (`DEMO_BOX_IMAGE`)

**Interfaces:**
- Consumes: `DEMO_BOX_IMAGE` (Task 8).

- [ ] **Step 1:** Run `npm --prefix team ci` if `team/node_modules/sharp` is missing.
- [ ] **Step 2: Write `scripts/place-platform-images.mjs`.** It takes the source folder as `argv[2]` and loads sharp via `createRequire` from `team/`. It must:
  - `cover`-crop the 8 hero files to 1672×941 PNG, gravity `attention`;
  - crop `demo-box-tablet.png` to 600×600 WebP (quality 82);
  - crop `og-platform-bg.png` to 1200×630, darken with a navy overlay (`#0d1a30` at 0.55), and composite an SVG text layer matching the current card. The layer holds the logo mark from `public/images/logo-mark.png` + "ISO Certification Consultants", the headline "Stop managing compliance. Start automating it.", and the standards line "ISO 9001 · IATF 16949 · AS9100 · ISO 13485 · ISO 14001 · ISO 45001". Output is `public/images/og-default.jpg` (quality 85).

  The script exits non-zero and names any of the 10 expected files that is missing.
- [ ] **Step 3: Run** `node scripts/place-platform-images.mjs ~/Downloads/icc-platform-images`. Then `sips -g pixelWidth -g pixelHeight` on the outputs should report 1672×941, 600×600 and 1200×630.
- [ ] **Step 4: Visual check** (single look). Read each output image and reject any with readable text, logos or warped tools; ask the Owner to regenerate those.
- [ ] **Step 5:** Point `HERO_IMAGES` at the new files. Labels and standards stay the same. Write new `alt` text describing each scene from the image brief, e.g. "Fabrication technician measuring a laser-cut bracket while a tablet checklist records the result". Set `DEMO_BOX_IMAGE = { src: "/images/demo-box-tablet.webp", alt: "Tablet showing a compliance dashboard beside a machined part and caliper on a workbench" }`.
- [ ] **Step 6: Commit** with `npm run build` and `git add scripts/place-platform-images.mjs public/images components/home/Hero.tsx lib/demo-box.ts`, then `git commit -m "Platform images: new hero wall, share card and demo box image"`.

### Task 16: Bring the branch up to date and hand off for review

- [ ] **Step 1:** Run `git fetch origin && git merge origin/main` to pick up the daily posts. On conflicts in `content/blog`, `team/memory` or the link bank, keep `origin/main`.
- [ ] **Step 2:** Run `npm --prefix team test && npm run test:site && npm run test:contact && npm run test:chat`, then `npm run build && node --test tests/positioning-build.test.mjs`. Expected: all PASS.
- [ ] **Step 3:** Report the branch, commits and test results to the Owner. Push `platform-positioning` and open the pull request only when the Owner says so.
