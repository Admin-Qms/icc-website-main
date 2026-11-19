#!/usr/bin/env bash
# Sourced by the three entry points. Legacy Claude runs keep their providers;
# only the new cloud environment opts into session images and remote leases.
export npm_config_cache="${npm_config_cache:-/tmp/icc-npm-cache}"
# Managed cloud supplies the proxy and CA; Node must opt in to that same route.
if [ "${ICC_CLOUD_ROUTINE:-0}" = 1 ]; then export NODE_USE_ENV_PROXY=1; fi
routine_state() { node team/scripts/routine-state.js "$1" --kind "$ROUTINE_KIND"; }
cloud_run() { [ "${ICC_CLOUD_ROUTINE:-0}" = 1 ]; }
claim_routine() { if cloud_run; then routine_state acquire; fi; }
assert_routine() { if cloud_run; then routine_state assert-lock; fi; }
release_routine() { if cloud_run; then routine_state release; fi; }
release_publication() { if cloud_run; then node team/scripts/routine-state.js release --kind publish >&2; fi; }
claim_publication() {
  assert_routine
  if cloud_run; then
    node team/scripts/routine-state.js acquire --kind publish
    trap release_publication EXIT
  fi
}

# Only release wrappers call this; it never runs during a readiness probe.
# Test fixtures must not inherit session-image routing or live review credentials.
run_content_tests() (
  unset ICC_CLOUD_ROUTINE IMAGE_PROVIDERS LLM_PROVIDERS LLM_PROVIDER
  unset CLAUDE_API_KEY ANTHROPIC_API_KEY OPENAI_API_KEY GEMINI_API_KEY PEXELS_API_KEY
  export ICC_ENV_FILE=/dev/null
  npm --prefix team test
)

publication_clean_index() { node team/scripts/publication-scope.js clean-index; }
push_publication() {
  node team/scripts/publication-scope.js check "$@"
  if cloud_run; then routine_state push; else git push -q origin main; fi
}
