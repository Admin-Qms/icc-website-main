const fs = require("fs");
const path = require("path");
const https = require("https");
const { claudeJSONFast, claudeCallFast } = require("../shared/claude");
const { log, today } = require("../shared/logger");
const { sendEmail } = require("../shared/notifier");
const { MEMORY_DIR, REPORTS_DIR, SERPAPI_KEY } = require("../shared/config");
const { updateHeartbeat } = require("../shared/heartbeat");

const MENTIONS_PATH = path.join(MEMORY_DIR, "brand-mentions.json");
const REPORT_DIR = path.join(REPORTS_DIR, "brand-mentions");

// ══════════════════════════════════════════════════════════════════
// COMPREHENSIVE SEARCH TERMS
// ══════════════════════════════════════════════════════════════════

const BRAND_TERMS = [
  "isocertificationconsultant",
  '"iso certification consultant"',
  '"isocertificationconsultants.ca"',
  '"iso certification consultant inc"',
  '"iso certification consultant canada"',
  '"iso certification consultant toronto"',
  '"iso certification consultant ontario"',
];

const COMPETITOR_TERMS = [
  '"iso consultant canada"',
  '"iso certification consultant canada"',
  '"iso 9001 consultant toronto"',
  '"iso 9001 consultant ontario"',
  '"iso consulting firm canada"',
  '"iso certification services canada"',
  '"iso 14001 consultant canada"',
  '"iso 45001 consultant canada"',
  '"iso 13485 consultant canada"',
  '"quality management consultant canada"',
  '"iso gap analysis canada"',
  '"iso certification cost canada"',
  '"iso audit consultant ontario"',
  '"management system consultant canada"',
];

const REVIEW_SITES = [
  { name: "Clutch", domain: "clutch.co", query: 'site:clutch.co "isocertificationconsultant" OR "iso certification consultant"' },
  { name: "GoodFirms", domain: "goodfirms.co", query: 'site:goodfirms.co "isocertificationconsultant" OR "iso certification consultant"' },
  { name: "G2", domain: "g2.com", query: 'site:g2.com "isocertificationconsultant" OR "iso certification consultant"' },
  { name: "Trustpilot", domain: "trustpilot.com", query: 'site:trustpilot.com "isocertificationconsultant" OR "iso certification consultant"' },
  { name: "Google Business", domain: "google.com/maps", query: 'site:google.com/maps "isocertificationconsultant" OR "iso certification consultant"' },
  { name: "Better Business Bureau", domain: "bbb.org", query: 'site:bbb.org "isocertificationconsultant" OR "iso certification consultant"' },
];

const DIRECTORIES = [
  { name: "Canada411", domain: "canada411.ca", query: 'site:canada411.ca "isocertificationconsultant" OR "iso certification consultant"' },
  { name: "YellowPages.ca", domain: "yellowpages.ca", query: 'site:yellowpages.ca "isocertificationconsultant" OR "iso certification consultant"' },
  { name: "Yelp Canada", domain: "yelp.ca", query: 'site:yelp.ca "isocertificationconsultant" OR "iso certification consultant"' },
  { name: "Manta", domain: "manta.com", query: 'site:manta.com "isocertificationconsultant" OR "iso certification consultant"' },
  { name: "Industry Canada", domain: "ic.gc.ca", query: 'site:ic.gc.ca "isocertificationconsultant" OR "iso certification consultant"' },
  { name: "Ontario Chamber", domain: "occ.ca", query: 'site:occ.ca "isocertificationconsultant" OR "iso certification consultant"' },
  { name: "Canadian Manufacturers", domain: "cme-mec.ca", query: 'site:cme-mec.ca "isocertificationconsultant" OR "iso certification consultant"' },
];

const SOCIAL_PLATFORMS = [
  { name: "LinkedIn", domain: "linkedin.com", query: 'site:linkedin.com/company "isocertificationconsultant" OR "iso certification consultant"' },
  { name: "Facebook", domain: "facebook.com", query: 'site:facebook.com "isocertificationconsultant" OR "iso certification consultant"' },
  { name: "X / Twitter", domain: "x.com", query: 'site:twitter.com OR site:x.com "isocertificationconsultant" OR "iso certification consultant"' },
  { name: "YouTube", domain: "youtube.com", query: 'site:youtube.com "isocertificationconsultant" OR "iso certification consultant"' },
  { name: "Reddit", domain: "reddit.com", query: 'site:reddit.com "isocertificationconsultant" OR "iso certification consultant"' },
];

