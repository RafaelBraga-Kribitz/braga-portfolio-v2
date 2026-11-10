// The tool rows the home page's 03 Tools section and the tools index share.
// Projects and essays are not listed here: they come from the content
// collections (src/content.config.ts) through src/lib/collections.ts. The
// tools are pages, not Markdown, but their words are the vault's: each
// tool has a note in website_vault/Site/<lang>/ (code, title, summary,
// domain, status, and the page's heading, lead and meta line), read
// through src/lib/vault/copy.mjs (owner, 10 Nov 2026).
//
//   tools     the two benches of BUILD-BRIEF §4 (codes 03-01, 03-02)

import type { Lang } from './site';
import type { StatusState } from './i18n';
import { copyOf } from './vault/copy.mjs';

export type ToolPage = 'tools.confusion-matrix' | 'tools.ab-sample-size';

export interface ToolRow {
  code: string;
  page: ToolPage;
  title: string;
  sub: string;
  domain: string;
  status: StatusState;
}

/** Route id → the tool's note in website_vault/Site/<lang>/. */
const TOOL_NOTES = {
  'tools.confusion-matrix': 'Confusion matrix',
  'tools.ab-sample-size': 'AB sample size',
} as const;

/** A tool page's own words: the browser title, the h1, the lead, the description, the meta line. */
export function toolCopy(page: ToolPage, lang: Lang): { code: string; title: string; h1: string; lead: string; seo: string; meta: string[] } {
  const c = copyOf(TOOL_NOTES[page], lang);
  return { code: c.code, title: c.title, h1: c.heading, lead: c.lead, seo: c.seo_description, meta: c.meta };
}

/** The two tool rows of a language, in code order. */
export function tools(lang: Lang): ToolRow[] {
  return (Object.keys(TOOL_NOTES) as ToolPage[])
    .map((page) => {
      const c = copyOf(TOOL_NOTES[page], lang);
      return { code: c.code as string, page, title: c.title as string, sub: c.summary as string, domain: c.domain as string, status: c.status as StatusState };
    })
    .sort((a, b) => a.code.localeCompare(b.code));
}

/** The tools index's own words (website_vault/Site/<lang>/Tools.md). */
export function toolsIndexCopy(lang: Lang): { title: string; description: string; claim: string; prose: string } {
  const c = copyOf('Tools', lang);
  return { title: c.title, description: c.seo_description, claim: c.claim, prose: c.prose };
}
