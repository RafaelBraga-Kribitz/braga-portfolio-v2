// /<lang>/tags/index.json (owner, 1 Nov 2026; D-061): what the tag search
// matches against, fetched by /scripts/tags.js on the first keystroke.
// Arrays, not objects, to stay small: a tag is [name, tag, kind, count,
// href], a title [title, kind, href]. Every href carries the deployment
// base (SITE_BASE), so the script adds nothing to it. Grows linearly with the
// content: ~60 bytes a tag, ~90 a title; ten times the site is ~0.5 MB,
// ~100 KB over the wire, loaded once and only when someone types.
import type { APIRoute } from 'astro';
import { LANGS } from '@/lib/site';
import { t, type Lang } from '@/lib/i18n';
import { searchIndex } from '@/lib/tags';

export function getStaticPaths() {
  return LANGS.map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang as Lang;
  const index = await searchIndex(lang, (k) => t(lang, `tags.kind.${k}` as 'tags.kind.tag'), (k) => t(lang, `kind.${k}` as 'kind.note'));
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
