// Import files produced by the current session's image tool. This module never
// authenticates a CLI or calls a generation API; publishing still owns final QA.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const { processImage } = require('../shared/contentStore');
const { usedBlogImages, isBlogImageUsed } = require('../shared/imageRegistry');
const TERMS = 'https://openai.com/policies/terms-of-use/';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sessionMode = () => require('../shared/config').IMAGE_PROVIDERS.includes('session');

function regular(file) {
  if (!fs.lstatSync(file).isFile()) throw new Error('Image input must be a regular file, not a symlink or directory');
  return fs.readFileSync(file);
}
function imagePaths(directory, id) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error('Unknown image request');
  const root = fs.realpathSync(directory);
  const site = require('../shared/config').SITE_ROOT;
  if (['content', 'public'].some(name => root === path.join(site, name) || root.startsWith(path.join(site, name) + path.sep))) throw new Error('Images must be imported into managed drafts');
  const assets = path.join(root, 'images');
  if (fs.existsSync(assets) && (fs.lstatSync(assets).isSymbolicLink() || !fs.lstatSync(assets).isDirectory())) throw new Error('Unsafe image checkpoint directory');
  fs.mkdirSync(assets, { recursive: true });
  return { assets, file: path.join(assets, `${id}.webp`), meta: path.join(assets, `${id}.json`) };
}
function requestFor({ id, scene, kind = 'hero', alt = scene }) {
  if (!scene || !alt) throw new Error('Assigned image scene and alt text are required');
  return { id, scene, kind, alt, prompt: require('./imageAgent').buildImagePrompt(scene, kind) };
}
const requestHash = request => hash(JSON.stringify(request));

async function readSessionImage(directory, request, { allowLegacy = false } = {}) {
  const paths = imagePaths(directory, request.id);
  const hasFile = fs.existsSync(paths.file); const hasMeta = fs.existsSync(paths.meta);
  if (!hasFile && !hasMeta) return null;
  if (!hasFile || !hasMeta) throw new Error(`Incomplete image checkpoint: ${request.id}; reconcile before continuing`);
  const saved = JSON.parse(regular(paths.meta).toString('utf8'));
  const buffer = regular(paths.file); const metadata = await sharp(buffer).metadata();
  if (saved.sha256 !== hash(buffer) || metadata.format !== 'webp' || metadata.width !== 1200 || metadata.height !== 675) throw new Error(`Stored image changed: ${request.id}`);
  const legacy = allowLegacy && ['openai', 'gemini', 'pexels'].includes(saved.source) && !['requestHash', 'inputHash', 'request', 'importedAt'].some(key => key in saved);
  if (!legacy && (saved.requestHash !== requestHash(request) || !saved.request || requestHash(saved.request) !== requestHash(request) || saved.source !== 'codex' || !/^[a-f0-9]{64}$/.test(saved.inputHash || '') || saved.sourceId !== saved.inputHash || saved.licenseUrl !== TERMS || saved.alt !== request.alt)) throw new Error(`Image request or provenance changed: ${request.id}; reconcile before continuing`);
  if (!saved.source || !saved.sourceId || !saved.alt || !saved.licenseUrl) throw new Error(`Stored image lacks provenance: ${request.id}`);
  if (isBlogImageUsed(saved)) throw new Error(`Image already appears in published content: ${request.id}`);
  return { ...saved, buffer };
}

