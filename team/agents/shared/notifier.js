const { RESEND_API_KEY, REPORT_EMAIL, SITE_URL } = require("./config");

let resendClient = null;

function getResend() {
  if (!RESEND_API_KEY) return null;
  if (!resendClient) {
    const { Resend } = require("resend");
    resendClient = new Resend(RESEND_API_KEY);
  }
  return resendClient;
}

async function sendEmail({ subject, html, text }) {
  const resend = getResend();
  if (!resend) {
    console.log(`  [notifier] Email skipped (no RESEND_API_KEY): ${subject}`);
    return null;
  }

  const result = await resend.emails.send({
    from: "ISO Certification Consultant Team <onboarding@resend.dev>",
    to: REPORT_EMAIL,
    subject,
    html: html || "",
    text: text || "",
  });
  console.log(`  [notifier] Email sent: ${subject}`);
  return result;
}

// ── Brand colors ──
const BRAND = {
  navy: "#152B4B",
  teal: "#059CB7",
  amber: "#D97706",
  green: "#22c55e",
  red: "#ef4444",
  yellow: "#f59e0b",
  gray: "#6b7280",
  lightGray: "#f9fafb",
  border: "#e5e7eb",
};

function formatDate() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    timeZone: "America/Toronto",
  });
}

function formatTimeEST() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
    timeZone: "America/Toronto",
  });
}

