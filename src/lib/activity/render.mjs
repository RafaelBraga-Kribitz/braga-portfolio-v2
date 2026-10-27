// src/lib/activity/render.mjs — the build log of a project (owner, 26 Oct
// 2026): a ```buildlog fence in a project note becomes, at build, an intro
// line and three figures drawn from src/data/activity.json
// (scripts/activity/snapshot.mjs):
//
//   B1 calendar   commits per day; weeks left to right, Mon–Sun top to bottom
//   B2 week       commits per weekday × hour, Vienna time
//   B3 lines      hand-written lines added by kind (the evidence figure);
//                 the tests bar is the earned bar
//
// The heatmaps use the short interpolation scale (owner, 26 Oct 2026),
// seven bins as the classes .heat-1…7 (.heat-0: no commits); tokens.css
// maps them to --chart-short-* per theme, so more is darker on light and
// lighter on dark. The SVGs are drawn at their own size (12px text never
// scaled, G-01) inside a keyboard-reachable scroll box.
// Pure: data in, HTML string out (tests/unit/activity.test.mjs).

import { number, date } from '../format.mjs';

const CELL = 13, GAP = 2, STEP = CELL + GAP;
const LEFT = 40, TOP = 20;
const LEVELS = 7;

const W = {
  en: {
    intro: (n, prs, days, a, b) => `${n} commits and ${prs} merged pull requests on ${days} days between ${a} and ${b}. Merge commits and bots are left out; times are Vienna time.`,
    fig: 'Fig.',
    calendar: 'Calendar',
    week: 'Week',
    lines: 'Lines written',
    busiestDay: (d, n) => `The busiest day was ${d}, with ${n} commits.`,
    busiestHour: (wd, h, n) => `The busiest hour of the week: ${wd}, ${h}, ${n} commits.`,
    testsPer100: (t) => `${t} lines of tests for every 100 lines of code.`,
    heatCaption: (n, max, unit) => `n = ${n} commits. Colour: commits per ${unit}, seven bins from 1 to ${max}; an empty cell had none. Hover a cell for its count.`,
    linesCaption: (n) => `Lines added, n = ${n}. Data, generated files, figures, notebooks and lockfiles are left out.`,
    day: 'day', hour: 'hour',
    source: 'Source',
    sourceText: (repo, d) => `git history of ${repo}, default branch, snapshot ${d}.`,
    kinds: { code: 'Code', tests: 'Tests', docs: 'Docs', ci: 'CI & setup' },
    weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    weekdaysLong: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    hourRange: (h) => `${pad(h)}:00–${pad((h + 1) % 24)}:00`,
    scroll: (what) => `${what}, scrollable`,
    none: '0',
  },
  de: {
    intro: (n, prs, days, a, b) => `${n} Commits und ${prs} gemergte Pull-Requests an ${days} Tagen zwischen ${a} und ${b}. Merge-Commits und Bots sind nicht gezählt; Zeiten in Wiener Zeit.`,
    fig: 'Abb.',
    calendar: 'Kalender',
    week: 'Woche',
    lines: 'Geschriebene Zeilen',
    busiestDay: (d, n) => `Der dichteste Tag war der ${d} mit ${n} Commits.`,
    busiestHour: (wd, h, n) => `Die dichteste Stunde der Woche: ${wd}, ${h}, ${n} Commits.`,
    testsPer100: (t) => `${t} Zeilen Tests auf 100 Zeilen Code.`,
    heatCaption: (n, max, unit) => `n = ${n} Commits. Farbe: Commits pro ${unit}, sieben Stufen von 1 bis ${max}; ein leeres Feld hatte keinen. Der Zeiger auf einem Feld zeigt die Zahl.`,
    linesCaption: (n) => `Hinzugefügte Zeilen, n = ${n}. Daten, generierte Dateien, Abbildungen, Notebooks und Lockfiles sind nicht gezählt.`,
    day: 'Tag', hour: 'Stunde',
    source: 'Quelle',
    sourceText: (repo, d) => `Git-Historie von ${repo}, Standardzweig, Stand ${d}.`,
    kinds: { code: 'Code', tests: 'Tests', docs: 'Doku', ci: 'CI & Setup' },
    weekdays: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    weekdaysLong: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
    months: ['Jän.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'],
    hourRange: (h) => `${pad(h)}:00–${pad((h + 1) % 24)}:00 Uhr`,
    scroll: (what) => `${what}, scrollbar`,
    none: '0',
  },
};

