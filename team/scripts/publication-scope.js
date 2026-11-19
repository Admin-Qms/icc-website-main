#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const path = require('node:path');
function git(args) {
  const result = spawnSync('git', args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  if (result.status !== 0) throw new Error('Publication Git check failed');
  return result.stdout;
}
try {
  const [operation, ...allowed] = process.argv.slice(2);
  if (git(['diff', '--cached', '--name-only', '-z']).length) throw new Error('Previously staged paths must be reconciled before publication');
  if (operation === 'check') {
    if (!allowed.length || allowed.some(p => path.isAbsolute(p) || p.split('/').some(part => part === '..' || part === '.') || !p.startsWith('content/') && !p.startsWith('public/images/') && !['team/memory/keyword-queue.json', 'team/memory/guide-topic-queue.json', 'team/data/external-link-bank.json'].includes(p))) throw new Error('Invalid publication allowlist');
    const files = git(['diff', '--name-only', '-z', 'origin/main', 'HEAD']).split('\0').filter(Boolean);
    if (!files.length || files.some(file => !allowed.some(p => file === p || file.startsWith(p.replace(/\/$/, '') + '/')))) throw new Error('Publication commit contains a path outside its exact artifact scope');
  } else if (operation !== 'clean-index') throw new Error('Unknown publication scope check');
  console.log('PUBLICATION_SCOPE_PASSED');
} catch (error) { console.error(`PUBLICATION_SCOPE_FAILED: ${error.message}`); process.exitCode = 1; }
