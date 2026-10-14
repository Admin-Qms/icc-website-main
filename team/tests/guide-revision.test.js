const { test } = require('node:test'); const assert = require('node:assert/strict');
let revise; try { revise = require('../agents/content/guideRevision'); } catch(e) { if (e.code !== 'MODULE_NOT_FOUND') throw e; }
test('targeted revisions preserve every untouched subsection and reject changed citations', () => {
  assert.ok(revise);
  const body = '## Inputs\n\nKeep 12 records. [Evidence](https://example.org/source)\n\n## Decisions\n\nThe owner verifies the input before approval.';
  const changed = revise.applySectionPatches(body, [{ heading: 'Decisions', body: 'The owner checks the input and records the approval decision.' }]);
  assert.ok(changed.startsWith('## Inputs\n\nKeep 12 records. [Evidence](https://example.org/source)\n\n'));
  assert.throws(() => revise.applySectionPatches(body, [{ heading: 'Inputs', body: 'Keep 13 records. [Evidence](https://example.org/changed)' }]), /citations|numbers|preserv/i);
  assert.throws(() => revise.applySectionPatches(body, [{ heading: 'New heading', body: 'Invented scope' }]), /unknown/i);
});
