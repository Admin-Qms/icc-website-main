#!/usr/bin/env node
// Remote snapshots and leases for independent cloud VMs. All pushes are normal
// fast-forwards; a fetched tip is never substituted for the restored baseline.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const KINDS = { guides: ['team/drafts/guides', 'team/reports/guides'], blog: ['team/drafts/blog', 'team/reports/blog'], scout: [], publish: [] };
// Orphan branches do not inherit main's hosting configuration. Every new remote
// snapshot carries this fixed marker; never copy the website's configuration.
const NO_DEPLOY = '{"git":{"deploymentEnabled":false}}\n';
const args = process.argv.slice(2); const operation = args.shift();
const option = key => { const at = args.indexOf(key); return at < 0 ? undefined : args[at + 1]; };
const kind = option('--kind');
function git(argv, { env = {}, input, binary = false, allowMissing = false } = {}) {
  const result = spawnSync('git', argv, { input, env: { ...process.env, GIT_TERMINAL_PROMPT: '0', ...env }, encoding: binary ? undefined : 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (result.status !== 0) {
    if (allowMissing && result.status === 2) return null;
    throw new Error(`Git ${argv[0]} failed (exit ${result.status ?? 'unavailable'}); no state was assumed current`);
  }
  return binary ? result.stdout : result.stdout.trim();
}
const atomic = (file, value) => {
  const temporary = `${file}.${crypto.randomUUID()}.tmp`;
  fs.writeFileSync(temporary, value, { flag: 'wx', mode: 0o600 });
  fs.renameSync(temporary, file);
};
function gitFile(name) { return path.resolve(git(['rev-parse', '--git-path', name])); }
function readJson(file) { return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null; }
function fetchBranch(branch) {
  git(['check-ref-format', `refs/heads/${branch}`]);
  const found = git(['ls-remote', '--exit-code', '--heads', 'origin', `refs/heads/${branch}`], { allowMissing: true });
  if (found === null) return '';
  git(['fetch', '-q', '--no-tags', 'origin', `+refs/heads/${branch}:refs/remotes/origin/${branch}`]);
  return git(['rev-parse', `refs/remotes/origin/${branch}`]);
}
const excluded = name => name.endsWith('.lock') || name.endsWith('.tmp') || /^\.env(?:\.|$)/.test(name) || /\.(pem|key)$/.test(name);
function filesUnder(directory) {
  if (!fs.existsSync(directory)) return [];
  const stat = fs.lstatSync(directory);
  if (stat.isSymbolicLink()) throw new Error('State paths must not contain symlinks');
  if (stat.isFile()) return excluded(path.basename(directory)) ? [] : [directory];
  if (!stat.isDirectory()) throw new Error('State paths must contain only regular files');
  return fs.readdirSync(directory).flatMap(name => excluded(name) ? [] : filesUnder(path.join(directory, name)));
}
function noDeployBlob() { return git(['hash-object', '-w', '--stdin'], { input: NO_DEPLOY }); }
function leaseTree(blob) {
  return git(['mktree'], { input: `100644 blob ${blob}\tleases.json\n100644 blob ${noDeployBlob()}\tvercel.json\n` });
}
function stateTree(paths, { seed, remove = [] } = {}) {
  const index = gitFile(`icc-state-index-${crypto.randomUUID()}`); const env = { GIT_INDEX_FILE: index };
  try {
    git(seed ? ['read-tree', seed] : ['read-tree', '--empty'], { env });
    if (remove.length) git(['update-index', '--force-remove', '-z', '--stdin'], { env, input: remove.join('\0') + '\0' });
    const files = paths.flatMap(filesUnder);
    if (files.length) git(['--literal-pathspecs', 'add', '-f', '--', ...files], { env });
    git(['update-index', '--add', '--cacheinfo', '100644', noDeployBlob(), 'vercel.json'], { env });
    return git(['write-tree'], { env });
  } finally { fs.rmSync(index, { force: true }); fs.rmSync(`${index}.lock`, { force: true }); }
}
function createCommit(tree, parent, message) {
  return git(['-c', `user.name=${process.env.GIT_AUTHOR_NAME || 'ICC routine'}`, '-c', `user.email=${process.env.GIT_AUTHOR_EMAIL || 'content@isocertificationconsultants.ca'}`, 'commit-tree', tree, ...(parent ? ['-p', parent] : []), '-m', message]);
}
function pushCommit(commit, branch) { git(['push', '-q', 'origin', `${commit}:refs/heads/${branch}`]); }

// The destination and a successor of the checked lease revision move together.
// A takeover or any competing lease update rejects the entire push.
function fencedPush(commit, branch, publication = false) {
  const revision = fetchBranch('icc-routine-locks');
  if (!revision) throw new Error('Routine lease is absent');
  const leases = JSON.parse(git(['show', `${revision}:leases.json`]));
  for (const name of publication ? [kind, 'publish'] : [kind]) {
    const local = readJson(gitFile(`icc-${name}-lease.json`));
    const current = leases[name];
    if (!current || !local || local.token !== current.token || current.expiresAt <= Date.now()) throw new Error('Routine lease is absent, expired or owned by another run');
    current.expiresAt = Date.now() + 3 * 60 * 60 * 1000;
    current.fence = crypto.randomUUID();
  }
  const blob = git(['hash-object', '-w', '--stdin'], { input: JSON.stringify(leases) + '\n' });
  const tree = leaseTree(blob);
  const fence = createCommit(tree, revision, `ICC ${kind} mutation fence`);
  git(['push', '--atomic', '-q', 'origin', `${commit}:refs/heads/${branch}`, `${fence}:refs/heads/icc-routine-locks`]);
}

function stateOperation() {
  const paths = KINDS[kind];
  if (!paths.length) throw new Error('This routine has no draft snapshot');
  const branch = kind === 'guides' ? process.env.GUIDE_STATE_BRANCH || 'guide-state' : process.env.BLOG_STATE_BRANCH || 'blog-state';
  const checkpoint = gitFile(`icc-${kind}-restored.json`);
  const remote = fetchBranch(branch); const baseline = readJson(checkpoint);
  if (operation === 'restore') {
    const local = stateTree(paths);
    if (baseline && local !== baseline.tree) throw new Error('Unsaved local state; save or reconcile before restore');
    if (!baseline && paths.some(p => filesUnder(p).length)) throw new Error('Unrestored local state exists; reconcile before restore');
    let entries = remote ? git(['ls-tree', '-rz', '--name-only', remote]).split('\0').filter(Boolean) : [];
    if (entries.includes('vercel.json')) {
      const metadata = git(['ls-tree', remote, '--', 'vercel.json']);
      if (!metadata.startsWith('100644 blob ') || git(['show', `${remote}:vercel.json`], { binary: true }).toString() !== NO_DEPLOY) throw new Error('Unsafe deployment metadata in state branch');
      entries = entries.filter(file => file !== 'vercel.json');
    }
    // Never extract an arbitrary archive from a state branch into source paths.
    for (const file of entries) {
      if (!paths.some(p => file.startsWith(`${p}/`)) || file.split('/').some(part => part === '..' || part === '.' || excluded(part))) throw new Error('State branch contains a path outside its allowlist');
      const mode = git(['ls-tree', remote, '--', file]).split(' ')[0];
      if (!['100644', '100755'].includes(mode)) throw new Error('State branch contains a nonregular file');
    }
    // The restored local snapshot is proven unchanged above, so removing only its
    // managed files also handles deletions in the newer remote snapshot.
    for (const file of paths.flatMap(filesUnder)) fs.rmSync(file);
    let materialized = entries;
    if (kind === 'blog') {
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      const current = new Set();
      for (const file of entries.filter(file => /^team\/drafts\/blog\/[^/]+\/draft\.json$/.test(file))) {
        const record = JSON.parse(git(['show', `${remote}:${file}`]));
        // Old unversioned drafts remain recoverable; all new cloud drafts have slotDate.
        if (!record.slotDate || record.slotDate === today) current.add(path.posix.dirname(file));
      }
      materialized = entries.filter(file => file.endsWith('/draft.json') || [...current].some(folder => file.startsWith(folder + '/')));
    }
    for (const file of materialized) {
      const target = path.resolve(file);
      let parent = path.dirname(target);
      while (parent !== process.cwd()) {
        if (fs.existsSync(parent) && fs.lstatSync(parent).isSymbolicLink()) throw new Error('Unsafe restored state directory');
        parent = path.dirname(parent);
      }
      fs.mkdirSync(path.dirname(target), { recursive: true });
      atomic(target, git(['show', `${remote}:${file}`], { binary: true }));
    }
    const tree = stateTree(paths);
    atomic(checkpoint, JSON.stringify({ revision: remote, tree, materialized }));
    console.log('STATE_RESTORED');
    return;
  }
  if (operation !== 'save') throw new Error('Unknown state operation');
  if ((baseline?.revision || '') !== remote) throw new Error('Stale restored state: remote changed; preserve local files and reconcile');
  const tree = stateTree(paths, kind === 'blog' && baseline?.materialized ? { seed: remote || undefined, remove: baseline.materialized } : {});
  const localTree = stateTree(paths);
  const materialized = paths.flatMap(filesUnder);
  if (remote && git(['rev-parse', `${remote}^{tree}`]) === tree) {
    atomic(checkpoint, JSON.stringify({ revision: remote, tree: localTree, materialized })); console.log('STATE_UNCHANGED'); return;
  }
  const commit = createCommit(tree, remote, `ICC ${kind} state checkpoint`);
  if (process.env.ICC_CLOUD_ROUTINE === '1') fencedPush(commit, branch);
  else pushCommit(commit, branch);
  atomic(checkpoint, JSON.stringify({ revision: commit, tree: localTree, materialized }));
  console.log('STATE_SAVED');
}
function leaseOperation() {
  const branch = 'icc-routine-locks'; const file = gitFile(`icc-${kind}-lease.json`);
  const local = readJson(file); const revision = fetchBranch(branch);
  const leases = revision ? JSON.parse(git(['show', `${revision}:leases.json`])) : {};
  const current = leases[kind]; const now = Date.now();
  const owned = current && local?.token === current.token && current.expiresAt > now;
  if (operation === 'assert-lock') {
    if (!owned) throw new Error('Routine lease is absent, expired or owned by another run; preserve local work');
    console.log('LOCK_HELD'); return;
  }
  if (operation === 'acquire') {
    if (owned) { console.log('LOCK_HELD'); return; }
    if (current && current.expiresAt > now) throw new Error('Routine already owned by another run');
    const token = crypto.randomUUID();
    leases[kind] = { token, expiresAt: now + 3 * 60 * 60 * 1000 };
  } else if (operation === 'release') {
    if (!owned) throw new Error('Only the current routine owner may release its lease');
    delete leases[kind];
  } else throw new Error('Unknown lease operation');
  const blob = git(['hash-object', '-w', '--stdin'], { input: JSON.stringify(leases) + '\n' });
  const tree = leaseTree(blob);
  const commit = createCommit(tree, revision, `ICC ${kind} lease ${operation}`);
  pushCommit(commit, branch); // competing updates reject without clobbering owners
  if (operation === 'acquire') atomic(file, JSON.stringify(leases[kind]));
  else fs.rmSync(file);
  console.log(operation === 'acquire' ? 'LOCK_ACQUIRED' : 'LOCK_RELEASED');
}
try {
  if (!(kind in KINDS)) throw new Error('Provide --kind guides|blog|scout|publish');
  const root = git(['rev-parse', '--show-toplevel']); process.chdir(root);
  if (operation === 'push') {
    if (kind === 'publish') throw new Error('Publication requires its routine kind');
    fencedPush(git(['rev-parse', 'HEAD']), 'main', true);
    console.log('PUBLICATION_PUSHED');
  } else if (['restore', 'save'].includes(operation)) stateOperation(); else leaseOperation();
} catch (error) { console.error(`ROUTINE_STATE_FAILED: ${error.message}`); process.exitCode = 1; }
