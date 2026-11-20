const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path');
const { spawnSync } = require('node:child_process');
const SCRIPTS = path.resolve(__dirname, '../scripts');
const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1', GIT_AUTHOR_NAME: 'Acceptance fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid', GIT_COMMITTER_NAME: 'Acceptance fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' };
function command(cwd, bin, args) { return spawnSync(bin, args, { cwd, env, encoding: 'utf8', timeout: 20000 }); }
function git(cwd, ...args) { const result = command(cwd, 'git', args); assert.equal(result.status, 0, result.stderr); return result.stdout.trim(); }
function write(root, file, value = 'fixture bytes') { const target = path.join(root, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, value); }
function setup(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-publication-scope-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  git(root, 'init', '-q', '-b', 'main'); fs.cpSync(SCRIPTS, path.join(root, 'team/scripts'), { recursive: true });
  write(root, 'app/page.js', 'module.exports = "original";'); git(root, 'add', '.'); git(root, 'commit', '-qm', 'source baseline');
  git(root, 'update-ref', 'refs/remotes/origin/main', 'HEAD');
  assert.ok(fs.existsSync(path.join(root, 'team/scripts/publication-scope.js')), 'publication scope command must be installed before refusal cases are meaningful');
  const scope = (...args) => command(root, process.execPath, ['team/scripts/publication-scope.js', ...args]);
  return { root, scope };
}
const allowed = ['content/blog/own-post.md', 'public/images/blog/own-post/'];
test('publication scope accepts only its own committed blog record and image subtree', t => {
  const { root, scope } = setup(t);
  const clean = scope('clean-index'); assert.equal(clean.status, 0, clean.stderr);
  write(root, allowed[0], '# Own post'); write(root, allowed[1] + 'hero.webp');
  git(root, 'add', '--', ...allowed); git(root, 'commit', '-qm', 'own content');
  const checked = scope('check', ...allowed); assert.equal(checked.status, 0, checked.stderr);
});
test('preexisting staged code is refused by clean-index and check without changing staged work', t => {
  const { root, scope } = setup(t); write(root, 'app/page.js', 'module.exports = "preserved work";'); git(root, 'add', 'app/page.js');
  const index = git(root, 'write-tree'); const head = git(root, 'rev-parse', 'HEAD');
  for (const args of [['clean-index'], ['check', ...allowed]]) {
    const result = scope(...args); assert.notEqual(result.status, 0);
    assert.match(result.stdout + result.stderr, /staged|index|uncommitted/i);
    assert.equal(git(root, 'write-tree'), index); assert.equal(git(root, 'rev-parse', 'HEAD'), head);
    assert.equal(fs.readFileSync(path.join(root, 'app/page.js'), 'utf8'), 'module.exports = "preserved work";');
  }
});
test('an earlier unrelated content or code commit cannot ride along with the allowed publication', async t => {
  for (const unrelated of ['content/blog/another-post.md', 'public/images/blog/own-post-elsewhere/hero.webp', 'app/page.js']) {
    await t.test(unrelated, t => {
      const { root, scope } = setup(t); write(root, unrelated, 'unrelated owner work'); git(root, 'add', unrelated); git(root, 'commit', '-qm', 'unrelated work');
      write(root, allowed[0], '# Own post'); git(root, 'add', allowed[0]); git(root, 'commit', '-qm', 'own content');
      const head = git(root, 'rev-parse', 'HEAD'); const index = git(root, 'write-tree');
      const result = scope('check', ...allowed); assert.notEqual(result.status, 0);
      assert.match(result.stdout + result.stderr, /outside|allow|scope|unexpected/i);
      assert.equal(git(root, 'rev-parse', 'HEAD'), head); assert.equal(git(root, 'write-tree'), index);
      assert.equal(fs.readFileSync(path.join(root, unrelated), 'utf8'), 'unrelated owner work');
    });
  }
});
function assertRefusedWithoutMutation(root, scope) {
  const head = git(root, 'rev-parse', 'HEAD'); const index = git(root, 'write-tree');
  const status = git(root, 'status', '--porcelain=v1');
  const result = scope('check', ...allowed);
  assert.notEqual(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout + result.stderr, /outside|allow|scope|history|ancestor/i);
  assert.equal(git(root, 'rev-parse', 'HEAD'), head);
  assert.equal(git(root, 'write-tree'), index);
  assert.equal(git(root, 'status', '--porcelain=v1'), status);
}
test('reverting an unrelated commit does not authorize its publication history', t => {
  const { root, scope } = setup(t);
  write(root, 'app/page.js', 'unrelated change'); git(root, 'add', 'app/page.js'); git(root, 'commit', '-qm', 'unrelated work');
  git(root, 'revert', '--no-edit', 'HEAD');
  write(root, allowed[0], '# Own post'); git(root, 'add', allowed[0]); git(root, 'commit', '-qm', 'own content');
  assertRefusedWithoutMutation(root, scope);
});
test('renaming an unrelated source into an allowed artifact is refused', t => {
  const { root, scope } = setup(t);
  fs.mkdirSync(path.join(root, 'content/blog'), { recursive: true });
  git(root, 'mv', 'app/page.js', allowed[0]); git(root, 'commit', '-qm', 'move source to publication');
  assertRefusedWithoutMutation(root, scope);
});
test('merge history is refused even when both branches changed only allowed artifacts', t => {
  const { root, scope } = setup(t);
  git(root, 'checkout', '-qb', 'side');
  write(root, allowed[1] + 'hero.webp'); git(root, 'add', allowed[1]); git(root, 'commit', '-qm', 'own image');
  git(root, 'checkout', '-q', 'main');
  write(root, allowed[0], '# Own post'); git(root, 'add', allowed[0]); git(root, 'commit', '-qm', 'own content');
  git(root, 'merge', '--no-ff', '-qm', 'merge allowed artifacts', 'side');
  assertRefusedWithoutMutation(root, scope);
});
test('history that does not descend from origin main is refused', t => {
  const { root, scope } = setup(t);
  const baseline = git(root, 'rev-parse', 'HEAD');
  write(root, allowed[0], '# Own post'); git(root, 'add', allowed[0]); git(root, 'commit', '-qm', 'remote content');
  git(root, 'update-ref', 'refs/remotes/origin/main', 'HEAD');
  git(root, 'checkout', '-q', '--detach', baseline);
  write(root, allowed[0], '# Different own post'); git(root, 'add', allowed[0]); git(root, 'commit', '-qm', 'local content');
  assertRefusedWithoutMutation(root, scope);
});
test('linear publication history accepts own artifacts and an explicitly allowed queue', t => {
  const { root, scope } = setup(t);
  const queue = 'team/memory/keyword-queue.json';
  write(root, allowed[0], '# Own post'); git(root, 'add', allowed[0]); git(root, 'commit', '-qm', 'own content');
  write(root, allowed[1] + 'hero.webp'); write(root, queue, '[]');
  git(root, 'add', allowed[1], queue); git(root, 'commit', '-qm', 'own image and queue');
  const result = scope('check', ...allowed, queue); assert.equal(result.status, 0, result.stderr);
});
