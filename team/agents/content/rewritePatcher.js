const { claudeCallFast: claudeCall, hasLLMKey } = require("../shared/claude");
const { log } = require("../shared/logger");
const { countWords, extractLinks, normalizeBody, keywordCovered } = require("../shared/contentStore");

/**
 * Targeted rewrite patcher — fixes specific QA failures without regenerating the entire article.
 * Each patch handles one failed check (matched by the check's `id` from contentQA.validateLocal)
 * and changes only what that check needs. Checks about the title or slug are not patchable here;
 * those fail the run.
 */

const BANNED_REPLACEMENTS = {
  "delve into": "examine",
  "it is worth noting": "notably",
  "in conclusion": "to summarize",
  "in today's landscape": "currently",
  "navigating the complexities": "managing the requirements",
  "crucial": "critical",
  "comprehensive": "thorough",
  "landscape": "environment",
  "navigate": "manage",
  "leverage": "use",
  "game-changer": "significant advantage",
  "cutting-edge": "advanced",
  "at the end of the day": "ultimately",
  "it goes without saying": "",
  "needless to say": "",
};

const MIN_WORDS = 1500;
const EXPAND_TARGET = 1750;

function failed(qaResult, ...ids) {
  return (qaResult.checks || []).find((c) => !c.pass && ids.includes(c.id || c.name));
}

/**
 * Analyzes QA failures and applies targeted patches.
 * Returns the patched article (body and, when needed, metaDescription).
 */
async function patchArticle(article, qaResult, context) {
  log("rewritePatcher", "analyzing", `${qaResult.issues?.length || 0} issues to patch`);

  let body = article.body;
  let metaDescription = article.metaDescription;
  const applied = [];
  const llm = hasLLMKey();

  // ── Deterministic fixes first: cheap, and they can't damage the article ──
  if (failed(qaResult, "single-h1", "no-artifacts")) {
    body = normalizeBody(body, article.title);
    applied.push("normalised headings and leftovers");
  }

  if (failed(qaResult, "banned-phrases", "professional-tone", "tone")) {
    body = patchBannedPhrases(body);
    applied.push("banned phrases replaced");
  }

  if (failed(qaResult, "keyword-styling")) {
    const { fixKeywordStyling } = require("./contentQA");
    body = fixKeywordStyling(body, [article.primaryKeyword, ...(article.secondaryKeywords || [])]);
    applied.push("pasted keywords unbolded, standard names capitalized");
  }

  if (failed(qaResult, "spelling")) {
    const { toUSSpelling } = require("./contentQA");
    body = toUSSpelling(body);
    metaDescription = toUSSpelling(metaDescription || "");
    applied.push("US spelling applied");
  }

  // ── Links: drop bad ones, then top up from the offered lists ──
  if (failed(qaResult, "internal-links", "external-links")) {
    const { validateLinks } = require("../seo/linkBuilder");
    body = (await validateLinks({ ...article, body }, context)).body;
    applied.push("links repaired");
  }

  // ── Model-backed rewrites: each returns the whole article and is only
  //    accepted if it kept the links, markers and length ──
  if (llm) {
    const voice = failed(qaResult, "voice");
    if (voice) {
      const patched = await rewriteBody(
        body,
        `Rewrite ONLY the sentences that use first person (we, our, us, I, my) so they use third person or direct address instead. Refer to the company as "ISO Certification Consultant" and to the reader as "you". Flagged passages: ${(voice.violations || []).slice(0, 12).map((v) => `"${v.context}"`).join("; ")}`
      );
      if (patched) {
        body = patched;
        applied.push("first person removed");
      }
    }

    const claims = failed(qaResult, "claims-audit", "fabricated-quotes");
    if (claims) {
      const findings = (qaResult.findings || []).map((f) => `- [${f.rule}] "${f.text}" — ${f.reason}`).join("\n");
      const quoted = (failed(qaResult, "fabricated-quotes")?.violations || []).map((v) => `- [QUOTES] "${v.text}"`).join("\n");
      const patched = await rewriteBody(
        body,
        `Fix ONLY the passages listed below. For each: remove the invented company or person name (describe the business generically, e.g. "a 60-person stamping plant in Windsor"); remove any quotation or reported speech; replace a statistic or dollar figure stated as fact with a hedged general statement, or delete it; make any scenario openly hypothetical by starting its paragraph with "**Illustrative example:**"; delete claims about ISO Certification Consultant's track record; correct a wrong clause reference only if you are certain of the right one, otherwise drop the clause number.\n\nPASSAGES:\n${findings}\n${quoted}`
      );
      if (patched) {
        body = patched;
        applied.push("unsupported claims removed");
      }
    }

    const words = countWords(body);
    if (failed(qaResult, "word-count") && words < MIN_WORDS) {
      const patched = await rewriteBody(
        body,
        `This article is ${words} words and must reach at least ${EXPAND_TARGET}. Expand the two thinnest H2 sections with more practical detail: what the clause asks for, how a shop actually does it, and the mistake auditors commonly find. Do not add statistics, named companies, quotes or first person. Do not change the other sections.`,
        { mustGrow: true }
      );
      if (patched) {
        body = patched;
        applied.push("thin sections expanded");
      }
    }

    if (failed(qaResult, "meta-description", "meta-keyword") || failed(qaResult, "voice")?.violations?.some((v) => v.block === 1)) {
      const patched = await patchMetaDescription(article, metaDescription);
      if (patched) {
        metaDescription = patched;
        applied.push("meta description rewritten");
      }
    }
  }

  if (applied.length === 0) {
    log("rewritePatcher", "skip", llm ? "no patchable issues found" : "no model key — only deterministic patches are available");
  } else {
    log("rewritePatcher", "complete", applied.join("; "));
  }

  return {
    ...article,
    body,
    metaDescription,
    wordCount: countWords(body),
    patched: true,
    patchCount: applied.length,
  };
}

