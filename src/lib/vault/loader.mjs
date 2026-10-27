// src/lib/vault/loader.mjs — Astro's glob loader over the Obsidian vault,
// with the vault's reading put in front of validation (owner, 23 Oct
// 2026). Every note's properties pass through readNote() (meta.mjs: the H1
// → title, the file name → slug, the folder → lang and kind, #status/… →
// status, an excerpt → summary), and a note that is offline (no
// `publish: true`, a draft, or dated in the future) never reaches the
// schema or the store: a private note is read, never validated, never
// built. Rendering, caching and the dev watcher stay Astro's.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readNote, isScheduled } from './meta.mjs';
import { VAULT_DIR } from './index.mjs';

/** Not on the site: no `publish: true`, a draft, or dated after today (scheduled). */
export const offline = (data) => data.publish !== true || data.draft === true || isScheduled(data);

// A note with a ```buildlog fence renders from src/data/activity.json and
// src/lib/activity/render.mjs, not from its text alone: their hash joins
// its digest, so the content cache re-renders it when either changes.
const BUILDLOG_INPUTS = ['../../data/activity.json', '../activity/render.mjs'].map((p) => fileURLToPath(new URL(p, import.meta.url)));
const buildlogSalt = () => createHash('sha1').update(BUILDLOG_INPUTS.map((f) => (existsSync(f) ? readFileSync(f) : '')).join('\0')).digest('hex');

/**
 * @param {typeof import('astro/loaders').glob} glob
 * @param {{ name: string, folders: string[], filePattern: string, generateId: (o: any) => string }} opts
 */
export function vaultLoader(glob, { name, folders, filePattern, generateId }) {
  const pattern = [...folders.map((f) => `${f}/{en,de}/${filePattern}`), '!**/_*/**', '!**/_*.md'];
  const inner = glob({ pattern, base: './vault', generateId });
  return {
    name: `vault-${name}`,
    /** @param {any} ctx */
    load: (ctx) => {
      const entryTypes = new Map([...ctx.entryTypes].map(([ext, type]) => [
        ext,
        ext !== '.md' ? type : {
          ...type,
          getEntryInfo: async (args) => {
            const info = await type.getEntryInfo(args);
            const rel = relative(VAULT_DIR, fileURLToPath(args.fileUrl)).split(sep).join('/');
            return { ...info, data: readNote(rel, args.contents).data };
          },
          // an offline note is never rendered either: a private draft's
          // half-written maths cannot fail the build
          getRenderFunction: type.getRenderFunction && (async (config) => {
            const render = await type.getRenderFunction(config);
            return (args) => (offline(args.data) ? Promise.resolve(undefined) : render(args));
          }),
        },
      ]));
      const store = new Proxy(ctx.store, {
        get(target, key) {
          if (key === 'set') {
            return (entry) => {
              if (offline(entry.data)) { target.delete(entry.id); return false; }
              return target.set(entry);
            };
          }
          const v = Reflect.get(target, key);
          return typeof v === 'function' ? v.bind(target) : v;
        },
      });
      const parseData = (props) => (offline(props.data) ? Promise.resolve(props.data) : ctx.parseData(props));
      const salt = buildlogSalt();
      const generateDigest = (data) => ctx.generateDigest(typeof data === 'string' && data.includes('```buildlog') ? `${data}\0${salt}` : data);
      return inner.load({ ...ctx, entryTypes, store, parseData, generateDigest });
    },
  };
}
