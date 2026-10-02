const fs = require("fs");
const path = require("path");
const { log } = require("../shared/logger");
const { LINK_BANK_PATH } = require("../shared/config");
const { listPosts, extractLinks, normalizeUrl, toPlainText } = require("../shared/contentStore");
const { getLinkTargets } = require("../shared/siteRoutes");

const { TEAM_ROOT } = require("../shared/config");

// Sources cited in the last few posts are offered last, so consecutive articles
// vary their references without the bank ever running dry.
const EXTERNAL_LINK_COOLDOWN_POSTS = 5;
const STANDARDS_FACTS_PATH = path.join(TEAM_ROOT, "data", "standards-facts.json");

/**
 * Detects which industry an article keyword belongs to.
 * Returns an array of relevant industry keys from the link bank.
 */
function detectIndustries(keyword) {
  const kw = keyword.toLowerCase();
  const industries = [];

  if (kw.includes("automotive") || kw.includes("iatf") || kw.includes("16949")) industries.push("automotive");
  if (kw.includes("aerospace") || kw.includes("as9100") || kw.includes("as 9100")) industries.push("aerospace");
  if (kw.includes("food") || kw.includes("22000") || kw.includes("haccp")) industries.push("food_beverage");
  if (kw.includes("medical") || kw.includes("13485") || kw.includes("device")) industries.push("healthcare_medical");
  if (kw.includes("construction") || kw.includes("contractor")) industries.push("construction");
  if (kw.includes("oil") || kw.includes("gas") || kw.includes("energy") || kw.includes("pipeline")) industries.push("oil_gas_energy");
  if (kw.includes("mining") || kw.includes("mineral")) industries.push("mining");
  if (kw.includes("14001") || kw.includes("environmental")) industries.push("environmental");
  if (kw.includes("45001") || kw.includes("safety") || kw.includes("hazard")) industries.push("occupational_safety");
  if (kw.includes("17025") || kw.includes("laborator") || kw.includes("calibration")) industries.push("laboratory");
  if (kw.includes("27001") || kw.includes("information security") || kw.includes("cyber")) industries.push("information_security");
  if (kw.includes("9001") || kw.includes("quality") || kw.includes("audit") || kw.includes("certification")) industries.push("general_quality");

  // Always include manufacturing as base
  if (!industries.includes("manufacturing")) industries.push("manufacturing");
  // Always include general quality
  if (!industries.includes("general_quality")) industries.push("general_quality");

  return industries;
}

/**
 * External URLs cited by the most recent posts. These are held back so
 * consecutive articles don't lean on the same sources.
 */
function loadUsedExternalUrls() {
  const used = new Set();
  for (const post of listPosts().slice(-EXTERNAL_LINK_COOLDOWN_POSTS)) {
    for (const link of extractLinks(post.body).external) used.add(normalizeUrl(link.url));
  }
  return used;
}

/**
 * Existing blog posts for internal linking, newest first.
 * Returns array of { title, url } objects.
 */
function loadExistingBlogPosts() {
  return listPosts()
    .reverse()
    .slice(0, 30)
    .map((p) => ({ title: p.title, url: p.url }));
}

/** Every URL in the link bank, normalised — the only outside links an article may use. */
function loadLinkBankUrls() {
  try {
    const bank = JSON.parse(fs.readFileSync(LINK_BANK_PATH, "utf-8"));
    const urls = new Set();
    for (const links of Object.values(bank.industries || {})) {
      for (const link of links) urls.add(normalizeUrl(link.url));
    }
    return urls;
  } catch {
    return new Set();
  }
}

/**
 * Selects external links for the writer from the link bank.
 * Returns 6-8 links relevant to the article's industry that haven't been used before.
 */
function selectExternalLinks(keyword, usedUrls) {
  let linkBank;
  try {
    linkBank = JSON.parse(fs.readFileSync(LINK_BANK_PATH, "utf-8"));
  } catch {
    log("contextLoader", "warn", "external-link-bank.json not found");
    return [];
  }

  const industries = detectIndustries(keyword);
  const available = [];
  const seen = new Set();

  for (const industry of industries) {
    const links = linkBank.industries?.[industry] || [];
    for (const link of links) {
      const normalized = normalizeUrl(link.url);
      if (seen.has(normalized)) continue;
      seen.add(normalized);
      available.push({ ...link, industry, recentlyUsed: usedUrls.has(normalized) });
    }
  }

  // Fresh sources first, then industry-specific over general
  available.sort((a, b) => {
    if (a.recentlyUsed !== b.recentlyUsed) return a.recentlyUsed ? 1 : -1;
    const aGeneral = a.industry === "general_quality" || a.industry === "manufacturing" ? 1 : 0;
    const bGeneral = b.industry === "general_quality" || b.industry === "manufacturing" ? 1 : 0;
    return aGeneral - bGeneral;
  });

  // Return 8 links (writer picks 4, has extras as backup)
  return available.slice(0, 8);
}

/**
 * Current editions of the standards, as a prompt block. The writing models
 * predate the 2026 editions, so without this they describe superseded ones.
 */
function loadStandardsFacts() {
  try {
    const facts = JSON.parse(fs.readFileSync(STANDARDS_FACTS_PATH, "utf-8"));
    return [
      `CURRENT STANDARD EDITIONS (as of ${facts.asOf}) — use these, not editions recalled from memory:`,
      ...facts.standards.map((s) => `- ${s.code}: current edition is ${s.current}. ${s.status}`),
      "",
      "RULES FOR EDITIONS:",
      ...facts.writingRules.map((r) => `- ${r}`),
    ].join("\n");
  } catch {
    log("contextLoader", "warn", "standards-facts.json not found — editions will come from the model's memory");
    return "";
  }
}

