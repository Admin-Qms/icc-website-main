// Synthetic content for pipeline/route tests only. Never publish this fixture to the site.
const fs = require('node:fs'); const path = require('node:path'); const matter = require('gray-matter'); const crypto = require('node:crypto');
const sharp = require('sharp');
const { pageBody, passedReview, editModel } = require('./guideReviewFixture');
const { hashGuideInputs } = require('../../../lib/guide-contract.cjs');
const SOURCE = 'https://www.iso.org/files/live/sites/isoorg/files/archive/pdf/en/documented_information.pdf';
async function preparedGuideFixture(store, service) {
  const topic = { id: 'document-control', topic: 'Document control software', primaryKeyword: 'document control software', audience: 'Canadian quality and operations teams', secondaryKeywords: [] };
  let job = store.createJob(topic);
  const pack = { jobId: job.id, capabilityIds: [], sources: [{ id: 'iso-documentation', title: 'Guidance on documented information', publisher: 'ISO', sourceType: 'primary', url: SOURCE, retrievedAt: new Date().toISOString(), supportedClaims: ['Historical documented information guidance'] }] };
  service.checkpointResearch(job.id, pack); job = store.loadJob(job.id);
  fs.mkdirSync(path.join(job.directory, 'images'), { recursive: true });
  const reviewService = require('../../agents/content/guideManager').createGuideManager({ store, reviewer: async () => passedReview(), editModel });
  const order = [...job.manifest.chapters.map(c => c.slug), job.manifest.slug];
  for (const [index, slug] of order.entries()) {
    const assignment = job.assignments[slug];
    let body = pageBody(job.pagePlans[slug], slug === job.manifest.slug ? 1500 : 2000, `fixture${index}`);
    if (index === 8) {
      const faq = '\n\n' + Array.from({ length: 9 }, (_, i) => `### Evaluation question ${i + 1}?\n\nCheck the assigned workflow owner, input records, acceptance decision, exceptions and supporting evidence. Test a representative task before authorizing the next operational step.`).join('\n\n') + '\n\n[Request a software demonstration](/contact/) to discuss the workflow.';
      body = pageBody(job.pagePlans[slug], 2100 - require('../../../lib/guide-contract.cjs').countGuideWords(faq), `fixture${index}`) + faq;
    }
    const buffer = await sharp({ create: { width: 1200, height: 675, channels: 3, background: { r: index * 20, g: 64, b: 100 } } }).webp().toBuffer();
    const image = { src: `/images/guides/${job.manifest.slug}/${assignment.slug}.webp`, alt: 'Synthetic industrial image fixture', width: 1200, height: 675, source: 'test-fixture', sourceId: `fixture-${index}`, sha256: crypto.createHash('sha256').update(buffer).digest('hex'), licenseUrl: 'https://example.org/test-fixture-license' };
    fs.writeFileSync(path.join(job.directory, 'images', `${assignment.slug}.webp`), buffer);
    const filename = path.join(job.directory, store.pageFile(job, assignment.slug)); fs.mkdirSync(path.dirname(filename), { recursive: true });
    fs.writeFileSync(filename, matter.stringify(body, { ...assignment, image }));
    store.checkpointPage(job.id, assignment.slug);
    const review = await reviewService.reviewChapter(job.id, assignment.slug);
    if (!review.pass) throw new Error(JSON.stringify(review.deterministic.failures));
  }
  const { bundle } = service.readCurrentBundle(job.id);
  store.updateJob(job.id, { audit: { inputHash: hashGuideInputs(bundle), reviewer: 'Synthetic test audit boundary', reviewedAt: new Date().toISOString(), claims: 'passed', consistency: 'passed', repetition: 'passed', unresolvedFindings: [] } });
  return { job: store.loadJob(job.id), pack };
}
module.exports = { preparedGuideFixture };
