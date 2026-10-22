// Topic scout: keeps the blog keyword queue and the guide topic queue from running dry
// with no human in the loop.
//
// The scheduled scout session does the web research and writes a proposals file; this
// module is the deterministic half. `scoutStatus` tells the session what is needed and
// `applyProposals` validates every proposal, has each guide topic judged by an
// independent reviewer, writes the queues and the link bank, and reports what happened.
//
// A guide topic is approved only when ALL of these hold:
//   1. hard rules in code: slug, no duplicate against topics/aliases/keywords, ICC module
//      slugs, AS9100/ISO 27001 excluded, >= 2 https sources with one outside ICC's site,
//      no source on the blocked-domain list, queue caps;
//   2. every source fetched successfully (HTTP 200) and its page text mentions the topic;
//   3. an independent reviewer (the configured LLM, a different prompt from the proposer,
//      shown the fetched page text rather than the proposer's claims) passes every rule
//      in REVIEW_RULES.
// A reviewer failure rejects the topic. Only a reviewer OUTAGE leaves a topic `proposed`,
// and the next run re-reviews it. Nothing waits for a person.
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
  BLOCKED_DOMAINS_PATH: path.join(guideConfig.SITE_ROOT, 'team/data/blocked-source-domains.json'),
  SITE_TS_PATH: path.join(guideConfig.SITE_ROOT, 'lib/site.ts'),
});
// Standards the blog does not cover (keywordResearcher.js has the same rule).
const EXCLUDED_TOPIC_RE = /\bas\s?-?9100\b|\b27001\b/i;
const BLOG_LOW_WATER = 14;     // keywordResearcher warns below this
const BLOG_TOP_UP_TO = 28;     // four weeks of daily articles
const GUIDE_LOW_WATER = 4;     // two weeks of Mon/Thu guides
const GUIDE_MAX_PER_RUN = 3;
const GUIDE_MAX_PENDING = 6;   // topics parked only because the reviewer was unavailable
const BANK_SECTION = 'software_guides';
const MIN_TOPIC_SOURCES = 2;   // an approved topic needs at least this many banked sources recorded on it
const PAGE_EXCERPT_CHARS = 6000;

const REVIEW_RULES = Object.freeze({
  R1_SCOPE: 'The topic is a software guide subject: how Canadian quality and operations teams use software for ONE quality-management process that matches the named ICC module(s). It is not a standards explainer, news, a product comparison, a vendor pitch or a certification how-to.',
  R2_DISTINCT: 'The topic is not a rewording, subset or superset of any existing topic in the queue or already published. It would not produce a guide that overlaps an existing one by more than a chapter.',
  R3_SOURCES: 'Every source is a primary or official document: a standards body, accreditation body, regulator, government agency, recognised industry body, or an ICC product page on isocertificationconsultants.ca. No vendor blog, marketing page, forum, aggregator, course material or AI-generated content. The fetched page text of each source genuinely supports the topic as described.',
  R4_ACCURACY: 'The keyword, module slugs, audience and problem statement are consistent with what the fetched sources say. The proposal names no standard, edition or clause the sources do not support.',
  R5_FIT: 'The subject is relevant to Canadian manufacturing or service organisations and does not involve AS9100 or ISO 27001.',
});

