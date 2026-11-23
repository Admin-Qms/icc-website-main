const { test } = require('node:test'); const assert = require('node:assert/strict'); const fs = require('node:fs');
const { setupReview, passedReview } = require('./helpers/guideReviewFixture');
const config = require('../agents/shared/config');
const finding = { section: 'Inputs', reason: 'Cite the input evidence', action: 'Add the assigned citation' };
const firstReview = () => ({ ...passedReview(), links: 'failed', findings: [finding] });
function cloud(t) { const old = config.CLOUD_ROUTINE; config.CLOUD_ROUTINE = true; t.after(() => { config.CLOUD_ROUTINE = old; }); }
async function scenario(t, decide) {
  cloud(t); let calls = 0;
  const f = setupReview(t, { reviewer: async (_system, message) => {
    calls++; if (calls === 1) return firstReview();
    const payload = JSON.parse(message);
    return decide(payload);
  } });
  const slug = f.job.manifest.chapters[0].slug; const file = f.writePage(slug);
  assert.equal((await f.service.reviewChapter(f.job.id, slug)).pass, false);
  fs.appendFileSync(file, '\n\nThe process owner verifies the assigned input and records the release decision.');
  return { f, slug, result: () => f.service.reviewChapter(f.job.id, slug) };
}
function decision(payload, verdict = 'clear') {
  return { index: 0, verdict, reason: 'The current cited paragraph explicitly supports the required input check.', evidenceIds: [payload.reviewEvidence?.find(e => e.kind === 'page')?.evidenceId || 'page:paragraph:0'] };
}
test('resolved prior findings have explicit indexed evidence and do not remain new blocking findings', async t => {
  const { result } = await scenario(t, payload => ({ ...passedReview(), previousFindingDecisions: [decision(payload)] }));
  const review = await result(); assert.equal(review.pass, true);
  assert.deepEqual(review.previousFindingDecisions.map(d => d.verdict), ['clear']);
  assert.equal(review.resolution.previousFindings[0].reason, finding.reason);
  assert.ok(review.resolution.resolvedEvidence[0].evidence[0].text.length > 0);
});
test('an unresolved prior finding blocks even when all dimensions incorrectly say passed', async t => {
  const { result } = await scenario(t, payload => ({ ...passedReview(), previousFindingDecisions: [decision(payload, 'uncertain')] }));
  assert.equal((await result()).pass, false);
});
for (const kind of ['missing', 'duplicate', 'invented-evidence', 'unknown-index']) test(`chapter resolution rejects ${kind} decisions rather than clearing the chapter`, async t => {
  const { result } = await scenario(t, payload => {
    const d = decision(payload); const decisions = kind === 'missing' ? [] : kind === 'duplicate' ? [d, d] : [{ ...d, ...(kind === 'invented-evidence' ? { evidenceIds: ['made-up'] } : { index: 9 }) }];
    return { ...passedReview(), previousFindingDecisions: decisions };
  });
  await assert.rejects(result, /resolution|decision|evidence/i);
});
test('new real findings remain blocking after prior findings are explicitly cleared', async t => {
  const { result } = await scenario(t, payload => ({ ...passedReview(), previousFindingDecisions: [decision(payload)], claims: 'failed', findings: [{ section: 'New paragraph', reason: 'Unsupported statement', action: 'Remove the unsupported statement' }] }));
  assert.equal((await result()).pass, false);
});
