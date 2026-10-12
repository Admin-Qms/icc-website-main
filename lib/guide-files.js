const fs = require('node:fs');
const path = require('node:path');
const { validSlug, parseGuidePage, validateGuideStructure } = require('./guide-contract');

function readInside(root, relative) {
  const resolvedRoot = fs.realpathSync(root);
  const absolute = path.resolve(root, relative);
  const real = fs.realpathSync(absolute);
  if (!real.startsWith(resolvedRoot + path.sep) || !fs.statSync(real).isFile()) throw new Error('Guide file escapes its bundle');
  return fs.readFileSync(real, 'utf8');
}
function readGuideFiles(directory, { validate = true, phase = 'published' } = {}) {
  const manifest = JSON.parse(readInside(directory, 'guide.json'));
  if (!validSlug(manifest.slug) || manifest.introductionFile !== 'introduction.md' || !Array.isArray(manifest.chapters)) throw new Error('Invalid guide manifest');
  const introduction = parseGuidePage(readInside(directory, 'introduction.md'));
  const chapters = manifest.chapters.map(entry => {
    if (!validSlug(entry.slug) || entry.file !== `chapters/${entry.slug}.md`) throw new Error('Unsafe chapter reference');
    return parseGuidePage(readInside(directory, entry.file));
  });
  const bundle = { manifest, introduction, chapters };
  if (validate) {
    const report = validateGuideStructure(bundle, { phase });
    if (!report.pass) throw new Error(`Invalid guide ${manifest.slug}: ${report.failures.map(f => `${f.id}: ${f.message}`).join('; ')}`);
  }
  return bundle;
}
function listGuideFiles(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).filter(e => e.isDirectory() && !e.name.startsWith('.')).map(e => {
    if (!validSlug(e.name)) throw new Error('Invalid published guide directory');
    const bundle = readGuideFiles(path.join(root, e.name));
    if (bundle.manifest.slug !== e.name) throw new Error('Guide directory does not match manifest slug');
    return bundle;
  }).sort((a, b) => b.manifest.date.localeCompare(a.manifest.date) || a.manifest.slug.localeCompare(b.manifest.slug));
}
module.exports = { readInside, readGuideFiles, listGuideFiles };
