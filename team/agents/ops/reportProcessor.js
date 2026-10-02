#!/usr/bin/env node
/**
 * reportProcessor.js — Operations Report Processor
 *
 * Parses daily morning audit reports and extracts actionable items.
 * Can auto-fix certain issues (meta descriptions, mainImage, author) or
 * generate a task list for manual resolution.
 *
 * Reports to: COO (operations chain)
 * Runs after: morning audit (6:35 AM slot) or on-demand
 *
 * Usage:
 *   node team/agents/ops/reportProcessor.js                  # process latest daily report
 *   node team/agents/ops/reportProcessor.js --auto-fix       # process + auto-fix what's possible
 *   node team/agents/ops/reportProcessor.js --report <file>  # process specific report file
 */

const fs = require("fs");
const path = require("path");
const { REPORTS_DIR, MEMORY_DIR } = require("../shared/config");
const { sanityQuery, sanityMutate } = require("../shared/sanity");
const { log } = require("../shared/logger");
const { sendEmail } = require("../shared/notifier");

const AGENT = "reportProcessor";
const TASKS_FILE = path.join(MEMORY_DIR, "pending-tasks.json");

// ═══════════════════════════════════════════════════════════════
// REPORT PARSING
// ═══════════════════════════════════════════════════════════════

function findLatestReport() {
  const dailyDir = path.join(REPORTS_DIR, "daily");
  if (!fs.existsSync(dailyDir)) return null;
  const files = fs.readdirSync(dailyDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();
  return files.length > 0 ? path.join(dailyDir, files[0]) : null;
}

function parseReport(reportPath) {
  const content = fs.readFileSync(reportPath, "utf-8");
  const lines = content.split("\n");
  const issues = [];

  for (const line of lines) {
    const failMatch = line.match(/^\s*-\s*\[FAIL\]\s*\*\*(.+?)\*\*:\s*(.+)/);
    if (failMatch) {
      issues.push({
        category: categorize(failMatch[1]),
        check: failMatch[1].trim(),
        detail: failMatch[2].trim(),
        severity: determineSeverity(failMatch[1], failMatch[2]),
        autoFixable: isAutoFixable(failMatch[1]),
      });
    }
  }

  return {
    reportPath,
    reportDate: path.basename(reportPath, ".md"),
    totalIssues: issues.length,
    issues,
  };
}

function categorize(checkName) {
  const name = checkName.toLowerCase();
  if (name.includes("image") || name.includes("mainimage")) return "image";
  if (name.includes("meta") || name.includes("description")) return "seo";
  if (name.includes("author")) return "content";
  if (name.includes("security") || name.includes("header") || name.includes("csp")) return "security";
  if (name.includes("seo") || name.includes("canonical") || name.includes("schema")) return "seo";
  if (name.includes("content") || name.includes("qa") || name.includes("word")) return "content";
  if (name.includes("build") || name.includes("deploy") || name.includes("ssl")) return "infra";
  return "other";
}

function determineSeverity(check, detail) {
  const name = check.toLowerCase();
  const desc = detail.toLowerCase();
  if (desc.includes("missing") && name.includes("image")) return "high";
  if (name.includes("security") || name.includes("vulnerability")) return "critical";
  if (desc.includes("missing author")) return "medium";
  if (name.includes("meta description")) return "medium";
  if (desc.includes("too short") || desc.includes("too long")) return "low";
  return "medium";
}

function isAutoFixable(checkName) {
  const name = checkName.toLowerCase();
  // These can be auto-fixed by querying Sanity and patching
  if (name.includes("mainimage") || name.includes("featured image")) return true;
  if (name.includes("author")) return true;
  return false;
}

// ═══════════════════════════════════════════════════════════════
// AUTO-FIX ACTIONS
// ═══════════════════════════════════════════════════════════════

async function autoFixMissingMainImage() {
  log(AGENT, "auto-fix", "Checking for articles with featuredImage but no mainImage...");

  const docs = await sanityQuery(`*[_type == "blogPost" && defined(featuredImage.asset) && !defined(mainImage.asset)]{
    _id, title, "ref": featuredImage.asset._ref, "alt": featuredImage.alt
  }`);

  if (docs.length === 0) {
    log(AGENT, "auto-fix", "No mainImage fixes needed.");
    return { fixed: 0, total: 0 };
  }

  log(AGENT, "auto-fix", `Found ${docs.length} articles needing mainImage copy from featuredImage.`);

  const BATCH_SIZE = 50;
  let fixed = 0;

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE);
    const mutations = batch.map((doc) => ({
      patch: {
        id: doc._id,
        set: {
          mainImage: {
            _type: "image",
            asset: { _type: "reference", _ref: doc.ref },
            alt: doc.alt || "Featured article image",
          },
        },
      },
    }));

    const result = await sanityMutate(mutations);
    if (result.status === 200) {
      fixed += batch.length;
      log(AGENT, "auto-fix", `Patched batch: ${fixed}/${docs.length}`);
    } else {
      log(AGENT, "auto-fix-error", `Batch failed: ${result.status}`);
    }
  }

  return { fixed, total: docs.length };
}

