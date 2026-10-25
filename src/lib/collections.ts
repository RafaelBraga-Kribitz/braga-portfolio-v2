// The content collections as the pages read them: one language, drafts
// out, in listing order. Home, the section indexes, the document pages, the
// sitemap and the feed all go through these, so they cannot disagree about
// what exists or in which order. Every function returns an empty list when
// a collection is still empty; the pages render without rows.

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './site';
import { vaultIndex, resolveAttachment, mediaPath } from './vault/index.mjs';
import { related } from './vault/related.mjs';
import { imageSize } from './vault/image-size.mjs';

export type ProjectEntry = CollectionEntry<'projects'>;
export type WritingEntry = CollectionEntry<'writing'>;
export type NoteEntry = CollectionEntry<'notes'>;
export type PageEntry = CollectionEntry<'pages'>;
export type LegalEntry = CollectionEntry<'legal'>;

/** Non-draft projects of a language, by code (01-01, 01-02, …). */
export async function projectsOf(lang: Lang): Promise<ProjectEntry[]> {
  const list = await getCollection('projects', (e) => e.data.lang === lang && !e.data.draft);
  return list.sort((a, b) => a.data.code.localeCompare(b.data.code) || a.data.slug.localeCompare(b.data.slug));
}

/** Non-draft essays of a language: by code when they have one, then newest first. */
export async function writingOf(lang: Lang): Promise<WritingEntry[]> {
  const list = await getCollection('writing', (e) => e.data.lang === lang && !e.data.draft);
  return list.sort((a, b) => {
    // featured (a note's `featured: true`, Ghost's featured post) first
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    const ca = a.data.code ?? '￿';
    const cb = b.data.code ?? '￿';
    return ca.localeCompare(cb) || b.data.date.localeCompare(a.data.date) || a.data.slug.localeCompare(b.data.slug);
  });
}

/** The listing code of a writing entry: its own code, else 02-NN by its place in writingOf(). */
export function writingCode(entry: WritingEntry, index: number): string {
  return entry.data.code ?? `02-${String(index + 1).padStart(2, '0')}`;
}

/** The entry after `current` in a list, wrapping to the first; none when the list has no other entry. */
export function nextOf<T extends { id: string }>(list: readonly T[], current: T): T | undefined {
  if (list.length < 2) return undefined;
  const i = list.findIndex((e) => e.id === current.id);
  return list[(i + 1) % list.length];
}

/** The entry before `current` in a list, wrapping to the last; none when the list has no other entry. */
export function prevOf<T extends { id: string }>(list: readonly T[], current: T): T | undefined {
  if (list.length < 2) return undefined;
  const i = list.findIndex((e) => e.id === current.id);
  return list[(i - 1 + list.length) % list.length];
}

/**
 * Reading time of a Markdown body in whole minutes (at least 1), at 200
 * words a minute: the meta row's "12 min read" (UX pass, 22 Oct 2026).
 * Callout markers, link targets, fences' backticks and table pipes are not
 * words; the figures of a [!bars] list are read and count.
 */
