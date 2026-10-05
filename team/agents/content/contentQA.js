#!/usr/bin/env node

/**
 * ISO Certification Consultants Content QA Agent v3 — Hardened
 *
 * Automated quality checks for all blog content before and after publish.
 * Implements the 10 Mandatory Quality Standards for ISO Certification Consultants blog articles.
 *
 * Standards enforced:
 *   1. No first-person voice (we/our) — third-person only
 *   2. No fabricated quotes or fictional personas
 *   3. Accurate readTime (wordCount / 200, rounded up)
 *   4. Every article has a mainImage with 16:9 ratio (1.6–1.9)
 *   5. No duplicate H1 that matches the title
 *   6. Meta description present and 120–160 chars
 *   7. Slug matches expected pattern (lowercase, hyphens, no special chars)
 *   8. publishedAt is a valid ISO date
 *   9. author reference is set
 *  10. Body has minimum 3 blocks of real content
 *
 * Usage:
 *   const contentQA = require('./contentQA');
 *   const report = await contentQA.validateArticle(env, articleId);
 *   // report.pass === true if all checks pass
 *   // report.failures[] lists any failed checks
 */

const https = require('https');

// ═══════════════════════════════════════════════════════════════
// HTTP HELPER
// ═══════════════════════════════════════════════════════════════

