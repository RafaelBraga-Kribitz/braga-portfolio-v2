// Display formulas broken to fit their column (src/lib/math-fit.mjs), with
// hand-worked references. The measure in these tests is one em per
// character of TeX, so the widths are easy to count by hand.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { segments, breakVariants, fitRanges, MATH_PX, FIT_MARGIN, FIT_STEPS } from '../../src/lib/math-fit.mjs';

const chars = (/** @type {string} */ tex) => tex.length;

test('segments: cut at top-level relations, signs, separators and \\text spaces', () => {
  assert.deepEqual(segments('a = b + c').map((s) => [s.kind, s.tex]), [['start', 'a'], ['rel', '= b'], ['bin', '+ c']]);
  // a sign after a relation, or at the start, is unary: no cut
  assert.deepEqual(segments('-a = -b').map((s) => s.kind), ['start', 'rel']);
  // nothing inside braces or \left…\right is ever cut
  assert.deepEqual(segments('\\frac{a = b}{c + d} = \\left( x + y \\right)').map((s) => s.tex), ['\\frac{a = b}{c + d}', '= \\left( x + y \\right)']);
  // a separator is dropped and marks the break
  assert.deepEqual(segments('x = 1, \\quad y = 2').map((s) => [s.kind, s.tex]), [['start', 'x'], ['rel', '= 1,'], ['sep', 'y'], ['rel', '= 2']]);
  // the words of a \text
  assert.deepEqual(segments('\\text{net gain} = g').map((s) => [s.kind, s.tex]), [['start', '\\text{net}'], ['word', '\\text{ gain}'], ['rel', '= g']]);
});

test('segments: the author\'s line break in a product is a break, with ×', () => {
  const segs = segments('p =\nA\nB');
  assert.deepEqual(segs.map((s) => [s.kind, s.tex]), [['start', 'p'], ['rel', '=\nA'], ['nl', 'B']]);
  const v = breakVariants('p =\nA\nB', () => 10);
  assert.ok(v.some((t) => t.includes('\\times B')));
});

test('breakVariants: a formula that lays itself out, or has nothing to break, stays as written', () => {
  assert.deepEqual(breakVariants('\\begin{aligned} a &= b \\end{aligned}', chars), ['\\begin{aligned} a &= b \\end{aligned}']);
  assert.deepEqual(breakVariants('\\frac{a}{b}', chars), ['\\frac{a}{b}']);
});

test('breakVariants: as written first, then fewer lines before more, aligned before stacked', () => {
  const v = breakVariants('a = b + c', () => 30);
  assert.equal(v[0], 'a = b + c');
  // 30em segments overflow every target: one segment a line, the
  // relation's line aligned on it, the sign's line indented
  assert.equal(v[1], '\\begin{aligned}a & \\\\ &= b \\\\ &\\quad + c\\end{aligned}');
  assert.equal(v[2], '\\begin{aligned}&a \\\\ &\\quad = b \\\\ &\\quad + c\\end{aligned}');
});

test('fitRanges: the least broken version that fits each column width', () => {
  const px = (/** @type {number} */ p) => p / (MATH_PX * FIT_MARGIN);
  // fits from 480px; from 240px; never fits below 240 → the narrowest stands there
  const r = fitRanges([px(470), px(230)]);
  assert.deepEqual(r[0], { from: 480, to: Infinity });
  assert.deepEqual(r[1], { from: 0, to: 480 });
  // below the first step (160px) nothing fits: the narrower one stands there
  assert.deepEqual(fitRanges([px(100), px(90)]), [{ from: 160, to: Infinity }, { from: 0, to: 160 }]);
  assert.ok(FIT_STEPS.every((s, i) => i === 0 || s > FIT_STEPS[i - 1]));
});

test('fitRanges: where nothing fits, the narrowest version stands', () => {
  const px = (/** @type {number} */ p) => p / (MATH_PX * FIT_MARGIN);
  const r = fitRanges([px(2000), px(1500), px(1800)]);
  assert.equal(r[1].from, 0);
  assert.equal(r[1].to, Infinity);
  assert.equal(r[0], null);
  assert.equal(r[2], null);
});
