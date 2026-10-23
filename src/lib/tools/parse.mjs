// src/lib/tools/parse.mjs — reads a number a reader typed into a bench's
// value field (UX pass, 22 Oct 2026). Liberal in what it accepts, so the
// field never fails a reasonable entry: either decimal separator, either
// grouping style, a unit (%, €, pp, d) or none, NBSP or plain spaces, a
// real minus, a "k" for thousands. Tested in tests/unit/parse.test.mjs.
//
//   parseTyped('4,5', 'de')    → 4.5        parseTyped('4.5', 'de')  → 4.5
//   parseTyped('2,000', 'en')  → 2000       parseTyped('2.000', 'de') → 2000
//   parseTyped('€ 10', 'en')   → 10         parseTyped('2k', 'en')    → 2000
//   parseTyped('abc', 'en')    → null
//
// A single separator followed by exactly three digits is grouping in the
// page's own style (EN ",", DE "."), a decimal mark otherwise; with both
// marks present, the last one is the decimal mark.

/** @param {string} text @param {'en'|'de'} lang @returns {number|null} */
export function parseTyped(text, lang) {
  let s = String(text ?? '').trim().toLowerCase()
    .replace(/[   \s]/g, '')
    .replace(/[−–]/g, '-')
    .replace(/%|€|eur|pp|d$/g, '');
  let scale = 1;
  if (/k$/.test(s)) { scale = 1000; s = s.slice(0, -1); }
  if (!/^-?[\d.,]*\d[\d.,]*$/.test(s)) return null;
  const dots = (s.match(/\./g) || []).length;
  const commas = (s.match(/,/g) || []).length;
  if (dots && commas) {
    const dec = s.lastIndexOf('.') > s.lastIndexOf(',') ? '.' : ',';
    const group = dec === '.' ? ',' : '.';
    s = s.split(group).join('').replace(dec, '.');
  } else if (dots + commas > 1) {
    if (!/^-?\d{1,3}([.,]\d{3})+$/.test(s)) return null;
    s = s.replace(/[.,]/g, '');                 // "1.500.000": grouping only
  } else if (dots + commas === 1) {
    const mark = dots ? '.' : ',';
    const [head, tail] = s.split(mark);
    const groupMark = lang === 'de' ? '.' : ',';
    const grouping = mark === groupMark && tail.length === 3 && /^-?\d{1,3}$/.test(head);
    s = grouping ? head + tail : `${head}.${tail}`;
  }
  const n = Number(s) * scale;
  return Number.isFinite(n) ? n : null;
}
