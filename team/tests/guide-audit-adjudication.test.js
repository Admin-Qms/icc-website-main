const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { setupReview } = require('./helpers/guideReviewFixture');

const screen = () => ({ claims: 'failed', consistency: 'failed', repetition: 'failed', unresolvedFindings: ['The supplied source was not read live.', 'The hypothetical severity example claims a product feature.'] });
const clear = () => ({
  claims: 'passed', consistency: 'passed', repetition: 'passed', additionalFindings: [],
  dimensionReasons: { claims: 'The supplied evidence supports the qualified statements.', consistency: 'The pages distinguish recommendations from verified features consistently.', repetition: 'There are no nearly verbatim duplicated paragraphs.' },
  decisions: [0, 1].map(index => ({ index, verdict: 'clear', dimension: 'claims', comparisons: [], reason: 'The supplied source and qualified prose resolve this allegation.', evidenceIds: ['source:0:claim:0'] })),
});
async function ready(t, options = {}, cloud = true) {
  const config = require('../agents/shared/config'); const original = config.CLOUD_ROUTINE;
  config.CLOUD_ROUTINE = cloud; t.after(() => { config.CLOUD_ROUTINE = original; });
  const fixture = setupReview(t, options);
  for (const slug of [...fixture.job.manifest.chapters.map(c => c.slug), fixture.job.manifest.slug]) {
    fixture.writePage(slug, slug === fixture.job.manifest.slug ? 1500 : 2000);
    await fixture.service.reviewChapter(fixture.job.id, slug);
  }
  return fixture;
}

test('disputed cloud findings require a complete independent verdict and retain both reviews', async t => {
  const { service, job, store } = await ready(t, { auditor: async () => screen(), auditAdjudicator: async (_prompt, message, _tokens, options) => {
    const payload = JSON.parse(message);
    assert.deepEqual(payload.screening, screen());
    assert.ok(payload.pages.every(p => p.slug && p.paragraphs.length));
    assert.equal(options.schema.additionalProperties, false);
    return clear();
  } });
  const result = await service.reviewGuide(job.id);
  assert.equal(result.claims, 'passed'); assert.equal(result.repetition, 'passed');
  assert.deepEqual(result.screening, screen()); assert.deepEqual(result.adjudication, clear());
  assert.equal(result.resolvedEvidence[0].evidence[0].quote, 'Preserve documented information and revision evidence');
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(job.directory, 'audit.json'))), result);
  assert.deepEqual(store.loadJob(job.id).audit, result);
});

test('adjudication receives complete lossless Markdown blocks and resolves selected page evidence exactly', async t => {
  const { adjudicateGuideAudit } = require('../agents/content/guideAudit');
  const body = '## Heading\r\n\r\nIf offered, test the feature.\r\n \r\n| Role | Decision |\n| --- | --- |\n| Owner | [Review](/contact/) |\n\nLast paragraph.';
  const research = { sources: [{ id: 'primary', retrievedAt: '2026-11-19', supportedClaims: ['A general description, not confirmation of every form field.'] }] };
  const result = await adjudicateGuideAudit(screen(), { pages: [{ slug: 'first-page', title: 'First', description: 'Description', body }], outline: {}, research }, async (_prompt, message) => {
    const payload = JSON.parse(message);
    assert.equal(payload.pages[0].paragraphs.map(p => p.text).join(''), body);
    assert.equal(payload.pages[0].title, 'First'); assert.equal(payload.pages[0].description, 'Description');
    assert.equal(payload.research.sources[0].retrievedAt, '2026-11-19');
    assert.equal(payload.research.sources[0].supportedClaims[0].text, 'A general description, not confirmation of every form field.');
    const response = clear(); response.decisions.forEach(d => { d.evidenceIds = [payload.pages[0].paragraphs.find(p => p.text.startsWith('| Role')).evidenceId]; });
    return response;
  });
  assert.equal(result.resolvedEvidence[0].evidence[0].quote, '| Role | Decision |\n| --- | --- |\n| Owner | [Review](/contact/) |\n\n');
});

for (const verdict of ['violation', 'uncertain']) test(`${verdict} on any finding cannot clear a failed guide`, async t => {
  const response = clear(); response.decisions[1].verdict = verdict;
  const { service, job } = await ready(t, { auditor: async () => screen(), auditAdjudicator: async () => response });
  const result = await service.reviewGuide(job.id);
  assert.equal(result.claims, 'failed'); assert.equal(result.repetition, 'failed');
  assert.deepEqual(result.unresolvedFindings, ['The hypothetical severity example claims a product feature.']);
});

test('clearing claim findings cannot implicitly clear an unexplained repetition failure', async t => {
  const response = clear(); response.repetition = 'failed'; response.additionalFindings = [{ verdict: 'violation', dimension: 'repetition', comparisons: [{ mode: 'exact', leftSpanIds: ['page:0:paragraph:1:span:0'], rightSpanIds: ['page:1:paragraph:1:span:0'] }], reason: 'A repeated paragraph remains.', evidenceIds: ['page:0:paragraph:1', 'page:1:paragraph:1'] }];
  const { service, job } = await ready(t, { auditor: async () => screen(), auditAdjudicator: async () => response });
  const result = await service.reviewGuide(job.id);
  assert.equal(result.repetition, 'failed'); assert.deepEqual(result.unresolvedFindings, ['A repeated paragraph remains.']);
});

