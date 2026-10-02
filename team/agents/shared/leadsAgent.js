const fs = require("fs");
const path = require("path");
const { claudeCallFast } = require("./claude");
const { log, today } = require("./logger");
const { sendEmail } = require("./notifier");
const { MEMORY_DIR, LEADFEEDER_API_KEY } = require("./config");
const { updateHeartbeat } = require("./heartbeat");

const LEADS_LOG = path.join(MEMORY_DIR, "leads-log.json");

// ── Geographic scoring ────────────────────────────────────────────

const CANADIAN_PROVINCES = {
  ontario: { bonus: 10, context: "Ontario manufacturer — ISO 9001/14001/45001" },
  bc: { bonus: 10, context: "BC manufacturer — ISO 9001/14001" },
  "british columbia": { bonus: 10, context: "BC manufacturer — ISO 9001/14001" },
  alberta: { bonus: 10, context: "Alberta oil & gas sector — ISO 9001/14001" },
  quebec: { bonus: 10, context: "Quebec manufacturer — bilingual market" },
  manitoba: { bonus: 10, context: "Manitoba manufacturer — ISO 9001" },
  saskatchewan: { bonus: 10, context: "Saskatchewan manufacturer — ISO 9001" },
  "nova scotia": { bonus: 10, context: "Nova Scotia manufacturer — ISO 9001" },
};

const MICHIGAN_CITIES = [
  "detroit", "grand rapids", "lansing", "ann arbor", "flint",
  "warren", "dearborn", "sterling heights", "troy", "auburn hills",
];

const NEW_YORK_CITIES = [
  "buffalo", "rochester", "syracuse", "albany", "utica",
  "binghamton", "ithaca", "niagara falls", "jamestown",
];

function classifyLead(lead) {
  const city = (lead.city || "").toLowerCase().trim();
  const region = (lead.region || lead.state || "").toLowerCase().trim();
  const country = (lead.country || "").toLowerCase().trim();

  // Tier 1 — Canada
  if (country === "ca" || country === "canada") {
    const provinceInfo = CANADIAN_PROVINCES[region] || { bonus: 10, context: "Canadian manufacturer — ISO certification" };
    return { tier: "canada", label: "CANADIAN LEAD", bonus: provinceInfo.bonus, context: provinceInfo.context };
  }

  // Tier 2 — Michigan
  if (MICHIGAN_CITIES.includes(city) || region === "michigan" || region === "mi") {
    return {
      tier: "us-priority",
      label: "US PRIORITY — Michigan Automotive Belt",
      bonus: 8,
      context: "Michigan automotive supplier — likely needs ISO 9001 or IATF 16949 for OEM supply chain (Ford/GM/Stellantis supplier requirements)",
    };
  }

  // Tier 2 — New York
  if (NEW_YORK_CITIES.includes(city) || region === "new york" || region === "ny") {
    return {
      tier: "us-priority",
      label: "US PRIORITY — New York Manufacturing",
      bonus: 8,
      context: "Upstate NY manufacturer — likely needs ISO 9001, ISO 13485 (medical devices), or aerospace certification",
    };
  }

  // Tier 3 — US General
  if (country === "us" || country === "united states" || country === "usa") {
    return { tier: "us-general", label: "US GENERAL", bonus: 0, context: "US manufacturer — ISO certification inquiry" };
  }

  return { tier: "other", label: "INTERNATIONAL", bonus: 0, context: "International inquiry" };
}

// ── Lead scoring ──────────────────────────────────────────────────

function scoreLead(lead) {
  let score = 0;
  const pages = (lead.pages || []).map((p) => (typeof p === "string" ? p : p.url || p.path || "").toLowerCase());

  // Page visit scores
  if (pages.some((p) => p.includes("/contact") || p.includes("/book"))) score += 30;
  if (pages.some((p) => p.includes("/services/iso-") || p.match(/\/services\/?$/))) score += 25;
  if (pages.some((p) => p.includes("/pricing"))) score += 20;
  if (lead.returnVisitor) score += 15;
  if (lead.timeOnSite >= 180) score += 10;
  if (pages.length >= 3) score += 10;

  // Geographic bonus
  const geo = classifyLead(lead);
  score += geo.bonus;

  // Research-only penalty
  const onlyBlog = pages.length > 0 && pages.every((p) => p.includes("/blog"));
  if (onlyBlog) score -= 20;

  return { score: Math.max(0, Math.min(100, score)), geo };
}

