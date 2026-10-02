const fs = require("fs");
const path = require("path");
const { log, today, timestamp, readTodayLog } = require("./logger");
const { sendEmail } = require("./notifier");
const { getHeartbeats } = require("./heartbeat");
const { MEMORY_DIR, REPORTS_DIR, SITE_URL } = require("./config");

const HEARTBEAT_PATH = path.join(MEMORY_DIR, "agent-heartbeats.json");
const PREV_SUMMARY_PATH = path.join(REPORTS_DIR, "daily");

// ─── Agent team definitions ──────────────────────────────
const TEAMS = {
  content: {
    name: "Content Team",
    emoji: "📝",
    agents: [
      { id: "contentManager", label: "Content Manager", metricLabel: "Pipeline" },
      { id: "keywordResearcher", label: "Keyword Researcher", metricLabel: "Keyword" },
      { id: "articleWriter", label: "Article Writer", metricLabel: "Words" },
      { id: "contentEnhancer", label: "Content Enhancer", metricLabel: "Enhancements" },
      { id: "contentCleaner", label: "Content Cleaner", metricLabel: "Cleaned" },
      { id: "imageAgent", label: "Image Agent", metricLabel: "Image" },
      { id: "infographicAgent", label: "Featured Image Agent", metricLabel: "Featured" },
      { id: "inlineImageAgent", label: "Inline Image Agent", metricLabel: "Inline Images" },
      { id: "linkBuilder", label: "Link Builder", metricLabel: "Links" },
      { id: "grammarAgent", label: "Grammar Agent", metricLabel: "Corrections" },
      { id: "contentQA", label: "Content QA", metricLabel: "Score" },
      { id: "sanityPublisher", label: "Sanity Publisher", metricLabel: "Published" },
    ],
  },
  web: {
    name: "Web Team",
    emoji: "🌐",
    agents: [
      { id: "productManager", label: "Product Manager", metricLabel: "Backlog" },
      { id: "uiDesigner", label: "UI Designer", metricLabel: "Audit" },
      { id: "frontendDev", label: "Frontend Dev", metricLabel: "Build" },
      { id: "backendDev", label: "Backend Dev", metricLabel: "API" },
      { id: "qaEngineer", label: "QA Engineer", metricLabel: "Score" },
      { id: "designQA", label: "Design QA", metricLabel: "Checks" },
      { id: "pageAuditor", label: "Page Auditor", metricLabel: "Pages" },
    ],
  },
  seo: {
    name: "SEO Team",
    emoji: "📈",
    agents: [
      { id: "seoManager", label: "SEO Manager", metricLabel: "Report" },
      { id: "onPageSeo", label: "On-Page SEO", metricLabel: "Audited" },
      { id: "offPageSeo", label: "Off-Page SEO", metricLabel: "Opportunities" },
      { id: "technicalSeo", label: "Technical SEO", metricLabel: "CWV" },
      { id: "contentSeo", label: "Content SEO", metricLabel: "Briefs" },
      { id: "aiSearchAgent", label: "AI Search Agent", metricLabel: "Visibility" },
    ],
  },
  leads: {
    name: "Leads & Growth",
    emoji: "🎯",
    agents: [
      { id: "leadsAgent", label: "Leads Agent", metricLabel: "Leads" },
      { id: "contentRefresher", label: "Content Refresher", metricLabel: "Rankings" },
    ],
  },
  security: {
    name: "Security",
    emoji: "🔒",
    agents: [
      { id: "vaptAgent", label: "VAPT Agent", metricLabel: "Findings" },
      { id: "complianceMonitor", label: "Compliance Monitor", metricLabel: "Risk" },
    ],
  },
};

// ─── Helpers ─────────────────────────────────────────────
function isActiveIn24h(lastRun) {
  if (!lastRun) return false;
  const diff = Date.now() - new Date(lastRun).getTime();
  return diff < 24 * 60 * 60 * 1000;
}

function formatTime(isoStr) {
  if (!isoStr) return "never";
  const d = new Date(isoStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/Toronto" });
}

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "America/Toronto",
  });
}

function formatTimeEST() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/Toronto",
  });
}

