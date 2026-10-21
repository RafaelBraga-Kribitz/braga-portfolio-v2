// src/content.config.ts — the four content collections (Astro 7 content
// layer, glob loader). Markdown only (Obsidian-compatible): the authoring
// guide is src/content/README.md.
//
//   projects  src/content/projects/{en,de}/<slug>.md   → /<lang>/work/<slug>/
//   writing   src/content/writing/{en,de}/<slug>.md    → /<lang>/writing/<slug>/
//   pages     src/content/pages/{en,de}/<slug>.md      → about, system
//   legal     src/content/legal/{en,de}/<file>.md      → impressum, privacy,
//             accessibility, by the `page` key (the German URLs differ:
//             /de/datenschutz/, /de/barrierefreiheit/; src/lib/routes.ts)
//
// Entry ids are the path without the extension ("en/warehouse-humanoid-tco"),
// never the frontmatter slug: the slug is shared by the two languages of one
// document, so it cannot be the id (the glob loader would otherwise use it and
// the German entry would overwrite the English one). The folder and the
// frontmatter `lang` must agree; a mismatch fails the build.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
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

const lang = z.enum(LANGS);
const tags = z.array(z.string().min(1)).default([]);

/** One tile of the metric strip. `value` is the formatted figure as it reads ("€453,000", "38 s"); `accent` marks the one earned figure (D-025). */
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
    repository: z.url().optional(),
    draft: z.boolean().default(false),
    translationStatus: z.enum(TRANSLATION_STATUSES).default('approved'),
  })
  .refine((p) => p.metrics.filter((m) => m.accent).length <= 1, {
    message: 'at most one metric carries accent: true (D-025, one earned figure per view)',
    path: ['metrics'],
  });

export const writingSchema = z.object({
  title: z.string().min(1),
  /** Optional document code ("02-01"); equation numbers derive from it. */
  code: code.optional(),
  kind: z.enum(WRITING_KINDS),
  date: isoDate,
  updated: isoDate.optional(),
  summary: z.string().min(1),
  /** Optional standfirst under the title (.doc-lead). */
  lead: z.string().min(1).optional(),
  tags,
  lang,
  slug,
  draft: z.boolean().default(false),
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
  draft: z.boolean().default(false),
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
  draft: z.boolean().default(false),
  translationStatus: z.enum(TRANSLATION_STATUSES).default('approved'),
});

export type ProjectData = z.infer<typeof projectSchema>;
export type WritingData = z.infer<typeof writingSchema>;
export type PageData = z.infer<typeof pageSchema>;
export type LegalData = z.infer<typeof legalSchema>;
export type Metric = z.infer<typeof metric>;

/* ---------- loader ---------- */

/**
 * The entry id is the relative path without the extension: "en/<file>". The
 * folder must match the frontmatter `lang`.
 */
function pathId({ entry, data }: { entry: string; data: Record<string, unknown> }): string {
  const id = entry.replace(/\.md$/, '');
  const folder = id.split('/')[0];
  if (data.lang !== undefined && data.lang !== folder) {
    throw new Error(`content: ${entry} sits in ${folder}/ but its frontmatter says lang: ${String(data.lang)}`);
  }
  return id;
}

const loader = (collection: string) =>
  glob({ pattern: '{en,de}/*.md', base: `./src/content/${collection}`, generateId: pathId });

export const collections = {
  projects: defineCollection({ loader: loader('projects'), schema: projectSchema }),
  writing: defineCollection({ loader: loader('writing'), schema: writingSchema }),
  pages: defineCollection({ loader: loader('pages'), schema: pageSchema }),
  legal: defineCollection({ loader: loader('legal'), schema: legalSchema }),
};
