// The content collections as the pages read them: one language, drafts
// out, in listing order. Home, the section indexes, the document pages, the
// sitemap and the feed all go through these, so they cannot disagree about
// what exists or in which order. Every function returns an empty list when
// a collection is still empty; the pages render without rows.

import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './site';

export type ProjectEntry = CollectionEntry<'projects'>;
export type WritingEntry = CollectionEntry<'writing'>;
export type PageEntry = CollectionEntry<'pages'>;
export type LegalEntry = CollectionEntry<'legal'>;

/** Non-draft projects of a language, by code (01-01, 01-02, …). */
export async function projectsOf(lang: Lang): Promise<ProjectEntry[]> {
  const list = await getCollection('projects', (e) => e.data.lang === lang && !e.data.draft);
  return list.sort((a, b) => a.data.code.localeCompare(b.data.code) || a.data.slug.localeCompare(b.data.slug));
}

/** Non-draft essays and notes of a language: by code when they have one, then newest first. */
export async function writingOf(lang: Lang): Promise<WritingEntry[]> {
  const list = await getCollection('writing', (e) => e.data.lang === lang && !e.data.draft);
  return list.sort((a, b) => {
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
export async function slugLanguages(collection: 'projects' | 'writing'): Promise<Map<string, Set<Lang>>> {
  const out = new Map<string, Set<Lang>>();
  const entries = await getCollection(collection, (e) => !e.data.draft);
  for (const e of entries) {
    const set = out.get(e.data.slug) ?? new Set<Lang>();
    set.add(e.data.lang);
    out.set(e.data.slug, set);
  }
  return out;
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
