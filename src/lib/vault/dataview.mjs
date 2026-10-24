// src/lib/vault/dataview.mjs — Dataview queries, run at build over the
// vault (owner, 23 Oct 2026). A ```dataview block in a note becomes a list
// or a table on the page, from the notes that are on the site. The same
// block works in Obsidian with the Dataview plugin, so the note reads the
// same in both places. The subset (Dataview's query language, DQL):
//
//   LIST [field]                     a list of note links (and a field)
//   TABLE [WITHOUT ID] a, b AS "B"   a table: the note, then the fields
//   FROM #tag | "Folder" | [[Note]]  sources, with and / or / - (not)
//   WHERE a = "x" and (b > 3 or c)   = != < <= > >=, contains(f, "x"),
//                                    and, or, !, true/false, numbers,
//                                    "strings", date(2026-10-01)
//   SORT a DESC, b                   ASC by default
//   LIMIT 5
//
// Fields: any property, plus title, tags, status, kind, date, summary,
// file.name, file.link, file.folder, file.tags. Only published notes are
// queried; FROM "Projects/de" (a language folder) reaches the other
// language, otherwise the note's own language is used.
// Tested in tests/unit/vault.test.mjs.

/** @typedef {{ type: string, value: any }} Tok */

function tokenize(src) {
  const toks = [];
  const re = /\s*(?:(\d{4}-\d{2}-\d{2})|(-?\d+(?:\.\d+)?)|"((?:[^"\\]|\\.)*)"|(\[\[[^\]]+\]\])|(#[\p{L}\p{N}_/-]+)|(!=|<=|>=|=|<|>|\(|\)|,|!|-)|([\p{L}_][\p{L}\p{N}_.-]*))/uy;
  let m;
  re.lastIndex = 0;
  while (re.lastIndex < src.length) {
    const at = re.lastIndex;
    m = re.exec(src);
    if (!m) { if (/^\s*$/.test(src.slice(at))) break; throw new Error(`cannot read "${src.slice(at, at + 20)}"`); }
    if (m[1]) toks.push({ type: 'date', value: m[1] });
    else if (m[2] !== undefined) toks.push({ type: 'num', value: Number(m[2]) });
    else if (m[3] !== undefined) toks.push({ type: 'str', value: m[3].replace(/\\(.)/g, '$1') });
    else if (m[4]) toks.push({ type: 'link', value: m[4].slice(2, -2).split('|')[0].trim() });
    else if (m[5]) toks.push({ type: 'tag', value: m[5].slice(1).toLowerCase() });
    else if (m[6]) toks.push({ type: 'op', value: m[6] });
    else toks.push({ type: 'id', value: m[7] });
  }
  return toks;
}

const KEYWORDS = ['FROM', 'WHERE', 'SORT', 'LIMIT', 'FLATTEN', 'GROUP'];

