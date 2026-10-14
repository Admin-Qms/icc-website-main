const { test } = require('node:test'); const assert = require('node:assert/strict');
let cadence; try { cadence = require('../agents/shared/guideCadence'); } catch(e) { if(e.code !== 'MODULE_NOT_FOUND') throw e; }
test('Toronto ISO week boundaries select the correct weekly slots', () => {
  assert.ok(cadence);
  assert.deepEqual(cadence.weeklyGuideSlots(new Date('2026-10-12T02:00:00Z')), ['2026-W41-slot-1', '2026-W41-slot-2']);
  assert.deepEqual(cadence.weeklyGuideSlots(new Date('2026-10-12T12:00:00Z')), ['2026-W42-slot-1', '2026-W42-slot-2']);
});
test('released or generated-but-unreleased guides consume both weekly slots', () => {
  assert.ok(cadence); const slots = ['2026-W42-slot-1', '2026-W42-slot-2'];
  assert.equal(cadence.nextGuideSlot(slots, [{ productionSlotId: slots[0] }], [{ productionSlotId: slots[1], generationCompletedAt: '2026-10-15T12:00:00Z', completionValid: true }]), null);
});
test('an interrupted slot is resumed before fresh topic selection', () => {
  assert.ok(cadence); const slots = ['2026-W42-slot-1', '2026-W42-slot-2'];
  assert.deepEqual(cadence.nextGuideSlot(slots, [], [{ id: 'existing-job', productionSlotId: slots[1] }]), { slotId: slots[1], jobId: 'existing-job' });
});
