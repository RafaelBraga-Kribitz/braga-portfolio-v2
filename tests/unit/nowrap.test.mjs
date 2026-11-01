import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createSatteriMarkdownProcessor } from '@astrojs/markdown-satteri';
import nowrap from '../../src/lib/remark/nowrap.mjs';

const processor = await createSatteriMarkdownProcessor({ syntaxHighlight: false, features: { math: true, gfm: true }, mdastPlugins: [nowrap] });
const render = async (source) => (await processor.render(source)).code;

test('Satteri wraps short document references and decimal intervals in running text', async () => {
  const html = await render('See 01-04, **02-01-003** and 0.50–0.90; also 0,50–0,90.');
  for (const text of ['01-04', '02-01-003', '0.50–0.90', '0,50–0,90']) assert.ok(html.includes(`<span class="text-nowrap">${text}</span>`), html);
  assert.ok(html.includes('<strong><span'), html);
});

test('Satteri leaves code, math, links, URLs, dates and identifiers untouched', async () => {
  const html = await render('`01-04` and $01-04$ and [01-04](/01-04/) and <https://example.test/?v=01-04>\n\nhttps://example.test/?v=01-04 & 2026-01-04 & 2023–2026 & 0.123456789012345–0.987654321098765 & ID01-04 & 01-04-extra\n\n```text\n01-04 0.50–0.90\n```');
  assert.equal(html.includes('text-nowrap'), false, html);
  assert.ok(html.includes('2026-01-04'), html);
  assert.ok(html.includes('href="/01-04/"'), html);
});

test('Satteri does not rewrite raw HTML or headings', async () => {
  const html = await render('# 01-04\n\n<div>01-04 0.50–0.90</div>');
  assert.equal(html.includes('text-nowrap'), false, html);
});

test('Satteri preserves Obsidian resolution next to wrapped references', async () => {
  const { default: obsidian } = await import('../../src/lib/remark/obsidian.mjs');
  const p = await createSatteriMarkdownProcessor({ syntaxHighlight: false, mdastPlugins: [obsidian, nowrap] });
  const html = (await p.render('See [[arithmetic_n_th_term]] and 01-04.', { frontmatter: { lang: 'en' } })).code;
  assert.ok(html.includes('href="/en/notes/arithmetic-n-th-term/"'), html);
  assert.ok(html.includes('<span class="text-nowrap">01-04</span>.'), html);
});
