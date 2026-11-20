# ICC Codex Cloud Routines Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task by task after owner review. Steps use checkboxes for tracking. On 2026-11-19 the Owner authorized finishing release checks, releasing the migration code, and switching routines individually only after every release check passes. Keep all existing Claude routines running until then. This authorization supersedes the historical probe-only restrictions below.

## Current release checkpoint — 2026-11-20

The Owner authorized fixing the whole-guide review disagreement and completing the remaining checks. The diagnosed correction retains Haiku as primary and adds one conditional evidence-based Sonnet adjudication for Cloud whole-guide disputes. Strict indexed decisions, program-resolved literal evidence witnesses, explicit verdicts/reasons for all three audit dimensions, retained raw receipts and fail-closed uncertainty are required; deterministic QA is unchanged. Review context binds research, outline, page metadata and the shared audit rubric before reusing scoped prior findings. An initial live attempt safely rejected fabricated/composite model quotes; the refined contract now uses lossless paragraph/source IDs and applies the existing distinction between evaluation questions and product promises. The current delta passes 288 pipeline tests, changed-file lint and the website build. Live verification is still required; the invalid receipt and all draft progress remain preserved at `d435f5d4b7f0aa6d6601db0acc5fb7aff03e1256`. See the November 20 section in `team/CLOUD-SETUP.md`.

CTO / Engineering and QA are completing release validation; COO / Operations owns the staged trigger handover. Candidate code `46ab212fd52d1a5ee0817cdc0ed73ff7fa2026c9` passes 263 pipeline tests and 78 site/contact/chat/redirect tests. The real cloud blog rehearsal passed 26 final checks with independent Claude review and three verified session-generated images; see `team/CLOUD-SETUP.md` for preserved failures, exact release results and current cloud evidence. Subsequent review fixes reject malformed claims-cache slugs and out-of-scope intermediate Git history; rejected guide copy edits now retain exact diagnostic inputs/outputs without clearing any quality gate.

