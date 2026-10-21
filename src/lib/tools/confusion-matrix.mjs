// Confusion matrix — pure functions for the 04-01 bench. No DOM, no
// framework. The island (ConfusionMatrixBench.tsx) and the unit tests
// both read this file.
//
// The bench is parameterised by what an analyst knows before the model
// runs: the number of cases n, the prevalence of the positive class, the
// model's sensitivity (recall) and specificity. From those the four
// counts follow:
//
//   positives = round(n · prevalence)        TP = round(positives · sensitivity)   FN = positives − TP
//   negatives = n − positives                TN = round(negatives · specificity)   FP = negatives − TN
//
// then the eight rates and the cost model
//
//   cost = FP · c_FP + FN · c_FN               cost per case = cost / n
//
// The maths of the eight rates is ported from the v1 tool
// (braga-design-system-template/src/lib/tools/confusion-matrix.ts
// getMetrics); MCC is not carried over, the brief names eight metrics.
// Zero denominators give 0 in metrics(), as in v1; the readouts print a
// rate whose denominator is zero as an en dash (undefined, not 0.0%), and
// the verdict says when there is no positive case at all (a prevalence
// that rounds to zero positives at a small n).
//
// Presets are v1's scenarios re-expressed as rates, three of the five
// (churn, fraud, lead scoring; moderation and ad clicks are dropped so the
// segmented control holds three segments at 320px). The derivation of each
// is in PRESETS; the fraud preset's specificity rounds 9770/9950 =
// 98.19 % to 98.2 %, so its rebuilt counts are 45 / 179 / 5 / 9771 against
// v1's 45 / 180 / 5 / 9770 (an assumption, recorded).

import { NBSP, EN_DASH, number, currency, percent, unit } from '../format.mjs';
export { NBSP, EN_DASH, number, currency, percent, unit };

/* ---------- presets (v1 scenarios as rates) ---------- */
export const PRESETS = {
  // v1 Churn model: TP 80 · FP 40 · FN 20 · TN 360 → n 500, prevalence 100/500, sensitivity 80/100, specificity 360/400
  Churn: { n: 500, prevalence: 20, sensitivity: 80, specificity: 90, costFP: 10, costFN: 200 },
  // v1 Fraud detection: TP 45 · FP 180 · FN 5 · TN 9770 → n 10 000, prevalence 50/10 000, sensitivity 45/50, specificity 9770/9950 ≈ 98.2
  Fraud: { n: 10000, prevalence: 0.5, sensitivity: 90, specificity: 98.2, costFP: 5, costFN: 500 },
  // v1 Lead scoring: TP 60 · FP 20 · FN 40 · TN 180 → n 300, prevalence 100/300 ≈ 33.3, sensitivity 60/100, specificity 180/200
  Leads: { n: 300, prevalence: 33.3, sensitivity: 60, specificity: 90, costFP: 30, costFN: 150 },
};
export const DEFAULTS = { ...PRESETS.Churn, preset: 'Churn' };
export const BOUNDS = {
  n: { min: 100, max: 50000, step: 100 },
  prevalence: { min: 0.1, max: 50, step: 0.1 },     // %
  sensitivity: { min: 50, max: 100, step: 0.1 },    // %
  specificity: { min: 50, max: 100, step: 0.1 },    // %
  costFP: { min: 0, max: 500, step: 1 },            // € per false positive (v1 bounds, floor opened to 0)
  costFN: { min: 0, max: 2000, step: 10 },          // € per false negative
};

/* ---------- counts ---------- */
/** @param {{ n: number, prevalence: number, sensitivity: number, specificity: number }} input */
export function counts({ n, prevalence, sensitivity, specificity }) {
  const positives = Math.round(n * (prevalence / 100));
  const negatives = n - positives;
  const tp = Math.round(positives * (sensitivity / 100));
  const fn = positives - tp;
  const tn = Math.round(negatives * (specificity / 100));
  const fp = negatives - tn;
  return { n, positives, negatives, tp, fn, fp, tn };
}

/* ---------- the eight rates (v1 getMetrics, MCC left out) ---------- */
export function metrics({ tp, fp, fn, tn }) {
  const N = tp + fp + fn + tn || 1;
  const accuracy = (tp + tn) / N;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const specificity = tn + fp > 0 ? tn / (tn + fp) : 0;
  const npv = tn + fn > 0 ? tn / (tn + fn) : 0;
  const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const fpr = tn + fp > 0 ? fp / (tn + fp) : 0;
  const fnr = tp + fn > 0 ? fn / (tp + fn) : 0;
  return { accuracy, precision, recall, specificity, npv, f1, fpr, fnr };
}

