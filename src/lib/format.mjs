// format.mjs — number, date and currency formatting by page language
// (HANDOFF 13–14, D-031). A faithful ES-module port of
// handoff/ds-update/proposals/format.js, plus two typographic helpers
// (quotes, dash). Pure functions with hand-computed reference cases, in the
// spirit of the tools rule: every rendered figure comes from the same code
// that produced it, and the cases run as a test (tests/unit/format.test.mjs).
//
//   EN (en-GB)  €453,000 · 0.05 · 16 Sep 2026 · 35% · 38 s
//   DE (de-AT)  € 453.000 · 0,05 · 16. Sep. 2026 · 35 % · 38 s
//
// Spaces inside a figure are U+00A0 (never break "38 s", "€ 453.000",
// "16 Sep"). Ranges use the en dash, negatives the real minus (U+2212),
// three dots are one ellipsis. Quotes: “ ” and ‘ ’ in EN, „ “ and ‚ ‘ in DE.
// The English dash is the spaced en dash (O-03, recommended default).

/** @typedef {'en' | 'de'} Lang */

/** Non-breaking space, U+00A0: the only space allowed inside a figure. */
export const NBSP = ' ';
/** Real minus sign, U+2212. */
export const MINUS = '−';
/** En dash, U+2013: ranges and the English prose dash. */
export const EN_DASH = '–';

/** @type {{ en: string[], de: string[] }} */
const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  de: ['Jän.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'], // Austrian German: Jänner
};

/**
 * Group and decimal separators of a language.
 * @param {Lang} lang
 * @returns {{ group: string, decimal: string }}
 */
const sep = (lang) => (lang === 'de' ? { group: '.', decimal: ',' } : { group: ',', decimal: '.' });

/**
 * A number in the language's separators, with the real minus for negatives.
 * `digits` fixes the decimals; by default an integer prints none and a
 * decimal prints as many as it has (at most six).
 * @param {number} v
 * @param {Lang} [lang='en']
 * @param {number | null} [digits=null]
 * @returns {string}
 */
export function number(v, lang = 'en', digits = null) {
  const s = sep(lang);
  const neg = v < 0;
  v = Math.abs(v);
  const d = digits == null ? (Number.isInteger(v) ? 0 : Math.min(6, (String(v).split('.')[1] || '').length)) : digits;
  const fixed = v.toFixed(d);
  let [int, frac] = fixed.split('.');
  int = int.replace(/\B(?=(\d{3})+(?!\d))/g, s.group);
  return (neg ? MINUS : '') + int + (frac != null && frac.length ? s.decimal + frac : '');
}

/**
 * Euro amount. EN: symbol tight to the figure. DE/AT: symbol, non-breaking
 * space, figure.
 * @param {number} v
 * @param {Lang} [lang='en']
 * @param {number} [digits=0]
 * @returns {string}
 */
export function currency(v, lang = 'en', digits = 0) {
  return lang === 'de' ? '€' + NBSP + number(v, lang, digits) : '€' + number(v, lang, digits);
}

/**
 * Percentage. EN: "35%". DE: "35 %" (non-breaking space).
 * @param {number} v
 * @param {Lang} [lang='en']
 * @param {number | null} [digits=null]
 * @returns {string}
 */
export function percent(v, lang = 'en', digits = null) {
  return number(v, lang, digits) + (lang === 'de' ? NBSP + '%' : '%');
}

/**
 * A figure with a unit, joined by a non-breaking space: "38 s".
 * @param {number} v
 * @param {string} u
 * @param {Lang} [lang='en']
 * @param {number | null} [digits=null]
 * @returns {string}
 */
export function unit(v, u, lang = 'en', digits = null) {
  return number(v, lang, digits) + NBSP + u;
}

/**
 * A date from a yyyy-mm-dd string. EN "16 Sep 2026", DE "16. Sep. 2026",
 * both with non-breaking spaces.
 * @param {string} iso
 * @param {Lang} [lang='en']
 * @returns {string}
 */
export function date(iso, lang = 'en') {
  const [y, m, d] = iso.split('-').map(Number);
  const mon = MONTHS[lang === 'de' ? 'de' : 'en'][m - 1];
  return lang === 'de' ? `${d}.${NBSP}${mon}${NBSP}${y}` : `${d}${NBSP}${mon}${NBSP}${y}`;
}

/**
 * A range joined by the en dash, no spaces: "2020–2025".
 * @param {string | number} a
 * @param {string | number} b
 * @returns {string}
 */
export function range(a, b) {
  return `${a}${EN_DASH}${b}`;
}