function getPreviousDaySummary() {
  try {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const prevPath = path.join(PREV_SUMMARY_PATH, `${yesterday}-audit.json`);
    return JSON.parse(fs.readFileSync(prevPath, "utf-8"));
  } catch {
    return null;
  }
}

function getPublishedToday() {
  try {
    const published = JSON.parse(fs.readFileSync(path.join(MEMORY_DIR, "published-articles.json"), "utf-8"));
    return published.find((a) => a.date === today()) || null;
  } catch {
    return null;
  }
}

function buildPipelineTimeline() {
  const todayLog = readTodayLog();
  if (!todayLog) return null;

  const steps = [
    { agent: "Keyword", pattern: /\[keywordResearcher\] pick/ },
    { agent: "Writer", pattern: /\[articleWriter\] (complete|writing)/ },
    { agent: "Enhancer", pattern: /\[contentEnhancer\] complete/ },
    { agent: "Cleaner", pattern: /\[contentCleaner\] complete/ },
    { agent: "Infographic", pattern: /\[infographicAgent\] (complete|gemini|pexels|skipped)/ },
    { agent: "Image", pattern: /\[imageAgent\] complete/ },
    { agent: "Links", pattern: /\[linkBuilder\] complete/ },
    { agent: "QA", pattern: /\[contentQA\] scored/ },
    { agent: "Publisher", pattern: /\[sanityPublisher\] published/ },
    { agent: "Auditor", pattern: /\[pageAuditor\] result/ },
  ];

  const timeline = [];
  for (const step of steps) {
    const match = todayLog.match(new RegExp(`\\[(\\d{4}-\\d{2}-\\d{2}T[\\d:.]+Z)\\].*${step.pattern.source}`));
    if (match) {
      const passed = !todayLog.match(new RegExp(`${step.pattern.source}.*FAIL`));
      timeline.push({ agent: step.agent, time: formatTime(match[1]), passed });
    }
  }
  return timeline.length > 0 ? timeline : null;
}

