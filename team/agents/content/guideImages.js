const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const sharp = require('sharp');
const { sourceImage } = require('./imageAgent');
const LICENSES = { openai: 'https://openai.com/policies/terms-of-use/', gemini: 'https://ai.google.dev/gemini-api/terms', pexels: 'https://www.pexels.com/license/', codex: 'https://openai.com/policies/terms-of-use/' };

async function sourceGuideImages(bundle, directory) {
  const exclude = new Set(); const assets = path.join(directory, 'images'); fs.mkdirSync(assets, { recursive: true });
  for (const page of [bundle.introduction, ...bundle.chapters]) {
    const file = `${page.slug}.webp`; const filename = path.join(assets, file);
    const checkpoint = path.join(assets, `${page.slug}.json`);
    let raw;
    if (fs.existsSync(filename)) {
      const saved = page.image || (fs.existsSync(checkpoint) ? JSON.parse(fs.readFileSync(checkpoint, 'utf8')) : null);
      if (!saved) throw new Error(`Stored guide image lacks provenance: ${page.slug}; reconcile the interrupted image checkpoint`);
      const buffer = fs.readFileSync(filename);
      const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
      const metadata = await sharp(buffer).metadata();
      if (sha256 !== saved.sha256 || metadata.format !== 'webp' || metadata.width !== 1200 || metadata.height !== 675) throw new Error(`Stored guide image changed: ${page.slug}`);
      raw = { ...saved, buffer, sha256 };
    } else {
      raw = await sourceImage({ scene: page.imageBrief, kind: 'hero', pexelsQueries: [page.imageBrief], alt: page.imageBrief, exclude });
      if (!raw) throw new Error(`No licensed unique guide image available for ${page.slug}`);
      fs.writeFileSync(filename, raw.buffer, { flag: 'wx' });
    }
    if (exclude.has(`stored:${raw.sha256}`)) throw new Error('Duplicate image within guide');
    exclude.add(`stored:${raw.sha256}`);
    page.image = { src: `/images/guides/${bundle.manifest.slug}/${file}`, alt: raw.alt || page.imageBrief,
      width: 1200, height: 675, source: raw.source, sourceId: String(raw.sourceId || raw.sha256), sha256: raw.sha256,
      licenseUrl: raw.licenseUrl || LICENSES[raw.source], ...(raw.credit ? { credit: raw.credit } : {}), ...(raw.creditUrl ? { creditUrl: raw.creditUrl } : {}) };
    if (!page.image.licenseUrl) throw new Error(`Image provider needs a verified licensing reference: ${raw.source}`);
    const temporary = `${checkpoint}.${crypto.randomUUID()}.tmp`;
    fs.writeFileSync(temporary, JSON.stringify(page.image, null, 2) + '\n', { flag: 'wx' });
    fs.renameSync(temporary, checkpoint);
  }
  return bundle;
}
module.exports = { sourceGuideImages };
