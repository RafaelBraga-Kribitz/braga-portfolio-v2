// 04-02 · A/B sample size — the Site specimen's bench (s06), one to one.
// A Preact island: the default scenario renders on the server, so the
// page is complete without JavaScript; with it, every readout, the
// verdict, the chart and the live equation follow the controls. The
// maths is src/lib/tools/ab-sample-size.mjs (tested). No inline style
// anywhere: the chart is drawn with attributes and the role classes of
// charts.css (.gridline .axis .cap .curve .cursor .marker).
//
// German strings are agent drafts awaiting the owner's approval (O-05).

import { useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import {
  plan, PRESETS, DEFAULTS, BOUNDS, POWERS, RULE, CHART,
  percent, number, clamp,
} from '@/lib/tools/ab-sample-size.mjs';

export type Lang = 'en' | 'de';

/* ---------- shared controls (also used by ConfusionMatrixBench) ---------- */

export interface Bound { min: number; max: number; step: number }

export interface RangeProps {
  id: string;
  label: string;
  bound: Bound;
  value: number;
  /** The readout beside the slider, already formatted for the language. */
  display: string;
  onChange: (value: number) => void;
}

/** label · native range · readout, on the .range grid of bench.css */
export function Range({ id, label, bound, value, display, onChange }: RangeProps) {
  return (
    <div class="range">
      <label for={id} class="range-label">{label}</label>
      <input
        id={id}
        type="range"
        min={bound.min}
        max={bound.max}
        step={bound.step}
        value={value}
        onInput={(e) => onChange(clamp(Number(e.currentTarget.value), bound.min, bound.max))}
      />
      <output for={id} class="range-value">{display}</output>
    </div>
  );
}

export interface SegmentedProps {
  name: string;
  legend: string;
  items: { id: string; label: string }[];
  value: string | null;
  onChange: (id: string) => void;
  class?: string;
}

/** a fieldset of radios drawn as one strip (.segmented of bench.css) */
export function Segmented({ name, legend, items, value, onChange, class: className }: SegmentedProps) {
  return (
    <fieldset class={className ? `segmented ${className}` : 'segmented'}>
      <legend class="label">{legend}</legend>
      <div class="segmented-strip">
        {items.map((it) => (
          <label key={it.id}>
            <input type="radio" name={name} value={it.id} checked={value === it.id} onChange={() => onChange(it.id)} />
            <span>{it.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export interface KpiProps { label: string; value: string; note: string; accent?: boolean }

export function Kpi({ label, value, note, accent }: KpiProps) {
  return (
    <div class="kpi" data-accent={accent ? '' : undefined}>
      <div class="label">{label}</div>
      <div class="kpi-value">{value}</div>
      <div class="kpi-note">{note}</div>
    </div>
  );
}

export function BenchHead({ left, right }: { left: ComponentChildren; right: ComponentChildren }) {
  return (
    <div class="bench-head">
      <span class="label">{left}</span>
      <span class="label">{right}</span>
    </div>
  );
}

/* ---------- words ---------- */

const T = {
  en: {
    region: 'A/B sample size bench',
    head: '04-02 · A/B testing · sample size',
    headRight: ['Two-sided · ', ' = 0.05 · equal arms'],
    preset: 'Preset',
    inputs: 'Inputs',
    base: 'Baseline',
    lift: 'Lift',
    traffic: 'Visitors/d',
    power: 'Power',
    reset: 'Reset',
    limit: 'Limit: normal approximation for two proportions. Does not cover sequential peeking or more than two arms.',
    kpi: { perArm: 'Per arm', total: 'Total', duration: 'Duration', mde: 'Absolute MDE' } as Record<string, string>,
    fig: 'Fig. 04-02 · Sample per arm against lift',
    figNote: 'log scale · lift 2–50%',
    figAlt: 'Visitors per arm against relative lift on a log scale, with the eight-week ceiling at this traffic and the current lift marked.',
    cap: '8-week ceiling at this traffic',
    rule: 'Rule',
  },
  de: {
    region: 'A/B-Stichprobengröße',
    head: '04-02 · A/B-Test · Stichprobengröße',
    headRight: ['Zweiseitig · ', ' = 0,05 · gleiche Arme'],
    preset: 'Vorlage',
    inputs: 'Eingaben',
    base: 'Basisrate',
    lift: 'Lift',
    traffic: 'Besucher/d',
    power: 'Power',
    reset: 'Zurücksetzen',
    limit: 'Limit: Normalapproximation für zwei Anteile. Deckt weder sequentielles Nachschauen noch mehr als zwei Arme ab.',
    kpi: { perArm: 'Pro Arm', total: 'Gesamt', duration: 'Dauer', mde: 'Absolute MDE' } as Record<string, string>,
    fig: 'Abb. 04-02 · Stichprobe pro Arm gegen Lift',
    figNote: 'log-Skala · Lift 2–50 %',
    figAlt: 'Besucher pro Arm gegen relativen Lift auf einer log-Skala, mit der Acht-Wochen-Grenze bei diesem Traffic und dem aktuellen Lift markiert.',
    cap: '8-Wochen-Grenze bei diesem Traffic',
    rule: 'Regel',
  },
};

/* ---------- the island ---------- */

type Power = (typeof POWERS)[number];
interface State { base: number; lift: number; traffic: number; power: Power; preset: string | null }

const PRESET_ITEMS = Object.keys(PRESETS).map((id) => ({ id, label: id }));

export default function AbSampleSizeBench({ lang = 'en' }: { lang?: Lang }) {
  const t = T[lang] ?? T.en;
  const [s, setS] = useState<State>({ ...DEFAULTS });
  const p = plan(s);
  const c = p.chart;

  const set = (key: 'base' | 'lift' | 'traffic') => (v: number) => setS({ ...s, [key]: v, preset: null });
  const applyPreset = (id: string) => {
    const pre = (PRESETS as Record<string, { base: number; lift: number; traffic: number }>)[id];
    if (pre) setS({ ...s, ...pre, preset: id });
  };

  return (
    <section class="bench-tool" aria-label={t.region}>
      <BenchHead
        left={t.head}
        right={<>{t.headRight[0]}<span class="sym">α</span>{t.headRight[1]}</>}
      />

      <div class="bench grid">
        <div class="bench-controls col-4">
          <Segmented name="ab-preset" legend={t.preset} items={PRESET_ITEMS} value={s.preset} onChange={applyPreset} />

          <p class="label rule-t">{t.inputs}</p>
          <Range id="ab-base" label={t.base} bound={BOUNDS.base} value={s.base} display={percent(s.base, lang, 1)} onChange={set('base')} />
          <Range id="ab-lift" label={t.lift} bound={BOUNDS.lift} value={s.lift} display={percent(s.lift, lang, 0)} onChange={set('lift')} />
          <Range id="ab-traffic" label={t.traffic} bound={BOUNDS.traffic} value={s.traffic} display={number(s.traffic, lang, 0)} onChange={set('traffic')} />

          <Segmented
            class="rule-t"
            name="ab-power"
            legend={t.power}
            items={POWERS.map((id) => ({ id, label: percent(Number(id), lang, 0) }))}
            value={s.power}
            onChange={(id) => setS({ ...s, power: id as Power })}
          />

          <div>
            <button type="button" class="button" data-variant="ghost" onClick={() => setS({ ...DEFAULTS })}>{t.reset}</button>
          </div>

          <p class="bench-limit">{t.limit}</p>
        </div>

        <div class="bench-output col-8 vrule">
          <p class="bench-verdict display">{p.verdict(lang)}</p>

          <div class="bench-kpis" aria-live="polite">
            {p.kpis(lang).map((k) => (
              <Kpi key={k.key} label={t.kpi[k.key] ?? k.key} value={k.value} note={k.note} />
            ))}
          </div>

          <div class="bench-figure">
            <div class="bench-figure-head">
              <span class="label">{t.fig}</span>
              <span class="label dim">{t.figNote}</span>
            </div>
            <div class="bench-figure-scroll">
              <svg viewBox={`0 0 640 260`} role="img" aria-label={t.figAlt}>
                {c.yTicks.map((yt) => (
                  <g key={yt.label}>
                    <line class="gridline" x1={CHART.x0} y1={yt.y} x2={CHART.x1} y2={yt.y} />
                    <text x={CHART.x0 - 8} y={yt.ty} text-anchor="end">{yt.label}</text>
                  </g>
                ))}
                <line class="axis" x1={CHART.x0} y1={CHART.baseline} x2={CHART.x1} y2={CHART.baseline} />
                {c.xTicks(lang).map((xt) => (
                  <g key={xt.label}>
                    <line class="axis" x1={xt.x} y1={CHART.baseline} x2={xt.x} y2={CHART.tickY} />
                    <text x={xt.x} y={CHART.tickLabelY} text-anchor="middle">{xt.label}</text>
                  </g>
                ))}
                <line class="cap" x1={CHART.x0} y1={c.capY} x2={CHART.x1} y2={c.capY} />
                <text x={CHART.x1} y={c.capTy} text-anchor="end">{t.cap}</text>
                <path class="curve" d={c.curve} />
                <line class="cursor" x1={c.cx} y1={c.cy} x2={c.cx} y2={CHART.baseline} />
                <rect class="marker" x={c.rx} y={c.ry} width={CHART.marker} height={CHART.marker} />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="bench-rule grid rule-t">
        <div class="col-4 label">{t.rule}</div>
        <div class="col-8">
          <div class="bench-eq">{RULE}</div>
          <div class="bench-eq dim">{p.eqLive(lang)}</div>
        </div>
      </div>
    </section>
  );
}
