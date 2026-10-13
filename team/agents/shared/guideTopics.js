const fs = require('node:fs');
const config = require('./guideConfig');
const normalize = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
function loadGuideQueue() { return JSON.parse(fs.readFileSync(config.QUEUE_PATH, 'utf8')).queue; }
function selectGuideTopic({ topicId, topicText, queue = loadGuideQueue(), publishedTopicIds = new Set(), reservedTopicIds = new Set() } = {}) {
  if (!Array.isArray(queue) || new Set(queue.map(q => q.id)).size !== queue.length) throw new Error('Guide queue has invalid or duplicate IDs');
  let candidates = queue;
  if (topicId || topicText) {
    const requested = normalize(topicId || topicText);
    candidates = queue.filter(q => [q.id, q.topic, ...(q.aliases || [])].some(value => normalize(value) === requested));
    if (candidates.length !== 1) throw new Error('Unknown or ambiguous approved guide topic; research and approve it first');
  }
  const eligible = candidates.filter(q => q.approval === 'approved' && !publishedTopicIds.has(q.id) && !reservedTopicIds.has(q.id));
  if ((topicId || topicText) && !eligible.length) throw new Error('Requested guide topic is unapproved, published or reserved');
  return eligible.sort((a, b) => (Number(a.priority) || 999) - (Number(b.priority) || 999) || a.id.localeCompare(b.id))[0] || null;
}
function suggestGuideTopics() {
  return loadGuideQueue().map(q => ({ id: q.id, topic: q.topic, problem: q.problem, moduleSlugs: q.moduleSlugs, approval: q.approval, evidenceRequired: true }));
}
module.exports = { normalize, loadGuideQueue, selectGuideTopic, suggestGuideTopics };
