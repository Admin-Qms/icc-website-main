/**
 * analyticsManager.js — GA4 Data API integration for daily reports
 *
 * Pulls traffic, demographics, top pages, referral sources, and device data
 * from Google Analytics 4 via OAuth2 refresh token flow.
 */

const https = require("https");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "";
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || "";

function post(url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = typeof body === "string" ? body : JSON.stringify(body);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data), ...headers },
        timeout: 30000,
      },
      (res) => {
        let buf = "";
        res.on("data", (c) => (buf += c));
        res.on("end", () => {
          try { resolve(JSON.parse(buf)); } catch { resolve(buf); }
        });
      }
    );
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error("timeout")); });
    req.write(data);
    req.end();
  });
}

async function getAccessToken() {
  const params = new URLSearchParams({
    refresh_token: REFRESH_TOKEN,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "refresh_token",
  });
  const res = await post("https://oauth2.googleapis.com/token", params.toString(), {
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": Buffer.byteLength(params.toString()),
  });
  if (!res.access_token) throw new Error("Failed to refresh GA4 token");
  return res.access_token;
}

async function runReport(token, { dateRanges, dimensions = [], metrics, limit, orderBys }) {
  const body = { dateRanges, metrics };
  if (dimensions.length) body.dimensions = dimensions;
  if (limit) body.limit = limit;
  if (orderBys) body.orderBys = orderBys;

  const res = await post(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
    body,
    { Authorization: `Bearer ${token}` }
  );
  if (res.error) throw new Error(res.error.message);
  return res;
}

