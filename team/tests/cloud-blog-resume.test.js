const { root } = require('./helpers/env');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
process.env.ICC_CLOUD_ROUTINE = '1';
process.env.BLOG_DRAFT_DIR = path.join(root, 'managed-blog');
const manager = require('../agents/content/contentManager');
const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

test('a same-slot cloud brief resumes saved text and images before spending on a new topic', async () => {
  const folder = path.join(process.env.BLOG_DRAFT_DIR, `${date}-saved`);
  fs.mkdirSync(path.join(folder, 'images'), { recursive: true });
  const draft = { title: 'Saved assignment', primaryKeyword: 'saved assignment', slotDate: date, slug: 'saved-assignment', bodyFile: 'body.md' };
  fs.writeFileSync(path.join(folder, 'draft.json'), JSON.stringify(draft));
  fs.writeFileSync(path.join(folder, 'body.md'), 'Saved reviewed content');
  fs.writeFileSync(path.join(folder, 'images/hero.webp'), Buffer.from('saved bytes'));
  const missed = path.join(process.env.BLOG_DRAFT_DIR, '2000-01-01-missed');
  fs.mkdirSync(missed, { recursive: true });
  fs.writeFileSync(path.join(missed, 'draft.json'), JSON.stringify({ ...draft, slotDate: '2000-01-01' }));
  const completed = path.join(process.env.BLOG_DRAFT_DIR, '1999-01-01-completed');
  fs.mkdirSync(completed, { recursive: true });
  fs.writeFileSync(path.join(completed, 'draft.json'), JSON.stringify({ ...draft, slotDate: '1999-01-01' }));
  fs.mkdirSync(process.env.BLOG_CONTENT_DIR, { recursive: true });
  fs.writeFileSync(path.join(process.env.BLOG_CONTENT_DIR, 'completed.md'), '---\nslug: completed\ntitle: Completed\ndate: 1999-01-01\n---\nCompleted article');
  const result = await manager.prepareBrief();
  assert.deepEqual(result.missedSlots, ['2000-01-01']);
  assert.equal(result.success, true); assert.equal(result.resumed, true);
  assert.equal(result.folder, folder);
  assert.equal(fs.readFileSync(path.join(folder, 'body.md'), 'utf8'), 'Saved reviewed content');
  assert.deepEqual(fs.readFileSync(path.join(folder, 'images/hero.webp')), Buffer.from('saved bytes'));
});

test('cloud publication refuses an expired slot and never invokes an API writer without its saved fixture', async () => {
  const file = path.join(root, 'expired.json');
  fs.writeFileSync(file, JSON.stringify({ title: 'Old assignment', metaDescription: 'Old assignment', primaryKeyword: 'old assignment', slotDate: '2000-01-01', body: 'Expired content' }));
  const expired = await manager.publishDaily({ fixture: file, dryRun: true });
  assert.equal(expired.success, false); assert.match(expired.reason, /slot|expired/i);
  const absent = await manager.publishDaily({ dryRun: true });
  assert.equal(absent.success, false); assert.match(absent.reason, /fixture|session/i);
});