function pad(n) { return String(n).padStart(2, '0'); }
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Geometric bins from 1 to max, at most seven, none empty: [[lo, hi], …].
 * Up to seven distinct counts get one bin each.
 * @param {number} max
 * @returns {[number, number][]}
 */
export function bins(max) {
  if (max < 1) return [];
  if (max <= LEVELS) return Array.from({ length: max }, (_, i) => [i + 1, i + 1]);
  const out = [];
  let lo = 1;
  for (let i = 1; i <= LEVELS; i++) {
    const hi = i === LEVELS ? max : Math.max(lo, Math.round(max ** (i / LEVELS)));
    if (lo > max) break;
    out.push([lo, Math.min(hi, max)]);
    lo = Math.min(hi, max) + 1;
  }
  return out;
}

/**
 * The heat class of a count: 0 for none; else the bin's step spread over
 * 1…7, so fewer than seven bins still run from the light end to the dark.
 * @param {number} v
 * @param {[number, number][]} b
 * @returns {number}
 */
export function heatLevel(v, b) {
  if (v <= 0 || !b.length) return 0;
  const i = b.findIndex(([lo, hi]) => v >= lo && v <= hi);
  const k = i < 0 ? b.length - 1 : i;
  return b.length === 1 ? LEVELS : 1 + Math.round((k * (LEVELS - 1)) / (b.length - 1));
}

const rangeText = ([lo, hi]) => (lo === hi ? String(lo) : `${lo}–${hi}`);

function legend(b, y, w) {
  // swatch, gap, label; each item as wide as its label (12px mono ≈ 7.5px a glyph)
  const items = [[0, w.none], ...b.map((r) => [heatLevel(r[0], b), rangeText(r)])];
  let x = 0;
  const parts = items.map(([level, label]) => {
    const g = `<rect class="heat-${level}" x="${x}" y="${y}" width="${CELL}" height="${CELL}"/><text x="${x + CELL + 5}" y="${y + 10}">${label}</text>`;
    x += CELL + 5 + Math.ceil(label.length * 7.5) + 14;
    return g;
  });
  return { svg: `<g transform="translate(${LEFT},0)">${parts.join('')}</g>`, width: LEFT + x };
}

function figure({ label, title, svg, aria, caption, sourceLabel, source }) {
  return `<figure class="fig" data-kind="heatmap" data-width="wide">`
    + `<figcaption><span class="fig-label">${esc(label)}</span><span class="fig-title">${esc(title)}</span></figcaption>`
    + `<div class="heat-scroll" tabindex="0" role="group" aria-label="${esc(aria)}">${svg}</div>`
    + `<p class="fig-source">${esc(caption)}<br><b>${esc(sourceLabel)}:</b> ${esc(source)}</p></figure>`;
}

