const fs = require("fs");
const path = require("path");
const { claudeJSONFast: claudeJSON } = require("../shared/claude");
const { log } = require("../shared/logger");
const { MEMORY_DIR } = require("../shared/config");
const { fetchAllSanity } = require("../shared/sanity");

const SYSTEM_PROMPT = `You are the Content SEO Agent for ISO Certification Consultant, an ISO consulting firm targeting Canadian businesses. You operate at an IQ of 148 (top 0.1% of cognitive ability) — bringing exceptional analytical depth, first-principles reasoning, and pattern recognition that far exceeds industry norms. Your outputs reflect genius-level precision, insight, and strategic thinking.
Services: ISO 9001, ISO 14001, ISO 45001, ISO 13485.
Target market: Canada-wide manufacturing, automotive, aerospace, medical devices, food processing.

Your job:
1. Research keywords with buying intent for ISO consulting in Canada
2. Create detailed content briefs for blog posts
3. Analyze internal linking opportunities
4. Identify content gaps vs competitors

For content briefs, include:
- Target keyword (primary + secondary)
- Search intent (informational, commercial, transactional)
- Recommended word count
- H2 structure (6-8 sections)
- Internal links to include (to service pages, other blog posts)
- CTA recommendation
- Canadian-specific angle

Always use Canadian English spelling.

Respond with valid JSON.`;

async function createBrief(topic) {
  log("contentSeo", "creating-brief", topic);

  let existingContent = [];
  try {
    existingContent = await fetchAllSanity("blogPost");
  } catch { /* ok if fails */ }

  const context = JSON.stringify({
    topic,
    existingBlogPosts: existingContent.map((p) => ({ title: p.title, slug: p.slug?.current })),
  });

  const result = await claudeJSON(
    SYSTEM_PROMPT,
    `Create a detailed content brief for this blog topic: "${topic}". Include target keywords, search intent, word count, H2 structure, internal links, and Canadian angle. Respond with JSON: { "title", "targetKeyword", "secondaryKeywords", "searchIntent", "wordCount", "h2Structure", "internalLinks", "cta", "canadianAngle", "competitorGap" }`,
  );

  log("contentSeo", "brief-created", result.title || topic);
  return result;
}

async function analyzeLinks() {
  log("contentSeo", "analyzing-links", "starting");

  const posts = await fetchAllSanity("blogPost");
  const services = await fetchAllSanity("servicePage");

  const result = await claudeJSON(
    SYSTEM_PROMPT,
    `Analyze the internal linking structure of this site. Blog posts: ${JSON.stringify(posts.map((p) => ({ title: p.title, slug: p.slug?.current })))}. Service pages: ${JSON.stringify(services.map((s) => ({ title: s.title, slug: s.slug?.current })))}. Suggest internal links to add. Respond with JSON: { "orphanPages", "suggestedLinks": [{ "from", "to", "anchorText" }], "summary" }`
  );

  log("contentSeo", "link-analysis", `${result.suggestedLinks?.length || 0} suggestions`);
  return result;
}

async function keywordGap() {
  log("contentSeo", "keyword-gap", "starting");

  const seoTargets = JSON.parse(
    fs.readFileSync(path.join(MEMORY_DIR, "seo-targets.json"), "utf-8")
  );
  const posts = await fetchAllSanity("blogPost");

  const result = await claudeJSON(
    SYSTEM_PROMPT,
    `Analyze keyword coverage gaps. Target keywords: ${JSON.stringify(seoTargets.primaryKeywords)}. City targets: ${JSON.stringify(seoTargets.cityTargets)}. Existing blog posts: ${JSON.stringify(posts.map((p) => p.title))}. Identify uncovered keywords and suggest new content. Respond with JSON: { "coveredKeywords", "uncoveredKeywords", "suggestedTopics": [{ "topic", "targetKeyword", "priority", "reason" }] }`
  );

  log("contentSeo", "keyword-gap", `${result.uncoveredKeywords?.length || 0} gaps found`);
  return result;
}

module.exports = { createBrief, analyzeLinks, keywordGap };