// ── Load / save leads ─────────────────────────────────────────────

function loadLeads() {
  try {
    return JSON.parse(fs.readFileSync(LEADS_LOG, "utf-8"));
  } catch {
    return [];
  }
}

function saveLeads(data) {
  fs.writeFileSync(LEADS_LOG, JSON.stringify(data, null, 2) + "\n");
}

// ── Score and alert all unscored leads ─────────────────────────────

async function processNewLeads() {
  log("leadsAgent", "process", "scoring new leads");
  const leads = loadLeads();
  let hotCount = 0;
  let warmCount = 0;
  let coldCount = 0;

  for (const lead of leads) {
    if (lead.score > 0) continue; // Already scored

    const { score, geo } = scoreLead(lead);
    lead.score = score;
    lead.tier = geo.tier;
    lead.tierLabel = geo.label;
    lead.marketContext = geo.context;

    if (score >= 70) {
      hotCount++;
      await sendHotAlert(lead);
    } else if (score >= 40) {
      warmCount++;
    } else {
      coldCount++;
    }
  }

  saveLeads(leads);
  const total = hotCount + warmCount + coldCount;
  log("leadsAgent", "process", `${total} new leads: ${hotCount} hot, ${warmCount} warm, ${coldCount} cold`);
  updateHeartbeat("leadsAgent", "complete", `${total} new, ${hotCount} hot`);
  return { total, hotCount, warmCount, coldCount };
}

// ── Hot alert email ───────────────────────────────────────────────

