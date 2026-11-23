require('./helpers/env');
process.env.ICC_CLOUD_ROUTINE = '1'; process.env.CLAUDE_API_KEY = 'offline-review-fixture';
const { test } = require('node:test'); const assert = require('node:assert/strict');
const llm = require('../agents/shared/claude'); const checker = require('../agents/content/plagiarismChecker');
const verdict = extra => ({ score: 82, pass: false, flaggedSentences: [], selfPlagiarismFlags: [], aiClicheCount: 0, genericParagraphCount: 1, overallAssessment: 'The cited paragraph needs a distinct operational decision.', rewriteInstructions: 'Rewrite the cited paragraph.', ...extra });
const article = { title: 'Fixture', primaryKeyword: 'quality', body: '## Process review\n\nThe **shift owner** checks the record.\n\nA second paragraph explains the action.\n' };
test('Cloud originality resolves an exact supplied passage ID without asking the model to reconstruct a quote', async () => {
  let received;
  llm._providers.claude = async (_tier, _system, user, _budget, options) => {
    received = { user, schema: options.schema };
    return { text: JSON.stringify(verdict({ flaggedSentences: [{ evidenceId: 'article:paragraph:1', reason: 'Generic decision.', suggestion: 'Describe the acceptance decision.' }] })), truncated: false, stopReason: 'end_turn' };
  };
  const result = await checker.checkOriginality(article, []);
  assert.equal(result.pass, false); assert.equal(result.score, 82);
  assert.equal(result.flaggedSentences[0].text, 'The **shift owner** checks the record.\n\n');
  assert.deepEqual(received.schema.properties.flaggedSentences.items.properties.evidenceId.enum, ['article:paragraph:0', 'article:paragraph:1', 'article:paragraph:2']);
  assert.ok(received.user.includes('article:paragraph:1'));
});
test('Cloud self-plagiarism preserves a genuine failure and derives the current text from its ID', async () => {
  llm._providers.claude = async () => ({ text: JSON.stringify(verdict({ selfPlagiarismFlags: [{ evidenceId: 'article:paragraph:1', similarTo: 'Prior article', similarity: 0.95 }] })), truncated: false, stopReason: 'end_turn' });
  const result = await checker.checkOriginality(article, [{ title: 'Prior article', body: 'The shift owner checks the record.' }]);
  assert.equal(result.pass, false); assert.equal(result.selfPlagiarismFlags[0].text, 'The **shift owner** checks the record.\n\n');
});
for (const kind of ['unknown-id', 'missing-id', 'hybrid-text']) test(`Cloud originality rejects ${kind} instead of substituting or dropping evidence`, async () => {
  const flag = kind === 'unknown-id' ? { evidenceId: 'article:paragraph:99', reason: 'Problem', suggestion: 'Correct' } : kind === 'missing-id' ? { text: 'The shift owner checks the record.', reason: 'Problem', suggestion: 'Correct' } : { evidenceId: 'article:paragraph:1', text: 'Invented quote', reason: 'Problem', suggestion: 'Correct' };
  llm._providers.claude = async () => ({ text: JSON.stringify(verdict({ flaggedSentences: [flag] })), truncated: false, stopReason: 'end_turn' });
  await assert.rejects(checker.checkOriginality(article, []), /evidence|verdict/i);
});
test('evidence IDs are rebuilt per article and no passage bytes are omitted', async () => {
  const seen = [];
  llm._providers.claude = async (_tier, _system, user, _budget, options) => {
    seen.push({ ids: options.schema.properties.flaggedSentences.items.properties.evidenceId?.enum, user });
    return { text: JSON.stringify(verdict({ score: 92, pass: true })), truncated: false, stopReason: 'end_turn' };
  };
  await checker.checkOriginality(article, []);
  await checker.checkOriginality({ ...article, body: 'Only the new article.' }, []);
  assert.deepEqual(seen[1].ids, ['article:paragraph:0']);
  assert.ok(!seen[1].user.includes('The **shift owner**'));
  const firstCatalog = JSON.parse(seen[0].user.split('ARTICLE BODY:\n')[1].split('\nEND ARTICLE EVIDENCE')[0]);
  assert.equal(firstCatalog.map(p => p.text).join(''), article.body);
});

test('image-only paragraphs stay in the full catalog but cannot be cited as reader-facing evidence', async () => {
  let ids;
  const withImage = { ...article, body: 'First paragraph.\n\n[IMAGE: a manufacturing inspection]\n\nFinal paragraph.' };
  llm._providers.claude = async (_tier, _system, _user, _budget, options) => {
    ids = options.schema.properties.flaggedSentences.items.properties.evidenceId.enum;
    return { text: JSON.stringify(verdict({ flaggedSentences: [{ evidenceId: 'article:paragraph:1', reason: 'Problem', suggestion: 'Correct' }] })), truncated: false, stopReason: 'end_turn' };
  };
  await assert.rejects(checker.checkOriginality(withImage, []), /evidence/i);
  assert.deepEqual(ids, ['article:paragraph:0', 'article:paragraph:2']);
});
