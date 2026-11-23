require('./helpers/env');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs'); const path = require('node:path');
const { root } = require('./helpers/env');
const config = require('../agents/shared/config');
const queue = path.join(root, 'keywords.json');
fs.writeFileSync(queue, JSON.stringify({ queue: ['iso 17025 measurement uncertainty requirements'] }));
config.KEYWORD_QUEUE_PATH = queue;
let replies = [];
const api = require('../agents/shared/claude');
api.claudeCallFast = async () => JSON.stringify(replies.shift());
const { pickKeyword } = require('../agents/content/keywordResearcher');
const valid = () => ({ primaryKeyword: 'iso 17025 measurement uncertainty requirements', title: 'ISO 17025 Measurement Uncertainty Requirements for Testing Labs', metaDescription: 'Review ISO 17025 measurement uncertainty requirements, build supported uncertainty budgets, and check testing records before accreditation review.' });
test('an invalid model meta description is rejected before it can become a fixed assignment', async () => {
  const bad = { ...valid(), metaDescription: 'ISO 17025 measurement uncertainty requirements guide. Essential checklist for testing labs establishing uncertainty budgets and maintaining accreditation compliance.' };
  assert.equal(bad.metaDescription.length, 165);
  replies = [bad, valid()];
  const result = await pickKeyword();
  assert.equal(result.metaDescription, valid().metaDescription);
});
test('invalid metadata cannot escape after the bounded keyword retries', async () => {
  replies = [{ ...valid(), metaDescription: 'Too short' }, { ...valid(), metaDescription: 'Too short' }];
  await assert.rejects(pickKeyword(), /meta description/i);
});
test('a description missing the primary topic is rejected before freezing', async () => {
  const bad = { ...valid(), metaDescription: 'Review manufacturing documentation, assign operational responsibilities, and maintain controlled records for a practical quality management system.' };
  replies = [bad, valid()];
  assert.equal((await pickKeyword()).metaDescription, valid().metaDescription);
});

test('country US and labeled Class I metadata retain the canonical voice exceptions', async () => {
  const allowed = { ...valid(), metaDescription: 'Review ISO 17025 measurement uncertainty requirements for US testing labs, including Class I device examples and supported calibration records.' };
  replies = [allowed, valid()];
  assert.equal((await pickKeyword()).metaDescription, allowed.metaDescription);
});
test('actual first-person metadata is rejected before freezing', async () => {
  replies = [{ ...valid(), metaDescription: 'We review ISO 17025 measurement uncertainty requirements, supported budgets and calibration records for testing laboratories and accreditation.' }, valid()];
  assert.equal((await pickKeyword()).metaDescription, valid().metaDescription);
});
