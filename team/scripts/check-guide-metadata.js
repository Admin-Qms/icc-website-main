const fs = require('node:fs');
const path = require('node:path');
const { exportedGuidePages, decode } = require('./check-guide-links');
const { SITE_URL } = require('../agents/shared/config');
function attrs(tag) { return Object.fromEntries([...tag.matchAll(/([\w:-]+)=["']([^"']*)["']/g)].map(m => [m[1].toLowerCase(), decode(m[2])])); }
function checkGuidePageMetadata(html, route) {
  const head = html.split('</head>')[0]; const checks = [];
  const add = (id, pass, message) => checks.push({ id, pass: Boolean(pass), message });
  const canonicals = [...head.matchAll(/<link\b[^>]*>/gi)].map(m => attrs(m[0])).filter(a => a.rel === 'canonical');
  const meta = Object.fromEntries([...head.matchAll(/<meta\b[^>]*>/gi)].map(m => attrs(m[0])).map(a => [a.name || a.property, a.content]));
  add('canonical-count', canonicals.length === 1, 'Exactly one canonical required');
  add('canonical-url', canonicals[0]?.href === `${SITE_URL.replace(/\/$/, '')}${route}`, 'Canonical must match this exact guide page');
  add('description', meta.description?.length >= 120 && meta.description?.length <= 160, 'Description must have 120–160 characters');
  add('title', /<title>[^<]+<\/title>/.test(head), 'Unique page title required');
  add('share-images', /^https:\/\//.test(meta['og:image'] || '') && /^https:\/\//.test(meta['twitter:image'] || ''), 'Explicit absolute Open Graph and Twitter images required');
  add('og-url', meta['og:url'] === `${SITE_URL.replace(/\/$/, '')}${route}`, 'Open Graph URL must match canonical');
  add('single-h1', [...html.matchAll(/<h1\b/gi)].length === 1, 'Page must render one H1');
  const schemas = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)];
  let schemaValid = schemas.length > 0;
  try { for (const match of schemas) { const value = JSON.parse(match[1]); if (!value['@context'] || (!value['@type'] && !value['@graph'])) schemaValid = false; } } catch { schemaValid = false; }
  add('structured-data', schemaValid, 'Structured data must be valid JSON-LD');
  return { pass: checks.every(c => c.pass), checks, failures: checks.filter(c => !c.pass) };
}
function checkGuideMetadata(root) {
  const failures = []; const pages = exportedGuidePages(root); const titles = new Set();
  if (!pages.length) failures.push({ page: '/guides/', message: 'No exported guide library' });
  for (const page of pages) {
    const html = fs.readFileSync(page.file, 'utf8'); const report = checkGuidePageMetadata(html, page.route);
    failures.push(...report.failures.map(f => ({ page: page.route, ...f })));
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    if (titles.has(title)) failures.push({ page: page.route, id: 'unique-title', message: 'Duplicate guide page title' }); titles.add(title);
  }
  return { pass: failures.length === 0, pages: pages.length, failures };
}
if (require.main === module) { const report = checkGuideMetadata(path.resolve(process.argv[2] || path.join(__dirname, '../../out'))); console.log(JSON.stringify(report, null, 2)); if (!report.pass) process.exitCode = 1; }
module.exports = { checkGuidePageMetadata, checkGuideMetadata };
