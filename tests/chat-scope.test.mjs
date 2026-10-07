import assert from "node:assert/strict";
import test from "node:test";
import { acceptScopedAnswer, OUT_OF_SCOPE_REPLY } from "../lib/chatScope.ts";

test("off-topic model output is replaced by a fixed refusal", () => {
  assert.equal(acceptScopedAnswer(JSON.stringify({ in_scope: false, answer: "Here is a recipe." })), OUT_OF_SCOPE_REPLY);
});

test("in-scope model output is returned", () => {
  assert.equal(acceptScopedAnswer(JSON.stringify({ in_scope: true, answer: "The Standards module tracks clauses." })), "The Standards module tracks clauses.");
});

test("accepts a bounded multi-part answer without dropping the conversation", () => {
  const answer = "A".repeat(3000);
  assert.equal(acceptScopedAnswer(JSON.stringify({ in_scope: true, answer })), answer);
  assert.throws(() => acceptScopedAnswer(JSON.stringify({ in_scope: true, answer: "A".repeat(5001) })));
});

test("malformed or empty model output fails closed", () => {
  assert.throws(() => acceptScopedAnswer("not json"));
  assert.throws(() => acceptScopedAnswer(JSON.stringify({ in_scope: true, answer: "" })));
});
