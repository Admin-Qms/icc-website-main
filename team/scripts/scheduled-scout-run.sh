#!/usr/bin/env bash
# The deterministic half of the weekly topic-scout run. The routine's Claude calls
# `prepare`, researches, writes a proposals file, then calls `apply`.
#
#   scheduled-scout-run.sh prepare                  -> SCOUT_NEEDED <status.json> | NOTHING_TO_SCOUT | SCOUT_FAILED
#   scheduled-scout-run.sh apply <proposals.json>   -> SCOUT_PUSHED <summary> | SCOUT_NOTHING_ACCEPTED | SCOUT_FAILED
#
# The last line of output is the status word a caller should act on. `apply` commits
# only the two queue files and the link bank, then pushes to main.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
GIT_ID=(-c "user.name=${GIT_AUTHOR_NAME:-ICC topic scout}" -c "user.email=${GIT_AUTHOR_EMAIL:-scout@isocertificationconsultants.ca}")
FILES=(team/memory/keyword-queue.json team/memory/guide-topic-queue.json team/data/external-link-bank.json)

status() { echo; echo "$*"; }
fail() { status "SCOUT_FAILED"; exit 1; }

case "${1:-}" in
  prepare)
    git fetch origin main
    git checkout -q -B main origin/main
    npm ci --prefix team --no-audit --no-fund
    npm ci --no-audit --no-fund
    node team/scripts/provider-status.js >&2 || true
    out="$(mktemp)"
    node team/pm.js scout status 2>&1 | tee "$out" >&2 || true
    if grep -q '^NOTHING_TO_SCOUT' "$out"; then
      status "NOTHING_TO_SCOUT"
    elif grep -q '^SCOUT_NEEDED' "$out"; then
      file="team/reports/scout-status.json"; mkdir -p team/reports
      sed -n '/^{/,$p' "$out" > "$file"
      status "SCOUT_NEEDED $file"
    else
      fail
    fi
    ;;

  apply)
    proposals="${2:?usage: scheduled-scout-run.sh apply <proposals.json>}"
    [ -f "$proposals" ] || fail
    out="$(mktemp)"
    node team/pm.js scout apply --fixture "$proposals" 2>&1 | tee "$out" >&2 || fail
    if grep -q '^SCOUT_NOTHING_ACCEPTED' "$out"; then
      status "SCOUT_NOTHING_ACCEPTED"; exit 0
    fi
    grep -q '^SCOUT_APPLIED' "$out" || fail
    if [ -z "$(git status --porcelain -- "${FILES[@]}")" ]; then
      status "SCOUT_NOTHING_ACCEPTED"; exit 0
    fi
    npm --prefix team test || fail
    summary="$(sed -n 's/^SCOUT_SUMMARY //p' "$out" | tail -n 1)"
    [ -n "$summary" ] || fail
    # Only the queues and the link bank are committed, never code.
    git add -- "${FILES[@]}"
    git "${GIT_ID[@]}" commit -q -m "Topic scout: $summary"
    git pull --no-rebase -q origin main
    git push -q origin main
    status "SCOUT_PUSHED $summary"
    ;;

  *)
    echo 'usage: scheduled-scout-run.sh prepare | apply <proposals.json>' >&2
    exit 2
    ;;
esac
