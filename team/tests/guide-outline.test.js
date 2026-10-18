const { test } = require('node:test'); const assert = require('node:assert/strict');
let outline;
try { outline = require('../agents/content/guideOutline'); } catch(e) { if(e.code !== 'MODULE_NOT_FOUND') throw e; }
test('an outline allocates distinct chapter pages within the inclusive budget', () => {
  assert.ok(outline);
  const brief = outline.createGuideOutline({ id: 'document-control', topic: 'Document control software', primaryKeyword: 'document control software', moduleSlugs: ['document-control'] });
  assert.equal(brief.chapters.length, 9); assert.equal(brief.estimatedWords, 19500);
  assert.equal(new Set(brief.chapters.map(c => c.slug)).size, 9);
  assert.ok(brief.chapters.every(c => c.subsections.length >= 3 && c.subsections.length <= 5));
  assert.equal(outline.validateGuideOutline(brief).pass, true);
});
test('the outline validator rejects ten chapters rather than truncating silently', () => {
  assert.ok(outline);
  const brief = outline.createGuideOutline({ id: 'document-control', topic: 'Document control software', primaryKeyword: 'document control software', moduleSlugs: ['document-control'] });
  brief.chapters.push({ ...brief.chapters[0], slug: 'extra-chapter' });
  assert.equal(outline.validateGuideOutline(brief).pass, false); assert.equal(brief.chapters.length, 10);
});
test('chapter descriptions are specific to each chapter, fit 120-160 characters and name the keyword', () => {
  assert.ok(outline);
  for (const [id, topic, keyword] of [['document-control', 'Document control software', 'document control software'], ['capa-workflows', 'CAPA software', 'capa software'], ['supplier-quality', 'Supplier quality management software', 'supplier quality management software']]) {
    const brief = outline.createGuideOutline({ id, topic, primaryKeyword: keyword, moduleSlugs: [] });
    const descriptions = [brief.description, ...brief.chapters.map(c => c.description)];
    for (const d of descriptions) {
      assert.ok(d.length >= 120 && d.length <= 160, `${d.length}: ${d}`);
      assert.ok(d.toLowerCase().includes(keyword), d);
      assert.ok(!/^Explore /.test(d) && !d.includes('practical workflow examples'), d);
    }
    assert.equal(new Set(descriptions.map(d => d.split(':')[1])).size, descriptions.length);
  }
});
