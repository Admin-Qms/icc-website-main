import { createServer } from "node:http";
import { Readable } from "node:stream";
import next from "next";
import chat from "../api/chat.ts";

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
  const app = next({ dev: true, hostname: "localhost", port });
  await app.prepare();
  const handle = app.getRequestHandler();

  server.on("request", async (req, res) => {
    const url = new URL(req.url || "/", `http://${req.headers.host || `${host}:${port}`}`);
    if (url.pathname === "/api/chat" || url.pathname === "/api/chat/") {
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
        const response = await chat.fetch(request);
        res.writeHead(response.status, Object.fromEntries(response.headers));
        res.end(await response.text());
      } catch {
        res.writeHead(500, { "Content-Type": "application/json", "Cache-Control": "no-store" });
        res.end(JSON.stringify({ error: "Chat is temporarily unavailable." }));
      }
      return;
    }
    await handle(req, res);
  });

  console.log(`Local site and chat ready at http://localhost:${port}`);
} catch (error) {
  server.close();
  throw error;
}