function sanityQuery(env, query) {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(query);
    const options = {
      hostname: `${env.SANITY_PROJECT_ID}.api.sanity.io`,
      path: `/v2024-01-01/data/query/${env.SANITY_DATASET}?query=${encoded}`,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${env.SANITY_API_TOKEN}` }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.result);
        } catch (e) {
          reject(new Error(`Parse error: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

// ═══════════════════════════════════════════════════════════════
// VOICE CHECK — Standard #1
// ═══════════════════════════════════════════════════════════════

// "us" is matched in lowercase only so the country ("US") never trips it.
const FIRST_PERSON_PATTERNS = [
  /\b(?:we|we've|we're|we'll|we'd|our|ours|ourselves)\b/i,
  /\bus\b/,
  /\b(?:my|myself)\b/i,
  /\bI(?:'m|'ve|'ll|'d)\b/,
];

// A bare capital "I" is usually the pronoun, but not after a label ("Class I
// device", "Type I error") or as part of a roman numeral or abbreviation.
const BARE_I = /\bI\b/g;
const ROMAN_LABEL_BEFORE = /\b(?:class|type|tier|phase|stage|part|level|category|annex|appendix|group|schedule|section|division|zone|grade|title|article|chapter|volume|table|figure)\s+$/i;

function findFirstPerson(text) {
  for (const pattern of FIRST_PERSON_PATTERNS) {
    const match = pattern.exec(text);
    if (match) return match;
  }
  BARE_I.lastIndex = 0;
  let match;
  while ((match = BARE_I.exec(text))) {
    const before = text.slice(0, match.index);
    const after = text.slice(match.index + 1);
    if (ROMAN_LABEL_BEFORE.test(before)) continue;
    if (/^[\/.&-]/.test(after) || /[\/&-]$/.test(before)) continue; // I/O, I.D., R&I
    if (/^\s*(?:,|and|or|through|to)\s+(?:II|III|IV|V)\b/.test(after)) continue; // I, II and III
    return match;
  }
  return null;
}

function checkVoice(bodyBlocks) {
  const violations = [];

  for (let i = 0; i < bodyBlocks.length; i++) {
    const block = bodyBlocks[i];
    if (block._type !== 'block' || !block.children) continue;

    const text = block.children.map(c => c.text || '').join('');
    const match = findFirstPerson(text);
    if (match) {
      violations.push({
        block: i,
        match: match[0],
        context: text.substring(Math.max(0, match.index - 30), match.index + 40).trim()
      });
    }
  }

  return {
    standard: 1,
    name: 'No first-person voice',
    pass: violations.length === 0,
    violations,
    message: violations.length === 0
      ? 'All blocks use third-person voice'
      : `${violations.length} block(s) contain first-person pronouns`
  };
}

// ═══════════════════════════════════════════════════════════════
// FABRICATED QUOTES CHECK — Standard #2
// ═══════════════════════════════════════════════════════════════

// Signs of an invented voice: quoted speech with a speech verb, a quote
// attributed to a titled person, or the stock "a client once told" framings.
// (Invented statistics and unlabelled examples need the claims audit below.)
const FABRICATED_QUOTE_PATTERNS = [
  /["“][^"”]{15,}["”],?\s+(?:said|says|explained|explains|noted|notes|recalled|recalls|told|added|adds|admitted|admits)\b/i,
  /\b(?:said|says|explained|explains|recalled|recalls|admitted|admits)\s+[A-Z][a-z]+\s+[A-Z][a-z]+,\s+(?:the\s+|a\s+|an\s+)?[a-z ]{0,30}(?:manager|director|president|owner|engineer|supervisor|lead|ceo|vp)\b/,
  /[—–-]\s*[A-Z][a-z]+\s+[A-Z][a-z]+,\s+(?:[A-Za-z]+\s+){0,3}(?:Manager|Director|President|Owner|Engineer|Supervisor|Lead|CEO|VP)\b/,
  /a client once told/i,
  /one manufacturer said/i,
  /as one .{3,40} put it/i
];

function checkFabricatedQuotes(bodyBlocks) {
  const violations = [];

  for (let i = 0; i < bodyBlocks.length; i++) {
    const block = bodyBlocks[i];
    if (block._type !== 'block') continue;

    const text = (block.children || []).map(c => c.text || '').join('');
    for (const pattern of FABRICATED_QUOTE_PATTERNS) {
      if (pattern.test(text)) {
        violations.push({ block: i, pattern: pattern.source, text: text.substring(0, 80) });
        break;
      }
    }
  }

  return {
    standard: 2,
    name: 'No fabricated quotes',
    pass: violations.length === 0,
    violations,
    message: violations.length === 0
      ? 'No fabricated quotes detected'
      : `${violations.length} passage(s) read as an attributed quote`
  };
}

// ═══════════════════════════════════════════════════════════════
// READ TIME CHECK — Standard #3
// ═══════════════════════════════════════════════════════════════

function checkReadTime(doc, bodyBlocks) {
  const bodyText = bodyBlocks
    .filter(b => b._type === 'block' && b.children)
    .map(b => b.children.map(c => c.text || '').join(''))
    .join(' ');

  const wordCount = bodyText.trim().split(/\s+/).filter(w => w.length > 0).length;
  const expectedReadTime = Math.ceil(wordCount / 200);
  const currentReadTime = parseInt(doc.readTime, 10) || 0;

  // Accept readTime strings like "9 min read" or just "9"
  const currentNum = parseInt(String(doc.readTime).replace(/[^0-9]/g, ''), 10) || 0;

  return {
    standard: 3,
    name: 'Accurate readTime',
    pass: currentNum === expectedReadTime,
    wordCount,
    expected: expectedReadTime,
    actual: currentNum,
    message: currentNum === expectedReadTime
      ? `readTime ${currentNum} min matches ${wordCount} words / 200`
      : `readTime mismatch: got ${currentNum}, expected ${expectedReadTime} (${wordCount} words / 200)`
  };
}

// ═══════════════════════════════════════════════════════════════
// MAIN IMAGE CHECK — Standard #4
// ═══════════════════════════════════════════════════════════════

async function checkMainImage(env, doc) {
  // Check both mainImage and featuredImage (matches coalesce() logic in GROQ queries)
  const mainImg = doc.mainImage?.asset?._ref ? doc.mainImage : null;
  const featImg = doc.featuredImage?.asset?._ref ? doc.featuredImage : null;
  const image = mainImg || featImg;
  const fieldUsed = mainImg ? 'mainImage' : featImg ? 'featuredImage' : null;

  if (!image) {
    return {
      standard: 4,
      name: 'mainImage with 16:9 ratio',
      pass: false,
      message: 'Neither mainImage nor featuredImage has an asset reference'
    };
  }

  // Verify 16:9 ratio
  const assetId = image.asset._ref;
  const assetQuery = `*[_id == "${assetId}"][0]{metadata{dimensions}}`;
  const asset = await sanityQuery(env, assetQuery);

  if (!asset || !asset.metadata?.dimensions) {
    return {
      standard: 4,
      name: 'mainImage with 16:9 ratio',
      pass: false,
      message: `${fieldUsed} asset ${assetId} has no dimension metadata`
    };
  }

  const { width, height } = asset.metadata.dimensions;
  const ratio = width / height;
  const valid = ratio >= 1.6 && ratio <= 1.9;

  return {
    standard: 4,
    name: 'mainImage with 16:9 ratio',
    pass: valid,
    dimensions: { width, height, ratio: ratio.toFixed(3) },
    message: valid
      ? `${fieldUsed} ${width}x${height} (ratio ${ratio.toFixed(3)}) is valid 16:9`
      : `${fieldUsed} ${width}x${height} (ratio ${ratio.toFixed(3)}) is NOT 16:9 (need 1.6–1.9)`
  };
}

// ═══════════════════════════════════════════════════════════════
// DUPLICATE H1 CHECK — Standard #5
// ═══════════════════════════════════════════════════════════════

function checkDuplicateH1(doc, bodyBlocks) {
  const title = (doc.title || '').toLowerCase().trim();
  const violations = [];

  for (let i = 0; i < bodyBlocks.length; i++) {
    const block = bodyBlocks[i];
    if (block._type !== 'block') continue;

    const text = (block.children || []).map(c => c.text || '').join('').toLowerCase().trim();

    // The page renders the title as its only H1, so any H1 in the body is a second one.
    if (block.style === 'h1') {
      violations.push({ block: i, text, matchesTitle: text === title });
    }

    // Also check for raw markdown # heading in normal blocks
    if (block.style === 'normal' && text.startsWith('# ')) {
      const headingText = text.replace(/^#\s+/, '').trim();
      violations.push({ block: i, text: headingText, rawMarkdown: true, matchesTitle: headingText === title });
    }
  }

  return {
    standard: 5,
    name: 'No H1 in the body',
    pass: violations.length === 0,
    violations,
    message: violations.length === 0
      ? 'No H1 in the body'
      : `${violations.length} H1 heading(s) in the body (the title is the page's only H1)`
  };
}

// ═══════════════════════════════════════════════════════════════
// META DESCRIPTION CHECK — Standard #6
// ═══════════════════════════════════════════════════════════════

function checkMetaDescription(doc) {
  const meta = doc.metaDescription || '';
  const len = meta.length;

  return {
    standard: 6,
    name: 'Meta description 120–160 chars',
    pass: len >= 120 && len <= 160,
    length: len,
    message: len === 0
      ? 'Meta description is empty'
      : len < 120
        ? `Meta description too short (${len} chars, need 120+)`
        : len > 160
          ? `Meta description too long (${len} chars, max 160)`
          : `Meta description is ${len} chars (within 120–160 range)`
  };
}

// ═══════════════════════════════════════════════════════════════
// SLUG CHECK — Standard #7
// ═══════════════════════════════════════════════════════════════

function checkSlug(doc) {
  const slug = doc.slug?.current || '';
  const valid = /^[a-z0-9-]+$/.test(slug) && slug.length > 5;

  return {
    standard: 7,
    name: 'Valid slug pattern',
    pass: valid,
    slug,
    message: valid
      ? `Slug "${slug}" is valid`
      : `Slug "${slug}" is invalid (must be lowercase alphanumeric + hyphens, min 6 chars)`
  };
}

// ═══════════════════════════════════════════════════════════════
// PUBLISHED DATE CHECK — Standard #8
// ═══════════════════════════════════════════════════════════════

function checkPublishedAt(doc) {
  const date = doc.publishedAt;
  const time = date ? new Date(date).getTime() : NaN;
  const parses = !isNaN(time);
  // A day of slack covers a date-only value written in a timezone ahead of UTC.
  const future = parses && time > Date.now() + 24 * 60 * 60 * 1000;
  const valid = parses && !future;

  return {
    standard: 8,
    name: 'Valid publishedAt date',
    pass: valid,
    publishedAt: date || null,
    message: valid
      ? `publishedAt "${date}" is valid ISO date`
      : future
        ? `publishedAt "${date}" is in the future`
        : 'publishedAt is missing or invalid'
  };
}

// ═══════════════════════════════════════════════════════════════
// AUTHOR CHECK — Standard #9
// ═══════════════════════════════════════════════════════════════

function checkAuthor(doc) {
  // A Sanity reference, or a plain byline for Markdown posts.
  const byline = typeof doc.author === 'string' ? doc.author.trim() : '';
  const hasAuthor = Boolean((doc.author && doc.author._ref) || byline);

  return {
    standard: 9,
    name: 'Author set',
    pass: hasAuthor,
    authorRef: doc.author?._ref || byline || null,
    message: hasAuthor
      ? `Author: ${doc.author._ref || byline}`
      : 'Author is missing'
  };
}

// ═══════════════════════════════════════════════════════════════
// MINIMUM CONTENT CHECK — Standard #10
// ═══════════════════════════════════════════════════════════════

function checkMinimumContent(bodyBlocks) {
  const contentBlocks = bodyBlocks.filter(b => {
    if (b._type !== 'block') return false;
    const text = (b.children || []).map(c => c.text || '').join('').trim();
    return text.length > 20;
  });

  return {
    standard: 10,
    name: 'Minimum 3 content blocks',
    pass: contentBlocks.length >= 3,
    blockCount: contentBlocks.length,
    message: contentBlocks.length >= 3
      ? `${contentBlocks.length} substantial content blocks found`
      : `Only ${contentBlocks.length} content blocks (need minimum 3)`
  };
}

// ═══════════════════════════════════════════════════════════════
// MAIN: validateArticle
// ═══════════════════════════════════════════════════════════════

/**
 * Run all 10 quality checks on a Sanity blog article.
 *
 * @param {Object} env - Environment config
 * @param {string} articleId - Sanity document _id
 * @returns {Object} { pass, score, checks[], failures[] }
 */
async function validateArticle(env, articleId) {
  console.log(`\n[contentQA] === Validating ${articleId} ===`);

  // Fetch the full document
  const query = `*[_id == "${articleId}"][0]{
    _id, title, slug, metaDescription, readTime, publishedAt,
    "author": author, "mainImage": mainImage,
    "body": body[]
  }`;
  const doc = await sanityQuery(env, query);

  if (!doc) {
    return {
      pass: false,
      score: '0/10',
      error: `Article ${articleId} not found`,
      checks: [],
      failures: ['Article not found']
    };
  }

  const body = doc.body || [];

  // Run all checks (image check is async)
  const checks = [
    checkVoice(body),
    checkFabricatedQuotes(body),
    checkReadTime(doc, body),
    await checkMainImage(env, doc),
    checkDuplicateH1(doc, body),
    checkMetaDescription(doc),
    checkSlug(doc),
    checkPublishedAt(doc),
    checkAuthor(doc),
    checkMinimumContent(body)
  ];

  const failures = checks.filter(c => !c.pass);
  const score = checks.filter(c => c.pass).length;

  // Log results
  for (const check of checks) {
    const icon = check.pass ? 'PASS' : 'FAIL';
    console.log(`  [${icon}] #${check.standard}: ${check.name} — ${check.message}`);
  }

  console.log(`\n[contentQA] Score: ${score}/10 — ${failures.length === 0 ? 'ALL CHECKS PASSED' : `${failures.length} failure(s)`}`);

  return {
    pass: failures.length === 0,
    score: `${score}/10`,
    articleId,
    title: doc.title,
    checks,
    failures: failures.map(f => `#${f.standard}: ${f.message}`)
  };
}

/**
 * Validate all published blog posts
 */
async function validateAll(env) {
  const articles = await sanityQuery(env, '*[_type == "blogPost"]{_id, title}');
  if (!articles || articles.length === 0) {
    console.log('[contentQA] No articles found');
    return [];
  }

  console.log(`[contentQA] Validating ${articles.length} articles...`);
  const results = [];
  for (const article of articles) {
    const result = await validateArticle(env, article._id);
    results.push(result);
  }

  const passing = results.filter(r => r.pass).length;
  console.log(`\n[contentQA] === SUMMARY: ${passing}/${results.length} articles pass all checks ===`);
  return results;
}

// ═══════════════════════════════════════════════════════════════
// BACKWARD COMPATIBILITY — Legacy API wrappers
// Used by: contentManager.js (reviewArticle, reviewMegaArticle)
//          contentRefresher.js (runQA)
// ═══════════════════════════════════════════════════════════════

/**
 * Build env object from shared/config for legacy callers.
 */
function _buildEnv() {
  try {
    const config = require('../shared/config');
    return {
      SANITY_PROJECT_ID: config.SANITY_PROJECT_ID,
      SANITY_DATASET: config.SANITY_DATASET,
      SANITY_API_TOKEN: config.SANITY_API_TOKEN,
    };
  } catch {
    return {
      SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID || 'uakgkw7x',
      SANITY_DATASET: process.env.SANITY_DATASET || 'production',
      SANITY_API_TOKEN: process.env.SANITY_API_TOKEN || '',
    };
  }
}

/**
 * Legacy reviewArticle(article, imageResult, inlineImageCount).
 * Adapts the old LLM-scored API to the new deterministic 10-standard check.
 * Returns shape compatible with contentManager.js: { score, pass, issues, ... }
 */
async function reviewArticle(article, imageResult, inlineImageCount) {
  const env = _buildEnv();

  // If article has a Sanity _id, validate directly from Sanity
  if (article._id) {
    const result = await validateArticle(env, article._id);
    // Convert score from "X/10" to numeric 0-100 for backward compat
    const numScore = parseInt(result.score) * 10;
    return {
      score: numScore,
      pass: result.pass,
      checks: result.checks,
      issues: result.failures,
      suggestions: [],
      rewriteInstructions: result.pass ? null : result.failures.join('; '),
    };
  }

  // If no _id, do a lightweight local check on the article object
  // (pre-publish QA — article hasn't been saved to Sanity yet)
  console.log(`[contentQA] reviewArticle (local mode): "${article.title}"`);

  const issues = [];
  let score = 100;

  // Word count check
  const wordCount = (article.wordCount || (article.body || '').split(/\s+/).length);
  if (wordCount < 1400) {
    issues.push(`Word count ${wordCount} is below 1,400 minimum`);
    score -= 10;
  }

  // Keyword in title (check for partial match — at least 2 key words from the keyword phrase)
  if (article.primaryKeyword && article.title) {
    const titleLower = article.title.toLowerCase();
    const keywordLower = article.primaryKeyword.toLowerCase();
    if (titleLower.includes(keywordLower)) {
      // Exact match — full score
    } else {
      // Partial match — check if at least 2 significant words from keyword appear in title (stem-aware)
      const stopWords = ["canada", "canadian", "ontario", "guide", "the", "for", "and", "how", "your", "with"];
      const keyWords = keywordLower.split(/\s+/).filter(w => w.length > 3 && !stopWords.includes(w));
      const titleWords = titleLower.split(/\s+/);
      const matchCount = keyWords.filter(kw => titleWords.some(tw => tw.startsWith(kw.slice(0, 4)) || kw.startsWith(tw.slice(0, 4)))).length;
      if (matchCount < 2) {
        issues.push('Primary keyword not found in title');
        score -= 10;
      }
    }
  }

  // Meta description length
  const metaLen = (article.metaDescription || '').length;
  if (metaLen < 100 || metaLen > 165) {
    issues.push(`Meta description length ${metaLen} outside 100-165 range`);
    score -= 5;
  }

  // Image check
  if (!imageResult || !imageResult.assetId) {
    issues.push('No hero image asset');
    score -= 3;
  }

  // Voice check — only flag excessive first-person (>10 instances)
  // Note: articles may use "we" when referring to ISO Certification Consultants, which is allowed
  const bodyStr = typeof article.body === 'string' ? article.body : '';
  const voiceMatch = bodyStr.match(/\b(I|I've|my|myself)\b/g);
  if (voiceMatch && voiceMatch.length > 0) {
    issues.push(`${voiceMatch.length} first-person singular pronoun(s) found (I/my)`);
    score -= 5;
  }

  if (issues.length > 0) {
    console.log(`[contentQA] issues: ${issues.join(' | ')}`);
  }
  const pass = score >= 95;
  console.log(`[contentQA] reviewArticle score: ${score}/100 — ${pass ? 'PASS' : 'FAIL'}`);

  return {
    score,
    pass,
    checks: [],
    issues,
    suggestions: [],
    rewriteInstructions: pass ? null : issues.join('; '),
  };
}

/**
 * Legacy reviewMegaArticle(article, imageResult).
 * Delegates to reviewArticle for backward compat.
 */
async function reviewMegaArticle(article, imageResult) {
  return reviewArticle(article, imageResult, 0);
}

/**
 * Legacy runQA({ title, body, primaryKeyword, category }).
 * Used by contentRefresher.js. Returns { score }.
 */
async function runQA(article) {
  const result = await reviewArticle(article, null, 0);
  return { score: result.score };
}

// ═══════════════════════════════════════════════════════════════
// MARKDOWN BLOG — the pre-publish gate
// Runs on the in-memory post before anything is written. Every check is
// blocking: one failure and the post is not published.
// ═══════════════════════════════════════════════════════════════

const MIN_WORDS = 1500;
const { MIN_INTERNAL_LINKS, MIN_EXTERNAL_LINKS } = require('../seo/linkBuilder');
const HERO_WIDTH = 1200;
const HERO_HEIGHT = 675;

const BANNED_PHRASES = [
  "delve into", "it is worth noting", "in conclusion", "in today's landscape",
  "navigating the complexities", "crucial", "comprehensive", "landscape",
  "navigate", "leverage", "game-changer", "cutting-edge", "at the end of the day",
  "it goes without saying", "needless to say", "from scratch", "from the ground up",
  "documentation burden", "documentation maturity", "competitive advantage", "competitive edge",
];

// ── US spelling ─────────────────────────────────────────────────
// British forms that appear in prose, lowercase only: a capitalized form is
// treated as a proper name (Canadian Centre for Occupational Health and Safety,
// Ministry of Labour) and left alone. URLs, link targets and image lines are skipped.

const ISE_STEMS = 'organ|real|recogn|analy|optim|minim|maxim|priorit|standard|summar|util|categor|emphas|special|author|custom|final|formal|normal|visual|mobil|critic|scrutin|digit|central|industrial|material|commercial|rational|synchron|harmon|legitim|monet|capital|modern|neutral|penal|personal|stabil|steril|familiar|general|initial|internal|local|memor|minimal|moral|oxid|popular|public|random|sanit|serial|social|symbol|system|theor|total|vapor|vocal';
const SPELLING_RULES = [
  // -ise/-isation families: analyse→analyze, organise→organize, organisation→organization
  { re: new RegExp(`\\b(${ISE_STEMS})is(e|es|ed|ing|ation|ations|er|ers)\\b`, 'g'), fix: (m, stem, tail) => `${stem}iz${tail}` },
  { re: /\banalys(e|es|ed|ing)\b/g, fix: (m, tail) => `analyz${tail}` },
  { re: /\bcatalys(e|es|ed|ing)\b/g, fix: (m, tail) => `catalyz${tail}` },
  { re: /\bparalys(e|es|ed|ing)\b/g, fix: (m, tail) => `paralyz${tail}` },
  // -our → -or
  { re: /\b(col|fav|hon|lab|behavi|flav|harb|hum|neighb|rum|sav|vap|vig|od|arm|ard|end|rig)our(s|ed|ing|able|ite|ful|ably)?\b/g, fix: (m, stem, tail = '') => `${stem}or${tail}` },
  // -re → -er
  { re: /\b(cent|met|lit|fib|calib|theat|sab|spect|lust)re(s|d)?\b/g, fix: (m, stem, tail = '') => `${stem}er${tail}` },
  { re: /\bcentr(ed|ing)\b/g, fix: (m, tail) => `center${tail}` },
  // -ce → -se nouns, and the rest
  { re: /\b(defen|offen|preten)ce(s)?\b/g, fix: (m, stem, tail = '') => `${stem}se${tail}` },
  { re: /\blicen(ce|ces)\b/g, fix: (m, tail) => (tail === 'ce' ? 'license' : 'licenses') },
  { re: /\bprogramme(s|d)?\b/g, fix: (m, tail = '') => `program${tail}` },
  { re: /\bprogramming\b/g, fix: () => 'programming' },
  { re: /\b(catalog|analog|dialog)ue(s|d)?\b/g, fix: (m, stem, tail = '') => `${stem}${tail}` },
  { re: /\bgrey(s|er|est|ish)?\b/g, fix: (m, tail = '') => `gray${tail}` },
  { re: /\b(travel|label|model|cancel|fuel|signal|channel|total|level|tunnel)l(ed|ing|er|ers)\b/g, fix: (m, stem, tail) => `${stem}${tail}` },
  { re: /\bjudgement(s)?\b/g, fix: (m, tail = '') => `judgment${tail}` },
  { re: /\benrol(ment|ments|led|ling)\b/g, fix: (m, tail) => `enroll${tail}` },
  { re: /\bfulfil(ment|ments|s)?\b/g, fix: (m, tail = '') => `fulfill${tail}` },
  { re: /\binstalment(s)?\b/g, fix: (m, tail = '') => `installment${tail}` },
  { re: /\bskilful(ly)?\b/g, fix: (m, tail = '') => `skillful${tail}` },
  { re: /\baluminium\b/g, fix: () => 'aluminum' },
  { re: /\b(mould|tyre|cheque|plough|ageing|artefact|sulphur|kerb|pyjama|whilst|amongst)(s|ed|ing)?\b/g, fix: (m, w, tail = '') => ({ mould: 'mold', tyre: 'tire', cheque: 'check', plough: 'plow', ageing: 'aging', artefact: 'artifact', sulphur: 'sulfur', kerb: 'curb', pyjama: 'pajama', whilst: 'while', amongst: 'among' })[w] + tail },
  { re: /\bpractis(e|es|ed|ing)\b/g, fix: (m, tail) => `practic${tail}` },
];

/** Splits prose from the spans spelling must not touch (link targets, URLs, image lines, code). */
function proseSpans(body) {
  return String(body || '').split(/(\]\([^)]*\)|https?:\/\/\S+|^!\[[^\]]*\]\([^)]*\)\s*$|^\[IMAGE:[^\]]*\]\s*$|`[^`]*`)/gm);
}

const SENTENCE_START_RE = /(?:^|[.!?:]\*{0,2}\s+|\n\s*(?:[-*+]|\d+\.|#{1,6}|>)\s*|\*\*|["\u201c(])$/;

// A capitalized match is a proper name (Centre for…, Ministry of Labour) unless it
// opens a sentence or a list item, where it is just an ordinary word with a capital.
function isOrdinaryWord(text, index, word) {
  if (word[0] === word[0].toLowerCase()) return true;
  if (word.slice(1) !== word.slice(1).toLowerCase()) return false; // ACRONYM
  return SENTENCE_START_RE.test(text.slice(Math.max(0, index - 12), index));
}

function applySpellingRules(part, onMatch) {
  let text = part;
  for (const rule of SPELLING_RULES) {
    const re = new RegExp(rule.re.source, 'gi');
    text = text.replace(re, (...args) => {
      const match = args[0];
      const offset = args[args.length - 2];
      const whole = args[args.length - 1];
      if (!isOrdinaryWord(whole, offset, match)) return match;
      const lower = match.toLowerCase();
      const groups = args.slice(1, -2).map((g) => (typeof g === 'string' ? g.toLowerCase() : g));
      let fixed = rule.fix(lower, ...groups);
      if (match[0] !== lower[0]) fixed = fixed[0].toUpperCase() + fixed.slice(1);
      onMatch(match, fixed);
      return fixed;
    });
  }
  return text;
}

function findBritishSpellings(body) {
  const found = new Set();
  proseSpans(body).forEach((part, i) => {
    if (i % 2 === 1) return;
    applySpellingRules(part, (match) => found.add(match));
  });
  return [...found];
}

/** Rewrites British spellings to US in prose only; proper names keep their spelling. */
function toUSSpelling(body) {
  return proseSpans(body)
    .map((part, i) => (i % 2 === 1 ? part : applySpellingRules(part, () => {})))
    .join('');
}

// ── Keyword styling ─────────────────────────────────────────────
// Search phrases pasted in bold, and lowercase standard names, are the visible
// signs of keyword stuffing. Both are checked and patched deterministically.

const STANDARD_NAME_RE = /\b(iso|iatf|fssc|as)\s?(9001|9000|14001|45001|13485|22000|27001|17025|22301|16949|9100|19011)\b/g;

function findKeywordStyling(body, keywords = []) {
  const problems = [];
  const keys = new Set((keywords || []).map((k) => String(k).trim().toLowerCase()).filter(Boolean));
  proseSpans(body).forEach((part, i) => {
    if (i % 2 === 1) return;
    for (const m of part.matchAll(/\*\*([^*\n]+)\*\*/g)) {
      const inner = m[1].trim().replace(/[.:,;!?]+$/, '').toLowerCase();
      if (keys.has(inner)) problems.push({ kind: 'bold-keyword', text: m[0] });
    }
    for (const m of part.matchAll(STANDARD_NAME_RE)) {
      if (m[1] !== m[1].toUpperCase()) problems.push({ kind: 'lowercase-standard', text: m[0] });
    }
  });
  return problems;
}

function fixKeywordStyling(body, keywords = []) {
  const keys = new Set((keywords || []).map((k) => String(k).trim().toLowerCase()).filter(Boolean));
  return proseSpans(body)
    .map((part, i) => {
      if (i % 2 === 1) return part;
      return part
        .replace(/\*\*([^*\n]+)\*\*/g, (all, inner) => {
          const key = inner.trim().replace(/[.:,;!?]+$/, '').toLowerCase();
          return keys.has(key) ? inner : all;
        })
        .replace(STANDARD_NAME_RE, (all, prefix, number) => `${prefix.toUpperCase()} ${number}`);
    })
    .join('');
}

const ARTIFACT_PATTERNS = [
  { re: /^```/m, label: 'code fence' },
  { re: /\{:\s*[^}]*\}/, label: 'kramdown attribute' },
  { re: /^\s*(?:here(?:'s| is) (?:the|your)|certainly[!,.]|i(?:'ve| have) (?:written|cleaned|revised))/im, label: 'model preamble' },
  { re: /\[(?:placeholder|todo|insert[^\]]*)\]/i, label: 'placeholder' },
  { re: /lorem ipsum|example\.com|\bTODO:|\bDRAFT:/i, label: 'placeholder text' },
  { re: /\[SANITY_IMAGE:/, label: 'Sanity image marker' },
];

