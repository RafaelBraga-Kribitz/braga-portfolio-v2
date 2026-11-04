#!/usr/bin/env node
// ============================================================
// figures — the designed figures of the project pages
//
//   npm run figures              writes vault/Attachments/figures/<name>.<lang>.svg
//   npm run figures -- --check   exits 1 when a file on disk differs from what
//                                this script draws (tests/unit/figures.test.mjs)
//
// A page embeds a figure with the [!figure] callout (vault/_guide/Syntax
// reference.md § 5); the build inlines the SVG, so var(--token) follows the
// light/dark toggle. Every number in a figure comes from the tables below and
// from nowhere else. Every table has its provenance in the comment above it,
// and assertData() checks every flow and every interval before anything is
// drawn. The <desc> of each figure holds its finding and every plotted value,
// so a screen reader gets the data (figure-svg.mjs refuses a <desc> without a
// digit).
//
// SVG rules: <svg viewBox> with role="img", aria-labelledby, a <title> first
// and a <desc>; fill and stroke are presentation attributes with the six
// tokens only (--ink --ink-2 --surface --surface-2 --rule-c --accent-01); no
// <style>, no font, no inline style, no diagonal connector; text inherits the
// site font at 13 user units or more. Natural width: interval plots and the
// module flow at most 480, so a 390 px phone shows them whole; the funnel and
// the heatmap keep their size and scroll in their own box.
// ============================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { number, percent, NBSP } from '../../src/lib/format.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
export const OUT_DIR = `${ROOT}vault/Attachments/figures/`;

/* ---------------------------------------------------------------------------
   DATA. Numbers in figures come from these tables only.
   --------------------------------------------------------------------------- */

// 01-01 · repository austria-data-job-market-intelligence, commit 267b115,
// tables market_summary (raw rows, core), dedupe_summary (duplicates) and
// Q04_duplicates; snapshot of 16 Sep 2026. "In scope" is core postings,
// adjacent role families and their duplicates.
export const FUNNEL = { raw: 12429, out: 10759, inScope: 1670, core: 720, adjacent: 546, duplicates: 404 };

// 01-01 · same commit, table T05_skills_all_tech (count of the 719 postings
// with a description longer than 300 characters; ci_low and ci_high are the
// Wilson 95% interval of the table). Three groups on one axis; the groups
// are the table's own cuts (top of the table, T05_skills_cloud_platforms,
// T05_skills_bi_tools).
export const SKILL_N = 719;
export const SKILLS_TOP = [
  { group: 'top', id: 'sql', count: 291, lo: 0.369, hi: 0.441 },
  { group: 'top', id: 'ai', count: 276, lo: 0.349, hi: 0.42 },
  { group: 'top', id: 'viz', count: 274, lo: 0.346, hi: 0.417 },
  { group: 'top', id: 'python', count: 253, lo: 0.318, hi: 0.387 },
  { group: 'top', id: 'quality', count: 220, lo: 0.273, hi: 0.341 },
  { group: 'cloud', id: 'azure', count: 139, lo: 0.166, hi: 0.224 },
  { group: 'cloud', id: 'aws', count: 62, lo: 0.068, hi: 0.109 },
  { group: 'cloud', id: 'gcp', count: 41, lo: 0.042, hi: 0.076 },
  { group: 'bi', id: 'powerbi', count: 132, lo: 0.157, hi: 0.214 },
  { group: 'bi', id: 'tableau', count: 24, lo: 0.023, hi: 0.049 },
  { group: 'bi', id: 'qlik', count: 22, lo: 0.02, hi: 0.046 },
];
export const SKILL_TAXONOMY = 115; // rows of T05_skills_all_tech

// 01-01 · same commit, table T05_skills_all_tech_by_family: share in % of the
// postings of a family that mention a skill (same 719 postings; n per family is
// the denominator). 11 of the 115 skills of the taxonomy, rows ordered by the
// skill's share over all 719 postings. Marketing analytics has no Azure row in
// the table, so its Azure share is 0. Product analytics (n = 1) is left out.
export const FAMILIES = ['de', 'ds', 'ba', 'da', 'bi', 'dg', 'ma'];
export const FAMILY_N = { de: 160, ds: 157, ba: 120, da: 107, bi: 85, dg: 65, ma: 24 };
export const HEAT = [
  { id: 'sql', v: { de: 68.8, ds: 36.3, ba: 13.3, da: 38.3, bi: 51.8, dg: 13.8, ma: 54.2 } },
  { id: 'ai', v: { de: 27.5, ds: 82.2, ba: 24.2, da: 20.6, bi: 30.6, dg: 23.1, ma: 41.7 } },
  { id: 'viz', v: { de: 32.5, ds: 22.3, ba: 16.7, da: 64.5, bi: 85.9, dg: 18.5, ma: 50.0 } },
  { id: 'python', v: { de: 55.0, ds: 72.6, ba: 3.3, da: 26.2, bi: 10.6, dg: 9.2, ma: 12.5 } },
  { id: 'quality', v: { de: 44.4, ds: 17.2, ba: 9.2, da: 28.0, bi: 17.6, dg: 81.5, ma: 50.0 } },
  { id: 'cloud', v: { de: 45.0, ds: 47.8, ba: 5.8, da: 16.8, bi: 25.9, dg: 7.7, ma: 29.2 } },
  { id: 'etl', v: { de: 60.0, ds: 21.7, ba: 0.8, da: 8.4, bi: 16.5, dg: 3.1, ma: 8.3 } },
  { id: 'azure', v: { de: 38.1, ds: 33.8, ba: 1.7, da: 7.5, bi: 14.1, dg: 4.6, ma: 0 } },
  { id: 'powerbi', v: { de: 18.8, ds: 5.1, ba: 1.7, da: 33.6, bi: 50.6, dg: 7.7, ma: 33.3 } },
  { id: 'excel', v: { de: 5.6, ds: 5.7, ba: 14.2, da: 46.7, bi: 20.0, dg: 26.2, ma: 37.5 } },
  { id: 'statistics', v: { de: 2.5, ds: 29.3, ba: 3.3, da: 18.7, bi: 10.6, dg: 12.3, ma: 25.0 } },
];
// the three cells the finding names: BI × visualisation, data science × AI, data engineering × SQL
export const HEAT_NAMED = ['viz:bi', 'ai:ds', 'sql:de'];