// ── Build comprehensive morning dashboard HTML ──
function buildMorningReportHtml(reportData) {
  const { checks, passed, failed, total, blogData, aiSummary, agentSummary, onPageSeo, offPageOpportunities, leadsData, agentDashboard } = reportData;
  const dateStr = formatDate();
  const timeStr = formatTimeEST();
  const healthPct = Math.round((passed / total) * 100);
  const healthColor = healthPct >= 90 ? BRAND.green : healthPct >= 70 ? BRAND.yellow : BRAND.red;
  const statusText = failed === 0 ? "All Systems Healthy" : `${failed} Issue${failed > 1 ? "s" : ""} Found`;
  const statusIcon = failed === 0 ? "✅" : "⚠️";

  // ── Segment header helper ──
  function segmentHeader(icon, title) {
    return `<div style="background:${BRAND.teal};color:white;padding:10px 16px;border-radius:6px 6px 0 0;margin-top:20px">
      <h2 style="margin:0;font-size:15px;font-weight:700">${icon} ${title}</h2>
    </div>`;
  }
  function segmentBody(content) {
    return `<div class="segment-pad" style="border:1px solid ${BRAND.border};border-top:none;border-radius:0 0 6px 6px;padding:14px 16px">${content}</div>`;
  }

  // ── a. Check rows ──
  const checkRows = (checks || []).map((c) => {
    const isPass = c.status === "ok";
    const icon = isPass ? "✅" : "❌";
    const color = isPass ? BRAND.green : BRAND.red;
    return `<tr>
      <td style="padding:6px 8px;border-bottom:1px solid ${BRAND.border};font-size:13px">${icon} ${c.name}</td>
      <td style="padding:6px 8px;border-bottom:1px solid ${BRAND.border};font-size:13px;color:${color};font-weight:600">${isPass ? "PASS" : "FAIL"}</td>
      <td class="check-detail" style="padding:6px 8px;border-bottom:1px solid ${BRAND.border};font-size:12px;color:${BRAND.gray}">${c.detail}</td>
    </tr>`;
  }).join("");

  // ── b. Failures callout ──
  let failuresHtml = "";
  const failedChecks = (checks || []).filter((c) => c.status !== "ok");
  if (failedChecks.length > 0) {
    const failItems = failedChecks.map((c) =>
      `<div style="border-left:3px solid ${BRAND.red};padding:6px 10px;margin:4px 0;background:#fef2f2">
        <strong style="color:#dc2626;font-size:13px">${c.name}</strong>
        <span style="font-size:12px;color:${BRAND.gray}"> — ${c.detail}</span>
      </div>`
    ).join("");
    failuresHtml = `<div style="background:#fef2f2;border:2px solid ${BRAND.red};border-radius:8px;padding:14px 16px;margin:16px 0">
      <h2 style="color:#dc2626;font-size:15px;margin:0 0 8px">⚠️ Items Requiring Attention</h2>
      ${failItems}
    </div>`;
  }

  // ── c. Blog section (today's articles — daily + mega) ──
  let blogHtml = "";
  const todayArticles = reportData.todayArticles || [];
  if (todayArticles.length > 0) {
    const articleCards = todayArticles.map((a) => {
      const isMega = a.articleType === "mega";
      const typeBadge = isMega
        ? `<span style="background:${BRAND.teal};color:white;font-size:10px;font-weight:bold;padding:3px 8px;border-radius:3px;margin-left:6px">MEGA</span>`
        : `<span style="background:${BRAND.amber};color:white;font-size:10px;font-weight:bold;padding:3px 8px;border-radius:3px;margin-left:6px">DAILY</span>`;
      const durationMin = a.pipelineDurationMs ? Math.round(a.pipelineDurationMs / 60000) : null;
      const qaColor = a.qaScore >= 80 ? BRAND.green : BRAND.red;
      return `
        <div class="article-card" style="border:1px solid ${BRAND.border};border-radius:6px;padding:12px 14px;margin-bottom:10px">
          <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:${BRAND.navy};line-height:1.3">${a.title} ${typeBadge}</p>
          ${a.metaDescription ? `<p style="margin:0 0 10px;font-size:13px;color:${BRAND.gray};font-style:italic;line-height:1.4">${a.metaDescription}</p>` : ""}
          <p style="margin:0 0 4px;font-size:13px"><strong>URL:</strong> <a href="${SITE_URL}${a.url}" style="color:${BRAND.teal};text-decoration:none;word-break:break-all">${a.url}</a></p>
          <p style="margin:0 0 4px;font-size:13px"><strong>Keyword:</strong> ${a.primaryKeyword}</p>
          ${a.secondaryKeywords && a.secondaryKeywords.length > 0 ? `<p style="margin:0 0 4px;font-size:13px"><strong>Secondary:</strong> ${a.secondaryKeywords.join(", ")}</p>` : ""}
          <div style="margin-top:8px;background:${BRAND.lightGray};border-radius:4px;padding:8px 10px">
            <table style="width:100%;font-size:13px;color:#374151;border-collapse:collapse">
              <tr class="detail-row">
                <td style="padding:3px 0;width:50%"><strong>Words:</strong> ${(a.wordCount || 0).toLocaleString()}</td>
                <td style="padding:3px 0;width:50%"><strong>QA:</strong> <span style="color:${qaColor};font-weight:bold">${a.qaScore}/100</span></td>
              </tr>
              <tr class="detail-row">
                <td style="padding:3px 0"><strong>Category:</strong> ${a.category}</td>
                <td style="padding:3px 0"><strong>Read Time:</strong> ${a.readTime || "—"}</td>
              </tr>
              <tr class="detail-row">
                <td style="padding:3px 0"><strong>Audit:</strong> ${a.auditScore ? `${a.auditScore}/100` : "—"}</td>
                <td style="padding:3px 0"><strong>Duration:</strong> ${durationMin ? `${durationMin}m` : "—"}</td>
              </tr>
              ${isMega ? `<tr class="detail-row"><td style="padding:3px 0" colspan="2"><strong>Chapters:</strong> ${a.chapterCount || "—"}</td></tr>` : ""}
              <tr class="detail-row">
                <td style="padding:3px 0" colspan="2"><strong>Hero:</strong> ${a.image?.photographer || "—"} (${a.image?.source || "—"})</td>
              </tr>
              <tr class="detail-row">
                <td style="padding:3px 0"><strong>Featured:</strong> ${a.featuredImage || "—"}</td>
                <td style="padding:3px 0"><strong>Inline Imgs:</strong> ${a.inlineImages || 0}</td>
              </tr>
            </table>
          </div>
        </div>`;
    }).join("");
    const dailyCount = todayArticles.filter((a) => a.articleType !== "mega").length;
    const megaCount = todayArticles.filter((a) => a.articleType === "mega").length;
    const summaryText = [dailyCount > 0 ? `${dailyCount} daily` : "", megaCount > 0 ? `${megaCount} mega` : ""].filter(Boolean).join(" + ");
    blogHtml = segmentHeader("📝", `Content Published Today (${summaryText})`) + segmentBody(articleCards);
  } else if (blogData) {
    // Fallback: show latest blog if nothing published today
    blogHtml = segmentHeader("📝", "Latest Blog Publication") + segmentBody(`
      <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:${BRAND.navy}">${blogData.title}</p>
      ${blogData.metaDescription ? `<p style="margin:0 0 8px;font-size:12px;color:${BRAND.gray}">${blogData.metaDescription}</p>` : ""}
      <table style="width:100%;font-size:12px;color:#374151"><tr>
        <td style="padding:3px 0"><strong>Words:</strong> ${blogData.wordCount}</td>
        <td style="padding:3px 0"><strong>QA:</strong> ${blogData.qaScore}/100</td>
      </tr><tr>
        <td style="padding:3px 0"><strong>Category:</strong> ${blogData.category}</td>
        <td style="padding:3px 0"><strong>Keyword:</strong> ${blogData.primaryKeyword}</td>
      </tr></table>
      <p style="font-size:11px;color:${BRAND.gray};margin:6px 0 0">Published: ${blogData.date}</p>
      <a href="${SITE_URL}${blogData.url}" style="display:inline-block;margin-top:8px;background:${BRAND.amber};color:white;padding:10px 18px;border-radius:4px;text-decoration:none;font-size:14px;font-weight:bold">View Live Article →</a>
    `);
  }

  // ── d. On-Page SEO Summary ──
  let onPageHtml = "";
  if (onPageSeo && onPageSeo.length > 0) {
    const totalChecks = onPageSeo.reduce((n, p) => n + p.checks.length, 0);
    const passedChecks = onPageSeo.reduce((n, p) => n + p.checks.filter((c) => c.pass).length, 0);
    const failedSeoChecks = totalChecks - passedChecks;
    const seoPassRate = Math.round((passedChecks / totalChecks) * 100);
    const seoColor = seoPassRate >= 90 ? BRAND.green : seoPassRate >= 70 ? BRAND.yellow : BRAND.red;

    // Group failures by issue type across all pages
    const issueGroups = {};
    for (const page of onPageSeo) {
      const shortUrl = page.url.replace(/https?:\/\/[^/]+/, "") || "/";
      for (const c of page.checks) {
        if (!c.pass) {
          if (!issueGroups[c.name]) issueGroups[c.name] = [];
          issueGroups[c.name].push({ url: shortUrl, detail: c.detail });
        }
      }
    }

    let failTableHtml = "";
    if (failedSeoChecks > 0) {
      let failRows = "";
      for (const [issueName, pages] of Object.entries(issueGroups)) {
        for (const p of pages) {
          failRows += `<tr>
            <td style="padding:4px 8px;border-bottom:1px solid ${BRAND.border};font-size:11px;color:${BRAND.red};font-weight:600">${issueName}</td>
            <td style="padding:4px 8px;border-bottom:1px solid ${BRAND.border};font-size:11px">${p.url}</td>
            <td style="padding:4px 8px;border-bottom:1px solid ${BRAND.border};font-size:11px;color:${BRAND.gray}">${p.detail}</td>
          </tr>`;
        }
      }
      failTableHtml = `<table style="width:100%;border-collapse:collapse;border:1px solid ${BRAND.border};margin-top:10px">
        <tr style="background:${BRAND.navy}">
          <td style="padding:4px 8px;color:white;font-size:11px;font-weight:bold">Issue</td>
          <td style="padding:4px 8px;color:white;font-size:11px;font-weight:bold">Page</td>
          <td style="padding:4px 8px;color:white;font-size:11px;font-weight:bold">Detail</td>
        </tr>
        ${failRows}
      </table>`;
    }

    onPageHtml = segmentHeader("🔍", "On-Page SEO Summary") + segmentBody(`
      <table style="width:100%;font-size:13px;color:${BRAND.navy}"><tr>
        <td class="stat-cell" style="text-align:center;padding:6px">
          <div style="font-size:22px;font-weight:bold">${onPageSeo.length}</div>
          <div style="font-size:12px;color:${BRAND.gray}">Pages Audited</div>
        </td>
        <td class="stat-cell" style="text-align:center;padding:6px">
          <div style="font-size:22px;font-weight:bold;color:${seoColor}">${seoPassRate}%</div>
          <div style="font-size:12px;color:${BRAND.gray}">Pass Rate</div>
        </td>
        <td class="stat-cell" style="text-align:center;padding:6px">
          <div style="font-size:22px;font-weight:bold;color:${failedSeoChecks > 0 ? BRAND.red : BRAND.green}">${failedSeoChecks}</div>
          <div style="font-size:12px;color:${BRAND.gray}">Failing Checks</div>
        </td>
      </tr></table>
      ${failedSeoChecks > 0 ? `<p style="font-size:12px;color:${BRAND.gray};margin:8px 0 0">Only failing checks shown below:</p>${failTableHtml}` : `<p style="font-size:13px;color:${BRAND.green};margin:8px 0 0;font-weight:600">All on-page SEO checks passed.</p>`}
    `);
  }

  // ── e. Off-Page Opportunities ──
  let offPageHtml = "";
  if (offPageOpportunities && offPageOpportunities.opportunities && offPageOpportunities.opportunities.length > 0) {
    const top5 = offPageOpportunities.opportunities.slice(0, 5);
    const oppItems = top5.map((opp, i) => {
      const priorityColor = opp.priority === "high" ? BRAND.red : opp.priority === "medium" ? BRAND.amber : BRAND.gray;
      return `<tr>
        <td style="padding:6px 8px;border-bottom:1px solid ${BRAND.border};font-size:13px;font-weight:bold;color:${BRAND.navy};vertical-align:top">${i + 1}.</td>
        <td style="padding:6px 8px;border-bottom:1px solid ${BRAND.border}">
          <div style="font-size:13px;font-weight:600;color:${BRAND.navy}">${opp.name} <span style="font-size:10px;color:${priorityColor};font-weight:bold;text-transform:uppercase;border:1px solid ${priorityColor};border-radius:3px;padding:1px 4px;margin-left:4px">${opp.priority}</span></div>
          <div style="font-size:12px;color:${BRAND.gray};margin-top:2px">${opp.description}</div>
        </td>
      </tr>`;
    }).join("");
    offPageHtml = segmentHeader("🌐", "Off-Page Opportunities") + segmentBody(`
      <table style="width:100%;border-collapse:collapse">${oppItems}</table>
      ${offPageOpportunities.opportunities.length > 5 ? `<p style="font-size:11px;color:${BRAND.gray};margin:8px 0 0;text-align:right">+ ${offPageOpportunities.opportunities.length - 5} more in full report</p>` : ""}
    `);
  }

  // ── f. AI Summary ──
  let aiHtml = "";
  if (aiSummary) {
    const bullets = aiSummary.split("\n").filter(Boolean).map((line) => {
      const cleaned = line.replace(/^[-•*]\s*/, "").trim();
      return cleaned ? `<li style="margin:4px 0;font-size:12px;color:#374151">${cleaned}</li>` : "";
    }).join("");
    aiHtml = segmentHeader("🤖", "AI Summary") + segmentBody(`
      <ul style="margin:0;padding-left:18px">${bullets}</ul>
    `);
  }

  // ── g. Agent summary ──
  let agentHtml = "";
  if (agentSummary) {
    const { activeAgents, totalAgents, issues } = agentSummary;
    const agentPct = Math.round((activeAgents / totalAgents) * 100);
    let issuesBlock = "";
    if (issues && issues.length > 0) {
      issuesBlock = issues.map((i) =>
        `<div style="border-left:3px solid ${BRAND.red};padding:4px 10px;margin:4px 0;font-size:12px;background:#fef2f2">
          <strong>${i.agent}</strong> — ${i.status}: ${i.metric || "no details"}
        </div>`
      ).join("");
    }
    agentHtml = segmentHeader("👥", "Agent Team Status") + segmentBody(`
      <div style="text-align:center;margin:8px 0">
        <span style="font-size:28px;font-weight:bold;color:${BRAND.navy}">${activeAgents}/${totalAgents}</span>
        <span style="font-size:14px;color:${BRAND.gray}"> agents active (${agentPct}%)</span>
      </div>
      <div style="background:${BRAND.border};border-radius:99px;height:6px;margin:8px 0;overflow:hidden">
        <div style="background:${BRAND.teal};height:100%;width:${agentPct}%;border-radius:99px"></div>
      </div>
      ${issuesBlock}
    `);
  }

  // ── h. Weekly SEO Report Link ──
  let seoReportHtml = "";
  if (reportData.seoReportFile) {
    seoReportHtml = segmentHeader("📊", "Weekly SEO Report") + segmentBody(`
      <p style="font-size:13px;color:${BRAND.gray};margin:0 0 4px;text-align:center">Latest report: <strong>${reportData.seoReportFile}</strong></p>
      <p style="font-size:12px;color:${BRAND.gray};margin:0;text-align:center">Path: <code style="background:#f3f4f6;padding:2px 6px;border-radius:3px;font-size:11px">team/reports/weekly/${reportData.seoReportFile}</code></p>
    `);
  }

  // ── i. Leads Summary ──
  let leadsHtml = "";
  if (leadsData) {
    const { todayLeads = [], weekStats = {} } = leadsData;
    const canadian = todayLeads.filter((l) => l.tier === "canada");
    const usPriority = todayLeads.filter((l) => l.tier === "us-priority");
    const usGeneral = todayLeads.filter((l) => l.tier === "us-general" || l.tier === "other");

    function leadsRows(items) {
      if (items.length === 0) return `<tr><td colspan="4" style="padding:6px 8px;font-size:12px;color:${BRAND.gray}">No leads</td></tr>`;
      return items.slice(0, 5).map((l) => {
        const name = l.firstName ? `${l.firstName} ${l.lastName} — ${l.company}` : l.company || "Unknown";
        const loc = l.city ? `${l.city}, ${l.region || l.state || ""}` : l.region || l.state || "";
        const heat = l.score >= 70 ? "🔥" : l.score >= 40 ? "⚡" : "📋";
        return `<tr style="border-bottom:1px solid ${BRAND.border}">
          <td style="padding:4px 8px;font-size:12px">${name}</td>
          <td style="padding:4px 8px;font-size:12px">${loc}</td>
          <td style="padding:4px 8px;font-size:12px">${heat} ${l.score || 0}</td>
          <td style="padding:4px 8px;font-size:12px">${(l.pages || []).length}p</td>
        </tr>`;
      }).join("");
    }

    const weekTotal = weekStats.thisWeek || 0;
    const weekHot = weekStats.hot || 0;

    leadsHtml = segmentHeader("🎯", "Leads Update") + segmentBody(`
      <table style="width:100%;font-size:13px;color:${BRAND.navy};margin-bottom:8px"><tr>
        <td class="stat-cell" style="text-align:center;padding:6px">
          <div style="font-size:22px;font-weight:bold">${todayLeads.length}</div>
          <div style="font-size:12px;color:${BRAND.gray}">Yesterday</div>
        </td>
        <td class="stat-cell" style="text-align:center;padding:6px">
          <div style="font-size:22px;font-weight:bold;color:${BRAND.red}">${weekHot}</div>
          <div style="font-size:12px;color:${BRAND.gray}">Hot (Week)</div>
        </td>
        <td class="stat-cell" style="text-align:center;padding:6px">
          <div style="font-size:22px;font-weight:bold">${weekTotal}</div>
          <div style="font-size:12px;color:${BRAND.gray}">Total (Week)</div>
        </td>
      </tr></table>
      ${canadian.length > 0 ? `<p style="font-size:12px;font-weight:bold;color:${BRAND.navy};margin:8px 0 4px">🍁 Canadian (${canadian.length})</p>
      <table style="width:100%;border-collapse:collapse">${leadsRows(canadian)}</table>` : ""}
      ${usPriority.length > 0 ? `<p style="font-size:12px;font-weight:bold;color:${BRAND.navy};margin:8px 0 4px">🔵 US Priority (${usPriority.length})</p>
      <table style="width:100%;border-collapse:collapse">${leadsRows(usPriority)}</table>` : ""}
      ${usGeneral.length > 0 ? `<p style="font-size:12px;font-weight:bold;color:${BRAND.navy};margin:8px 0 4px">⚪ General (${usGeneral.length})</p>
      <table style="width:100%;border-collapse:collapse">${leadsRows(usGeneral)}</table>` : ""}
      ${todayLeads.length === 0 ? `<p style="font-size:13px;color:${BRAND.gray};text-align:center;margin:8px 0">No leads yesterday</p>` : ""}
    `);
  }

  // ── j. Agent Activity Feed (last 24h tasks from daily log) ──
  let agentDashboardHtml = "";
  if (agentDashboard) {
    const { teams, heartbeats, activityLog } = agentDashboard;

    // Parse activity log into grouped entries
    let activityHtml = "";
    if (activityLog && activityLog.length > 0) {
      // Group by team
      const agentToTeam = {};
      if (teams) {
        for (const [, team] of Object.entries(teams)) {
          for (const a of team.agents) {
            agentToTeam[a.id.toLowerCase()] = { teamName: team.name, emoji: team.emoji, label: a.label };
          }
        }
      }

      // Group entries by team
      const teamEntries = {};
      for (const entry of activityLog) {
        const agentLower = (entry.agent || "").toLowerCase();
        const info = agentToTeam[agentLower] || { teamName: "Other", emoji: "🔧", label: entry.agent };
        const key = info.teamName;
        if (!teamEntries[key]) teamEntries[key] = { emoji: info.emoji, entries: [] };
        teamEntries[key].entries.push({ ...entry, label: info.label });
      }

      let teamBlocks = "";
      for (const [teamName, data] of Object.entries(teamEntries)) {
        const items = data.entries.slice(0, 10).map((e) => {
          const isError = /fail|error/i.test(e.action) || /fail|error/i.test(e.detail);
          const icon = isError ? "❌" : "✅";
          const time = e.time || "";
          return `<tr>
            <td style="padding:3px 8px;border-bottom:1px solid ${BRAND.border};font-size:11px;color:${BRAND.gray};white-space:nowrap">${time}</td>
            <td style="padding:3px 8px;border-bottom:1px solid ${BRAND.border};font-size:11px">${icon} <strong>${e.label || e.agent}</strong></td>
            <td style="padding:3px 8px;border-bottom:1px solid ${BRAND.border};font-size:11px;color:${BRAND.gray}">${e.action}: ${e.detail}</td>
          </tr>`;
        }).join("");
        const moreCount = data.entries.length > 10 ? `<tr><td colspan="3" style="padding:3px 8px;font-size:10px;color:${BRAND.gray}">+ ${data.entries.length - 10} more</td></tr>` : "";
        teamBlocks += `<tr><td colspan="3" style="padding:6px 8px 3px;font-size:12px;font-weight:bold;color:${BRAND.navy}">${data.emoji} ${teamName}</td></tr>${items}${moreCount}`;
      }

      activityHtml = `<table style="width:100%;border-collapse:collapse">${teamBlocks}</table>`;
    } else {
      activityHtml = `<p style="font-size:12px;color:${BRAND.gray};text-align:center;margin:8px 0">No agent activity recorded today</p>`;
    }

    // Summary counts
    let totalAgents = 0, activeCount = 0;
    if (teams && heartbeats) {
      for (const team of Object.values(teams)) {
        for (const a of team.agents) {
          totalAgents++;
          const hb = heartbeats[a.id];
          if (hb && (Date.now() - new Date(hb.lastRun).getTime()) < 86400000) activeCount++;
        }
      }
    }
    const taskCount = (activityLog || []).length;

    agentDashboardHtml = segmentHeader("🤖", "Agent Command Center") + segmentBody(`
      <table style="width:100%;font-size:13px;color:${BRAND.navy};margin-bottom:10px"><tr>
        <td class="stat-cell" style="text-align:center;padding:6px">
          <div style="font-size:22px;font-weight:bold">${activeCount}/${totalAgents}</div>
          <div style="font-size:12px;color:${BRAND.gray}">Agents Active</div>
        </td>
        <td class="stat-cell" style="text-align:center;padding:6px">
          <div style="font-size:22px;font-weight:bold;color:${BRAND.teal}">${taskCount}</div>
          <div style="font-size:12px;color:${BRAND.gray}">Tasks Today</div>
        </td>
      </tr></table>
      ${activityHtml}
    `);
  }

  // ── k. SEO Performance Dashboard ──
  let seoPerformanceHtml = "";
  if (reportData.seoPerformance) {
    const { rankings, aiVisibility, contentStats } = reportData.seoPerformance;

    // Content stats row
    let statsHtml = "";
    if (contentStats) {
      statsHtml = `<table style="width:100%;font-size:13px;color:${BRAND.navy};margin-bottom:10px"><tr>
        <td class="stat-cell" style="text-align:center;padding:6px">
          <div style="font-size:22px;font-weight:bold">${contentStats.totalArticles}</div>
          <div style="font-size:12px;color:${BRAND.gray}">Articles</div>
        </td>
        <td class="stat-cell" style="text-align:center;padding:6px">
          <div style="font-size:22px;font-weight:bold">${contentStats.avgQA || "—"}</div>
          <div style="font-size:12px;color:${BRAND.gray}">Avg QA Score</div>
        </td>
        <td class="stat-cell" style="text-align:center;padding:6px">
          <div style="font-size:22px;font-weight:bold">${contentStats.totalWords || "—"}</div>
          <div style="font-size:12px;color:${BRAND.gray}">Total Words</div>
        </td>
      </tr></table>`;
    }

    // AI Visibility score
    let aiVisHtml = "";
    if (aiVisibility) {
      const visColor = aiVisibility.score >= 5 ? BRAND.green : aiVisibility.score >= 3 ? BRAND.amber : BRAND.red;
      aiVisHtml = `<div style="text-align:center;padding:8px;margin-bottom:10px;background:${BRAND.lightGray};border-radius:6px">
        <span style="font-size:11px;color:${BRAND.gray}">AI Search Visibility</span>
        <div style="font-size:28px;font-weight:bold;color:${visColor}">${aiVisibility.score}/${aiVisibility.total}</div>
        <span style="font-size:11px;color:${BRAND.gray}">${aiVisibility.date || "latest"}</span>
      </div>`;
    }

    // Rankings table
    let rankingsHtml = "";
    if (rankings && rankings.length > 0) {
      const rankRows = rankings.map((r) => {
        const pos = r.position !== null ? r.position : "—";
        const posColor = r.position !== null ? (r.position <= 10 ? BRAND.green : r.position <= 30 ? BRAND.amber : BRAND.red) : BRAND.gray;
        const trend = r.trend === "up" ? `<span style="color:${BRAND.green}">↑</span>` : r.trend === "down" ? `<span style="color:${BRAND.red}">↓</span>` : r.trend === "new" ? `<span style="color:${BRAND.teal}">NEW</span>` : `<span style="color:${BRAND.gray}">—</span>`;
        return `<tr>
          <td style="padding:4px 8px;border-bottom:1px solid ${BRAND.border};font-size:11px;max-width:180px;overflow:hidden;text-overflow:ellipsis">${r.keyword}</td>
          <td style="padding:4px 8px;border-bottom:1px solid ${BRAND.border};font-size:12px;font-weight:bold;color:${posColor};text-align:center">${pos}</td>
          <td style="padding:4px 8px;border-bottom:1px solid ${BRAND.border};font-size:12px;text-align:center">${trend}</td>
        </tr>`;
      }).join("");
      rankingsHtml = `<table style="width:100%;border-collapse:collapse">
        <tr style="background:${BRAND.navy}">
          <td style="padding:4px 8px;color:white;font-size:11px;font-weight:bold">Keyword</td>
          <td style="padding:4px 8px;color:white;font-size:11px;font-weight:bold;text-align:center">Position</td>
          <td style="padding:4px 8px;color:white;font-size:11px;font-weight:bold;text-align:center">Trend</td>
        </tr>
        ${rankRows}
      </table>`;
    }

    seoPerformanceHtml = segmentHeader("📈", "SEO Performance") + segmentBody(`
      ${statsHtml}${aiVisHtml}${rankingsHtml}
    `);
  }

  return `<head><style>
    @media only screen and (max-width:480px) {
      .stat-cell { display:block !important; width:100% !important; text-align:left !important; padding:6px 0 !important; border-bottom:1px solid #e5e7eb !important; }
      .stat-cell:last-child { border-bottom:none !important; }
      .detail-row td { display:block !important; width:100% !important; padding:4px 0 !important; }
      .check-detail { display:none !important; }
      .article-card { padding:10px !important; }
      .main-wrap { padding:12px 10px !important; }
      .header-wrap { padding:18px 12px !important; }
      .segment-pad { padding:10px 12px !important; }
    }
  </style></head>
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto">
    <!-- HEADER -->
    <div class="header-wrap" style="background:${BRAND.navy};color:white;padding:24px;text-align:center;border-radius:8px 8px 0 0">
      <h1 style="margin:0;font-size:20px;letter-spacing:-0.5px">ISO Certification Consultant Daily Dashboard</h1>
      <p style="margin:6px 0 0;opacity:0.7;font-size:13px">${dateStr} · ${timeStr} EST</p>
    </div>

    <!-- STATUS BAR -->
    <div style="background:${healthColor};color:white;padding:12px 24px;font-size:14px;font-weight:600">
      <table style="width:100%"><tr>
        <td style="color:white;font-size:14px;font-weight:600">${statusIcon} ${statusText}</td>
        <td style="color:white;font-size:14px;font-weight:600;text-align:right">${passed}/${total} checks passed</td>
      </tr></table>
    </div>

    <div class="main-wrap" style="padding:16px 20px;border:1px solid ${BRAND.border};border-top:none">
      <!-- HEALTH GAUGE -->
      <div style="text-align:center;padding:12px;margin-bottom:8px">
        <div style="font-size:48px;font-weight:bold;color:${BRAND.navy}">${healthPct}%</div>
        <div style="background:${BRAND.border};border-radius:99px;height:8px;margin:8px auto;max-width:300px;overflow:hidden">
          <div style="background:${healthColor};height:100%;width:${healthPct}%;border-radius:99px"></div>
        </div>
        <div style="color:${BRAND.gray};font-size:12px">Site Health Score</div>
      </div>

      <!-- FAILURES CALLOUT -->
      ${failuresHtml}

      <!-- SITE HEALTH CHECKS -->
      ${segmentHeader("🏥", "Site Health Checks")}
      ${segmentBody(`<table style="width:100%;border-collapse:collapse">
        <tr style="background:${BRAND.navy}">
          <td style="padding:5px 8px;color:white;font-size:11px;font-weight:bold">Check</td>
          <td style="padding:5px 8px;color:white;font-size:11px;font-weight:bold">Status</td>
          <td style="padding:5px 8px;color:white;font-size:11px;font-weight:bold">Detail</td>
        </tr>
        ${checkRows}
      </table>`)}

      <!-- BLOG -->
      ${blogHtml}

      <!-- ON-PAGE SEO -->
      ${onPageHtml}

      <!-- OFF-PAGE OPPORTUNITIES -->
      ${offPageHtml}

      <!-- AI SUMMARY -->
      ${aiHtml}

      <!-- AGENT STATUS -->
      ${agentHtml}

      <!-- LEADS -->
      ${leadsHtml}

      <!-- AGENT DASHBOARD -->
      ${agentDashboardHtml}

      <!-- GA4 ANALYTICS -->
      ${buildGa4Html(reportData.ga4Data, segmentHeader, segmentBody)}

      <!-- SEO PERFORMANCE -->
      ${seoPerformanceHtml}

      <!-- LINKEDIN ENGAGEMENT -->
      ${buildLinkedInHtml(reportData.linkedinData, segmentHeader, segmentBody)}

      <!-- GOOGLE INDEXING STATUS -->
      ${buildIndexingHtml(reportData.indexingData, segmentHeader, segmentBody)}

      <!-- WEEKLY SEO REPORT -->
      ${seoReportHtml}
    </div>

    <!-- FOOTER -->
    <div style="background:#f3f4f6;padding:12px 24px;text-align:center;border-radius:0 0 8px 8px;font-size:11px;color:#9ca3af">
      ISO Certification Consultant Agent Team · <a href="${SITE_URL}" style="color:${BRAND.teal};text-decoration:none">${SITE_URL}</a>
    </div>
  </div>`;
}

