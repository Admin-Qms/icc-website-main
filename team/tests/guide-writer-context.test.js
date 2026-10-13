const { test } = require('node:test'); const assert = require('node:assert/strict');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path'); const matter = require('gray-matter');
const { createGuideStore } = require('../agents/shared/guideStore'); const { createGuideManager } = require('../agents/content/guideManager');
const { bodyWithWords } = require('./helpers/guideFixture');
test('a later chapter receives actual completed content as untrusted writing context', async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-context-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const store = createGuideStore({ DRAFT_DIR: path.join(root, 'drafts'), CONTENT_DIR: path.join(root, 'content'), IMAGE_DIR: path.join(root, 'images') });
  const service = createGuideManager({ store, reviewer: async () => require('./helpers/guideReviewFixture').passedReview(), editModel: require('./helpers/guideReviewFixture').editModel, model: async (system, prompt) => {
    assert.match(prompt, /The workflow owner checks the input/);
    assert.match(prompt, /Completed chapter content/);
    assert.match(system, /untrusted/i);
    return bodyWithWords(2000, 4, 'secondchapter');
  } });
  let job = store.createJob({ id: 'document-control', topic: 'Document control software', primaryKeyword: 'document control software', audience: 'Canadian operations teams' });
  service.checkpointResearch(job.id, { capabilityIds: [], sources: [{ id: 'iso-documentation', sourceType: 'primary', title: 'ISO guidance', publisher: 'ISO', url: 'https://www.iso.org/files/live/sites/isoorg/files/archive/pdf/en/documented_information.pdf', retrievedAt: new Date().toISOString(), supportedClaims: ['Historical documented information guidance'] }] });
  job = store.loadJob(job.id); const first = job.manifest.chapters[0].slug; const second = job.manifest.chapters[1].slug;
  fs.mkdirSync(path.join(job.directory, 'chapters')); fs.writeFileSync(path.join(job.directory, store.pageFile(job, first)), matter.stringify(require('./helpers/guideReviewFixture').pageBody(job.pagePlans[first]), job.assignments[first])); store.checkpointPage(job.id, first);
  assert.equal((await service.reviewChapter(job.id, first)).pass, true);
  const result = await service.writeGuidePage(job.id, second);
  assert.equal(result.success, true);
});
