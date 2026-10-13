const { test } = require('node:test'); const assert = require('node:assert/strict');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path');
let manager; try { manager = require('../agents/content/guideManager'); } catch(e) { if(e.code !== 'MODULE_NOT_FOUND') throw e; }
test('publication of an incomplete draft cannot write live content or images', async t => {
  assert.ok(manager); const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-publish-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const { createGuideStore } = require('../agents/shared/guideStore');
  const store = createGuideStore({ DRAFT_DIR: path.join(root, 'drafts'), CONTENT_DIR: path.join(root, 'content'), IMAGE_DIR: path.join(root, 'images') });
  const job = store.createJob({ id: 'document-control', topic: 'Document control software' });
  const service = manager.createGuideManager({ store });
  await assert.rejects(() => service.publishGuide({ jobId: job.id }), /research|manifest|incomplete|guide.json|briefs/i);
  assert.equal(fs.existsSync(path.join(root, 'content')), false); assert.equal(fs.existsSync(path.join(root, 'images')), false);
});
test('generation does not overwrite an existing reviewed chapter', async t => {
  assert.ok(manager); const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-preserve-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const { createGuideStore } = require('../agents/shared/guideStore');
  const store = createGuideStore({ DRAFT_DIR: path.join(root, 'drafts'), CONTENT_DIR: path.join(root, 'content'), IMAGE_DIR: path.join(root, 'images') });
  const job = store.createJob({ id: 'document-control', topic: 'Document control software' });
  store.updateJob(job.id, { manifest: { slug: 'document-control-software', chapters: [{ slug: 'daily-workflows', file: 'chapters/daily-workflows.md' }] } });
  fs.mkdirSync(path.join(job.directory, 'chapters')); fs.writeFileSync(path.join(job.directory, 'chapters/daily-workflows.md'), 'Existing draft');
  const service = manager.createGuideManager({ store });
  const result = await service.writeGuidePage(job.id, 'daily-workflows');
  assert.equal(result.skipped, true); assert.equal(fs.readFileSync(path.join(job.directory, 'chapters/daily-workflows.md'), 'utf8'), 'Existing draft');
});
test('a complete synthetic guide survives dry-run then atomic local publication', async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-complete-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const store = require('../agents/shared/guideStore').createGuideStore({ DRAFT_DIR: path.join(root, 'drafts'), CONTENT_DIR: path.join(root, 'content'), IMAGE_DIR: path.join(root, 'images') });
  const service = manager.createGuideManager({ store });
  const { job } = await require('./helpers/preparedGuideFixture').preparedGuideFixture(store, service);
  const preview = await service.publishGuide({ jobId: job.id, dryRun: true });
  assert.equal(preview.success, true, JSON.stringify(preview.failures));
  assert.equal(fs.existsSync(store.paths.CONTENT_DIR), false);
  assert.equal(store.resumeJob(job.id).completionValid, true);
  const result = await service.publishGuide({ jobId: job.id });
  assert.equal(result.success, true, JSON.stringify(result.failures));
  assert.equal(result.files.length, 21); assert.equal(store.published()[0].chapters.length, 9);
  assert.ok(result.wordCount >= 19500 && result.wordCount <= 20000);
  const bytes = fs.readFileSync(path.join(store.paths.CONTENT_DIR, result.slug, 'introduction.md'));
  const retry = await service.publishGuide({ jobId: job.id });
  assert.equal(retry.success, false);
  assert.deepEqual(fs.readFileSync(path.join(store.paths.CONTENT_DIR, result.slug, 'introduction.md')), bytes);
});
test('explicit evidence refresh preserves chapters and invalidates all dependent reviews', async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-refresh-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const store = require('../agents/shared/guideStore').createGuideStore({ DRAFT_DIR: path.join(root, 'drafts'), CONTENT_DIR: path.join(root, 'content'), IMAGE_DIR: path.join(root, 'images') });
  const service = manager.createGuideManager({ store });
  const { job, pack } = await require('./helpers/preparedGuideFixture').preparedGuideFixture(store, service);
  const filename = path.join(job.directory, 'chapters', `${job.manifest.chapters[0].slug}.md`);
  const before = fs.readFileSync(filename);
  assert.throws(() => service.checkpointResearch(job.id, pack), /after writing/);
  pack.sources[0].supportedClaims.push('Newly reviewed historical guidance scope');
  service.checkpointResearch(job.id, pack, { refresh: true });
  assert.deepEqual(fs.readFileSync(filename), before);
  const refreshed = store.loadJob(job.id); assert.equal(refreshed.audit, null); assert.equal(refreshed.generationCompletedAt, null);
  assert.notEqual(refreshed.manifest.researchSnapshotHash, job.manifest.researchSnapshotHash);
  await assert.rejects(() => service.validateJob(job.id), /review/i);
  pack.sources[0].id = 'replacement-source';
  assert.throws(() => service.checkpointResearch(job.id, pack, { refresh: true }), /identity|IDs/i);
});
