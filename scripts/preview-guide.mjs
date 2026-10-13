import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import next from 'next';
import productionConfig from '../next.config.mjs';
const require = createRequire(import.meta.url);
const { readGuidePreview, previewImageFile } = require('../lib/guide-preview.js');

export async function startGuidePreview({ jobId, port = 3502, draftRoot = process.env.GUIDE_DRAFT_DIR || path.join(process.cwd(), 'team/drafts/guides') }) {
  if (process.env.NODE_ENV === 'production') throw new Error('Guide previews cannot run in production');
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Provide a valid guide preview port');
  const preview = readGuidePreview({ jobId, draftRoot, mode: 'development' });
  process.env.NODE_ENV = 'development'; process.env.GUIDE_PREVIEW_JOB = jobId; process.env.GUIDE_DRAFT_DIR = draftRoot;
  const { output, ...configuration } = productionConfig;
  const app = next({ dev: true, dir: process.cwd(), hostname: '127.0.0.1', port, conf: { ...configuration, distDir: `.next-preview-${jobId}` } });
  await app.prepare(); const handle = app.getRequestHandler();
  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow'); res.setHeader('Cache-Control', 'no-store');
    const pathname = new URL(req.url || '/', 'http://127.0.0.1').pathname;
    if (pathname.startsWith('/images/guides/')) {
      try {
        const file = previewImageFile(preview, pathname);
        if (!file) { res.writeHead(404); res.end('Preview image not available'); return; }
        res.setHeader('Content-Type', 'image/webp'); res.end(fs.readFileSync(file));
      } catch { res.writeHead(409); res.end('Preview image provenance changed'); }
      return;
    }
    await handle(req, res);
  });
  try { await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); }); }
  catch(error) { await app.close(); throw error; }
  return { server, url: `http://127.0.0.1:${port}/guides/${preview.bundle.manifest.slug}/`, close: async () => { await new Promise(resolve => server.close(resolve)); await app.close(); } };
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const value = flag => { const index = process.argv.indexOf(flag); return index >= 0 ? process.argv[index + 1] : undefined; };
  startGuidePreview({ jobId: value('--job'), port: Number(value('--port') || 3502) }).then(({ url }) => console.log(`Draft preview: ${url}`)).catch(error => { console.error(error.message); process.exitCode = 1; });
}
