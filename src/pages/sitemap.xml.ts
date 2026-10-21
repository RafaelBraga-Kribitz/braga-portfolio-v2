// /sitemap.xml — every indexable page of the site map (BUILD-BRIEF §4) in
// the languages it is built in, each <url> carrying its hreflang alternates
// as xhtml:link, the same pairs the pages declare in <head>. Excluded: the
// noindex pages (the kitchen sink, the 404) and the root redirect.
// Projects and essays come from the content collections, About and the
// legal pages from their entries (src/lib/collections.ts): a page whose
// Markdown is not written yet is not listed. Every URL is absolute and
// carries the base path (src/lib/routes.ts).
import type { APIRoute } from 'astro';
import { LANGS, type Lang } from '../lib/site';
import { routePair, absolute, legalPageIds, type PageId, type StaticPageId } from '../lib/routes';
import { slugLanguages, pageOf, legalOf } from '../lib/collections';

/** Pages built in both languages from code alone. */
const ALWAYS: readonly StaticPageId[] = ['home', 'work', 'writing', 'tools', 'tools.confusion-matrix', 'tools.ab-sample-size'];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const pages: { id: PageId; langs: Lang[] }[] = ALWAYS.map((id) => ({ id, langs: [...LANGS] }));
  const aboutLangs: Lang[] = [];
  for (const lang of LANGS) if (await pageOf('about', lang)) aboutLangs.push(lang);
  if (aboutLangs.length) pages.push({ id: 'about', langs: aboutLangs });
  for (const id of legalPageIds) {
    const langs: Lang[] = [];
    for (const lang of LANGS) if (await legalOf(id, lang)) langs.push(lang);
    if (langs.length) pages.push({ id, langs });
  }
  for (const [slug, set] of await slugLanguages('projects')) pages.push({ id: `work.${slug}`, langs: LANGS.filter((l) => set.has(l)) });
  for (const [slug, set] of await slugLanguages('writing')) pages.push({ id: `writing.${slug}`, langs: LANGS.filter((l) => set.has(l)) });

  const urls = pages.flatMap(({ id, langs }) => {
    const pair = routePair(id);
    const alts = [
      ...langs.map((l) => ({ hreflang: l, href: absolute(pair[l]) })),
      ...(langs.includes('en') ? [{ hreflang: 'x-default', href: absolute(pair.en) }] : []),
    ];
    const links = alts.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}"/>`).join('\n');
    return langs.map((lang) => `  <url>\n    <loc>${esc(absolute(pair[lang]))}</loc>\n${links}\n  </url>`);
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
