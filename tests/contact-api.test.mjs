import assert from "node:assert/strict";
import test from "node:test";
import contact from "../api/contact.ts";

const endpoint = "https://isocertificationconsultants.ca/api/contact";
const enquiry = { name: "Jordan Smith", email: "delivered@resend.dev", company: "Example Ltd.", standard: "ISO 9001", message: "Please help scope our certification." };
let nextIp = 1;
function request(body = enquiry, headers = {}, method = "POST") {
  return new Request(endpoint, { method, headers: { "content-type": "application/json", "x-vercel-forwarded-for": `192.0.2.${nextIp++}`, ...headers }, ...(method !== "GET" ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}) });
}
function configured(t) {
  for (const [key, value] of Object.entries({ RESEND_API_KEY: "test-resend-key", CONTACT_FROM_EMAIL: "ICC <website@isocertificationconsultants.ca>" })) {
    const previous = process.env[key];
    process.env[key] = value;
    t.after(() => { if (previous === undefined) delete process.env[key]; else process.env[key] = previous; });
  }
  t.mock.method(console, "info", () => {});
  t.mock.method(console, "warn", () => {});
}

test("only sends valid enquiries to the fixed recipient, with the visitor as reply-to", async (t) => {
  configured(t);
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    assert.equal(options.headers.Authorization, "Bearer test-resend-key");
    const email = JSON.parse(options.body);
    assert.deepEqual(email.to, ["anthony.mannella@isocertificationconsultants.ca"]);
    assert.equal(email.reply_to, enquiry.email);
    assert.equal(email.from, process.env.CONTACT_FROM_EMAIL);
    assert.match(email.subject, /ISO 9001.*Example Ltd/);
    assert.ok(email.text.includes(enquiry.message));
    return Response.json({ id: "test-email-id" });
  });
  const response = await contact.fetch(request());
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
});

test("identical retries reuse idempotency keys, edited enquiries get a new key", async (t) => {
  configured(t);
  const keys = [];
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    keys.push(options.headers["Idempotency-Key"]);
    return Response.json({ id: "test-email-id" });
  });
  await contact.fetch(request());
  await contact.fetch(request());
  await contact.fetch(request({ ...enquiry, message: "A different enquiry" }));
  assert.match(keys[0], /^contact\/[a-f0-9]{64}$/);
  assert.equal(keys[0], keys[1]);
  assert.notEqual(keys[0], keys[2]);
});

test("phone is optional and a supplied callback number is included in the notification", async (t) => {
  configured(t);
  const messages = [];
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    messages.push(JSON.parse(options.body));
    return Response.json({ id: "test-email-id" });
  });
  for (const phone of [undefined, "", "+1 (416) 622-0022 ext. 123"]) {
    assert.equal((await contact.fetch(request({ ...enquiry, phone }))).status, 200);
  }
  assert.match(messages[0].text, /Phone: Not provided/);
  assert.match(messages[1].text, /Phone: Not provided/);
  assert.ok(messages[2].text.includes("Phone: +1 (416) 622-0022 ext. 123"));
  assert.equal(messages[2].reply_to, enquiry.email);
  assert.deepEqual(messages[2].to, ["anthony.mannella@isocertificationconsultants.ca"]);
});

test("rejects invalid callback numbers before sending", async (t) => {
  configured(t);
  const send = t.mock.method(globalThis, "fetch", () => { throw new Error("Must not send"); });
  for (const phone of [12345, "x".repeat(41), "123\r\nBcc: other@example.com"]) {
    assert.equal((await contact.fetch(request({ ...enquiry, phone }))).status, 400);
  }
  assert.equal(send.mock.callCount(), 0);
});