export function readingMinutes(body: string | undefined): number {
  const text = (body ?? '')
    .replace(/\[![\w-]+\][+-]?/g, ' ')
    .replace(/\]\([^)]*\)/g, ' ')
    .replace(/[`|>#*_=]+/g, ' ');
  const words = text.match(/[\p{L}\p{N}][\p{L}\p{N}'’.,%€-]*/gu)?.length ?? 0;
  return Math.max(1, Math.round(words / 200));
}

/** Slugs of a collection and the languages each exists in (non-draft), for the sitemap. */
export async function slugLanguages(collection: 'projects' | 'writing' | 'notes'): Promise<Map<string, Set<Lang>>> {
  const out = new Map<string, Set<Lang>>();
  const entries = await getCollection(collection, (e) => !e.data.draft);
  for (const e of entries) {
    const set = out.get(e.data.slug) ?? new Set<Lang>();
    set.add(e.data.lang);
    out.set(e.data.slug, set);
  }
  return out;
}

/* ---------- the notes library (owner, 25 Oct 2026) ----------
   vault/Notes/<lang>/<area>/<topic>/<subtopic>/<note>.md, imported from the
   owner's maths vault. The folder tree is the index: an area ("04_calculus_
   optimization") opens a section, its notes are listed by topic and
   subtopic, each coded <area>-<nnn> in that order ("04-017"). Folder names
   read as titles through folderTitle(). */

export interface NoteRow { entry: NoteEntry; code: string; topic: string; subtopic: string }
export interface NoteArea { code: string; folder: string; title: string; topics: string[]; rows: NoteRow[] }

/** Area titles: the folder's number is the code, the rest is too terse to show. */
const AREA_TITLES: Record<string, string> = {
  foundations: 'Foundations',
  algebra_precalc: 'Algebra and precalculus',
  linear_algebra_geometry: 'Linear algebra and geometry',
  calculus_optimization: 'Calculus and optimisation',
  probability_stats: 'Probability and statistics',
  ml_math: 'Machine learning',
  econ_business: 'Economics and business',
};

/** Words a folder name spells in lower case that read in capitals. */
const UPPER = new Set(['3d', 'blr', 'cdf', 'crvs', 'da', 'drvs', 'ds', 'em', 'gdp', 'gmm', 'gmms', 'ml', 'mle', 'odes', 'pca', 'ppca', 'qr', 'saas', 'svd', 'svm', 'tda']);
const SPECIAL: Record<string, string> = {
  convergence_tests_for_infinite_series_sum_n_1_infty_a_n: 'Convergence tests for infinite series',
  sufficient_statistics_and_the_fisher_neyman_theorem: 'Sufficient statistics and the Fisher–Neyman theorem',
  total_probability_and_bayes_theorem: 'Total probability and Bayes’ theorem',
  inner_products_and_gram_schmidt_process: 'Inner products and the Gram–Schmidt process',
  graph_foundations_and_the_laplace_matrix: 'Graph foundations and the Laplace matrix',
  decompositions_svd_cholesky_qr: 'Decompositions: SVD, Cholesky, QR',
  taylor_and_maclaurin_series: 'Taylor and Maclaurin series',
  markov_processes_in_networks: 'Markov processes in networks',
  differential_operators_gradients_jacobians_hessians: 'Differential operators: gradients, Jacobians, Hessians',
  constrained_optimization_and_lagrange_multipliers: 'Constrained optimisation and Lagrange multipliers',
};

/** "discrete_random_variables_drvs" → "Discrete random variables (DRVs)". */
export function folderTitle(folder: string): string {
  const bare = folder.replace(/^\d+_/, '');
  if (AREA_TITLES[bare] && /^\d+_/.test(folder)) return AREA_TITLES[bare];
  if (SPECIAL[bare]) return SPECIAL[bare];
  const words = bare.split('_');
  const last = words[words.length - 1];
  // a closing acronym repeats the phrase before it: "… analysis pca" → "… analysis (PCA)"
  const tail = UPPER.has(last) && words.length > 2 ? words.pop() : undefined;
  const text = words
    .map((w, i) => (UPPER.has(w) ? w.toUpperCase() : i === 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
    .replace(/optimization/g, 'optimisation');
  const acr = tail ? tail.toUpperCase().replace(/S$/, 's') : '';
  return tail ? `${text} (${acr})` : text;
}

/** Non-draft notes of a language, as the library's areas, in folder order. */
export async function libraryOf(lang: Lang): Promise<NoteArea[]> {
  const list = await getCollection('notes', (e) => e.data.lang === lang && !e.data.draft);
  const byArea = new Map<string, { entry: NoteEntry; topic: string; subtopic: string }[]>();
  for (const entry of list) {
    // id: Notes/<lang>/<area>/<topic>/<subtopic>/<file>
    const parts = entry.id.split('/').slice(2, -1);
    const area = parts[0] ?? '';
    const bucket = byArea.get(area) ?? [];
    bucket.push({ entry, topic: parts[1] ?? '', subtopic: parts[2] ?? '' });
    byArea.set(area, bucket);
  }
  return [...byArea.keys()].sort().map((folder, ai) => {
    const code = /^(\d{2})_/.exec(folder)?.[1] ?? String(ai + 1).padStart(2, '0');
    const items = byArea.get(folder)!.sort((a, b) =>
      a.topic.localeCompare(b.topic) || a.subtopic.localeCompare(b.subtopic) || a.entry.data.title.localeCompare(b.entry.data.title));
    const rows = items.map((it, i) => ({
      entry: it.entry,
      code: `${code}-${String(i + 1).padStart(3, '0')}`,
      topic: it.topic ? folderTitle(it.topic) : '',
      subtopic: it.subtopic ? folderTitle(it.subtopic) : '',
    }));
    return { code, folder, title: folderTitle(folder), topics: [...new Set(rows.map((r) => r.topic).filter(Boolean))], rows };
  });
}

/** A `pages` entry (about, system) of a language, or undefined while it is not written. */
export async function pageOf(slug: PageEntry['data']['slug'], lang: Lang): Promise<PageEntry | undefined> {
  const list = await getCollection('pages', (e) => e.data.slug === slug && e.data.lang === lang && !e.data.draft);
  return list[0];
}

/** A `legal` entry of a language by its page key, or undefined while it is not written. */
export async function legalOf(page: LegalEntry['data']['page'], lang: Lang): Promise<LegalEntry | undefined> {
  const list = await getCollection('legal', (e) => e.data.page === page && e.data.lang === lang && !e.data.draft);
  return list[0];
}

/* ---------- the vault behind an entry (owner, 23 Oct 2026) ----------
   What a page needs from the Obsidian vault that the collection entry does
   not carry: the cover image as a /media/ file, the tags as links to their
   pages, and the related notes (src/lib/vault/related.mjs). */

export interface VaultExtras {
  cover?: { src: string; alt: string; width?: number; height?: number };
  tags: { label: string; href: string }[];
  related: { href: string; title: string; sub?: string }[];
}

/** The tag page of a tag (no base: routes go through withBase in the page). */
export const tagPath = (tag: string, lang: Lang) => `/${lang}/tags/${tag.split('/').map(encodeURIComponent).join('/')}/`;

export function vaultExtras(entry: { filePath?: string; data: { tags?: string[]; cover?: string; cover_alt?: string; title: string } }, lang: Lang): VaultExtras {
  const index = vaultIndex();
  const rel = (entry.filePath ?? '').replace(/^vault\//, '');
  const note = index.notes.find((n: { rel: string }) => n.rel === rel);
  let cover: VaultExtras['cover'];
  if (entry.data.cover) {
    const att = resolveAttachment(index, entry.data.cover.replace(/^!?\[\[|\]\]$/g, ''));
    if (att && att.kind === 'image') cover = { src: mediaPath(att), alt: entry.data.cover_alt ?? '', ...(imageSize(att.abs) ?? {}) };
  }
  const tags = (entry.data.tags ?? []).map((t) => ({ label: `#${t}`, href: tagPath(t, lang) }));
  const rel3 = note ? related(index.notes, note).map((r: { note: { url: string; data: { title: string; summary?: string } } }) => ({ href: r.note.url, title: r.note.data.title, sub: r.note.data.summary })) : [];
  return { cover, tags, related: rel3 };
}
