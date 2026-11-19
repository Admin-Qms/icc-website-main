// Prints which text and image providers a scheduled run will use, and whether each
// one's key is present, so a missing or broken key shows up at the top of the run log.
// Never prints a key value.
const config = require("../agents/shared/config");
const { providerSummary } = require("../agents/shared/claude");

const IMAGE_KEYS = { openai: config.OPENAI_API_KEY, gemini: config.GEMINI_API_KEY, pexels: config.PEXELS_API_KEY };

console.log(`Claude review models: main=${config.CLAUDE_MODEL}; fast=${config.CLAUDE_MODEL_FAST}`);
console.log(`Text providers: ${providerSummary()}`);
console.log(
  `Image providers: ${config.IMAGE_PROVIDERS.map((p) => `${p}: ${!(p in IMAGE_KEYS) ? "no key needed" : IMAGE_KEYS[p] ? "key set" : "key missing, skipped"}`).join("; ")}`
);
if (config.CLOUD_ROUTINE && !config.CLAUDE_API_KEY) {
  console.error('MISSING_CLAUDE_REVIEW_KEY: configure CLAUDE_API_KEY before running the cloud routine');
  process.exitCode = 1;
}