// Known false positive domains (unrelated companies with similar names) — add as discovered
const DEFAULT_FALSE_POSITIVES = [];

// ── Load / save helpers ──────────────────────────────────────────

function loadMentions() {
  try {
    const data = JSON.parse(fs.readFileSync(MENTIONS_PATH, "utf-8"));
    // Ensure all sections exist
    if (!data.reviewSites) data.reviewSites = {};
    if (!data.directories) data.directories = {};
    if (!data.socialPresence) data.socialPresence = {};
    if (!data.shareOfVoice) data.shareOfVoice = [];
    if (!data.backlinkOpportunities) data.backlinkOpportunities = [];
    if (!data.falsePositiveDomains) data.falsePositiveDomains = [...DEFAULT_FALSE_POSITIVES];
    if (!data.weeklySnapshots) data.weeklySnapshots = [];
    return data;
  } catch {
    return {
      lastRun: null, scans: [], mentions: [], competitors: [],
      reviewSites: {}, directories: {}, socialPresence: {},
      shareOfVoice: [], backlinkOpportunities: [],
      falsePositiveDomains: [...DEFAULT_FALSE_POSITIVES],
      weeklySnapshots: [],
    };
  }
}

function saveMentions(data) {
  fs.writeFileSync(MENTIONS_PATH, JSON.stringify(data, null, 2) + "\n");
}

// ── SerpAPI helpers ──────────────────────────────────────────────

function serpSearch(query, engine = "google") {
  return new Promise((resolve) => {
    if (!SERPAPI_KEY) { resolve({ organic: [], news: [], error: "No SERPAPI_KEY" }); return; }
    const params = new URLSearchParams({ q: query, api_key: SERPAPI_KEY, engine, num: "20" });
    if (engine === "google") { params.set("google_domain", "google.ca"); params.set("location", "Canada"); }
    if (engine === "google_news") { params.set("gl", "ca"); }

    const url = `https://serpapi.com/search.json?${params}`;
    const urlObj = new URL(url);
    const req = https.get({ hostname: urlObj.hostname, path: urlObj.pathname + urlObj.search, timeout: 20000 }, (res) => {
      let data = "";
      res.on("data", (chunk) => data += chunk);
      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          resolve({
            organic: result.organic_results || [],
            news: result.news_results || [],
            totalResults: result.search_information?.total_results || 0,
          });
        } catch { resolve({ organic: [], news: [], error: "Parse error" }); }
      });
    });
    req.on("error", (err) => resolve({ organic: [], news: [], error: err.message }));
    req.on("timeout", () => { req.destroy(); resolve({ organic: [], news: [], error: "timeout" }); });
  });
}

function extractDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max) + "..." : str;
}

// ══════════════════════════════════════════════════════════════════
// 1. SCAN BRAND MENTIONS (Web + News)
// ══════════════════════════════════════════════════════════════════

