const crypto = require('node:crypto');
const matter = require('gray-matter');

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const POLICY = Object.freeze({ chapters: 9, chapterMin: 2000, chapterMax: 2200, introductionMin: 1500, totalMin: 18000, totalMax: 20000 });
const validSlug = value => typeof value === 'string' && value.length >= 6 && value.length <= 80 && SLUG.test(value);
const imageFree = text => String(text || '').replace(/^\s*!\[[^\]]*\]\([^)]*\)\s*$/gm, '').replace(/^\s*\[IMAGE:[^\]]*\]\s*$/gm, '');

function countGuideWords(markdown) {
  const text = imageFree(String(markdown || '').replace(/^---\r?\n[\s\S]*?\r?\n---\s*\r?\n/, ''))
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/^\s*\|?[\s:|-]+\|[\s:|-]*$/gm, ' ')
    .replace(/<!--[^]*?-->/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+|^\s*>\s?|^\s*(?:[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_`|]/g, ' ').replace(/\s+/g, ' ').trim();
  return text ? text.split(' ').length : 0;
}

function normalizeDay(value) {
  const day = value instanceof Date ? value.toISOString().slice(0, 10) : value;
  if (typeof day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const date = new Date(`${day}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().startsWith(day) ? day : null;
}

function parseGuidePage(raw) {
  const { data, content } = matter(String(raw));
  for (const field of ['slug', 'title', 'description', 'primaryKeyword', 'author', 'imageBrief']) {
    if (typeof data[field] !== 'string' || !data[field].trim()) throw new Error(`Guide metadata missing ${field}`);
  }
  const date = normalizeDay(data.date);
  if (!date) throw new Error('Guide metadata has invalid date');
  if (data.updated != null && !normalizeDay(data.updated)) throw new Error('Guide metadata has invalid updated date');
  const body = content.trim();
  if (!body) throw new Error('Guide body is empty');
  const wordCount = countGuideWords(body);
  return { ...data, date, updated: data.updated == null ? undefined : normalizeDay(data.updated),
    body, wordCount, readTime: Math.max(1, Math.ceil(wordCount / 200)),
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    sourceIds: Array.isArray(data.sourceIds) ? data.sourceIds : [], capabilityIds: Array.isArray(data.capabilityIds) ? data.capabilityIds : [] };
}

function validateGuideStructure(bundle, { now = new Date(), phase = 'published' } = {}) {
  const checks = [];
  const add = (id, pass, message, page) => checks.push({ id, pass: Boolean(pass), message, ...(page ? { page } : {}) });
  const manifest = bundle?.manifest || {};
  const chapters = Array.isArray(bundle?.chapters) ? bundle.chapters : [];
  const entries = Array.isArray(manifest.chapters) ? manifest.chapters : [];
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  add('schema-version', manifest.schemaVersion === 1, 'Guide schemaVersion must be 1');
  add('guide-slug', validSlug(manifest.slug), 'Guide slug must have 6–80 lowercase letters/digits with hyphens');
  add('topic-id', validSlug(manifest.topicId), 'A stable topic ID is required');
  add('chapter-count', entries.length === POLICY.chapters && chapters.length === POLICY.chapters, 'Nine complete chapters are required; ten plus an introduction exceeds the inclusive budget');
  add('introduction-file', manifest.introductionFile === 'introduction.md', 'Introduction filename must be introduction.md');
  add('manifest-metadata', ['title', 'description', 'primaryKeyword', 'author', 'audience'].every(k => typeof manifest[k] === 'string' && manifest[k].trim()), 'Guide identity and author are required');
  add('manifest-description', typeof manifest.description === 'string' && manifest.description.length >= 120 && manifest.description.length <= 160, 'Guide description must be 120–160 characters');
  add('manifest-date', normalizeDay(manifest.date) && manifest.date <= today, 'Guide date must be valid and not in the future');
  if (phase === 'published') add('published-at', typeof manifest.publishedAt === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(manifest.publishedAt) && Number.isFinite(Date.parse(manifest.publishedAt)) && Date.parse(manifest.publishedAt) <= now.getTime(), 'publishedAt must be an ISO timestamp no later than now');
  add('snapshot-hashes', ['capabilitySnapshotHash', 'researchSnapshotHash'].every(k => /^[a-f0-9]{64}$/.test(manifest[k] || '')), 'Evidence snapshots must have SHA-256 hashes');
  const entrySlugs = entries.map(e => e?.slug);
  add('unique-chapters', new Set(entrySlugs).size === entries.length, 'Chapter slugs must be unique');
  for (const entry of entries) add('chapter-reference', validSlug(entry?.slug) && entry?.file === `chapters/${entry.slug}.md`, 'Chapter reference must use its canonical filename', entry?.slug);
  add('chapter-order', entries.every((e, i) => chapters[i]?.slug === e.slug), 'Every chapter must exist in manifest order');
  add('introduction-slug', bundle?.introduction?.slug === manifest.slug, 'Introduction slug must equal guide slug');
  const pages = [bundle?.introduction, ...chapters].filter(Boolean);
  const titles = pages.map(p => String(p.title || '').trim().toLowerCase());
  add('unique-titles', new Set(titles).size === pages.length, 'Every page needs a unique title');
  let wordCount = 0;
  for (const [index, page] of pages.entries()) {
    const words = countGuideWords(page.body); wordCount += words;
    add('page-metadata', ['title', 'primaryKeyword', 'author', 'imageBrief'].every(k => typeof page[k] === 'string' && page[k].trim()), 'Page identity, author and image brief required', page.slug);
    add('page-slug', validSlug(page.slug), 'Invalid page slug', page.slug);
    add('page-description', typeof page.description === 'string' && page.description.length >= 120 && page.description.length <= 160, 'Description must be 120–160 characters', page.slug);
    add('page-date', normalizeDay(page.date) && page.date <= today && (!page.updated || (normalizeDay(page.updated) && page.updated <= today && page.updated >= page.date)), 'Dates must be valid, ordered and not in the future', page.slug);
    add('single-h1', !/^\s*#\s+/m.test(page.body || ''), 'The page shell supplies the only H1', page.slug);
    add(index === 0 ? 'introduction-words' : 'chapter-words', index === 0 ? words >= POLICY.introductionMin : words >= POLICY.chapterMin && words <= POLICY.chapterMax, `${words} visible words`, page.slug);
    if (index > 0) {
      const sections = (String(page.body).match(/^##\s+/gm) || []).length;
      add('subsections', sections >= 3 && sections <= 5, 'Chapter needs 3–5 H2 subsections', page.slug);
    }
    add('content-blocks', String(page.body || '').split(/\n\s*\n/).filter(s => s.trim() && !/^#{1,6}\s/.test(s)).length >= 3, 'At least three real content blocks required', page.slug);
    add('evidence-ids', Array.isArray(page.sourceIds) && page.sourceIds.length > 0 && Array.isArray(page.capabilityIds), 'Each page must identify its evidence', page.slug);
  }
  add('total-words', wordCount >= POLICY.totalMin && wordCount <= POLICY.totalMax, `${wordCount} total visible words; maximum 20,000 includes introduction`);
  return { pass: checks.every(c => c.pass), checks, failures: checks.filter(c => !c.pass), wordCount };
}

function guideRoutes(manifest) {
  if (!validSlug(manifest?.slug)) throw new Error('Invalid guide slug');
  return [`/guides/${manifest.slug}/`, ...manifest.chapters.map(c => {
    if (!validSlug(c.slug)) throw new Error('Invalid chapter slug');
    return `/guides/${manifest.slug}/${c.slug}/`;
  })];
}

function chapterNeighbors(manifest, slug) {
  const index = manifest.chapters.findIndex(c => c.slug === slug);
  if (index < 0) throw new Error('Unknown chapter');
  const routes = guideRoutes(manifest);
  return { previous: routes[index], next: routes[index + 2] || null, contents: routes[0] };
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().filter(k => value[k] !== undefined).map(k => [k, canonical(value[k])]));
  return value;
}
function hashValue(value) { return crypto.createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex'); }
function hashGuideInputs(bundle) {
  const { manifest } = bundle;
  const select = object => Object.fromEntries(['slug', 'title', 'description', 'primaryKeyword', 'keywords', 'author', 'date', 'updated', 'sourceIds', 'capabilityIds'].map(k => [k, object[k]]));
  return hashValue({ identity: select(manifest), topicId: manifest.topicId, order: manifest.chapters,
    research: manifest.researchSnapshotHash, capabilities: manifest.capabilitySnapshotHash,
    pages: [bundle.introduction, ...bundle.chapters].map(page => ({ ...select(page), body: imageFree(page.body).trim() })) });
}

module.exports = { POLICY, validSlug, normalizeDay, countGuideWords, parseGuidePage, validateGuideStructure, guideRoutes, chapterNeighbors, hashGuideInputs, hashValue };
