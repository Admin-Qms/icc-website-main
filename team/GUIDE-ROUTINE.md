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

The pilot draft has not passed writing acceptance and remains unpublished. System tests use clearly synthetic content in temporary directories; those fixtures establish pipeline behavior, not editorial quality or product accuracy.

## Editorial improvements (2026-10-13)

The default outlines now have distinct operational scopes for document control, CAPA, supplier quality, audit workflows and competency management. Subsection briefs assign primary evidence, key points, roles, inputs, decisions, records, exceptions, evaluation criteria and boundaries. `guide outline --fixture <research.json>` invokes the existing outline architect to refine a researched plan; supply its generated fixture to `guide research` before writing.

The API writer command reviews each written page before the runner advances. Direct Codex authors must checkpoint and run `guide review-chapter` after each chapter. A shared glossary, labeled hypothetical scenario, summaries and decisions are stored in `guide-context.json`. Earlier prose/evidence/context changes invalidate downstream authorization. Required guide cleaner/grammar/model passes cannot be skipped; copy edits and targeted revisions preserve exact links and signed factual measurements. Normal blog helper behavior is retained.

`guide budget` reports the remaining permitted page range. Chapters may use 2,000–2,200 only when the whole guide still fits; later pages reserve their minimum. `guide revise` corrects named subsections, stops after two passes and preserves attempts. Whole-guide review remains required after chapter review.

`guide preview --job <id> --port 3502` is an interactive long-running development server using the real site renderer. It rejects production mode, labels the draft, adds noindex headers/metadata and serves only allowlisted, hash-verified job images. It does not copy draft content or assets into public directories. Stop the preview after inspection.