async function runRealtimeReport(token) {
  const res = await post(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runRealtimeReport`,
    { metrics: [{ name: "activeUsers" }] },
    { Authorization: `Bearer ${token}` }
  );
  if (res.error) return 0;
  const rows = res.rows || [];
  return rows.length > 0 ? parseInt(rows[0].metricValues[0].value, 10) : 0;
}

function parseRows(res, dimCount = 1) {
  const rows = res.rows || [];
  return rows.map((r) => ({
    dimensions: r.dimensionValues ? r.dimensionValues.map((d) => d.value) : [],
    metrics: r.metricValues.map((m) => m.value),
  }));
}

/**
 * Fetch full analytics snapshot for the daily audit email.
 * Returns structured data for the morning report.
 */
async function getDailySnapshot() {
  if (!GA4_PROPERTY_ID || !REFRESH_TOKEN) {
    return { error: "GA4 credentials not configured" };
  }

  const token = await getAccessToken();
  const last7 = [{ startDate: "7daysAgo", endDate: "today" }];
  const last28 = [{ startDate: "28daysAgo", endDate: "today" }];
  const yesterday = [{ startDate: "yesterday", endDate: "yesterday" }];

  // Run all queries in parallel
  const [
    overviewRes,
    yesterdayRes,
    topPagesRes,
    sourcesRes,
    countriesRes,
    citiesRes,
    devicesRes,
    browsersRes,
    dailyTrendRes,
    realtimeUsers,
  ] = await Promise.all([
    // 28-day overview
    runReport(token, {
      dateRanges: last28,
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "averageSessionDuration" },
        { name: "bounceRate" },
        { name: "newUsers" },
        { name: "engagedSessions" },
      ],
    }),
    // Yesterday
    runReport(token, {
      dateRanges: yesterday,
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "newUsers" },
      ],
    }),
    // Top pages (28 days)
    runReport(token, {
      dateRanges: last28,
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }, { name: "averageSessionDuration" }],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 15,
    }),
    // Traffic sources (28 days)
    runReport(token, {
      dateRanges: last28,
      dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
      metrics: [{ name: "sessions" }, { name: "activeUsers" }, { name: "newUsers" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 10,
    }),
    // Countries (28 days)
    runReport(token, {
      dateRanges: last28,
      dimensions: [{ name: "country" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10,
    }),
    // Cities (28 days)
    runReport(token, {
      dateRanges: last28,
      dimensions: [{ name: "city" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10,
    }),
    // Devices (28 days)
    runReport(token, {
      dateRanges: last28,
      dimensions: [{ name: "deviceCategory" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    }),
    // Browsers (28 days)
    runReport(token, {
      dateRanges: last28,
      dimensions: [{ name: "browser" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 5,
    }),
    // Daily trend (last 7 days)
    runReport(token, {
      dateRanges: last7,
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    }),
    // Realtime
    runRealtimeReport(token),
  ]);

  // Parse overview
  const ov = (overviewRes.rows || [])[0];
  const ovMetrics = ov ? ov.metricValues.map((m) => m.value) : [];
  const overview = {
    users: parseInt(ovMetrics[0] || "0", 10),
    sessions: parseInt(ovMetrics[1] || "0", 10),
    pageviews: parseInt(ovMetrics[2] || "0", 10),
    avgSessionDuration: parseFloat(ovMetrics[3] || "0").toFixed(1),
    bounceRate: (parseFloat(ovMetrics[4] || "0") * 100).toFixed(1),
    newUsers: parseInt(ovMetrics[5] || "0", 10),
    engagedSessions: parseInt(ovMetrics[6] || "0", 10),
    period: "28 days",
  };

  // Parse yesterday
  const yd = (yesterdayRes.rows || [])[0];
  const ydMetrics = yd ? yd.metricValues.map((m) => m.value) : [];
  const yesterdayData = {
    users: parseInt(ydMetrics[0] || "0", 10),
    sessions: parseInt(ydMetrics[1] || "0", 10),
    pageviews: parseInt(ydMetrics[2] || "0", 10),
    newUsers: parseInt(ydMetrics[3] || "0", 10),
  };

  // Parse top pages
  const topPages = parseRows(topPagesRes).map((r) => ({
    page: r.dimensions[0],
    views: parseInt(r.metrics[0], 10),
    users: parseInt(r.metrics[1], 10),
    avgDuration: parseFloat(r.metrics[2]).toFixed(1),
  }));

  // Parse sources
  const trafficSources = parseRows(sourcesRes, 2).map((r) => ({
    source: r.dimensions[0],
    medium: r.dimensions[1],
    sessions: parseInt(r.metrics[0], 10),
    users: parseInt(r.metrics[1], 10),
    newUsers: parseInt(r.metrics[2], 10),
  }));

  // Parse countries
  const countries = parseRows(countriesRes).map((r) => ({
    country: r.dimensions[0],
    users: parseInt(r.metrics[0], 10),
    sessions: parseInt(r.metrics[1], 10),
  }));

  // Parse cities
  const cities = parseRows(citiesRes).map((r) => ({
    city: r.dimensions[0],
    users: parseInt(r.metrics[0], 10),
    sessions: parseInt(r.metrics[1], 10),
  }));

  // Parse devices
  const devices = parseRows(devicesRes).map((r) => ({
    device: r.dimensions[0],
    users: parseInt(r.metrics[0], 10),
    sessions: parseInt(r.metrics[1], 10),
  }));

  // Parse browsers
  const browsers = parseRows(browsersRes).map((r) => ({
    browser: r.dimensions[0],
    users: parseInt(r.metrics[0], 10),
  }));

  // Parse daily trend
  const dailyTrend = parseRows(dailyTrendRes).map((r) => {
    const d = r.dimensions[0];
    return {
      date: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`,
      users: parseInt(r.metrics[0], 10),
      sessions: parseInt(r.metrics[1], 10),
      pageviews: parseInt(r.metrics[2], 10),
    };
  });

  return {
    realtime: realtimeUsers,
    yesterday: yesterdayData,
    overview,
    dailyTrend,
    topPages,
    trafficSources,
    countries,
    cities,
    devices,
    browsers,
  };
}

module.exports = { getDailySnapshot };