// ── GA4 Analytics HTML builder ──
function buildGa4Html(ga4Data, segmentHeader, segmentBody) {
  if (!ga4Data) return "";

  const { realtime, yesterday, overview, dailyTrend, topPages, trafficSources, countries, cities, devices, browsers } = ga4Data;

  // Stat card helper
  function stat(label, value, sub = "") {
    return `<div style="flex:1;min-width:100px;text-align:center;padding:8px">
      <div style="font-size:22px;font-weight:700;color:#1a365d">${value}</div>
      <div style="font-size:11px;color:#6b7280;margin-top:2px">${label}</div>
      ${sub ? `<div style="font-size:10px;color:#9ca3af">${sub}</div>` : ""}
    </div>`;
  }

  // Table helper
  function tableRow(cells, isHeader = false) {
    const tag = isHeader ? "th" : "td";
    const style = isHeader
      ? "background:#f9fafb;font-weight:600;font-size:11px;color:#374151;padding:6px 10px;text-align:left;border-bottom:1px solid #e5e7eb"
      : "font-size:12px;color:#4b5563;padding:6px 10px;border-bottom:1px solid #f3f4f6";
    return `<tr>${cells.map((c) => `<${tag} style="${style}">${c}</${tag}>`).join("")}</tr>`;
  }

  // ── Stats cards ──
  const statsHtml = `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:14px;background:#f9fafb;border-radius:6px;padding:8px 0">
    ${stat("Live Now", realtime || 0)}
    ${stat("Yesterday", yesterday.users, `${yesterday.pageviews} views`)}
    ${stat("28-Day Users", overview.users, `${overview.newUsers} new`)}
    ${stat("28-Day Sessions", overview.sessions)}
    ${stat("Pageviews", overview.pageviews)}
    ${stat("Bounce Rate", `${overview.bounceRate}%`)}
  </div>`;

  // ── Daily trend ──
  let trendHtml = "";
  if (dailyTrend.length > 0) {
    const trendRows = dailyTrend.map((d) => tableRow([d.date, d.users, d.sessions, d.pageviews])).join("");
    trendHtml = `<div style="margin-bottom:14px">
      <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">Daily Trend (7 days)</div>
      <table style="width:100%;border-collapse:collapse">
        ${tableRow(["Date", "Users", "Sessions", "Pageviews"], true)}
        ${trendRows}
      </table>
    </div>`;
  }

  // ── Top pages ──
  let pagesHtml = "";
  if (topPages.length > 0) {
    const pageRows = topPages.slice(0, 10).map((p) => tableRow([p.page, p.views, p.users, `${p.avgDuration}s`])).join("");
    pagesHtml = `<div style="margin-bottom:14px">
      <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">Top Pages (28 days)</div>
      <table style="width:100%;border-collapse:collapse">
        ${tableRow(["Page", "Views", "Users", "Avg Duration"], true)}
        ${pageRows}
      </table>
    </div>`;
  }

  // ── Traffic sources ──
  let sourcesHtml = "";
  if (trafficSources.length > 0) {
    const srcRows = trafficSources.map((s) => tableRow([`${s.source} / ${s.medium}`, s.sessions, s.users, s.newUsers])).join("");
    sourcesHtml = `<div style="margin-bottom:14px">
      <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">Traffic Sources (28 days)</div>
      <table style="width:100%;border-collapse:collapse">
        ${tableRow(["Source / Medium", "Sessions", "Users", "New Users"], true)}
        ${srcRows}
      </table>
    </div>`;
  }

  // ── Demographics: Countries + Cities side by side ──
  let demoHtml = "";
  if (countries.length > 0 || cities.length > 0) {
    const countryRows = countries.slice(0, 7).map((c) => tableRow([c.country, c.users, c.sessions])).join("");
    const cityRows = cities.slice(0, 7).map((c) => tableRow([c.city, c.users, c.sessions])).join("");
    demoHtml = `<div style="margin-bottom:14px">
      <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">Demographics (28 days)</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:200px">
          <table style="width:100%;border-collapse:collapse">
            ${tableRow(["Country", "Users", "Sessions"], true)}
            ${countryRows}
          </table>
        </div>
        <div style="flex:1;min-width:200px">
          <table style="width:100%;border-collapse:collapse">
            ${tableRow(["City", "Users", "Sessions"], true)}
            ${cityRows}
          </table>
        </div>
      </div>
    </div>`;
  }

  // ── Devices + Browsers ──
  let techHtml = "";
  if (devices.length > 0) {
    const deviceRows = devices.map((d) => tableRow([d.device, d.users, d.sessions])).join("");
    const browserRows = browsers.map((b) => tableRow([b.browser, b.users])).join("");
    techHtml = `<div style="margin-bottom:4px">
      <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px">Devices & Browsers</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        <div style="flex:1;min-width:180px">
          <table style="width:100%;border-collapse:collapse">
            ${tableRow(["Device", "Users", "Sessions"], true)}
            ${deviceRows}
          </table>
        </div>
        <div style="flex:1;min-width:180px">
          <table style="width:100%;border-collapse:collapse">
            ${tableRow(["Browser", "Users"], true)}
            ${browserRows}
          </table>
        </div>
      </div>
    </div>`;
  }

  return segmentHeader("📊", "Website Analytics (GA4)") + segmentBody(`
    ${statsHtml}
    ${trendHtml}
    ${pagesHtml}
    ${sourcesHtml}
    ${demoHtml}
    ${techHtml}
  `);
}

