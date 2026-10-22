const { countGuideWords, hashValue, POLICY } = require('../../../lib/guide-contract.cjs');
const { checkVoice, checkFabricatedQuotes, toBlocks, findBritishSpellings, countBannedPhrases } = require('./contentQA');
const normalize = text => String(text).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
function pageWordBudget(job, slug) {
  const pages = [job.manifest.slug, ...job.manifest.chapters.map(c => c.slug)];
  if (!pages.includes(slug)) throw new Error('Unknown guide page');
  const minimum = s => s === job.manifest.slug ? POLICY.introductionMin : POLICY.chapterMin;
  const completed = Object.entries(job.pages || {}).filter(([s, p]) => s !== slug && p.status !== 'changed');
  const spent = completed.reduce((sum, [, p]) => sum + p.wordCount, 0);
  const done = new Set(completed.map(([s]) => s));
  const reserve = pages.filter(s => s !== slug && !done.has(s)).reduce((sum, s) => sum + minimum(s), 0);
  const min = minimum(slug); const max = Math.min(slug === job.manifest.slug ? POLICY.totalMax : POLICY.chapterMax, POLICY.totalMax - spent - reserve);
  return { min, max, possible: max >= min, spent, reserve, target: min };
}
function links(body, referenceBody = body) {
  const text = String(body); const values = [];
  for (const match of text.matchAll(/(?<!!)\[[^\]]+\]\(/g)) {
    let i = match.index + match[0].length; const start = i; let depth = 1;
    for (; i < text.length && depth; i++) { if (text[i] === '\\') { i++; continue; } if (text[i] === '(') depth++; if (text[i] === ')') depth--; }
    if (!depth) { const target = text.slice(start, i - 1).trim(); values.push(target.startsWith('<') ? target.slice(1, target.indexOf('>')) : target.split(/\s+["']/)[0]); }
  }
  for (const match of String(referenceBody).matchAll(/^ {0,3}\[([^\]]+)\]:\s*(?:<([^>]+)>|(\S+))/gm)) {
    if (referenceBody === body || text.includes(`[${match[1]}]`)) values.push(match[2] || match[3]);
  }
  values.push(...[...text.matchAll(/<(https?:\/\/[^>]+)>/g)].map(m => m[1]));
  return values;
}
function preserveCopyEdit(before, after) {
  const numbers = text => String(text).match(/(?<![\p{L}\p{N}_])[-+]?\d+(?:[.,]\d+)*(?:%|[A-Za-z°µ]+)?/gu) || [];
  const pass = hashValue(links(before)) === hashValue(links(after)) && hashValue(numbers(before)) === hashValue(numbers(after));
  return { pass, reason: pass ? '' : 'Copy edit changed citations, link destinations or factual numbers' };
}
function checkPageContent(page, plan = {}, research = {}) {
  const checks = []; const add = (id, pass, message, section) => checks.push({ id, pass: Boolean(pass), message, ...(section ? { section } : {}) });
  add('unresolved-marker', !/\[(?:IMAGE|SANITY_IMAGE|PLACEHOLDER):?[^\]]*\]|^\s*(?:TODO:|DRAFT:|SEO Page Title:|Meta Description:|CLEANING REPORT:)/im.test(page.body), 'Resolve image and processing markers before review');
  add('inline-image-provenance', !/!\[[^\]]*\]\(/.test(page.body), 'Guide inline assets are not supported; use the managed hero image brief');
  for (const [id, check] of [['voice', checkVoice], ['fabricated-quotes', checkFabricatedQuotes]]) { const result = check(toBlocks(page.body)); add(id, result.pass, result.message || id); }
  add('spelling', findBritishSpellings(page.body).length === 0, 'Use US spelling');
  add('banned-filler', countBannedPhrases(page.body).length === 0, 'Remove banned filler');
  add('single-h1', !/^#\s/m.test(page.body), 'The page shell supplies H1');
  const sections = [...String(page.body).matchAll(/^##\s+(.+)\r?\n([\s\S]*?)(?=^##\s|$(?![\s\S]))/gm)];
  for (const subsection of plan.subsections || []) {
    const title = typeof subsection === 'string' ? subsection : subsection.title;
    const matched = sections.find(s => normalize(s[1]) === normalize(title));
    add('subsection-coverage', matched && countGuideWords(matched[2]) >= 50, `Explain the assigned subsection with substantive content: ${title}`, title);
    if (subsection.sourceIds?.length) {
      const cited = links(matched?.[2] || '', page.body);
      const sources = subsection.sourceIds.map(id => (research.sources || []).find(s => s.id === id));
      add('subsection-evidence', sources.every(Boolean) && sources.some(s => cited.includes(s.url)), `Cite assigned evidence in ${title}; semantic review verifies support`, title);
    }
  }
  for (const faq of String(page.body).matchAll(/^###\s+(.+\?)\r?\n([\s\S]*?)(?=^#{1,3}\s|$(?![\s\S]))/gm)) add('faq-answer', countGuideWords(faq[2]) >= 20, `Answer with actionable detail: ${faq[1]}`, faq[1]);
  return { pass: checks.every(c => c.pass), checks, failures: checks.filter(c => !c.pass) };
}
function initialGuideContext(topic, outline, research) {
  return { schemaVersion: 1, topicId: topic.id, glossary: (outline.glossary || []).map(entry => ({ ...entry })), roles: ['Quality owner', 'Process owner', 'Operator'], recordNames: [],
    example: outline.example || { label: 'Illustrative example', description: `An unnamed Canadian manufacturer evaluates ${topic.topic.toLowerCase()} for one production workflow. All records and decisions are hypothetical; no customer results or product promises.` },
    reviewedChapters: [], researchHash: hashValue(research) };
}
function chapterInputHash(page, plan, research, context) { return hashValue({ body: page.body, metadata: { slug: page.slug, title: page.title, description: page.description, sourceIds: page.sourceIds, capabilityIds: page.capabilityIds }, plan, research, context }); }
// Reviewer glossary entries that are usable: a non-empty term and definition.
function usableGlossary(review) {
  return (Array.isArray(review?.glossary) ? review.glossary : []).filter(e => e && typeof e.term === 'string' && e.term.trim() && typeof e.definition === 'string' && e.definition.trim());
}
// Terms the reviewer defined differently from the frozen context. The frozen definition is
// kept; these are reported so a genuine disagreement can be seen, not thrown as a failure.
function glossaryVariants(context, review) {
  const frozen = new Map(context.glossary.map(e => [normalize(e.term), e]));
  return usableGlossary(review).filter(e => frozen.has(normalize(e.term)) && normalize(frozen.get(normalize(e.term)).definition) !== normalize(e.definition))
    .map(e => ({ term: frozen.get(normalize(e.term)).term, frozen: frozen.get(normalize(e.term)).definition, reviewer: e.definition }));
}
function updateGuideContext(context, page, review) {
  // The glossary is frozen once a term is defined: the chapter reviewer is a model and
  // rewords existing terms freely, so only terms it introduces are added.
  const glossary = new Map(context.glossary.map(e => [normalize(e.term), e]));
  for (const entry of usableGlossary(review)) {
    if (!glossary.has(normalize(entry.term))) glossary.set(normalize(entry.term), { term: entry.term.trim(), definition: entry.definition.trim() });
  }
  return { ...context, glossary: [...glossary.values()], roles: [...new Set([...context.roles, ...(review.roles || [])])], recordNames: [...new Set([...context.recordNames, ...(review.recordNames || [])])],
    reviewedChapters: [...context.reviewedChapters.filter(c => c.slug !== page.slug), { slug: page.slug, title: page.title, summary: review.summary, bodyHash: hashValue(page.body), decisions: review.decisions || [] }] };
}
module.exports = { pageWordBudget, preserveCopyEdit, checkPageContent, initialGuideContext, chapterInputHash, updateGuideContext, glossaryVariants, normalize, links };
