// End-to-end dry-run acceptance: real image import and QA; only the existing LLM
// provider seam returns deterministic offline reviewer verdicts.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const sharp = require('sharp');
const ROOT = path.resolve(__dirname, '../..');
const SEED = path.join(ROOT, 'team/drafts/iso-certification-audit-stage-1-vs-stage-2/draft.json');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function files(directory) {
  return !fs.existsSync(directory) ? [] : fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);
}
async function setup(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-cloud-pipeline-acceptance-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const env = { ...process.env, ICC_ENV_FILE: path.join(root, 'absent.env'), ICC_CLOUD_ROUTINE: '1', IMAGE_PROVIDERS: 'session', LLM_PROVIDERS: 'claude',
    BLOG_DRAFT_DIR: path.join(root, 'blog-drafts'), BLOG_CONTENT_DIR: path.join(root, 'public-content'), BLOG_IMAGE_DIR: path.join(root, 'public-images'), CLAIMS_AUDIT_CACHE_DIR: path.join(root, 'claims-cache') };
  for (const name of Object.keys(env)) if (/(?:API_KEY|TOKEN|SECRET)$/.test(name)) env[name] = '';
  const draft = JSON.parse(fs.readFileSync(SEED, 'utf8'));
  delete draft.hero;
  draft.bodyFile = 'body.md';
  draft.slotDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const seed = JSON.parse(fs.readFileSync(SEED, 'utf8'));
  let body = fs.readFileSync(path.join(path.dirname(SEED), seed.bodyFile), 'utf8');
  let count = 0;
  body = body.replace(/^## .+$/gm, heading => ++count <= 2 ? `${heading}\n\n[IMAGE: Manufacturing inspector checks ${count === 1 ? 'machined parts' : 'a calibrated fixture'} on the production floor]` : heading);
  const job = path.join(env.BLOG_DRAFT_DIR, 'current-slot'); fs.mkdirSync(job, { recursive: true });
  const fixture = path.join(job, 'draft.json');
  fs.writeFileSync(fixture, JSON.stringify(draft)); fs.writeFileSync(path.join(job, 'body.md'), body);
  const cli = args => {
    const result = spawnSync(process.execPath, [path.join(ROOT, 'team/pm.js'), 'blog', ...args], { cwd: ROOT, env, encoding: 'utf8', timeout: 20000 });
    assert.equal(result.status, 0, result.stderr || result.stdout); return JSON.parse(result.stdout);
  };
  const output = cli(['image-requests', '--fixture', fixture]);
  const requests = Array.isArray(output) ? output : output.requests;
  assert.equal(requests.length, 3);
  for (const [index, request] of requests.entries()) {
    const file = path.join(root, `artifact-${index}.png`);
    await sharp({ create: { width: 1500, height: 900, channels: 3, background: { r: 30 + index * 60, g: 80, b: 110 } } }).png().toFile(file);
    cli(['import-image', '--fixture', fixture, '--id', request.id, '--file', file]);
  }
  const imported = files(root).filter(file => file.endsWith('.webp')).map(file => ({ file, hash: digest(fs.readFileSync(file)), mtime: fs.statSync(file).mtimeMs }));
  assert.equal(imported.length, 3);
  return { root, env, fixture, imported };
}
function runPipeline(f, reviewAvailable) {
  const script = `
    const fs = require('node:fs'); const path = require('node:path');
    const root = process.argv[1], fixture = process.argv[2];
    const blocked = () => { throw new Error('Acceptance run attempted network access'); };
    globalThis.fetch = blocked; require('node:http').request = blocked; require('node:https').request = blocked;
    const config = require('./team/agents/shared/config');
    config.REPORTS_DIR = path.join(root, 'reports'); config.MEMORY_DIR = path.join(root, 'memory'); config.KEYWORD_QUEUE_PATH = path.join(root, 'memory/queue.json');
    const llm = require('./team/agents/shared/claude');
    llm._providers.claude = async () => ({text:JSON.stringify({score:100,pass:true,findings:[],flaggedSentences:[],selfPlagiarismFlags:[],aiClicheCount:0,rewriteInstructions:null}),truncated:false});
    require('./team/agents/content/contentManager').publishDaily({fixture,dryRun:true})
      .then(result => fs.writeFileSync(path.join(root, 'result.json'), JSON.stringify(result)))
      .catch(error => { console.error(error.message); process.exitCode=1; });`;
  const result = spawnSync(process.execPath, ['-e', script, f.root, f.fixture], { cwd: ROOT, env: { ...f.env, CLAUDE_API_KEY: reviewAvailable ? 'offline-acceptance-fixture' : '' }, encoding: 'utf8', timeout: 20000 });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return JSON.parse(fs.readFileSync(path.join(f.root, 'result.json'), 'utf8'));
}
function assertNoPublication(f) {
  assert.deepEqual(files(f.env.BLOG_CONTENT_DIR), []);
  assert.deepEqual(files(f.env.BLOG_IMAGE_DIR), []);
  for (const image of f.imported) {
    assert.equal(digest(fs.readFileSync(image.file)), image.hash);
    assert.equal(fs.statSync(image.file).mtimeMs, image.mtime, 'verified imports are never recompressed');
  }
}

test('session blog dry-run consumes imported hero and both inline images through real final QA', async t => {
  const f = await setup(t); const result = runPipeline(f, true);
  assert.equal(result.success, true, JSON.stringify({ reason: result.reason, issues: result.issues }));
  assert.equal(result.dryRun, true);
  assert.ok(result.qaChecks.every(check => check.pass));
  const claims = result.qaChecks.find(check => check.id === 'claims-audit'); assert.ok(claims?.pass); assert.equal(claims.skipped, false);
  assert.ok(result.previewDir.startsWith(f.root + path.sep));
  const preview = fs.readFileSync(path.join(result.previewDir, 'article.md'), 'utf8');
  assert.ok(!preview.includes('[IMAGE:')); assert.equal((preview.match(/!\[[^\]]*\]\(/g) || []).length, 2);
  const rendered = files(result.previewDir).filter(file => file.endsWith('.webp'));
  assert.equal(rendered.length, 3);
  assert.deepEqual(rendered.map(file => digest(fs.readFileSync(file))).sort(), f.imported.map(image => image.hash).sort());
  assertNoPublication(f);
});

test('session blog with all imported assets refuses missing mandatory Claude review', async t => {
  const f = await setup(t); const result = runPipeline(f, false);
  assert.equal(result.success, false);
  const claims = result.qaChecks?.find(check => check.id === 'claims-audit');
  assert.equal(claims?.pass, false, JSON.stringify({ reason: result.reason, issues: result.issues }));
  assert.match(claims.message, /required.*review|CLAUDE_API_KEY/i);
  assert.ok(!files(path.join(f.root, 'reports/preview')).length);
  assertNoPublication(f);
});
