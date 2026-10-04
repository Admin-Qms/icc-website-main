const { claudeCallFast } = require("../shared/claude");
const { log } = require("../shared/logger");
const { updateHeartbeat } = require("../shared/heartbeat");

const SYSTEM_PROMPT = `You are a senior copy editor with 30 years experience editing technical B2B content for North American manufacturing and compliance publications. You operate at an IQ of 148 (top 0.1% of cognitive ability) — bringing exceptional analytical depth, first-principles reasoning, and pattern recognition that far exceeds industry norms. Your outputs reflect genius-level precision, insight, and strategic thinking. You enforce grammar, spelling, and style strictly for North American English (US/Canadian).

SPELLING RULES — Always use North American English spelling:
"colour" → "color", "neighbour" → "neighbor", "analyse" → "analyze", "recognise" → "recognize", "labour" → "labor", "behaviour" → "behavior", "centre" → "center", "defence" → "defense", "organisation" → "organization", "licence" (noun) → "license", "programme" → "program", "metre" → "meter", "litre" → "liter", "catalogue" → "catalog", "cheque" → "check", "grey" → "gray", "favour" → "favor", "honour" → "honor", "specialise" → "specialize", "minimise" → "minimize", "optimise" → "optimize"

NO EXCEPTIONS — Even in ISO context, use North American spelling. "Organization" not "organisation". "Analyze" not "analyse".

GRAMMAR RULES:
- Subject-verb agreement
- Consistent tense throughout article
- No dangling modifiers
- No sentence fragments (max 1 intentional per article for emphasis)
- Correct pronoun references
- Parallel structure in lists and headings

STYLE RULES:
- Oxford comma always: "ISO 9001, 14001, and 45001"
- Numbers: spell out one through nine, numerals for 10 and above. Exception: always numerals for percentages (98%), ISO numbers, years (2026), measurements (50mm)
- ISO formatting: always "ISO 9001" never "iso 9001" or "ISO9001"
- H1, H2: Title Case. H3 and below: Sentence case
- Abbreviations: spell out first use "Quality Management System (QMS)" then abbreviation only after

PASSIVE VOICE:
Max 2 passive voice sentences per 500 words. Rewrite others:
"The audit was conducted" → "The team conducted the audit"

CONSISTENCY:
- Always "ISO Certification Consultant" never "ISO Certification Consultant"
- Always "Book your free consultation"
- No first person anywhere: no "we", "our", "us", "I" or "my". Refer to the company as "ISO Certification Consultant" and address the reader as "you". Rewrite any first-person sentence you find.

READABILITY:
- Flag sentences over 35 words — split them
- Flag paragraphs over 4 sentences — split them
- No jargon without explanation on first use

CRITICAL — PRESERVE THESE ELEMENTS EXACTLY (do NOT remove, rewrite, or change):
- ALL markdown links: [text](/path) and [text](https://url) — keep every link intact
- ALL [IMAGE:] markers — preserve exactly as written, including the description
- ALL callout boxes (> **Important:**, > **Did You Know?**, > **Key Consideration:**)
- ALL bold formatting (**text**)
- ALL heading hierarchy (## and ###) — never add an H1 ("# ") heading`;

// Below this share of words kept in order, the reply is a rewrite, not a copy-edit.
const MIN_SIMILARITY = 0.85;

/** Share of words the two texts have in common, in order (longest common subsequence). */
function wordSimilarity(a, b) {
  const x = String(a).split(/\s+/).filter(Boolean);
  const y = String(b).split(/\s+/).filter(Boolean);
  if (!x.length || !y.length) return 0;
  let prev = new Uint32Array(y.length + 1);
  for (let i = 1; i <= x.length; i++) {
    const cur = new Uint32Array(y.length + 1);
    for (let j = 1; j <= y.length; j++) {
      cur[j] = x[i - 1] === y[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  return (2 * prev[y.length]) / (x.length + y.length);
}

function skipped(body, notes) {
  return {
    correctedContent: body,
    spellingFixes: 0,
    grammarFixes: 0,
    styleViolations: 0,
    passiveVoiceFixed: 0,
    totalCorrections: 0,
    overallGrade: "pass",
    notes,
  };
}

// The corrected article comes back as plain Markdown, not inside a JSON string:
// wrapped in JSON, a 2,000-word article overran the model's output limit and the
// truncated result was always thrown away. `totalCorrections` is 1 when the text
// changed, 0 when it did not; the per-category counts are no longer available.
async function checkGrammar(article) {
  log("grammarAgent", "check", `checking: ${article.title || "untitled"}`);

  const body = article.body || "";
  if (!body || body.length < 100) {
    log("grammarAgent", "skip", "article body is empty or too short");
    return skipped(body, "Skipped — body too short");
  }

  const { countWords } = require("../shared/contentStore");
  const linksBefore = (body.match(/\[([^\]]+)\]\([^)]+\)/g) || []).length;
  const imagesBefore = (body.match(/\[IMAGE:[^\]]+\]/g) || []).length;
  const wordsBefore = countWords(body);

  try {
    const result = await claudeCallFast(
      SYSTEM_PROMPT,
      `Copy-edit the following article with the MINIMUM edits: fix spelling, grammar, punctuation and the style rules above. Do not rephrase sentences that are already correct, do not change the author's tone or word choice, do not shorten or expand anything. A sentence with no error is returned unchanged.

CRITICAL: Preserve ALL markdown links [text](url), ALL [IMAGE:] markers, all headings, callouts and bold phrases exactly as they appear.

Return ONLY the full corrected article as markdown. No JSON, no code fences, no preamble, no notes.

ARTICLE TITLE: ${article.title}
ARTICLE BODY:
${body}`,
      12288
    );

    const corrected = result.replace(/^```(?:markdown|md)?\n([\s\S]*?)\n```$/m, "$1").trim();
    const linksAfter = (corrected.match(/\[([^\]]+)\]\([^)]+\)/g) || []).length;
    const imagesAfter = (corrected.match(/\[IMAGE:[^\]]+\]/g) || []).length;
    const wordsAfter = countWords(corrected);

    // A reply that lost links or markers, shrank, or rewrote the article instead of
    // correcting it is not a copy-edit; keep the original.
    const similarity = wordSimilarity(body, corrected);
    if (linksAfter < linksBefore - 1 || imagesAfter < imagesBefore - 1 || wordsAfter < wordsBefore * 0.95 || similarity < MIN_SIMILARITY) {
      log("grammarAgent", "rollback", `reply dropped ${linksBefore - linksAfter} links, ${imagesBefore - imagesAfter} images, ${wordsBefore - wordsAfter} words; ${Math.round(similarity * 100)}% of words kept — using original body`);
      updateHeartbeat("grammarAgent", "failed", "rollback");
      return skipped(body, "Grammar reply rejected: it dropped links, markers or text");
    }

    const changed = corrected !== body.trim();
    log("grammarAgent", "result", changed ? `corrections applied (${wordsBefore} → ${wordsAfter} words)` : "no changes");
    updateHeartbeat("grammarAgent", "complete", changed ? "corrected" : "unchanged");

    return {
      correctedContent: changed ? corrected : body,
      spellingFixes: 0,
      grammarFixes: 0,
      styleViolations: 0,
      passiveVoiceFixed: 0,
      totalCorrections: changed ? 1 : 0,
      overallGrade: "pass",
      notes: "",
    };
  } catch (err) {
    log("grammarAgent", "error", err.message);
    updateHeartbeat("grammarAgent", "error", err.message);
    return skipped(body, `Grammar check skipped: ${err.message}`);
  }
}

module.exports = { checkGrammar, wordSimilarity };
