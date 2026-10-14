const fs = require('node:fs');
const path = require('node:path');
function exportedGuidePages(root) {
  const pages = [];
  const walk = directory => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile() && entry.name === 'index.html') pages.push({ file, route: '/' + path.relative(root, directory).split(path.sep).join('/') + '/' });
    }
  };
  walk(path.join(root, 'guides')); return pages;
}
const decode = value => value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'");
function pageFile(root, route) {
  let decoded;
  try { decoded = decodeURIComponent(route.split(/[?#]/)[0]); } catch { return null; }
  if (!decoded.startsWith('/') || decoded.split('/').some(part => part === '..' || part === '.') || decoded.includes('\\')) return null;
  const relative = decoded.replace(/^\/+/, '').replace(/\/+$/, '');
  for (const candidate of [relative || 'index.html', path.join(relative, 'index.html'), relative + '.html']) {
    const filename = path.resolve(root, candidate);
    if (filename.startsWith(path.resolve(root) + path.sep) && fs.existsSync(filename) && fs.statSync(filename).isFile()) return filename;
  }
  return null;
}
function checkGuideLinks(root) {
  const failures = []; let checked = 0; const pages = exportedGuidePages(root);
  if (!pages.length) failures.push({ page: '/guides/', message: 'No exported guide library; run the build first' });
  for (const page of pages) {
    const html = fs.readFileSync(page.file, 'utf8');
    const refs = new Set([...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)].map(m => decode(m[1])));
    for (const ref of refs) {
      if (/^(?:https?:|mailto:|tel:|data:)/i.test(ref)) continue;
      checked++;
      const hashIndex = ref.indexOf('#'); const route = ref.startsWith('#') ? page.route : ref;
      const target = pageFile(root, route);
      if (!target) {
        if (!['/privacy', '/terms'].includes(ref.replace(/\/$/, ''))) failures.push({ page: page.route, reference: ref, message: 'Missing or unsafe destination' });
        continue;
      }
      if (hashIndex >= 0) {
        let anchor;
        try { anchor = decodeURIComponent(ref.slice(hashIndex + 1)); } catch { anchor = null; }
        const ids = new Set([...fs.readFileSync(target, 'utf8').matchAll(/\bid=["']([^"']+)["']/g)].map(m => decode(m[1])));
        if (!anchor || !ids.has(anchor)) failures.push({ page: page.route, reference: ref, message: 'Missing anchor target' });
      }
    }
  }
  return { pass: failures.length === 0, pages: pages.length, checked, failures };
}
if (require.main === module) {
  const report = checkGuideLinks(path.resolve(process.argv[2] || path.join(__dirname, '../../out')));
  console.log(JSON.stringify(report, null, 2)); if (!report.pass) process.exitCode = 1;
}
module.exports = { exportedGuidePages, checkGuideLinks, pageFile, decode };
