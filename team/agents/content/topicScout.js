// Topic scout: keeps the blog keyword queue and the guide topic queue from running dry.
//
// The scheduled scout session does the web research and writes a proposals file; this
// module is the deterministic half. `scoutStatus` tells the session what is needed and
// `applyProposals` validates every proposal, writes the queues and the link bank, and
// reports what it accepted. A guide topic is auto-approved only when every source is on
// the trusted-domain list and fetched successfully; otherwise it is queued as
// 'proposed' with its candidate sources for a human to approve.
const fs = require('node:fs');
const path = require('node:path');
const guideConfig = require('../shared/guideConfig');
const { KEYWORD_QUEUE_PATH } = require('../shared/config');
const { listPosts, normalizeUrl } = require('../shared/contentStore');
const { normalize } = require('../shared/guideTopics');
const { validSlug } = require('../../../lib/guide-contract.cjs');

const DEFAULT_PATHS = Object.freeze({
  KEYWORD_QUEUE_PATH,
  GUIDE_QUEUE_PATH: guideConfig.QUEUE_PATH,
  LINK_BANK_PATH: guideConfig.LINK_BANK_PATH,
  CONTENT_DIR: guideConfig.CONTENT_DIR,
  TRUSTED_DOMAINS_PATH: path.join(guideConfig.SITE_ROOT, 'team/data/trusted-source-domains.json'),
  SITE_TS_PATH: path.join(guideConfig.SITE_ROOT, 'lib/site.ts'),
});
// Standards the blog does not cover (keywordResearcher.js has the same rule).
const EXCLUDED_TOPIC_RE = /\bas\s?-?9100\b|\b27001\b/i;
const BLOG_LOW_WATER = 14;     // keywordResearcher warns below this
const BLOG_TOP_UP_TO = 28;     // four weeks of daily articles
const GUIDE_LOW_WATER = 4;     // two weeks of Mon/Thu guides
const GUIDE_MAX_PER_RUN = 3;
const GUIDE_MAX_PROPOSED = 6;  // unreviewed proposals waiting for a human
const BANK_SECTION = 'software_guides';