// 01-03 · repository austrian-mmm-budget-optimizer, Layer R: marginal ROAS at
// current spend, median and 90% interval, on the optimiser's 500-draw subset.
// ROAS = published fit under the reported priors; ROAS_VAGUE = vague-prior refit
// in the same setup. Source: reports/PRIOR_SENSITIVITY_PUBLISHED_FIT_2026-11-04.md,
// merge commit 108e2df2ef85fc98d22c53046b95715cda84b151.
// Breakeven ROAS 2.50. Order: clears, crosses, below.
export const ROAS = [
  { id: 'tv', median: 7.26, lo: 4.38, hi: 10.72 },
  { id: 'facebook', median: 20.53, lo: 4.76, hi: 45.52 },
  { id: 'print', median: 7.81, lo: 1.22, hi: 16.01 },
  { id: 'search', median: 7.68, lo: 0.89, hi: 25.55 },
  { id: 'ooh', median: 0.75, lo: 0.1, hi: 1.68 },
];
export const ROAS_VAGUE = [
  { id: 'tv', median: 6.88, lo: 4.27, hi: 9.78 },
  { id: 'facebook', median: 16.75, lo: 0.11, hi: 46.24 },
  { id: 'print', median: 5.64, lo: 0.37, hi: 15.68 },
  { id: 'search', median: 5.36, lo: 0.03, hi: 29.63 },
  { id: 'ooh', median: 0.59, lo: 0, hi: 1.68 },
];
export const BREAKEVEN = 2.5;
export const ROAS_AXIS = { lo: 0.05, hi: 50 };

// 01-04 · repository decision-analytics-reconstruction, reports/module_c/
// walk_forward_loo_report.md at merge commit 86f6d3b1f3e9a4312ac5320f83e3ddd08050a257
// (full run: 4 chains, 1,000 draws, 1,000 tune, target_accept 0.99): one row per held-out
// poll wave of the 2018 Paraguay fixture. margin, mean, lo, hi in percentage
// points; caught = observed margin inside the 95% HDI.
export const WAVES = [
  { id: '0315', day: 15, month: 3, margin: -4.5, mean: 20.27, lo: -3.2, hi: 44.7, caught: false },
  { id: '0318', day: 18, month: 3, margin: 31.4, mean: 3.97, lo: -14.9, hi: 22.7, caught: false },
  { id: '0326', day: 26, month: 3, margin: 26.43, mean: 14.68, lo: -7.6, hi: 34.6, caught: true },
  { id: '0406', day: 6, month: 4, margin: 31.5, mean: 21.53, lo: -4.1, hi: 46.3, caught: true },
  { id: '0410', day: 10, month: 4, margin: 25.11, mean: 22.75, lo: 0.5, hi: 44.2, caught: true },
  { id: '0418', day: 18, month: 4, margin: -5.12, mean: 17.18, lo: -5.9, hi: 38.3, caught: true },
];
export const WAVE_AXIS = { lo: -20, hi: 60 };

// 01-02 · repository warehouse_humanoid_tco (working copy at 558f51b):
// base case = exports/tableau_public/tco_scenarios.csv (npv_eur), Monte Carlo
// = reports/sensitivity_analysis_report.json, mc_summary_per_scenario (10,000
// draws; mean, p5, p95), in euros, costs as positive numbers.
export const TCO = [
  { id: 'lean-hybrid', base: 452706, mean: 461414, p5: 394658, p95: 537549, accent: true },
  { id: 'lean-crew', base: 647401, mean: 650694, p5: 455152, p95: 872829 },
  { id: 'baseline', base: 1726403, mean: 1735185, p5: 1213740, p95: 2327543 },
  { id: 'future-2028', base: 2532753, mean: 2921150, p5: 2053990, p95: 4044372 },
  { id: 'pure-humanoid', base: 2877837, mean: 3489723, p5: 2200764, p95: 5168136 },
  { id: 'hybrid-amr', base: 3841113, mean: 4466439, p5: 3130319, p95: 6202268 },
  { id: 'hybrid-5050', base: 5251641, mean: 5875603, p5: 4283988, p95: 7860313 },
];
export const TCO_AXIS = { hi: 8000 };

/** Every flow sums and every interval holds its centre, before anything is drawn. Throws a message naming the table. */
export function assertData() {
  const eq = (a, b, what) => { if (a !== b) throw new Error(`figures: ${what}: ${a} is not ${b}`); };
  eq(FUNNEL.out + FUNNEL.inScope, FUNNEL.raw, 'FUNNEL out of scope + in scope = raw rows');
  eq(FUNNEL.core + FUNNEL.adjacent + FUNNEL.duplicates, FUNNEL.inScope, 'FUNNEL core + adjacent + duplicates = in scope');
  for (const s of SKILLS_TOP) {
    const share = s.count / SKILL_N;
    if (!(s.lo <= share && share <= s.hi)) throw new Error(`figures: SKILLS_TOP ${s.id}: share ${share.toFixed(3)} is outside its interval`);
  }
  for (const r of HEAT) for (const f of FAMILIES) if (typeof r.v[f] !== 'number') throw new Error(`figures: HEAT ${r.id} has no share for ${f}`);
  for (const k of HEAT_NAMED) { const [s, f] = k.split(':'); if (!HEAT.find((r) => r.id === s) || !FAMILIES.includes(f)) throw new Error(`figures: HEAT_NAMED ${k} names no cell`); }
  for (const r of ROAS) if (!(r.lo <= r.median && r.median <= r.hi)) throw new Error(`figures: ROAS ${r.id}: median outside its interval`);
  for (const w of WAVES) {
    eq(w.caught, w.margin >= w.lo && w.margin <= w.hi, `WAVES ${w.id}: caught agrees with the interval`);
  }
  eq(WAVES.filter((w) => w.caught).length, 4, 'WAVES caught');
  for (const r of ROAS_VAGUE) if (!(r.lo <= r.median && r.median <= r.hi)) throw new Error(`figures: ROAS_VAGUE ${r.id}: median outside its interval`);
  for (const t of TCO) if (!(t.p5 <= t.mean && t.mean <= t.p95)) throw new Error(`figures: TCO ${t.id}: Monte Carlo mean outside p5–p95`);
}

/* ---------------------------------------------------------------------------
   STRINGS, English and German (Austrian). Names as the pages use them.
   --------------------------------------------------------------------------- */
