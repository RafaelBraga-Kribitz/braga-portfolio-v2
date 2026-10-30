// src/content.config.ts — the four content collections (Astro 7 content
// layer), read from the Obsidian vault at vault/ (owner, 23 Oct 2026).
// The vault conventions (folders, the H1 as title, #status/… tags,
// `publish: true`) live in src/lib/vault/meta.mjs; the writing guide is
// vault/_guide/Start here.md.
//
//   projects  vault/Projects/{en,de}/**.md         → /<lang>/work/<slug>/
//   writing   vault/Essays/{en,de}/**.md           → /<lang>/writing/<slug>/
//   notes     vault/Notes/{en,de}/**.md            → /<lang>/notes/<slug>/, the
//             library, indexed by its folder tree (owner, 25 Oct 2026)
//   pages     vault/Pages/{en,de}/*.md             → about, system
//   legal     vault/Legal/{en,de}/*.md             → impressum, privacy,
//             accessibility, by the `page` key (the German URLs differ:
//             /de/datenschutz/, /de/barrierefreiheit/; src/lib/routes.ts)
//
// A note becomes an entry only with `publish: true` (and not dated in the
// future: scheduled publishing). Everything else in a site folder stays in
// the vault: it is read, never validated, never built. Entry ids are the
// vault path without the extension ("Projects/en/warehouse-humanoid-tco"),
// never the slug: the slug is shared by the two languages of one document.
// The language folder and a `lang` property, if set, must agree.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import type { Loader } from 'astro/loaders';
import { vaultLoader } from './lib/vault/loader.mjs';
import { z } from 'astro/zod';
import { LANGS, type Lang } from './lib/site';
import { STATUSES, type StatusState } from './lib/i18n';

/* ---------- vocabularies ----------
   The languages and the status states have one source each (src/lib/site.ts,
   src/lib/i18n.ts), shared with the chrome, so the schema and the pages
   cannot drift apart. */

export { LANGS, STATUSES };
export type { Lang };
/** D-029: five states, one square each, always with a label. */
export type Status = StatusState;

export const PROJECT_KINDS = ['case', 'brief'] as const;
export type ProjectKind = (typeof PROJECT_KINDS)[number];

export const WRITING_KINDS = ['essay', 'note'] as const;
export type WritingKind = (typeof WRITING_KINDS)[number];

/** A German page stays `draft` (status mark in-build, "Entwurf · Freigabe ausstehend") until the owner approves it. */
export const TRANSLATION_STATUSES = ['approved', 'draft'] as const;
export type TranslationStatus = (typeof TRANSLATION_STATUSES)[number];

/** The `pages` collection: one-off documents rendered with the document template. */
export const PAGE_SLUGS = ['about', 'system'] as const;
export type PageSlug = (typeof PAGE_SLUGS)[number];

/** The `legal` collection: the page each file is, a key shared by both languages (routes.ts page ids). */
export const LEGAL_PAGES = ['impressum', 'privacy', 'accessibility'] as const;
export type LegalPage = (typeof LEGAL_PAGES)[number];

/* ---------- field types ---------- */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * yyyy-mm-dd, kept as a string (src/lib/format.mjs `date()` reads it).
 * Write it quoted: "2026-09-16". An unquoted date is accepted (YAML hands
 * over a Date at UTC midnight, converted back here), but YAML rolls an
 * impossible unquoted day over (2026-02-30 → 2026-03-02) before the schema
 * sees it; a quoted impossible day fails. A date with a time fails.
 */
const isoDate = z.preprocess(
  (v) => (v instanceof Date && !Number.isNaN(v.getTime()) ? v.toISOString().replace(/T00:00:00\.000Z$/, '') : v),
  z
    .string()
    .regex(ISO_DATE, 'a date is yyyy-mm-dd')
    .refine((s) => {
      const d = new Date(`${s}T00:00:00Z`);
      return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
    }, 'not a calendar date'),
);

/** Lower-case kebab slug, shared by the EN and DE version of one document. */
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'a slug is lower-case kebab-case');

/** Document code "01-04" (section · item), as in the Site specimen. */
const code = z.string().regex(/^\d{2}-\d{2}$/, 'a code is two two-digit groups, e.g. 01-04');

/**
 * Essay code "02-01-008" (section · category · item; owner, 30 Oct 2026):
 * 02-01 is the essays and 02-02 the notes, so a new essay never moves the
 * notes' references, and three groups is the longest a code gets.
 */
const essayCode = z.string().regex(/^02-01-\d{3}$/, 'an essay code is 02-01 and a three-digit item, e.g. 02-01-008');

const lang = z.enum(LANGS);
const tags = z.array(z.string().min(1)).default([]);

/** Properties every published note may carry (Ghost's post settings, as Obsidian properties). */
const publishing = {
  /** Only `publish: true` builds (the loader drops the rest before validation). */
  publish: z.literal(true),
  /** Obsidian's draft switch; a draft never builds. */
  draft: z.boolean().default(false),
  /** Feature image: an attachment name or vault path (Ghost's feature image). */
  cover: z.string().min(1).optional(),
  cover_alt: z.string().optional(),
  /** Pinned first in its listings (Ghost's featured post). */
  featured: z.boolean().default(false),
  /** Overrides for search and sharing (Ghost's meta data). */
  seo_title: z.string().min(1).optional(),
  seo_description: z.string().min(1).optional(),
  canonical: z.url().optional(),
  aliases: z.array(z.string()).default([]),
};

