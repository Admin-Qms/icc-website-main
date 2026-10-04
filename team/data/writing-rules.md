# Writing rules for blog articles

These rules apply to every article, whoever writes it: the API writer (`articleWriter.js`) builds its prompt from this file, and a Claude session writing from a brief reads it directly. The quality gate (`contentQA.validateLocal`) enforces the parts that can be checked by machine; the rest is on the writer.

## Reader and voice

- The reader runs quality, operations or the whole business at a Canadian manufacturing or service company: a quality manager at a 60-person stamping plant, the owner of a machine shop, a plant manager preparing for a registrar.
- Write like a senior ISO consultant explaining how a standard plays out on a real shop floor: direct, specific, calm. Not a summary of the standard, and not a sales page.
- **Third person or direct address only.** Refer to the company as "ISO Certification Consultant"; address the reader as "you". Never "we", "our", "us", "I", "my", including in FAQ questions and the closing call to action.
- **US spelling throughout:** organization, analyze, center, defense, program, license (noun and verb), color, labor, behavior, catalog, gray, meter, liter, judgment, enrollment, fulfill, traveled, labeled, modeled. Proper names keep their own spelling (Canadian Centre for Occupational Health and Safety, Ministry of Labour).
- Plain English. Short paragraphs, two to four sentences. One idea per paragraph.

## Length and structure

- 1,800 to 2,100 words. Never under 1,700; anything under 1,500 is rejected.
- Headings: `##` for sections, `###` inside them. No `#` heading; the page shows the title itself.
- Open with a Key Takeaways callout (3 to 5 bullets), then the article. End with one closing paragraph that leads naturally to the call to action.
- Follow the structure for the article type in the brief:
  - **deep-guide:** Key Takeaways → 5-6 sections of increasing depth → Frequently Asked Questions (5) → close
  - **comparison:** Key Takeaways → both options → side-by-side table → the differences explained → "which fits you" decision framework → FAQ (5) → close
  - **checklist:** Key Takeaways → short intro → 7-12 numbered items, each a `##` with 2-3 sentences of explanation → quick-reference summary → close
  - **industry-spotlight:** Key Takeaways → the industry's quality pressures → relevant standards → how it plays out in Ontario plants (illustrative examples only) → getting started → close
  - **myth-buster:** Key Takeaways → short intro → 5-7 myths, each a `##` ("Myth: …", then the reality, then what to do instead) → close
  - **trend-opinion:** Key Takeaways → current state → what is changing → 3-4 trends, each a `##` → impact on manufacturers → how to prepare → close
  - **how-to:** Key Takeaways → short intro → steps 1-7, each a `##` with what to do, what you need, the common mistake → close
- Use at least two lists; every list item carries one or two full sentences, never a bare phrase.
- Alternate paragraphs, lists, callouts and tables. Never three plain paragraphs in a row.

## Keywords are topics, not phrases to insert

- The primary keyword tells you what the article is about. Cover it in the opening paragraph in natural, correctly capitalized wording ("an ISO 9001 internal audit checklist"), and use its words naturally through the article.
- Secondary keywords are related topics to cover. **Never paste a keyword in as a phrase**, never lowercase a standard name ("iso 9001"), never bold a keyword. If a phrase does not read as normal English in the sentence, leave it out.
- The title and meta description are fixed by the brief. Do not change them.

## Nothing invented may be presented as real

An article that breaks any of these is rejected.

- **No named companies, clients or people**, real or invented. Describe businesses generically: "a 60-person stamping plant in Windsor", "a food co-packer near Guelph".
- **No quotations, testimonials or reported speech** attributed to anyone.
- **No statistics, percentages, survey results, dollar figures or client results stated as fact.** The only numbers allowed: clause numbers, requirements written in the standard itself, and ranges framed as typical estimates ("certification typically takes four to six months for a shop this size").
- **No claims about what most companies do.** Not "most Ontario plants audit annually"; say "many plants", "a common approach is".
- **Worked scenarios are hypothetical and say so.** A scenario is its own paragraph beginning with exactly `**Illustrative example:**`, describes an unnamed business, and never claims it happened.
- **Nothing about ISO Certification Consultant's track record**: no pass rates, audit counts, client counts or years in business.
- **Standards and clauses:** use the editions given in CURRENT STANDARD EDITIONS, name the edition when citing a clause ("clause 9.2 of ISO 9001:2015"), and describe a requirement in words rather than guess a clause number. Never describe what changed between editions unless the facts table says it.

## Links

- **Internal links:** 3 to 5, from the list in the brief, woven into sentences where the page helps the reader at that point. Always include one to `/contact`, in the closing paragraph. Anchor text describes the page ("the six-stage certification process"), never "click here". No "Related links" section.
- **Outside links:** 2 to 4, only from the list in the brief, copied exactly. Each one goes where the source supports the sentence it sits in; at most one per paragraph. **Never write a sentence to hold a link.** Using fewer is fine; a link that does not fit is left out.
- Links read naturally if the link were removed. Never append a link to the end of a paragraph as an afterthought.

## Images

- Place 2 or 3 image markers, each on its own line, after the first paragraph of different `##` sections: `[IMAGE: a quality inspector checking a weld seam with an ultrasonic tester on a steel fabrication line]`.
- Each marker describes one specific manufacturing or industrial scene: the task, the equipment, the setting. Never an office, boardroom, desk or meeting. Never text or logos in the scene.

## Formatting

- Bold 5 to 8 phrases that state a requirement or a conclusion the reader will want to find again. Never bold a keyword or a standard name on its own.
- Callouts, 2 or 3 per article, in exactly these forms and no others: `> **Important:** …` (a compliance point), `> **Did You Know?** …` (a verifiable fact about what the standard requires, never a statistic), `> **Key Consideration:** …` (practical advice). Never "Pro Tip".
- Tables for side-by-side comparisons; keep cells short.

## Words and phrases that are banned

delve into · it is worth noting · in conclusion · in today's landscape · navigating the complexities · crucial · comprehensive · landscape · navigate · leverage · game-changer · cutting-edge · at the end of the day · it goes without saying · needless to say · from scratch · from the ground up · documentation burden · documentation maturity · competitive advantage · competitive edge · "small/mid-size manufacturers" (vary it: shops under 50 employees, regional fabricators, family-owned operations)

## Not the same article twice

The brief may include a DIVERSITY BRIEF listing openings, closings, cost figures and process descriptions that recent articles used. Avoid all of them. Rotate openings between a direct question, a contrarian statement, a specific scenario, a pain-point hook and a requirement most shops misread. Describe the certification process from a fresh angle (timeline, resources, who does what, common mistakes) rather than listing all six stages again.

## Self-check before handing the article over

- [ ] 1,800-2,100 words; no `#` heading; starts with Key Takeaways; ends with a closing paragraph linking to `/contact`
- [ ] No first person anywhere, including FAQ questions
- [ ] US spelling
- [ ] Primary keyword covered naturally in the opening; no pasted or bolded keywords; standard names capitalized
- [ ] No named companies or people, quotes, statistics as fact, "most companies" claims, or track-record claims; any scenario begins with `**Illustrative example:**`
- [ ] Editions as given; clauses cited with their edition
- [ ] 3-5 internal links including `/contact`; 2-4 outside links from the list only, one per paragraph, each earning its place
- [ ] 2-3 `[IMAGE: …]` markers, manufacturing scenes only
- [ ] 5-8 bold phrases, 2-3 callouts of the allowed kinds, at least two lists with full-sentence items
- [ ] Zero banned words or phrases
