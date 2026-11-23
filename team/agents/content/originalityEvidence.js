const { toPlainText } = require('../shared/contentStore');

function articleEvidence(body) {
  const blocks = String(body || '').match(/[\s\S]+?(?:\r?\n[ \t]*\r?\n|$)/g) || [];
  if (blocks.join('') !== body) throw new Error('Originality article evidence lost source text');
  const passages = blocks.map((text, index) => ({ evidenceId: `article:paragraph:${index}`, text }));
  const catalog = new Map(passages.filter(item => toPlainText(item.text)).map(item => [item.evidenceId, item.text]));
  return { passages, catalog };
}

function constrainEvidence(schema, catalog) {
  for (const group of ['flaggedSentences', 'selfPlagiarismFlags']) {
    const item = schema.properties[group].items;
    delete item.properties.text;
    item.properties.evidenceId = { type: 'string', enum: [...catalog.keys()] };
    item.required = item.required.map(key => key === 'text' ? 'evidenceId' : key);
  }
  return schema;
}

function resolveEvidence(result, catalog, trace) {
  if (!result || !Array.isArray(result.flaggedSentences) || !Array.isArray(result.selfPlagiarismFlags)) return result;
  const resolve = (group, keys) => result[group].map((finding, index) => {
    if (!finding || typeof finding !== 'object' || Object.keys(finding).length !== keys.length || !keys.every(key => Object.hasOwn(finding, key)) || !catalog.has(finding.evidenceId)) {
      trace.evidenceIssue = { group, index, reason: 'invalid-passage-reference-or-shape' };
      throw new Error('Originality review cites missing article evidence or comparison');
    }
    return { ...finding, text: catalog.get(finding.evidenceId) };
  });
  return { ...result,
    flaggedSentences: resolve('flaggedSentences', ['evidenceId', 'reason', 'suggestion']),
    selfPlagiarismFlags: resolve('selfPlagiarismFlags', ['evidenceId', 'similarTo', 'similarity']),
  };
}

module.exports = { articleEvidence, constrainEvidence, resolveEvidence };
