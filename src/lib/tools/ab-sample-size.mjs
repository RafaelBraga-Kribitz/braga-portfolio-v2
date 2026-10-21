// A/B sample size — the maths of the Site specimen's bench (s06), as pure
// functions. No DOM, no framework. The island (AbSampleSizeBench.tsx)
// and the unit tests (tests/unit/tools.test.mjs) both read this file, so
// every figure on the page comes from the code the tests exercise.
//
//   n = (z₁₋α/₂ + z₁₋β)² · [p₁(1−p₁) + p₂(1−p₂)] / (p₂ − p₁)²
//
// Two-sided, α = 0.05, equal arms, normal approximation for two
// proportions. Limit: no sequential peeking, no more than two arms.
//
// Number formatting mirrors handoff/ds-update/proposals/format.js
// (number · currency · percent · unit) so the island can switch to Agent
// C's src/lib/format.mjs with an import change once it lands. Spaces
// inside a figure are U+00A0; the English dash is the spaced en dash
// (BUILD-BRIEF §3, O-03).

export const NBSP = ' ';
export const MINUS = '−';
export const EN_DASH = '–';

/* ---------- constants (the specimen's data script, verbatim) ---------- */
export const Z_A = 1.959964;                              // z at 1 − α/2, α = 0.05
export const Z_B = { 80: 0.841621, 90: 1.281552 };        // z at 1 − β for 80 % and 90 % power
export const CEILING_DAYS = 56;                            // the eight-week ceiling
export const PRESETS = {
  Checkout: { base: 4, lift: 10, traffic: 2000 },
  Signup: { base: 12, lift: 15, traffic: 600 },
  Pricing: { base: 1.5, lift: 20, traffic: 8000 },
};
export const DEFAULTS = { base: 4, lift: 10, traffic: 2000, power: '80', preset: 'Checkout' };
export const BOUNDS = {
  base: { min: 0.5, max: 20, step: 0.1 },       // baseline conversion, %
  lift: { min: 2, max: 50, step: 1 },           // relative lift, %
  traffic: { min: 200, max: 20000, step: 100 }, // visitors per day, both arms
};
export const POWERS = ['80', '90'];

/* ---------- the chart's frame: 640 × 260 viewBox, exactly the specimen ---------- */
export const CHART = {
  x0: 48, x1: 612, width: 564,     // plot area, left to right
  baseline: 232, height: 220,      // y of the axis, plot height above it
  L0: 2, L1: 50,                   // lift domain, %
  Y0: 2, Y1: 7,                    // log10 domain: 10² … 10⁷
  tickY: 238, tickLabelY: 254,     // x-axis tick ends and label baseline
  marker: 10,                      // the accent square
};

/* ---------- formatting (format.js conventions) ---------- */
const sep = (lang) => (lang === 'de' ? { group: '.', decimal: ',' } : { group: ',', decimal: '.' });

/**
 * Integer or fixed-decimal figure with the language's separators and the real minus.
 * @param {number} v
 * @param {string} [lang]
 * @param {number|null} [digits] fixed decimals; null keeps the value's own
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
/** @param {number} v @param {string} [lang] @param {number} [digits] @returns {string} */
export function currency(v, lang = 'en', digits = 0) {
  return lang === 'de' ? '€' + NBSP + number(v, lang, digits) : '€' + number(v, lang, digits);
}
/** @param {number} v @param {string} [lang] @param {number|null} [digits] @returns {string} */
export function percent(v, lang = 'en', digits = null) {
  return number(v, lang, digits) + (lang === 'de' ? NBSP + '%' : '%');
}
/** @param {number} v @param {string} u @param {string} [lang] @param {number|null} [digits] @returns {string} */
export function unit(v, u, lang = 'en', digits = null) {
  return number(v, lang, digits) + NBSP + u;
}
/**
 * The specimen's fmtN: '—' when infinite, 1.23M from a million, grouped below.
 * @param {number} n @param {string} [lang] @returns {string}
 */
export function fmtN(n, lang = 'en') {
  if (!Number.isFinite(n)) return '—';
  if (n >= 1e6) return number(n / 1e6, lang, 2) + (lang === 'de' ? NBSP + 'M' : 'M');
  return number(Math.round(n), lang, 0);
}

/* ---------- the maths ---------- */
const r1 = (n) => Math.round(n * 10) / 10;
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * Visitors per arm for a baseline conversion `base` (%), a relative
 * `lift` (%) and a `power` of '80' or '90'. Infinity when the lifted
 * rate reaches 100 %.
 * @param {number} base @param {number} lift @param {string} [power] @returns {number}
 */
export function samplePerArm(base, lift, power = '80') {
  const zb = Z_B[String(power)];
  if (zb === undefined) throw new RangeError(`power must be '80' or '90', got ${power}`);
  const p1 = base / 100;
  const p2 = p1 * (1 + lift / 100);
  if (p2 >= 1) return Infinity;
  return Math.ceil((Z_A + zb) ** 2 * (p1 * (1 - p1) + p2 * (1 - p2)) / (p2 - p1) ** 2);
}

/** x of a lift (%) in the viewBox. */
export function sx(lift) {
  const { x0, width, L0, L1 } = CHART;
  return x0 + ((lift - L0) / (L1 - L0)) * width;
}
/** y of a sample size in the viewBox, clamped to the log10 domain. */
export function sy(v) {
  const { baseline, height, Y0, Y1 } = CHART;
  const lv = Math.log10(clamp(v, 10 ** Y0, 10 ** Y1));
  return baseline - ((lv - Y0) / (Y1 - Y0)) * height;
}