function createTopicScout(paths = DEFAULT_PATHS, { listPublishedPosts = listPosts } = {}) {
  const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
  const write = (file, data) => {
    const temporary = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(temporary, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
    fs.renameSync(temporary, file);
  };
  const domainList = file => fs.existsSync(file) ? read(file).domains.map(d => String(d).toLowerCase()) : [];
  const hostOf = url => { try { return new URL(url).hostname.toLowerCase(); } catch { return ''; } };
  const matchesDomain = (url, domains) => { const host = hostOf(url); return Boolean(host) && domains.some(d => host === d || host.endsWith(`.${d}`)); };
  const isTrusted = (url, domains = domainList(paths.TRUSTED_DOMAINS_PATH)) => matchesDomain(url, domains);
  const isBlocked = (url, domains = domainList(paths.BLOCKED_DOMAINS_PATH)) => matchesDomain(url, domains);
  const isICC = url => /(^|\.)isocertificationconsultants\.ca$/i.test(hostOf(url));
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
  const recordedSources = topic => (Array.isArray(topic.sources) ? topic.sources : []).filter(s => typeof s === 'string' && /^https:\/\//i.test(s));
  const keywordTokens = text => [...new Set(normalize(text).split(' ').filter(w => w.length > 3))];
  const mentionsTopic = (text, topic) => {
    const tokens = keywordTokens(`${topic.primaryKeyword} ${topic.topic}`); const haystack = normalize(text);
    return tokens.length > 0 && tokens.filter(t => haystack.includes(t)).length >= Math.min(2, tokens.length);
  };

  function scoutStatus() {
    const blog = read(paths.KEYWORD_QUEUE_PATH);
    const published = listPublishedPosts();
    const publishedKeywords = new Set(published.map(p => String(p.primaryKeyword || '').toLowerCase()));
    const remaining = blog.queue.filter(k => !publishedKeywords.has(k.toLowerCase()) && !EXCLUDED_TOPIC_RE.test(k));
    const guide = read(paths.GUIDE_QUEUE_PATH);
    const publishedGuides = publishedGuideTopicIds();
    const approvedEligible = guide.queue.filter(q => q.approval === 'approved' && !publishedGuides.has(q.id));
    const pending = guide.queue.filter(q => q.approval === 'proposed');
    // Approved topics seeded by hand have no recorded sources; the guide research stage
    // accepts only link-bank URLs, so such a topic's run would stop at research.
    const sourcesNeeded = approvedEligible.filter(q => recordedSources(q).length < MIN_TOPIC_SOURCES)
      .map(q => ({ id: q.id, topic: q.topic, primaryKeyword: q.primaryKeyword, moduleSlugs: q.moduleSlugs || [], problem: q.problem, recordedSources: recordedSources(q) }));
    const bank = read(paths.LINK_BANK_PATH);
    return {
      blog: { remaining: remaining.length, lowWater: BLOG_LOW_WATER, needed: remaining.length < BLOG_LOW_WATER ? BLOG_TOP_UP_TO - remaining.length : 0,
        queued: remaining, recentlyPublished: published.slice(-14).map(p => p.primaryKeyword).filter(Boolean), excluded: 'AS9100 and ISO 27001 topics are skipped' },
      guides: { approvedEligible: approvedEligible.map(q => q.id), pendingReview: pending.map(q => q.id), published: [...publishedGuides],
        needed: approvedEligible.length + pending.length < GUIDE_LOW_WATER ? Math.min(GUIDE_MAX_PER_RUN, Math.max(0, GUIDE_MAX_PENDING - pending.length)) : 0,
        sourcesNeeded, minSourcesPerTopic: MIN_TOPIC_SOURCES,
        allTopics: guide.queue.map(q => ({ id: q.id, topic: q.topic, approval: q.approval })), moduleSlugs: moduleSlugs(),
        reviewRules: REVIEW_RULES },
      sources: { trustedDomains: domainList(paths.TRUSTED_DOMAINS_PATH), blockedDomains: domainList(paths.BLOCKED_DOMAINS_PATH), bankUrlCount: bankUrls(bank).size, bankSection: BANK_SECTION },
      nothingNeeded: !(remaining.length < BLOG_LOW_WATER) && approvedEligible.length + pending.length >= GUIDE_LOW_WATER && pending.length === 0 && sourcesNeeded.length === 0,
    };
  }

  // Independent review of one topic. Returns { verdict: 'approve' | 'reject' | 'unavailable', findings, rules }.
  async function reviewTopic(topic, pages, existingTopics, reviewer) {
    const system = `You are the independent reviewer for software-guide topics proposed to an ISO consulting website. The proposer is a different agent; its claims are untrusted. Judge ONLY from the fetched page text supplied and the rules below. Apply every rule strictly; when in doubt, fail the rule. Return JSON only: {"rules":{"R1_SCOPE":"pass"|"fail","R2_DISTINCT":"pass"|"fail","R3_SOURCES":"pass"|"fail","R4_ACCURACY":"pass"|"fail","R5_FIT":"pass"|"fail"},"findings":[string]}. A finding is one sentence naming the rule and the reason.\n\nRules:\n${Object.entries(REVIEW_RULES).map(([k, v]) => `${k}: ${v}`).join('\n')}`;
    const user = JSON.stringify({
      proposal: { id: topic.id, topic: topic.topic, primaryKeyword: topic.primaryKeyword, secondaryKeywords: topic.secondaryKeywords, moduleSlugs: topic.moduleSlugs, audience: topic.audience, problem: topic.problem },
      existingTopics,
      sources: pages.map(p => ({ url: p.url, host: hostOf(p.url), trustedDomain: p.trusted, proposerName: p.name, proposerContext: p.context, fetchedText: String(p.text || '').slice(0, PAGE_EXCERPT_CHARS) })),
    });
    let result;
    try { result = await reviewer(system, user, 2048); } catch(error) { return { verdict: 'unavailable', findings: [`Reviewer unavailable: ${String(error.message).slice(0, 200)}`], rules: {} }; }
    const rules = result?.rules;
    const valid = rules && typeof rules === 'object' && Object.keys(REVIEW_RULES).every(k => ['pass', 'fail'].includes(rules[k])) && Array.isArray(result.findings);
    if (!valid) return { verdict: 'unavailable', findings: ['Reviewer returned an invalid verdict'], rules: {} };
    const failed = Object.keys(REVIEW_RULES).filter(k => rules[k] === 'fail');
    return { verdict: failed.length ? 'reject' : 'approve', findings: result.findings.map(String), rules };
  }

  // Fetch every source, apply the deterministic source rules, then the reviewer.
  async function judgeTopic(topic, sources, context, { fetchPage, reviewer, trusted, blocked, known }) {
    const pages = [];
    for (const s of sources) {
      if (isBlocked(s.url, blocked)) return { verdict: 'reject', findings: [`${s.url}: domain is on the blocked-source list`], pages };
      const page = await fetchPage(s.url);
      const entry = { ...s, trusted: isTrusted(s.url, trusted), reachable: Boolean(page?.ok), text: page?.text || '' };
      pages.push(entry);
      if (!entry.reachable) return { verdict: 'reject', findings: [`${s.url}: could not be fetched (HTTP 200 required)`], pages };
      if (!isICC(s.url) && !known.has(normalizeUrl(s.url)) && !mentionsTopic(entry.text, topic)) return { verdict: 'reject', findings: [`${s.url}: fetched page does not mention the topic`], pages };
    }
    const review = await reviewTopic(topic, pages, context, reviewer);
    return { ...review, pages };
  }

  async function applyProposals(proposals, { now = new Date(), fetchPage = defaultFetchPage, reviewer = defaultReviewer, dryRun = false } = {}) {
    const status = scoutStatus();
    const report = { blogKeywords: { added: [], rejected: [] }, guideTopics: { approved: [], rejected: [], pendingReview: [], reReviewed: [] }, topicSources: { stocked: [], rejected: [], unavailable: [] }, bankAdded: [], changed: false };
    const reject = (bucket, item, reasons) => report[bucket].rejected.push({ item, reasons: [].concat(reasons) });
    // The same shape rules for sources apply to a new topic and to sources stocked for an existing one.
    const sourceShapeProblem = sources => {
      const badSource = sources.find(s => !s || typeof s.url !== 'string' || !/^https:\/\//i.test(s.url) || !String(s.name || '').trim() || !String(s.context || '').trim());
      if (sources.length < MIN_TOPIC_SOURCES || badSource) return `at least ${MIN_TOPIC_SOURCES} sources, each with an https url, name and context`;
      if (!sources.some(s => !isICC(s.url))) return 'at least one source must be outside ICC\'s own site';
      return null;
    };

    // ---- blog keywords (deterministic rules only; the daily run picks the angle) ----
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
    const trusted = domainList(paths.TRUSTED_DOMAINS_PATH);
    const blocked = domainList(paths.BLOCKED_DOMAINS_PATH);
    const modules = new Set(moduleSlugs());
    const judge = { fetchPage, reviewer, trusted, blocked, known };
    const context = () => guide.queue.map(q => ({ id: q.id, topic: q.topic, primaryKeyword: q.primaryKeyword, approval: q.approval }));
    const bankSources = pages => {
      bank.industries[BANK_SECTION] = bank.industries[BANK_SECTION] || [];
      for (const s of pages) {
        if (known.has(normalizeUrl(s.url))) continue;
        bank.industries[BANK_SECTION].push({ url: s.url, name: String(s.name).trim(), context: String(s.context).trim(), verified: 'http', addedBy: 'topic-scout', addedAt: now.toISOString().slice(0, 10) });
        known.add(normalizeUrl(s.url)); report.bankAdded.push(s.url);
      }
    };
    const approvalStamp = review => ({ approval: 'approved', approvedBy: 'scout-reviewer', approvedAt: now.toISOString(), reviewRules: review.rules, reviewFindings: review.findings });

    // Topics parked earlier because the reviewer was unavailable are judged first.
    for (const entry of guide.queue.filter(q => q.approval === 'proposed' && Array.isArray(q.candidateSources))) {
      const review = await judgeTopic(entry, entry.candidateSources, context().filter(c => c.id !== entry.id), judge);
      report.guideTopics.reReviewed.push({ id: entry.id, verdict: review.verdict, findings: review.findings });
      if (review.verdict === 'approve') {
        bankSources(review.pages);
        Object.assign(entry, approvalStamp(review)); delete entry.candidateSources; delete entry.reviewNote;
        report.guideTopics.approved.push(entry.id);
      } else if (review.verdict === 'reject') {
        guide.queue.splice(guide.queue.indexOf(entry), 1); reject('guideTopics', entry.id, review.findings);
      }
    }

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
      const shapeProblem = sourceShapeProblem(sources);
      if (shapeProblem) { reject('guideTopics', label, shapeProblem); continue; }
      if (guideRoom <= 0) { reject('guideTopics', label, 'guide queue does not need more topics this run'); continue; }

      const entry = { id: t.id, topic: t.topic.trim(), aliases: Array.isArray(t.aliases) ? t.aliases : [], primaryKeyword: t.primaryKeyword.trim(),
        secondaryKeywords: Array.isArray(t.secondaryKeywords) ? t.secondaryKeywords : [], moduleSlugs: slugs, audience: t.audience.trim(), problem: t.problem.trim(),
        priority: priority + 1, proposedAt: now.toISOString(), proposedBy: 'topic-scout' };
      const review = await judgeTopic(entry, sources, context(), judge);
      if (review.verdict === 'reject') { reject('guideTopics', label, review.findings); continue; }
      if (review.verdict === 'approve') {
        bankSources(review.pages); Object.assign(entry, approvalStamp(review), { sources: sources.map(s => s.url) }); report.guideTopics.approved.push(t.id);
      } else {
        entry.approval = 'proposed';
        entry.candidateSources = sources.map(s => ({ url: s.url, name: String(s.name).trim(), context: String(s.context).trim() }));
        entry.reviewNote = `Reviewer unavailable on ${now.toISOString().slice(0, 10)}; re-reviewed automatically on the next scout run`;
        report.guideTopics.pendingReview.push({ id: t.id, findings: review.findings });
      }
      guide.queue.push(entry); names.forEach(n => taken.add(n)); guideRoom--; priority++;
    }

    // ---- sources for approved topics that have none recorded (the seeded topics) ----
    // The topic itself is already approved; only its sources are judged, through the same
    // fetch checks and the same independent reviewer. Nothing is parked: a rejection or an
    // outage leaves the topic in `sourcesNeeded` for the next run.
    const publishedGuides = publishedGuideTopicIds();
    const stockedThisRun = new Set();
    for (const p of Array.isArray(proposals?.topicSources) ? proposals.topicSources : []) {
      const topicId = String(p?.topicId || '');
      const entry = guide.queue.find(q => q.id === topicId);
      if (!entry || entry.approval !== 'approved') { reject('topicSources', topicId || '(unnamed)', 'topicId must name an approved topic in the guide queue'); continue; }
      if (publishedGuides.has(entry.id)) { reject('topicSources', topicId, 'topic is already published'); continue; }
      if (recordedSources(entry).length >= MIN_TOPIC_SOURCES || stockedThisRun.has(entry.id)) { reject('topicSources', topicId, 'topic already has its sources recorded'); continue; }
      const sources = Array.isArray(p.sources) ? p.sources : [];
      const shapeProblem = sourceShapeProblem(sources);
      if (shapeProblem) { reject('topicSources', topicId, shapeProblem); continue; }
      const review = await judgeTopic(entry, sources, context().filter(c => c.id !== entry.id), judge);
      if (review.verdict === 'reject') { reject('topicSources', topicId, review.findings); continue; }
      if (review.verdict === 'unavailable') { report.topicSources.unavailable.push({ topicId, findings: review.findings }); continue; }
      bankSources(review.pages);
      Object.assign(entry, { sources: sources.map(s => s.url), sourcesAddedBy: 'scout-reviewer', sourcesAddedAt: now.toISOString(), sourceReviewRules: review.rules, sourceReviewFindings: review.findings });
      stockedThisRun.add(entry.id); report.topicSources.stocked.push(entry.id);
    }

    report.changed = report.blogKeywords.added.length > 0 || report.guideTopics.approved.length > 0 || report.guideTopics.pendingReview.length > 0 || report.guideTopics.reReviewed.some(r => r.verdict !== 'unavailable') || report.topicSources.stocked.length > 0;
    if (report.changed && !dryRun) {
      write(paths.KEYWORD_QUEUE_PATH, blog);
      write(paths.GUIDE_QUEUE_PATH, guide);
      if (report.bankAdded.length) write(paths.LINK_BANK_PATH, bank);
    }
    return report;
  }

  return { scoutStatus, applyProposals, reviewTopic, isTrusted, isBlocked, moduleSlugs, REVIEW_RULES, constants: { BLOG_LOW_WATER, BLOG_TOP_UP_TO, GUIDE_LOW_WATER, GUIDE_MAX_PER_RUN, GUIDE_MAX_PENDING, MIN_TOPIC_SOURCES } };
}

function htmlToText(html) {
  return String(html).replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}
async function defaultFetchPage(url) {
  try {
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 20000);
    const response = await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal, headers: { 'user-agent': 'Mozilla/5.0 (compatible; ICC topic scout)', accept: 'text/html,application/pdf;q=0.8,*/*;q=0.5' } });
    clearTimeout(timer);
    if (!response.ok) return { ok: false, status: response.status, text: '' };
    const type = response.headers.get('content-type') || '';
    const body = await response.text();
    return { ok: true, status: response.status, text: /html/i.test(type) ? htmlToText(body) : body.slice(0, 50000) };
  } catch { return { ok: false, status: 0, text: '' }; }
}
async function defaultReviewer(system, user, maxTokens) {
  const { claudeJSONFast, hasLLMKey } = require('../shared/claude');
  if (!hasLLMKey()) throw new Error('No LLM key configured for the scout reviewer');
  return claudeJSONFast(system, user, maxTokens);
}

// One line for the scout's commit message and status line; reads only fields every report has.
function summarizeReport(report) {
  const count = (list, singular, plural = `${singular}s`) => `${list.length} ${list.length === 1 ? singular : plural}`;
  return [
    `${report.guideTopics.approved.length} approved + ${report.guideTopics.pendingReview.length} parked guide topics`,
    `${count(report.topicSources?.stocked || [], 'topic')} stocked with sources`,
    count(report.blogKeywords.added, 'blog keyword'),
    `${count(report.bankAdded, 'source')} banked`,
  ].join(', ');
}

module.exports = { createTopicScout, defaultFetchPage, defaultReviewer, htmlToText, summarizeReport, REVIEW_RULES, ...createTopicScout() };
