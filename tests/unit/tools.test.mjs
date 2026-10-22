// Reference cases for the two tools, computed by hand before the code ran.
// node --test; no dependencies.
import { test } from 'node:test';
import assert from 'node:assert/strict';

import * as ab from '../../src/lib/tools/ab-sample-size.mjs';
import * as cm from '../../src/lib/tools/confusion-matrix.mjs';
import * as fmt from '../../src/lib/format.mjs';

const NBSP = ' ';
const EN_DASH = '–';

/* ============================================================
   A/B sample size
   ============================================================ */

/* Case 1 · the default: base 4 %, lift 10 %, traffic 2 000/d, power 80.
     p1 = 0.04            p2 = 0.04 · 1.10 = 0.044
     z-sum  = 1.959964 + 0.841621 = 2.801585
     z-sum² = 2.801585² = 7.844438 + 0.004440512225 = 7.848878512225
     variances: 0.04 · 0.96 = 0.0384 ; 0.044 · 0.956 = 0.042064 ; sum 0.080464
     (p2 − p1)² = 0.004² = 0.000016
     n = 7.848878512225 · 0.080464 / 0.000016
       = 0.63155216062 / 0.000016 = 39 472.010… → ceil 39 473 per arm
     total 78 946 ; days = ceil(78 946 / 2 000) = ceil(39.473) = 40 ; weeks = ceil(40/7) = 6
     absolute MDE = 4.4 − 4.0 = 0.40 pp ; 40 ≤ 56 → testable */
test('A/B · default case: 39 473 per arm, 40 days, 6 weeks', () => {
  assert.equal(ab.samplePerArm(4, 10, '80'), 39473);
  const p = ab.plan({ base: 4, lift: 10, traffic: 2000, power: '80' });
  assert.equal(p.perArm, 39473);
  assert.equal(p.total, 78946);
  assert.equal(p.days, 40);
  assert.equal(p.weeks, 6);
  assert.equal(p.withinCeiling, true);
  assert.ok(Math.abs(p.absoluteMde - 0.4) < 1e-9);
  assert.ok(Math.abs(p.p2 - 0.044) < 1e-12);
});

/* Case 2 · the same inputs at 90 % power.
     z-sum  = 1.959964 + 1.281552 = 3.241516
     z-sum² = 9.724548 + 0.782877978 = 10.507425978
     n = 10.507425978 · 0.080464 / 0.000016 = 0.845469523894 / 0.000016
       = 52 841.845… → ceil 52 842 */
test('A/B · power 90 raises the default to 52 842 per arm', () => {
  assert.equal(ab.samplePerArm(4, 10, '90'), 52842);
});

/* Case 3 · not testable: base 1.5 %, lift 5 %, traffic 1 000/d, power 80.
     p1 = 0.015 ; p2 = 0.01575
     variances: 0.015 · 0.985 = 0.014775 ; 0.01575 · 0.98425 = 0.0155019375 ; sum 0.0302769375
     (p2 − p1)² = 0.00075² = 0.0000005625
     n = 7.848878512225 · 0.0302769375 / 0.0000005625
       = 0.23764000367 / 0.0000005625 = 422 471.12… → ceil 422 472
     total 844 944 ; days = ceil(844 944 / 1 000) = 845 ; weeks = ceil(845/7) = 121 ; 845 > 56 */
test('A/B · a small lift on a thin baseline is over the ceiling', () => {
  const p = ab.plan({ base: 1.5, lift: 5, traffic: 1000, power: '80' });
  assert.equal(p.perArm, 422472);
  assert.equal(p.total, 844944);
  assert.equal(p.days, 845);
  assert.equal(p.weeks, 121);
  assert.equal(p.withinCeiling, false);
  assert.equal(p.verdict('en'), `Not testable at this traffic. 845${NBSP}days exceeds the eight-week ceiling; accept a larger lift or add traffic.`);
  // German: the days are the subject here, so nominative "Tage" (not the dative "Tagen" of "in 40 Tagen")
  assert.equal(p.verdict('de'), `Bei diesem Traffic nicht testbar. 845${NBSP}Tage überschreiten die Acht-Wochen-Grenze; einen größeren Lift akzeptieren oder Traffic hinzufügen.`);
  assert.equal(p.kpis('en')[2].note, 'over the 8-week ceiling');
});

