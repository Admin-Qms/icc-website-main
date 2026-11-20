const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
test('fresh blog run restores current assets and missed-slot records without materializing historical images or discarding their remote bytes', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-blog-archive-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const env = { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1', GIT_AUTHOR_NAME: 'Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid', GIT_COMMITTER_NAME: 'Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' };
  delete env.ICC_CLOUD_ROUTINE;
  const run = (cwd, command, args) => { const r = spawnSync(command, args, { cwd, env, encoding: 'utf8' }); assert.equal(r.status, 0, r.stderr); return r.stdout.trim(); };
  const git = (cwd, ...args) => run(cwd, 'git', args);
  const origin = path.join(root, 'origin.git'); git(root, 'init', '-q', '--bare', '-b', 'main', origin);
  const a = path.join(root, 'a'); git(root, 'clone', '-q', origin, a);
  fs.mkdirSync(path.join(a, 'team/scripts'), { recursive: true }); fs.copyFileSync(path.resolve(__dirname, '../scripts/routine-state.js'), path.join(a, 'team/scripts/routine-state.js'));
  fs.writeFileSync(path.join(a, '.gitignore'), 'team/drafts/\n'); git(a, 'add', '.'); git(a, 'commit', '-qm', 'source'); git(a, 'push', '-q', 'origin', 'main');
  const state = (clone, operation) => run(clone, process.execPath, ['team/scripts/routine-state.js', operation, '--kind', 'blog']);
  state(a, 'restore');
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date());
  for (const slotDate of ['2000-01-01', today]) {
    const folder = path.join(a, 'team/drafts/blog', slotDate); fs.mkdirSync(path.join(folder, 'images'), { recursive: true });
    fs.writeFileSync(path.join(folder, 'draft.json'), JSON.stringify({ slotDate })); fs.writeFileSync(path.join(folder, 'images/hero.webp'), `original-${slotDate}`);
  }
  state(a, 'save');
  const b = path.join(root, 'b'); git(root, 'clone', '-q', origin, b); state(b, 'restore');
  assert.equal(fs.existsSync(path.join(b, 'team/drafts/blog/2000-01-01/images/hero.webp')), false);
  assert.equal(fs.existsSync(path.join(b, 'team/drafts/blog/2000-01-01/draft.json')), true);
  assert.equal(fs.readFileSync(path.join(b, 'team/drafts/blog', today, 'images/hero.webp'), 'utf8'), `original-${today}`);
  fs.writeFileSync(path.join(b, 'team/drafts/blog', today, 'body.md'), 'new text'); state(b, 'save');
  git(a, 'fetch', '-q', 'origin', 'blog-state');
  assert.equal(git(a, 'show', 'FETCH_HEAD:team/drafts/blog/2000-01-01/images/hero.webp'), 'original-2000-01-01');
});