const STR = {
  en: {
    funnel: {
      finding: '12,429 raw rows reduce to 720 core postings.',
      title: 'From raw rows to core postings',
      raw: 'Raw rows', out: 'Out of scope', inScope: 'In scope', core: 'Core postings', adjacent: 'Adjacent families', duplicates: 'Duplicates removed',
    },
    skills: {
      finding: 'SQL leads at 40%, with AI wording and data visualisation at 38%. Among cloud platforms and BI tools, Azure and Power BI lead.',
      title: 'Skill mentions with 95% intervals',
      groups: { top: 'Top skills', cloud: 'Cloud platforms', bi: 'BI tools' },
      names: { sql: 'SQL', ai: 'AI (generic)', viz: 'Data visualisation', python: 'Python', quality: 'Governance/quality', azure: 'Azure', aws: 'AWS', gcp: 'GCP', powerbi: 'Power BI', tableau: 'Tableau', qlik: 'Qlik' },
      axis: 'Share of postings that mention the skill', desc: 'Dot is the share, line the Wilson 95% interval, n = 719 postings.',
    },
    heat: {
      finding: 'Each role family names its own mix: BI names visualisation most (86%), data science AI wording (82%), data engineering SQL (69%).',
      title: 'Skill mentions by role family',
      unit: 'Share of postings that mention the skill, in %', desc: 'Share in % of the postings of each role family.',
      cols: { de: ['Data', 'engineering'], ds: ['Data', 'science'], ba: ['Business', 'analysis'], da: ['Data', 'analytics'], bi: ['BI'], dg: ['Data', 'governance'], ma: ['Marketing', 'analytics'] },
      rows: { sql: 'SQL', ai: 'AI (generic)', viz: 'Data visualisation', python: 'Python', quality: 'Governance/quality', cloud: 'Cloud (generic)', etl: 'ETL/ELT', azure: 'Azure', powerbi: 'Power BI', excel: 'Excel', statistics: 'Statistics' },
    },
    roas: {
      finding: 'TV clears the 2.50 line under both prior sets. Facebook clears it only under the reported priors. Print and search cross the line, and out-of-home stays below.',
      title: 'Marginal ROAS by channel, with 90% interval',
      breakeven: 'Breakeven 2.50', axis: 'Marginal ROAS at current spend, log scale', desc: 'Median and 90% interval of the marginal ROAS at current spend, under the reported priors and under vague priors; breakeven is 2.50.',
      reported: 'Reported priors', vague: 'Vague priors', clip: 'Clipped at 0.05 (out-of-home 0.00, search 0.03)',
      rows: { tv: 'TV', facebook: 'Facebook', print: 'Print', search: 'Search', ooh: 'Out-of-home' },
    },
    waves: {
      finding: 'The 95% band caught 4 of 6 held-out polls. A calibrated band would catch about 6.',
      title: 'Held-out polls against the 95% band',
      axis: 'Margin in percentage points (pp)', observed: 'Observed margin', mean: 'Predictive mean', band: '95% band', caught: 'caught', miss: 'miss',
      desc: 'Per held-out wave: observed margin, predictive mean and 95% interval, in percentage points.',
      date: (w) => `${w.day} ${w.month === 3 ? 'Mar' : 'Apr'}`,
    },
    tco: {
      finding: 'The lean hybrid has the lowest base-case cost and wins 99.8% of the draws, although its range overlaps the lean crew’s.',
      title: 'Five-year present cost by scenario',
      axis: 'Thousands of euros', base: 'Base case', mean: 'Monte Carlo mean', band: '90% interval',
      desc: 'Base case, Monte Carlo mean and 90% interval of the five-year present cost, in thousands of euros.',
      rows: { 'lean-hybrid': 'Lean hybrid', 'lean-crew': 'Lean crew', baseline: 'Eight-person reference', 'future-2028': 'Humanoid 2028', 'pure-humanoid': 'Pure humanoid', 'hybrid-amr': 'Humanoid + AMR + crew', 'hybrid-5050': '50/50 hybrid' },
    },
    flow: {
      finding: 'Three modules run in order, and each ends in its own check.',
      title: 'Three modules, one pipeline',
      inA: ['Voter file', '50,000 synthetic', 'records'], inB: ['2,772 rows,', 'USD 6 million'], inC: ['Eight published', 'polls and the', 'verified outcome'],
      a: ['Module A', 'Segmentation, turnout', 'Check: silhouette,', 'ARI, Brier'], b: ['Module B', 'Allocation (MILP)', 'Check: solver', 'comparison'], c: ['Module C', 'Poll tracking', 'Check: held-out', 'polls'],
      handoff: 'Handoff',
      // the subjects of the <desc>, with the number of each: the verb agrees with it
      subjects: [['Voter file, 50,000 synthetic records', false], ['2,772 rows and USD 6 million', true], ['Eight published polls and the verified outcome', true]],
      feeds: ['feeds', 'feed'],
    },
  },
  de: {
    funnel: {
      finding: '12.429 Rohzeilen reduzieren sich auf 720 Kerninserate.',
      title: 'Von den Rohzeilen zu den Kerninseraten',
      raw: 'Rohzeilen', out: 'Außerhalb des Untersuchungsrahmens', inScope: 'Im Untersuchungsrahmen', core: 'Kerninserate', adjacent: 'Benachbarte Familien', duplicates: 'Entfernte Dubletten',
    },
    skills: {
      finding: 'SQL führt mit 40 %, KI-Formulierungen und Datenvisualisierung folgen mit 38 %. Bei Cloud-Plattformen und BI-Werkzeugen führen Azure und Power BI.',
      title: 'Nennung von Kompetenzen mit Intervallen zu 95 %',
      groups: { top: 'Häufigste Kompetenzen', cloud: 'Cloud-Plattformen', bi: 'BI-Werkzeuge' },
      names: { sql: 'SQL', ai: 'KI (allgemein)', viz: 'Datenvisualisierung', python: 'Python', quality: 'Governance/Qualität', azure: 'Azure', aws: 'AWS', gcp: 'GCP', powerbi: 'Power BI', tableau: 'Tableau', qlik: 'Qlik' },
      axis: 'Anteil der Inserate, die die Kompetenz nennen', desc: 'Der Punkt ist der Anteil, die Linie das Wilson-Intervall zu 95 %, n = 719 Inserate.',
    },
    heat: {
      finding: 'Jede Rollenfamilie nennt ihre eigene Mischung: BI nennt Visualisierung am häufigsten (86 %), Data Science KI-Formulierungen (82 %), Data Engineering SQL (69 %).',
      title: 'Nennung von Kompetenzen nach Rollenfamilie',
      unit: 'Anteil der Inserate, die die Kompetenz nennen, in %', desc: 'Anteil in % der Inserate jeder Rollenfamilie.',
      cols: { de: ['Data', 'Engineering'], ds: ['Data', 'Science'], ba: ['Business', 'Analysis'], da: ['Data', 'Analytics'], bi: ['BI'], dg: ['Data', 'Governance'], ma: ['Marketing-', 'Analytics'] },
      rows: { sql: 'SQL', ai: 'KI (allgemein)', viz: 'Datenvisualisierung', python: 'Python', quality: 'Governance/Qualität', cloud: 'Cloud (allgemein)', etl: 'ETL/ELT', azure: 'Azure', powerbi: 'Power BI', excel: 'Excel', statistics: 'Statistik' },
    },
    roas: {
      finding: 'TV liegt bei beiden Prior-Sätzen über der Linie von 2,50. Facebook liegt nur bei den berichteten Priors darüber. Print und Search kreuzen die Linie, und die Außenwerbung bleibt darunter.',
      title: 'Marginaler ROAS je Kanal, mit Intervall zu 90 %',
      breakeven: 'Breakeven 2,50', axis: 'Marginaler ROAS bei derzeitigen Ausgaben, logarithmisch', desc: 'Median und Intervall zu 90 % des marginalen ROAS bei den derzeitigen Ausgaben, bei den berichteten Priors und bei vagen Priors; der Breakeven liegt bei 2,50.',
      reported: 'Berichtete Priors', vague: 'Vage Priors', clip: 'Bei 0,05 abgeschnitten (Außenwerbung 0,00, Search 0,03)',
      rows: { tv: 'TV', facebook: 'Facebook', print: 'Print', search: 'Search', ooh: 'Außenwerbung' },
    },
    waves: {
      finding: 'Das Band zu 95 % erfasste 4 von 6 zurückgehaltenen Umfragen. Ein kalibriertes Band würde etwa 6 erfassen.',
      title: 'Zurückgehaltene Umfragen gegenüber dem Band zu 95 %',
      axis: 'Abstand in Prozentpunkten (PP)', observed: 'Beobachteter Abstand', mean: 'Prognosemittel', band: 'Band zu 95 %', caught: 'erfasst', miss: 'verfehlt',
      desc: 'Je zurückgehaltener Welle: beobachteter Abstand, Prognosemittel und Intervall zu 95 %, in Prozentpunkten.',
      date: (w) => `${w.day}.${NBSP}${w.month === 3 ? 'März' : 'Apr.'}`,
    },
    tco: {
      finding: 'Die schlanke Hybridvariante hat die niedrigsten Kosten im Basisfall und gewinnt 99,8 % der Ziehungen, obwohl ihre Spanne die des schlanken Teams überlappt.',
      title: 'Kostenbarwert über fünf Jahre nach Szenario',
      axis: 'Tausend Euro', base: 'Basisfall', mean: 'Monte-Carlo-Mittel', band: 'Intervall zu 90 %',
      desc: 'Basisfall, Monte-Carlo-Mittel und Intervall zu 90 % des Kostenbarwerts über fünf Jahre, in Tausend Euro.',
      rows: { 'lean-hybrid': 'Person + 3 AMR', 'lean-crew': 'Schlankes Team', baseline: 'Referenz acht Personen', 'future-2028': 'Humanoid 2028', 'pure-humanoid': 'Nur Humanoide', 'hybrid-amr': 'Humanoide + AMR + Team', 'hybrid-5050': '50/50-Hybrid' },
    },
    flow: {
      finding: 'Drei Module laufen nacheinander, und jedes endet in einer eigenen Prüfung.',
      title: 'Drei Module, eine Pipeline',
      inA: ['Wählerdatensatz', '50.000 synthetische', 'Einträge'], inB: ['2.772 Zeilen,', '6 Mio. USD'], inC: ['Acht veröffentlichte', 'Umfragen und das', 'verifizierte Ergebnis'],
      a: ['Modul A', 'Segmentierung,', 'Wahlbeteiligung', 'Prüfung: Silhouette,', 'ARI, Brier'], b: ['Modul B', 'Allokation (MILP)', 'Prüfung:', 'Solver-Vergleich'], c: ['Modul C', 'Umfrage-Tracking', 'Prüfung: zurück-', 'gehaltene Umfragen'],
      handoff: 'Übergabe',
      subjects: [['Wählerdatensatz, 50.000 synthetische Einträge', false], ['2.772 Zeilen und 6 Mio. USD', true], ['Acht veröffentlichte Umfragen und das verifizierte Ergebnis', true]],
      feeds: ['speist', 'speisen'],
    },
  },
};

