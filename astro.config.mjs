// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
// markdown pipeline (content-pipeline step) ----------------------------------
// Astro 7 renders Markdown with Sätteri; remark/rehype (unified) plugins only
// run on @astrojs/markdown-remark, which is not installed. The plugins below
// are Sätteri mdast/hast visitors doing the same jobs (src/content/README.md).
import { satteri } from '@astrojs/markdown-satteri';
import mathGuard from './src/lib/remark/math.mjs';
import codeLang from './src/lib/remark/code-lang.mjs';
import callouts from './src/lib/remark/callouts.mjs';
import taskLists from './src/lib/remark/task-lists.mjs';
import katex from './src/lib/rehype/katex.mjs';
import tables from './src/lib/rehype/tables.mjs';
import code from './src/lib/rehype/code.mjs';
import math from './src/lib/rehype/math.mjs';
import headings from './src/lib/rehype/headings.mjs';
import footnotes from './src/lib/rehype/footnotes.mjs';
import links from './src/lib/rehype/links.mjs';

// Origin and base path (DEPLOY.md). The origin is the GitHub Pages user
// site of the account RafaelBraga-Kribitz (host names are lower case). A
// project-page deploy serves under /<repo>/: build with SITE_BASE=/<repo>/
// and every internal URL (routes.ts, Base.astro, the feed, the sitemap,
// robots, Markdown links through links.mjs) carries it. Default '/'.
const base = normaliseBase(process.env.SITE_BASE);

/** '' | 'x' | '/x' | '/x/' → '/' | '/x/' @param {string | undefined} raw */
function normaliseBase(raw) {
  const s = (raw ?? '').trim().replace(/^\/+|\/+$/g, '');
  return s ? `/${s}/` : '/';
}

// Static site. Two built route trees (/en/, /de/) joined by plain links.
// The markdown pipeline (remark/rehype plugins) is configured in the
// `markdown` block below by the content-pipeline step.
export default defineConfig({
  site: 'https://rafaelbraga-kribitz.github.io',
  base,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [preact(), mdx()],
  markdown: {
    // Prism is class-based (<span class="token keyword">), never inline
    // styles; code.mjs maps its classes onto the six tok-* classes (D-035).
    syntaxHighlight: 'prism',
    processor: satteri({
      features: {
        // gfm: true — tables, footnotes, strikethrough, task lists (the
        // last refused by task-lists.mjs: Sätteri has no switch for them). The
        // footnote strings are English here; footnotes.mjs localises them
        // for a German document. The back-reference glyph is ← (D-030).
        gfm: { footnotes: { label: 'Footnotes', backContent: '←', backLabel: 'Back to reference {reference}' } },
        // remark-math's job: $…$ inline, $$…$$ display (math.mjs guards prices)
        math: true,
        // smartypants: false — quotes and dashes are authored
        smartPunctuation: false,
      },
      // the remark phase, in order: the $-price guard, fence languages Prism
      // cannot load → text (else their code reaches the page as raw HTML),
      // GFM task lists refused (no checkbox in the design system), then
      // ==marks== and callouts (bars included: the evidence figure)
      mdastPlugins: [mathGuard, codeLang, taskLists, callouts],
      // the rehype phase, in order. headings and footnotes are factories,
      // passed uncalled: Sätteri calls them once per document, so each page
      // gets its own slugger and its own language.
      hastPlugins: [
        // rehype-katex's job, as native MathML only (no HTML layer, so no
        // inline style and no KaTeX stylesheet; decision of 21 Oct 2026)
        katex({ strict: false }),
        // align attributes; the .table-scroll wrapper, keyboard-reachable
        tables,
        code,
        math,
        headings,
        footnotes,
        // root-relative links in Markdown get the base path (none at '/')
        links({ base }),
      ],
    }),
  },
});
