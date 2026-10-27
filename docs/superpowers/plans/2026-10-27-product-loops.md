# Product Loops Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show the software working on the site. Each loop is a short, silent, designed animation of one real workflow, with no product name or logo: one for the platform overview on `/platform/`, and one for each of the 11 module pages, shown in the right half of the page header.

**Architecture:**
- Each loop is a server-rendered React component styled with CSS keyframes. There are no videos and no client JavaScript.
- A shared `LoopFrame` draws a neutral app window: a plain mark, "Compliance Management Software", module tabs and a "Sample data" chip.
- A shared step timeline in one CSS module sequences the content on a 12-second cycle.
- `PageHeader` gets an optional `visual` slot. Module pages look up their loop by slug in a registry. `/platform/` uses the overview loop.
- The home page is not changed (Owner: no home layout change).

**Tech Stack:** Next.js 14 App Router (static export), React server components, a CSS module, Tailwind, `node --test` (`--experimental-strip-types`).

**Spec:**
- Owner direction 2026-10-27: "proceed with the implementation of the designed product loops, for all the modules we have and wherever necessary".
- Design shown in the imagery artifact (`https://claude.ai/artifact/2stDLWatyLVTdxwQwrKfsD`, "Motion videos" and the two live samples).
- Binding copy rules: `docs/superpowers/specs/2026-10-26-platform-positioning-design.md`.

## Global Constraints

- **No brand in the loops.** No "YourQMS", "Quro", yourqms.com or app logo. The window title is exactly "Compliance Management Software", and the assistant is "AI Assistant".
- **Accurate to the software.** Every loop shows only steps, states and labels named on that module's entry in `lib/site.ts` (`summary`, `features`, `howItWorks`, `auditorSees`). Use the exact status words where the module names them:
  - Standards: Compliant, Partial, Review overdue, No evidence.
  - Documents: Draft, In review, Approved, Published, Obsolete.
  - Processes: Management, Customer-facing, Core, Support.
- **AI rules.** AI drafts and carries out tasks within permissions, and a person reviews and signs off. AI never "flags/warns", and never does gap assessments or audit findings (auditors record findings). Flagging comes from the dashboard, notifications and the daily summary.
- **Fictional sample data only.** Use roles, not people's names ("Quality manager", "Production lead"). Use invented codes such as `WI-104`, `CAPA-0142`, `C-17`, `SCAR-031`. Invented company names end in "Ltd." and are generic ("Northline Castings Ltd."). Every loop shows the "Sample data" chip (from `LoopFrame`).
- **No layout changes beyond the header slot.** `PageHeader` without `visual` renders exactly as before. Home, industry, standard and blog pages are unchanged.
- **Timing and motion.**
  - Cycle is 12 s. All loops use the shared step timeline: 6 steps at 0%, 14%, 28%, 42%, 56% and 70%, a hold until 92%, then a fade-out reset.
  - `prefers-reduced-motion: reduce` shows the final frame, with no animation.
  - The first paint must show readable content: step 0 is visible at rest.
- **Accessibility.**
  - The loop root is `role="img"` with an `aria-label` that tells the story in one or two sentences.
  - Inner content is `aria-hidden="true"`.
  - Use no focusable elements inside a loop.
- **Responsive.**
  - At `lg` and above, the visual sits on the right of the header text.
  - Below `lg`, it sits under the buttons, at most 520px wide.
  - It never causes horizontal scroll at 360px.
- **Constraints carried over from earlier phases.**
  - Never run `tsc` on its own. Run `npm run build` only at the last task.
  - Commits are one line, with no co-author trailer.
  - Don't push.

## Review Focus

- A module without a loop (a future module): the header must render normally with no empty column. The registry is checked in a test.
- Reduced motion: every step class must have a final-frame rule, or content stays hidden. The test checks that each `on-*` and `until-*` class has a reduced-motion rule.
- Narrow screens (360px): long labels such as "Supplier Quality" or "Customer-facing" must truncate or wrap inside the window, not widen the page.
- Copy drift: loop text could claim a feature the module page doesn't list. The reviewer compares each loop with its `lib/site.ts` entry, and the positioning-copy test scans `components/` for banned terms.
- Too much motion: no more than one loop per page.

---

