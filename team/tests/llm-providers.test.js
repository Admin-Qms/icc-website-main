// The text-provider order and fallback in agents/shared/claude.js, with stand-ins
// for the APIs. No keys, no network.
require("./helpers/env");

const { test } = require("node:test");
const assert = require("node:assert/strict");

function loadLLM(env) {
  Object.assign(process.env, { LLM_PROVIDER: "", LLM_PROVIDERS: "openai,gemini", OPENAI_API_KEY: "test-openai", GEMINI_API_KEY: "test-gemini" }, env);
  for (const mod of ["../agents/shared/config", "../agents/shared/claude"]) delete require.cache[require.resolve(mod)];
  return require("../agents/shared/claude");
}

function fail(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

test("OpenAI answers first when it works", async () => {
  const llm = loadLLM();
  const calls = [];
  llm._providers.openai = async () => (calls.push("openai"), { text: "from openai", truncated: false });
  llm._providers.gemini = async () => (calls.push("gemini"), { text: "from gemini", truncated: false });
  assert.equal(await llm.claudeCallFast("system", "user", 512), "from openai");
  assert.deepEqual(calls, ["openai"]);
});

test("Gemini answers when OpenAI fails", async () => {
  const llm = loadLLM();
  const calls = [];
  llm._providers.openai = async () => { calls.push("openai"); throw fail(402, "out of credits"); };
  llm._providers.gemini = async () => (calls.push("gemini"), { text: '{"ok":true}', truncated: false });
  assert.deepEqual(await llm.claudeJSON("system", "user", 512), { ok: true });
  assert.deepEqual(calls, ["openai", "gemini"]);
});

test("a provider without a key is skipped", async () => {
  const llm = loadLLM({ OPENAI_API_KEY: "" });
  const calls = [];
  llm._providers.openai = async () => (calls.push("openai"), { text: "from openai", truncated: false });
  llm._providers.gemini = async () => (calls.push("gemini"), { text: "from gemini", truncated: false });
  assert.equal(await llm.claudeCall("system", "user", 512), "from gemini");
  assert.deepEqual(calls, ["gemini"]);
  assert.match(llm.providerSummary(), /openai: key missing, skipped; gemini: key set/);
  assert.doesNotMatch(llm.providerSummary(), /test-gemini/, "the summary never prints a key");
});

test("the error names every provider when all of them fail", async () => {
  const llm = loadLLM();
  llm._providers.openai = async () => { throw fail(401, "bad key"); };
  llm._providers.gemini = async () => { throw fail(402, "prepayment credits are depleted"); };
  await assert.rejects(llm.claudeCall("system", "user", 512), /openai: bad key \| gemini: prepayment credits are depleted/);
});

test("no key for any provider is a clear error", async () => {
  const llm = loadLLM({ OPENAI_API_KEY: "", GEMINI_API_KEY: "" });
  assert.equal(llm.hasLLMKey(), false);
  await assert.rejects(llm.claudeCall("system", "user", 512), /OPENAI_API_KEY or GEMINI_API_KEY is not set/);
});

test("the older single LLM_PROVIDER setting still works", async () => {
  const llm = loadLLM({ LLM_PROVIDERS: "", LLM_PROVIDER: "gemini" });
  const calls = [];
  llm._providers.openai = async () => (calls.push("openai"), { text: "from openai", truncated: false });
  llm._providers.gemini = async () => (calls.push("gemini"), { text: "from gemini", truncated: false });
  assert.equal(await llm.claudeCall("system", "user", 512), "from gemini");
  assert.deepEqual(calls, ["gemini"]);
});

test("OpenAI requests leave room for thinking and read the reply text", async (t) => {
  const llm = loadLLM({ OPENAI_TEXT_MODEL: "main-model", OPENAI_TEXT_MODEL_FAST: "fast-model" });
  const bodies = [];
  t.mock.method(globalThis, "fetch", async (url, init) => {
    assert.equal(url, "https://api.openai.com/v1/responses");
    bodies.push(JSON.parse(init.body));
    return new Response(JSON.stringify({
      status: "completed",
      output: [
        { type: "reasoning", summary: [] },
        { type: "message", content: [{ type: "output_text", text: "the answer" }] },
      ],
    }), { status: 200 });
  });
  assert.equal(await llm.claudeCall("system", "user", 2048), "the answer");
  assert.equal(await llm.claudeCallFast("system", "user", 8192), "the answer");
  assert.deepEqual(bodies.map((b) => [b.model, b.max_output_tokens]), [["main-model", 16384], ["fast-model", 32768]]);
  assert.equal(bodies[0].instructions, "system");
  assert.equal(bodies[0].input, "user");
});

test("an OpenAI reply cut off at the limit is reported, not published", async (t) => {
  const llm = loadLLM({ GEMINI_API_KEY: "" });
  t.mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({
    status: "incomplete",
    incomplete_details: { reason: "max_output_tokens" },
    output: [{ type: "message", content: [{ type: "output_text", text: "half an ans" }] }],
  }), { status: 200 }));
  await assert.rejects(llm.claudeCall("system", "user", 512), /cut off at the 512-token limit/);
});

test('a truncated review JSON cannot be repaired into approval', async () => {
  const llm = loadLLM({ LLM_PROVIDERS: 'claude', CLAUDE_API_KEY: 'test-review' });
  llm._providers.claude = async () => ({ text: '{"findings":[]}', truncated: true });
  await assert.rejects(llm.claudeJSONFast('review', 'draft', 512), /cut off|truncated/i);
});

