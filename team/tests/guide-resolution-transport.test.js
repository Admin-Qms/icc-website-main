require('./helpers/env');
process.env.CLAUDE_API_KEY = 'offline-schema-test';
const { test } = require('node:test'); const assert = require('node:assert/strict');
const llm = require('../agents/shared/claude');
const { chapterResolution } = require('../agents/content/guideChapterResolution');
test('the production chapter resolution schema crosses the SDK boundary using supported Claude constraints', async t => {
  const protocol = chapterResolution({ findings: [{ reason: 'First' }, { reason: 'Second' }, { reason: 'Third' }] }, { body: 'Literal current-page evidence.' }, { sources: [] });
  const result = { previousFindingDecisions: [0, 1, 2].map(index => ({ index, verdict: 'clear', reason: 'The current page resolves the issue.', evidenceIds: ['page:paragraph:0'] })) };
  t.mock.method(globalThis, 'fetch', async (input, init) => {
    const request = new Request(input, init); const body = await request.json();
    const check = schema => {
      if (!schema || typeof schema !== 'object') return;
      for (const [key, value] of Object.entries(schema)) {
        assert.ok(!['minimum', 'maximum', 'minLength', 'maxLength', 'maxItems'].includes(key), `unsupported Claude constraint: ${key}`);
        if (key === 'minItems') assert.ok(value === 0 || value === 1, 'unsupported Claude minItems');
        if (value && typeof value === 'object') { if (Array.isArray(value)) value.forEach(check); else check(value); }
      }
    };
    check(body.output_config.format.schema);
    return new Response(JSON.stringify({ id: 'fixture', type: 'message', role: 'assistant', model: 'claude-sonnet-4-6', content: [{ type: 'text', text: JSON.stringify(result) }], stop_reason: 'end_turn', stop_sequence: null, usage: { input_tokens: 1, output_tokens: 1 } }), { status: 200, headers: { 'content-type': 'application/json' } });
  });
  const actual = await llm.claudeJSON('Review current evidence', 'Three prior findings', 8192, { schema: { type: 'object', additionalProperties: false, properties: { previousFindingDecisions: protocol.property }, required: ['previousFindingDecisions'] } });
  assert.equal(protocol.validate(actual).decisions.length, 3);
});
