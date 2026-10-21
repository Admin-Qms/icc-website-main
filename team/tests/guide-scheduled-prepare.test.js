const { test } = require('node:test'); const assert = require('node:assert/strict');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path');
const { createGuideStore } = require('../agents/shared/guideStore');
const { createGuideManager } = require('../agents/content/guideManager');
const { structuralBundle } = require('./helpers/guideFixture');

const MONDAY = new Date('2026-10-19T12:00:00Z'); // Toronto Monday
const TUESDAY = new Date('2026-10-20T12:00:00Z');
const THURSDAY = new Date('2026-10-22T12:00:00Z');

function setup(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-sched-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const store = createGuideStore({ DRAFT_DIR: path.join(root, 'drafts'), CONTENT_DIR: path.join(root, 'content'), IMAGE_DIR: path.join(root, 'images') });
  return { root, store, manager: createGuideManager({ store }) };
}
function publishFixture(store, topicId, productionSlotId) {
  const bundle = structuralBundle(); const slug = `${topicId}-software`;
  const dir = path.join(store.paths.CONTENT_DIR, slug); fs.mkdirSync(path.join(dir, 'chapters'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'guide.json'), JSON.stringify({ ...bundle.manifest, slug, topicId, productionSlotId }));
  const matter = require('gray-matter');
  for (const page of [bundle.introduction, ...bundle.chapters]) {
    const { body, ...meta } = page;
    fs.writeFileSync(path.join(dir, page.slug === bundle.introduction.slug ? 'introduction.md' : `chapters/${page.slug}.md`), matter.stringify(body, meta));
  }
}

test('a production day with nothing open reserves the slot due today', t => {
  const { manager, store } = setup(t);
  const result = manager.prepareGuide({ scheduled: true, now: MONDAY });
  assert.equal(result.success, true); assert.equal(result.resumed, undefined);
  assert.equal(store.loadJob(result.job.id).productionSlotId, '2026-W43-slot-1');
});
test('a non-production day with nothing open generates nothing', t => {
  const { manager } = setup(t);
  assert.deepEqual(manager.prepareGuide({ scheduled: true, now: TUESDAY }), { skipped: true, reason: 'No guide production slot due today' });
});
test('an unpublished slot job is resumed on any day instead of reserving another topic', t => {
  const { manager, store } = setup(t);
  const started = manager.prepareGuide({ scheduled: true, now: MONDAY });
  for (const now of [TUESDAY, THURSDAY, new Date('2026-10-26T12:00:00Z')]) {
    const result = manager.prepareGuide({ scheduled: true, now });
    assert.equal(result.resumed, true); assert.equal(result.job.id, started.job.id);
  }
  assert.equal(store.listJobs().length, 1);
});
test('a published slot is not regenerated and the next production day moves on', t => {
  const { manager, store } = setup(t);
  publishFixture(store, 'document-control', '2026-W43-slot-1');
  assert.equal(manager.prepareGuide({ scheduled: true, now: MONDAY }).reason, 'Guide production slot already generated');
  const thursday = manager.prepareGuide({ scheduled: true, now: THURSDAY });
  assert.equal(thursday.success, true); assert.equal(thursday.job.productionSlotId, '2026-W43-slot-2');
  assert.notEqual(thursday.job.topic.id, 'document-control');
});

test('a brief lists the approved sources recorded on its topic so the writer retrieves them first', t => {
  const { manager, store } = setup(t);
  const queue = JSON.parse(fs.readFileSync(path.join(__dirname, '../memory/guide-topic-queue.json'), 'utf8')).queue;
  const stocked = queue.find(q => q.approval === 'approved' && Array.isArray(q.sources) && q.sources.length >= 2);
  assert.ok(stocked, 'the real queue has an approved topic with recorded sources');
  const result = manager.prepareGuide({ topicId: stocked.id });
  const brief = fs.readFileSync(path.join(store.loadJob(result.job.id).directory, 'brief.md'), 'utf8');
  assert.match(brief, /## Approved sources/);
  for (const url of stocked.sources) assert.ok(brief.includes(`- ${url}`), url);
  assert.ok(brief.indexOf('## Approved sources') < brief.indexOf('## Research queries'));
});
