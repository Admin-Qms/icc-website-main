const fs = require("fs");
const path = require("path");
const { claudeCallFast: claudeCall } = require("../shared/claude");
const { log } = require("../shared/logger");
const { MEMORY_DIR } = require("../shared/config");
const { fetchAllSanity } = require("../shared/sanity");

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

/**
 * Validates links in an article that were placed by the writer.
 * Unlike the old weaveLinks(), this does NOT add links from scratch —
 * the writer now places links using contextLoader data.
 *
 * This function:
 * 1. Counts internal and external links
 * 2. Validates internal links point to real pages
 * 3. Checks external link uniqueness against link-map
 * 4. Registers all links in link-map.json
 * 5. If link count is too low, adds missing links via LLM
 */
async function validateLinks(article, context) {
  log("linkBuilder", "validating", `"${article.title}"`);

  const body = article.body;

  // Count existing links
  const internalMatches = body.match(/\[([^\]]+)\]\(\/[^)]+\)/g) || [];
  const externalMatches = body.match(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g) || [];

  const internalCount = internalMatches.length;
  const externalCount = externalMatches.length;

  log("linkBuilder", "counts", `${internalCount} internal, ${externalCount} external`);

  let finalBody = body;
  let linkReport = {
    linksAdded: [],
    totalLinks: internalCount + externalCount,
    internalCount,
    externalCount,
    status: "validated",
  };

  // If links are severely lacking, add them via LLM (safety net)
  if (internalCount < 3 || externalCount < 3) {
    log("linkBuilder", "deficit", `need ${Math.max(0, 3 - internalCount)} more internal, ${Math.max(0, 3 - externalCount)} more external`);

    // Build available links from context
    const serviceLinks = (context?.internalLinks?.servicePages || [])
      .map((s) => `- [${s.title}](${s.url})`).join("\n");
    const blogLinks = (context?.internalLinks?.blogPosts || [])
      .map((p) => `- [${p.title}](${p.url})`).join("\n");
    const extLinks = (context?.externalLinks || [])
      .map((l) => `- [${l.name}](${l.url}) — ${l.context}`).join("\n");

    try {
      const result = await claudeCall(
        `You are a link insertion specialist. Your ONLY job is to add missing links to an existing article without changing any other content. Links must be woven mid-sentence, NEVER appended.`,
        `This article needs more links. Current: ${internalCount} internal, ${externalCount} external. Need minimum 3 each.

AVAILABLE INTERNAL LINKS:
${serviceLinks}
${blogLinks}

AVAILABLE EXTERNAL LINKS:
${extLinks}

ARTICLE:
${body}

Add the missing links mid-sentence. Do NOT change other content. Do NOT create link sections. Return the full article.`,
        8192
      );

      finalBody = result;

      // Recount
      const newInternal = (finalBody.match(/\[([^\]]+)\]\(\/[^)]+\)/g) || []).length;
      const newExternal = (finalBody.match(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g) || []).length;

      linkReport.totalLinks = newInternal + newExternal;
      linkReport.internalCount = newInternal;
      linkReport.externalCount = newExternal;
      linkReport.status = "patched";
      log("linkBuilder", "patched", `now ${newInternal} internal, ${newExternal} external`);
    } catch (err) {
      log("linkBuilder", "patch-error", err.message);
    }
  }

  // Extract all links for the link map
  const allInternalLinks = (finalBody.match(/\[([^\]]+)\]\(\/[^)]+\)/g) || []).map((m) => {
    const match = m.match(/\[([^\]]+)\]\((\/[^)]+)\)/);
    return match ? { anchorText: match[1], url: match[2], type: "internal" } : null;
  }).filter(Boolean);

  const allExternalLinks = (finalBody.match(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g) || []).map((m) => {
    const match = m.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
    return match ? { anchorText: match[1], url: match[2], type: "external" } : null;
  }).filter(Boolean);

  linkReport.linksAdded = [...allInternalLinks, ...allExternalLinks];

  // Update link map
  const linkMap = loadLinkMap();
  const slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);
  linkMap.pages[slug] = {
    title: article.title,
    linksOut: linkReport.linksAdded,
    updatedAt: new Date().toISOString(),
  };
  saveLinkMap(linkMap);

  log("linkBuilder", "complete", `${linkReport.totalLinks} links validated for "${article.title}"`);

  return {
    ...article,
    body: finalBody,
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

module.exports = { weaveLinks, validateLinks, auditSiteLinks };
