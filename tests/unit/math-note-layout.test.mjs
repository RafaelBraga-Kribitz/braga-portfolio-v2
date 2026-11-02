import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

// Normalise CRLF: a Windows checkout (core.autocrlf) must test the same text as CI.
const note = (path) => readFileSync(new URL(`../../vault/Notes/en/${path}`, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
const graph = note('06_ml_math/network_analysis_graph_theory/graph_foundations_and_the_laplace_matrix/graph_definition.md');
const schedule = note('04_calculus_optimization/continuous_optimization/advanced_optimizers_stochastic_and_adaptive/learning_rate_schedules.md');

test('compact graph rows preserve the original undirected graph and adjacency', () => {
  const formula = graph.match(/\\begin\{aligned\}\s*V\s*&=([\s\S]*?)\\end\{aligned\}/)?.[0];
  assert.ok(formula, 'the concrete example must separate V, E, and G into rows');
  assert.match(formula, /V\s*&=\s*\\\{A,B,C\\\}/);
  assert.match(formula, /E\s*&=\s*\\\{\\\{A,B\\\},\\\{B,C\\\}\\\}/);
  assert.match(formula, /G\s*&=\s*\(V,E\)/);
  // Parse the actual authored edge pairs, so a changed endpoint fails.
  const pairs = [...formula.matchAll(/\\\{([A-C]),([A-C])\\\}/g)].map((m) => [m[1], m[2]]);
  const vertices = ['A', 'B', 'C'];
  const adjacency = vertices.map((u) => vertices.map((v) => Number(pairs.some(([a, b]) => (a === u && b === v) || (a === v && b === u)))));
  assert.deepEqual(adjacency, [[0, 1, 0], [1, 0, 1], [0, 1, 0]]);
});

test('compact warmup/cosine formula retains branches and endpoint values', () => {
  const formula = schedule.match(/\$\$\n([\s\S]*?)\n\$\$/)?.[1];
  assert.match(formula, /\\eta_\{\\min\}\s*\+\s*\\Delta\\eta\s*c_t/);
  assert.match(schedule, /\\Delta\\eta\s*&?=\s*\\eta_\{\\max\}\s*-\s*\\eta_\{\\min\}/);
  assert.match(formula, /\\eta_\{\\max\}.*?\\dfrac\{t\}\{W\},\s*&\s*t\s*\\lt W/);
  assert.match(formula, /W\s*\\le t\s*\\le T/);
  assert.match(schedule, /c_t\s*&?=\s*\\dfrac\{1\s*\+\s*\\cos\\pi p_t\}\{2\}/);
  assert.match(schedule, /p_t\s*&?=\s*\\dfrac\{t\s*-\s*W\}\{T\s*-\s*W\}/);
  const peak = 0.01, floor = 0.002, warmup = 100, total = 1000;
  const compact = (t) => t < warmup ? peak * t / warmup : floor + (peak - floor) * (1 + Math.cos(Math.PI * (t - warmup) / (total - warmup))) / 2;
  for (const [t, expected] of [[0, 0], [50, .005], [100, .01], [550, .006], [1000, .002]]) {
    assert.ok(Math.abs(compact(t) - expected) < 1e-12, `t=${t}`);
  }
  // Compare the original expanded expression at interior and boundary points.
  for (const t of [0, 1, 99, 100, 101, 550, 999, 1000]) {
    const p = (t - warmup) / (total - warmup);
    const original = t < warmup ? peak * t / warmup : floor + (peak - floor) * .5 * (1 + Math.cos(Math.PI * p));
    assert.ok(Math.abs(compact(t) - original) < 1e-12);
  }
});

test('compact median odd/even indices select the same original order statistics', () => {
  const median = note('05_probability_stats/statistical_operations_and_random_variables/basic_statistical_operations/median.md');
  const formulas = [...median.matchAll(/\$\$\n([\s\S]*?)\n\$\$/g)].map((m) => m[1]);
  assert.equal(formulas.length, 2);
  assert.match(formulas[0], /\\text\{median\}\(x\)\s*=\s*x_\{\(m\)\}/);
  assert.match(formulas[1], /\\frac\{x_\{\(m\)\}\s*\+\s*x_\{\(m\+1\)\}\}\{2\}/);
  assert.match(median, /odd sample size \$n=2m-1\$/);
  assert.match(median, /even sample size \$n=2m\$/);
  for (const [sorted, expected] of [[[5], 5], [[1, 9], 5], [[1, 3, 8], 3], [[-4, -1, 2, 9], .5], [[1, 2, 2, 3, 99], 2]]) {
    const n = sorted.length;
    const m = n % 2 ? (n + 1) / 2 : n / 2;
    const compact = n % 2 ? sorted[m - 1] : (sorted[m - 1] + sorted[m]) / 2;
    const original = n % 2 ? sorted[(n + 1) / 2 - 1] : .5 * (sorted[n / 2 - 1] + sorted[n / 2]);
    assert.equal(compact, original);
    assert.equal(compact, expected);
  }
});

test('saddle rows retain zero gradient and both strict opposite-sign eigenvalue conditions', () => {
  const saddle = note('04_calculus_optimization/continuous_optimization/gradient_descent/saddle_points_in_loss_landscapes.md');
  const formula = saddle.match(/\$\$\n([\s\S]*?)\n\$\$/)?.[1];
  assert.match(formula, /\\begin\{aligned\}/);
  assert.match(formula, /\\nabla f\(\\boldsymbol\{\\theta\}\^\*\)\s*&=\s*\\mathbf\{0\}/);
  assert.match(formula, /\\lambda_\{\\min\}[\s\S]*?&\\lt\s*0/);
  assert.match(formula, /\\lambda_\{\\max\}[\s\S]*?&\\gt\s*0/);
  const cases = [
    {gradient: [0, 0], eigenvalues: [-2, 2], expected: true},
    {gradient: [1, 0], eigenvalues: [-2, 2], expected: false},
    {gradient: [0, 0], eigenvalues: [1, 2], expected: false},
    {gradient: [0, 0], eigenvalues: [-2, -1], expected: false},
    {gradient: [0, 0], eigenvalues: [0, 2], expected: false},
    {gradient: [0, 0], eigenvalues: [-2, 0], expected: false},
  ];
  for (const {gradient, eigenvalues, expected} of cases) {
    const min = Math.min(...eigenvalues), max = Math.max(...eigenvalues);
    const stationary = gradient.every((x) => x === 0);
    assert.equal(stationary && min < 0 && max > 0, expected);
    assert.equal(stationary && min < 0 && 0 < max, expected);
  }
});
