const { test } = require('node:test');
const assert = require('node:assert/strict');
const { adjudicateGuideAudit } = require('../agents/content/guideAudit');
const screening = { claims: 'passed', consistency: 'passed', repetition: 'failed', unresolvedFindings: ['The same explanation appears on two pages.'] };
const payload = (left, right) => ({ outline: {}, research: { sources: [] }, pages: [
  { slug: 'first-page', body: left }, { slug: 'second-page', body: right },
] });
function response(message, mode = 'exact') {
  const data = JSON.parse(message);
  return {
    claims: 'passed', consistency: 'passed', repetition: 'failed',
    dimensionReasons: { claims: 'No unsupported feature assertion.', consistency: 'No conflicting instructions.', repetition: 'The selected current passages repeat the explanation.' },
    additionalFindings: [],
    decisions: [{ index: 0, verdict: 'violation', dimension: 'repetition', reason: 'Compare the two current passages.',
      evidenceIds: ['page:0:paragraph:0', 'page:1:paragraph:0'],
      comparisons: [{ mode, leftSpanIds: [data.pages[0].paragraphs[0].spans[0].spanId], rightSpanIds: [data.pages[1].paragraphs[0].spans[0].spanId] }],
    }],
  };
}
test('an old repetition verdict with only real paragraph IDs lacks required comparison evidence', async () => {
  await assert.rejects(adjudicateGuideAudit(screening, payload('The source gives educational advice.', 'Compare the two routes using a sample.'), async () => ({
    claims: 'passed', consistency: 'passed', repetition: 'failed',
    dimensionReasons: { claims: 'Supported.', consistency: 'Consistent.', repetition: 'The same disclaimer occurs twice.' },
    additionalFindings: [], decisions: [{ index: 0, verdict: 'violation', reason: 'A full disclaimer recurs verbatim.', evidenceIds: ['page:0:paragraph:0', 'page:1:paragraph:0'] }],
  })), /adjudication|comparison/i);
});
for (const [name, left, right] of [
  ['invented disclaimer', 'This guidance is not mandatory audit criteria.', 'Compare the observed route and record the unanswered question.'],
  ['invented example ending', 'This scenario is hypothetical; it is not a measured customer result.', 'Trace a hypothetical production order from entry to release.'],
]) test(`${name}: real span IDs cannot substantiate a false exact-text assertion`, async () => {
  await assert.rejects(adjudicateGuideAudit(screening, payload(left, right), async (_prompt, message) => response(message)), /comparison/i);
});
for (const mode of ['exact', 'near']) test(`genuine ${mode} repetition still blocks with both literal witnesses retained`, async () => {
  const left = 'The owner checks the receiving record before releasing the work.';
  const right = mode === 'exact' ? left : 'Before releasing the work, the owner checks the receiving record.';
  const result = await adjudicateGuideAudit(screening, payload(left, right), async (_prompt, message) => response(message, mode));
  assert.equal(result.repetition, 'failed');
  assert.equal(result.unresolvedFindings.length, 1);
  assert.equal(result.comparisonEvidence[0].comparisons[0].left.quote, left);
  assert.equal(result.comparisonEvidence[0].comparisons[0].right.quote, right);
});
test('comparison spans are lossless and retain the complete parent paragraphs', async () => {
  const body = 'First sentence.\r\nSecond sentence.\n\nLast paragraph.';
  await adjudicateGuideAudit(screening, payload(body, body), async (_prompt, message) => {
    const data = JSON.parse(message);
    assert.equal(data.pages[0].paragraphs.map(p => p.spans.map(s => s.text).join('')).join(''), body);
    const result = response(message);
    const ids = data.pages[0].paragraphs[0].spans.map(s => s.spanId);
    result.decisions[0].comparisons[0].leftSpanIds = ids;
    result.decisions[0].comparisons[0].rightSpanIds = data.pages[1].paragraphs[0].spans.map(s => s.spanId);
    return result;
  });
});
for (const [name, mutate] of [
  ['missing', c => { c.leftSpanIds = []; }],
  ['unknown', c => { c.leftSpanIds = ['page:99:paragraph:0:span:0']; }],
  ['source-only', c => { c.leftSpanIds = ['source:0:claim:0']; }],
  ['same page', c => { c.rightSpanIds = c.leftSpanIds; }],
  ['reordered', c => { c.leftSpanIds = ['page:0:paragraph:0:span:1', 'page:0:paragraph:0:span:0']; }],
  ['noncontiguous', c => { c.leftSpanIds = ['page:0:paragraph:0:span:0', 'page:0:paragraph:0:span:2']; }],
]) test(`${name} comparison witnesses fail closed`, async () => {
  await assert.rejects(adjudicateGuideAudit(screening, payload('First sentence. Second sentence. Third sentence.', 'First sentence. Second sentence. Third sentence.'), async (_prompt, message) => {
    const result = response(message); mutate(result.decisions[0].comparisons[0]); return result;
  }), /comparison/i);
});
test('additional repetition findings require the same literal comparisons', async () => {
  await assert.rejects(adjudicateGuideAudit(screening, payload('Only the introduction contains the qualification.', 'The chapter explains a different evidence test.'), async (_prompt, message) => {
    const result = response(message);
    const comparison = result.decisions[0];
    result.decisions = [{ ...comparison, verdict: 'clear', comparisons: [] }];
    const { index, ...additional } = comparison;
    result.additionalFindings = [additional];
    return result;
  }), /comparison/i);
});
test('a cleared repetition finding cannot excuse a failed repetition dimension', async () => {
  await assert.rejects(adjudicateGuideAudit(screening, payload('A current boundary example.', 'A current migration example.'), async (_prompt, message) => {
    const result = response(message); result.decisions[0].verdict = 'clear'; result.decisions[0].comparisons = []; return result;
  }), /adjudication/i);
});
test('comparison witnesses must also be bound to the finding paragraph IDs', async () => {
  await assert.rejects(adjudicateGuideAudit(screening, payload('The same actual sentence.', 'The same actual sentence.'), async (_prompt, message) => {
    const result = response(message); result.decisions[0].evidenceIds = ['page:0:paragraph:0']; return result;
  }), /comparison/i);
});
test('the Claude wire schema requires evidence on indexed and additional outcomes', async () => {
  await adjudicateGuideAudit(screening, payload('A current boundary example.', 'A current migration example.'), async (_prompt, message, _tokens, options) => {
    assert.equal(options.schema.properties.decisions.items.properties.evidenceIds.minItems, 1);
    assert.equal(options.schema.properties.additionalFindings.items.properties.evidenceIds.minItems, 1);
    const result = response(message);
    result.repetition = 'passed'; result.decisions[0].verdict = 'clear'; result.decisions[0].comparisons = [];
    return result;
  });
});
