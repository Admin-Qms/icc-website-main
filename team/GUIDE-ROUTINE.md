# ICC guide routine

Status: implemented locally, schedule inactive. Target: two **complete guides** per Toronto ISO week, using Monday and Thursday production slots. Daily blogs retain their separate cadence. Confirm the execution host, persistence and run time before activation.

The shared `keywordResearcher` selects an approved software topic from `memory/guide-topic-queue.json` and supplies primary-source queries. The queue is a backlog of subjects, not a second research agent. Explicit assignments use `guide brief --topic-id <id>` or an exact approved topic/alias. Unknown topics require editorial approval before entering the queue.

## Generation workflow

Run commands from the repository root:

```bash
bash team/scripts/scheduled-guide-run.sh prepare
node team/pm.js guide research --fixture <research.json>
# Codex writes the assigned Markdown using .agents/skills/write-software-guide/SKILL.md.
# Optional configured API writer:
bash team/scripts/scheduled-guide-run.sh generate <job-id>
bash team/scripts/scheduled-guide-run.sh review <job-id>
bash team/scripts/scheduled-guide-run.sh publish-local <job-id>
```

`prepare` skips non-production days or completed slots and resumes an interrupted job in the due slot. Topic and slot reservations are exclusive. A successful dry-run requires all ten pages, their images and every gate; it records completed generation and consumes its weekly slot even before remote release. Drafts that fail do not count as generated. Two concurrent publications are rejected through a shared lock.

Research requires retrieved primary evidence, approved exact URLs and supported claims. Product promises require verified entries in `data/software-capabilities.json`. Current candidate entries are pending: generic evaluation advice is allowed, advertising those capabilities is blocked. A missing model audit or unresolved finding blocks publication.

Nine chapters have 3–5 subsections and 2,000–2,200 visible words each. The introduction has at least 1,500 words; the inclusive guide total is 18,000–20,000. Aim near the minimum and use `guide budget` for the actual permitted maximum, reserving the minimum for every unwritten page. A ten-chapter guide cannot fit this policy. Every page has distinct metadata and a unique industrial hero; the closing chapter contains FAQs and a demonstration invitation.

## Persistence and recovery

Keep `team/drafts/guides/`, `team/reports/guides/` and the reservation files on a persistent host. They are ignored by Git. A disposable cloud checkout cannot resume jobs unless those directories are durably restored.

`guide resume --job <id>` preserves written pages and reports invalidated reviews. Edit affected Markdown explicitly, checkpoint it, then repeat audit → dry-run → validate. The optional writer preserves existing canonical page files and stops after two failed length corrections, saving attempts for inspection. It does not automatically rewrite every completed chapter.

Evidence older than 90 days or changed capability facts block release. To renew evidence while preserving chapter identities, supply updated primary-source retrieval/claims and run `guide research --fixture <research.json> --refresh`. This preserves existing Markdown, titles, order, source IDs and capability IDs while invalidating reviews and completed-generation status. Reassess every affected claim and repeat the full review. Replacing identities, withdrawing a feature or changing the outline requires editorial reconciliation; never hand-edit managed state to manufacture a pass.

Images have individual provenance checkpoints. Retries verify stored bytes, dimensions and hashes without re-encoding. An orphan image without provenance, a leftover operation/publication lock or a partially exposed image folder requires inspection of the original job, files and active processes. Do not remove locks while a run is active or delete a published guide. Preserve recovery evidence and reconcile only after confirming the interrupted operation.

## Release boundary

The runner generates and publishes locally; it never switches branches, resets a checkout, commits or pushes. The existing blog routine's standing approval does not cover guides.

For an explicitly authorized production release, use a dedicated clean checkout, include only the new guide manifest, introduction, nine chapter files and ten image files, run the pipeline tests, build and both guide export checkers, and review the exact staged allowlist. Pull before pushing and rerun validation after pulled changes. Never include drafts, reports, credentials or unrelated code in a content release. Record local generation separately from production release.

The document-control guide contains an introduction and nine chapters totaling 19,906 visible words. All ten page reviews, the whole-guide audit and 456 publishing checks passed. At the Owner's request, it is now published locally in `content/guides/document-control-software/` with ten unique industrial hero images in `public/images/guides/document-control-software/`. These website pages are separate from the previously exported review PDF. Production release and routine activation remain separate operations. System tests use clearly synthetic content in temporary directories to establish pipeline behavior.

## Editorial improvements (2026-10-13)

The default outlines now have distinct operational scopes for document control, CAPA, supplier quality, audit workflows and competency management. Subsection briefs assign primary evidence, key points, roles, inputs, decisions, records, exceptions, evaluation criteria and boundaries. `guide outline --fixture <research.json>` invokes the existing outline architect to refine a researched plan; supply its generated fixture to `guide research` before writing.