test("rejects invalid fields, header injection and recipient overrides before calling Resend", async (t) => {
  configured(t);
  const send = t.mock.method(globalThis, "fetch", () => { throw new Error("Must not send"); });
  for (const body of [null, [], "{bad json", { ...enquiry, name: " " }, { ...enquiry, email: "invalid" }, { ...enquiry, email: "a@example.com\r\nBcc: b@example.com" }, { ...enquiry, company: "a\nb" }, { ...enquiry, message: "x".repeat(5001) }, { ...enquiry, standard: "invented" }, { ...enquiry, to: "other@example.com" }]) {
    assert.equal((await contact.fetch(request(body))).status, 400);
  }
  assert.equal(send.mock.callCount(), 0);
});

test("blocks cross-origin requests, non-JSON, non-POST and oversized streaming bodies", async () => {
  assert.equal((await contact.fetch(request(enquiry, { origin: "https://other.example" }))).status, 403);
  assert.equal((await contact.fetch(request(enquiry, { "content-type": "text/plain" }))).status, 415);
  assert.equal((await contact.fetch(request(enquiry, {}, "GET"))).status, 405);
  assert.equal((await contact.fetch(request("x".repeat(24001)))).status, 413);
});

test("honeypot submissions never send email", async (t) => {
  configured(t);
  const send = t.mock.method(globalThis, "fetch", () => { throw new Error("Must not send"); });
  assert.equal((await contact.fetch(request({ ...enquiry, botcheck: "on" }))).status, 200);
  assert.equal(send.mock.callCount(), 0);
});

test("missing credentials fail with an email fallback", async (t) => {
  configured(t);
  delete process.env.RESEND_API_KEY;
  const response = await contact.fetch(request());
  assert.equal(response.status, 503);
  assert.match((await response.json()).error, /email the team/);
});

test("provider rejection, malformed responses and connection failures never show success or leak secrets", async (t) => {
  configured(t);
  const logs = [];
  t.mock.method(console, "warn", (entry) => logs.push(entry));
  for (const provider of [
    async () => Response.json({ message: "secret provider details" }, { status: 403 }),
    async () => Response.json({}),
    async () => new Response("invalid JSON"),
    async () => { throw new Error("test-resend-key"); },
  ]) {
    const stub = t.mock.method(globalThis, "fetch", provider);
    const response = await contact.fetch(request());
    assert.equal(response.status, 502);
    assert.doesNotMatch(await response.text(), /secret provider details|test-resend-key/);
    stub.mock.restore();
  }
  assert.doesNotMatch(JSON.stringify(logs), /secret provider details|test-resend-key|Jordan|delivered@/);
});

test("rate limits repeated enquiries from the same client", async (t) => {
  configured(t);
  t.mock.method(globalThis, "fetch", async () => Response.json({ id: "test-email-id" }));
  const headers = { "x-vercel-forwarded-for": "198.51.100.22" };
  for (let i = 0; i < 5; i++) assert.equal((await contact.fetch(request(enquiry, headers))).status, 200);
  const response = await contact.fetch(request(enquiry, headers));
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get("retry-after")) > 0);
});

test("a missing request type is sent as a demo request", async (t) => {
  configured(t);
  let email;
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    email = JSON.parse(options.body);
    return Response.json({ id: "test-email-id" });
  });
  assert.equal((await contact.fetch(request())).status, 200);
  assert.match(email.subject, /^Demo request — ISO 9001 — Example Ltd\.$/);
  assert.ok(email.text.includes("Request: Demo"));
});

test("consultation and assessment requests are labelled in the subject", async (t) => {
  configured(t);
  const subjects = [];
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    subjects.push(JSON.parse(options.body).subject);
    return Response.json({ id: "test-email-id" });
  });
  await contact.fetch(request({ ...enquiry, request: "consultation" }));
  await contact.fetch(request({ ...enquiry, request: "assessment" }));
  assert.ok(subjects[0].startsWith("Consultation request — "));
  assert.ok(subjects[1].startsWith("Assessment request — "));
});

test("an unknown request type is rejected", async (t) => {
  configured(t);
  const send = t.mock.method(globalThis, "fetch", () => { throw new Error("Must not send"); });
  assert.equal((await contact.fetch(request({ ...enquiry, request: "pricing" }))).status, 400);
  assert.equal(send.mock.callCount(), 0);
});
