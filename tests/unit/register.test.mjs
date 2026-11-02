import { test } from 'node:test';
import assert from 'node:assert/strict';
import { letterPagesFrom, readingNeighbours } from '../../src/lib/register.mjs';

test('tag paging accepts a positive override and rejects invalid thresholds', () => {
  assert.equal(letterPagesFrom('1'), 1);
  assert.equal(letterPagesFrom('500'), 500);
  for (const value of [undefined, '', '0', '-1', 'no', 'Infinity']) assert.equal(letterPagesFrom(value), 300);
});

test('newest-first reading direction remains truthful at the register ends', () => {
  const entries = [{ id: 'newest' }, { id: 'middle' }, { id: 'oldest' }];
  assert.deepEqual(readingNeighbours(entries, entries[0]), { newer: undefined, older: entries[1] });
  assert.deepEqual(readingNeighbours(entries, entries[1]), { newer: entries[0], older: entries[2] });
  assert.deepEqual(readingNeighbours(entries, entries[2]), { newer: entries[1], older: undefined });
  assert.deepEqual(readingNeighbours([entries[0]], entries[0]), { newer: undefined, older: undefined });
  assert.deepEqual(readingNeighbours(entries, { id: 'absent' }), { newer: undefined, older: undefined });
});
