// src/lib/vault/meta.mjs — what a note in the Obsidian vault means to the
// site, read from its path, its properties and its body. Pure functions,
// shared by the content loader (src/content.config.ts), the Markdown
// pipeline (src/lib/remark/obsidian.mjs), the vault index and
// `npm run vault:check`. Tested in tests/unit/vault.test.mjs.
//
// The vault is the folder vault/ at the top of the repository (owner,
// 23 Oct 2026). Its site folders, each split by language:
//
//   Projects/{en,de}/…   → /<lang>/work/<slug>/        (collection projects)
//   Essays/{en,de}/…     → /<lang>/writing/<slug>/     (writing, kind essay)
//   Notes/{en,de}/…      → /<lang>/notes/<slug>/       (notes, the library)
//   Pages/{en,de}/…      → /<lang>/about/, /<lang>/system/
//   Legal/{en,de}/…      → the Impressum, privacy and accessibility pages
//
// Everything else in the vault (Attachments/, _templates/, _guide/, any
// private folder) is never a page. A note in a site folder is published
// only with the property `publish: true` (owner, 23 Oct 2026); without it,
// it stays in the vault.
import { parse as parseYaml } from 'yaml';
import { folderTags } from './folders.mjs';

/** Site folder → collection, and the writing kind a folder implies. */
export const SITE_FOLDERS = {
  Projects: { collection: 'projects' },
  Essays: { collection: 'writing', kind: 'essay' },
  Notes: { collection: 'notes', kind: 'note' },
  Pages: { collection: 'pages' },
  Legal: { collection: 'legal' },
};
export const VAULT_LANGS = ['en', 'de'];

/** Status tags: #status/complete … (D-029's five states). */
export const STATUS_TAGS = ['complete', 'functional', 'under-revision', 'in-build', 'archived'];

/** The legal pages' paths by language (the same table as src/lib/routes.ts). */
const LEGAL_PATHS = {
  impressum: { en: '/en/impressum/', de: '/de/impressum/' },
  privacy: { en: '/en/privacy/', de: '/de/datenschutz/' },
  accessibility: { en: '/en/accessibility/', de: '/de/barrierefreiheit/' },
};

/** "Austrian MMM & budget optimiser" → "austrian-mmm-budget-optimiser"; umlauts to their ASCII pairs. */
export function slugify(s) {
  return String(s)
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue').replace(/ß/g, 'ss')
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Splits "---\nyaml\n---\nbody" into { data, body }; a note without properties has data {}. */
export function splitFrontmatter(source) {
  const s = String(source).replace(/^﻿/, '');
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(s);
  if (!m) return { data: {}, body: s, raw: '' };
  let data = {};
  try { data = parseYaml(m[1]) ?? {}; } catch (e) { throw new Error(`properties (YAML) do not parse: ${e.message}`); }
  return { data: typeof data === 'object' && !Array.isArray(data) ? data : {}, body: s.slice(m[0].length), raw: m[1] };
}

/** Removes fenced code, inline code and %% comments, so nothing inside them reads as a heading, a tag or a link. */
export function proseOnly(body) {
  return String(body)
    .replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1[ \t]*$/gm, '')
    .replace(/`[^`\n]*`/g, '')
    .replace(/%%[\s\S]*?%%/g, '');
}

/** The text of the note's first "# " heading, or undefined. */
export function firstH1(body) {
  const m = /^#[ \t]+(.+?)[ \t#]*$/m.exec(proseOnly(body));
  return m ? m[1].trim() : undefined;
}

/** Inline #tags in the prose (Obsidian's rule: a tag holds a letter, no spaces; "#1" and "C#" are not tags). */
export function inlineTags(body) {
  const out = [];
  const re = /(^|[\s(])#([\p{L}\p{N}_/-]*[\p{L}_][\p{L}\p{N}_/-]*)/gu;
  for (const line of proseOnly(body).split('\n')) {
    if (/^#{1,6}\s/.test(line)) continue; // a heading, not a tag
    let m;
    while ((m = re.exec(line))) out.push(m[2]);
  }
  return out;
}

/** Property tags (a list or a string, with or without "#") and inline tags, lower-cased, unique, in order. */
export function allTags(data, body) {
  const prop = data?.tags;
  const list = Array.isArray(prop) ? prop : typeof prop === 'string' ? prop.split(/[,\s]+/) : [];
  const seen = new Set();
  const out = [];
  for (const t of [...list, ...inlineTags(body)]) {
    const tag = String(t ?? '').trim().replace(/^#/, '').toLowerCase();
    if (tag && !seen.has(tag)) { seen.add(tag); out.push(tag); }
  }
  return out;
}

/** The status a note's tags give it (#status/complete …), else the `status` property, else undefined. */
export function statusOf(tags, data) {
  const t = tags.find((x) => x.startsWith('status/'));
  if (t) return t.slice('status/'.length);
  return typeof data?.status === 'string' ? data.status : undefined;
}

/** Tags shown to readers: not the status, not "draft". */
export function publicTags(tags) {
  return tags.filter((t) => !t.startsWith('status/') && t !== 'draft');
}

/** Dataview inline fields: "key:: value" lines, and "[key:: value]" in a sentence. */
export function inlineFields(body) {
  const out = {};
  for (const m of proseOnly(body).matchAll(/^([\p{L}\p{N}_ -]+)::[ \t]*(.*)$/gmu)) out[fieldKey(m[1])] = m[2].trim();
  for (const m of proseOnly(body).matchAll(/\[([\p{L}\p{N}_ -]+)::[ \t]*([^\]]*)\]/gu)) out[fieldKey(m[1])] = m[2].trim();
  return out;
}
const fieldKey = (k) => k.trim().toLowerCase().replace(/\s+/g, '-');

/**
 * A plain-text excerpt: the first paragraph of prose that reads as a
 * sentence, about `max` characters, cut at a word. It stands in for a
 * missing `summary`, so it is the meta description, the feed item and the
 * line under a related note (website audit, SEO-007). Two kinds of
 * paragraph are passed over when a later one reads better: a fragment
 * left between two display formulas (", $S = 4\pi R^2$", "(for a > 0)")
 * and a sentence that hands over to a formula ("…, defined by"). The
 * library's breakdown label ("What it tells me (Situation Awareness):") is
 * not part of the sentence. Inline maths reads as text (texText), and only
 * real Markdown emphasis is removed: an "=" or "_" inside maths stays.
 */
export function excerpt(body, max = 180) {
  const texts = proseOnly(body).split(/\n\s*\n/).map((p) => p.trim())
    .filter((p) => p && !/^(#|>|\||- |\* |\d+\. |!\[|<|---|\$\$|[\p{L}\p{N}_ -]+::)/u.test(p))
    .map(plainText).filter(Boolean);
  const text = texts.find((t) => readsAsSentence(t, max)) ?? texts[0] ?? '';
  if (text.length <= max) return text;
  const cut = text.slice(0, max + 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max * 0.6)).replace(/[,;:.\s]+$/, '')}…`;
}

