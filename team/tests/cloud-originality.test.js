const { root } = require('./helpers/env');
const { test } = require('node:test');
const assert = require('node:assert/strict');
process.env.ICC_CLOUD_ROUTINE = '1';
process.env.CLAUDE_API_KEY = 'offline-review-fixture';
const llm = require('../agents/shared/claude');
const checker = require('../agents/content/plagiarismChecker');
for (const verdict of [{ pass: 'false', score: 99 }, { pass: true }, { pass: true, score: 10 }, { pass: true, score: 99, flaggedSentences: 'unparsed' }]) {
  test(`originality rejects incomplete or contradictory verdict ${JSON.stringify(verdict)}`, async () => {
    llm._providers.claude = async () => ({ text: JSON.stringify(verdict), truncated: false, stopReason: 'end_turn' });
    await assert.rejects(checker.checkOriginality({ title: 'Fixture', primaryKeyword: 'fixture', wordCount: 10, body: 'fixture prose' }, []), /verdict|review|originality/i);
  });
}

test('normal Cloud text gate retains safe failure details without publishing', async () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const config = require('../agents/shared/config');
  config.REPORTS_DIR = path.join(root, 'reports');
  config.MEMORY_DIR = path.join(root, 'memory');
  process.env.BLOG_DRAFT_DIR = path.join(root, 'drafts');
  const job = path.join(process.env.BLOG_DRAFT_DIR, 'current-slot');
  fs.mkdirSync(job, { recursive: true });
  const fixture = path.join(job, 'draft.json');
  fs.writeFileSync(fixture, JSON.stringify({
    title: 'ISO quality objectives', primaryKeyword: 'quality objectives',
    metaDescription: 'A draft for checking the normal originality failure boundary.',
    body: 'Public draft prose.', slotDate: require('../agents/shared/contentStore').todayLocal(),
  }));
  const pipeline = require('../agents/content/contentManager');
  for (const [reply, category] of [['not JSON', 'invalid-json'], ['{"pass":', 'invalid-json'],
    ['{"pass": nope}', 'invalid-json'], ['{"pass":true,"score":10}', 'invalid-verdict']]) {
    llm._providers.claude = async () => ({ text: reply, truncated: false, stopReason: 'end_turn' });
    const result = await pipeline.publishDaily({ fixture, dryRun: true, textOnly: true });
    assert.equal(result.success, false);
    assert.equal(result.reason, 'Required originality review could not run');
    assert.equal(result.reviewFailure?.category, category);
    assert.equal(result.reviewFailure?.responseBytes, Buffer.byteLength(reply));
    assert.match(result.reviewFailure?.responseHash || '', /^[a-f0-9]{64}$/);
  }
  llm._providers.claude = async () => { throw Object.assign(new Error('private-provider-secret'), { status: 401 }); };
  const unavailable = await pipeline.publishDaily({ fixture, dryRun: true, textOnly: true });
  assert.equal(unavailable.success, false);
  assert.equal(unavailable.reviewFailure?.category, 'provider-failure');
  assert.equal(unavailable.reviewFailure?.stage, 'request');
  assert.ok(!JSON.stringify(unavailable).includes('private-provider-secret'));
  llm._providers.claude = async () => ({ text: 'partial', truncated: true });
  const truncated = await pipeline.publishDaily({ fixture, dryRun: true, textOnly: true });
  assert.equal(truncated.reviewFailure?.category, 'truncated');
  const failedReview = { score: 82, pass: false, flaggedSentences: [{ text: 'Public draft prose.', reason: 'Generic opening.', suggestion: 'Use a concrete decision.' }],
    selfPlagiarismFlags: [], aiClicheCount: 0, genericParagraphCount: 1, overallAssessment: 'Needs a specific opening.', rewriteInstructions: 'Use a concrete decision.' };
  llm._providers.claude = async () => ({ text: JSON.stringify(failedReview), truncated: false, stopReason: 'end_turn' });
  const blocked = await pipeline.publishDaily({ fixture, dryRun: true, textOnly: true });
  assert.equal(blocked.success, false);
  assert.deepEqual(blocked.originalityReview, failedReview, 'failed normal verdict remains available without replacing its score');
  assert.deepEqual(fs.readdirSync(config.CONTENT_DIR), []);
  assert.deepEqual(fs.readdirSync(config.BLOG_IMAGE_DIR), []);
});

