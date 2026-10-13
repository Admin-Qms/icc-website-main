const { test } = require('node:test'); const assert = require('node:assert/strict');
const { createGuideOutline, validateGuideOutline } = require('../agents/content/guideOutline');
const { structuralBundle } = require('./helpers/guideFixture');
let editorial; try { editorial = require('../agents/content/guideEditorial'); } catch(e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
const research = { sources: [{ id: 'primary-records', url: 'https://example.org/records', supportedClaims: ['Preserve revision identity and review evidence'] }], capabilityIds: [] };
test('document and CAPA outlines assign different practical scopes with research-linked subsection briefs', () => {
  const doc = createGuideOutline({ id: 'document-control', topic: 'Document control software', primaryKeyword: 'document control software' }, research);
  const capa = createGuideOutline({ id: 'capa-workflows', topic: 'CAPA software workflows', primaryKeyword: 'CAPA software' }, research);
  assert.ok(doc.chapters.some(c => /revision/i.test(c.title)));
  assert.ok(capa.chapters.some(c => /containment/i.test(c.title)));
  assert.ok(capa.chapters.some(c => /effectiveness/i.test(c.title)));
  const section = doc.chapters[0].subsections[0];
  assert.ok(section.keyPoints.length > 0); assert.deepEqual(section.sourceIds, ['primary-records']);
  assert.ok(section.workflow.decision); assert.ok(section.evaluationCriteria.length > 0);
  assert.ok(doc.chapters[0].boundaries.length > 0);
  assert.equal(validateGuideOutline(doc, research).pass, true);
  doc.chapters[0].subsections[0].sourceIds = ['missing-evidence'];
  assert.equal(validateGuideOutline(doc, research).pass, false);
});
test('FAQ headings without substantive answers and leftover image markers fail editorial checks', () => {
  assert.ok(editorial);
  const page = structuralBundle().chapters[0];
  page.body += '\n\n### What evidence is needed?\n\nYes.\n\n[IMAGE: unfinished scene]';
  const report = editorial.checkPageContent(page, { subsections: [], sourceIds: page.sourceIds }, { sources: [] });
  assert.ok(report.failures.some(f => f.id === 'faq-answer'));
  assert.ok(report.failures.some(f => f.id === 'unresolved-marker'));
});
test('copy editing cannot silently alter a citation or a factual number', () => {
  assert.ok(editorial);
  const before = 'Keep 12 revision records. [Evidence](https://example.org/records)';
  assert.equal(editorial.preserveCopyEdit(before, 'Keep 13 revision records. [Evidence](https://example.org/records)').pass, false);
  assert.equal(editorial.preserveCopyEdit(before, 'Keep 12 revision records. [Evidence](https://example.org/other)').pass, false);
});
test('signed measurements and reference-style Markdown citations survive copy editing exactly', () => {
  for (const [before, after] of [['Keep 50mm clearance.', 'Keep 60mm clearance.'], ['The change was -5%.', 'The change was 5%.'], ['[Evidence][source]\n\n[source]: https://example.org/original', '[Evidence][source]\n\n[source]: https://example.org/changed']]) assert.equal(editorial.preserveCopyEdit(before, after).pass, false);
});
test('a researched outline rejects missing targets, subsections and FAQ allocations', () => {
  const base = createGuideOutline({ id: 'document-control', topic: 'Document control software', primaryKeyword: 'document control software' }, research);
  for (const field of ['targetWords', 'subsections']) { const plan = structuredClone(base); delete plan.chapters[0][field]; assert.equal(validateGuideOutline(plan, research).pass, false); }
  delete base.faqQuestions; assert.equal(validateGuideOutline(base, research).pass, false);
});
test('research briefs require the full workflow and a labeled hypothetical example', () => {
  const topic = { id: 'document-control', topic: 'Document control software', primaryKeyword: 'document control software' };
  const plan = createGuideOutline(topic, research); delete plan.chapters[0].subsections[0].workflow.record;
  assert.equal(validateGuideOutline(plan, research).pass, false);
  const second = createGuideOutline(topic, research); second.example.label = 'Customer success story';
  assert.equal(validateGuideOutline(second, research).pass, false);
});
