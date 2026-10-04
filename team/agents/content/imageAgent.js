#!/usr/bin/env node

/**
 * ISO Certification Consultant Image Agent v3 — Hardened
 *
 * Handles featured image sourcing for blog articles.
 * Pipeline: Generate (Gemini) → Search (Pexels 16:9) → Default placeholder
 *
 * Key rules:
 *   1. All featured images MUST be 16:9 (aspect ratio 1.6–1.9)
 *   2. Pipeline is SEQUENTIAL: generate → upload → verify → patch (never parallel)
 *   3. Fallback chain: Gemini → Pexels → hardcoded default
 *   4. Every upload is verified by re-fetching asset metadata from Sanity
 *   5. mainImage field (not featuredImage) is the canonical field name
 *
 * Usage:
 *   const imageAgent = require('./imageAgent');
 *   const result = await imageAgent.ensureFeaturedImage(env, articleId, searchTerms);
 */

const https = require('https');

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const MIN_ASPECT_RATIO = 1.6;
const MAX_ASPECT_RATIO = 1.9;
const PEXELS_PER_PAGE = 15;
const DEFAULT_PLACEHOLDER_ID = null; // Set to a Sanity asset ID if you have a branded fallback

// ═══════════════════════════════════════════════════════════════
// HTTP HELPER
// ═══════════════════════════════════════════════════════════════

function httpsRequest(options, bodyData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    if (bodyData) req.write(typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData));
    req.end();
  });
}

function httpsGetBuffer(url) {
  return new Promise((resolve, reject) => {
    const handler = (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, handler).on('error', reject);
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    };
    https.get(url, handler).on('error', reject);
  });
}

// ═══════════════════════════════════════════════════════════════
// ASPECT RATIO VALIDATION
// ═══════════════════════════════════════════════════════════════

/**
 * Check if dimensions meet the 16:9 requirement (ratio 1.6–1.9)
 */
function isValid16x9(width, height) {
  if (!width || !height || height === 0) return false;
  const ratio = width / height;
  return ratio >= MIN_ASPECT_RATIO && ratio <= MAX_ASPECT_RATIO;
}

/**
 * Validate a Sanity image asset has correct 16:9 dimensions
 */
