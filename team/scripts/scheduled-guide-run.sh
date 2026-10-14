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

STATE_BRANCH="${GUIDE_STATE_BRANCH:-guide-state}"
STATE_PATHS=(team/drafts/guides team/reports/guides)
GIT_ID=(-c "user.name=${GIT_AUTHOR_NAME:-ICC guide pipeline}" -c "user.email=${GIT_AUTHOR_EMAIL:-guides@isocertificationconsultants.ca}")

status() { echo; echo "$*"; }
fail() { status "GUIDE_FAILED"; exit 1; }

fetch_state() { git fetch -q origin "+refs/heads/$STATE_BRANCH:refs/remotes/origin/$STATE_BRANCH" 2>/dev/null || true; }

restore_state() {
  fetch_state
  if git rev-parse -q --verify "refs/remotes/origin/$STATE_BRANCH" >/dev/null; then
    git archive "refs/remotes/origin/$STATE_BRANCH" | tar -xf - -C "$ROOT"
    echo "[guide-state] restored drafts and reports from origin/$STATE_BRANCH"
  else
    echo "[guide-state] no $STATE_BRANCH branch yet; starting with no open jobs"
  fi
  # Locks belong to a process in a sandbox that no longer exists.
  find "${STATE_PATHS[@]}" -name '*.lock' -type f -delete 2>/dev/null || true
}

save_state() {
  fetch_state
  local index="$ROOT/.git/guide-state-index" tree parent commit
  rm -f "$index"
  export GIT_INDEX_FILE="$index"
  git read-tree --empty
  for p in "${STATE_PATHS[@]}"; do [ -d "$p" ] && git add -f -- "$p"; done
  git rm -q --cached --ignore-unmatch -r -- ':(glob)team/drafts/guides/**/*.lock' ':(glob)team/reports/guides/**/*.lock' >/dev/null || true
  tree="$(git write-tree)"
  unset GIT_INDEX_FILE; rm -f "$index"
  parent="$(git rev-parse -q --verify "refs/remotes/origin/$STATE_BRANCH" || true)"
  if [ -n "$parent" ] && [ "$(git rev-parse "$parent^{tree}")" = "$tree" ]; then
    status "STATE_UNCHANGED"; return 0
  fi
  commit="$(git "${GIT_ID[@]}" commit-tree "$tree" ${parent:+-p "$parent"} -m "Guide state: ${1:-checkpoint} $(date -u +%Y-%m-%dT%H:%M:%SZ)")"
  git push -q origin "$commit:refs/heads/$STATE_BRANCH"
  git update-ref "refs/remotes/origin/$STATE_BRANCH" "$commit"
  status "STATE_SAVED"
}

require_job() {
  node -e "require('./team/agents/shared/guideStore').loadJob(process.argv[1])" "${1:?managed guide job required}" >/dev/null || fail
}

case "${1:-}" in
  prepare)
    git fetch origin main
    git checkout -q -B main origin/main
    npm ci --prefix team --no-audit --no-fund
    npm ci --no-audit --no-fund
    restore_state
    out="$(mktemp)"
    node team/pm.js guide brief --scheduled 2>&1 | tee "$out" >&2 || true
    folder="$(sed -n 's/^GUIDE_BRIEF //p' "$out" | tail -n 1)"
    if [ -n "$folder" ]; then
      save_state "prepare $(basename "$folder")" >/dev/null
      status "GUIDE_BRIEF $folder"
    elif grep -q '^NOTHING_TO_GENERATE' "$out"; then
      status "NOTHING_TO_GENERATE"
    else
      fail
    fi
    ;;

  save-state)
    save_state "${2:-checkpoint}"
    ;;

  review)
    job="${2:?managed guide job required}"; require_job "$job"
    node team/pm.js guide audit --job "$job" || { save_state "audit $job" >/dev/null; fail; }
    node team/pm.js guide publish --job "$job" --dry-run || { save_state "dry-run $job" >/dev/null; fail; }
    node team/pm.js guide validate --job "$job" || { save_state "validate $job" >/dev/null; fail; }
    save_state "review $job" >/dev/null
    status "REVIEW_PASSED $job"
    ;;

  publish)
    job="${2:?managed guide job required}"; require_job "$job"
    git pull --no-rebase -q origin main
    if ! node team/pm.js guide publish --job "$job"; then save_state "publish $job" >/dev/null; fail; fi
    if [ -z "$(git status --porcelain content/guides public/images/guides)" ]; then
      status "NOTHING_TO_GENERATE"
      exit 0
    fi
    title="$(node -e "const j=require('./team/agents/shared/guideStore').loadJob(process.argv[1]);process.stdout.write((j.publishedManifest||j.manifest).title)" "$job")"
    verify() { npm --prefix team test && npm run build && node team/scripts/check-guide-links.js && node team/scripts/check-guide-metadata.js; }
    verify || { save_state "verify $job" >/dev/null; fail; }
    # Only the guide manifest, its pages and its images are committed, never code or drafts.
    git add content/guides public/images/guides
    git "${GIT_ID[@]}" commit -q -m "Publish guide: $title"
    before="$(git rev-parse HEAD)"
    git pull --no-rebase -q origin main
    if [ "$(git rev-parse HEAD)" != "$before" ]; then
      echo "[publish] main moved during the run; re-verifying the merged tree"
      verify || { save_state "verify-after-pull $job" >/dev/null; fail; }
    fi
    git push -q origin main
    save_state "published $job" >/dev/null
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
    npm --prefix team test
    npm run build
    node team/scripts/check-guide-links.js
    node team/scripts/check-guide-metadata.js
    ;;

  *)
    echo 'usage: scheduled-guide-run.sh prepare | save-state | review <job> | publish <job>   (scheduled cloud run; publish pushes the guide to main under the standing approval in CLAUDE.md)' >&2
    echo '       scheduled-guide-run.sh research <fixture> | generate <job> | publish-local <job>   (local only; no git). Any other release path needs separate Owner authorization.' >&2
    exit 2
    ;;
esac
