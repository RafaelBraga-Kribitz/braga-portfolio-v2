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
import katex from './src/lib/rehype/katex.mjs';
import tables from './src/lib/rehype/tables.mjs';
import code from './src/lib/rehype/code.mjs';
import math from './src/lib/rehype/math.mjs';
import headings from './src/lib/rehype/headings.mjs';
import footnotes from './src/lib/rehype/footnotes.mjs';

// Static site. Two built route trees (/en/, /de/) joined by plain links.
// The markdown pipeline (remark/rehype plugins) is configured in the
// `markdown` block below by the content-pipeline step.
export default defineConfig({
  site: 'https://rafaelbragakribitz.github.io',
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
        // gfm: true — tables, footnotes, strikethrough, task lists. The
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
      // then ==marks== and callouts
      mdastPlugins: [mathGuard, codeLang, callouts],
      // the rehype phase, in order. headings and footnotes are factories,
      // passed uncalled: Sätteri calls them once per document, so each page
      // gets its own slugger and its own language.
      hastPlugins: [
        katex({ output: 'htmlAndMathml', strict: false }), // rehype-katex's job
        tables,
        code,
        math,
        headings,
        footnotes,
      ],
    }),
  },
});