async function sendHotAlert(lead) {
  const isRb2b = lead.source === "rb2b";
  const isCanada = lead.tier === "canada";
  const tierEmoji = isCanada ? "🍁" : lead.tier === "us-priority" ? "🔵" : "⚪";
  const tierLabel = isCanada ? "CANADA" : "US PRIORITY";
  const pages = (lead.pages || []).map((p) => typeof p === "string" ? p : p.url || p.path || "").filter(Boolean);

  const pagesHtml = pages.map((p) => {
    const isHighValue = p.includes("/contact") || p.includes("/iso-") || p.includes("/services");
    return `<tr><td style="padding:4px 8px;font-size:13px">${isHighValue ? "✅" : "📄"} ${p}</td></tr>`;
  }).join("");

  const subject = isRb2b
    ? `🔥 Hot US Lead — ${lead.firstName} ${lead.lastName} — ${lead.company} — ${lead.state || ""}`
    : `🔥 Hot Canadian Lead — ${lead.company} — ${lead.city}, ${lead.region || ""}`;

  let personSection = "";
  if (isRb2b) {
    personSection = `
      <tr><td style="padding:6px 12px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px">Person Identified (via RB2B)</td></tr>
      <tr><td style="padding:4px 12px"><strong>Name:</strong> ${lead.firstName} ${lead.lastName}</td></tr>
      <tr><td style="padding:4px 12px"><strong>Title:</strong> ${lead.title || "N/A"}</td></tr>
      ${lead.linkedinUrl ? `<tr><td style="padding:4px 12px"><strong>LinkedIn:</strong> <a href="${lead.linkedinUrl}">${lead.linkedinUrl}</a></td></tr>` : ""}
      ${lead.email ? `<tr><td style="padding:4px 12px"><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></td></tr>` : ""}
      <tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb"></td></tr>`;
  }

  const linkedInSearch = isRb2b && lead.linkedinUrl
    ? `<a href="${lead.linkedinUrl}" style="display:inline-block;background:#0077B5;color:white;padding:8px 16px;border-radius:4px;text-decoration:none;font-size:13px;margin-right:8px">View LinkedIn Profile</a>`
    : `<a href="https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent((lead.company || "") + " quality manager")}" style="display:inline-block;background:#0077B5;color:white;padding:8px 16px;border-radius:4px;text-decoration:none;font-size:13px">Search LinkedIn</a>`;

  const emailButton = lead.email
    ? `<a href="mailto:${lead.email}" style="display:inline-block;background:#152B4B;color:white;padding:8px 16px;border-radius:4px;text-decoration:none;font-size:13px;margin-left:8px">Send Email</a>`
    : "";

  const html = `<div style="font-family:sans-serif;max-width:500px;margin:0 auto">
    <div style="background:#dc2626;color:white;padding:16px;text-align:center;border-radius:8px 8px 0 0">
      <div style="font-size:20px;font-weight:bold">🔥 HOT LEAD — ${tierEmoji} ${tierLabel}</div>
      <div style="font-size:32px;font-weight:bold;margin:8px 0">Score: ${lead.score}/100</div>
    </div>
    <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-top:none">
      ${personSection}
      <tr><td style="padding:4px 12px"><strong>Company:</strong> ${lead.company || "N/A"}</td></tr>
      <tr><td style="padding:4px 12px"><strong>Location:</strong> ${lead.city || ""}, ${lead.region || lead.state || ""}</td></tr>
      ${lead.industry ? `<tr><td style="padding:4px 12px"><strong>Industry:</strong> ${lead.industry}</td></tr>` : ""}
      ${lead.employeeCount ? `<tr><td style="padding:4px 12px"><strong>Size:</strong> ${lead.employeeCount} employees</td></tr>` : ""}
      <tr><td style="padding:4px 12px"><strong>Market:</strong> ${tierEmoji} ${lead.tierLabel}</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb"></td></tr>
      <tr><td style="padding:6px 12px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px">Pages Viewed</td></tr>
      ${pagesHtml}
      <tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb"></td></tr>
      <tr><td style="padding:6px 12px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px">Market Context</td></tr>
      <tr><td style="padding:8px 12px;font-size:13px">${lead.marketContext}</td></tr>
      <tr><td style="padding:8px 12px;border-bottom:1px solid #e5e7eb"></td></tr>
      <tr><td style="padding:6px 12px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:1px">Recommended Action</td></tr>
      <tr><td style="padding:8px 12px;font-size:13px">${isRb2b ? `${lead.firstName} is the decision maker and was just on your site. Connect on LinkedIn within the next hour.` : "Search LinkedIn for Quality Manager or Operations Director at this company and connect today."}</td></tr>
      <tr><td style="padding:12px;text-align:center">${linkedInSearch}${emailButton}</td></tr>
    </table>
    <div style="background:#f3f4f6;padding:8px;text-align:center;border-radius:0 0 8px 8px;font-size:11px;color:#9ca3af">
      ISO Certification Consultant Leads Agent · ${today()}
    </div>
  </div>`;

  await sendEmail({ subject, html, text: `HOT LEAD: ${lead.company} — Score ${lead.score}/100` });
  log("leadsAgent", "hot-alert", `${lead.company} — score ${lead.score}`);
}

// ── Daily digest ──────────────────────────────────────────────────

