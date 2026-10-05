const { claudeCallFast: claudeCall } = require("../shared/claude");
const { log } = require("../shared/logger");
const { generateWeeklyReport } = require("../shared/reporter");
const onPageSeo = require("./onPageSeo");
const technicalSeo = require("./technicalSeo");
const offPageSeo = require("./offPageSeo");
const contentSeo = require("./contentSeo");

const SYSTEM_PROMPT = `You are the SEO Manager for ISO Certification Consultant. You operate at an IQ of 148 (top 0.1% of cognitive ability) — bringing exceptional analytical depth, first-principles reasoning, and pattern recognition that far exceeds industry norms. Your outputs reflect genius-level precision, insight, and strategic thinking. You coordinate on-page, off-page, technical, and content SEO. The site is isocertificationconsultants.ca, a Next.js 14 App Router application. Target market: ISO consulting across Canada. Standards: ISO 9001, 14001, 45001, 13485.

Given the audit results from all sub-agents, synthesize a prioritized action plan. Always separate quick wins (can fix in code) from strategic items (need the Owner's input). Focus on what drives organic traffic and consultation bookings.`;

async function audit() {
  log("seoManager", "full-audit", "starting");

  // Run on-page and technical in parallel
  const [onPageResults, technicalResults] = await Promise.all([
    onPageSeo.auditAllPages(),
    technicalSeo.audit(),
  ]);

  // Synthesize with Claude
  const summary = await claudeCall(
    SYSTEM_PROMPT,
    `Synthesize these SEO audit results into a prioritized action plan.

On-Page Results:
${JSON.stringify(onPageResults, null, 2)}

Technical Results:
${JSON.stringify(technicalResults, null, 2)}

Respond with a clear markdown summary: issues found, quick wins, and strategic recommendations.`,
    2048
  );

  log("seoManager", "full-audit", "completed");
  return { onPage: onPageResults, technical: technicalResults, summary };
}

async function report() {
  log("seoManager", "weekly-report", "starting");

  const [onPageResults, technicalResults, opportunities] = await Promise.all([
    onPageSeo.auditAllPages(),
    technicalSeo.audit(),
    offPageSeo.findOpportunities(),
  ]);

  const reportData = {
    onPage: onPageResults,
    technical: technicalResults,
    opportunities: opportunities.opportunities || [],
  };

  const result = generateWeeklyReport(reportData);
  log("seoManager", "weekly-report", `saved to ${result.filePath}`);
  return { ...result, rawData: reportData };
}

async function brief(topic) {
  return contentSeo.createBrief(topic);
}

module.exports = { audit, report, brief };