test('A/B · a lifted rate at or above 100 % is Infinity, shown as the en dash (D-030)', () => {
  assert.equal(ab.samplePerArm(80, 30, '80'), Infinity);   // p2 = 1.04
  assert.equal(ab.fmtN(Infinity), EN_DASH);
  assert.throws(() => ab.samplePerArm(4, 10, '95'), RangeError);
});

/* The specimen's wording with the brief's typography: NBSP inside figures,
   the spaced en dash as the English dash (O-03) with an NBSP before it
   (format.dash), en-GB separators. */
test('A/B · verdict, KPIs and live equation of the default', () => {
  const p = ab.plan({ base: 4, lift: 10, traffic: 2000, power: '80' });
  assert.equal(p.verdict('en'), `Testable. 39,473 visitors per arm reach a 10% lift in 40${NBSP}days${NBSP}${EN_DASH} run 6 full weeks.`);
  const k = p.kpis('en');
  assert.deepEqual(k.map((x) => x.value), ['39,473', '78,946', `40${NBSP}d`, `0.40${NBSP}pp`]);
  assert.equal(k[2].note, '6 full weeks · within the 8-week ceiling');
  assert.equal(k[3].note, '4.0% → 4.40%');
  assert.equal(p.eqLive('en'), 'n = (1.960 + 0.842)² · [0.0400·0.9600 + 0.0440·0.9560] / 0.0040² = 39,473');
});

test('A/B · German draft uses de-AT separators and NBSP before %', () => {
  const p = ab.plan({ base: 4, lift: 10, traffic: 2000, power: '80' });
  assert.equal(p.verdict('de'), `Testbar. 39.473 Besucher pro Arm erreichen einen Lift von 10${NBSP}% in 40${NBSP}Tagen${NBSP}${EN_DASH} 6 volle Wochen laufen lassen.`);
  assert.equal(p.kpis('de')[3].value, `0,40${NBSP}PP`);
  assert.equal(p.kpis('de')[3].note, `4,0${NBSP}% → 4,40${NBSP}%`);
});

/* Chart geometry, the specimen's 640 × 260 viewBox.
     sx(l)  = 48 + (l − 2) / 48 · 564 → sx(2) = 48 ; sx(10) = 48 + 94 = 142 ; sx(30) = 48 + 329 = 377 ; sx(50) = 612
     sy(v)  = 232 − (log10 v − 2) / 5 · 220 → sy(100) = 232 ; sy(1 000) = 188 ; sy(10 000) = 144 ;
              sy(100 000) = 100 ; sy(1 000 000) = 56 ; sy(10 000 000) = 12 ; clamped outside 10²…10⁷
     marker of case 1: cx = 142 ; log10 39 473 = 4.60206 − 0.00576 = 4.59630 ; (2.59630 / 5) · 220 = 114.237 ;
              cy = 232 − 114.237 = 117.763 → 117.8 ; rect at (137, 112.8)
     ceiling at 2 000/d: 2 000 · 56 / 2 = 56 000 per arm ; log10 56 000 = 4.748188 ;
              (2.748188 / 5) · 220 = 120.920 ; capY = 111.080 → 111.1 ; label at 105.1 */
test('A/B · chart scales map the viewBox exactly as the specimen', () => {
  assert.equal(ab.sx(2), 48);
  assert.equal(ab.sx(10), 142);
  assert.equal(ab.sx(30), 377);
  assert.equal(ab.sx(50), 612);
  assert.equal(ab.sy(100), 232);
  assert.equal(ab.sy(1000), 188);
  assert.equal(ab.sy(10000), 144);
  assert.equal(ab.sy(100000), 100);
  assert.equal(ab.sy(1000000), 56);
  assert.equal(ab.sy(10000000), 12);
  assert.equal(ab.sy(1), 232);          // clamped low
  assert.equal(ab.sy(1e9), 12);         // clamped high
  const p = ab.plan({ base: 4, lift: 10, traffic: 2000, power: '80' });
  assert.equal(p.chart.cx, 142);
  assert.equal(p.chart.cy, 117.8);
  assert.equal(p.chart.rx, 137);
  assert.equal(p.chart.ry, 112.8);
  assert.equal(p.chart.capY, 111.1);
  assert.equal(p.chart.capTy, 105.1);
  assert.deepEqual(ab.yTicks().map((t) => t.label), ['100', '1k', '10k', '100k', '1M', '10M']);
  assert.deepEqual(ab.yTicks().map((t) => t.y), [232, 188, 144, 100, 56, 12]);
  assert.deepEqual(ab.xTicks('en').map((t) => t.x), [142, 259.5, 377, 494.5, 612]);
  assert.deepEqual(ab.xTicks('de').map((t) => t.label), [`10${NBSP}%`, `20${NBSP}%`, `30${NBSP}%`, `40${NBSP}%`, `50${NBSP}%`]);
  const pts = ab.curvePoints(4, '80');
  assert.equal(pts.length, 97);                      // 2 … 50 in half steps
  assert.deepEqual(pts[0][0], 48);
  assert.deepEqual(pts[16], [142, 117.8]);           // lift 10 sits on the curve
  assert.ok(p.chart.curve.startsWith('M48 '));
  assert.ok(p.chart.curve.endsWith(' L612 ' + pts[96][1]));
});

