const { root } = require('./helpers/env');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

test('actual publish CLI exposes safe review failure details and still exits without publication', () => {
  const repo = path.resolve(__dirname, '../..');
  const managed = path.join(root, 'drafts'); const job = path.join(managed, 'current-slot'); fs.mkdirSync(job, { recursive: true });
  const slotDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const fixture = path.join(job, 'draft.json');
  fs.writeFileSync(fixture, JSON.stringify({ title: 'ISO quality objectives', primaryKeyword: 'quality objectives', metaDescription: 'A public draft.', body: 'Public draft prose.', slotDate }));
  const observer = path.join(root, 'offline-provider.cjs');
  fs.writeFileSync(observer, `require(${JSON.stringify(path.join(repo, 'team/agents/shared/claude'))})._providers.claude = async () => ({text:'{private-invalid-model-text}',truncated:false,stopReason:'end_turn'});`);
  const result = spawnSync(process.execPath, ['--require', observer, path.join(repo, 'team/pm.js'), 'blog', 'publish', '--dry-run', '--fixture', fixture], {
    cwd: repo, encoding: 'utf8', timeout: 20000, env: { ...process.env, ICC_CLOUD_ROUTINE: '1', CLAUDE_API_KEY: 'offline-fixture', BLOG_DRAFT_DIR: managed },
  });
  assert.equal(result.status, 1, result.stderr);
  const match = result.stdout.match(/Review failure: (\{[^\n]+\})/);
  assert.ok(match, 'normal publication output must retain the returned diagnostic');
  const details = JSON.parse(match[1]);
  assert.equal(details.category, 'invalid-json'); assert.equal(details.stage, 'parse');
  assert.match(details.responseHash, /^[a-f0-9]{64}$/);
  assert.ok(!result.stdout.includes('private-invalid-model-text'));
  assert.match(result.stdout, /Nothing was written/);
  assert.deepEqual(fs.readdirSync(process.env.BLOG_CONTENT_DIR), []);
  assert.deepEqual(fs.readdirSync(process.env.BLOG_IMAGE_DIR), []);
});
