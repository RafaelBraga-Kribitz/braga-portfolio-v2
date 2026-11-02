// The tag catalogue (owner, 1 Nov 2026; D-061): every tag of a language
// with its kind, its count and its place in the library's tree, read once
// by the tags index, the A–Z pages, the archives and the search index, so
// they cannot disagree about what a tag is or how often it is used.
//
// Four kinds. A library note's folders are its tags (src/lib/vault/
// folders.mjs): the area (7 of them), the topic and the subtopic; each is
// a node of a tree whose children are the folders under it. A `tags`
// property of an essay or project is a hand tag; a project's stack
// keyword is a stack tag. The catalogue is what lets the pages scale: a
// reader browses one level at a time (areas, then an area's topics, then a
// topic's subtopics), each level small whatever the whole is, and the
// flat A–Z is partitioned by letter once it outgrows one page.

import { letterPagesFrom } from './register.mjs';
import type { Lang } from './i18n';
import { tagPath, projectsOf, writingOf, notesOf, entryTags, stackNames } from './collections';
import { workRoute, writingRoute, noteRoute, withBase } from './routes';
import { folderTag, folderTitle } from './vault/folders.mjs';

export type TagKind = 'area' | 'topic' | 'subtopic' | 'tag' | 'stack';

export interface TagItem {
  tag: string;
  /** The display name: a folder's title, a stack keyword as written, else #tag. */
  name: string;
  kind: TagKind;
  /** Entries (projects, essays, notes) that carry the tag. */
  count: number;
  /** The archive page, without the base. */
  href: string;
  /** A library folder's code (the area's two digits), for the column. */
  code?: string;
  /** The folders under this one (an area's topics, a topic's subtopics). */
  children: TagItem[];
  /** The folder above (a topic's area, a subtopic's topic). */
  parent?: string;
}

export interface TagCatalogue {
  lang: Lang;
  /** The language whose library the areas come from (English for a language without notes). */
  libraryLang: Lang;
  /** The library's areas, each with its topics, each with its subtopics. */
  areas: TagItem[];
  /** Hand tags of essays and projects, alphabetical by name. */
  hand: TagItem[];
  /** Stack keywords, alphabetical by name. */
  stack: TagItem[];
  /** Every tag, alphabetical by name. */
  all: TagItem[];
  byTag: Map<string, TagItem>;
  /** Entries counted (each once). */
  entries: number;
}

/** From how many tags the A–Z index is one page per letter instead of one page (TAGS_LETTER_PAGES_FROM overrides it, to try the paged shape on a small site). */
// Build-only Node environment: Vite does not expose unprefixed variables through import.meta.env.
export const LETTER_PAGES_FROM = letterPagesFrom((globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } }).process?.env?.TAGS_LETTER_PAGES_FROM);

/** The letter an A–Z index files a name under: its first letter without accents, "#" for a digit or symbol. */
export function letterOf(name: string): string {
  const c = name.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : '#';
}

const byName = (a: TagItem, b: TagItem) => a.name.localeCompare(b.name) || a.tag.localeCompare(b.tag);

const catalogues = new Map<Lang, Promise<TagCatalogue>>();

/** The catalogue of a language, built once per build. */
export function tagCatalogue(lang: Lang): Promise<TagCatalogue> {
  let c = catalogues.get(lang);
  if (!c) { c = build(lang); catalogues.set(lang, c); }
  return c;
}

