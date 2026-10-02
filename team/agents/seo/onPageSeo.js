const https = require("https");
const { claudeJSON } = require("../shared/claude");
const { log } = require("../shared/logger");
const { SITE_URL, PAGES } = require("../shared/config");

function httpGet(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 15000 }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", (err) => resolve({ status: 0, body: "", error: err.message }));
    req.on("timeout", () => { req.destroy(); resolve({ status: 0, body: "", error: "timeout" }); });
  });
}

function extractMeta(html) {
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "";
  const metaDesc = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1] || "";
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => m[1].replace(/<[^>]+>/g, "").trim());
  const canonical = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1] || "";
  const ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)?.[1] || "";
  const ogDesc = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i)?.[1] || "";
  const imgAlts = [...html.matchAll(/<img[^>]+alt="([^"]*)"/gi)].map((m) => m[1]);
  const imgsNoAlt = [...html.matchAll(/<img(?![^>]*alt=)[^>]*>/gi)].length;
  const internalLinks = [...html.matchAll(/href="(\/[^"]*|https?:\/\/isocertificationconsultant\.ca[^"]*)"/gi)].length;
  const jsonLd = html.includes('"@context"');

  return { title, metaDesc, h1s, h2s, canonical, ogTitle, ogDesc, imgAlts, imgsNoAlt, internalLinks, jsonLd };
}

function auditMeta(url, meta) {
  const checks = [];

  // Title
  checks.push({
    name: "title-length",
    pass: meta.title.length >= 30 && meta.title.length <= 65,
    detail: `${meta.title.length} chars: "${meta.title.slice(0, 60)}"`,
  });

  // Meta description
  checks.push({
    name: "meta-description-length",
    pass: meta.metaDesc.length >= 120 && meta.metaDesc.length <= 160,
    detail: `${meta.metaDesc.length} chars`,
  });

  // H1
  checks.push({
    name: "h1-count",
    pass: meta.h1s.length === 1,
    detail: `${meta.h1s.length} H1 tag(s)${meta.h1s.length > 0 ? `: "${meta.h1s[0].slice(0, 50)}"` : ""}`,
  });

  // H2s
  checks.push({
    name: "h2-headings",
    pass: meta.h2s.length >= 2,
    detail: `${meta.h2s.length} H2 headings`,
  });

  // Open Graph
  checks.push({
    name: "og-tags",
    pass: !!meta.ogTitle && !!meta.ogDesc,
    detail: meta.ogTitle ? "present" : "missing OG tags",
  });

  // Image alt texts
  checks.push({
    name: "image-alt-tags",
    pass: meta.imgsNoAlt === 0,
    detail: meta.imgsNoAlt === 0 ? "all images have alt" : `${meta.imgsNoAlt} images missing alt`,
  });

  // Internal links
  checks.push({
    name: "internal-links",
    pass: meta.internalLinks >= 3,
    detail: `${meta.internalLinks} internal links`,
  });

  // JSON-LD
  checks.push({
    name: "json-ld-schema",
    pass: meta.jsonLd,
    detail: meta.jsonLd ? "present" : "missing",
  });

  return checks;
}

async function auditPage(pageUrl) {
  log("onPageSeo", "audit-page", pageUrl);
  const res = await httpGet(pageUrl);
  if (res.status !== 200) {
    return { url: pageUrl, checks: [{ name: "http-status", pass: false, detail: `HTTP ${res.status}` }] };
  }

  const meta = extractMeta(res.body);
  const checks = auditMeta(pageUrl, meta);
  return { url: pageUrl, checks, meta };
}

async function auditAllPages() {
  log("onPageSeo", "audit-all", "starting");
  const results = [];
  for (const page of PAGES) {
    const url = `${SITE_URL}${page}`;
    const result = await auditPage(url);
    results.push(result);
  }
  return results;
}

module.exports = { auditPage, auditAllPages, extractMeta };