async function validateAssetRatio(env, assetId) {
  const query = encodeURIComponent(`*[_id == "${assetId}"][0]{_id, metadata{dimensions}}`);
  const result = await httpsRequest({
    hostname: `${env.SANITY_PROJECT_ID}.api.sanity.io`,
    path: `/v2024-01-01/data/query/${env.SANITY_DATASET}?query=${query}`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${env.SANITY_API_TOKEN}` }
  });

  if (result.status !== 200 || !result.data.result) {
    console.error(`  [imageAgent] Failed to verify asset ${assetId}`);
    return false;
  }

  const dims = result.data.result.metadata?.dimensions;
  if (!dims) {
    console.error(`  [imageAgent] No dimensions found for asset ${assetId}`);
    return false;
  }

  const valid = isValid16x9(dims.width, dims.height);
  const ratio = (dims.width / dims.height).toFixed(3);
  console.log(`  [imageAgent] Asset ${assetId}: ${dims.width}x${dims.height} (ratio ${ratio}) — ${valid ? 'VALID' : 'REJECTED'}`);
  return valid;
}

// ═══════════════════════════════════════════════════════════════
// STEP 1: GEMINI IMAGE GENERATION
// ═══════════════════════════════════════════════════════════════

async function generateWithGemini(env, description) {
  if (!env.GEMINI_API_KEY) return null;

  const prompt = `Realistic professional photograph, 16:9 landscape aspect ratio, no text or writing visible in image. ${description}`;
  const requestBody = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
      temperature: 0.4
    }
  };

  const bodyStr = JSON.stringify(requestBody);
  console.log(`  [imageAgent] Gemini: generating "${description.substring(0, 50)}..."`);

  try {
    const result = await httpsRequest({
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.5-flash-image:generateContent?key=${env.GEMINI_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    }, bodyStr);

    if (result.status !== 200) {
      console.error(`  [imageAgent] Gemini API error (${result.status})`);
      return null;
    }

    const candidates = result.data?.candidates;
    if (!candidates?.[0]?.content?.parts) return null;

    for (const part of candidates[0].content.parts) {
      if (part.inlineData?.data) {
        return Buffer.from(part.inlineData.data, 'base64');
      }
    }
    return null;
  } catch (err) {
    console.error(`  [imageAgent] Gemini error: ${err.message}`);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// STEP 2: PEXELS SEARCH (16:9 FILTER)
// ═══════════════════════════════════════════════════════════════

/**
 * Search Pexels for landscape photos and filter for 16:9 aspect ratio.
 * Tries multiple search terms before giving up.
 */
async function searchPexels16x9(env, searchTerms) {
  if (!env.PEXELS_API_KEY) return null;

  const terms = Array.isArray(searchTerms) ? searchTerms : [searchTerms];

  for (const term of terms) {
    console.log(`  [imageAgent] Pexels: searching "${term}"...`);
    try {
      const result = await httpsRequest({
        hostname: 'api.pexels.com',
        path: `/v1/search?query=${encodeURIComponent(term)}&per_page=${PEXELS_PER_PAGE}&orientation=landscape`,
        method: 'GET',
        headers: { 'Authorization': env.PEXELS_API_KEY }
      });

      if (result.status !== 200 || !result.data.photos) continue;

      // Filter for 16:9 ratio
      const valid = result.data.photos.filter(p => isValid16x9(p.width, p.height));
      if (valid.length === 0) {
        console.log(`  [imageAgent] Pexels: "${term}" — ${result.data.photos.length} results, 0 with 16:9`);
        continue;
      }

      // Pick the best (largest) valid photo
      valid.sort((a, b) => (b.width * b.height) - (a.width * a.height));
      const photo = valid[0];
      const ratio = (photo.width / photo.height).toFixed(3);
      console.log(`  [imageAgent] Pexels: found photo ${photo.id} (${photo.width}x${photo.height}, ratio ${ratio})`);

      // Download the image
      const imageUrl = photo.src.large2x || photo.src.large;
      const buffer = await httpsGetBuffer(imageUrl);
      return { buffer, alt: photo.alt || term, pexelsId: photo.id };
    } catch (err) {
      console.error(`  [imageAgent] Pexels error for "${term}": ${err.message}`);
    }
  }

  console.log(`  [imageAgent] Pexels: no 16:9 images found across ${terms.length} search terms`);
  return null;
}

// ═══════════════════════════════════════════════════════════════
// STEP 3: UPLOAD TO SANITY
// ═══════════════════════════════════════════════════════════════

async function uploadToSanity(env, imageBuffer, filename, contentType) {
  console.log(`  [imageAgent] Uploading ${(imageBuffer.length / 1024).toFixed(0)}KB to Sanity as ${filename}...`);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${env.SANITY_PROJECT_ID}.api.sanity.io`,
      path: `/v2024-01-01/assets/images/${env.SANITY_DATASET}?filename=${encodeURIComponent(filename)}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.SANITY_API_TOKEN}`,
        'Content-Type': contentType || 'image/jpeg',
        'Content-Length': imageBuffer.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.document?._id) {
            console.log(`  [imageAgent] Uploaded: ${parsed.document._id}`);
            resolve(parsed.document._id);
          } else {
            console.error(`  [imageAgent] Upload failed: ${JSON.stringify(parsed).substring(0, 200)}`);
            resolve(null);
          }
        } catch (e) {
          console.error(`  [imageAgent] Upload parse error: ${e.message}`);
          resolve(null);
        }
      });
    });

    req.on('error', (err) => {
      console.error(`  [imageAgent] Upload network error: ${err.message}`);
      resolve(null);
    });
    req.write(imageBuffer);
    req.end();
  });
}

