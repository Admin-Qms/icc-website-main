# team/ — content pipelines

The daily blog pipeline is active. Software guides have a separate pipeline with a shared researcher, run twice a week (Monday and Thursday) by the cloud routine `icc-guides`; see `GUIDE-ROUTINE.md`. A weekly topic scout (`icc-scout`, Sundays) keeps both topic queues stocked; see `SCOUT-ROUTINE.md`. Other agents (SEO, security, ops, growth, web and legacy mega-articles) remain switched off.

## Setup

```bash
cd team
npm ci
cp .env.example .env      # then add GEMINI_API_KEY (and PEXELS_API_KEY if you have one)
```

## Running it

Two ways to get an article.

**Claude writes it** (how the schedule works):

```bash
node pm.js blog brief                       # picks the topic, writes drafts/<date>-<slug>/brief.md + draft.json
# write body.md in that folder (Claude Code: use the write-blog-article skill)
node pm.js blog publish --fixture drafts/<date>-<slug>/draft.json
```

**A model writes it** (needs `LLM_PROVIDER` and its key in `.env`):

```bash
node pm.js blog publish --dry-run   # full run, every check, writes nothing; preview lands in reports/preview/
node pm.js blog publish             # writes the article and its images into the site
```

Either way: `node pm.js blog calendar` shows what is published and what is next; `npm test` runs the pipeline tests with no keys or network.

The scheduled run is `scripts/scheduled-run.sh prepare` / `publish`, driven by the prompt in `ROUTINE.md`.

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
| `data/writing-rules.md` | The rules every article follows, whoever writes it |
| `data/image-style.json` | The house style every generated image uses |
| `.env` | Keys, `LLM_PROVIDER` (`gemini` or `claude`), `IMAGE_PROVIDERS` (`openai,gemini`; add `codex` on a Mac with Codex logged in) |

The published posts are the pipeline's memory: there is no separate "published" list to keep in step.

## Where things live

| Path | Role |
|---|---|
| `pm.js` | CLI. Active daily `blog` pipeline and local `guide` commands |
| `agents/content/contentManager.js` | The pipeline (`publishDaily`) |
| `agents/content/contentQA.js` | The quality gate (`validateLocal`) |
| `agents/content/rewritePatcher.js` | Targeted fixes for failed checks |
| `agents/shared/contentStore.js` | Slugs, word counts, image processing, reading and writing posts |
| `agents/shared/siteRoutes.js` | The site's real URLs, for link validation |
| `agents/shared/claude.js` | The one place models are called; switches between Gemini and Claude |
| `scripts/check-links.js` | After `npm run build`, checks links and images on the built blog pages |
| `tests/` | `npm test` |

## Software guides

From the repository root, `node team/pm.js guide topics list` shows the approved guide subject backlog. `guide brief --next` selects an eligible subject through the existing `keywordResearcher`; `guide topics suggest` includes primary-source search queries. The writer retrieves evidence and checkpoints a research fixture before chapter generation. This retains separate blog and software queues while sharing the research agent.

Guides consist of `content/guides/<slug>/guide.json`, `introduction.md` and nine files in `chapters/`. Images live in `public/images/guides/<slug>/`. The pipeline uses frozen metadata/evidence, persistent draft checkpoints, mandatory audits and a final whole-guide gate. Use `GUIDE-WRITER.md` and `GUIDE-ROUTINE.md` for the commands, source renewal and interrupted-run recovery.

The static site exposes `/guides/`, `/guides/<slug>/` and `/guides/<slug>/<chapter>/`. Before the first accepted guide, the library has an honest empty state. After `npm run build`, run `node team/scripts/check-guide-links.js` and `node team/scripts/check-guide-metadata.js`.

`scripts/scheduled-guide-run.sh` has two halves. `prepare`, `save-state`, `review` and `publish` are what the cloud routine runs: they keep unfinished drafts on the `guide-state` branch and, under the guide standing approval in the root `CLAUDE.md`, push a gate-passing guide to `main`. `research`, `generate` and `publish-local` are for local, interactive use and never touch git. The first document-control guide passed all publishing gates and is published as an introduction plus nine linked web chapters, with ten unique hero images.
