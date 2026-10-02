# ISO Certification Consultant Agent Company — Organizational Structure

## Status (2026-10-03)

This document describes the full agent organization as designed for the previous site. In the current codebase:

| Part | Status |
|---|---|
| Content Production — daily article (`contentManager.publishDaily`, keyword researcher, context loader, article writer, cleaner, grammar, plagiarism checker, link builder, rewrite patcher, image agent, inline image agent, content QA) | **ACTIVE** — publishes Markdown to `content/blog/`; run by hand until scheduling is set up |
| Sanity Publisher, Infographic Agent, Page Auditor (in the daily path) | **REPLACED** — by `shared/contentStore.js`, the hero image step and the local re-read after publishing |
| Mega-article pipeline, Content Enhancer, Content Refresher, Similarity Audit, Cluster Scheduler, Video-to-Blog | **OFF** — still target Sanity |
| SEO, Security, Web Development, Ops, Growth and Analytics departments; morning audit; C-Suite reports | **OFF** — target the previous site and stack |

Added for the blog pipeline: `shared/contentStore.js`, `shared/siteRoutes.js`, `scripts/check-links.js`, `data/external-link-bank.json`, `data/standards-facts.json`, `memory/keyword-queue.json`, `tests/`. See `team/README.md`.

## Overview

A full web development company structure with 7 departments, 3-tier hierarchy, 37+ agents, and daily automated operations. Every agent reports up a chain; every department produces measurable output.

---

## Organizational Hierarchy

```
                        ┌─────────────────┐
                        │   the Owner (CEO)    │
                        │   Human Owner    │
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
     ┌────────▼────────┐ ┌──────▼──────┐ ┌────────▼────────┐
     │   pm.js (CTO)   │ │  cmo.js     │ │   coo.js        │
     │  Tech & Product │ │  Marketing  │ │  Operations     │
     └────────┬────────┘ └──────┬──────┘ └────────┬────────┘
              │                  │                  │
    ┌─────────┼─────────┐       │         ┌────────┼────────┐
    │         │         │       │         │        │        │
  Web Dev  Security  DevOps  Content    SEO    Growth   Analytics
   Team     Team     Team    Team      Team    Team      Team
```

---

## C-Suite (Tier 1)

| Role | File | Responsibility | Reports To |
|------|------|---------------|------------|
| **CTO** | `pm.js` | Tech strategy, sprint planning, morning audit orchestration, cross-team coordination | the Owner |
| **CMO** | `cmo.js` | Content strategy, SEO direction, brand voice, editorial calendar | the Owner |
| **COO** | `coo.js` | Daily operations, uptime monitoring, performance metrics, reporting | the Owner |

### Enhancements Needed

- **pm.js → CTO**: Already exists. Add cross-department orchestration, sprint planning across all 7 departments, weekly strategy reports.
- **cmo.js**: **NEW**. Coordinates Content Team + SEO Team. Owns editorial calendar, content ROI metrics, keyword strategy sign-off.
- **coo.js**: **NEW**. Coordinates DevOps + Analytics + Growth. Owns uptime SLAs, performance budgets, operational dashboards.

---

## Department 1: Content Production

**Head:** `contentManager.js` (reports to CMO)

| Agent | File | Role | Status |
|-------|------|------|--------|
| Content Manager | `content/contentManager.js` | Pipeline orchestration, assignment, scheduling | Exists |
| Keyword Researcher | `content/keywordResearcher.js` | Topic discovery, keyword gaps, search volume | Exists |
| Outline Architect | `content/outlineArchitect.js` | Article structure, heading hierarchy, content briefs | Exists |
| Article Writer | `content/articleWriter.js` | Long-form content generation, mega articles | Exists |
| Content Enhancer | `content/contentEnhancer.js` | Depth improvement, stat injection, examples | Exists |
| Content Cleaner | `content/contentCleaner.js` | Voice check, formatting, markdown cleanup | Exists |
| Grammar Agent | `content/grammarAgent.js` | Spelling, grammar, readability scoring | Exists |
| Rewrite Patcher | `content/rewritePatcher.js` | Targeted section rewrites, tone fixes | Exists |
| Context Loader | `content/contextLoader.js` | Load reference material for writers | Exists |
| Plagiarism Checker | `content/plagiarismChecker.js` | Originality verification | Exists |
| Similarity Audit | `content/contentSimilarityAudit.js` | Cross-article deduplication | Exists |
| Content Refresher | `shared/contentRefresher.js` | Update stale content, refresh rankings | Exists |
| Video to Blog | `content/videoToBlog.js` | YouTube transcript extraction → blog article pipeline | **EXISTS** (2026-03-27) |

