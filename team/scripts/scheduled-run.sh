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

status() { echo; echo "$*"; }

case "${1:-}" in
  prepare)
    git fetch origin main
    git checkout -q -B main origin/main
    npm ci --prefix team --no-audit --no-fund
    npm ci --no-audit --no-fund
    out="$(node team/pm.js blog brief 2>&1 | tee /dev/stderr | tail -n 20)" || true
    folder="$(printf '%s\n' "$out" | sed -n 's/^BRIEF //p' | tail -n 1)"
    if [ -n "$folder" ]; then
      status "BRIEF $folder"
    elif printf '%s\n' "$out" | grep -q '^NOTHING_TO_PUBLISH'; then
      status "NOTHING_TO_PUBLISH"
    else
      status "PIPELINE_FAILED"
      exit 1
    fi
    ;;

  publish)
    draft="${2:?usage: scheduled-run.sh publish <draft.json>}"
    if ! node team/pm.js blog publish --fixture "$draft"; then
      status "PIPELINE_FAILED"
      exit 1
    fi
    if [ -z "$(git status --porcelain content/blog public/images/blog)" ]; then
      status "NOTHING_TO_PUBLISH"
      exit 0
    fi
    title="$(node -e "const d=require(require('path').resolve('$draft'));process.stdout.write(d.title)")"
    npm run build
    node team/scripts/check-links.js
    # Only the article and its images are committed, never code or drafts.
    git add content/blog public/images/blog
    git -c user.name="${GIT_AUTHOR_NAME:-ICC blog pipeline}" -c user.email="${GIT_AUTHOR_EMAIL:-blog@isocertificationconsultant.ca}" \
      commit -q -m "Publish blog: $title"
    git pull --no-rebase -q origin main
    git push -q origin main
    status "PUBLISHED $title"
    ;;

  *)
    echo "usage: $0 prepare | publish <draft.json>" >&2
    exit 2
    ;;
esac