/* ---------------------------------------------------------------------------
   SVG helpers
   --------------------------------------------------------------------------- */
const INK = 'var(--ink)';
const INK2 = 'var(--ink-2)';
const SURFACE = 'var(--surface)';
const SURFACE2 = 'var(--surface-2)';
const RULE = 'var(--rule-c)';
const ACCENT = 'var(--accent-01)';

/** The name of a label that is wrapped over several lines: a line that ends in a hyphen and goes on in lower case was a split word (zurück-/gehaltene), so the hyphen goes; a hyphen before a capital stays (Marketing-/Analytics). */
const unwrap = (lines) => lines.reduce((a, t) => (a === '' ? t : /-$/.test(a) ? (/^\p{Ll}/u.test(t) ? a.slice(0, -1) + t : a + t) : a + ' ' + t), '');

const r2 = (n) => Math.round(n * 100) / 100;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const attrs = (o) => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => ` ${k}="${typeof v === 'number' ? r2(v) : esc(v)}"`).join('');
const el = (name, a, inner) => (inner === undefined ? `<${name}${attrs(a)}/>` : `<${name}${attrs(a)}>${inner}</${name}>`);

/** A text run. Colour is ink unless `fill` says otherwise; `halo` paints a ring of the page colour under the letters. */
function text(x, y, s, o = {}) {
  return el('text', {
    x, y,
    'text-anchor': o.anchor === 'end' || o.anchor === 'middle' ? o.anchor : undefined,
    'font-weight': o.weight,
    fill: o.fill && o.fill !== INK ? o.fill : undefined,
    ...(o.halo ? { stroke: SURFACE, 'stroke-width': 4, 'stroke-linejoin': 'round', 'paint-order': 'stroke' } : {}),
  }, esc(s));
}

/** A block of text lines centred on `cy`; each line is [string, { weight, fill }]. */
function block(x, cy, lines, o = {}) {
  const n = lines.length;
  return lines.map(([s, lo], i) => text(x, cy - (n - 1) * 8 + 4.5 + 16 * i, s, { anchor: o.anchor, halo: o.halo, ...lo })).join('');
}

function svgDoc({ name, lang, w, h, title, desc, defs = '', body }) {
  const id = `fig-${name}-${lang}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="${id}-title ${id}-desc" font-size="13" fill="${INK}">`
    + `<title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(desc)}</desc>${defs}${body}</svg>\n`;
}

const arrowDefs = (id) => el('defs', {}, el('marker', { id: `${id}-arrow`, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 8, markerHeight: 8, orient: 'auto' }, el('path', { d: 'M1,1 L9,5 L1,9 Z', fill: INK2 })));

