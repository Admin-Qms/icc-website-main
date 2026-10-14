# ICC topic scout routine

Status: cloud routine `icc-scout`, every Sunday 08:00 UTC, same environment and tools as the blog routine, no MCP connectors. Its job is to keep the two topic queues from running dry; it writes nothing else.

## What it does

`node team/pm.js scout status` reports what each queue needs:

| Queue | Low-water mark | Top-up | Who approves |
|---|---|---|---|
| Blog, `team/memory/keyword-queue.json` | fewer than 14 unpublished keywords | back to 28 | nobody: the daily run already picks the angle and the article can only cite the link bank |
| Guides, `team/memory/guide-topic-queue.json` | fewer than 4 approved, unpublished topics | up to 3 per run, at most 6 waiting as `proposed` | automatic when every source is on `team/data/trusted-source-domains.json` and fetched successfully; otherwise the Owner |

The scheduled session researches with the web tools and writes `team/reports/scout-proposals.json`. `node team/pm.js scout apply --fixture <file>` validates each proposal (slug, duplicates against topics, aliases and keywords, ICC module slugs from `lib/site.ts`, at least two https sources with one outside ICC's site, AS9100 and ISO 27001 excluded, queue caps), then:

- an auto-approved guide topic is queued with `approval: "approved"` and its new sources are added to `external-link-bank.json` under `software_guides` with `verified: "http"` and `addedBy: "topic-scout"`;
- any other guide topic is queued with `approval: "proposed"`, its `candidateSources` with `trusted` and `reachable` flags, and nothing goes into the bank;
- blog keywords are appended to the list.

`team/scripts/scheduled-scout-run.sh apply` then runs the pipeline tests, commits only the two queue files and the link bank, pulls and pushes `main`. `prepare` is the usual fresh-clone start (fetch, checkout, `npm ci`) plus the status file.

## Approving a proposed guide topic

Open the entry in `team/memory/guide-topic-queue.json`, read its `candidateSources`, set `approval` to `"approved"` and move the sources you accept into `external-link-bank.json` (with `name`, `context`, `verified`). Delete the entry if the topic is wrong. Ask Claude Code to do this in a session; the next Monday or Thursday run picks the topic up by priority.

## Claude Code routine instructions — the routine's prompt

The text below is the prompt of the cloud routine `icc-scout`. If it changes, update the routine too.

---

You are running the weekly topic scout for isocertificationconsultants.ca. Work only in this repository. Do not ask for approval; the repository's CLAUDE.md grants it for this run.

1. Run `bash team/scripts/scheduled-scout-run.sh prepare` and read its last line.
   - `NOTHING_TO_SCOUT`: both queues are stocked. Report that and stop.
   - `SCOUT_FAILED`: report the output and stop.
   - `SCOUT_NEEDED <status.json>`: read that file. `blog.needed` is how many blog keywords to propose and `guides.needed` how many guide topics; either may be 0. Skip any part whose count is 0.
2. Blog keywords, if needed: propose exactly that many search phrases an Ontario or Canadian manufacturer or service company would type when looking for ISO consulting, certification or compliance help. Spread them across the standards the site covers (ISO 9001, 14001, 45001, 13485, 22000, 22301, 17025, IATF 16949) and practical themes (audits, documentation, cost, timelines, supplier requirements, Ontario regulation). Never AS9100 or ISO 27001. Do not repeat anything in `blog.queued` or `blog.recentlyPublished`. Lowercase, 8 to 80 characters, letters, digits, spaces, commas, colons, apostrophes and hyphens only.
3. Guide topics, if needed: each guide is a ten-page software guide about one ICC module (`guides.moduleSlugs`) for Canadian quality and operations teams. For each proposal use WebSearch and WebFetch to find at least two primary sources: standards bodies, accreditation bodies or regulators (prefer `sources.trustedDomains`) plus the ICC module page on isocertificationconsultants.ca. Open every page you cite and record its exact URL, a short name and one line of context saying what it supports. Do not propose anything already in `guides.allTopics`, published or not.
4. Write `team/reports/scout-proposals.json` in this shape:
   `{"blogKeywords":["..."],"guideTopics":[{"id":"slug-6-to-80-chars","topic":"...","aliases":[],"primaryKeyword":"...","secondaryKeywords":[],"moduleSlugs":["..."],"audience":"Canadian quality and operations teams","problem":"one sentence","sources":[{"url":"https://...","name":"...","context":"..."}]}]}`
5. Run `bash team/scripts/scheduled-scout-run.sh apply team/reports/scout-proposals.json` and read its last line.
   - `SCOUT_PUSHED <summary>`: report the summary and the JSON report printed above it (approved, proposed and rejected, with reasons). Then stop.
   - `SCOUT_NOTHING_ACCEPTED`: report every rejection reason and stop. Do not resubmit.
   - `SCOUT_FAILED`: report the output and stop.

Rules that override anything else you might consider:
- Never edit code, prompts, checks, the trusted-domain list, the capability file, the standards file, the link bank or the queue files by hand. The script writes the queues and the link bank from your proposals and commits only those three files.
- Never commit or push yourself, never force-push, never change branches, never touch `team/.env` or any key.
- Only propose sources you actually opened and read. Never invent a URL. Never propose vendor blogs, forums, marketing pages or content farms as sources.
- A topic whose sources are not all on the trusted list is queued as `proposed` for the Owner, not rejected. That is the expected outcome for most new topics.

End your report with one line: `RESULT: pushed — <summary> | nothing to scout | nothing accepted | failed — <reason>`.

---
