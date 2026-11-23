// On a focused re-review, classify every earlier finding separately from new
// blocking findings. Literal evidence is selected by ID, never reconstructed
// from the reviewer's explanation or inferred from reassuring prose.
function chapterResolution(previous, page, research) {
  const findings = previous.findings;
  const evidence = [];
  const blocks = page.body.match(/[\s\S]+?(?:\r?\n[ \t]*\r?\n|$)/g) || [];
  if (blocks.join('') !== page.body) throw new Error('Chapter resolution evidence lost page text');
  blocks.forEach((text, index) => evidence.push({ evidenceId: `page:paragraph:${index}`, kind: 'page', text }));
  (research.sources || []).forEach((source, index) => (source.supportedClaims || []).forEach((text, claim) => {
    evidence.push({ evidenceId: `source:${index}:claim:${claim}`, kind: 'source', sourceId: source.id, text });
  }));
  const catalog = new Map(evidence.map(item => [item.evidenceId, item]));
  const property = {
    type: 'array', description: `Return exactly ${findings.length} decisions, one for each prior finding.`,
    items: { type: 'object', additionalProperties: false,
      properties: {
        index: { type: 'integer', enum: findings.map((_, index) => index) },
        verdict: { type: 'string', enum: ['clear', 'violation', 'uncertain'] },
        reason: { type: 'string', description: 'A nonempty explanation grounded in the supplied evidence.' },
        evidenceIds: { type: 'array', minItems: 1, items: { type: 'string', enum: [...catalog.keys()] } },
      }, required: ['index', 'verdict', 'reason', 'evidenceIds'],
    },
  };
  function validate(result) {
    const invalid = () => { throw new Error('Required chapter resolution returned invalid decisions or evidence'); };
    const decisions = result?.previousFindingDecisions;
    if (!Array.isArray(decisions) || decisions.length !== findings.length) invalid();
    const indices = new Set(); const resolvedEvidence = [];
    for (const decision of decisions) {
      if (!decision || Object.keys(decision).length !== 4 || !['index', 'verdict', 'reason', 'evidenceIds'].every(key => Object.hasOwn(decision, key)) ||
          !Number.isInteger(decision.index) || decision.index < 0 || decision.index >= findings.length || indices.has(decision.index) ||
          !['clear', 'violation', 'uncertain'].includes(decision.verdict) || typeof decision.reason !== 'string' || !decision.reason.trim() ||
          !Array.isArray(decision.evidenceIds) || !decision.evidenceIds.length || decision.evidenceIds.some(id => !catalog.has(id))) invalid();
      const witnesses = decision.evidenceIds.map(id => catalog.get(id));
      if (!witnesses.some(item => item.kind === 'page')) invalid();
      indices.add(decision.index);
      resolvedEvidence.push({ index: decision.index, evidence: witnesses });
    }
    return { protocol: 'indexed-chapter-resolution-v1', previousFindings: findings, decisions, resolvedEvidence };
  }
  return { evidence, property, validate };
}
module.exports = { chapterResolution };
