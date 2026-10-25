// The Obsidian vault as the site reads it (src/lib/vault/): note
// properties, the index and link resolution, Dataview, related notes, the
// image-size reader and Mermaid's colour mapping. The fixture vault is
// tests/unit/fixtures/vault/. Every expected value is written out by hand.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { slugify, firstH1, inlineTags, allTags, statusOf, publicTags, inlineFields, excerpt, placeOf, readNote, pathOf, isScheduled, splitFrontmatter } from '../../src/lib/vault/meta.mjs';
import { vaultIndex, resolveNote, resolveAttachment, mediaPath, mediaKind } from '../../src/lib/vault/index.mjs';
import { parseQuery, runQuery } from '../../src/lib/vault/dataview.mjs';
import { related } from '../../src/lib/vault/related.mjs';
import { imageSize } from '../../src/lib/vault/image-size.mjs';
import { tokenFor, tokenise } from '../../src/lib/vault/mermaid.mjs';

const FIXTURE = fileURLToPath(new URL('./fixtures/vault/', import.meta.url));
const index = vaultIndex(FIXTURE);
const note = (rel) => index.notes.find((n) => n.rel === rel);

test('slugify: file names to URLs, umlauts spelled out', () => {
  assert.equal(slugify('Austrian MMM & budget optimiser'), 'austrian-mmm-budget-optimiser');
  assert.equal(slugify('Über Größe'), 'ueber-groesse');
  assert.equal(slugify('  A  B '), 'a-b');
});

test('the first # heading is the title; code and comments do not count', () => {
  assert.equal(firstH1('Intro\n\n# The title\n\n## Part'), 'The title');
  assert.equal(firstH1('```\n# not a title\n```\n# Real'), 'Real');
  assert.equal(firstH1('%% # hidden %%\n## Only h2'), undefined);
});

test('tags: property and inline, lower-cased, unique; status and draft are not public', () => {
  assert.deepEqual(inlineTags('A #tag and C# and #1 and #a/b-c.\n## #not-heading'), ['tag', 'a/b-c']);
  assert.deepEqual(allTags({ tags: ['#Status/Complete', 'x'] }, 'text #x #y'), ['status/complete', 'x', 'y']);
  assert.deepEqual(allTags({ tags: 'a, b' }, ''), ['a', 'b']);
  assert.equal(statusOf(['x', 'status/functional'], {}), 'functional');
  assert.equal(statusOf([], { status: 'archived' }), 'archived');
  assert.deepEqual(publicTags(['status/complete', 'draft', 'keep']), ['keep']);
});

test('Dataview fields and the excerpt', () => {
  assert.deepEqual(inlineFields('rating:: 4\nText [Due Date:: 2026-01-01] here'), { rating: '4', 'due-date': '2026-01-01' });
  assert.equal(excerpt('# T\n\nFirst [[Note|para]] with **bold**.\n\nSecond.'), 'First para with bold.');
  assert.equal(excerpt(`${'word '.repeat(60)}`, 30).endsWith('…'), true);
  assert.equal(excerpt('# T\n\n$$\nx^2\n$$\n\nThe square of $x$.'), 'The square of x.');   // display maths is not prose
});

test('placeOf: site folders by language; templates and private folders are not pages', () => {
  assert.deepEqual(placeOf('Projects/en/a.md'), { folder: 'Projects', collection: 'projects', lang: 'en', kind: undefined });
  assert.deepEqual(placeOf('Notes/de/x/y.md'), { folder: 'Notes', collection: 'notes', lang: 'de', kind: 'note' });
  assert.equal(placeOf('_templates/Note.md'), null);
  assert.equal(placeOf('Projects/fr/a.md'), null);
  assert.equal(placeOf('Notes/en/_draft.md'), null);
  assert.equal(placeOf('Attachments/a.png'), null);
});

test('readNote: H1 title, file-name slug, folder kind, status from the tag, publish', () => {
  const n = readNote('Notes/en/My First Note.md', '---\npublish: true\ndate: "2026-01-02"\ntags: [status/in-build, x]\n---\n\n# Hello\n\nBody text.');
  assert.equal(n.data.title, 'Hello');
  assert.equal(n.data.slug, 'my-first-note');
  assert.equal(n.data.kind, 'note');
  assert.equal(n.data.lang, 'en');
  assert.equal(n.data.status, 'in-build');
  assert.deepEqual(n.data.tags, ['x']);
  assert.equal(n.data.summary, 'Body text.');
  assert.equal(n.data.publish, true);
  assert.equal(readNote('Notes/en/a.md', '---\npublish: true\ndraft: true\n---\n# A').data.publish, false);
  assert.equal(readNote('Notes/en/a.md', '# A\n\n#draft').data.publish, false);
  assert.equal(readNote('Notes/en/a.md', '---\npublish: "yes"\n---\n# A').data.publish, false);
  assert.equal(pathOf(readNote('Projects/de/x.md', '# X')), '/de/work/x/');
  assert.throws(() => splitFrontmatter('---\na: [\n---\n'), /do not parse/);
});