// ── LinkedIn Sharing HTML builder ──
function buildLinkedInHtml(linkedinData, segmentHeader, segmentBody) {
  if (!linkedinData) return "";

  const { week, totalShared, nextUp, candidateCount } = linkedinData;

  let statsHtml = `<table style="width:100%;border-spacing:0"><tr>
    <td style="text-align:center;padding:8px"><div style="font-size:20px;font-weight:700;color:${BRAND.teal}">${week.shared}</div><div style="font-size:11px;color:${BRAND.gray}">Shared This Week</div></td>
    <td style="text-align:center;padding:8px"><div style="font-size:20px;font-weight:700;color:${BRAND.navy}">${week.limit - week.shared}</div><div style="font-size:11px;color:${BRAND.gray}">Remaining</div></td>
    <td style="text-align:center;padding:8px"><div style="font-size:20px;font-weight:700;color:${BRAND.green}">${totalShared}</div><div style="font-size:11px;color:${BRAND.gray}">All-Time</div></td>
    <td style="text-align:center;padding:8px"><div style="font-size:20px;font-weight:700;color:${BRAND.amber}">${candidateCount}</div><div style="font-size:11px;color:${BRAND.gray}">In Queue</div></td>
  </tr></table>`;

  let recentHtml = "";
  if (week.posts.length > 0) {
    const rows = week.posts.map((p) =>
      `<div style="border-left:3px solid ${BRAND.teal};padding:6px 10px;margin:4px 0;background:#f0fdfa">
        <strong style="font-size:12px">${p.title}</strong>
        <div style="font-size:11px;color:${BRAND.gray}">${p.date} · <a href="${p.url}" style="color:${BRAND.teal}">View</a></div>
      </div>`
    ).join("");
    recentHtml = `<div style="margin-top:12px">
      <strong style="font-size:13px">Recent Shares</strong>
      ${rows}
    </div>`;
  }

  let nextHtml = "";
  if (nextUp) {
    nextHtml = `<div style="margin-top:8px;font-size:12px;color:${BRAND.gray}">
      Next up: <strong>${nextUp.title}</strong> (QA: ${nextUp.qaScore}/100)
    </div>`;
  }

  return segmentHeader("💼", "LinkedIn Sharing") + segmentBody(`
    ${statsHtml}
    ${recentHtml}
    ${nextHtml}
  `);
}

