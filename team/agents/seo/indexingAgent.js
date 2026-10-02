const https = require("https");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const { log, today } = require("../shared/logger");
const { updateHeartbeat } = require("../shared/heartbeat");
const { SITE_URL, MEMORY_DIR, REPORTS_DIR } = require("../shared/config");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || "";

const SITE_DOMAIN = "https://isocertificationconsultant.ca";
const GSC_SITE_URL = "sc-domain:isocertificationconsultant.ca"; // Domain property in Search Console
const INDEX_LOG_PATH = path.join(MEMORY_DIR, "indexing-log.json");

// ══════════════════════════════════════════════════════════════════
// GOOGLE OAUTH
// ══════════════════════════════════════════════════════════════════

function getAccessToken() {
  return new Promise((resolve, reject) => {
    if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
      return reject(new Error("Missing Google OAuth credentials. Run: node team/scripts/google-auth-setup.js"));
    }
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: "refresh_token",
    });
    const req = https.request({
      hostname: "oauth2.googleapis.com",
      path: "/token",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        const json = JSON.parse(data);
        if (json.access_token) resolve(json.access_token);
        else reject(new Error(`Token refresh failed: ${json.error_description || JSON.stringify(json)}`));
      });
    });
    req.on("error", reject);
    req.write(params.toString());
    req.end();
  });
}

// ══════════════════════════════════════════════════════════════════
// GOOGLE SEARCH CONSOLE API
// ══════════════════════════════════════════════════════════════════

function gscRequest(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: "www.googleapis.com",
      path,
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    if (payload) options.headers["Content-Length"] = Buffer.byteLength(payload);

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        if (res.statusCode >= 400) {
          return reject(new Error(`GSC API ${res.statusCode}: ${data}`));
        }
        try {
          resolve(data ? JSON.parse(data) : { success: true });
        } catch {
          resolve({ success: true, raw: data });
        }
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

/**
 * List all verified sites in Search Console.
 */
async function listSites() {
  const token = await getAccessToken();
  return gscRequest("GET", "/webmasters/v3/sites", null, token);
}

/**
 * Submit the sitemap to Google Search Console.
 */
async function submitSitemap() {
  const token = await getAccessToken();
  const sitemapUrl = encodeURIComponent(`${SITE_DOMAIN}/sitemap.xml`);
  const siteUrl = encodeURIComponent(GSC_SITE_URL);
  return gscRequest("PUT", `/webmasters/v3/sites/${siteUrl}/sitemaps/${sitemapUrl}`, null, token);
}

/**
 * List submitted sitemaps.
 */
async function listSitemaps() {
  const token = await getAccessToken();
  const siteUrl = encodeURIComponent(GSC_SITE_URL);
  return gscRequest("GET", `/webmasters/v3/sites/${siteUrl}/sitemaps`, null, token);
}

/**
 * Request indexing for a specific URL via the URL Inspection API.
 */
async function inspectUrl(pageUrl) {
  const token = await getAccessToken();
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ inspectionUrl: pageUrl, siteUrl: GSC_SITE_URL });
    const req = https.request({
      hostname: "searchconsole.googleapis.com",
      path: "/v1/urlInspection/index:inspect",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        if (res.statusCode >= 400) return reject(new Error(`Inspect API ${res.statusCode}: ${data}`));
        try { resolve(JSON.parse(data)); } catch { resolve({ raw: data }); }
      });
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Get search analytics data (impressions, clicks, CTR, position).
 */
async function getSearchAnalytics(days = 28) {
  const token = await getAccessToken();
  const siteUrl = encodeURIComponent(GSC_SITE_URL);
  const endDate = new Date().toISOString().slice(0, 10);
  const startDate = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

  return gscRequest("POST", `/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`, {
    startDate,
    endDate,
    dimensions: ["query"],
    rowLimit: 25,
    type: "web",
  }, token);
}

/**
 * Get search analytics by page.
 */
async function getPageAnalytics(days = 28) {
  const token = await getAccessToken();
  const siteUrl = encodeURIComponent(GSC_SITE_URL);
  const endDate = new Date().toISOString().slice(0, 10);
  const startDate = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);

  return gscRequest("POST", `/webmasters/v3/sites/${siteUrl}/searchAnalytics/query`, {
    startDate,
    endDate,
    dimensions: ["page"],
    rowLimit: 50,
    type: "web",
  }, token);
}

// ══════════════════════════════════════════════════════════════════
// BING INDEXNOW
// ══════════════════════════════════════════════════════════════════

const INDEXNOW_KEY = "964cad32093f21d421ad7a9bd0b92bf6";

/**
 * Submit URLs to Bing/Yandex via IndexNow protocol.
 */
