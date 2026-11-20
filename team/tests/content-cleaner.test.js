require('./helpers/env');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { clean } = require('../agents/content/contentCleaner');

test('guide cleaner receives the ordered link inventory separately from the untouched body', async () => {
  const body = '## Assigned workflow\n\n[Reference first][evidence].\n\n[Safety](/solutions/safety/) and [Safety again](/solutions/safety/).\n\n[ISO source](https://www.iso.org/standard/62085.html).\n\nAn illustrative example keeps its [reference][evidence].\n\n[evidence]: https://www.iso.org/documented-information.pdf\n\n  ';
  let payload;
  const result = await clean({ title: 'Assigned guide title', body }, {
    guide: true,
    call: async (_system, message) => { payload = message; return body; },
  });
  const marker = 'ARTICLE BODY:\n';
  const boundary = payload.indexOf(marker);
  assert.ok(boundary >= 0, 'the complete body retains its established framing');
  assert.equal(payload.slice(boundary + marker.length), body);
  const inventory = payload.slice(0, boundary).match(/LINK INVENTORY \(ordered JSON\):\n([^\n]+)/);
  assert.ok(inventory, 'the model receives a separate link inventory before the body');
  assert.deepEqual(JSON.parse(inventory[1]), [
    'https://www.iso.org/documented-information.pdf',
    '/solutions/safety/',
    '/solutions/safety/',
    'https://www.iso.org/standard/62085.html',
    'https://www.iso.org/documented-information.pdf',
  ]);
  assert.equal(result.body, body);
});