async function scanMentions() {
  log("brandMentionMonitor", "scan", "starting comprehensive brand mention scan");
  const data = loadMentions();
  const todayStr = today();
  const newMentions = [];
  const knownUrls = new Set(data.mentions.map((m) => m.url));
  const falsePositives = new Set(data.falsePositiveDomains);

  for (const term of BRAND_TERMS) {
    log("brandMentionMonitor", "web-search", term);

    // Google Web search
    const webResults = await serpSearch(term, "google");
    for (const result of webResults.organic) {
      const url = result.link || "";
      const domain = extractDomain(url);
      if (url.includes("isocertificationconsultants.ca")) continue; // Skip our own site
      if (knownUrls.has(url)) continue;
      if (falsePositives.has(domain)) continue;

      newMentions.push({
        url, title: result.title || "", snippet: result.snippet || "",
        source: "web", searchTerm: term, domain, date: todayStr, sentiment: null,
      });
      knownUrls.add(url);
    }

    // Google News search (dedicated news engine)
    const newsResults = await serpSearch(term, "google_news");
    for (const result of newsResults.news || newsResults.organic || []) {
      const url = result.link || "";
      const domain = extractDomain(url);
      if (url.includes("isocertificationconsultants.ca")) continue;
      if (knownUrls.has(url)) continue;
      if (falsePositives.has(domain)) continue;

      newMentions.push({
        url, title: result.title || "", snippet: result.snippet || "",
        source: "news", searchTerm: term, domain, date: result.date || todayStr, sentiment: null,
      });
      knownUrls.add(url);
    }

    await new Promise((r) => setTimeout(r, 1000));
  }

  log("brandMentionMonitor", "scan", `found ${newMentions.length} new mentions (pre-sentiment)`);

  // Enhanced sentiment analysis with false positive detection
  if (newMentions.length > 0) {
    try {
      const sentimentResults = await claudeJSONFast(
        `You are a brand monitoring analyst for ISO Certification Consultant, an ISO consulting firm in Canada (isocertificationconsultants.ca). Analyze each mention carefully. CRITICAL: detect false positives — other companies with similar names that are NOT ISO Certification Consultant.`,
        `Analyze sentiment and classify each mention. Return JSON array:

${newMentions.map((m, i) => `${i + 1}. [${m.domain}] "${m.title}" — ${m.snippet}`).join("\n")}

For each return:
{
  "index": 0,
  "sentiment": "positive/neutral/negative/mixed",
  "category": "review/news/directory/forum/blog/social/competitor-mention/industry-report/job-posting",
  "priority": "critical/high/medium/low",
  "actionRequired": "respond/claim/monitor/amplify/ignore",
  "actionDetail": "specific action to take",
  "isFalsePositive": true/false,
  "falsePositiveReason": "different company" or null
}`,
        2048
      );

      const sentiments = Array.isArray(sentimentResults) ? sentimentResults : [];
      const newFalsePositiveDomains = [];

      for (const s of sentiments) {
        if (s.index !== undefined && newMentions[s.index]) {
          newMentions[s.index].sentiment = s.sentiment;
          newMentions[s.index].category = s.category;
          newMentions[s.index].priority = s.priority;
          newMentions[s.index].actionRequired = s.actionRequired;
          newMentions[s.index].actionDetail = s.actionDetail;
          newMentions[s.index].isFalsePositive = s.isFalsePositive || false;

          if (s.isFalsePositive && newMentions[s.index].domain) {
            newFalsePositiveDomains.push(newMentions[s.index].domain);
          }
        }
      }

      // Add newly detected false positive domains
      for (const fp of newFalsePositiveDomains) {
        if (!data.falsePositiveDomains.includes(fp)) {
          data.falsePositiveDomains.push(fp);
          log("brandMentionMonitor", "false-positive", `Auto-added: ${fp}`);
        }
      }
    } catch (err) {
      log("brandMentionMonitor", "sentiment-error", err.message);
    }
  }

  // Filter out false positives before storing
  const realMentions = newMentions.filter((m) => !m.isFalsePositive);
  const filtered = newMentions.length - realMentions.length;

  data.mentions.push(...realMentions);
  if (data.mentions.length > 1000) data.mentions = data.mentions.slice(-1000);

  data.scans.push({ date: todayStr, newMentions: realMentions.length, filtered, totalMentions: data.mentions.length });
  if (data.scans.length > 90) data.scans = data.scans.slice(-90);
  data.lastRun = todayStr;
  saveMentions(data);

  updateHeartbeat("brandMentionMonitor", "complete", `${realMentions.length} new mentions (${filtered} false positives filtered)`);
  return { newMentions: realMentions.length, filtered, totalMentions: data.mentions.length };
}

// ══════════════════════════════════════════════════════════════════
// 2. SCAN COMPETITORS + SHARE OF VOICE
// ══════════════════════════════════════════════════════════════════