// ── Google Indexing Status HTML builder ──
function buildIndexingHtml(indexingData, segmentHeader, segmentBody) {
  if (!indexingData) return "";

  const { results, indexed, total } = indexingData;

  const summaryColor = indexed === total ? BRAND.green : indexed > 0 ? BRAND.yellow : BRAND.red;
  const summaryHtml = `<div style="text-align:center;padding:10px;margin-bottom:12px;background:#f9fafb;border-radius:6px">
    <div style="font-size:22px;font-weight:700;color:${summaryColor}">${indexed}/${total}</div>
    <div style="font-size:11px;color:${BRAND.gray}">Key Pages Indexed</div>
  </div>`;

  const rows = results.map((r) => {
    let stateColor = BRAND.red;
    let stateLabel = r.state;
    if (r.state === "Submitted and indexed") {
      stateColor = BRAND.green;
      stateLabel = "Indexed";
    } else if (r.state === "Discovered - currently not indexed" || r.state === "Crawled - currently not indexed") {
      stateColor = BRAND.yellow;
      stateLabel = r.state.replace(" - currently not indexed", "");
    }
    const crawledStr = r.crawled === "never" ? "Never" : new Date(r.crawled).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return `<tr>
      <td style="padding:6px 8px;border-bottom:1px solid ${BRAND.border};font-size:12px">${r.page}</td>
      <td style="padding:6px 8px;border-bottom:1px solid ${BRAND.border};font-size:12px;color:${stateColor};font-weight:600">${stateLabel}</td>
      <td style="padding:6px 8px;border-bottom:1px solid ${BRAND.border};font-size:11px;color:${BRAND.gray}">${crawledStr}</td>
    </tr>`;
  }).join("");

  const tableHtml = `<table style="width:100%;border-collapse:collapse">
    <tr>
      <th style="background:#f9fafb;font-weight:600;font-size:11px;color:#374151;padding:6px 8px;text-align:left;border-bottom:1px solid ${BRAND.border}">Page</th>
      <th style="background:#f9fafb;font-weight:600;font-size:11px;color:#374151;padding:6px 8px;text-align:left;border-bottom:1px solid ${BRAND.border}">Status</th>
      <th style="background:#f9fafb;font-weight:600;font-size:11px;color:#374151;padding:6px 8px;text-align:left;border-bottom:1px solid ${BRAND.border}">Last Crawled</th>
    </tr>
    ${rows}
  </table>`;

  return segmentHeader("🔍", "Google Indexing Status") + segmentBody(`
    ${summaryHtml}
    ${tableHtml}
  `);
}

