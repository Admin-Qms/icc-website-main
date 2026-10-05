# ISO Certification Consultants — Project Rules

## Mandatory Multi-Agent Workflow

Every feature must follow a two-phase process. No exceptions. No code is written without completing Phase 1.

### Phase 1 — Planning (parallel agents, present for approval)

Before writing any code, simulate these agents working in parallel and present their combined output:

- **Senior Architect:** Decides which files to create/modify, data model changes, API design, how the feature fits into existing architecture. Identifies risks and dependencies.
- **Frontend Lead:** Plans component structure, page layout, state management, routing changes. Identifies reusable components.
- **Backend Lead:** Plans database schema, API endpoints, CMS structure, integrations. Identifies migration needs.
- **QA Lead:** Defines what tests are needed, which existing functionality might break, edge cases to handle.
- **Content/SEO Lead:** Validates content structure, meta tags, schema markup, page speed impact, and SEO implications of the change.

Present the combined plan as a single table with columns: File | Action (NEW/MODIFY) | Owner (which agent) | Purpose.

Include a **Risks** section listing anything that could break existing functionality.

Include a **Dependencies** section listing what this feature depends on (other features, APIs, env vars, CMS content).

**Wait for user approval before proceeding to Phase 2. Never skip this.**

### Phase 2 — Implementation (parallel execution, single commit)

After approval, implement all files in a single pass. Backend + frontend + content + tests together. Every prompt delivers a complete, deployable feature. Not backend-first. Not frontend-first. Everything at once.

**Exception:** If the feature involves CMS schema changes, authentication logic, or genuinely ambiguous architecture, the Senior Architect must flag it explicitly in the plan for user review. All other implementation proceeds directly after plan approval.

## Session Startup Protocol

At the start of every session, before doing anything else:

1. Read `CLAUDE.md` (project rules and patterns)
2. Read `ARCHITECTURE.md` (current codebase state)
3. Do NOT re-scan the entire codebase. Trust ARCHITECTURE.md as the source of truth for what exists.
4. Only read specific files when you need to modify them.

This saves tokens and time. If ARCHITECTURE.md is missing or outdated, flag it and offer to regenerate it.

## Session Closeout Protocol

At the end of every session, after all code is committed:

1. Run the architecture update script: `node scripts/update-architecture.cjs`
2. If the script doesn't exist yet, manually update ARCHITECTURE.md with:
   - New files created (with one-line description)
   - New pages or routes added
   - New components added
   - New API integrations added
   - New CMS content types or fields added
   - Any architectural decisions made in this session
3. Commit ARCHITECTURE.md alongside the feature code.

**ARCHITECTURE.md must always reflect the current state of the codebase. It is never allowed to be stale.**

## Post-Build QA Gate (MANDATORY)

After Phase 2 implementation is complete and before committing, run a mandatory QA pass. This is not optional. Do not say "ready to commit" until this gate passes.

### Step 1 — Build and test

```bash
npm run build        # must produce 0 errors
npx playwright test  # all tests must pass
```

### Step 2 — Feature self-verification

For every page or component you created or modified in this session, verify the following by reading the code (not by assuming it works):

- Every button has an `onClick` handler that does something (not empty, not `console.log`)
- Every form has all required fields wired to state and a working submit handler
- Every list/table fetches real data via hooks (not hardcoded arrays) — or uses `isDemoMode()` mock data
- Every modal/dialog has a working close button (X) that actually closes it
- Every navigation link points to a route that exists in `App.tsx`
- Every new route in `App.tsx` has a corresponding page component that renders content (not blank)
- Every API function has an `isDemoMode()` guard with mock data path
- Every dropdown/select is populated from a hook or a defined options array (not empty)
- Every status badge uses the correct color for its state
- Every form validation shows error messages to the user (not just console errors)
- No hardcoded dummy values in the UI that should be dynamic (e.g., "47 suppliers" when it should come from a query)

### Step 3 — Cross-feature impact check

- Read the files you modified. For each modified file, check what other components import it. Verify those components still work with your changes (no broken props, no missing exports, no renamed functions).
- If you modified a type definition, grep for all usages and confirm nothing breaks.
- If you modified an API function signature, grep for all callers and confirm they pass the correct arguments.

### Step 4 — Report

Before saying "ready to commit," provide a verification report:

```
QA GATE REPORT:
- Pages verified: [list every page you checked]
- Buttons verified: [count] buttons confirmed functional
- Forms verified: [count] forms with working submit
- API functions verified: [count] with isDemoMode() guard
- Cross-impact files checked: [list files checked for side effects]
- Issues found and fixed: [list anything you caught and fixed during QA]
- Known limitations: [anything you couldn't verify programmatically]
```

