// 04-01 · Confusion matrix — the same bench as 04-02 (Site s06): head
// bar, controls on 4, output on 8, verdict, a 2 × 2 matrix, the eight
// rates as readouts with the one accent figure (the total cost, D-025),
// and the cost arithmetic spelled out as the rule line. Default state is
// server-rendered. Maths: src/lib/tools/confusion-matrix.mjs (tested).
//
// German strings are agent drafts awaiting the owner's approval (O-05).

import { useState } from 'preact/hooks';
import { evaluate, PRESETS, DEFAULTS, BOUNDS, RULE, number, percent, currency } from '@/lib/tools/confusion-matrix.mjs';
import { Range, Segmented, Kpi, BenchHead, type Lang } from './AbSampleSizeBench';

/* ---------- words ---------- */

type Cells = { tp: string; fp: string; fn: string; tn: string };

const T = {
  en: {
    region: 'Confusion matrix bench',
    head: '04-01 · Classification · confusion matrix',
    headRight: 'Binary · one operating point · costs per error',
    preset: 'Preset',
    inputs: 'Inputs',
    n: 'Cases',
    prevalence: 'Prevalence',
    sensitivity: 'Sensitivity',
    specificity: 'Specificity',
    costs: 'Costs',
    costFP: '€ per FP',
    costFN: '€ per FN',
    reset: 'Reset',
    limit: 'Limit: whole cases rounded from the rates, one operating point. The threshold curve behind it is not modelled.',
    fig: 'Fig. 04-01 · Confusion matrix',
    figNote: (n: string) => `n\u00A0=\u00A0${n} · rows actual · columns predicted`,   // NBSP: format.equation
    matrix: 'Confusion matrix',
    predicted: ['Predicted positive', 'Predicted negative'],
    actual: ['Actual positive', 'Actual negative'],
    cells: {
      Churn: { tp: 'churners flagged', fp: 'loyal customers flagged', fn: 'churners missed', tn: 'loyal customers cleared' },
      Fraud: { tp: 'frauds caught', fp: 'legitimate transactions blocked', fn: 'frauds missed', tn: 'legitimate transactions passed' },
      Leads: { tp: 'real leads flagged', fp: 'bad leads sent to sales', fn: 'real leads missed', tn: 'bad leads filtered' },
    } as Record<string, Cells>,
    rule: 'Rule',
  },
  de: {
    region: 'Konfusionsmatrix',
    head: '04-01 · Klassifikation · Konfusionsmatrix',
    headRight: 'Binär · ein Arbeitspunkt · Kosten je Fehler',
    preset: 'Vorlage',
    inputs: 'Eingaben',
    n: 'Fälle',
    prevalence: 'Prävalenz',
    sensitivity: 'Sensitivität',
    specificity: 'Spezifität',
    costs: 'Kosten',
    costFP: '€ pro FP',
    costFN: '€ pro FN',
    reset: 'Zurücksetzen',
    limit: 'Limit: ganze Fälle, aus den Raten gerundet, ein Arbeitspunkt. Die Schwellenkurve dahinter ist nicht modelliert.',
    fig: 'Abb. 04-01 · Konfusionsmatrix',
    figNote: (n: string) => `n\u00A0=\u00A0${n} · Zeilen tatsächlich · Spalten vorhergesagt`,
    matrix: 'Konfusionsmatrix',
    predicted: ['Vorhergesagt positiv', 'Vorhergesagt negativ'],
    actual: ['Tatsächlich positiv', 'Tatsächlich negativ'],
    cells: {
      Churn: { tp: 'Abwanderer erkannt', fp: 'treue Kunden markiert', fn: 'Abwanderer übersehen', tn: 'treue Kunden freigegeben' },
      Fraud: { tp: 'Betrugsfälle erkannt', fp: 'legitime Transaktionen blockiert', fn: 'Betrugsfälle übersehen', tn: 'legitime Transaktionen durchgelassen' },
      Leads: { tp: 'echte Leads markiert', fp: 'schlechte Leads an den Vertrieb', fn: 'echte Leads übersehen', tn: 'schlechte Leads gefiltert' },
    } as Record<string, Cells>,
    rule: 'Regel',
  },
};

/* ---------- the island ---------- */

interface State {
  n: number; prevalence: number; sensitivity: number; specificity: number;
  costFP: number; costFN: number;
  /** the checked preset; null once a slider moved */
  preset: string | null;
  /** the vocabulary of the last preset chosen (cell notes, the verdict's noun) */
  vocab: string;
}
type NumKey = 'n' | 'prevalence' | 'sensitivity' | 'specificity' | 'costFP' | 'costFN';

