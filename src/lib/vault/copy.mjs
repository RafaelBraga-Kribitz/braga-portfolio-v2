// src/lib/vault/copy.mjs — the site's own copy, read from the vault (owner,
// 10 Nov 2026). Everything a reader reads on a page that is not a note —
// the home page, the section claims, the contact sentences, the tool
// pages' titles and leads, the 404 page, the name, role and links — is a
// property of a note in website_vault/Site/. Nothing of it is typed in
// src/: change the property in Obsidian, push, and the site says it.
//
//   Site/Identity.md            name, role, place, email, profile links
//   Site/{en,de}/Home.md        the cover and the home sections
//   Site/{en,de}/Work.md        the Work index, the close of a project
//   Site/{en,de}/Writing.md     the Writing index, the close of an essay
//   Site/{en,de}/Notes.md       the notes library
//   Site/{en,de}/Tools.md       the Tools index
//   Site/{en,de}/Confusion matrix.md, AB sample size.md   the two tools
//   Site/{en,de}/Not found.md   the 404 page
//   Site/en/Language chooser.md the page at "/"
//
// COPY (below) is the contract: which note carries which property, and of
// what kind. A missing or mistyped property stops the build with the file
// and the property named; `npm run vault:check` reports the same before a
// push. Interface labels (button names, table heads, "Next page") are not
// copy: they stay in src/lib/i18n.ts.
//
// In a property, `&nbsp;` is a no-break space and `&shy;` a soft hyphen
// (both invisible in Obsidian if typed as the character itself).
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { splitFrontmatter } from './meta.mjs';

import { VAULT_DIR } from './index.mjs';
export { VAULT_DIR };
export const COPY_FOLDER = 'Site';
const LANGS = ['en', 'de'];
const STATUSES = ['complete', 'functional', 'under-revision', 'in-build', 'archived'];

const text = { kind: 'text' };
const list = { kind: 'list' };
/** A text that must keep its placeholders ({n}, {name} …): the page fills them in. */
const fill = (...holds) => ({ kind: 'text', holds });
const optional = (spec) => ({ ...spec, optional: true });
/** Needed in these languages only (the 404 page and the feed are English). */
const only = (langs, spec) => ({ ...spec, only: langs });

/** Note → property → kind. `langs` limits a note to some languages; `shared` notes sit in Site/ itself. */
export const COPY = {
  Identity: {
    shared: true,
    props: {
      name: text, wordmark: text, email: text, address: text,
      role_en: text, role_de: text, location_en: text, location_de: text,
      github: optional(text), linkedin: optional(text), kaggle: optional(text), tableau: optional(text),
    },
  },
  Home: {
    props: {
      title_lines: list, lead: text, seo_description: text,
      writing_prose: text, tools_claim: text, tools_prose: text,
      about_claim: text, about_prose: text, contact: text,
    },
  },
  Work: { props: { claim: text, prose: text, contact: text } },
  Writing: { props: { claim: text, prose: text, seo_description: text, essays_note: text, contact: fill('{name}'), feed_description: only(['en'], text) } },
  Notes: { props: { claim: text, prose: fill('{n}', '{k}'), seo_description: fill('{n}', '{k}') } },
  Tools: { props: { title: text, claim: text, prose: text, seo_description: text } },
  'Confusion matrix': { props: { code: text, title: text, heading: text, summary: text, domain: text, status: { kind: 'status' }, lead: text, seo_description: text, meta: list } },
  'AB sample size': { props: { code: text, title: text, heading: text, summary: text, domain: text, status: { kind: 'status' }, lead: text, seo_description: text, meta: list } },
  'Not found': { props: { lead: text, return_label: text, title: only(['en'], text), seo_description: only(['en'], text), heading_lines: only(['en'], list), explain: only(['en'], text) } },
  'Language chooser': { langs: ['en'], props: { seo_description: fill('{name}', '{role}'), text: fill('{name}', '{role}') } },
};

