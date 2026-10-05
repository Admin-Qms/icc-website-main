const fs = require("fs");
const path = require("path");
const https = require("https");
const { claudeJSONFast, claudeCallFast } = require("../shared/claude");
const { log, today } = require("../shared/logger");
const { sendEmail } = require("../shared/notifier");
const { MEMORY_DIR, REPORTS_DIR, SERPAPI_KEY, SITE_URL } = require("../shared/config");
const { updateHeartbeat } = require("../shared/heartbeat");

const TRACKER_PATH = path.join(MEMORY_DIR, "ai-visibility-tracker.json");
const QUERIES_PATH = path.join(MEMORY_DIR, "ai-search-queries.json");
const REPORT_DIR = path.join(REPORTS_DIR, "ai-visibility");

const DOMAIN = "isocertificationconsultants.ca";
const DOMAIN_SHORT = "isocertificationconsultant";

// ── Load / save helpers ──────────────────────────────────────────

function loadTracker() {
  try { return JSON.parse(fs.readFileSync(TRACKER_PATH, "utf-8")); }
  catch { return { lastRun: null, weeklySnapshots: [], keywords: {} }; }
}

function saveTracker(data) {
  fs.writeFileSync(TRACKER_PATH, JSON.stringify(data, null, 2) + "\n");
}

function loadQueries() {
  try { return JSON.parse(fs.readFileSync(QUERIES_PATH, "utf-8")).queries || []; }
  catch { return []; }
}

// ── SerpAPI helper (shared between Google & Bing) ────────────────

function serpApiGet(params) {
  return new Promise((resolve) => {
    if (!SERPAPI_KEY) { resolve({ error: "No SERPAPI_KEY" }); return; }
    params.api_key = SERPAPI_KEY;
    const qs = new URLSearchParams(params);
    const url = `https://serpapi.com/search.json?${qs}`;
    const urlObj = new URL(url);
    const req = https.get({ hostname: urlObj.hostname, path: urlObj.pathname + urlObj.search, timeout: 20000 }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => { try { resolve(JSON.parse(data)); } catch { resolve({ error: "Parse error" }); } });
    });
    req.on("error", (err) => resolve({ error: err.message }));
    req.on("timeout", () => { req.destroy(); resolve({ error: "timeout" }); });
  });
}

function extractDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

// ══════════════════════════════════════════════════════════════════
// ENGINE 1: Google AI Overview (SerpAPI)
// ══════════════════════════════════════════════════════════════════

async function checkGoogle(keyword) {
  const result = await serpApiGet({ q: keyword, location: "Canada", google_domain: "google.ca", engine: "google", num: "30" });
  if (result.error) return { source: "google", error: result.error };

  // AI Overview
  const aiOverview = result.ai_overview || null;
  let aiOverviewCited = false;
  let aiOverviewSources = [];
  if (aiOverview) {
    const text = JSON.stringify(aiOverview).toLowerCase();
    aiOverviewCited = text.includes(DOMAIN_SHORT);
    if (aiOverview.references) aiOverviewSources = aiOverview.references.map((r) => r.link || r.source || "").filter(Boolean);
  }

  // Featured Snippet
  const snippet = result.answer_box || result.featured_snippet || null;
  const snippetCited = snippet ? JSON.stringify(snippet).toLowerCase().includes(DOMAIN_SHORT) : false;

  // Knowledge Graph
  const kg = result.knowledge_graph || null;
  const kgCited = kg ? JSON.stringify(kg).toLowerCase().includes(DOMAIN_SHORT) : false;

  // Organic position
  const organic = result.organic_results || [];
  let organicPosition = null;
  for (let i = 0; i < organic.length; i++) {
    if ((organic[i].link || "").toLowerCase().includes(DOMAIN_SHORT)) { organicPosition = i + 1; break; }
  }

  // People Also Ask
  const paa = result.related_questions || [];
  const paaCount = paa.length;

  // Competitors from AI Overview + top organic
  const competitors = [
    ...aiOverviewSources.filter((s) => !s.includes(DOMAIN_SHORT)).map(extractDomain),
    ...organic.slice(0, 10).map((r) => extractDomain(r.link || "")).filter((d) => !d.includes(DOMAIN_SHORT)),
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 8);

  return {
    source: "google",
    hasAIOverview: !!aiOverview,
    aiOverviewCited,
    aiOverviewSources: aiOverviewSources.length,
    snippetCited,
    kgCited,
    organicPosition,
    paaCount,
    competitors,
  };
}

