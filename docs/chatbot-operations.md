# Website chatbot operations

The public widget at `components/ChatWidget.tsx` calls `POST /api/chat/` (the canonical trailing-slash URL, avoiding a redirect). The site remains a Next.js static export; the endpoint is a separate Vercel Function in `api/chat.ts`, with `content/chatbot-context.md` bundled into it. The cPanel static-export backup cannot serve this endpoint. Confirm that Vercel includes and routes the function on a preview deployment before enabling the chat in production.

For local testing, run `npm run dev`. Its custom development server mounts the same chat handler at `/api/chat` alongside Next.js and loads `.env.local` through Next. It uses port 3000 by default, or accepts `--port`. If that port is occupied, it exits with an error instead of silently moving to another port. Do not use `next dev` directly for chat testing: the plain Next server does not serve the separate Vercel Function. Stop the development server before running `npm run build`, since both write to `.next`.

The widget keeps at most five completed question-and-answer exchanges in this browser's local storage and restores them after a reload. History expires 30 minutes after the latest completed reply; a reload does not extend that window. The widget clears expired history while open or on the next visit. Visitors can clear it from the chat header. Follow-up requests include short summaries of those exchanges as untrusted user-role context; the server still rejects client-supplied `assistant` and `system` roles. No transcript database or cross-device history is used.

Chat links are limited to the exact public routes in `lib/chatLinks.ts`, built from the current standards, industries, modules, and overview pages. Invalid model-generated links display as plain text instead of opening a 404 page. Keep this allowlist aligned with the site's static routes when adding a new page.

## Recovery and interaction

- Failed questions stay in the open conversation and return to the composer unless a visitor has already started a different draft. **Try again** resends the failed question without duplicating it or overwriting a different draft. Failed questions are held in memory, not persisted across a page reload.
- The browser stops a stalled request after 25 seconds. The API's provider timeout is 20 seconds. Errors use plain language, and 429 responses include a retry delay that disables sending until the cooldown ends. There is no automatic resend.
- On screens below 640px, the dialog contains keyboard focus, makes the underlying page inert, and prevents background scrolling. Escape or either collapse control returns focus to the Chat button. Desktop chat permits interaction with the rest of the page.
- The composer grows from 40px to 120px and shows its 1,200-character limit at 1,000 characters. Enter sends, Shift+Enter inserts a line, and Enter during IME composition does not submit.
- New answers scroll to their beginning. If the visitor scrolls up while waiting, their position is kept and **View new reply** appears. The visible transcript may temporarily show six exchanges; it is trimmed when the visitor next sends, so a new reply cannot remove an exchange they are reading. Storage and model context remain limited to five. Mobile height follows the visual viewport, with safe-area padding and a 16px input font to avoid iOS focus zoom.
- The existing identity, portrait and contact layout are unchanged, as requested.

## Configuration

- Keep `"type": "module"` in the root `package.json`: the chat function compiles to ES-module JavaScript. Without this declaration, Vercel can load `api/chat.js` as CommonJS and fail at startup with `Cannot use import statement outside a module`.
- Keep TypeScript at version 5.7 or newer and `rewriteRelativeImportExtensions` enabled in `tsconfig.json`. The function's `.ts` imports must become `.js` imports in the deployed output. `npm run test:chat` compiles the handler and its local dependencies, then loads and invokes that JavaScript to catch module-format and missing-import failures.
- Set `GROQ_API_KEY` as a **server-side** environment variable in the Vercel project and in an ignored local `.env.local` for local function testing. Never use `NEXT_PUBLIC_` for this key or commit it.
- The selected model is Groq's `openai/gpt-oss-120b` through `groq-sdk`. The context file is the sole curated public knowledge file. Update it when service or module claims change and review it against `lib/site.ts`.
- The public contact email and phone come from `SITE` in `lib/site.ts`, not the form's Web3Forms receiving inbox.
- Until the key is configured, the endpoint returns 503 and the widget offers the public contact details.

## Request safeguards

