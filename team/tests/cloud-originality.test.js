const { root } = require('./helpers/env');
const { test } = require('node:test');
const assert = require('node:assert/strict');
process.env.ICC_CLOUD_ROUTINE = '1';
process.env.CLAUDE_API_KEY = 'offline-review-fixture';
const llm = require('../agents/shared/claude');
const checker = require('../agents/content/plagiarismChecker');
for (const verdict of [{ pass: 'false', score: 99 }, { pass: true }, { pass: true, score: 10 }, { pass: true, score: 99, flaggedSentences: 'unparsed' }]) {
  test(`originality rejects incomplete or contradictory verdict ${JSON.stringify(verdict)}`, async () => {
    llm._providers.claude = async () => ({ text: JSON.stringify(verdict), truncated: false });
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
  for (const [reply, category] of [['not JSON', 'missing-json'], ['{"pass":', 'missing-json'],
    ['{"pass": nope}', 'invalid-json'], ['{"pass":true,"score":10}', 'invalid-verdict']]) {
    llm._providers.claude = async () => ({ text: reply, truncated: false });
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
  assert.deepEqual(fs.readdirSync(config.CONTENT_DIR), []);
  assert.deepEqual(fs.readdirSync(config.BLOG_IMAGE_DIR), []);
});

test('diagnostic classification preserves an unexpected original exception', async () => {
  const original = { message: 123 };
  await assert.rejects(checker.checkOriginality({ get title() { throw original; } }, []), error => error === original);
  assert.deepEqual(checker.failureDetails(original), { stage: 'comparison-context', category: 'unexpected-failure' });
});