async function importSessionImage({ file, request, directory }) {
  const paths = imagePaths(directory, request.id);
  const input = regular(file);
  if (input.length > 30 * 1024 * 1024) throw new Error('Image input exceeds 30 MiB');
  const existing = await readSessionImage(directory, request);
  if (existing) {
    if (existing.inputHash !== hash(input)) throw new Error(`Refusing to replace saved image: ${request.id}`);
    const { buffer, ...saved } = existing;
    return { ...saved, path: paths.file, unchanged: true };
  }
  const decoded = await sharp(input).metadata();
  if (!['png', 'jpeg', 'webp'].includes(decoded.format) || decoded.pages > 1) throw new Error('Session image input must be a single raster PNG, JPEG or WebP');
  const processed = await processImage(input);
  const record = { id: request.id, width: 1200, height: 675, sha256: processed.sha256,
    source: 'codex', sourceId: hash(input), inputHash: hash(input), alt: request.alt,
    licenseUrl: TERMS, requestHash: requestHash(request), request, importedAt: new Date().toISOString() };
  if (isBlogImageUsed(record, usedBlogImages())) throw new Error('Image already appears in published content');
  // A draft-wide guard prevents two different requests registering the same bytes.
  // It also prevents two import commands replacing one
  // another. Interrupted guards remain visible for reconciliation, never stolen.
  const guard = path.join(paths.assets, '.import.lock'); const fd = fs.openSync(guard, 'wx');
  const temporary = `${paths.file}.${crypto.randomUUID()}.tmp`;
  const metaTemporary = `${paths.meta}.${crypto.randomUUID()}.tmp`;
  try {
    for (const name of fs.readdirSync(paths.assets).filter(name => /^[a-z0-9-]+\.json$/.test(name))) {
      const other = JSON.parse(regular(path.join(paths.assets, name)).toString('utf8'));
      if (other.sha256 === record.sha256 || other.inputHash === record.inputHash) throw new Error('Duplicate image within this draft');
    }
    if (fs.existsSync(paths.file) || fs.existsSync(paths.meta)) throw new Error('Image checkpoint changed during import');
    fs.writeFileSync(temporary, processed.buffer, { flag: 'wx' });
    fs.writeFileSync(metaTemporary, JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
    fs.renameSync(temporary, paths.file);
    fs.renameSync(metaTemporary, paths.meta);
  } finally {
    fs.closeSync(fd); fs.rmSync(guard); fs.rmSync(temporary, { force: true }); fs.rmSync(metaTemporary, { force: true });
  }
  return { ...record, path: paths.file, unchanged: false };
}

function blogAssignment(fixture) {
  const filename = path.resolve(fixture); const directory = path.dirname(filename);
  if (process.env.ICC_CLOUD_ROUTINE === '1') {
    const managed = process.env.BLOG_DRAFT_DIR || path.join(path.resolve(__dirname, '../..'), 'drafts', 'blog');
    if (path.basename(filename) !== 'draft.json' || fs.lstatSync(directory).isSymbolicLink() || path.dirname(fs.realpathSync(directory)) !== fs.realpathSync(managed)) throw new Error('Cloud fixture must be draft.json in a direct managed blog job');
  }
  const draft = JSON.parse(regular(filename).toString('utf8'));
  if (process.env.ICC_CLOUD_ROUTINE === '1' && draft.bodyFile && (path.dirname(path.resolve(directory, draft.bodyFile)) !== directory || path.basename(draft.bodyFile) !== draft.bodyFile)) throw new Error('Blog body must stay inside its managed job');
  const body = draft.bodyFile ? regular(path.resolve(directory, draft.bodyFile)).toString('utf8') : draft.body;
  if (!draft.title || !draft.primaryKeyword || typeof body !== 'string') throw new Error('A complete blog draft is required');
  const requests = [requestFor({ id: 'hero', scene: draft.imageBrief || `Industrial quality work related to ${draft.primaryKeyword}`, alt: draft.title })];
  for (const [index, marker] of require('./inlineImageAgent').extractMarkers(body).slice(0, 2).entries()) requests.push(requestFor({ id: `inline-${index + 1}`, scene: marker.query, kind: 'inline' }));
  return { draft, body, directory, requests };
}
function guideAssignment(id) {
  const job = require('../shared/guideStore').loadJob(id);
  if (!job.manifest || !job.assignments) throw new Error('Guide research and page assignments are required');
  const slugs = [job.manifest.slug, ...job.manifest.chapters.map(page => page.slug)];
  return { directory: job.directory, requests: slugs.map(slug => {
    const page = job.assignments[slug];
    if (!page || page.slug !== slug) throw new Error('Unknown guide page');
    return requestFor({ id: slug, scene: page.imageBrief, alt: page.imageBrief });
  }) };
}
async function missingRequests({ directory, requests }, options) {
  const missing = []; const seen = new Set();
  for (const request of requests) {
    const image = await readSessionImage(directory, request, options);
    if (!image) missing.push(request);
    else if (seen.has(image.sha256)) throw new Error('Duplicate saved image within draft');
    else seen.add(image.sha256);
  }
  return missing;
}
const blogImageRequests = fixture => missingRequests(blogAssignment(fixture));
const guideImageRequests = id => missingRequests(guideAssignment(id), { allowLegacy: true });
async function importAssigned(assignment, id, file) {
  const request = assignment.requests.find(request => request.id === id);
  if (!request) throw new Error('Unknown image request');
  return importSessionImage({ file, request, directory: assignment.directory });
}
const importBlogImage = (fixture, id, file) => importAssigned(blogAssignment(fixture), id, file);
const importGuideImage = (job, slug, file) => importAssigned(guideAssignment(job), slug, file);
async function blogImages(fixture) {
  const assignment = blogAssignment(fixture); const images = [];
  for (const request of assignment.requests) {
    const image = await readSessionImage(assignment.directory, request);
    if (!image) throw new Error(`Missing session image ${request.id}; generate it with the built-in tool and import it`);
    images.push({ ...image, file: `${request.id}.webp` });
  }
  if (new Set(images.map(image => image.sha256)).size !== images.length) throw new Error('Duplicate image within draft');
  return { hero: images[0], inlineImages: images.slice(1) };
}
module.exports = { sessionMode, requestFor, readSessionImage, importSessionImage, blogAssignment, blogImageRequests, guideImageRequests, importBlogImage, importGuideImage, blogImages };
