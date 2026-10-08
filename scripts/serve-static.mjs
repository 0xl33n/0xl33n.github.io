/**
 * Serves the static export (out/) the way GitHub Pages does, including the
 * basePath and gzip compression, so production builds can be checked (and
 * measured) locally and by the e2e tests.
 *
 *   NEXT_PUBLIC_SITE_URL=http://localhost:4173/portfolio npm run build
 *   NEXT_PUBLIC_SITE_URL=http://localhost:4173/portfolio npm run serve
 *
 * Port and basePath are read from NEXT_PUBLIC_SITE_URL (default http://localhost:4173).
 */
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { createGzip } from 'node:zlib';

const OUT_DIR = path.resolve(import.meta.dirname, '../out');
const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4173');
const basePath = siteUrl.pathname.replace(/\/+$/, '');
const port = Number(siteUrl.port) || 4173;

/** GitHub Pages gzips text responses; images and fonts are already compressed. */
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.txt', '.xml', '.svg']);

const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon',
};

async function resolveFile(urlPath) {
  const relative = decodeURIComponent(urlPath).replace(/^\/+/, '');
  const candidate = path.resolve(OUT_DIR, relative);
  if (!candidate.startsWith(OUT_DIR)) return null; // path traversal
  try {
    const info = await stat(candidate);
    if (info.isDirectory()) return resolveFile(path.posix.join(urlPath, 'index.html'));
    return candidate;
  } catch {
    return null;
  }
}

createServer(async (request, response) => {
  const { pathname } = new URL(request.url, 'http://localhost');
  const inBase = pathname === basePath || pathname.startsWith(`${basePath}/`);
  const file = inBase ? await resolveFile(pathname.slice(basePath.length) || '/') : null;

  if (!file) {
    response.writeHead(404, { 'Content-Type': CONTENT_TYPES['.html'] });
    createReadStream(path.join(OUT_DIR, '404.html')).pipe(response);
    return;
  }
  const extension = path.extname(file);
  const headers = { 'Content-Type': CONTENT_TYPES[extension] ?? 'application/octet-stream' };
  if (COMPRESSIBLE.has(extension) && /\bgzip\b/.test(request.headers['accept-encoding'] ?? '')) {
    response.writeHead(200, { ...headers, 'Content-Encoding': 'gzip', Vary: 'Accept-Encoding' });
    createReadStream(file).pipe(createGzip()).pipe(response);
    return;
  }
  response.writeHead(200, headers);
  createReadStream(file).pipe(response);
}).listen(port, () => {
  console.log(`Serving out/ at http://localhost:${port}${basePath}/`);
});
