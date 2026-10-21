// tests/unit/format.test.mjs — every hand-computed reference case of
// src/lib/format.mjs, in both languages, plus the edges the cases do not
// cover. Run: npm run test:unit
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  NBSP, MINUS, EN_DASH, number, currency, percent, unit, date, range, equation,
  ellipsis, quotes, dash, CASES, runCases,
} from '../../src/lib/format.mjs';

describe('format · constants', () => {
  it('are the typographic characters, not ASCII', () => {
    assert.equal(NBSP, '\u00A0');
    assert.equal(MINUS, '−');
    assert.equal(EN_DASH, '–');
  });
});

describe('format · hand-computed cases', () => {
  assert.ok(CASES.length >= 12, 'the reference set holds at least the twelve cases');
  for (const c of CASES) {
    it(`${c.name} · en`, () => assert.equal(c.run('en'), c.en));
    it(`${c.name} · de`, () => assert.equal(c.run('de'), c.de));
  }
  it('runCases() reports every case as passing', () => {
    const r = runCases();
    assert.equal(r.length, CASES.length);
    assert.ok(r.every((x) => x.ok), r.filter((x) => !x.ok).map((x) => x.name).join(', '));
  });
});

describe('format · edges', () => {
  it('negative decimals carry the real minus and the language separators', () => {
    assert.equal(number(-1234.5, 'en'), `${MINUS}1,234.5`);
    assert.equal(number(-1234.5, 'de'), `${MINUS}1.234,5`);
  });
  it('fixed digits round and pad', () => {
    assert.equal(number(1234.5678, 'en', 2), '1,234.57');
    assert.equal(number(7, 'de', 2), '7,00');
    assert.equal(currency(1234.5, 'de', 2), `€${NBSP}1.234,50`);
  });
  it('decimals keep at most six places by default', () => {
    assert.equal(number(0.1234567891, 'en'), '0.123457');
  });
  it('percent and unit use the non-breaking space where the language needs one', () => {
    assert.equal(percent(0.5, 'de'), `0,5${NBSP}%`);
    assert.equal(percent(0.5, 'en'), '0.5%');
    assert.equal(unit(1240991, 'rows', 'en'), `1,240,991${NBSP}rows`);
  });
  it('dates: Jänner in Austrian German, no leading zero on the day', () => {
    assert.equal(date('2026-01-05', 'de'), `5.${NBSP}Jän.${NBSP}2026`);
    assert.equal(date('2026-01-05', 'en'), `5${NBSP}Jan${NBSP}2026`);
    assert.equal(date('2026-03-01', 'de'), `1.${NBSP}März${NBSP}2026`);
  });
  it('range and equation join with the right characters', () => {
    assert.equal(range('Q1', 'Q4'), `Q1${EN_DASH}Q4`);
    assert.equal(equation('n', 39473, 'de'), `n${NBSP}=${NBSP}39.473`);
  });
  it('ellipsis replaces every three-dot run', () => {
    assert.equal(ellipsis('a... b...'), 'a… b…');
  });
  it('quotes: opening after brackets and dashes, apostrophes stay U+2019, ’90s', () => {
    assert.equal(quotes('("x")', 'en'), '(“x”)');
    assert.equal(quotes('the \'90s', 'en'), 'the ’90s');
    assert.equal(quotes('O\'Brien', 'de'), 'O’Brien');
    assert.equal(quotes('„schon“', 'de'), '„schon“', 'typographic quotes already in the text are left alone');
  });
  it('dash: non-breaking space, en dash, space', () => {
    assert.equal(dash('en'), `${NBSP}${EN_DASH} `);
    assert.equal(dash('de'), `${NBSP}${EN_DASH} `);
  });
});
