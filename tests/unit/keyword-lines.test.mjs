// The listing keywords two to a line (src/lib/keyword-lines.mjs), with
// hand-computed references. A line's width is the sum of (length + 1.5)
// over its keywords plus 1 between them, so a pair is a + b + 4.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { keywordLines, lineWidth } from '../../src/lib/keyword-lines.mjs';

test('lineWidth: words, their boxes and the gap between them', () => {
  assert.equal(lineWidth(['SQL']), 4.5);
  assert.equal(lineWidth(['SQL', 'Python']), 13);
});

test('keywordLines: none, one or two keywords make one line as given', () => {
  assert.deepEqual(keywordLines([]), []);
  assert.deepEqual(keywordLines(['SQL']), [['SQL']]);
  assert.deepEqual(keywordLines(['SQL', 'Python']), [['SQL', 'Python']]);
});

test('keywordLines: a long keyword shares its line with a short one', () => {
  // in order: 6+8=18, 3+6=13, 12+10=26 → the longest line 26.
  // Clustering (10) needs a partner of 6 at most to stay under 22, and
  // scikit-learn (12) then takes DAX (3): 20, 19, 18 → the longest 20,
  // the least it can be (Clustering + DAX = 17 would leave scikit-learn
  // with 6 or more: 22).
  const lines = keywordLines(['Python', 'Power BI', 'DAX', 'pandas', 'scikit-learn', 'Clustering']);
  assert.deepEqual(lines, [['Python', 'Power BI'], ['DAX', 'scikit-learn'], ['pandas', 'Clustering']]);
  assert.equal(Math.max(...lines.map((l) => l.length === 2 ? [...l[0]].length + [...l[1]].length + 4 : 0)), 20);
});

test('keywordLines: the two longest go with the two shortest', () => {
  // Optimisation and scikit-learn (12 each) take PyMC (4) and Python (6):
  // 20 and 22; Bayesian + FastAPI 19. The first such pairing found keeps
  // Python with Optimisation; the lines lead with the stack's first keyword.
  assert.deepEqual(
    keywordLines(['Python', 'PyMC', 'Bayesian', 'Optimisation', 'scikit-learn', 'FastAPI']),
    [['Python', 'Optimisation'], ['PyMC', 'scikit-learn'], ['Bayesian', 'FastAPI']],
  );
});

test('keywordLines: an odd count leaves the longest keyword alone', () => {
  // alone 10 + 1.5 = 11.5 and the pair 1 + 2 + 4 = 7, against 15 or 16
  // for Statistics with either of the others
  assert.deepEqual(keywordLines(['Statistics', 'R', 'Go']), [['Statistics'], ['R', 'Go']]);
});

test('keywordLines: every keyword appears once, the lines never hold more than two', () => {
  const words = ['SQL', 'Python', 'Azure', 'Power BI', 'DAX', 'DuckDB'];
  const lines = keywordLines(words);
  assert.deepEqual(lines.flat().slice().sort(), words.slice().sort());
  assert.ok(lines.every((l) => l.length >= 1 && l.length <= 2));
  assert.equal(lines.length, 3);
});
