// /feed.xml — RSS 2.0 over the English writing collection (essays and
// notes, drafts excluded), newest first. The collection is empty until
// the content migration: the feed is then a valid channel with no items.
import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../lib/site';
import { writingRoute, absolute } from '../lib/routes';

export const GET: APIRoute = async () => {
  const entries = (await getCollection('writing', (e) => e.data.lang === 'en' && !e.data.draft))
    .sort((a, b) => b.data.date.localeCompare(a.data.date));
  return rss({
    title: `${site.name} · Writing`,
    description: 'Essays and notes on marketing measurement and decisions.',
    site: site.url,
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
