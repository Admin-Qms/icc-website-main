const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');

// This file runs in its own node:test process; suppress repository credentials.
const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-provenance-env-'));
process.env.ICC_ENV_FILE = path.join(sandbox, 'absent.env');
process.env.IMAGE_PROVIDERS = 'session';
process.env.BLOG_CONTENT_DIR = path.join(sandbox, 'published-blog');
process.env.BLOG_IMAGE_DIR = path.join(sandbox, 'public-blog-images');
for (const key of Object.keys(process.env)) if (/(?:API_KEY|TOKEN|SECRET)$/.test(key)) process.env[key] = '';
process.on('exit', () => fs.rmSync(sandbox, { recursive: true, force: true }));
const { importSessionImage, requestFor } = require('../agents/content/sessionImages');
const { sourceGuideImages } = require('../agents/content/guideImages');

async function fixture(t) {
  const directory = fs.mkdtempSync(path.join(sandbox, 'job-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const page = { slug: 'inspection-workflow', imageBrief: 'A manufacturing inspector checks a machined part with a calibrated gauge' };
  const bundle = { manifest: { slug: page.slug }, introduction: page, chapters: [] };
  const raster = path.join(directory, 'tool-artifact.png');
  await sharp({ create: { width: 1500, height: 900, channels: 3, background: { r: 40, g: 80, b: 120 } } }).png().toFile(raster);
  await importSessionImage({ file: raster, request: requestFor({ id: page.slug, scene: page.imageBrief, alt: page.imageBrief }), directory });
  const sidecar = path.join(directory, 'images', `${page.slug}.json`);
  const image = path.join(directory, 'images', `${page.slug}.webp`);
  const record = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
  const hash = () => crypto.createHash('sha256').update(fs.readFileSync(image)).digest('hex');
  return { directory, bundle, page, sidecar, image, record, hash };
}

test('repeated final guide image consumption preserves the original imported request and input provenance', async t => {
  const f = await fixture(t); const before = f.hash(); const mtime = fs.statSync(f.image).mtimeMs;
  assert.ok(f.record.requestHash); assert.ok(f.record.inputHash); assert.ok(f.record.request?.prompt);
  await sourceGuideImages(f.bundle, f.directory);
  assert.ok(f.page.image, 'first dry-run exposes publication image metadata');
  await sourceGuideImages(f.bundle, f.directory);
  const resumed = JSON.parse(fs.readFileSync(f.sidecar, 'utf8'));
  for (const [key, value] of Object.entries(f.record)) assert.deepEqual(resumed[key], value, `original ${key} survives repeated dry-runs`);
  assert.equal(f.hash(), before); assert.equal(fs.statSync(f.image).mtimeMs, mtime);
});

test('guide consumption refuses a deleted imported sidecar even when page frontmatter still contains an image', async t => {
  const f = await fixture(t); await sourceGuideImages(f.bundle, f.directory);
  assert.ok(f.page.image); fs.unlinkSync(f.sidecar);
  await assert.rejects(() => sourceGuideImages(f.bundle, f.directory), /provenance|incomplete|checkpoint|missing/i);
  assert.ok(!fs.existsSync(f.sidecar), 'a dry-run must not invent missing imported provenance');
});

test('guide consumption refuses an imported image when its assigned scene has changed', async t => {
  const f = await fixture(t);
  f.page.imageBrief = 'A different manufacturing scene: an operator inspects a welding fixture';
  await assert.rejects(() => sourceGuideImages(f.bundle, f.directory), /request|scene|changed|reconcil/i);
  assert.deepEqual(JSON.parse(fs.readFileSync(f.sidecar, 'utf8')), f.record);
});
