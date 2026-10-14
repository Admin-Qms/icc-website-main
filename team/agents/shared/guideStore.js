const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { validSlug, parseGuidePage, hashValue, hashGuideInputs } = require('../../../lib/guide-contract.cjs');
const { readInside, readGuideFiles, listGuideFiles } = require('../../../lib/guide-files.cjs');
const config = require('./guideConfig');

function createGuideStore(paths = config) {
  const { DRAFT_DIR, CONTENT_DIR, IMAGE_DIR } = paths;
  const atomic = (filename, data) => {
    fs.mkdirSync(path.dirname(filename), { recursive: true });
    const temporary = `${filename}.${crypto.randomUUID()}.tmp`;
    fs.writeFileSync(temporary, typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
    fs.renameSync(temporary, filename);
  };
  const jobPath = id => {
    if (!validSlug(id)) throw new Error('Invalid guide job ID/path');
    const directory = path.join(DRAFT_DIR, id);
    if (fs.existsSync(directory) && (!fs.realpathSync(directory).startsWith(fs.realpathSync(DRAFT_DIR) + path.sep) || fs.lstatSync(directory).isSymbolicLink())) throw new Error('Guide job path escapes draft root');
    return directory;
  };
  const loadJob = id => {
    const directory = jobPath(id); const state = JSON.parse(readInside(directory, 'state.json'));
    if (state.id !== id) throw new Error('Job identity mismatch');
    return { ...state, directory };
  };
  const updateJob = (id, changes) => {
    const job = loadJob(id); const { directory, ...state } = job;
    if (changes.id && changes.id !== id) throw new Error('Cannot change job identity');
    atomic(path.join(directory, 'state.json'), { ...state, ...changes, updatedAt: new Date().toISOString() });
    return loadJob(id);
  };
  const listJobs = () => !fs.existsSync(DRAFT_DIR) ? [] : fs.readdirSync(DRAFT_DIR, { withFileTypes: true }).filter(e => e.isDirectory() && e.name !== 'reservations' && validSlug(e.name)).map(e => loadJob(e.name));
  const published = () => listGuideFiles(CONTENT_DIR);
  const reservedTopicIds = () => new Set(listJobs().map(j => j.topic.id));
  function createJob(topic, productionSlotId) {
    if (!validSlug(topic.id)) throw new Error('Invalid topic ID');
    if (published().some(g => g.manifest.topicId === topic.id)) throw new Error('Guide topic already published');
    fs.mkdirSync(path.join(DRAFT_DIR, 'reservations'), { recursive: true });
    const id = `${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)}-${topic.id.slice(0, 40)}-${crypto.randomBytes(3).toString('hex')}`;
    let slotReservation;
    if (productionSlotId) {
      if (!/^\d{4}-W\d{2}-slot-[12]$/.test(productionSlotId)) throw new Error('Invalid guide production slot');
      slotReservation = path.join(DRAFT_DIR, 'reservations', `${productionSlotId}.json`);
      try { fs.writeFileSync(slotReservation, JSON.stringify({ jobId: id, productionSlotId }), { flag: 'wx' }); }
      catch(e) { if (e.code === 'EEXIST') throw new Error(`Guide production slot already reserved: ${productionSlotId}`); throw e; }
    }
    const reservation = path.join(DRAFT_DIR, 'reservations', `${topic.id}.json`);
    try { fs.writeFileSync(reservation, JSON.stringify({ topicId: topic.id, jobId: id, host: require('node:os').hostname(), createdAt: new Date().toISOString() }), { flag: 'wx' }); }
    catch(e) { if (slotReservation) fs.unlinkSync(slotReservation); if (e.code === 'EEXIST') throw new Error(`Guide topic reserved: ${topic.id}`); throw e; }
    const directory = jobPath(id); fs.mkdirSync(directory);
    atomic(path.join(directory, 'state.json'), { id, topic, productionSlotId, stage: 'reserved', pages: {}, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    return loadJob(id);
  }
  function pageFile(job, slug) {
    if (slug === job.manifest?.slug) return 'introduction.md';
    const chapter = job.manifest?.chapters.find(c => c.slug === slug);
    if (!chapter || !validSlug(slug) || chapter.file !== `chapters/${slug}.md`) throw new Error('Unknown or unsafe guide chapter/page');
    return chapter.file;
  }
  function checkpointPage(id, slug) {
    const job = loadJob(id); const page = parseGuidePage(readInside(job.directory, pageFile(job, slug)));
    const assigned = job.assignments?.[slug];
    if (!assigned || ['title', 'description', 'primaryKeyword', 'imageBrief'].some(k => page[k] !== assigned[k]) || page.slug !== slug) throw new Error('Page metadata differs from its frozen brief');
    const pageHash = hashValue({ title: page.title, description: page.description, body: page.body, sourceIds: page.sourceIds, capabilityIds: page.capabilityIds });
    const changed = job.pages?.[slug]?.hash !== pageHash;
    return updateJob(id, { stage: 'writing', pages: { ...job.pages, [slug]: { hash: pageHash, wordCount: page.wordCount, readTime: page.readTime, status: 'written', checkpointedAt: new Date().toISOString() } }, ...(changed ? { audit: null, generationCompletedAt: null, finalReport: null } : {}) });
  }
  function resumeJob(id) {
    let job = loadJob(id); const invalidated = [];
    for (const slug of Object.keys(job.pages || {})) {
      try {
        const page = parseGuidePage(readInside(job.directory, pageFile(job, slug)));
        const hash = hashValue({ title: page.title, description: page.description, body: page.body, sourceIds: page.sourceIds, capabilityIds: page.capabilityIds });
        if (hash !== job.pages[slug].hash) { job.pages[slug] = { ...job.pages[slug], status: 'changed' }; invalidated.push(slug); }
      } catch { invalidated.push(slug); }
    }
    if (job.manifest && fs.existsSync(path.join(job.directory, 'guide.json'))) {
      const saved = JSON.parse(readInside(job.directory, 'guide.json'));
      if (hashValue(saved) !== hashValue(job.manifest)) invalidated.push('manifest');
    }
    for (const field of ['research', 'outline']) {
      if (!job[`${field}Hash`]) continue;
      try { if (hashValue(JSON.parse(readInside(job.directory, `${field}.json`))) !== job[`${field}Hash`]) invalidated.push(field); }
      catch { invalidated.push(field); }
    }
    if (invalidated.length) {
      invalidated.push('whole-guide-review');
      job = updateJob(id, { stage: 'writing', pages: job.pages, audit: null, generationCompletedAt: null, finalReport: null });
    }
    let publicationReady = false;
    if (job.stage === 'ready-for-publication' && job.audit && job.finalReport?.pass) {
      try { publicationReady = job.audit.inputHash === hashGuideInputs(readGuideFiles(job.directory, { validate: false })); } catch { publicationReady = false; }
    }
    return { ...job, invalidated, publicationReady, completionValid: publicationReady && Boolean(job.generationCompletedAt) };
  }
  function withJobLock(id, callback) {
    const job = loadJob(id); const lock = path.join(job.directory, 'operation.lock');
    let descriptor;
    try { descriptor = fs.openSync(lock, 'wx'); } catch(e) { if (e.code === 'EEXIST') throw new Error('Guide job operation is already running; reconcile its lock after an interruption'); throw e; }
    const release = () => { fs.closeSync(descriptor); fs.unlinkSync(lock); };
    try {
      const result = callback(job);
      if (result && typeof result.then === 'function') return result.finally(release);
      release(); return result;
    } catch(e) { release(); throw e; }
  }
  function withPublicationLock(callback) {
    fs.mkdirSync(DRAFT_DIR, { recursive: true });
    const lock = path.join(DRAFT_DIR, 'publication.lock');
    let descriptor;
    try { descriptor = fs.openSync(lock, 'wx'); } catch(e) { if (e.code === 'EEXIST') throw new Error('Another guide publication is running; reconcile its lock after an interruption'); throw e; }
    const release = () => { fs.closeSync(descriptor); fs.unlinkSync(lock); };
    try { const result = callback(); if (result && typeof result.then === 'function') return result.finally(release); release(); return result; }
    catch(e) { release(); throw e; }
  }
  return { paths, atomic, jobPath, loadJob, updateJob, listJobs, published, reservedTopicIds, createJob, pageFile, checkpointPage, resumeJob, withJobLock, withPublicationLock };
}

module.exports = { createGuideStore, ...createGuideStore() };
