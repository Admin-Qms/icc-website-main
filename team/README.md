# team/ — the blog pipeline

Only one thing in this folder is in use: the daily blog pipeline. Every other agent (SEO, security, ops, growth, web, mega-articles) is kept for reference and switched off.

## Setup

```bash
cd team
npm ci
cp .env.example .env      # then add GEMINI_API_KEY (and PEXELS_API_KEY if you have one)
```

## Running it

```bash
node pm.js blog publish --dry-run   # full run, every check, writes nothing; preview lands in reports/preview/
node pm.js blog publish             # writes the article and its images into the site
node pm.js blog calendar            # what's published, what's next in the queue
npm test                            # pipeline tests; no keys or network needed
```

Then, from the repo root, `npm run dev` and open `http://localhost:3000/blog`. If the dev server was already running, a brand-new article can return an error on its first load; refresh once.

Exit code 0 means published (or nothing to do today); 1 means the run failed and nothing was written.

| Flag | Effect |
|---|---|
| `--dry-run` | Runs everything, including image sourcing, but writes nothing to `content/` or `public/` |
| `--force` | Publishes even if an article dated today already exists. It never overwrites an existing post |
| `--fixture <draft.json>` | Publishes a ready-written draft through the same checks and image steps, with no writer call. See `drafts/` for the format |

## What a run does

1. One article per day unless `--force`.
2. Picks the next topic from `memory/keyword-queue.json`.
3. Loads context: real site pages to link to, approved outside links, current standard editions, recent posts to avoid repeating.
4. Writes, cleans, grammar-checks and originality-checks the article.
5. Runs the text quality gate, with up to two targeted fix passes. A failure stops here.
6. Sources a hero image and up to two inline images (Pexels, then Gemini), cropped to 1200x675.
7. Runs the full gate again on exactly what will be written.
8. Writes `content/blog/<slug>.md` and `public/images/blog/<slug>/`.

Nothing is written to the site before step 8, so a failed run leaves the repo untouched.

## Files you may want to edit

| File | What it is |
|---|---|
| `memory/keyword-queue.json` | Topic list. A topic counts as used once a published post has it as `primaryKeyword` |
| `data/external-link-bank.json` | The only outside links an article may use |
| `data/standards-facts.json` | Current edition of each standard. The writing models predate the 2026 editions, so this file is what keeps articles current |
| `.env` | Keys and `LLM_PROVIDER` (`gemini` or `claude`) |

The published posts are the pipeline's memory: there is no separate "published" list to keep in step.

## Where things live

| Path | Role |
|---|---|
| `pm.js` | CLI. Only the `blog` commands are in use |
| `agents/content/contentManager.js` | The pipeline (`publishDaily`) |
| `agents/content/contentQA.js` | The quality gate (`validateLocal`) |
| `agents/content/rewritePatcher.js` | Targeted fixes for failed checks |
| `agents/shared/contentStore.js` | Slugs, word counts, image processing, reading and writing posts |
| `agents/shared/siteRoutes.js` | The site's real URLs, for link validation |
| `agents/shared/claude.js` | The one place models are called; switches between Gemini and Claude |
| `scripts/check-links.js` | After `npm run build`, checks links and images on the built blog pages |
| `tests/` | `npm test` |