test('incomplete review JSON cannot be repaired into approval', async () => {
  const llm = loadLLM({ LLM_PROVIDERS: 'claude', CLAUDE_API_KEY: 'test-review' });
  llm._providers.claude = async () => ({ text: '{"findings":[]', truncated: false });
  await assert.rejects(llm.claudeJSONFast('review', 'draft', 512), /JSON|Expected|position|end/i);
});

test('cloud routines keep Claude reviews independent even with other provider keys present', async () => {
  const llm = loadLLM({ ICC_CLOUD_ROUTINE: '1', LLM_PROVIDERS: 'openai,gemini', CLAUDE_API_KEY: '' });
  try {
    assert.equal(llm.hasLLMKey(), false, 'other providers cannot substitute for the required Claude reviewer');
    await assert.rejects(llm.claudeJSONFast('review', 'draft', 512), /CLAUDE_API_KEY/);
  } finally { delete process.env.ICC_CLOUD_ROUTINE; }
});

test('Claude JSON schema reaches the real SDK transport while ordinary JSON and text requests stay unchanged', async t => {
  const llm = loadLLM({ LLM_PROVIDERS: 'claude', CLAUDE_API_KEY: 'test-schema-only' });
  const bodies = [];
  t.mock.method(globalThis, 'fetch', async (input, init) => {
    const request = new Request(input, init);
    assert.equal(new URL(request.url).pathname, '/v1/messages');
    bodies.push(await request.json());
    return new Response(JSON.stringify({ id: 'fixture', type: 'message', role: 'assistant', model: 'main-review-model', content: [{ type: 'text', text: '{"ok":true}' }], stop_reason: 'end_turn', stop_sequence: null, usage: { input_tokens: 1, output_tokens: 1 } }), { status: 200, headers: { 'content-type': 'application/json' } });
  });
  const schema = { type: 'object', properties: { ok: { type: 'boolean' } }, required: ['ok'], additionalProperties: false };
  assert.deepEqual(await llm.claudeJSON('review system', 'review body', 8192, { schema }), { ok: true });
  await llm.claudeJSON('ordinary system', 'ordinary body', 512);
  await llm.claudeCallFast('edit system', 'edit body', 2048);
  assert.deepEqual(bodies[0], { model: 'claude-sonnet-4-6', max_tokens: 8192, system: 'review system', messages: [{ role: 'user', content: 'review body' }], output_config: { format: { type: 'json_schema', schema } } });
  assert.deepEqual(bodies[1], { model: 'claude-sonnet-4-6', max_tokens: 512, system: 'ordinary system', messages: [{ role: 'user', content: 'ordinary body' }] });
  assert.deepEqual(bodies[2], { model: 'claude-haiku-4-5-20251001', max_tokens: 2048, system: 'edit system', messages: [{ role: 'user', content: 'edit body' }] });
});

test('schema-bound JSON still rejects truncation, malformed replies and refusal without repair or new requests', async t => {
  const llm = loadLLM({ LLM_PROVIDERS: 'claude', CLAUDE_API_KEY: 'test-schema-refusal' });
  const schema = { type: 'object', properties: { ok: { type: 'boolean' } }, required: ['ok'], additionalProperties: false };
  const replies = [
    { text: '{"ok":true}', stop_reason: 'max_tokens', error: /cut off/ },
    { text: '{"ok":', stop_reason: 'end_turn', error: /JSON|Expected|end/i },
    { text: 'I cannot provide that review.', stop_reason: 'refusal', error: /end_turn/i },
  ];
  let requests = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    const reply = replies[requests++];
    assert.ok(reply, 'invalid model output must not trigger a repair request');
    return new Response(JSON.stringify({ id: 'fixture', type: 'message', role: 'assistant', model: 'claude-sonnet-4-6', content: [{ type: 'text', text: reply.text }], stop_reason: reply.stop_reason, stop_sequence: null, usage: { input_tokens: 1, output_tokens: 1 } }), { status: 200, headers: { 'content-type': 'application/json' } });
  });
  for (const reply of replies) await assert.rejects(llm.claudeJSON('review', 'body', 8192, { schema }), reply.error);
  assert.equal(requests, 3);
});

test('schema-bound verdicts require end_turn even when a refused or incomplete reply contains valid passing JSON', async t => {
  const llm = loadLLM({ LLM_PROVIDERS: 'claude', CLAUDE_API_KEY: 'test-schema-stop' });
  const schema = { type: 'object', properties: { pass: { type: 'boolean' } }, required: ['pass'], additionalProperties: false };
  const reasons = ['refusal', 'pause_turn', 'stop_sequence', 'tool_use', undefined];
  let requests = 0;
  t.mock.method(globalThis, 'fetch', async () => {
    const stop_reason = reasons[requests++ % reasons.length];
    return new Response(JSON.stringify({ id: 'fixture', type: 'message', role: 'assistant', model: 'claude-sonnet-4-6', content: [{ type: 'text', text: '{"pass":true}' }], stop_reason, stop_sequence: null, usage: { input_tokens: 1, output_tokens: 1 } }), { status: 200, headers: { 'content-type': 'application/json' } });
  });
  for (const reason of reasons) await assert.rejects(llm.claudeJSON('review', 'body', 8192, { schema }), /end_turn|completion|stop reason/i, `refuse stop reason ${reason}`);
  assert.equal(requests, reasons.length, 'invalid completions do not trigger retry or repair requests');
  assert.deepEqual(await llm.claudeJSON('legacy', 'body', 512), { pass: true }, 'ordinary JSON callers retain their previous stop-reason handling');
  assert.equal(requests, reasons.length + 1);
});
