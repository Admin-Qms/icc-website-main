const fs = require("fs");
const path = require("path");
const { MEMORY_DIR } = require("./config");
const { log } = require("./logger");

const REGISTRY_PATH = path.join(MEMORY_DIR, "image-registry.json");

// ── Load / save registry ────────────────────────────────────────

function loadRegistry() {
  try {
    return JSON.parse(fs.readFileSync(REGISTRY_PATH, "utf-8"));
  } catch {
    return { assets: [], urls: [], photographers: [], photoIds: [] };
  }
}

function saveRegistry(registry) {
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + "\n");
}

// ── Bootstrap from published-articles.json (first run) ──────────

function bootstrap() {
  const registry = loadRegistry();

  // Ensure photoIds array exists (migration from older registry)
  if (!registry.photoIds) registry.photoIds = [];

  if (registry.bootstrapped) return registry;

  try {
    const published = JSON.parse(
      fs.readFileSync(path.join(MEMORY_DIR, "published-articles.json"), "utf-8")
    );

    for (const article of published) {
      if (article.image?.assetId) {
        registry.assets.push(article.image.assetId);
      }
      if (article.image?.photographer) {
        registry.photographers.push(article.image.photographer);
      }
      if (article.image?.pexelsId) {
        registry.photoIds.push(article.image.pexelsId);
      }
    }

    // Deduplicate
    registry.assets = [...new Set(registry.assets)];
    registry.photographers = [...new Set(registry.photographers)];
    registry.photoIds = [...new Set(registry.photoIds)];
    registry.bootstrapped = true;

    saveRegistry(registry);
    log("imageRegistry", "bootstrap", `loaded ${registry.assets.length} assets, ${registry.photographers.length} photographers, ${registry.photoIds.length} photo IDs from published articles`);
  } catch {
    log("imageRegistry", "bootstrap", "no published articles found — starting fresh");
  }

  return registry;
}

// ── Check functions ─────────────────────────────────────────────

function isAssetUsed(assetId) {
  if (!assetId) return false;
  const registry = bootstrap();
  return registry.assets.includes(assetId);
}

function isUrlUsed(url) {
  if (!url) return false;
  const registry = bootstrap();
  return registry.urls.includes(url);
}

function isPhotographerUsed(photographer) {
  if (!photographer) return false;
  const registry = bootstrap();
  return registry.photographers.includes(photographer);
}

function isPhotoIdUsed(photoId) {
  if (!photoId) return false;
  const registry = bootstrap();
  return registry.photoIds.includes(photoId);
}

// ── Register a new image ────────────────────────────────────────

function registerImage({ assetId, url, photographer, photoId, slug, type, source }) {
  const registry = bootstrap();

  if (assetId && !registry.assets.includes(assetId)) {
    registry.assets.push(assetId);
  }
  if (url && !registry.urls.includes(url)) {
    registry.urls.push(url);
  }
  if (photographer && !registry.photographers.includes(photographer)) {
    registry.photographers.push(photographer);
  }
  if (photoId && !registry.photoIds.includes(photoId)) {
    registry.photoIds.push(photoId);
  }

  saveRegistry(registry);
  log("imageRegistry", "register", `${source || "unknown"} image for ${slug || "unknown"} — asset: ${assetId || "N/A"}, photographer: ${photographer || "N/A"}, pexelsId: ${photoId || "N/A"}`);
}

// ── Filter Pexels photos against registry ───────────────────────
// Checks photo ID (most reliable), URL, AND photographer to catch all duplicates

function filterPexelsPhotos(photos) {
  const registry = bootstrap();
  const photoIdSet = new Set(registry.photoIds);
  const urlSet = new Set(registry.urls);
  const photographerSet = new Set(registry.photographers);

  return photos.filter((p) => {
    // Primary check: Pexels photo ID (most reliable — IDs never change)
    if (p.id && photoIdSet.has(p.id)) return false;

    // Secondary check: URL match
    const url = p.src?.landscape || p.src?.large || "";
    if (urlSet.has(url)) return false;

    // Tertiary check: photographer match (prevents same photographer, different photo)
    if (photographerSet.has(p.photographer)) return false;

    return true;
  });
}

// ── Pick random photo from filtered set (prevents first-result convergence) ──

function pickRandom(photos) {
  if (!photos || photos.length === 0) return null;
  const idx = Math.floor(Math.random() * photos.length);
  return photos[idx];
}

// ── Markdown blog: the posts are the registry ───────────────────
// Every image a post uses is recorded in its frontmatter (source id + sha256),
// so "has this image been used?" is answered from content/blog, with no state file.

function usedBlogImages() {
  const { listPosts } = require("./contentStore");
  const sourceIds = new Set();
  const hashes = new Set();
  for (const post of listPosts()) {
    for (const img of [post.image, ...(post.inlineImages || [])]) {
      if (!img) continue;
      if (img.source && img.sourceId != null) sourceIds.add(`${img.source}:${img.sourceId}`);
      if (img.sha256) hashes.add(img.sha256);
    }
  }
  return { sourceIds, hashes };
}

/** True if this image (by source id or content hash) already appears in a published post. */
function isBlogImageUsed(img, used = usedBlogImages()) {
  if (!img) return false;
  if (img.source && img.sourceId != null && used.sourceIds.has(`${img.source}:${img.sourceId}`)) return true;
  return Boolean(img.sha256 && used.hashes.has(img.sha256));
}

module.exports = {
  usedBlogImages,
  isBlogImageUsed,
  isAssetUsed,
  isUrlUsed,
  isPhotographerUsed,
  isPhotoIdUsed,
  registerImage,
  filterPexelsPhotos,
  pickRandom,
  bootstrap,
};