/** Sankey geometry; k is the one scale of the diagram, a band of 0 draws nothing. */
function sankey({ nodes, links, k }) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  for (const n of nodes) {
    const out = links.filter((l) => l.s === n.id).reduce((a, l) => a + l.v, 0);
    const inn = links.filter((l) => l.t === n.id).reduce((a, l) => a + l.v, 0);
    if (out && out !== n.v) throw new Error(`figures: sankey node ${n.id}: outflow ${out} is not ${n.v}`);
    if (inn && inn !== n.v) throw new Error(`figures: sankey node ${n.id}: inflow ${inn} is not ${n.v}`);
  }
  const live = links.filter((l) => l.v > 0);
  for (const n of nodes) {
    let o = 0;
    for (const l of live.filter((x) => x.s === n.id).sort((a, b) => byId[a.t].y - byId[b.t].y)) { l.sy = n.y + o; o += l.v * k; }
    let i = 0;
    for (const l of live.filter((x) => x.t === n.id).sort((a, b) => byId[a.s].y - byId[b.s].y)) { l.ty = n.y + i; i += l.v * k; }
  }
  const ribbon = (l) => {
    const s = byId[l.s]; const t = byId[l.t];
    const th = l.v * k; const x0 = s.x + s.w; const x1 = t.x; const mx = (x0 + x1) / 2;
    const d = `M${r2(x0)},${r2(l.sy)} C${r2(mx)},${r2(l.sy)} ${r2(mx)},${r2(l.ty)} ${r2(x1)},${r2(l.ty)} L${r2(x1)},${r2(l.ty + th)} C${r2(mx)},${r2(l.ty + th)} ${r2(mx)},${r2(l.sy + th)} ${r2(x0)},${r2(l.sy + th)} Z`;
    return { d, link: l };
  };
  const ribbons = live.map(ribbon);
  const paint = (r) => el('path', { d: r.d, fill: r.link.accent ? ACCENT : INK2, 'fill-opacity': r.link.accent ? 0.5 : 0.26 });
  const bars = nodes.map((n) => el('rect', { x: n.x, y: n.y, width: n.w, height: n.v * k, fill: n.accent ? ACCENT : INK })).join('');
  return { art: ribbons.filter((r) => !r.link.accent).map(paint).join('') + ribbons.filter((r) => r.link.accent).map(paint).join('') + bars };
}

/** "45 – 50" style helpers: the value of a share in whole percent for a language. */
const pc = (v, lang) => percent(Math.round(v), lang, 0);
const num = (v, lang, d) => number(v, lang, d);

/* ---------------------------------------------------------------------------
   A · funnel (01-01 Data)
   --------------------------------------------------------------------------- */
function figFunnel(lang) {
  const s = STR[lang].funnel; const f = FUNNEL;
  const n = (v) => number(v, lang);
  const k = 0.0192; const bw = 12;
  const x1 = 100; const x2 = 330; const x3 = 560;
  const y0 = 60;
  const inH = f.inScope * k;
  const nodes = [
    { id: 'raw', x: x1, y: y0, w: bw, v: f.raw },
    { id: 'in', x: x2, y: y0, w: bw, v: f.inScope },
    { id: 'out', x: x2, y: y0 + inH + 48, w: bw, v: f.out },
    { id: 'core', x: x3, y: 40, w: bw, v: f.core, accent: true },
    { id: 'adj', x: x3, y: 82, w: bw, v: f.adjacent },
    { id: 'dup', x: x3, y: 124, w: bw, v: f.duplicates },
  ];
  const links = [
    { s: 'raw', t: 'in', v: f.inScope }, { s: 'raw', t: 'out', v: f.out },
    { s: 'in', t: 'core', v: f.core, accent: true }, { s: 'in', t: 'adj', v: f.adjacent }, { s: 'in', t: 'dup', v: f.duplicates },
  ];
  const g = sankey({ nodes, links, k });
  const cy = (id) => { const nd = nodes.find((q) => q.id === id); return nd.y + (nd.v * k) / 2; };
  const lab = (id, name, v) => block(x3 + bw + 10, cy(id), [[name, { weight: 600 }], [n(v), { fill: INK2 }]]);
  const body = g.art
    + block(x1 - 10, cy('raw'), [[s.raw, { weight: 600 }], [n(f.raw), { fill: INK2 }]], { anchor: 'end' })
    + block(x2 + bw / 2, y0 - 34, [[s.inScope, { weight: 600 }], [n(f.inScope), { fill: INK2 }]], { anchor: 'middle' })
    + block(x2 + bw + 10, cy('out'), [[s.out, { weight: 600 }], [n(f.out), { fill: INK2 }]])
    + lab('core', s.core, f.core) + lab('adj', s.adjacent, f.adjacent) + lab('dup', s.duplicates, f.duplicates);
  const h = Math.ceil(cy('out') + (f.out * k) / 2 + 20);
  const desc = `${s.finding} ${[s.raw, s.out, s.inScope, s.core, s.adjacent, s.duplicates].map((nm, i) => `${nm} ${n([f.raw, f.out, f.inScope, f.core, f.adjacent, f.duplicates][i])}`).join(', ')}.`;
  return svgDoc({ name: '01-01-funnel', lang, w: 720, h, title: s.title, desc, body });
}

/* ---------------------------------------------------------------------------
   B · skills, dot and whisker (01-01 Result)
   --------------------------------------------------------------------------- */
function figSkills(lang) {
  const s = STR[lang].skills;
  const lw = 134; const px0 = lw + 8; const pw = 200; const maxV = 50;
  const X = (v) => px0 + (v / maxV) * pw;
  const gh = 30; const rh = 28; const top = 6;
  let body = ''; let lastGroup = '';
  const heights = []; let yy = top;
  for (const r of SKILLS_TOP) { if (r.group !== lastGroup) { lastGroup = r.group; yy += gh; } heights.push(yy + rh / 2); yy += rh; }
  const axisY = yy + 4;
  for (const t of [0, 10, 20, 30, 40, 50]) {
    body += el('line', { x1: X(t), y1: top + gh - 6, x2: X(t), y2: axisY, stroke: RULE, 'stroke-width': 1 });
    body += text(X(t), axisY + 20, num(t, lang), { anchor: 'middle', fill: INK2 });
  }
  body += el('line', { x1: px0, y1: axisY, x2: px0 + pw, y2: axisY, stroke: INK2, 'stroke-width': 1 });
  body += text(px0, axisY + 42, `${s.axis}, %`, { fill: INK2 });
  lastGroup = '';
  const desc = [];
  SKILLS_TOP.forEach((r, i) => {
    const cyr = heights[i];
    if (r.group !== lastGroup) { lastGroup = r.group; body += text(0, cyr - rh / 2 - 6, s.groups[r.group], { fill: INK2, weight: 600 }); }
    const share = (r.count / SKILL_N) * 100; const lo = r.lo * 100; const hi = r.hi * 100;
    body += text(0, cyr + 4.5, s.names[r.id]);
    body += el('line', { x1: X(lo), y1: cyr, x2: X(hi), y2: cyr, stroke: INK, 'stroke-width': 2 });
    for (const e of [lo, hi]) body += el('line', { x1: X(e), y1: cyr - 5, x2: X(e), y2: cyr + 5, stroke: INK, 'stroke-width': 2 });
    body += el('circle', { cx: X(share), cy: cyr, r: 5.5, fill: INK, stroke: SURFACE, 'stroke-width': 2 });
    const label = `${pc(share, lang)} (${num(Math.round(lo), lang)}–${num(Math.round(hi), lang)})`;
    body += text(px0 + pw + 14, cyr + 4.5, label);
    desc.push(`${s.names[r.id]} ${label}`);
  });
  const h = axisY + 54;
  return svgDoc({ name: '01-01-skills-top', lang, w: 460, h, title: s.title, desc: `${s.finding} ${s.desc} ${desc.join('; ')}.`, body });
}

