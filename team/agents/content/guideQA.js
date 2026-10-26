const { validateGuideStructure, hashGuideInputs, countGuideWords, guideRoutes } = require('../../../lib/guide-contract.cjs');
const { checkVoice, checkFabricatedQuotes, toBlocks, findBritishSpellings, countBannedPhrases, findPositioningTerms } = require('./contentQA');
const { getRoutes, toRoute } = require('../shared/siteRoutes');
const { keywordCovered } = require('../shared/contentStore');
const { checkPageContent, links } = require('./guideEditorial');

function extractLinks(body) {
  return links(body);
}
function repeatedPassages(pages) {
  const paragraphs = [];
  const findings = [];
  const shingles = words => new Set(words.slice(0, -4).map((_, i) => words.slice(i, i + 5).join(' ')));
  for (const page of pages) {
    for (const paragraph of String(page.body).split(/\n\s*\n/)) {
      if (/^\s*#/.test(paragraph)) continue;
      const words = paragraph.toLowerCase().replace(/https?:\/\/\S+/g, '').match(/[a-z0-9]+/g) || [];
      if (words.length < 50) continue;
      const current = shingles(words);
      for (const saved of paragraphs) {
        if (saved.slug === page.slug) continue;
        const shared = [...current].filter(s => saved.shingles.has(s)).length;
        if (shared >= 30 && shared / Math.min(current.size, saved.shingles.size) >= 0.7) findings.push(`${saved.slug} and ${page.slug} repeat a substantial passage`);
      }
      paragraphs.push({ slug: page.slug, shingles: current });
    }
  }
  return [...new Set(findings)];
}
async function validateGuide(bundle, context = {}) {
  const base = validateGuideStructure(bundle, { phase: context.phase || 'published' });
  const checks = [...base.checks];
  const add = (id, pass, message, page) => checks.push({ id, pass: Boolean(pass), message, ...(page ? { page } : {}) });
  const audit = context.audit;
  const repetition = repeatedPassages([bundle.introduction, ...bundle.chapters]);
  add('cross-chapter-repetition', repetition.length === 0, repetition.join('; ') || 'No substantially copied paragraphs across guide pages');
  add('audit-hash', audit?.inputHash === hashGuideInputs(bundle), 'Required review must match the current prose, metadata, links and evidence');
  add('audit-identity', typeof audit?.reviewer === 'string' && audit.reviewer.trim() && Number.isFinite(Date.parse(audit.reviewedAt)) && Date.parse(audit.reviewedAt) <= Date.now(), 'Review identity and date are required');
  for (const field of ['claims', 'consistency', 'repetition']) add(`audit-${field}`, audit?.[field] === 'passed', `${field} review must complete and pass; skipped or unavailable is a failure`);
  add('audit-findings', Array.isArray(audit?.unresolvedFindings) && audit.unresolvedFindings.length === 0, 'All required review findings must be resolved');
  const sourceIds = new Set(bundle.manifest.sources?.map(s => s.id) || []);
  const allowed = context.evidence?.allowedUrls || new Set();
  const capabilities = context.evidence?.capabilityIds || new Set();
  const routes = new Set([...getRoutes({ refresh: true }), '/guides', ...guideRoutes(bundle.manifest).map(toRoute)]);
  const hashes = new Set((context.existingImages || []).map(i => i.sha256));
  const providerIds = new Set((context.existingImages || []).filter(i => i.sourceId).map(i => `${i.source}:${i.sourceId}`));
  const titles = new Set((context.existingContent || []).map(p => p.title?.trim().toLowerCase()));
  const faqQuestions = [];
  for (const page of [bundle.introduction, ...bundle.chapters]) {
    checks.push(...checkPageContent(page, context.pagePlans?.[page.slug] || {}, { sources: bundle.manifest.sources }).checks.map(check => ({ ...check, page: page.slug })));
    const blocks = toBlocks(`${page.title}\n\n${page.description}\n\n${page.body}`);
    const voice = checkVoice(blocks); const quotes = checkFabricatedQuotes(blocks);
    add('voice', voice.pass, voice.message || 'Third person or direct address required', page.slug);
    add('fabricated-quotes', quotes.pass, quotes.message || 'No fabricated quotes', page.slug);
    add('spelling', findBritishSpellings(page.body).length === 0, 'Use ICC US spelling while preserving proper names', page.slug);
    add('banned-filler', countBannedPhrases(page.body).length === 0, 'Remove banned filler phrases', page.slug);
    add('positioning-terms', findPositioningTerms(`${page.title}\n${page.description}\n${page.body}`).length === 0, 'Remove product names and AI audit claims', page.slug);
    add('keyword-covered', keywordCovered(page.primaryKeyword, page.title) && keywordCovered(page.primaryKeyword, page.description), 'Assigned topic must be represented in both title and description', page.slug);
    add('page-title-unused', !titles.has(page.title?.trim().toLowerCase()), 'Title must not duplicate another published content page', page.slug);
    add('source-supported', page.sourceIds.every(id => sourceIds.has(id)), 'Every page source must appear in the manifest', page.slug);
    add('capability-supported', page.capabilityIds.every(id => capabilities.has(id)), 'Every claimed product capability must be verified', page.slug);
    let internal = 0, external = 0;
    for (const link of extractLinks(page.body)) {
      if (link.startsWith('/')) { internal++; add('internal-link', routes.has(toRoute(link)), `Internal destination must exist: ${link}`, page.slug); }
      else if (link.startsWith('#')) { add('local-anchor', link.length > 1, 'Anchor destination must be specified', page.slug); }
      else if (/^https:\/\//.test(link)) { external++; add('external-link', allowed.has(link) && bundle.manifest.sources.some(s => s.url === link), `External source must be approved and present in research: ${link}`, page.slug); }
      else add('link-scheme', false, `Unsupported guide link scheme: ${link}`, page.slug);
    }
    add('useful-links', internal >= 1 && external >= 1, 'Each page needs useful internal and primary-source links', page.slug);
    faqQuestions.push(...[...page.body.matchAll(/^###\s+(.+\?)\s*$/gm)].map(m => m[1].trim().toLowerCase()));
    if (context.requireImages !== false) {
      const image = page.image;
      add('hero-image', image?.width === 1200 && image?.height === 675 && typeof image?.alt === 'string' && image.alt.trim(), 'Each page needs a 1200×675 hero and alt text', page.slug);
      add('image-provenance', image?.src?.startsWith(`/images/guides/${bundle.manifest.slug}/`) && /^\/[a-zA-Z0-9/._-]+\.webp$/.test(image.src) && !image.src.includes('..') && image.source && image.sourceId && /^[a-f0-9]{64}$/.test(image.sha256 || '') && /^https:\/\//.test(image.licenseUrl || ''), 'Hero needs a safe path, source identity, hash and licensing reference', page.slug);
      add('image-unique', Boolean(image) && !hashes.has(image?.sha256) && !providerIds.has(`${image?.source}:${image?.sourceId}`), 'Hero must be unique across all content pages', page.slug);
      if (image) { hashes.add(image.sha256); providerIds.add(`${image.source}:${image.sourceId}`); }
    }
    add('read-time', page.readTime == null || page.readTime === Math.max(1, Math.ceil(countGuideWords(page.body) / 200)), 'Reading time must match actual words', page.slug);
  }
  add('faq-coverage', faqQuestions.length >= 8 && faqQuestions.length <= 10 && new Set(faqQuestions).size === faqQuestions.length, 'Eight to ten distinct visible FAQ questions required');
  const lastBody = bundle.chapters.at(-1)?.body || '';
  add('demonstration-invitation', /demonstration|\bdemo\b/i.test(lastBody.split(/\n\s*\n/).at(-1) || '') && extractLinks(lastBody.split(/\n\s*\n/).at(-1) || '').some(l => toRoute(l) === '/contact'), 'The closing paragraph must invite a software demonstration at /contact/');
  return { pass: checks.every(c => c.pass), checks, failures: checks.filter(c => !c.pass), wordCount: base.wordCount };
}
module.exports = { validateGuide, extractLinks };
