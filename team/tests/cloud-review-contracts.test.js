const { root, goodPost } = require('./helpers/env');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
process.env.ICC_CLOUD_ROUTINE = '1';
process.env.CLAUDE_API_KEY = 'offline-review-fixture';
const llm = require('../agents/shared/claude');
const qa = require('../agents/content/contentQA');
const { createTopicScout, REVIEW_RULES } = require('../agents/content/topicScout');
let serial = 0;
const post = () => goodPost({ slug: `cloud-claims-protocol-${++serial}`, body: `${goodPost().body}\n\nMost plants pass their first audit.` });
const finding = { rule: 'STATISTICS', text: 'Most plants pass their first audit.', reason: 'An unqualified generalization.' };
const reply = value => ({ text: JSON.stringify(value), truncated: false, stopReason: 'end_turn' });

test('normal Cloud claims screening and adjudication use strict protocols without clearing violations', async () => {
  llm._providers.claude = async (tier, _system, _user, budget, options) => options?.schema && budget === 4096
    ? reply(tier === 'fast' ? { findings: [finding] } : { decisions: [{ index: 0, verdict: 'violation', reason: 'The generalization is unsupported.' }] })
    : { text: '{invalid JSON}', truncated: false, stopReason: 'end_turn' };
  const result = await qa.validateLocal(post(), { phase: 'text' });
  const claims = result.checks.find(c => c.id === 'claims-audit');
  assert.equal(claims.pass, false);
  assert.deepEqual(claims.findings, [finding]);
  assert.equal(claims.review.decisions[0].verdict, 'violation');
});

test('Cloud claims reject malformed, refused, truncated and contradictory receipts before cache writes', async () => {
  for (const stage of ['fast', 'main']) for (const failure of ['json', 'refusal', 'truncated', 'outage', 'hybrid']) {
    const current = post();
    llm._providers.claude = async tier => {
      if (tier !== stage) return reply({ findings: [finding] });
      if (failure === 'outage') throw Object.assign(new Error('private-provider-header'), { status: 401 });
      if (failure === 'json') return { text: '{invalid JSON}', truncated: false, stopReason: 'end_turn' };
      if (failure === 'hybrid') return reply(stage === 'fast'
        ? { findings: [], unresolvedFindings: ['Unclassified issue.'] }
        : { decisions: [{ index: 0, verdict: 'clear', reason: 'Permitted.' }], unresolvedFindings: ['Unclassified issue.'] });
      return { ...reply(stage === 'fast' ? { findings: [] } : { decisions: [{ index: 0, verdict: 'clear', reason: 'Permitted.' }] }),
        truncated: failure === 'truncated', stopReason: failure === 'refusal' ? 'refusal' : 'max_tokens' };
    };
    const result = await qa.validateLocal(current, { phase: 'text' });
    assert.equal(result.checks.find(c => c.id === 'claims-audit').pass, false, `${stage}/${failure}`);
    assert.ok(!fs.existsSync(path.join(process.env.CLAIMS_AUDIT_CACHE_DIR, `${current.slug}.json`)), `${stage}/${failure} must not clear paragraphs`);
    assert.ok(!JSON.stringify(result).includes('private-provider-header'));
  }
});

test('Cloud claims require explicit independent clearance and keep uncertainty blocking', async () => {
  const text = 'The current edition is ISO 9001:2026.';
  for (const verdict of ['clear', 'uncertain']) {
    const current = goodPost({ slug: `cloud-edition-protocol-${++serial}`, body: `${goodPost().body}\n\n${text}` });
    llm._providers.claude = async tier => reply(tier === 'fast'
      ? { findings: [{ rule: 'STANDARD ACCURACY', text, reason: 'Check the current edition.' }] }
      : { decisions: [{ index: 0, verdict, reason: verdict === 'clear' ? 'The supplied editions table supports this edition.' : 'The reviewer has not resolved the edition.' }] });
    const result = await qa.validateLocal(current, { phase: 'text' });
    const claims = result.checks.find(c => c.id === 'claims-audit');
    assert.equal(claims.pass, verdict === 'clear');
    assert.equal(claims.review.screeningFindings.length, 1);
    assert.equal(claims.review.decisions[0].verdict, verdict);
    assert.equal(claims.findings.length, verdict === 'clear' ? 0 : 1);
  }
});