// ═══════════════════════════════════════════════════════════════
// STEP 4: PATCH ARTICLE mainImage
// ═══════════════════════════════════════════════════════════════

async function patchMainImage(env, articleId, assetId, altText) {
  console.log(`  [imageAgent] Patching article ${articleId} with mainImage...`);

  const mutation = {
    mutations: [{
      patch: {
        id: articleId,
        set: {
          mainImage: {
            _type: 'image',
            asset: { _type: 'reference', _ref: assetId },
            alt: altText || 'Featured article image'
          }
        }
      }
    }]
  };

  const result = await httpsRequest({
    hostname: `${env.SANITY_PROJECT_ID}.api.sanity.io`,
    path: `/v2024-01-01/data/mutate/${env.SANITY_DATASET}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.SANITY_API_TOKEN}`
    }
  }, JSON.stringify(mutation));

  if (result.status === 200) {
    console.log(`  [imageAgent] mainImage patched successfully`);
    return true;
  } else {
    console.error(`  [imageAgent] Patch failed (${result.status}): ${JSON.stringify(result.data).substring(0, 200)}`);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════
// MAIN PIPELINE: ensureFeaturedImage
// ═══════════════════════════════════════════════════════════════

/**
 * Full sequential pipeline to ensure an article has a valid 16:9 mainImage.
 *
 * @param {Object} env - Environment config with API keys
 * @param {string} articleId - Sanity document _id
 * @param {string|string[]} searchTerms - Pexels search terms
 * @param {string} altText - Alt text for the image
 * @param {string} [geminiDescription] - Description for Gemini generation
 * @returns {Object} { success: boolean, assetId: string|null, source: string }
 */
async function ensureFeaturedImage(env, articleId, searchTerms, altText, geminiDescription) {
  console.log(`\n[imageAgent] === Featured Image Pipeline for ${articleId} ===`);

  // Step 0: Check if article already has a valid mainImage
  const checkQuery = encodeURIComponent(
    `*[_id == "${articleId}"][0]{"ref": mainImage.asset._ref}`
  );
  const existing = await httpsRequest({
    hostname: `${env.SANITY_PROJECT_ID}.api.sanity.io`,
    path: `/v2024-01-01/data/query/${env.SANITY_DATASET}?query=${checkQuery}`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${env.SANITY_API_TOKEN}` }
  });

  if (existing.data?.result?.ref) {
    const existingRef = existing.data.result.ref;
    console.log(`  [imageAgent] Article already has mainImage: ${existingRef}`);
    const valid = await validateAssetRatio(env, existingRef);
    if (valid) {
      console.log(`  [imageAgent] Existing image is valid 16:9. Done.`);
      return { success: true, assetId: existingRef, source: 'existing' };
    }
    console.log(`  [imageAgent] Existing image is NOT 16:9. Replacing...`);
  }

  const slug = articleId.replace(/[^a-z0-9-]/gi, '-');

  // Step 1: Try Gemini
  if (geminiDescription) {
    const buffer = await generateWithGemini(env, geminiDescription);
    if (buffer) {
      const assetId = await uploadToSanity(env, buffer, `${slug}-featured.png`, 'image/png');
      if (assetId) {
        const valid = await validateAssetRatio(env, assetId);
        if (valid) {
          await patchMainImage(env, articleId, assetId, altText);
          return { success: true, assetId, source: 'gemini' };
        }
        console.log(`  [imageAgent] Gemini image failed 16:9 validation, trying Pexels...`);
      }
    }
  }

  // Step 2: Try Pexels (sequential, with 16:9 filter)
  const pexelsResult = await searchPexels16x9(env, searchTerms);
  if (pexelsResult) {
    const assetId = await uploadToSanity(env, pexelsResult.buffer, `${slug}-featured.jpg`, 'image/jpeg');
    if (assetId) {
      const valid = await validateAssetRatio(env, assetId);
      if (valid) {
        await patchMainImage(env, articleId, assetId, pexelsResult.alt || altText);
        return { success: true, assetId, source: 'pexels' };
      }
      console.log(`  [imageAgent] Pexels image failed post-upload validation`);
    }
  }

  // Step 3: Default placeholder
  if (DEFAULT_PLACEHOLDER_ID) {
    console.log(`  [imageAgent] Using default placeholder: ${DEFAULT_PLACEHOLDER_ID}`);
    await patchMainImage(env, articleId, DEFAULT_PLACEHOLDER_ID, altText || 'ISO Certification Consultant article');
    return { success: true, assetId: DEFAULT_PLACEHOLDER_ID, source: 'placeholder' };
  }

  console.error(`  [imageAgent] FAILED: No valid image found for ${articleId}`);
  return { success: false, assetId: null, source: 'none' };
}

// ═══════════════════════════════════════════════════════════════
// BACKWARD COMPATIBILITY — Legacy API wrappers
// Used by: contentManager.js, infographicAgent.js, inlineImageAgent.js, pm.js
// ═══════════════════════════════════════════════════════════════

/**
 * Build env object from shared/config for legacy callers.
 */
function _buildEnv() {
  try {
    const config = require('../shared/config');
    return {
      SANITY_PROJECT_ID: config.SANITY_PROJECT_ID,
      SANITY_DATASET: config.SANITY_DATASET,
      SANITY_API_TOKEN: config.SANITY_API_TOKEN,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
      PEXELS_API_KEY: config.PEXELS_API_KEY,
    };
  } catch {
    return {
      SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID || 'uakgkw7x',
      SANITY_DATASET: process.env.SANITY_DATASET || 'production',
      SANITY_API_TOKEN: process.env.SANITY_API_TOKEN || '',
      GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
      PEXELS_API_KEY: process.env.PEXELS_API_KEY || '',
    };
  }
}

/**
 * Legacy searchPexels(query) — returns array of Pexels photo objects (unfiltered).
 * Used by infographicAgent.js and inlineImageAgent.js for their own filtering.
 */
async function searchPexels(query) {
  const env = _buildEnv();
  if (!env.PEXELS_API_KEY) return null;

  const result = await httpsRequest({
    hostname: 'api.pexels.com',
    path: `/v1/search?query=${encodeURIComponent(query)}&per_page=${PEXELS_PER_PAGE}&orientation=landscape`,
    method: 'GET',
    headers: { 'Authorization': env.PEXELS_API_KEY }
  });

  if (result.status !== 200 || !result.data.photos) return null;
  return result.data.photos.length > 0 ? result.data.photos : null;
}

/**
 * Legacy findAndUploadImage(article) — wraps ensureFeaturedImage for contentManager.js.
 * Returns shape: { assetId, url, altText, photographer, source, ... }
 */
async function findAndUploadImage(article) {
  const env = _buildEnv();

  const kw = (article.primaryKeyword || article.title || '').toLowerCase();
  const searchTerms = [
    `${kw} manufacturing quality`,
    'North American manufacturing quality inspection industrial',
  ];

  const articleId = article._id ||
    `daily-${(article.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80)}`;

  const result = await ensureFeaturedImage(
    env,
    articleId,
    searchTerms,
    `${article.title} — ${article.primaryKeyword || ''}`,
    `North American manufacturing facility, ${kw}, professional photography`
  );

  return {
    assetId: result.assetId,
    url: null,
    altText: `${article.title} — ${article.primaryKeyword || ''}`,
    photographer: result.source,
    source: result.source,
  };
}

/**
 * Legacy repairDuplicateImages() — moved to blog-pipeline-scripts/repair-duplicate-images.js.
 * This stub delegates to the standalone script's module.
 */
async function repairDuplicateImages() {
  try {
    const repair = require('../../../blog-pipeline-scripts/repair-duplicate-images');
    return repair.repairDuplicateImages();
  } catch (err) {
    console.log('[imageAgent] repairDuplicateImages() moved to blog-pipeline-scripts/repair-duplicate-images.js');
    console.log(`[imageAgent] Import error: ${err.message}`);
    return { replaced: 0, articles: [] };
  }
}

// ═══════════════════════════════════════════════════════════════
// MARKDOWN BLOG — images as local files (no Sanity)
// Used by contentManager.publishDaily and inlineImageAgent.
// Source order follows CLAUDE.md: Pexels first, Gemini generation as fallback.
// Nothing is written to disk here; callers get a processed buffer and publish it.
// ═══════════════════════════════════════════════════════════════

const PEXELS_MAX_PAGES = 3;
const MIN_SOURCE_WIDTH = 1200;

// What each scene shows, for alt text when the image is generated.
const SCENE_ALT = {
  quality: 'Quality inspectors reviewing parts on a manufacturing floor',
  environmental: 'Industrial facility with landscaped grounds and rooftop solar panels',
  safety: 'Industrial workers in hard hats and high-visibility vests on a plant floor',
  medical: 'Technicians in cleanroom garments assembling medical devices',
  automotive: 'Robotic arms working on an automotive parts production line',
  audit: 'Auditor with a clipboard inspecting equipment on a manufacturing floor',
  consultant: 'Two people in hard hats reviewing a process on a production floor',
  manufacturing: 'CNC machines and workstations inside a manufacturing facility',
  default: 'Inspectors examining products on a manufacturing production line',
};

function imageKey(source, sourceId) {
  return `${source}:${sourceId}`;
}

// Short scene descriptions per topic; the house style supplies everything else.
const HERO_SCENES = {
  quality: 'quality inspectors checking machined parts at an inspection bench beside the production line',
  environmental: 'a plant floor with a waste-sorting station and recycling bins beside the machinery, a worker logging a reading',
  safety: 'workers in hard hats and high-visibility vests walking a marked aisle between machines, lockout tags on a control panel',
  medical: 'technicians in cleanroom garments assembling small devices at a stainless bench',
  automotive: 'robotic welding cells on an automotive parts line with an operator checking a fixture',
  audit: 'an auditor with a clipboard and safety glasses reviewing records at a workstation on the plant floor',
  consultant: 'two people in hard hats reviewing a process chart on a clipboard beside a running production line',
  manufacturing: 'a row of CNC machines with operators at their control panels',
  default: 'operators and inspectors at work on a production line',
};

let styleCache = null;
function loadImageStyle() {
  if (styleCache) return styleCache;
  const { IMAGE_STYLE_PATH } = require('../shared/config');
  try {
    styleCache = JSON.parse(require('fs').readFileSync(IMAGE_STYLE_PATH, 'utf-8'));
  } catch {
    styleCache = { style: 'Photorealistic editorial photograph of a modern North American manufacturing interior. No text, logos or signage.', framing: { hero: '', inline: '' }, avoid: 'offices, text' };
  }
  return styleCache;
}

/** One prompt shape for every generated image: house style + framing + the scene. */
function buildImagePrompt(scene, kind = 'inline') {
  const style = loadImageStyle();
  const framing = (style.framing && style.framing[kind]) || '';
  return `${style.style}\n${framing}\nScene: ${String(scene).trim().replace(/\.$/, '')}.\nAvoid: ${style.avoid}.`;
}

/**
 * Generate one image with OpenAI's image API (landscape, then cropped to 16:9 by the caller).
 */
async function generateOpenAIImage(prompt) {
  const { OPENAI_API_KEY, OPENAI_IMAGE_MODEL, OPENAI_IMAGE_QUALITY } = require('../shared/config');
  if (!OPENAI_API_KEY) return null;
  // The image API allows a handful of images a minute; waiting out a 429 keeps
  // a whole article on one provider instead of mixing in the fallback's look.
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: { Authorization: `Bearer ${OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: OPENAI_IMAGE_MODEL, prompt, size: '1536x1024', quality: OPENAI_IMAGE_QUALITY, n: 1 }),
      });
      const json = await res.json();
      if (res.status === 429 && attempt < 3) {
        const wait = Number(/try again in (\d+)s/i.exec(json.error?.message || '')?.[1] || 20) + 2;
        console.log(`  [imageAgent] OpenAI rate limit — waiting ${wait}s`);
        await new Promise((r) => setTimeout(r, wait * 1000));
        continue;
      }
      if (!res.ok || json.error) {
        console.error(`  [imageAgent] OpenAI (${OPENAI_IMAGE_MODEL}) error ${res.status}: ${JSON.stringify(json.error || json).slice(0, 200)}`);
        return null;
      }
      const b64 = json.data?.[0]?.b64_json;
      return b64 ? Buffer.from(b64, 'base64') : null;
    } catch (err) {
      console.error(`  [imageAgent] OpenAI error: ${err.message}`);
      return null;
    }
  }
  return null;
}