**Pipeline:** Keyword Research → Outline → Write → Enhance → Clean → Grammar → QA → Publish
**Video Pipeline:** YouTube URL → Transcript Extract → Claude Outline → Article Write → Clean → Links → QA → Publish

---

## Department 2: Visual & Media

**Head:** `imageAgent.js` (reports to Content Manager)

| Agent | File | Role | Status |
|-------|------|------|--------|
| Image Agent | `content/imageAgent.js` | Featured image sourcing (Pexels/Unsplash/Gemini) | Exists |
| Infographic Agent | `content/infographicAgent.js` | Featured image generation, 16:9 enforcement | Exists |
| Inline Image Agent | `content/inlineImageAgent.js` | In-article images, diagrams | Exists |

**Rules:**
- Every image must be unique across all posts (no duplicates)
- 16:9 aspect ratio enforced (1200x675 or similar)
- Manufacturing/industrial imagery only — no office/corporate stock
- Sources: Unsplash → Pexels → Gemini generation → placeholder

---

## Department 3: Publishing & CMS

**Head:** `sanityPublisher.js` (reports to Content Manager)

| Agent | File | Role | Status |
|-------|------|------|--------|
| Sanity Publisher | `content/sanityPublisher.js` | CMS publishing, slug dedup, schema validation | Exists |
| Content QA | `content/contentQA.js` | 10-standard quality gate, scoring | Exists |

**Quality Gate (10 Standards):**
1. No first-person voice
2. No fabricated quotes
3. Accurate readTime
4. mainImage with 16:9 ratio
5. No duplicate H1
6. Meta description 120-160 chars
7. Slug: lowercase, hyphens, min 6 chars
8. Valid publishedAt date
9. Author reference set
10. Minimum 3 content blocks

---

## Department 4: SEO & Search

**Head:** `seoManager.js` (reports to CMO)

| Agent | File | Role | Status |
|-------|------|------|--------|
| SEO Manager | `seo/seoManager.js` | SEO strategy, weekly reports, priority ranking | Exists |
| On-Page SEO | `seo/onPageSeo.js` | Title tags, meta, headings, internal links | Exists |
| Off-Page SEO | `seo/offPageSeo.js` | Backlink opportunities, competitor analysis | Exists |
| Technical SEO | `seo/technicalSeo.js` | Core Web Vitals, crawlability, schema markup | Exists |
| Content SEO | `seo/contentSeo.js` | Content briefs, keyword density, SERP alignment | Exists |
| AI Search Agent | `seo/aiSearchAgent.js` | AI search visibility (ChatGPT, Perplexity, Gemini) | Exists |
| LLM Rank Tracker | `seo/llmRankTracker.js` | Live AI citation tracking — Google AI Overviews, Perplexity (Playwright), Claude analysis | **EXISTS** (2026-03-27) |
| Link Builder | `content/linkBuilder.js` | Internal/external link building | Exists |

---

## Department 5: Web Development

**Head:** `productManager.js` (reports to CTO)