async function sendMorningReport(reportData) {
  const { today } = require("./logger");
  return sendEmail({
    subject: `📊 ISO Certification Consultant Dashboard — ${today()} — ${reportData.passed}/${reportData.total} Passed`,
    html: buildMorningReportHtml(reportData),
    text: reportData.markdown || `Site health: ${reportData.passed}/${reportData.total} checks passed.`,
  });
}

function markdownToHtml(md) {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[PASS\]/g, '<span style="color:green">PASS</span>')
    .replace(/\[FAIL\]/g, '<span style="color:red">FAIL</span>')
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/\n/g, "<br>");
}

async function sendWeeklyReport(reportData) {
  const { today } = require("./logger");
  return sendEmail({
    subject: `ISO Certification Consultant Weekly SEO Report — ${today()}`,
    html: `<div style="font-family:sans-serif;max-width:600px">${markdownToHtml(reportData.markdown)}</div>`,
    text: reportData.markdown,
  });
}

async function sendAlert(title, detail) {
  return sendEmail({
    subject: `ISO Certification Consultant ALERT: ${title}`,
    text: detail,
    html: `<div style="font-family:sans-serif"><h2 style="color:red">${title}</h2><p>${detail}</p></div>`,
  });
}

module.exports = { sendEmail, sendMorningReport, sendWeeklyReport, sendAlert, buildMorningReportHtml };
