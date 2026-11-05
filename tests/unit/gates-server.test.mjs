// The gate server follows git symlinks that a checkout without symlink
// rights (core.symlinks false, the Windows default) wrote as one-line text
// files; without it the fixture self-test sees neither fonts nor tokens.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { followStubs } from '../../scripts/gates/server.mjs';

test('followStubs: a stub stands for a file or a directory; an ordinary file does not', () => {
  const dir = mkdtempSync(join(tmpdir(), 'stubs-'));
  try {
    mkdirSync(join(dir, 'real', 'fonts'), { recursive: true });
    mkdirSync(join(dir, 'site'));
    writeFileSync(join(dir, 'real', 'tokens.css'), ':root{}');
    writeFileSync(join(dir, 'real', 'fonts', 'a.woff2'), 'x');
    writeFileSync(join(dir, 'site', 'tokens.css'), '../real/tokens.css');      // stub of a file
    writeFileSync(join(dir, 'site', 'fonts'), '../real/fonts\n');              // stub of a directory
    writeFileSync(join(dir, 'site', 'note.txt'), 'not a path');                 // an ordinary small file
    writeFileSync(join(dir, 'site', 'gone'), '../nowhere');                     // a stub whose target is missing
    const site = join(dir, 'site');
    assert.equal(followStubs(site, '/tokens.css'), resolve(dir, 'real', 'tokens.css'));
    assert.equal(followStubs(site, '/fonts/a.woff2'), resolve(dir, 'real', 'fonts', 'a.woff2'));
    assert.equal(followStubs(site, '/note.txt'), join(site, 'note.txt'));
    assert.equal(followStubs(site, '/gone'), join(site, 'gone'));
    assert.equal(followStubs(site, '/'), site);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
