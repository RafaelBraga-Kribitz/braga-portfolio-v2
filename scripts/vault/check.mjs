#!/usr/bin/env node
// npm run vault:check — reads the Obsidian vault as the site will and says,
// note by note and line by line, what will not work, before a push does.
//
//   error  the build would fail or the page would be wrong: missing
//          properties a published note needs, an unknown #status/ tag, two
//          published notes on one URL, a folder/lang mismatch, an embed of
//          a file that is not in the vault, a Dataview query that does not
//          parse, the Obsidian CSS snippets out of date (npm run vault:sync)
//   warn   it works, but not as written: a [[link]] to a note that does
//          not exist, a skipped heading level, a second # heading
//   info   worth knowing: links to unpublished notes (plain text on the
//          page), notes without a twin, scheduled notes, diagrams that will
//          be drawn at the next build
//
// Exit status 1 when there is an error. Part of `npm run verify`.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { vaultIndex, resolveNote, resolveAttachment, mediaKind } from '../../src/lib/vault/index.mjs';
import { STATUS_TAGS, proseOnly, isScheduled } from '../../src/lib/vault/meta.mjs';
import { parseQuery } from '../../src/lib/vault/dataview.mjs';
import { mermaidCached } from '../../src/lib/vault/mermaid.mjs';
import { SNIPPETS } from './sync-obsidian.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const index = vaultIndex();
const out = [];
const say = (level, note, line, msg) => out.push({ level, where: `vault/${note?.rel ?? note}${line ? `:${line}` : ''}`, msg });

/** Line number of an offset in the body, counting the properties block. */
const lineOf = (note, offset) => {
  const src = readFileSync(note.abs, 'utf8');
  const bodyStart = src.length - note.body.length;
  return src.slice(0, bodyStart + offset).split('\n').length;
};

for (const e of index.errors) say('error', e.rel, 0, e.message);

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const dateOk = (v) => typeof v === 'string' && ISO.test(v) && !Number.isNaN(new Date(`${v}T00:00:00Z`).getTime());
const REQUIRED = {
  projects: ['code', 'kind', 'date', 'summary', 'lead', 'domain', 'status'],
  writing: ['date', 'summary'],
  pages: ['summary'],
  legal: ['page', 'updated', 'summary'],
};