/* ---------------------------------------------------------------------------
   C · heatmap, skills (rows) by role family (columns) (01-01 Result)
   --------------------------------------------------------------------------- */
// ink-opacity ramp: capped so that ink text stays above 4.5:1 on the darkest
// cell in light and in dark (scripts/figures/build.mjs --contrast prints it)
export const HEAT_MIN = 0.06;
export const HEAT_MAX = 0.36;
const heatOpacity = (v, max) => (v === 0 ? 0 : r2(HEAT_MIN + (HEAT_MAX - HEAT_MIN) * (v / max)));

function figHeat(lang) {
  const s = STR[lang].heat;
  const max = Math.max(...HEAT.flatMap((r) => FAMILIES.map((f) => r.v[f])));
  const lw = 150; const x0 = lw + 10; const pw = 74; const cw = 68; const ph = 36; const chh = 32; const y0 = 82;
  let body = text(x0, 14, s.unit, { fill: INK2 });
  FAMILIES.forEach((f, j) => {
    const lines = [...s.cols[f].map((t) => [t, { weight: 600 }]), [`n${NBSP}=${NBSP}${number(FAMILY_N[f], lang)}`, { fill: INK2 }]];
    body += lines.map(([t, o], i) => text(x0 + j * pw + cw / 2, y0 - 8 - (lines.length - 1 - i) * 16, t, { anchor: 'middle', ...o })).join('');
  });
  let edge = ''; const desc = [];
  HEAT.forEach((r, i) => {
    const y = y0 + 6 + i * ph;
    body += text(0, y + chh / 2 + 4.5, s.rows[r.id], { weight: 600 });
    const cells = [];
    FAMILIES.forEach((f, j) => {
      const v = r.v[f]; const x = x0 + j * pw;
      body += el('rect', { x, y, width: cw, height: chh, fill: SURFACE, stroke: RULE, 'stroke-width': 1 });
      if (v > 0) body += el('rect', { x, y, width: cw, height: chh, fill: INK, 'fill-opacity': heatOpacity(v, max) });
      body += text(x + cw / 2, y + chh / 2 + 4.5, number(Math.round(v), lang), { anchor: 'middle' });
      if (HEAT_NAMED.includes(`${r.id}:${f}`)) edge += el('rect', { x: x + 1, y: y + 1, width: cw - 2, height: chh - 2, fill: 'none', stroke: INK, 'stroke-width': 2 });
      cells.push(`${unwrap(s.cols[f])} ${number(Math.round(v), lang)}`);
    });
    desc.push(`${s.rows[r.id]}: ${cells.join(', ')}`);
  });
  body += edge;
  const h = y0 + 6 + HEAT.length * ph + 4;
  return svgDoc({ name: '01-01-skills-heatmap', lang, w: x0 + FAMILIES.length * pw - (pw - cw), h, title: s.title, desc: `${s.finding} ${s.desc} ${desc.join('. ')}.`, body });
}

/* ---------------------------------------------------------------------------
   D · interval plot, marginal ROAS (01-03 Result)
   --------------------------------------------------------------------------- */
function figRoas(lang) {
  const s = STR[lang].roas;
  const n2 = (v) => number(v, lang, 2);
  const { lo, hi } = ROAS_AXIS;
  const px0 = 104; const pw = 226;
  const X = (v) => px0 + ((Math.log10(Math.max(v, lo)) - Math.log10(lo)) / (Math.log10(hi) - Math.log10(lo))) * pw;
  const top = 58; const pitch = 46; const dy = 8;
  const bottom = top + ROAS.length * pitch;
  let body = '';
  for (const t of [0.1, 1, 2.5, 10, 50]) {
    body += el('line', { x1: X(t), y1: top - 10, x2: X(t), y2: bottom, stroke: RULE, 'stroke-width': 1 });
    body += text(X(t), bottom + 20, number(t, lang), { anchor: 'middle', fill: INK2 });
  }
  body += el('line', { x1: px0, y1: bottom, x2: px0 + pw, y2: bottom, stroke: INK2, 'stroke-width': 1 });
  body += text(0, bottom + 46, s.axis, { fill: INK2 });
  const desc = [];
  ROAS.forEach((r, i) => {
    const y0 = top + i * pitch + pitch / 2;
    body += text(0, y0 + 4.5, s.rows[r.id], { weight: 600 });
    // reported priors: solid, above
    const y = y0 - dy;
    body += el('line', { x1: X(r.lo), y1: y, x2: X(r.hi), y2: y, stroke: INK, 'stroke-width': 2 });
    for (const e of [r.lo, r.hi]) body += el('line', { x1: X(e), y1: y - 6, x2: X(e), y2: y + 6, stroke: INK, 'stroke-width': 2 });
    body += el('circle', { cx: X(r.median), cy: y, r: 6, fill: INK, stroke: SURFACE, 'stroke-width': 2 });
    const label = `${n2(r.median)} (${n2(r.lo)}–${n2(r.hi)})`;
    body += text(px0 + pw + 12, y + 4.5, label);
    // vague priors: dashed, lighter, below; a left chevron marks a lower bound clipped at the axis minimum
    const v = ROAS_VAGUE.find((q) => q.id === r.id);
    const yv = y0 + dy; const clipped = v.lo < lo;
    body += el('line', { x1: X(v.lo), y1: yv, x2: X(v.hi), y2: yv, stroke: INK2, 'stroke-width': 2, 'stroke-dasharray': '4 3' });
    body += clipped ? el('path', { d: `M${X(v.lo) + 5},${yv - 5} L${X(v.lo)},${yv} L${X(v.lo) + 5},${yv + 5}`, fill: 'none', stroke: INK2, 'stroke-width': 2 })
      : el('line', { x1: X(v.lo), y1: yv - 5, x2: X(v.lo), y2: yv + 5, stroke: INK2, 'stroke-width': 2 });
    body += el('line', { x1: X(v.hi), y1: yv - 5, x2: X(v.hi), y2: yv + 5, stroke: INK2, 'stroke-width': 2 });
    body += el('circle', { cx: X(v.median), cy: yv, r: 4, fill: SURFACE, stroke: INK2, 'stroke-width': 2 });
    desc.push(`${s.rows[r.id]} ${s.reported} ${label}; ${s.vague} ${n2(v.median)} (${n2(v.lo)}–${n2(v.hi)})`);
  });
  body += el('line', { x1: X(BREAKEVEN), y1: top - 12, x2: X(BREAKEVEN), y2: bottom, stroke: ACCENT, 'stroke-width': 2.5 });
  body += text(X(BREAKEVEN) + 8, top - 18, s.breakeven, { weight: 600 });
  // legend
  const ly = bottom + 72;
  body += el('line', { x1: 0, y1: ly - 4, x2: 24, y2: ly - 4, stroke: INK, 'stroke-width': 2 }) + el('circle', { cx: 12, cy: ly - 4, r: 5, fill: INK, stroke: SURFACE, 'stroke-width': 2 }) + text(32, ly, s.reported);
  body += el('line', { x1: 190, y1: ly - 4, x2: 214, y2: ly - 4, stroke: INK2, 'stroke-width': 2, 'stroke-dasharray': '4 3' }) + el('circle', { cx: 202, cy: ly - 4, r: 4, fill: SURFACE, stroke: INK2, 'stroke-width': 2 }) + text(222, ly, s.vague);
  body += el('path', { d: `M5,${ly + 17} L0,${ly + 22} L5,${ly + 27}`, fill: 'none', stroke: INK2, 'stroke-width': 2 }) + text(32, ly + 26, s.clip);
  return svgDoc({ name: '01-03-roas-interval', lang, w: 480, h: ly + 40, title: s.title, desc: `${s.finding} ${s.desc} ${desc.join('; ')}.`, body });
}

