function localDay(date, timezone = 'America/Toronto') {
  return new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}
function weeklyGuideSlots(date = new Date(), timezone = 'America/Toronto') {
  const day = new Date(localDay(date, timezone) + 'T12:00:00Z');
  day.setUTCDate(day.getUTCDate() + 4 - (day.getUTCDay() || 7));
  const year = day.getUTCFullYear();
  const week = Math.ceil((((day - new Date(Date.UTC(year, 0, 1))) / 86400000) + 1) / 7);
  const prefix = `${year}-W${String(week).padStart(2, '0')}`;
  return [`${prefix}-slot-1`, `${prefix}-slot-2`];
}
function nextGuideSlot(slots, published = [], jobs = []) {
  const complete = new Set(published.map(g => (g.manifest || g).productionSlotId));
  jobs.filter(j => j.generationCompletedAt && j.completionValid).forEach(j => complete.add(j.productionSlotId));
  const interrupted = jobs.find(j => slots.includes(j.productionSlotId) && !complete.has(j.productionSlotId));
  if (interrupted) return { slotId: interrupted.productionSlotId, jobId: interrupted.id };
  const slotId = slots.find(slot => !complete.has(slot));
  return slotId ? { slotId, jobId: null } : null;
}
function dueGuideSlot(date = new Date()) {
  const weekday = new Intl.DateTimeFormat('en', { timeZone: 'America/Toronto', weekday: 'short' }).format(date);
  const slots = weeklyGuideSlots(date);
  return weekday === 'Mon' ? slots[0] : weekday === 'Thu' ? slots[1] : null;
}
module.exports = { localDay, weeklyGuideSlots, nextGuideSlot, dueGuideSlot };
