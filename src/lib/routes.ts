// The page registry of BUILD-BRIEF §4. Every page exists under /en/ and
// /de/ with the same path except the German legal slugs. Project and
// essay routes are generated from slugs; "work.<slug>" and
// "writing.<slug>" are valid page ids.
//
// Base path (DEPLOY.md): the table below holds paths from the site root
// ("/en/work/"); every function that hands a URL to a template, a feed or
// a sitemap puts the configured base in front of it (import.meta.env.
// BASE_URL, from `base` in astro.config.mjs, which reads SITE_BASE). At the
// default base "/" nothing changes; at "/braga-portfolio/" route('work',
// 'en') is "/braga-portfolio/en/work/". withBase() is idempotent, so a
// path that already carries the base is left alone.

import { site, type Lang } from './site';
import { t, otherLang, type ChromeKey } from './i18n';

export type DoorId = 'work' | 'writing' | 'about' | 'tools';
export type DoorCode = '01' | '02' | '03' | '04';
export interface Door { code: DoorCode; id: DoorId }

/** Header doors, in order. Codes match the home Index. */
export const doors: readonly Door[] = [
  { code: '01', id: 'work' },
  { code: '02', id: 'writing' },
  { code: '03', id: 'tools' },
  { code: '04', id: 'about' },
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

/** The legal pages, in footer order. Their German paths differ from the English ones. */
export const legalPageIds = ['impressum', 'privacy', 'accessibility'] as const;
export type LegalPageId = (typeof legalPageIds)[number];

/** Paths from the site root, without the base. Read them through route() / routePair(). */
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

/* ---------- base path ---------- */

/** The configured base without its trailing slash: '' at the root, '/braga-portfolio' on a project page. */
export const BASE: string = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '');

/** A root path with the base in front ("/en/" → "/braga-portfolio/en/"). Idempotent; leaves URLs with a scheme alone. */
export function withBase(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  if (!BASE || path === BASE || path.startsWith(`${BASE}/`)) return path;
  return BASE + path;
}

/** The last path segment of a page's route in a language, without slashes ("/de/datenschutz/" → "datenschutz"). */
export function segment(pageId: StaticPageId, lang: Lang): string {
  const parts = routes[pageId][lang].split('/').filter(Boolean);
  return parts[parts.length - 1] ?? '';
}

/* ---------- routes ---------- */

export function workRoute(slug: string, lang: Lang): string {
  return withBase(`/${lang}/work/${slug}/`);
}

export function writingRoute(slug: string, lang: Lang): string {
  return withBase(`/${lang}/writing/${slug}/`);
}

/** Both language paths of a page id, with the base. Throws on an unknown id. */
export function routePair(pageId: PageId): RoutePair {
  if (pageId in routes) {
    const pair = routes[pageId as StaticPageId];
    return { en: withBase(pair.en), de: withBase(pair.de) };
  }
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

/** Path of a page in a language, with the base. */
export function route(pageId: PageId, lang: Lang): string {
  return routePair(pageId)[lang];
}

/**
 * The contact section of the About page (UX pass, 22 Oct 2026): where the
 * header's and the footer's "Contact" lead, so the word opens a section
 * with the address, the copy button and the context, not a mail client.
 */
export function contactRoute(lang: Lang): string {
  return `${route('about', lang)}#${lang === 'de' ? 'kontakt' : 'contact'}`;
}

/** The keyboard section of the accessibility statement (the shortcut list without JavaScript). */
export function keysRoute(lang: Lang): string {
  return `${route('accessibility', lang)}#${lang === 'de' ? 'tastatur' : 'keyboard'}`;
}

/** Absolute URL on the production origin (astro.config `site`); the base is added when the path lacks it. */
export function absolute(path: string): string {
  return new URL(withBase(path), site.url).href;
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
  /** Opens the keyboard-shortcut panel when JavaScript runs. */
  keys?: boolean;
  hreflang?: Lang;
  lang?: Lang;
}
export interface FooterGroup { title: string; links: FooterLink[] }

/** The four footer groups of D-013 for a language, in the owner's order of 23 Oct 2026. */
export function footerGroups(lang: Lang): FooterGroup[] {
  const other = otherLang(lang);
  const elsewhere: FooterLink[] = [{ label: t(lang, 'link.github'), href: site.github, external: true }];
  if (site.linkedin) elsewhere.push({ label: t(lang, 'link.linkedin'), href: site.linkedin, external: true });
  if (site.kaggle) elsewhere.push({ label: t(lang, 'link.kaggle'), href: site.kaggle, external: true });
  // order (owner, 23 Oct 2026): Site, Index, Others, Elsewhere
  return [
    {
      title: t(lang, 'footer.site'),
      links: [
        { label: t(lang, 'link.home'), href: route('home', lang) },
        { label: t(lang, 'link.contact'), href: contactRoute(lang) },
        { label: t(lang, 'link.language'), href: route('home', other), hreflang: other, lang: other },
      ],
    },
    {
      title: t(lang, 'footer.index'),
      links: doors.map((d) => ({ label: `${d.code} ${doorLabel(d, lang)}`, href: route(d.id, lang) })),
    },
    {
      title: t(lang, 'footer.others'),
      links: [
        { label: t(lang, 'link.sitemap'), href: absolute('/sitemap.xml') },
        { label: t(lang, 'link.rss'), href: absolute('/feed.xml') },
        { label: t(lang, 'link.impressum'), href: route('impressum', lang) },
        { label: t(lang, 'link.privacy'), href: route('privacy', lang) },
        { label: t(lang, 'link.accessibility'), href: route('accessibility', lang) },
        { label: t(lang, 'link.keys'), href: keysRoute(lang), keys: true },
      ],
    },
    { title: t(lang, 'footer.elsewhere'), links: elsewhere },
  ];
}
