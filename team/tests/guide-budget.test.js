const { test } = require('node:test'); const assert = require('node:assert/strict');
let editorial; try { editorial = require('../agents/content/guideEditorial'); } catch(e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
const { structuralBundle } = require('./helpers/guideFixture');
test('chapter budgets reserve minimum words for every unwritten page', () => {
  assert.ok(editorial); const bundle = structuralBundle();
  const job = { manifest: bundle.manifest, pages: { 'chapter-1': { wordCount: 2150 } } };
  const budget = editorial.pageWordBudget(job, 'chapter-2');
  assert.equal(budget.min, 2000); assert.equal(budget.max, 2200); assert.ok(2150 <= budget.max);
  for (let i = 1; i <= 8; i++) job.pages[`chapter-${i}`] = { wordCount: 2070 };
  assert.equal(editorial.pageWordBudget(job, 'chapter-9').max, 1940);
  assert.equal(editorial.pageWordBudget(job, 'chapter-9').possible, false);
});
