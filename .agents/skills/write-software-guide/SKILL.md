---
name: write-software-guide
description: Write and review ICC software guides from managed research and chapter briefs. Use for a guide assignment or the dedicated guide routine; ordinary blog articles use write-blog-article.
---

# Write an ICC software guide

Read `team/GUIDE-WRITER.md` in full and follow its managed research, sequential writing, chapter review and whole-guide audit workflow. That file is the maintained writing instruction source for both interactive guide assignments and routines. Read `team/data/guide-writing-rules.md` and the exact managed job briefs before writing.

For a scheduled guide run, also read the routine prompt at the end of `team/GUIDE-ROUTINE.md`. Use its `prepare` step rather than selecting an unscheduled topic. Resume an existing job and preserve completed pages, fixed metadata and verified evidence. Run `scheduled-guide-run.sh save-state` after every reviewed page so an interrupted session loses nothing. Stop on `NOTHING_TO_GENERATE` or an unresolved failed stage.

Write the Markdown yourself in the managed draft folder. The introduction states in one sentence what a team gains from compliance management software in general (not a promise about ICC's product), and the last chapter closes by asking the reader to book a demo at `/contact/`, without the "Stop managing compliance" slogan, which the page already shows (details in `team/GUIDE-WRITER.md`). Review each chapter before proceeding, then write the introduction. The optional API writer is a separate mode; do not invoke it as a substitute for routine-session writing unless explicitly configured for that run.

Generation, local publication and remote release are separate operations. In the scheduled run, `scheduled-guide-run.sh review` and `publish` are the only path to `main`, under the guide standing approval in the root `AGENTS.md`; in an interactive session nothing is pushed without the Owner. Report unresolved findings without changing checks, product facts or source evidence to obtain a pass.

## Codex Cloud candidate (`ICC_CLOUD_ROUTINE=1`)

Follow the existing research, frozen assignments, chapter checkpoints, independent Claude chapter reviews and revision limits. Terra writes the prose; do not use API generation for the pages. Scheduled prepare resumes existing jobs before new work; save state after each reviewed page.

Before images run `node team/pm.js guide audit --job <job-id>`, resolve findings, then `node team/pm.js guide check-text --job <job-id>`. Then run `node team/pm.js guide image-requests --job <job-id>`. For each missing page request use its exact prompt with the built-in image tool and import the actual local artifact with `node team/pm.js guide import-image --job <job-id> --page <page-slug> --file <artifact-path>`. Immediately run `bash team/scripts/scheduled-guide-run.sh save-state` after every successful import. Existing verified assets are reused without recompression; do not regenerate them. All ten page images are required by the final gate.

The Owner-enabled scheduled prompt finishes through wrapper `review <job-id>` then `publish <job-id>`. Interactive rehearsals use isolated stores and CLI dry-runs, never these wrappers. On allowance/API failure, save safe progress, wrapper `release`, and report `RESULT: saved-progress` with job, stage and reason. Do not delete locks, change frozen metadata/checks or use an API/nested CLI for images. A fresh task restores text, reviews and image bytes from `guide-state` before continuing.