/**
 * Markdown to the block shape the standard checks read (the same shape Sanity
 * returns), so the Sanity checks above work unchanged on a Markdown post.
 */
function toBlocks(markdown) {
  const { toPlainText } = require('../shared/contentStore');
  const blocks = [];
  const push = (style, raw, extra = {}) => {
    const text = toPlainText(raw);
    if (text) blocks.push({ _type: 'block', style, children: [{ text }], ...extra });
  };

  for (const chunk of String(markdown || '').split(/\n{2,}/)) {
    const lines = chunk.split('\n').filter((l) => l.trim());
    if (lines.length === 0) continue;

    if (lines.every((l) => /^\s*>/.test(l))) {
      push('blockquote', lines.join('\n'));
      continue;
    }

    let paragraph = [];
    const flush = () => {
      if (paragraph.length) push('normal', paragraph.join(' '));
      paragraph = [];
    };
    for (const line of lines) {
      const heading = /^(#{1,6})\s+(.+)$/.exec(line.trim());
      if (heading) {
        flush();
        push(`h${heading[1].length}`, heading[2]);
      } else if (/^!\[[^\]]*\]\([^)]*\)$/.test(line.trim())) {
        flush();
        blocks.push({ _type: 'image' });
      } else if (/^\s*(?:[-*+]|\d+\.)\s+/.test(line)) {
        flush();
        push('normal', line, { listItem: true });
      } else if (/^\s*\|/.test(line)) {
        flush();
        if (!/^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(line)) push('normal', line, { table: true });
      } else {
        paragraph.push(line);
      }
    }
    flush();
  }
  return blocks;
}