// ══════════════════════════════════════════════════════════════════
// ENGINE 2: Bing + Copilot (SerpAPI)
// ══════════════════════════════════════════════════════════════════

async function checkBing(keyword) {
  const result = await serpApiGet({ q: keyword, engine: "bing", cc: "CA", count: "20" });
  if (result.error) return { source: "bing", error: result.error };

  // Bing organic
  const organic = result.organic_results || [];
  let organicPosition = null;
  for (let i = 0; i < organic.length; i++) {
    if ((organic[i].link || "").toLowerCase().includes(DOMAIN_SHORT)) { organicPosition = i + 1; break; }
  }

  // Bing AI/Copilot response (SerpAPI may return as sidebar, chat, or ai_overview)
  const copilot = result.ai_overview || result.chat || result.sidebar || null;
  let copilotCited = false;
  if (copilot) {
    const text = JSON.stringify(copilot).toLowerCase();
    copilotCited = text.includes(DOMAIN_SHORT);
  }

  // Featured snippet
  const snippet = result.featured_snippet || null;
  const snippetCited = snippet ? JSON.stringify(snippet).toLowerCase().includes(DOMAIN_SHORT) : false;

  const competitors = organic.slice(0, 10)
    .map((r) => extractDomain(r.link || ""))
    .filter((d) => !d.includes(DOMAIN_SHORT))
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 8);

  return {
    source: "bing",
    hasCopilot: !!copilot,
    copilotCited,
    snippetCited,
    organicPosition,
    competitors,
  };
}

// ══════════════════════════════════════════════════════════════════
// ENGINE 3: Perplexity (Playwright — reusable browser session)
// ══════════════════════════════════════════════════════════════════

async function checkPerplexityBatch(keywords, browser) {
  const results = {};
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  });

  for (const keyword of keywords) {
    try {
      const page = await context.newPage();
      await page.goto("https://www.perplexity.ai/", { timeout: 20000, waitUntil: "domcontentloaded" });

      const input = await page.locator("textarea, input[type='text'], [role='textbox']").first();
      await input.fill(keyword);
      await input.press("Enter");
      await page.waitForTimeout(15000);

      const bodyText = await page.evaluate(() => document.body.innerText);
      const bodyHtml = await page.evaluate(() => document.body.innerHTML);

      const cited = bodyText.toLowerCase().includes(DOMAIN_SHORT) || bodyHtml.toLowerCase().includes(DOMAIN_SHORT);
      const mentioned = bodyText.toLowerCase().includes("iso certification consultant");

      // Extract citation links
      let sources = [];
      try {
        sources = await page.evaluate(() =>
          Array.from(document.querySelectorAll("a[href]"))
            .map((a) => a.href)
            .filter((h) => h.startsWith("http") && !h.includes("perplexity.ai") && !h.includes("google.com"))
        );
      } catch { /* ok */ }

      // Answer snippet (first 300 chars)
      const answerSnippet = bodyText.replace(/[\n\r]+/g, " ").slice(0, 300);

      const competitors = sources
        .filter((s) => !s.includes(DOMAIN_SHORT))
        .map(extractDomain)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 8);

      await page.close();
      results[keyword] = { source: "perplexity", cited, mentioned, sourcesFound: sources.length, answerSnippet, competitors };

      // Rate limit between queries
      await new Promise((r) => setTimeout(r, 3000));
    } catch (err) {
      // Detect CAPTCHA
      if (err.message?.includes("captcha") || err.message?.includes("verify")) {
        log("llmRankTracker", "perplexity-captcha", `CAPTCHA detected — stopping Perplexity checks`);
        for (const remaining of keywords.slice(keywords.indexOf(keyword) + 1)) {
          results[remaining] = { source: "perplexity", error: "CAPTCHA — skipped" };
        }
        break;
      }
      results[keyword] = { source: "perplexity", error: err.message };
    }
  }

  await context.close();
  return results;
}

// ══════════════════════════════════════════════════════════════════
// ENGINE 4: ChatGPT Search (Playwright — search.chatgpt.com)
// ══════════════════════════════════════════════════════════════════

