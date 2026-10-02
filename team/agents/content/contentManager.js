const fs = require("fs");
const path = require("path");
const { log } = require("../shared/logger");
// Email notifications removed — blog results are included in the consolidated morning report
const { today } = require("../shared/logger");
const { REPORTS_DIR, SITE_URL, BLOG_AUTHOR } = require("../shared/config");
const {
  ensureDirs,
  slugify,
  slugExists,
  todayLocal,
  toPlainText,
  countWords,
  normalizeBody,
  listPosts,
  processImage,
  publishPost,
} = require("../shared/contentStore");
const keywordResearcher = require("./keywordResearcher");
const articleWriter = require("./articleWriter");
const contextLoader = require("./contextLoader");
const contentCleaner = require("./contentCleaner");
const imageAgent = require("./imageAgent");
const infographicAgent = require("./infographicAgent");
const inlineImageAgent = require("./inlineImageAgent");
const linkBuilder = require("../seo/linkBuilder");
const plagiarismChecker = require("./plagiarismChecker");
const grammarAgent = require("./grammarAgent");
const contentQA = require("./contentQA");
const sanityPublisher = require("./sanityPublisher");
const pageAuditor = require("../web/pageAuditor");
const outlineArchitect = require("./outlineArchitect");
const contentEnhancer = require("./contentEnhancer");
const rewritePatcher = require("./rewritePatcher");
const telegram = require("../shared/telegram");

const MAX_REWRITES = 2; // targeted patch passes before the run gives up
const MAX_INLINE_IMAGES = 2;

// The Markdown posts are the record of what has been published — there is no
// separate published-articles.json to keep in step.
function loadPublished() {
  return listPosts().map((p) => ({
    date: p.date,
    title: p.title,
    primaryKeyword: p.primaryKeyword,
    articleType: p.articleType,
    targetCity: p.targetCity || null,
    metaDescription: p.description,
    slug: p.slug,
    url: `${SITE_URL}${p.url}`,
    wordCount: p.wordCount,
    category: p.category,
    readTime: p.readTime,
    image: p.image,
  }));
}

function savePublished() {
  // Kept for the (unscheduled) mega pipeline's call sites; publishing a post is the save.
}

// ═══════════════════════════════════════════════════════════════════
// DAILY BLOG PIPELINE — v3 (Markdown in the repo, blocking quality gate)
// ═══════════════════════════════════════════════════════════════════
//
//   0. Guard — one article per day unless --force
//   1. Keyword Research (picks from the queue, fixes the slug)
//   2. Context Loading (real site routes, link bank, recent posts)
//   3. Article Writing
//   4. Content Cleaning
//   5. Grammar Check
//   6. Originality Check
//   7. Link Validation
//   8. Text QA + targeted patches (max 2) — a failure stops here, before any image spend
//   9. Hero + inline images (Pexels, then Gemini), processed to 1200x675 in memory
//  10. Final QA — every check, including images
//  11. Publish — images and Markdown written to the site repo in one step
//
// Nothing is written to content/ or public/ until step 10 passes, so a failed
// run leaves the repo untouched.
// ═══════════════════════════════════════════════════════════════════

function toPost(article, keywordBrief, slug, date) {
  return {
    slug,
    title: article.title,
    description: article.metaDescription,
    date,
    author: BLOG_AUTHOR,
    category: article.category,
    primaryKeyword: article.primaryKeyword,
    keywords: [article.primaryKeyword, ...(article.secondaryKeywords || [])].filter(Boolean),
    articleType: keywordBrief.articleType || "deep-guide",
    targetCity: keywordBrief.targetCity || undefined,
    body: article.body,
  };
}

/**
 * A ready-written draft, published through the same checks and image steps
 * without calling a writer. Fields: title, metaDescription, primaryKeyword,
 * secondaryKeywords[], body or bodyFile, optional category/articleType/targetCity,
 * and optional hero { path, alt, credit } for a local image.
 */