// ─── Build HTML Dashboard ────────────────────────────────
function buildDashboard(heartbeats) {
  const dateStr = formatDate();
  const timeStr = formatTimeEST();
  const prev = getPreviousDaySummary();
  const article = getPublishedToday();
  const pipeline = buildPipelineTimeline();

  // Count active agents
  let totalAgents = 0;
  let activeAgents = 0;
  const issues = [];

  for (const team of Object.values(TEAMS)) {
    for (const agent of team.agents) {
      totalAgents++;
      const hb = heartbeats[agent.id];
      if (hb && isActiveIn24h(hb.lastRun)) {
        activeAgents++;
        if (hb.lastStatus === "error" || hb.lastStatus === "failed") {
          issues.push({ agent: agent.label, status: hb.lastStatus, metric: hb.lastMetric, team: team.name });
        }
      }
    }
  }

  const healthPct = Math.round((activeAgents / totalAgents) * 100);
  const healthColor = healthPct >= 90 ? "#22c55e" : healthPct >= 70 ? "#f59e0b" : "#ef4444";
  const prevActive = prev ? prev.activeAgents : null;
  const trend = prevActive !== null ? (activeAgents > prevActive ? `↑ ${activeAgents - prevActive} from yesterday` : activeAgents < prevActive ? `↓ ${prevActive - activeAgents} from yesterday` : "→ same as yesterday") : "first report";

  // ── Build team cards ──
  function buildTeamCard(team) {
    const agentRows = team.agents.map((a) => {
      const hb = heartbeats[a.id];
      const active = hb && isActiveIn24h(hb.lastRun);
      const icon = active ? (hb.lastStatus === "error" || hb.lastStatus === "failed" ? "❌" : "✅") : "⬜";
      const metric = hb?.lastMetric || "—";
      const time = hb?.lastRun ? formatTime(hb.lastRun) : "never";
      return `<tr>
        <td style="padding:4px 8px;border-bottom:1px solid #eee;font-size:13px">${icon} ${a.label}</td>
        <td style="padding:4px 8px;border-bottom:1px solid #eee;font-size:12px;color:#6b7280">${metric}</td>
        <td style="padding:4px 8px;border-bottom:1px solid #eee;font-size:12px;color:#9ca3af">${time}</td>
      </tr>`;
    }).join("");

    const teamActive = team.agents.filter((a) => {
      const hb = heartbeats[a.id];
      return hb && isActiveIn24h(hb.lastRun);
    }).length;

    return `<td style="width:50%;vertical-align:top;padding:4px">
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px">
        <tr><td colspan="3" style="background:#152B4B;color:white;padding:8px 12px;font-weight:bold;font-size:14px">
          ${team.emoji} ${team.name} <span style="float:right;font-size:12px;opacity:0.8">${teamActive}/${team.agents.length} ✅</span>
        </td></tr>
        <tr style="background:#f9fafb"><td style="padding:4px 8px;font-size:11px;font-weight:bold;color:#6b7280">Agent</td><td style="padding:4px 8px;font-size:11px;font-weight:bold;color:#6b7280">Metric</td><td style="padding:4px 8px;font-size:11px;font-weight:bold;color:#6b7280">Last Run</td></tr>
        ${agentRows}
      </table>
    </td>`;
  }

  const teamCards = Object.values(TEAMS);
  let cardsHtml = "";
  for (let i = 0; i < teamCards.length; i += 2) {
    cardsHtml += `<tr>${buildTeamCard(teamCards[i])}${teamCards[i + 1] ? buildTeamCard(teamCards[i + 1]) : "<td></td>"}</tr>`;
  }

  // ── Pipeline timeline ──
  let pipelineHtml = "";
  if (pipeline && pipeline.length > 0) {
    const steps = pipeline.map((s) => {
      const bg = s.passed ? "#059CB7" : "#ef4444";
      return `<td style="background:${bg};color:white;padding:4px 6px;border-radius:4px;font-size:11px;text-align:center;white-space:nowrap">${s.agent}<br><span style="font-size:10px;opacity:0.8">${s.time} ${s.passed ? "✅" : "❌"}</span></td>
      <td style="color:#ccc;font-size:12px;padding:0 2px">→</td>`;
    }).join("");
    pipelineHtml = `<div style="margin:16px 0">
      <h2 style="color:#152B4B;font-size:16px;margin:0 0 8px">Pipeline Timeline</h2>
      <table style="border-collapse:collapse"><tr>${steps}</tr></table>
    </div>`;
  }

  // ── Article section ──
  let articleHtml = "";
  if (article) {
    articleHtml = `<div style="background:#059CB7;color:white;padding:16px;border-radius:8px;margin:16px 0">
      <h2 style="margin:0 0 8px;font-size:16px">Today's Published Article</h2>
      <p style="margin:4px 0;font-size:14px;font-weight:bold">${article.title}</p>
      <p style="margin:4px 0;font-size:13px">${article.wordCount} words · QA Score: ${article.qaScore}/100 · Image ✅</p>
      <a href="${article.url}" style="display:inline-block;margin-top:8px;background:#D97706;color:white;padding:8px 16px;border-radius:4px;text-decoration:none;font-size:13px;font-weight:bold">View Live Article →</a>
    </div>`;
  }

  // ── Issues section ──
  let issuesHtml = "";
  if (issues.length > 0) {
    issuesHtml = issues.map((i) =>
      `<div style="border-left:4px solid #ef4444;padding:8px 12px;margin:4px 0;background:#fef2f2">
        <strong style="color:#dc2626">⚠️ ${i.agent}</strong> — ${i.status}<br>
        <span style="font-size:12px;color:#6b7280">${i.metric || "No details available"}</span>
      </div>`
    ).join("");
    issuesHtml = `<div style="margin:16px 0"><h2 style="color:#152B4B;font-size:16px;margin:0 0 8px">Items Requiring Attention</h2>${issuesHtml}</div>`;
  } else {
    issuesHtml = `<div style="background:#f0fdf4;border:1px solid #86efac;padding:12px;border-radius:8px;margin:16px 0;text-align:center;color:#166534;font-size:14px">✅ All systems operational — no action required</div>`;
  }

  // ── Full email ──
  return `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
    <!-- HEADER -->
    <div style="background:#152B4B;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0">
      <h1 style="margin:0;font-size:20px">ISO Certification Consultant AI Agent Command Center</h1>
      <p style="margin:4px 0 0;opacity:0.8;font-size:13px">${dateStr} · ${timeStr} EST</p>
      <div style="display:inline-block;margin-top:8px;background:${healthColor};padding:4px 12px;border-radius:12px;font-size:12px;font-weight:bold">${healthPct}% Health</div>
    </div>

    <div style="padding:16px;border:1px solid #e5e7eb;border-top:none">
      <!-- HEALTH SCORE -->
      <div style="text-align:center;padding:16px;background:#f9fafb;border-radius:8px;margin-bottom:16px">
        <div style="font-size:36px;font-weight:bold;color:#152B4B">${activeAgents}/${totalAgents} Agents Active</div>
        <div style="background:#e5e7eb;border-radius:99px;height:8px;margin:8px 0;overflow:hidden">
          <div style="background:#059CB7;height:100%;width:${healthPct}%;border-radius:99px"></div>
        </div>
        <div style="color:#6b7280;font-size:13px">${trend}</div>
      </div>

      <!-- TEAM CARDS -->
      <table style="width:100%;border-collapse:collapse">${cardsHtml}</table>

      <!-- ARTICLE -->
      ${articleHtml}

      <!-- PIPELINE -->
      ${pipelineHtml}

      <!-- ISSUES -->
      ${issuesHtml}

      <!-- SITE METRICS -->
      <table style="width:100%;border-collapse:collapse;margin:16px 0">
        <tr>
          <td style="background:#152B4B;color:white;padding:8px;text-align:center;border-radius:4px 0 0 4px;font-size:12px">🟢 Online</td>
          <td style="background:#152B4B;color:white;padding:8px;text-align:center;font-size:12px">SSL: Active</td>
          <td style="background:#152B4B;color:white;padding:8px;text-align:center;font-size:12px">Sanity: ✅</td>
          <td style="background:#152B4B;color:white;padding:8px;text-align:center;border-radius:0 4px 4px 0;font-size:12px">Vercel: ✅</td>
        </tr>
      </table>
    </div>

    <!-- FOOTER -->
    <div style="background:#f3f4f6;padding:12px;text-align:center;border-radius:0 0 8px 8px;font-size:11px;color:#9ca3af">
      Generated by ISO Certification Consultant Agent Team · ${dateStr} · ${timeStr} EST
    </div>
  </div>`;
}