async function checkChatGPTBatch(keywords, browser) {
  const results = {};
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  });

  for (const keyword of keywords) {
    try {
      const page = await context.newPage();
      // Use ChatGPT's public search URL with query param
      const encodedQuery = encodeURIComponent(keyword);
      await page.goto(`https://search.chatgpt.com/?q=${encodedQuery}`, { timeout: 25000, waitUntil: "domcontentloaded" });

      // Wait for response streaming
      await page.waitForTimeout(15000);

      const bodyText = await page.evaluate(() => document.body.innerText);
      const bodyHtml = await page.evaluate(() => document.body.innerHTML);

      const cited = bodyText.toLowerCase().includes(DOMAIN_SHORT) || bodyHtml.toLowerCase().includes(DOMAIN_SHORT);
      const mentioned = bodyText.toLowerCase().includes("iso certification consultant");

      // Extract source links
      let sources = [];
      try {
        sources = await page.evaluate(() =>
          Array.from(document.querySelectorAll("a[href]"))
            .map((a) => a.href)
            .filter((h) => h.startsWith("http") && !h.includes("chatgpt.com") && !h.includes("openai.com"))
        );
      } catch { /* ok */ }

      const answerSnippet = bodyText.replace(/[\n\r]+/g, " ").slice(0, 300);

      const competitors = sources
        .filter((s) => !s.includes(DOMAIN_SHORT))
        .map(extractDomain)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 8);

      await page.close();
      results[keyword] = { source: "chatgpt", cited, mentioned, sourcesFound: sources.length, answerSnippet, competitors };

      await new Promise((r) => setTimeout(r, 3000));
    } catch (err) {
      results[keyword] = { source: "chatgpt", error: err.message };
    }
  }

  await context.close();
  return results;
}

// ══════════════════════════════════════════════════════════════════
// ENGINE 5: Claude Citability Analysis (Haiku — all keywords)
// ══════════════════════════════════════════════════════════════════

async function analyzeCitability(keyword, engineResults) {
  // Ground the analysis in actual results from the other engines
  const googleResult = engineResults.google || {};
  const bingResult = engineResults.bing || {};
  const perplexityResult = engineResults.perplexity || {};
  const chatgptResult = engineResults.chatgpt || {};

  const result = await claudeJSONFast(
    `You are an AI search optimization expert analyzing whether isocertificationconsultants.ca (ISO consulting firm for Canadian manufacturers) is being cited by AI engines. Base your analysis on the ACTUAL results provided.`,
    `Query: "${keyword}"

ACTUAL ENGINE RESULTS:
- Google AI Overview: ${googleResult.hasAIOverview ? "Present" : "None"}, Our site cited: ${googleResult.aiOverviewCited || false}, Organic position: ${googleResult.organicPosition || "Not in top 30"}
- Bing Copilot: ${bingResult.hasCopilot ? "Present" : "None"}, Our site cited: ${bingResult.copilotCited || false}, Organic: ${bingResult.organicPosition || "Not in top 20"}
- Perplexity: Cited: ${perplexityResult.cited ?? "not checked"}, Sources found: ${perplexityResult.sourcesFound || 0}
- ChatGPT Search: Cited: ${chatgptResult.cited ?? "not checked"}, Sources found: ${chatgptResult.sourcesFound || 0}

Competitors appearing: ${[...(googleResult.competitors || []), ...(bingResult.competitors || [])].filter((v, i, a) => a.indexOf(v) === i).slice(0, 5).join(", ") || "none identified"}

Return JSON:
{
  "overallScore": 1-10,
  "topCompetitors": ["domain1.com", "domain2.com", "domain3.com"],
  "contentGap": "what specific content should be created or improved",
  "improvementTip": "the single most impactful action to take",
  "competitorStrength": "weak/moderate/strong"
}`,
    512
  );

  return { source: "claude-analysis", ...result };
}

// ══════════════════════════════════════════════════════════════════
// MAIN TRACKER — runs all engines on all keywords
// ══════════════════════════════════════════════════════════════════