const CLAIMS_AUDIT_PROMPT = `You are a compliance editor for a Canadian ISO consulting firm's blog. You check a draft against the publisher's honesty rules and report violations. You do not rewrite.

RULES THE DRAFT MUST FOLLOW:
1. NAMED ENTITIES — The draft must not name any company, client or individual person. Allowed names: ISO Certification Consultants itself, standards bodies and regulators (ISO, IATF, IAF, SCC, ANAB, Health Canada, CFIA, Ministry of Labour and similar), and well-known public organizations cited as sources.
2. QUOTES — No quotations, testimonials or reported speech attributed to any person.
3. STATISTICS AND GENERALIZATIONS — No statistic, percentage, survey result, dollar figure or measured outcome stated as fact, and no claim about what "most", "the majority of" or "nearly all" companies, plants, auditors or registrars do. Allowed: clause numbers; requirements written in the standard; ranges clearly framed as typical or estimated ("typically 4 to 6 months", "often costs between"); and hedged generalizations ("many plants", "a common approach").
4. EXAMPLES — Any scenario about a business must be openly hypothetical: its paragraph starts with "Illustrative example:" and it names no company. A story told as something that really happened is a violation.
5. TRACK RECORD — No claims about ISO Certification Consultants' results (pass rates, number of audits or clients, years in business).
6. STANDARD ACCURACY — ISO/IATF clause numbers and standard names must be correct for the standard cited (for example, ISO 9001:2015 clause 9.2 is internal audit; clause 6.1 is actions to address risks and opportunities). Flag a reference only when you are confident it is wrong.

Flag only clear violations. When unsure, do not flag. Hedged estimates and general professional observations are fine.

Return ONLY JSON:
{
  "findings": [
    { "rule": "NAMED ENTITIES|QUOTES|STATISTICS|EXAMPLES|TRACK RECORD|STANDARD ACCURACY", "text": "the exact offending sentence or phrase, copied from the draft", "reason": "one sentence" }
  ]
}
Return {"findings": []} when the draft is clean.`;

