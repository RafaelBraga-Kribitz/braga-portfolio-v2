// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import mdx from '@astrojs/mdx';

// Static site. Two built route trees (/en/, /de/) joined by plain links.
// The markdown pipeline (remark/rehype plugins) is configured in the
// `markdown` block below by the content-pipeline step.
export default defineConfig({
  site: 'https://rafaelbragakribitz.github.io',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [preact(), mdx()],
  markdown: {},
});