async function runTracker(options = {}) {
  const { quick = false } = options;
  log("llmRankTracker", "track", "starting COMPREHENSIVE AI visibility tracking");

  const allQueries = loadQueries();
  const tracker = loadTracker();
  if (!tracker.weeklySnapshots) tracker.weeklySnapshots = [];
  const todayStr = today();

  // Process ALL keywords (or 5 in quick mode)
  const keywordsToCheck = quick ? allQueries.slice(0, 5) : allQueries;

  if (keywordsToCheck.length === 0) {
    log("llmRankTracker", "track", "no keywords to check");
    updateHeartbeat("llmRankTracker", "complete", "0 keywords checked");
    return { checked: 0 };
  }

  log("llmRankTracker", "track", `checking ${keywordsToCheck.length} keywords across 4 AI engines`);

  // ── Phase 1: SerpAPI checks (Google + Bing) — fast, ~1s each ──
  log("llmRankTracker", "phase-1", "Google + Bing via SerpAPI");
  const googleResults = {};
  const bingResults = {};

  for (const keyword of keywordsToCheck) {
    try {
      const [g, b] = await Promise.all([checkGoogle(keyword), checkBing(keyword)]);
      googleResults[keyword] = g;
      bingResults[keyword] = b;
      log("llmRankTracker", "serpapi", `"${keyword}" → Google AI: ${g.hasAIOverview ? "YES" : "NO"} (cited: ${g.aiOverviewCited}), Bing: ${b.organicPosition ? "#" + b.organicPosition : "—"}`);
    } catch (err) {
      googleResults[keyword] = { source: "google", error: err.message };
      bingResults[keyword] = { source: "bing", error: err.message };
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  // ── Phase 2: Playwright checks (Perplexity + ChatGPT) ─────────
  let perplexityResults = {};
  let chatgptResults = {};

  try {
    const { chromium } = require("playwright");
    const browser = await chromium.launch({ headless: true });

    log("llmRankTracker", "phase-2a", `Perplexity — ${keywordsToCheck.length} keywords`);
    perplexityResults = await checkPerplexityBatch(keywordsToCheck, browser);

    log("llmRankTracker", "phase-2b", `ChatGPT Search — ${keywordsToCheck.length} keywords`);
    chatgptResults = await checkChatGPTBatch(keywordsToCheck, browser);

    await browser.close();
  } catch (err) {
    log("llmRankTracker", "playwright-error", `Browser checks failed: ${err.message}`);
    for (const kw of keywordsToCheck) {
      if (!perplexityResults[kw]) perplexityResults[kw] = { source: "perplexity", error: err.message };
      if (!chatgptResults[kw]) chatgptResults[kw] = { source: "chatgpt", error: err.message };
    }
  }

  // ── Phase 3: Claude citability analysis (Haiku — all keywords) ─
  log("llmRankTracker", "phase-3", `Claude analysis — ${keywordsToCheck.length} keywords`);
  const claudeResults = {};

  for (const keyword of keywordsToCheck) {
    try {
      claudeResults[keyword] = await analyzeCitability(keyword, {
        google: googleResults[keyword],
        bing: bingResults[keyword],
        perplexity: perplexityResults[keyword],
        chatgpt: chatgptResults[keyword],
      });
      log("llmRankTracker", "claude", `"${keyword}" → Score: ${claudeResults[keyword].overallScore}/10`);
    } catch (err) {
      claudeResults[keyword] = { source: "claude-analysis", error: err.message };
    }
  }

  // ── Phase 4: Store results ─────────────────────────────────────
  let googleCited = 0, bingCited = 0, perplexityCited = 0, chatgptCited = 0;

  for (const keyword of keywordsToCheck) {
    if (!tracker.keywords[keyword]) tracker.keywords[keyword] = { history: [] };

    const entry = {
      date: todayStr,
      google: googleResults[keyword] || null,
      bing: bingResults[keyword] || null,
      perplexity: perplexityResults[keyword] || null,
      chatgpt: chatgptResults[keyword] || null,
      claudeAnalysis: claudeResults[keyword] || null,
    };

    if (entry.google?.aiOverviewCited) googleCited++;
    if (entry.bing?.copilotCited) bingCited++;
    if (entry.perplexity?.cited) perplexityCited++;
    if (entry.chatgpt?.cited) chatgptCited++;

    tracker.keywords[keyword].lastChecked = todayStr;
    tracker.keywords[keyword].history.push(entry);
    // Keep last 52 weeks of data
    if (tracker.keywords[keyword].history.length > 52) {
      tracker.keywords[keyword].history = tracker.keywords[keyword].history.slice(-52);
    }
  }

  // ── Phase 5: Weekly snapshot ───────────────────────────────────
  const snapshot = {
    date: todayStr,
    totalKeywords: keywordsToCheck.length,
    googleCited,
    bingCited,
    perplexityCited,
    chatgptCited,
    avgCitabilityScore: 0,
    topCompetitors: [],
  };

  // Compute avg score
  const scores = Object.values(claudeResults).map((r) => r.overallScore).filter(Boolean);
  snapshot.avgCitabilityScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10 : 0;

  // Aggregate competitors across all engines
  const compCount = {};
  for (const kw of keywordsToCheck) {
    for (const engine of [googleResults[kw], bingResults[kw], perplexityResults[kw], chatgptResults[kw]]) {
      for (const c of engine?.competitors || []) { compCount[c] = (compCount[c] || 0) + 1; }
    }
  }
  snapshot.topCompetitors = Object.entries(compCount).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([d, n]) => ({ domain: d, count: n }));

  tracker.weeklySnapshots.push(snapshot);
  if (tracker.weeklySnapshots.length > 52) tracker.weeklySnapshots = tracker.weeklySnapshots.slice(-52);
  tracker.lastRun = todayStr;
  saveTracker(tracker);

  const summary = `${keywordsToCheck.length} keywords × 4 engines — Google: ${googleCited}, Bing: ${bingCited}, Perplexity: ${perplexityCited}, ChatGPT: ${chatgptCited}`;
  log("llmRankTracker", "complete", summary);
  updateHeartbeat("llmRankTracker", "complete", summary);

  return { checked: keywordsToCheck.length, googleCited, bingCited, perplexityCited, chatgptCited, avgScore: snapshot.avgCitabilityScore, date: todayStr };
}

// ══════════════════════════════════════════════════════════════════
// COMPETITOR REPORT — per-engine breakdown
// ══════════════════════════════════════════════════════════════════

function buildCompetitorReport() {
  const tracker = loadTracker();
  const engines = { google: {}, bing: {}, perplexity: {}, chatgpt: {} };

  for (const [, data] of Object.entries(tracker.keywords)) {
    const latest = data.history[data.history.length - 1];
    if (!latest) continue;
    for (const [eng, field] of [["google", "google"], ["bing", "bing"], ["perplexity", "perplexity"], ["chatgpt", "chatgpt"]]) {
      for (const c of latest[field]?.competitors || []) {
        engines[eng][c] = (engines[eng][c] || 0) + 1;
      }
    }
  }

  const perEngine = {};
  for (const [eng, counts] of Object.entries(engines)) {
    perEngine[eng] = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([d, n]) => ({ domain: d, count: n }));
  }

  return perEngine;
}

