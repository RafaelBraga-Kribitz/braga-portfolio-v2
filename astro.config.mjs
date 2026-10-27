// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';
// markdown pipeline (content-pipeline step) ----------------------------------
// Astro 7 renders Markdown with Sätteri; remark/rehype (unified) plugins only
// run on @astrojs/markdown-remark, which is not installed. The plugins below
// are Sätteri mdast/hast visitors doing the same jobs (vault/_guide/Syntax reference.md).
import { satteri } from '@astrojs/markdown-satteri';
import mathGuard from './src/lib/remark/math.mjs';
import codeLang from './src/lib/remark/code-lang.mjs';
import callouts from './src/lib/remark/callouts.mjs';
import obsidian from './src/lib/remark/obsidian.mjs';
import diagrams from './src/lib/remark/diagrams.mjs';
import buildlog from './src/lib/remark/buildlog.mjs';
import katex from './src/lib/rehype/katex.mjs';
import tables from './src/lib/rehype/tables.mjs';
import code from './src/lib/rehype/code.mjs';
import math from './src/lib/rehype/math.mjs';
import headings from './src/lib/rehype/headings.mjs';
import sidenotes from './src/lib/remark/sidenotes.mjs';
import footnotes from './src/lib/rehype/footnotes.mjs';
import links from './src/lib/rehype/links.mjs';
import vaultMedia from './src/integrations/vault-media.mjs';

// Origin and base path (DEPLOY.md). The origin is the custom domain
// rafaelbragakribitz.com (public/CNAME), served by GitHub Pages at the
// root, so the base is '/'. A project-page deploy serves under /<repo>/: build with SITE_BASE=/<repo>/
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
  site: 'https://rafaelbragakribitz.com',
  base,
  output: 'static',
  trailingSlash: 'always',
  // inlineStylesheets: the one stylesheet goes into each page's <head>, not
  // a /_astro/ file. GitHub Pages caches every file for 10 minutes and takes
  // no headers, so a separate stylesheet buys little on repeat visits and
  // costs a render-blocking request (and a step in the font chain) on the
  // first one.
  build: { format: 'directory', inlineStylesheets: 'always' },
  // vaultMedia: the vault's attachments at /media/ (src/integrations/vault-media.mjs)
  integrations: [preact(), mdx(), vaultMedia({ base })],
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
      // ```mermaid drawn at build and ```dataview queries run over the vault
      // (src/lib/remark/diagrams.mjs), ```buildlog drawn from the git history
      // snapshot (src/lib/remark/buildlog.mjs), Obsidian's syntax (the H1 title, [[links]], ![[embeds]], #tags,
      // %%comments%%, Dataview fields, tasks; src/lib/remark/obsidian.mjs),
      // then ==marks== and callouts (bars included: the evidence figure)
      mdastPlugins: [mathGuard, codeLang, diagrams, buildlog, obsidian, sidenotes, callouts],
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