test('A/B · presets and defaults are the specimen\'s', () => {
  assert.deepEqual(ab.DEFAULTS, { base: 4, lift: 10, traffic: 2000, power: '80', preset: 'Checkout' });
  assert.deepEqual(ab.PRESETS.Signup, { base: 12, lift: 15, traffic: 600 });
  assert.deepEqual(ab.PRESETS.Pricing, { base: 1.5, lift: 20, traffic: 8000 });
  assert.equal(ab.Z_A, 1.959964);
  assert.deepEqual(ab.Z_B, { 80: 0.841621, 90: 1.281552 });
  assert.equal(ab.CEILING_DAYS, 56);
});

/* ============================================================
   Confusion matrix
   ============================================================ */

/* Case · n 10 000, prevalence 5 %, sensitivity 90 %, specificity 95 %.
     positives = 500 ; TP = 450 ; FN = 50
     negatives = 9 500 ; TN = 9 025 ; FP = 475
     accuracy  = (450 + 9 025) / 10 000 = 0.9475
     precision = 450 / 925 = 0.486486…
     recall    = 450 / 500 = 0.9
     specificity = 9 025 / 9 500 = 0.95
     NPV       = 9 025 / 9 075 = 0.994490…
     F1        = 2·450 / (2·450 + 475 + 50) = 900 / 1 425 = 0.631579…
     FPR       = 475 / 9 500 = 0.05 ; FNR = 50 / 500 = 0.1
     costs at €5 per FP, €500 per FN: 2 375 + 25 000 = €27 375 ; per case 2.7375 ; FN share 25 000 / 27 375 = 91.3 % */
test('CM · reference case: 450 / 50 / 475 / 9 025 and the eight rates', () => {
  const k = cm.counts({ n: 10000, prevalence: 5, sensitivity: 90, specificity: 95 });
  assert.deepEqual(k, { n: 10000, positives: 500, negatives: 9500, tp: 450, fn: 50, fp: 475, tn: 9025 });
  const m = cm.metrics(k);
  assert.equal(m.accuracy, 0.9475);
  assert.ok(Math.abs(m.precision - 450 / 925) < 1e-12);
  assert.equal(m.recall, 0.9);
  assert.equal(m.specificity, 0.95);
  assert.ok(Math.abs(m.npv - 9025 / 9075) < 1e-12);
  assert.ok(Math.abs(m.f1 - 900 / 1425) < 1e-12);
  assert.equal(m.fpr, 0.05);
  assert.equal(m.fnr, 0.1);
  const c = cm.cost(k, 5, 500);
  assert.equal(c.fpCost, 2375);
  assert.equal(c.fnCost, 25000);
  assert.equal(c.totalCost, 27375);
  assert.equal(c.costPerCase, 2.7375);
  assert.ok(Math.abs(c.fnShare - 25000 / 27375) < 1e-12);
});

/* The Churn default (v1 Churn model as rates): n 500, prevalence 20 %, sensitivity 80 %, specificity 90 %.
     positives 100 ; TP 80 ; FN 20 ; negatives 400 ; TN 360 ; FP 40
     cost = 40 · €10 + 20 · €200 = €400 + €4 000 = €4 400 ; per case €8.80 ; FN share 4 000 / 4 400 = 90.9 % → 91 %
     accuracy 440 / 500 = 0.88 ; precision 80 / 120 = 0.6667 ; F1 = 160 / 220 = 0.727 */
