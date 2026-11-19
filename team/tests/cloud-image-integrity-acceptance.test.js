const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const sharp = require('sharp');
const ROOT = path.resolve(__dirname, '../..');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-image-integrity-acceptance-'));
process.env.ICC_ENV_FILE = path.join(scratch, 'absent.env');
process.env.IMAGE_PROVIDERS = 'session';
process.env.BLOG_CONTENT_DIR = path.join(scratch, 'content');
process.env.BLOG_IMAGE_DIR = path.join(scratch, 'public-images');
for (const key of Object.keys(process.env)) if (/(?:API_KEY|TOKEN|SECRET)$/.test(key)) process.env[key] = '';
process.on('exit', () => fs.rmSync(scratch, { recursive: true, force: true }));
const { importSessionImage, readSessionImage, requestFor } = require('../agents/content/sessionImages');
const TERMS = 'https://openai.com/policies/terms-of-use/';
async function fixture(t) {
  const directory = fs.mkdtempSync(path.join(scratch, 'job-')); t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const request = requestFor({ id: 'hero', scene: 'An inspector uses a calibrated gauge on a manufacturing line' });
  const file = path.join(directory, 'artifact.png');
  await sharp({ create: { width: 1500, height: 900, channels: 3, background: { r: 40, g: 70, b: 110 } } }).png().toFile(file);
  await importSessionImage({ directory, request, file });
  const sidecar = path.join(directory, 'images/hero.json'); const record = JSON.parse(fs.readFileSync(sidecar, 'utf8'));
  return { directory, request, file, sidecar, record, save: value => fs.writeFileSync(sidecar, JSON.stringify(value)) };
}

test('an SVG is refused instead of being rasterized and labeled as an imported tool raster', async t => {
  const directory = fs.mkdtempSync(path.join(scratch, 'svg-')); t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'vector.svg');
  fs.writeFileSync(file, '<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="900"><rect width="1500" height="900" fill="#334466"/></svg>');
  await assert.rejects(() => importSessionImage({ directory, file, request: requestFor({ id: 'hero', scene: 'Manufacturing inspection' }) }), /raster|format|image|SVG/i);
  assert.ok(!fs.existsSync(path.join(directory, 'images/hero.webp')));
});

test('stored session prompt, exact terms and source identity remain bound to the original import', async t => {
  const f = await fixture(t);
  assert.equal(f.record.sourceId, f.record.inputHash); assert.equal(f.record.licenseUrl, TERMS);
  await readSessionImage(f.directory, f.request);
  const variations = [
    { ...f.record, request: { ...f.record.request, prompt: 'A substituted prompt' } },
    { ...f.record, licenseUrl: 'https://example.invalid/forged-terms' },
    { ...f.record, sourceId: 'a'.repeat(64) },
  ];
  for (const [index, changed] of variations.entries()) {
    await t.test(['prompt tampering', 'terms tampering', 'source identity tampering'][index], async () => {
      f.save(changed);
      await assert.rejects(() => readSessionImage(f.directory, f.request), /request|provenance|terms|license|source|changed|integrity/i);
    });
  }
});

test('allowLegacy cannot turn a stripped or relabeled session checkpoint into an approved legacy asset', async t => {
  const f = await fixture(t);
  const noHash = { ...f.record }; delete noHash.requestHash;
  const stripped = { ...f.record }; for (const key of ['requestHash', 'request', 'inputHash', 'importedAt', 'id']) delete stripped[key];
  const relabeled = { ...noHash, source: 'openai' };
  for (const [index, changed] of [noHash, stripped, relabeled].entries()) {
    await t.test(['missing request hash', 'stripped session record', 'relabeled session record'][index], async () => {
      f.save(changed);
      await assert.rejects(() => readSessionImage(f.directory, f.request, { allowLegacy: true }), /request|provenance|session|changed|integrity/i);
    });
  }
});

test('allowLegacy preserves a genuine API-provider image record without session fields', async t => {
  const f = await fixture(t);
  const legacy = { width: 1200, height: 675, sha256: f.record.sha256, source: 'openai', sourceId: 'legacy-api-artifact', alt: f.request.alt, licenseUrl: TERMS };
  f.save(legacy);
  const saved = await readSessionImage(f.directory, f.request, { allowLegacy: true });
  assert.equal(saved.sha256, legacy.sha256); assert.equal(saved.sourceId, legacy.sourceId);
});

test('cloud image requests accept only regular draft.json in a direct managed blog job with its own regular body', async t => {
  const root = fs.mkdtempSync(path.join(scratch, 'cloud-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const managed = path.join(root, 'managed'); const job = path.join(managed, 'current-slot'); fs.mkdirSync(job, { recursive: true });
  const draft = { title: 'Manufacturing inspection', primaryKeyword: 'manufacturing inspection', metaDescription: 'Inspection workflow', bodyFile: 'body.md' };
  const file = path.join(job, 'draft.json'); const body = path.join(job, 'body.md');
  fs.writeFileSync(file, JSON.stringify(draft)); fs.writeFileSync(body, '## Inspection\n\nInspect a manufacturing part.');
  const cli = fixture => spawnSync(process.execPath, [path.join(ROOT, 'team/pm.js'), 'blog', 'image-requests', '--fixture', fixture], { cwd: ROOT, encoding: 'utf8', timeout: 20000, env: { ...process.env, ICC_CLOUD_ROUTINE: '1', BLOG_DRAFT_DIR: managed } });
  const valid = cli(file); assert.equal(valid.status, 0, valid.stderr || valid.stdout);
  const outside = path.join(root, 'outside.json'); fs.writeFileSync(outside, JSON.stringify({ ...draft, body: 'Inspection body', bodyFile: undefined }));
  await t.test('unmanaged fixture is refused', () => assert.notEqual(cli(outside).status, 0));
  const renamed = path.join(job, 'renamed.json'); fs.copyFileSync(file, renamed);
  await t.test('managed filename is draft.json', () => assert.notEqual(cli(renamed).status, 0));
  const nested = path.join(job, 'nested'); fs.mkdirSync(nested); fs.copyFileSync(file, path.join(nested, 'draft.json')); fs.copyFileSync(body, path.join(nested, 'body.md'));
  await t.test('job is a direct managed-root child', () => assert.notEqual(cli(path.join(nested, 'draft.json')).status, 0));
  fs.unlinkSync(file); fs.symlinkSync(renamed, file); await t.test('draft symlink is refused', () => assert.notEqual(cli(file).status, 0));
  fs.unlinkSync(file); fs.writeFileSync(file, JSON.stringify(draft));
  const elsewhere = path.join(root, 'outside.md'); fs.writeFileSync(elsewhere, 'Inspection outside its job.');
  fs.unlinkSync(body); fs.symlinkSync(elsewhere, body); await t.test('body symlink is refused', () => assert.notEqual(cli(file).status, 0));
  fs.unlinkSync(body); fs.writeFileSync(body, 'Inspection body');
  fs.writeFileSync(path.join(managed, 'escape.md'), 'Body from outside this job');
  fs.writeFileSync(file, JSON.stringify({ ...draft, bodyFile: '../escape.md' }));
  await t.test('body traversal outside its job is refused', () => assert.notEqual(cli(file).status, 0));
});
