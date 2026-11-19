#!/usr/bin/env bash
# The deterministic half of the scheduled guide run, mirroring scheduled-run.sh for
# blogs. The routine's Claude calls `prepare`, researches and writes the pages through
# the guide CLI, calls `save-state` after each checkpoint, then `review` and `publish`.
#
#   scheduled-guide-run.sh prepare            -> GUIDE_BRIEF <folder> | NOTHING_TO_GENERATE | GUIDE_FAILED
#   scheduled-guide-run.sh save-state         -> STATE_SAVED | STATE_UNCHANGED
#   scheduled-guide-run.sh review <job-id>    -> REVIEW_PASSED <job-id> | GUIDE_FAILED
#   scheduled-guide-run.sh publish <job-id>   -> PUBLISHED <title> | GUIDE_FAILED
#
# The last line of output is the status word a caller should act on.
#
# A cloud run starts from a fresh clone, and the managed draft and report folders are
# gitignored, so unfinished jobs are kept on the orphan branch `guide-state` (override
# with GUIDE_STATE_BRANCH). `prepare` restores it; `save-state`, `review` and `publish`
# push it back. Lock files are process-scoped and are never saved.
#
# Local-only commands kept for interactive use: research <fixture>, generate <job-id>,
# publish-local <job-id>. They never touch git.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

ROUTINE_KIND=guides
source team/scripts/routine-common.sh
status() { echo; echo "$*"; }
fail() { status "GUIDE_FAILED"; exit 1; }
restore_state() { routine_state restore; }
save_state() { assert_routine; routine_state save; }
GIT_ID=(-c "user.name=${GIT_AUTHOR_NAME:-ICC guide pipeline}" -c "user.email=${GIT_AUTHOR_EMAIL:-guides@isocertificationconsultants.ca}")

require_job() {
  node -e "require('./team/agents/shared/guideStore').loadJob(process.argv[1])" "${1:?managed guide job required}" >/dev/null || fail
}

case "${1:-}" in
  prepare)
    claim_routine
    git fetch origin main
    git checkout -q -B main origin/main
    npm ci --prefix team --no-audit --no-fund
    npm ci --no-audit --no-fund
    node team/scripts/provider-status.js >&2
    restore_state
    out="$(mktemp)"
    node team/pm.js guide brief --scheduled 2>&1 | tee "$out" >&2 || true
    folder="$(sed -n 's/^GUIDE_BRIEF //p' "$out" | tail -n 1)"
    if [ -n "$folder" ]; then
      save_state "prepare $(basename "$folder")" >/dev/null
      status "GUIDE_BRIEF $folder"
    elif grep -q '^NOTHING_TO_GENERATE' "$out"; then
      release_routine
      status "NOTHING_TO_GENERATE"
    else
      fail
    fi
    ;;

  save-state)
    save_state "${2:-checkpoint}"
    ;;

  release)
    release_routine
    ;;

  review)
    assert_routine
    job="${2:?managed guide job required}"; require_job "$job"
    node team/pm.js guide audit --job "$job" || { save_state "audit $job" >/dev/null; fail; }
    node team/pm.js guide publish --job "$job" --dry-run || { save_state "dry-run $job" >/dev/null; fail; }
    node team/pm.js guide validate --job "$job" || { save_state "validate $job" >/dev/null; fail; }
    save_state "review $job" >/dev/null
    status "REVIEW_PASSED $job"
    ;;

  publish)
    job="${2:?managed guide job required}"; require_job "$job"
    publication_clean_index
    claim_publication
    git pull --no-rebase -q origin main
    if ! node team/pm.js guide publish --job "$job"; then save_state "publish $job" >/dev/null; fail; fi
    if [ -z "$(git status --porcelain content/guides public/images/guides)" ]; then
      release_routine
      status "NOTHING_TO_GENERATE"
      exit 0
    fi
    title="$(node -e "const j=require('./team/agents/shared/guideStore').loadJob(process.argv[1]);process.stdout.write((j.publishedManifest||j.manifest).title)" "$job")"
    verify() { run_content_tests && npm run build && node team/scripts/check-guide-links.js && node team/scripts/check-guide-metadata.js; }
    verify || { save_state "verify $job" >/dev/null; fail; }
    # Only the guide manifest, its pages and its images are committed, never code or drafts.
    slug="$(node -e 'const j=require("./team/agents/shared/guideStore").loadJob(process.argv[1]);process.stdout.write((j.publishedManifest||j.manifest).slug)' "$job")"
    FILES=("content/guides/$slug" "public/images/guides/$slug")
    publication_clean_index
    git add -- "${FILES[@]}"
    git "${GIT_ID[@]}" commit -q -m "Publish guide: $title"
    before="$(git rev-parse HEAD)"
    git pull --no-rebase -q origin main
    if [ "$(git rev-parse HEAD)" != "$before" ]; then
      echo "[publish] main moved during the run; re-verifying the merged tree"
      verify || { save_state "verify-after-pull $job" >/dev/null; fail; }
    fi
    assert_routine
    if cloud_run; then node team/scripts/routine-state.js assert-lock --kind publish; fi
    push_publication "${FILES[@]}"
    save_state "published $job" >/dev/null
    release_routine
    status "PUBLISHED $title"
    ;;

  # ---- local, interactive commands (no git) ----
  research)
    node team/pm.js guide research --fixture "${2:?research fixture required}"
    ;;
  generate)
    ICC_GUIDE_JOB="${2:?managed guide job required}"
    node team/pm.js guide resume --job "$ICC_GUIDE_JOB"
    ICC_GUIDE_PAGES="$(node - "$ICC_GUIDE_JOB" <<'NODE'
const store = require('./team/agents/shared/guideStore');
const job = store.loadJob(process.argv[2]);
if (!job.manifest || !job.assignments) throw new Error('Research-ready guide job required');
console.log([...job.manifest.chapters.map(c => c.slug), job.manifest.slug].join('\n'));
NODE
)"
    while IFS= read -r ICC_GUIDE_PAGE; do
      node team/pm.js guide write --job "$ICC_GUIDE_JOB" --page "$ICC_GUIDE_PAGE"
    done <<< "$ICC_GUIDE_PAGES"
    ;;
  publish-local)
    node team/pm.js guide publish --job "${2:?managed guide job required}"
    run_content_tests
    npm run build
    node team/scripts/check-guide-links.js
    node team/scripts/check-guide-metadata.js
    ;;

  *)
    echo 'usage: scheduled-guide-run.sh prepare | save-state | release | review <job> | publish <job>   (scheduled cloud run; publish pushes the guide to main under the standing approval in CLAUDE.md)' >&2
    echo '       scheduled-guide-run.sh research <fixture> | generate <job> | publish-local <job>   (local only; no git). Any other release path needs separate Owner authorization.' >&2
    exit 2
    ;;
esac
