const Anthropic = require("@anthropic-ai/sdk");
const { CLAUDE_API_KEY, CLAUDE_MODEL, CLAUDE_MODEL_FAST } = require("./config");

const client = new Anthropic({ apiKey: CLAUDE_API_KEY });

const RETRY_DELAY = 10000;
const MAX_RETRIES = 3;

/**
 * Call Claude with a system prompt and user message.
 * Retries up to 3 times on transient errors.
 * @returns {Promise<string>} The text response from Claude.
 */
async function claudeCall(systemPrompt, userMessage, maxTokens = 4096) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      });
      return response.content[0].text;
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      const isRetryable =
        err.status === 500 ||
        err.status === 529 ||
        err.message?.includes("overloaded");
      if (!isRetryable) throw err;
      await new Promise((r) => setTimeout(r, RETRY_DELAY * attempt));
    }
  }
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
 * Call Claude and parse the response as JSON.
 * Strips markdown fences if present. Repairs truncated JSON.
 */
async function claudeJSON(systemPrompt, userMessage, maxTokens = 4096) {
  const raw = await claudeCall(systemPrompt, userMessage, maxTokens);
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return repairJSON(cleaned);
}

/**
 * Call Claude Haiku for routine/fast tasks.
 * Same retry logic as claudeCall but uses the fast model.
 */
async function claudeCallFast(systemPrompt, userMessage, maxTokens = 4096) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await client.messages.create({
        model: CLAUDE_MODEL_FAST,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      });
      return response.content[0].text;
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      const isRetryable =
        err.status === 500 ||
        err.status === 529 ||
        err.message?.includes("overloaded");
      if (!isRetryable) throw err;
      await new Promise((r) => setTimeout(r, RETRY_DELAY * attempt));
    }
  }
}

/**
 * Call Claude Haiku and parse the response as JSON.
 */
async function claudeJSONFast(systemPrompt, userMessage, maxTokens = 4096) {
  const raw = await claudeCallFast(systemPrompt, userMessage, maxTokens);
  const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return repairJSON(cleaned);
}

module.exports = { claudeCall, claudeJSON, claudeCallFast, claudeJSONFast };
