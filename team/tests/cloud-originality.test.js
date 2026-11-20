require('./helpers/env');
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