function loadFixture(fixturePath) {
  const file = path.resolve(fixturePath);
  const draft = JSON.parse(fs.readFileSync(file, "utf-8"));
  const dir = path.dirname(file);
  const body = draft.bodyFile ? fs.readFileSync(path.resolve(dir, draft.bodyFile), "utf-8") : draft.body;
  for (const key of ["title", "metaDescription", "primaryKeyword"]) {
    if (!draft[key]) throw new Error(`Draft ${fixturePath} is missing "${key}"`);
  }
  if (!body) throw new Error(`Draft ${fixturePath} has no body or bodyFile`);

  const keywordBrief = {
    title: draft.title,
    primaryKeyword: draft.primaryKeyword,
    secondaryKeywords: draft.secondaryKeywords || [],
    metaDescription: draft.metaDescription,
    articleType: draft.articleType || "deep-guide",
    targetCity: draft.targetCity || null,
    slug: draft.slug || slugify(draft.title),
  };
  const article = {
    title: draft.title,
    body,
    metaDescription: draft.metaDescription,
    primaryKeyword: draft.primaryKeyword,
    secondaryKeywords: draft.secondaryKeywords || [],
    category: draft.category || articleWriter.detectCategory(draft.primaryKeyword),
    wordCount: countWords(body),
  };
  const hero = draft.hero?.path ? { ...draft.hero, path: path.resolve(dir, draft.hero.path) } : null;
  return { keywordBrief, article, hero };
}

async function loadLocalHero(hero) {
  const processed = await processImage(fs.readFileSync(hero.path));
  return {
    ...processed,
    alt: hero.alt,
    source: "local",
    sourceId: path.basename(hero.path),
    credit: hero.credit,
  };
}

function savePreview(post) {
  const dir = path.join(REPORTS_DIR, "preview", post.slug);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "article.md"), `# ${post.title}\n\n> ${post.description}\n\n${post.body}\n`);
  fs.writeFileSync(path.join(dir, "hero.webp"), post.hero.buffer);
  for (const img of post.inlineImages || []) fs.writeFileSync(path.join(dir, img.file), img.buffer);
  return dir;
}