### Task 1: Frame, timeline, header slot and the platform loop

**Files:**
- Create: `components/loops/loops.module.css`, `components/loops/LoopFrame.tsx`, `components/loops/PlatformLoop.tsx`, `components/loops/index.ts`, `tests/product-loops.test.mjs`
- Modify: `components/ui.tsx` (`PageHeader`), `app/platform/page.tsx` (pass `visual`), `package.json` (add `tests/product-loops.test.mjs` to `test:site`)

**Interfaces:**
- Produces:
  - `loops.module.css`:
    - Step classes `on1`…`on5`: hidden until step k (14%·k), then visible until the 92% hold ends.
    - `until1`…`until5`: visible from 0% until step k, then hidden.
    - `fill`: width goes from `var(--from)` to `var(--to)` between step 1 and step 4.
    - `pulse`: one soft highlight at step 5.
    - Each class sets `animation: <keyframes> 12s infinite`.
    - Under `@media (prefers-reduced-motion: reduce)`: `on*` visible, `until*` hidden, `fill` at `var(--to)`.
    - Window parts: `.window`, `.bar`, `.tabs`, `.stage`, `.chip`, `.card`, `.row`, `.pill` plus tone modifiers (`.ok`, `.warn`, `.info`, `.muted`), `.sample`.
  - `LoopFrame({ active, label, children }: { active: string; label: string; children: React.ReactNode })`:
    - Renders `<div role="img" aria-label={label}>`, with the window bar (neutral mark plus "Compliance Management Software"), tabs and the "Sample data" chip inside it.
    - Tabs: Home, Standards, Documents, Audits, Improvements, Training. When `active` isn't one of these, it is appended as the last tab.
    - `children` render inside `.stage`. Everything inside is `aria-hidden`.
  - `PlatformLoop()`: the platform overview story below.
  - `index.ts` exports `PlatformLoop` and `MODULE_LOOPS: Record<string, () => JSX.Element>`, keyed by `MODULES[].slug`. It starts empty except for comments; Tasks 2–4 fill it.
  - `PageHeader` gets an optional `visual?: React.ReactNode`. When set, the inner container becomes `lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:gap-12`. The text column keeps its current content and classes. The visual renders in a `<div className="mt-10 max-w-[520px] lg:mt-0 lg:max-w-none">`. Without `visual`, the output is the same as today.

**Platform overview story** (12 s, tab "Home"):
- Step 0: "ISO 9001 clause coverage" tile at 72% (bar `--from:72% --to:94%`). The "Needs attention" tile is empty, with a "Corrective actions" board below (Open, In progress, Verified).
- Step 1: attention item "CAPA-0142 due in 3 days" appears.
- Step 2: "Caliper C-17 calibration due Fri" appears. Card "CAPA-0142 · Burr on bracket edge · Owner: Quality engineer" moves to In progress.
- Step 3: "2 training sign-offs pending" appears. Coverage shows 88%.
- Step 4: the card moves to Verified, showing "Effectiveness checked". Coverage shows 94%.
- Step 5: a notification "Daily summary · 3 items need you this week" slides in.
- Coverage numbers swap with `until`/`on` spans: 72% → 88% → 94%.
- `aria-label`: "Sample dashboard: ISO 9001 clause coverage rises from 72 to 94 percent, due items appear, a corrective action moves from Open to Verified after its effectiveness check, and a daily summary notification arrives."

- [ ] **Step 1: Write the failing test** in `tests/product-loops.test.mjs`:
  - `"loops css has a reduced-motion final frame for every step class"`: read `components/loops/loops.module.css`. For k = 1..5, assert that `.on${k}` and `.until${k}` appear inside a `prefers-reduced-motion: reduce` block.
  - `"LoopFrame carries the neutral title and the sample-data chip"`: the file text contains `Compliance Management Software`, `Sample data`, `role="img"` and `aria-hidden`.
  - `"no loop uses the product name"`: no file under `components/loops/` matches `/yourqms|quro/i`.
