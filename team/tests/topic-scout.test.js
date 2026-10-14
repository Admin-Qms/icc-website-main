const { test } = require('node:test'); const assert = require('node:assert/strict');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path');
const { createTopicScout } = require('../agents/content/topicScout');

function setup(t, { blogQueue = [], guideQueue = [], published = [] } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-scout-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const paths = {
    KEYWORD_QUEUE_PATH: path.join(root, 'keyword-queue.json'), GUIDE_QUEUE_PATH: path.join(root, 'guide-topic-queue.json'),
    LINK_BANK_PATH: path.join(root, 'external-link-bank.json'), CONTENT_DIR: path.join(root, 'guides'),
    TRUSTED_DOMAINS_PATH: path.join(root, 'trusted.json'), SITE_TS_PATH: path.join(root, 'site.ts'),
  };
  fs.writeFileSync(paths.KEYWORD_QUEUE_PATH, JSON.stringify({ note: 'n', queue: blogQueue }));
  fs.writeFileSync(paths.GUIDE_QUEUE_PATH, JSON.stringify({ note: 'n', queue: guideQueue }));
  fs.writeFileSync(paths.LINK_BANK_PATH, JSON.stringify({ note: 'n', industries: { software_guides: [{ url: 'https://www.iso.org/standard/9001', name: 'ISO 9001', context: 'c', verified: 'search' }] } }));
  fs.writeFileSync(paths.TRUSTED_DOMAINS_PATH, JSON.stringify({ domains: ['iso.org', 'canada.ca', 'isocertificationconsultants.ca'] }));
  fs.writeFileSync(paths.SITE_TS_PATH, 'export const MODULES: Module[] = [\n { slug: "document-control" },\n { slug: "nonconformance-capa" },\n { slug: "calibration-maintenance" }\n];\nexport const PAIN_POINTS = [];\n');
  return { paths, scout: createTopicScout(paths, { listPublishedPosts: () => published }) };
}
const fullBlogQueue = Array.from({ length: 20 }, (_, i) => `iso 9001 topic number ${i}`);
const fullGuideQueue = ['a-topic-one', 'a-topic-two', 'a-topic-three', 'a-topic-four'].map((id, i) => ({ id, topic: id, approval: 'approved', priority: i + 1 }));
const topic = (overrides = {}) => ({ id: 'calibration-software', topic: 'Calibration management software', primaryKeyword: 'calibration software', audience: 'Canadian quality teams', problem: 'Tracking gauge calibration due dates', moduleSlugs: ['calibration-maintenance'],
  sources: [{ url: 'https://www.iso.org/standard/calibration-page', name: 'ISO page', context: 'c' }, { url: 'https://isocertificationconsultants.ca/solutions/calibration-maintenance/', name: 'ICC module', context: 'c' }], ...overrides });