/* ---------------------------------------------------------------------------
   E · held-out waves (01-04 Result)
   --------------------------------------------------------------------------- */
function figWaves(lang) {
  const s = STR[lang].waves;
  const n2 = (v) => number(v, lang, 2);
  const n1 = (v) => number(v, lang, 1);
  const { lo, hi } = WAVE_AXIS;
  const px0 = 70; const pw = 260;
  const X = (v) => px0 + ((v - lo) / (hi - lo)) * pw;
  const top = 12; const pitch = 40;
  const bottom = top + WAVES.length * pitch;
  let body = '';
  for (const t of [-20, 0, 20, 40, 60]) {
    body += el('line', { x1: X(t), y1: top, x2: X(t), y2: bottom, stroke: t === 0 ? INK2 : RULE, 'stroke-width': 1 });
    body += text(X(t), bottom + 20, number(t, lang), { anchor: 'middle', fill: INK2 });
  }
  body += el('line', { x1: px0, y1: bottom, x2: px0 + pw, y2: bottom, stroke: INK2, 'stroke-width': 1 });
  body += text(px0, bottom + 42, s.axis, { fill: INK2 });
  const desc = [];
  WAVES.forEach((w, i) => {
    const y = top + i * pitch + pitch / 2;
    const col = w.caught ? INK : ACCENT;
    body += text(0, y + 4.5, s.date(w), { weight: 600 });
    body += el('line', { x1: X(w.lo), y1: y, x2: X(w.hi), y2: y, stroke: col, 'stroke-width': 2 });
    for (const e of [w.lo, w.hi]) body += el('line', { x1: X(e), y1: y - 6, x2: X(e), y2: y + 6, stroke: col, 'stroke-width': 2 });
    body += el('line', { x1: X(w.mean), y1: y - 9, x2: X(w.mean), y2: y + 9, stroke: INK2, 'stroke-width': 2, 'stroke-dasharray': '3 2' });
    body += el('circle', { cx: X(w.margin), cy: y, r: 6, fill: col, stroke: SURFACE, 'stroke-width': 2 });
    const label = `${n2(w.margin)} ${w.caught ? s.caught : s.miss}`;
    body += text(px0 + pw + 12, y + 4.5, label);
    desc.push(`${s.date(w)}: ${s.observed} ${n2(w.margin)}, ${s.mean} ${n2(w.mean)}, ${s.band} ${n1(w.lo)} ${lang === 'de' ? 'bis' : 'to'} ${n1(w.hi)}, ${w.caught ? s.caught : s.miss}`);
  });
  // key
  const ky = bottom + 66;
  body += el('circle', { cx: 8, cy: ky - 4, r: 5, fill: INK }) + text(20, ky, s.observed);
  body += el('line', { x1: 176, y1: ky - 13, x2: 176, y2: ky + 5, stroke: INK2, 'stroke-width': 2, 'stroke-dasharray': '3 2' }) + text(186, ky, s.mean);
  body += el('line', { x1: 306, y1: ky - 4, x2: 330, y2: ky - 4, stroke: INK, 'stroke-width': 2 }) + text(338, ky, s.band);
  return svgDoc({ name: '01-04-wave-intervals', lang, w: 440, h: ky + 12, title: s.title, desc: `${s.finding} ${s.desc} ${desc.join('. ')}.`, body });
}

/* ---------------------------------------------------------------------------
   F · five-year cost, base case and Monte Carlo (01-02 Result)
   --------------------------------------------------------------------------- */
function figTco(lang) {
  const s = STR[lang].tco;
  const k = (e) => Math.round(e / 1000);
  const lw = 156; const px0 = lw + 8; const pw = 150;
  const X = (v) => px0 + (v / TCO_AXIS.hi) * pw;
  const top = 12; const pitch = 38;
  const bottom = top + TCO.length * pitch;
  let body = '';
  for (const t of [0, 2000, 4000, 6000, 8000]) {
    body += el('line', { x1: X(t), y1: top, x2: X(t), y2: bottom, stroke: RULE, 'stroke-width': 1 });
    body += text(X(t), bottom + 20, number(t, lang), { anchor: 'middle', fill: INK2 });
  }
  body += el('line', { x1: px0, y1: bottom, x2: px0 + pw, y2: bottom, stroke: INK2, 'stroke-width': 1 });
  body += text(px0, bottom + 42, s.axis, { fill: INK2 });
  const desc = [];
  TCO.forEach((t, i) => {
    const y = top + i * pitch + pitch / 2;
    body += text(0, y + 4.5, s.rows[t.id], { weight: 600 });
    body += el('line', { x1: X(t.p5 / 1000), y1: y, x2: X(t.p95 / 1000), y2: y, stroke: INK, 'stroke-width': 2 });
    for (const e of [t.p5, t.p95]) body += el('line', { x1: X(e / 1000), y1: y - 5, x2: X(e / 1000), y2: y + 5, stroke: INK, 'stroke-width': 2 });
    body += el('line', { x1: X(t.mean / 1000), y1: y - 9, x2: X(t.mean / 1000), y2: y + 9, stroke: INK2, 'stroke-width': 2, 'stroke-dasharray': '3 2' });
    body += el('circle', { cx: X(t.base / 1000), cy: y, r: 6, fill: t.accent ? ACCENT : INK, stroke: SURFACE, 'stroke-width': 2 });
    const label = `${number(k(t.base), lang)} (${number(k(t.p5), lang)}–${number(k(t.p95), lang)})`;
    body += text(px0 + pw + 12, y + 4.5, label);
    desc.push(`${s.rows[t.id]}: ${s.base} ${number(k(t.base), lang)}, ${s.mean} ${number(k(t.mean), lang)}, ${s.band} ${number(k(t.p5), lang)} ${lang === 'de' ? 'bis' : 'to'} ${number(k(t.p95), lang)}`);
  });
  const ky = bottom + 66;
  body += el('circle', { cx: 8, cy: ky - 4, r: 5, fill: INK }) + text(20, ky, s.base);
  body += el('line', { x1: 120, y1: ky - 13, x2: 120, y2: ky + 5, stroke: INK2, 'stroke-width': 2, 'stroke-dasharray': '3 2' }) + text(130, ky, s.mean);
  body += el('line', { x1: 290, y1: ky - 4, x2: 314, y2: ky - 4, stroke: INK, 'stroke-width': 2 }) + text(322, ky, s.band);
  return svgDoc({ name: '01-02-tco-range', lang, w: 470, h: ky + 12, title: s.title, desc: `${s.finding} ${s.desc} ${desc.join('. ')}.`, body });
}

