# Website chatbot operations

The public widget at `components/ChatWidget.tsx` calls `POST /api/chat`. The site remains a Next.js static export; the endpoint is a separate Vercel Function in `api/chat.ts`, with `content/chatbot-context.md` bundled into it. The cPanel static-export backup cannot serve this endpoint. Confirm that Vercel includes and routes the function on a preview deployment before enabling the chat in production.

For local testing, run `npm run dev`. Its custom development server mounts the same chat handler at `/api/chat` alongside Next.js and loads `.env.local` through Next. It uses port 3000 by default, or accepts `--port`. If that port is occupied, it exits with an error instead of silently moving to another port. Do not use `next dev` directly for chat testing: the plain Next server does not serve the separate Vercel Function. Stop the development server before running `npm run build`, since both write to `.next`.

The widget keeps at most five completed question-and-answer exchanges in this browser's local storage and restores them after a reload. History expires 30 minutes after the latest completed reply; a reload does not extend that window. The widget clears expired history while open or on the next visit. Visitors can clear it from the chat header. Follow-up requests include short summaries of those exchanges as untrusted user-role context; the server still rejects client-supplied `assistant` and `system` roles. No transcript database or cross-device history is used.

Chat links are limited to the exact public routes in `lib/chatLinks.ts`, built from the current standards, industries, modules, and overview pages. Invalid model-generated links display as plain text instead of opening a 404 page. Keep this allowlist aligned with the site's static routes when adding a new page.

## Configuration

- Keep `"type": "module"` in the root `package.json`: the chat function compiles to ES-module JavaScript. Without this declaration, Vercel can load `api/chat.js` as CommonJS and fail at startup with `Cannot use import statement outside a module`. `npm run test:chat` includes a compiled-JavaScript syntax check that catches this mismatch.
- Set `GROQ_API_KEY` as a **server-side** environment variable in the Vercel project and in an ignored local `.env.local` for local function testing. Never use `NEXT_PUBLIC_` for this key or commit it.
- The selected model is Groq's `openai/gpt-oss-120b` through `groq-sdk`. The context file is the sole curated public knowledge file. Update it when service or module claims change and review it against `lib/site.ts`.
- The public contact email and phone come from `SITE` in `lib/site.ts`, not the form's Web3Forms receiving inbox.
- Until the key is configured, the endpoint returns 503 and the widget offers the public contact details.

## Request safeguards

- Requests are same-origin browser requests, JSON only, with exact body and message fields. Only `user` messages are accepted; client-supplied `system` or forged `assistant` messages are rejected. Earlier visitor questions provide follow-up context.
- Incoming bodies are capped at 20 KB while streaming. A conversation has at most 12 messages, each at most 1,200 characters, and at most 6,000 characters in total.
- The model has a 20-second timeout, no automatic retries, a 650-token completion cap, and at most 12 concurrent calls per warm function instance.
- A warm instance accepts eight requests per IP per minute. This is a **local safeguard, not a distributed rate limit**; serverless instances do not share memory.
- The model returns strict JSON with an `in_scope` flag. The server replaces off-topic replies with a fixed refusal and rejects malformed responses. This reduces unrelated answers but cannot guarantee perfect intent classification until tested with real model responses.
- The endpoint has no database access, SQL query construction, or transcript storage. SQL-shaped input is only text sent to the model. Do not add persistence or SQL access without parameterized queries and a new review.

## Launch gate

Before production traffic, set a Vercel Firewall rate-limit rule for `/api/chat` at the edge and a project spend limit. A starting rule is eight requests per IP per minute, adjusted after observing legitimate use. Vercel's managed rate-limiting custom rules currently require Pro or Enterprise; if the project does not have one, select another shared edge limiter before enabling paid model calls. The in-process limiter is insufficient for a distributed denial-of-service attack.

Test an actual Groq response with the configured key for: a standards question, a module question, a contact request, an off-topic question, a role-injection attempt, and a long request. Check the function's deployment, rate-limit behavior, response latency, and cost in Vercel before releasing. Do not log submitted message text or the API key.
