// format.js — number, date and currency formatting by page language
// (HANDOFF 13–14). Pure functions with hand-computed reference cases, in
// the spirit of the tools rule: every rendered figure comes from the same
// code that produced it, and the cases run as a test.
//
//   EN (en-GB)  €453,000 · 0.05 · 16 Sep 2026 · 35% · 38 s
//   DE (de-AT)  € 453.000 · 0,05 · 16. Sep. 2026 · 35 % · 38 s
//
// Spaces inside a figure are U+00A0 (never break "38 s", "€ 453.000",
// "16 Sep"). Ranges use the en dash, negatives the real minus (U+2212),
// three dots are one ellipsis. Quotes: “ ” and ‘ ’ in EN, „ “ in DE.

export const NBSP = '\u00A0';
export const MINUS = '\u2212';
export const EN_DASH = '\u2013';
const MONTHS = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  de: ['Jän.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'] // Austrian German: Jänner
};
const sep = lang => lang === 'de' ? { group: '.', decimal: ',' } : { group: ',', decimal: '.' };

export function number(v, lang = 'en', digits = null) {
  const s = sep(lang);
  const neg = v < 0; v = Math.abs(v);
  const d = digits == null ? (Number.isInteger(v) ? 0 : Math.min(6, (String(v).split('.')[1] || '').length)) : digits;
  const fixed = v.toFixed(d);
  let [int, frac] = fixed.split('.');
  int = int.replace(/\B(?=(\d{3})+(?!\d))/g, s.group);
  return (neg ? MINUS : '') + int + (frac != null && frac.length ? s.decimal + frac : '');
}
export function currency(v, lang = 'en', digits = 0) {
  // EN: symbol tight to the figure. DE/AT: symbol, non-breaking space, figure.
  return lang === 'de' ? '€' + NBSP + number(v, lang, digits) : '€' + number(v, lang, digits);
}
export function percent(v, lang = 'en', digits = null) {
  return number(v, lang, digits) + (lang === 'de' ? NBSP + '%' : '%');
}
export function unit(v, u, lang = 'en', digits = null) {
  return number(v, lang, digits) + NBSP + u;
}
export function date(iso, lang = 'en') {
  const [y, m, d] = iso.split('-').map(Number);
  const mon = MONTHS[lang === 'de' ? 'de' : 'en'][m - 1];
  return lang === 'de' ? `${d}.${NBSP}${mon}${NBSP}${y}` : `${d}${NBSP}${mon}${NBSP}${y}`;
}
export function range(a, b) { return `${a}${EN_DASH}${b}`; }
export function equation(sym, v, lang = 'en', digits = null) { return `${sym}${NBSP}=${NBSP}${number(v, lang, digits)}`; }
export function ellipsis(s) { return s.replace(/\.\.\./g, '\u2026'); }

/* hand-computed reference cases (expected strings written by hand, not by the code) */
export const CASES = [
  { name: 'currency 453000', run: l => currency(453000, l), en: '€453,000', de: '€\u00A0453.000' },
  { name: 'decimal 0.05', run: l => number(0.05, l), en: '0.05', de: '0,05' },
  { name: 'integer 1240991', run: l => number(1240991, l), en: '1,240,991', de: '1.240.991' },
  { name: 'date 2026-09-16', run: l => date('2026-09-16', l), en: '16\u00A0Sep\u00A02026', de: '16.\u00A0Sep.\u00A02026' },
  { name: 'unit 38 s', run: l => unit(38, 's', l), en: '38\u00A0s', de: '38\u00A0s' },
  { name: 'percent −28', run: l => percent(-28, l), en: '\u221228%', de: '\u221228\u00A0%' },
  { name: 'percent 99.8', run: l => percent(99.8, l, 1), en: '99.8%', de: '99,8\u00A0%' },
  { name: 'range 2020–2025', run: l => range(2020, 2025), en: '2020\u20132025', de: '2020\u20132025' },
  { name: 'equation α = 0.05', run: l => equation('α', 0.05, l), en: 'α\u00A0=\u00A00.05', de: 'α\u00A0=\u00A00,05' },
  { name: 'ellipsis', run: l => ellipsis('n = 1, 2, ...'), en: 'n = 1, 2, \u2026', de: 'n = 1, 2, \u2026' }
];
const show = s => s.replace(/\u00A0/g, '⎵');
export function runCases() {
  return CASES.map(c => {
    const en = c.run('en'), de = c.run('de');
    return { name: c.name, en: show(en), de: show(de), enOk: en === c.en, deOk: de === c.de, ok: en === c.en && de === c.de };
  });
}
