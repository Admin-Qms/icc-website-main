const { test } = require('node:test'); const assert = require('node:assert/strict');
const { structuralBundle } = require('./helpers/guideFixture'); const { hashGuideInputs } = require('../../lib/guide-contract.cjs');
let qa; try { qa = require('../agents/content/guideQA'); } catch(e) { if(e.code !== 'MODULE_NOT_FOUND') throw e; }
function context(bundle, changes = {}) { return { audit: { inputHash: hashGuideInputs(bundle), reviewer: 'External test boundary', reviewedAt: new Date().toISOString(), claims: 'passed', consistency: 'passed', repetition: 'passed', unresolvedFindings: [] }, evidence: { allowedUrls: new Set(bundle.manifest.sources.map(s => s.url)), capabilityIds: new Set() }, existingContent: [], existingImages: [], ...changes }; }
test('unavailable or stale required audits never pass', async () => {
  assert.ok(qa); const bundle = structuralBundle();
  for (const audit of [undefined, { ...context(bundle).audit, claims: 'unavailable' }, { ...context(bundle).audit, inputHash: 'stale' }]) {
    const report = await qa.validateGuide(bundle, context(bundle, { audit })); assert.equal(report.pass, false); assert.ok(report.failures.some(f => f.id.startsWith('audit-')));
  }
});
test('a reused blog image blocks a new guide', async () => {
  assert.ok(qa); const bundle = structuralBundle(); const report = await qa.validateGuide(bundle, context(bundle, { existingImages: [bundle.chapters[0].image] }));
  assert.ok(report.failures.some(f => f.id === 'image-unique'));
});
test('unapproved external URLs and unresolved capabilities block content', async () => {
  assert.ok(qa); const bundle = structuralBundle(); bundle.chapters[0].body += '\n\n[Unverified source](https://unknown.example/test)'; bundle.chapters[1].capabilityIds = ['fictional-feature'];
  const report = await qa.validateGuide(bundle, context(bundle));
  assert.ok(report.failures.some(f => f.id === 'external-link')); assert.ok(report.failures.some(f => f.id === 'capability-supported'));
});
test('missing FAQs and demonstration invitation block the bundle', async () => {
  assert.ok(qa); const bundle = structuralBundle(); const report = await qa.validateGuide(bundle, context(bundle));
  assert.ok(report.failures.some(f => f.id === 'faq-coverage')); assert.ok(report.failures.some(f => f.id === 'demonstration-invitation'));
});
test('copied substantial paragraphs are flagged independently of a passing model review', async () => {
  const bundle = structuralBundle();
  const paragraph = Array.from({ length: 70 }, (_, i) => `sharedword${i}`).join(' ');
  bundle.chapters[0].body += '\n\n' + paragraph; bundle.chapters[1].body += '\n\n' + paragraph;
  const report = await qa.validateGuide(bundle, context(bundle));
  assert.ok(report.failures.some(f => f.id === 'cross-chapter-repetition'));
});
test('product names and AI audit claims block a guide page', async () => {
  assert.ok(qa); const bundle = structuralBundle(); bundle.chapters[0].body += '\n\nAsk Quro for help.';
  const report = await qa.validateGuide(bundle, context(bundle));
  assert.ok(report.failures.some(f => f.id === 'positioning-terms' && f.page === bundle.chapters[0].slug));
});
test('a chapter with a task-style title passes keyword coverage when its description names the keyword; the introduction still needs both', async () => {
  assert.ok(qa); const bundle = structuralBundle();
  bundle.chapters[0].title = 'Verify competence in practical work';
  bundle.introduction.title = 'Showing who is qualified for each task';
  const report = await qa.validateGuide(bundle, context(bundle));
  assert.ok(!report.failures.some(f => f.id === 'keyword-covered' && f.page === bundle.chapters[0].slug), 'chapter should pass');
  assert.ok(report.failures.some(f => f.id === 'keyword-covered' && f.page === bundle.introduction.slug), 'introduction should fail');
});
test('an absolute link to the site counts as an internal link and must resolve', async () => {
  assert.ok(qa); const bundle = structuralBundle(); const source = bundle.manifest.sources[0].url;
  bundle.chapters[0].body += `\n\nSee [the module](https://isocertificationconsultants.ca/contact/) and [the standard](${source}).`;
  bundle.chapters[1].body += `\n\nSee [a missing page](https://isocertificationconsultants.ca/no-such-page/) and [the standard](${source}).`;
  const report = await qa.validateGuide(bundle, context(bundle));
  assert.ok(!report.failures.some(f => f.id === 'useful-links' && f.page === bundle.chapters[0].slug));
  assert.ok(!report.failures.some(f => f.id === 'external-link' && f.page === bundle.chapters[0].slug));
  assert.ok(report.failures.some(f => f.id === 'internal-link' && f.page === bundle.chapters[1].slug));
});
