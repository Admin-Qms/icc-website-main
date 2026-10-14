# ICC topic scout routine

Status: cloud routine `icc-scout`, every Sunday 08:00 UTC, same environment and tools as the blog routine, no MCP connectors. Its job is to keep the two topic queues from running dry with no human involvement; it writes nothing else.

## What it does

`node team/pm.js scout status` reports what each queue needs:

| Queue | Low-water mark | Top-up | Who approves |
|---|---|---|---|
| Blog, `team/memory/keyword-queue.json` | fewer than 14 unpublished keywords | back to 28 | deterministic rules only: the daily run already picks the angle and the article can only cite the link bank |
| Guides, `team/memory/guide-topic-queue.json` | fewer than 4 approved or pending, unpublished topics | up to 3 per run | an independent reviewer agent, see below |

The scheduled session (the proposer) researches with the web tools and writes `team/reports/scout-proposals.json`. `node team/pm.js scout apply --fixture <file>` (`team/agents/content/topicScout.js`) then judges every guide topic in three layers. All three must pass; nothing is approved any other way.

1. **Hard rules in code.** Valid slug; no duplicate against existing topics, aliases or keywords; module slugs taken from `MODULES` in `lib/site.ts`; AS9100 and ISO 27001 excluded; at least two https sources with at least one outside ICC's site; no source on `team/data/blocked-source-domains.json` (social, forums, aggregators, review marketplaces, content farms); queue caps.
2. **Fetched evidence.** Every source is fetched by the script itself and must return HTTP 200. Every non-ICC page's text must mention the topic. The proposer's descriptions are never trusted; the reviewer sees the fetched text.
3. **Independent reviewer.** The configured LLM (`claudeJSONFast`, the same path as the guide audit) is given a reviewer prompt, the fetched page text, the existing topic list and five rules: R1 scope (a software guide subject for one ICC module, not a standards explainer or vendor pitch), R2 distinctness, R3 source quality (primary or official documents only, each genuinely supporting the topic), R4 accuracy (keyword, module and problem consistent with the sources; no unsupported standard, edition or clause), R5 fit (Canadian organisations, nothing excluded). Any failed rule rejects the topic. The verdict and findings are stored on the queue entry (`approvedBy: "scout-reviewer"`).

An approved topic's sources go into `external-link-bank.json` under `software_guides` with `verified: "http"` and `addedBy: "topic-scout"`. A rejected topic is reported with its reasons and not queued. Only a reviewer outage (no key, provider error, invalid verdict) parks a topic as `proposed` with its `candidateSources`; the next run re-judges it first, approving or removing it. `team/data/trusted-source-domains.json` remains the list of preferred domains the proposer is pointed at.

`team/scripts/scheduled-scout-run.sh apply` then runs the pipeline tests, commits only the two queue files and the link bank, pulls and pushes `main`. `prepare` is the usual fresh-clone start (fetch, checkout, `npm ci`) plus the status file.

## Changing the rules

Edit the domain lists freely. The reviewer's five rules live in `REVIEW_RULES` in `topicScout.js`, and the hard rules next to them; both are covered by `team/tests/topic-scout.test.js`. The queue entry of every approved topic records which rules passed and the reviewer's findings, so a bad approval can be traced and the rule tightened.

## Claude Code routine instructions — the routine's prompt

The text below is the prompt of the cloud routine `icc-scout`. If it changes, update the routine too.

---

You are running the weekly topic scout for isocertificationconsultants.ca. Work only in this repository. Do not ask for approval; the repository's CLAUDE.md grants it for this run.

1. Run `bash team/scripts/scheduled-scout-run.sh prepare` and read its last line.
   - `NOTHING_TO_SCOUT`: both queues are stocked. Report that and stop.
   - `SCOUT_FAILED`: report the output and stop.
   - `SCOUT_NEEDED <status.json>`: read that file. `blog.needed` is how many blog keywords to propose and `guides.needed` how many guide topics; either may be 0. Skip any part whose count is 0.
2. Blog keywords, if needed: propose exactly that many search phrases an Ontario or Canadian manufacturer or service company would type when looking for ISO consulting, certification or compliance help. Spread them across the standards the site covers (ISO 9001, 14001, 45001, 13485, 22000, 22301, 17025, IATF 16949) and practical themes (audits, documentation, cost, timelines, supplier requirements, Ontario regulation). Never AS9100 or ISO 27001. Do not repeat anything in `blog.queued` or `blog.recentlyPublished`. Lowercase, 8 to 80 characters, letters, digits, spaces, commas, colons, apostrophes and hyphens only.
3. Guide topics, if needed: each guide is a ten-page software guide about one ICC module (`guides.moduleSlugs`) for Canadian quality and operations teams. For each proposal use WebSearch and WebFetch to find at least two primary sources: standards bodies, accreditation bodies or regulators (prefer `sources.trustedDomains`, never `sources.blockedDomains`) plus the ICC module page on isocertificationconsultants.ca. Open every page you cite and record its exact URL, a short name and one line of context saying what it supports. Do not propose anything already in `guides.allTopics`, published or not. Read `guides.reviewRules`: an independent reviewer will judge each proposal against them using the fetched page text, so propose only topics and sources that clearly satisfy every rule.
4. Write `team/reports/scout-proposals.json` in this shape:
   `{"blogKeywords":["..."],"guideTopics":[{"id":"slug-6-to-80-chars","topic":"...","aliases":[],"primaryKeyword":"...","secondaryKeywords":[],"moduleSlugs":["..."],"audience":"Canadian quality and operations teams","problem":"one sentence","sources":[{"url":"https://...","name":"...","context":"..."}]}]}`
5. Run `bash team/scripts/scheduled-scout-run.sh apply team/reports/scout-proposals.json` and read its last line.
   - `SCOUT_PUSHED <summary>`: report the summary and the JSON report printed above it (approved, rejected with the reviewer's findings, and any parked for re-review). Then stop.
   - `SCOUT_NOTHING_ACCEPTED`: report every rejection reason and stop. Do not resubmit.
   - `SCOUT_FAILED`: report the output and stop.

Rules that override anything else you might consider:
- Never edit code, prompts, checks, the domain lists, the capability file, the standards file, the link bank or the queue files by hand. The script writes the queues and the link bank from your proposals and commits only those three files.
- Never commit or push yourself, never force-push, never change branches, never touch `team/.env` or any key.
- Only propose sources you actually opened and read. Never invent a URL. Never propose vendor blogs, forums, marketing pages or content farms as sources.
- The reviewer's verdict is final for this run. Do not rephrase a rejected topic and submit it again.

End your report with one line: `RESULT: pushed — <summary> | nothing to scout | nothing accepted | failed — <reason>`.

---
