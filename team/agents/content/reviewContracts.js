// Wire contracts for the remaining Cloud reviewers. Semantic verdict, cache and
// queue-admission rules stay with their owning pipeline; this never grants a pass.
const object = properties => ({ type: 'object', additionalProperties: false, properties, required: Object.keys(properties) });
const string = { type: 'string' };
const CLAIM_RULES = ['NAMED ENTITIES', 'QUOTES', 'STATISTICS', 'EXAMPLES', 'TRACK RECORD', 'STANDARD ACCURACY'];
const claimsScreenSchema = object({ findings: { type: 'array', items: object({ rule: { type: 'string', enum: CLAIM_RULES }, text: string, reason: string }) } });
const claimsAdjudicationSchema = object({ decisions: { type: 'array', items: object({ index: { type: 'integer' }, verdict: { type: 'string', enum: ['violation', 'clear', 'uncertain'] }, reason: string }) } });
const topicReviewSchema = keys => object({
  rules: object(Object.fromEntries(keys.map(key => [key, { type: 'string', enum: ['pass', 'fail'] }]))),
  findings: { type: 'array', items: string },
});
const exactKeys = (value, keys) => value && typeof value === 'object' && !Array.isArray(value)
  && Object.keys(value).length === keys.length && Object.keys(value).every(key => keys.includes(key));

module.exports = { CLAIM_RULES, claimsScreenSchema, claimsAdjudicationSchema, topicReviewSchema, exactKeys };
