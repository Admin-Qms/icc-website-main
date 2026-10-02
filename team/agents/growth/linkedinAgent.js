const fs = require("fs");
const path = require("path");
const https = require("https");
const { log, today } = require("../shared/logger");
const { MEMORY_DIR, REPORTS_DIR, SITE_URL } = require("../shared/config");
const { updateHeartbeat } = require("../shared/heartbeat");

// ── Config ────────────────────────────────────────────────────────
const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN || "";
const LINKEDIN_PERSON_ID = process.env.LINKEDIN_PERSON_ID || "";

const DATA_DIR = path.join(MEMORY_DIR, "linkedin");
const POSTS_LOG_PATH = path.join(DATA_DIR, "shared-posts.json");
const REPORT_DIR = path.join(REPORTS_DIR, "linkedin");

// Ensure directories exist
for (const dir of [DATA_DIR, REPORT_DIR]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ── Guardrails ────────────────────────────────────────────────────
const MAX_POSTS_PER_WEEK = 3;

// ══════════════════════════════════════════════════════════════════
// DATA PERSISTENCE
// ══════════════════════════════════════════════════════════════════

function loadSharedPosts() {
  try { return JSON.parse(fs.readFileSync(POSTS_LOG_PATH, "utf-8")); } catch { return []; }
}

function saveSharedPosts(data) {
  fs.writeFileSync(POSTS_LOG_PATH, JSON.stringify(data, null, 2) + "\n");
}

function getWeekPostCount() {
  const posts = loadSharedPosts();
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  return posts.filter((p) => p.date >= weekAgo).length;
}

// ══════════════════════════════════════════════════════════════════
// GROQ — AI CAPTION GENERATION
// ══════════════════════════════════════════════════════════════════

function groqCall(systemPrompt, userMessage) {
  return new Promise((resolve, reject) => {
    if (!GROQ_API_KEY) return reject(new Error("No GROQ_API_KEY"));

    const payload = JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const options = {
      hostname: "api.groq.com",
      path: "/openai/v1/chat/completions",
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          if (json.error) return reject(new Error(json.error.message));
          resolve(json.choices[0].message.content.trim());
        } catch (e) {
          reject(new Error(`Groq parse error: ${e.message}`));
        }
      });
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

const CAPTION_SYSTEM_PROMPT = `You are the Owner, founder of ISO Certification Consultant. You operate at an IQ of 148 (top 0.1% of cognitive ability) — bringing exceptional analytical depth, first-principles reasoning, and pattern recognition that far exceeds industry norms. Your outputs reflect genius-level precision, insight, and strategic thinking. You're sharing a blog article on your LinkedIn profile.

RULES:
- Write 2-3 sentences that tease the key insight from the article.
- End with a question to drive engagement (not generic — specific to the topic).
- Professional but conversational tone.
- Include 2-3 relevant hashtags at the end.
- North American English.
- NEVER use emojis.
- NEVER start with "Just published" or "New article" — lead with the insight.`;

/**
 * Generate a caption for sharing a blog article on LinkedIn.
 */
async function generateCaption(article) {
  const prompt = `Article to share on LinkedIn:
Title: ${article.title}
Summary: ${article.excerpt || article.metaDescription || ""}
URL: ${article.url}

Write a LinkedIn caption (2-3 sentences + question + hashtags).`;

  return groqCall(CAPTION_SYSTEM_PROMPT, prompt);
}

// ══════════════════════════════════════════════════════════════════
// LINKEDIN API
// ══════════════════════════════════════════════════════════════════

function linkedinAPI(method, endpoint, body) {
  return new Promise((resolve, reject) => {
    if (!LINKEDIN_ACCESS_TOKEN) return reject(new Error("No LINKEDIN_ACCESS_TOKEN"));

    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: "api.linkedin.com",
      path: endpoint,
      method,
      headers: {
        Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "LinkedIn-Version": "202401",
        "X-Restli-Protocol-Version": "2.0.0",
      },
    };
    if (payload) options.headers["Content-Length"] = Buffer.byteLength(payload);

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode >= 400) {
          return reject(new Error(`LinkedIn API ${res.statusCode}: ${data}`));
        }
        try {
          resolve(data ? JSON.parse(data) : { success: true, statusCode: res.statusCode });
        } catch {
          resolve({ success: true, statusCode: res.statusCode, raw: data });
        }
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

/**
 * Share an article on your LinkedIn profile.
 */
async function shareArticle(articleUrl, caption) {
  const body = {
    author: `urn:li:person:${LINKEDIN_PERSON_ID}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text: caption },
        shareMediaCategory: "ARTICLE",
        media: [
          {
            status: "READY",
            originalUrl: articleUrl,
          },
        ],
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  return linkedinAPI("POST", "/v2/ugcPosts", body);
}

/**
 * Verify LinkedIn token is still valid.
 */
async function verifyToken() {
  try {
    const result = await linkedinAPI("GET", "/v2/userinfo", null);
    return { valid: true, name: result.name || result.sub || "OK" };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

// ══════════════════════════════════════════════════════════════════
// BLOG ARTICLE SELECTION
// ══════════════════════════════════════════════════════════════════

/**
 * Pick the best blog article to share on LinkedIn.
 * Prioritizes high-QA articles not yet shared.
 */
function pickArticleToShare() {
  const sharedPosts = loadSharedPosts();
  const sharedSlugs = new Set(sharedPosts.map((p) => p.slug));

  const publishedPath = path.join(MEMORY_DIR, "published-articles.json");
  if (!fs.existsSync(publishedPath)) return null;

  const articles = JSON.parse(fs.readFileSync(publishedPath, "utf-8"));

  // Filter to unshared articles, sorted by QA score (highest first)
  const candidates = articles
    .filter((a) => !sharedSlugs.has(a.slug) && a.qaScore >= 80)
    .sort((a, b) => (b.qaScore || 0) - (a.qaScore || 0));

  return candidates[0] || null;
}

/**
 * List articles available to share (not yet shared, QA >= 80).
 */
function listCandidates(limit = 10) {
  const sharedPosts = loadSharedPosts();
  const sharedSlugs = new Set(sharedPosts.map((p) => p.slug));

  const publishedPath = path.join(MEMORY_DIR, "published-articles.json");
  if (!fs.existsSync(publishedPath)) return [];

  const articles = JSON.parse(fs.readFileSync(publishedPath, "utf-8"));
  return articles
    .filter((a) => !sharedSlugs.has(a.slug) && a.qaScore >= 80)
    .sort((a, b) => (b.qaScore || 0) - (a.qaScore || 0))
    .slice(0, limit);
}

// ══════════════════════════════════════════════════════════════════
// MAIN WORKFLOWS
// ══════════════════════════════════════════════════════════════════

/**
 * Share a blog article to your LinkedIn profile.
 * Picks the best unshared article, generates a caption, and posts it.
 */
async function sharePost() {
  const weekCount = getWeekPostCount();
  if (weekCount >= MAX_POSTS_PER_WEEK) {
    log("linkedinAgent", "sharePost", `weekly limit reached (${weekCount}/${MAX_POSTS_PER_WEEK})`);
    return { skipped: true, reason: "weekly limit", count: weekCount };
  }

  const article = pickArticleToShare();
  if (!article) {
    log("linkedinAgent", "sharePost", "no articles to share");
    return { skipped: true, reason: "no unshared articles with QA >= 80" };
  }

  const articleUrl = `${SITE_URL}/blog/${article.slug}`;
  const caption = await generateCaption({ ...article, url: articleUrl });

  try {
    await shareArticle(articleUrl, caption);

    const sharedPosts = loadSharedPosts();
    sharedPosts.push({
      date: today(),
      slug: article.slug,
      title: article.title,
      url: articleUrl,
      caption,
      sharedAt: new Date().toISOString(),
    });
    saveSharedPosts(sharedPosts);

    log("linkedinAgent", "shared", `${article.title}`);
    updateHeartbeat("linkedinAgent", "ok", `shared: ${article.slug}`);
    return { shared: true, article: article.title, caption, url: articleUrl };
  } catch (err) {
    log("linkedinAgent", "share-error", err.message);
    updateHeartbeat("linkedinAgent", "error", err.message);
    return { shared: false, error: err.message };
  }
}

/**
 * Share a specific article by slug.
 */
async function shareBySlug(slug) {
  const weekCount = getWeekPostCount();
  if (weekCount >= MAX_POSTS_PER_WEEK) {
    return { skipped: true, reason: "weekly limit", count: weekCount };
  }

  // Check if already shared
  const sharedPosts = loadSharedPosts();
  if (sharedPosts.some((p) => p.slug === slug)) {
    return { skipped: true, reason: "already shared" };
  }

  const publishedPath = path.join(MEMORY_DIR, "published-articles.json");
  if (!fs.existsSync(publishedPath)) return { skipped: true, reason: "no published articles file" };

  const articles = JSON.parse(fs.readFileSync(publishedPath, "utf-8"));
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { skipped: true, reason: `article "${slug}" not found` };

  const articleUrl = `${SITE_URL}/blog/${article.slug}`;
  const caption = await generateCaption({ ...article, url: articleUrl });

  try {
    await shareArticle(articleUrl, caption);

    sharedPosts.push({
      date: today(),
      slug: article.slug,
      title: article.title,
      url: articleUrl,
      caption,
      sharedAt: new Date().toISOString(),
    });
    saveSharedPosts(sharedPosts);

    log("linkedinAgent", "shared", `${article.title}`);
    updateHeartbeat("linkedinAgent", "ok", `shared: ${article.slug}`);
    return { shared: true, article: article.title, caption, url: articleUrl };
  } catch (err) {
    log("linkedinAgent", "share-error", err.message);
    return { shared: false, error: err.message };
  }
}

/**
 * Get status summary.
 */
function getStatus() {
  const sharedPosts = loadSharedPosts();
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const weekPosts = sharedPosts.filter((p) => p.date >= weekAgo);
  const candidates = listCandidates(5);

  return {
    week: {
      shared: weekPosts.length,
      limit: MAX_POSTS_PER_WEEK,
      posts: weekPosts,
    },
    totalShared: sharedPosts.length,
    nextUp: candidates[0] || null,
    candidateCount: candidates.length,
  };
}

/**
 * Get data for the morning report email.
 */
function getReportData() {
  const sharedPosts = loadSharedPosts();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const yesterdayPosts = sharedPosts.filter((p) => p.date === yesterday);
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const weekPosts = sharedPosts.filter((p) => p.date >= weekAgo);
  const candidates = listCandidates(3);

  return {
    yesterdayPosts,
    weekPosts,
    candidates,
    totalShared: sharedPosts.length,
    tokenStatus: LINKEDIN_ACCESS_TOKEN ? "configured" : "missing",
  };
}

/**
 * Generate daily report markdown.
 */
function generateReport() {
  const status = getStatus();
  const reportDate = today();

  let md = `# LinkedIn Sharing Report — ${reportDate}\n\n`;
  md += `## This Week\n`;
  md += `- Articles shared: ${status.week.shared}/${status.week.limit}\n`;
  md += `- Total all-time: ${status.totalShared}\n\n`;

  if (status.week.posts.length > 0) {
    md += `## Recent Shares\n\n`;
    for (const p of status.week.posts) {
      md += `- **${p.title}** (${p.date})\n`;
      md += `  ${p.url}\n`;
      md += `  Caption: ${p.caption.slice(0, 150)}...\n\n`;
    }
  }

  if (status.nextUp) {
    md += `## Next Up\n`;
    md += `- **${status.nextUp.title}** (QA: ${status.nextUp.qaScore}/100)\n`;
    md += `- ${status.candidateCount} articles in queue\n`;
  }

  const reportPath = path.join(REPORT_DIR, `${reportDate}.md`);
  fs.writeFileSync(reportPath, md);
  return { markdown: md, filePath: reportPath };
}

module.exports = {
  sharePost,
  shareBySlug,
  getStatus,
  getReportData,
  generateReport,
  verifyToken,
  generateCaption,
  listCandidates,
};
