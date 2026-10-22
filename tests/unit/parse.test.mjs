// parseTyped: what a reader may type into a bench's value field
// (src/lib/tools/parse.mjs), and the bench state in the address bar
// (src/lib/tools/url-state.mjs). Every case is written out by hand.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseTyped } from '../../src/lib/tools/parse.mjs';
import { readParams, writeParams } from '../../src/lib/tools/url-state.mjs';

const NBSP = ' ';

test('plain numbers and either decimal mark', () => {
  assert.equal(parseTyped('4', 'en'), 4);
  assert.equal(parseTyped('4.5', 'en'), 4.5);
  assert.equal(parseTyped('4,5', 'en'), 4.5);
  assert.equal(parseTyped('4,5', 'de'), 4.5);
  assert.equal(parseTyped('4.5', 'de'), 4.5);
  assert.equal(parseTyped('0,05', 'de'), 0.05);
});

test('grouping in the page language, three digits after one mark', () => {
  assert.equal(parseTyped('2,000', 'en'), 2000);
  assert.equal(parseTyped('2.000', 'de'), 2000);
  assert.equal(parseTyped('2.000', 'en'), 2);          // EN "." is the decimal mark
  assert.equal(parseTyped('2,000', 'de'), 2);          // DE "," is the decimal mark
  assert.equal(parseTyped('12,500', 'en'), 12500);
  assert.equal(parseTyped('1,500,000', 'en'), 1500000);
  assert.equal(parseTyped('1.500.000', 'de'), 1500000);
});

test('both marks: the last one is the decimal mark', () => {
  assert.equal(parseTyped('1,234.5', 'en'), 1234.5);
  assert.equal(parseTyped('1.234,5', 'de'), 1234.5);
  assert.equal(parseTyped('1.234,5', 'en'), 1234.5);
});

test('units, spaces and the minus are accepted', () => {
  assert.equal(parseTyped('4 %', 'en'), 4);
  assert.equal(parseTyped(`4,0${NBSP}%`, 'de'), 4);
  assert.equal(parseTyped('€ 10', 'en'), 10);
  assert.equal(parseTyped(`€${NBSP}200`, 'de'), 200);
  assert.equal(parseTyped('10 EUR', 'en'), 10);
  assert.equal(parseTyped('0.4 pp', 'en'), 0.4);
  assert.equal(parseTyped('20 000', 'de'), 20000);
  assert.equal(parseTyped('−3', 'en'), -3);
  assert.equal(parseTyped('2k', 'en'), 2000);
  assert.equal(parseTyped('1,5k', 'de'), 1500);
});

test('nothing numeric is null', () => {
  assert.equal(parseTyped('', 'en'), null);
  assert.equal(parseTyped('abc', 'en'), null);
  assert.equal(parseTyped('%', 'en'), null);
  assert.equal(parseTyped('4..', 'en'), null);
  assert.equal(parseTyped('1.2.3,4.5', 'en'), null);
});

// readParams / writeParams: a bench's inputs in the address bar
// (src/lib/tools/url-state.mjs).

const B = { base: { min: 0.5, max: 20 }, traffic: { min: 200, max: 20000 } };

test('readParams keeps readable fields, clamped, and drops the rest', () => {
  assert.deepEqual(readParams('?base=4.5&traffic=50000', B), { base: 4.5, traffic: 20000 });
  assert.deepEqual(readParams('?base=abc&traffic=', B), {});
  assert.deepEqual(readParams('?base=0.1', B), { base: 0.5 });
  assert.deepEqual(readParams('?power=90&preset=Nope', B, { power: ['80', '90'], preset: ['Checkout'] }), { power: '90' });
  assert.deepEqual(readParams('', B), {});
});

test('writeParams writes only what differs from the defaults, in key order', () => {
  const d = { base: 4, traffic: 2000, power: '80' };
  assert.equal(writeParams(d, d, ['base', 'traffic', 'power']), '');
  assert.equal(writeParams({ ...d, traffic: 600, base: 12 }, d, ['base', 'traffic', 'power']), '?base=12&traffic=600');
  assert.equal(writeParams({ ...d, power: '90', preset: null }, d, ['power', 'preset']), '?power=90');
});