const addDays = (iso, n) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * 864e5).toISOString().slice(0, 10);
const weekdayOf = (iso) => (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7;

function calendarSvg(p, lang, w, title) {
  const counts = Object.values(p.daily);
  const b = bins(Math.max(0, ...counts));
  const start = addDays(p.first, -weekdayOf(p.first));
  const weeks = Math.floor((Date.parse(p.last) - Date.parse(start)) / (7 * 864e5)) + 1;
  const cells = [], labels = [];
  let lastMonth = -1, lastLabelAt = -9;
  for (let k = 0; k < weeks; k++) {
    const monday = addDays(start, 7 * k);
    const m = Number(monday.slice(5, 7)) - 1;
    if (m !== lastMonth) {
      if (k - lastLabelAt >= 4) { labels.push(`<text x="${LEFT + k * STEP}" y="12">${esc(w.months[m])}</text>`); lastLabelAt = k; }
      lastMonth = m;
    }
    for (let d = 0; d < 7; d++) {
      const day = addDays(monday, d);
      if (day < p.first || day > p.last) continue;
      const v = p.daily[day] ?? 0;
      cells.push(`<rect class="heat-${heatLevel(v, b)}" x="${LEFT + k * STEP}" y="${TOP + d * STEP}" width="${CELL}" height="${CELL}"><title>${esc(date(day, lang))} · ${v}</title></rect>`);
    }
  }
  for (const d of [0, 2, 4, 6]) labels.push(`<text x="0" y="${TOP + d * STEP + 10}">${esc(w.weekdays[d])}</text>`);
  const ly = TOP + 7 * STEP + 16;
  const lg = legend(b, ly, w);
  const width = Math.max(LEFT + weeks * STEP, lg.width), height = ly + CELL + 4;
  return `<svg role="img" aria-label="${esc(title)}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${labels.join('')}${cells.join('')}${lg.svg}</svg>`;
}

function weekSvg(p, w, title) {
  const max = Math.max(0, ...p.weekHour.flat());
  const b = bins(max);
  const cells = [], labels = [];
  for (let h = 0; h < 24; h += 3) labels.push(`<text x="${LEFT + h * STEP}" y="12">${pad(h)}</text>`);
  p.weekHour.forEach((row, d) => {
    labels.push(`<text x="0" y="${TOP + d * STEP + 10}">${esc(w.weekdays[d])}</text>`);
    row.forEach((v, h) => cells.push(`<rect class="heat-${heatLevel(v, b)}" x="${LEFT + h * STEP}" y="${TOP + d * STEP}" width="${CELL}" height="${CELL}"><title>${esc(w.weekdays[d])} ${pad(h)}:00 · ${v}</title></rect>`));
  });
  const ly = TOP + 7 * STEP + 16;
  const lg = legend(b, ly, w);
  const width = Math.max(LEFT + 24 * STEP, lg.width), height = ly + CELL + 4;
  return `<svg role="img" aria-label="${esc(title)}" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${labels.join('')}${cells.join('')}${lg.svg}</svg>`;
}

function linesFigure(p, lang, w, label, sourceLabel, source) {
  const order = ['code', 'tests', 'docs', 'ci'];
  const total = order.reduce((s, k) => s + (p.lines[k] ?? 0), 0);
  const max = Math.max(1, ...order.map((k) => p.lines[k] ?? 0));
  const per100 = p.lines.code ? Math.round((100 * p.lines.tests) / p.lines.code) : null;
  const rows = order.map((k) => {
    const v = p.lines[k] ?? 0;
    const pct = Math.round((1000 * v) / max) / 10;
    return `<div class="ev-bar"${k === 'tests' ? ' data-accent' : ''}><span class="ev-label">${esc(w.kinds[k])}</span>`
      + `<span class="ev-track"><span class="ev-fill" style="--w: ${pct}%"></span></span><span class="ev-value">${number(v, lang)}</span></div>`;
  }).join('');
  const heading = per100 == null ? '' : `<p class="evidence-heading display">${esc(w.testsPer100(per100))}</p>`;
  return `<figure class="evidence" data-width="wide"><p class="label">${esc(label)}</p>${heading}<div class="ev-bars">${rows}</div>`
    + `<figcaption>${esc(w.linesCaption(number(total, lang)))}<br><b>${esc(sourceLabel)}:</b> ${esc(source)}</figcaption></figure>`;
}

/**
 * The build log as HTML: an intro paragraph and figures B1–B3.
 * @param {object} p      one entry of activity.json `projects`
 * @param {{ lang: 'en'|'de', code: string, generated: string }} o
 * @returns {string}
 */
export function renderBuildLog(p, { lang, code, generated }) {
  const w = W[lang] ?? W.en;
  const repo = p.repository.replace(/^https:\/\/github\.com\//, '');
  const source = w.sourceText(repo, date(generated, lang));
  const fig = (n, what) => `${w.fig} ${code}-B${n} · ${what}`;

  const [peakDay, peakDayN] = Object.entries(p.daily).reduce((a, e) => (e[1] > a[1] ? e : a), ['', 0]);
  let peak = { d: 0, h: 0, n: -1 };
  p.weekHour.forEach((row, d) => row.forEach((n, h) => { if (n > peak.n) peak = { d, h, n }; }));

  const dayTitle = w.busiestDay(date(peakDay, lang), number(peakDayN, lang));
  const hourTitle = w.busiestHour(w.weekdaysLong[peak.d], w.hourRange(peak.h), number(peak.n, lang));
  const maxDay = Math.max(...Object.values(p.daily));
  const maxHour = Math.max(...p.weekHour.flat());

  return [
    `<p>${esc(w.intro(number(p.commits, lang), number(p.prs, lang), number(p.activeDays, lang), date(p.first, lang), date(p.last, lang)))}</p>`,
    figure({ label: fig(1, w.calendar), title: dayTitle, svg: calendarSvg(p, lang, w, dayTitle), aria: w.scroll(fig(1, w.calendar)), caption: w.heatCaption(number(p.commits, lang), number(maxDay, lang), w.day), sourceLabel: w.source, source }),
    figure({ label: fig(2, w.week), title: hourTitle, svg: weekSvg(p, w, hourTitle), aria: w.scroll(fig(2, w.week)), caption: w.heatCaption(number(p.commits, lang), number(maxHour, lang), w.hour), sourceLabel: w.source, source }),
    linesFigure(p, lang, w, fig(3, w.lines), w.source, source),
  ].join('');
}