/** Parses a query into { mode, fields, withoutId, from, where, sort, limit }. */
export function parseQuery(src) {
  const lines = String(src).trim();
  // split into clauses at the keywords (outside quotes)
  const clauses = {};
  const re = /\b(LIST|TABLE|FROM|WHERE|SORT|LIMIT)\b(?=(?:[^"]*"[^"]*")*[^"]*$)/gi;
  const marks = [...lines.matchAll(re)].map((m) => ({ key: m[1].toUpperCase(), at: m.index, end: m.index + m[0].length }));
  if (!marks.length || (marks[0].key !== 'LIST' && marks[0].key !== 'TABLE')) throw new Error('a query starts with LIST or TABLE');
  marks.forEach((mk, i) => { clauses[mk.key] = lines.slice(mk.end, i + 1 < marks.length ? marks[i + 1].at : undefined).trim(); });
  const mode = marks[0].key.toLowerCase();
  let head = clauses[marks[0].key] ?? '';
  let withoutId = false;
  if (/^WITHOUT\s+ID\b/i.test(head)) { withoutId = true; head = head.replace(/^WITHOUT\s+ID\b/i, '').trim(); }
  const fields = head ? head.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((f) => {
    const m = /^\s*(.+?)(?:\s+AS\s+"([^"]*)")?\s*$/i.exec(f);
    return { expr: m[1].trim(), name: m[2] ?? m[1].trim() };
  }) : [];
  return {
    mode,
    fields,
    withoutId,
    from: clauses.FROM ? parseFrom(tokenize(clauses.FROM)) : null,
    where: clauses.WHERE ? parseExpr(tokenize(clauses.WHERE)) : null,
    sort: clauses.SORT ? clauses.SORT.split(',').map((s) => { const [f, d] = s.trim().split(/\s+/); return { field: f, desc: /^desc/i.test(d ?? '') }; }) : [],
    limit: clauses.LIMIT ? Number(clauses.LIMIT) : undefined,
  };
}

/* FROM: source (and|or source)*, a source being #tag, "folder", [[link]], -source, ( … ) */
function parseFrom(toks) {
  let i = 0;
  const peek = () => toks[i];
  function source() {
    const t = toks[i++];
    if (!t) throw new Error('FROM needs a source');
    if (t.type === 'op' && (t.value === '-' || t.value === '!')) return { not: source() };
    if (t.type === 'op' && t.value === '(') { const e = or(); i++; return e; }
    if (t.type === 'tag') return { tag: t.value };
    if (t.type === 'str') return { folder: t.value.replace(/^\/|\/$/g, '') };
    if (t.type === 'link') return { link: t.value };
    throw new Error(`unknown source "${t.value}"`);
  }
  function and() { let l = source(); while (peek()?.type === 'id' && /^and$/i.test(peek().value)) { i++; l = { and: [l, source()] }; } return l; }
  function or() { let l = and(); while (peek()?.type === 'id' && /^or$/i.test(peek().value)) { i++; l = { or: [l, and()] }; } return l; }
  return or();
}

/* WHERE: or-expressions of comparisons */
function parseExpr(toks) {
  let i = 0;
  const peek = () => toks[i];
  const word = (w) => peek()?.type === 'id' && peek().value.toLowerCase() === w;
  function primary() {
    const t = toks[i++];
    if (!t) throw new Error('WHERE ends too early');
    if (t.type === 'op' && t.value === '(') { const e = or(); i++; return e; }
    if (t.type === 'op' && t.value === '!') return { not: primary() };
    if (t.type === 'num' || t.type === 'str' || t.type === 'date') return { lit: t.value };
    if (t.type === 'tag') return { lit: t.value };
    if (t.type === 'link') return { lit: t.value };
    if (t.type === 'id') {
      const v = t.value;
      if (/^(true|false)$/i.test(v)) return { lit: /^true$/i.test(v) };
      if (/^null$/i.test(v)) return { lit: null };
      if (peek()?.type === 'op' && peek().value === '(') {
        i++;
        const args = [];
        while (!(peek()?.type === 'op' && peek().value === ')')) { args.push(or()); if (peek()?.value === ',') i++; if (!peek()) throw new Error('missing )'); }
        i++;
        return { fn: v.toLowerCase(), args };
      }
      return { field: v };
    }
    throw new Error(`unexpected "${t.value}"`);
  }
  function cmp() {
    const l = primary();
    const t = peek();
    if (t?.type === 'op' && ['=', '!=', '<', '<=', '>', '>='].includes(t.value)) { i++; return { op: t.value, l, r: primary() }; }
    return l;
  }
  function and() { let l = cmp(); while (word('and')) { i++; l = { and: [l, cmp()] }; } return l; }
  function or() { let l = and(); while (word('or')) { i++; l = { or: [l, and()] }; } return l; }
  const e = or();
  if (i < toks.length) throw new Error(`unexpected "${toks[i].value}"`);
  return e;
}

/** A field of a note, Dataview style. */
export function field(note, name) {
  const d = note.data;
  switch (name) {
    case 'file.name': return note.rel.split('/').pop().replace(/\.md$/i, '');
    case 'file.link': return note;
    case 'file.folder': return note.rel.split('/').slice(0, -1).join('/');
    case 'file.tags': case 'tags': return d.tags ?? [];
    default: {
      const v = d[name] ?? d[name.toLowerCase()];
      return v instanceof Date ? v.toISOString().slice(0, 10) : v;
    }
  }
}

function evaluate(e, note) {
  if (!e) return true;
  if ('lit' in e) return e.lit;
  if ('field' in e) return field(note, e.field);
  if ('not' in e) return !truthy(evaluate(e.not, note));
  if ('and' in e) return truthy(evaluate(e.and[0], note)) && truthy(evaluate(e.and[1], note));
  if ('or' in e) return truthy(evaluate(e.or[0], note)) || truthy(evaluate(e.or[1], note));
  if ('fn' in e) {
    const a = e.args.map((x) => evaluate(x, note));
    if (e.fn === 'contains') return Array.isArray(a[0]) ? a[0].map((x) => String(x).toLowerCase()).includes(String(a[1]).toLowerCase()) : String(a[0] ?? '').toLowerCase().includes(String(a[1]).toLowerCase());
    if (e.fn === 'date') return String(a[0]);
    if (e.fn === 'length') return Array.isArray(a[0]) ? a[0].length : String(a[0] ?? '').length;
    if (e.fn === 'lower') return String(a[0] ?? '').toLowerCase();
    throw new Error(`unknown function ${e.fn}()`);
  }
  const l = evaluate(e.l, note), r = evaluate(e.r, note);
  const c = compare(l, r);
  return { '=': c === 0, '!=': c !== 0, '<': c < 0, '<=': c <= 0, '>': c > 0, '>=': c >= 0 }[e.op];
}
const truthy = (v) => (Array.isArray(v) ? v.length > 0 : Boolean(v));
function compare(a, b) {
  if (Array.isArray(a)) return a.map((x) => String(x).toLowerCase()).includes(String(b).toLowerCase()) ? 0 : 1;
  if (a === undefined || a === null) return b === undefined || b === null ? 0 : -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'boolean' || typeof b === 'boolean') return a === b ? 0 : 1;
  return String(a).localeCompare(String(b), undefined, { sensitivity: 'base', numeric: true });
}

function matchesFrom(src, note, resolve) {
  if (!src) return true;
  if (src.not) return !matchesFrom(src.not, note, resolve);
  if (src.and) return matchesFrom(src.and[0], note, resolve) && matchesFrom(src.and[1], note, resolve);
  if (src.or) return matchesFrom(src.or[0], note, resolve) || matchesFrom(src.or[1], note, resolve);
  if (src.tag) return [...(note.tags ?? []), ...(note.data.tags ?? [])].some((t) => t === src.tag || t.startsWith(`${src.tag}/`));
  if (src.folder) return note.rel === `${src.folder}.md` || note.rel.startsWith(`${src.folder}/`);
  if (src.link) { const target = resolve(src.link); return Boolean(target) && (note === target || /\[\[([^\]|#]+)/g.test(note.body) && [...note.body.matchAll(/\[\[([^\]|#]+)/g)].some((m) => resolve(m[1].trim()) === target)); }
  return true;
}

/**
 * Runs a parsed query over the notes. `here` is the querying note (its
 * language scopes the result), `resolve` maps a [[link]] to a note.
 */
export function runQuery(q, notes, here, resolve) {
  const crossLang = (function walk(s) { return !!s && (s.folder ? /^[^/]+\/(en|de)(\/|$)/.test(s.folder) : walk(s.not) || walk(s.and?.[0]) || walk(s.and?.[1]) || walk(s.or?.[0]) || walk(s.or?.[1])); })(q.from);
  let rows = notes.filter((n) => n.live && n !== here && (crossLang || !here?.place || n.place?.lang === here.place.lang));
  rows = rows.filter((n) => matchesFrom(q.from, n, resolve) && truthy(evaluate(q.where, n)));
  for (const s of [...q.sort].reverse()) rows.sort((a, b) => compare(field(a, s.field), field(b, s.field)) * (s.desc ? -1 : 1));
  if (q.limit !== undefined) rows = rows.slice(0, q.limit);
  return rows;
}
