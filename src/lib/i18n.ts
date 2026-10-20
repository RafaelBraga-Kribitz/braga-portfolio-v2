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
  // footer groups
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
  project: 'Project',
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
  'tool.nojs': 'Without JavaScript the default scenario is shown as text and a table.',
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
  project: 'Projekt',
  'discipline-status': 'Disziplin / Status',
  year: 'Jahr',
  read: 'Lesen',
  open: 'Öffnen',
  limit: 'Limit',
  contents: 'Inhalt',
  source: 'Quelle',
  'doc.end': '§ ENDE',
  'back-to-index': 'Zurück zum Index',
  'tool.nojs': 'Ohne JavaScript wird das Standardszenario als Text und Tabelle angezeigt.',
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
   Local port of date() from handoff/ds-update/proposals/format.js
   (D-031): EN "16 Sep 2026", DE "16. Sep. 2026", NBSP inside the figure,
   Austrian "Jän." for January. Agent C's src/lib/format.mjs is the
   canonical home of the formatters; when it lands, this function should
   be replaced by a re-export of its date(). */
export const NBSP = ' ';
const MONTHS: Record<Lang, readonly string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  de: ['Jän.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'],
};

/** ISO date (YYYY-MM-DD) → the page language's short form. */
export function formatDate(iso: string, lang: Lang): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) throw new Error(`formatDate: expected YYYY-MM-DD, got "${iso}"`);
  const y = Number(m[1]);
  const mon = MONTHS[lang][Number(m[2]) - 1];
  const d = Number(m[3]);
  if (!mon || !d) throw new Error(`formatDate: invalid date "${iso}"`);
  return lang === 'de' ? `${d}.${NBSP}${mon}${NBSP}${y}` : `${d}${NBSP}${mon}${NBSP}${y}`;
}
