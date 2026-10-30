const { test } = require('node:test'); const assert = require('node:assert/strict');
let editorial; try { editorial = require('../agents/content/guideEditorial'); } catch(e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
const { structuralBundle } = require('./helpers/guideFixture');
test('chapter budgets reserve minimum words for every unwritten page', () => {
  assert.ok(editorial); const bundle = structuralBundle();
  const job = { manifest: bundle.manifest, pages: { 'chapter-1': { wordCount: 2050 } } };
  const budget = editorial.pageWordBudget(job, 'chapter-2');
  assert.equal(budget.min, 2000); assert.equal(budget.max, 2050);
  for (let i = 1; i <= 8; i++) job.pages[`chapter-${i}`] = { wordCount: 2070 };
  assert.equal(editorial.pageWordBudget(job, 'chapter-9').max, 1940);
  assert.equal(editorial.pageWordBudget(job, 'chapter-9').possible, false);
});
test('spare words are shared so the last pages keep room after long early chapters', () => {
  const { manifest } = structuralBundle(); const job = { manifest, pages: {} };
  assert.equal(editorial.pageWordBudget(job, 'chapter-1').max, 2050, '500 spare words over ten pages');
  job.pages['chapter-1'] = { wordCount: 2050 }; job.pages['chapter-2'] = { wordCount: 2050 };
  for (let i = 3; i <= 8; i++) job.pages[`chapter-${i}`] = { wordCount: 2000 };
  assert.equal(editorial.pageWordBudget(job, 'chapter-9').max, 2200, 'two pages left share 400 spare words');
  job.pages['chapter-9'] = { wordCount: 2200 };
  assert.equal(editorial.pageWordBudget(job, manifest.slug).max, 1700, 'the introduction takes what remains');
});
