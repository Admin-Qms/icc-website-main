const { test } = require('node:test'); const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path');

const SCRIPT = path.join(__dirname, '../scripts/scheduled-guide-run.sh');
function sh(cwd, cmd, args, env = {}) {
  const result = spawnSync(cmd, args, { cwd, encoding: 'utf8', env: { ...process.env, ...env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1' } });
  if (result.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed: ${result.stderr}\n${result.stdout}`);
  return result.stdout;
}
function setup(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-state-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const origin = path.join(root, 'origin.git'); sh(root, 'git', ['init', '-q', '--bare', '-b', 'main', origin]);
  const clone = path.join(root, 'clone'); sh(root, 'git', ['clone', '-q', origin, clone]);
  fs.mkdirSync(path.join(clone, 'team/scripts'), { recursive: true });
  fs.copyFileSync(SCRIPT, path.join(clone, 'team/scripts/scheduled-guide-run.sh'));
  fs.writeFileSync(path.join(clone, 'team/.gitignore'), 'drafts/*\nreports/\n');
  sh(clone, 'git', ['-c', 'user.name=t', '-c', 'user.email=t@example.com', 'add', '.']);
  sh(clone, 'git', ['-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '-q', '-m', 'seed']);
  sh(clone, 'git', ['push', '-q', 'origin', 'main']);
  return { origin, clone };
}
const run = (clone, args) => spawnSync('bash', [path.join(clone, 'team/scripts/scheduled-guide-run.sh'), ...args], { cwd: clone, encoding: 'utf8', env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1' } });

test('save-state pushes gitignored guide drafts to the state branch without lock files, and is idempotent', t => {
  const { origin, clone } = setup(t);
  const job = path.join(clone, 'team/drafts/guides/20261019-capa-abc123');
  fs.mkdirSync(path.join(job, 'chapters'), { recursive: true });
  fs.writeFileSync(path.join(job, 'state.json'), '{"id":"20261019-capa-abc123"}');
  fs.writeFileSync(path.join(job, 'chapters/one.md'), '# one');
  fs.writeFileSync(path.join(job, 'operation.lock'), '');
  fs.mkdirSync(path.join(clone, 'team/drafts/guides/reservations'), { recursive: true });
  fs.writeFileSync(path.join(clone, 'team/drafts/guides/publication.lock'), '');
  fs.writeFileSync(path.join(clone, 'team/drafts/guides/reservations/capa.json'), '{}');

  const first = run(clone, ['save-state', 'test']);
  assert.equal(first.status, 0, first.stderr); assert.match(first.stdout, /STATE_SAVED\s*$/);
  const files = sh(origin, 'git', ['ls-tree', '-r', '--name-only', 'guide-state']).trim().split('\n').sort();
  assert.deepEqual(files, ['team/drafts/guides/20261019-capa-abc123/chapters/one.md', 'team/drafts/guides/20261019-capa-abc123/state.json', 'team/drafts/guides/reservations/capa.json']);
  assert.equal(sh(clone, 'git', ['status', '--porcelain']).trim(), '', 'the main index and working tree stay untouched');

  const second = run(clone, ['save-state', 'test']);
  assert.equal(second.status, 0, second.stderr); assert.match(second.stdout, /STATE_UNCHANGED\s*$/);
  assert.equal(sh(origin, 'git', ['rev-list', '--count', 'guide-state']).trim(), '1');

  fs.writeFileSync(path.join(job, 'chapters/two.md'), '# two');
  const third = run(clone, ['save-state', 'test']);
  assert.match(third.stdout, /STATE_SAVED\s*$/);
  assert.equal(sh(origin, 'git', ['rev-list', '--count', 'guide-state']).trim(), '2');

  // A fresh clone can restore exactly what was saved.
  const fresh = path.join(path.dirname(clone), 'fresh'); sh(path.dirname(clone), 'git', ['clone', '-q', origin, fresh]);
  sh(fresh, 'git', ['fetch', '-q', 'origin', '+refs/heads/guide-state:refs/remotes/origin/guide-state']);
  sh(fresh, 'bash', ['-c', 'git archive refs/remotes/origin/guide-state | tar -xf - -C .']);
  assert.ok(fs.existsSync(path.join(fresh, 'team/drafts/guides/20261019-capa-abc123/chapters/two.md')));
  assert.ok(!fs.existsSync(path.join(fresh, 'team/drafts/guides/publication.lock')));
});

test('review and publish refuse an unknown job before touching anything', t => {
  const { clone } = setup(t);
  for (const command of ['review', 'publish']) {
    const result = run(clone, [command]);
    assert.notEqual(result.status, 0); assert.match(result.stderr, /job/i);
  }
});
