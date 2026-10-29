const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// team/pm.js loads lib/guide-contract.cjs from the repo root, which resolves
// gray-matter from the root node_modules. A cloud clone starts empty, so every
// scheduled script's `prepare` must install the root dependencies as well as team/.
const SCRIPTS = ['scheduled-run.sh', 'scheduled-guide-run.sh', 'scheduled-scout-run.sh'];

for (const name of SCRIPTS) {
  test(`${name} prepare installs both team and root dependencies`, () => {
    const src = fs.readFileSync(path.join(__dirname, '../scripts', name), 'utf8');
    const prepare = src.slice(src.indexOf('prepare)'), src.indexOf(';;', src.indexOf('prepare)')));
    assert.match(prepare, /npm ci --prefix team/, `${name}: team dependencies not installed in prepare`);
    assert.match(prepare, /^\s*npm ci (?!--prefix)/m, `${name}: root dependencies not installed in prepare`);
  });

  test(`${name} prepare prints which providers have keys`, () => {
    const src = fs.readFileSync(path.join(__dirname, '../scripts', name), 'utf8');
    const prepare = src.slice(src.indexOf('prepare)'), src.indexOf(';;', src.indexOf('prepare)')));
    assert.match(prepare, /node team\/scripts\/provider-status\.js/, `${name}: provider status not printed in prepare`);
  });
}
