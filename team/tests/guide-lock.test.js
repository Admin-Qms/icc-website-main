const { test } = require('node:test'); const assert = require('node:assert/strict');
const fs = require('node:fs'); const os = require('node:os'); const path = require('node:path');
const { createGuideStore } = require('../agents/shared/guideStore');

function setup(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'icc-guide-lock-')); t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const store = createGuideStore({ DRAFT_DIR: path.join(root, 'drafts'), CONTENT_DIR: path.join(root, 'content'), IMAGE_DIR: path.join(root, 'images') });
  const job = store.createJob({ id: 'document-control', topic: 'Document control software' });
  return { store, job, lock: path.join(job.directory, 'operation.lock') };
}

test('a job lock left behind by a process that no longer exists is reclaimed', t => {
  const { store, job, lock } = setup(t);
  fs.writeFileSync(lock, '2147483647');
  let ran = false;
  store.withJobLock(job.id, () => { ran = true; });
  assert.equal(ran, true); assert.equal(fs.existsSync(lock), false);
});

test('a job lock held by a live process still refuses a second operation', t => {
  const { store, job, lock } = setup(t);
  fs.writeFileSync(lock, String(process.pid));
  assert.throws(() => store.withJobLock(job.id, () => {}), /already running/);
  assert.equal(fs.existsSync(lock), true);
});

test('a lock without an owner is never reclaimed', t => {
  const { store, job, lock } = setup(t);
  fs.writeFileSync(lock, '');
  assert.throws(() => store.withJobLock(job.id, () => {}), /already running/);
});

test('the lock records its owning process while an operation runs', t => {
  const { store, job, lock } = setup(t);
  store.withJobLock(job.id, () => { assert.equal(fs.readFileSync(lock, 'utf8').trim(), String(process.pid)); });
  assert.equal(fs.existsSync(lock), false);
});
