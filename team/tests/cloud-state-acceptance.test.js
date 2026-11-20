// Independent acceptance coverage uses only temporary local Git remotes.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const SCRIPTS = path.resolve(__dirname, '../scripts');
const safeEnv = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1', GIT_TERMINAL_PROMPT: '0', GIT_AUTHOR_NAME: 'Acceptance fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid', GIT_COMMITTER_NAME: 'Acceptance fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' };
function execute(cwd, command, args) {
  return spawnSync(command, args, { cwd, env: safeEnv, encoding: 'utf8', timeout: 20000 });
}
function git(cwd, ...args) {
  const result = execute(cwd, 'git', args); assert.equal(result.status, 0, result.stderr); return result.stdout.trim();
}
function setup(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-cloud-state-acceptance-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const origin = path.join(root, 'origin.git'); git(root, 'init', '-q', '--bare', '-b', 'main', origin);
  const first = path.join(root, 'first'); git(root, 'clone', '-q', origin, first);
  fs.mkdirSync(path.join(first, 'team/scripts'), { recursive: true });
  fs.cpSync(SCRIPTS, path.join(first, 'team/scripts'), { recursive: true });
  fs.writeFileSync(path.join(first, 'team/.gitignore'), 'drafts/\nreports/\n');
  fs.writeFileSync(path.join(first, 'production.md'), 'Protected production fixture.\n');
  git(first, 'add', '.'); git(first, 'commit', '-qm', 'fixture source'); git(first, 'push', '-q', 'origin', 'main');
  const second = path.join(root, 'second'); git(root, 'clone', '-q', origin, second);
  const state = (clone, operation, kind = 'guides') => execute(clone, process.execPath, ['team/scripts/routine-state.js', operation, '--kind', kind, '--note', 'isolated acceptance fixture']);
  const success = (clone, operation, kind = 'guides') => { const result = state(clone, operation, kind); assert.equal(result.status, 0, result.stderr || result.stdout); return result; };
  return { root, origin, first, second, state, success };
}
function write(clone, relative, value) {
  const file = path.join(clone, relative); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, value); return file;
}

test('two restored guide checkouts cannot reparent stale progress over a newer checkpoint', t => {
  const f = setup(t); const file = 'team/drafts/guides/20261118-fixture/state.json';
  f.success(f.first, 'restore'); write(f.first, file, '{"stage":"initial"}'); f.success(f.first, 'save');
  f.success(f.first, 'restore'); f.success(f.second, 'restore');
  assert.equal(fs.readFileSync(path.join(f.second, file), 'utf8'), '{"stage":"initial"}');
  write(f.first, file, '{"stage":"newer-reviewed"}'); f.success(f.first, 'save');
  const newer = git(f.origin, 'rev-parse', 'guide-state');
  write(f.second, file, '{"stage":"stale-writing"}');
  // A fetched ref must not become evidence that stale local files were restored.
  git(f.second, 'fetch', '-q', 'origin', 'guide-state:refs/remotes/origin/guide-state');
  const stale = f.state(f.second, 'save'); assert.notEqual(stale.status, 0, 'stale snapshots must be refused');
  assert.match(stale.stdout + stale.stderr, /stale|changed|conflict|restor|newer/i);
  assert.equal(git(f.origin, 'rev-parse', 'guide-state'), newer);
  assert.equal(git(f.origin, 'show', `guide-state:${file}`), '{"stage":"newer-reviewed"}');
  assert.equal(fs.readFileSync(path.join(f.second, file), 'utf8'), '{"stage":"stale-writing"}', 'refusal preserves local work for reconciliation');
});

