// /feed.xml — RSS 2.0 over the English writing collection (essays and
// notes, drafts excluded), newest first. While the collection is empty the
// feed is a valid channel with no items. Every link is absolute and carries
// the base path (src/lib/routes.ts).
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { site } from '../lib/site';
import { writingRoute, route, absolute } from '../lib/routes';
import { writingOf } from '../lib/collections';

export const GET: APIRoute = async () => {
  const entries = (await writingOf('en')).sort((a, b) => b.data.date.localeCompare(a.data.date));
  return rss({
    title: `${site.name} · Writing`,
    description: 'Essays and notes on marketing measurement and decisions.',
    site: absolute(route('home', 'en')),
    items: entries.map((e) => ({
      title: e.data.title,
      description: e.data.summary,
      pubDate: new Date(`${e.data.date}T00:00:00Z`),
      link: absolute(writingRoute(e.data.slug, 'en')),
      categories: e.data.tags,
    })),
    customData: '<language>en-gb</language>',
    trailingSlash: true,
  });
};