Orphan snapshot and lease commits now carry a fixed `vercel.json` with `git.deploymentEnabled=false`, following [Vercel's configuration contract](https://vercel.com/docs/project-configuration/git-configuration). Main's configuration cannot protect an orphan branch. Restores validate this exact metadata, omit it from extraction, and preserve the website configuration. Legacy snapshots without it remain readable. Regression tests and real remote atomic probe writes passed; the probe commits created no hosting deployments while release-branch previews deployed successfully. State integrity, stale-save refusal and atomic fencing remain enforced. Full lint exposed the pre-existing ambient `POLICY` declaration parsing issue; explicitly declaring it fixes lint without a runtime change. Lint, build, 2,852 internal-reference checks and guide export checks (61 pages, 3,729 links and metadata) pass.

Migration code is pushed on the release branch in draft PR #2, with successful Vercel previews. Actual timed callbacks verified all three saved ICC environments and Terra selection; one-off probes are completed/disabled and recurring candidates remain paused. The scout research/review dry-run completed with `SCOUT_NOTHING_ACCEPTED`: real proposals failed the existing evidence/reviewer gates and no production queue was changed. This proves rejection handling, not approval of a new topic. A separate cloud computer restored all 609 managed guide files, including retained rejection evidence, byte for byte without changing source configuration or the index.

The full ten-page guide rehearsal remains incomplete. At isolated checkpoint `b69eddf254d98b45ed4e9e80654b08b60d8c2697`, all ten current page reviews passed and the guide contains 19,887 words within the page budgets. Internal verifier notes were removed from reader-facing prose while exact provenance remains in managed research. Two nearby approved ICC source citations were explicitly added by Terra after the cleaner attempted to add them and the preservation gate correctly refused its edit. Rejected candidates remain retained; no checks were waived.

The whole-guide audit nevertheless failed claims, consistency and repetition. It raised form-field, illustrative severity, handoff, ISO mapping, Ontario provenance, auditor-evidence, setup and anonymity concerns. Its Ontario findings conflict with the actual current research record, which explicitly records Codex root's direct Chrome reading and separately retains the automated HTTP 403. Inspection confirms the final auditor received that current research, so stale input is not established as the cause. All ten chapter passes do not override this failed whole-guide gate. Progress was saved and the lease released; final text validation and new guide image generation have not run. Resolving the audit, complete guide images, interrupted new-image recovery proof, final production deployment verification and individual cutovers remain pending. Production `main` and `guide-state` are unchanged; all Claude triggers remain active. Historical dated sections below retain earlier evidence and do not override this checkpoint. The formal security plugin receipt failed on its bundled native module's macOS code signature; independent manual review is recorded separately, not represented as a successful plugin scan.

**Goal:** Move the blog, guide and topic scout routines to Codex Cloud, with Terra writing, built-in image generation consuming the Codex allowance, and Claude API reviews.

**Architecture:** The scheduled cloud session researches, writes Markdown and calls its built-in image tool. Repository code imports and validates image files, runs independent Claude reviews, and retains the existing restricted publication paths. Guide progress remains on the orphan `guide-state` branch, independent of `main`.

**Tech Stack:** Node 22+, CommonJS, node:test, sharp, existing Anthropic SDK, Git, static Next.js website, Codex Cloud and its scheduler.

**Spec:** The owner decisions below define this migration. Existing contracts remain in [team/README.md](../../../team/README.md), [guide routine](../../../team/GUIDE-ROUTINE.md), [guide writer](../../../team/GUIDE-WRITER.md) and [scout routine](../../../team/SCOUT-ROUTINE.md). This plan supersedes the pasted Claude migration proposal where they differ.

## Owner decisions and acceptance criteria

- ICC-CLOUD-01: All three routines run without the owner's computer being awake. Each run resolves its saved ICC environment and repository from `main`, and actually selects `gpt-6.1-terra`. A cloud working branch named `work` is acceptable when based on the intended `main` revision. A prompt merely asking another model to act like Terra does not satisfy this.
- ICC-CLOUD-02: Blog/guide prose is written by the scheduled session from the existing briefs and rules. Helper model calls and independent editorial reviews use Claude with `LLM_PROVIDERS=claude`; preserve the existing Sonnet chapter review / Haiku fast-audit split unless the owner changes it.
- ICC-CLOUD-03: Images come through the session's built-in image tool under ChatGPT authentication. No nested local CLI login, copied login token, OpenAI/Gemini image API, or silent paid fallback. Allowance exhaustion saves available work and reports the failure.
- ICC-CLOUD-04: Imported images retain the house style, 1200x675 WebP output, hash and provenance checks, existing image-count rules, and duplicate protection. No hand-written production image/frontmatter bypass.
- ICC-CLOUD-05: Claude outage, malformed verdict, unsupported claims, tampered/missing image, failed check, or Git failure cannot publish. Existing evidence and editorial gates stay intact.
- ICC-CLOUD-06: Saved guide text, reviews and images survive a fresh cloud run, without regeneration or recompression of verified images. Resume the oldest unfinished eligible guide before reserving new work. Blog draft/image progress also has a durable checkpoint, scoped to its Toronto daily slot; an old missed slot is reported rather than backdated or force-published.
- ICC-CLOUD-07: Only one runtime owns each routine during cutover. A repeated run cannot duplicate a post/guide or overwrite newer guide state. Keep the disabled Claude triggers for 14 days for rollback.
- ICC-CLOUD-08: Preserve the proposed cadence: scout Sunday 08:00 UTC, blog daily 09:05 UTC, guides Monday/Thursday 08:00 UTC. These are 13:30 and 14:35 Asia/Kolkata respectively; save and verify the scheduler timezone explicitly.

## Global constraints

- Work in `Admin-Qms/icc-website-main`, not the parent QMS application. No QMS runtime, data or infrastructure changes.
- Probe only: no scheduled `prepare`, `review`, `publish` or scout `apply`; these can write queue/state data or push even before publication.
- No builds or typechecks until specifically authorized to commit or deploy. Do not run a wrapper that invokes them early.
- Never print keys, secret placeholders, credential-bearing remotes, auth files or raw provider error bodies. Report names, presence, status codes and sanitized reasons only.
- The API wrapper currently expects `CLAUDE_API_KEY`, not `ANTHROPIC_API_KEY`. Prefer a domain-scoped network secret for `api.anthropic.com`; verify that its placeholder works through the actual SDK.
- Do not give routine agents permission to change code, instructions, review rules, source policy, fixed guide metadata or their own gates.
- `guide-state` is an orphan snapshot of managed drafts/reports. Never push `HEAD`/`main` into it. Do not invoke `save-state` against it as a harmless probe.
- No actual Git branch writes, production content or trigger switches are authorized in this implementation session. Nonsecret cloud configuration fixes are authorized; the Owner enters the Claude key securely. Do not broaden network/sharing access.

## Probe evidence — 2026-11-18

The desktop environment listing confirms these published configurations are ready/runnable, each mounted from repository `github-1403391634` on `main`:

| Environment | Configuration ID | Mount |
| --- | --- | --- |
| ICC Blogs | `6ed3756c-b3af-4f21-816a-c4888d358c41~asenvcfg_ed86a859e11481919b64923b98ce1bc9` | `icc-website-main` |
| ICC Guides | `6ed3756c-b3af-4f21-816a-c4888d358c41~asenvcfg_c201112984d08191891949973a913ddc` | `icc-website-main` |
| ICC Scout | `6ed3756c-b3af-4f21-816a-c4888d358c41~asenvcfg_aae03066dbc881918676131d995defd4` | environment default |

All three nonpublishing web probes completed. The desktop cloud-create call did not return a usable task ID; the CLI rejected the published configuration ID with `environment not found`. The current signed-in web interface successfully launched the probes after selecting each ICC location and GPT-6.1 Terra Light. This proves a manual web launch, not CLI or scheduler targeting.

| Check | Blogs | Guides | Scout |
| --- | --- | --- | --- |
| Checkout / Node / npm | PASS | PASS | PASS |
| Both dependency installs | PASS after cache override | PASS after cache override | PASS after cache override |
| Built-in image + local raster + sharp WebP | PASS | PASS | PASS |
| Built-in web search | PASS | PASS | PASS |
| Approved HTML/PDF retrieval | FAIL: tested hosts returned 403 | PASS: committee HTML/PDF | PASS: NIST HTML / committee PDF |
| Git fetch, branch lookup, matching-ref no-op dry runs | PASS | PASS | PASS |
| Claude API key present | FAIL | FAIL | FAIL |
| Actual Claude main/fast API calls | UNVERIFIED: no key | UNVERIFIED: no key | UNVERIFIED: no key |
| Actual writes, deployment, scheduled routing, long-run resume | UNVERIFIED | UNVERIFIED | UNVERIFIED |

Evidence: [Blogs probe](https://chatgpt.com/local/6afda579-854c-8191-a5ef-232b0ee0104b), [Guides probe](https://chatgpt.com/local/6afda5b8-0b18-8191-9ed1-803751784074), [Scout probe](https://chatgpt.com/local/6afda5e0-5568-8191-b9c8-ac314dfd2053). These are account-local chat links, not public share links. Each reported no tracked code/content changes and removed its scratch images. No API image requests, actual pushes, builds or production publication were run.

All used `/workspace/icc-website-main`, a `work` branch, Node `v24.22.1` and npm `11.9.0`. Initial snapshot HEADs differed: Blogs `5acb3ab9075f57f6d70dc403ed1293db78f57a78`, Guides `719c910a7006ecc76f6d5bf9bdfb706210f152cc`, Scout `0bc10854c14ab5c441bc6bd44d23ad9906c14b36`. Production prepare fetches/resets to `origin/main`; release rehearsals must likewise verify their source revision before treating a cached snapshot as release evidence. Terra selection was visible in the UI; the agent runtime did not independently expose its model identifier.

Each generated one real PNG and converted it to 1200x675 WebP using sharp. WebP byte counts / SHA-256: Blogs 82,570 / `024cd14ec0304160232993a9aa2bad39df7420060b68d52f11143bff9d1fd277`; Guides 85,804 / `fca377e530888cfbca74b4f1aafee424f2e54fa1547782c9fc2f0fccb3a02526`; Scout 104,482 / `63c25e65922292479ad7a65edc47bdbf7cc6d3bda4d1109a67577b712ab97dbf`.

Confirmed settings/actions still needed:

1. Add/request `CLAUDE_API_KEY` securely for all three environments and explicitly set `LLM_PROVIDERS=claude`; then validate both existing review models through the SDK/network-secret path. No OpenAI/Gemini/Pexels API key is needed for the chosen built-in-image design. Missing image-provider keys in the probe reports identify the old pipeline configuration that Task 2 replaces.
2. Set `npm_config_cache=/tmp/icc-npm-cache` as a runtime variable, or pass that writable cache in every install. All default-cache installs failed with ENOENT; all `/tmp` retries succeeded. Blogs/Guides install scripts already use an explicit cache, but scheduled prepare scripts do not, so setup-only flags are insufficient.
3. Blogs/Guides startup instructions recommend `npm run dev` and a build. Replace those with a routine-specific start skill. Scout has neither an install script nor a start skill; add deterministic Node/install/root instructions.
4. Resolve/retest Blogs' 403 responses using the approved URLs/client policy that works in Guides/Scout. Both other environments retrieved and parsed an existing committee PDF. A 403 alone does not establish whether the cause is site behavior or environment networking.
5. The web Scheduled page currently has no tasks. Its new-task form exposes timezone, model, effort and new-chat controls, but no explicit environment selector was visible, even with Advanced expanded and new-chat enabled. No schedule was saved. Environment binding remains a release blocker requiring a real paused/probe scheduled run; do not infer it from the three successful manual launches.

Opening the environment editors created inspection drafts; no fields were changed and nothing was published. Existing published environments and Claude routines were left unchanged.

Read-only source inspection establishes:

- GitHub `main` already has an Anthropic SDK adapter and `LLM_PROVIDERS` routing. Selecting Claude also routes helper passes to it, not just formal reviews.
- `config.js` pins `claude-sonnet-4-6` and `claude-haiku-4-5-20251001`; their actual access must be probed.
- The current `codex` image provider spawns a nested `codex exec` and asks for `sips`; that is a local Mac adapter, not the session's cloud image tool.
- Blog fixtures accept a local hero but label it `local`; inline images still call providers. Supplying only a hero does not meet this migration's image requirement.
- Guide images already store file hashes and provenance sidecars, and verify stored bytes without recompressing them. Extend that contract rather than forging its sidecars from prompts.
- The guide script checkpoints to `guide-state` during `prepare` and `review`. Publication wrappers run builds and can push, so none are readiness-only commands.
- A no-op `git push --dry-run` cannot prove branch protection acceptance or that the selected identity triggers deployment workflows.

## Review focus

1. Image tool succeeds but no local file reaches the repository VM: fail integration; no invented output path or paid fallback.
2. A restarted run sees an image with incomplete metadata or changed bytes: reconcile the recorded job; never overwrite it silently.
3. Claude returns a truncated or repaired JSON verdict with missing checks: refuse approval; no implied pass.
4. Two runs restore the same guide-state snapshot: a later fetch must not make stale local contents appear current and erase newer progress.
5. Blog and guide publication overlap or the same blog is retried after a push: refresh state and preserve one publication per intended slot.

## File and responsibility map

| File | Action | Owner | Purpose |
| --- | --- | --- | --- |
| `AGENTS.md`, `CLAUDE.md`, `team/CLAUDE.md` | MODIFY | Coordinator | One agent-neutral instruction source; bounded approval for all three routines |
| `.agents/skills/write-blog-article/`, `.agents/skills/write-software-guide/`, matching `.claude/skills/` | MODIFY | Content | Reconcile current skills; use one maintained source after confirming cloud packaging follows links |
| `team/agents/shared/config.js`, `team/scripts/provider-status.js` | MODIFY | Backend | Explicit Claude and imported-image settings; secret-safe diagnostics |
| `team/agents/shared/claude.js` | MODIFY if needed | Backend | Reject incomplete review verdicts; preserve API review independence and sanitized errors |
| `team/agents/content/sessionImages.js` | NEW | Backend | Export image requests, import actual tool files, validate/normalize/checkpoint assets |
| `team/agents/content/imageAgent.js`, `contentManager.js`, `inlineImageAgent.js`, `guideImages.js` | MODIFY | Content/Backend | Consume imported assets through existing text/image/publication gates |
| `team/pm.js`, `team/agents/content/guideManager.js` | MODIFY | Backend | Add image request/import and pre-image validation commands |
| `team/scripts/scheduled-run.sh`, `scheduled-guide-run.sh`, `scheduled-scout-run.sh` | MODIFY as required | Backend | Safe concurrency, checkpoint/resume and publish-only allowlists |
| `team/ROUTINE.md`, `GUIDE-ROUTINE.md`, `SCOUT-ROUTINE.md`, `README.md` | MODIFY | Content | Exact cloud prompts and operational instructions |
| `team/tests/session-images.test.js`, `pipeline.test.js`, `guide-images.test.js`, `guide-state-branch.test.js`, `blog-state-branch.test.js`, `llm-providers.test.js`, `topic-scout.test.js` | NEW/MODIFY | Engineering | Behavior tests owned by the task that changes each behavior |
| `docs/knowledge-base/decisions.md`, `architecture.md` | MODIFY after implementation | Coordinator | Record agreed ownership and link to actual rollout evidence |

No frontend, CMS or database change is needed.


## Implementation status — 2026-11-18

The implementation is uncommitted in managed worktree `codex/icc-cloud-routines`, based on `5acb3ab9075f57f6d70dc403ed1293db78f57a78`. No implementation was pushed to `main`. All existing Claude routines remain active; candidate prompts are inactive. See [cloud setup](../../../team/CLOUD-SETUP.md) for the operational contract.

| Area | Implemented and verified locally | Remaining release evidence |
| --- | --- | --- |
| Session images | Real raster import, exact assigned requests/terms, provenance/hash/duplicate checks, blog hero + two inline consumption, ten-page request workflow, missing/tampered checkpoint refusal | Actual cloud artifact transfer into this released code and full ten-page live rehearsal |
| Claude review | Enforced cloud routing, missing-key refusal, strict JSON/claims/originality verdicts, current Sonnet/Haiku split | Both configured SDK models passed in all three fresh environments (6/6); full live content review still required |
| Durable state | Orphan snapshots, stale revision refusal, current blog asset restore plus retained missed-slot records/archive bytes, guide resume unchanged | Interrupted fresh-cloud-task resume and real Git branch permissions |
| Ownership/publication | Cross-VM leases, atomic destination + lease updates, expired/stolen ownership refusal, exact commit allowlists and staged-file refusal | Actual remote atomic-push support, branch rules, hosting exclusions and deployment |
| Instructions | Canonical AGENTS, Claude import and portable shared-skill forwarding, three inactive candidate prompts, routine startup/cache instructions | Saved scheduled Terra + environment binding and long-duration guide run |

Independent tests reproduce the guide provenance, malformed verdict, import integrity, and publication-scope defects identified by final review; fixes pass local behavioral checks. Local bare-Git tests exercise takeover during push and rejected-main atomic rollback. A complete blog dry run uses real imported image files and real QA with only the reviewer response mocked; no live API, production content or branch was changed. No build/typecheck or full release suite was run.

Decisions: ordinary Claude skill forwarders avoid unproved symlink packaging; all model JSON parsing rejects truncation rather than repairing an apparent verdict (legacy helpers may need a retry on incomplete model output); remote writes atomically advance a checked lease successor so ownership changes cannot race the mutation. The lease renews to three hours at a successful fenced mutation. Failed saves preserve local progress and do not claim a checkpoint was stored remotely.

Pending checks are intentionally unchecked below. Each checked item denotes implementation/local evidence only, not cloud rollout acceptance.

Nonsecret environment fixes were published for ICC Blogs, ICC Guides and ICC Scout: Claude/session routing, `/tmp/icc-npm-cache`, routine startup instructions, and an install script added to Scout. Network access and sharing were unchanged. The Claude key was subsequently saved securely in all three published environments, and both configured SDK models passed in fresh tasks (six calls total). The earlier probe below predates that setup. A fresh [Terra Blogs re-probe](https://chatgpt.com/local/6afdb2a8-bb88-8191-a152-fd9b95cc005e) verified the initial four runtime variables, clean `work` checkout at the base revision, Node24.22.1/npm11.9.0 and installed dependencies. Claude key was absent; no Anthropic request was made. The existing Node source client returned exception status0 without proxy opt-in. In the same session a fresh child with `NODE_USE_ENV_PROXY=1` used the supplied proxy and CA unchanged, retrieving the approved ISO Review Nonconformity PDF (HTTP200;11485 parsed characters) and NIST traceability HTML (HTTP200;94092 characters). This isolates a Node proxy configuration issue for those attempts; it does not prove every approved URL is accessible. The flag is now in the cloud wrapper and was published in all three environment versions. Prior manual web-source success did not validate Node's client.

Local verification after the review fixes: 125/125 tests across 20 explicitly named changed/related test files passed. ESLint on changed JavaScript/TypeScript/tests, shell syntax, diff whitespace and documentation link checks passed. No build, typecheck, full suite, production push or deployment was run. Independent tests cover real imported raster consumption, strict review refusal, incomplete/tampered checkpoints, stale snapshots, scoped historical blog restore, exact commit paths, lease expiry/takeover and atomic rejection during a push. Live API responses and a full ten-page cloud rehearsal are not represented by these offline results.

Review decisions: canonical skills use plain forwarding files instead of unverified symlinks; strict JSON parsing also applies to legacy helpers (malformed legacy responses can now stop rather than be repaired). Scratch execution evidence stays outside the repository; no temporary logs or copied checkouts belong in the change.

## Task 1: Establish cloud capability and repair environment configuration

**Consumes:** the three published configurations. **Produces:** a readiness matrix with sanitized evidence for each environment and a list of unresolved blockers.

- [x] Complete initial nonpublishing probes in all three environments; results and limitations are recorded above. Scout's image was a capability check, not a new operational dependency.
- [ ] Resolve the confirmed settings/actions above, then rerun missing Claude calls and failed Blogs source retrieval in fresh tasks. Keep actual writes, scheduling and long-run resume explicitly unverified until separately exercised.
- [ ] Check environment root handling: blog/guide scripts must run at the repo root even when mounted in a subdirectory. Setup cannot assume all three mounts match.
- [ ] Configure `LLM_PROVIDERS=claude` and a working `CLAUDE_API_KEY` for all three environments; keep OpenAI/Gemini/Pexels image API fallbacks disabled for scheduled runs. Do not remove credentials used elsewhere without checking their scope.
- [ ] Permit package installation, GitHub Git/API endpoints, `api.anthropic.com`, ICC, and required trusted-source hosts/redirects. Use the actual source-fetch policy, not a blanket requirement that `iso.org` return 200: its known 403 needs an approved accessible source such as the existing committee PDFs.
- [ ] Republish changed environments, then repeat only failed checks in fresh tasks. A task created before republishing retains its prior configuration.
- [ ] Verify a paused scheduled probe binds the intended environment and Terra model, with the same image tool/file access. A manual cloud task alone does not prove scheduler support. If unavailable, leave migration blocked and present the concrete supported alternative for owner decision; do not substitute a local timer.
- [ ] Before cutover, perform an explicitly authorized isolated Git write/checkpoint exercise, checking identity, branch rules and workflow triggers. Keep actual `main`/`guide-state` writes out of the initial probe.

## Task 2: Add session-generated asset import without bypassing gates

**Files:** `sessionImages.js`, `imageAgent.js`, `contentManager.js`, `inlineImageAgent.js`, `guideImages.js`, `guideManager.js`, `pm.js`, relevant tests.

**Interfaces:** Add `blog image-requests --fixture <draft.json>` and `guide image-requests --job <id>` to output only missing requests as `{id, scene, kind, alt, prompt}`. Add `blog import-image --fixture <draft.json> --id <id> --file <path>` and `guide import-image --job <id> --page <slug> --file <path>`. New commands are proposed, not presently available.

- [x] Write and watch a failing behavior test that imports a real raster, supplies all required assets to the blog fixture/guide job, and passes existing image checks without invoking a generation API or nested CLI.
- [x] Implement `importSessionImage({file, request, directory})` returning normalized bytes plus dimensions, SHA-256, `source: 'codex'`, a source ID, generated-image terms reference and alt text. Record the exact request/prompt and available tool artifact ID; do not label a claimed model/source as independently attested.
- [x] Normalize once using existing sharp processing. Resolve requests from managed draft/job data, accept only known request IDs, reject nonregular/missing/nonraster files and path traversal, and use atomic checkpoint writes. Imported files cannot write directly to public output folders.
- [x] Expose a session-import image mode that requires registered assets and never calls `generateCodexImage`, OpenAI, Gemini or Pexels. Do not repurpose the existing local `codex` provider without preserving local callers.
- [ ] Test the existing maximum two inline blog markers and hero, plus all ten guide page images. Preserve current optional/required image semantics and the final gates; do not silently delete an already assigned imported asset if it disappears.
- [x] Test duplicate bytes across assets/published content, corrupt images, unknown IDs, changed checkpoints, and retry after incomplete checkpointing. Repeated successful import is idempotent; a different file for an already checkpointed image requires explicit reconciliation.
- [ ] Test a fresh-run restore of all image bytes/metadata, then reuse without recompression or tool/API calls. Reuse the existing guide image tests.
- [x] Add a pre-image validation command for blog text and guide editorial readiness so rejected text does not consume image allowance. Keep final validation after images and re-review when text changes.
- [x] Run only changed behavior test files with `node --test <paths>` in this separate node:test repository; no application build/typecheck in this task.

## Task 3: Preserve review independence and make state/concurrency reliable

**Files:** shared provider/config code, publication scripts, state/provider/pipeline tests. **Consumes:** imported assets. **Produces:** review failures stop publication; completed checkpoint data cannot be erased by overlapping runs.

- [ ] Set and verify Claude-only routing for helpers/reviews. Keep reviewer prompts and the current two editorial correction passes; the migration does not weaken unsupported-claim findings in the unfinished incident guide.
- [ ] Add a failing review test for a missing/truncated verdict, provider outage and a rejected claim. Require complete expected review fields and explicit passes before accepting a verdict. Log provider/model names without credentials.
- [x] Add an isolated bare-Git behavioral test with two checkouts: both restore one state snapshot, the first saves a new checkpoint, then the stale checkout tries to save. It must refuse rather than reparent a stale snapshot on the newer fetched branch.
- [x] Track the restored state revision and verify it before save; use non-force Git updates and stop on conflict. Do not auto-merge guide state or delete locks to make the test pass.
- [ ] Add durable blog checkpoints on a separate orphan `blog-state` branch, limited to managed daily blog drafts and imported assets. Add a `save-state` command to the blog script; restore only the relevant slot, checkpoint after text and each image, exclude locks/secrets, and use the same stale-revision guard. Prove a fresh clone reuses the saved bytes and a published/expired slot is never replayed with `--force`. Verify branch write access and that hosting ignores this state branch before cutover.
- [ ] Exercise two blog publication attempts for the same date/slug and main moving during a publish. Preserve the date/slug gate and revalidate the merged tree before a production push when necessary.
- [x] Verify scheduler overlap prevention if offered; otherwise add a cross-run ownership guard suitable for independent cloud VMs. Process-local lock files alone do not serialize independent runs. Keep the Git stale-state guard as the final protection.
- [x] Run the changed provider, state and pipeline tests. Keep full suites/build for the separately authorized release.

## Task 4: Update instructions and rehearse complete runs

**Consumes:** Tasks 1–3. **Produces:** cloud-ready instructions and nonpublishing rehearsal evidence.

- [x] Make `AGENTS.md` accurate and canonical using the current instructions and all three scoped standing approvals; `CLAUDE.md` imports it. Repair stale `.Codex` and nonexistent wrapper references rather than globally replacing Claude's name.
- [ ] Reconcile the two skills from their actual current versions. Confirm both Codex and Claude cloud packaging follows a shared directory/symlink before adopting the pasted plan's symlink suggestion.
- [x] Update the exact routine prompts: brief/research → Terra writes → Claude editorial checks → missing image requests → built-in image tool → import → checkpoint/save → final gates → restricted script publication. Guide image import is saved after each image so quota exhaustion does not lose earlier images.
- [x] Keep existing `RESULT:` summaries, with a clear saved-progress stage/reason for allowance exhaustion and API outages. Never retry a failed install, Git, integrity or publication step blindly.
- [ ] Rehearse scout proposals in isolated paths, a complete blog fixture dry run, and a complete ten-page guide in isolated draft/report/content paths. Dry-run wrappers must not push live state or run builds inadvertently.
- [ ] Interrupt after one reviewed page/image, start a fresh cloud task, and prove exact byte/hash resume. Complete a real-duration guide rehearsal to measure available task lifetime; do not promise a one-hour runtime based on docs silence.
- [ ] Record the actual code revision, chosen models, environment versions, commands run and remaining gaps. Update owning docs after implementation. Do not record a planned check as passed.

## Task 5: Release and cut over one routine at a time

**Gate:** Owner has approved implementation and explicitly authorized release/cutover. Real writes, commits, builds and deployment checks happen only in that authorized phase.

- [ ] Run the ICC pipeline tests, site build and applicable blog/guide link/metadata checks before release; inspect the exact diff and content-path publication allowlists. Do not run unrelated parent QMS suites for an ICC-only change.
- [ ] Commit/release the approved implementation and verify each cloud environment has the intended revision.
- [ ] Create three paused cloud schedules with the exact prompts, explicit timezone, Terra and environment bindings. Read back saved settings, including the next due times. Do not create a desktop-local automation as a cloud substitute.
- [ ] Inventory the existing Claude triggers and any active runs; preserve their prompts/settings. Confirm these supplied IDs still match the intended routines: scout `trig_01V2mjdc9EYysBFUscUiDdBs`, blog `trig_016PSDw8sP67ywAiawjQgrZJ`, guides `trig_01QCftVc3PfJZmDPjnr6q4MP`.
- [ ] Scout first: disable its Claude trigger, wait for any active run to finish, run Codex once, verify only the two queues/link bank changed through the script, then enable the cloud schedule.
- [ ] Blog next: disable/wait, run once in an unpublished Toronto daily slot, verify Claude review, imported Codex images, content-only commit, actual deployment and live page, then enable schedule. Do not use `--force` to manufacture a second daily post.
- [ ] Guides last: disable/wait, inspect current `guide-state` and resume the existing job if still unfinished. Correct only evidence-backed editorial findings; verify checkpoint pushes, final ten-page guide/images, content-only commit and live pages before enabling schedule.
- [ ] Observe seven consecutive daily blog slots, two guide slots and one scout slot, accounting for already-published slots, queue exhaustion and documented failures. Verify no duplicate publications, stale-state loss or paid image fallback; scheduling two guide runs does not prove two completed guides.
- [ ] Retain disabled Claude triggers for 14 days. On rollback, pause the matching Codex schedule, wait for active runs, reconcile remote content/state, then re-enable only the matching Claude trigger. Never reset published history or push old guide-state snapshots.

## Dependencies and release blockers

Working cloud launch and scheduler binding; Terra availability in that cloud/scheduled surface; built-in image tool with local artifact access; sufficient included allowance; valid Claude key/model access; scoped egress and package installation; Git write identity/branch permissions; safe cross-run ownership; actual Vercel deployment verification. The environment listing alone satisfies none of these runtime checks.

If cloud image generation is unavailable, stop before implementation assumes it works. The owner's selected design remains Codex-allowance images; an API or local-machine alternative needs a new owner decision.

## Official references

- [Cloud environments and network secrets](https://learn.chatgpt.com/docs/environments/cloud-environments)
- [Built-in image generation and included usage](https://learn.chatgpt.com/docs/image-generation)
- [Scheduled tasks](https://learn.chatgpt.com/docs/automations)

Documentation establishes product capabilities; completed probes establish this account/environment's readiness.

## Follow-up rehearsal and scheduler evidence — 2026-11-18

The Claude key is securely configured in all three published ICC environments, restricted to `api.anthropic.com`; fresh SDK calls passed both configured models in every location. Older cloud tasks retain their earlier secret configuration. The research-only rehearsal could not create a real brief because its old runtime lacked the key.

After the Owner enabled Chrome extension file access, the patch upload succeeded. Its SHA-256 `9d0ce6746b4840470d1b40bcffa0634c306d7375db001a5e8547f49bed3501f8` matched and it applied cleanly to an isolated archive of the planned base. The [fresh Terra rehearsal](https://chatgpt.com/local/6afdbf80-40b4-8191-80e3-938e7fa3e05d) has the key, generated the real managed brief for risk-based thinking in Ontario manufacturing and wrote body.md. The 2,095-word draft exists; live originality passed at 92/100, and text QA passed 23/24 checks. The claims reviewer flagged an edition statement while explaining that it was correct. One diagnostic repeat with unchanged draft/fixture returned the same contradiction. Both failures remain recorded; no check was overridden. Images/imports and final dry-run were not run. The exact rendered draft and fixture were preserved locally for Owner review. This rehearsal is FAIL at the claims gate, not release acceptance. No production prepare/state/publication wrapper, push, deployment or cutover is authorized by this rehearsal.

Three cloud candidates are saved and paused with GPT-6.1 Terra selected and same-chat execution. Blog native recurrence readback confirms daily 09:05 UTC; guides Monday/Thursday 08:00 UTC; scout Sunday 08:00 UTC. The editor can display locally converted hours beside a GMT+0 label, so verify recurrence natively rather than resaving its misleading display. See [cloud setup](../../../team/CLOUD-SETUP.md) for saved identities and current evidence.

The one-off read-only probe `Automation_a78302875e888191b3dddec54975acc3` completed and is disabled. Manual Run now used a generic scratch workspace with no ICC repository. Actual timed same-chat execution returned the expected ICC checkout and flags. Native run-index metadata still referred to the earlier manual run; the timer response is the runtime evidence. New-chat and manual launch paths remain unvalidated. Current Claude triggers stay active; every real candidate remains paused until all release gates and separate Owner cutover authorization.

## Claims-review correction — 2026-11-18

The Owner authorized correcting the contradictory verdict and repeating the unpublished blog rehearsal with built-in images. Haiku still screens the full draft; nonempty findings now receive one independent Sonnet adjudication against the same honesty rules, full draft and editions table. Every indexed finding requires an explicit clear/violation/uncertain decision and a reason. Missing, duplicate, out-of-range or malformed decisions and unavailable adjudication fail closed. Clear decisions become recorded advisories; confirmed or unresolved violations remain blocking under the existing paragraph-retry policy. Both screening findings and adjudication decisions remain in the QA result. A clean screen makes no extra model call. No reason-text regex or manual approval clears a finding.

Regression tests reproduced the contradiction/incomplete-review defects before implementation, then passed 13/13, including a new unresolved-claim/cache regression. The full team suite passed 242/242 after updating an outdated guide-runner test: release is now a supported lease operation, so the unsupported-command test exercises an unknown command instead. Changed-file ESLint and diff checks passed. No build, push, deployment, production state write or trigger switch was run. The targeted delta was uploaded to the existing isolated Terra rehearsal. A new isolated claims cache forced fresh live screening: Haiku raised the edition finding again, and Sonnet explicitly cleared it. A separate replay of the recorded original screen through live Sonnet also cleared it; that diagnostic is labeled recorded screen, not a fresh Haiku call. Three actual raster artifacts were generated with the built-in tool and imported successfully. The final one-line cache guard applied with verified source SHA-256 `fdce732d5fd649ec9c83f624094d63d143d17c63f0e93e8e04164e0cf40c90d8`. The guarded publication dry-run passed **26/26 final checks**, with originality **92/100**, an unchanged 2,095-word draft, and all three distinct 1200×675 imported images. The first dry-run (started before the guard instruction arrived) failed because the originality review could not run; that intermediate failure was preserved. The guarded run passed without changing the body or regenerating images. No API image fallback was used. The original cloud checkout stayed clean; the current Claude routines remain active and Codex candidates paused. Nothing was published, pushed or deployed. Full CLI return JSON was not persisted, so its actual log plus separately saved successful text-review JSON are the evidence; do not invent a full final-QA object. Native gallery previews remained blank in the root browser, even after the cloud viewer returned image pixels; file presentation remains a UI limitation, not an image generation/import failure.

## Private review preview — 2026-11-18

The Owner requested a working review of the blog with all three images. The original cloud gallery had blank placeholders and no usable download actions. The same verified WebP files were exported from the cloud executor using Pages `write_page_reference` to an Owner-only personal-drive Page, with no parent/Space or sharing change. All three receipts confirmed file access and exact managed-output SHA-256 matches. A guarded Page edit inserted the unchanged article with native `library-file:` images at the hero and two inline positions. Review-only internal links were made absolute; original draft metadata/body and pipeline assets were unchanged.

The [private blog review](https://chatgpt.com/space/page_987dbad433188191ae4bf96b46612155) was read back and inspected in Chrome. All three image elements loaded at natural dimensions 1200×675, and their manufacturing imagery was visually verified. The original generated-image gallery itself was not patched; the working durable Page is the review delivery. No regeneration, editorial API calls, pipeline rerun, code change, publication, push, deployment or schedule action occurred. Current Claude routines remain running and Codex candidates paused.