/**
 * Generate one image through the Codex CLI's image tool. Works only where
 * `codex` is installed and logged in (this Mac), so it is never the default.
 */
async function generateCodexImage(prompt) {
  const os = require('os');
  const fs = require('fs');
  const path = require('path');
  try {
    const { generateImage } = require('./codexImageAgent');
    const outputPath = path.join(os.tmpdir(), `icc-codex-${Date.now()}.png`);
    const result = await generateImage({ slug: 'blog', scene: prompt, outputPath, size: '1536x1024' });
    if (!result?.success) return null;
    const buffer = fs.readFileSync(outputPath);
    fs.rmSync(outputPath, { force: true });
    return buffer;
  } catch (err) {
    console.error(`  [imageAgent] Codex error: ${err.message}`);
    return null;
  }
}

const GENERATORS = {
  openai: { generate: generateOpenAIImage, credit: 'AI-generated illustration (OpenAI)' },
  gemini: { generate: generateGeminiImage, credit: 'AI-generated illustration (Gemini)' },
  codex: { generate: generateCodexImage, credit: 'AI-generated illustration (OpenAI via Codex)' },
};

/**
 * Generate one image with Gemini at 16:9. Falls back to the previous image
 * model if the configured one is not available on the key.
 */
async function generateGeminiImage(prompt) {
  const { GEMINI_API_KEY, GEMINI_IMAGE_MODEL } = require('../shared/config');
  if (!GEMINI_API_KEY) return null;

  const { GoogleGenAI } = require('@google/genai');
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const models = [...new Set([GEMINI_IMAGE_MODEL, 'gemini-2.5-flash-image'])];

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '16:9' } },
      });
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) return Buffer.from(part.inlineData.data, 'base64');
      }
      console.error(`  [imageAgent] Gemini (${model}) returned no image`);
    } catch (err) {
      console.error(`  [imageAgent] Gemini (${model}) error: ${err.message}`);
    }
  }
  return null;
}

