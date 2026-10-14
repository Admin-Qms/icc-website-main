const { test } = require('node:test'); const assert = require('node:assert/strict');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path');
const { createTopicScout, htmlToText, REVIEW_RULES } = require('../agents/content/topicScout');

function setup(t, { blogQueue = [], guideQueue = [], published = [] } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-scout-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const paths = {
    KEYWORD_QUEUE_PATH: path.join(root, 'keyword-queue.json'), GUIDE_QUEUE_PATH: path.join(root, 'guide-topic-queue.json'),
    LINK_BANK_PATH: path.join(root, 'external-link-bank.json'), CONTENT_DIR: path.join(root, 'guides'),
    TRUSTED_DOMAINS_PATH: path.join(root, 'trusted.json'), BLOCKED_DOMAINS_PATH: path.join(root, 'blocked.json'), SITE_TS_PATH: path.join(root, 'site.ts'),
  };
  fs.writeFileSync(paths.KEYWORD_QUEUE_PATH, JSON.stringify({ note: 'n', queue: blogQueue }));
  fs.writeFileSync(paths.GUIDE_QUEUE_PATH, JSON.stringify({ note: 'n', queue: guideQueue }));
  fs.writeFileSync(paths.LINK_BANK_PATH, JSON.stringify({ note: 'n', industries: { software_guides: [{ url: 'https://www.iso.org/standard/9001', name: 'ISO 9001', context: 'c', verified: 'search' }] } }));
  fs.writeFileSync(paths.TRUSTED_DOMAINS_PATH, JSON.stringify({ domains: ['iso.org', 'canada.ca', 'isocertificationconsultants.ca'] }));
  fs.writeFileSync(paths.BLOCKED_DOMAINS_PATH, JSON.stringify({ domains: ['reddit.com', 'medium.com'] }));
  fs.writeFileSync(paths.SITE_TS_PATH, 'export const MODULES: Module[] = [\n { slug: "document-control" },\n { slug: "nonconformance-capa" },\n { slug: "calibration-maintenance" }\n];\nexport const PAIN_POINTS = [];\n');
  return { paths, scout: createTopicScout(paths, { listPublishedPosts: () => published }), root };
}
const queue = p => JSON.parse(fs.readFileSync(p.GUIDE_QUEUE_PATH, 'utf8')).queue;
const bank = p => JSON.parse(fs.readFileSync(p.LINK_BANK_PATH, 'utf8')).industries.software_guides;
const fullBlogQueue = Array.from({ length: 20 }, (_, i) => `iso 9001 topic number ${i}`);
const fullGuideQueue = ['a-topic-one', 'a-topic-two', 'a-topic-three', 'a-topic-four'].map((id, i) => ({ id, topic: id, approval: 'approved', priority: i + 1 }));
const topic = (overrides = {}) => ({ id: 'calibration-software', topic: 'Calibration management software', primaryKeyword: 'calibration software', audience: 'Canadian quality teams', problem: 'Tracking gauge calibration due dates', moduleSlugs: ['calibration-maintenance'],
  sources: [{ url: 'https://www.iso.org/standard/calibration-page', name: 'ISO page', context: 'c' }, { url: 'https://isocertificationconsultants.ca/solutions/calibration-maintenance/', name: 'ICC module', context: 'c' }], ...overrides });
const relevantPage = async url => ({ ok: true, status: 200, text: `Guidance on calibration of measuring equipment and management software for ${url}` });
const passAll = Object.fromEntries(Object.keys(REVIEW_RULES).map(k => [k, 'pass']));
const approveAll = async () => ({ rules: passAll, findings: [] });

