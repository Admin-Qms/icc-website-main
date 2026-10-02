const fs = require("fs");
const path = require("path");
const { claudeCallFast: claudeCall } = require("../shared/claude");
const { log } = require("../shared/logger");
const { MEMORY_DIR } = require("../shared/config");
const { extractLinks, unlinkWhere, normalizeUrl, countWords } = require("../shared/contentStore");
const { resolves } = require("../shared/siteRoutes");
const { loadLinkBankUrls } = require("../content/contextLoader");

const LINK_MAP_PATH = path.join(MEMORY_DIR, "link-map.json");

function loadLinkMap() {
  try {
    return JSON.parse(fs.readFileSync(LINK_MAP_PATH, "utf-8"));
  } catch {
    return { lastUpdated: null, pages: {}, orphanedPages: [], linkDensity: {} };
  }
}

function saveLinkMap(data) {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(LINK_MAP_PATH, JSON.stringify(data, null, 2) + "\n");
}

const MIN_INTERNAL_LINKS = 3;
const MIN_EXTERNAL_LINKS = 3;

/**
 * Removes links the site can't stand behind: internal links to pages that
 * don't exist, and outside links that aren't in the approved link bank.
 * The anchor text stays; only the link is dropped.
 */
function removeInvalidLinks(body, allowedExternal) {
  const removed = [];
  const cleaned = unlinkWhere(body, (url) => {
    const isExternal = /^https?:\/\//i.test(url) && !resolves(url);
    const bad = isExternal
      ? allowedExternal.size > 0 && !allowedExternal.has(normalizeUrl(url))
      : url.startsWith("/") || /^https?:\/\//i.test(url)
        ? !resolves(url)
        : false;
    if (bad) removed.push(url);
    return bad;
  });
  return { body: cleaned, removed };
}

/**
 * Validates the links the writer placed and tops them up if there are too few.
 *
 * 1. Drops internal links that don't resolve to a real page
 * 2. Drops external links that aren't in the link bank
 * 3. If fewer than 3 internal or 3 external remain, asks the fast model to
 *    weave more in from the offered lists, then validates again
 */
async function validateLinks(article, context) {
  log("linkBuilder", "validating", `"${article.title}"`);

  const allowedExternal = loadLinkBankUrls();
  let { body, removed } = removeInvalidLinks(article.body, allowedExternal);
  if (removed.length) log("linkBuilder", "removed", removed.join(", "));

  let links = extractLinks(body);
  let status = removed.length ? "cleaned" : "validated";
  log("linkBuilder", "counts", `${links.internal.length} internal, ${links.external.length} external`);

  if (links.internal.length < MIN_INTERNAL_LINKS || links.external.length < MIN_EXTERNAL_LINKS) {
    log("linkBuilder", "deficit", `need ${Math.max(0, MIN_INTERNAL_LINKS - links.internal.length)} more internal, ${Math.max(0, MIN_EXTERNAL_LINKS - links.external.length)} more external`);

    const serviceLinks = (context?.internalLinks?.servicePages || [])
      .map((s) => `- [${s.title}](${s.url})`).join("\n");
    const blogLinks = (context?.internalLinks?.blogPosts || [])
      .map((p) => `- [${p.title}](${p.url})`).join("\n");
    const extLinks = (context?.externalLinks || [])
      .map((l) => `- [${l.name}](${l.url}) — ${l.context}`).join("\n");

    try {
      const result = await claudeCall(
        `You are a link insertion specialist. Your ONLY job is to add missing links to an existing article without changing any other content. Links must be woven mid-sentence, NEVER appended. Use ONLY the URLs offered — never invent or alter a URL. Preserve every [IMAGE: ...] marker, heading, callout and bold phrase exactly.`,
        `This article needs more links. Current: ${links.internal.length} internal, ${links.external.length} external. Need minimum ${MIN_INTERNAL_LINKS} internal and ${MIN_EXTERNAL_LINKS} external.

AVAILABLE INTERNAL LINKS:
${serviceLinks}
${blogLinks}

AVAILABLE EXTERNAL LINKS:
${extLinks || "- none available — add internal links only"}

ARTICLE:
${body}

Add the missing links mid-sentence. Do NOT change other content. Do NOT create link sections. Return ONLY the full article markdown.`,
        8192
      );

      const patched = removeInvalidLinks(result, allowedExternal).body;
      const patchedLinks = extractLinks(patched);
      const keptLength = countWords(patched) >= countWords(body) * 0.95;
      const keptLinks =
        patchedLinks.internal.length >= links.internal.length &&
        patchedLinks.external.length >= links.external.length;

      // Only accept the rewrite if it is the same article with more links.
      if (keptLength && keptLinks) {
        body = patched;
        links = patchedLinks;
        status = "patched";
        log("linkBuilder", "patched", `now ${links.internal.length} internal, ${links.external.length} external`);
      } else {
        log("linkBuilder", "patch-rejected", "link patch dropped content or links — keeping the original");
      }
    } catch (err) {
      log("linkBuilder", "patch-error", err.message);
    }
  }

  const linkReport = {
    linksAdded: [
      ...links.internal.map((l) => ({ anchorText: l.text, url: l.url, type: "internal" })),
      ...links.external.map((l) => ({ anchorText: l.text, url: l.url, type: "external" })),
    ],
    removed,
    totalLinks: links.internal.length + links.external.length,
    internalCount: links.internal.length,
    externalCount: links.external.length,
    status,
  };

  log("linkBuilder", "complete", `${linkReport.totalLinks} links validated for "${article.title}"`);

  return {
    ...article,
    body,
    linkReport,
    linksValidated: true,
  };
}

// Keep backward compat — weaveLinks now calls validateLinks
async function weaveLinks(article, context) {
  return validateLinks(article, context);
}

async function auditSiteLinks() {
  log("linkBuilder", "audit", "starting site-wide link audit");

  const { fetchAllSanity } = require("../shared/sanity");
  const posts = await fetchAllSanity("blogPost");
  const linkMap = loadLinkMap();

  // Identify orphaned pages (pages with zero inbound links)
  const linkedPages = new Set();
  for (const page of Object.values(linkMap.pages)) {
    for (const link of page.linksOut || []) {
      linkedPages.add(link.url);
    }
  }

  const allPages = posts.map((p) => `/blog/${p.slug?.current}`);
  const orphaned = allPages.filter((p) => !linkedPages.has(p));

  linkMap.orphanedPages = orphaned;
  saveLinkMap(linkMap);

  log("linkBuilder", "audit", `${orphaned.length} orphaned pages found`);
  return { orphanedPages: orphaned, totalPages: allPages.length, linkedPages: linkedPages.size };
}

module.exports = { weaveLinks, validateLinks, removeInvalidLinks, auditSiteLinks, MIN_INTERNAL_LINKS, MIN_EXTERNAL_LINKS };
