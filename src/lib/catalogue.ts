// The tool rows the home page's 03 Tools section and the tools index share.
// Projects and essays are not listed here: they come from the content
// collections (src/content.config.ts) through src/lib/collections.ts. The
// tools are pages, not Markdown, so their rows stay in code.
//
//   tools     the two benches of BUILD-BRIEF §4 (codes 03-01, 03-02)
//
// German: the tool rows and the prose are agent drafts awaiting the owner's
// approval (HANDOFF O-05).

import type { Lang } from './site';
import type { StatusState } from './i18n';
import { dash } from './format.mjs';

export interface ToolRow {
  code: string;
  page: 'tools.confusion-matrix' | 'tools.ab-sample-size';
  title: string;
  sub: string;
  domain: string;
  status: StatusState;
}

const toolCopy: Record<Lang, { cm: Omit<ToolRow, 'code' | 'page' | 'status'>; ab: Omit<ToolRow, 'code' | 'page' | 'status'> }> = {
  en: {
    cm: { title: 'Confusion matrix', sub: 'Eight rates and a cost per error from four numbers.', domain: 'Classification' },
    ab: { title: 'A/B sample size', sub: 'Visitors per arm, duration and the eight-week ceiling from a baseline and a lift.', domain: 'Experiments' },
  },
  de: {
    cm: { title: 'Konfusionsmatrix', sub: 'Acht Raten und Kosten je Fehler aus vier Zahlen.', domain: 'Klassifikation' },
    ab: { title: 'A/B-Stichprobengröße', sub: 'Besucher pro Arm, Dauer und die Acht-Wochen-Grenze aus Basisrate und Lift.', domain: 'Experimente' },
  },
};

/** The two tool rows of a language, in code order. */
export function tools(lang: Lang): ToolRow[] {
  const c = toolCopy[lang];
  return [
    { code: '03-01', page: 'tools.confusion-matrix', status: 'functional', ...c.cm },
    { code: '03-02', page: 'tools.ab-sample-size', status: 'functional', ...c.ab },
  ];
}

/** The tools index prose: the owner's sentence (home.yaml, tools.leadParagraphs[0]) with the spaced en dash (O-03). */
export function toolsProse(lang: Lang): string {
  return lang === 'de'
    ? `Manche Argumente lassen sich mit einem Regler leichter führen als mit einem Absatz. Dies sind kleine, in sich geschlossene Instrumente${dash('de')}nichts zu installieren, kein Konto, keine Daten verlassen den Browser.`
    : `Some arguments are easier to make with a control than with a paragraph. These are small, self-contained instruments${dash('en')}nothing to install, no account, and no data leaving the browser.`;
}
