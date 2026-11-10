// The site's own copy lives in the vault (website_vault/Site/, read by
// src/lib/vault/copy.mjs), never in src/. These tests hold that line: the
// vault's Site notes satisfy the contract, a hole in one is reported with
// its path, and no page template keeps a per-language block of sentences.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, readdirSync, cpSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COPY, copyOf, copyFaults, copyPath, fillIn, VAULT_DIR } from '../../src/lib/vault/copy.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));

test('the vault carries every note of the contract, complete', () => {
  assert.deepEqual(copyFaults(), []);
});

test('copy paths: Identity is shared, the rest sits in a language folder', () => {
  assert.equal(copyPath('Identity'), 'Site/Identity.md');
  assert.equal(copyPath('Home', 'de'), 'Site/de/Home.md');
});

test('a property is read as written; &nbsp; and &shy; become the characters', () => {
  assert.equal(copyOf('Work', 'en').claim, 'A decision. Its evidence.');
  assert.deepEqual(copyOf('Home', 'en').title_lines, ['Data', 'Analyst']);
  assert.equal(copyOf('Confusion matrix', 'de').heading, 'Konfusions­matrix');
  assert.ok(copyOf('Writing', 'en').prose.includes('arguments – a position'));
});

test('fillIn fills the placeholders it is given and leaves the rest', () => {
  assert.equal(fillIn('{n} notes in {k} areas', { n: 3, k: 2 }), '3 notes in 2 areas');
  assert.equal(fillIn('{n} of {total}', { n: 1 }), '1 of {total}');
});

test('a hole in the copy is named: a missing note, an empty property, a lost placeholder, a bad status', () => {
  const dir = mkdtempSync(join(tmpdir(), 'site-copy-'));
  try {
    cpSync(join(VAULT_DIR, 'Site'), join(dir, 'Site'), { recursive: true });
    assert.deepEqual(copyFaults(dir), []);
    rmSync(join(dir, 'Site/de/Tools.md'));
    writeFileSync(join(dir, 'Site/en/Work.md'), '---\nclaim: ""\nprose: "p"\ncontact: "c"\n---\n');
    writeFileSync(join(dir, 'Site/en/Notes.md'), '---\nclaim: "c"\nprose: "{n} notes"\nseo_description: "{n} notes in {k} areas"\n---\n');
    const cm = readFileSync(join(dir, 'Site/en/Confusion matrix.md'), 'utf8').replace('status: "functional"', 'status: "done"');
    writeFileSync(join(dir, 'Site/en/Confusion matrix.md'), cm);
    const faults = copyFaults(dir).map((f) => `${f.rel}: ${f.message}`);
    assert.deepEqual(faults.sort(), [
      'Site/de/Tools.md: this note is missing: the site reads its copy from it',
      'Site/en/Confusion matrix.md: "status" is one of complete, functional, under-revision, in-build, archived',
      'Site/en/Notes.md: "prose" must keep the placeholder {k}',
      'Site/en/Work.md: "claim" is empty',
    ]);
    assert.throws(() => copyOf('Work', 'en', dir), /website_vault\/Site\/en\/Work\.md: "claim" is empty/);
    assert.throws(() => copyOf('Tools', 'de', dir), /Site\/de\/Tools\.md is missing/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('English-only properties are not asked of the German notes', () => {
  assert.equal(copyOf('Writing', 'de').feed_description, undefined);
  assert.equal(typeof copyOf('Writing', 'en').feed_description, 'string');
  assert.ok(COPY['Language chooser'].langs.includes('en'));
});

// The drift this file exists to stop: a `const copy = { en: {…}, de: {…} }`
// block in a page. Sentences go to website_vault/Site/, labels to i18n.ts.
test('no page, layout or component keeps a per-language block of copy', () => {
  const found = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const abs = join(dir, name);
      if (statSync(abs).isDirectory()) walk(abs);
      else if (name.endsWith('.astro')) {
        readFileSync(abs, 'utf8').split('\n').forEach((line, i) => {
          if (/^\s*(en|de):\s*[{['"`]/.test(line)) found.push(`${abs.slice(root.length)}:${i + 1}`);
        });
      }
    }
  };
  for (const d of ['src/pages', 'src/layouts', 'src/components']) walk(root + d);
  assert.deepEqual(found, [], 'move this copy to website_vault/Site/ (src/lib/vault/copy.mjs)');
});