async function build(lang: Lang): Promise<TagCatalogue> {
  const projects = await projectsOf(lang);
  const writing = await writingOf(lang);
  const ownNotes = await notesOf(lang);
  // a language without notes of its own shows the English library (as the
  // notes page does); its archives live under the English tag pages
  const libraryLang: Lang = ownNotes.length ? lang : 'en';
  const notes = ownNotes.length ? ownNotes : await notesOf(libraryLang);

  const counts = new Map<string, number>();
  const bump = (tag: string) => counts.set(tag, (counts.get(tag) ?? 0) + 1);
  for (const e of [...projects, ...writing]) for (const tag of entryTags(e)) bump(tag);
  for (const r of notes) for (const tag of entryTags(r.entry)) bump(tag);

  const items = new Map<string, TagItem>();
  // one tag, one item. A folder title can repeat at two depths ("Algebra"
  // is an area and a Foundations subtopic; both are #algebra, and the
  // archive already merges them), so the item takes the shallowest kind
  // it is seen at: area over topic over subtopic.
  const RANK: Record<TagKind, number> = { area: 0, topic: 1, subtopic: 2, tag: 3, stack: 3 };
  const item = (tag: string, name: string, kind: TagKind, href: string): TagItem => {
    let it = items.get(tag);
    if (!it) { it = { tag, name, kind, count: counts.get(tag) ?? 0, href, children: [] }; items.set(tag, it); }
    else if (RANK[kind] < RANK[it.kind]) { it.kind = kind; it.name = name; it.href = href; }
    return it;
  };

  // the library's tree, from the folders of every note: area → topic → subtopic
  const areas: TagItem[] = [];
  const seen = new Map<string, Set<string>>();
  for (const r of notes) {
    const folders = r.entry.id.split('/').slice(2, -1);
    let parent: TagItem | undefined;
    folders.forEach((folder, depth) => {
      const kind: TagKind = depth === 0 ? 'area' : depth === 1 ? 'topic' : 'subtopic';
      const tag = folderTag(folder);
      const it = item(tag, folderTitle(folder), kind, tagPath(tag, libraryLang));
      if (kind === 'area') {
        it.code ??= /^(\d{2})_/.exec(folder)?.[1];
        if (!areas.includes(it)) areas.push(it);
      } else if (parent && parent !== it) {
        const kids = seen.get(parent.tag) ?? new Set<string>();
        if (!kids.has(tag)) { kids.add(tag); parent.children.push(it); it.parent = parent.tag; }
        seen.set(parent.tag, kids);
      }
      parent = it;
    });
  }
  for (const a of areas) { a.children.sort(byName); for (const t of a.children) t.children.sort(byName); }
  areas.sort((a, b) => (a.code ?? '').localeCompare(b.code ?? '') || byName(a, b));

  // stack keywords, then hand tags: anything counted that is not a folder
  const stackName = await stackNames();
  const stack: TagItem[] = [];
  const hand: TagItem[] = [];
  for (const tag of counts.keys()) {
    if (items.has(tag)) continue;
    if (stackName.has(tag)) stack.push(item(tag, stackName.get(tag)!, 'stack', tagPath(tag, lang)));
    else hand.push(item(tag, `#${tag}`, 'tag', tagPath(tag, lang)));
  }
  stack.sort(byName);
  hand.sort(byName);

  const all = [...items.values()].sort(byName);
  // a tag's archive counts every entry that carries it; the catalogue counts each entry once
  const entries = projects.length + writing.length + notes.length;
  return { lang, libraryLang, areas, hand, stack, all, byTag: items, entries };
}

/** The A–Z index as letter groups, in letter order ("#" last). */
export function letterGroups(all: readonly TagItem[]): { letter: string; items: TagItem[] }[] {
  const groups = new Map<string, TagItem[]>();
  for (const it of all) { const l = letterOf(it.name.replace(/^#/, '')); groups.set(l, [...(groups.get(l) ?? []), it]); }
  return [...groups].sort((a, b) => (a[0] === '#' ? 1 : b[0] === '#' ? -1 : a[0].localeCompare(b[0]))).map(([letter, items]) => ({ letter, items }));
}

/** Everything the search box needs, for /<lang>/tags/index.json: tags and titles. */
export async function searchIndex(lang: Lang, kindLabel: (k: TagKind) => string, docLabel: (k: 'project' | 'essay' | 'note') => string) {
  const c = await tagCatalogue(lang);
  const projects = await projectsOf(lang);
  const writing = await writingOf(lang);
  const notes = c.libraryLang === lang ? await notesOf(lang) : await notesOf(c.libraryLang);
  return {
    // every href with the deployment base (the routes already carry it; a tag path does not), so the script adds nothing
    tags: c.all.map((t) => [t.name, t.tag, kindLabel(t.kind), t.count, withBase(t.href)] as const),
    docs: [
      ...projects.map((p) => [p.data.title, docLabel('project'), workRoute(p.data.slug, lang)] as const),
      ...writing.map((e) => [e.data.title, docLabel('essay'), writingRoute(e.data.slug, lang)] as const),
      ...notes.map((r) => [r.entry.data.title, docLabel('note'), noteRoute(r.entry.data.slug, c.libraryLang)] as const),
    ],
  };
}