test('an explicitly cleared additional explanation remains recorded without becoming an unresolved defect', async t => {
  const response = clear(); response.additionalFindings = [{ verdict: 'clear', dimension: 'claims', comparisons: [], reason: 'This accurately declares an evidence gap rather than claiming a feature.', evidenceIds: ['source:0:claim:0'] }];
  const { service, job } = await ready(t, { auditor: async () => screen(), auditAdjudicator: async () => response });
  const result = await service.reviewGuide(job.id);
  assert.equal(result.claims, 'passed'); assert.deepEqual(result.unresolvedFindings, []);
  assert.deepEqual(result.adjudication.additionalFindings, response.additionalFindings);
  assert.equal(result.additionalEvidence[0].evidence[0].quote, 'Preserve documented information and revision evidence');
});

for (const verdict of ['violation', 'uncertain']) test(`an additional ${verdict} blocks despite three passed dimension verdicts`, async t => {
  const response = clear(); response.additionalFindings = [{ verdict, dimension: 'claims', comparisons: [], reason: 'This actual issue remains unresolved.', evidenceIds: ['source:0:claim:0'] }];
  const { service, job } = await ready(t, { auditor: async () => screen(), auditAdjudicator: async () => response });
  const result = await service.reviewGuide(job.id);
  assert.equal(result.claims, 'failed'); assert.equal(result.consistency, 'failed'); assert.equal(result.repetition, 'failed');
  assert.deepEqual(result.unresolvedFindings, ['This actual issue remains unresolved.']);
});

const invalid = [
  ['missing decision', r => r.decisions.pop()],
  ['duplicate index', r => { r.decisions[1].index = 0; }],
  ['out of range index', r => { r.decisions[1].index = 2; }],
  ['blank reason', r => { r.decisions[0].reason = ' '; }],
  ['missing dimension verdict', r => { delete r.repetition; }],
  ['missing dimension reason', r => { delete r.dimensionReasons.repetition; }],
  ['invalid verdict', r => { r.decisions[0].verdict = 'approved'; }],
  ['clear without evidence', r => { r.decisions[0].evidenceIds = []; }],
  ['unknown evidence block', r => { r.decisions[0].evidenceIds = ['source:0:claim:999']; }],
  ['unknown evidence source', r => { r.decisions[0].evidenceIds = ['source:999:claim:0']; }],
  ['unexplained failed dimension', r => { r.repetition = 'failed'; }],
  ['unclassified additional finding', r => { r.additionalFindings = ['An unclassified response']; }],
  ['unknown additional witness', r => { r.additionalFindings = [{ verdict: 'clear', dimension: 'claims', comparisons: [], reason: 'Resolved.', evidenceIds: ['source:999:claim:0'] }]; }],
  ['hybrid response with legacy blockers', r => { r.unresolvedFindings = ['A genuine unresolved defect remains.']; }],
  ['legacy response without typed additional outcomes', r => { delete r.additionalFindings; r.unresolvedFindings = []; }],
  ['unknown indexed finding field', r => { r.decisions[0].unresolvedFindings = ['An unclassified defect']; }],
  ['unknown additional finding field', r => { r.additionalFindings = [{ verdict: 'clear', dimension: 'claims', comparisons: [], reason: 'Resolved.', evidenceIds: ['source:0:claim:0'], defect: 'Unclassified' }]; }],
];
for (const [name, mutate] of invalid) test(`malformed adjudication blocks without replacing the last audit: ${name}`, async t => {
  const response = clear(); mutate(response);
  const { service, job } = await ready(t, { auditor: async () => screen(), auditAdjudicator: async () => response });
  const file = path.join(job.directory, 'audit.json'); fs.writeFileSync(file, '{"earlier":"retained"}');
  await assert.rejects(service.reviewGuide(job.id), /adjudicat/i);
  assert.equal(fs.readFileSync(file, 'utf8'), '{"earlier":"retained"}');
  const receipts = fs.readdirSync(path.join(job.directory, 'attempts')).filter(name => name.startsWith('whole-guide-audit-'));
  assert.equal(receipts.length, 1);
  const receipt = JSON.parse(fs.readFileSync(path.join(job.directory, 'attempts', receipts[0])));
  assert.deepEqual(receipt.screening, screen()); assert.deepEqual(receipt.adjudication, response);
  assert.match(receipt.inputHash, /^[a-f0-9]{64}$/);
});

test('unavailable adjudication blocks instead of accepting the primary failure as a pass', async t => {
  const { service, job } = await ready(t, { auditor: async () => screen(), auditAdjudicator: async () => { throw new Error('Required adjudication unavailable'); } });
  await assert.rejects(service.reviewGuide(job.id), /unavailable/);
});

