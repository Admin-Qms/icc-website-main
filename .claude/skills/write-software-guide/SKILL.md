---
name: write-software-guide
description: Write and review ICC software guides from managed research and chapter briefs. Use for a guide assignment or the dedicated guide routine; ordinary blog articles use write-blog-article.
---

# Write an ICC software guide

Read `team/GUIDE-WRITER.md` in full and follow its managed research, sequential writing, chapter review and whole-guide audit workflow. That file is the maintained writing instruction source for both interactive guide assignments and routines. Read `team/data/guide-writing-rules.md` and the exact managed job briefs before writing.

For a scheduled guide run, also read the routine prompt at the end of `team/GUIDE-ROUTINE.md`. Use its `prepare` step rather than selecting an unscheduled topic. Resume an existing job and preserve completed pages, fixed metadata and verified evidence. Run `scheduled-guide-run.sh save-state` after every reviewed page so an interrupted session loses nothing. Stop on `NOTHING_TO_GENERATE` or an unresolved failed stage.

Write the Markdown yourself in the managed draft folder. Review each chapter before proceeding, then write the introduction. The optional API writer is a separate mode; do not invoke it as a substitute for routine-session writing unless explicitly configured for that run.

Generation, local publication and remote release are separate operations. In the scheduled run, `scheduled-guide-run.sh review` and `publish` are the only path to `main`, under the guide standing approval in the root `CLAUDE.md`; in an interactive session nothing is pushed without the Owner. Report unresolved findings without changing checks, product facts or source evidence to obtain a pass.
