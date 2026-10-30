// The content collections as the pages read them: one language, drafts
// out, in listing order. Home, the section indexes, the document pages, the
// sitemap and the feed all go through these, so they cannot disagree about
// what exists or in which order. Every function returns an empty list when
// a collection is still empty; the pages render without rows.

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './site';
import { vaultIndex, resolveAttachment, mediaPath } from './vault/index.mjs';
import { related } from './vault/related.mjs';
import { folderTitle, folderTag, folderTagNames } from './vault/folders.mjs';
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

/**
 * Non-draft essays of a language, newest first (owner, 30 Oct 2026): a
 * featured essay leads, then by date, latest at the top; essays of one day
 * by code, highest first, so the list is reverse publication order
 * throughout and the latest essay is always the first row.
 */
export async function writingOf(lang: Lang): Promise<WritingEntry[]> {
  const list = await getCollection('writing', (e) => e.data.lang === lang && !e.data.draft);
  const codes = essayCodes(list);
  return list.sort((a, b) => {
    // featured (a note's `featured: true`, Ghost's featured post) first
    if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
    return b.data.date.localeCompare(a.data.date) || codes.get(b.id)!.localeCompare(codes.get(a.id)!) || a.data.slug.localeCompare(b.data.slug);
  });
}

/** Writing's two categories (owner, 30 Oct 2026): stable references, so a new essay never renumbers the notes. */
export const ESSAYS_CODE = '02-01';
/** How many essays the home page lists before its link to all of them. */
export const HOME_ESSAYS = 5;

/**
 * Every essay's code: its own `code` (02-01-008), else the next free item
 * number in publication order (oldest first, so a new essay takes the next
 * number and the others keep theirs). Codes are the essay's permanent
 * reference; the listing order (writingOf) is separate from them.
 */
export function essayCodes(list: readonly WritingEntry[]): Map<string, string> {
  const out = new Map<string, string>();
  const taken = new Set(list.map((e) => e.data.code).filter(Boolean));
  let n = 0;
  const next = () => {
    let c: string;
    do c = `${ESSAYS_CODE}-${String(++n).padStart(3, '0')}`; while (taken.has(c));
    return c;
  };
  const oldest = [...list].sort((a, b) => a.data.date.localeCompare(b.data.date) || a.data.slug.localeCompare(b.data.slug));
  for (const e of oldest) out.set(e.id, e.data.code ?? next());
  return out;
}

/** The code of one essay within its language's list. */
export function writingCode(entry: WritingEntry, list: readonly WritingEntry[]): string {
  return essayCodes(list).get(entry.id) ?? ESSAYS_CODE;
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

/* ---------- the notes library (owner, 25–26 Oct 2026) ----------
   vault/Notes/<lang>/<area>/<topic>/<subtopic>/<note>.md, imported from the
   owner's maths vault. On the site the library is flat and tagged, as
   Ghost publishes: one list of every note, 24 a page, each coded by its
   place in it under Writing's second register (02 Writing, 02-02 Notes,
   02-02-001 the first note). The folders are tags (src/lib/vault/
   folders.mjs): area, topic and subtopic each have their archive page
   /<lang>/tags/<tag>/, as every other tag. Reading order: the vault's
   folder order (areas by their number), then the title. */

export interface NoteRow { entry: NoteEntry; code: string; area: string; topic: string; subtopic: string }
export interface NoteArea { code: string; folder: string; tag: string; title: string; topics: string[]; rows: NoteRow[] }

/** The library's code under Writing: its second register. */
export const NOTES_CODE = '02-02';
/** Rows a list page shows before the next page (the library, a tag's archive). */
export const LIST_PAGE_SIZE = 24;

/** Every non-draft note of a language in reading order, coded 02-02-NNN. */
export async function notesOf(lang: Lang): Promise<NoteRow[]> {
  const list = await getCollection('notes', (e) => e.data.lang === lang && !e.data.draft);
  const folders = (e: NoteEntry) => e.id.split('/').slice(2, -1);
  list.sort((a, b) => {
    const fa = folders(a), fb = folders(b);
    for (let i = 0; i < Math.max(fa.length, fb.length); i++) {
      const c = (fa[i] ?? '').localeCompare(fb[i] ?? '');
      if (c) return c;
    }
    return a.data.title.localeCompare(b.data.title);
  });
  return list.map((entry, i) => {
    const [area = '', topic = '', subtopic = ''] = folders(entry);
    return { entry, code: `${NOTES_CODE}-${String(i + 1).padStart(3, '0')}`, area, topic: topic && folderTitle(topic), subtopic: subtopic && folderTitle(subtopic) };
  });
}

/** The library's areas with their notes (home, Writing, the library's first page). */
export async function libraryOf(lang: Lang): Promise<NoteArea[]> {
  const rows = await notesOf(lang);
  const areas = new Map<string, NoteRow[]>();
  for (const r of rows) areas.set(r.area, [...(areas.get(r.area) ?? []), r]);
  return [...areas].map(([folder, list], i) => ({
    code: /^(\d{2})_/.exec(folder)?.[1] ?? String(i + 1).padStart(2, '0'),
    folder, tag: folderTag(folder), title: folderTitle(folder),
    topics: [...new Set(list.map((r) => r.topic).filter(Boolean))], rows: list,
  }));
}

/** A tag's display name: a folder's title for a library folder's tag, else "#tag". */
export async function tagNames(): Promise<Map<string, string>> {
  const all = await getCollection('notes');
  return folderTagNames(all.map((e) => e.id));
}

/** Pages of a list: the rows of page n (1-indexed) and how many pages there are. */
export function paginate<T>(rows: readonly T[], page: number, size = LIST_PAGE_SIZE): { rows: T[]; pages: number } {
  return { rows: rows.slice((page - 1) * size, page * size), pages: Math.max(1, Math.ceil(rows.length / size)) };
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
/** A stack keyword's tag: the keyword, kebab-cased (Power BI → power-bi, CI/CD → ci-cd). */
export const stackTag = (keyword: string) => slugify(keyword);

/** Every tag of an entry: its own tags, and for a project its stack keywords as tags too. */
export function entryTags(e: { data: { tags: string[]; stack?: string[] } }): string[] {
  return [...new Set([...e.data.tags, ...(e.data.stack ?? []).map(stackTag)])];
}

/** The display names of the stack tags (power-bi → Power BI), from every project. */
export async function stackNames(): Promise<Map<string, string>> {
  const all = await getCollection('projects');
  const out = new Map<string, string>();
  for (const p of all) for (const k of p.data.stack) out.set(stackTag(k), k);
  return out;
}

/** How many stack keywords a listing row shows: six, two to a line (owner, 30 Oct 2026). */
export const LISTING_KEYWORDS = 6;

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
