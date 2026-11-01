import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ARCHIVE_SEO_TITLES, archiveSeoTitle } from '../../src/lib/archive-seo.mjs';

test('long archive SEO labels fit the title budget including brand and pagination', () => {
  assert.equal(Object.keys(ARCHIVE_SEO_TITLES).length, 12);
  for (const tag of Object.keys(ARCHIVE_SEO_TITLES)) {
    assert.ok(`${archiveSeoTitle(tag, 'Full visible label', 24)} · Rafael Braga-Kribitz`.length <= 70, tag);
  }
  assert.equal(archiveSeoTitle('other', 'Original label'), 'Original label');
});