| Agent | File | Role | Status |
|-------|------|------|--------|
| Product Manager | `web/productManager.js` | Feature backlog, sprint items, requirements | Exists |
| UI Designer | `web/uiDesigner.js` | Design system compliance, component audits | Exists |
| Frontend Dev | `web/frontendDev.js` | React/Next.js components, pages, routing | Exists |
| Backend Dev | `web/backendDev.js` | API routes, integrations, server logic | Exists |
| QA Engineer | `web/qaEngineer.js` | Site health checks, page verification | Exists |
| Design QA | `web/designQA.js` | Visual regression, design consistency | Exists |
| Page Auditor | `web/pageAuditor.js` | 1,500-word minimum, content depth verification | Exists |
| Device QA | `web/deviceQA.js` | 12 Playwright device profiles, responsive testing | Exists |

---

## Department 6: Growth & Leads

**Head:** `leadsAgent.js` → upgraded to Growth Head (reports to COO)

| Agent | File | Role | Status |
|-------|------|------|--------|
| Leads Agent | `shared/leadsAgent.js` | Lead tracking, CRM integration, Leadfeeder | Exists |
| Conversion Optimizer | `growth/conversionOptimizer.js` | CTA testing, form optimization, funnel analysis | **NEW** |

**Enhancement:** `leadsAgent.js` needs upgrade from basic tracking to full growth head — owns conversion metrics, lead quality scoring, and funnel reporting.

---

## Department 7: Operations & Infrastructure

**Head:** COO (`coo.js`, reports to the Owner)

### DevOps Sub-Team

| Agent | File | Role | Status |
|-------|------|------|--------|
| DevOps Manager | `ops/devOpsManager.js` | Build pipeline, deployment checks, Vercel health | **NEW** |
| Uptime Monitor | `ops/uptimeMonitor.js` | SSL, DNS, endpoint health, response times | **NEW** |

### Security Sub-Team

| Agent | File | Role | Status |
|-------|------|------|--------|
| VAPT Agent | `security/vaptAgent.js` | Vulnerability assessment, penetration testing | Exists |
| Compliance Monitor | `security/complianceMonitor.js` | Security headers, OWASP checks, risk scoring | Exists |

### Analytics Sub-Team

| Agent | File | Role | Status |
|-------|------|------|--------|
| Analytics Manager | `ops/analyticsManager.js` | Traffic analysis, user behavior, conversion data | **NEW** |
| Report Processor | `ops/reportProcessor.js` | Parse daily reports, extract action items, auto-fix issues | **EXISTS** (2026-03-25) |
| Brand Mention Monitor | `ops/brandMentionMonitor.js` | Web + news brand mention tracking, sentiment analysis, competitor landscape | **EXISTS** (2026-03-27) |
| Reporting Agent | `ops/reportingAgent.js` | Daily/weekly/monthly report generation | **NEW** |

### Shared Infrastructure

| File | Purpose |
|------|---------|
| `shared/config.js` | Models, paths, site URL, API keys |
| `shared/claude.js` | Claude API wrapper (sonnet-4-6 + haiku-4-5) |
| `shared/sanity.js` | Sanity CMS client and helpers |
| `shared/logger.js` | Centralized logging |
| `shared/heartbeat.js` | Agent health tracking |
| `shared/notifier.js` | Email notifications (Resend) |
| `shared/reporter.js` | Report generation and formatting |
| `shared/git.js` | Git operations |
| `shared/imageRegistry.js` | Image deduplication tracking |
| `shared/teamAuditor.js` | Team health dashboard, HTML email |

---

## Agent Census

| Category | Count |
|----------|-------|
| **Existing agents** | 41 |
| **New agents needed** | 5 |
| **Total after expansion** | 46 |
| **Departments** | 7 |
| **C-Suite roles** | 3 |

### New Agents to Build

| Agent | File | Department | Purpose |
|-------|------|------------|---------|
| CMO | `c-suite/cmo.js` | C-Suite | Content + SEO strategy, editorial calendar |
| COO | `c-suite/coo.js` | C-Suite | Operations, uptime, performance |
| DevOps Manager | `ops/devOpsManager.js` | Operations | Build pipeline, Vercel health |
| Uptime Monitor | `ops/uptimeMonitor.js` | Operations | Endpoint health, SSL, DNS |
| Analytics Manager | `ops/analyticsManager.js` | Operations | Traffic, behavior, conversions |
| Reporting Agent | `ops/reportingAgent.js` | Operations | Consolidated reports |
| Conversion Optimizer | `growth/conversionOptimizer.js` | Growth | CTA testing, funnel optimization |