/**
 * Main function: assembles all context needed by the article writer.
 * Call this BEFORE the writer runs, pass the result into writeArticle().
 */
async function loadContext(keywordBrief) {
  log("contextLoader", "loading", `context for "${keywordBrief.primaryKeyword}"`);

  const existingPosts = loadExistingBlogPosts();
  const usedUrls = loadUsedExternalUrls();

  const externalLinks = selectExternalLinks(keywordBrief.primaryKeyword, usedUrls);

  // Internal targets come from the site's real routes, so every offered link resolves.
  const targets = getLinkTargets();
  const kw = keywordBrief.primaryKeyword.toLowerCase();
  const industries = detectIndustries(kw);
  const mentions = (target) => {
    const digits = /\d{4,5}/.exec(target.match || "")?.[0];
    if (digits) return kw.includes(digits);
    return (target.match || "")
      .toLowerCase()
      .split(/[^a-z]+/)
      .some((word) => word.length > 4 && kw.includes(word));
  };

  const standardPages = targets.filter((t) => t.kind === "standard" && mentions(t));
  const industryPages = targets.filter(
    (t) => t.kind === "industry" && (mentions(t) || industries.some((i) => t.url.includes(i.split("_")[0])))
  );
  const modulePages = targets.filter((t) => t.kind === "module" && mentions(t));
  const generalPages = targets.filter((t) => t.kind === "general");

  // The standard's own page first, then supporting pages; /contact is always offered.
  const relevantServices = [
    ...standardPages.slice(0, 2),
    ...industryPages.slice(0, 2),
    ...modulePages.slice(0, 2),
    ...generalPages,
  ];

  // Pick the most relevant blog posts (top 5)
  const relevantPosts = existingPosts
    .filter((p) => {
      // Rough relevance scoring
      const title = p.title.toLowerCase();
      const keywords = keywordBrief.primaryKeyword.toLowerCase().split(" ");
      return keywords.some((k) => k.length > 3 && title.includes(k));
    })
    .slice(0, 5);

  const context = {
    internalLinks: {
      servicePages: relevantServices,
      blogPosts: relevantPosts,
    },
    externalLinks,
    standardsFacts: loadStandardsFacts(),
    usedExternalUrlCount: usedUrls.size,
    detectedIndustries: detectIndustries(keywordBrief.primaryKeyword),
  };

  log("contextLoader", "ready", `${relevantServices.length} services, ${relevantPosts.length} blog posts, ${externalLinks.length} external links available`);

  return context;
}

/**
 * Builds a diversity brief from recent published articles.
 * Extracts opening patterns, CTA closings, cost figures, and process descriptions
 * so the article writer knows what to AVOID.
 */
async function loadDiversityBrief() {
  log("contextLoader", "diversity", "building diversity brief from recent articles");

  const posts = listPosts().reverse().slice(0, 20);
  if (posts.length === 0) return "";

  // Skip the takeaways box and headings so "opening" means the first real sentence.
  function bodyToText(body) {
    const prose = String(body || "")
      .split("\n")
      .filter((line) => line.trim() && !/^\s*(>|#|\||!\[|[-*+]\s|\d+\.\s)/.test(line))
      .join("\n");
    return toPlainText(prose);
  }

  const recentOpenings = [];
  const recentCTAs = [];
  const costFigures = {};
  let processDescCount = 0;

  const COST_RE = /\$[\d,]+[–\-—]+\$[\d,]+/g;
  const PROCESS_RE = /gap assessment.*?training.*?documentation.*?implementation/i;

  for (const post of posts) {
    const text = bodyToText(post.body);
    if (!text) continue;

    const slug = post.slug || "unknown";
    const sentences = text.split(/(?<=[.!?])\s+/);

    // First sentence = opening pattern
    if (sentences[0]) {
      recentOpenings.push({ text: sentences[0].slice(0, 120), slug });
    }

    // Last 3 sentences = CTA pattern
    const lastSentences = sentences.slice(-3).join(" ").slice(0, 200);
    if (lastSentences) {
      recentCTAs.push({ text: lastSentences, slug });
    }

    // Cost figures
    const costs = text.match(COST_RE) || [];
    for (const c of costs) {
      costFigures[c] = (costFigures[c] || 0) + 1;
    }

    // Process description
    if (PROCESS_RE.test(text)) processDescCount++;
  }

  // Build the brief string
  const lines = [
    "═══════════════════════════════════════════════════════════",
    "DIVERSITY BRIEF — Patterns to AVOID in this article:",
    "═══════════════════════════════════════════════════════════",
    "",
    "RECENT OPENINGS USED:",
  ];

  for (const o of recentOpenings.slice(0, 8)) {
    lines.push(`- "${o.text}..." (${o.slug})`);
  }

  lines.push("", "RECENT CTAs USED:");
  for (const c of recentCTAs.slice(0, 8)) {
    lines.push(`- "${c.text}..." (${c.slug})`);
  }

  lines.push("", "COST FIGURES ALREADY USED:");
  const sortedCosts = Object.entries(costFigures).sort((a, b) => b[1] - a[1]);
  for (const [figure, count] of sortedCosts.slice(0, 10)) {
    lines.push(`- "${figure}" in ${count} article${count > 1 ? "s" : ""}`);
  }

  lines.push(
    "",
    `PROCESS DESCRIPTION COUNT: Used verbatim in ${processDescCount} articles — describe differently this time.`,
    ""
  );

  log("contextLoader", "diversity", `brief built: ${recentOpenings.length} openings, ${recentCTAs.length} CTAs, ${sortedCosts.length} cost figures`);

  return lines.join("\n");
}

module.exports = { loadContext, loadDiversityBrief, detectIndustries, loadLinkBankUrls, loadStandardsFacts };
