const { test } = require('node:test'); const assert = require('node:assert/strict');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path'); const matter = require('gray-matter');
const { structuralBundle } = require('./helpers/guideFixture');
let moduleStore; try { moduleStore = require('../agents/shared/guideStore'); } catch(e) { if(e.code !== 'MODULE_NOT_FOUND') throw e; }
function setup(t) {
  assert.ok(moduleStore); const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-job-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, store: moduleStore.createGuideStore({ DRAFT_DIR: path.join(root, 'drafts'), CONTENT_DIR: path.join(root, 'content'), IMAGE_DIR: path.join(root, 'images') }) };
}
test('reservations serialize topic selection and preserve an interrupted job', t => {
  const { store } = setup(t); const topic = { id: 'document-control', topic: 'Document control software' };
  const job = store.createJob(topic); assert.throws(() => store.createJob(topic), /reserved/);
  assert.equal(store.loadJob(job.id).topic.id, 'document-control'); assert.ok(store.reservedTopicIds().has('document-control'));
});
test('changed chapter content invalidates stored review readiness on resume', t => {
  const { store } = setup(t); const job = store.createJob({ id: 'document-control', topic: 'Document control software' });
  const bundle = structuralBundle(); const page = bundle.chapters[0]; const { body, ...meta } = page;
  store.updateJob(job.id, { manifest: bundle.manifest, stage: 'writing', assignments: Object.fromEntries([bundle.introduction, ...bundle.chapters].map(p => [p.slug, { title: p.title, description: p.description, primaryKeyword: p.primaryKeyword, imageBrief: p.imageBrief }])) });
  const filename = path.join(job.directory, 'chapters', `${page.slug}.md`); fs.mkdirSync(path.dirname(filename), { recursive: true }); fs.writeFileSync(filename, matter.stringify(body, meta));
  store.checkpointPage(job.id, page.slug);
  store.updateJob(job.id, { stage: 'ready-for-publication', audit: { claims: 'passed' } });
  fs.appendFileSync(filename, '\n\nAdditional workflow detail.');
  const resumed = store.resumeJob(job.id); assert.equal(resumed.publicationReady, false); assert.ok(resumed.invalidated.includes('whole-guide-review'));
});
test('job and chapter path traversal is rejected', t => {
  const { store } = setup(t); assert.throws(() => store.loadJob('../elsewhere'), /job|path/i);
  const job = store.createJob({ id: 'document-control', topic: 'Document control software' });
  assert.throws(() => store.checkpointPage(job.id, '../../secret'), /chapter|page/i);
});
test('two topics cannot reserve the same weekly production slot', t => {
  const { store } = setup(t);
  store.createJob({ id: 'document-control' }, '2026-W42-slot-1');
  assert.throws(() => store.createJob({ id: 'supplier-quality' }, '2026-W42-slot-1'), /slot.*reserved/i);
  assert.equal(store.listJobs().length, 1);
});
test('a missing frozen outline invalidates a completed generation', t => {
  const { store } = setup(t); const job = store.createJob({ id: 'document-control' });
  store.updateJob(job.id, { stage: 'ready-for-publication', generationCompletedAt: new Date().toISOString(), outlineHash: 'a'.repeat(64), finalReport: { pass: true } });
  const resumed = store.resumeJob(job.id);
  assert.ok(resumed.invalidated.includes('outline'));
  assert.equal(resumed.generationCompletedAt, null);
});