/**
 * First unused landscape photo across the queries. Skips anything already in a
 * published post (`used`) or already picked in this run (`exclude`).
 */
async function findPexelsPhoto(queries, { exclude = new Set(), used } = {}) {
  const { PEXELS_API_KEY } = require('../shared/config');
  if (!PEXELS_API_KEY) return null;

  for (const query of queries) {
    for (let page = 1; page <= PEXELS_MAX_PAGES; page++) {
      let result;
      try {
        result = await httpsRequest({
          hostname: 'api.pexels.com',
          path: `/v1/search?query=${encodeURIComponent(query)}&per_page=${PEXELS_PER_PAGE}&page=${page}&orientation=landscape`,
          method: 'GET',
          headers: { Authorization: PEXELS_API_KEY },
        });
      } catch (err) {
        console.error(`  [imageAgent] Pexels error for "${query}": ${err.message}`);
        break;
      }
      if (result.status !== 200 || !Array.isArray(result.data.photos) || result.data.photos.length === 0) break;

      const candidates = result.data.photos.filter((p) => {
        const key = imageKey('pexels', p.id);
        if (exclude.has(key) || used?.sourceIds.has(key)) return false;
        if (p.width < MIN_SOURCE_WIDTH) return false;
        const ratio = p.width / p.height;
        return ratio >= 1.3 && ratio <= 2.1; // close enough to 16:9 that the crop keeps the subject
      });
      if (candidates.length === 0) continue;

      // Not always the first hit, so similar topics don't converge on one photo.
      const photo = candidates[Math.floor(Math.random() * Math.min(candidates.length, 6))];
      const buffer = await httpsGetBuffer(photo.src.large2x || photo.src.large || photo.src.original);
      console.log(`  [imageAgent] Pexels: photo ${photo.id} by ${photo.photographer} for "${query}"`);
      return {
        buffer,
        alt: (photo.alt || '').trim(),
        source: 'pexels',
        sourceId: String(photo.id),
        credit: `${photo.photographer} / Pexels`,
        creditUrl: photo.url,
      };
    }
  }
  return null;
}

