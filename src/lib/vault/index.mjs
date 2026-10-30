// src/lib/vault/index.mjs — the vault read as a whole: every note with its
// site reading (meta.mjs) and every attachment, keyed the ways Obsidian
// resolves a link (file name, path, title, alias). The Markdown pipeline
// resolves [[links]] and ![[embeds]] against it, Dataview queries run on
// it, related notes are scored over it, and `npm run vault:check` audits
// it. Re-scanned when a file's modification time changes, so `npm run
// dev` follows edits made in Obsidian.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readNote, pathOf, baseName, slugify, isScheduled } from './meta.mjs';

export const VAULT_DIR = fileURLToPath(new URL('../../../vault/', import.meta.url));

/** File types an embed may point at, by extension. */
export const MEDIA = {
  image: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'svg'],
  video: ['mp4', 'webm', 'mov', 'm4v'],
  audio: ['mp3', 'm4a', 'wav', 'ogg', 'flac'],
  file: ['pdf', 'epub', 'zip', 'csv', 'xlsx', 'docx', 'pptx', 'txt'],
};
export const mediaKind = (name) => {
  const ext = extname(String(name)).slice(1).toLowerCase();
  return Object.keys(MEDIA).find((k) => MEDIA[k].includes(ext));
};

const toPosix = (p) => p.split(sep).join('/');

function walk(dir, root, out) {
  let names;
  try { names = readdirSync(dir); } catch { return out; }
  for (const name of names) {
    if (name.startsWith('.')) continue; // .obsidian, .trash, .git
    const abs = join(dir, name);
    let st;
    try { st = statSync(abs); } catch { continue; }
    if (st.isDirectory()) walk(abs, root, out);
    else out.push({ abs, rel: toPosix(relative(root, abs)), mtime: st.mtimeMs, size: st.size });
  }
  return out;
}

let cache = { stamp: '', index: null };

/** The vault index; rebuilt only when a file was added, removed or changed. */
export function vaultIndex(dir = VAULT_DIR) {
  if (!existsSync(dir)) return emptyIndex();
  const files = walk(dir, dir, []);
  const stamp = files.map((f) => `${f.rel}:${f.mtime}:${f.size}`).sort().join('|');
  if (cache.index && cache.stamp === stamp && cache.dir === dir) return cache.index;
  const index = buildIndex(files);
  cache = { stamp, index, dir };
  return index;
}

function emptyIndex() {
  return { notes: [], byKey: new Map(), attachments: new Map(), errors: [] };
}

function buildIndex(files) {
  const notes = [];
  const errors = [];
  const attachments = new Map(); // lower-case file name → { rel, abs, kind }
  for (const f of files) {
    if (/\.md$/i.test(f.rel) && f.rel.split('/')[0] === '_templates') continue; // templates are not notes
    if (/\.md$/i.test(f.rel)) {
      try {
        const note = readNote(f.rel, readFileSync(f.abs, 'utf8'));
        note.abs = f.abs;
        note.url = pathOf(note);
        note.live = Boolean(note.place && note.data.publish && !isScheduled(note.data));
        notes.push(note);
      } catch (e) {
        errors.push({ rel: f.rel, message: e.message });
      }
    } else if (mediaKind(f.rel)) {
      const key = f.rel.split('/').pop().toLowerCase();
      if (!attachments.has(key)) attachments.set(key, { rel: f.rel, abs: f.abs, kind: mediaKind(f.rel), size: f.size });
      attachments.set(f.rel.toLowerCase(), { rel: f.rel, abs: f.abs, kind: mediaKind(f.rel), size: f.size });
    }
  }
  // the keys a [[link]] may use: path, path without .md, file name, title, aliases, slug
  const byKey = new Map();
  const add = (k, n) => {
    const key = String(k).trim().toLowerCase();
    if (!key) return;
    const list = byKey.get(key) ?? [];
    if (!list.includes(n)) list.push(n);
    byKey.set(key, list);
  };
  for (const n of notes) {
    add(n.rel, n); add(n.rel.replace(/\.md$/i, ''), n); add(baseName(n.rel), n);
    add(n.data.title, n); add(n.data.slug, n);
    for (const a of n.aliases) add(a, n);
  }
  return { notes, byKey, attachments, errors };
}

/**
 * The note a [[target]] names, as Obsidian would pick it: the same language
 * first, then a published note, then the shortest path. `from` is the
 * linking note (for its language).
 */
export function resolveNote(index, target, from) {
  const key = String(target).trim().toLowerCase().replace(/\.md$/, '');
  const list = index.byKey.get(key) ?? index.byKey.get(slugify(key)) ?? [];
  if (!list.length) return undefined;
  const lang = from?.place?.lang ?? from?.lang;
  return [...list].sort((a, b) =>
    (b.place?.lang === lang) - (a.place?.lang === lang)
    || b.live - a.live
    || a.rel.split('/').length - b.rel.split('/').length)[0];
}

/** The attachment an embed names (by file name or vault path), or undefined. */
export function resolveAttachment(index, name) {
  const key = decodeURIComponent(String(name).trim()).replace(/^\.?\//, '').toLowerCase();
  return index.attachments.get(key) ?? index.attachments.get(key.split('/').pop());
}

/** The note for a source file, by absolute path. */
export function noteForFile(index, abs) {
  return index.notes.find((n) => n.abs === abs);
}

/** The public URL of an attachment (no base): /media/<vault path>. */
export const mediaPath = (att) => `/media/${att.rel.split('/').map(encodeURIComponent).join('/')}`;
