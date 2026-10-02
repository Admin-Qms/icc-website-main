const {
  LLM_PROVIDER,
  CLAUDE_API_KEY,
  CLAUDE_MODEL,
  CLAUDE_MODEL_FAST,
  GEMINI_API_KEY,
  GEMINI_TEXT_MODEL,
  GEMINI_TEXT_MODEL_FAST,
} = require("./config");

// Every agent reaches the model through this file, so the provider switch lives here.
// LLM_PROVIDER=claude|gemini (see config.js); "main" is the writing model, "fast" the helpers.

const RETRY_DELAY = 10000;
const MAX_RETRIES = 3;

let anthropicClient = null;
let geminiClient = null;

function hasLLMKey() {
  return LLM_PROVIDER === "gemini" ? Boolean(GEMINI_API_KEY) : Boolean(CLAUDE_API_KEY);
}

function requireKey() {
  if (hasLLMKey()) return;
  const name = LLM_PROVIDER === "gemini" ? "GEMINI_API_KEY" : "CLAUDE_API_KEY";
  throw new Error(`${name} is not set (LLM_PROVIDER=${LLM_PROVIDER}) — add it to team/.env`);
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
      // Gemini counts its thinking against this limit, so leave headroom above the answer size.
      maxOutputTokens: Math.max(maxTokens * 2, 8192),
    },
  });
  const finishReason = response.candidates?.[0]?.finishReason;
  const text = response.text || "";
  if (!text && finishReason && finishReason !== "STOP") {
    throw new Error(`Gemini returned no text (finishReason: ${finishReason})`);
  }
  return { text, truncated: finishReason === "MAX_TOKENS" };
}

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

/**
 * One model call with retries on transient errors.
 * @returns {Promise<{text: string, truncated: boolean}>}
 */
async function callLLM(tier, systemPrompt, userMessage, maxTokens) {
  requireKey();
  const call = LLM_PROVIDER === "gemini" ? callGemini : callClaude;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await call(tier, systemPrompt, userMessage, maxTokens);
    } catch (err) {
      if (attempt === MAX_RETRIES || !isRetryable(err)) throw err;
      await new Promise((r) => setTimeout(r, RETRY_DELAY * attempt));
    }
  }
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

module.exports = { claudeCall, claudeJSON, claudeCallFast, claudeJSONFast, hasLLMKey, LLM_PROVIDER };