- [ ] **Step 2: Run** `node --experimental-strip-types --test tests/product-loops.test.mjs` and expect a FAIL (files missing).
- [ ] **Step 3: Implement** the CSS, `LoopFrame`, `PlatformLoop`, `index.ts` and the `PageHeader` `visual` prop. Pass `visual={<PlatformLoop />}` on `/platform/`. Colors come from the site palette (navy `#162B4D`, teal `#0e7490`, gold `#D97706`, slate neutrals). Fonts are the site's `font-heading`/`font-sans`.
- [ ] **Step 4: Run** `npm run test:site` and expect all PASS.
- [ ] **Step 5: Commit** with `git commit -m "Product loops: frame, timeline, header slot and platform overview"`.

### Task 2: Loops for Standards, Documents, Processes, Audits

**Files:**
- Create: `components/loops/StandardsLoop.tsx`, `DocumentsLoop.tsx`, `ProcessesLoop.tsx`, `AuditsLoop.tsx`
- Modify: `components/loops/index.ts` (register by slug), `app/solutions/[module]/page.tsx` (pass `visual={Loop ? <Loop /> : undefined}` from `MODULE_LOOPS[m.slug]`), `tests/product-loops.test.mjs`

**Interfaces:**
- Consumes: `LoopFrame`, the step classes and `MODULE_LOOPS` (Task 1).

**Stories:**
- **Standards** (`standards`, tab Standards):
  - The clause list for ISO 9001 shows 7.1.5 "Monitoring and measuring resources" as **No evidence**, 7.5 "Documented information" as **Compliant**, and 9.3 "Management review" as **Review overdue**.
  - Step 1: evidence chip "Calibration register" links to 7.1.5, which becomes **Partial**.
  - Step 2: "C-17 certificate" links and 7.1.5 becomes **Compliant**.
  - Step 3: coverage bar 86% → 92% against "Target 95%".
  - Step 5: a "Statement of applicability (.xlsx)" button pulses.
- **Documents** (`document-control`, tab Documents):
  - `WI-104 Press brake setup · Rev C` steps Draft → In review (step 1) → Approved (step 3) → Published (step 4).
  - Approver chain "Production lead" ✓ (step 2), then "Quality manager" ✓ (step 3).
  - Step 4: line "Approved copy frozen · hash-verified".
  - Rev B shows **Obsolete** from step 4.
- **Processes** (`processes`, tab Processes):
  - Level-1 map with four lanes: Management, Customer-facing, Core, Support, holding 2–3 process boxes each.
  - Step 1: the "Production" box highlights.
  - Step 2: a Level-2 flowchart replaces the map with 4 nodes (Plan → Set up → Run → Inspect), and the arrows appear step by step.
  - Step 4: chip "Owner: Production manager".
  - Step 5: chip "2 documents · 3 clauses linked".
- **Audits** (`audits-management-review`, tab Audits):
  - Header "Internal audit · Production · ISO 9001" with three checklist rows.
  - Step 1: 8.5.1 is ticked.
  - Step 2: 7.5 is ticked.
  - Step 3: a photo evidence thumbnail attaches to 8.7.
  - Step 4: "Finding · Minor · recorded by auditor" appears on 8.7.
  - Step 5: chip "Audit closed · PDF report ready".

- [ ] **Step 1: Failing test** `"every registered loop file exists and four modules are registered"`. Parse `index.ts`, then assert that the keys include `standards`, `document-control`, `processes` and `audits-management-review`, and that each imported file exists. Then run it and expect FAIL.
- [ ] **Step 2: Implement** the four loops (one `aria-label` story sentence each) and register them. Module pages pass the loop.
- [ ] **Step 3: Run** `npm run test:site` and expect PASS. Commit with `git commit -m "Product loops: Standards, Documents, Processes and Audits"`.

### Task 3: Loops for Improvements, Safety, Training, Supplier Quality

**Files:** Create `ImprovementsLoop.tsx`, `SafetyLoop.tsx`, `TrainingLoop.tsx`, `SupplierQualityLoop.tsx` in `components/loops/`. Modify `index.ts` and `tests/product-loops.test.mjs` (extend the registered-keys assertion).

**Stories:**
- **Improvements** (`nonconformance-capa`, tab Improvements):
  - `NC-0217 · Burr on bracket edge` with the stepper Containment (step 1) → Root cause: 5 Whys, three "Why" lines appear (step 2) → CAPA: owner "Quality engineer", due date (step 3) → Effectiveness check ✓ (step 4) → **Closed** (step 5).
