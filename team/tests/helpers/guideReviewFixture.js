const fs = require('node:fs'); const path = require('node:path'); const os = require('node:os'); const matter = require('gray-matter');
const { countGuideWords } = require('../../../lib/guide-contract.cjs');
const URL = 'https://www.iso.org/files/live/sites/isoorg/files/archive/pdf/en/documented_information.pdf';
function pageBody(plan, words = 2000, seed = 'fixture') {
  let body = plan.subsections.map((s, i) => `## ${typeof s === 'string' ? s : s.title}\n\nThe workflow owner checks the input, records the decision and verifies its evidence. [Historical ISO context](${URL}) supports the stated documentation context.\n\n${Array.from({length: 70}, (_, n) => `${seed}${i}word${n}`).join(' ')}`).join('\n\n');
  body += '\n\n[Contact](/contact/) for the workflow discussion.';
  const padding = words - countGuideWords(body); if (padding < 0) throw new Error('Fixture budget exhausted');
  return body + ' ' + Array.from({ length: padding }, (_, n) => `${seed}extra${n}`).join(' ');
}
const passedReview = () => ({ claims: 'passed', scope: 'passed', readability: 'passed', links: 'passed', repetition: 'passed', faq: 'passed', findings: [], summary: 'The workflow owner checks inputs and preserves decision evidence.', glossary: [], roles: [], recordNames: [], decisions: ['Check input before authorizing the record.'] });
const editModel = async (_system, message) => message.split('ARTICLE BODY:\n').at(-1);
function setupReview(t, options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-review-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const store = require('../../agents/shared/guideStore').createGuideStore({ DRAFT_DIR: path.join(root, 'drafts'), CONTENT_DIR: path.join(root, 'content'), IMAGE_DIR: path.join(root, 'images') });
  const service = require('../../agents/content/guideManager').createGuideManager({ store, reviewer: async () => passedReview(), editModel, ...options });
  let job = store.createJob({ id: 'document-control', topic: 'Document control software', primaryKeyword: 'document control software', audience: 'Canadian quality teams', problem: 'Maintaining current instructions' });
  service.checkpointResearch(job.id, { sources: [{ id: 'iso-documentation', title: 'ISO documented information guidance', publisher: 'ISO', sourceType: 'primary', url: URL, retrievedAt: new Date().toISOString(), supportedClaims: ['Preserve documented information and revision evidence'] }], capabilityIds: [] });
  job = store.loadJob(job.id);
  function writePage(slug, words = 2000) { const plan = job.pagePlans[slug]; const filename = path.join(job.directory, store.pageFile(job, slug)); fs.mkdirSync(path.dirname(filename), { recursive: true }); fs.writeFileSync(filename, matter.stringify(pageBody(plan, words, slug), job.assignments[slug])); store.checkpointPage(job.id, slug); return filename; }
  return { root, job, store, service, writePage };
}
module.exports = { setupReview, pageBody, passedReview, editModel, URL };
