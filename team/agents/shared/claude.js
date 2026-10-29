const {
  LLM_PROVIDERS,
  CLAUDE_API_KEY,
  CLAUDE_MODEL,
  CLAUDE_MODEL_FAST,
  GEMINI_API_KEY,
  GEMINI_TEXT_MODEL,
  GEMINI_TEXT_MODEL_FAST,
  OPENAI_API_KEY,
  OPENAI_TEXT_MODEL,
  OPENAI_TEXT_MODEL_FAST,
} = require("./config");

// Every agent reaches the model through this file, so the provider switch lives here.
// LLM_PROVIDERS=openai,gemini (see config.js) tries each provider in order and falls back
// to the next when one fails; "main" is the writing model, "fast" the helpers.

const RETRY_DELAY = 10000;
const MAX_RETRIES = 3;

const KEYS = { claude: CLAUDE_API_KEY, gemini: GEMINI_API_KEY, openai: OPENAI_API_KEY };
const KEY_NAMES = { claude: "CLAUDE_API_KEY", gemini: "GEMINI_API_KEY", openai: "OPENAI_API_KEY" };

let anthropicClient = null;
let geminiClient = null;

function readyProviders() {
  return LLM_PROVIDERS.filter((p) => KEYS[p] && providers[p]);
}

function hasLLMKey() {
  return readyProviders().length > 0;
}

function requireKey() {
  if (hasLLMKey()) return;
  const names = LLM_PROVIDERS.map((p) => KEY_NAMES[p] || `${p} (unknown provider)`).join(" or ");
  throw new Error(`${names} is not set (LLM_PROVIDERS=${LLM_PROVIDERS.join(",")}) — add it to team/.env`);
}

/** One line per configured text provider: set or missing, never the key itself. */
function providerSummary() {
  return LLM_PROVIDERS.map((p) => `${p}: ${KEYS[p] ? "key set" : "key missing, skipped"}`).join("; ");
}

async function callClaude(tier, systemPrompt, userMessage, maxTokens) {
  if (!anthropicClient) {
    const Anthropic = require("@anthropic-ai/sdk");
    anthropicClient = new Anthropic({ apiKey: CLAUDE_API_KEY });
  }
  const response = await anthropicClient.messages.create({
    model: tier === "fast" ? CLAUDE_MODEL_FAST : CLAUDE_MODEL,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });
  const text = response.content.find((b) => b.type === "text")?.text || "";
  return { text, truncated: response.stop_reason === "max_tokens" };
}

async function callGemini(tier, systemPrompt, userMessage, maxTokens) {
  if (!geminiClient) {
    const { GoogleGenAI } = require("@google/genai");
    geminiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  const response = await geminiClient.models.generateContent({
    model: tier === "fast" ? GEMINI_TEXT_MODEL_FAST : GEMINI_TEXT_MODEL,
    contents: userMessage,
    config: {
      systemInstruction: systemPrompt,
      maxOutputTokens: withThinkingRoom(maxTokens),
    },
  });
  const finishReason = response.candidates?.[0]?.finishReason;
  const text = response.text || "";
  if (!text && finishReason && finishReason !== "STOP") {
    throw new Error(`Gemini returned no text (finishReason: ${finishReason})`);
  }
  return { text, truncated: finishReason === "MAX_TOKENS" };
}

// Reasoning models count their hidden thinking against the output limit, so a short
// answer can be cut off. Give them room well above the size of the answer itself.
function withThinkingRoom(maxTokens) {
  return Math.max(maxTokens * 4, 16384);
}

async function callOpenAI(tier, systemPrompt, userMessage, maxTokens) {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: tier === "fast" ? OPENAI_TEXT_MODEL_FAST : OPENAI_TEXT_MODEL,
      instructions: systemPrompt,
      input: userMessage,
      max_output_tokens: withThinkingRoom(maxTokens),
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(`OpenAI ${res.status}: ${data.error?.message || res.statusText}`);
    err.status = res.status;
    throw err;
  }
  const text = (data.output || [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content || [])
    .filter((part) => part.type === "output_text")
    .map((part) => part.text)
    .join("");
  const truncated = data.status === "incomplete" && data.incomplete_details?.reason === "max_output_tokens";
  if (!text && !truncated) throw new Error(`OpenAI returned no text (status: ${data.status || "unknown"})`);
  return { text, truncated };
}

// Tests replace entries here to stand in for the real APIs.
const providers = { claude: callClaude, gemini: callGemini, openai: callOpenAI };

function isRetryable(err) {
  const status = err.status || err.code;
  return (
    status === 429 ||
    status === 500 ||
    status === 503 ||
    status === 529 ||
    /overloaded|unavailable|rate limit/i.test(err.message || "")
  );
}

async function callWithRetries(call, tier, systemPrompt, userMessage, maxTokens) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await call(tier, systemPrompt, userMessage, maxTokens);
    } catch (err) {
      if (attempt === MAX_RETRIES || !isRetryable(err)) throw err;
      await new Promise((r) => setTimeout(r, RETRY_DELAY * attempt));
    }
  }
}