async function sendDailyDigest() {
  log("leadsAgent", "digest", "building daily digest");
  const leads = loadLeads();
  const todayStr = today();
  const todayLeads = leads.filter((l) => l.timestamp?.startsWith(todayStr));

  const canadian = todayLeads.filter((l) => l.tier === "canada");
  const usPriority = todayLeads.filter((l) => l.tier === "us-priority");
  const usGeneral = todayLeads.filter((l) => l.tier === "us-general" || l.tier === "other");

  // Week stats
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const weekLeads = leads.filter((l) => new Date(l.timestamp) >= weekStart);
  const hotWeek = weekLeads.filter((l) => l.score >= 70).length;
  const warmWeek = weekLeads.filter((l) => l.score >= 40 && l.score < 70).length;
  const coldWeek = weekLeads.filter((l) => l.score < 40).length;

  function leadsTable(items, showPerson = false) {
    if (items.length === 0) return "<p style='color:#999;font-size:13px'>No leads today</p>";
    return `<table style="width:100%;border-collapse:collapse;font-size:13px">
      <tr style="background:#f3f4f6"><th style="padding:6px;text-align:left">${showPerson ? "Name/Company" : "Company"}</th><th style="padding:6px;text-align:left">Location</th><th style="padding:6px;text-align:left">Score</th><th style="padding:6px;text-align:left">Pages</th></tr>
      ${items.map((l) => {
        const name = showPerson && l.firstName ? `${l.firstName} ${l.lastName} — ${l.company}` : l.company;
        const loc = l.city ? `${l.city}, ${l.region || l.state || ""}` : l.region || l.state || "";
        const heat = l.score >= 70 ? "🔥" : l.score >= 40 ? "⚡" : "📋";
        const pageCount = (l.pages || []).length;
        return `<tr style="border-bottom:1px solid #eee"><td style="padding:6px">${name}</td><td style="padding:6px">${loc}</td><td style="padding:6px">${heat} ${l.score}</td><td style="padding:6px">${pageCount} pages</td></tr>`;
      }).join("")}
    </table>`;
  }

  const html = `<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
    <div style="background:#152B4B;color:white;padding:16px;text-align:center;border-radius:8px 8px 0 0">
      <h1 style="margin:0;font-size:20px">📊 Daily Leads Digest</h1>
      <p style="margin:4px 0 0;opacity:0.8">${todayStr} · ISO Certification Consultant</p>
    </div>
    <div style="padding:16px;border:1px solid #e5e7eb;border-top:none">
      <h2 style="color:#152B4B;font-size:16px;margin:0 0 8px">🍁 Canadian Leads (${canadian.length} today)</h2>
      ${leadsTable(canadian)}
      <h2 style="color:#152B4B;font-size:16px;margin:20px 0 8px">🔵 US Priority — Michigan + New York (${usPriority.length} today)</h2>
      ${leadsTable(usPriority, true)}
      <h2 style="color:#152B4B;font-size:16px;margin:20px 0 8px">⚪ US General (${usGeneral.length} today)</h2>
      ${leadsTable(usGeneral)}
    </div>
    <div style="background:#f3f4f6;padding:12px;text-align:center;border-radius:0 0 8px 8px;font-size:12px;color:#6b7280">
      Total leads this week: ${weekLeads.length} | Hot: ${hotWeek} | Warm: ${warmWeek} | Cold: ${coldWeek}
    </div>
  </div>`;

  const subject = `📊 Leads Digest — ${todayStr} — 🍁 ${canadian.length} Canadian · 🔵 ${usPriority.length} US Priority · ⚪ ${usGeneral.length} General`;

  await sendEmail({ subject, html, text: `Leads today: ${todayLeads.length}. Canadian: ${canadian.length}, US Priority: ${usPriority.length}, General: ${usGeneral.length}` });
  log("leadsAgent", "digest", `sent — ${todayLeads.length} leads today`);
  updateHeartbeat("leadsAgent", "complete", `${todayLeads.length} leads today`);
  return { total: todayLeads.length, canadian: canadian.length, usPriority: usPriority.length, usGeneral: usGeneral.length };
}

// ── CLI functions ─────────────────────────────────────────────────

function showLeads(filter) {
  const leads = loadLeads();
  const todayStr = today();
  let filtered = leads.filter((l) => l.timestamp?.startsWith(todayStr));

  if (filter === "hot") filtered = filtered.filter((l) => l.score >= 70);

  return filtered;
}

function getStats() {
  const leads = loadLeads();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const weekLeads = leads.filter((l) => new Date(l.timestamp) >= weekStart);

  return {
    totalAllTime: leads.length,
    thisWeek: weekLeads.length,
    hot: weekLeads.filter((l) => l.score >= 70).length,
    warm: weekLeads.filter((l) => l.score >= 40 && l.score < 70).length,
    cold: weekLeads.filter((l) => l.score < 40).length,
    contacted: weekLeads.filter((l) => l.contacted).length,
    booked: weekLeads.filter((l) => l.booked).length,
    byTier: {
      canada: weekLeads.filter((l) => l.tier === "canada").length,
      usPriority: weekLeads.filter((l) => l.tier === "us-priority").length,
      usGeneral: weekLeads.filter((l) => l.tier === "us-general" || l.tier === "other").length,
    },
  };
}

module.exports = { processNewLeads, sendDailyDigest, showLeads, getStats, scoreLead, classifyLead };
