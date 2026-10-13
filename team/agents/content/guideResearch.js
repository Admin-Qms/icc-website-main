const fs = require('node:fs');
const { hashValue } = require('../../../lib/guide-contract');
const config = require('../shared/guideConfig');

function allowedSourceUrls(bank = JSON.parse(fs.readFileSync(config.LINK_BANK_PATH, 'utf8'))) {
  return new Set(Object.values(bank.industries || {}).flat().map(source => source.url));
}
function capabilityEntries(register) { return Array.isArray(register) ? register : register.capabilities || []; }
function validateResearchPack(pack, register, allowedUrls, now = new Date()) {
  const checks = [];
  const add = (id, pass, message) => checks.push({ id, pass: Boolean(pass), message });
  const sources = Array.isArray(pack?.sources) ? pack.sources : [];
  add('primary-sources', sources.length > 0, 'At least one retrieved primary source is required');
  add('unique-source-ids', new Set(sources.map(s => s.id)).size === sources.length, 'Source IDs must be unique');
  for (const source of sources) {
    add('source-primary', source.sourceType === 'primary', `${source.id}: source must be primary`);
    add('source-approved', allowedUrls.has(source.url), `${source.id}: URL must appear in the approved link bank`);
    add('source-evidence', ['id', 'title', 'publisher'].every(k => typeof source[k] === 'string' && source[k].trim()) && Array.isArray(source.supportedClaims) && source.supportedClaims.length > 0 && source.supportedClaims.every(c => typeof c === 'string' && c.trim()), `${source.id}: attribution and supported claims are required`);
    const retrieved = Date.parse(source.retrievedAt);
    add('source-date', Number.isFinite(retrieved) && retrieved <= now.getTime() && now.getTime() - retrieved <= 90 * 86400000, `${source.id}: retrieval must be real, not future, and no older than 90 days`);
    try { add('source-https', new URL(source.url).protocol === 'https:', 'Evidence must use HTTPS'); } catch { add('source-https', false, 'Invalid evidence URL'); }
  }
  const entries = capabilityEntries(register);
  for (const id of pack?.capabilityIds || []) {
    const capability = entries.find(c => c.id === id);
    add('capability-unverified', capability?.status === 'verified', `${id}: capability must be verified`);
    if (capability?.status === 'verified') {
      add('capability-evidence', typeof capability.allowedClaim === 'string' && capability.allowedClaim.trim() && Array.isArray(capability.limitations) && Array.isArray(capability.evidence) && capability.evidence.length > 0 && capability.evidence.every(ref => sources.some(s => s.id === ref || s.url === ref)) && capability.verifiedBy && Number.isFinite(Date.parse(capability.verifiedAt)) && Date.parse(capability.verifiedAt) <= now.getTime(), `${id}: accepted claim, limitations and verified evidence required`);
    }
  }
  return { pass: checks.every(c => c.pass), checks, failures: checks.filter(c => !c.pass) };
}
function prepareResearchSnapshot(topic, pack, register, allowedUrls) {
  const report = validateResearchPack(pack, register, allowedUrls);
  if (!report.pass) throw new Error(report.failures.map(f => f.message).join('; '));
  const selected = capabilityEntries(register).filter(c => (pack.capabilityIds || []).includes(c.id));
  const snapshot = { topicId: topic.id, sources: pack.sources, capabilityIds: pack.capabilityIds || [], capabilities: selected };
  return { ...snapshot, researchSnapshotHash: hashValue(snapshot), capabilitySnapshotHash: hashValue(selected) };
}
module.exports = { allowedSourceUrls, capabilityEntries, validateResearchPack, prepareResearchSnapshot };