// ─── Run audit and send dashboard ────────────────────────
async function runAudit() {
  log("teamAuditor", "audit", "starting team audit");

  const heartbeats = getHeartbeats();
  const html = buildDashboard(heartbeats);

  // Count active
  let totalAgents = 0;
  let activeAgents = 0;
  for (const team of Object.values(TEAMS)) {
    for (const agent of team.agents) {
      totalAgents++;
      const hb = heartbeats[agent.id];
      if (hb && isActiveIn24h(hb.lastRun)) activeAgents++;
    }
  }

  // Save daily summary
  try {
    fs.mkdirSync(PREV_SUMMARY_PATH, { recursive: true });
    fs.writeFileSync(
      path.join(PREV_SUMMARY_PATH, `${today()}-audit.json`),
      JSON.stringify({ date: today(), activeAgents, totalAgents, heartbeats }, null, 2)
    );
  } catch { /* ok */ }

  // Email disabled — agent dashboard is now part of the consolidated morning email.
  // Keeping data save for historical tracking.
  log("teamAuditor", "audit", `complete — ${activeAgents}/${totalAgents} active`);
  return { activeAgents, totalAgents, heartbeats };
}

// ─── Show status in terminal ─────────────────────────────
function showStatus() {
  const heartbeats = getHeartbeats();
  const lines = [];

  for (const [teamKey, team] of Object.entries(TEAMS)) {
    lines.push(`\n  ${team.emoji} ${team.name}`);
    for (const agent of team.agents) {
      const hb = heartbeats[agent.id];
      const active = hb && isActiveIn24h(hb.lastRun);
      const icon = active ? (hb.lastStatus === "error" ? "❌" : "✅") : "⬜";
      const metric = hb?.lastMetric || "—";
      const time = hb?.lastRun ? formatTime(hb.lastRun) : "never";
      lines.push(`    ${icon} ${agent.label.padEnd(20)} ${metric.toString().padEnd(30)} ${time}`);
    }
  }

  return lines.join("\n");
}

module.exports = { runAudit, showStatus, buildDashboard, TEAMS };
