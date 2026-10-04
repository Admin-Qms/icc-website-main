const { claudeCall, claudeCallFast } = require("../shared/claude");
const { log } = require("../shared/logger");
const { countWords, readTimeMinutes } = require("../shared/contentStore");

const CURRENT_YEAR = new Date().getFullYear();

// ── Daily article prompt — built from data/writing-rules.md, the one rule set every writer follows ──
const fs = require("fs");
const path = require("path");
const RULES_PATH = path.join(__dirname, "../../data/writing-rules.md");

function loadWritingRules() {
  return fs.readFileSync(RULES_PATH, "utf-8").replace(/\{\{YEAR\}\}/g, String(CURRENT_YEAR));
}

/** The self-check list at the end of the rules, for the prompt's closing reminder. */
function selfCheck(rules) {
  const idx = rules.indexOf("## Self-check");
  return idx === -1 ? "" : rules.slice(idx);
}

function buildSystemPrompt() {
  const rules = loadWritingRules();
  return `You are an expert B2B content writer specializing in ISO consulting for Canadian manufacturers. You write like a senior ISO consultant with 25 years of field experience: authoritative, specific, grounded in how standards play out on a real shop floor.

CRITICAL: The current year is ${CURRENT_YEAR}. Year references use ${CURRENT_YEAR}, never a past year.

The rules below are the publisher's house rules. The article is checked against them by machine before it is published; a draft that breaks a rule is rejected.

${rules}

OUTPUT: Return the article as clean markdown. No code fences. No preamble. No title and no H1 heading: use ## and ### only. Start directly with the Key Takeaways callout.`;
}

async function writeArticle(keywordBrief, context) {
  log("articleWriter", "writing", `"${keywordBrief.title}"`);

  const rules = loadWritingRules();

  // Build context sections from contextLoader output
  const internalLinksSection = context
    ? `AVAILABLE INTERNAL LINKS (choose 3-5, always including /contact):
Service pages:
${(context.internalLinks?.servicePages || []).map((s) => `- [${s.title}](${s.url})`).join("\n")}

Related blog posts:
${(context.internalLinks?.blogPosts || []).map((p) => `- [${p.title}](${p.url})`).join("\n") || "- None yet"}`
    : `AVAILABLE INTERNAL LINKS:
- /services — All ISO standards
- /process — The six-stage certification process
- /contact — Book a consultation`;

  const externalLinksSection = context?.externalLinks?.length
    ? `AVAILABLE OUTSIDE LINKS (use 2-4, copied exactly, only where the source supports the sentence; no other outside URL):
${context.externalLinks.map((l) => `- [${l.name}](${l.url}) — ${l.context}`).join("\n")}`
    : `OUTSIDE LINKS: none available — include no outside links.`;

  const article = await claudeCall(
    buildSystemPrompt(),
    `Write a full blog article from this brief.

Title (fixed): ${keywordBrief.title}
Article type: ${keywordBrief.articleType || "deep-guide"}
Primary keyword (the topic): ${keywordBrief.primaryKeyword}
Related topics to cover (not phrases to insert): ${(keywordBrief.secondaryKeywords || []).join("; ") || "none"}
Search intent: ${keywordBrief.searchIntent || "informational"}
Target length: 1,900 words
Target city, if one fits: ${keywordBrief.targetCity || "none — Ontario in general"}
Meta description (fixed): ${keywordBrief.metaDescription}

Section outline to follow:
${(keywordBrief.h2Structure || []).map((h) => `- ${h}`).join("\n") || "- Choose sections that fit the article type"}

FAQ questions to answer${["checklist", "myth-buster"].includes(keywordBrief.articleType) ? " (if space permits)" : " in a ## Frequently Asked Questions section"}:
${(keywordBrief.faqQuestions || []).map((q) => `- ${q}`).join("\n") || "- none"}

${internalLinksSection}

${externalLinksSection}

${context?.standardsFacts ? `${context.standardsFacts}\n` : ""}
${keywordBrief.rewriteInstructions ? `\nREWRITE INSTRUCTIONS (fix these specific issues from the previous draft):\n${keywordBrief.rewriteInstructions}\n` : ""}
${context?.diversityBrief ? `\n${context.diversityBrief}\n` : ""}

Write the full article now, then run the self-check below and fix anything it catches before returning.

${selfCheck(rules)}`,
    8192
  );

  const wordCount = countWords(article);
  log("articleWriter", "complete", `${wordCount} words`);

  return {
    title: keywordBrief.title,
    body: article,
    wordCount,
    metaDescription: keywordBrief.metaDescription,
    primaryKeyword: keywordBrief.primaryKeyword,
    secondaryKeywords: keywordBrief.secondaryKeywords,
    category: detectCategory(keywordBrief.primaryKeyword),
    readTime: `${readTimeMinutes(wordCount)} min read`,
  };
}

// ── Mega-article chapter writer ────────────────────────────────

