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
  // Legacy API (backward compat)
  findAndUploadImage,
  searchPexels,
  repairDuplicateImages,
};
