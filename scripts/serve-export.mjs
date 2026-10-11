// Serves the static export at /, mirroring the custom domain.
// Usage: npm run build && npm start  →  http://localhost:4173/
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve('portfolio');
const BASE = '';
const PORT = Number(process.env.PORT ?? 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
};

async function resolveFile(urlPath) {
  const rel = normalize(decodeURIComponent(urlPath.slice(BASE.length))).replace(/^([/\\])+/, '');
  const file = join(ROOT, rel);
  if (!file.startsWith(ROOT)) return null;
  for (const candidate of [file, join(file, 'index.html')]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      /* try next */
    }
  }
  return null;
}

createServer(async (req, res) => {
  const path = (req.url ?? '/').split('?')[0];
  const file = path.startsWith(`${BASE}/`) ? await resolveFile(path) : null;
  if (!file) {
    const notFound = join(ROOT, '404.html');
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    res.end(await readFile(notFound).catch(() => 'Not found'));
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream' });
  res.end(await readFile(file));
}).listen(PORT, () => {
  console.log(`Serving ./portfolio at http://localhost:${PORT}${BASE}/`);
});
