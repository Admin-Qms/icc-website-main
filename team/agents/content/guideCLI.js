const path = require('node:path');
const fs = require('node:fs');
const manager = require('./guideManager');
const store = require('../shared/guideStore');
const researcher = require('./keywordResearcher');
const config = require('../shared/guideConfig');
function jobId(options) {
  if (options.job) return store.loadJob(options.job).id;
  if (!options.fixture) throw new Error('Provide --job or a managed --fixture guide.json');
  const filename = path.resolve(options.fixture);
  if (path.basename(filename) !== 'guide.json') throw new Error('Fixture must be guide.json');
  const root = fs.realpathSync(config.DRAFT_DIR); const directory = fs.realpathSync(path.dirname(filename));
  if (path.dirname(directory) !== root) throw new Error('Fixture must belong to a managed guide job');
  return store.loadJob(path.basename(directory)).id;
}
function run(action) {
  return async options => {
    try {
      const result = await action(options);
      console.log(JSON.stringify(result, null, 2));
      if (result?.pass === false || result?.success === false || result?.claims === 'failed' || result?.consistency === 'failed' || result?.repetition === 'failed') process.exitCode = 1;
    } catch(error) {
      console.error(`GUIDE_FAILED: ${String(error.message).replace(/((?:key|token|api_key)=)[^&\s]+/gi, '$1[redacted]')}`); process.exitCode = 1;
    }
  };
}
function registerGuideCommands(program) {
  const guide = program.command('guide').description('Software guides: shared research, chapter drafts, strict QA and local publication');
  const topics = guide.command('topics').description('Guide topic backlog');
  topics.command('list').action(run(() => ({ topics: researcher.loadGuideQueue().map(q => ({ ...q, published: store.published().some(g => g.manifest.topicId === q.id), reserved: store.reservedTopicIds().has(q.id) })) })));
  topics.command('suggest').action(run(() => ({ candidates: researcher.suggestGuideTopics().map(q => ({ ...q, queries: researcher.guideResearchQueries(q) })) })));
  guide.command('brief').option('--topic-id <id>').option('--topic <subject>').option('--next', 'select the next approved eligible topic').option('--scheduled', 'respect Monday/Thursday weekly slots').action(run(options => {
    const result = manager.prepareGuide(options);
    if (result.success) console.log(`GUIDE_BRIEF ${result.job.directory}`);
    else if (result.skipped) console.log('NOTHING_TO_GENERATE');
    return result;
  }));
  guide.command('research').requiredOption('--fixture <research.json>').option('--refresh', 'refresh evidence without changing frozen identities or chapter prose').action(run(options => {
    const pack = JSON.parse(fs.readFileSync(path.resolve(options.fixture), 'utf8'));
    if (!pack.jobId) throw new Error('Research fixture must identify its managed jobId');
    return store.withJobLock(pack.jobId, () => manager.checkpointResearch(pack.jobId, pack, { refresh: Boolean(options.refresh) }));
  }));
  guide.command('outline').requiredOption('--fixture <research.json>').description('Use the existing outline architect to refine a researched guide before freezing briefs').action(run(async options => {
    const pack = JSON.parse(fs.readFileSync(path.resolve(options.fixture), 'utf8'));
    const job = store.loadJob(pack.jobId);
    if (Object.keys(job.pages).length) throw new Error('Refine the outline before writing chapters');
    const { prepareResearchSnapshot, allowedSourceUrls } = require('./guideResearch');
    const evidence = prepareResearchSnapshot(job.topic, pack, JSON.parse(fs.readFileSync(config.CAPABILITY_PATH, 'utf8')), allowedSourceUrls());
    const outline = await require('./outlineArchitect').designGuideOutline(job.topic, evidence);
    const filename = path.join(job.directory, 'research-with-outline.json'); store.atomic(filename, { ...pack, outline });
    return { fixture: filename, next: 'Run guide research with this fixture to freeze the researched outline' };
  }));
  guide.command('checkpoint').requiredOption('--job <id>').requiredOption('--page <slug>').action(run(options => manager.checkpointGuidePage(options.job, options.page)));
  guide.command('budget').requiredOption('--job <id>').requiredOption('--page <slug>').action(run(options => {
    const budget = require('./guideEditorial').pageWordBudget(store.resumeJob(options.job), options.page);
    return { ...budget, pass: budget.possible };
  }));
  guide.command('resume').requiredOption('--job <id>').action(run(options => manager.resumeGuide(options.job)));
  guide.command('write').requiredOption('--job <id>').requiredOption('--page <slug>').description('Optional API writer followed by required chapter review').action(run(options => store.withJobLock(options.job, async () => {
    const written = await manager.writeGuidePage(options.job, options.page);
    const review = await manager.reviewChapter(options.job, options.page);
    return { ...written, success: review.pass, review };
  })));
  guide.command('review-chapter').requiredOption('--job <id>').requiredOption('--page <slug>').action(run(options => store.withJobLock(options.job, () => manager.reviewChapter(options.job, options.page))));
  guide.command('revise').requiredOption('--job <id>').requiredOption('--page <slug>').description('At most two targeted subsection corrections, with mandatory review').action(run(options => store.withJobLock(options.job, () => manager.reviseGuidePage(options.job, options.page))));
  guide.command('audit').option('--job <id>').option('--fixture <guide.json>').action(run(options => manager.reviewGuide(jobId(options))));
  guide.command('validate').option('--job <id>').option('--fixture <guide.json>').action(run(options => manager.validateJob(jobId(options))));
  guide.command('preview').option('--job <id>').option('--fixture <guide.json>').option('--port <port>', 'development preview port', '3502').action(run(async options => {
    const id = jobId(options); const { bundle } = manager.readCurrentBundle(id);
    const { pathToFileURL } = require('node:url');
    const { startGuidePreview } = await import(pathToFileURL(path.join(config.SITE_ROOT, 'scripts/preview-guide.mjs')).href);
    const { url } = await startGuidePreview({ jobId: id, port: Number(options.port), draftRoot: config.DRAFT_DIR });
    console.log(`GUIDE_PREVIEW ${url}`);
    return { previewUrl: url, draft: true, pageCount: bundle.chapters.length + 1, noindex: true };
  }));
  guide.command('publish').option('--job <id>').option('--fixture <guide.json>').option('--dry-run').action(run(options => manager.publishGuide({ jobId: jobId(options), dryRun: options.dryRun })));
}
module.exports = { registerGuideCommands };