async function scanCompetitors() {
  log("brandMentionMonitor", "competitors", "scanning competitive landscape (14 terms)");
  const data = loadMentions();
  const todayStr = today();
  const competitorData = [];
  const sovData = [];

  for (const term of COMPETITOR_TERMS) {
    const results = await serpSearch(term, "google");
    const top20 = results.organic.slice(0, 20);

    const topResults = top20.map((r, i) => ({
      position: i + 1,
      domain: extractDomain(r.link || ""),
      title: r.title || "",
      url: r.link || "",
      isUs: (r.link || "").includes("isocertificationconsultant"),
    }));

    const ourPosition = topResults.find((r) => r.isUs)?.position || null;
    const ourCount = topResults.filter((r) => r.isUs).length;

    // Share of Voice: our presence in top 20
    const domainCounts = {};
    for (const r of topResults) {
      if (!r.isUs) domainCounts[r.domain] = (domainCounts[r.domain] || 0) + 1;
    }

    competitorData.push({
      query: term.replace(/"/g, ""),
      date: todayStr,
      ourPosition,
      topCompetitors: topResults.filter((r) => !r.isUs).slice(0, 5).map((r) => ({ domain: r.domain, position: r.position })),
    });

    sovData.push({
      date: todayStr,
      query: term.replace(/"/g, ""),
      ourShare: Math.round(ourCount / Math.max(top20.length, 1) * 100),
      ourPosition,
      competitors: Object.fromEntries(
        Object.entries(domainCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
      ),
    });

    await new Promise((r) => setTimeout(r, 1000));
  }

  data.competitors.push(...competitorData);
  if (data.competitors.length > 500) data.competitors = data.competitors.slice(-500);

  data.shareOfVoice.push(...sovData);
  if (data.shareOfVoice.length > 500) data.shareOfVoice = data.shareOfVoice.slice(-500);

  saveMentions(data);
  log("brandMentionMonitor", "competitors", `tracked ${competitorData.length} competitive queries`);
  return competitorData;
}

// ══════════════════════════════════════════════════════════════════
// 3. SCAN REVIEW SITES
// ══════════════════════════════════════════════════════════════════

async function checkReviewSites() {
  log("brandMentionMonitor", "reviews", "checking review site presence");
  const data = loadMentions();
  const todayStr = today();

  for (const site of REVIEW_SITES) {
    const results = await serpSearch(site.query, "google");
    const found = results.organic.length > 0;
    const firstResult = results.organic[0];

    data.reviewSites[site.name] = {
      domain: site.domain,
      listed: found,
      url: found ? (firstResult.link || null) : null,
      title: found ? (firstResult.title || null) : null,
      snippet: found ? truncate(firstResult.snippet || "", 150) : null,
      lastChecked: todayStr,
    };

    log("brandMentionMonitor", "review-check", `${site.name}: ${found ? "LISTED" : "NOT LISTED"}`);
    await new Promise((r) => setTimeout(r, 1000));
  }

  saveMentions(data);
  const listed = Object.values(data.reviewSites).filter((r) => r.listed).length;
  return { total: REVIEW_SITES.length, listed, sites: data.reviewSites };
}

// ══════════════════════════════════════════════════════════════════
// 4. SCAN CANADIAN DIRECTORIES
// ══════════════════════════════════════════════════════════════════

async function checkDirectories() {
  log("brandMentionMonitor", "directories", "checking Canadian business directory presence");
  const data = loadMentions();
  const todayStr = today();

  for (const dir of DIRECTORIES) {
    const results = await serpSearch(dir.query, "google");
    const found = results.organic.length > 0;
    const firstResult = results.organic[0];

    data.directories[dir.name] = {
      domain: dir.domain,
      listed: found,
      url: found ? (firstResult.link || null) : null,
      title: found ? (firstResult.title || null) : null,
      lastChecked: todayStr,
    };

    log("brandMentionMonitor", "directory-check", `${dir.name}: ${found ? "LISTED" : "NOT LISTED"}`);
    await new Promise((r) => setTimeout(r, 1000));
  }

  saveMentions(data);
  const listed = Object.values(data.directories).filter((d) => d.listed).length;
  return { total: DIRECTORIES.length, listed, directories: data.directories };
}

// ══════════════════════════════════════════════════════════════════
// 5. SCAN SOCIAL MEDIA PRESENCE
// ══════════════════════════════════════════════════════════════════

async function checkSocialPresence() {
  log("brandMentionMonitor", "social", "checking social media presence");
  const data = loadMentions();
  const todayStr = today();

  for (const platform of SOCIAL_PLATFORMS) {
    const results = await serpSearch(platform.query, "google");
    const found = results.organic.length > 0;
    const firstResult = results.organic[0];

    data.socialPresence[platform.name] = {
      domain: platform.domain,
      found,
      url: found ? (firstResult.link || null) : null,
      title: found ? (firstResult.title || null) : null,
      lastChecked: todayStr,
    };

    log("brandMentionMonitor", "social-check", `${platform.name}: ${found ? "FOUND" : "NOT FOUND"}`);
    await new Promise((r) => setTimeout(r, 1000));
  }

  saveMentions(data);
  const foundCount = Object.values(data.socialPresence).filter((s) => s.found).length;
  return { total: SOCIAL_PLATFORMS.length, found: foundCount, platforms: data.socialPresence };
}

// ══════════════════════════════════════════════════════════════════
// 6. DETECT BACKLINK OPPORTUNITIES
// ══════════════════════════════════════════════════════════════════

async function detectBacklinkOpportunities() {
  log("brandMentionMonitor", "backlinks", "detecting backlink opportunities");
  const data = loadMentions();

  // Mentions where ISO Certification Consultant is mentioned but may not link to us
  const recentMentions = data.mentions.filter((m) => {
    const age = (new Date() - new Date(m.date)) / (1000 * 60 * 60 * 24);
    return age < 30 && m.sentiment !== "negative" && !m.isFalsePositive;
  });

  // Unlisted review sites and directories
  const unlistedReviews = Object.entries(data.reviewSites).filter(([, r]) => !r.listed).map(([name]) => name);
  const unlistedDirs = Object.entries(data.directories).filter(([, d]) => !d.listed).map(([name]) => name);

  const opportunities = [];

  // Type 1: Mentions to convert into backlinks
  for (const m of recentMentions.slice(0, 10)) {
    opportunities.push({
      type: "mention-to-link",
      domain: m.domain,
      url: m.url,
      title: m.title,
      action: `Request link addition — mention exists but may not link to isocertificationconsultants.ca`,
      priority: m.priority === "high" ? "high" : "medium",
    });
  }

  // Type 2: Unclaimed review site listings
  for (const name of unlistedReviews) {
    const site = REVIEW_SITES.find((s) => s.name === name);
    opportunities.push({
      type: "claim-listing",
      domain: site?.domain || name,
      url: `https://${site?.domain || name}`,
      title: `Create ${name} listing`,
      action: `Create a business profile on ${name} — important for AI engine credibility signals`,
      priority: "high",
    });
  }

  // Type 3: Unclaimed directory listings
  for (const name of unlistedDirs) {
    const dir = DIRECTORIES.find((d) => d.name === name);
    opportunities.push({
      type: "claim-listing",
      domain: dir?.domain || name,
      url: `https://${dir?.domain || name}`,
      title: `Create ${name} listing`,
      action: `Create a listing on ${name} — Canadian business directory for local SEO`,
      priority: "medium",
    });
  }

  data.backlinkOpportunities = opportunities;
  saveMentions(data);

  log("brandMentionMonitor", "backlinks", `${opportunities.length} opportunities found`);
  return opportunities;
}

// ══════════════════════════════════════════════════════════════════
// 7. FULL SCAN ORCHESTRATOR
// ══════════════════════════════════════════════════════════════════

async function runFullScan(options = {}) {
  const { includeDirectories = true } = options;
  log("brandMentionMonitor", "full-scan", "starting comprehensive brand scan");

  const mentionResult = await scanMentions();
  const competitorResult = await scanCompetitors();

  let reviewResult = null;
  let directoryResult = null;
  let socialResult = null;

  if (includeDirectories) {
    reviewResult = await checkReviewSites();
    directoryResult = await checkDirectories();
    socialResult = await checkSocialPresence();
  }

  const backlinkResult = await detectBacklinkOpportunities();

  // Weekly snapshot
  const data = loadMentions();
  const todayStr = today();
  const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentMentions = data.mentions.filter((m) => m.date >= sevenDaysAgo.toISOString().slice(0, 10));

  data.weeklySnapshots.push({
    date: todayStr,
    mentions: recentMentions.length,
    positive: recentMentions.filter((m) => m.sentiment === "positive").length,
    negative: recentMentions.filter((m) => m.sentiment === "negative").length,
    reviewSitesListed: Object.values(data.reviewSites).filter((r) => r.listed).length,
    directoriesListed: Object.values(data.directories).filter((d) => d.listed).length,
    socialPresenceCount: Object.values(data.socialPresence).filter((s) => s.found).length,
    backlinkOpportunities: backlinkResult.length,
  });
  if (data.weeklySnapshots.length > 52) data.weeklySnapshots = data.weeklySnapshots.slice(-52);
  saveMentions(data);

  return { mentionResult, competitorResult, reviewResult, directoryResult, socialResult, backlinkResult };
}

// ══════════════════════════════════════════════════════════════════
// 8. COMPREHENSIVE REPORT
// ══════════════════════════════════════════════════════════════════

async function generateReport() {
  log("brandMentionMonitor", "report", "generating comprehensive brand report");
  const data = loadMentions();

  if (data.mentions.length === 0 && Object.keys(data.reviewSites).length === 0) {
    log("brandMentionMonitor", "report", "no data — run scan first");
    return null;
  }

  // Recent mentions (7 days)
  const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysStr = sevenDaysAgo.toISOString().slice(0, 10);
  const recentMentions = data.mentions.filter((m) => m.date >= sevenDaysStr);
  const positive = recentMentions.filter((m) => m.sentiment === "positive");
  const negative = recentMentions.filter((m) => m.sentiment === "negative");
  const highPriority = recentMentions.filter((m) => m.priority === "high" || m.priority === "critical");
  const actionable = recentMentions.filter((m) => m.actionRequired && m.actionRequired !== "ignore" && m.actionRequired !== "monitor");

  // Review sites
  const reviewSites = data.reviewSites || {};
  const reviewListed = Object.values(reviewSites).filter((r) => r.listed).length;

  // Directories
  const directories = data.directories || {};
  const dirListed = Object.values(directories).filter((d) => d.listed).length;

  // Social
  const social = data.socialPresence || {};
  const socialFound = Object.values(social).filter((s) => s.found).length;

  // Share of Voice
  const latestSov = {};
  for (const s of data.shareOfVoice || []) { latestSov[s.query] = s; }

  // Backlink opportunities
  const backlinks = data.backlinkOpportunities || [];
  const highBacklinks = backlinks.filter((b) => b.priority === "high");

  // Competitor positions
  const latestCompetitors = {};
  for (const c of data.competitors || []) { latestCompetitors[c.query] = c; }

  // Week over week
  const snaps = data.weeklySnapshots || [];
  const wow = snaps.length >= 2 ? {
    mentions: snaps[snaps.length - 1].mentions - snaps[snaps.length - 2].mentions,
    reviews: snaps[snaps.length - 1].reviewSitesListed - snaps[snaps.length - 2].reviewSitesListed,
  } : null;

  // AI summary
  let aiSummary = "";
  try {
    aiSummary = await claudeCallFast(
      "You are a brand monitoring expert. Provide 5-8 actionable bullet points. Include competitive threats, reputation status, and the top 3 priorities.",
      `COMPREHENSIVE Brand Report for ISO Certification Consultant (ISO consulting, Canada):
- Mentions this week: ${recentMentions.length} (${positive.length} positive, ${negative.length} negative)
- High priority: ${highPriority.length}, Actionable: ${actionable.length}
- All-time mentions: ${data.mentions.length}
- Review sites: ${reviewListed}/${REVIEW_SITES.length} listed (Missing: ${Object.entries(reviewSites).filter(([,r]) => !r.listed).map(([n]) => n).join(", ") || "none"})
- Directories: ${dirListed}/${DIRECTORIES.length} listed
- Social media: ${socialFound}/${SOCIAL_PLATFORMS.length} found
- Backlink opportunities: ${backlinks.length} (${highBacklinks.length} high priority)
- Competitor landscape: ${Object.values(latestCompetitors).map((c) => `"${c.query}": ${c.ourPosition ? "#" + c.ourPosition : "not ranked"}`).join(", ")}
- False positive domains filtered: ${data.falsePositiveDomains.length}`,
      1024
    );
  } catch { /* ok */ }

  const report = {
    date: today(),
    recentMentions: recentMentions.length, positive: positive.length, negative: negative.length,
    highPriority: highPriority.length, actionable: actionable.length, totalAllTime: data.mentions.length,
    reviewSites: { listed: reviewListed, total: REVIEW_SITES.length, details: reviewSites },
    directories: { listed: dirListed, total: DIRECTORIES.length, details: directories },
    social: { found: socialFound, total: SOCIAL_PLATFORMS.length, details: social },
    backlinkOpportunities: backlinks.length, highBacklinks: highBacklinks.length,
    competitorPositions: latestCompetitors,
    shareOfVoice: latestSov,
    aiSummary,
  };

  // Save
  try {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
    fs.writeFileSync(path.join(REPORT_DIR, `${today()}.json`), JSON.stringify(report, null, 2));
  } catch { /* ok */ }

  // ── Build HTML email ──────────────────────────────────────────
  const statCards = `
    <td style="text-align:center;padding:10px;background:#f0fdf4;border-radius:8px">
      <div style="font-size:24px;font-weight:bold;color:#22c55e">${recentMentions.length}</div>
      <div style="font-size:10px;color:#666">This Week</div>
    </td>
    <td style="text-align:center;padding:10px;background:${negative.length > 0 ? "#fef2f2" : "#f0fdf4"};border-radius:8px">
      <div style="font-size:24px;font-weight:bold;color:${negative.length > 0 ? "#ef4444" : "#22c55e"}">${negative.length}</div>
      <div style="font-size:10px;color:#666">Negative</div>
    </td>
    <td style="text-align:center;padding:10px;background:#eff6ff;border-radius:8px">
      <div style="font-size:24px;font-weight:bold;color:#3b82f6">${reviewListed}/${REVIEW_SITES.length}</div>
      <div style="font-size:10px;color:#666">Review Sites</div>
    </td>
    <td style="text-align:center;padding:10px;background:#fefce8;border-radius:8px">
      <div style="font-size:24px;font-weight:bold;color:#f59e0b">${dirListed}/${DIRECTORIES.length}</div>
      <div style="font-size:10px;color:#666">Directories</div>
    </td>
    <td style="text-align:center;padding:10px;background:#fdf4ff;border-radius:8px">
      <div style="font-size:24px;font-weight:bold;color:#a855f7">${backlinks.length}</div>
      <div style="font-size:10px;color:#666">Link Opps</div>
    </td>`;

  // Action items
  const actionHtml = actionable.length > 0
    ? actionable.slice(0, 8).map((m) => {
        const icon = m.actionRequired === "respond" ? "💬" : m.actionRequired === "claim" ? "📋" : m.actionRequired === "amplify" ? "📢" : "🔗";
        return `<tr>
          <td style="padding:4px 6px;border-bottom:1px solid #eee;font-size:11px">${icon} ${m.actionRequired}</td>
          <td style="padding:4px 6px;border-bottom:1px solid #eee;font-size:11px"><a href="${m.url}" style="color:#059CB7">${truncate(m.title, 45)}</a></td>
          <td style="padding:4px 6px;border-bottom:1px solid #eee;font-size:10px;color:#666">${m.actionDetail || ""}</td>
        </tr>`;
      }).join("")
    : '<tr><td colspan="3" style="padding:8px;color:#999;font-size:12px">No actions required this week</td></tr>';

  // Review & Directory presence
  const presenceRows = (items, data) => Object.entries(data).map(([name, info]) => {
    const icon = info.listed || info.found ? "✅" : "❌";
    const action = info.listed || info.found ? `<a href="${info.url}" style="color:#059CB7;font-size:10px">View</a>` : '<span style="color:#ef4444;font-size:10px">Create listing</span>';
    return `<tr>
      <td style="padding:3px 6px;border-bottom:1px solid #eee;font-size:11px">${icon} ${name}</td>
      <td style="padding:3px 6px;border-bottom:1px solid #eee;font-size:11px">${action}</td>
    </tr>`;
  }).join("");

  // Competitor landscape
  const compHtml = Object.values(latestCompetitors).slice(0, 8).map((c) => {
    const posColor = c.ourPosition ? (c.ourPosition <= 3 ? "#22c55e" : c.ourPosition <= 10 ? "#f59e0b" : "#ef4444") : "#ef4444";
    return `<div style="margin:4px 0;padding:6px 10px;background:#f9fafb;border-radius:4px;border-left:3px solid ${posColor};font-size:12px">
      <strong>"${c.query}"</strong> <span style="float:right;font-weight:bold;color:${posColor}">${c.ourPosition ? `#${c.ourPosition}` : "Not ranked"}</span>
      <div style="font-size:10px;color:#666">${c.topCompetitors.slice(0, 3).map((t) => `${t.domain} (#${t.position})`).join(" · ")}</div>
    </div>`;
  }).join("");

  // Backlink opportunities (high priority)
  const backlinkHtml = highBacklinks.slice(0, 5).map((b) => {
    const icon = b.type === "claim-listing" ? "📋" : "🔗";
    return `<li style="font-size:12px;margin:3px 0">${icon} <strong>${b.domain}</strong>: ${b.action}</li>`;
  }).join("") || '<li style="color:#999;font-size:12px">No high-priority opportunities</li>';

  const summaryHtml = aiSummary ? aiSummary.split("\n").filter(Boolean).map((l) => `<li style="font-size:12px;margin:3px 0">${l.replace(/^[-•*#]\s*/, "")}</li>`).join("") : "";

  const html = `<div style="font-family:sans-serif;max-width:750px;margin:0 auto">
    <div style="background:#152B4B;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0">
      <h1 style="margin:0;font-size:20px">Brand Monitor — Comprehensive</h1>
      <p style="margin:4px 0 0;opacity:0.8">${today()} · ISO Certification Consultant</p>
    </div>
    <div style="padding:20px;border:1px solid #e5e7eb;border-top:none">
      <table style="width:100%;border-spacing:8px"><tr>${statCards}</tr></table>

      ${highPriority.length > 0 ? `<div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:6px;padding:10px;margin:16px 0">
        <strong style="color:#92400e;font-size:13px">🔥 ${highPriority.length} High Priority Mention(s) Requiring Attention</strong>
      </div>` : ""}

      <h2 style="color:#152B4B;font-size:14px;margin:20px 0 6px">Action Items (${actionable.length})</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr style="background:#f3f4f6;font-size:10px"><th style="padding:3px 6px;text-align:left">Action</th><th style="padding:3px 6px;text-align:left">Mention</th><th style="padding:3px 6px;text-align:left">Detail</th></tr>
        ${actionHtml}
      </table>

      <div style="display:flex;gap:16px;margin-top:20px">
        <div style="flex:1">
          <h2 style="color:#152B4B;font-size:14px;margin:0 0 6px">Review Sites (${reviewListed}/${REVIEW_SITES.length})</h2>
          <table style="width:100%;border-collapse:collapse">${presenceRows(REVIEW_SITES, reviewSites)}</table>
        </div>
        <div style="flex:1">
          <h2 style="color:#152B4B;font-size:14px;margin:0 0 6px">Directories (${dirListed}/${DIRECTORIES.length})</h2>
          <table style="width:100%;border-collapse:collapse">${presenceRows(DIRECTORIES, directories)}</table>
        </div>
      </div>

      <h2 style="color:#152B4B;font-size:14px;margin:0 0 6px">Social Media (${socialFound}/${SOCIAL_PLATFORMS.length})</h2>
      <table style="width:100%;border-collapse:collapse">${presenceRows(SOCIAL_PLATFORMS, social)}</table>

      <h2 style="color:#152B4B;font-size:14px;margin:20px 0 6px">Competitive Landscape (${Object.keys(latestCompetitors).length} terms)</h2>
      ${compHtml || '<p style="color:#999;font-size:12px">No competitor data</p>'}

      <h2 style="color:#152B4B;font-size:14px;margin:20px 0 6px">🔗 High Priority Backlink Opportunities</h2>
      <ul style="padding-left:18px">${backlinkHtml}</ul>

      <h2 style="color:#152B4B;font-size:14px;margin:20px 0 6px">Analysis & Priorities</h2>
      <ul style="padding-left:18px">${summaryHtml}</ul>
    </div>
    <div style="background:#f3f4f6;padding:8px;text-align:center;border-radius:0 0 8px 8px;font-size:10px;color:#9ca3af">
      ISO Certification Consultant Brand Monitor · ${BRAND_TERMS.length} brand terms · ${COMPETITOR_TERMS.length} competitor terms · ${today()}
    </div>
  </div>`;

  await sendEmail({
    subject: `Brand Monitor — ${recentMentions.length} mentions | Reviews: ${reviewListed}/${REVIEW_SITES.length} | Dirs: ${dirListed}/${DIRECTORIES.length} | ${backlinks.length} link opps — ${today()}`,
    html,
    text: `Mentions: ${recentMentions.length}, Reviews: ${reviewListed}/${REVIEW_SITES.length}, Dirs: ${dirListed}/${DIRECTORIES.length}, Backlinks: ${backlinks.length}`,
  });

  log("brandMentionMonitor", "report", "comprehensive report sent");
  return report;
}

// ══════════════════════════════════════════════════════════════════
// 9. SUMMARY (no API calls)
// ══════════════════════════════════════════════════════════════════

function getSummary() {
  const data = loadMentions();
  if (data.mentions.length === 0) return null;

  const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recent = data.mentions.filter((m) => m.date >= sevenDaysAgo.toISOString().slice(0, 10));

  return {
    recentMentions: recent.length,
    positive: recent.filter((m) => m.sentiment === "positive").length,
    negative: recent.filter((m) => m.sentiment === "negative").length,
    highPriority: recent.filter((m) => m.priority === "high" || m.priority === "critical").length,
    totalAllTime: data.mentions.length,
    reviewSites: { listed: Object.values(data.reviewSites).filter((r) => r.listed).length, total: REVIEW_SITES.length },
    directories: { listed: Object.values(data.directories).filter((d) => d.listed).length, total: DIRECTORIES.length },
    social: { found: Object.values(data.socialPresence).filter((s) => s.found).length, total: SOCIAL_PLATFORMS.length },
    backlinkOpportunities: (data.backlinkOpportunities || []).length,
    lastRun: data.lastRun,
  };
}

module.exports = { scanMentions, scanCompetitors, checkReviewSites, checkDirectories, checkSocialPresence, detectBacklinkOpportunities, runFullScan, generateReport, getSummary };
