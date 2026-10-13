const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
test('the guide runner refuses unsupported release commands without touching git', () => {
  const result = spawnSync('bash', [path.join(__dirname, '../scripts/scheduled-guide-run.sh'), 'release'], { encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /local|release|authorization/i);
});
test('the guide runner requires a managed job for later stages', () => {
  const result = spawnSync('bash', [path.join(__dirname, '../scripts/scheduled-guide-run.sh'), 'generate'], { encoding: 'utf8' });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /job/i);
});
