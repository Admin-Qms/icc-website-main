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
