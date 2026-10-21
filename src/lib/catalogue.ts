// The listing rows the home page and the indexes share, until the content
// collections (src/content.config.ts) hold the projects and the essay.
// One source, so the home Index, the section indexes and the sitemap
// cannot drift apart.
//
//   projects  BUILD-BRIEF §4 (code, slug, title, domain, status) and the
//             Site specimen's `projects` array (the one-line notes)
//   essays    handoff/source-content/content/writing/blog/
//             ai-prospecting-vendor-3x-lift.mdx frontmatter (title,
//             summary, date); the code is the brief's 02-01
//   tools     the two benches of BUILD-BRIEF §4 (codes 04-01, 04-02)
//
// German: the project titles and notes and the essay stay English for now
// (rendered with lang="en"); domains, tool rows and every label are agent
// drafts awaiting the owner's approval (HANDOFF O-05).

import type { Lang } from './site';
import type { StatusState } from './i18n';
import { dash } from './format.mjs';

export interface ProjectRow {
  code: string;
  slug: string;
  title: string;
  note: string;
  domain: Record<Lang, string>;
  status: StatusState;
  year: string;
}

export const projects: readonly ProjectRow[] = [
  {
    code: '01-01',
    slug: 'austria-data-job-market-intelligence',
    title: 'Austria data-job market intelligence',
    note: '720 core postings. A dated view of titles, skills and regional demand.',
    domain: { en: 'Labour market', de: 'Arbeitsmarkt' },
    status: 'complete',
    year: '2026',
  },
  {
    code: '01-02',
    slug: 'austrian-mmm-budget-optimizer',
    title: 'Austrian MMM and budget optimiser',
    note: 'Bayesian media-mix modelling. A budget decision with a downside check.',
    domain: { en: 'Marketing', de: 'Marketing' },
    status: 'under-revision',
    year: '2026',
  },
  {
    code: '01-03',
    slug: 'decision-analytics-reconstruction',
    title: 'Decision analytics reconstruction',
    note: 'A three-module reconstruction. Allocation gains are proxies, not campaign effects.',
    domain: { en: 'Decision science', de: 'Entscheidungsanalyse' },
    status: 'functional',
    year: '2026',
  },
  {
    code: '01-04',
    slug: 'warehouse-humanoid-tco',
    title: 'Warehouse humanoid TCO',
    note: '€453,000 over five years. One person and three mobile robots lead the model.',
    domain: { en: 'Operations', de: 'Betrieb' },
    status: 'complete',
    year: '2026',
  },
  {
    code: '01-05',
    slug: 'energy-procurement-risk-analyzer',
    title: 'Energy procurement risk analyser',
    note: 'From electricity-price records to a cost-risk decision. In build.',
    domain: { en: 'Energy', de: 'Energie' },
    status: 'in-build',
    year: '2026',
  },
];

export interface EssayRow {
  code: string;
  slug: string;
  title: string;
  summary: string;
  /** yyyy-mm-dd */
  date: string;
  kind: 'essay' | 'note';
}

export const essays: readonly EssayRow[] = [
  {
    code: '02-01',
    slug: 'ai-prospecting-vendor-3x-lift',
    title: 'An AI prospecting vendor claims a 3× lift. What I would require before signing.',
    summary: 'A vendor-authored benchmark on AI prospecting is enough to justify a pilot, not a purchase. Four buyer conditions close the gap.',
    date: '2026-09-19',
    kind: 'essay',
  },
];

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
    { code: '04-01', page: 'tools.confusion-matrix', status: 'functional', ...c.cm },
    { code: '04-02', page: 'tools.ab-sample-size', status: 'functional', ...c.ab },
  ];
}

/** The tools index prose: the owner's sentence (home.yaml, tools.leadParagraphs[0]) with the spaced en dash (O-03). */
export function toolsProse(lang: Lang): string {
  return lang === 'de'
    ? `Manche Argumente lassen sich mit einem Regler leichter führen als mit einem Absatz. Dies sind kleine, in sich geschlossene Instrumente${dash('de')}nichts zu installieren, kein Konto, keine Daten verlassen den Browser.`
    : `Some arguments are easier to make with a control than with a paragraph. These are small, self-contained instruments${dash('en')}nothing to install, no account, and no data leaving the browser.`;
}