const CHAPTER_SYSTEM_PROMPT = `You are an expert B2B content writer specializing in ISO consulting for Canadian manufacturers. You write in an authoritative but accessible tone — like a senior ISO consultant with 25 years of experience explaining to a quality manager or plant director.

CRITICAL: The current year is ${CURRENT_YEAR}. All references to years MUST use ${CURRENT_YEAR}.

YOU ARE WRITING ONE CHAPTER of a larger mega-article (9-10 chapters, 18,000-20,000 words total). This chapter must:
- Be 2,000-2,200 words (MINIMUM 1,800 words — this is non-negotiable)
- Cover its specific topic thoroughly with actionable detail
- Flow naturally from the previous chapter and into the next
- NOT repeat content from other chapters (summaries of previous chapters provided)
- Include 1-2 [IMAGE:] markers for inline images (manufacturing/industrial scenes ONLY)

WRITING RULES:
- Use H2 (##) for the chapter title, H3 (###) for subsections
- Short paragraphs (2-4 sentences max)
- Use bullet points and numbered lists for scanability
- Include specific Canadian examples, regulations, and industry references
- Include at least 1 internal link and 1 external link per chapter
- No AI-sounding phrases: avoid "delve into", "it is worth noting", "in conclusion", "comprehensive", "crucial", "landscape"
- No first person (never "we", "our", "us", "I", "my"); refer to the company as "ISO Certification Consultant" and address the reader as "you"
- Bold 3-5 key phrases per chapter
- Add 1 callout box per chapter using **Important:** or **Did You Know?** or **Key Consideration:** (NEVER "Pro Tip")

LINK REQUIREMENTS:
- Internal links woven naturally mid-sentence (not appended)
- External links to INDUSTRY-SPECIFIC sources (not generic iso.org)
- Each chapter's external links must be UNIQUE — never reuse links from other chapters

IMAGE MARKERS:
- Place 1-2 [IMAGE:] markers after the first paragraph of different H3 sections
- Format: [IMAGE: specific descriptive manufacturing/industrial scene]
- NEVER describe office, boardroom, desk, or corporate meeting scenes

OUTPUT: Return the chapter as clean markdown. Start with ## Chapter Title. No preamble.`;

async function writeChapter(chapterBrief) {
  const { chapter, outline, previousChapterSummaries, megaKeywordBrief } = chapterBrief;

  log("articleWriter", "chapter", `writing Ch${chapter.number}: "${chapter.title}" (~${chapter.targetWords} words)`);

  // Use Haiku for chapter writing (5x faster, 5x cheaper) — QA gate uses Sonnet
  const chapterContent = await claudeCallFast(
    CHAPTER_SYSTEM_PROMPT,
    `Write Chapter ${chapter.number} of a ${outline.chapters.length}-chapter mega-article.

MEGA-ARTICLE TITLE: ${outline.title}
PRIMARY KEYWORD: ${megaKeywordBrief.primaryKeyword}

THIS CHAPTER:
- Title: ${chapter.title}
- Target words: ${chapter.targetWords}
- Chapter keyword: ${chapter.chapterKeyword}
- Keywords to weave in: ${chapter.keywordsToWeave.join(", ")}
- Content notes: ${chapter.contentNotes}

SUBSECTIONS TO COVER:
${chapter.subsections.map((s) => `### ${s.title}\nKey points: ${s.keyPoints.join("; ")}`).join("\n\n")}

INTERNAL LINK TARGETS (use 1-2 per chapter, naturally mid-sentence):
${(outline.internalLinkTargets || []).join(", ")}

EXTERNAL LINK TARGETS (use 1-2 per chapter, unique to this chapter):
${(outline.externalLinkTargets || []).slice((chapter.number - 1) * 2, chapter.number * 2).join(", ") || "Find a relevant industry-specific source"}

${previousChapterSummaries.length > 0 ? `PREVIOUS CHAPTERS (DO NOT repeat this content):
${previousChapterSummaries.map((s) => `- Ch${s.number}: ${s.title} — ${s.summary}`).join("\n")}` : "This is the FIRST chapter. Set the stage for the entire article."}

${chapter.number === outline.chapters.length ? "This is the FINAL chapter. End with a strong CTA paragraph linking to /contact." : ""}

Write the complete chapter now. Minimum 1,800 words, target 2,000-2,200. Start with ## heading.`,
    8192
  );

  const wordCount = chapterContent.split(/\s+/).length;
  log("articleWriter", "chapter-done", `Ch${chapter.number}: ${wordCount} words`);

  // Generate a brief summary for subsequent chapters to avoid repetition
  const summary = chapterContent.split("\n").filter((l) => l.trim() && !l.startsWith("#") && !l.startsWith("[IMAGE")).slice(0, 3).join(" ").slice(0, 200);

  return {
    number: chapter.number,
    title: chapter.title,
    body: chapterContent,
    wordCount,
    summary,
  };
}

function detectCategory(keyword) {
  const kw = keyword.toLowerCase();
  if (kw.includes("9001")) return "ISO 9001";
  if (kw.includes("14001")) return "ISO 14001";
  if (kw.includes("45001")) return "ISO 45001";
  if (kw.includes("13485")) return "ISO 13485";
  if (kw.includes("27001")) return "ISO 27001";
  if (kw.includes("22000") || kw.includes("food safety")) return "ISO 22000";
  if (kw.includes("16949") || kw.includes("iatf")) return "IATF 16949";
  if (kw.includes("as9100") || kw.includes("aerospace")) return "AS9100";
  if (kw.includes("22301") || kw.includes("business continuity")) return "ISO 22301";
  if (kw.includes("17025") || kw.includes("laboratory")) return "ISO 17025";
  if (kw.includes("audit")) return "Auditing";
  if (kw.includes("training")) return "Training";
  return "ISO Certification";
}

module.exports = { writeArticle, writeChapter, detectCategory, loadWritingRules, buildSystemPrompt };
