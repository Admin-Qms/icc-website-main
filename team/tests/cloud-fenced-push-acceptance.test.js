const { test } = require('node:test'); const assert = require('node:assert/strict');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path');
const { spawnSync } = require('node:child_process');
const SCRIPTS = path.resolve(__dirname, '../scripts');
const env = { ...process.env, ICC_CLOUD_ROUTINE: '1', GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1', GIT_TERMINAL_PROMPT: '0', GIT_AUTHOR_NAME: 'Acceptance fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid', GIT_COMMITTER_NAME: 'Acceptance fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' };
function execute(cwd, bin, args) { return spawnSync(bin, args, { cwd, env, encoding: 'utf8', timeout: 20000 }); }
function git(cwd, ...args) { const result = execute(cwd, 'git', args); assert.equal(result.status, 0, result.stderr); return result.stdout.trim(); }
function setup(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-fenced-push-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const origin = path.join(root, 'origin.git'); git(root, 'init', '-q', '--bare', '-b', 'main', origin);
  const clone = path.join(root, 'publisher'); git(root, 'clone', '-q', origin, clone);
  fs.cpSync(SCRIPTS, path.join(clone, 'team/scripts'), { recursive: true });
  git(clone, 'add', '.'); git(clone, 'commit', '-qm', 'fixture source'); git(clone, 'push', '-q', 'origin', 'main');
  const state = (operation, kind = 'blog') => execute(clone, process.execPath, ['team/scripts/routine-state.js', operation, '--kind', kind, '--note', 'local acceptance fixture']);
  const success = (operation, kind) => { const result = state(operation, kind); assert.equal(result.status, 0, result.stderr || result.stdout); };
  success('acquire', 'blog'); success('acquire', 'publish');
  fs.mkdirSync(path.join(clone, 'content/blog'), { recursive: true }); fs.writeFileSync(path.join(clone, 'content/blog/own-post.md'), '# Approved fixture post');
  git(clone, 'add', 'content/blog/own-post.md'); git(clone, 'commit', '-qm', 'fixture publication');
  return { root, origin, clone, state, success };
}
function changeRemoteLease(f, kind, change) {
  const editor = path.join(f.root, 'lease-editor'); git(f.root, 'clone', '-q', '--branch', 'icc-routine-locks', f.origin, editor);
  const file = path.join(editor, 'leases.json'); const leases = JSON.parse(fs.readFileSync(file, 'utf8'));
  Object.assign(leases[kind], change); fs.writeFileSync(file, JSON.stringify(leases));
  git(editor, 'add', 'leases.json'); git(editor, 'commit', '-qm', 'external ownership change'); git(editor, 'push', '-q', 'origin', 'icc-routine-locks');
}
test('an owned blog publication pushes main and a fresh lease fence together', t => {
  const f = setup(t); const beforeLease = git(f.origin, 'rev-parse', 'icc-routine-locks'); const head = git(f.clone, 'rev-parse', 'HEAD');
  f.success('push', 'blog');
  assert.equal(git(f.origin, 'rev-parse', 'main'), head);
  assert.notEqual(git(f.origin, 'rev-parse', 'icc-routine-locks'), beforeLease, 'publication advances the lease fence atomically');
  assert.equal(git(f.origin, 'show', 'main:content/blog/own-post.md'), '# Approved fixture post');
});
test('an expired or stolen routine/publication lease prevents main advancement and preserves the local commit', async t => {
  for (const [kind, change] of [['blog', { expiresAt: 0 }], ['publish', { expiresAt: 0 }], ['blog', { token: 'different-run-token' }], ['publish', { token: 'different-run-token' }]]) {
    await t.test(`${kind} ${change.token ? 'stolen' : 'expired'}`, t => {
      const f = setup(t); changeRemoteLease(f, kind, change);
      const main = git(f.origin, 'rev-parse', 'main'); const lease = git(f.origin, 'rev-parse', 'icc-routine-locks'); const local = git(f.clone, 'rev-parse', 'HEAD');
      const result = f.state('push', 'blog'); assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /lease|owner|expired|fenc/i);
      assert.equal(git(f.origin, 'rev-parse', 'main'), main); assert.equal(git(f.origin, 'rev-parse', 'icc-routine-locks'), lease);
      assert.equal(git(f.clone, 'rev-parse', 'HEAD'), local); assert.equal(git(f.clone, 'status', '--porcelain'), '');
    });
  }
});
test('a rejected main update also leaves the remote lease fence unchanged', t => {
  const f = setup(t); const hook = path.join(f.origin, 'hooks/pre-receive');
  fs.writeFileSync(hook, '#!/bin/sh\nwhile read old new ref; do\n  if [ "$ref" = refs/heads/main ]; then exit 1; fi\ndone\n'); fs.chmodSync(hook, 0o755);
  const main = git(f.origin, 'rev-parse', 'main'); const lease = git(f.origin, 'rev-parse', 'icc-routine-locks');
  assert.notEqual(f.state('push', 'blog').status, 0);
  assert.equal(git(f.origin, 'rev-parse', 'main'), main); assert.equal(git(f.origin, 'rev-parse', 'icc-routine-locks'), lease);
});

test('ownership changing after local checks fences the in-flight atomic main update', t => {
  const f = setup(t); const editor = path.join(f.root, 'late-lease-editor');
  git(f.root, 'clone', '-q', '--branch', 'icc-routine-locks', f.origin, editor);
  const record = path.join(editor, 'leases.json'); const leases = JSON.parse(fs.readFileSync(record, 'utf8'));
  leases.blog.token = 'new-owner-during-push'; fs.writeFileSync(record, JSON.stringify(leases));
  git(editor, 'add', 'leases.json'); git(editor, 'commit', '-qm', 'ownership moved during publication');
  const stolen = git(editor, 'rev-parse', 'HEAD'); const baseline = git(f.origin, 'rev-parse', 'main');
  // The objects must exist remotely, but the branch stays unchanged until Git's
  // pre-push hook runs after advertisement and the publisher's local checks.
  git(editor, 'push', '-q', 'origin', 'HEAD:refs/heads/fixture-late-lease');
  const hook = path.join(f.clone, '.git/hooks/pre-push');
  const quote = value => "'" + value.replace(/'/g, "'\\''") + "'";
  fs.writeFileSync(hook, `#!/bin/sh\ngit --git-dir=${quote(f.origin)} update-ref refs/heads/icc-routine-locks ${stolen}\n`); fs.chmodSync(hook, 0o755);
  assert.notEqual(f.state('push', 'blog').status, 0, 'lease CAS and main update must fail together');
  assert.equal(git(f.origin, 'rev-parse', 'main'), baseline);
  assert.equal(git(f.origin, 'rev-parse', 'icc-routine-locks'), stolen, 'new ownership is preserved');
});
