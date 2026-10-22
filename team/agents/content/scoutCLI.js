const fs = require('node:fs');
const path = require('node:path');
const scout = require('./topicScout');
function run(action) {
  return async options => {
    try { const result = await action(options); console.log(JSON.stringify(result, null, 2)); }
    catch(error) { console.error(`SCOUT_FAILED: ${String(error.message)}`); process.exitCode = 1; }
  };
}
function registerScoutCommands(program) {
  const cmd = program.command('scout').description('Topic scout: keep the blog keyword queue and the guide topic queue stocked');
  cmd.command('status').description('What each queue needs, the trusted domains and the ICC module slugs').action(run(() => {
    const status = scout.scoutStatus();
    console.log(status.nothingNeeded ? 'NOTHING_TO_SCOUT' : 'SCOUT_NEEDED');
    return status;
  }));
  cmd.command('apply').requiredOption('--fixture <proposals.json>').option('--dry-run', 'validate without writing').description('Validate proposals, write the queues and the link bank').action(run(async options => {
    const proposals = JSON.parse(fs.readFileSync(path.resolve(options.fixture), 'utf8'));
    const report = await scout.applyProposals(proposals, { dryRun: Boolean(options.dryRun) });
    console.log(report.changed ? 'SCOUT_APPLIED' : 'SCOUT_NOTHING_ACCEPTED');
    console.log(`SCOUT_SUMMARY ${scout.summarizeReport(report)}`);
    return report;
  }));
}
module.exports = { registerScoutCommands };