- **Safety** (`safety`, tab Safety):
  - A phone card "Scan to report · no login" with a QR block.
  - Step 1: near-miss form fields fill (Location "Press line 2", What happened "Guard gap on the press").
  - Step 2: severity chip "Low · no injury" (based on harm).
  - Step 3: the report appears on the separate "Safety dashboard" list.
  - Step 4: the reporter shows as "Anonymous".
- **Training** (`training-competence`, tab Training):
  - A competency matrix: 4 people by role × 3 skills, with level dots.
  - Step 1: OJT campaign card "Press brake setup · on-the-job".
  - Step 2: quiz "Pass · 9/10".
  - Step 3: "Supervisor sign-off ✓".
  - Step 4: the matrix cell for "Operator B · Press brake setup" goes from "In training" to "Competent".
  - Step 5: a certificate chip.
- **Supplier Quality** (`supplier-quality`, tab Supplier Quality):
  - `SCAR-031 · Porosity on housing` sent to "Northline Castings Ltd."
  - Step 1: a second panel "Supplier portal · your tasks only" shows the task.
  - Step 2: the supplier submits containment and root cause.
  - Step 3: back on the record, "Response received".
  - Step 4: the scorecard row updates the delivery and quality marks.
  - Step 5: chip "PFMEA · Process Flow · Control Plan linked".

- [ ] **Step 1:** Extend the registered-keys test to these four slugs and run it (expect FAIL).
- [ ] **Step 2:** Implement and register the loops.
- [ ] **Step 3:** Run `npm run test:site` (expect PASS), then commit with `git commit -m "Product loops: Improvements, Safety, Training and Supplier Quality"`.

### Task 4: Loops for Assets, Vendors, AI Assistant, then verify the whole set

**Files:** Create `AssetsLoop.tsx`, `VendorsLoop.tsx`, `AssistantLoop.tsx` in `components/loops/`. Modify `index.ts`, `tests/product-loops.test.mjs`, `docs/superpowers/specs/2026-10-26-platform-positioning-images.md` (placement table now 15 images plus a pointer to `docs/image-prompts/`), and `docs/superpowers/specs/2026-10-26-platform-positioning-design.md` (add a short "Product loops" section: where they show, the rules above, and that the home page has none).

**Stories:**
- **Assets** (`calibration-maintenance`, tab Assets):
  - Equipment register rows: "Caliper C-17 · due Fri" (amber), "Torque wrench TW-04 · in date", "Gauge pin set GP-2 · in date".
  - Step 1: C-17 opens and a calibration is recorded.
  - Step 2: certificate attached.
  - Step 3: next due date set and the row turns in date.
  - Step 4: the inspection checklist shows e-signatures "Performed ✓ · Reviewed ✓".
  - Step 5: a QR label chip.
- **Vendors** (`vendors`, tab Vendors):
  - The directory shows three rows with qualification status: Approved, Approved, Pending.
  - Step 1: a compliance document "Insurance certificate · expires in 14 days" (amber).
  - Step 2: the new document is uploaded.
  - Step 3: "Valid to Oct 2027" (ok).
  - Step 4: evaluation "Score 4.2 / 5" is saved.
  - Step 5: the Pending row becomes Approved.
- **AI Assistant** (`ai-assistant`, tab AI Assistant):
  - A chat panel. The user asks "Draft a work instruction for press brake setup from SOP-12".
  - Step 1: the visible plan appears, with three steps.
  - Step 2: "Approve plan" is pressed.
  - Step 3: a draft appears with the badge "AI draft · needs review".
  - Step 4: "Accepted by Quality manager".
  - Step 5: line "Delete requests need extra confirmation".

- [ ] **Step 1:** The test asserts that **every** `MODULES` slug is registered. Import `MODULES` from `../lib/site.ts` and compare against the keys parsed from `index.ts`. Run it and expect FAIL until all three are added.
- [ ] **Step 2:** Implement and register the loops, then update the two docs.
- [ ] **Step 3:** Run `npm run test:site`, `npm --prefix team test`, `npm run build` and `node --test tests/positioning-build.test.mjs`. All must PASS.
- [ ] **Step 4:** Commit with `git commit -m "Product loops: Assets, Vendors and AI Assistant; docs updated"`.