/**
 * "α = 0.05" with non-breaking spaces around the equals sign.
 * @param {string} sym
 * @param {number} v
 * @param {Lang} [lang='en']
 * @param {number | null} [digits=null]
 * @returns {string}
 */
export function equation(sym, v, lang = 'en', digits = null) {
  return `${sym}${NBSP}=${NBSP}${number(v, lang, digits)}`;
}

/**
 * Three dots become the one ellipsis character.
 * @param {string} s
 * @returns {string}
 */
export function ellipsis(s) {
  return s.replace(/\.\.\./g, '…');
}

/**
 * Straight quotes become the language's typographic quotes: “ ” and ‘ ’ in
 * EN, „ “ and ‚ ‘ in DE. A quote opens at the start of the text or after a
 * space, an opening bracket or a dash; otherwise it closes. A single quote
 * between two word characters (it’s, O’Brien) or before a digit (’90s) is
 * the apostrophe U+2019 in both languages.
 * @param {string} text
 * @param {Lang} [lang='en']
 * @returns {string}
 */
export function quotes(text, lang = 'en') {
  const q = lang === 'de'
    ? { dl: '„', dr: '“', sl: '‚', sr: '‘' }
    : { dl: '“', dr: '”', sl: '‘', sr: '’' };
  const word = /[\p{L}\p{N}]/u;
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch !== '"' && ch !== "'") { out += ch; continue; }
    const prev = i > 0 ? text[i - 1] : '';
    const next = i + 1 < text.length ? text[i + 1] : '';
    const opening = prev === '' || /[\s([{–— ]/.test(prev);
    if (ch === '"') { out += opening ? q.dl : q.dr; continue; }
    if (opening) { out += /\d/.test(next) ? '’' : q.sl; continue; }
    out += word.test(prev) && word.test(next) ? '’' : q.sr;
  }
  return out;
}

/**
 * The prose dash: a spaced en dash (O-03), with a non-breaking space before
 * it so a line never starts with the dash. The same in both languages (the
 * German Gedankenstrich is the spaced en dash too).
 * @param {Lang} [lang='en']
 * @returns {string}
 */
export function dash(lang = 'en') {
  void lang;
  return `${NBSP}${EN_DASH} `;
}

/**
 * @typedef {object} Case
 * @property {string} name
 * @property {(lang: Lang) => string} run
 * @property {string} en  expected output in English, written by hand
 * @property {string} de  expected output in German, written by hand
 */

/* hand-computed reference cases (expected strings written by hand, not by the code) */
/** @type {Case[]} */
export const CASES = [
  { name: 'currency 453000', run: (l) => currency(453000, l), en: '€453,000', de: '€ 453.000' },
  { name: 'decimal 0.05', run: (l) => number(0.05, l), en: '0.05', de: '0,05' },
  { name: 'integer 1240991', run: (l) => number(1240991, l), en: '1,240,991', de: '1.240.991' },
  { name: 'date 2026-09-16', run: (l) => date('2026-09-16', l), en: '16 Sep 2026', de: '16. Sep. 2026' },
  { name: 'unit 38 s', run: (l) => unit(38, 's', l), en: '38 s', de: '38 s' },
  { name: 'percent −28', run: (l) => percent(-28, l), en: '−28%', de: '−28 %' },
  { name: 'percent 99.8', run: (l) => percent(99.8, l, 1), en: '99.8%', de: '99,8 %' },
  { name: 'range 2020–2025', run: () => range(2020, 2025), en: '2020–2025', de: '2020–2025' },
  { name: 'equation α = 0.05', run: (l) => equation('α', 0.05, l), en: 'α = 0.05', de: 'α = 0,05' },
  { name: 'ellipsis', run: () => ellipsis('n = 1, 2, ...'), en: 'n = 1, 2, …', de: 'n = 1, 2, …' },
  { name: 'quotes', run: (l) => quotes('He said "no", it\'s done, \'ok\'', l), en: 'He said “no”, it’s done, ‘ok’', de: 'He said „no“, it’s done, ‚ok‘' },
  { name: 'dash', run: (l) => `a${dash(l)}b`, en: 'a – b', de: 'a – b' },
];

/** @param {string} s */
const show = (s) => s.replace(/ /g, '⎵');

/**
 * Runs every reference case in both languages and reports which pass.
 * @returns {{ name: string, en: string, de: string, enOk: boolean, deOk: boolean, ok: boolean }[]}
 */
export function runCases() {
  return CASES.map((c) => {
    const en = c.run('en');
    const de = c.run('de');
    return { name: c.name, en: show(en), de: show(de), enOk: en === c.en, deOk: de === c.de, ok: en === c.en && de === c.de };
  });
}