function createTopicScout(paths = DEFAULT_PATHS, { listPublishedPosts = listPosts } = {}) {
  const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
  const write = (file, data) => {
    const temporary = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(temporary, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
    fs.renameSync(temporary, file);
  };
  const trustedDomains = () => read(paths.TRUSTED_DOMAINS_PATH).domains.map(d => String(d).toLowerCase());
  const isTrusted = (url, domains) => {
    let host; try { host = new URL(url).hostname.toLowerCase(); } catch { return false; }
    return domains.some(d => host === d || host.endsWith(`.${d}`));
  };
  const moduleSlugs = () => {
    const source = fs.readFileSync(paths.SITE_TS_PATH, 'utf8');
    const start = source.indexOf('export const MODULES'); const end = source.indexOf('export const', start + 1);
    return [...source.slice(start, end === -1 ? undefined : end).matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
  };
  const publishedGuideTopicIds = () => {
    if (!fs.existsSync(paths.CONTENT_DIR)) return new Set();
    return new Set(fs.readdirSync(paths.CONTENT_DIR, { withFileTypes: true }).filter(e => e.isDirectory()).map(e => {
      try { return read(path.join(paths.CONTENT_DIR, e.name, 'guide.json')).topicId; } catch { return null; }
    }).filter(Boolean));
  };
  const bankUrls = bank => new Set(Object.values(bank.industries || {}).flat().map(s => normalizeUrl(s.url)));

  function scoutStatus() {
    const blog = read(paths.KEYWORD_QUEUE_PATH);
    const published = listPublishedPosts();
    const publishedKeywords = new Set(published.map(p => String(p.primaryKeyword || '').toLowerCase()));
    const remaining = blog.queue.filter(k => !publishedKeywords.has(k.toLowerCase()) && !EXCLUDED_TOPIC_RE.test(k));
    const guide = read(paths.GUIDE_QUEUE_PATH);
    const publishedGuides = publishedGuideTopicIds();
    const approvedEligible = guide.queue.filter(q => q.approval === 'approved' && !publishedGuides.has(q.id));
    const proposed = guide.queue.filter(q => q.approval === 'proposed');
    const bank = read(paths.LINK_BANK_PATH);
    return {
      blog: { remaining: remaining.length, lowWater: BLOG_LOW_WATER, needed: remaining.length < BLOG_LOW_WATER ? BLOG_TOP_UP_TO - remaining.length : 0,
        queued: remaining, recentlyPublished: published.slice(-14).map(p => p.primaryKeyword).filter(Boolean), excluded: 'AS9100 and ISO 27001 topics are skipped' },
      guides: { approvedEligible: approvedEligible.map(q => q.id), proposedWaiting: proposed.map(q => q.id), published: [...publishedGuides],
        needed: approvedEligible.length < GUIDE_LOW_WATER ? Math.min(GUIDE_MAX_PER_RUN, Math.max(0, GUIDE_MAX_PROPOSED - proposed.length)) : 0,
        allTopics: guide.queue.map(q => ({ id: q.id, topic: q.topic, approval: q.approval })), moduleSlugs: moduleSlugs() },
      sources: { trustedDomains: trustedDomains(), bankUrlCount: bankUrls(bank).size, bankSection: BANK_SECTION },
      nothingNeeded: !(remaining.length < BLOG_LOW_WATER) && approvedEligible.length >= GUIDE_LOW_WATER,
    };
  }

  async function applyProposals(proposals, { now = new Date(), fetchCheck = defaultFetchCheck, dryRun = false } = {}) {
    const status = scoutStatus();
    const report = { blogKeywords: { added: [], rejected: [] }, guideTopics: { approved: [], proposed: [], rejected: [] }, bankAdded: [], changed: false };
    const reject = (bucket, item, reason) => report[bucket].rejected.push({ item, reason });

    // ---- blog keywords ----
    const blog = read(paths.KEYWORD_QUEUE_PATH);
    const existing = new Set(blog.queue.map(k => k.toLowerCase()));
    const publishedKeywords = new Set(listPublishedPosts().map(p => String(p.primaryKeyword || '').toLowerCase()));
    let blogRoom = status.blog.needed;
    for (const raw of Array.isArray(proposals?.blogKeywords) ? proposals.blogKeywords : []) {
      const keyword = String(raw || '').trim().toLowerCase().replace(/\s+/g, ' ');
      if (keyword.length < 8 || keyword.length > 80 || !/^[a-z0-9 ,:'-]+$/.test(keyword)) { reject('blogKeywords', raw, 'keyword must be 8–80 plain characters'); continue; }
      if (EXCLUDED_TOPIC_RE.test(keyword)) { reject('blogKeywords', raw, 'AS9100 and ISO 27001 are not covered on the blog'); continue; }
      if (existing.has(keyword) || publishedKeywords.has(keyword)) { reject('blogKeywords', raw, 'already queued or published'); continue; }
      if (blogRoom <= 0) { reject('blogKeywords', raw, 'blog queue does not need more keywords this run'); continue; }
      blog.queue.push(keyword); existing.add(keyword); report.blogKeywords.added.push(keyword); blogRoom--;
    }

    // ---- guide topics ----
    const guide = read(paths.GUIDE_QUEUE_PATH);
    const bank = read(paths.LINK_BANK_PATH);
    const known = bankUrls(bank);
    const domains = trustedDomains();
    const modules = new Set(moduleSlugs());
    const taken = new Set(guide.queue.flatMap(q => [q.id, q.topic, q.primaryKeyword, ...(q.aliases || [])].filter(Boolean).map(normalize)));
    let guideRoom = status.guides.needed;
    let priority = Math.max(0, ...guide.queue.map(q => Number(q.priority) || 0));
    for (const t of Array.isArray(proposals?.guideTopics) ? proposals.guideTopics : []) {
      const label = t?.id || t?.topic || '(unnamed)';
      const text = ['topic', 'primaryKeyword', 'audience', 'problem'].every(k => typeof t?.[k] === 'string' && t[k].trim());
      if (!validSlug(t?.id) || !text) { reject('guideTopics', label, 'id (6–80 char slug), topic, primaryKeyword, audience and problem are required'); continue; }
      if (EXCLUDED_TOPIC_RE.test(`${t.topic} ${t.primaryKeyword}`)) { reject('guideTopics', label, 'AS9100 and ISO 27001 are not covered'); continue; }
      const names = [t.id, t.topic, t.primaryKeyword, ...(Array.isArray(t.aliases) ? t.aliases : [])].map(normalize);
      if (names.some(n => taken.has(n))) { reject('guideTopics', label, 'duplicates an existing topic, alias or keyword'); continue; }
      const slugs = Array.isArray(t.moduleSlugs) ? t.moduleSlugs : [];
      if (!slugs.length || !slugs.every(s => modules.has(s))) { reject('guideTopics', label, `moduleSlugs must name ICC modules: ${[...modules].join(', ')}`); continue; }
      const sources = Array.isArray(t.sources) ? t.sources : [];
      const badSource = sources.find(s => !s || typeof s.url !== 'string' || !/^https:\/\//i.test(s.url) || !String(s.name || '').trim() || !String(s.context || '').trim());
      if (sources.length < 2 || badSource) { reject('guideTopics', label, 'at least two sources, each with an https url, name and context'); continue; }
      const external = sources.filter(s => !/(^|\.)isocertificationconsultants\.ca$/i.test(new URL(s.url).hostname));
      if (!external.length) { reject('guideTopics', label, 'at least one source must be outside ICC\'s own site'); continue; }
      if (guideRoom <= 0) { reject('guideTopics', label, 'guide queue does not need more topics this run'); continue; }

      // Trust decision: every source trusted and reachable -> approved and banked.
      const checks = [];
      for (const s of sources) {
        const trusted = isTrusted(s.url, domains);
        const reachable = trusted && (known.has(normalizeUrl(s.url)) || await fetchCheck(s.url));
        checks.push({ ...s, trusted, reachable });
      }
      const autoApprove = checks.every(c => c.trusted && c.reachable);
      const entry = { id: t.id, topic: t.topic.trim(), aliases: Array.isArray(t.aliases) ? t.aliases : [], primaryKeyword: t.primaryKeyword.trim(),
        secondaryKeywords: Array.isArray(t.secondaryKeywords) ? t.secondaryKeywords : [], moduleSlugs: slugs, audience: t.audience.trim(), problem: t.problem.trim(),
        priority: ++priority, approval: autoApprove ? 'approved' : 'proposed', proposedAt: now.toISOString(), proposedBy: 'topic-scout' };
      if (autoApprove) {
        bank.industries[BANK_SECTION] = bank.industries[BANK_SECTION] || [];
        for (const s of checks) {
          if (known.has(normalizeUrl(s.url))) continue;
          bank.industries[BANK_SECTION].push({ url: s.url, name: s.name.trim(), context: s.context.trim(), verified: 'http', addedBy: 'topic-scout', addedAt: now.toISOString().slice(0, 10) });
          known.add(normalizeUrl(s.url)); report.bankAdded.push(s.url);
        }
        report.guideTopics.approved.push(t.id);
      } else {
        entry.candidateSources = checks.map(({ url, name, context, trusted, reachable }) => ({ url, name, context, trusted, reachable }));
        entry.reviewNote = 'Approve by setting approval to "approved" and moving reachable candidateSources into external-link-bank.json';
        report.guideTopics.proposed.push(t.id);
      }
      guide.queue.push(entry); names.forEach(n => taken.add(n)); guideRoom--;
    }

    report.changed = report.blogKeywords.added.length > 0 || report.guideTopics.approved.length > 0 || report.guideTopics.proposed.length > 0;
    if (report.changed && !dryRun) {
      write(paths.KEYWORD_QUEUE_PATH, blog);
      write(paths.GUIDE_QUEUE_PATH, guide);
      if (report.bankAdded.length) write(paths.LINK_BANK_PATH, bank);
    }
    return report;
  }

  return { scoutStatus, applyProposals, isTrusted, moduleSlugs, constants: { BLOG_LOW_WATER, BLOG_TOP_UP_TO, GUIDE_LOW_WATER, GUIDE_MAX_PER_RUN, GUIDE_MAX_PROPOSED } };
}

async function defaultFetchCheck(url) {
  try {
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal, headers: { 'user-agent': 'Mozilla/5.0 (compatible; ICC topic scout)' } });
    clearTimeout(timer);
    return response.ok;
  } catch { return false; }
}

module.exports = { createTopicScout, defaultFetchCheck, ...createTopicScout() };
