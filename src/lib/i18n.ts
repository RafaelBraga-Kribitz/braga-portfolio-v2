// Chrome strings, EN and DE. German language and translation parity were
// adversarially reviewed on 1 Nov 2026. Legal, factual and publication
// approval remain separate. t() throws on a missing key.

import type { Lang } from './site';
import { date } from './format.mjs';
export type { Lang } from './site';

/** D-029: five states, one square each, always with a label. The content schema (src/content.config.ts) reads this list. */
export const STATUSES = ['complete', 'functional', 'under-revision', 'in-build', 'archived'] as const;
export type StatusState = (typeof STATUSES)[number];

/** Languages awaiting language review. Per-document drafts remain independent.
 * L-07 (`--draft-langs`) mirrors this list; explicit fixture runs test drafts.
 */
export const DRAFT_LANGS: readonly Lang[] = [];
export const isDraftLang = (lang: Lang): boolean => DRAFT_LANGS.includes(lang);

const en = {
  // header doors
  'door.work': 'Work',
  'door.writing': 'Writing',
  'door.about': 'About',
  'door.tools': 'Tools',
  // skip link and landmarks
  skip: 'Skip to content',
  index: 'Index',
  // the header doors' landmark name (Site specimen s01: "Sections"); the
  // footer's first group is "Index" (D-013), and two navigation landmarks
  // must not share a name
  'nav.sections': 'Sections',
  // footer groups (D-013)
  'footer.index': 'Index',
  'footer.site': 'Site',
  'footer.elsewhere': 'Elsewhere',
  'footer.browse': 'Browse',
  'footer.legal': 'Legal',
  // footer links
  'link.home': 'Home',
  'link.contact': 'Contact',
  'link.language': 'Deutsch', // the OTHER language's name
  'link.tags': 'Tags',
  'link.sitemap': 'Sitemap',
  'link.rss': 'RSS',
  'link.impressum': 'Impressum',
  'link.privacy': 'Privacy',
  'link.accessibility': 'Accessibility',
  'link.github': 'GitHub',
  'link.linkedin': 'LinkedIn',
  'link.kaggle': 'Kaggle',
  'link.tableau': 'Tableau Public',
  // the colophon's third line (Site specimen s01, "PRIVATE REVIEW · COPY
  // AWAITING APPROVAL · 2026"), stating the status of this build; the
  // year follows it. Change it when the owner approves the copy.
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
  'cover.evidence': 'Evidence',
  'cover.n-projects': '{n} projects',
  'cover.n-projects-one': '1 project',
  'cover.n-essays': '{n} essays',
  'cover.n-essays-one': '1 essay',
  'contact.cta': 'Get in touch',
  // the close of a project page (UX pass, 22 Oct 2026): one primary action
  'contact.project': 'Questions about this project, or a role where this kind of work fits?',
  // the close of an essay (DC-12)
  'contact.essay': 'Written by Rafael Braga-Kribitz. Questions about this essay, or a role where this kind of work fits?',
  'close.projects': 'See the projects',
  'contact.subject': 'About {title}',
  // section claims shared by the home Index and the section indexes
  // (Site specimen s03; home.yaml sections[02].leadParagraphs[0] with the
  // spaced en dash of O-03, NBSP before it)
  'work.claim': 'A decision. Its evidence.',
  'work.prose': 'Selected analytical projects, with the question, result and limits kept together.',
  'writing.claim': 'Finished arguments and working notes.',
  'writing.prose': 'Two registers, deliberately kept apart. Essays are finished arguments\u00A0– a position taken, defended, and closed. Notes are the working surface, revised in place as the thinking moves.',
  // listings
  'all-projects': 'All projects',
  'all-n-projects': 'All {n} projects',
  // the quiet link under the home cover's contact button (DC-09)
  'cover.projects': 'See the {n} projects',
  'all-writing': 'All writing',
  'essays.word': 'Essays',
  'date': 'Date',
  'stack': 'Stack',
  'all-n-essays': 'All {n} essays',
  'all-n-essays-one': '1 essay',
  'essays.sub': 'Newest first. The code beside the date is permanent.',
  // the notes library (owner, 25 Oct 2026)
  'notes.word': 'Notes',
  'notes.claim': 'A working library of the mathematics behind the analysis.',
  'notes.prose': '{n} notes in {k} areas, from notation to machine learning. Each takes one formula: what it says, a small worked example, and code that runs. Revised in place.',
  'notes.areas': 'Areas',
  'notes.all': 'All notes',
  'notes.topic': 'Topic',
  'notes.count': '{n} notes',
  'notes.area-prose': '{n} notes in {k} topics: {topics}.',
  'notes.topic-prose': '{n} notes in {k} subtopics.',
  'notes.leaf-prose': '{n} notes.',
  'notes.count-one': '1 note',
  'notes.page': 'Page {p} of {t}',
  'pagination.nav': 'Pages',
  'pagination.prev': 'Previous page',
  'pagination.next': 'Next page',
  'pagination.page': 'Page {n}',
  'all-notes': 'All notes',
  'kind.library': 'Library',
  'all-tools': 'All tools',
  'open-profile': 'Open the profile',
  project: 'Project',
  title: 'Title',
  tool: 'Tool',
  'kind-date': 'Kind / date',
  'kind.essay': 'Essay',
  'kind.note': 'Note',
  'kind.project': 'Project',
  'discipline-status': 'Discipline / status',
  open: 'Open',
  limit: 'Limit',
  // document
  contents: 'Contents',
  source: 'Source',
  'doc.end': '§ END',
  'writing.older': 'Older',
  'writing.newer': 'Newer',
  'translation.unavailable': 'English only · German home',
  'back-to-index': 'Back to the index',
  'to-index': 'Index',
  published: 'Published',
  updated: 'Updated',
  'as-of': 'As of',
  repository: 'Repository',
  'open-repository': 'Open the repository',
  // the vault (owner, 23 Oct 2026): related notes, tags, tag pages
  related: 'Related',
  'tags.word': 'Tag',
  'tags.title': 'Tags',
  'tags.claim': 'Everything tagged {tag}.',
  'tags.index-claim': 'Every tag, by kind.',
  'tags.index-prose': '{n} tags over {m} entries. Browse the library an area at a time, search a tag or a title, or read the A–Z.',
  'tags.prose': 'Projects, essays and notes, newest first.',
  'tags.prose-library': 'Notes in library order.',
  'tags.count': '{n} entries',
  'tags.count-one': '1 entry',
  'tags.search': 'Search',
  'tags.search-name': 'Search tags and titles',
  'tags.search-placeholder': 'A tag or a title',
  'tags.search-hint': 'Type to search. Esc clears.',
  'tags.search-none': 'Nothing matches.',
  'tags.search-result': '{a} tags · {b} titles',
  'tags.search-tags': 'Tags',
  'tags.search-titles': 'Titles',
  'tags.library': 'Library',
  'tags.hand': 'Essays and projects',
  'tags.stack': 'Stack',
  'tags.topics': 'Topics',
  'tags.subtopics': 'Subtopics',
  'tags.az': 'A–Z',
  'tags.az-claim': 'Every tag in alphabetical order.',
  'tags.az-prose': '{n} tags.',
  'tags.az-letter': 'Tags under {l}.',
  'tags.all-n': 'All {n} tags, A–Z',
  'tags.letters': 'Letters',
  'tags.kind.area': 'Area',
  'tags.kind.topic': 'Topic',
  'tags.kind.subtopic': 'Subtopic',
  'tags.kind.tag': 'Tag',
  'tags.kind.stack': 'Stack',
  // the About portrait's empty frame, until the photo file exists
  'portrait.empty': 'Photo · 4:5',
  // reading time in a document's meta row ({n} whole minutes, at least 1)
  'min-read': '{n}\u00A0min read',
  // keyboard shortcuts (owner, 23 Oct 2026): the panel that "?" opens
  'keys.title': 'Keyboard shortcuts',
  'keys.lead': 'Single keys, ignored while typing in a field or with Cmd, Ctrl or Alt held.',
  'keys.home': 'Home',
  'keys.doors': 'Work, Writing, Tools, About',
  'keys.sections': 'Next / previous section on this page',
  'keys.docs': 'Next / previous project or essay',
  'keys.up': 'Up one level',
  'keys.lang': 'Deutsch',
  'keys.theme': 'Light or dark theme',
  'keys.help': 'This list',
  'keys.close': 'Close',
  'keys.or': 'or',
  'link.keys': 'Keyboard shortcuts',
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
  'nav.sections': 'Bereiche',
  'footer.index': 'Index',
  'footer.site': 'Seite',
  'footer.elsewhere': 'Anderswo',
  'footer.browse': 'Stöbern',
  'footer.legal': 'Rechtliches',
  'link.home': 'Startseite',
  'link.contact': 'Kontakt',
  'link.language': 'English',
  'link.tags': 'Tags',
  'link.sitemap': 'Sitemap',
  'link.rss': 'RSS',
  'link.impressum': 'Impressum',
  'link.privacy': 'Datenschutz',
  'link.accessibility': 'Barrierefreiheit',
  'link.github': 'GitHub',
  'link.linkedin': 'LinkedIn',
  'link.kaggle': 'Kaggle',
  'link.tableau': 'Tableau Public',
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
  'cover.evidence': 'Belege',
  'cover.n-projects': '{n} Projekte',
  'cover.n-projects-one': '1 Projekt',
  'cover.n-essays': '{n} Essays',
  'cover.n-essays-one': '1 Essay',
  'contact.cta': 'Kontakt aufnehmen',
  'contact.project': 'Fragen zu diesem Projekt oder eine Rolle, in die diese Art von Arbeit passt?',
  'contact.essay': 'Geschrieben von Rafael Braga-Kribitz. Fragen zu diesem Essay oder eine Rolle, in die diese Art von Arbeit passt?',
  'close.projects': 'Die Projekte ansehen',
  'contact.subject': 'Zu {title}',
  'work.claim': 'Eine Entscheidung. Ihre Belege.',
  'work.prose': 'Ausgewählte analytische Projekte, bei denen Frage, Ergebnis und Grenzen beisammen bleiben.',
  'writing.claim': 'Fertige Argumente und Arbeitsnotizen.',
  'writing.prose': 'Zwei Register, bewusst getrennt. Essays sind fertige Argumente\u00A0– eine Position, bezogen, verteidigt und abgeschlossen. Notizen sind die Arbeitsfläche, an Ort und Stelle überarbeitet, während das Denken sich bewegt.',
  'all-projects': 'Alle Projekte',
  'all-n-projects': 'Alle {n} Projekte',
  'cover.projects': 'Die {n} Projekte ansehen',
  'all-writing': 'Alle Texte',
  'essays.word': 'Essays',
  'date': 'Datum',
  'stack': 'Stack',
  'all-n-essays': 'Alle {n} Essays',
  'all-n-essays-one': '1 Essay',
  'essays.sub': 'Die neuesten zuerst. Der Code neben dem Datum bleibt.',
  'notes.word': 'Notizen',
  'notes.claim': 'Eine Arbeitsbibliothek der Mathematik hinter der Analyse.',
  'notes.prose': '{n} Notizen in {k} Bereichen, von der Notation bis zum maschinellen Lernen, auf Englisch. Jede behandelt eine Formel: was sie aussagt, ein kleines Rechenbeispiel und Code, der läuft. An Ort und Stelle überarbeitet.',
  'notes.areas': 'Bereiche',
  'notes.all': 'Alle Notizen',
  'notes.topic': 'Thema',
  'notes.count': '{n} Notizen',
  'notes.area-prose': '{n} Notizen in {k} Themen: {topics}.',
  'notes.topic-prose': '{n} Notizen in {k} Unterthemen.',
  'notes.leaf-prose': '{n} Notizen.',
  'notes.count-one': '1 Notiz',
  'notes.page': 'Seite {p} von {t}',
  'pagination.nav': 'Seiten',
  'pagination.prev': 'Vorherige Seite',
  'pagination.next': 'Nächste Seite',
  'pagination.page': 'Seite {n}',
  'all-notes': 'Alle Notizen',
  'kind.library': 'Bibliothek',
  'all-tools': 'Alle Werkzeuge',
  'open-profile': 'Profil öffnen',
  project: 'Projekt',
  title: 'Titel',
  tool: 'Werkzeug',
  'kind-date': 'Art / Datum',
  'kind.essay': 'Essay',
  'kind.note': 'Notiz',
  'kind.project': 'Projekt',
  'discipline-status': 'Disziplin / Status',
  open: 'Öffnen',
  limit: 'Limit',
  contents: 'Inhalt',
  source: 'Quelle',
  'doc.end': '§ ENDE',
  'writing.older': 'Älter',
  'writing.newer': 'Neuer',
  'translation.unavailable': 'Nur auf Deutsch · Englische Startseite',
  'back-to-index': 'Zurück zum Index',
  'to-index': 'Zum Index',
  published: 'Veröffentlicht',
  updated: 'Aktualisiert',
  'as-of': 'Stand',
  repository: 'Repository',
  'open-repository': 'Repository öffnen',
  'portrait.empty': 'Foto · 4:5',
  related: 'Verwandt',
  'tags.word': 'Tag',
  'tags.title': 'Tags',
  'tags.claim': 'Alles mit dem Tag {tag}.',
  'tags.index-claim': 'Jedes Tag, nach Art.',
  'tags.index-prose': '{n} Tags über {m} Einträge. Die Bibliothek bereichsweise durchsehen, nach einem Tag oder Titel suchen oder das A–Z lesen.',
  'tags.prose': 'Projekte, Essays und Notizen, die neuesten zuerst.',
  'tags.prose-library': 'Notizen in Bibliotheksreihenfolge.',
  'tags.count': '{n} Einträge',
  'tags.count-one': '1 Eintrag',
  'tags.search': 'Suche',
  'tags.search-name': 'Tags und Titel suchen',
  'tags.search-placeholder': 'Ein Tag oder ein Titel',
  'tags.search-hint': 'Tippen, um zu suchen. Esc leert.',
  'tags.search-none': 'Nichts passt.',
  'tags.search-result': '{a} Tags · {b} Titel',
  'tags.search-tags': 'Tags',
  'tags.search-titles': 'Titel',
  'tags.library': 'Bibliothek',
  'tags.hand': 'Essays und Projekte',
  'tags.stack': 'Stack',
  'tags.topics': 'Themen',
  'tags.subtopics': 'Unterthemen',
  'tags.az': 'A–Z',
  'tags.az-claim': 'Jedes Tag in alphabetischer Reihenfolge.',
  'tags.az-prose': '{n} Tags.',
  'tags.az-letter': 'Tags unter {l}.',
  'tags.all-n': 'Alle {n} Tags, A–Z',
  'tags.letters': 'Buchstaben',
  'tags.kind.area': 'Bereich',
  'tags.kind.topic': 'Thema',
  'tags.kind.subtopic': 'Unterthema',
  'tags.kind.tag': 'Tag',
  'tags.kind.stack': 'Stack',
  'min-read': '{n}\u00A0Min. Lesezeit',
  'keys.title': 'Tastaturkürzel',
  'keys.lead': 'Einzelne Tasten; ohne Wirkung beim Tippen in ein Feld oder mit gehaltener Cmd-, Strg- oder Alt-Taste.',
  'keys.home': 'Startseite',
  'keys.doors': 'Arbeit, Schreiben, Werkzeuge, Über',
  'keys.sections': 'Nächster / vorheriger Abschnitt dieser Seite',
  'keys.docs': 'Nächstes / vorheriges Projekt bzw. nächster / vorheriger Essay',
  'keys.up': 'Eine Ebene höher',
  'keys.lang': 'English',
  'keys.theme': 'Hell- oder Dunkelmodus',
  'keys.help': 'Diese Liste',
  'keys.close': 'Schließen',
  'keys.or': 'oder',
  'link.keys': 'Tastaturkürzel',
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
   format.mjs (the port of handoff/ds-update/proposals/format.js, with its
   reference cases in tests/unit/format.test.mjs) is the one formatter:
   EN "16 Sep 2026", DE "16. Sep. 2026", NBSP inside the figure, Austrian
   "Jän." for January (D-031). */

/** ISO date (YYYY-MM-DD) → the page language's short form. */
export function formatDate(iso: string, lang: Lang): string {
  if (!/^\d{4}-\d{2}-\d{2}/.test(iso)) throw new Error(`formatDate: expected YYYY-MM-DD, got "${iso}"`);
  return date(iso, lang);
}
