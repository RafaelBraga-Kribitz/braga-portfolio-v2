// Structured data (schema.org JSON-LD), read by search engines and answer
// engines as the site's identity (website audit, SEO-026/027, AEO-005/006).
// Every value comes from src/lib/site.ts or from the page's own entry, so
// the JSON-LD cannot say more than the page does: no email (the address is
// never in the HTML, src/lib/contact.mjs), no street address, no claim the
// visible page does not make. Links that are empty strings in site.ts are
// left out of sameAs, as the templates leave them out of the footer.
//
// Which page carries what:
//   home      WebSite + Person
//   about     ProfilePage whose mainEntity is the Person (with the portrait)
//   work, writing  Article, its author the Person by @id
// Base.astro renders the graph as <script type="application/ld+json">
// (data, not code: gate L-03 lets it through).
import { site, type Lang } from './site';
import { absolute, route } from './routes';

type Node = Record<string, unknown>;

/** One Person across both languages and every page. */
const PERSON_ID = `${absolute('/')}#person`;
const WEBSITE_ID = `${absolute('/')}#website`;

function person(lang: Lang, image?: string): Node {
  const sameAs = [site.github, site.linkedin, site.kaggle].filter(Boolean);
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    jobTitle: site.role[lang],
    url: absolute(route('about', lang)),
    homeLocation: { '@type': 'Place', name: site.location[lang] },
    ...(image ? { image } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

/** The author reference of a document: enough to resolve without the home page. */
const author = (lang: Lang): Node => ({ '@type': 'Person', '@id': PERSON_ID, name: site.name, url: absolute(route('about', lang)) });

export function homeGraph(lang: Lang, description: string): Node[] {
  return [
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: absolute('/'),
      name: site.name,
      description,
      inLanguage: ['en', 'de'],
      publisher: { '@id': PERSON_ID },
    },
    person(lang),
  ];
}

export function profileGraph(lang: Lang, opts: { title: string; description: string; image?: string; updated?: string }): Node[] {
  const url = absolute(route('about', lang));
  return [{
    '@type': 'ProfilePage',
    '@id': `${url}#page`,
    url,
    name: opts.title,
    description: opts.description,
    inLanguage: lang,
    isPartOf: { '@id': WEBSITE_ID },
    ...(opts.updated ? { dateModified: opts.updated } : {}),
    mainEntity: person(lang, opts.image && absolute(opts.image)),
  }];
}

export function articleGraph(lang: Lang, opts: { path: string; title: string; description: string; date: string; updated?: string; image?: string }): Node[] {
  const url = absolute(opts.path);
  return [{
    '@type': 'Article',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: opts.title,
    description: opts.description,
    inLanguage: lang,
    datePublished: opts.date,
    dateModified: opts.updated ?? opts.date,
    image: absolute(opts.image ?? '/share-card.png'),
    author: author(lang),
    isPartOf: { '@id': WEBSITE_ID },
  }];
}

/** The <script> body: one @graph, with "<" escaped so no string can close the element. */
export function jsonLd(nodes: Node[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
}
