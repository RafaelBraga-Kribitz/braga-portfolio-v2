// src/integrations/vault-media.mjs — the vault's files on the site at
// /media/<vault path> (owner, 23 Oct 2026). In `npm run dev` any vault file
// is served as it is saved in Obsidian; the build copies only the files
// that published notes use (src/lib/vault/refs.mjs), so a private note's
// attachment never reaches dist/.
import { createReadStream, mkdirSync, copyFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, extname, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { vaultIndex, VAULT_DIR } from '../lib/vault/index.mjs';
import { usedAttachments } from '../lib/vault/refs.mjs';

const TYPES = {
  png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', avif: 'image/avif', svg: 'image/svg+xml',
  mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime', m4v: 'video/mp4',
  mp3: 'audio/mpeg', m4a: 'audio/mp4', wav: 'audio/wav', ogg: 'audio/ogg', flac: 'audio/flac',
  pdf: 'application/pdf', zip: 'application/zip', csv: 'text/csv', txt: 'text/plain',
};

/** @param {{ base?: string }} [opts] */
export default function vaultMedia(opts = {}) {
  const base = (opts.base ?? '/').replace(/\/+$/, '');
  return {
    name: 'vault-media',
    hooks: {
      'astro:server:setup': ({ server }) => {
        server.middlewares.use((req, res, next) => {
          const url = decodeURIComponent((req.url ?? '').split('?')[0]);
          const prefix = `${base}/media/`;
          if (!url.startsWith(prefix)) return next();
          const file = normalize(join(VAULT_DIR, url.slice(prefix.length)));
          if (!file.startsWith(VAULT_DIR) || file.split(sep).some((p) => p.startsWith('.')) || !existsSync(file) || !statSync(file).isFile()) return next();
          res.setHeader('Content-Type', TYPES[extname(file).slice(1).toLowerCase()] ?? 'application/octet-stream');
          createReadStream(file).pipe(res);
        });
      },
      'astro:build:done': ({ dir, logger }) => {
        const out = fileURLToPath(new URL('media/', dir));
        const used = usedAttachments(vaultIndex());
        for (const att of used) {
          const to = join(out, ...att.rel.split('/'));
          mkdirSync(dirname(to), { recursive: true });
          copyFileSync(att.abs, to);
        }
        logger.info(`${used.length} vault file${used.length === 1 ? '' : 's'} copied to media/`);
      },
    },
  };
}