// ══════════════════════════════════════════════════════════════════
// WEEK-OVER-WEEK COMPARISON
// ══════════════════════════════════════════════════════════════════

function generateWeeklyComparison() {
  const tracker = loadTracker();
  const snaps = tracker.weeklySnapshots || [];
  if (snaps.length < 2) return null;

  const current = snaps[snaps.length - 1];
  const previous = snaps[snaps.length - 2];

  const delta = (curr, prev) => {
    const d = curr - prev;
    return { current: curr, previous: prev, delta: d, direction: d > 0 ? "up" : d < 0 ? "down" : "stable" };
  };

  // Find keywords that flipped
  const flipped = [];
  for (const [keyword, data] of Object.entries(tracker.keywords)) {
    if (data.history.length < 2) continue;
    const curr = data.history[data.history.length - 1];
    const prev = data.history[data.history.length - 2];
    for (const eng of ["google", "bing", "perplexity", "chatgpt"]) {
      const currCited = eng === "google" ? curr[eng]?.aiOverviewCited : eng === "bing" ? curr[eng]?.copilotCited : curr[eng]?.cited;
      const prevCited = eng === "google" ? prev[eng]?.aiOverviewCited : eng === "bing" ? prev[eng]?.copilotCited : prev[eng]?.cited;
      if (currCited && !prevCited) flipped.push({ keyword, engine: eng, direction: "gained" });
      if (!currCited && prevCited) flipped.push({ keyword, engine: eng, direction: "lost" });
    }
  }

  return {
    google: delta(current.googleCited, previous.googleCited),
    bing: delta(current.bingCited, previous.bingCited),
    perplexity: delta(current.perplexityCited, previous.perplexityCited),
    chatgpt: delta(current.chatgptCited, previous.chatgptCited),
    citability: delta(current.avgCitabilityScore, previous.avgCitabilityScore),
    flipped,
    currentDate: current.date,
    previousDate: previous.date,
  };
}

// ══════════════════════════════════════════════════════════════════
// COMPREHENSIVE REPORT — 5 engines, trends, competitors
// ══════════════════════════════════════════════════════════════════

