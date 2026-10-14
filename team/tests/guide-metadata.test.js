const { test } = require('node:test'); const assert = require('node:assert/strict');
let checker; try { checker = require('../scripts/check-guide-metadata'); } catch(e) { if(e.code !== 'MODULE_NOT_FOUND') throw e; }
test('a chapter cannot inherit its guide root canonical', () => {
  assert.ok(checker);
  const report = checker.checkGuidePageMetadata('<head><link rel="canonical" href="https://isocertificationconsultants.ca/guides/document-control-software/"></head>', '/guides/document-control-software/daily-workflows/');
  assert.equal(report.pass, false); assert.ok(report.failures.some(f => f.id === 'canonical-url'));
});
test('duplicate canonicals and malformed schema are rejected', () => {
  assert.ok(checker); const url = 'https://isocertificationconsultants.ca/guides/';
  const html = `<head><link rel="canonical" href="${url}"><link rel="canonical" href="${url}"></head><script type="application/ld+json">not JSON</script>`;
  const report = checker.checkGuidePageMetadata(html, '/guides/');
  assert.ok(report.failures.some(f => f.id === 'canonical-count')); assert.ok(report.failures.some(f => f.id === 'structured-data'));
});
