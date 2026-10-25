// src/lib/vault/related.mjs — "Related" under a project or a piece of
// writing (owner, 23 Oct 2026): the published notes of the same language
// closest to it, scored at build. It stands in for Obsidian's Smart
// Connections, whose embeddings live in each machine's .smart-env/ folder
// (large, machine-local, not committed), so a build cannot use them. The
// score is TF-IDF cosine similarity over the notes' words, plus shared tags
// and links between the two notes. Deterministic: the same vault gives the
// same list. Tested in tests/unit/vault.test.mjs.
import { proseOnly } from './meta.mjs';

const STOP = new Set(('the and for that with this from are was were have has not but its into than then they their there which what when where who will would could should about over under more most less also only one two three per each other such this these those been being does did done can may might must our out off all any how why you your his her him she them our ours a an of in on to by as at or is be it if no so we de der die das und ist ein eine einer eines dem den des mit von für auf im zu zum zur nicht sich auch als wie bei aus nach oder wird werden sind war hat haben dass diese dieser dieses es er sie wir ihr man noch nur über unter mehr sehr kann muss soll'.split(' ')));

function terms(note) {
  const body = proseOnly(note.body).replace(/\[\[([^\]|#]+)[^\]]*\]\]/g, '$1').replace(/[`*_~=>#|[\]()]/g, ' ');
  const words = `${note.data.title ?? ''} ${note.data.summary ?? ''} ${body}`.toLowerCase().match(/[\p{L}][\p{L}\p{N}-]{2,}/gu) ?? [];
  const tf = new Map();
  for (const w of words) if (!STOP.has(w)) tf.set(w, (tf.get(w) ?? 0) + 1);
  for (const t of note.data.tags ?? []) tf.set(`#${t}`, (tf.get(`#${t}`) ?? 0) + 4);
  return tf;
}

const linksOf = (note) => new Set([...proseOnly(note.body).matchAll(/\[\[([^\]|#]+)/g)].map((m) => m[1].trim().toLowerCase()));

/**
 * The notes most related to `note`, best first: [{ note, score }].
 * @param {any[]} notes all notes of the vault index @param {any} note
 */
export function related(notes, note, { limit = 3, min = 0.06 } = {}) {
  const pool = notes.filter((n) => n.live && n.url && ['projects', 'writing', 'notes'].includes(n.place?.collection) && n.place.lang === note.place?.lang);
  if (pool.length < 2) return [];
  const vecs = new Map(pool.map((n) => [n, terms(n)]));
  const df = new Map();
  for (const tf of vecs.values()) for (const w of tf.keys()) df.set(w, (df.get(w) ?? 0) + 1);
  const N = pool.length;
  const weigh = (tf) => {
    const v = new Map();
    let norm = 0;
    for (const [w, c] of tf) { const x = (1 + Math.log(c)) * Math.log(1 + N / (df.get(w) ?? 1)); v.set(w, x); norm += x * x; }
    return { v, norm: Math.sqrt(norm) || 1 };
  };
  const self = pool.includes(note) ? note : pool.find((n) => n.rel === note.rel);
  if (!self) return [];
  const a = weigh(vecs.get(self));
  const myLinks = linksOf(self);
  const names = (n) => [n.data.title, n.data.slug, n.rel.split('/').pop().replace(/\.md$/, '')].map((x) => String(x).toLowerCase());
  return pool.filter((n) => n !== self).map((n) => {
    const b = weigh(vecs.get(n));
    let dot = 0;
    for (const [w, x] of a.v) { const y = b.v.get(w); if (y) dot += x * y; }
    let score = dot / (a.norm * b.norm);
    if (names(n).some((k) => myLinks.has(k))) score += 0.15;         // this note links to it
    if (names(self).some((k) => linksOf(n).has(k))) score += 0.1;    // it links back
    return { note: n, score };
  }).filter((r) => r.score >= min).sort((x, y) => y.score - x.score || x.note.rel.localeCompare(y.note.rel)).slice(0, limit);
}