const LEAD_LABEL = /^What it tells me \(Situation Awareness\):\s*/i;

/** A paragraph of Markdown as one line of text. */
function plainText(p) {
  const maths = [];
  return p
    .replace(/!\[\[[^\]]*\]\]/g, '')
    .replace(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g, (_, a, b) => b ?? a)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // inline maths is set aside first, so the emphasis rules never see its _ * =
    .replace(/\$([^$\n]+)\$/g, (_, tex) => `\u0000${maths.push(texText(tex)) - 1}\u0000`)
    .replace(/(\*\*|__)(?=\S)(.*?\S)\1/g, '$2')
    .replace(/\*(?=\S)([^*\n]*?\S)\*/g, '$1')
    .replace(/(^|[^\p{L}\p{N}_])_(?=\S)([^_\n]*?\S)_(?![\p{L}\p{N}_])/gu, '$1$2')
    .replace(/(~~|==)(?=\S)(.*?\S)\1/g, '$2')
    .replace(/\u0000(\d+)\u0000/g, (_, i) => maths[+i])
    .replace(/\s+/g, ' ').trim()
    .replace(LEAD_LABEL, '');
}

/** Starts like a sentence and ends like one (or runs past the cut anyway), and is not a fragment. */
const readsAsSentence = (t, max) => t.length >= 40 && /^[\p{Lu}\p{N}"“„‘']/u.test(t) && (t.length > max || /[.!?…)"”]$/.test(t));

const TEX_SYMBOLS = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', varepsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ', kappa: 'κ',
  lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', rho: 'ρ', sigma: 'σ', tau: 'τ', phi: 'φ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  in: '∈', notin: '∉', le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠', approx: '≈', sim: '∼', equiv: '≡', propto: '∝',
  infty: '∞', to: '→', rightarrow: '→', leftarrow: '←', mapsto: '→', Rightarrow: 'implies', implies: 'implies', iff: 'iff', Leftrightarrow: 'iff',
  times: '×', cdot: '·', div: '÷', pm: '±', mp: '∓', sum: 'Σ', prod: '∏', int: '∫', partial: '∂', nabla: '∇',
  forall: '∀', exists: '∃', lnot: '¬', subset: '⊂', subseteq: '⊆', supset: '⊃', cup: '∪', cap: '∩', emptyset: '∅', varnothing: '∅', setminus: '∖',
  ldots: '…', cdots: '⋯', dots: '…', neg: '¬', land: '∧', lor: '∨', perp: '⊥', circ: '∘', ell: 'ℓ', mid: '|', vert: '|', Vert: '‖',
  langle: '⟨', rangle: '⟩', lfloor: '⌊', rfloor: '⌋', lceil: '⌈', rceil: '⌉', quad: ' ', qquad: ' ',
  '|': '‖', ',': ' ', ';': ' ', ':': ' ', '!': '', ' ': ' ', '#': '#', '%': '%', '&': '&', _: '_', $: '$',
};
const BLACKBOARD = { R: 'ℝ', N: 'ℕ', Z: 'ℤ', Q: 'ℚ', C: 'ℂ' };
const group = (a) => (/^[\p{L}\p{N}.√_^]*$/u.test(a.trim()) ? a.trim() : `(${a.trim()})`);