The API writer command reviews each written page before the runner advances. Direct Codex authors must checkpoint and run `guide review-chapter` after each chapter. A shared glossary, labeled hypothetical scenario, summaries and decisions are stored in `guide-context.json`. Earlier prose/evidence/context changes invalidate downstream authorization. Required guide cleaner/grammar/model passes cannot be skipped; copy edits and targeted revisions preserve exact links and signed factual measurements. Normal blog helper behavior is retained.

`guide budget` reports the remaining permitted page range. Chapters may use 2,000–2,200 only when the whole guide still fits; later pages reserve their minimum. `guide revise` corrects named subsections, stops after two passes and preserves attempts. Whole-guide review remains required after chapter review.

`guide preview --job <id> --port 3502` is an interactive long-running development server using the real site renderer. It rejects production mode, labels the draft, adds noindex headers/metadata and serves only allowlisted, hash-verified job images. It does not copy draft content or assets into public directories. Stop the preview after inspection.

## Claude Code routine instructions

The dedicated routine is separate from the daily blog routine. Its target is two complete guides per Toronto ISO week. Monday and Thursday are the supported production days; activation still requires the execution host and start time. Use a persistent working directory or restore the ignored guide state before every run. The generation instructions below stop at a reviewed draft. Automatic production release is not enabled by this prompt.

Copy the following instructions into the guide routine:

---

Generate an ICC software guide for Canadian quality and operations teams in this repository. Use the `write-software-guide` skill at `.claude/skills/write-software-guide/SKILL.md`. This is the dedicated guide routine; leave the daily blog routine separate.

1. Run `bash team/scripts/scheduled-guide-run.sh prepare`. Inspect the full output, not only its final line: the CLI prints a marker followed by JSON. If it contains `NOTHING_TO_GENERATE`, report the skip reason and stop. If the command fails or contains `GUIDE_FAILED`, report the failed stage and stop. Otherwise retain the returned managed job ID and draft directory. Preparation may resume an existing job in today's slot; do not reserve another topic for it.
2. Read the assignment, managed state and guide-writing skill. If research and a frozen outline already exist, resume that workflow; do not replace the outline after writing has started. Otherwise retrieve primary sources using authorized research tools, record precise approved URLs and supported claims in a research fixture, prepare and inspect a topic-specific enriched outline, and checkpoint it through `guide research`. Unverified ICC product capabilities must remain evaluation questions. Missing primary evidence or an unavailable approved URL is a research failure, not permission to invent support or edit the link bank.
3. Write chapters yourself in manifest order, using each fixed brief, the reviewed shared context and earlier chapters. Before each page, inspect `guide budget`. Preserve an existing page; read it and correct only an affected subsection when necessary. Checkpoint each page and run `guide review-chapter` before advancing. Only the final chapter receives the assigned FAQs. A missing, failed or stale review blocks the next chapter.
4. Write and review the introduction after all nine chapters pass. Its page identifier is the guide slug, not the word `introduction`. Keep the inclusive guide within its word budget, match the introduction to actual chapter coverage, and retain the final chapter's demonstration invitation at `/contact/`.
5. Run `bash team/scripts/scheduled-guide-run.sh review <job-id>`. This performs the independent whole-guide audit, a dry run that prepares unique images, and final validation. Inspect every finding and command exit status. All pages, required reviews, metadata, links and images must pass before reporting completed generation. A failed draft does not count as a completed guide.
6. For a failed editorial stage, make targeted corrections and repeat its required review at most twice. Preserve original attempts. If a failure remains, or an infrastructure, credential, lock or integrity error occurs, retain the draft and report the exact stage. Do not start a different topic, rewrite managed state or remove locks to conceal the failure.

Rules for this run:

- Work in managed drafts and reports. Never hand-write public guide files or copy draft images into `public/`.
- Never publish locally, commit, push, change branches or modify code, skills, checks, fixed metadata, queues, rules, the link bank, standards facts, capability verification or credentials.
- Use third person or direct address, US spelling and clearly labeled hypothetical examples. Do not invent customers, testimonials, statistics, quotations, software capabilities or results.
- Preserve job and reservation state for recovery. Do not launch the interactive preview server during unattended generation; report the preview command for later editorial inspection.
- Report the topic, job ID, chapter review count, actual total words, audit result, final gate result and draft directory. Report image-provider failures or fallbacks when present. Distinguish generated drafts from production publication.

End with: `RESULT: generated | nothing to generate | failed — <stage and reason>`.

---