async function generateReport() {
  log("llmRankTracker", "report", "generating COMPREHENSIVE AI visibility report");

  const tracker = loadTracker();
  const keywords = Object.entries(tracker.keywords);
  if (keywords.length === 0) { log("llmRankTracker", "report", "no data"); return null; }

  // Aggregate per keyword
  let totalKeywords = keywords.length;
  let googleCited = 0, googleOverviewPresent = 0, bingCited = 0, bingCopilotPresent = 0;
  let perplexityCited = 0, chatgptCited = 0;
  let scoreSum = 0, scoreCount = 0;
  const keywordRows = [];

  for (const [keyword, data] of keywords) {
    const latest = data.history[data.history.length - 1];
    if (!latest) continue;
    const prev = data.history.length >= 2 ? data.history[data.history.length - 2] : null;

    const g = latest.google || {};
    const b = latest.bing || {};
    const p = latest.perplexity || {};
    const c = latest.chatgpt || {};
    const cl = latest.claudeAnalysis || {};

    if (g.hasAIOverview) googleOverviewPresent++;
    if (g.aiOverviewCited) googleCited++;
    if (b.hasCopilot) bingCopilotPresent++;
    if (b.copilotCited) bingCited++;
    if (p.cited) perplexityCited++;
    if (c.cited) chatgptCited++;
    if (cl.overallScore) { scoreSum += cl.overallScore; scoreCount++; }

    // Trend
    let trend = "new";
    if (prev) {
      const currTotal = (g.aiOverviewCited ? 1 : 0) + (b.copilotCited ? 1 : 0) + (p.cited ? 1 : 0) + (c.cited ? 1 : 0);
      const pg = prev.google || {}; const pb = prev.bing || {}; const pp = prev.perplexity || {}; const pc = prev.chatgpt || {};
      const prevTotal = (pg.aiOverviewCited ? 1 : 0) + (pb.copilotCited ? 1 : 0) + (pp.cited ? 1 : 0) + (pc.cited ? 1 : 0);
      trend = currTotal > prevTotal ? "up" : currTotal < prevTotal ? "down" : "stable";
    }

    keywordRows.push({
      keyword,
      google: g.aiOverviewCited || false,
      googleOverview: g.hasAIOverview || false,
      bing: b.copilotCited || false,
      perplexity: p.cited || false,
      chatgpt: c.cited || false,
      organicGoogle: g.organicPosition || null,
      organicBing: b.organicPosition || null,
      score: cl.overallScore || null,
      trend,
      contentGap: cl.contentGap || null,
      improvementTip: cl.improvementTip || null,
    });
  }

  const avgScore = scoreCount > 0 ? Math.round(scoreSum / scoreCount * 10) / 10 : 0;

  // Competitors per engine
  const competitorReport = buildCompetitorReport();

  // Week over week
  const wow = generateWeeklyComparison();

  // AI summary
  let aiSummary = "";
  try {
    aiSummary = await claudeCallFast(
      "You are a concise AI search visibility analyst. Provide 5-8 bullet points. Include specific wins, losses, competitive threats, and the top 3 action items prioritized by impact.",
      `COMPREHENSIVE AI Visibility Report for isocertificationconsultants.ca (ISO consulting, Canada):
- ${totalKeywords} keywords tracked across 4 AI engines
- Google AI Overview: ${googleCited}/${googleOverviewPresent} cited (${googleOverviewPresent} had overviews)
- Bing Copilot: ${bingCited}/${bingCopilotPresent} cited
- Perplexity: ${perplexityCited}/${totalKeywords} cited
- ChatGPT Search: ${chatgptCited}/${totalKeywords} cited
- Avg citability score: ${avgScore}/10
- Top Google competitors: ${(competitorReport.google || []).slice(0, 5).map((c) => c.domain).join(", ")}
- Top Perplexity competitors: ${(competitorReport.perplexity || []).slice(0, 5).map((c) => c.domain).join(", ")}
${wow ? `- Week-over-week: Google ${wow.google.delta >= 0 ? "+" : ""}${wow.google.delta}, Perplexity ${wow.perplexity.delta >= 0 ? "+" : ""}${wow.perplexity.delta}, ChatGPT ${wow.chatgpt.delta >= 0 ? "+" : ""}${wow.chatgpt.delta}` : "- First week — no comparison data"}
- Keywords gaining citations: ${keywordRows.filter((r) => r.trend === "up").length}
- Keywords losing citations: ${keywordRows.filter((r) => r.trend === "down").length}
- Content gaps identified: ${keywordRows.filter((r) => r.contentGap).length}`,
      1024
    );
  } catch { /* ok */ }

  const report = {
    date: today(),
    totalKeywords,
    googleCited, googleOverviewPresent, bingCited, bingCopilotPresent,
    perplexityCited, chatgptCited, avgScore,
    competitorReport,
    weekOverWeek: wow,
    keywordRows,
    aiSummary,
  };

  // Save
  try {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
    fs.writeFileSync(path.join(REPORT_DIR, `${today()}.json`), JSON.stringify(report, null, 2));
  } catch { /* ok */ }

  // ── Build HTML email ──────────────────────────────────────────
  const d = (val) => val >= 0 ? `<span style="color:#22c55e">+${val}</span>` : `<span style="color:#ef4444">${val}</span>`;

  const statCards = [
    { label: "Google AI", value: googleCited, sub: `/${googleOverviewPresent}`, color: "#22c55e", delta: wow?.google },
    { label: "Bing Copilot", value: bingCited, sub: `/${bingCopilotPresent}`, color: "#0078d4", delta: wow?.bing },
    { label: "Perplexity", value: perplexityCited, sub: `/${totalKeywords}`, color: "#3b82f6", delta: wow?.perplexity },
    { label: "ChatGPT", value: chatgptCited, sub: `/${totalKeywords}`, color: "#10a37f", delta: wow?.chatgpt },
    { label: "Score", value: avgScore, sub: "/10", color: avgScore >= 5 ? "#22c55e" : avgScore >= 3 ? "#f59e0b" : "#ef4444", delta: wow?.citability },
  ].map((s) => {
    const deltaHtml = s.delta ? `<div style="font-size:10px;margin-top:2px">${d(s.delta.delta)}</div>` : "";
    return `<td style="text-align:center;padding:12px;background:#f9fafb;border-radius:8px;width:20%">
      <div style="font-size:24px;font-weight:bold;color:${s.color}">${s.value}${s.sub ? `<span style="font-size:13px;color:#999">${s.sub}</span>` : ""}</div>
      <div style="font-size:10px;color:#666">${s.label}</div>${deltaHtml}</td>`;
  }).join("");

  const kwHtml = keywordRows.map((r) => {
    const icon = (v) => v ? "✅" : "❌";
    const gIcon = r.google ? "✅" : (r.googleOverview ? "❌" : "➖");
    const tIcon = r.trend === "up" ? "📈" : r.trend === "down" ? "📉" : r.trend === "stable" ? "➡️" : "🆕";
    const pos = r.organicGoogle ? `#${r.organicGoogle}` : "—";
    return `<tr>
      <td style="padding:4px 6px;border-bottom:1px solid #eee;font-size:11px;max-width:180px;overflow:hidden">${r.keyword}</td>
      <td style="padding:4px 6px;border-bottom:1px solid #eee;text-align:center">${gIcon}</td>
      <td style="padding:4px 6px;border-bottom:1px solid #eee;text-align:center">${icon(r.bing)}</td>
      <td style="padding:4px 6px;border-bottom:1px solid #eee;text-align:center">${icon(r.perplexity)}</td>
      <td style="padding:4px 6px;border-bottom:1px solid #eee;text-align:center">${icon(r.chatgpt)}</td>
      <td style="padding:4px 6px;border-bottom:1px solid #eee;text-align:center;font-size:11px">${pos}</td>
      <td style="padding:4px 6px;border-bottom:1px solid #eee;text-align:center">${tIcon}</td>
    </tr>`;
  }).join("");

  const compHtml = Object.entries(competitorReport).map(([eng, comps]) => {
    if (!comps.length) return "";
    const engName = { google: "Google AI", bing: "Bing Copilot", perplexity: "Perplexity", chatgpt: "ChatGPT" }[eng] || eng;
    const items = comps.slice(0, 5).map((c) => `<li style="font-size:12px;margin:2px 0">${c.domain} <span style="color:#999">(${c.count})</span></li>`).join("");
    return `<div style="flex:1;min-width:140px"><strong style="font-size:12px;color:#152B4B">${engName}</strong><ul style="padding-left:16px;margin:4px 0">${items}</ul></div>`;
  }).join("");

  // Content gap top 5
  const gaps = keywordRows.filter((r) => r.contentGap).slice(0, 5);
  const gapHtml = gaps.length > 0
    ? gaps.map((g) => `<li style="font-size:12px;margin:4px 0"><strong>${g.keyword}</strong>: ${g.contentGap}</li>`).join("")
    : "<li style='color:#999;font-size:12px'>No content gaps identified</li>";

  const summaryHtml = aiSummary ? aiSummary.split("\n").filter(Boolean).map((l) => `<li style="font-size:12px;margin:3px 0">${l.replace(/^[-•*#]\s*/, "")}</li>`).join("") : "";

  const html = `<div style="font-family:sans-serif;max-width:750px;margin:0 auto">
    <div style="background:#152B4B;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0">
      <h1 style="margin:0;font-size:20px">AI Visibility Tracker — Comprehensive</h1>
      <p style="margin:4px 0 0;opacity:0.8">${today()} · ${totalKeywords} keywords × 4 engines · ISO Certification Consultant</p>
    </div>
    <div style="padding:20px;border:1px solid #e5e7eb;border-top:none">
      <table style="width:100%;border-spacing:8px"><tr>${statCards}</tr></table>

      <h2 style="color:#152B4B;font-size:14px;margin:20px 0 6px">Keyword Results (${totalKeywords})</h2>
      <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse">
        <tr style="background:#f3f4f6;font-size:10px">
          <th style="padding:4px 6px;text-align:left">Keyword</th>
          <th style="padding:4px 6px;text-align:center">Google</th>
          <th style="padding:4px 6px;text-align:center">Bing</th>
          <th style="padding:4px 6px;text-align:center">Perplexity</th>
          <th style="padding:4px 6px;text-align:center">ChatGPT</th>
          <th style="padding:4px 6px;text-align:center">Organic</th>
          <th style="padding:4px 6px;text-align:center">Trend</th>
        </tr>${kwHtml}</table></div>

      <h2 style="color:#152B4B;font-size:14px;margin:20px 0 6px">Competitors by Engine</h2>
      <div style="display:flex;gap:12px;flex-wrap:wrap">${compHtml}</div>

      <h2 style="color:#152B4B;font-size:14px;margin:20px 0 6px">Top Content Gaps</h2>
      <ul style="padding-left:18px">${gapHtml}</ul>

      <h2 style="color:#152B4B;font-size:14px;margin:20px 0 6px">AI Analysis & Action Items</h2>
      <ul style="padding-left:18px">${summaryHtml}</ul>
    </div>
    <div style="background:#f3f4f6;padding:8px;text-align:center;border-radius:0 0 8px 8px;font-size:10px;color:#9ca3af">
      ISO Certification Consultant LLM Rank Tracker · 4 engines · ${totalKeywords} keywords · ${today()}
    </div>
  </div>`;

  await sendEmail({
    subject: `AI Visibility — G:${googleCited}/${googleOverviewPresent} B:${bingCited} P:${perplexityCited} C:${chatgptCited} Score:${avgScore}/10 — ${today()}`,
    html,
    text: `Google: ${googleCited}/${googleOverviewPresent}, Bing: ${bingCited}, Perplexity: ${perplexityCited}, ChatGPT: ${chatgptCited}, Score: ${avgScore}/10`,
  });

  log("llmRankTracker", "report", "comprehensive report sent");
  return report;
}

// ══════════════════════════════════════════════════════════════════
// SUMMARY (no API calls — for morning dashboard)
// ══════════════════════════════════════════════════════════════════

function getSummary() {
  const tracker = loadTracker();
  const keywords = Object.entries(tracker.keywords);
  if (keywords.length === 0) return null;

  let gCited = 0, gTotal = 0, bCited = 0, pCited = 0, cCited = 0;
  for (const [, data] of keywords) {
    const latest = data.history[data.history.length - 1];
    if (!latest) continue;
    if (latest.google?.hasAIOverview) gTotal++;
    if (latest.google?.aiOverviewCited) gCited++;
    if (latest.bing?.copilotCited) bCited++;
    if (latest.perplexity?.cited) pCited++;
    if (latest.chatgpt?.cited) cCited++;
  }

  const wow = generateWeeklyComparison();

  return {
    totalKeywords: keywords.length,
    google: { cited: gCited, total: gTotal },
    bing: { cited: bCited },
    perplexity: { cited: pCited },
    chatgpt: { cited: cCited },
    weekOverWeek: wow,
    lastRun: tracker.lastRun,
  };
}

module.exports = { runTracker, generateReport, getSummary, buildCompetitorReport, generateWeeklyComparison, checkGoogle, checkBing };