test('CM · the Churn default rebuilds v1\'s counts exactly and reads the verdict', () => {
  const e = cm.evaluate({ ...cm.DEFAULTS });
  assert.deepEqual([e.tp, e.fn, e.fp, e.tn], [80, 20, 40, 360]);
  assert.equal(e.totalCost, 4400);
  assert.ok(Math.abs(e.costPerCase - 8.8) < 1e-12);
  assert.equal(e.verdict('en'), 'Errors cost €4,400 across 500 cases: 91% from the 20 churners missed, 9% from the 40 false alarms.');
  assert.equal(e.verdict('de'), `Fehler kosten €${NBSP}4.400 über 500 Fälle: 91${NBSP}% durch 20 übersehene Abwanderer, 9${NBSP}% durch 40 Fehlalarme.`);
  const k = e.kpis('en');
  assert.deepEqual(k.map((x) => x.value), ['88.0%', '66.7%', '80.0%', '90.0%', '94.7%', '0.727', '10.0%', '20.0%', '€4,400', '€8.80']);
  assert.deepEqual(k.filter((x) => x.accent).map((x) => x.key), ['totalCost']);   // one accent per section (G-15)
  assert.equal(e.costLive('en'), 'cost = 40 · €10 + 20 · €200 = €400 + €4,000 = €4,400 · €8.80 per case');
});

/* v1 Fraud detection: 45 / 180 / 5 / 9 770 → specificity 9 770 / 9 950 = 98.19 % rounds to 98.2 %,
   so the rebuilt counts are 45 / 179 / 5 / 9 771 (assumption recorded in the module).
   v1 Lead scoring: 60 / 20 / 40 / 180 → prevalence 100 / 300 = 33.3 % ; 300 · 0.333 = 99.9 rounds to 100. */
test('CM · the Fraud and Leads presets rebuild v1 within rounding', () => {
  const f = cm.counts(cm.PRESETS.Fraud);
  assert.deepEqual([f.tp, f.fp, f.fn, f.tn], [45, 179, 5, 9771]);
  const l = cm.counts(cm.PRESETS.Leads);
  assert.deepEqual([l.tp, l.fp, l.fn, l.tn], [60, 20, 40, 180]);
});

/* Singular counts: n 100, prevalence 2 %, sensitivity 50 %, specificity 99 %, Churn wording.
     positives = 2 ; TP = 1 ; FN = 1 ; negatives = 98 ; TN = round(97.02) = 97 ; FP = 1
     cost at €10 per FP, €200 per FN: 10 + 200 = €210 ; FN share 200 / 210 = 95.2 % → 95 % ; FP share 10 / 210 = 4.8 % → 5 % */
test('CM · one miss and one false alarm read in the singular', () => {
  const e = cm.evaluate({ n: 100, prevalence: 2, sensitivity: 50, specificity: 99, costFP: 10, costFN: 200, preset: 'Churn' });
  assert.deepEqual([e.tp, e.fn, e.fp, e.tn], [1, 1, 1, 97]);
  assert.equal(e.totalCost, 210);
  assert.equal(e.verdict('en'), 'Errors cost €210 across 100 cases: 95% from the 1 churner missed, 5% from the 1 false alarm.');
  assert.equal(e.verdict('de'), `Fehler kosten €${NBSP}210 über 100 Fälle: 95${NBSP}% durch 1 übersehenen Abwanderer, 5${NBSP}% durch 1 Fehlalarm.`);
});

/* Errors at a price of zero: the Churn counts (FN 20, FP 40) at €0 and €0.
   The verdict must not claim there are no errors. */
test('CM · errors priced at zero are stated, not hidden', () => {
  const e = cm.evaluate({ ...cm.DEFAULTS, costFP: 0, costFN: 0 });
  assert.deepEqual([e.fn, e.fp, e.totalCost], [20, 40, 0]);
  assert.equal(e.verdict('en'), 'At these prices the 20 churners missed and the 40 false alarms cost €0.');
  assert.equal(e.verdict('de'), `Bei diesen Preisen fallen für 20 übersehene Abwanderer und 40 Fehlalarme €${NBSP}0 an.`);
});