/**
 * Inline TeX as readable text, for an excerpt: \frac{4}{3}\pi R^3 → 4/3π R^3,
 * \mathbb{R} → ℝ. Arrows other than → and ← become words: the glyph
 * inventory (D-030, gate L-06) allows no other arrow in running text.
 */
export function texText(tex) {
  // escaped braces are literal and survive the brace removal at the end
  let s = String(tex).replace(/\\\{/g, '\u0001').replace(/\\\}/g, '\u0002')
    .replace(/\\(?:left|right|[bB]igg?[lr]?)\b\s*/g, '')
    .replace(/\\mathbb\{([A-Z])\}/g, (_, c) => BLACKBOARD[c] ?? c);
  for (let i = 0; i < 4; i++) {
    s = s
      .replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, (_, a, b) => `${group(a)}/${group(b)}`)
      .replace(/\\sqrt\{([^{}]*)\}/g, (_, a) => `√${group(a)}`)
      .replace(/\\(?:text|textbf|textit|mathrm|mathit|mathbf|mathcal|mathsf|operatorname|bm|boldsymbol|hat|bar|tilde|vec|overline|underline|widehat|widetilde)\{([^{}]*)\}/g, '$1')
      .replace(/([_^])\{([^{}]*)\}/g, (_, op, a) => op + group(a));
  }
  return s
    .replace(/\\([A-Za-z]+|.)/g, (_, name) => TEX_SYMBOLS[name] ?? name)
    .replace(/[{}]/g, '')
    .replace(/\u0001/g, '{').replace(/\u0002/g, '}')
    .replace(/\s+/g, ' ').trim();
}

/**
 * Where a vault file belongs: { folder, collection, lang, kind } for a note
 * in a site folder, or null (attachments, templates, the guide, private
 * folders, anything under a "_" folder or named "_…").
 */
export function placeOf(rel) {
  const parts = String(rel).split('/');
  if (parts.some((p) => p.startsWith('_') || p.startsWith('.'))) return null;
  if (!/\.md$/i.test(rel) || parts.length < 3) return null;
  const site = SITE_FOLDERS[parts[0]];
  if (!site || !VAULT_LANGS.includes(parts[1])) return null;
  return { folder: parts[0], collection: site.collection, lang: parts[1], kind: site.kind };
}

/** The basename of a vault path without ".md". */
export const baseName = (rel) => String(rel).split('/').pop().replace(/\.md$/i, '');

/**
 * The site's reading of a note: its properties with the Obsidian
 * conventions applied. The H1 is the title (frontmatter `title` and the
 * file name are fallbacks); the slug defaults to the file name; the folder
 * gives the language and, for writing, the kind; #status/… tags give a
 * project its status; an excerpt stands in for a missing summary.
 */
export function readNote(rel, source) {
  const place = placeOf(rel);
  const { data, body } = splitFrontmatter(source);
  // a library note's folders are tags too (folders.mjs), area first
  const tags = [...new Set([...folderTags(rel), ...allTags(data, body)])];
  const title = firstH1(body) ?? (typeof data.title === 'string' ? data.title : undefined) ?? baseName(rel);
  const slug = typeof data.slug === 'string' && data.slug ? data.slug : slugify(baseName(rel));
  const fields = inlineFields(body);
  const status = statusOf(tags, data);
  const publish = data.publish === true && data.draft !== true && !tags.includes('draft');
  const merged = {
    ...fields,
    ...data,
    title,
    slug,
    lang: data.lang ?? place?.lang,
    tags: publicTags(tags),
    ...(status ? { status } : {}),
    ...(place?.kind && !data.kind ? { kind: place.kind } : {}),
    ...(data.summary || !place ? {} : { summary: excerpt(body) }),
    ...(data.date === undefined && data.created !== undefined ? { date: data.created } : {}),
    publish,
  };
  return { rel, place, data: merged, body, tags, aliases: aliasesOf(data) };
}

const aliasesOf = (data) => (Array.isArray(data.aliases) ? data.aliases.map(String) : typeof data.aliases === 'string' ? [data.aliases] : []);

/** The site path of a note (no base), or undefined for a note that is not a page. */
export function pathOf(note) {
  const p = note.place;
  if (!p) return undefined;
  const { lang, slug, page } = note.data;
  if (p.collection === 'projects') return `/${lang}/work/${slug}/`;
  if (p.collection === 'writing') return `/${lang}/writing/${slug}/`;
  if (p.collection === 'notes') return `/${lang}/notes/${slug}/`;
  if (p.collection === 'pages') return `/${lang}/${slug}/`;
  if (p.collection === 'legal') return LEGAL_PATHS[page]?.[lang];
  return undefined;
}

/** Scheduled publishing (Ghost): a note dated after `today` (yyyy-mm-dd) is not built yet. */
export function isScheduled(data, today = new Date().toISOString().slice(0, 10)) {
  const d = data?.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data?.date ?? '');
  return /^\d{4}-\d{2}-\d{2}$/.test(d) && d > today;
}