/**
 * One publish-ready image (1200x675 WebP) from Pexels, else Gemini, else null.
 * @returns {Promise<null | {buffer, width, height, sha256, alt, source, sourceId?, credit?, creditUrl?}>}
 */
async function sourceImage({ pexelsQueries = [], scene, kind = 'inline', geminiPrompt, alt, exclude = new Set() }) {
  const { processImage } = require('../shared/contentStore');
  const { usedBlogImages, isBlogImageUsed } = require('../shared/imageRegistry');
  const { IMAGE_PROVIDERS } = require('../shared/config');
  const used = usedBlogImages();
  // `scene` + the house style is the normal path; `geminiPrompt` is kept for callers that pass a full prompt.
  const prompt = scene ? buildImagePrompt(scene, kind) : geminiPrompt;

  const finish = async (raw) => {
    const processed = await processImage(raw.buffer);
    const image = { ...raw, ...processed, alt: raw.alt || alt };
    if (isBlogImageUsed(image, used) || exclude.has(image.sha256)) return null;
    if (image.sourceId) exclude.add(imageKey(image.source, image.sourceId));
    exclude.add(image.sha256);
    return image;
  };

  for (const provider of IMAGE_PROVIDERS) {
    try {
      if (provider === 'pexels') {
        const photo = await findPexelsPhoto(pexelsQueries, { exclude, used });
        if (photo) {
          const image = await finish(photo);
          if (image) return image;
        }
        continue;
      }
      const generator = GENERATORS[provider];
      if (!generator || !prompt) continue;
      const buffer = await generator.generate(prompt);
      if (buffer) {
        const image = await finish({ buffer, alt, source: provider, credit: generator.credit });
        if (image) return image;
      }
    } catch (err) {
      console.error(`  [imageAgent] ${provider} image failed: ${err.message}`);
    }
  }
  return null;
}

/** Hero image for an article, chosen from its topic. Manufacturing scenes only. */
async function getHeroImage(article, { exclude = new Set() } = {}) {
  const { detectScene, getSearchVariations } = require('./infographicAgent');
  const topic = `${article.primaryKeyword || ''} ${article.title || ''}`;
  const scene = detectScene(topic);
  return sourceImage({
    pexelsQueries: getSearchVariations(article.title || article.primaryKeyword || '', scene),
    scene: HERO_SCENES[scene.id] || HERO_SCENES.default,
    kind: 'hero',
    alt: SCENE_ALT[scene.id] || SCENE_ALT.default,
    exclude,
  });
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

module.exports = {
  // v3 API
  ensureFeaturedImage,
  isValid16x9,
  validateAssetRatio,
  searchPexels16x9,
  uploadToSanity,
  patchMainImage,
  generateWithGemini,
  // Markdown blog API
  getHeroImage,
  sourceImage,
  buildImagePrompt,
  generateGeminiImage,
  generateOpenAIImage,
  generateCodexImage,
  findPexelsPhoto,
  // Legacy API (backward compat)
  findAndUploadImage,
  searchPexels,
  repairDuplicateImages,
};
