// src/content.config.ts — the three content collections (Astro 7 content
// layer, glob loader). Markdown only (Obsidian-compatible): the authoring
// guide is src/content/README.md.
//
//   projects  src/content/projects/{en,de}/<slug>.md
//   writing   src/content/writing/{en,de}/<slug>.md
//   legal     src/content/legal/{en,de}/<slug>.md
//
// Entry ids are the path without the extension ("en/warehouse-humanoid-tco"),
// never the frontmatter slug: the slug is shared by the two languages of one
// document, so it cannot be the id (the glob loader would otherwise use it and
// the German entry would overwrite the English one). The folder and the
// frontmatter `lang` must agree; a mismatch fails the build.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/* ---------- vocabularies ---------- */

export const LANGS = ['en', 'de'] as const;
export type Lang = (typeof LANGS)[number];

/** D-029: five states, one square each, always with a label. */
export const STATUSES = ['complete', 'functional', 'under-revision', 'in-build', 'archived'] as const;
export type Status = (typeof STATUSES)[number];

export const PROJECT_KINDS = ['case', 'brief'] as const;
export type ProjectKind = (typeof PROJECT_KINDS)[number];

export const WRITING_KINDS = ['essay', 'note'] as const;
export type WritingKind = (typeof WRITING_KINDS)[number];

/** A German page stays `draft` (status mark in-build, "Entwurf · Freigabe ausstehend") until the owner approves it. */
export const TRANSLATION_STATUSES = ['approved', 'draft'] as const;
export type TranslationStatus = (typeof TRANSLATION_STATUSES)[number];

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

export const legalSchema = z.object({
  title: z.string().min(1),
  slug,
  lang,
  updated: isoDate,
  /** The page's meta description; optional, the page may supply its own. */
  summary: z.string().min(1).optional(),
  draft: z.boolean().default(false),
  translationStatus: z.enum(TRANSLATION_STATUSES).default('approved'),
});

export type ProjectData = z.infer<typeof projectSchema>;
export type WritingData = z.infer<typeof writingSchema>;
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
  legal: defineCollection({ loader: loader('legal'), schema: legalSchema }),
};
