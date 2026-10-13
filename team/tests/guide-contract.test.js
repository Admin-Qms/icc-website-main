const { test } = require('node:test');
const assert = require('node:assert/strict');
const { structuralBundle } = require('./helpers/guideFixture');
let contract;
try { contract = require('../../lib/guide-contract.cjs'); } catch (e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }

test('a complete nine-chapter guide has an inclusive 19500-word budget', () => {
  assert.ok(contract, 'The shared guide contract must exist');
  const report = contract.validateGuideStructure(structuralBundle());
  assert.equal(report.wordCount, 19500);
  assert.equal(report.pass, true, JSON.stringify(report.failures));
});
test('valid individual chapters cannot exceed the whole-guide maximum', () => {
  assert.ok(contract);
  const report = contract.validateGuideStructure(structuralBundle({ chapterWords: 2200 }));
  assert.equal(report.pass, false);
  assert.ok(report.failures.some(x => x.id === 'total-words'));
});
test('ten chapters, a thin introduction and short chapters are rejected', () => {
  assert.ok(contract);
  for (const options of [{ chapters: 10 }, { introductionWords: 1499 }, { chapterWords: 1999 }, { chapterWords: 2201 }]) {
    assert.equal(contract.validateGuideStructure(structuralBundle(options)).pass, false);
  }
});
test('missing, duplicate and traversing chapter references are rejected', () => {
  assert.ok(contract);
  for (const mutate of [b => b.chapters.pop(), b => b.manifest.chapters[1].slug = b.manifest.chapters[0].slug, b => b.manifest.chapters[0].file = '../../secret.md']) {
    const bundle = structuralBundle(); mutate(bundle);
    assert.equal(contract.validateGuideStructure(bundle).pass, false);
  }
});
test('first/last navigation uses manifest order and stable URLs', () => {
  assert.ok(contract);
  const { manifest } = structuralBundle();
  manifest.chapters.reverse();
  assert.deepEqual(contract.chapterNeighbors(manifest, 'chapter-9'), { previous: '/guides/document-control-software/', next: '/guides/document-control-software/chapter-8/', contents: '/guides/document-control-software/' });
  assert.equal(contract.chapterNeighbors(manifest, 'chapter-1').next, null);
  assert.throws(() => contract.chapterNeighbors(manifest, 'not-real'), /chapter/i);
});
test('hashes invalidate prose, links and chapter order but preserve image-only reviews', () => {
  assert.ok(contract);
  const bundle = structuralBundle(); const before = contract.hashGuideInputs(bundle);
  bundle.introduction.image.src = '/images/guides/new.webp';
  assert.equal(contract.hashGuideInputs(bundle), before);
  bundle.chapters[0].body += '\n\n[Evidence](https://www.iso.org/changed)';
  assert.notEqual(contract.hashGuideInputs(bundle), before);
});
test('counts reader-visible Markdown, excluding frontmatter, images and URLs', () => {
  assert.ok(contract);
  assert.equal(contract.countGuideWords('---\ntitle: Hidden metadata\n---\n## Workflow\n\nSee [the record](https://example.org/long-hidden-url) now.\n\n![Industrial alt text](/image.webp)\n\n[IMAGE: manufacturing line]'), 5);
});
test('parse rejects missing metadata and computes actual reading time', () => {
  assert.ok(contract);
  assert.throws(() => contract.parseGuidePage('## Incomplete\n\nBody'), /title|metadata/i);
  const page = structuralBundle().chapters[0];
  const matter = require('gray-matter');
  const { body, ...metadata } = page;
  const parsed = contract.parseGuidePage(matter.stringify(body, { ...metadata, wordCount: 1, readTime: 1 }));
  assert.equal(parsed.wordCount, 2000); assert.equal(parsed.readTime, 10);
});
test('bad dates, duplicate titles and H1 bodies fail', () => {
  assert.ok(contract);
  const bundle = structuralBundle();
  bundle.chapters[0].date = '2099-10-01'; bundle.chapters[1].title = bundle.chapters[2].title; bundle.chapters[3].body = '# Duplicate heading\n\n' + bundle.chapters[3].body;
  const report = contract.validateGuideStructure(bundle, { now: new Date('2026-10-13T12:00:00Z') });
  assert.equal(report.pass, false);
  assert.ok(report.failures.some(x => x.id === 'page-date'));
  assert.ok(report.failures.some(x => x.id === 'unique-titles'));
  assert.ok(report.failures.some(x => x.id === 'single-h1'));
});
