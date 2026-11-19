// Independent acceptance coverage: actual CLI, actual raster files, no provider credentials.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync, spawn } = require('node:child_process');
const sharp = require('sharp');
const ROOT = path.resolve(__dirname, '../..');

function setup(t, markers = 2) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-cloud-image-acceptance-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const env = { ...process.env, ICC_ENV_FILE: path.join(root, 'absent.env'), IMAGE_PROVIDERS: 'session', LLM_PROVIDERS: 'claude',
    BLOG_CONTENT_DIR: path.join(root, 'public-content'), BLOG_IMAGE_DIR: path.join(root, 'public-images'),
    GUIDE_DRAFT_DIR: path.join(root, 'guides'), GUIDE_CONTENT_DIR: path.join(root, 'guide-content'), GUIDE_IMAGE_DIR: path.join(root, 'guide-public'), GUIDE_REPORT_DIR: path.join(root, 'guide-reports') };
  for (const name of Object.keys(env)) if (/(?:API_KEY|TOKEN|SECRET)$/.test(name)) env[name] = '';
  const fixture = path.join(root, 'draft.json');
  fs.writeFileSync(fixture, JSON.stringify({ title: 'Machine shop inspection workflow', metaDescription: 'Practical inspection workflows for manufacturing quality teams.', primaryKeyword: 'machine shop inspection', bodyFile: 'body.md' }));
  fs.writeFileSync(path.join(root, 'body.md'), '## Inspection workflow\n\n' + Array.from({ length: markers }, (_, i) => `Operators inspect the parts.\n\n[IMAGE: A manufacturing inspector checks fixture ${i + 1}]`).join('\n\n'));
  const cli = args => spawnSync(process.execPath, [path.join(ROOT, 'team/pm.js'), ...args], { cwd: ROOT, env, encoding: 'utf8', timeout: 20000 });
  const requests = args => {
    const result = cli(args); assert.equal(result.status, 0, result.stderr || result.stdout);
    let parsed; assert.doesNotThrow(() => { parsed = JSON.parse(result.stdout); }, 'image requests must be machine-readable JSON');
    const list = Array.isArray(parsed) ? parsed : parsed.requests;
    assert.ok(Array.isArray(list), 'request output contains the missing request list');
    return list;
  };
  const blogRequests = () => requests(['blog', 'image-requests', '--fixture', fixture]);
  const importBlog = (id, file) => cli(['blog', 'import-image', '--fixture', fixture, '--id', id, '--file', file]);
  return { root, env, fixture, cli, requests, blogRequests, importBlog };
}
async function raster(root, index) {
  const file = path.join(root, `tool-artifact-${index}.png`);
  await sharp({ create: { width: 1500, height: 900, channels: 3, background: { r: 15 + index * 25, g: 60, b: 130 } } }).png().toFile(file);
  return file;
}
function filesUnder(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? filesUnder(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}
function metadataObjects(value) {
  if (!value || typeof value !== 'object') return [];
  return [value, ...Object.values(value).flatMap(metadataObjects)];
}
async function verifyStoredAssets(directory, count) {
  const files = filesUnder(directory);
  const images = files.filter(file => file.endsWith('.webp'));
  assert.equal(images.length, count, 'one managed normalized asset for each request');
  const records = files.filter(file => file.endsWith('.json')).flatMap(file => metadataObjects(JSON.parse(fs.readFileSync(file, 'utf8'))));
  for (const file of images) {
    const bytes = fs.readFileSync(file); const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.width, 1200); assert.equal(metadata.height, 675); assert.equal(metadata.format, 'webp');
    const digest = crypto.createHash('sha256').update(bytes).digest('hex');
    const record = records.find(item => item.sha256 === digest && item.source === 'codex');
    assert.ok(record, 'normalized bytes retain their hash and Codex provenance');
    assert.ok(record.sourceId); assert.ok(record.alt); assert.ok(record.licenseUrl || record.termsUrl || record.termsReference);
  }
  return images;
}