- Requests are same-origin browser requests, JSON only, with exact body and message fields. Only `user` messages are accepted; client-supplied `system` or forged `assistant` messages are rejected. Earlier visitor questions provide follow-up context.
- Incoming bodies are capped at 20 KB while streaming. A conversation has at most 12 messages, each at most 1,200 characters, and at most 6,000 characters in total.
- History excerpts are budgeted after JSON escaping, so multiline text, quotation marks and control characters cannot inflate a normal five-exchange follow-up beyond the API limits.
- The model has a 20-second timeout, no automatic retries, a 650-token completion cap, and at most 12 concurrent calls per warm function instance.
- A warm instance accepts eight requests per IP per minute. This is a **local safeguard, not a distributed rate limit**; serverless instances do not share memory.
- A provider 429 starts a cooldown on that warm instance using Groq's `Retry-After` header (30 seconds if missing or invalid). The widget receives the delay. Other instances may still call Groq; this does not replace a shared limiter.
- GPT-OSS requests use `include_reasoning: false`, rather than `reasoning_format`, in accordance with [Groq's reasoning documentation](https://console.groq.com/docs/reasoning).
- Operational warnings distinguish provider rate limits, timeouts, other failures and local concurrency limits. They contain model, status and bounded quota metadata only; never raw provider errors, message text, replies, IP addresses or API keys.
- The model returns strict JSON with an `in_scope` flag. The server replaces off-topic replies with a fixed refusal and rejects malformed responses. This reduces unrelated answers but cannot guarantee perfect intent classification until tested with real model responses.
- The endpoint has no database access, SQL query construction, or transcript storage. SQL-shaped input is only text sent to the model. Do not add persistence or SQL access without parameterized queries and a new review.

## Launch gate

Before increasing production traffic, configure a shared rate limiter covering both `/api/chat` and `/api/chat/`, and review spending controls in both Vercel and Groq. A starting rule is eight requests per IP per minute, adjusted after observing legitimate use. [Vercel's managed rate-limiting custom rules](https://vercel.com/docs/vercel-firewall/vercel-waf/usage-and-pricing) require Pro or Enterprise; if the project does not have one, select another shared limiter before enabling paid model calls. The in-process limiter is insufficient for a distributed denial-of-service attack. A Vercel spending limit does not cap a separate Groq bill; approve the provider budget independently.

Test an actual Groq response with the configured key for: a standards question, a module question, a contact request, an off-topic question, a role-injection attempt, and a long request. Check the function's deployment, rate-limit behavior, response latency, and cost in Vercel before releasing. Do not log submitted message text or the API key.

## Verification (2026-10-08)

- The signed-in Vercel project is `your-qms/yourqms`, on Hobby, serving `isocertificationconsultants.ca`. Its production logs show successful requests and intermittent 429s. A failed request at 03:17:11 IST was allowed by the firewall and made an external call to Groq before returning 429, confirming a provider rejection rather than the API's early local rate-limit check.
- Groq's signed-in metrics also showed 200 and 429 responses for `openai/gpt-oss-120b`. Exact organization quotas, billing limits and the Vercel custom firewall configuration remain unverified: those settings pages returned blank content to browser automation. The owner then requested finishing the code and leaving account settings for later. No account plan, paid limit or environment variable was changed.
- Changes require a deployment before they affect the live widget. Existing production logs predate the new operational warnings.
- No physical phone was connected; the device inventory contained simulators only. Test Safari on iPhone and Chrome on Android with the software keyboard open, portrait/landscape rotation, the safe-area inset, and zoom before marking real-device checks complete.

Run `npm run test:chat` for API, compiled-module, request, history, response-formatting and client-recovery regressions. Run `npm run build` for production compilation, type checking and static export.

For browser regressions, install Python Playwright and Chrome, build the site, then serve `out/` on port 3017 in a separate terminal:

```sh
python3 -m http.server 3017 --directory out --bind 127.0.0.1
```

Run `python3 tests/chat-widget.test.py` (or set `CHAT_TEST_URL` for another local port). API responses are intercepted; these checks make no model calls. They cover retry without duplicate questions, preservation of a new draft on timeout, retry cooldowns, mobile focus restoration, composer growth, long-answer scrolling, uninterrupted reading, and layout across phone/tablet/desktop sizes.
