# Platform-first positioning across the site

Date: 2026-10-26 · Owner request · Status: approved by the Owner 2026-10-26. Built on branch `platform-positioning` and reviewed as a pull request before it is merged to `main`.

## Intent

Someone searching for software or an app to manage their compliance should land on isocertificationconsultants.ca. They should understand within one screen how it helps them meet their compliance requirements, and then book a demo.

Core message: **"Stop managing compliance. Start automating it."** The site presents the product as the **AI-Powered Operating System for Industrial Quality & Compliance**. It is one platform for quality, compliance, people, processes, suppliers and operations, built for organizations of every size and industry. Every claim is written as a visitor benefit: audit-ready every day, less paperwork, early warnings, and experts when you want them.

The home page wording is approved (2026-10-26). It is preserved in full in [Appendix A](#appendix-a--approved-home-page-wording). This plan carries the same message to every other part of the site.

## Decisions already made by the Owner

| Topic | Decision |
| --- | --- |
| Product name | Keep **"compliance management software"**. Never "YourQMS" or "Quro". No links, sign-in, sign-up or pricing that point to the app (rule from 2026-10-06, still in force). |
| Lead | **Book a demo** is the primary lead everywhere. The free assessment stays as the secondary call to action. |
| Lead offer | Platform first. Consulting stays in supporting sections ("Expert help when you want it"). |
| AI claims | Bold automation wording, but AI drafts, flags and handles routine tasks while **a person reviews and signs off**. Never advertise AI gap assessments or AI audit findings; gap assessments and audits are done by people. |
| Layout | **No layout changes.** Same sections, same order, same components. Only the words, metadata and call-to-action labels change. |
| Scope | Home page, platform and solution pages, all other site pages, blog and guide writer rules, SEO metadata and llms.txt. Existing published posts are **not** rewritten. |
| Tone | Visitor-first and plain. Each heading says what the reader gets. |

## Goals

1. Every page answers "how does this help me meet my compliance requirements?" in its heading or intro.
2. Every page leads to **Book a demo** (`/contact/`).
3. Search titles and descriptions target software-intent searches, such as "compliance management software", "ISO 9001 software", "IATF 16949 software", "CAPA software" and "document control software". Consulting searches (for example "ISO consultant Canada") stay covered.
4. Every new blog post and guide carries the positioning and ends in a demo invitation, automatically.

## Non-goals

- No new page layouts, components or visual design.
- No URL or slug changes, so no redirects are needed.
- No rewrite of the 24 published blog posts or the 2 published guides. They only pick up template-level changes. Blog pages get the updated dark band and the new demo box. Guide pages get the demo box only; they have no dark band today and none is added.
- No change to `team/data/software-capabilities.json` (my call). Guides keep the current rule that only verified capabilities are advertised. Editing the register would also invalidate guide jobs in progress on the `guide-state` branch.
- No pricing page and no product name.

## Anti-goals (a failure even if it ships)

- Claims the software cannot back up. Every capability named must exist in `team/data/software-capabilities.json` or a module page in `lib/site.ts`.
- Invented numbers (time saved, pass rates, customer counts). The blog rules already ban them, and the same applies to site copy.
- Buzzword copy ("revolutionize", "next-gen", "seamless") that hides the benefit.
- Losing the consulting-search traffic the site already ranks for.

## Constraints

- `icc-website-main/CLAUDE.md` rules apply: no slug or URL changes without redirects; JSON-LD can be added but not removed without review; meta descriptions stay 120 to 160 characters; primary content pages keep at least 1,500 words; `npm run build` runs before each commit; commits stay local until the Owner asks for a push.
- The daily blog, the twice-weekly guide and the weekly scout routines read the rule files on every run. A rule change goes live with the next scheduled run after the pull request is merged to `main`. The routines keep publishing to `main` meanwhile, so the branch must be rebased or merged with `main` before review ends.
- The scheduled routines are not allowed to edit rules, checks or queues. This work is done in an Owner-approved interactive session.

---

## Phase 1 — Site-wide shell and home page

What every visitor sees on every page.

| Where | Change |
| --- | --- |
| `app/page.tsx`, `components/home/Hero.tsx` | Apply the approved wording in Appendix A. |
| `components/Navbar.tsx` | Main button "Book a Consultation" → **"Book a demo"**. Top strip "ISO certification consulting for Canadian companies" → "AI-powered compliance management software · Canada". The "Free assessment" link stays. |
| `components/Footer.tsx` | Footer blurb and button use the platform message and "Book a demo". |
| `components/ui.tsx` `CTASection` | The default dark band changes to "See how much compliance work you can take off your team" with **Book a demo** and "Take the free assessment". Because every page uses it, this also updates the blog and guide pages. |
| `lib/site.ts` `SITE.tagline` | → "AI-powered compliance management software for quality and compliance, with certified consultants when you want them". It feeds llms.txt and other places. |
| `app/layout.tsx` | Default title, description, OpenGraph and the Organization JSON-LD `description` move to the platform message. `keywords` lead with the software terms. |
| `components/ContactForm.tsx`, `app/contact/page.tsx`, `api/contact.ts` | Form title "Book a demo". On the full `/contact/` form only (not the compact hero form, so the hero layout is unchanged), add one field: **"What would you like?"** (Demo · Consultation · Assessment), defaulting to Demo. The form posts to the Vercel function `api/contact.ts` (Resend), which rejects unknown fields. Add the field to its allow-list and put it in the email subject so leads can be sorted. *(Owner decision 1.)* |

```
Navbar (layout unchanged, labels only)
+---------------------------------------------------------------------------+
| AI-powered compliance management software · Canada        +1 416 622 0022 |
+---------------------------------------------------------------------------+
| [Logo]  Platform  Solutions  ROI  Standards  Industries  Blog  Guides     |
|                                       Free assessment   [ Book a demo ]   |
+---------------------------------------------------------------------------+

Contact form (one new field)
+-------------------------------+
| Book a demo                   |
| What would you like?          |
| (•) Demo  ( ) Consultation    |
| ( ) Assessment                |
| Full name / Work email / ...  |
| Standard you need to meet     |
| [ Book my demo ]              |
+-------------------------------+
```

## Phase 2 — Commercial pages

Same layout on every page. Headings, intros, button labels and metadata are rewritten in the home page's benefit voice. Consulting content stays, framed as optional expert help.

| Page | Source | New angle (headline direction) |
| --- | --- | --- |
| `/platform/` | `app/platform/page.tsx` | "The AI-powered operating system for quality and compliance". Assess → Build → Operate → Certify becomes the visitor's journey. "Software alone will not pass your audit" becomes "Experts when you want them". Search title: "AI Compliance Management Software". |
| `/solutions/` and 11 module pages | `app/solutions/[module]`, `MODULES` in `lib/site.ts` | Lead each page with the problem it removes and the benefit. Module CTAs ("Talk about document control" and so on) → "See [module] in a demo". Search titles follow the keyword ownership rule below. |
| `/services/` and 10 standard pages | `app/services/*`, `STANDARDS` | The page heading adds the software angle: "Meet ISO 9001 with less paperwork". The consulting content stays. **Search titles keep the certification and consultant terms first**, with software second, e.g. "ISO 9001 Certification Consultants & Software". These pages carry the consulting traffic. |
| `/industries/` and 8 industry pages | `app/industries/*`, `INDUSTRIES` | Headings become "Compliance management software for [industry]", with consulting as support. Search titles keep the industry and certification terms first, as on the standard pages. |

`/solutions/inspection`, `/inventory` and `/production` are redirect stubs and are not touched.

**Keyword ownership (my call).** Each search term has one owning page, so pages on the same site don't compete with each other:
- Published guides and the guide topic queue keep the terms they already own, such as "CAPA software", "document control software", "supplier quality software", "internal audit software" and "calibration management software".
- Module pages take the "[x] management software" or module-name variant and link to the matching guide.
- `/platform/` owns "compliance management software" and "AI compliance software".
- Blog posts keep their standards and how-to topics in the consultant voice. They don't target software-buying terms.
| `/process/` | `app/process/page.tsx` | "How you get certified, in six steps", with the software holding evidence from day one. |
| `/custom-solutions/`, `/roi/`, `/assessment/` | respective pages | CTAs → Book a demo. The ROI and assessment pages end with a demo invitation. |
| `/about/` | `app/about/page.tsx` | Company = software plus certified experts. Author bios unchanged. |

Each page keeps at least 1,500 words where it has that today.

## Phase 3 — Blogs and guides

New content carries the message through the rule files. Every page, old and new, gets one consistent demo box from the template, so the writer never has to improvise sales copy.

**3a. Template-level demo box (no change to post text).** A new `SoftwareDemoBox` component goes after the article body on `app/blog/[slug]/page.tsx` and on the guide introduction and chapter pages. When a post's `category` matches a standard code in `STANDARDS`, the box names that standard; otherwise it uses "Meeting your compliance requirements?". Its wording is site template copy. It names only what the live module pages in `lib/site.ts` already publish, so the guide capability gate is unaffected. *(Owner decision 2: yes, existing posts and guides too.)*

```
...end of article / FAQ...
+---------------------------------------------------------------+
| Meeting ISO 9001? Stop managing compliance. Start automating. |
| Documents, audits, training, suppliers and corrective actions |
| in one place. AI does the paperwork; your team signs off.     |
| [ Book a demo ]   Take the free assessment                    |
+---------------------------------------------------------------+
[ dark CTA band (Phase 1) ]
```

**3b. Blog writer rules.** Edit `team/data/writing-rules.md` and `.claude/skills/write-blog-article/SKILL.md`:
- The closing paragraph frames the reader's problem as one the software removes and invites them to **book a demo** at `/contact/`. Third person still applies, so it says "ISO Certification Consultants", never "we".
- Where the topic fits, the article may name one or two relevant modules by their software name, such as Documents or Improvements, with a link to that module page. Each mention says what the reader gains and claims nothing beyond that module page. The rule against a sales page stays for the body.
- Banned words: YourQMS, Quro, AI gap assessment, AI audit findings.

**3c. Guide writer rules.** Edit `team/data/guide-writing-rules.md`, `team/GUIDE-WRITER.md` and `.claude/skills/write-software-guide/SKILL.md`. The last chapter's demo invitation uses the core message, and the introduction states the benefit in one sentence. The "person reviews" wording for AI is kept.

**3d. Quality gate.** In `team/agents/content/contentQA.js` (and the guide validator), add a blocking check that fails on the banned words. Add a check that the closing paragraph links `/contact/`. Tests go in `team/tests/`.

**3e. Index pages.** The `/blog/` and `/guides/` headers and metadata change to "Practical compliance guidance, and the software that automates it". The empty state in `GuideLibraryPage` already offers a demo, and its wording is aligned.

## Phase 4 — Search and answer engines

| Item | Change |
| --- | --- |
| Per-page metadata | Titles and descriptions from Phases 1 and 2, all 120 to 160 characters, with the software keyword first. |
| JSON-LD | Add a `SoftwareApplication` block on `/platform/` (name: "Compliance management software", category: BusinessApplication, no price). Keep the existing `ProfessionalService` block. *(Owner decision 3.)* |
| `app/llms.txt/route.ts` | The opening paragraph and section names lead with the software ("Compliance management software by module", "by standard", "by industry"), with consulting listed after. |
| `content/chatbot-context.md` | "Who the company is" puts the platform first and consulting second, so the site's chat assistant answers software questions with the same message and points to a demo. |
| Guide topic queue | Software-intent searches belong to guides (see keyword ownership). Add only the terms not already queued, such as "training matrix software", "audit management software" and "IATF 16949 compliance software". Add them as scout seeds so the weekly scout validates them. Approvals are never hand-edited. The blog keyword queue is unchanged. |

## Product loops

Added 2026-10-27 on Owner direction ("proceed with the implementation of the designed product loops, for all the modules we have and wherever necessary").

**Where they show.** One loop on `/platform/` (the platform overview) and one on each of the 11 module pages, in the right half of the page header through the `PageHeader` `visual` slot. Below `lg` the loop sits under the buttons. The home page has none, by Owner decision (no home layout change). A module without a loop renders its header as before.

**Rules.**
- Unbranded: an app window titled "Compliance Management Software", no product name, logo or app link. The assistant is called "AI Assistant".
- Accurate to `lib/site.ts`: a loop shows only steps, states and labels that module's entry names, using its exact status words.
- AI rules hold: AI drafts and carries out tasks within the user's permissions, and a person reviews and accepts. AI never flags or warns, and never does gap assessments or audit findings.
- Fictional sample data only: roles, not people's names; invented codes and "Ltd." company names. Every loop carries the "Sample data" chip.
- Short, silent, CSS-only: one 12 s timeline shared by all loops, no video, no client JavaScript.
- `prefers-reduced-motion: reduce` shows the final frame, with no animation.
- Fits a 360px screen with no horizontal scroll. The loop root is `role="img"` with a one- or two-sentence label; its content is `aria-hidden`.

Code and tests: `components/loops/`, `tests/product-loops.test.mjs`.

## Verification (per phase)

- A text search of the changed files finds no "YourQMS", "Quro", "AI gap assessment" or "AI audit finding". No `href` points to yourqms.com.
- Every meta description is 120 to 160 characters. `npm --prefix team test` passes after Phase 3.
- `npm run build` runs at commit time. Each phase is a commit on the branch `platform-positioning`. The branch is pushed and opened as a pull request for review, and nothing reaches `main` until the Owner merges it.
- The Owner reviews the live pages after the push. QA screenshots are not part of this work.

## Owner decisions (answered 2026-10-26)

1. **Contact form "What would you like?" field**: yes. It goes on `/contact/` only and defaults to Demo.
2. **Demo box on existing blog posts and guides**: yes. It comes from the template, and their text is unchanged.
3. **`SoftwareApplication` JSON-LD on `/platform/`**: yes, with no price.
4. **Release**: work in the order 1 → 3 → 2 → 4, one commit per phase, on branch `platform-positioning`. The Owner sends the pull request for review before anything is merged (updated 2026-10-26; this replaces "push each phase to main").
5. **Images**: new hero, share-card and demo-box images are generated by the Owner in Codex from the [image brief](2026-10-26-platform-positioning-images.md).

## Left to the builder

The exact wording of each Phase 2 page, kept to the home page voice and the constraints above. Which modules to name in the writer-rule examples. The component and test file names.

---

## Appendix A — Approved home page wording

**Hero**
- Badge: AI-Powered Operating System for Industrial Quality & Compliance
- H1: Stop managing compliance. **Start automating it.** (accent on the second sentence)
- Lede: Need to meet ISO 9001, IATF 16949, AS9100 or another standard? Our compliance management software keeps your documents, audits, training, suppliers and corrective actions in one place. AI does the paperwork and warns you before anything slips, so you are ready for an audit any day of the year.
- Buttons: Book a demo → · See how it works
- Ticks: Ready for an audit any day · Less paperwork for your team · You approve everything AI prepares
- Form title: Book a demo · note: See the software set up for your standard. We reply within one business day. · Standard field label: Standard you need to meet · Button: Book my demo
- Trust strip: Ready for the standards your customers ask for

**What changes for you** (eyebrow) · H2: The compliance problems you have today, solved · Intro: If any of these sound familiar, this is what they look like once your compliance runs on the software.
Rows are labelled "Today → With the software":
- You are not sure which document version is current. → Everyone sees only the latest approved version, and you can show the auditor exactly which version was approved and when.
- Audit prep is a last-minute scramble. → Checklists, findings and evidence are already in one place, and the audit report is ready when the audit closes.
- Corrective actions stall with no owner. → Every corrective action has an owner, a due date and reminders, and it only closes once the fix is checked.
- Gaps show up only when the auditor points at them. → You see your coverage clause by clause, so you find the gaps before the auditor does.
- Supplier responses get lost in email. → Suppliers answer SCARs and PPAP requests in their own portal, and every response is on record.

**What you get** · H2: Everything you need to meet your compliance requirements, in one system · Intro: No more spreadsheets, binders and separate tools that someone has to pull together before every audit.
- Audit-ready every day: Evidence is saved as your team works, so you never rebuild records the week before an audit.
- Less manual work: AI drafts procedures, answers questions about your records and handles routine tasks. You review and approve.
- Early warnings: Overdue actions, expiring training, calibration due dates and clause gaps are flagged on your dashboard and in a daily summary.
- Expert help when you want it: Certified consultants can set the software up with you and guide you all the way to certification.

**Modules** · Eyebrow: The compliance management software · H2: One platform for quality, compliance, people, processes, suppliers and operations · Intro: Turn on the modules you need now and add more as you grow. Each one is set up to match the forms and approvals your team already uses. · Button: See all modules → · Cards: unchanged taglines.

**Custom** · Eyebrow: Built around you · H2: Have a requirement that doesn't fit? We'll build it. · Intro: If you are audited against something unusual, or a process still lives on paper, our experts assess your operation and set up or build a module that matches how you work. · Side card: Not sure where to start? We begin with an onsite gap assessment, design the solution around what we find, and credit the assessment fee toward it. · Engagement flow and ROI panel unchanged.

**How it works** · H2: How you get certified, in six steps · Intro: You always know where you are and what comes next. Consultants run the gap analysis and audits with you, and the software keeps the evidence from day one. · Step summaries on the home page:
1. Gap Analysis: Find out exactly what you are missing, clause by clause, with an owner for every gap.
2. System Design: Your processes are mapped as they really run, and the clauses that apply are marked.
3. Documentation: Procedures and work instructions are drafted, with optional AI help and expert review.
4. Implementation: Your team is trained, and the software tracks who still owes what.
5. Internal Audit: A full internal audit and management review catch problems early, while there is time to fix them.
6. Certification: Support through your Stage 1 and Stage 2 audits, then help staying ready for surveillance audits.

**Standards** · Eyebrow: Standards · H2: Meet ISO 9001, IATF 16949, AS9100 and any other standard · Intro: Common standards are ready to use. Customer-specific or regulatory requirements are added and tracked clause by clause in the same way.

**Industries** · Eyebrow: Industries · H2: Built for organizations of every size and industry · Intro: Whether you run one plant or many, the software is set up for your sector's requirements and your customers' demands.

**How AI helps** · H2: AI does the paperwork. You stay in control. · Intro: AI works only within the permissions you set. It prepares drafts and handles routine tasks, and nothing becomes an official record until a person approves it. Gap assessments and audits are always done by people. · Principle titles (the home page only; `AI_PRINCIPLES` on other pages unchanged): Acts within your permissions · Shows its plan first · Asks before deleting · AI drafting is your choice · A person always signs off.

**What you can count on** · H2: Stay audit-ready all year, not just the week before · Intro: Because records build up as part of daily work, your next audit is a review of what already exists. If you want hands-on help, our consultants are there from your first process map to a passed audit. · Cards: Fits how you work · Any standard · Your processes first · Software plus experts.

**Closing band** · H2: See how much compliance work you can take off your team · Intro: Book a demo set up for your standards and processes. We'll show you where the manual work goes away and how you stay ready for every audit. · Buttons: Book a demo → · Take the free assessment · Note: We reply within one business day.

**Search listing** · Title: AI Compliance Management Software for ISO 9001 & IATF 16949 · Description: AI-powered compliance management software that unifies quality, documents, audits, training and suppliers. Stay audit-ready for ISO 9001, IATF 16949 and AS9100.

Visual reference: https://claude.ai/artifact/RvqM7jKiindvGa2fyohX6o