If any issue is found during this gate, fix it before reporting. Do not report issues and ask if the user wants them fixed — fix them first, then report what was found and fixed.

## Scheduled Blog Run (exception to the process below)

The scheduled blog run described in `team/ROUTINE.md` and approved in the root `CLAUDE.md` publishes a gate-passing article to `main` through `team/scripts/scheduled-run.sh` without a local review, a Playwright run or an "approved, push to production" message. Its push contains only `content/blog/` and `public/images/blog/`. Everything else in this file still applies to interactive sessions.

## Development Process (NON-NEGOTIABLE)

1. All changes run on local server first (`npm run dev`) — verify everything works at localhost:3000 before any git push.
2. Never push to production without explicit approval from the Owner.
3. At the end of every build, report: "Ready for local review at localhost:3000. Changes made: [list]. Waiting for your approval before pushing to production."
4. Only after the Owner says "approved, push to production" do you run `git push origin main`.

## Brand Rules (CRITICAL — Zero Tolerance)

- **Legal entity**: ISO Certification Consultants Inc. (Canadian company). It appears as the legal entity on `/privacy`, `/terms`, and the site-wide JSON-LD `legalName` field. Site operates under Canadian law (PIPEDA for privacy; Copyright Act (Canada) for IP; governing law and jurisdiction: Province of [Province], Canada).
- **AI and platform references are ALLOWED** — references to "AI", "platform", "AI-powered" are fine and encouraged in content and copy.
- **Delivery types in ISOJourney.tsx** are `"app"`, `"consultant"`, and `"hybrid"`. The hybrid model (app + consultant) is the core offering. Never use `"person"` as a delivery type.
- **Hybrid model positioning:** ISO Certification Consultants delivers through an AI-powered platform AND expert consultants working together. The app is a primary deliverable, not a secondary tool. Every stage of the certification journey should clearly communicate whether it is app-led, consultant-led, or both.
- The ISO standards marquee strip on the hero banner must always remain visible. It cycles through 10 ISO standards.

## SEO Rules (US + Canada Targeting)

- Target markets: Canada (primary) and United States (secondary). All SEO metadata, structured data, and content should reflect both markets.
- `layout.tsx` metadata includes hreflang for en-CA and en-US. Do not remove these.
- Structured data uses `ProfessionalService` schema with `areaServed` covering Canadian provinces and US states. Keep this updated.
- `FAQPage` schema in layout.tsx must match the FAQ content in `HomeFAQ.tsx`. Update both if FAQ changes.
- `robots.txt` is generated by `app/robots.ts`.
- `sitemap.ts` is in `app/` and lists blog posts from `content/blog/` (via `lib/blog.ts`). All static pages are hardcoded.
- Every new page must be added to `app/sitemap.ts`.
- Google Search Console verification via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` env var.

## Daily Blog Pipeline (the only active pipeline)

- Run with `node pm.js blog publish` from `team/` (`--dry-run` writes nothing; `--fixture <draft.json>` publishes a ready-written draft; `--force` allows a second article in one day). See `team/README.md`.
- Posts are Markdown files in `content/blog/`; images go to `public/images/blog/<slug>/`. There is no Sanity.
- Nothing is written until `contentQA.validateLocal` passes every check. Zero first person, no named companies or people, no quotes, no statistics stated as fact, scenarios labelled "Illustrative example:".
- Standard editions come from `data/standards-facts.json`; outside links only from `data/external-link-bank.json`.

## Mega Article Protocol (not active — the mega pipeline still targets Sanity and is not scheduled)

Every new mega article follows this exact pattern:
- EXACTLY 9-10 chapters per article (HARD LIMIT — never more than 10, never fewer than 9)
- Each chapter: 2,000-2,200 words minimum (1,800 absolute floor)
- Total article: 18,000-20,000 words minimum
- Chapters are H2 sections with 3-5 H3 subsections each — subsections are NOT separate chapters
- Multi-document series: 1 intro + N chapter docs sharing same seriesSlug
- Written in chunks with voice check regex after each chunk
- Zero first person (we/our/I), zero Pro Tips, zero Phase labels
- Reference style: iso-9001-for-small-manufacturers-introduction
- Named fictional Canadian manufacturer threads through every chapter
- Clause numbers cited inline throughout
- Voice check regex runs before any Sanity mutation:
  `/\b(we|we've|we're|our|I|I've|my)\b/gi`
  `/>\s*\*\*Pro Tip/gi`
  `/^Phase \d+\s*[—–-]/gm`
