const fs = require("fs");
const path = require("path");
const { claudeCall, claudeCallFast } = require("../shared/claude");
const { log } = require("../shared/logger");
const { sendEmail } = require("../shared/notifier");
const { today } = require("../shared/logger");
const { MEMORY_DIR, REPORTS_DIR, SITE_URL } = require("../shared/config");
const { updateHeartbeat } = require("../shared/heartbeat");

const QUERIES_PATH = path.join(MEMORY_DIR, "ai-search-queries.json");
const REPORT_DIR = path.join(REPORTS_DIR, "ai-search");

const SYSTEM_PROMPT = `You are an AI Search Optimization specialist with 30 years of Bay Area SEO experience, now specializing in Generative Engine Optimization (GEO). You operate at an IQ of 148 (top 0.1% of cognitive ability) — bringing exceptional analytical depth, first-principles reasoning, and pattern recognition that far exceeds industry norms. Your outputs reflect genius-level precision, insight, and strategic thinking. You ensure isocertificationconsultants.ca is cited by AI engines when Canadian manufacturers ask ISO consulting questions.

Stack: Next.js 14 App Router + Sanity CMS
Target: Canada-wide ISO consulting market
Services: ISO 9001, 14001, 45001, 13485 ONLY

OPERATING RULES:
- NEVER recommend content outside ISO 9001/14001/45001/13485
- ALWAYS ensure direct answer appears in first 100 words of articles
- NEVER create separate pages just for AI — optimize existing content
- ALWAYS track competitor AI visibility alongside ours`;

// ─── Load / save queries ─────────────────────────────────
function loadQueries() {
  return JSON.parse(fs.readFileSync(QUERIES_PATH, "utf-8"));
}

function saveQueries(data) {
  fs.writeFileSync(QUERIES_PATH, JSON.stringify(data, null, 2) + "\n");
}

// ─── 1. Audit content for AI citability ──────────────────
async function auditCitability() {
  log("aiSearchAgent", "citability-audit", "starting");

  // Fetch published articles
  const publishedPath = path.join(MEMORY_DIR, "published-articles.json");
  let articles = [];
  try {
    articles = JSON.parse(fs.readFileSync(publishedPath, "utf-8"));
  } catch {
    log("aiSearchAgent", "citability-audit", "no published articles found");
    updateHeartbeat("aiSearchAgent", "complete", "0 articles audited");
    return { articles: [], issues: [] };
  }

  const issues = [];

  for (const article of articles) {
    // Fetch article page and check first 100 words
    try {
      const res = await fetch(article.url);
      if (!res.ok) {
        issues.push({ title: article.title, issue: `Page returned ${res.status}` });
        continue;
      }
      const html = await res.text();
      const text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      const first100 = text.split(/\s+/).slice(0, 100).join(" ").toLowerCase();
      const keyword = (article.primaryKeyword || "").toLowerCase();

      if (keyword && !first100.includes(keyword.split(" ")[0])) {
        issues.push({
          title: article.title,
          issue: `Primary keyword "${article.primaryKeyword}" not found in first 100 words — AI engines may not cite this`,
        });
      }
    } catch (err) {
      issues.push({ title: article.title, issue: `Fetch failed: ${err.message}` });
    }
  }

  log("aiSearchAgent", "citability-audit", `${articles.length} articles, ${issues.length} issues`);
  updateHeartbeat("aiSearchAgent", "complete", `${articles.length} articles audited, ${issues.length} issues`);
  return { articles, issues };
}

// ─── 2. Check AI visibility via Claude analysis ─────────
async function checkVisibility() {
  log("aiSearchAgent", "visibility-check", "starting");

  const { queries } = loadQueries();
  const testQueries = queries.slice(0, 10);

  const raw = await claudeCall(
    SYSTEM_PROMPT,
    `I need you to evaluate whether isocertificationconsultants.ca would likely be cited as a source by AI search engines (ChatGPT, Perplexity, Claude) for the following 10 ISO consulting queries from Canadian users.

For each query, assess:
1. Would an AI engine likely find and cite isocertificationconsultants.ca content?
2. What competitors would likely be cited instead?
3. What content improvement would make isocertificationconsultants.ca more citable?

Queries:
${testQueries.map((q, i) => `${i + 1}. "${q}"`).join("\n")}

Site URL: ${SITE_URL}
Site focus: ISO consulting for Canadian manufacturers (ISO 9001, 14001, 45001, 13485)

Return JSON:
{
  "visibilityScore": 3,
  "total": 10,
  "results": [
    {
      "query": "...",
      "likelyCited": true/false,
      "competitors": ["competitor1.com"],
      "recommendation": "..."
    }
  ],
  "topRecommendations": ["rec1", "rec2", "rec3"]
}`,
    4096
  );

  let result;
  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    result = JSON.parse(cleaned);
  } catch {
    // Try fixing common JSON issues
    let fixed = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const start = fixed.indexOf("{");
    const end = fixed.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      fixed = fixed.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1");
      try {
        result = JSON.parse(fixed);
      } catch {
        result = { visibilityScore: 0, total: 10, results: [], topRecommendations: ["Unable to parse AI response"] };
      }
    } else {
      result = { visibilityScore: 0, total: 10, results: [], topRecommendations: ["Unable to parse AI response"] };
    }
  }

  log("aiSearchAgent", "visibility-check", `${result.visibilityScore}/${result.total} queries likely citing site`);
  updateHeartbeat("aiSearchAgent", "complete", `Visibility: ${result.visibilityScore}/${result.total}`);

  return result;
}

