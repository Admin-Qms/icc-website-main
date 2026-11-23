// Current reader-page witnesses only: source records and historical allegations
// cannot establish that two published pages contain the same text.
const comparisonProperty = {
  type: 'array', items: {
    type: 'object', additionalProperties: false,
    properties: {
      mode: { type: 'string', enum: ['exact', 'near'] },
      leftSpanIds: { type: 'array', minItems: 1, items: { type: 'string' } },
      rightSpanIds: { type: 'array', minItems: 1, items: { type: 'string' } },
    }, required: ['mode', 'leftSpanIds', 'rightSpanIds'],
  },
};
function comparisonEvidence(pages) {
  const catalog = new Map();
  const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
  const fail = () => { throw new Error('Required guide repetition comparison is missing, invalid or does not match current literal text'); };
  const suppliedPages = pages.map((page, pageIndex) => ({ ...page, paragraphs: page.paragraphs.map((paragraph, paragraphIndex) => {
    const segments = [...segmenter.segment(paragraph.text)].map(segment => segment.segment);
    if (segments.join('') !== paragraph.text) fail();
    return { ...paragraph, spans: segments.map((quote, span) => {
      const spanId = `${paragraph.evidenceId}:span:${span}`;
      catalog.set(spanId, { spanId, paragraphId: paragraph.evidenceId, page: pageIndex, slug: page.slug, paragraph: paragraphIndex, span, quote, parentQuote: paragraph.text });
      return { spanId, text: quote };
    }) };
  }) }));
  function side(ids) {
    if (!Array.isArray(ids) || !ids.length || ids.some(id => typeof id !== 'string' || !catalog.has(id))) fail();
    const selected = ids.map(id => catalog.get(id));
    if (selected.some((span, index) => span.page !== selected[0].page || span.paragraph !== selected[0].paragraph || span.span !== selected[0].span + index)) fail();
    return { page: selected[0].page, slug: selected[0].slug, paragraph: selected[0].paragraph, paragraphId: selected[0].paragraphId, spanIds: [...ids],
      quote: selected.map(span => span.quote).join(''), parentQuote: selected[0].parentQuote };
  }
  const normalized = quote => quote.normalize('NFC').replace(/\s+/gu, ' ').trim();
  function resolve(finding) {
    if (!Array.isArray(finding.comparisons)) fail();
    const required = finding.dimension === 'repetition' && finding.verdict !== 'clear';
    if (required ? !finding.comparisons.length : finding.comparisons.length) fail();
    return finding.comparisons.map(comparison => {
      if (!comparison || Object.keys(comparison).sort().join(',') !== 'leftSpanIds,mode,rightSpanIds' || !['exact', 'near'].includes(comparison.mode)) fail();
      const left = side(comparison.leftSpanIds); const right = side(comparison.rightSpanIds);
      if (left.page === right.page || !normalized(left.quote) || !normalized(right.quote)) fail();
      if (![left.paragraphId, right.paragraphId].every(id => finding.evidenceIds.includes(id))) fail();
      if (comparison.mode === 'exact' && normalized(left.quote) !== normalized(right.quote)) fail();
      // Near-copy judgments remain the independent reviewer's responsibility.
      // No overlap score or heuristic can turn an unresolved finding into a pass.
      return { mode: comparison.mode, left, right };
    });
  }
  return { pages: suppliedPages, resolve };
}
module.exports = { comparisonProperty, comparisonEvidence };