function submitIndexNow(urls) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      host: "isocertificationconsultant.ca",
      key: INDEXNOW_KEY,
      keyLocation: `https://isocertificationconsultant.ca/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    });

    const req = https.request({
      hostname: "api.indexnow.org",
      path: "/indexnow",
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": Buffer.byteLength(payload),
      },
    }, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

// ══════════════════════════════════════════════════════════════════
// LOGGING
// ══════════════════════════════════════════════════════════════════

function loadIndexLog() {
  try { return JSON.parse(fs.readFileSync(INDEX_LOG_PATH, "utf-8")); } catch { return { submissions: [] }; }
}

function saveIndexLog(data) {
  fs.writeFileSync(INDEX_LOG_PATH, JSON.stringify(data, null, 2) + "\n");
}

function logSubmission(type, urls, result) {
  const indexLog = loadIndexLog();
  indexLog.submissions.push({
    date: new Date().toISOString(),
    type,
    urls: urls.length || 1,
    result: typeof result === "string" ? result : JSON.stringify(result).slice(0, 200),
  });
  // Keep last 100 entries
  if (indexLog.submissions.length > 100) indexLog.submissions = indexLog.submissions.slice(-100);
  saveIndexLog(indexLog);
}

// ══════════════════════════════════════════════════════════════════
// MAIN WORKFLOWS
// ══════════════════════════════════════════════════════════════════

/**
 * Full indexing run: submit sitemap to Google + submit all pages to IndexNow.
 */
async function fullIndex() {
  const results = { google: null, indexNow: null, errors: [] };

  // 1. Google Search Console — submit sitemap
  try {
    log("indexingAgent", "google-sitemap", "submitting");
    await submitSitemap();
    results.google = "sitemap submitted";
    log("indexingAgent", "google-sitemap", "success");
    logSubmission("google-sitemap", ["sitemap.xml"], "success");
  } catch (err) {
    results.google = err.message;
    results.errors.push(`Google: ${err.message}`);
    log("indexingAgent", "google-sitemap-error", err.message);
  }

  // 2. IndexNow — submit all key pages
  const pages = [
    `${SITE_DOMAIN}`,
    `${SITE_DOMAIN}/about`,
    `${SITE_DOMAIN}/contact`,
    `${SITE_DOMAIN}/process`,
    `${SITE_DOMAIN}/blog`,
    `${SITE_DOMAIN}/services/iso-9001`,
    `${SITE_DOMAIN}/services/iso-14001`,
    `${SITE_DOMAIN}/services/iso-45001`,
    `${SITE_DOMAIN}/services/iso-13485`,
    `${SITE_DOMAIN}/services/iso-27001`,
    `${SITE_DOMAIN}/services/iso-22000`,
    `${SITE_DOMAIN}/services/iatf-16949`,
    `${SITE_DOMAIN}/services/as9100`,
    `${SITE_DOMAIN}/services/iso-17025`,
    `${SITE_DOMAIN}/industries/manufacturing`,
    `${SITE_DOMAIN}/industries/automotive`,
    `${SITE_DOMAIN}/industries/aerospace-defence`,
    `${SITE_DOMAIN}/industries/healthcare-medical-devices`,
    `${SITE_DOMAIN}/industries/food-beverage`,
    `${SITE_DOMAIN}/industries/oil-gas-energy`,
    `${SITE_DOMAIN}/industries/construction`,
    `${SITE_DOMAIN}/industries/mining-natural-resources`,
  ];

  try {
    log("indexingAgent", "indexnow", `submitting ${pages.length} pages`);
    const inResult = await submitIndexNow(pages);
    results.indexNow = `${inResult.statusCode} — ${pages.length} pages`;
    log("indexingAgent", "indexnow", `status: ${inResult.statusCode}`);
    logSubmission("indexnow", pages, `status ${inResult.statusCode}`);
  } catch (err) {
    results.indexNow = err.message;
    results.errors.push(`IndexNow: ${err.message}`);
    log("indexingAgent", "indexnow-error", err.message);
  }

  updateHeartbeat("indexingAgent", results.errors.length === 0 ? "ok" : "error",
    `google: ${results.google}, indexnow: ${results.indexNow}`);

  return results;
}

/**
 * Submit new blog posts to BOTH IndexNow (Bing) AND Google.
 * Call this after every blog publish.
 */
async function indexNewPosts(urls) {
  const results = { indexNow: null, google: [], errors: [] };

  // 1. IndexNow (Bing/Yandex) — instant
  try {
    const inResult = await submitIndexNow(urls);
    results.indexNow = `${inResult.statusCode} — ${urls.length} URLs`;
    logSubmission("indexnow-blog", urls, `status ${inResult.statusCode}`);
    log("indexingAgent", "indexnow-blog", `${urls.length} URLs submitted (${inResult.statusCode})`);
  } catch (err) {
    results.errors.push(`IndexNow: ${err.message}`);
    log("indexingAgent", "indexnow-error", err.message);
  }

  // 2. Google — resubmit sitemap (nudges Google to recrawl)
  try {
    await submitSitemap();
    results.google.push("sitemap resubmitted");
    log("indexingAgent", "google-sitemap", "resubmitted after new posts");
  } catch (err) {
    results.errors.push(`Google sitemap: ${err.message}`);
  }

  // 3. Google — inspect each URL (triggers awareness)
  for (const url of urls) {
    try {
      const r = await inspectUrl(url);
      const state = r.inspectionResult?.indexStatusResult?.coverageState || "unknown";
      results.google.push(`${url}: ${state}`);
      log("indexingAgent", "google-inspect", `${url} → ${state}`);
    } catch (err) {
      // URL inspection may fail for brand new URLs — that's ok
      log("indexingAgent", "google-inspect-skip", `${url}: ${err.message.slice(0, 80)}`);
    }
  }

  updateHeartbeat("indexingAgent", results.errors.length === 0 ? "ok" : "error",
    `indexed ${urls.length} new posts`);
  return results;
}

/**
 * Daily indexing loop — find any unindexed pages and submit them.
 * Run this daily to catch anything Google hasn't picked up yet.
 */
async function dailyIndexLoop() {
  log("indexingAgent", "dailyLoop", "starting");
  const results = { checked: 0, notIndexed: [], submitted: 0, errors: [] };

  // 1. Resubmit sitemap (always — it's free and nudges Google)
  try {
    await submitSitemap();
    log("indexingAgent", "dailyLoop", "sitemap resubmitted");
  } catch (err) {
    results.errors.push(`Sitemap: ${err.message}`);
  }

  // 2. Check all key pages for indexing status
  const keyPages = [
    `${SITE_DOMAIN}/`,
    `${SITE_DOMAIN}/about`,
    `${SITE_DOMAIN}/contact`,
    `${SITE_DOMAIN}/process`,
    `${SITE_DOMAIN}/blog`,
    `${SITE_DOMAIN}/services/iso-9001`,
    `${SITE_DOMAIN}/services/iso-14001`,
    `${SITE_DOMAIN}/services/iso-45001`,
    `${SITE_DOMAIN}/services/iso-13485`,
    `${SITE_DOMAIN}/services/iso-22000`,
    `${SITE_DOMAIN}/services/iatf-16949`,
    `${SITE_DOMAIN}/services/iso-17025`,
    `${SITE_DOMAIN}/industries/manufacturing`,
    `${SITE_DOMAIN}/industries/automotive`,
    `${SITE_DOMAIN}/industries/healthcare-medical-devices`,
    `${SITE_DOMAIN}/industries/food-beverage`,
    `${SITE_DOMAIN}/industries/oil-gas-energy`,
    `${SITE_DOMAIN}/industries/construction`,
    `${SITE_DOMAIN}/industries/mining-natural-resources`,
  ];

  // 3. Also check recent blog posts (last 7 days)
  try {
    const publishedPath = path.join(MEMORY_DIR, "published-articles.json");
    if (fs.existsSync(publishedPath)) {
      const articles = JSON.parse(fs.readFileSync(publishedPath, "utf-8"));
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
      const recentSlugs = articles
        .filter((a) => a.date >= weekAgo)
        .map((a) => `${SITE_DOMAIN}/blog/${a.slug}`);
      keyPages.push(...recentSlugs);
    }
  } catch { /* ok */ }

  // 4. Inspect each page
  for (const url of keyPages) {
    try {
      const r = await inspectUrl(url);
      const state = r.inspectionResult?.indexStatusResult?.coverageState || "unknown";
      results.checked++;
      if (state !== "Submitted and indexed") {
        results.notIndexed.push({ url: url.replace(SITE_DOMAIN, ""), state });
      }
    } catch {
      // Skip errors (rate limits, etc.)
    }
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 300));
  }

  // 5. Submit unindexed pages to IndexNow
  if (results.notIndexed.length > 0) {
    const urls = results.notIndexed.map((p) => `${SITE_DOMAIN}${p.url}`);
    try {
      const inResult = await submitIndexNow(urls);
      results.submitted = urls.length;
      logSubmission("indexnow-daily", urls, `status ${inResult.statusCode}`);
      log("indexingAgent", "dailyLoop", `${urls.length} unindexed pages submitted to IndexNow`);
    } catch (err) {
      results.errors.push(`IndexNow daily: ${err.message}`);
    }
  }

  log("indexingAgent", "dailyLoop", `done: ${results.checked} checked, ${results.notIndexed.length} not indexed, ${results.submitted} submitted`);
  updateHeartbeat("indexingAgent", "ok", `${results.checked} checked, ${results.notIndexed.length} unindexed`);
  return results;
}

module.exports = {
  listSites,
  submitSitemap,
  listSitemaps,
  inspectUrl,
  getSearchAnalytics,
  getPageAnalytics,
  submitIndexNow,
  indexNewPosts,
  fullIndex,
  dailyIndexLoop,
  INDEXNOW_KEY,
};