/** Vault path of a copy note: "Site/Identity.md", "Site/en/Home.md". */
export const copyPath = (note, lang) => (COPY[note]?.shared ? `${COPY_FOLDER}/${note}.md` : `${COPY_FOLDER}/${lang}/${note}.md`);

const entities = (s) => s.replace(/&nbsp;/g, ' ').replace(/&shy;/g, '­');
const clean = (v) => (typeof v === 'string' ? entities(v.trim()) : Array.isArray(v) ? v.map((x) => entities(String(x ?? '').trim())) : v);

/** What is wrong with one property, or undefined. */
function fault(key, spec, value, required) {
  const empty = value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length);
  if (empty) return required ? `"${key}" is empty` : undefined;
  if (spec.kind === 'list') return Array.isArray(value) && value.every((x) => typeof x === 'string' && x) ? undefined : `"${key}" is a list of texts`;
  if (typeof value !== 'string') return `"${key}" is a text (put it in quotes)`;
  if (spec.kind === 'status' && !STATUSES.includes(value)) return `"${key}" is one of ${STATUSES.join(', ')}`;
  for (const h of spec.holds ?? []) if (!value.includes(h)) return `"${key}" must keep the placeholder ${h}`;
  return undefined;
}

const cache = new Map(); // abs → { stamp, data }

/** The properties of one copy note, re-read when the file changes (so `npm run dev` follows Obsidian). */
function read(note, lang, dir) {
  const rel = copyPath(note, lang);
  const abs = join(dir, rel);
  if (!existsSync(abs)) return { rel, missing: true, data: {} };
  const st = statSync(abs);
  const stamp = `${st.mtimeMs}:${st.size}`;
  const hit = cache.get(abs);
  if (hit && hit.stamp === stamp) return hit.value;
  let value;
  try {
    const { data } = splitFrontmatter(readFileSync(abs, 'utf8'));
    value = { rel, data: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, clean(v)])) };
  } catch (e) {
    value = { rel, error: e.message, data: {} };
  }
  cache.set(abs, { stamp, value });
  return value;
}

const requiredHere = (lang, spec) => !spec.optional && (!spec.only || spec.only.includes(lang));

/** Every fault of the Site folder: [{ rel, message }]. Empty when the copy is complete. */
export function copyFaults(dir = VAULT_DIR) {
  const out = [];
  for (const [note, def] of Object.entries(COPY)) {
    for (const lang of def.shared ? [undefined] : def.langs ?? LANGS) {
      const r = read(note, lang, dir);
      if (r.missing) { out.push({ rel: r.rel, message: 'this note is missing: the site reads its copy from it' }); continue; }
      if (r.error) { out.push({ rel: r.rel, message: r.error }); continue; }
      for (const [key, spec] of Object.entries(def.props)) {
        const f = fault(key, spec, r.data[key], requiredHere(lang, spec));
        if (f) out.push({ rel: r.rel, message: f });
      }
    }
  }
  return out;
}

/**
 * The copy of one note in one language: copyOf('Home', 'de').lead. Every
 * property of the contract is checked on the way out; a fault throws with
 * the vault path, so the build never ships a page with a hole in it.
 * @param {keyof typeof COPY} note
 * @param {string} [lang]
 * @param {string} [dir]
 * @returns {Record<string, any>}
 */
export function copyOf(note, lang, dir = VAULT_DIR) {
  const def = COPY[note];
  if (!def) throw new Error(`copy: no such note "${note}"`);
  const r = read(note, lang, dir);
  const where = `website_vault/${r.rel}`;
  if (r.missing) throw new Error(`${where} is missing: the site reads its copy from it`);
  if (r.error) throw new Error(`${where}: ${r.error}`);
  for (const [key, spec] of Object.entries(def.props)) {
    const f = fault(key, spec, r.data[key], requiredHere(lang, spec));
    if (f) throw new Error(`${where}: ${f}`);
  }
  return r.data;
}

/** Fills {placeholders}: fillIn('{n} notes', { n: 12 }). */
export const fillIn = (s, values) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in values ? String(values[k]) : m));
