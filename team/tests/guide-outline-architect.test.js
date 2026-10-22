const { test } = require('node:test'); const assert = require('node:assert/strict');
const { createGuideOutline, validateGuideOutline } = require('../agents/content/guideOutline');
const { designGuideOutline } = require('../agents/content/outlineArchitect');

const topic = { id: 'capa-workflows', topic: 'CAPA software workflows', primaryKeyword: 'CAPA software', moduleSlugs: ['nonconformance-capa'], problem: 'Following findings through containment, action and verification' };
const research = { sources: [
  { id: 'apg-review-closing', supportedClaims: ['A response to a nonconformity has three parts: correction, analysis of cause and corrective action.'] },
  { id: 'nist-corrective-action', supportedClaims: ['Corrective actions appropriate to the root cause are selected and recorded.'] }
], capabilityIds: [] };
const silent = { log: () => {} };

test('an outline the model nested under the input envelope is unwrapped and accepted', async () => {
  const seed = createGuideOutline(topic, research);
  const refined = { ...seed, title: 'Refined CAPA guide' };
  let calls = 0;
  const outline = await designGuideOutline(topic, research, { ...silent, call: async () => { calls++; return { topic, research, seed: refined }; } });
  assert.equal(calls, 1); assert.equal(outline.title, 'Refined CAPA guide');
  assert.equal(validateGuideOutline(outline, research).pass, true);
});

test('out-of-range fields in a proposal are repaired from the seed instead of rejecting the proposal', async () => {
  const seed = createGuideOutline(topic, research);
  const proposal = JSON.parse(JSON.stringify(seed));
  proposal.chapters[0].description = 'x'.repeat(200);
  proposal.chapters[1].targetWords = 1900;
  proposal.chapters[2].subsections[0].sourceIds = ['made-up-source'];
  proposal.chapters[3].subsections[1].workflow = { role: 'Owner' };
  proposal.faqQuestions = ['Only one question?'];
  const outline = await designGuideOutline(topic, research, { ...silent, call: async () => proposal });
  assert.equal(validateGuideOutline(outline, research).pass, true);
  assert.equal(outline.chapters[0].description, seed.chapters[0].description);
  assert.equal(outline.chapters[1].targetWords, 2000);
  assert.deepEqual(outline.chapters[2].subsections[0].sourceIds, seed.chapters[2].subsections[0].sourceIds);
  assert.deepEqual(outline.chapters[3].subsections[1].workflow, seed.chapters[3].subsections[1].workflow);
  assert.equal(outline.faqQuestions.length, seed.faqQuestions.length);
});

test('after two unusable proposals the architect falls back to the valid seed outline and says so', async () => {
  let calls = 0; const logged = [];
  const outline = await designGuideOutline(topic, research, { log: m => logged.push(m), call: async () => { calls++; return calls === 1 ? {} : { chapters: 'not an array' }; } });
  assert.equal(calls, 2);
  assert.deepEqual(outline, createGuideOutline(topic, research));
  assert.equal(validateGuideOutline(outline, research).pass, true);
  assert.match(logged.join('\n'), /seed outline/);
});

test('a valid top-level proposal passes through unchanged', async () => {
  const seed = createGuideOutline(topic, research);
  const proposal = { ...seed, title: 'A valid proposal' };
  const outline = await designGuideOutline(topic, research, { ...silent, call: async () => proposal });
  assert.deepEqual(outline, proposal);
});