/** The curve's points, lift 2–50 in half steps (97 points), rounded to a tenth. */
export function curvePoints(base, power = '80') {
  const pts = [];
  for (let l = CHART.L0; l <= CHART.L1; l += 0.5) pts.push([r1(sx(l)), r1(sy(samplePerArm(base, l, power)))]);
  return pts;
}
/** The path's `d` attribute: M x y L x y … */
export function curvePath(base, power = '80') {
  return curvePoints(base, power).map(([x, y], i) => (i === 0 ? 'M' : 'L') + x + ' ' + y).join(' ');
}

/** y ticks at 10² … 10⁷: 100 · 1k · 10k · 100k · 1M · 10M. */
export function yTicks() {
  return [2, 3, 4, 5, 6, 7].map((e) => {
    const y = r1(sy(10 ** e));
    const label = e >= 6 ? 10 ** (e - 6) + 'M' : e === 2 ? '100' : 10 ** (e - 3) + 'k';
    return { y, ty: r1(y + 4), label };
  });
}
/** x ticks at 10 … 50 %. */
export function xTicks(lang = 'en') {
  return [10, 20, 30, 40, 50].map((l) => ({ x: r1(sx(l)), label: percent(l, lang, 0) }));
}

const WORDS = {
  en: {
    testable: (per, lift, days, weeks) =>
      `Testable. ${per} visitors per arm reach a ${lift} lift in ${days} ${EN_DASH} run ${weeks}.`,
    notTestable: (days) =>
      `Not testable at this traffic. ${days} exceeds the eight-week ceiling; accept a larger lift or add traffic.`,
    weeks: (w) => `${w} full week${w > 1 ? 's' : ''}`,
    days: (d) => unit(d, d === 1 ? 'day' : 'days', 'en'),
    within: 'within the 8-week ceiling',
    over: 'over the 8-week ceiling',
    visitors: 'visitors',
    twoArms: 'two arms',
    pp: 'pp',
  },
  de: {
    // Entwurf · Freigabe ausstehend (O-05)
    testable: (per, lift, days, weeks) =>
      `Testbar. ${per} Besucher pro Arm erreichen einen Lift von ${lift} in ${days} ${EN_DASH} ${weeks} laufen lassen.`,
    notTestable: (days) =>
      `Bei diesem Traffic nicht testbar. ${days} überschreiten die Acht-Wochen-Grenze; einen größeren Lift akzeptieren oder Traffic hinzufügen.`,
    weeks: (w) => `${w} volle Woche${w > 1 ? 'n' : ''}`,
    days: (d) => unit(d, d === 1 ? 'Tag' : 'Tagen', 'de'),
    within: 'innerhalb der 8-Wochen-Grenze',
    over: 'über der 8-Wochen-Grenze',
    visitors: 'Besucher',
    twoArms: 'zwei Arme',
    pp: 'PP',
  },
};

/**
 * The whole bench state for one set of inputs. Every readout, the verdict,
 * the chart geometry and the live equation line come from here.
 * @param {{ base: number, lift: number, traffic: number, power?: string }} input
 */
export function plan({ base, lift, traffic, power = '80' }) {
  const zb = Z_B[String(power)];
  const p1 = base / 100;
  const p2 = p1 * (1 + lift / 100);
  const perArm = samplePerArm(base, lift, power);
  const total = perArm * 2;
  const days = Number.isFinite(total) ? Math.ceil(total / traffic) : Infinity;
  const weeks = Number.isFinite(days) ? Math.ceil(days / 7) : Infinity;
  const withinCeiling = days <= CEILING_DAYS;
  const absoluteMde = p2 * 100 - base;                  // percentage points
  const capacity = (traffic * CEILING_DAYS) / 2;         // visitors per arm the ceiling allows

  const cx = r1(sx(lift));
  const cy = r1(sy(perArm));
  const capY = r1(sy(capacity));

  const verdict = (lang = 'en') => {
    const w = WORDS[lang] ?? WORDS.en;
    return withinCeiling
      ? w.testable(fmtN(perArm, lang), percent(lift, lang, 0), w.days(days), w.weeks(weeks))
      : w.notTestable(w.days(days));
  };

  const kpis = (lang = 'en') => {
    const w = WORDS[lang] ?? WORDS.en;
    return [
      { key: 'perArm', value: fmtN(perArm, lang), note: w.visitors },
      { key: 'total', value: fmtN(total, lang), note: w.twoArms },
      {
        key: 'duration',
        value: Number.isFinite(days) ? unit(days, 'd', lang) : '—',
        note: withinCeiling ? `${w.weeks(weeks)} · ${w.within}` : w.over,
      },
      {
        key: 'mde',
        value: unit(absoluteMde, w.pp, lang, 2),
        note: `${percent(base, lang, 1)} → ${percent(p2 * 100, lang, 2)}`,
      },
    ];
  };

  const eqLive = (lang = 'en') =>
    `n = (${number(Z_A, lang, 3)} + ${number(zb, lang, 3)})² · [${number(p1, lang, 4)}·${number(1 - p1, lang, 4)} + ${number(p2, lang, 4)}·${number(1 - p2, lang, 4)}] / ${number(p2 - p1, lang, 4)}² = ${fmtN(perArm, lang)}`;

  return {
    p1, p2, perArm, total, days, weeks, withinCeiling, absoluteMde, capacity,
    verdict, kpis, eqLive,
    chart: {
      curve: curvePath(base, power),
      cx, cy, rx: r1(cx - CHART.marker / 2), ry: r1(cy - CHART.marker / 2),
      capY, capTy: r1(capY - 6),
      yTicks: yTicks(),
      xTicks: (lang = 'en') => xTicks(lang),
    },
  };
}

/** The rule as printed above the live line. */
export const RULE = 'n = (z₁₋α/₂ + z₁₋β)² · [p₁(1−p₁) + p₂(1−p₂)] / (p₂ − p₁)²';