test('Cloud reviewer receives canonical house rules rather than conflicting legacy examples alone', async () => {
  let system;
  llm._providers.claude = async (_tier, prompt) => {
    system = prompt;
    return { text: JSON.stringify({ pass: true, score: 92, flaggedSentences: [], selfPlagiarismFlags: [], aiClicheCount: 0,
      genericParagraphCount: 0, overallAssessment: 'Original.', rewriteInstructions: null }), truncated: false, stopReason: 'end_turn' };
  };
  await checker.checkOriginality({ title: 'Fixture', body: 'An original public paragraph.' }, []);
  const rules = require('node:fs').readFileSync(require('node:path').join(__dirname, '../data/writing-rules.md'), 'utf8');
  assert.ok(system.includes(rules), 'the actual request carries the maintained writing constraints');
});

test('Cloud rejects invented article witnesses and unknown comparison titles even with a passing score', async () => {
  const verdict = { pass: true, score: 99, flaggedSentences: [], selfPlagiarismFlags: [], aiClicheCount: 0,
    genericParagraphCount: 0, overallAssessment: 'Original.', rewriteInstructions: null };
  for (const changed of [
    { flaggedSentences: [{ text: 'it is worth noting', reason: 'Cliche.', suggestion: 'Remove.' }] },
    { selfPlagiarismFlags: [{ text: 'An original public paragraph.', similarTo: 'Invented comparison', similarity: 0.9 }] },
  ]) {
    llm._providers.claude = async () => ({ text: JSON.stringify({ ...verdict, ...changed }), truncated: false, stopReason: 'end_turn' });
    await assert.rejects(checker.checkOriginality({ title: 'Fixture', body: 'An original public paragraph.' }, [{ title: 'Real comparison', body: 'Different prose.' }]), /evidence/i);
  }
});

test('real normalized evidence remains a failed originality verdict rather than being cleared', async () => {
  const quote = "A shipping supervisor checks the shift's record.";
  const verdict = { pass: false, score: 82, flaggedSentences: [{ text: quote, reason: 'Repeated opening.', suggestion: 'Use a different opening.' }],
    selfPlagiarismFlags: [{ text: quote, similarTo: 'Real comparison', similarity: 0.95 }], aiClicheCount: 0,
    genericParagraphCount: 1, overallAssessment: 'Repeated opening.', rewriteInstructions: 'Use a different opening.' };
  llm._providers.claude = async () => ({ text: JSON.stringify(verdict), truncated: false, stopReason: 'end_turn' });
  const actual = await checker.checkOriginality({ title: 'Fixture', body: 'A **shipping supervisor** checks\n the shift’s record.' },
    [{ title: 'Real comparison', body: quote }]);
  assert.deepEqual(actual, verdict);
});

test('Cloud originality requests schema-constrained output from the same fast reviewer', async () => {
  const verdict = { pass: true, score: 92, flaggedSentences: [], selfPlagiarismFlags: [],
    aiClicheCount: 0, genericParagraphCount: 0, overallAssessment: 'Original public draft.', rewriteInstructions: null };
  llm._providers.claude = async (tier, _system, _user, budget, options) => ({
    text: tier === 'fast' && budget >= 4096 && options?.schema?.additionalProperties === false
      && options.schema.required.includes('selfPlagiarismFlags') ? JSON.stringify(verdict) : '{invalid JSON}',
    truncated: false, stopReason: 'end_turn',
  });
  assert.deepEqual(await checker.checkOriginality({ title: 'Fixture', body: 'Public draft.', wordCount: 2 }, []), verdict);
  llm._providers.claude = async () => ({ text: JSON.stringify(verdict), truncated: false, stopReason: 'refusal' });
  await assert.rejects(checker.checkOriginality({ title: 'Fixture', body: 'Public draft.' }, []), /end_turn/);
});

test('diagnostic classification preserves an unexpected original exception', async () => {
  const original = { message: 123 };
  await assert.rejects(checker.checkOriginality({ get title() { throw original; } }, []), error => error === original);
  assert.deepEqual(checker.failureDetails(original), { stage: 'comparison-context', category: 'unexpected-failure' });
});
