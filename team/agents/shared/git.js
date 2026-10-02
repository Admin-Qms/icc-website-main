const simpleGit = require("simple-git");
const { SITE_ROOT } = require("./config");

const git = simpleGit(SITE_ROOT);

async function gitStatus() {
  const status = await git.status();
  return {
    modified: status.modified,
    created: status.not_added,
    staged: status.staged,
    isClean: status.isClean(),
  };
}

async function gitAdd(files) {
  await git.add(files);
}

async function gitCommit(message) {
  const result = await git.commit(message);
  return result.commit || null;
}

async function gitDiff(staged = false) {
  return staged ? git.diff(["--cached"]) : git.diff();
}

async function gitPush() {
  await git.push("origin", "main");
}

async function gitRevert() {
  await git.reset(["--hard", "HEAD~1"]);
}

async function gitLog(count = 5) {
  const log = await git.log({ maxCount: count });
  return log.all.map((entry) => ({
    hash: entry.hash.slice(0, 7),
    message: entry.message,
    date: entry.date,
  }));
}

module.exports = { gitStatus, gitAdd, gitCommit, gitDiff, gitPush, gitRevert, gitLog };
