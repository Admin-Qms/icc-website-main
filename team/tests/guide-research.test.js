const { test } = require('node:test');
const assert = require('node:assert/strict');
let research;
try { research = require('../agents/content/guideResearch'); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
const source = { id: 'official-source', title: 'Official evidence', publisher: 'ISO', url: 'https://www.iso.org/standard/9001', retrievedAt: new Date().toISOString(), supportedClaims: ['Control documented information'], sourceType: 'primary' };
test('unverified product claims block the research pack', () => {
  assert.ok(research);
  const report = research.validateResearchPack({ sources: [source], capabilityIds: ['doc-approval'] }, [{ id: 'doc-approval', status: 'pending' }], new Set([source.url]));
  assert.equal(report.pass, false); assert.ok(report.failures.some(x => x.id === 'capability-unverified'));
});
test('a researched software evaluation guide need not claim ICC features', () => {
  assert.ok(research);
  assert.equal(research.validateResearchPack({ sources: [source], capabilityIds: [] }, [], new Set([source.url])).pass, true);
});
test('unapproved, secondary and future sources cannot support publication', () => {
  assert.ok(research);
  for (const edit of [{ url: 'https://unapproved.example/test' }, { sourceType: 'secondary' }, { retrievedAt: '2099-10-01T00:00:00Z' }]) {
    assert.equal(research.validateResearchPack({ sources: [{ ...source, ...edit }], capabilityIds: [] }, [], new Set([source.url])).pass, false);
  }
});
