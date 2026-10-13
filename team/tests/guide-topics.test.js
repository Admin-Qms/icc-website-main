const { test } = require('node:test'); const assert = require('node:assert/strict');
const topics = require('../agents/content/keywordResearcher');
const queue = [{ id: 'document-control', topic: 'Document control software', aliases: ['Document Control'], approval: 'approved', priority: 1 }, { id: 'supplier-quality', topic: 'Supplier quality software', approval: 'approved', priority: 2 }, { id: 'audit-workflows', topic: 'Audit software', approval: 'approved', priority: 3 }];
test('topic selection excludes published and reserved entries', () => {
  assert.ok(topics); assert.equal(topics.selectGuideTopic({ queue, publishedTopicIds: new Set(['document-control']), reservedTopicIds: new Set(['supplier-quality']) }).id, 'audit-workflows');
});
test('explicit topic aliases are normalized without substituting a different subject', () => {
  assert.ok(topics); assert.equal(topics.selectGuideTopic({ queue, topicText: '  DOCUMENT CONTROL ' }).id, 'document-control');
  assert.throws(() => topics.selectGuideTopic({ queue, topicText: 'Payroll automation' }), /approved|unknown/i);
});
test('unapproved topics and exhausted queues cannot be selected', () => {
  assert.ok(topics); assert.equal(topics.selectGuideTopic({ queue: queue.map(q => ({ ...q, approval: 'candidate' })) }), null);
});
test('the shared researcher produces software queries and primary-source targets', () => {
  assert.equal(typeof topics.guideResearchQueries, 'function');
  const queries = topics.guideResearchQueries({ topic: 'Document control software', primaryKeyword: 'document control software', moduleSlugs: ['document-control'] });
  assert.ok(queries.some(q => q.query.includes('document control software') && q.purpose === 'workflow'));
  assert.ok(queries.some(q => q.domains.includes('iso.org')));
  assert.ok(queries.some(q => q.domains.includes('isocertificationconsultants.ca')));
});