const seen = new Map();
for (const note of index.notes) {
  if (!note.place) continue;
  const d = note.data;
  // the status tag, published or not: a typo shows here first
  const st = note.tags.find((t) => t.startsWith('status/'));
  if (st && !STATUS_TAGS.includes(st.slice(7))) say('error', note, 0, `#${st} is not a status: use #status/${STATUS_TAGS.join(', #status/')}`);
  if (d.lang && d.lang !== note.place.lang) say('error', note, 0, `in the ${note.place.lang}/ folder but lang: ${d.lang}`);
  if (!note.data.publish) continue;
  if (isScheduled(d)) { say('info', note, 0, `scheduled: goes online on ${d.date}`); continue; }
  for (const k of REQUIRED[note.place.collection] ?? []) {
    const v = d[k];
    if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) say('error', note, 0, `published, but "${k}" is empty${k === 'status' ? ' (add a #status/… tag)' : ''}`);
  }
  for (const k of ['date', 'updated']) if (d[k] !== undefined && d[k] !== null && !dateOk(String(d[k] instanceof Date ? d[k].toISOString().slice(0, 10) : d[k]))) say('error', note, 0, `"${k}" is not a yyyy-mm-dd date: ${d[k]}`);
  if (note.place.collection === 'projects' && d.code && !/^\d{2}-\d{2}$/.test(String(d.code))) say('error', note, 0, `code "${d.code}" is not like 01-05`);
  if (note.place.collection === 'pages' && !['about', 'system'].includes(d.slug)) say('error', note, 0, `a page's slug is about or system, not ${d.slug}`);
  const key = `${note.url}`;
  if (seen.has(key)) say('error', note, 0, `same address ${note.url} as vault/${seen.get(key).rel}`);
  else seen.set(key, note);

  // headings
  const body = proseOnly(note.body);
  let last = 1, h1 = 0;
  for (const m of body.matchAll(/^(#{1,6})\s+(.+)$/gm)) {
    const depth = m[1].length;
    if (depth === 1 && ++h1 > 1) say('warn', note, lineOf(note, m.index), `a second # heading ("${m[2]}") becomes ## on the page`);
    if (depth > last + 1 && depth > 1) say('warn', note, lineOf(note, m.index), `${m[1]} after ${'#'.repeat(last)}: a level is skipped (the page closes it up)`);
    if (depth > 1) last = depth;
  }
  if (!h1 && !note.body.match(/^#\s/m)) say('warn', note, 0, `no # title heading: the file name "${note.data.title}" is the title`);

  // links and embeds
  for (const m of body.matchAll(/(!?)\[\[([^\]|#^]*)(?:[#^][^\]|]*)?(?:\|[^\]]*)?\]\]/g)) {
    const target = m[2].trim();
    if (!target) continue;
    const line = lineOf(note, m.index);
    const att = resolveAttachment(index, target);
    if (att) continue;
    if (m[1] && mediaKind(target)) { say('error', note, line, `![[${target}]]: no such file in the vault`); continue; }
    const t = resolveNote(index, target, note);
    if (!t) say('warn', note, line, `[[${target}]]: no such note (shows as plain text)`);
    else if (!t.live) say('info', note, line, `[[${target}]] is not published: it shows as plain text`);
  }
  for (const m of body.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) {
    if (/^https?:/i.test(m[1])) { say('info', note, lineOf(note, m.index), `${m[1]}: a remote image becomes a link (nothing loads from other servers)`); continue; }
    if (!resolveAttachment(index, decodeURIComponent(m[1]))) say('error', note, lineOf(note, m.index), `${m[1]}: no such file in the vault`);
  }
  if (d.cover && !resolveAttachment(index, String(d.cover).replace(/^!?\[\[|\]\]$/g, ''))) say('error', note, 0, `cover "${d.cover}": no such image in the vault`);

  // fences: dataview parses, mermaid drawn
  for (const m of note.body.matchAll(/^```(dataview|mermaid)[^\n]*\n([\s\S]*?)^```/gm)) {
    const line = lineOf(note, m.index);
    if (m[1] === 'dataview') { try { parseQuery(m[2]); } catch (e) { say('error', note, line, `dataview: ${e.message}`); } }
    else if (!mermaidCached(m[2].replace(/\n$/, ''))) say('info', note, line, 'a new diagram: drawn at the next build (needs Chromium: npx playwright install chromium)');
  }

  // the twin
  const other = note.place.lang === 'en' ? 'de' : 'en';
  if (['projects', 'writing'].includes(note.place.collection) && !index.notes.some((n) => n.live && n.place?.collection === note.place.collection && n.place.lang === other && n.data.slug === d.slug)) {
    say('info', note, 0, `no ${other.toUpperCase()} version (same slug "${d.slug}"): the language link goes to the ${other.toUpperCase()} home`);
  }
}

// the Obsidian look
for (const [from, to] of SNIPPETS) {
  if (!existsSync(root + to) || readFileSync(root + from, 'utf8') !== readFileSync(root + to, 'utf8')) say('error', to.replace(/^vault\//, ''), 0, `differs from ${from}: run npm run vault:sync`);
}

const order = { error: 0, warn: 1, info: 2 };
out.sort((a, b) => order[a.level] - order[b.level] || a.where.localeCompare(b.where, undefined, { numeric: true }));
for (const o of out) console.log(`${o.level.padEnd(5)}  ${o.where}  ${o.msg}`);
const n = (l) => out.filter((o) => o.level === l).length;
const live = index.notes.filter((x) => x.live).length;
console.log(`\nvault:check · ${index.notes.length} notes, ${live} published, ${index.attachments.size ? new Set([...index.attachments.values()].map((a) => a.rel)).size : 0} files · ${n('error')} errors, ${n('warn')} warnings, ${n('info')} notes`);
process.exit(n('error') ? 1 : 0);
