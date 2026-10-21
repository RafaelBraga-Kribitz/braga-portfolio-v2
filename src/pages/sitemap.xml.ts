// /sitemap.xml — every indexable page of the site map (BUILD-BRIEF §4) in
// both languages, each <url> carrying its hreflang alternates (en, de,
// x-default) as xhtml:link, the same pairs the pages declare in <head>.
// Excluded: the noindex pages (the kitchen sink, the 404) and the root
// redirect. Projects and essays come from src/lib/catalogue.ts until the
// content collections hold them.
import type { APIRoute } from 'astro';
import { LANGS } from '../lib/site';
import { routePair, alternates, absolute, type PageId, type StaticPageId } from '../lib/routes';
import { projects, essays } from '../lib/catalogue';

const NOINDEX: readonly StaticPageId[] = ['system', 'notfound'];
const STATIC: readonly StaticPageId[] = [
  'home', 'work', 'writing', 'about', 'tools', 'tools.confusion-matrix', 'tools.ab-sample-size',
  'impressum', 'privacy', 'accessibility', 'system', 'notfound',
];

const pages: PageId[] = [
  ...STATIC.filter((id) => !NOINDEX.includes(id)),
  ...projects.map((p) => `work.${p.slug}` as const),
  ...essays.map((e) => `writing.${e.slug}` as const),
];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = () => {
  const urls = pages.flatMap((id) => {
    const pair = routePair(id);
    const links = alternates(id).map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}"/>`).join('\n');
    return LANGS.map((lang) => `  <url>\n    <loc>${esc(absolute(pair[lang]))}</loc>\n${links}\n  </url>`);
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