/** One tile of the metric strip. `value` is the formatted figure as it reads ("€453,000", "38 s"); `accent` marks the strip's one earned figure (one accent per section). */
const metric = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  accent: z.boolean().optional(),
});

/* ---------- schemas ---------- */

export const projectSchema = z
  .object({
    title: z.string().min(1),
    code,
    kind: z.enum(PROJECT_KINDS),
    date: isoDate,
    /** Optional: the opener's meta row shows "Updated <date>" when set. */
    updated: isoDate.optional(),
    summary: z.string().min(1),
    lead: z.string().min(1),
    domain: z.string().min(1),
    status: z.enum(STATUSES),
    tags,
    lang,
    slug,
    metrics: z.array(metric).default([]),
    /** Technical keywords the project uses (owner, 30 Oct 2026), in the
        vocabulary of the job-market project's skills taxonomy (SQL, Python,
        Power BI, dbt…): the listings show the first five beside the meta,
        the project page shows all of them as tags, and each is a tag page. */
    stack: z.array(z.string().min(1)).default([]),
    repository: z.url().optional(),
    ...publishing,
    translationStatus: z.enum(TRANSLATION_STATUSES).default('approved'),
  })
  .refine((p) => p.metrics.filter((m) => m.accent).length <= 1, {
    message: 'at most one metric carries accent: true (one accent per section: the metric strip is one section)',
    path: ['metrics'],
  });

export const writingSchema = z.object({
  title: z.string().min(1),
  /** Optional essay code ("02-01-008"), kept for good once published; without it the essay is numbered by publication date. */
  code: essayCode.optional(),
  kind: z.enum(WRITING_KINDS),
  date: isoDate,
  updated: isoDate.optional(),
  summary: z.string().min(1),
  /** Optional standfirst under the title (.doc-lead). */
  lead: z.string().min(1).optional(),
  tags,
  lang,
  slug,
  ...publishing,
  translationStatus: z.enum(TRANSLATION_STATUSES).default('approved'),
});

export const pageSchema = z.object({
  title: z.string().min(1),
  /** about | system: the route is /<lang>/<slug>/. */
  slug: z.enum(PAGE_SLUGS),
  lang,
  /** The meta description and og:description. */
  summary: z.string().min(1),
  /** Optional standfirst under the title (.doc-lead). */
  lead: z.string().min(1).optional(),
  /** Optional document code ("03-01"); equation numbers derive from it. */
  code: code.optional(),
  /** Optional: the opener's meta row shows "Updated <date>" when set. */
  updated: isoDate.optional(),
  /** Optional: the language of the body when it is not the page's (the German kitchen sink may keep English content); sets lang on article.doc. */
  contentLang: lang.optional(),
  ...publishing,
  translationStatus: z.enum(TRANSLATION_STATUSES).default('approved'),
});

export const legalSchema = z.object({
  title: z.string().min(1),
  /** Which legal page this file is; the EN and DE file share it. The URL comes from src/lib/routes.ts (/de/datenschutz/ for privacy in German). */
  page: z.enum(LEGAL_PAGES),
  /** Optional, informational: the file name is free (impressum.md, datenschutz.md). */
  slug: slug.optional(),
  lang,
  /** "As of <date>" / "Stand <date>" in the opener's meta row. */
  updated: isoDate,
  /** The page's meta description. */
  summary: z.string().min(1),
  /** Optional standfirst under the title (.doc-lead). */
  lead: z.string().min(1).optional(),
  ...publishing,
  translationStatus: z.enum(TRANSLATION_STATUSES).default('approved'),
});

export type ProjectData = z.infer<typeof projectSchema>;
export type WritingData = z.infer<typeof writingSchema>;
export type PageData = z.infer<typeof pageSchema>;
export type LegalData = z.infer<typeof legalSchema>;
export type Metric = z.infer<typeof metric>;

/* ---------- loader ---------- */

/** The entry id is the vault path without the extension; the language folder must match a `lang` property. */
function pathId({ entry, data }: { entry: string; data: Record<string, unknown> }): string {
  const id = entry.replace(/\.md$/, '');
  const folder = id.split('/')[1];
  if (data.lang !== undefined && data.lang !== folder) {
    throw new Error(`vault: ${entry} sits in ${folder}/ but its properties say lang: ${String(data.lang)}`);
  }
  return id;
}

/**
 * Astro's glob loader over the vault, with the Obsidian reading put in
 * front of validation (src/lib/vault/loader.mjs).
 */
const vault = (name: string, folders: string[], filePattern = '**/*.md'): Loader =>
  vaultLoader(glob, { name, folders, filePattern, generateId: pathId }) as Loader;

export const collections = {
  projects: defineCollection({ loader: vault('projects', ['Projects']), schema: projectSchema }),
  writing: defineCollection({ loader: vault('writing', ['Essays']), schema: writingSchema }),
  notes: defineCollection({ loader: vault('notes', ['Notes']), schema: writingSchema }),
  pages: defineCollection({ loader: vault('pages', ['Pages'], '*.md'), schema: pageSchema }),
  legal: defineCollection({ loader: vault('legal', ['Legal'], '*.md'), schema: legalSchema }),
};
