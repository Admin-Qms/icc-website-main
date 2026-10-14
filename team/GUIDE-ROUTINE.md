# ICC guide routine

Status: created as the Claude Code cloud routine `icc-guides` (2026-10-15, `trig_01QCftVc3PfJZmDPjnr6q4MP`), Monday and Thursday 08:00 UTC (4:00 AM Toronto in summer, 3:00 AM in winter), same cloud environment and tools as the blog routine, no MCP connectors. Enabled on 2026-10-15 once the cloud commands reached `main`; manage it at https://claude.ai/code/routines. Target: two **complete guides** per Toronto ISO week, using the Monday and Thursday production slots. Daily blogs retain their separate cadence. The routine's prompt is the block at the end of this file; the standing approval that lets it push a gate-passing guide to `main` is in the root `CLAUDE.md`.

## How the cloud run keeps state

A cloud run starts from a fresh clone, and `team/drafts/guides/` and `team/reports/guides/` are gitignored. `scheduled-guide-run.sh` therefore keeps them on the orphan branch `guide-state`: `prepare` restores the branch into the checkout before `guide brief --scheduled`, and `save-state`, `review` and `publish` push the folders back (lock files are never saved; they belong to a sandbox that no longer exists). A run that ends mid-guide loses nothing that was saved, and the next run resumes the same job: in scheduled mode `guide brief` resumes any unpublished slot job, from any week and on any day, before it reserves a new slot. A reviewed-but-unsaved page is lost, which is why the prompt saves after every reviewed page.

The branch holds drafts only. Vercel, once connected, should ignore builds for `guide-state` (Project Settings → Git → Ignored Build Step), and the GitHub Action only builds `main`.

The shared `keywordResearcher` selects an approved software topic from `memory/guide-topic-queue.json` and supplies primary-source queries. The queue is a backlog of subjects, not a second research agent. Explicit assignments use `guide brief --topic-id <id>` or an exact approved topic/alias. Unknown topics require editorial approval before entering the queue.

## Generation workflow

Run commands from the repository root:

```bash
# Scheduled cloud run (what the routine does; publish pushes to main under the standing approval)
bash team/scripts/scheduled-guide-run.sh prepare            # GUIDE_BRIEF <folder> | NOTHING_TO_GENERATE | GUIDE_FAILED
bash team/scripts/scheduled-guide-run.sh save-state <note>  # after every checkpointed, reviewed page
bash team/scripts/scheduled-guide-run.sh review <job-id>    # REVIEW_PASSED <job-id> | GUIDE_FAILED
bash team/scripts/scheduled-guide-run.sh publish <job-id>   # PUBLISHED <title> | GUIDE_FAILED

# Local, interactive use (never touches git)
node team/pm.js guide brief --next
node team/pm.js guide research --fixture <research.json>
# Claude or Codex writes the assigned Markdown using the write-software-guide skill.
# Optional configured API writer:
bash team/scripts/scheduled-guide-run.sh generate <job-id>
bash team/scripts/scheduled-guide-run.sh publish-local <job-id>
```

`prepare` resumes any unpublished slot job first; otherwise it skips non-production days and already-published slots, and reserves the slot due today. Topic and slot reservations are exclusive. A successful dry-run requires all ten pages, their images and every gate. In the scheduled run a slot counts as complete only once its guide is in `content/guides/`; a generated but unpublished job is resumed and published by the next run. Two concurrent publications are rejected through a shared lock.

Research requires retrieved primary evidence, approved exact URLs and supported claims. Product promises require verified entries in `data/software-capabilities.json`. Current candidate entries are pending: generic evaluation advice is allowed, advertising those capabilities is blocked. A missing model audit or unresolved finding blocks publication.

Nine chapters have 3–5 subsections and 2,000–2,200 visible words each. The introduction has at least 1,500 words; the inclusive guide total is 18,000–20,000. Aim near the minimum and use `guide budget` for the actual permitted maximum, reserving the minimum for every unwritten page. A ten-chapter guide cannot fit this policy. Every page has distinct metadata and a unique industrial hero; the closing chapter contains FAQs and a demonstration invitation.

## Persistence and recovery