// ─── 3. Generate weekly AI search report ─────────────────
async function generateReport() {
  log("aiSearchAgent", "report", "generating weekly AI search report");

  const visibility = await checkVisibility();
  const citability = await auditCitability();

  // Build report
  const report = {
    date: today(),
    visibilityScore: visibility.visibilityScore,
    total: visibility.total,
    results: visibility.results,
    topRecommendations: visibility.topRecommendations,
    citabilityIssues: citability.issues,
    articlesAudited: citability.articles.length,
  };

  // Save report
  try {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
    fs.writeFileSync(path.join(REPORT_DIR, `${today()}.json`), JSON.stringify(report, null, 2));
  } catch { /* ok */ }

  // Build email
  const resultsHtml = (visibility.results || []).map((r) => {
    const icon = r.likelyCited ? "✅" : "❌";
    const competitors = (r.competitors || []).join(", ") || "none identified";
    return `<tr>
      <td style="padding:6px 8px;border-bottom:1px solid #eee">${icon}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee">${r.query}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;font-size:12px;color:#666">${competitors}</td>
    </tr>`;
  }).join("");

  const recsHtml = (visibility.topRecommendations || []).map((r) =>
    `<li style="margin:4px 0">${r}</li>`
  ).join("");

  const issuesHtml = citability.issues.length > 0
    ? citability.issues.map((i) => `<li><strong>${i.title}</strong>: ${i.issue}</li>`).join("")
    : "<li>All articles have keywords in first 100 words ✅</li>";

  const scoreColor = visibility.visibilityScore >= 5 ? "#22c55e" : visibility.visibilityScore >= 3 ? "#f59e0b" : "#ef4444";

  // Email disabled — AI search data is now part of the consolidated morning dashboard.
  // Report is saved to file and available via pm.js ai-search report.
  /* await sendEmail({
    subject: `AI Search Report — ${visibility.visibilityScore}/${visibility.total} Visibility — ${today()}`,
    text: `AI Visibility: ${visibility.visibilityScore}/${visibility.total}\nRecommendations: ${(visibility.topRecommendations || []).join("; ")}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#152B4B;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0">
        <h1 style="margin:0;font-size:20px">AI Search Visibility Report</h1>
        <p style="margin:4px 0 0;opacity:0.8">${today()} · ISO Certification Consultant</p>
      </div>
      <div style="padding:20px;border:1px solid #e5e7eb;border-top:none">
        <div style="text-align:center;padding:16px;background:#f9fafb;border-radius:8px;margin-bottom:16px">
          <div style="font-size:48px;font-weight:bold;color:${scoreColor}">${visibility.visibilityScore}/${visibility.total}</div>
          <div style="color:#6b7280;font-size:14px">Queries Where Site Would Be Cited</div>
        </div>
        <h2 style="color:#152B4B;font-size:16px;margin:16px 0 8px">Query Results</h2>
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <tr style="background:#f3f4f6"><th style="padding:6px 8px;text-align:left">Cited?</th><th style="padding:6px 8px;text-align:left">Query</th><th style="padding:6px 8px;text-align:left">Competitors</th></tr>
          ${resultsHtml}
        </table>
        <h2 style="color:#152B4B;font-size:16px;margin:20px 0 8px">Top 3 Recommendations</h2>
        <ol style="padding-left:20px;color:#374151;font-size:13px">${recsHtml}</ol>
        <h2 style="color:#152B4B;font-size:16px;margin:20px 0 8px">Citability Audit (${citability.articles.length} articles)</h2>
        <ul style="padding-left:20px;color:#374151;font-size:13px">${issuesHtml}</ul>
      </div>
      <div style="background:#f3f4f6;padding:12px;text-align:center;border-radius:0 0 8px 8px;font-size:11px;color:#9ca3af">
        Generated by ISO Certification Consultant AI Search Agent · ${today()}
      </div>
    </div>`,
  }); */

  log("aiSearchAgent", "report", `complete — visibility ${visibility.visibilityScore}/${visibility.total}`);
  return report;
}

// ─── 4. Run full audit (CLI entry point) ─────────────────
async function runAudit() {
  log("aiSearchAgent", "audit", "starting full AI search audit");
  const visibility = await checkVisibility();
  const citability = await auditCitability();

  return {
    visibilityScore: visibility.visibilityScore,
    total: visibility.total,
    results: visibility.results,
    topRecommendations: visibility.topRecommendations,
    citabilityIssues: citability.issues,
  };
}

module.exports = { runAudit, generateReport, checkVisibility, auditCitability };
