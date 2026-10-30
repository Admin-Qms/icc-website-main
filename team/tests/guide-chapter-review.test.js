const { test } = require('node:test'); const assert = require('node:assert/strict'); const fs = require('node:fs');
const { setupReview, passedReview } = require('./helpers/guideReviewFixture');
test('an unreviewed predecessor blocks generation before any writer call', async t => {
  const { service, job } = setupReview(t, { model: async () => { throw new Error('Writer must not run'); } });
  await assert.rejects(() => service.writeGuidePage(job.id, job.manifest.chapters[1].slug), /review|predecessor/i);
});
test('reviewed chapters update shared context and edited predecessors invalidate progression', async t => {
  const { service, job, store, writePage } = setupReview(t);
  assert.equal(typeof service.reviewChapter, 'function');
  const first = job.manifest.chapters[0].slug; const filename = writePage(first);
  const review = await service.reviewChapter(job.id, first);
  assert.equal(review.pass, true, JSON.stringify(review));
  const context = service.getGuideContext(job.id, job.manifest.chapters[1].slug);
  assert.equal(context.reviewedChapters[0].summary, 'The workflow owner checks inputs and preserves decision evidence.');
  assert.equal(context.example.label, 'Illustrative example');
  fs.appendFileSync(filename, '\n\nChanged operational decision.');
  assert.throws(() => service.getGuideContext(job.id, job.manifest.chapters[1].slug), /changed|stale|review/i);
  assert.equal(store.loadJob(job.id).chapterReviews[first].pass, true);
});
test('a failed semantic review or changed citation cannot advance the context', async t => {
  const { service, job, store, writePage } = setupReview(t, { reviewer: async () => ({ ...passedReview(), claims: 'failed', findings: [{ section: 'Inputs', reason: 'Unsupported claim', action: 'Remove the unsupported claim' }] }) });
  assert.equal(typeof service.reviewChapter, 'function'); const first = job.manifest.chapters[0].slug; writePage(first);
  const result = await service.reviewChapter(job.id, first); assert.equal(result.pass, false);
  assert.equal(store.loadJob(job.id).chapterReviews[first].pass, false);
  assert.throws(() => service.getGuideContext(job.id, job.manifest.chapters[1].slug), /review/i);
});
test('a 2050-word chapter is accepted when it leaves a valid guide budget', async t => {
  const { service, job, writePage } = setupReview(t); assert.equal(typeof service.reviewChapter, 'function');
  const first = job.manifest.chapters[0].slug; writePage(first, 2050);
  assert.equal((await service.reviewChapter(job.id, first)).pass, true);
});
test('reviewing a manually saved page records its actual word budget before advancement', async t => {
  const { service, job, store, writePage } = setupReview(t);
  const first = job.manifest.chapters[0].slug; writePage(first, 2050);
  store.updateJob(job.id, { pages: {} });
  assert.equal((await service.reviewChapter(job.id, first)).pass, true);
  assert.equal(store.loadJob(job.id).pages[first].wordCount, 2050);
});
test('a real copy edit saves a draft with absent optional metadata', async t => {
  const { service, job, store, writePage } = setupReview(t, {
    editModel: async (_system, message) => message.split('ARTICLE BODY:\n').at(-1).replace('checks the input', 'checks each input')
  });
  const first = job.manifest.chapters[0].slug;
  const filename = writePage(first);
  assert.equal((await service.reviewChapter(job.id, first)).pass, true);
  const page = require('../../lib/guide-contract.cjs').parseGuidePage(fs.readFileSync(filename, 'utf8'));
  assert.ok(page.body.includes('checks each input'));
  assert.equal(page.updated, undefined);
  assert.equal(store.loadJob(job.id).pages[first].wordCount, page.wordCount);
});
test('a targeted revision saves a draft with absent optional metadata', async t => {
  const { service, job, store, writePage } = setupReview(t, {
    revisionModel: async (_system, message) => {
      const { sections } = JSON.parse(message);
      return { patches: [{ heading: sections[0].heading, body: sections[0].body.trim() + '\n\nVerify evidence before release.' }] };
    }
  });
  const first = job.manifest.chapters[0].slug;
  const filename = writePage(first);
  assert.equal((await service.reviseGuidePage(job.id, first)).pass, true);
  assert.ok(fs.readFileSync(filename, 'utf8').includes('Verify evidence before release.'));
  assert.ok(store.loadJob(job.id).pages[first].wordCount > 2000);
});
test('a copy edit that leaves the word range is dropped and the written page is reviewed', async t => {
  const padding = Array.from({ length: 60 }, (_, n) => `padword${n}`).join(' ');
  const { service, job, writePage } = setupReview(t, {
    editModel: async (_system, message) => message.split('ARTICLE BODY:\n').at(-1) + ' ' + padding
  });
  const first = job.manifest.chapters[0].slug; const filename = writePage(first);
  assert.equal((await service.reviewChapter(job.id, first)).pass, true);
  assert.ok(!fs.readFileSync(filename, 'utf8').includes('padword'));
});
test('a page outside its word range fails before any edit or review call', async t => {
  const { service, job, writePage } = setupReview(t, {
    editModel: async () => { throw new Error('Editor must not run'); }, reviewer: async () => { throw new Error('Reviewer must not run'); }
  });
  const first = job.manifest.chapters[0].slug; writePage(first, 2100);
  await assert.rejects(() => service.reviewChapter(job.id, first), /must fit 2000–2050 words/);
});
test('the reviewer judges links on the supplied sources, not live availability', async t => {
  let instructions = '';
  const { service, job, writePage } = setupReview(t, { reviewer: async (system) => { instructions = system; return passedReview(); } });
  const first = job.manifest.chapters[0].slug; writePage(first);
  await service.reviewChapter(job.id, first);
  assert.match(instructions, /internal site paths such as \/contact\/ are allowed/);
  assert.match(instructions, /never fail links over live availability/);
});
