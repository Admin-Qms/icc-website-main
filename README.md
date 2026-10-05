# ISO Certification Consultants — Website

A fresh Next.js website built on a reusable **organization + knowledge** foundation.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Edit `app/page.tsx` to begin.

## Structure

```
app/                     Next.js App Router (static export)
  blog/                  Blog index and article pages
components/              UI components (Markdown.tsx renders article bodies)
lib/site.ts              All site content: standards, industries, modules
lib/blog.ts              Reads content/blog at build time
content/blog/            Published articles, one Markdown file each
public/images/blog/      Article images, one folder per article
team/                    Content agents — see team/README.md
  pm.js                  CLI; `blog publish` is the one pipeline in use
  memory/keyword-queue.json   Topic list
  data/                  Approved outside links, current standard editions
docs/knowledge-base/     Reference notes; decisions.md has the current decisions
.github/workflows/       Builds the export to the deploy branch (cPanel backup; the live site is Vercel)
```

## Publishing an article

```bash
npm ci --prefix team
cp team/.env.example team/.env     # add GEMINI_API_KEY
node team/pm.js blog publish --dry-run
node team/pm.js blog publish
npm run dev                        # http://localhost:3000/blog
```

## Stack

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS 3.

## Notes

- The site was rebuilt from scratch; `team/` holds the agents from the previous
  project. Only the daily blog pipeline is in use — the rest is switched off.
- Brand: **ISO Certification Consultants Inc.** — domain **isocertificationconsultants.ca** (Canada / USA).
- Placeholders to fill when wiring services: address, GA4 id, Leadfeeder id, Calendly, GitHub account.