async function publishDaily(options = {}) {
  const { dryRun = false, force = false, fixture = null } = options;
  const startTime = Date.now();
  const date = todayLocal();
  log("contentManager", "pipeline-v3", `starting daily blog publish${dryRun ? " (dry run)" : ""}${fixture ? ` from ${fixture}` : ""}`);

  let keywordBrief, context, article, qaResult;

  const fail = (reason, extra = {}) => {
    log("contentManager", "failed", reason);
    if (!dryRun) {
      telegram.notifyError("Blog Pipeline", `"${keywordBrief?.title || "no title"}"\nKeyword: ${keywordBrief?.primaryKeyword || "n/a"}\n${reason}\n${(extra.issues || []).join("\n")}`).catch(() => {});
    }
    return { success: false, reason, keyword: keywordBrief?.primaryKeyword, title: keywordBrief?.title, ...extra };
  };

  try {
    ensureDirs();

    // Step 0: one article per day. A dry run publishes nothing, so it is always allowed.
    if (!dryRun && !force) {
      const already = listPosts().find((p) => p.date === date);
      if (already) {
        log("contentManager", "skip", `already published today: ${already.slug}`);
        return { success: false, skipped: true, reason: `An article dated ${date} is already published (/blog/${already.slug}). Use --force to publish another.` };
      }
    }

    let localHero = null;

    if (fixture) {
      ({ keywordBrief, article, hero: localHero } = loadFixture(fixture));
      context = await contextLoader.loadContext(keywordBrief);
      log("contentManager", "draft", `"${article.title}" — ${article.wordCount} words`);
    } else {
      // Step 1: Pick keyword
      log("contentManager", "step-1", "keyword research");
      keywordBrief = await keywordResearcher.pickKeyword();
      log("contentManager", "keyword", `[${keywordBrief.articleType || "deep-guide"}] "${keywordBrief.primaryKeyword}" → "${keywordBrief.title}"`);

      // Step 2: Load context (real routes, link bank, recent posts)
      log("contentManager", "step-2", "loading context");
      context = await contextLoader.loadContext(keywordBrief);
      log("contentManager", "context", `${context.externalLinks.length} external links available, ${context.internalLinks.blogPosts.length} blog posts for cross-linking`);
      try {
        context.diversityBrief = await contextLoader.loadDiversityBrief();
      } catch (err) {
        log("contentManager", "diversity-error", err.message);
        context.diversityBrief = "";
      }

      // Step 3: Write article
      log("contentManager", "step-3", "writing article (context-aware)");
      article = await articleWriter.writeArticle(keywordBrief, context);
      log("contentManager", "article", `${article.wordCount} words, ${article.category}`);

      // Step 4: Clean article (strip artifacts, fix formatting)
      log("contentManager", "step-4", "cleaning article");
      try {
        article = await contentCleaner.clean(article);
        log("contentManager", "cleaned", `"${article.title}" — ${article.wordCount} words`);
      } catch (err) {
        log("contentManager", "clean-error", err.message);
      }

      // Step 5: Grammar check
      log("contentManager", "step-5", "grammar check");
      try {
        const grammarResult = await grammarAgent.checkGrammar(article);
        if (grammarResult.totalCorrections > 0) {
          article.body = grammarResult.correctedContent;
          log("contentManager", "grammar", `${grammarResult.totalCorrections} corrections (${grammarResult.overallGrade})`);
        } else {
          log("contentManager", "grammar", "no corrections needed");
        }
      } catch (err) {
        log("contentManager", "grammar-error", err.message);
      }

      // Step 6: Originality check against the most recent posts
      log("contentManager", "step-6", "originality check (with self-plagiarism)");
      try {
        const existingArticles = listPosts().slice(-15).map((p) => ({ title: p.title, body: toPlainText(p.body) }));
        const origResult = await plagiarismChecker.checkOriginality(article, existingArticles);
        log("contentManager", "originality", `${origResult.score}/100 — ${origResult.pass ? "PASS" : "NEEDS WORK"}`);
        if (!origResult.pass && origResult.rewriteInstructions) {
          log("contentManager", "originality-rewrite", "rewriting for uniqueness");
          article = await articleWriter.writeArticle({
            ...keywordBrief,
            rewriteInstructions: `ORIGINALITY ISSUES: ${origResult.rewriteInstructions}. Flagged sentences: ${(origResult.flaggedSentences || []).map((f) => f.text).join("; ")}`,
          }, context);
          article = await contentCleaner.clean(article);
        }
      } catch (err) {
        log("contentManager", "originality-error", err.message);
      }

      // Step 7: Validate links (drop bad ones, top up if short)
      log("contentManager", "step-7", "validating links");
      try {
        article = await linkBuilder.validateLinks(article, context);
        log("contentManager", "links", `${article.linkReport?.totalLinks || 0} links (${article.linkReport?.status || "ok"})`);
      } catch (err) {
        log("contentManager", "links-error", err.message);
      }
    }

    const slug = keywordBrief.slug || slugify(article.title);
    if (slugExists(slug)) {
      return fail(`The URL /blog/${slug} is already published — existing posts are never overwritten`);
    }

    // Step 8: Text QA, with targeted patches. Images come after, so a draft
    // that can't pass costs nothing more.
    log("contentManager", "step-8", "text QA");
    article.body = normalizeBody(article.body, article.title);
    qaResult = await contentQA.validateLocal(toPost(article, keywordBrief, slug, date), { phase: "text" });

    let patches = 0;
    while (!qaResult.pass && patches < MAX_REWRITES) {
      patches++;
      log("contentManager", "patch", `attempt ${patches} — ${qaResult.issues.join(" | ")}`);
      article = await rewritePatcher.patchArticle(article, qaResult, context);
      article.body = normalizeBody(article.body, article.title);
      qaResult = await contentQA.validateLocal(toPost(article, keywordBrief, slug, date), { phase: "text" });
    }

    if (!qaResult.pass) {
      return fail(`Quality checks failed after ${patches} patch attempt(s)`, { issues: qaResult.issues, score: qaResult.score, qaChecks: qaResult.checks });
    }
    log("contentManager", "text-qa", `passed ${qaResult.score}`);

    // Step 9: Images — held in memory until the final gate passes
    log("contentManager", "step-9", "sourcing images");
    const exclude = new Set();
    const hero = localHero ? await loadLocalHero(localHero) : await imageAgent.getHeroImage(article, { exclude });
    if (!hero) {
      return fail("No hero image could be sourced — set PEXELS_API_KEY or GEMINI_API_KEY in team/.env");
    }
    exclude.add(hero.sha256);
    log("contentManager", "image", `hero from ${hero.source}${hero.credit ? ` (${hero.credit})` : ""}`);

    const inlineImageResult = await inlineImageAgent.processInlineImagesLocal(article, slug, { exclude, max: MAX_INLINE_IMAGES });
    article.body = normalizeBody(inlineImageResult.body, article.title);
    log("contentManager", "inline-images", `${inlineImageResult.count} images placed`);

    // Step 10: Final gate — every check, on exactly what will be written
    log("contentManager", "step-10", "final QA");
    const post = { ...toPost(article, keywordBrief, slug, date), hero, inlineImages: inlineImageResult.images };
    const claimsCheck = qaResult.checks.find((c) => c.id === "claims-audit");
    qaResult = await contentQA.validateLocal(post, { phase: "final", claimsCheck });
    if (!qaResult.pass) {
      return fail("Final quality checks failed", { issues: qaResult.issues, score: qaResult.score, qaChecks: qaResult.checks });
    }

    const record = {
      date,
      title: article.title,
      primaryKeyword: keywordBrief.primaryKeyword,
      secondaryKeywords: keywordBrief.secondaryKeywords || [],
      articleType: keywordBrief.articleType || "deep-guide",
      targetCity: keywordBrief.targetCity || null,
      metaDescription: article.metaDescription,
      slug,
      wordCount: qaResult.wordCount,
      readTime: `${qaResult.readTime} min read`,
      qaScore: qaResult.score,
      qaChecks: qaResult.checks.map((c) => ({ id: c.id, pass: c.pass, skipped: Boolean(c.skipped), message: c.message })),
      category: article.category,
      image: { source: hero.source, photographer: hero.credit || hero.source, sourceId: hero.sourceId || null },
      inlineImages: inlineImageResult.count,
    };

    if (dryRun) {
      const previewDir = savePreview(post);
      log("contentManager", "dry-run", `all checks passed — preview in ${previewDir}, nothing published`);
      return { success: true, dryRun: true, previewDir, url: null, ...record, pipelineDurationMs: Date.now() - startTime };
    }

    // Step 11: Publish — images, then the Markdown file
    log("contentManager", "step-11", "publishing to content/blog");
    const publishResult = publishPost(post);

    try {
      fs.writeFileSync(path.join(REPORTS_DIR, "content", `${date}-${slug}.md`), `# ${article.title}\n\n${article.body}`);
    } catch { /* reports are optional */ }

    const duration = Math.round((Date.now() - startTime) / 1000);
    log("contentManager", "complete", `published in ${duration}s — ${publishResult.localUrl}`);

    telegram.notifySuccess("Blog Published", `"${article.title}"\nKeyword: ${keywordBrief.primaryKeyword}\nChecks: ${qaResult.score}\nWords: ${record.wordCount}\nURL: ${publishResult.url}\nDuration: ${duration}s`).catch(() => {});

    return {
      success: true,
      ...record,
      url: publishResult.url,
      localUrl: publishResult.localUrl,
      files: publishResult.files,
      pipelineDurationMs: Date.now() - startTime,
    };

  } catch (err) {
    return fail(err.message);
  }
}