### Recently Built Agents (2026-03-27)

| Agent | File | Department | Purpose |
|-------|------|------------|---------|
| LLM Rank Tracker | `seo/llmRankTracker.js` | SEO | Live AI citation tracking — Google AI Overviews + Perplexity + Claude citability scoring |
| Brand Mention Monitor | `ops/brandMentionMonitor.js` | Operations | Web + news mention scanning, sentiment analysis, competitor landscape tracking |
| Video to Blog | `content/videoToBlog.js` | Content | YouTube transcript → blog article full pipeline (extract, outline, write, QA, publish) |

---

## Daily Operations Schedule

All times Eastern (America/Toronto). Pipeline runs on Windows laptop via Claude Cowork.

```
5:00 AM  ─  COO: System health check (uptime, SSL, DNS)
5:05 AM  ─  DevOps Manager: Verify Vercel deployment status
5:10 AM  ─  Content Manager: Trigger daily content pipeline
             ├── Keyword Researcher: Pick topic
             ├── Outline Architect: Structure article
             ├── Article Writer: Generate content
             ├── Content Enhancer: Add depth
             ├── Content Cleaner: Voice + format
             ├── Grammar Agent: Final polish
             ├── Image Agent: Source featured image
             ├── Inline Image Agent: In-article images
             ├── Content QA: 10-standard gate
             └── Sanity Publisher: Publish to CMS
5:45 AM  ─  Link Builder: Add internal links to new article
5:50 AM  ─  Page Auditor: Verify published page
6:00 AM  ─  SEO Manager: Trigger SEO audit
             ├── On-Page SEO: Audit all pages
             ├── Technical SEO: Core Web Vitals
             ├── Off-Page SEO: Backlink check
             └── Content SEO: Keyword alignment
6:15 AM  ─  Security Team: Daily scan
             ├── VAPT Agent: Vulnerability scan
             └── Compliance Monitor: Header check
6:30 AM  ─  Analytics Manager: Pull yesterday's metrics
6:35 AM  ─  Reporting Agent: Compile daily report
6:40 AM  ─  Team Auditor: Build HTML dashboard
6:45 AM  ─  CTO (pm.js): Send consolidated morning email to the Owner
6:46 AM  ─  Report Processor: Parse report, auto-fix issues, generate task list
```

### Weekly Schedule (Mondays)

```
7:00 AM  ─  CMO: Weekly content strategy review
7:15 AM  ─  SEO Manager: Weekly SEO report
7:30 AM  ─  AI Search Agent: AI visibility audit
7:35 AM  ─  LLM Rank Tracker: AI citation tracking cycle (Google AI Overviews + Perplexity)
7:40 AM  ─  Brand Mention Monitor: Brand scan + competitor landscape
7:45 AM  ─  COO: Weekly operations summary
8:00 AM  ─  CTO: Weekly sprint report to the Owner
```

---

## Reporting Chain

```
Individual Agent → Department Head → C-Suite → the Owner

Examples:
  articleWriter.js → contentManager.js → cmo.js → the Owner
  onPageSeo.js    → seoManager.js     → cmo.js → the Owner
  frontendDev.js  → productManager.js  → pm.js  → the Owner
  vaptAgent.js    → coo.js            → the Owner
  leadsAgent.js   → coo.js            → the Owner
```

### Report Types

| Report | Frequency | Owner | Recipient |
|--------|-----------|-------|-----------|
| Morning Dashboard | Daily | teamAuditor.js | the Owner (email) |
| Content Pipeline Log | Daily | contentManager.js | CMO |
| SEO Audit | Weekly | seoManager.js | CMO |
| AI Search Visibility | Weekly | aiSearchAgent.js | CMO |
| AI Visibility Tracker | Weekly | llmRankTracker.js | CMO |
| Brand Mention Report | Weekly | brandMentionMonitor.js | COO |
| Site Health | Daily | qaEngineer.js | CTO |
| Security Scan | Daily | vaptAgent.js | COO |
| Lead Report | Daily | leadsAgent.js | COO |
| Sprint Summary | Weekly | pm.js | the Owner |
| Operations Summary | Weekly | coo.js | the Owner |