test('a clean primary cloud audit needs no adjudication', async t => {
  const { service, job } = await ready(t, { auditor: async () => ({ claims: 'passed', consistency: 'passed', repetition: 'passed', unresolvedFindings: [] }), auditAdjudicator: async () => { throw new Error('Unexpected adjudication'); } });
  assert.equal((await service.reviewGuide(job.id)).claims, 'passed');
});

test('an unexplained primary repetition failure needs an explicit independent dimension decision', async t => {
  const response = clear(); response.decisions = [];
  const { service, job } = await ready(t, { auditor: async () => ({ claims: 'passed', consistency: 'passed', repetition: 'failed', unresolvedFindings: [] }), auditAdjudicator: async () => response });
  const result = await service.reviewGuide(job.id);
  assert.equal(result.repetition, 'passed'); assert.equal(result.screening.repetition, 'failed');
  assert.deepEqual(result.adjudication.decisions, []);
});

test('an unexplained repetition failure cannot clear without an explicit senior verdict', async t => {
  const response = clear(); response.decisions = []; delete response.repetition;
  const { service, job } = await ready(t, { auditor: async () => ({ claims: 'passed', consistency: 'passed', repetition: 'failed', unresolvedFindings: [] }), auditAdjudicator: async () => response });
  await assert.rejects(service.reviewGuide(job.id), /adjudicat/i);
});

test('legacy audits keep their failure without calling the cloud adjudicator', async t => {
  const { service, job } = await ready(t, { auditor: async () => screen(), auditAdjudicator: async () => { throw new Error('Unexpected adjudication'); } }, false);
  assert.equal((await service.reviewGuide(job.id)).claims, 'failed');
});

test('uncertainty blocks even when the primary statuses contradict their own findings', async t => {
  const response = clear(); response.decisions[0].verdict = 'uncertain';
  const { service, job } = await ready(t, { auditor: async () => ({ ...screen(), claims: 'passed', consistency: 'passed', repetition: 'passed' }), auditAdjudicator: async () => response });
  const result = await service.reviewGuide(job.id);
  assert.equal(result.claims, 'failed'); assert.equal(result.consistency, 'failed'); assert.equal(result.repetition, 'failed');
});

test('research refresh forces a full audit even when all prose is unchanged', async t => {
  const requests = [];
  const { service, job } = await ready(t, { auditor: async (_prompt, message) => { requests.push(JSON.parse(message)); return { claims: 'passed', consistency: 'passed', repetition: 'passed', unresolvedFindings: [] }; } });
  await service.reviewGuide(job.id);
  const research = JSON.parse(fs.readFileSync(path.join(job.directory, 'research.json')));
  research.sources[0].supportedClaims.push('The revised primary evidence qualifies the prior statement.');
  service.checkpointResearch(job.id, research, { refresh: true });
  for (const slug of [...job.manifest.chapters.map(c => c.slug), job.manifest.slug]) await service.reviewChapter(job.id, slug);
  await service.reviewGuide(job.id);
  assert.equal(requests[1].previousAudit, undefined);
});

test('reviewed metadata changes force a full audit even when prose is unchanged', async t => {
  const requests = [];
  const { service, job } = await ready(t, { auditor: async (_prompt, message) => { requests.push(JSON.parse(message)); return { claims: 'passed', consistency: 'passed', repetition: 'passed', unresolvedFindings: [] }; } });
  await service.reviewGuide(job.id);
  const matter = require('gray-matter'); const file = path.join(job.directory, 'introduction.md');
  const page = matter(fs.readFileSync(file, 'utf8'));
  fs.writeFileSync(file, matter.stringify(page.content, { ...page.data, updated: new Date().toISOString().slice(0, 10) }));
  await service.reviewGuide(job.id);
  assert.equal(requests[1].previousAudit, undefined);
});
test('the literal comparison protocol forces a full review of an unchanged v2 guide', async t => {
  const requests = [];
  const { service, job } = await ready(t, { auditor: async (_prompt, message) => {
    requests.push(JSON.parse(message)); return { claims: 'passed', consistency: 'passed', repetition: 'passed', unresolvedFindings: [] };
  } });
  const earlier = await service.reviewGuide(job.id);
  const { bundle, research } = service.readCurrentBundle(job.id);
  const { hashValue } = require('../../lib/guide-contract.cjs');
  const pages = [bundle.introduction, ...bundle.chapters];
  earlier.reviewContextHash = hashValue({ reviewProtocol: 'indexed-passages-and-outcomes-v2',
    reviewRubric: require('../agents/content/guideAudit').GUIDE_REVIEW_RUBRIC, research,
    outline: JSON.parse(fs.readFileSync(path.join(job.directory, 'outline.json'))),
    metadata: pages.map(({ slug, title, description, primaryKeyword, keywords, author, date, updated, sourceIds, capabilityIds }) => ({ slug, title, description, primaryKeyword, keywords, author, date, updated, sourceIds, capabilityIds })),
  });
  fs.writeFileSync(path.join(job.directory, 'audit.json'), JSON.stringify(earlier));
  await service.reviewGuide(job.id);
  assert.equal(requests[1].previousAudit, undefined);
});
