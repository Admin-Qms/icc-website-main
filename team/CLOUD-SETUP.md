# ICC Codex Cloud migration

Status: release validation authorized on 2026-11-19; implementation is not yet released. Existing Claude blog, guide and scout triggers remain active and Codex candidates paused until all release checks pass, then cut over individually. The [implementation plan](../docs/superpowers/plans/2026-11-18-codex-cloud-routines.md) owns current rollout evidence and outstanding checks; [AGENTS.md](../AGENTS.md) owns the publication scope. Dated historical notes below retain earlier permissions/results.

## Release validation — 2026-11-19

Candidate commit `3ef2f6f73812d535e03026fd9c43a6a0c1ca7414` is pushed on `codex/icc-cloud-routines`, [PR #2](https://github.com/Admin-Qms/icc-website-main/pull/2), with a successful Vercel preview. Main remains at `5acb3ab`; production Claude schedules were read back as active. Full validation passed 243 pipeline tests, 78 site/contact/chat/redirect tests, ESLint, the static build, internal links and guide exports. Subsequent review fixes are being validated before release.

A real atomic push created two isolated probe branches at `ba819167f74402d2fc52d55ac0c4a681187d2967`, both with the fixed deployment-disabled marker. No deployment records were created for that revision, while the code branch deployed normally. Production `guide-state` remained at `d7ce0aedb5f1db02deada6d4756ca1b607515c2e`. An isolated copy on `icc-migration-probe-20261119-guide` at `41d9066f61c74115614afad8d4b7136d2a00d224` restored all 607 managed files byte for byte in the Guides cloud checkout. Actual guides lease acquisition and release succeeded. No production draft branch or main was advanced.

The full guide rehearsal resumed the existing ten-page incident/near-miss job `20261116081326-incident-near-miss-reporting-957138`, with three passing chapter reviews and no images. The severity-triage copy-editor failed citation/number preservation; the original page and remote checkpoint remained unchanged. This is an incomplete rehearsal. Rejected copy-editor output previously existed only in memory; the new diagnostic retention records exact input/candidate Markdown and SHA-256 values under managed attempts without clearing any gate. It permits inspection of a bounded next attempt rather than retrying without evidence.

Manual independent source review covered all 51 initial changed files and identified two integrity issues: unchecked fixture slug use in the claims cache and publication authorization based only on a net tree diff. Regression fixes validate the slug before review/cache access and check every introduced commit in a linear chain rooted at origin/main with rename detection disabled. Merges, divergent history and out-of-scope intermediate changes fail closed. The separate Claude commit-review hook returned no verdict because its local account lacked API credits. A formal Codex Security plugin scan (`8c4ae414-1774-40b6-9cdc-c64368261066`) failed when macOS rejected its bundled native module's code signature; no security settings were weakened and no completed plugin scan is claimed. Actual cloud Claude main/fast access passed again in Guides and Blogs.

Scout/Blogs initially reported interrupted fetches as failures. Bounded diagnostics confirmed the branch was reachable and Scout's isolated checkout actually completed at the candidate SHA. Its original mount has a main-only refspec; the isolated clone has ordinary branch refs. Preserve the distinction between a yielded tool call, an interrupted command and an observed failure; wait for command completion rather than inventing an auth/network diagnosis.

Three separate read-only one-off binding probes were created; production candidates stay paused. Their saved models were explicitly set to Terra in the web editor. Native readback of enabled/time/environment and actual timed callback results are still required; manual Run now remains unvalidated. The Scout recurring candidate ID is `Automation_2decf1fa5e448191995b64b43815c2aa`.

The one-off timers subsequently executed in the originating cloud chats with Terra selected. Blogs and Guides inspected the expected ICC repository and routing/cache/proxy/key-presence settings. Their persistent original checkouts retained older main revisions; the isolated release checkouts were verified separately. Guides reported its actual machine/internal configuration ID; saved scheduler environment IDs use a different namespace. Scout's first timed callback stopped on a configuration-changed status-service response; a fresh manual status then verified the selected Scout machine and runtime flags. Do not represent that manual follow-up as a clean timed Scout pass. All three completed one-offs are now disabled; recurring candidates remain paused.

The retained guide failure proves the cleaner removed all four valid `/solutions/safety/` links, rewrote attributed statements, removed two illustrative paragraphs and added an H1. Original chapter SHA-256 remained `1c9d2ca6b1c8418b55d6a9fc3a87d4e89a3bd466f5de6cffcd0129235b8346f9`. Actual rejected input and candidate were checkpointed to the isolated branch at `591d0cbe5c93e64681ca9a153e66734088899f0f`; that revision created no deployment. A separate Blogs cloud computer restored all **609 managed files** and matched every byte to Git, including both diagnostic SHA-256 values. Its source Vercel configuration and index remained unchanged. This proves new text/diagnostic checkpoint recovery across cloud computers; image recovery is still untested for this image-free guide job.

The guide cleaner input is now explicitly lossless formatting, with a separate exact link-occurrence inventory and unchanged raw-body framing. Claude remains the same fast helper and all preservation/grammar/semantic gates remain. Independent review also exposed an inventory parser defect: reference citations were listed by definition instead of actual occurrence and repeated references were collapsed. The focused parser now resolves ordinary full/collapsed/shortcut references in reading order, excludes unused definitions and retains duplicates, including a destination continued on the next LF/CRLF line. Tests reproduced the missing inventory, a dropped repeated reference escaping preservation and the continuation regression before the fixes; all **258 pipeline tests** pass. This is not a complete Markdown parser; complex nested labels and code-context parsing remain outside the existing contract. Actual live helper preservation on the corrected candidate remains a separate required check.

At commit `1553dd488a6eb3e229d0673a30cc0c1749f92ea7`, the real guide cleaner preservation and grammar checks both passed on the unchanged severity-triage page. Semantic review then returned prose instead of JSON; strict parsing correctly stopped before verdict validation. State was saved to `191a96e224a95f0513fef3fbc0893bbdffb3ab3d` and the lease released. The next correction supplies the existing twelve-field chapter verdict schema through Anthropic's supported `output_config.format`; only cloud guide semantic requests opt in. Runtime verdict checks remain, and schema-bound completions require `end_turn`; refusals, missing/unknown completion reasons and truncation cannot become approval, even with otherwise valid JSON. SDK transport tests reproduce the previously absent schema and refusal-with-valid-JSON defects. Full pipeline suite: **262/262**. No malformed reply is repaired or retried into a pass. Live schema-bound chapter review remains pending.

Scout completed real fetch/reviewer dry-runs with no accepted proposals: workplace hazard assessment was rejected by the reviewer; clause coverage failed fetched-topic evidence; AI oversight was rejected by the reviewer. A separate clearly labeled copied-queue fixture removed only the existing process-mapping topic's sources to test source recovery; live review rejected it under scope/distinctness. Original queues and link bank remained unchanged throughout. These are verified rejection paths, not positive topic/source approvals. No topic was rephrased after independent rejection and no scout policy was weakened. The repeated timed Scout callback succeeded against the previously observed Scout machine with matching repository and runtime flags. Recurring candidates remain paused; code deployment and complete guide/image acceptance are still required before cutover.

## Environment settings

Use the existing ICC Blogs, ICC Guides and ICC Scout locations with `Admin-Qms/icc-website-main` on `main`, Node 24.5 or newer (probed with 24.22.1), or Node 22.21 or newer. Set these nonsecret runtime variables on all three:

```text
ICC_CLOUD_ROUTINE=1
LLM_PROVIDERS=claude
IMAGE_PROVIDERS=session
npm_config_cache=/tmp/icc-npm-cache
NODE_USE_ENV_PROXY=1
```

Cloud mode also enforces Claude/session routing in code, even when other provider keys are present. Legacy environments without that opt-in retain their current providers. Do not set the opt-in on the live Claude routines during migration.

The Owner adds `CLAUDE_API_KEY` as a network secret restricted to `api.anthropic.com`; never copy it into a prompt, repository file or report. No image API key is required. The main review model is `claude-sonnet-4-6`; fast audits use `claude-haiku-4-5-20251001`. Actual SDK access to both remains a release gate, including compatibility of the network-secret placeholder with the Anthropic SDK.

Use this install script from `/workspace/icc-website-main` for all three locations:

```bash
set -eu
cd /workspace/icc-website-main
export npm_config_cache=/tmp/icc-npm-cache
npm ci --no-audit --no-fund
npm ci --prefix team --no-audit --no-fund
```

Replace web-development startup instructions with:

```text
Work from /workspace/icc-website-main. Read AGENTS.md and team/CLOUD-SETUP.md.
Use the requested routine prompt only. Do not start a dev server or run a build
as environment startup. Do not run prepare, publish, review or apply during a
readiness probe. Never print environment values or provider error bodies.
The selected session writes content and generates images with its built-in tool;
Claude API independently reviews it. Do not authenticate a nested CLI or fall
back to an image API. Migration probes must not change queues, content, state
branches, schedules or triggers.
```

`NODE_USE_ENV_PROXY=1` opts Node into the cloud's existing proxy and CA configuration; never set a replacement proxy or disable TLS. In the fresh Blogs probe, the client failed without this opt-in and returned HTTP 200 with parsed ISO PDF/NIST HTML text when enabled in a child process. [Node's proxy documentation](https://nodejs.org/learn/http/enterprise-network-configuration) specifies the supported versions. Cloud wrappers also export this flag for their child processes.

Select GPT-6.1 Terra in the actual session/scheduler model control. A prompt requesting Terra is insufficient. Keep the existing network policy; do not broaden it to solve a blocked source. Investigate approved source HTTP failures using the same source/client before release.

## Managed assets and checkpoints

The maintained writing skills are `.agents/skills/write-blog-article/SKILL.md` and `.agents/skills/write-software-guide/SKILL.md`. Claude's skill entries are plain text forwarders, so they need no symlink packaging behavior.

The CLI commands `blog check-text`, `blog image-requests`, `blog import-image`, and their `guide` counterparts use managed fixtures/jobs. Requests contain the full house-style prompt. Import the actual raster returned by the session tool; the importer normalizes once, stores the request, raw/output hashes, dimensions and source metadata, and refuses changed/incomplete/duplicate checkpoints. `source: codex` records the workflow provenance; it does not independently attest the generating model. Artifact input path/hash is available; no universal tool artifact ID is exposed by this CLI.

Blog text is checked before image spending and again at final dry-run. Guide chapter reviews and whole-guide audits remain mandatory. Missing/truncated/malformed review replies fail. Cloud blog fixtures require the current Toronto slot and disallow force; expired slots are reported and retained.

Guide snapshots stay on orphan `guide-state`; blog snapshots use orphan `blog-state`. Only managed draft/report roots are stored, including verified images; symlinks, locks and common secret-file names are refused/excluded. A local record identifies exactly which remote revision was restored. Blog restore materializes current-slot assets and historical draft records; old image bytes stay in the remote snapshot and survive subsequent saves. Published past slots are excluded from missed-slot reports. A stale save fails, retaining local work for reconciliation; it never reparents a stale snapshot onto a newer tip. Do not place credentials in managed draft/report JSON or Markdown.

Cross-VM leases live on the separate orphan `icc-routine-locks` branch. Each routine owns a random local token for three hours, retained across wrapper invocations in one cloud task; publication also claims a shared `publish` lease. Normal Git updates reject competing changes. Expired leases cannot authorize publication or save through the wrappers. There is no heartbeat/extension: save within the lease; a longer run must stop safely and resume in a fresh task. Do not remove locks or hand-edit remote state. State/publication mutations atomically advance the destination ref and a successor of the verified lease ref; a takeover or rejected update leaves both unchanged. Exact publication paths and a clean staging index are checked before pushing. The Git server must support atomic pushes. Release with the matching wrapper on orderly failure. If a save fails, retain local work and report it; do not claim remote progress was saved.

Prepare/save/review/publish/apply wrappers are operational commands and can push. They are never harmless probes. Tests use temporary local bare repositories and redirected stores. Orphan snapshots and lease commits carry a fixed `vercel.json` disabling all automatic deployments on those branches; restores validate this exact metadata and never extract it over source configuration. Older snapshots without metadata remain readable. Verify actual hosting exclusion before routine activation. The GitHub deployment workflow remains restricted to main.

## Nonpublishing runtime probe

After the Owner confirms the key is saved, launch one manual Terra session per ICC location. Ask it to verify repository/HEAD and Node, run the two installs with the temporary cache, and call both configured Claude models through `team/agents/shared/claude.js` using tiny JSON responses. Report key presence and sanitized status only. Test approved HTML/PDF access using existing fetch helpers. No source edits, push, prepare/review/publish/apply wrapper, queue/state writes, build or typecheck. The previous probe already proved built-in image generation and sharp conversion in all three locations; repeat only if environment changes affect those capabilities.

A manual probe does not prove scheduling. Before cutover, save and execute a nonpublishing scheduled probe with explicit Terra, timezone and the correct environment, then read back its actual checkout/environment identity. The current scheduler UI did not expose an environment selector; do not substitute a local desktop automation or claim a prompt's environment name proves binding.

## Release gates

Release requires Owner authorization to commit/push and run release checks, plus successful live reviewer access, approved source retrieval in Blogs, scheduler/environment binding, real Git branch permissions, deployment exclusion for state/lease branches, interrupted-run cloud resume, and a complete blog/ten-page guide/scout rehearsal. Local mocked tests do not prove live Claude quality or task lifetime. Cut over scout, blog, then guides separately, disabling only the matching Claude trigger after active runs finish. Keep disabled Claude triggers for 14 days and observe seven blog slots, two guide slots and one scout slot. See the plan for cadence, exact gates and rollback.

## Live migration checks — 2026-11-18

The Owner authorized a nonpublishing cloud blog rehearsal and required the existing Claude routines to remain active. All three Codex candidate schedules are saved and paused; none is authorized for production cutover. Their saved editors show GPT-6.1 Terra and same-chat execution. The blog's native readback confirms daily 09:05 UTC; guides use Monday/Thursday 08:00 UTC, and scout Sunday 08:00 UTC. The editor sometimes labels a locally converted time as GMT+0, so use native recurrence readback to verify exact times rather than resaving a misleading display.

- Blogs: `Automation_3d0747b5860c81919effd624a156e152`, inherited ICC Blogs configuration.
- Guides: `Automation_7a54c214d2f481919975a3040cd22d94`, inherited ICC Guides configuration.
- Scout: saved as **ICC Scout (Codex candidate)**, inherited ICC Scout configuration; retain its existing task rather than creating a duplicate.

The one-off binding probe `Automation_a78302875e888191b3dddec54975acc3` is complete and disabled. Manual Run now used a generic scratch workspace with no ICC checkout. Actual timed same-chat execution returned the ICC checkout at the expected base and the ICC/session/Claude/proxy flags. Native run-index metadata still referenced the older manual execution, so the timer evidence comes from its response in the originating cloud chat. New-chat execution and manual Run now are not validated replacements for this measured path.

The Owner authorized saving the supplied Claude credential securely as `CLAUDE_API_KEY`, restricted to `api.anthropic.com`, in all three published ICC environment configurations. Fresh tasks passed both configured SDK model calls in every environment (six successful calls). Do not copy the credential into source, reports or prompts. Older tasks do not acquire newly saved secrets automatically: the original research-only rehearsal still reported the key absent.

The Owner enabled Chrome extension file access. The candidate patch was uploaded successfully, its SHA-256 verified (`9d0ce6746b4840470d1b40bcffa0634c306d7375db001a5e8547f49bed3501f8`), and it applied cleanly to an isolated archive of base `5acb3ab9075f57f6d70dc403ed1293db78f57a78`. The original checkout remained clean. The patch snapshot predates these progress-note edits.

The initial [fresh Terra blog rehearsal](https://chatgpt.com/local/6afdbf80-40b4-8191-80e3-938e7fa3e05d) has the current secret, applied the candidate in `/tmp/icc-blog-rehearsal-site`, and generated a real managed brief for risk-based thinking in Ontario manufacturing. Terra wrote the actual 2,095-word body: **5 Risk-Based Thinking Myths That Derail ISO 9001 Implementation in Ontario Manufacturing**. Live originality passed at 92/100 and text QA passed 23/24 checks. The claims audit blocked on an edition statement while its own reason said that statement was correct. A single diagnostic repeat on unchanged body/fixture returned the same contradiction (23/24); both failures were retained, with no gate override. Images/imports and final publication dry-run were not run. This is a created draft and failed rehearsal, not an end-to-end pass. The exact rendered body/fixture were exported locally; body SHA-256 is `e89bfd390c990d30aa7459a8c93a63cbed008e9540dd4ac58c6836d82999400d`. No production wrapper, remote state write, push, deployment or trigger switch is part of this rehearsal.

## Claims-review correction — 2026-11-18

The Owner authorized correcting the contradictory verdict and repeating the unpublished blog rehearsal with built-in images. Haiku still screens the full draft; nonempty findings now receive one independent Sonnet adjudication against the same honesty rules, full draft and editions table. Every indexed finding requires an explicit clear/violation/uncertain decision and a reason. Missing, duplicate, out-of-range or malformed decisions and unavailable adjudication fail closed. Clear decisions become recorded advisories; confirmed or unresolved violations remain blocking under the existing paragraph-retry policy. Both screening findings and adjudication decisions remain in the QA result. A clean screen makes no extra model call. No reason-text regex or manual approval clears a finding.

Regression tests reproduced the contradiction/incomplete-review defects before implementation, then passed 13/13, including a new unresolved-claim/cache regression. The full team suite passed 242/242 after updating an outdated guide-runner test: release is now a supported lease operation, so the unsupported-command test exercises an unknown command instead. Changed-file ESLint and diff checks passed. No build, push, deployment, production state write or trigger switch was run. The targeted delta was uploaded to the existing isolated Terra rehearsal. A new isolated claims cache forced fresh live screening: Haiku raised the edition finding again, and Sonnet explicitly cleared it. A separate replay of the recorded original screen through live Sonnet also cleared it; that diagnostic is labeled recorded screen, not a fresh Haiku call. Three actual raster artifacts were generated with the built-in tool and imported successfully. The final one-line cache guard applied with verified source SHA-256 `fdce732d5fd649ec9c83f624094d63d143d17c63f0e93e8e04164e0cf40c90d8`. The guarded publication dry-run passed **26/26 final checks**, with originality **92/100**, an unchanged 2,095-word draft, and all three distinct 1200×675 imported images. The first dry-run (started before the guard instruction arrived) failed because the originality review could not run; that intermediate failure was preserved. The guarded run passed without changing the body or regenerating images. No API image fallback was used. The original cloud checkout stayed clean; the current Claude routines remain active and Codex candidates paused. Nothing was published, pushed or deployed. Full CLI return JSON was not persisted, so its actual log plus separately saved successful text-review JSON are the evidence; do not invent a full final-QA object. Native gallery previews remained blank in the root browser, even after the cloud viewer returned image pixels; file presentation remains a UI limitation, not an image generation/import failure.

## Private review preview — 2026-11-18

The Owner requested a working review of the blog with all three images. The original cloud gallery had blank placeholders and no usable download actions. The same verified WebP files were exported from the cloud executor using Pages `write_page_reference` to an Owner-only personal-drive Page, with no parent/Space or sharing change. All three receipts confirmed file access and exact managed-output SHA-256 matches. A guarded Page edit inserted the unchanged article with native `library-file:` images at the hero and two inline positions. Review-only internal links were made absolute; original draft metadata/body and pipeline assets were unchanged.

The [private blog review](https://chatgpt.com/space/page_987dbad433188191ae4bf96b46612155) was read back and inspected in Chrome. All three image elements loaded at natural dimensions 1200×675, and their manufacturing imagery was visually verified. The original generated-image gallery itself was not patched; the working durable Page is the review delivery. No regeneration, editorial API calls, pipeline rerun, code change, publication, push, deployment or schedule action occurred. Current Claude routines remain running and Codex candidates paused.