---

## Communication Channels

| Channel | Purpose | Tool |
|---------|---------|------|
| Morning Email | Daily consolidated dashboard | Resend API |
| Agent Heartbeats | Real-time health tracking | `agent-heartbeats.json` |
| Pipeline Logs | Execution trace | `shared/logger.js` |
| Daily Reports | JSON audit archives | `reports/daily/` |
| Git Commits | Code change tracking | Git + GitHub |

---

## Multi-Machine Setup

| Machine | Role | Tools |
|---------|------|-------|
| **Windows Laptop** | Daily scheduled tasks (content pipeline, morning audit, SEO) | Claude Cowork (`/schedule`) |
| **Mac (this machine)** | Interactive development, bug fixes, feature work, image fixes | Claude Code CLI |

**Rule:** Always `git pull` before `git push` — both machines commit to the same repo.

---

## Sprint 0: SEO & Lead Generation Infrastructure (Immediate)

Full audit completed 2026-03-25. Work split between Claude Code (Mac) and Claude Cowork (Windows).

### Audit Findings & Resolution (2026-03-25)

| Area | Before | After | Fixed By |
|------|--------|-------|----------|
| Sitemap | OK | OK | — |
| robots.txt | OK | OK | — |
| Google Search Console | PARTIAL | Verification tag deployed | Claude Code |
| Google Analytics (GA4) | MISSING | G-XXXXXXXXXX wired into layout.tsx | Claude Code + Cowork |
| Google Business Profile | MISSING | — | Cowork (pending) |
| Bing Webmaster Tools | MISSING | — | Cowork (pending) |
| Structured data (layout) | PARTIAL | ProfessionalService + WebSite (logo, postalCode added) | Claude Code |
| Structured data (services) | OK | OK + dynamic OG images | Claude Code |
| Structured data (industries) | OK | OK + dynamic OG images | Claude Code |
| Structured data (blog) | MISSING | BlogPosting schema on all posts (dateModified, wordCount, publisher logo) | Claude Code |
| Canonical URLs (core pages) | MISSING | Added to about, contact, process, privacy, terms | Claude Code |
| Duplicate FAQPage schema | BUG | Fixed — FAQPage moved from global layout to homepage only | Claude Code |
| SearchAction schema | BUG | Removed (no search UI exists) | Claude Code |
| OG images (service/industry) | MISSING | Dynamic branded OG images via next/og ImageResponse | Claude Code |
| Form validation whitelist | BUG | Expanded from 6 to 13 standards | Claude Code |
| Leadfeeder | OK | OK | — |
| CRM webhook | PARTIAL | Env var set in Vercel — LIVE | Cowork (DONE) |
| Resend email | PARTIAL | RESEND_API_KEY set in Vercel — LIVE | Cowork (DONE) |

### Claude Code (Mac) — Code Changes: ALL COMPLETE

| # | Task | Files | Status |
|---|------|-------|--------|
| 1 | BlogPosting schema on blog posts | `app/blog/[slug]/page.tsx`, `lib/sanity.ts` | DONE |
| 2 | Canonical URLs on 5 core pages | about, contact, process, privacy, terms | DONE |
| 3 | Fix duplicate FAQPage schema | `app/layout.tsx`, `app/page.tsx` | DONE |
| 4 | Expand form validation whitelist | `app/api/contact/route.ts` | DONE |
| 5 | Fix ProfessionalService schema | `app/layout.tsx` | DONE |
| 6 | Remove broken SearchAction schema | `app/layout.tsx` | DONE |
| 7 | Dynamic OG images for 18 pages | `app/services/[standard]/opengraph-image.tsx`, `app/industries/[industry]/opengraph-image.tsx` | DONE |
| 8 | Wire GA4 (G-XXXXXXXXXX) | `app/layout.tsx` | DONE |