test('CM · zero errors and zero denominators do not divide by zero', () => {
  const e = cm.evaluate({ n: 1000, prevalence: 10, sensitivity: 100, specificity: 100, costFP: 10, costFN: 10 });
  assert.equal(e.totalCost, 0);
  assert.equal(e.fpShare, 0);
  assert.equal(e.verdict('en'), 'No error cost across 1,000 cases: every positive is flagged and no negative is.');
  const m = cm.metrics({ tp: 0, fp: 0, fn: 0, tn: 0 });
  assert.deepEqual(m, { accuracy: 0, precision: 0, recall: 0, specificity: 0, npv: 0, f1: 0, fpr: 0, fnr: 0 });
});

/* Shares that would round past 100: Churn counts (FN 20, FP 40) at €3 per FP and €10 per FN.
     cost = 40 · 3 + 20 · 10 = 120 + 200 = €320 ; FN share 200 / 320 = 62.5 % ; FP share 37.5 %
     rounded independently: 63 + 38 = 101 ; FN rounded, FP its complement: 63 + 37 = 100 */
test('CM · the two cost shares add up to 100%', () => {
  const e = cm.evaluate({ ...cm.DEFAULTS, costFP: 3, costFN: 10 });
  assert.equal(e.totalCost, 320);
  assert.equal(e.verdict('en'), 'Errors cost €320 across 500 cases: 63% from the 20 churners missed, 37% from the 40 false alarms.');
  assert.equal(e.verdict('de'), `Fehler kosten €${NBSP}320 über 500 Fälle: 63${NBSP}% durch 20 übersehene Abwanderer, 37${NBSP}% durch 40 Fehlalarme.`);
});

/* No positive case: n 100 at a prevalence of 0.1 % → positives = round(0.1) = 0 ; specificity 100 % → FP 0.
   Recall, FNR and F1 are 0/0 and print as an en dash; precision is 0/0 too (TP + FP = 0).
   The verdict must not say "every positive is flagged". */
test('CM · zero positives: undefined rates print a dash and the verdict says why', () => {
  const e = cm.evaluate({ n: 100, prevalence: 0.1, sensitivity: 90, specificity: 100, costFP: 10, costFN: 200 });
  assert.deepEqual([e.positives, e.tp, e.fn, e.fp, e.tn], [0, 0, 0, 0, 100]);
  assert.equal(e.verdict('en'), 'No error cost across 100 cases, but no case is positive at this prevalence: recall and F1 are undefined.');
  assert.equal(e.verdict('de'), 'Keine Fehlerkosten über 100 Fälle, aber bei dieser Prävalenz ist kein Fall positiv: Recall und F1 sind nicht definiert.');
  const v = Object.fromEntries(e.kpis('en').map((k) => [k.key, k.value]));
  assert.deepEqual([v.accuracy, v.precision, v.recall, v.specificity, v.f1, v.fnr], ['100.0%', EN_DASH, EN_DASH, '100.0%', EN_DASH, EN_DASH]);
  // with false alarms but no positives, precision is defined (0 of the flagged are positive)
  const f = cm.evaluate({ n: 100, prevalence: 0.1, sensitivity: 90, specificity: 90, costFP: 10, costFN: 200 });
  const w = Object.fromEntries(f.kpis('en').map((k) => [k.key, k.value]));
  assert.deepEqual([w.precision, w.recall, w.f1], ['0.0%', EN_DASH, EN_DASH]);
});

/* ============================================================
   Formatting (format.js conventions, D-031)
   ============================================================ */
test('format · the tools use the shared formatter (src/lib/format.mjs)', () => {
  for (const name of ['number', 'currency', 'percent', 'unit', 'dash']) assert.equal(ab[name], fmt[name], name);
  for (const name of ['number', 'currency', 'percent', 'unit']) assert.equal(cm[name], fmt[name], name);
});

test('format · en-GB and de-AT separators, NBSP, real minus', () => {
  assert.equal(ab.number(1240991, 'en'), '1,240,991');
  assert.equal(ab.number(1240991, 'de'), '1.240.991');
  assert.equal(ab.number(0.05, 'de'), '0,05');
  assert.equal(ab.number(-28, 'en'), '−28');
  assert.equal(ab.percent(99.8, 'de', 1), `99,8${NBSP}%`);
  assert.equal(ab.currency(453000, 'en'), '€453,000');
  assert.equal(ab.currency(453000, 'de'), `€${NBSP}453.000`);
  assert.equal(ab.unit(38, 's', 'en'), `38${NBSP}s`);
  assert.equal(ab.fmtN(1234567, 'en'), '1.23M');
  assert.equal(ab.fmtN(1234567, 'de'), `1,23${NBSP}M`);
});
