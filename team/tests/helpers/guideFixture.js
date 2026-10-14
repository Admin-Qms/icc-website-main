const crypto = require('node:crypto');

function bodyWithWords(words, sectionCount = 4, seed = 'workflow') {
  const portions = Array.from({ length: sectionCount }, (_, i) => {
    const count = Math.floor(words / sectionCount) + (i < words % sectionCount ? 1 : 0);
    return `## Section ${i + 1}\n\n${Array.from({ length: count - 2 }, (_, n) => `${seed}${i}item${n}`).join(' ')}`;
  });
  return portions.join('\n\n');
}

function structuralBundle({ chapters = 9, chapterWords = 2000, introductionWords = 1500 } = {}) {
  const page = (slug, words) => ({
    slug, title: `Document control software: ${slug}`, description: 'Document control software guidance for Canadian quality teams covering practical workflows, approval decisions, migration and implementation.',
    primaryKeyword: 'document control software', keywords: ['document control software'],
    author: 'ISO Certification Consultants Editorial Team', date: '2026-10-01',
    body: bodyWithWords(words, 4, slug), imageBrief: `An inspector applying ${slug} on a manufacturing line`,
    sourceIds: ['iso-documentation'], capabilityIds: [],
    image: { src: `/images/guides/document-control-software/${slug}.webp`, alt: `Industrial ${slug} workflow`, width: 1200, height: 675, source: 'test', sourceId: slug, sha256: crypto.createHash('sha256').update(slug).digest('hex'), licenseUrl: 'https://example.org/license' }
  });
  const pages = Array.from({ length: chapters }, (_, i) => page(`chapter-${i + 1}`, chapterWords));
  return {
    manifest: { schemaVersion: 1, topicId: 'document-control', slug: 'document-control-software',
      title: 'Document control software for Canadian quality teams', description: page('introduction', 1500).description,
      primaryKeyword: 'document control software', keywords: ['document control software'], audience: 'Canadian quality and operations teams',
      author: page('introduction', 1500).author, date: '2026-10-01', publishedAt: '2026-10-01T12:00:00Z',
      introductionFile: 'introduction.md', chapters: pages.map(p => ({ slug: p.slug, file: `chapters/${p.slug}.md` })),
      sources: [{ id: 'iso-documentation', title: 'Guidance on documented information', publisher: 'ISO', url: 'https://www.iso.org/files/live/sites/isoorg/files/archive/pdf/en/documented_information.pdf', retrievedAt: '2026-10-01T12:00:00Z', supportedClaims: ['Control documented information'] }],
      capabilitySnapshotHash: 'a'.repeat(64), researchSnapshotHash: 'b'.repeat(64) },
    introduction: page('document-control-software', introductionWords), chapters: pages
  };
}

module.exports = { structuralBundle, bodyWithWords };
