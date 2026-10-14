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
