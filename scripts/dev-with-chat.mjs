import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { Readable } from "node:stream";
import next from "next";
import chat from "../api/chat.ts";
import productionConfig from "../next.config.mjs";
import { developmentConfig } from "./development-config.mjs";
import contact from "../api/contact.ts";

// Review comments pinned with components/DevComments.tsx, kept in a git-ignored file.
const COMMENTS_FILE = new URL("../.dev-comments.json", import.meta.url);
const COMMENT_FIELDS = ["page", "selector", "tag", "text", "ox", "oy", "x", "y", "viewport", "comment"];

async function readComments() {
  try {
    return JSON.parse(await readFile(COMMENTS_FILE, "utf8"));
  } catch {
    return [];
  }
}

async function devComments(req, res, url) {
  const send = (status, body) => {
    res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
    res.end(JSON.stringify(body));
  };
  const comments = await readComments();
  if (req.method === "GET") return send(200, comments);
  if (req.method === "DELETE") {
    const id = url.searchParams.get("id");
    await writeFile(COMMENTS_FILE, JSON.stringify(comments.filter((c) => c.id !== id), null, 2));
    return send(200, { ok: true });
  }
  if (req.method !== "POST") return send(405, { error: "Method not allowed." });
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 20_000) return send(413, { error: "Too large." });
  }
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return send(400, { error: "Send JSON." });
  }
  if (typeof data?.comment !== "string" || !data.comment.trim()) return send(400, { error: "Comment is empty." });
  const entry = { id: randomUUID(), createdAt: new Date().toISOString(), status: "open" };
  for (const key of COMMENT_FIELDS) entry[key] = data[key];
  comments.push(entry);
  await writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2));
  return send(201, entry);
}

function requestedPort() {
  const args = process.argv.slice(2);
  const flag = args.findIndex((arg) => arg === "--port" || arg === "-p");
  const value = flag >= 0 ? args[flag + 1] : process.env.PORT || "3000";
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("Provide a valid port with --port or PORT.");
  }
  return port;
}

async function listen(server, port, host) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.removeListener("error", reject);
      resolve();
    });
  });
}

// Bind the same dual-stack address family as `next dev`, so an old Next
// server on localhost cannot coexist on this port and shadow /api/chat.
const host = "::";
const port = requestedPort();
const server = createServer();

try {
  await listen(server, port, host);
} catch (error) {
  if (error?.code === "EADDRINUSE") {
    throw new Error(`Port ${port} is already in use. Stop the other preview or run npm run dev -- --port <free-port>. The chat preview will not switch ports silently.`);
  }
  throw error;
}

try {
  const app = next({ dev: true, hostname: "localhost", port, conf: developmentConfig(productionConfig) });
  await app.prepare();
  const handle = app.getRequestHandler();

  server.on("request", async (req, res) => {
    const url = new URL(req.url || "/", `http://${req.headers.host || `${host}:${port}`}`);
    const endpoint = url.pathname.replace(/\/$/, "");
    if (endpoint === "/__dev/comments") return devComments(req, res, url);
    const api = endpoint === "/api/chat" ? chat : endpoint === "/api/contact" ? contact : null;
    if (api) {
      try {
        const headers = new Headers();
        for (const [name, value] of Object.entries(req.headers)) {
          if (Array.isArray(value)) value.forEach((item) => headers.append(name, item));
          else if (value !== undefined) headers.set(name, value);
        }
        const method = req.method || "GET";
        const hasBody = method !== "GET" && method !== "HEAD";
        const request = new Request(url, {
          method,
          headers,
          ...(hasBody ? { body: Readable.toWeb(req), duplex: "half" } : {}),
        });
        const response = await api.fetch(request);
        res.writeHead(response.status, Object.fromEntries(response.headers));
        res.end(await response.text());
      } catch {
        res.writeHead(500, { "Content-Type": "application/json", "Cache-Control": "no-store" });
        res.end(JSON.stringify({ error: "The service is temporarily unavailable." }));
      }
      return;
    }
    await handle(req, res);
  });

  console.log(`Local site, chat and contact form ready at http://localhost:${port}`);
} catch (error) {
  server.close();
  throw error;
}
