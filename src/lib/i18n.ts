// Chrome strings, EN and DE. The German strings are agent drafts awaiting
// the owner's approval (HANDOFF O-05); every DE page carries the
// "Entwurf · Freigabe ausstehend" mark until then. t() throws on a
// missing key, so a typo fails the build instead of rendering a blank.

import type { Lang } from './site';
export type { Lang } from './site';

export type StatusState = 'complete' | 'functional' | 'under-revision' | 'in-build' | 'archived';

const en = {
  // header doors
  'door.work': 'Work',
  'door.writing': 'Writing',
  'door.about': 'About',
  'door.tools': 'Tools',
  // skip link and landmarks
  skip: 'Skip to content',
  index: 'Index',
  // footer groups (D-013)
  'footer.index': 'Index',
  'footer.site': 'Site',
  'footer.elsewhere': 'Elsewhere',
  'footer.others': 'Others',
  // footer links
  'link.home': 'Home',
  'link.contact': 'Contact',
  'link.language': 'Deutsch', // the OTHER language's name
  'link.sitemap': 'Sitemap',
  'link.rss': 'RSS',
  'link.impressum': 'Impressum',
  'link.privacy': 'Privacy',
  'link.accessibility': 'Accessibility',
  'link.github': 'GitHub',
  'link.linkedin': 'LinkedIn',
  'link.kaggle': 'Kaggle',
  // status vocabulary (D-029)
  'status.complete': 'Complete',
  'status.functional': 'Functional',
  'status.under-revision': 'Under revision',
  'status.in-build': 'In build',
  'status.archived': 'Archived',
  draft: 'Draft · approval pending',
  // theme toggle
  'theme.toggle': 'Toggle light and dark theme',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  // cover
  'cover.kicker': '00 / Portfolio',
  'cover.based-in': 'Based in',
  'cover.focus': 'Focus',
  'cover.edition': 'Edition',
  'cover.evidence': 'Evidence before claims',
  'cover.independent': 'Independent portfolio',
  'contact.cta': 'Get in touch',
  // listings
  'all-projects': 'All projects',
  'all-5-projects': 'All 5 projects',
  'all-writing': 'All writing',
  'all-tools': 'All tools',
  'open-profile': 'Open the profile',
  project: 'Project',
  title: 'Title',
  tool: 'Tool',
  'kind-date': 'Kind / date',
  'kind.essay': 'Essay',
  'kind.note': 'Note',
  'discipline-status': 'Discipline / status',
  year: 'Year',
  read: 'Read',
  open: 'Open',
  limit: 'Limit',
  // document
  contents: 'Contents',
  source: 'Source',
  'doc.end': '§ END',
  'back-to-index': 'Back to the index',
  // tools
  'tool.nojs': 'Without JavaScript the default scenario is shown; the controls need JavaScript.',
} as const;

export type ChromeKey = keyof typeof en;