const PRESET_ITEMS = Object.keys(PRESETS).map((id) => ({ id, label: id }));
const START: State = { ...DEFAULTS, vocab: DEFAULTS.preset };

export default function ConfusionMatrixBench({ lang = 'en' }: { lang?: Lang }) {
  const t = T[lang] ?? T.en;
  const [s, setS] = useState<State>(START);
  const e = evaluate({ ...s, preset: s.vocab });
  const cells = t.cells[s.vocab] ?? t.cells.Churn;

  const set = (key: NumKey) => (v: number) => setS({ ...s, [key]: v, preset: null });
  const applyPreset = (id: string) => {
    const pre = (PRESETS as Record<string, Omit<State, 'preset' | 'vocab'>>)[id];
    if (pre) setS({ ...s, ...pre, preset: id, vocab: id });
  };

  const cell = (key: keyof Cells, n: number, error: boolean) => (
    <div class="cm-cell" role="cell" data-error={error ? '' : undefined}>
      <span class="label">{key.toUpperCase()}</span>
      <span class="cm-n">{number(n, lang)}</span>
      <span class="cm-note">{cells[key]}</span>
    </div>
  );

  return (
    <section class="bench-tool cm-bench" aria-label={t.region}>
      <BenchHead left={t.head} right={t.headRight} />

      <div class="bench grid">
        <div class="bench-controls col-4">
          <Segmented name="cm-preset" legend={t.preset} items={PRESET_ITEMS} value={s.preset} onChange={applyPreset} />

          <p class="label rule-t">{t.inputs}</p>
          <Range id="cm-n" label={t.n} bound={BOUNDS.n} value={s.n} display={number(s.n, lang, 0)} onChange={set('n')} />
          <Range id="cm-prevalence" label={t.prevalence} bound={BOUNDS.prevalence} value={s.prevalence} display={percent(s.prevalence, lang, 1)} onChange={set('prevalence')} />
          <Range id="cm-sensitivity" label={t.sensitivity} bound={BOUNDS.sensitivity} value={s.sensitivity} display={percent(s.sensitivity, lang, 1)} onChange={set('sensitivity')} />
          <Range id="cm-specificity" label={t.specificity} bound={BOUNDS.specificity} value={s.specificity} display={percent(s.specificity, lang, 1)} onChange={set('specificity')} />

          <p class="label rule-t">{t.costs}</p>
          <Range id="cm-cost-fp" label={t.costFP} bound={BOUNDS.costFP} value={s.costFP} display={currency(s.costFP, lang)} onChange={set('costFP')} />
          <Range id="cm-cost-fn" label={t.costFN} bound={BOUNDS.costFN} value={s.costFN} display={currency(s.costFN, lang)} onChange={set('costFN')} />

          <div>
            <button type="button" class="button" data-variant="ghost" onClick={() => setS(START)}>{t.reset}</button>
          </div>

          <p class="bench-limit">{t.limit}</p>
        </div>

        <div class="bench-output col-8 vrule">
          {/* the live readout: see AbSampleSizeBench */}
          <p class="bench-verdict display" role="status">{e.verdict(lang)}</p>

          <div class="bench-figure">
            <div class="bench-figure-head">
              <span class="label">{t.fig}</span>
              <span class="label dim">{t.figNote(number(e.n, lang))}</span>
            </div>
            <div class="cm-matrix" role="table" aria-label={t.matrix}>
              <div class="cm-row" role="row">
                <div class="cm-corner" role="cell"></div>
                <div class="cm-head label" role="columnheader">{t.predicted[0]}</div>
                <div class="cm-head label" role="columnheader">{t.predicted[1]}</div>
              </div>
              <div class="cm-row" role="row">
                <div class="cm-head label" role="rowheader">{t.actual[0]}</div>
                {cell('tp', e.tp, false)}
                {cell('fn', e.fn, true)}
              </div>
              <div class="cm-row" role="row">
                <div class="cm-head label" role="rowheader">{t.actual[1]}</div>
                {cell('fp', e.fp, true)}
                {cell('tn', e.tn, false)}
              </div>
            </div>
          </div>

          <div class="bench-kpis">
            {e.kpis(lang).map((k) => (
              <Kpi key={k.key} label={k.label} value={k.value} note={k.note} accent={k.accent} />
            ))}
          </div>
        </div>
      </div>

      <div class="bench-rule grid rule-t">
        <div class="col-4 label">{t.rule}</div>
        <div class="col-8">
          <div class="bench-eq">{RULE}</div>
          <div class="bench-eq dim">{e.costLive(lang)}</div>
        </div>
      </div>
    </section>
  );
}
