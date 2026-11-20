const images = require('./sessionImages');
function run(action) {
  return async options => {
    try { console.log(JSON.stringify(await action(options), null, 2)); }
    catch (error) { console.error(`IMAGE_FAILED: ${error.message}`); process.exitCode = 1; }
  };
}
function registerBlogImageCommands(blog) {
  blog.command('image-requests').requiredOption('--fixture <draft.json>').action(run(options => images.blogImageRequests(options.fixture)));
  blog.command('import-image').requiredOption('--fixture <draft.json>').requiredOption('--id <request-id>').requiredOption('--file <image>').action(run(options => images.importBlogImage(options.fixture, options.id, options.file)));
  blog.command('check-text').requiredOption('--fixture <draft.json>').action(run(async options => {
    const result = await require('./contentManager').publishDaily({ fixture: options.fixture, dryRun: true, textOnly: true });
    if (!result.success) process.exitCode = 1;
    return result;
  }));
}
function registerGuideImageCommands(guide) {
  guide.command('image-requests').requiredOption('--job <id>').action(run(options => images.guideImageRequests(options.job)));
  guide.command('import-image').requiredOption('--job <id>').requiredOption('--page <slug>').requiredOption('--file <image>').action(run(options => {
    const store = require('../shared/guideStore');
    return store.withJobLock(options.job, () => images.importGuideImage(options.job, options.page, options.file));
  }));
  guide.command('check-text').requiredOption('--job <id>').action(run(async options => {
    const result = await require('./guideManager').validateJob(options.job, { requireImages: false });
    if (!result.pass) process.exitCode = 1;
    return result;
  }));
}
module.exports = { registerBlogImageCommands, registerGuideImageCommands };
