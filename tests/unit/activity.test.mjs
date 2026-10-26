// The build log's binning and its HTML (src/lib/activity/render.mjs), with
// hand-computed references.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bins, heatLevel, renderBuildLog } from '../../src/lib/activity/render.mjs';

test('bins: up to seven counts get one bin each', () => {
  assert.deepEqual(bins(0), []);
  assert.deepEqual(bins(3), [[1, 1], [2, 2], [3, 3]]);
  assert.deepEqual(bins(7).length, 7);
});

test('bins: geometric from 1 to max, contiguous, seven at most', () => {
  // 31^(i/7): 1.63 2.67 4.35 7.10 11.58 18.89 → 2 3 4 7 12 19 31
  assert.deepEqual(bins(31), [[1, 2], [3, 3], [4, 4], [5, 7], [8, 12], [13, 19], [20, 31]]);
  for (const max of [8, 9, 12, 40, 79, 500]) {
    const b = bins(max);
    assert.ok(b.length <= 7);
    assert.equal(b[0][0], 1);
    assert.equal(b.at(-1)[1], max);
    b.forEach(([lo, hi], i) => { assert.ok(lo <= hi); if (i) assert.equal(lo, b[i - 1][1] + 1); });
  }
});

test('heatLevel: 0 for none; bins spread over 1…7', () => {
  const seven = bins(31);
  assert.equal(heatLevel(0, seven), 0);
  assert.equal(heatLevel(1, seven), 1);
  assert.equal(heatLevel(31, seven), 7);
  const three = bins(3); // three bins → steps 1, 4, 7
  assert.deepEqual([1, 2, 3].map((v) => heatLevel(v, three)), [1, 4, 7]);
  assert.equal(heatLevel(1, bins(1)), 7);
});

const project = {
  repository: 'https://github.com/owner/repo',
  commits: 6, prs: 2, first: '2026-05-06', last: '2026-05-12', activeDays: 3,
  weekHour: Array.from({ length: 7 }, (_, d) => Array.from({ length: 24 }, (_, h) => (d === 2 && h === 18 ? 3 : d === 0 && h === 9 ? 2 : d === 1 && h === 10 ? 1 : 0))),
  daily: { '2026-05-06': 3, '2026-05-11': 2, '2026-05-12': 1 },
  lines: { tests: 250, ci: 10, docs: 100, code: 1000 },
};

test('renderBuildLog: findings, figures and the earned bar', () => {
  const html = renderBuildLog(project, { lang: 'en', code: '01-09', generated: '2026-10-26' });
  assert.match(html, /^<p>6 commits and 2 merged pull requests on 3 days between 6 May 2026 and 12 May 2026\./);
  assert.match(html, /Fig\. 01-09-B1 · Calendar/);
  assert.match(html, /The busiest day was 6 May 2026, with 3 commits\./);
  assert.match(html, /The busiest hour of the week: Wednesday, 18:00–19:00, 3 commits\./);
  assert.match(html, /25 lines of tests for every 100 lines of code\./);
  assert.match(html, /<div class="ev-bar" data-accent><span class="ev-label">Tests<\/span><span class="ev-track"><span class="ev-fill" style="--w: 25%">/);
  assert.equal((html.match(/data-accent/g) || []).length, 1);
  // the calendar: Mon 4 May … Tue 12 May is two weeks; days outside first…last are not drawn
  assert.equal((html.match(/<title>\d+ May 2026 · \d+<\/title>/g) || []).length, 7);
  assert.equal((html.match(/<title>(Mon|Tue|Wed|Thu|Fri|Sat|Sun) \d\d:00 · \d+<\/title>/g) || []).length, 168);
  assert.doesNotMatch(html, /undefined|NaN/);
});

test('renderBuildLog: German', () => {
  const html = renderBuildLog(project, { lang: 'de', code: '01-09', generated: '2026-10-26' });
  assert.match(html, /Abb\. 01-09-B2 · Woche/);
  assert.match(html, /Mittwoch, 18:00–19:00 Uhr/);
  assert.match(html, /25 Zeilen Tests auf 100 Zeilen Code\./);
  assert.match(html, /Quelle:<\/b> Git-Historie von owner\/repo/);
});
