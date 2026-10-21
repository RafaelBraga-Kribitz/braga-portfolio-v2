#!/usr/bin/env node
// ============================================================
// scripts/gates/server.mjs — a dependency-free static file server for a
// built directory (dist/, a scratchpad build, the gate fixtures).
//
//   import { serve } from './server.mjs';
//   const srv = await serve('/path/to/dist');   // OS-assigned port
//   srv.url      // 'http://127.0.0.1:41234'
//   srv.misses   // Set of request paths that answered 404
//   await srv.close();
//
// Behaviour, kept close to a static host (GitHub Pages):
//   /a/b/        → /a/b/index.html
//   /a/b         → 301 to /a/b/ when b is a directory with an index.html
//   miss         → 404.html at the root with status 404 (plain text if absent)
//   query/hash   → ignored; paths are percent-decoded; nothing outside the
//                  served directory is reachable (symlinks inside it are
//                  followed, which the fixtures use for /fonts/ and tokens.css)
//   GET and HEAD only; Cache-Control: no-store.
//
// CLI (for a quick look in a browser):
//   node scripts/gates/server.mjs --dir dist [--port 4321]
// ============================================================
import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { join, resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.rss': 'application/rss+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.tex': 'text/plain; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.wasm': 'application/wasm',
};

const typeOf = (file) => TYPES[extname(file).toLowerCase()] || 'application/octet-stream';
const statOrNull = (p) => { try { return statSync(p); } catch { return null; } };

/**
 * Serve `dir` on 127.0.0.1 at an OS-assigned port (or `port`).
 * @param {string} dir
 * @param {{ port?: number, host?: string }} [opts]
 * @returns {Promise<{ url: string, port: number, root: string, misses: Set<string>, close: () => Promise<void> }>}
 */
export function serve(dir, { port = 0, host = '127.0.0.1' } = {}) {
  const root = resolve(dir);
  const rootStat = statOrNull(root);
  if (!rootStat || !rootStat.isDirectory()) return Promise.reject(new Error(`not a directory: ${root}`));
  const misses = new Set();

  const send = (req, res, status, file, headers = {}) => {
    const st = statSync(file);
    res.writeHead(status, { 'Content-Type': typeOf(file), 'Content-Length': st.size, 'Cache-Control': 'no-store', ...headers });
    if (req.method === 'HEAD') return res.end();
    createReadStream(file).on('error', () => res.destroy()).pipe(res);
  };
  const notFound = (req, res, pathname) => {
    misses.add(pathname);
    const page = join(root, '404.html');
    if (statOrNull(page)?.isFile()) return send(req, res, 404, page);
    const body = `404 Not Found: ${pathname}\n`;
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': Buffer.byteLength(body), 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : body);
  };

  const server = createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end();
    }
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url || '/', 'http://local').pathname);
    } catch {
      res.writeHead(400);
      return res.end();
    }
    const target = resolve(join(root, pathname));
    if (target !== root && !target.startsWith(root + sep)) return notFound(req, res, pathname);
    const st = statOrNull(target);
    if (st?.isDirectory()) {
      const index = join(target, 'index.html');
      if (!statOrNull(index)?.isFile()) return notFound(req, res, pathname);
      if (!pathname.endsWith('/')) {
        const q = (req.url || '').includes('?') ? (req.url || '').slice((req.url || '').indexOf('?')) : '';
        res.writeHead(301, { Location: encodeURI(pathname + '/') + q, 'Cache-Control': 'no-store' });
        return res.end();
      }
      return send(req, res, 200, index);
    }
    if (st?.isFile()) return send(req, res, 200, target);
    return notFound(req, res, pathname);
  });

  return new Promise((resolveP, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      const addr = server.address();
      const actual = typeof addr === 'object' && addr ? addr.port : port;
      resolveP({
        url: `http://${host}:${actual}`,
        port: actual,
        root,
        misses,
        close: () => new Promise((r) => { server.closeAllConnections?.(); server.close(() => r()); }),
      });
    });
  });
}

// ---- CLI ----
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const val = (name, d) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
  const dir = val('--dir', fileURLToPath(new URL('../../dist', import.meta.url)));
  serve(dir, { port: Number(val('--port', 0)) })
    .then((s) => { console.log(`serving ${s.root} at ${s.url}/ (Ctrl+C to stop)`); })
    .catch((e) => { console.error(e.message); process.exit(1); });
}