/* ---------- the cost model ---------- */
/** @param {{ fp: number, fn: number, n: number }} k @param {number} costFP @param {number} costFN */
export function cost({ fp, fn, n }, costFP, costFN) {
  const fpCost = fp * costFP;
  const fnCost = fn * costFN;
  const totalCost = fpCost + fnCost;
  return {
    fpCost, fnCost, totalCost,
    costPerCase: n > 0 ? totalCost / n : 0,
    fpShare: totalCost > 0 ? fpCost / totalCost : 0,
    fnShare: totalCost > 0 ? fnCost / totalCost : 0,
  };
}

/* ---------- words ----------
   Count phrases take the singular at 1 ("the 1 churner missed"). The
   German draft drops the article so one strong declension serves every
   count in the accusative: "durch 20 übersehene Abwanderer", "durch 1
   übersehenen Abwanderer" (all four nouns are masculine). */
const WORDS = {
  en: {
    // [singular, plural] of the positive class, by preset vocabulary
    positive: {
      Churn: ['churner', 'churners'], Fraud: ['fraud', 'frauds'],
      Leads: ['qualified lead', 'qualified leads'], default: ['positive', 'positives'],
    },
    missed: (k, pos) => `the ${k} ${pos} missed`,
    falseAlarms: (k, one) => `the ${k} ${one ? 'false alarm' : 'false alarms'}`,
    verdict: (c, n, s) => `Errors cost ${c} across ${n} cases: ${s.fnShare} from ${s.missed}, ${s.fpShare} from ${s.falseAlarms}.`,
    free: (zero, s) => `At these prices ${s.missed} and ${s.falseAlarms} cost ${zero}.`,
    noErrors: (n) => `No error cost across ${n} cases: every positive is flagged and no negative is.`,
    noPositives: (n) => `No error cost across ${n} cases, but no case is positive at this prevalence: recall and F1 are undefined.`,
    perCase: 'per case',
    kpis: {
      accuracy: ['Accuracy', '(TP + TN) / n'],
      precision: ['Precision', 'TP / (TP + FP)'],
      recall: ['Recall', 'TP / (TP + FN) · sensitivity'],
      specificity: ['Specificity', 'TN / (TN + FP)'],
      npv: ['NPV', 'TN / (TN + FN)'],
      f1: ['F1', 'harmonic mean of P and R'],
      fpr: ['False positive rate', 'FP / (FP + TN)'],
      fnr: ['False negative rate', 'FN / (FN + TP)'],
      totalCost: ['Total cost', 'FP · c_FP + FN · c_FN'],
      costPerCase: ['Cost per case', 'total cost / n'],
    },
  },
  de: {
    // Entwurf · Freigabe ausstehend (O-05)
    positive: {
      Churn: ['Abwanderer', 'Abwanderer'], Fraud: ['Betrugsfall', 'Betrugsfälle'],
      Leads: ['qualifizierten Lead', 'qualifizierte Leads'], default: ['Positiven', 'Positive'],
    },
    missed: (k, pos, one) => `${k} ${one ? 'übersehenen' : 'übersehene'} ${pos}`,
    falseAlarms: (k, one) => `${k} ${one ? 'Fehlalarm' : 'Fehlalarme'}`,
    verdict: (c, n, s) => `Fehler kosten ${c} über ${n} Fälle: ${s.fnShare} durch ${s.missed}, ${s.fpShare} durch ${s.falseAlarms}.`,
    // "für" keeps the accusative of `missed`, as "durch" does above
    free: (zero, s) => `Bei diesen Preisen fallen für ${s.missed} und ${s.falseAlarms} ${zero} an.`,
    noErrors: (n) => `Keine Fehlerkosten über ${n} Fälle: jeder Positive wird erkannt und kein Negativer.`,
    noPositives: (n) => `Keine Fehlerkosten über ${n} Fälle, aber bei dieser Prävalenz ist kein Fall positiv: Recall und F1 sind nicht definiert.`,
    perCase: 'pro Fall',
    kpis: {
      accuracy: ['Genauigkeit', '(TP + TN) / n'],
      precision: ['Präzision', 'TP / (TP + FP)'],
      recall: ['Recall', 'TP / (TP + FN) · Sensitivität'],
      specificity: ['Spezifität', 'TN / (TN + FP)'],
      npv: ['NPV', 'TN / (TN + FN)'],
      f1: ['F1', 'harmonisches Mittel von P und R'],
      fpr: ['Falsch-positiv-Rate', 'FP / (FP + TN)'],
      fnr: ['Falsch-negativ-Rate', 'FN / (FN + TP)'],
      totalCost: ['Gesamtkosten', 'FP · c_FP + FN · c_FN'],
      costPerCase: ['Kosten pro Fall', 'Gesamtkosten / n'],
    },
  },
};

