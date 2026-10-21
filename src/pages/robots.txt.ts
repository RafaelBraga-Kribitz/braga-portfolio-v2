// /robots.txt — every crawler may read every page; the sitemap is named
// absolutely. Pages that must stay out of an index (the kitchen sink, the
// 404) say so themselves with <meta name="robots" content="noindex">.
import type { APIRoute } from 'astro';
import { absolute } from '../lib/routes';

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${absolute('/sitemap.xml')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