test('fresh guide restore preserves original asset bytes and snapshots exclude unrelated files and locks', t => {
  const f = setup(t); f.success(f.first, 'restore');
  const state = 'team/drafts/guides/20261118-fixture/state.json'; const image = 'team/drafts/guides/20261118-fixture/images/hero.webp';
  const bytes = Buffer.from([82, 73, 70, 70, 10, 0, 19, 250, 71]);
  write(f.first, state, '{"stage":"image-imported"}'); write(f.first, image, bytes);
  write(f.first, 'team/drafts/guides/20261118-fixture/operation.lock', 'ephemeral ownership');
  write(f.first, 'team/drafts/guides/publication.lock', 'ephemeral ownership');
  write(f.first, 'team/reports/guides/fixture.json', '{"pass":true}');
  write(f.first, 'team/drafts/blog/unrelated/draft.json', '{"unrelated":true}');
  write(f.first, 'team/.env', 'PRIVATE_TEST_FIXTURE=local-only');
  f.success(f.first, 'save'); const revision = git(f.origin, 'rev-parse', 'guide-state');
  f.success(f.first, 'save'); assert.equal(git(f.origin, 'rev-parse', 'guide-state'), revision, 'unchanged saves are idempotent');
  const files = git(f.origin, 'ls-tree', '-r', '--name-only', 'guide-state').split('\n');
  assert.deepEqual(files.sort(), [image, state, 'team/reports/guides/fixture.json', 'vercel.json'].sort());
  assert.deepEqual(JSON.parse(git(f.origin, 'show', 'guide-state:vercel.json')), { git: { deploymentEnabled: false } });
  assert.equal(git(f.origin, 'rev-list', '--max-parents=0', 'guide-state'), revision, 'first state snapshot is an orphan');
  f.success(f.second, 'restore');
  assert.deepEqual(fs.readFileSync(path.join(f.second, image)), bytes);
  assert.equal(fs.readFileSync(path.join(f.second, state), 'utf8'), '{"stage":"image-imported"}');
  assert.equal(git(f.first, 'status', '--porcelain').includes('production.md'), false);
  assert.equal(fs.readFileSync(path.join(f.second, 'production.md'), 'utf8'), 'Protected production fixture.\n');
});

test('durable blog drafts restore from their own orphan state and stale saves preserve newer assets', t => {
  const f = setup(t); const file = 'team/drafts/blog/2026-11-18/draft.json'; const image = 'team/drafts/blog/2026-11-18/images/hero.webp';
  f.success(f.first, 'restore', 'blog'); write(f.first, file, '{"slot":"2026-11-18","stage":"text"}');
  write(f.first, image, Buffer.from('checkpoint image bytes')); write(f.first, 'team/drafts/guides/unrelated/state.json', '{}');
  f.success(f.first, 'save', 'blog'); f.success(f.second, 'restore', 'blog');
  assert.deepEqual(fs.readFileSync(path.join(f.second, image)), Buffer.from('checkpoint image bytes'));
  const initial = git(f.origin, 'rev-parse', 'blog-state');
  assert.equal(git(f.origin, 'rev-list', '--max-parents=0', 'blog-state'), initial);
  assert.deepEqual(git(f.origin, 'ls-tree', '-r', '--name-only', 'blog-state').split('\n').sort(), [file, image, 'vercel.json'].sort());
  assert.deepEqual(JSON.parse(git(f.origin, 'show', 'blog-state:vercel.json')), { git: { deploymentEnabled: false } });
  write(f.first, file, '{"slot":"2026-11-18","stage":"reviewed"}'); f.success(f.first, 'save', 'blog');
  const newer = git(f.origin, 'rev-parse', 'blog-state'); write(f.second, file, '{"stage":"stale"}');
  const stale = f.state(f.second, 'save', 'blog'); assert.notEqual(stale.status, 0);
  assert.equal(git(f.origin, 'rev-parse', 'blog-state'), newer);
});

test('cross-checkout routine ownership refuses overlap and permits another kind and a later owner', t => {
  const f = setup(t); f.success(f.first, 'acquire', 'guides');
  assert.deepEqual(JSON.parse(git(f.origin, 'show', 'icc-routine-locks:vercel.json')), { git: { deploymentEnabled: false } });
  const collision = f.state(f.second, 'acquire', 'guides'); assert.notEqual(collision.status, 0);
  f.success(f.second, 'acquire', 'blog');
  assert.notEqual(f.state(f.second, 'release', 'guides').status, 0, 'a non-owner cannot release another run');
  f.success(f.first, 'release', 'guides'); f.success(f.second, 'acquire', 'guides');
  f.success(f.second, 'release', 'guides'); f.success(f.second, 'release', 'blog');
});

test('restore refuses deployment-enabled metadata without overwriting source config or local drafts', t => {
  const f = setup(t); f.success(f.first, 'restore');
  write(f.first, 'team/drafts/guides/fixture/state.json', '{"saved":true}'); f.success(f.first, 'save');
  const editor = path.join(f.root, 'editor'); git(f.root, 'clone', '-q', '--branch', 'guide-state', f.origin, editor);
  write(editor, 'vercel.json', '{"git":{"deploymentEnabled":true}}');
  git(editor, 'add', 'vercel.json'); git(editor, 'commit', '-qm', 'invalid deployment fixture'); git(editor, 'push', '-q', 'origin', 'guide-state');
  write(f.second, 'vercel.json', '{"sourceConfig":true}');
  const result = f.state(f.second, 'restore'); assert.notEqual(result.status, 0);
  assert.equal(fs.readFileSync(path.join(f.second, 'vercel.json'), 'utf8'), '{"sourceConfig":true}');
  assert.equal(fs.existsSync(path.join(f.second, 'team/drafts/guides/fixture/state.json')), false);
});