async function autoFixMissingAuthor() {
  log(AGENT, "auto-fix", "Checking for articles with missing author...");

  const docs = await sanityQuery(`*[_type == "blogPost" && (!defined(author) || author == null)]{
    _id, title
  }`);

  if (docs.length === 0) {
    log(AGENT, "auto-fix", "No author fixes needed.");
    return { fixed: 0, total: 0 };
  }

  log(AGENT, "auto-fix", `Found ${docs.length} articles missing author. Setting to "the Owner Singh".`);

  const mutations = docs.map((doc) => ({
    patch: {
      id: doc._id,
      set: { author: "the Owner Singh" },
    },
  }));

  const result = await sanityMutate(mutations);
  const fixed = result.status === 200 ? docs.length : 0;

  return { fixed, total: docs.length };
}

// ═══════════════════════════════════════════════════════════════
// TASK GENERATION
// ═══════════════════════════════════════════════════════════════

function generateTasks(parsed) {
  const tasks = [];

  // Group issues by category
  const byCategory = {};
  for (const issue of parsed.issues) {
    if (!byCategory[issue.category]) byCategory[issue.category] = [];
    byCategory[issue.category].push(issue);
  }

  // Generate one task per category with item count
  for (const [category, issues] of Object.entries(byCategory)) {
    const task = {
      id: `${parsed.reportDate}-${category}-${issues.length}`,
      category,
      severity: issues.reduce((max, i) => {
        const order = { critical: 4, high: 3, medium: 2, low: 1 };
        return (order[i.severity] || 0) > (order[max] || 0) ? i.severity : max;
      }, "low"),
      title: `Fix ${issues.length} ${category} issue(s)`,
      items: issues.map((i) => `${i.check}: ${i.detail}`),
      autoFixable: issues.some((i) => i.autoFixable),
      assignTo: getAssignment(category),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    tasks.push(task);
  }

  // Sort by severity
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  tasks.sort((a, b) => (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4));

  return tasks;
}

function getAssignment(category) {
  const assignments = {
    security: "security/vaptAgent.js",
    image: "content/imageAgent.js",
    seo: "seo/onPageSeo.js",
    content: "content/contentQA.js",
    infra: "ops/devOpsManager.js",
    other: "web/qaEngineer.js",
  };
  return assignments[category] || "web/qaEngineer.js";
}

// ═══════════════════════════════════════════════════════════════
// TASK PERSISTENCE
// ═══════════════════════════════════════════════════════════════

function loadPendingTasks() {
  try {
    if (fs.existsSync(TASKS_FILE)) {
      return JSON.parse(fs.readFileSync(TASKS_FILE, "utf-8"));
    }
  } catch { /* fresh start */ }
  return [];
}

function savePendingTasks(tasks) {
  fs.mkdirSync(path.dirname(TASKS_FILE), { recursive: true });
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  log(AGENT, "tasks", `Saved ${tasks.length} pending tasks to ${TASKS_FILE}`);
}

// ═══════════════════════════════════════════════════════════════
// SUMMARY REPORT
// ═══════════════════════════════════════════════════════════════

function buildSummary(parsed, tasks, autoFixResults) {
  const lines = [
    `# Report Processor — ${parsed.reportDate}`,
    "",
    `**Source:** ${parsed.reportPath}`,
    `**Issues found:** ${parsed.totalIssues}`,
    "",
  ];

  if (autoFixResults && autoFixResults.length > 0) {
    lines.push("## Auto-Fixes Applied");
    lines.push("");
    for (const fix of autoFixResults) {
      lines.push(`- **${fix.type}:** ${fix.fixed}/${fix.total} fixed`);
    }
    lines.push("");
  }

  if (tasks.length > 0) {
    lines.push("## Pending Tasks (Manual Resolution Required)");
    lines.push("");
    lines.push("| Priority | Category | Task | Assigned To | Items |");
    lines.push("|----------|----------|------|-------------|-------|");
    for (const task of tasks) {
      const icon = { critical: "CRITICAL", high: "HIGH", medium: "MEDIUM", low: "LOW" }[task.severity] || "?";
      lines.push(`| ${icon} | ${task.category} | ${task.title} | ${task.assignTo} | ${task.items.length} |`);
    }
    lines.push("");
  }

  if (parsed.totalIssues === 0) {
    lines.push("All checks passed. No action items.");
  }

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════

async function processReport(options = {}) {
  const { autoFix = false, reportFile = null } = options;

  // Find report
  const reportPath = reportFile || findLatestReport();
  if (!reportPath || !fs.existsSync(reportPath)) {
    log(AGENT, "error", `No report found at: ${reportPath || "daily/"}`);
    return null;
  }

  log(AGENT, "start", `Processing: ${reportPath}`);

  // Parse
  const parsed = parseReport(reportPath);
  log(AGENT, "parsed", `Found ${parsed.totalIssues} issues across ${parsed.issues.length} checks`);

  // Auto-fix if enabled
  const autoFixResults = [];
  if (autoFix && parsed.issues.some((i) => i.autoFixable)) {
    log(AGENT, "auto-fix", "Running auto-fix routines...");

    const hasImageIssues = parsed.issues.some((i) => i.category === "image" && i.autoFixable);
    if (hasImageIssues) {
      const result = await autoFixMissingMainImage();
      autoFixResults.push({ type: "mainImage copy (featuredImage → mainImage)", ...result });
    }

    const hasAuthorIssues = parsed.issues.some((i) => i.check.toLowerCase().includes("author") && i.autoFixable);
    if (hasAuthorIssues) {
      const result = await autoFixMissingAuthor();
      autoFixResults.push({ type: "author assignment (→ the Owner Singh)", ...result });
    }
  }

  // Generate tasks for non-auto-fixable issues
  const remainingIssues = autoFix
    ? parsed.issues.filter((i) => !i.autoFixable)
    : parsed.issues;

  const newTasks = generateTasks({ ...parsed, issues: remainingIssues });

  // Merge with existing pending tasks (avoid duplicates by category+date)
  const existing = loadPendingTasks();
  const existingIds = new Set(existing.map((t) => t.id));
  const merged = [
    ...existing.filter((t) => t.status !== "completed"),
    ...newTasks.filter((t) => !existingIds.has(t.id)),
  ];
  savePendingTasks(merged);

  // Build summary
  const summary = buildSummary(parsed, newTasks, autoFixResults);
  const summaryPath = path.join(REPORTS_DIR, "daily", `${parsed.reportDate}-actions.md`);
  fs.writeFileSync(summaryPath, summary);
  log(AGENT, "summary", `Action report saved: ${summaryPath}`);

  return {
    reportDate: parsed.reportDate,
    totalIssues: parsed.totalIssues,
    autoFixed: autoFixResults,
    pendingTasks: newTasks.length,
    summaryPath,
    summary,
  };
}

// ═══════════════════════════════════════════════════════════════
// CLI ENTRY POINT
// ═══════════════════════════════════════════════════════════════

if (require.main === module) {
  const args = process.argv.slice(2);
  const autoFix = args.includes("--auto-fix");
  const reportIdx = args.indexOf("--report");
  const reportFile = reportIdx >= 0 ? args[reportIdx + 1] : null;

  processReport({ autoFix, reportFile })
    .then((result) => {
      if (!result) {
        console.log("No report to process.");
        process.exit(1);
      }

      console.log(`\n${"=".repeat(60)}`);
      console.log(`  Report Processor — ${result.reportDate}`);
      console.log(`${"=".repeat(60)}`);
      console.log(`  Issues found:    ${result.totalIssues}`);

      if (result.autoFixed.length > 0) {
        console.log(`  Auto-fixed:`);
        for (const fix of result.autoFixed) {
          console.log(`    - ${fix.type}: ${fix.fixed}/${fix.total}`);
        }
      }

      console.log(`  Pending tasks:   ${result.pendingTasks}`);
      console.log(`  Summary:         ${result.summaryPath}`);
      console.log(`${"=".repeat(60)}\n`);
    })
    .catch((err) => {
      console.error("Report processor error:", err);
      process.exit(1);
    });
}

module.exports = { processReport, parseReport, findLatestReport };