/* ---------------------------------------------------------------------------
   G · module flow, vertical, 360 wide (01-04 Method)
   --------------------------------------------------------------------------- */
function figFlow(lang) {
  const s = STR[lang].flow;
  const iw = lang === 'de' ? 180 : 150; const gap = 34; const mw = 176; const W = iw + gap + mw;
  const mh = 100; const ih = 64; const vgap = 44;
  const id = `fig-01-04-module-flow-${lang}`;
  const arrow = (x1, y1, x2, y2) => el('line', { x1, y1, x2, y2, stroke: INK2, 'stroke-width': 1.5, 'marker-end': `url(#${id}-arrow)` });
  const box = (x, y, w, h, lines) => el('rect', { x, y, width: w, height: h, fill: SURFACE2, stroke: INK, 'stroke-width': 1.5 })
    + block(x + 10, y + h / 2, lines);
  const mods = [[s.inA, s.a], [s.inB, s.b], [s.inC, s.c]];
  const mx = iw + gap; let body = ''; const desc = [];
  mods.forEach(([inp, mod], i) => {
    const y = i * (mh + vgap); const cy = y + mh / 2;
    if (i) body += arrow(mx + mw / 2, y - vgap + 0, mx + mw / 2, y - 2) + text(mx + mw / 2 - 10, y - vgap / 2 + 4.5, s.handoff, { anchor: 'end', fill: INK2 });
    body += arrow(iw, cy, mx - 2, cy);
    body += box(0, cy - ih / 2, iw, ih, inp.map((t, j) => [t, { weight: j === 0 ? 600 : undefined }]));
    body += box(mx, y, mw, mh, mod.map((t, j) => [t, { weight: j === 0 ? 600 : undefined, fill: j > 1 ? INK2 : undefined }]));
    const [subject, plural] = s.subjects[i];
    desc.push(`${subject} ${s.feeds[plural ? 1 : 0]} ${unwrap(mod)}`);
  });
  // the connectors run between module boxes: draw them behind the boxes (arrows first in the markup would need a second pass)
  return svgDoc({ name: '01-04-module-flow', lang, w: W, h: 3 * mh + 2 * vgap, title: s.title, desc: `${s.finding} ${desc.join('. ')}.`, defs: arrowDefs(id), body });
}

/* ---------------------------------------------------------------------------
   build, write, check
   --------------------------------------------------------------------------- */
export const FIGURES = [
  ['01-01-funnel', figFunnel],
  ['01-01-skills-top', figSkills],
  ['01-01-skills-heatmap', figHeat],
  ['01-02-tco-range', figTco],
  ['01-03-roas-interval', figRoas],
  ['01-04-wave-intervals', figWaves],
  ['01-04-module-flow', figFlow],
];

/** Every figure in both languages: Map of file name → SVG text. */
export function buildAll() {
  assertData();
  const out = new Map();
  for (const [name, draw] of FIGURES) for (const lang of ['en', 'de']) out.set(`${name}.${lang}.svg`, draw(lang));
  return out;
}

/** The finding of each figure, by file name: the page heading must start the figure's <desc> with it. */
export function findings() {
  const out = new Map();
  const keyOf = { '01-01-funnel': 'funnel', '01-01-skills-top': 'skills', '01-01-skills-heatmap': 'heat', '01-02-tco-range': 'tco', '01-03-roas-interval': 'roas', '01-04-wave-intervals': 'waves', '01-04-module-flow': 'flow' };
  for (const [name] of FIGURES) for (const lang of ['en', 'de']) out.set(`${name}.${lang}.svg`, STR[lang][keyOf[name]].finding);
  return out;
}

/** Files that differ from what buildAll draws (missing, changed, or no longer drawn). */
export function diffAgainstDisk(dir = OUT_DIR) {
  const built = buildAll();
  const bad = [];
  for (const [file, svg] of built) {
    if (!existsSync(dir + file)) bad.push(`${file}: missing`);
    else if (readFileSync(dir + file, 'utf8').replaceAll('\r\n', '\n') !== svg) bad.push(`${file}: differs`);
  }
  if (existsSync(dir)) for (const f of readdirSync(dir)) if (f.endsWith('.svg') && !built.has(f)) bad.push(`${f}: not drawn by this script`);
  return bad;
}

/** WCAG contrast of ink text on the darkest heat cell, in both themes (the tokens of design-system/tokens.css). */
export function heatContrast() {
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const ratio = (a, b) => { const la = lum(a); const lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); };
  const themes = { light: { surface: '#E4E6EA', ink: '#26282C' }, dark: { surface: '#191A1D', ink: '#F3F5F9' } };
  const out = {};
  for (const [t, c] of Object.entries(themes)) {
    const s = hex(c.surface); const i = hex(c.ink);
    const cell = s.map((v, n) => v * (1 - HEAT_MAX) + i[n] * HEAT_MAX);
    out[t] = Math.round(ratio(i, cell) * 100) / 100;
  }
  return out;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const check = process.argv.includes('--check');
  try {
    if (process.argv.includes('--contrast')) { console.log(JSON.stringify(heatContrast())); process.exit(0); }
    if (check) {
      const bad = diffAgainstDisk();
      if (bad.length) { console.error(`figures --check: ${bad.length} file(s) out of date; run npm run figures\n  ${bad.join('\n  ')}`); process.exit(1); }
      console.log(`figures --check: ${FIGURES.length * 2} files match`);
    } else {
      const built = buildAll();
      mkdirSync(OUT_DIR, { recursive: true });
      for (const [file, svg] of built) writeFileSync(OUT_DIR + file, svg);
      for (const f of readdirSync(OUT_DIR)) if (f.endsWith('.svg') && !built.has(f)) { /* a figure no longer drawn: remove it by hand */ console.warn(`figures: ${f} is not drawn any more; delete it`); }
      console.log(`figures: wrote ${built.size} files to vault/Attachments/figures/`);
    }
  } catch (e) { console.error(e.message); process.exit(1); }
}
