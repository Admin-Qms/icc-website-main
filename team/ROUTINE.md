# Scheduled blog run

Active: ICC Blogs on Codex Cloud, daily 09:05 UTC. See the active prompt below and `CLOUD-SETUP.md`.

## Legacy Claude rollback prompt

Copy the text below into the cloud routine's instructions. It is written for a fresh clone of `Admin-Qms/icc-website-main` with the `icc-blog` environment (keys in its variables).

---

You are running the scheduled daily blog publish for isocertificationconsultants.ca. Work only in this repository. Do not ask for approval; the repository's CLAUDE.md grants it for this run.

1. Run `bash team/scripts/scheduled-run.sh prepare` and read its last line.
   - `NOTHING_TO_PUBLISH`: an article already exists for today. Report that and stop.
   - `PIPELINE_FAILED`: report the output and stop.
   - `BRIEF <folder>`: continue.
2. Use the `write-blog-article` skill (`.claude/skills/write-blog-article/SKILL.md`): read `<folder>/brief.md` in full and write `<folder>/body.md`. Follow every rule in the brief.
3. Run `bash team/scripts/scheduled-run.sh publish <folder>/draft.json` and read its last line.
   - `PUBLISHED <title>`: report the title and the page path printed above it. If the output contains an `IMAGE_FALLBACK:` line, quote it and every `[imageAgent]` line in your report so the reason the first-choice image provider failed is visible. Then stop.
   - `PIPELINE_FAILED` because of checks on the draft (first person, spelling, links, length, claims, keywords): fix `body.md` to satisfy them and run step 3 again. Do this at most twice, then report the remaining issues and stop.
   - `PIPELINE_FAILED` for any other reason (install, build, images, git): report the output and stop.

Rules that override anything else you might consider:
- Never edit code, prompts, checks, the rules file, the link bank, the standards file, `draft.json`, the title or the meta description. If a check seems wrong, say so in your report; do not work around it.
- Never commit or push anything yourself; the script does the commit and the push to `main`, and only for the article and its images.
- Never force-push, never change branches other than what the script does, never touch `team/.env` or any key.
- Never invent companies, people, quotes or statistics in the article. A scenario starts with `**Illustrative example:**` and names no business.

End your report with one line: `RESULT: published | nothing to publish | failed — <reason>`.

## Active Codex Cloud prompt (former candidate)

The Owner enabled this Codex Cloud routine on 2026-11-20. The earlier Claude prompt is retained unchanged as a rollback reference; its trigger is paused.

```text
Run the ICC daily blog in ICC Blogs with the actual session model GPT-6.1 Terra. This is the active Owner-authorized scheduled prompt; readiness probes must not execute it.

Read AGENTS.md, team/CLOUD-SETUP.md and .agents/skills/write-blog-article/SKILL.md. Require ICC_CLOUD_ROUTINE=1; do not print keys. Run bash team/scripts/scheduled-run.sh prepare. On NOTHING_TO_PUBLISH stop. Otherwise use its returned brief/draft folder, preserve fixed metadata, and write body.md following the complete brief and writing rules. Terra writes; Claude independently reviews through the CLI.

Run node team/pm.js blog check-text --fixture <draft.json>; correct only the body, with at most two correction passes. Save through bash team/scripts/scheduled-run.sh save-state. Run node team/pm.js blog image-requests --fixture <draft.json>. Use each exact returned prompt with the built-in image tool, then import its real local artifact through node team/pm.js blog import-image --fixture <draft.json> --id <id> --file <artifact>. Save state after every import. Resume stored images; never use an image API or nested CLI. Run node team/pm.js blog publish --fixture <draft.json> --dry-run, then bash team/scripts/scheduled-run.sh publish <draft.json> only when all gates pass.

A missing reviewer/key, exhausted allowance or other failure stops publication. Save safe progress if possible, release through bash team/scripts/scheduled-run.sh release, and report the actual saved stage/reason. If checkpointing fails, say progress is local and preserve it. Do not retry Git/integrity/install failures blindly. Never force a daily slot, edit checks, hand-write production output, commit or push directly.

End with RESULT: published | nothing to publish | saved-progress — <stage and reason> | failed — <stage and reason>.
```