test('scheduled: a future date is not built yet', () => {
  assert.equal(isScheduled({ date: '2026-12-01' }, '2026-10-23'), true);
  assert.equal(isScheduled({ date: '2026-10-23' }, '2026-10-23'), false);
  assert.equal(isScheduled({}, '2026-10-23'), false);
});

test('the index: live notes, attachments, [[links]] by name, title, alias, language first', () => {
  assert.equal(note('Projects/en/Alpha.md').live, true);
  assert.equal(note('Notes/en/Gamma.md').live, false);       // no publish
  assert.equal(note('Notes/en/Later.md').live, false);       // scheduled
  const de = note('Projects/de/Alpha.md');
  assert.equal(resolveNote(index, 'Alpha', de), de);         // same language first
  assert.equal(resolveNote(index, 'Alpha', note('Notes/en/Beta note.md')).rel, 'Projects/en/Alpha.md');
  assert.equal(resolveNote(index, 'B').rel, 'Notes/en/Beta note.md');          // alias
  assert.equal(resolveNote(index, 'beta note').rel, 'Notes/en/Beta note.md');  // case
  assert.equal(resolveNote(index, 'Alpha project').rel, 'Projects/en/Alpha.md'); // title
  assert.equal(resolveNote(index, 'nothing'), undefined);
  const att = resolveAttachment(index, 'dot.png');
  assert.equal(att.kind, 'image');
  assert.equal(mediaPath(att), '/media/Attachments/dot.png');
  assert.equal(mediaKind('a.MP4'), 'video');
});

test('Dataview: parse and run over published notes of the language', () => {
  const q = parseQuery('TABLE domain AS "Domain", date\nFROM #marketing AND "Projects"\nWHERE status = "complete"\nSORT date DESC\nLIMIT 5');
  assert.equal(q.mode, 'table');
  assert.deepEqual(q.fields.map((f) => f.name), ['Domain', 'date']);
  const here = note('Notes/en/Beta note.md');
  const resolve = (t) => resolveNote(index, t, here);
  assert.deepEqual(runQuery(q, index.notes, here, resolve).map((n) => n.rel), ['Projects/en/Alpha.md']);
  const list = runQuery(parseQuery('LIST FROM #marketing SORT date DESC'), index.notes, undefined, resolve);
  assert.deepEqual(list.map((n) => n.rel), ['Notes/en/Beta note.md', 'Projects/en/Alpha.md']);
  const de = runQuery(parseQuery('LIST FROM "Projects"'), index.notes, note('Projects/de/Alpha.md'), resolve);
  assert.deepEqual(de.map((n) => n.rel), []);                 // the querying note itself is left out
  const cross = runQuery(parseQuery('LIST FROM "Projects/de"'), index.notes, here, resolve);
  assert.deepEqual(cross.map((n) => n.rel), ['Projects/de/Alpha.md']);
  const links = runQuery(parseQuery('LIST FROM [[Beta note]]'), index.notes, here, resolve);
  assert.deepEqual(links.map((n) => n.rel), ['Projects/en/Alpha.md']);   // notes linking to it
  const w = runQuery(parseQuery('LIST WHERE contains(tags, "marketing") and !(date > "2026-01-31")'), index.notes, undefined, resolve);
  assert.deepEqual(w.map((n) => n.rel), ['Projects/en/Alpha.md']);
  assert.throws(() => parseQuery('SHOW x'), /starts with LIST or TABLE/);
  assert.throws(() => parseQuery('LIST WHERE a = '), /ends too early/);
});

test('related: words, tags and links, same language, published only', () => {
  const r = related(index.notes, note('Projects/en/Alpha.md'), { min: 0 });
  assert.deepEqual(r.map((x) => x.note.rel), ['Notes/en/Beta note.md']);
  assert.ok(r[0].score > 0.15);
});

test('image size from the file header', () => {
  assert.deepEqual(imageSize(`${FIXTURE}Attachments/dot.png`), { width: 3, height: 2 });
  assert.equal(imageSize(`${FIXTURE}nope.png`), undefined);
});

test('Mermaid colours map back to tokens; inline styles become attributes; shadows go', () => {
  assert.equal(tokenFor([255, 10, 10]), '--ink');
  assert.equal(tokenFor([250, 250, 40]), '--surface-2');
  assert.equal(tokenFor([20, 20, 20]), '--ink');
  assert.equal(tokenFor([240, 240, 240]), '--surface');
  const svg = tokenise('<svg viewBox="0 0 100.5 40" width="100%" style="max-width: 100px;"><style>.a{fill:#ff0000;filter: drop-shadow(1px 1px 2px #000);}</style><path style="stroke-width: 1; stroke: rgb(0, 255, 255)"/></svg>');
  assert.match(svg, /<svg width="101" height="40"/);
  assert.doesNotMatch(svg, /style="/);
  assert.doesNotMatch(svg, /drop-shadow|#[0-9a-f]{3,6}\b/i);
  assert.match(svg, /stroke-width="1"/);
  assert.match(svg, /stroke="var\(--accent-01\)"/);
  assert.match(svg, /fill:var\(--ink\)/);
});
