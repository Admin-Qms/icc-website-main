const fs = require("fs");
const path = require("path");
const { REPORTS_DIR } = require("./config");
const { today, timestamp } = require("./logger");

function saveReport(subdir, filename, data) {
  const dir = path.join(REPORTS_DIR, subdir);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, typeof data === "string" ? data : JSON.stringify(data, null, 2));
  return filePath;
}

function generateDailyReport(checks, blogData, onPageSeo) {
  const passed = checks.filter((c) => c.status === "ok").length;
  const failed = checks.filter((c) => c.status !== "ok").length;

  const lines = [
    `# ISO Certification Consultant Daily Report — ${today()}`,
    "",
    `**Site Status:** ${failed === 0 ? "Healthy" : `${failed} issue(s) found`}`,
    `**Checks:** ${passed}/${checks.length} passed`,
    "",
    "## Check Results",
    "",
  ];

  for (const check of checks) {
    const icon = check.status === "ok" ? "PASS" : "FAIL";
    lines.push(`- [${icon}] **${check.name}**: ${check.detail}`);
  }

  // Blog publication summary
  if (blogData) {
    lines.push("");
    lines.push("## Latest Blog Publication");
    lines.push("");
    lines.push(`- **Title:** ${blogData.title}`);
    lines.push(`- **URL:** ${blogData.url}`);
    lines.push(`- **Keyword:** ${blogData.primaryKeyword}`);
    lines.push(`- **Meta Description:** ${blogData.metaDescription || "N/A"}`);
    lines.push(`- **Words:** ${blogData.wordCount}`);
    lines.push(`- **QA Score:** ${blogData.qaScore}/100`);
    lines.push(`- **Category:** ${blogData.category}`);
  }

  // On-page SEO summary
  if (onPageSeo && onPageSeo.length > 0) {
    const totalChecks = onPageSeo.reduce((n, p) => n + p.checks.length, 0);
    const passedChecks = onPageSeo.reduce((n, p) => n + p.checks.filter((c) => c.pass).length, 0);
    lines.push("");
    lines.push("## On-Page SEO Audit");
    lines.push("");
    lines.push(`**Pages audited:** ${onPageSeo.length} | **Pass rate:** ${passedChecks}/${totalChecks} (${Math.round((passedChecks / totalChecks) * 100)}%)`);
    lines.push("");
    const failingPages = onPageSeo.filter((p) => p.checks.some((c) => !c.pass));
    if (failingPages.length === 0) {
      lines.push("All on-page SEO checks passed.");
    } else {
      for (const page of failingPages) {
        const shortUrl = page.url.replace(/https?:\/\/[^/]+/, "");
        const failures = page.checks.filter((c) => !c.pass);
        lines.push(`### ${shortUrl || "/"}`);
        for (const f of failures) {
          lines.push(`- [FAIL] **${f.name}**: ${f.detail}`);
        }
        lines.push("");
      }
    }
  }

  // Link to latest weekly SEO report
  const weeklyDir = path.join(REPORTS_DIR, "weekly");
  try {
    if (fs.existsSync(weeklyDir)) {
      const reports = fs.readdirSync(weeklyDir).filter((f) => f.endsWith(".md")).sort().reverse();
      if (reports.length > 0) {
        lines.push("");
        lines.push("## Weekly SEO Report");
        lines.push("");
        lines.push(`Latest: [${reports[0]}](team/reports/weekly/${reports[0]})`);
      }
    }
  } catch { /* ok */ }

  const md = lines.join("\n");
  const filePath = saveReport("daily", `${today()}.md`, md);
  return { markdown: md, filePath, passed, failed, total: checks.length };
}

function generateWeeklyReport(seoData) {
  const lines = [
    `# ISO Certification Consultant Weekly SEO Report — ${today()}`,
    "",
    "## On-Page Audit",
    "",
  ];

  if (seoData.onPage) {
    for (const page of seoData.onPage) {
      lines.push(`### ${page.url}`);
      for (const check of page.checks || []) {
        const icon = check.pass ? "PASS" : "FAIL";
        lines.push(`- [${icon}] ${check.name}: ${check.detail}`);
      }
      lines.push("");
    }
  }

  if (seoData.technical) {
    lines.push("## Technical SEO", "");
    for (const check of seoData.technical) {
      const icon = check.pass ? "PASS" : "FAIL";
      lines.push(`- [${icon}] ${check.name}: ${check.detail}`);
    }
    lines.push("");
  }

  if (seoData.opportunities) {
    lines.push("## Off-Page Opportunities", "");
    for (const opp of seoData.opportunities) {
      lines.push(`- **${opp.name}**: ${opp.description}`);
    }
  }

  const md = lines.join("\n");
  const filePath = saveReport("weekly", `${today()}.md`, md);
  return { markdown: md, filePath };
}

module.exports = { generateDailyReport, generateWeeklyReport, saveReport };
