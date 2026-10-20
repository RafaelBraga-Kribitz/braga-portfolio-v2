// The page registry of BUILD-BRIEF §4. Every page exists under /en/ and
// /de/ with the same path except the German legal slugs. Project and
// essay routes are generated from slugs; "work.<slug>" and
// "writing.<slug>" are valid page ids.

import { site, type Lang } from './site';
import { t, otherLang, type ChromeKey } from './i18n';

export type DoorId = 'work' | 'writing' | 'about' | 'tools';
export type DoorCode = '01' | '02' | '03' | '04';
export interface Door { code: DoorCode; id: DoorId }

/** Header doors, in order. Codes match the home Index. */
export const doors: readonly Door[] = [
  { code: '01', id: 'work' },
  { code: '02', id: 'writing' },
  { code: '03', id: 'about' },
  { code: '04', id: 'tools' },
];

export type StaticPageId =
  | 'home'
  | 'work'
  | 'about'
  | 'writing'
  | 'tools'
  | 'tools.confusion-matrix'
  | 'tools.ab-sample-size'
  | 'impressum'
  | 'privacy'
  | 'accessibility'
  | 'system'
  | 'notfound';

export type PageId = StaticPageId | `work.${string}` | `writing.${string}`;
export interface RoutePair { en: string; de: string }

export const routes: Record<StaticPageId, RoutePair> = {
  home: { en: '/en/', de: '/de/' },
  work: { en: '/en/work/', de: '/de/work/' },
  about: { en: '/en/about/', de: '/de/about/' },
  writing: { en: '/en/writing/', de: '/de/writing/' },
  tools: { en: '/en/tools/', de: '/de/tools/' },
  'tools.confusion-matrix': { en: '/en/tools/confusion-matrix/', de: '/de/tools/confusion-matrix/' },
  'tools.ab-sample-size': { en: '/en/tools/ab-sample-size/', de: '/de/tools/ab-sample-size/' },
  impressum: { en: '/en/impressum/', de: '/de/impressum/' },
  privacy: { en: '/en/privacy/', de: '/de/datenschutz/' },
  accessibility: { en: '/en/accessibility/', de: '/de/barrierefreiheit/' },
  system: { en: '/en/system/', de: '/de/system/' },
  // GitHub Pages serves one 404.html: English with the German line.
  notfound: { en: '/404.html', de: '/404.html' },
};

export function workRoute(slug: string, lang: Lang): string {
  return `/${lang}/work/${slug}/`;
}

export function writingRoute(slug: string, lang: Lang): string {
  return `/${lang}/writing/${slug}/`;
}

/** Both language paths of a page id. Throws on an unknown id. */
export function routePair(pageId: PageId): RoutePair {
  if (pageId in routes) return routes[pageId as StaticPageId];
  if (pageId.startsWith('work.')) {
    const slug = pageId.slice('work.'.length);
    return { en: workRoute(slug, 'en'), de: workRoute(slug, 'de') };
  }
  if (pageId.startsWith('writing.')) {
    const slug = pageId.slice('writing.'.length);
    return { en: writingRoute(slug, 'en'), de: writingRoute(slug, 'de') };
  }
  throw new Error(`routes: unknown page id "${pageId}"`);
}

/** Root-relative path of a page in a language. */
export function route(pageId: PageId, lang: Lang): string {
  return routePair(pageId)[lang];
}

/** Absolute URL on the production origin (astro.config `site`). */
export function absolute(path: string): string {
  return new URL(path, site.url).href;
}

export interface Alternate { hreflang: 'en' | 'de' | 'x-default'; href: string }

/** hreflang alternates: en, de, and x-default pointing at English. */
export function alternates(pageId: PageId): Alternate[] {
  const pair = routePair(pageId);
  return [
    { hreflang: 'en', href: absolute(pair.en) },
    { hreflang: 'de', href: absolute(pair.de) },
    { hreflang: 'x-default', href: absolute(pair.en) },
  ];
}

export function doorLabel(door: Door, lang: Lang): string {
  return t(lang, `door.${door.id}` as ChromeKey);
}

export interface FooterLink {
  label: string;
  href: string;
  /** Leaves the site: rendered with the ↗ glyph. */
  external?: boolean;
  hreflang?: Lang;
  lang?: Lang;
}
export interface FooterGroup { title: string; links: FooterLink[] }

/** The four footer groups of D-013 for a language. */
export function footerGroups(lang: Lang): FooterGroup[] {
  const other = otherLang(lang);
  const elsewhere: FooterLink[] = [{ label: t(lang, 'link.github'), href: site.github, external: true }];
  if (site.linkedin) elsewhere.push({ label: t(lang, 'link.linkedin'), href: site.linkedin, external: true });
  if (site.kaggle) elsewhere.push({ label: t(lang, 'link.kaggle'), href: site.kaggle, external: true });
  return [
    {
      title: t(lang, 'footer.index'),
      links: doors.map((d) => ({ label: `${d.code} ${doorLabel(d, lang)}`, href: route(d.id, lang) })),
    },
    {
      title: t(lang, 'footer.site'),
      links: [
        { label: t(lang, 'link.home'), href: route('home', lang) },
        { label: t(lang, 'link.contact'), href: `mailto:${site.email}` },
        { label: t(lang, 'link.language'), href: route('home', other), hreflang: other, lang: other },
      ],
    },
    { title: t(lang, 'footer.elsewhere'), links: elsewhere },
    {
      title: t(lang, 'footer.others'),
      links: [
        { label: t(lang, 'link.sitemap'), href: absolute('/sitemap.xml') },
        { label: t(lang, 'link.rss'), href: absolute('/feed.xml') },
        { label: t(lang, 'link.impressum'), href: route('impressum', lang) },
        { label: t(lang, 'link.privacy'), href: route('privacy', lang) },
        { label: t(lang, 'link.accessibility'), href: route('accessibility', lang) },
      ],
    },
  ];
}
