const { validSlug } = require('../../../lib/guide-contract');
const SECTIONS = [
  ['mapping-workflows', 'Mapping the current workflow', ['Define the operational problem', 'Identify records and handoffs', 'Assign owners and decisions', 'Set acceptance criteria']],
  ['evaluating-software', 'Evaluating software capabilities', ['Build a workflow-based shortlist', 'Test the decision points', 'Examine evidence and permissions', 'Compare cost and support']],
  ['designing-records', 'Designing records and responsibilities', ['Define the record structure', 'Set ownership and access', 'Create usable forms and templates', 'Check the design against real tasks']],
  ['approval-decisions', 'Configuring reviews and approvals', ['Define approval authority', 'Handle changes and rejected work', 'Separate review from release', 'Validate evidence of decisions']],
  ['daily-workflows', 'Running everyday software workflows', ['Start the task with controlled inputs', 'Capture records as work happens', 'Handle handoffs and notifications', 'Verify the output before closure']],
  ['exceptions-evidence', 'Handling exceptions and audit evidence', ['Recognize an exception', 'Contain risk and assign action', 'Preserve evidence and traceability', 'Confirm the action was effective']],
  ['migration-planning', 'Planning migration and configuration', ['Inventory and classify existing records', 'Clean data and map relationships', 'Pilot the import and verify results', 'Plan cutover and recovery']],
  ['training-rollout', 'Training teams and rolling out the system', ['Set role-based learning tasks', 'Pilot with representative users', 'Manage staged deployment', 'Evaluate adoption and workload']],
  ['ongoing-operation', 'Maintaining the system and choosing next steps', ['Review the workflow and evidence', 'Evaluate improvements without invented ROI', 'Frequently asked questions', 'Prepare a software demonstration']]
];
const SCENES = ['a fabrication inspector tracing a paper work instruction at a cutting station', 'a machining supervisor comparing inspection records beside a CNC machine', 'a production operator completing a controlled checklist at an assembly station', 'two quality inspectors reviewing a weld inspection record beside a fabrication cell', 'a line operator scanning an approved instruction beside a guarded press', 'a quality technician isolating a rejected component at a marked inspection bench', 'a receiving inspector sorting traceability records beside incoming material racks', 'a trainer showing an operator the approved setup instruction on a shop floor', 'a quality lead reviewing completed evidence beside a final inspection station'];
function descriptionFor(keyword, focus) {
  let description = `Explore ${keyword} for Canadian quality and operations teams: ${focus.toLowerCase()}, practical workflow examples and implementation decisions.`;
  if (description.length > 160) description = description.slice(0, 156).replace(/\s+\S*$/, '').replace(/\s+(?:and|with|for|the|a|an|or|to|of)$/i, '') + '.';
  if (description.length < 120) description = description.replace(/\.$/, '') + ' Use it to evaluate your next steps.';
  return description;
}
function createGuideOutline(topic, research = { sources: [] }) {
  const keyword = topic.primaryKeyword || topic.topic.toLowerCase();
  const operational = require('../../data/guide-topic-profiles.json')[topic.id];
  if (!operational) throw new Error('This topic needs a researched custom outline before writing');
  const sections = [...SECTIONS.slice(0, 2), ...operational, ...SECTIONS.slice(6)];
  const evidenceFor = title => {
    const terms = title.toLowerCase().split(/\W+/).filter(t => t.length > 3);
    return [...research.sources].sort((a, b) => terms.filter(t => b.supportedClaims.join(' ').toLowerCase().includes(t)).length - terms.filter(t => a.supportedClaims.join(' ').toLowerCase().includes(t)).length).slice(0, 2).map(s => s.id);
  };
  return { title: `${topic.topic} for Canadian quality and operations teams`,
    description: descriptionFor(keyword, 'planning, evaluation and rollout'), primaryKeyword: keyword,
    introductionWords: 1500, estimatedWords: 19500,
    introductionImageBrief: `A manufacturing quality technician confirming a controlled work instruction at a production cell; authentic industrial setting, no text or logos`,
    glossary: [{ term: 'Workflow owner', definition: 'The role responsible for decisions and records in the defined workflow.' }],
    example: { label: 'Illustrative example', description: `An unnamed Canadian manufacturer evaluates ${topic.topic.toLowerCase()} for one production workflow; all situations and records are hypothetical, not customer results.` },
    chapters: sections.map(([slug, title, subsectionTitles], i) => ({ slug, title: `${title}: ${topic.topic}`, description: descriptionFor(keyword, title), targetWords: 2000,
      chapterKeyword: `${keyword} ${title.toLowerCase()}`,
      boundaries: sections.filter((_, other) => other !== i).map(([, otherTitle]) => `Leave ${otherTitle.toLowerCase()} to its assigned chapter.`),
      subsections: subsectionTitles.map(section => ({ title: section, sourceIds: evidenceFor(section), keyPoints: [`Explain ${section.toLowerCase()} as a software evaluation or implementation decision; do not imply an unverified ICC feature.`, `Connect the decision to ${topic.problem || 'the operational problem'}; distinguish sourced facts from hypothetical workflow advice.`],
        workflow: { role: 'Assigned workflow owner', input: `The records needed for ${section.toLowerCase()}`, decision: `Define acceptance and exception decisions for ${section.toLowerCase()}`, record: 'Evidence of the decision and its owner', exception: 'Missing evidence, rejected work or unavailable access' },
        evaluationCriteria: [`Ask a demonstration to show ${section.toLowerCase()} using representative records and exceptions.`],
        example: `Illustrative example: an unnamed manufacturer tests ${section.toLowerCase()}; no actual customer outcomes are claimed.` })),
      imageBrief: `${SCENES[i]}; authentic manufacturing environment, no readable text or logos`,
      scope: `Cover ${title.toLowerCase()} for ${keyword}. Give actionable software evaluation or implementation advice. Explain only verified ICC capabilities; label hypothetical examples. Do not repeat another chapter's scope.` })),
    faqQuestions: [
      `What problem should ${keyword} solve first?`, 'Which records should be migrated?', 'How should responsibilities and permissions be assigned?',
      'How should approval decisions be tested?', 'How should a team handle obsolete records?', 'What evidence should be available during an audit?',
      'How should training and rollout be evaluated?', 'Does software guarantee ISO certification?', 'What should be prepared for a software demonstration?'
    ] };
}
function validateGuideOutline(outline, research) {
  const issues = [];
  if (!outline || !Array.isArray(outline.chapters)) return { pass: false, failures: ['An ordered chapter array is required'] };
  if (outline.chapters?.length !== 9) issues.push('Nine chapters required');
  if (new Set((outline.chapters || []).map(c => c.slug)).size !== outline.chapters?.length) issues.push('Duplicate chapter slugs');
  for (const c of outline.chapters || []) {
    if (!c || !validSlug(c.slug) || typeof c.title !== 'string' || !Array.isArray(c.subsections) || c.subsections.length < 3 || c.subsections.length > 5 || !Number.isFinite(c.targetWords) || c.targetWords < 2000 || c.targetWords > 2200 || typeof c.description !== 'string' || c.description.length < 120 || c.description.length > 160) { issues.push(`Invalid chapter brief: ${c?.slug}`); continue; }
    if (research) for (const s of c.subsections) {
      if (!s || typeof s !== 'object' || typeof s.title !== 'string' || !s.title.trim() || !Array.isArray(s.keyPoints) || !s.keyPoints.length || !s.keyPoints.every(p => typeof p === 'string' && p.trim()) || !['role', 'input', 'decision', 'record', 'exception'].every(k => typeof s.workflow?.[k] === 'string' && s.workflow[k].trim()) || !Array.isArray(s.evaluationCriteria) || !s.evaluationCriteria.length || !Array.isArray(s.sourceIds) || !s.sourceIds.length || s.sourceIds.some(id => !research.sources.some(source => source.id === id))) issues.push(`Incomplete or unsupported subsection brief: ${c.slug}`);
    }
    if (research && (!Array.isArray(c.boundaries) || !c.boundaries.length || typeof c.chapterKeyword !== 'string' || !c.chapterKeyword.trim())) issues.push(`Chapter boundaries/keyword missing: ${c.slug}`);
  }
  const total = (outline.introductionWords || 0) + outline.chapters.reduce((sum, c) => sum + (c?.targetWords || 0), 0);
  if (!Number.isFinite(outline.introductionWords) || outline.introductionWords < 1500 || !Number.isFinite(total) || total < 18000 || total > 20000) issues.push('Inclusive word allocation is invalid');
  if (!Array.isArray(outline.faqQuestions) || outline.faqQuestions.length < 8 || outline.faqQuestions.length > 10) issues.push('Eight to ten FAQ questions required');
  if (research && (outline.example?.label !== 'Illustrative example' || typeof outline.example?.description !== 'string' || !outline.example.description.trim() || !Array.isArray(outline.glossary))) issues.push('A shared glossary and clearly labeled hypothetical example are required');
  return { pass: issues.length === 0, failures: issues };
}
module.exports = { descriptionFor, createGuideOutline, validateGuideOutline };