/**
 * One fast-model pass for what regex can't see: invented companies, people,
 * statistics and unlabelled examples, and wrong clause references.
 */
async function auditClaims(post) {
  const { claudeJSONFast } = require('../shared/claude');
  const { loadStandardsFacts } = require('./contextLoader');
  const facts = loadStandardsFacts();
  const result = await claudeJSONFast(
    CLAIMS_AUDIT_PROMPT,
    `${facts ? `${facts}\n\nFor rule 6, treat this table as correct even where it differs from what you remember: a draft that calls a superseded edition "current" is a violation.\n\n` : ''}TITLE: ${post.title}\nMETA DESCRIPTION: ${post.description}\n\nDRAFT:\n${post.body}`,
    4096
  );
  const findings = Array.isArray(result?.findings) ? result.findings.filter((f) => f && f.text) : [];
  return { findings };
}

function countBannedPhrases(body) {
  const { toPlainText } = require('../shared/contentStore');
  const text = toPlainText(body).toLowerCase();
  return BANNED_PHRASES.filter((p) => new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(text));
}

/**
 * The publish gate for a Markdown post.
 *
 * @param {object} post  { title, slug, description, date, author, primaryKeyword, body, hero?, inlineImages? }
 * @param {object} opts  phase: "text" (before images exist) or "final" (everything);
 *                       claimsAudit: false skips the model-backed check (tests);
 *                       claimsCheck: a claims-audit result from an earlier phase to reuse
 * @returns {Promise<{pass, score, checks[], issues[], failures[], findings[]}>}
 *          checks[].id is the stable name rewritePatcher keys on.
 */
