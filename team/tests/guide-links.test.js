const { test } = require('node:test'); const assert = require('node:assert/strict');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path');
let checker; try { checker = require('../scripts/check-guide-links'); } catch(e) { if(e.code !== 'MODULE_NOT_FOUND') throw e; }
test('exported checks detect missing sibling chapters and anchor targets', t => {
  assert.ok(checker); const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-links-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'guides'), { recursive: true }); fs.writeFileSync(path.join(root, 'guides/index.html'), '<h1>Guides</h1><a href="/guides/missing-guide/">Missing</a><a href="#absent">Anchor</a>');
  const report = checker.checkGuideLinks(root); assert.equal(report.pass, false); assert.equal(report.failures.length, 2);
});
test('exported checks reject path traversal rather than reading outside out', t => {
  assert.ok(checker); const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-links-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'guides')); fs.writeFileSync(path.join(root, 'guides/index.html'), '<a href="/../../outside.html">Unsafe</a>');
  assert.equal(checker.checkGuideLinks(root).pass, false);
});
test('Next catch-all chunk filenames containing ellipses are valid assets', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-chunks-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'guides')); fs.mkdirSync(path.join(root, '_next/static/chunks/app/guides/[[...path]]'), { recursive: true });
  fs.writeFileSync(path.join(root, '_next/static/chunks/app/guides/[[...path]]/page.js'), '');
  fs.writeFileSync(path.join(root, 'guides/index.html'), '<script src="/_next/static/chunks/app/guides/%5B%5B...path%5D%5D/page.js"></script>');
  assert.equal(checker.checkGuideLinks(root).pass, true);
});
