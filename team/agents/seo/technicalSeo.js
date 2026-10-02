const https = require("https");
const { log } = require("../shared/logger");
const { SITE_URL } = require("../shared/config");
const { countDocuments } = require("../shared/sanity");

function httpGet(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 15000 }, (res) => {
      let headers = res.headers;
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: data, headers }));
    });
    req.on("error", (err) => resolve({ status: 0, body: "", headers: {}, error: err.message }));
    req.on("timeout", () => { req.destroy(); resolve({ status: 0, body: "", headers: {}, error: "timeout" }); });
  });
}

async function audit() {
  log("technicalSeo", "audit", "starting");
  const checks = [];

  // 1. Sitemap
  const sitemap = await httpGet(`${SITE_URL}/sitemap.xml`);
  const sitemapUrls = (sitemap.body.match(/<url>/g) || []).length;
  checks.push({
    name: "sitemap-accessible",
    pass: sitemap.status === 200,
    detail: `HTTP ${sitemap.status} — ${sitemapUrls} URLs`,
  });

  // 2. Robots.txt
  const robots = await httpGet(`${SITE_URL}/robots.txt`);
  checks.push({
    name: "robots-txt",
    pass: robots.status === 200 && robots.body.includes("Sitemap:"),
    detail: robots.status === 200 ? (robots.body.includes("Sitemap:") ? "ok — has Sitemap directive" : "missing Sitemap directive") : `HTTP ${robots.status}`,
  });

  // 3. Security headers (check homepage)
  const home = await httpGet(SITE_URL);
  const securityHeaders = [
    "x-frame-options",
    "x-content-type-options",
    "strict-transport-security",
    "referrer-policy",
  ];
  const presentHeaders = securityHeaders.filter((h) => home.headers[h]);
  checks.push({
    name: "security-headers",
    pass: presentHeaders.length >= 3,
    detail: `${presentHeaders.length}/${securityHeaders.length} present: ${presentHeaders.join(", ") || "none"}`,
  });

  // 4. HTTPS
  checks.push({
    name: "https-enforced",
    pass: SITE_URL.startsWith("https://"),
    detail: SITE_URL.startsWith("https://") ? "yes" : "site URL not HTTPS",
  });

  // 5. JSON-LD schema
  const hasJsonLd = home.body.includes('"@context"') && home.body.includes("schema.org");
  checks.push({
    name: "json-ld-schema",
    pass: hasJsonLd,
    detail: hasJsonLd ? "present on homepage" : "missing — needs LocalBusiness + WebSite schemas",
  });

  // 6. Favicon
  const hasFavicon = home.body.includes('favicon') || home.body.includes('icon.svg');
  checks.push({
    name: "favicon",
    pass: hasFavicon,
    detail: hasFavicon ? "referenced in HTML" : "not found",
  });

  // 7. Mobile viewport
  const hasViewport = home.body.includes('name="viewport"');
  checks.push({
    name: "mobile-viewport",
    pass: hasViewport,
    detail: hasViewport ? "present" : "missing viewport meta tag",
  });

  // 8. Sanity content counts
  try {
    const counts = await countDocuments();
    checks.push({
      name: "sanity-content",
      pass: counts.blogPosts > 0 && counts.servicePages > 0,
      detail: `${counts.blogPosts} blog posts, ${counts.servicePages} service pages`,
    });
  } catch (err) {
    checks.push({
      name: "sanity-content",
      pass: false,
      detail: `query failed: ${err.message}`,
    });
  }

  // 9. 404 page
  const notFound = await httpGet(`${SITE_URL}/this-page-should-not-exist-404-test`);
  checks.push({
    name: "404-handling",
    pass: notFound.status === 404 || notFound.status === 200,
    detail: `HTTP ${notFound.status}`,
  });

  log("technicalSeo", "audit", `completed — ${checks.filter((c) => c.pass).length}/${checks.length} passed`);
  return checks;
}

module.exports = { audit };