/**
 * The whole bench state for one set of inputs.
 * @param {{ n: number, prevalence: number, sensitivity: number, specificity: number,
 *           costFP: number, costFN: number, preset?: string|null }} input
 */
export function evaluate({ n, prevalence, sensitivity, specificity, costFP, costFN, preset = null }) {
  const k = counts({ n, prevalence, sensitivity, specificity });
  const m = metrics(k);
  const c = cost(k, costFP, costFN);

  /** @param {'en'|'de'} [lang] */
  const verdict = (lang = 'en') => {
    const w = WORDS[lang] ?? WORDS.en;
    const cases = number(k.n, lang);
    if (k.fp + k.fn === 0) return k.positives === 0 ? w.noPositives(cases) : w.noErrors(cases);
    const pos = (w.positive[preset] ?? w.positive.default)[k.fn === 1 ? 0 : 1];
    const phrases = {
      missed: w.missed(number(k.fn, lang), pos, k.fn === 1),
      falseAlarms: w.falseAlarms(number(k.fp, lang), k.fp === 1),
    };
    // errors exist but both prices are zero: say so, never "no errors"
    if (c.totalCost === 0) return w.free(currency(0, lang), phrases);
    // the two shares are printed whole and must add up to 100 (62.5 / 37.5
    // would round to 63 + 38): round one, the other is its complement
    const fnPct = Math.round(c.fnShare * 100);
    return w.verdict(currency(c.totalCost, lang), cases, {
      ...phrases,
      fnShare: percent(fnPct, lang, 0),
      fpShare: percent(100 - fnPct, lang, 0),
    });
  };

  const kpis = (lang = 'en') => {
    const w = WORDS[lang] ?? WORDS.en;
    // a rate over a zero denominator is undefined: an en dash, not 0.0%
    const rate = (v, den) => (den > 0 ? percent(v * 100, lang, 1) : EN_DASH);
    const row = (key, value, accent = false) => ({ key, label: w.kpis[key][0], value, note: w.kpis[key][1], accent });
    return [
      row('accuracy', rate(m.accuracy, k.n)),
      row('precision', rate(m.precision, k.tp + k.fp)),
      row('recall', rate(m.recall, k.tp + k.fn)),
      row('specificity', rate(m.specificity, k.tn + k.fp)),
      row('npv', rate(m.npv, k.tn + k.fn)),
      row('f1', 2 * k.tp + k.fp + k.fn > 0 && k.tp + k.fn > 0 ? number(m.f1, lang, 3) : EN_DASH),
      row('fpr', rate(m.fpr, k.tn + k.fp)),
      row('fnr', rate(m.fnr, k.tp + k.fn)),
      row('totalCost', currency(c.totalCost, lang), true),        // the one earned figure (D-025)
      row('costPerCase', currency(c.costPerCase, lang, 2)),
    ];
  };

  /** The cost arithmetic with live numbers: cost = 40 · €10 + 20 · €200 = €400 + €4,000 = €4,400 · €8.80 per case */
  const costLive = (lang = 'en') => {
    const w = WORDS[lang] ?? WORDS.en;
    return `cost = ${number(k.fp, lang)} · ${currency(costFP, lang)} + ${number(k.fn, lang)} · ${currency(costFN, lang)} = ${currency(c.fpCost, lang)} + ${currency(c.fnCost, lang)} = ${currency(c.totalCost, lang)} · ${currency(c.costPerCase, lang, 2)} ${w.perCase}`;
  };

  return { ...k, ...m, ...c, verdict, kpis, costLive };
}

export const RULE = 'cost = FP · c_FP + FN · c_FN';
