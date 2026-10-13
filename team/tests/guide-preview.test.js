const { test } = require('node:test'); const assert = require('node:assert/strict');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path');
let preview; try { preview = require('../../lib/guide-preview'); } catch(e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
test('draft preview refuses production and unsafe job identifiers', () => {
  assert.ok(preview);
  assert.throws(() => preview.readGuidePreview({ jobId: 'valid-job', draftRoot: '/tmp', mode: 'production' }), /development|production/i);
  assert.throws(() => preview.readGuidePreview({ jobId: '../private', draftRoot: '/tmp', mode: 'development' }), /job|path/i);
});
test('preview reads unpublished complete draft pages and serves only their hashed image assets', async t => {
  assert.ok(preview); const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-preview-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const store = require('../agents/shared/guideStore').createGuideStore({ DRAFT_DIR: path.join(root, 'drafts'), CONTENT_DIR: path.join(root, 'content'), IMAGE_DIR: path.join(root, 'images') });
  const service = require('../agents/content/guideManager').createGuideManager({ store });
  const { job } = await require('./helpers/preparedGuideFixture').preparedGuideFixture(store, service);
  const result = preview.readGuidePreview({ jobId: job.id, draftRoot: store.paths.DRAFT_DIR, mode: 'development' });
  assert.equal(result.bundle.chapters.length, 9); assert.equal(result.bundle.manifest.publishedAt, undefined);
  assert.equal(fs.existsSync(store.paths.CONTENT_DIR), false);
  assert.ok(preview.previewImageFile(result, result.bundle.introduction.image.src));
  assert.equal(preview.previewImageFile(result, '/../../secret'), null);
  assert.equal(preview.previewImageFile(result, '/images/guides/other-guide/secret.webp'), null);
});
test('a symlinked image directory cannot expose files outside the managed preview job', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-preview-symlink-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const directory = path.join(root, 'job'); const outside = path.join(root, 'outside'); fs.mkdirSync(directory); fs.mkdirSync(outside);
  const buffer = Buffer.from('outside fixture'); fs.writeFileSync(path.join(outside, 'first-page.webp'), buffer); fs.symlinkSync(outside, path.join(directory, 'images'));
  const data = { directory, bundle: { introduction: { slug: 'first-page', image: { src: '/images/guides/example-guide/first-page.webp', sha256: require('node:crypto').createHash('sha256').update(buffer).digest('hex') } }, chapters: [] } };
  assert.throws(() => preview.previewImageFile(data, data.bundle.introduction.image.src), /escapes|symlink|root/i);
});
