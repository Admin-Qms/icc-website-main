require('./helpers/env');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const qa = require('../agents/content/contentQA');

function fixture(t, body = 'The current edition is ISO 9001:2026.') {
  const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-adjudication-'));
  t.after(() => fs.rmSync(cacheDir, { recursive: true, force: true }));
  return { post: { slug: 'review-fixture', title: 'Risk decisions', description: 'Manufacturing risk decisions.', body }, cacheDir };
}
const disputed = { rule: 'STANDARD ACCURACY', text: 'The current edition is ISO 9001:2026.', reason: 'The sentence is correct and aligns with the supplied facts table.' };

// These catch accepting a contradictory screen without adjudication, silently
// clearing genuine violations, and treating an incomplete adjudication as approval.
test('a contradictory screening finding needs explicit independent clearance and retains both verdicts', async t => {
  const { post, cacheDir } = fixture(t);
  const result = await qa.auditClaims(post, {
    cacheDir, call: async () => ({ findings: [disputed] }),
    adjudicate: async (system, input) => {
      assert.ok(input.includes(post.body) && input.includes(disputed.reason));
      assert.match(system, /violation|uncertain/);
      return { decisions: [{ index: 0, verdict: 'clear', reason: 'The supplied editions table supports the quoted claim.' }] };
    },
  });
  assert.deepEqual(result.findings, []);
  assert.equal(result.advisory[0].text, disputed.text);
  assert.deepEqual(result.review.screeningFindings, [disputed]);
  assert.equal(result.review.decisions[0].verdict, 'clear');
});

for (const verdict of ['violation', 'uncertain']) {
  test(`a ${verdict} adjudication still blocks the claim`, async t => {
    const { post, cacheDir } = fixture(t, 'Most plants fail their first audit.');
    const finding = { rule: 'STATISTICS', text: post.body, reason: 'Unsupported generalization.' };
    const result = await qa.auditClaims(post, { cacheDir,
      call: async () => ({ findings: [finding] }),
      adjudicate: async () => ({ decisions: [{ index: 0, verdict, reason: 'No supporting evidence is supplied for the generalization.' }] }),
    });
    assert.equal(result.findings.length, 1);
    assert.equal(result.findings[0].text, post.body);
    const cached = JSON.parse(fs.readFileSync(path.join(cacheDir, 'review-fixture.json')));
    assert.deepEqual(cached.cleared, []);
  });
}

for (const response of [null, {}, { decisions: [] },
  { decisions: [{ index: 1, verdict: 'clear', reason: 'Wrong index.' }] },
  { decisions: [{ index: 0, verdict: 'clear', reason: '' }] },
  { decisions: [{ index: 0, verdict: 'pass', reason: 'Unknown verdict.' }] },
  { decisions: [{ index: 0, verdict: 'clear', reason: 'OK' }, { index: 0, verdict: 'clear', reason: 'Duplicate' }] },
]) {
  test(`malformed adjudication cannot clear or cache a claim: ${JSON.stringify(response)}`, async t => {
    const { post, cacheDir } = fixture(t);
    await assert.rejects(qa.auditClaims(post, { cacheDir,
      call: async () => ({ findings: [disputed] }), adjudicate: async () => response,
    }), /adjudicat/i);
    assert.equal(fs.existsSync(path.join(cacheDir, 'review-fixture.json')), false);
  });
}

test('unavailable independent adjudication fails closed and does not mark text cleared', async t => {
  const { post, cacheDir } = fixture(t);
  await assert.rejects(qa.auditClaims(post, { cacheDir, call: async () => ({ findings: [disputed] }),
    adjudicate: async () => { throw new Error('Adjudication unavailable'); },
  }), /unavailable/i);
  assert.equal(fs.existsSync(path.join(cacheDir, 'review-fixture.json')), false);
});

test('a clean initial screen needs no additional adjudication', async t => {
  const { post, cacheDir } = fixture(t);
  const result = await qa.auditClaims(post, { cacheDir, call: async () => ({ findings: [] }),
    adjudicate: async () => { throw new Error('Unnecessary adjudication'); },
  });
  assert.deepEqual(result.findings, []);
});

test('an unresolved body claim cannot reuse a previously cleared paragraph', async t => {
  const { post, cacheDir } = fixture(t);
  await qa.auditClaims(post, { cacheDir, call: async () => ({ findings: [] }) });
  const result = await qa.auditClaims(post, { cacheDir, call: async () => ({ findings: [disputed] }),
    adjudicate: async () => ({ decisions: [{ index: 0, verdict: 'uncertain', reason: 'The supplied evidence does not resolve the claim.' }] }),
  });
  assert.equal(result.findings.length, 1);
  assert.deepEqual(result.advisory, []);
});
