#!/usr/bin/env bash
# The deterministic half of the scheduled blog run. The routine's Claude calls
# `prepare`, writes body.md from the brief, then calls `publish`.
#
#   team/scripts/scheduled-run.sh prepare              -> BRIEF <folder> | NOTHING_TO_PUBLISH
#   team/scripts/scheduled-run.sh publish <draft.json> -> PUBLISHED <title> | PIPELINE_FAILED
#
# The last line of output is the status word a caller should act on.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

ROUTINE_KIND=blog
source team/scripts/routine-common.sh

status() { echo; echo "$*"; }

case "${1:-}" in
  prepare)
    claim_routine
    git fetch origin main
    git checkout -q -B main origin/main
    npm ci --prefix team --no-audit --no-fund
    npm ci --no-audit --no-fund
    node team/scripts/provider-status.js >&2
    if cloud_run; then routine_state restore; fi
    out="$(node team/pm.js blog brief 2>&1 | tee /dev/stderr | tail -n 20)" || true
    folder="$(printf '%s\n' "$out" | sed -n 's/^BRIEF //p' | tail -n 1)"
    if [ -n "$folder" ]; then
      if cloud_run; then routine_state save >/dev/null; fi
      status "BRIEF $folder"
    elif printf '%s\n' "$out" | grep -q '^NOTHING_TO_PUBLISH'; then
      release_routine
      status "NOTHING_TO_PUBLISH"
    else
      status "PIPELINE_FAILED"
      exit 1
    fi
    ;;

  save-state)
    assert_routine
    routine_state save
    ;;

  release)
    release_routine
    ;;

  publish)
    publication_clean_index
    claim_publication
    git pull --no-rebase -q origin main
    draft="${2:?usage: scheduled-run.sh publish <draft.json>}"
    if ! node team/pm.js blog publish --fixture "$draft"; then
      status "PIPELINE_FAILED"
      exit 1
    fi
    if [ -z "$(git status --porcelain content/blog public/images/blog)" ]; then
      release_routine
      status "NOTHING_TO_PUBLISH"
      exit 0
    fi
    title="$(node -e "const d=require(require('path').resolve('$draft'));process.stdout.write(d.title)")"
    verify() { npm run build && node team/scripts/check-links.js; }
    verify
    # Only the article and its images are committed, never code or drafts.
    slug="$(node -e 'const d=require(require("path").resolve(process.argv[1]));if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug||""))throw new Error("Managed blog slug required");process.stdout.write(d.slug)' "$draft")"
    FILES=("content/blog/$slug.md" "public/images/blog/$slug")
    publication_clean_index
    git add -- "${FILES[@]}"
    git -c user.name="${GIT_AUTHOR_NAME:-ICC blog pipeline}" -c user.email="${GIT_AUTHOR_EMAIL:-blog@isocertificationconsultants.ca}" \
      commit -q -m "Publish blog: $title"
    before="$(git rev-parse HEAD)"
    git pull --no-rebase -q origin main
    if [ "$(git rev-parse HEAD)" != "$before" ]; then verify; fi
    assert_routine
    if cloud_run; then
      node team/scripts/routine-state.js assert-lock --kind publish
      node -e 'const s=require("./team/agents/shared/contentStore"); const day=s.todayLocal(); if(s.listPosts().filter(p=>p.date===day).length!==1) throw new Error("Daily slot changed during publication; refusing duplicate")'
    fi
    push_publication "${FILES[@]}"
    if cloud_run; then routine_state save >/dev/null; fi
    release_routine
    status "PUBLISHED $title"
    ;;

  *)
    echo "usage: $0 prepare | save-state | release | publish <draft.json>" >&2
    exit 2
    ;;
esac
