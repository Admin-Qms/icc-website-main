import { createHash } from "node:crypto";
import { SITE, STANDARDS } from "../lib/site.ts";

const MAX_BODY_BYTES = 24_000;
const WINDOW_MS = 10 * 60_000;
const REQUEST_LABELS: Record<string, string> = { demo: "Demo", consultation: "Consultation", assessment: "Assessment" };
// Best-effort per-instance protection; Vercel Firewall can enforce a shared limit.
const clients = new Map<string, { count: number; resetAt: number }>();

function json(body: Record<string, unknown>, status = 200, headers = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function retryAfter(ip: string) {
  const now = Date.now();
  for (const [key, entry] of clients) if (entry.resetAt <= now) clients.delete(key);
  const entry = clients.get(ip);
  if (!entry) {
    if (clients.size >= 10_000) return 60;
    clients.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return 0;
  }
  entry.count++;
  return entry.count > 5 ? Math.ceil((entry.resetAt - now) / 1000) : 0;
}

async function readBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Invalid body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("Too large");
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

function field(data: Record<string, unknown>, name: string, max: number, optional = false) {
  const value = data[name];
  if (optional && (value === undefined || value === "")) return "";
  if (typeof value !== "string" || !value.trim() || value.length > max) throw new Error("Invalid field");
  if (name !== "message" && /[\r\n\x00-\x1f\x7f]/.test(value)) throw new Error("Invalid field");
  return value.trim();
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "POST") return json({ error: "Method not allowed." }, 405, { Allow: "POST" });
    const origin = request.headers.get("origin");
    if (origin) {
      try {
        if (new URL(origin).host !== new URL(request.url).host) return json({ error: "Cross-site requests are not allowed." }, 403);
      } catch {
        return json({ error: "Invalid origin." }, 400);
      }
    }
    const wait = retryAfter(request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "unknown");
    if (wait) return json({ error: "Too many enquiries. Please try again later or email the team." }, 429, { "Retry-After": String(wait) });
    if (!request.headers.get("content-type")?.startsWith("application/json")) return json({ error: "Send JSON." }, 415);
    if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) return json({ error: "Enquiry is too long." }, 413);

    let enquiry: { name: string; email: string; phone: string; company: string; standard: string; request: string; message: string };
    try {
      const parsed = await readBody(request);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Invalid body");
      const data = parsed as Record<string, unknown>;
      // A filled honeypot gets a harmless acknowledgement, without sending email.
      if (data.botcheck) return json({ success: true });
      if (Object.keys(data).some((key) => !["name", "email", "phone", "company", "standard", "request", "message", "botcheck"].includes(key))) throw new Error("Invalid fields");
      enquiry = {
        name: field(data, "name", 100),
        email: field(data, "email", 254),
        phone: field(data, "phone", 40, true),
        company: field(data, "company", 160),
        standard: field(data, "standard", 80, true),
        request: field(data, "request", 20, true) || "demo",
        message: field(data, "message", 5000),
      };
      if (!Object.hasOwn(REQUEST_LABELS, enquiry.request)) throw new Error("Invalid request");
      if (!/^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(enquiry.email)) throw new Error("Invalid email");
      if (enquiry.standard && enquiry.standard !== "not-sure" && !STANDARDS.some((standard) => standard.code === enquiry.standard)) throw new Error("Invalid standard");
    } catch (error) {
      return error instanceof Error && error.message === "Too large"
        ? json({ error: "Enquiry is too long." }, 413)
        : json({ error: "Please check your name, email, company and message." }, 400);
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;
    if (!apiKey || !from) return json({ error: "Online enquiries are being set up. Please email the team directly." }, 503);

    const standard = enquiry.standard === "not-sure" ? "Not sure yet" : enquiry.standard || "Not selected";
    const requestLabel = REQUEST_LABELS[enquiry.request];
    const email = {
      from,
      to: [SITE.email],
      reply_to: enquiry.email,
      subject: `${requestLabel} request — ${standard} — ${enquiry.company}`,
      text: [
        `New enquiry from ${SITE.url}/contact/`,
        `Name: ${enquiry.name}`,
        `Email: ${enquiry.email}`,
        `Phone: ${enquiry.phone || "Not provided"}`,
        `Company: ${enquiry.company}`,
        `Request: ${requestLabel}`,
        `Standard: ${standard}`,
        "",
        enquiry.message,
      ].join("\n"),
    };
    // Identical retries reuse Resend's result for 24 hours, including after timeouts.
    const idempotencyKey = `contact/${createHash("sha256").update(JSON.stringify(email)).digest("hex")}`;
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
        body: JSON.stringify(email),
        signal: AbortSignal.timeout(12_000),
      });
      const result = await response.json() as { id?: string };
      if (!response.ok || typeof result.id !== "string" || !result.id) {
        console.warn(JSON.stringify({ event: "contact_provider_failure", status: response.status }));
        return json({ error: "The message could not be sent. Please try again or email the team." }, 502);
      }
      console.info(JSON.stringify({ event: "contact_sent", emailId: result.id }));
      return json({ success: true });
    } catch {
      console.warn(JSON.stringify({ event: "contact_provider_unavailable" }));
      return json({ error: "The message could not be sent. Please try again or email the team." }, 502);
    }
  },
};