/**
 * One model call: each configured provider with a key in turn, retrying transient
 * errors, moving to the next provider when one fails (no credits, bad key, outage).
 * @returns {Promise<{text: string, truncated: boolean}>}
 */
async function callLLM(tier, systemPrompt, userMessage, maxTokens) {
  requireKey();
  const failures = [];
  for (const name of readyProviders()) {
    try {
      return await callWithRetries(providers[name], tier, systemPrompt, userMessage, maxTokens);
    } catch (err) {
      failures.push(`${name}: ${err.message}`);
      console.warn(`[llm] ${name} failed (${err.message})${failures.length < readyProviders().length ? ", trying the next provider" : ""}`);
    }
  }
  throw new Error(`Every text provider failed — ${failures.join(" | ")}`);
}

// A reply cut off at the token limit is an error for prose: publishing half an
// article is worse than failing the run. JSON callers keep the repair path below.
async function callText(tier, systemPrompt, userMessage, maxTokens) {
  const { text, truncated } = await callLLM(tier, systemPrompt, userMessage, maxTokens);
  if (truncated) {
    throw new Error(`Model reply was cut off at the ${maxTokens}-token limit`);
  }
  return text;
}

async function callJSON(tier, systemPrompt, userMessage, maxTokens) {
  const { text } = await callLLM(tier, systemPrompt, userMessage, maxTokens);
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return repairJSON(cleaned);
}

/**
 * Call the writing model with a system prompt and user message.
 * @returns {Promise<string>} The text response.
 */
async function claudeCall(systemPrompt, userMessage, maxTokens = 4096) {
  return callText("main", systemPrompt, userMessage, maxTokens);
}

/**
 * Attempt to repair truncated JSON by closing open structures.
 */
function repairJSON(str) {
  try { return JSON.parse(str); } catch { /* needs repair */ }

  // Extract JSON object/array — strip any text before/after
  let s = str;
  const jsonStart = s.search(/[\[{]/);
  if (jsonStart > 0) s = s.slice(jsonStart);

  // Find where the top-level JSON ends and strip trailing text
  let depth = 0, inStr = false, endPos = -1;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '"' && (i === 0 || s[i - 1] !== '\\')) { inStr = !inStr; continue; }
    if (inStr) continue;
    if (s[i] === '{' || s[i] === '[') depth++;
    if (s[i] === '}' || s[i] === ']') { depth--; if (depth === 0) { endPos = i; break; } }
  }
  if (endPos > 0) {
    s = s.slice(0, endPos + 1);
    try { return JSON.parse(s); } catch { /* still broken, continue repair */ }
  }

  // Trim trailing incomplete string/value
  s = s.replace(/,\s*$/, "").replace(/,\s*"[^"]*$/, "");

  // Close open strings
  const quoteCount = (s.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) s += '"';

  // Close open brackets/braces
  const opens = [];
  inStr = false;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '"' && (i === 0 || s[i - 1] !== '\\')) { inStr = !inStr; continue; }
    if (inStr) continue;
    if (s[i] === '{' || s[i] === '[') opens.push(s[i]);
    if (s[i] === '}' || s[i] === ']') opens.pop();
  }
  while (opens.length) {
    const open = opens.pop();
    s += open === '{' ? '}' : ']';
  }

  return JSON.parse(s);
}

/**
 * Call the writing model and parse the response as JSON.
 * Strips markdown fences if present. Repairs truncated JSON.
 */
async function claudeJSON(systemPrompt, userMessage, maxTokens = 4096) {
  return callJSON("main", systemPrompt, userMessage, maxTokens);
}

/**
 * Call the fast model for routine tasks.
 */
async function claudeCallFast(systemPrompt, userMessage, maxTokens = 4096) {
  return callText("fast", systemPrompt, userMessage, maxTokens);
}

/**
 * Call the fast model and parse the response as JSON.
 */
async function claudeJSONFast(systemPrompt, userMessage, maxTokens = 4096) {
  return callJSON("fast", systemPrompt, userMessage, maxTokens);
}

module.exports = { claudeCall, claudeJSON, claudeCallFast, claudeJSONFast, hasLLMKey, providerSummary, LLM_PROVIDER: LLM_PROVIDERS[0], _providers: providers };