Keep `team/drafts/guides/`, `team/reports/guides/` and the reservation files on a persistent host. They are ignored by Git. A disposable cloud checkout cannot resume jobs unless those directories are durably restored.

`guide resume --job <id>` preserves written pages and reports invalidated reviews. Edit affected Markdown explicitly, checkpoint it, then repeat audit → dry-run → validate. The optional writer preserves existing canonical page files and stops after two failed length corrections, saving attempts for inspection. It does not automatically rewrite every completed chapter.

Evidence older than 90 days or changed capability facts block release. To renew evidence while preserving chapter identities, supply updated primary-source retrieval/claims and run `guide research --fixture <research.json> --refresh`. This preserves existing Markdown, titles, order, source IDs and capability IDs while invalidating reviews and completed-generation status. Reassess every affected claim and repeat the full review. Replacing identities, withdrawing a feature or changing the outline requires editorial reconciliation; never hand-edit managed state to manufacture a pass.

Images have individual provenance checkpoints. Retries verify stored bytes, dimensions and hashes without re-encoding. An orphan image without provenance, a leftover operation/publication lock or a partially exposed image folder requires inspection of the original job, files and active processes. Do not remove locks while a run is active or delete a published guide. Preserve recovery evidence and reconcile only after confirming the interrupted operation.

## Release boundary

The scheduled run's `publish` command is the only automated path to `main`, and it is covered by the guide standing approval in the root `CLAUDE.md` (the blog approval does not cover guides). It runs `guide publish`, the pipeline tests, the site build and both guide export checkers, stages only `content/guides/` and `public/images/guides/`, commits, pulls `main`, re-verifies if the pull brought changes, pushes, then saves the job state. Drafts, reports, credentials and code never enter that commit.

The local commands (`research`, `generate`, `publish-local`) never switch branches, reset a checkout, commit or push. A manual production release of a locally published guide follows the same allowlist: a clean checkout, only the guide manifest, introduction, nine chapters and ten images, tests, build and both checkers, pull before push.

The document-control guide contains an introduction and nine chapters totaling 19,906 visible words. All ten page reviews, the whole-guide audit and 456 publishing checks passed. At the Owner's request, it is now published locally in `content/guides/document-control-software/` with ten unique industrial hero images in `public/images/guides/document-control-software/`. These website pages are separate from the previously exported review PDF. Production release and routine activation remain separate operations. System tests use clearly synthetic content in temporary directories to establish pipeline behavior.

## Editorial improvements (2026-10-13)

The default outlines now have distinct operational scopes for document control, CAPA, supplier quality, audit workflows and competency management. Subsection briefs assign primary evidence, key points, roles, inputs, decisions, records, exceptions, evaluation criteria and boundaries. `guide outline --fixture <research.json>` invokes the existing outline architect to refine a researched plan; supply its generated fixture to `guide research` before writing.

The API writer command reviews each written page before the runner advances. Direct Codex authors must checkpoint and run `guide review-chapter` after each chapter. A shared glossary, labeled hypothetical scenario, summaries and decisions are stored in `guide-context.json`. Earlier prose/evidence/context changes invalidate downstream authorization. Required guide cleaner/grammar/model passes cannot be skipped; copy edits and targeted revisions preserve exact links and signed factual measurements. Normal blog helper behavior is retained.

`guide budget` reports the remaining permitted page range. Chapters may use 2,000–2,200 only when the whole guide still fits; later pages reserve their minimum. `guide revise` corrects named subsections, stops after two passes and preserves attempts. Whole-guide review remains required after chapter review.

`guide preview --job <id> --port 3502` is an interactive long-running development server using the real site renderer. It rejects production mode, labels the draft, adds noindex headers/metadata and serves only allowlisted, hash-verified job images. It does not copy draft content or assets into public directories. Stop the preview after inspection.

## Claude Code routine instructions — the routine's prompt

The text below is the prompt of the cloud routine `icc-guides`. It is written for a fresh clone of `Admin-Qms/icc-website-main` with the same environment as the blog routine (LLM and image keys in its variables). If this text changes, update the routine too.

---