test('blog requests import real tool rasters, preserve provenance, and resume without changing verified bytes', async t => {
  const f = setup(t); const requests = f.blogRequests();
  assert.equal(requests.length, 3, 'hero plus two inline scenes');
  assert.equal(requests.filter(r => r.kind === 'hero').length, 1);
  for (const [index, request] of requests.entries()) {
    for (const key of ['id', 'scene', 'kind', 'alt', 'prompt']) assert.ok(request[key], `request exposes ${key}`);
    assert.match(request.prompt, /manufactur|industrial/i);
    const file = await raster(f.root, index);
    const imported = f.importBlog(request.id, file); assert.equal(imported.status, 0, imported.stderr || imported.stdout);
  }
  assert.deepEqual(f.blogRequests(), []);
  const images = await verifyStoredAssets(f.root, 3);
  const before = images.map(file => ({ file, bytes: fs.readFileSync(file), mtime: fs.statSync(file).mtimeMs }));
  const repeated = f.importBlog(requests[0].id, path.join(f.root, 'tool-artifact-0.png'));
  assert.equal(repeated.status, 0, repeated.stderr || repeated.stdout);
  assert.deepEqual(f.blogRequests(), []);
  for (const saved of before) { assert.deepEqual(fs.readFileSync(saved.file), saved.bytes); assert.equal(fs.statSync(saved.file).mtimeMs, saved.mtime); }
  assert.ok(!fs.existsSync(f.env.BLOG_IMAGE_DIR), 'imports stay in managed drafts until publication');
});

test('blog refuses replacement, duplicate assets and invalid imports without satisfying a missing request', async t => {
  const f = setup(t); const requests = f.blogRequests(); const original = await raster(f.root, 0); const changed = await raster(f.root, 1);
  assert.equal(f.importBlog(requests[0].id, original).status, 0);
  for (const [id, file] of [[requests[0].id, changed], [requests[1].id, original], ['unknown-request', changed], ['../../escaped', changed], [requests[1].id, path.join(f.root, 'absent.png')], [requests[1].id, f.root]]) {
    const rejected = f.importBlog(id, file); assert.notEqual(rejected.status, 0, `must refuse ${id} / ${path.basename(file)}`);
  }
  const invalid = path.join(f.root, 'fake.png'); fs.writeFileSync(invalid, 'not a raster');
  assert.notEqual(f.importBlog(requests[1].id, invalid).status, 0);
  assert.equal(f.blogRequests().length, 2);
  await verifyStoredAssets(f.root, 1);

  const concurrent = setup(t); const pending = concurrent.blogRequests(); const shared = await raster(concurrent.root, 0);
  const importAsync = id => new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(ROOT, 'team/pm.js'), 'blog', 'import-image', '--fixture', concurrent.fixture, '--id', id, '--file', shared], { cwd: ROOT, env: concurrent.env, timeout: 20000, stdio: 'ignore' });
    child.once('error', reject); child.once('close', code => resolve(code));
  });
  const outcomes = await Promise.all([importAsync(pending[0].id), importAsync(pending[1].id)]);
  assert.equal(outcomes.filter(code => code === 0).length, 1, 'concurrent requests cannot both register the same image');
  assert.equal(concurrent.blogRequests().length, 2);
  await verifyStoredAssets(concurrent.root, 1);
});

test('a changed stored asset cannot silently disappear from missing-image checks', async t => {
  const f = setup(t, 0); const [request] = f.blogRequests();
  assert.equal(f.importBlog(request.id, await raster(f.root, 0)).status, 0);
  const [stored] = await verifyStoredAssets(f.root, 1);
  fs.appendFileSync(stored, 'tampered');
  const result = f.cli(['blog', 'image-requests', '--fixture', f.fixture]);
  assert.notEqual(result.status, 0, 'tampered checkpoint must fail integrity rather than be accepted or regenerated');
});