const de: Record<ChromeKey, string> = {
  'door.work': 'Arbeit',
  'door.writing': 'Schreiben',
  'door.about': 'Über',
  'door.tools': 'Werkzeuge',
  skip: 'Zum Inhalt springen',
  index: 'Index',
  'footer.index': 'Index',
  'footer.site': 'Seite',
  'footer.elsewhere': 'Anderswo',
  'footer.others': 'Sonstiges',
  'link.home': 'Startseite',
  'link.contact': 'Kontakt',
  'link.language': 'English',
  'link.sitemap': 'Sitemap',
  'link.rss': 'RSS',
  'link.impressum': 'Impressum',
  'link.privacy': 'Datenschutz',
  'link.accessibility': 'Barrierefreiheit',
  'link.github': 'GitHub',
  'link.linkedin': 'LinkedIn',
  'link.kaggle': 'Kaggle',
  'status.complete': 'Abgeschlossen',
  'status.functional': 'Funktionsfähig',
  'status.under-revision': 'In Überarbeitung',
  'status.in-build': 'Im Aufbau',
  'status.archived': 'Archiviert',
  draft: 'Entwurf · Freigabe ausstehend',
  'theme.toggle': 'Hell- und Dunkelmodus wechseln',
  'theme.light': 'Hell',
  'theme.dark': 'Dunkel',
  'cover.kicker': '00 / Portfolio',
  'cover.based-in': 'Standort',
  'cover.focus': 'Schwerpunkt',
  'cover.edition': 'Ausgabe',
  'cover.evidence': 'Belege vor Behauptungen',
  'cover.independent': 'Unabhängiges Portfolio',
  'contact.cta': 'Kontakt aufnehmen',
  'all-projects': 'Alle Projekte',
  'all-5-projects': 'Alle 5 Projekte',
  'all-writing': 'Alle Texte',
  'all-tools': 'Alle Werkzeuge',
  'open-profile': 'Profil öffnen',
  project: 'Projekt',
  title: 'Titel',
  tool: 'Werkzeug',
  'kind-date': 'Art / Datum',
  'kind.essay': 'Essay',
  'kind.note': 'Notiz',
  'discipline-status': 'Disziplin / Status',
  year: 'Jahr',
  read: 'Lesen',
  open: 'Öffnen',
  limit: 'Limit',
  contents: 'Inhalt',
  source: 'Quelle',
  'doc.end': '§ ENDE',
  'back-to-index': 'Zurück zum Index',
  'tool.nojs': 'Ohne JavaScript wird das Standardszenario gezeigt; die Regler brauchen JavaScript.',
};

export const dictionaries: Record<Lang, Record<ChromeKey, string>> = { en, de };

/** Chrome string for a language. Throws at build time on a missing key. */
export function t(lang: Lang, key: ChromeKey): string {
  const dict = dictionaries[lang];
  if (!dict) throw new Error(`i18n: unknown language "${lang}"`);
  const value = (dict as Record<string, string>)[key];
  if (value === undefined) throw new Error(`i18n: missing key "${key}" for "${lang}"`);
  return value;
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'de' : 'en';
}

/* ---- dates ----
   The canonical formatters live in Agent C's src/lib/format.mjs (the port
   of handoff/ds-update/proposals/format.js). import.meta.glob resolves at
   build time: when that file exists its date() is re-exported here as
   formatDate; when it is absent the local port below answers, with the
   same reference cases (EN "16 Sep 2026", DE "16. Sep. 2026", NBSP inside
   the figure, Austrian "Jän." for January; D-031). */
export const NBSP = ' ';

type DateFn = (iso: string, lang?: string) => string;
const formatModules = import.meta.glob<{ date?: DateFn }>(['./format.mjs', './format.ts'], { eager: true });
const sharedDate: DateFn | undefined = formatModules['./format.mjs']?.date ?? formatModules['./format.ts']?.date;

const MONTHS: Record<Lang, readonly string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  de: ['Jän.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'],
};

function localDate(iso: string, lang: Lang): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) throw new Error(`formatDate: expected YYYY-MM-DD, got "${iso}"`);
  const y = Number(m[1]);
  const mon = MONTHS[lang][Number(m[2]) - 1];
  const d = Number(m[3]);
  if (!mon || !d) throw new Error(`formatDate: invalid date "${iso}"`);
  return lang === 'de' ? `${d}.${NBSP}${mon}${NBSP}${y}` : `${d}${NBSP}${mon}${NBSP}${y}`;
}

/** ISO date (YYYY-MM-DD) → the page language's short form. */
export function formatDate(iso: string, lang: Lang): string {
  if (!/^\d{4}-\d{2}-\d{2}/.test(iso)) throw new Error(`formatDate: expected YYYY-MM-DD, got "${iso}"`);
  return sharedDate ? sharedDate(iso, lang) : localDate(iso, lang);
}

/** True when formatDate is served by src/lib/format.mjs (Agent C). */
export const usesSharedFormatter = sharedDate !== undefined;
