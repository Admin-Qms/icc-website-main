import assert from "node:assert/strict";
import test from "node:test";
import { requestChat } from "../lib/chatClient.ts";

const messages = [{ role: "user", content: "How does ISO 9001 consulting work?" }];

test("connection failures have a useful retry message instead of browser jargon", async (t) => {
  t.mock.method(globalThis, "fetch", async () => { throw new TypeError("Failed to fetch"); });
  await assert.rejects(requestChat(messages), (error) => error.retryable && /connection/i.test(error.message) && !/fetch/i.test(error.message));
});

test("rate limits carry the server retry delay to the widget", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response(JSON.stringify({ error: "busy" }), { status: 429, headers: { "retry-after": "45" } }));
  await assert.rejects(requestChat(messages), (error) => error.retryable && error.retryAfterMs === 45000);
});

test("HTTP-date and malformed Retry-After values remain bounded", async (t) => {
  const mock = t.mock.method(globalThis, "fetch", async () => new Response("", { status: 429, headers: { "retry-after": new Date(Date.now() + 40000).toUTCString() } }));
  await assert.rejects(requestChat(messages), (error) => error.retryAfterMs >= 39000 && error.retryAfterMs <= 40000);
  mock.mock.mockImplementation(async () => new Response("", { status: 429, headers: { "retry-after": "not a date" } }));
  await assert.rejects(requestChat(messages), (error) => error.retryAfterMs === 30000);
});

test("a stalled request stops and becomes retryable", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  t.mock.method(globalThis, "fetch", async (_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
  }));
  const pending = assert.rejects(requestChat(messages), (error) => error.retryable && /too long/i.test(error.message));
  t.mock.timers.tick(30000);
  await pending;
});

test("successful replies survive request serialization", async (t) => {
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    assert.deepEqual(JSON.parse(options.body), { messages });
    return Response.json({ reply: "Start with a gap assessment." });
  });
  assert.equal(await requestChat(messages), "Start with a gap assessment.");
});

test("invalid responses and request validation failures give actionable errors", async (t) => {
  const mock = t.mock.method(globalThis, "fetch", async () => Response.json({ reply: {} }));
  await assert.rejects(requestChat(messages), /could not load/i);
  mock.mock.mockImplementation(async () => new Response("<html>Invalid</html>", { status: 400 }));
  await assert.rejects(requestChat(messages), (error) => !error.retryable && /shorten|new chat/i.test(error.message));
});