function scoutFixture() {
  const directory = path.join(root, `scout-contract-${++serial}`); fs.mkdirSync(directory);
  const paths = Object.fromEntries(['KEYWORD_QUEUE_PATH', 'GUIDE_QUEUE_PATH', 'LINK_BANK_PATH', 'CONTENT_DIR', 'TRUSTED_DOMAINS_PATH', 'BLOCKED_DOMAINS_PATH', 'SITE_TS_PATH'].map(name => [name, path.join(directory, name)]));
  for (const name of ['KEYWORD_QUEUE_PATH', 'GUIDE_QUEUE_PATH']) fs.writeFileSync(paths[name], JSON.stringify({ queue: [] }));
  fs.writeFileSync(paths.LINK_BANK_PATH, JSON.stringify({ industries: { software_guides: [] } }));
  fs.writeFileSync(paths.TRUSTED_DOMAINS_PATH, JSON.stringify({ domains: ['iso.org', 'isocertificationconsultants.ca'] }));
  fs.writeFileSync(paths.BLOCKED_DOMAINS_PATH, JSON.stringify({ domains: [] }));
  fs.writeFileSync(paths.SITE_TS_PATH, 'export const MODULES: Module[] = [\n { slug: "calibration-maintenance" }\n];\nexport const PAIN_POINTS = [];\n');
  const topic = { id: 'calibration-software', topic: 'Calibration management software', primaryKeyword: 'calibration software', audience: 'Canadian quality teams',
    problem: 'Tracking gauge calibration due dates', moduleSlugs: ['calibration-maintenance'], sources: [
      { url: 'https://www.iso.org/standard/calibration-page', name: 'ISO page', context: 'Calibration guidance.' },
      { url: 'https://isocertificationconsultants.ca/solutions/calibration-maintenance/', name: 'ICC module', context: 'Calibration workflow.' },
    ] };
  return { paths, topic, scout: createTopicScout(paths, { listPublishedPosts: () => [] }) };
}
const fetchPage = async url => ({ ok: true, status: 200, text: `Guidance on calibration of measuring equipment and management software for ${url}` });
const rules = Object.fromEntries(Object.keys(REVIEW_RULES).map(key => [key, 'pass']));

test('Cloud Scout strict reviewer preserves approve, reject and unavailable parking outcomes', async () => {
  for (const outcome of ['approve', 'reject', 'json', 'refusal', 'truncated', 'outage', 'hybrid']) {
    const f = scoutFixture();
    llm._providers.claude = async (_tier, _system, _user, budget, options) => {
      if (outcome === 'outage') throw Object.assign(new Error('private-provider-header'), { status: 401 });
      if (!options?.schema || budget !== 2048 || outcome === 'json') return { text: '{invalid JSON}', truncated: false, stopReason: 'end_turn' };
      const value = { rules: { ...rules, ...(outcome === 'reject' ? { R2_DISTINCT: 'fail' } : {}) }, findings: outcome === 'reject' ? ['R2_DISTINCT: Overlapping subject.'] : [],
        ...(outcome === 'hybrid' ? { unresolvedFindings: ['Unclassified issue.'] } : {}) };
      return { ...reply(value), truncated: outcome === 'truncated', stopReason: outcome === 'refusal' ? 'refusal' : 'end_turn' };
    };
    const report = await f.scout.applyProposals({ guideTopics: [f.topic] }, { fetchPage });
    const queue = JSON.parse(fs.readFileSync(f.paths.GUIDE_QUEUE_PATH)).queue;
    const bank = JSON.parse(fs.readFileSync(f.paths.LINK_BANK_PATH)).industries.software_guides;
    if (outcome === 'approve') { assert.equal(report.guideTopics.approved.length, 1); assert.equal(queue[0].approval, 'approved'); assert.equal(bank.length, 2); }
    else if (outcome === 'reject') { assert.equal(report.guideTopics.rejected.length, 1); assert.equal(queue.length, 0); assert.equal(bank.length, 0); }
    else { assert.equal(report.guideTopics.pendingReview.length, 1, outcome); assert.equal(queue[0].approval, 'proposed'); assert.equal(bank.length, 0); }
    assert.ok(!JSON.stringify(report).includes('private-provider-header'));
  }
});