test('status reports nothing needed when both queues are stocked', t => {
  const { scout } = setup(t, { blogQueue: fullBlogQueue, guideQueue: fullGuideQueue });
  const status = scout.scoutStatus();
  assert.equal(status.nothingNeeded, true); assert.equal(status.blog.needed, 0); assert.equal(status.guides.needed, 0);
});
test('status counts only unpublished approved guide topics and unpublished, non-excluded blog keywords', t => {
  const { scout, paths } = setup(t, { blogQueue: ['iso 9001 one', 'as9100 excluded', 'published one'], guideQueue: [...fullGuideQueue, { id: 'waiting-topic', topic: 'w', approval: 'proposed' }], published: [{ primaryKeyword: 'published one' }] });
  fs.mkdirSync(path.join(paths.CONTENT_DIR, 'a-topic-one-software'), { recursive: true });
  fs.writeFileSync(path.join(paths.CONTENT_DIR, 'a-topic-one-software', 'guide.json'), JSON.stringify({ topicId: 'a-topic-one' }));
  const status = scout.scoutStatus();
  assert.equal(status.blog.remaining, 1); assert.equal(status.blog.needed, 27);
  assert.deepEqual(status.guides.approvedEligible, ['a-topic-two', 'a-topic-three', 'a-topic-four']); assert.equal(status.guides.needed, 3);
  assert.deepEqual(status.guides.proposedWaiting, ['waiting-topic']);
});
test('a topic whose sources are all trusted and reachable is approved and its new sources are banked', async t => {
  const { scout, paths } = setup(t);
  const fetched = [];
  const report = await scout.applyProposals({ guideTopics: [topic()] }, { fetchCheck: async url => { fetched.push(url); return true; } });
  assert.deepEqual(report.guideTopics.approved, ['calibration-software']); assert.deepEqual(report.guideTopics.rejected, []);
  assert.deepEqual(report.bankAdded, ['https://www.iso.org/standard/calibration-page', 'https://isocertificationconsultants.ca/solutions/calibration-maintenance/']);
  assert.equal(fetched.length, 2);
  const queue = JSON.parse(fs.readFileSync(paths.GUIDE_QUEUE_PATH, 'utf8')).queue;
  assert.equal(queue[0].approval, 'approved'); assert.equal(queue[0].priority, 1); assert.equal(queue[0].candidateSources, undefined);
  const bank = JSON.parse(fs.readFileSync(paths.LINK_BANK_PATH, 'utf8'));
  assert.equal(bank.industries.software_guides.length, 3); assert.equal(bank.industries.software_guides[1].verified, 'http');
});
test('an untrusted or unreachable source leaves the topic proposed, with nothing added to the bank', async t => {
  const { scout, paths } = setup(t);
  const untrusted = topic({ id: 'untrusted-topic', sources: [{ url: 'https://vendor-blog.example.com/post', name: 'n', context: 'c' }, { url: 'https://www.iso.org/standard/x', name: 'n', context: 'c' }] });
  const unreachable = topic({ id: 'unreachable-topic', topic: 'Unreachable', primaryKeyword: 'unreachable keyword' });
  const report = await scout.applyProposals({ guideTopics: [untrusted, unreachable] }, { fetchCheck: async () => false });
  assert.deepEqual(report.guideTopics.proposed, ['untrusted-topic', 'unreachable-topic']); assert.deepEqual(report.bankAdded, []);
  const queue = JSON.parse(fs.readFileSync(paths.GUIDE_QUEUE_PATH, 'utf8')).queue;
  assert.equal(queue[0].approval, 'proposed'); assert.equal(queue[0].candidateSources[0].trusted, false);
  assert.equal(queue[1].candidateSources[0].reachable, false);
  assert.equal(JSON.parse(fs.readFileSync(paths.LINK_BANK_PATH, 'utf8')).industries.software_guides.length, 1);
});
test('invalid, duplicate, excluded and surplus proposals are rejected with reasons and nothing is written', async t => {
  const { scout, paths } = setup(t, { blogQueue: fullBlogQueue, guideQueue: fullGuideQueue });
  const before = fs.readFileSync(paths.GUIDE_QUEUE_PATH, 'utf8');
  const report = await scout.applyProposals({
    blogKeywords: ['iso 9001 topic number 1', 'iso 27001 controls list', 'x', 'iatf 16949 layered process audit'],
    guideTopics: [topic({ id: 'bad' }), topic({ id: 'a-topic-one-alias', topic: 'a-topic-one' }), topic({ moduleSlugs: ['payroll'] }), topic({ sources: [{ url: 'https://isocertificationconsultants.ca/x/', name: 'n', context: 'c' }, { url: 'https://isocertificationconsultants.ca/y/', name: 'n', context: 'c' }] }), topic()],
  }, { fetchCheck: async () => true });
  assert.equal(report.changed, false);
  assert.deepEqual(report.blogKeywords.rejected.map(r => r.reason), ['already queued or published', 'AS9100 and ISO 27001 are not covered on the blog', 'keyword must be 8–80 plain characters', 'blog queue does not need more keywords this run']);
  assert.equal(report.guideTopics.rejected.length, 5);
  assert.match(report.guideTopics.rejected[1].reason, /duplicates/); assert.match(report.guideTopics.rejected[2].reason, /moduleSlugs/);
  assert.match(report.guideTopics.rejected[3].reason, /outside ICC/); assert.match(report.guideTopics.rejected[4].reason, /does not need/);
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
test('the real module slug list and trusted domains load from the repository', () => {
  const real = require('../agents/content/topicScout');
  assert.ok(real.moduleSlugs().includes('document-control')); assert.ok(real.moduleSlugs().includes('calibration-maintenance'));
  assert.equal(real.isTrusted('https://www.iso.org/standard/9001', ['iso.org']), true);
  assert.equal(real.isTrusted('https://iso.org.evil.example/x', ['iso.org']), false);
  const status = real.scoutStatus();
  assert.ok(Array.isArray(status.sources.trustedDomains) && status.sources.trustedDomains.includes('iso.org'));
});
