/* ============================================================
   Site-shell chrome strings (D-122). Both languages always render;
   visibility is CSS on html[lang] (D-121). Keys must match.
   Tool interiors, figure captions, and long-form stay English (D-126).
   ============================================================ */

export const chrome = {
  en: {
    'nav.about': 'ABOUT',
    'nav.work': 'WORK',
    'nav.writing': 'WRITING',
    'nav.contact': 'CONTACT',
    'nav.tools': 'TOOLS',
    skip: 'Skip to content',
    'footer.action': 'Start a conversation',
    // T4 footer site map (SiteFooter.tsx): link labels under the
    // 01 WORK · 02 WRITING · 03 ABOUT · 04 TOOLS columns (titles reuse nav.*).
    'footer.index': 'Index',
    'footer.colIndex': 'INDEX',
    'footer.colSite': 'SITE',
    'footer.colElsewhere': 'ELSEWHERE',
    'footer.blog': 'Blog',
    'footer.notes': 'Notes',
    'footer.tagIndex': 'Tag index',
    'footer.background': 'Background',
    'footer.expertise': 'Expertise',
    'footer.cv': 'CV',
    'footer.contact': 'Contact',
    'listing.index': 'Index',
    // Section labels of the /tools and /projects indexes (the page's
    // Markers and the section bar's links).
    'tools.family.experiments': 'Experiments',
    'tools.family.traps': 'Reasoning traps',
    'tools.family.measurement': 'Marketing measurement',
    'tools.family.sql': 'SQL',
    'work.cases': 'Cases',
    'work.briefs': 'Briefs',
    'tools.col': 'Tool',
    'tools.description': 'Description',
    'i18n.longform': 'Long-form documents remain in English.',
    'writ.linkedFrom': 'LINKED FROM',
    'writ.tags': 'TAGS',
    'writ.tagIndex': 'TAG INDEX',
    // Document end mark and the way back out of a document. Labels
    // carry no arrow: the route renders it in an aria-hidden span.
    'doc.end': '§ END',
    'doc.backToWork': 'Back to work',
    'doc.allWriting': 'All writing',
  },
  de: {
    'nav.about': 'ÜBER',
    'nav.work': 'ARBEIT',
    'nav.writing': 'SCHREIBEN',
    'nav.contact': 'KONTAKT',
    'nav.tools': 'WERKZEUGE',
    skip: 'Zum Inhalt springen',
    'footer.action': 'Gespräch beginnen',
    'footer.index': 'Übersicht',
    'footer.colIndex': 'INDEX',
    'footer.colSite': 'SEITE',
    'footer.colElsewhere': 'ANDERSWO',
    'footer.blog': 'Blog',
    'footer.notes': 'Notizen',
    'footer.tagIndex': 'Schlagwortindex',
    'footer.background': 'Hintergrund',
    'footer.expertise': 'Expertise',
    'footer.cv': 'Lebenslauf',
    'footer.contact': 'Kontakt',
    'listing.index': 'Index',
    'tools.family.experiments': 'Experimente',
    'tools.family.traps': 'Denkfallen',
    'tools.family.measurement': 'Marketing-Messung',
    'tools.family.sql': 'SQL',
    'work.cases': 'Fallstudien',
    'work.briefs': 'Kurzberichte',
    'tools.col': 'Werkzeug',
    'tools.description': 'Beschreibung',
    'i18n.longform': 'Langtexte bleiben auf Englisch.',
    'writ.linkedFrom': 'VERLINKT VON',
    'writ.tags': 'SCHLAGWORTE',
    'writ.tagIndex': 'SCHLAGWORTINDEX',
    'doc.end': '§ ENDE',
    'doc.backToWork': 'Zurück zur Arbeit',
    'doc.allWriting': 'Alle Texte',
  },
} as const;

export type ChromeKey = keyof typeof chrome.en;
