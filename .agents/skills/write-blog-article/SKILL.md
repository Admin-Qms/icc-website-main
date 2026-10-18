---
name: write-blog-article
description: Write a blog article body from a brief produced by `node team/pm.js blog brief`, then publish it through the pipeline's checks. Use for the scheduled blog run or whenever asked to write an article for the site.
---

# Write a blog article from a brief

You are the writer. The pipeline has already chosen the topic, the title, the meta description, the links you may use and the current standard editions. Your job is the body text, nothing else.

## Steps

1. **Get a brief.** If none was given, run `node team/pm.js blog brief` from the repo root. It prints `BRIEF <folder>`; that folder holds `brief.md` and `draft.json`. `NOTHING_TO_PUBLISH` means an article already exists for today: stop and say so.
2. **Read `brief.md` in full.** It contains the fixed title and meta description, the topic, the article type and its structure, the section outline, the FAQ questions, the only links you may use, the current standard editions, patterns recent articles used, and the complete writing rules (`team/data/writing-rules.md`).
3. **Write `body.md` in that folder.** Markdown only. Start with the Key Takeaways callout; no title and no `#` heading; `##` and `###` only; aim for about 1,900 words (1,800-2,100); 2-3 `[IMAGE: …]` markers on their own lines; end with a closing paragraph (no heading, after the FAQ if there is one) that links to `/contact`. Follow every rule in the brief, including US spelling, third person, no invented companies, people, quotes or statistics, links only from the lists, and no pasted keywords.
4. **Run the self-check** at the end of the writing rules against your draft and fix what it catches.
5. **Publish:** `node team/pm.js blog publish --fixture <folder>/draft.json`. The gate runs every check and sources the images. If it fails, the output names the failing checks: fix `body.md` accordingly and run the command again, at most twice. Then stop and report the remaining issues.

## Never

- Change `draft.json`, the title or the meta description.
- Edit any code, prompt, check, rule file, link bank or standards file to make a check pass. If a check looks wrong, say so in your report; do not work around it.
- Invent a company, person, quote, statistic or outcome. A scenario must begin with `**Illustrative example:**` and describe an unnamed business.
- Use a link that is not in the brief.
- Write in the first person, or in British spelling.

## What good looks like

A quality manager at a 60-person Ontario plant reads it and learns exactly what the standard asks of them and how shops actually do it, in plain words, with the clause named and the edition right, and would not notice it was written for search.