### Claude Cowork (Windows) — Manual/External Tasks

| # | Task | Service | Status |
|---|------|---------|--------|
| 1 | Create GA4 property | Google Analytics | DONE (G-XXXXXXXXXX) |
| 2 | Verify Google Search Console | Google Search Console | DONE |
| 3 | Submit sitemap | Google Search Console | DONE |
| 4 | Request indexing for key pages | Google Search Console | PARTIAL — 5 pages pending (quota reset tomorrow) |
| 5 | Create Google Business Profile | Google Business Profile | CREATED — pending postcard verification (the Owner needs to enter London, ON address) |
| 6 | Set up Bing Webmaster Tools | Bing Webmaster Tools | DONE — data processing (48h) |
| 7 | Set `RESEND_API_KEY` in Vercel | Vercel Dashboard | DONE |
| 8 | Set `CRM_WEBHOOK_API_KEY` in Vercel | Vercel Dashboard | DONE |
| 9 | Set `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` in Vercel | Vercel Dashboard | DONE |

---

## Sprint 1: Content QA & Report Automation (2026-03-25)

Triggered by morning audit report showing 110/117 articles failing QA. Root cause: field naming inconsistency (`featuredImage` vs `mainImage`).

### Findings

| Issue | Count | Root Cause | Severity |
|-------|-------|------------|----------|
| Articles missing `mainImage` | 110/117 | `sanityPublisher.js` wrote `featuredImage`, QA checks `mainImage` | HIGH |
| Short meta descriptions (<120 chars) | 14 | Content pipeline not enforcing minimum | MEDIUM |
| Long meta descriptions (>160 chars) | 12 | Content pipeline not enforcing maximum | MEDIUM |
| Missing author reference | 7 | Older articles or pipeline gap | MEDIUM |
| No image at all | 4 | Image sourcing failed during publish | HIGH |
| CSP unsafe-inline/unsafe-eval | — | Third-party scripts (GA4, Leadfeeder) require it | MEDIUM |

### Fixes Applied (Claude Code — Mac)

| # | Task | Files Modified | Status |
|---|------|----------------|--------|
| 1 | `contentQA.js` — check both `mainImage` AND `featuredImage` (matches `coalesce()` in GROQ) | `team/agents/content/contentQA.js` | DONE |
| 2 | `sanityPublisher.js` — set `mainImage` alongside `featuredImage` on all new publishes (standalone, intro, chapters) | `team/agents/content/sanityPublisher.js` | DONE |
| 3 | Migration script — copies `featuredImage` → `mainImage` for existing 110 articles | `team/migrate-mainImage.js` (NEW) | DONE — run with `--apply` |
| 4 | Report Processor agent — parses daily reports, extracts action items, auto-fixes mainImage + author issues | `team/agents/ops/reportProcessor.js` (NEW) | DONE |
| 5 | Wire Report Processor into `pm.js` morning pipeline (step 10/10, runs with `--auto-fix`) | `team/pm.js` | DONE |

### Next Steps (Manual)

| # | Task | Owner | Status |
|---|------|-------|--------|
| 1 | Run `node team/migrate-mainImage.js --apply` to fix 110 existing articles | the Owner / Cowork | PENDING |
| 2 | Fix 14 short meta descriptions in Sanity | Cowork content pipeline | PENDING |
| 3 | Fix 12 long meta descriptions in Sanity | Cowork content pipeline | PENDING |
| 4 | Fix 4 articles with no image at all | Cowork `imageAgent.js` | PENDING |
| 5 | Add Permissions-Policy header + tighten CSP | Claude Code (next sprint) | PENDING |

---

## Implementation Priority

### Sprint 0 — SEO Infrastructure (2026-03-25) — CODE COMPLETE
- Claude Code: All 8/8 code tasks done and deployed
- Claude Cowork: GA4 property created, remaining manual tasks in progress
- No blockers remaining on code side

