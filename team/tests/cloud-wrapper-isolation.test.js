const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const common = path.resolve(__dirname, '../scripts/routine-common.sh');
function run(body) {
  return spawnSync('bash', ['-c', 'source "$1"; '+body, 'fixture', common], { encoding: 'utf8', env: { PATH: process.env.PATH, ICC_CLOUD_ROUTINE: '1', IMAGE_PROVIDERS: 'session', LLM_PROVIDERS: 'claude', CLAUDE_API_KEY: 'offline-secret-fixture' } });
}
test('publication cleanup preserves the last-line status protocol', () => {
  const result = run('ROUTINE_KIND=blog; node() { echo LOCK_RELEASED; }; claim_publication; echo "PUBLISHED fixture"');
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim().split('\n').at(-1), 'PUBLISHED fixture');
});
test('release test subprocess does not inherit cloud routing or reviewer secrets', () => {
  const result = run('npm() { test -z "${ICC_CLOUD_ROUTINE:-}${IMAGE_PROVIDERS:-}${LLM_PROVIDERS:-}${CLAUDE_API_KEY:-}"; }; run_content_tests');
  assert.equal(result.status, 0, result.stderr);
});