// ── Individual patch functions ──

/** Replaces banned phrases in prose only — URLs and image lines are left alone. */
function patchBannedPhrases(body) {
  const protectedSpan = /(\]\([^)]*\)|^\[IMAGE:[^\]]*\]\s*$|https?:\/\/\S+)/gm;
  return body
    .split(protectedSpan)
    .map((part, i) => {
      if (i % 2 === 1) return part; // a captured link target, marker or URL
      let text = part;
      for (const [banned, replacement] of Object.entries(BANNED_REPLACEMENTS)) {
        const re = new RegExp(`\\b${banned.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
        text = text.replace(re, (match) =>
          replacement && match[0] === match[0].toUpperCase() ? replacement[0].toUpperCase() + replacement.slice(1) : replacement
        );
      }
      return text.replace(/ {2,}/g, " ").replace(/ ([,.;:])/g, "$1");
    })
    .join("");
}

/**
 * One model pass that returns the whole article with a narrow change applied.
 * The result is discarded unless it is recognisably the same article: same
 * links and image markers, and no shrinkage.
 */
async function rewriteBody(body, instruction, { mustGrow = false } = {}) {
  const before = { words: countWords(body), links: extractLinks(body), markers: (body.match(/^\[IMAGE:[^\]]+\]\s*$/gm) || []).length };

  let result;
  try {
    result = await claudeCall(
      `You make narrow, surgical edits to ISO consulting articles for Canadian manufacturers. You change only what the instruction asks and return the complete article in clean markdown. You preserve every heading, link, [IMAGE: ...] marker, callout and bold phrase that the instruction does not require you to change. No preamble, no code fences, no H1 heading. Never use first person, named companies or people, quotes, or statistics stated as fact.`,
      `INSTRUCTION:\n${instruction}\n\nARTICLE:\n${body}\n\nReturn ONLY the full article markdown with the fix applied.`,
      8192
    );
  } catch (err) {
    log("rewritePatcher", "rewrite-error", err.message);
    return null;
  }

  const patched = normalizeBody(result);
  const after = { words: countWords(patched), links: extractLinks(patched), markers: (patched.match(/^\[IMAGE:[^\]]+\]\s*$/gm) || []).length };

  const keptLinks = after.links.internal.length >= before.links.internal.length - 1 && after.links.external.length >= before.links.external.length - 1;
  const keptMarkers = after.markers >= before.markers;
  const keptLength = mustGrow ? after.words > before.words : after.words >= before.words * 0.9;
  if (!keptLinks || !keptMarkers || !keptLength) {
    log("rewritePatcher", "rewrite-rejected", `words ${before.words}→${after.words}, markers ${before.markers}→${after.markers}`);
    return null;
  }
  return patched;
}

/** A new meta description: 120-160 characters, covering the keyword, no first person. */
async function patchMetaDescription(article, current) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    let text;
    try {
      text = await claudeCall(
        `You write meta descriptions for blog articles. Return ONLY the description text on one line — no quotes, no labels.`,
        `Write a meta description for the article "${article.title}".\n\nRules:\n- Between 130 and 155 characters, counted exactly\n- Must contain these words: ${article.primaryKeyword}\n- No first person (no we, our, us)\n- A plain statement of what the reader will learn; no hype\n\nCurrent version (rejected): ${current || "none"}`,
        512
      );
    } catch (err) {
      log("rewritePatcher", "meta-error", err.message);
      return null;
    }
    const meta = text.trim().split("\n")[0].replace(/^["'“]|["'”]$/g, "").trim();
    if (meta.length >= 120 && meta.length <= 160 && keywordCovered(article.primaryKeyword, meta) && !/\b(?:we|our|us)\b/.test(meta)) {
      return meta;
    }
  }
  return null;
}

module.exports = { patchArticle, patchBannedPhrases };