### Phase 1 — Agent Foundation (Week 1)
- Create `c-suite/cmo.js` and `c-suite/coo.js`
- Upgrade `pm.js` with cross-department orchestration
- Create `ops/` directory with `devOpsManager.js` and `uptimeMonitor.js`

### Phase 2 — Analytics & Reporting (Week 2)
- Create `ops/analyticsManager.js` and `ops/reportingAgent.js`
- Enhance `teamAuditor.js` dashboard with department-level metrics
- Wire COO into morning pipeline

### Phase 3 — Growth (Week 3)
- Create `growth/conversionOptimizer.js`
- Upgrade `leadsAgent.js` to Growth Head role
- Add funnel metrics to daily reports

### Phase 4 — Integration (Week 4)
- Wire all new agents into `teamAuditor.js` TEAMS definition
- Update morning pipeline in `pm.js` to include all 7 departments
- Full end-to-end test of daily + weekly schedules
- Update `CLAUDE.md` and `ARCHITECTURE.md`

---

## File Structure (After Expansion)

```
team/
├── pm.js                          # CTO — orchestrator
├── CLAUDE.md                      # Project rules
├── AGENT-COMPANY-ORG.md           # This document
├── .env                           # API keys
├── agents/
│   ├── c-suite/
│   │   ├── cmo.js                 # Chief Marketing Officer (NEW)
│   │   └── coo.js                 # Chief Operations Officer (NEW)
│   ├── content/
│   │   ├── articleWriter.js
│   │   ├── contentCleaner.js
│   │   ├── contentEnhancer.js
│   │   ├── contentManager.js      # Content Dept Head
│   │   ├── contentQA.js
│   │   ├── contentRefresher.js
│   │   ├── contentSimilarityAudit.js
│   │   ├── contextLoader.js
│   │   ├── grammarAgent.js
│   │   ├── imageAgent.js
│   │   ├── infographicAgent.js
│   │   ├── inlineImageAgent.js
│   │   ├── keywordResearcher.js
│   │   ├── outlineArchitect.js
│   │   ├── plagiarismChecker.js
│   │   ├── rewritePatcher.js
│   │   ├── sanityPublisher.js
│   │   └── videoToBlog.js              # Video → Blog pipeline (NEW 2026-03-27)
│   ├── seo/
│   │   ├── aiSearchAgent.js
│   │   ├── contentSeo.js
│   │   ├── linkBuilder.js
│   │   ├── offPageSeo.js
│   │   ├── onPageSeo.js
│   │   ├── llmRankTracker.js         # LLM Rank Tracker (NEW 2026-03-27)
│   │   ├── seoManager.js         # SEO Dept Head
│   │   └── technicalSeo.js
│   ├── web/
│   │   ├── backendDev.js
│   │   ├── designQA.js
│   │   ├── deviceQA.js
│   │   ├── frontendDev.js
│   │   ├── pageAuditor.js
│   │   ├── productManager.js     # Web Dev Dept Head
│   │   ├── qaEngineer.js
│   │   └── uiDesigner.js
│   ├── growth/
│   │   └── conversionOptimizer.js # (NEW)
│   ├── ops/
│   │   ├── brandMentionMonitor.js # Brand Mention Monitor (NEW 2026-03-27)
│   │   ├── reportProcessor.js     # Report parsing + auto-fix (EXISTS)
│   │   ├── devOpsManager.js       # (NEW)
│   │   ├── uptimeMonitor.js       # (NEW)
│   │   ├── analyticsManager.js    # (NEW)
│   │   └── reportingAgent.js      # (NEW)
│   ├── security/
│   │   ├── complianceMonitor.js
│   │   └── vaptAgent.js
│   └── shared/
│       ├── claude.js
│       ├── config.js
│       ├── git.js
│       ├── heartbeat.js
│       ├── imageRegistry.js
│       ├── leadsAgent.js         # Growth Dept Head
│       ├── logger.js
│       ├── notifier.js
│       ├── reporter.js
│       ├── sanity.js
│       └── teamAuditor.js
```
