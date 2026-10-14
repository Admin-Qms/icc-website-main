#!/usr/bin/env bash
# Local, resumable guide generation. Schedule activation and remote release are separate Owner decisions.
set -euo pipefail
ICC_GUIDE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ICC_GUIDE_ROOT"
case "${1:-}" in
  prepare)
    node team/pm.js guide brief --scheduled
    ;;
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
  review)
    ICC_GUIDE_JOB="${2:?managed guide job required}"
    node team/pm.js guide audit --job "$ICC_GUIDE_JOB"
    node team/pm.js guide publish --job "$ICC_GUIDE_JOB" --dry-run
    node team/pm.js guide validate --job "$ICC_GUIDE_JOB"
    ;;
  publish-local)
    node team/pm.js guide publish --job "${2:?managed guide job required}"
    npm --prefix team test
    npm run build
    node team/scripts/check-guide-links.js
    node team/scripts/check-guide-metadata.js
    ;;
  *)
    echo 'usage: scheduled-guide-run.sh prepare | research <fixture> | generate <job> | review <job> | publish-local <job>. Remote release requires separate Owner authorization.' >&2
    exit 2
    ;;
esac
