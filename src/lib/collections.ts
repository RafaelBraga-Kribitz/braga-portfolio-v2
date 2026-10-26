// The content collections as the pages read them: one language, drafts
// out, in listing order. Home, the section indexes, the document pages, the
// sitemap and the feed all go through these, so they cannot disagree about
// what exists or in which order. Every function returns an empty list when
// a collection is still empty; the pages render without rows.

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './site';
import { vaultIndex, resolveAttachment, mediaPath } from './vault/index.mjs';
import { related } from './vault/related.mjs';
import { slugify } from './vault/meta.mjs';
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

/* ---------- the notes library (owner, 25 Oct 2026; levels 26 Oct) ----------
   vault/Notes/<lang>/<area>/<topic>/<subtopic>/<note>.md, imported from the
   owner's maths vault. The folder tree is the index, one page per folder:
   /<lang>/notes/ lists the seven areas, an area lists its topics, a topic
   its subtopics, a subtopic its notes (12 rows a page, then pagination).
   Codes are positions on those pages: area 04, its second topic 04-02,
   that topic's first subtopic 04-02-01, the subtopic's fifth note
   04-02-01-05. A folder lists its subfolders first, then its own notes,
   numbered on. Folder names read as titles through folderTitle(); a
   folder's URL segment is that title, kebab-cased ("calculus-and-optimisation"). */

export interface NoteNode {
  folder: string;
  /** URL segments from /<lang>/notes/ ("calculus-optimization", "differential-calculus"). */
  segs: string[];
  code: string;
  title: string;
  /** Root, then the ancestors, nearest last (not this node). */
  parents: NoteNode[];
  children: NoteNode[];
  notes: NoteRow[];
  /** Notes in this folder and below. */
  count: number;
}
export interface NoteRow { entry: NoteEntry; code: string; node: NoteNode; topic: string; subtopic: string }
export interface NoteArea { code: string; folder: string; title: string; topics: string[]; rows: NoteRow[] }

/** Rows a library page lists before it paginates. */
export const NOTES_PAGE_SIZE = 12;

const two = (n: number) => String(n).padStart(2, '0');
export const folderSeg = (folder: string) => slugify(folderTitle(folder));

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
  powers_roots_and_inequalities: 'Powers, roots and inequalities',
  spatial_distance_norms_and_analytic_geometry: 'Spatial distance, norms and analytic geometry',
  analytic_geometry_shapes_perimeter_area_volume: 'Analytic geometry: shapes, perimeter, area, volume',
  eigenvalues_eigenvectors_and_characteristic_polynomial: 'Eigenvalues, eigenvectors and the characteristic polynomial',
  markov_processes_in_networks: 'Markov processes in networks',
  differential_operators_gradients_jacobians_hessians: 'Differential operators: gradients, Jacobians, Hessians',
  constrained_optimization_and_lagrange_multipliers: 'Constrained optimisation and Lagrange multipliers',
  advanced_optimizers_stochastic_and_adaptive: 'Advanced optimisers: stochastic and adaptive',
  applications_of_derivative_kinematics_and_extrema: 'Applications of the derivative: kinematics and extrema',
  bias_variance_and_generalization: 'Bias, variance and generalisation',
  density_estimation_gaussian_mixture_models_gmm: 'Density estimation: Gaussian mixture models (GMM)',
  dimensionality_reduction_principal_component_analysis_pca: 'Dimensionality reduction: principal component analysis (PCA)',
  expectation_maximization_em_algorithm_for_gmms: 'Expectation–maximisation (EM) for GMMs',
  improper_integrals_multiple_integrals_and_volumes: 'Improper integrals, multiple integrals and volumes',
  inferential_statistics_hypothesis_testing: 'Inferential statistics: hypothesis testing',
  network_analysis_graph_theory: 'Network analysis: graph theory',
  odes_and_transforms: 'ODEs and transforms',
  rotations_3d: '3D rotations',
  support_vector_machines_svm_and_classification: 'Support vector machines (SVM) and classification',
  tree_based_models_and_ensembles: 'Tree-based models and ensembles',
  unit_economics_and_saas_metrics: 'Unit economics and SaaS metrics',
  model_selection_and_cross_validation: 'Model selection and cross-validation',
  empirical_risk_and_minimization: 'Empirical risk and its minimisation',
  operational_math: 'Operational maths',
  math_symbols: 'Maths symbols',
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

/** The library of a language as a tree (the root holds the areas), every note coded by its place. */
export async function notesTree(lang: Lang): Promise<NoteNode> {
  const list = await getCollection('notes', (e) => e.data.lang === lang && !e.data.draft);
  const root: NoteNode = { folder: '', segs: [], code: '', title: 'Notes', parents: [], children: [], notes: [], count: 0 };
  const pending = new Map<NoteNode, NoteEntry[]>();
  for (const entry of list) {
    // id: Notes/<lang>/<area>/<topic>/<subtopic>/<file>
    let node = root;
    for (const folder of entry.id.split('/').slice(2, -1)) {
      let child = node.children.find((c) => c.folder === folder);
      if (!child) {
        child = { folder, segs: [...node.segs, folderSeg(folder)], code: '', title: folderTitle(folder), parents: [...node.parents, node], children: [], notes: [], count: 0 };
        node.children.push(child);
      }
      node = child;
    }
    pending.set(node, [...(pending.get(node) ?? []), entry]);
  }
  const number = (node: NoteNode): number => {
    node.children.sort((a, b) => a.folder.localeCompare(b.folder));
    node.children.forEach((c, i) => {
      // an area keeps the number its folder carries ("04_calculus…" → 04)
      c.code = node === root ? (/^(\d{2})_/.exec(c.folder)?.[1] ?? two(i + 1)) : `${node.code}-${two(i + 1)}`;
    });
    const entries = (pending.get(node) ?? []).sort((a, b) => a.data.title.localeCompare(b.data.title));
    const topic = node.parents[2]?.title ?? (node.parents.length === 2 ? node.title : '');
    const subtopic = node.parents.length >= 3 ? node.title : '';
    node.notes = entries.map((entry, i) => ({ entry, code: `${node.code}-${two(node.children.length + i + 1)}`, node, topic, subtopic }));
    node.count = node.notes.length + node.children.reduce((n, c) => n + number(c), 0);
    return node.count;
  };
  number(root);
  return root;
}

/** Every folder of the tree, depth first (the root first). */
export function noteNodes(root: NoteNode): NoteNode[] {
  return [root, ...root.children.flatMap(noteNodes)];
}

/** Every note of the tree in reading order (each folder's subfolders, then its notes). */
export function noteRows(node: NoteNode): NoteRow[] {
  return [...node.children.flatMap(noteRows), ...node.notes];
}

/** The library's areas with their notes in reading order (home, Writing, tags). */
export async function libraryOf(lang: Lang): Promise<NoteArea[]> {
  const root = await notesTree(lang);
  return root.children.map((a) => ({ code: a.code, folder: a.folder, title: a.title, topics: a.children.map((t) => t.title), rows: noteRows(a) }));
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