You are running the scheduled guide run for isocertificationconsultants.ca. Work only in this repository. Do not ask for approval; the repository's CLAUDE.md grants it for this run. Use the `write-software-guide` skill (`.claude/skills/write-software-guide/SKILL.md`): read it, `team/GUIDE-WRITER.md` and `team/data/guide-writing-rules.md` in full before writing. The daily blog routine is separate; leave it alone.

1. Run `bash team/scripts/scheduled-guide-run.sh prepare` and read its last line.
   - `NOTHING_TO_GENERATE`: no slot is due today, or it is already published. Report the reason printed above it and stop.
   - `GUIDE_FAILED`: report the output and stop.
   - `GUIDE_BRIEF <folder>`: continue. The job ID is the folder's name. The JSON printed before the status line says whether the job was `resumed`; if so, read `<folder>/state.json` and continue from the first unfinished stage. Everything that already exists in the folder is preserved, never rewritten.
2. Research, unless `<folder>/research.json` and `<folder>/outline.json` already exist. Read `<folder>/brief.md`, retrieve the primary sources with WebSearch and WebFetch, and write `<folder>/research-input.json` from `research-template.json`: exact approved URLs from `team/data/external-link-bank.json`, attribution, retrieval dates and the claims each source supports. Run `node team/pm.js guide outline --fixture <folder>/research-input.json`, inspect the proposal, then `node team/pm.js guide research --fixture <folder>/research-with-outline.json`, then `bash team/scripts/scheduled-guide-run.sh save-state research`. Missing primary evidence or an unapproved URL is a failed research stage: report it and stop. Never invent support and never edit the link bank.
3. Write the nine chapters in `guide.json` order, then the introduction (its page identifier is the guide slug), each from its `chapter-briefs/<slug>.md`, the shared context and the earlier reviewed chapters. Before each page run `node team/pm.js guide budget --job <id> --page <slug>` and stay inside the reported range. A page file that already exists is preserved. After writing a page run `node team/pm.js guide checkpoint --job <id> --page <slug>` and `node team/pm.js guide review-chapter --job <id> --page <slug>`; fix findings with targeted edits (or `guide revise`), at most two passes, then checkpoint and re-review. Once the page passes run `bash team/scripts/scheduled-guide-run.sh save-state <slug>`. A failed, skipped or stale review blocks the next page. Only the final chapter carries the FAQs and the demonstration invitation to `/contact/`.
4. Run `bash team/scripts/scheduled-guide-run.sh review <job-id>` (independent whole-guide audit, dry run that sources the ten images, final validation) and read its last line. On `GUIDE_FAILED` from an editorial finding: correct only the affected Markdown, checkpoint and re-review that page, and run step 4 again. Do this at most twice, then report the remaining findings and stop. On any other failure (credentials, images, locks, integrity) report the output and stop.
5. Run `bash team/scripts/scheduled-guide-run.sh publish <job-id>` and read its last line.
   - `PUBLISHED <title>`: report the title, the slug and the ten page paths. If the output contains image-provider fallback lines, quote them. Then stop.
   - `GUIDE_FAILED`: report the output and stop. Do not retry a failed install, test, build, image, lock or git step.

The session may end before the guide is complete. That is acceptable: every `save-state` is pushed to the `guide-state` branch and the next run resumes the same job. Save state after every reviewed page and never leave a reviewed page unsaved.

Rules that override anything else you might consider:
- Never edit code, prompts, skills, checks, rules, the link bank, the standards or capability files, the topic queue, `state.json`, `guide.json`, `outline.json`, `research.json`, `chapter-briefs/` or any fixed frontmatter. If a check seems wrong, say so in your report; do not work around it.
- Never commit or push anything yourself; the script does it: drafts to `guide-state`, the finished guide to `main`, and nothing else.
- Never force-push, never change branches, never delete a lock file, never touch `team/.env` or any key, never hand-write files into `content/guides/` or `public/images/guides/`, never start the preview server.
- Use third person or direct address and US spelling. Never invent companies, people, quotes, statistics, results or ICC software capabilities. A scenario starts with `**Illustrative example:**` and names no business. Unverified capabilities are evaluation questions, not promises.

End your report with one line: `RESULT: published | in progress — <pages reviewed>/10 saved | nothing to generate | failed — <stage and reason>`.

---
