import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { vaultIndex, resolveNote } from '../../src/lib/vault/index.mjs';
import { slugify } from '../../src/lib/vault/meta.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const merged = [
  ['arithmetic_n_th_term_2', 'arithmetic_n_th_term'],
  ['arithmetic_hmtbcth_term', 'arithmetic_n_th_term'],
  ['jacobian_matrix_f', 'jacobian_matrix'],
  ['unemployment_rate_delta_ue', 'unemployment_rate'],
];

test('consolidated note names resolve to published canonical notes', () => {
  const index = vaultIndex(`${root}vault/`);
  for (const [oldName, canonical] of merged) {
    const result = resolveNote(index, oldName, { lang: 'en' });
    assert.ok(result?.live, `${oldName} must resolve to a published note`);
    assert.equal(result.data.slug, slugify(canonical));
    assert.equal(index.notes.filter((note) => note.rel.endsWith(`/${oldName}.md`)).length, 0);
  }
});

for (const base of ['/', '/portfolio/']) {
  test(`former public slugs redirect under base ${base}`, async () => {
    const previous = process.env.SITE_BASE;
    let redirects;
    try {
      process.env.SITE_BASE = base;
      const { default: config } = await import(`../../astro.config.mjs?redirect-test=${encodeURIComponent(base)}`);
      redirects = config.redirects;
    } finally {
      if (previous === undefined) delete process.env.SITE_BASE;
      else process.env.SITE_BASE = previous;
    }
    for (const [oldName, canonical] of merged) {
      assert.equal(redirects[`/en/notes/${slugify(oldName)}/`], `${base}en/notes/${slugify(canonical)}/`);
    }
  });
}