test('guide CLI imports all ten managed page requests and leaves verified images untouched on restart', async t => {
  const f = setup(t, 0);
  const { createGuideStore } = require('../agents/shared/guideStore');
  const { structuralBundle } = require('./helpers/guideFixture');
  const matter = require('gray-matter'); const bundle = structuralBundle();
  const store = createGuideStore({ DRAFT_DIR: f.env.GUIDE_DRAFT_DIR, CONTENT_DIR: f.env.GUIDE_CONTENT_DIR, IMAGE_DIR: f.env.GUIDE_IMAGE_DIR });
  const job = store.createJob({ id: 'document-control', topic: 'Document control software' });
  const pages = [bundle.introduction, ...bundle.chapters];
  store.updateJob(job.id, { manifest: bundle.manifest, assignments: Object.fromEntries(pages.map(({ image, body, ...page }) => [page.slug, page])) });
  for (const { image, body, ...page } of pages) {
    const file = path.join(job.directory, store.pageFile(store.loadJob(job.id), page.slug));
    fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, matter.stringify(body, page)); store.checkpointPage(job.id, page.slug);
  }
  const requestArgs = ['guide', 'image-requests', '--job', job.id]; const requests = f.requests(requestArgs);
  assert.equal(requests.length, 10);
  for (const [index, page] of pages.entries()) {
    const file = await raster(f.root, index);
    const imported = f.cli(['guide', 'import-image', '--job', job.id, '--page', page.slug, '--file', file]);
    assert.equal(imported.status, 0, imported.stderr || imported.stdout);
  }
  assert.deepEqual(f.requests(requestArgs), []);
  const images = await verifyStoredAssets(job.directory, 10);
  const before = images.map(file => ({ file, bytes: fs.readFileSync(file), mtime: fs.statSync(file).mtimeMs }));
  assert.deepEqual(f.requests(requestArgs), []);
  for (const saved of before) { assert.deepEqual(fs.readFileSync(saved.file), saved.bytes); assert.equal(fs.statSync(saved.file).mtimeMs, saved.mtime); }
  const unknown = f.cli(['guide', 'import-image', '--job', job.id, '--page', '../../escaped', '--file', path.join(f.root, 'tool-artifact-0.png')]);
  assert.notEqual(unknown.status, 0);
  assert.ok(!fs.existsSync(f.env.GUIDE_IMAGE_DIR));
});

test('claims review refuses missing or malformed findings instead of returning a clean approval', t => {
  const f = setup(t, 0);
  const script = `
    const assert = require('node:assert/strict');
    const path = require('node:path');
    const { auditClaims } = require('./team/agents/content/contentQA');
    const post = {slug:'acceptance-claims', title:'Inspection workflow', description:'Inspection evidence', body:'Inspectors must discard all inspection records after one day.'};
    (async () => {
      for (const [i, verdict] of [{}, {findings:null}, {findings:'passed'}, {findings:[{}]}].entries()) {
        await assert.rejects(() => auditClaims(post, {call:async () => verdict, cacheDir:path.join(process.argv[1], 'review-'+i)}));
      }
    })().catch(error => { console.error(error.message); process.exitCode=1; });`;
  const result = spawnSync(process.execPath, ['-e', script, f.root], { cwd: ROOT, env: f.env, encoding: 'utf8', timeout: 20000 });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('an interrupted image checkpoint with missing provenance cannot be silently reimported', async t => {
  const f = setup(t, 0); const [request] = f.blogRequests(); const file = await raster(f.root, 0);
  assert.equal(f.importBlog(request.id, file).status, 0);
  const [stored] = await verifyStoredAssets(f.root, 1);
  const digest = crypto.createHash('sha256').update(fs.readFileSync(stored)).digest('hex');
  const sidecar = filesUnder(f.root).filter(candidate => candidate.endsWith('.json')).find(candidate =>
    metadataObjects(JSON.parse(fs.readFileSync(candidate, 'utf8'))).some(record => record.source === 'codex' && record.sha256 === digest));
  assert.ok(sidecar, 'imported asset has recorded provenance'); fs.unlinkSync(sidecar);
  const before = fs.readFileSync(stored); const mtime = fs.statSync(stored).mtimeMs;
  assert.notEqual(f.cli(['blog', 'image-requests', '--fixture', f.fixture]).status, 0, 'request check refuses incomplete checkpoint');
  assert.notEqual(f.importBlog(request.id, file).status, 0, 'reimport requires reconciliation of existing bytes');
  assert.deepEqual(fs.readFileSync(stored), before); assert.equal(fs.statSync(stored).mtimeMs, mtime);
});
