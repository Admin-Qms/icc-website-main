const { test } = require('node:test'); const assert = require('node:assert/strict');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path'); const crypto = require('node:crypto');
const sharp = require('sharp');
const { sourceGuideImages } = require('../agents/content/guideImages');
test('resuming textured images verifies original bytes without recompressing', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-images-')); t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.mkdirSync(path.join(directory, 'images'));
  const buffer = await sharp(crypto.randomBytes(1200 * 675 * 3), { raw: { width: 1200, height: 675, channels: 3 } }).webp().toBuffer();
  const image = { src: '/images/guides/test-guide/first-page.webp', source: 'test', sourceId: 'original', alt: 'Manufacturing test fixture', sha256: crypto.createHash('sha256').update(buffer).digest('hex'), licenseUrl: 'https://example.org/license' };
  fs.writeFileSync(path.join(directory, 'images/first-page.webp'), buffer);
  const bundle = { manifest: { slug: 'test-guide' }, introduction: { slug: 'first-page', image }, chapters: [] };
  await sourceGuideImages(bundle, directory);
  assert.equal(bundle.introduction.image.sha256, image.sha256);
  assert.deepEqual(fs.readFileSync(path.join(directory, 'images/first-page.webp')), buffer);
});
test('an image checkpoint recovers provenance when a page frontmatter checkpoint was interrupted', async t => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-image-recover-')); t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  fs.mkdirSync(path.join(directory, 'images'));
  const buffer = await sharp({ create: { width: 1200, height: 675, channels: 3, background: '#345678' } }).webp().toBuffer();
  const image = { source: 'test', sourceId: 'recovered', alt: 'Manufacturing fixture', sha256: crypto.createHash('sha256').update(buffer).digest('hex'), licenseUrl: 'https://example.org/license' };
  fs.writeFileSync(path.join(directory, 'images/first-page.webp'), buffer);
  fs.writeFileSync(path.join(directory, 'images/first-page.json'), JSON.stringify(image));
  const bundle = { manifest: { slug: 'test-guide' }, introduction: { slug: 'first-page' }, chapters: [] };
  await sourceGuideImages(bundle, directory);
  assert.equal(bundle.introduction.image.sourceId, 'recovered');
});
