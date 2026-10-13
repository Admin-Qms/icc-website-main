const fs = require('node:fs'); const path = require('node:path'); const crypto = require('node:crypto');
const { validSlug } = require('./guide-contract'); const { readGuideFiles, readInside } = require('./guide-files');
function readGuidePreview({ jobId, draftRoot, mode = process.env.NODE_ENV }) {
  if (mode !== 'development') throw new Error('Guide draft preview is development-only and cannot enter production export');
  if (!validSlug(jobId)) throw new Error('Invalid preview job/path');
  const root = fs.realpathSync(draftRoot); const directory = fs.realpathSync(path.join(root, jobId));
  if (!directory.startsWith(root + path.sep) || fs.lstatSync(path.join(root, jobId)).isSymbolicLink()) throw new Error('Preview job escapes its managed root');
  const state = JSON.parse(readInside(directory, 'state.json'));
  if (state.id !== jobId) throw new Error('Preview job identity mismatch');
  const bundle = readGuideFiles(directory, { phase: 'draft', validate: false });
  if (bundle.chapters.length !== 9 || bundle.introduction.slug !== bundle.manifest.slug) throw new Error('Preview needs a complete, ordered guide draft');
  return { jobId, directory, bundle };
}
function previewImageFile(preview, url) {
  const page = [preview.bundle.introduction, ...preview.bundle.chapters].find(p => p.image?.src === url);
  if (!page) return null;
  const images = path.join(preview.directory, 'images'); const file = path.join(images, `${page.slug}.webp`);
  if (!fs.existsSync(file)) return null;
  if (fs.lstatSync(images).isSymbolicLink() || fs.realpathSync(images) !== path.join(fs.realpathSync(preview.directory), 'images')) throw new Error('Preview image root escapes the managed job');
  const real = fs.realpathSync(file);
  if (!real.startsWith(fs.realpathSync(images) + path.sep) || !fs.statSync(real).isFile()) throw new Error('Preview image escapes its managed root');
  if (crypto.createHash('sha256').update(fs.readFileSync(real)).digest('hex') !== page.image.sha256) throw new Error('Preview image changed from its reviewed provenance');
  return real;
}
module.exports = { readGuidePreview, previewImageFile };