test('status reports nothing needed when both queues are stocked and nothing awaits review', t => {
  const { scout } = setup(t, { blogQueue: fullBlogQueue, guideQueue: fullGuideQueue });
  const status = scout.scoutStatus();
  assert.equal(status.nothingNeeded, true); assert.equal(status.blog.needed, 0); assert.equal(status.guides.needed, 0);
  assert.deepEqual(Object.keys(status.guides.reviewRules), Object.keys(REVIEW_RULES));
});
test('status counts only unpublished approved guide topics and unpublished, non-excluded blog keywords', t => {
  const { scout, paths } = setup(t, { blogQueue: ['iso 9001 one', 'as9100 excluded', 'published one'], guideQueue: [...fullGuideQueue, { id: 'waiting-topic', topic: 'w', approval: 'proposed' }], published: [{ primaryKeyword: 'published one' }] });
  fs.mkdirSync(path.join(paths.CONTENT_DIR, 'a-topic-one-software'), { recursive: true });
  fs.writeFileSync(path.join(paths.CONTENT_DIR, 'a-topic-one-software', 'guide.json'), JSON.stringify({ topicId: 'a-topic-one' }));
  const status = scout.scoutStatus();
  assert.equal(status.blog.remaining, 1); assert.equal(status.blog.needed, 27);
  assert.deepEqual(status.guides.approvedEligible, ['a-topic-two', 'a-topic-three', 'a-topic-four']); assert.equal(status.guides.needed, 0, 'three approved plus one pending is enough');
  assert.deepEqual(status.guides.pendingReview, ['waiting-topic']); assert.equal(status.nothingNeeded, false, 'a pending topic still needs a run');
});
test('a topic the reviewer passes is approved and its new sources are banked, with the verdict recorded', async t => {
  const { scout, paths } = setup(t);
  const seen = [];
  const reviewer = async (system, user) => { seen.push(JSON.parse(user)); assert.match(system, /independent reviewer/); return { rules: passAll, findings: ['All rules satisfied.'] }; };
  const report = await scout.applyProposals({ guideTopics: [topic()] }, { fetchPage: relevantPage, reviewer });
  assert.deepEqual(report.guideTopics.approved, ['calibration-software']); assert.deepEqual(report.guideTopics.rejected, []);
  assert.deepEqual(report.bankAdded, ['https://www.iso.org/standard/calibration-page', 'https://isocertificationconsultants.ca/solutions/calibration-maintenance/']);
  assert.equal(seen[0].sources.length, 2); assert.match(seen[0].sources[0].fetchedText, /calibration/); assert.equal(seen[0].sources[0].trustedDomain, true);
  const [entry] = queue(paths);
  assert.equal(entry.approval, 'approved'); assert.equal(entry.approvedBy, 'scout-reviewer'); assert.equal(entry.priority, 1); assert.deepEqual(entry.reviewRules, passAll);
  assert.equal(bank(paths).length, 3); assert.equal(bank(paths)[1].verified, 'http'); assert.equal(bank(paths)[1].addedBy, 'topic-scout');
});
test('a topic the reviewer fails on any rule is rejected with its findings and nothing is written', async t => {
  const { scout, paths } = setup(t);
  const reviewer = async () => ({ rules: { ...passAll, R3_SOURCES: 'fail' }, findings: ['R3_SOURCES: the second page is vendor marketing.'] });
  const report = await scout.applyProposals({ guideTopics: [topic()] }, { fetchPage: relevantPage, reviewer });
  assert.deepEqual(report.guideTopics.approved, []); assert.equal(report.changed, false);
  assert.deepEqual(report.guideTopics.rejected[0].reasons, ['R3_SOURCES: the second page is vendor marketing.']);
  assert.deepEqual(queue(paths), []); assert.equal(bank(paths).length, 1);
});
test('blocked domains, unreachable pages and pages that do not mention the topic are rejected before the reviewer runs', async t => {
  const { scout } = setup(t);
  let reviewerCalls = 0; const reviewer = async () => { reviewerCalls++; return { rules: passAll, findings: [] }; };
  const blocked = topic({ id: 'blocked-topic', topic: 'Blocked', primaryKeyword: 'blocked keyword', sources: [{ url: 'https://www.reddit.com/r/qms', name: 'n', context: 'c' }, { url: 'https://www.iso.org/x', name: 'n', context: 'c' }] });
  const dead = topic({ id: 'dead-link-topic', topic: 'Dead link', primaryKeyword: 'dead link keyword', sources: [{ url: 'https://www.iso.org/standard/dead-page', name: 'n', context: 'c' }, { url: 'https://isocertificationconsultants.ca/solutions/calibration-maintenance/', name: 'n', context: 'c' }] });
  const offTopic = topic({ id: 'off-topic-topic', topic: 'Off topic', primaryKeyword: 'off topic keyword' });
  const fetchPage = async url => url.includes('dead-page') ? { ok: false, text: '' } : { ok: true, text: 'This page is about welding procedures only.' };
  const report = await scout.applyProposals({ guideTopics: [blocked, dead, offTopic] }, { fetchPage, reviewer });
  assert.equal(reviewerCalls, 0);
  assert.match(report.guideTopics.rejected[0].reasons[0], /blocked-source list/);
  assert.match(report.guideTopics.rejected[1].reasons[0], /could not be fetched/);
  assert.match(report.guideTopics.rejected[2].reasons[0], /does not mention the topic/);
});
test('a reviewer outage parks the topic as proposed and the next run re-reviews it automatically', async t => {
  const { scout, paths } = setup(t);
  const outage = async () => { throw new Error('503 from provider'); };
  const first = await scout.applyProposals({ guideTopics: [topic()] }, { fetchPage: relevantPage, reviewer: outage });
  assert.deepEqual(first.guideTopics.pendingReview.map(p => p.id), ['calibration-software']); assert.equal(first.changed, true);
  assert.equal(queue(paths)[0].approval, 'proposed'); assert.equal(queue(paths)[0].candidateSources.length, 2); assert.equal(bank(paths).length, 1);
  assert.equal(scout.scoutStatus().nothingNeeded, false);

  const invalid = async () => ({ nonsense: true });
  const second = await scout.applyProposals({}, { fetchPage: relevantPage, reviewer: invalid });
  assert.equal(second.guideTopics.reReviewed[0].verdict, 'unavailable'); assert.equal(second.changed, false);

  const third = await scout.applyProposals({}, { fetchPage: relevantPage, reviewer: approveAll });
  assert.deepEqual(third.guideTopics.approved, ['calibration-software']); assert.equal(third.bankAdded.length, 2);
  assert.equal(queue(paths)[0].approval, 'approved'); assert.equal(queue(paths)[0].candidateSources, undefined);
});
test('a parked topic the reviewer later rejects is removed from the queue', async t => {
  const { scout, paths } = setup(t, { guideQueue: [{ id: 'parked-topic', topic: 'Parked', primaryKeyword: 'parked keyword', moduleSlugs: ['document-control'], approval: 'proposed', candidateSources: [{ url: 'https://www.iso.org/p', name: 'n', context: 'c' }, { url: 'https://isocertificationconsultants.ca/solutions/document-control/', name: 'n', context: 'c' }] }] });
  const reviewer = async () => ({ rules: { ...passAll, R1_SCOPE: 'fail' }, findings: ['R1_SCOPE: this is a standards explainer.'] });
  const report = await scout.applyProposals({}, { fetchPage: async () => ({ ok: true, text: 'parked keyword guidance' }), reviewer });
  assert.equal(report.guideTopics.reReviewed[0].verdict, 'reject'); assert.equal(report.changed, true);
  assert.deepEqual(queue(paths), []);
});
test('invalid, duplicate, excluded and surplus proposals are rejected with reasons and nothing is written', async t => {
  const { scout, paths } = setup(t, { blogQueue: fullBlogQueue, guideQueue: fullGuideQueue });
  const before = fs.readFileSync(paths.GUIDE_QUEUE_PATH, 'utf8');
  const report = await scout.applyProposals({
    blogKeywords: ['iso 9001 topic number 1', 'iso 27001 controls list', 'x', 'iatf 16949 layered process audit'],
    guideTopics: [topic({ id: 'bad' }), topic({ id: 'a-topic-one-alias', topic: 'a-topic-one' }), topic({ moduleSlugs: ['payroll'] }), topic({ sources: [{ url: 'https://isocertificationconsultants.ca/x/', name: 'n', context: 'c' }, { url: 'https://isocertificationconsultants.ca/y/', name: 'n', context: 'c' }] }), topic()],
  }, { fetchPage: relevantPage, reviewer: approveAll });
  assert.equal(report.changed, false);
  assert.deepEqual(report.blogKeywords.rejected.map(r => r.reasons[0]), ['already queued or published', 'AS9100 and ISO 27001 are not covered on the blog', 'keyword must be 8–80 plain characters', 'blog queue does not need more keywords this run']);
  assert.equal(report.guideTopics.rejected.length, 5);
  assert.match(report.guideTopics.rejected[1].reasons[0], /duplicates/); assert.match(report.guideTopics.rejected[2].reasons[0], /moduleSlugs/);
  assert.match(report.guideTopics.rejected[3].reasons[0], /outside ICC/); assert.match(report.guideTopics.rejected[4].reasons[0], /does not need/);
  assert.equal(fs.readFileSync(paths.GUIDE_QUEUE_PATH, 'utf8'), before);
});
test('blog keywords top the queue up to four weeks and no further', async t => {
  const { scout, paths } = setup(t, { blogQueue: ['iso 9001 remaining one'] });
  const proposals = Array.from({ length: 40 }, (_, i) => `iso 14001 scout keyword ${i}`);
  const report = await scout.applyProposals({ blogKeywords: proposals });
  assert.equal(report.blogKeywords.added.length, 27); assert.equal(report.blogKeywords.rejected.length, 13);
  assert.equal(JSON.parse(fs.readFileSync(paths.KEYWORD_QUEUE_PATH, 'utf8')).queue.length, 28);
  assert.equal(scout.scoutStatus().blog.needed, 0);
});
test('dry run reports without writing', async t => {
  const { scout, paths } = setup(t, { blogQueue: [] });
  const report = await scout.applyProposals({ blogKeywords: ['iso 45001 hazard register'] }, { dryRun: true });
  assert.deepEqual(report.blogKeywords.added, ['iso 45001 hazard register']);
  assert.equal(JSON.parse(fs.readFileSync(paths.KEYWORD_QUEUE_PATH, 'utf8')).queue.length, 0);
});
test('the real module slug list, trusted and blocked domains load from the repository', () => {
  const real = require('../agents/content/topicScout');
  assert.ok(real.moduleSlugs().includes('document-control')); assert.ok(real.moduleSlugs().includes('calibration-maintenance'));
  assert.equal(real.isTrusted('https://www.iso.org/standard/9001'), true);
  assert.equal(real.isTrusted('https://iso.org.evil.example/x'), false);
  assert.equal(real.isBlocked('https://www.reddit.com/r/iso9001'), true);
  assert.equal(real.isBlocked('https://www.iso.org/'), false);
  const status = real.scoutStatus();
  assert.ok(status.sources.trustedDomains.includes('iso.org')); assert.ok(status.sources.blockedDomains.includes('capterra.com'));
  assert.equal(htmlToText('<html><script>x()</script><body><h1>Calibration &amp; control</h1><p>text</p></body></html>'), 'Calibration & control text');
});