// ── Mega-article pipeline (18,000-20,000 words, 9-10 chapters) ────────
async function publishMegaArticle() {
  const startTime = Date.now();
  log("contentManager", "mega-pipeline", "starting mega-article publish");

  let megaKeywordBrief, outline, article, imageResult, infographicResult, qaResult, publishResult, auditResult;

  try {
    // Step 1: Pick mega-article topic
    log("contentManager", "mega-1", "selecting mega-article topic");
    megaKeywordBrief = await keywordResearcher.pickMegaKeyword();
    log("contentManager", "mega-topic", `"${megaKeywordBrief.primaryKeyword}" — ${megaKeywordBrief.articleType}`);

    // Step 2: Design chapter outline
    log("contentManager", "mega-2", "designing chapter outline");
    outline = await outlineArchitect.designOutline(megaKeywordBrief);
    log("contentManager", "mega-outline", `${outline.chapters.length} chapters, ~${outline.estimatedWords} words`);

    // ── PHASE 1: Parallel chapter writing ──────────────────────────
    log("contentManager", "mega-3", `writing ${outline.chapters.length} chapters in PARALLEL`);

    const chapterPromises = outline.chapters.map(async (chapter) => {
      const chapterLabel = `Ch${chapter.number}/${outline.chapters.length}`;
      log("contentManager", "mega-writer", `${chapterLabel} started: "${chapter.title}"`);

      // Write the chapter
      let chapterResult = await articleWriter.writeChapter({
        chapter,
        outline,
        previousChapterSummaries: [],
        megaKeywordBrief,
      });
      log("contentManager", "mega-writer-done", `${chapterLabel}: ${chapterResult.wordCount} words`);

      // Enhance the chapter (mega chapters still use enhancer for callouts/bold)
      const enhancedBody = await contentEnhancer.enhanceChapter(
        chapterResult.body,
        chapterResult.title,
        megaKeywordBrief.primaryKeyword
      );
      log("contentManager", "mega-enhanced", `${chapterLabel} enhanced`);

      // Clean the chapter
      const cleanResult = await contentCleaner.clean({
        title: chapterResult.title,
        body: enhancedBody,
      });

      chapterResult.body = cleanResult.body;
      chapterResult.wordCount = cleanResult.wordCount;
      log("contentManager", "mega-chapter-done", `${chapterLabel}: ${chapterResult.wordCount} words (final)`);

      return chapterResult;
    });

    const chapterResults = await Promise.all(chapterPromises);
    chapterResults.sort((a, b) => a.number - b.number);

    // ── PHASE 2: Assemble + grammar + links ──────────────────────
    log("contentManager", "mega-4", "assembling chapters");
    const assembledBody = chapterResults.map((ch) => ch.body).join("\n\n");
    const totalWordCount = assembledBody.split(/\s+/).length;
    const category = articleWriter.detectCategory(megaKeywordBrief.primaryKeyword);

    article = {
      title: outline.title,
      body: assembledBody,
      wordCount: totalWordCount,
      metaDescription: outline.metaDescription || megaKeywordBrief.metaDescription,
      primaryKeyword: megaKeywordBrief.primaryKeyword,
      secondaryKeywords: megaKeywordBrief.secondaryKeywords,
      category,
      readTime: outline.estimatedReadTime || `${Math.ceil(totalWordCount / 200)} min read`,
      isMegaArticle: true,
      chapterCount: chapterResults.length,
    };
    log("contentManager", "mega-assembled", `${totalWordCount} words across ${chapterResults.length} chapters`);

    // Grammar + link validation in parallel
    log("contentManager", "mega-5", "grammar check + link validation (parallel)");
    const [grammarDone, linksDone] = await Promise.allSettled([
      grammarAgent.checkGrammar(article).then((r) => {
        if (r.totalCorrections > 0) {
          article.body = r.correctedContent;
          log("contentManager", "mega-grammar", `${r.totalCorrections} corrections`);
        }
      }).catch((err) => log("contentManager", "mega-grammar-error", err.message)),

      linkBuilder.validateLinks(article).then((linked) => {
        article = linked;
        log("contentManager", "mega-links", `${article.linkReport?.totalLinks || 0} links validated`);
      }).catch((err) => log("contentManager", "mega-links-error", err.message)),
    ]);

    // ── PHASE 3: All images in parallel ─────────────────────────
    log("contentManager", "mega-6", "hero + inline + featured images (parallel)");
    const slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);

    const [heroDone, inlineDone, featuredDone] = await Promise.allSettled([
      imageAgent.findAndUploadImage(article).then((r) => {
        imageResult = r;
        log("contentManager", "mega-hero", `${r.source}: ${r.photographer}`);
      }).catch((err) => {
        log("contentManager", "mega-hero-error", err.message);
        imageResult = { assetId: null, url: null, altText: article.title, photographer: "none", source: "failed" };
      }),

      inlineImageAgent.processInlineImages(article, slug).then((r) => {
        article.body = r.body;
        log("contentManager", "mega-inline-images", `${r.count} images placed`);
        return r;
      }).catch((err) => {
        log("contentManager", "mega-inline-images-error", err.message);
        return { count: 0 };
      }),

      infographicAgent.getArticleImage(article, slug).then((r) => {
        infographicResult = r;
        log("contentManager", "mega-featured", r.type);
      }).catch((err) => {
        log("contentManager", "mega-featured-error", err.message);
        infographicResult = { type: "none", reason: err.message };
      }),
    ]);

    let inlineImageResult = inlineDone.status === "fulfilled" ? inlineDone.value : { count: 0 };

    // ── PHASE 4: QA review (now sees complete article with images) ──
    log("contentManager", "mega-7", "QA review (post-images)");
    qaResult = await contentQA.reviewMegaArticle(article, imageResult);

    if (!qaResult) qaResult = { score: 0, pass: false, issues: ["QA review failed"] };

    // Gate: mega-articles must also pass QA before publishing
    if (!qaResult.pass) {
      log("contentManager", "mega-qa-warning", `QA score ${qaResult.score}/100 — publishing anyway (mega pipeline)`);
      if (qaResult.issues) qaResult.issues.forEach((i) => log("contentManager", "mega-qa-issue", i));
    } else {
      log("contentManager", "mega-qa", `QA score ${qaResult.score}/100 — PASS`);
    }

    // ── PHASE 5: Publish ─────────────────────────────────────────
    log("contentManager", "mega-8", "publishing to Sanity");
    publishResult = await sanityPublisher.publishToSanity(article, imageResult, infographicResult);

    // Page audit
    log("contentManager", "mega-9", "page audit");
    try {
      auditResult = await pageAuditor.auditPage(publishResult.url);
      log("contentManager", "mega-audit", `${auditResult.score}/100 — ${auditResult.pass ? "PASS" : "FAIL"}`);
    } catch (err) {
      log("contentManager", "mega-audit-error", err.message);
      auditResult = { pass: true, score: 0 };
    }

    // Record publication
    const published = loadPublished();
    const record = {
      date: today(),
      title: article.title,
      primaryKeyword: megaKeywordBrief.primaryKeyword,
      secondaryKeywords: megaKeywordBrief.secondaryKeywords,
      metaDescription: article.metaDescription,
      slug: publishResult.slug,
      url: publishResult.url,
      documentId: publishResult.documentId,
      wordCount: article.wordCount,
      chapterCount: article.chapterCount,
      qaScore: qaResult.score,
      qaChecks: qaResult.checks || [],
      qaIssues: qaResult.issues || [],
      qaSuggestions: qaResult.suggestions || [],
      auditScore: auditResult?.score || null,
      category: article.category,
      readTime: article.readTime,
      articleType: "mega",
      image: {
        source: imageResult?.source || "none",
        photographer: imageResult?.photographer || "none",
        assetId: imageResult?.assetId || null,
        pexelsId: imageResult?.pexelsId || null,
      },
      featuredImage: infographicResult?.type || "none",
      inlineImages: inlineImageResult?.count || 0,
      publishedAt: publishResult.publishedAt,
      pipelineDurationMs: Date.now() - startTime,
    };
    published.push(record);
    savePublished(published);

    // Save article to reports
    const reportPath = path.join(REPORTS_DIR, "content", `${today()}-mega-${publishResult.slug}.md`);
    try {
      fs.writeFileSync(reportPath, `# ${article.title}\n\n${article.body}`);
    } catch { /* ok */ }

    const duration = Math.round((Date.now() - startTime) / 1000);
    log("contentManager", "mega-complete", `published in ${duration}s — ${publishResult.url}`);

    return { success: true, ...record };

  } catch (err) {
    log("contentManager", "mega-error", err.message);
    return { success: false, reason: err.message };
  }
}

async function previewNext() {
  log("contentManager", "preview", "previewing next article");
  const keywordBrief = await keywordResearcher.pickKeyword();
  return keywordBrief;
}

function getPublished() {
  return loadPublished();
}

function getCalendar() {
  const status = keywordResearcher.getQueueStatus();
  const published = loadPublished();

  return {
    totalKeywords: status.total,
    published: published.length,
    remaining: status.remaining,
    daysOfContent: status.remaining,
    nextKeywords: status.next,
    recentArticles: published.slice(-7).reverse(),
  };
}

// ── Auto-schedule: one daily article ─────────────────────────────
// Mega articles are not scheduled: publishMegaArticle still targets Sanity and
// has not been moved to the Markdown store.
async function publishDailySchedule(options = {}) {
  log("contentManager", "schedule", "publishing daily blog");
  return { daily: await publishDaily(options), mega: null };
}

module.exports = { publishDaily, publishMegaArticle, publishDailySchedule, previewNext, getPublished, getCalendar };