async function validateLocal(post, opts = {}) {
  const phase = opts.phase || 'final';
  const store = require('../shared/contentStore');
  const { resolves } = require('../shared/siteRoutes');
  const { loadLinkBankUrls } = require('./contextLoader');
  const { isBlogImageUsed } = require('../shared/imageRegistry');
  const { isExcludedTopic } = require('./keywordResearcher');
  const { hasLLMKey } = require('../shared/claude');

  const body = post.body || '';
  const blocks = toBlocks(body);
  const wordCount = store.countWords(body);
  const existing = opts.existingPosts || store.listPosts();
  const checks = [];
  const add = (id, result, extra = {}) => checks.push({ id, ...result, ...extra });

  // 1. Voice — the body, plus the title and meta description readers also see.
  const headBlocks = [post.title, post.description].map((text) => ({ _type: 'block', style: 'normal', children: [{ text: text || '' }] }));
  const voice = checkVoice([...headBlocks, ...blocks]);
  if (!voice.pass) voice.message += `: ${voice.violations.slice(0, 3).map((v) => `"${v.context}"`).join('; ')}`;
  add('voice', voice);

  // 2. Fabrication — pattern check, then the model-backed claims audit.
  const quotes = checkFabricatedQuotes(blocks);
  if (!quotes.pass) quotes.message += `: ${quotes.violations.slice(0, 3).map((v) => `"${v.text}"`).join('; ')}`;
  add('fabricated-quotes', quotes);

  let findings = [];
  if (opts.claimsCheck) {
    // The text already passed the audit and only image lines changed since; carry the result over.
    findings = opts.claimsCheck.findings || [];
    add('claims-audit', opts.claimsCheck);
  } else if (opts.claimsAudit === false || !hasLLMKey()) {
    add('claims-audit', { standard: 2, name: 'Claims audit', pass: true, skipped: true, message: 'Skipped — no model key configured, so invented names and statistics were not checked' });
  } else {
    try {
      ({ findings } = await auditClaims(post));
      add('claims-audit', {
        standard: 2,
        name: 'Claims audit',
        pass: findings.length === 0,
        findings,
        message: findings.length === 0
          ? 'No invented names, quotes, statistics or unlabelled examples found'
          : `${findings.length} finding(s): ${findings.slice(0, 3).map((f) => `[${f.rule}] "${String(f.text).slice(0, 70)}"`).join('; ')}`,
      });
    } catch (err) {
      add('claims-audit', { standard: 2, name: 'Claims audit', pass: false, message: `Claims audit could not run: ${err.message}` });
    }
  }

  // 3. Read time — always derived from the words at publish, so it cannot drift.
  const readTime = store.readTimeMinutes(wordCount);
  add('read-time', {
    standard: 3,
    name: 'Accurate readTime',
    pass: post.readTime == null || Number(post.readTime) === readTime,
    message: `${readTime} min for ${wordCount} words`,
  });

  // 4. Hero image — final phase only; images are sourced after the text passes.
  if (phase === 'final') {
    const hero = post.hero;
    const sized = Boolean(hero && hero.width === HERO_WIDTH && hero.height === HERO_HEIGHT);
    add('hero-image', {
      standard: 4,
      name: 'Hero image at 16:9',
      pass: sized && Boolean(hero.alt),
      message: !hero ? 'No hero image' : !sized ? `Hero is ${hero.width}x${hero.height}, need ${HERO_WIDTH}x${HERO_HEIGHT}` : !hero.alt ? 'Hero has no alt text' : `Hero ${hero.width}x${hero.height} from ${hero.source}`,
    });

    const images = [hero, ...(post.inlineImages || [])].filter(Boolean);
    const reused = images.filter((img) => isBlogImageUsed(img));
    const hashes = images.map((img) => img.sha256);
    const repeated = hashes.length !== new Set(hashes).size;
    add('images-unique', {
      name: 'Images not used elsewhere',
      pass: reused.length === 0 && !repeated,
      message: reused.length ? `${reused.length} image(s) already appear in another post` : repeated ? 'The same image is used twice in this post' : `${images.length} unique image(s)`,
    });
  }

  // 5. One H1 per page, unique title.
  add('single-h1', checkDuplicateH1({ title: post.title }, blocks));
  const titleKey = (post.title || '').trim().toLowerCase();
  const sameTitle = existing.find((p) => (p.title || '').trim().toLowerCase() === titleKey && p.slug !== post.slug);
  add('title-unique', {
    standard: 5,
    name: 'Title unique across posts',
    pass: Boolean(titleKey) && !sameTitle,
    message: !titleKey ? 'Title is empty' : sameTitle ? `Title already used by /blog/${sameTitle.slug}` : 'Title is unique',
  });

  // 6. Meta description.
  add('meta-description', checkMetaDescription({ metaDescription: post.description }));
  const metaHasKeyword = store.keywordCovered(post.primaryKeyword, post.description);
  add('meta-keyword', {
    standard: 6,
    name: 'Meta description includes the keyword',
    pass: metaHasKeyword,
    message: metaHasKeyword ? 'Keyword present in the meta description' : `Meta description does not cover "${post.primaryKeyword}"`,
  });

  // 7. Slug — well-formed, and never an existing one (existing URLs are never overwritten).
  add('slug', checkSlug({ slug: { current: post.slug } }));
  const taken = store.slugExists(post.slug);
  add('slug-unique', { standard: 7, name: 'Slug not already published', pass: !taken, message: taken ? `Slug "${post.slug}" is already published` : 'Slug is free' });

  // 8-10.
  add('published-date', checkPublishedAt({ publishedAt: post.date }));
  add('author', checkAuthor({ author: post.author }));
  add('min-content', checkMinimumContent(blocks));

  // Length and keyword placement.
  add('word-count', {
    name: `At least ${MIN_WORDS} words`,
    pass: wordCount >= MIN_WORDS,
    wordCount,
    message: `${wordCount} words${wordCount >= MIN_WORDS ? '' : ` — ${MIN_WORDS - wordCount} short`}`,
  });
  const titleHasKeyword = store.keywordCovered(post.primaryKeyword, post.title);
  add('keyword-in-title', {
    name: 'Title includes the keyword',
    pass: titleHasKeyword,
    message: titleHasKeyword ? 'Keyword present in the title' : `Title does not cover "${post.primaryKeyword}"`,
  });
  const excluded = isExcludedTopic(`${post.title} ${post.primaryKeyword}`);
  add('topic-allowed', { name: 'Topic allowed on the blog', pass: !excluded, message: excluded ? 'AS9100 and ISO 27001 are not covered on the blog' : 'Topic allowed' });

  // Links — every internal link must resolve; outside links only from the bank.
  const links = store.extractLinks(body);
  const broken = links.internal.filter((l) => !resolves(l.url));
  add('internal-links', {
    name: `At least ${MIN_INTERNAL_LINKS} internal links, all resolving`,
    pass: broken.length === 0 && links.internal.length >= MIN_INTERNAL_LINKS,
    message: broken.length
      ? `Broken internal link(s): ${broken.map((l) => l.url).join(', ')}`
      : `${links.internal.length} internal link(s)${links.internal.length >= MIN_INTERNAL_LINKS ? '' : ` — need ${MIN_INTERNAL_LINKS}`}`,
  });
  const bank = loadLinkBankUrls();
  const offBank = links.external.filter((l) => !bank.has(store.normalizeUrl(l.url)));
  add('external-links', {
    name: `At least ${MIN_EXTERNAL_LINKS} external links, all from the link bank`,
    pass: offBank.length === 0 && links.external.length >= MIN_EXTERNAL_LINKS,
    message: offBank.length
      ? `External link(s) not in the link bank: ${offBank.map((l) => l.url).join(', ')}`
      : `${links.external.length} external link(s)${links.external.length >= MIN_EXTERNAL_LINKS ? '' : ` — need ${MIN_EXTERNAL_LINKS}`}`,
  });

  // Tone and leftovers.
  const banned = countBannedPhrases(body);
  add('banned-phrases', { name: 'No banned phrases', pass: banned.length === 0, phrases: banned, message: banned.length ? `Banned phrase(s): ${banned.join(', ')}` : 'None found' });

  const styling = findKeywordStyling(body, post.keywords || [post.primaryKeyword]);
  add('keyword-styling', {
    name: 'No pasted keywords or lowercase standard names',
    pass: styling.length === 0,
    problems: styling,
    message: styling.length ? `Found: ${styling.slice(0, 4).map((p) => p.text).join(', ')}` : 'None found',
  });

  const british = findBritishSpellings(`${post.title}\n${post.description}\n${body}`);
  add('spelling', {
    name: 'US spelling',
    pass: british.length === 0,
    words: british,
    message: british.length ? `British spelling: ${british.slice(0, 6).join(', ')}` : 'US spelling throughout',
  });

  const artifacts = ARTIFACT_PATTERNS.filter((a) => a.re.test(body)).map((a) => a.label);
  // Image markers are expected until the image step has run.
  if (phase === 'final' && /\[IMAGE:/.test(body)) artifacts.push('unprocessed image marker');
  add('no-artifacts', { name: 'No leftover markers or model preamble', pass: artifacts.length === 0, message: artifacts.length ? `Found: ${artifacts.join(', ')}` : 'Clean' });

  const failures = checks.filter((c) => !c.pass);
  return {
    pass: failures.length === 0,
    score: `${checks.length - failures.length}/${checks.length}`,
    phase,
    wordCount,
    readTime,
    checks,
    findings,
    issues: failures.map((c) => `${c.id}: ${c.message}`),
    failures: failures.map((c) => c.id),
  };
}

// ═══════════════════════════════════════════════════════════════
// CLI MODE
// ═══════════════════════════════════════════════════════════════

if (require.main === module) {
  const fs = require('fs');
  const path = require('path');

  function loadEnv(envPath) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const env = {};
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        env[trimmed.substring(0, eqIdx).trim()] = trimmed.substring(eqIdx + 1).trim();
      }
    }
    return env;
  }

  const args = process.argv.slice(2);
  const envFile = args.includes('--env') ? args[args.indexOf('--env') + 1] : path.join(__dirname, '../../..', 'blog-pipeline-scripts', '.env');
  const articleId = args.find(a => !a.startsWith('--'));

  const env = loadEnv(envFile);

  if (articleId) {
    validateArticle(env, articleId).then(r => {
      process.exit(r.pass ? 0 : 1);
    });
  } else {
    validateAll(env).then(results => {
      const allPass = results.every(r => r.pass);
      process.exit(allPass ? 0 : 1);
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

module.exports = {
  // v3 API
  validateArticle,
  validateAll,
  checkVoice,
  checkFabricatedQuotes,
  checkReadTime,
  checkMainImage,
  checkDuplicateH1,
  checkMetaDescription,
  checkSlug,
  checkPublishedAt,
  checkAuthor,
  checkMinimumContent,
  // Markdown blog gate
  validateLocal,
  toBlocks,
  auditClaims,
  countBannedPhrases,
  findBritishSpellings,
  toUSSpelling,
  findKeywordStyling,
  fixKeywordStyling,
  BANNED_PHRASES,
  MIN_WORDS,
  // Legacy API (backward compat)
  reviewArticle,
  reviewMegaArticle,
  runQA,
};
