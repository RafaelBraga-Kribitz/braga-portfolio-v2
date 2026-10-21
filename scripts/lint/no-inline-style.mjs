#!/usr/bin/env node
// ============================================================
// lint:style — no inline style attributes (BUILD-BRIEF §6 rule 1)
//
// No dependencies. Scans every .astro .tsx .ts .md .mdx .mjs .js file under
// src/ and, when it exists, every .html file under dist/ (or under the
// folder given as --dist <dir>). Fails on every style attribute except one
// whose value consists only of custom-property declarations AND sits where
// rule 1 allows it:
//   style="--w: 40%; --x: 0%"       on .ev-fill / .ev-mid, or a chart mark
//                                   (.mark, .swatch, an SVG shape, anything
//                                   inside an <svg>)
//   style={`--w: ${w}%`}            the same, computed
//   style={{ '--w': w }}            anywhere inside a Preact tool island
//                                   (src/components/tools/; <astro-island>
//                                   in a built page)
// A {…} expression passes only when it provably yields custom properties:
// a literal, a ternary of literals, or a same-file helper returning one
//   style={b.x ? `--x: ${b.x}; --w: ${b.w}` : `--w: ${b.w}`}
//   style={geometry(b)}   with   const geometry = (b) => `--w: ${b.w}`
//
// Forms. Attribute names are case-insensitive (STYLE="…" reaches the page
// as style). Built HTML and Markdown are read tag by tag, so text that only
// looks like an attribute (an HTML example inside a code block, escaped as
// &lt;b style=…&gt;; a Markdown code fence or code span) is not flagged.
// Code files are read as text: `style=` written tight, `style = …` with
// spaces inside a tag (outside a tag a spaced `style = …` is a variable
// assignment), a spread `{...{ style: … }}`, the props object of
// h() / createElement() / jsx() calls, and in .tsx / .astro any object
// literal with a style key (a props object spread later, {...props}).
//
// Built HTML: every page, every code block, table and formula included,
// must be clean; nothing is exempt (mathematics is native MathML since 21
// Oct 2026, so KaTeX's styled HTML layer no longer exists). Exits 1 and
// prints file:line for each offender.
// ============================================================
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
/** @param {string} p */
const rel = (p) => relative(root, p) || p;
const args = process.argv.slice(2);
const distArg = args.indexOf('--dist');
const DIST = distArg >= 0 && args[distArg + 1] ? resolve(args[distArg + 1]) : join(root, 'dist');

/** @param {string} dir @param {string[]} [out] */
function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const SRC_EXT = new Set(['.astro', '.tsx', '.ts', '.md', '.mdx', '.mjs', '.js']);
/** read tag by tag (HTML syntax); everything else is read as code */
const MARKUP_EXT = new Set(['.md', '.html']);
/** the Preact tool islands: custom properties anywhere inside them */
const ISLANDS = join(root, 'src', 'components', 'tools');
/** @param {string} text @param {number} idx */
const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;

// the value of a style attribute: "…" | '…' | `…` | {…} (two levels of
// nested braces, enough for style={{ '--w': `${x}%` }}) | unquoted
const VALUE = String.raw`(?:"([^"]*)"|'([^']*)'|` + '`([^`]*)`' + String.raw`|\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}|([^\s"'` + '`' + String.raw`{}<>=][^\s>]*))`;
// not part of a longer name or a property access (el.style, data-style, $style)
const LEAD = String.raw`(?<![\w$.:-])style`;
const STYLE_TIGHT = new RegExp(`${LEAD}=${VALUE}`, 'gi');
const STYLE_SPACED = new RegExp(`${LEAD}(?:\\s+=\\s*|=\\s+)${VALUE}`, 'gi');
// an object-literal style key whose value is a literal (not a type): { style: { … } }
const OBJKEY = /(?<![\w$.-])['"]?style['"]?\s*:\s*(?=[{'"`])/gi;
// a spread whose object names style: {...{ style: … }}
const SPREAD = /\.\.\.\s*\{\s*['"]?style['"]?\s*:/gi;
// a hyperscript / JSX-runtime call with a props object: h('div', { … })
const CALL = /\b(?:h|createElement|jsxs?|jsxDEV)\(\s*(?:'[^']*'|"[^"]*"|[A-Za-z_$][\w$.]*)\s*,\s*(?=\{)/g;

// where rule 1 allows the custom-property form
const MARK_CLASS = /(?:^|\s)(?:ev-fill|ev-mid|mark|swatch)(?:\s|$)/;
const SVG_TAGS = new Set(['svg', 'g', 'rect', 'line', 'path', 'circle', 'ellipse', 'polyline', 'polygon', 'text', 'tspan', 'use']);

// a value made only of custom-property declarations
const CUSTOM_ONLY = /^\s*(?:--[\w-]+\s*:\s*[^;]*;?\s*)+$/;

/* ---------- a small expression reader (strings, templates, brackets) ---------- */

/** Index of the quote closing the string opened at i. @param {string} s @param {number} i */
function skipQuote(s, i) {
  const q = s[i];
  for (let j = i + 1; j < s.length; j++) {
    if (s[j] === '\\') { j++; continue; }
    if (s[j] === q) return j;
  }
  return s.length;
}
/** Index of the backtick closing the template opened at i (${…} may nest). @param {string} s @param {number} i */
function skipTemplate(s, i) {
  for (let j = i + 1; j < s.length; j++) {
    if (s[j] === '\\') { j++; continue; }
    if (s[j] === '`') return j;
    if (s[j] === '$' && s[j + 1] === '{') {
      let depth = 1;
      j += 2;
      while (j < s.length && depth > 0) {
        const c = s[j];
        if (c === '`') j = skipTemplate(s, j);
        else if (c === '"' || c === "'") j = skipQuote(s, j);
        else if (c === '{') depth++;
        else if (c === '}') depth--;
        j++;
      }
      j--; // the for loop steps past the closing brace
    }
  }
  return s.length;
}
/**
 * Calls fn(char, index) for every character outside strings, templates and
 * brackets (depth 0). Stops early when fn returns true; returns that index.
 * @param {string} s @param {(c: string, i: number) => boolean | void} fn
 */
function eachTop(s, fn) {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"' || c === "'") { i = skipQuote(s, i); continue; }
    if (c === '`') { i = skipTemplate(s, i); continue; }
    if (c === '(' || c === '[' || c === '{') { depth++; continue; }
    if (c === ')' || c === ']' || c === '}') { depth--; continue; }
    if (depth === 0 && fn(c, i)) return i;
  }
  return -1;
}
/** Removes parentheses that wrap the whole expression. @param {string} e */
function unwrap(e) {
  let v = e.trim();
  while (v.startsWith('(') && v.endsWith(')')) {
    let depth = 0;
    let wraps = true;
    for (let i = 0; i < v.length; i++) {
      if (v[i] === '"' || v[i] === "'") { i = skipQuote(v, i); continue; }
      if (v[i] === '`') { i = skipTemplate(v, i); continue; }
      if (v[i] === '(') depth++;
      else if (v[i] === ')' && --depth === 0 && i < v.length - 1) { wraps = false; break; }
    }
    if (!wraps) break;
    v = v.slice(1, -1).trim();
  }
  return v;
}
/** `c ? a : b` at the top level → [a, b], else null. @param {string} e */
function ternary(e) {
  const q = eachTop(e, (c, i) => c === '?' && e[i + 1] !== '?' && e[i + 1] !== '.' && e[i - 1] !== '?');
  if (q < 0) return null;
  const rest = e.slice(q + 1);
  let nested = 0;
  const colon = eachTop(rest, (c, i) => {
    if (c === '?' && rest[i + 1] !== '?' && rest[i + 1] !== '.' && rest[i - 1] !== '?') nested++;
    else if (c === ':') { if (nested === 0) return true; nested--; }
    return false;
  });
  return colon < 0 ? null : [rest.slice(0, colon), rest.slice(colon + 1)];
}
/** The expression a same-file helper returns: `const f = (…) => expr` or `function f(…) { return expr; }`. @param {string} name @param {string} file */
function helperBody(name, file) {
  const n = name.replace(/[$]/g, '\\$');
  const arrow = new RegExp(String.raw`(?:const|let|var)\s+${n}\s*(?::[^=]+)?=\s*(?:async\s+)?(?:\([^()]*\)|[\w$]+)\s*(?::\s*[\w$<>\[\]|' ]+)?\s*=>\s*`).exec(file);
  const fn = new RegExp(String.raw`function\s+${n}\s*\([^()]*\)\s*(?::\s*[\w$<>\[\]|' ]+)?\s*\{\s*return\s+`).exec(file);
  const m = arrow || fn;
  if (!m) return null;
  const from = (m.index ?? 0) + m[0].length;
  const tail = file.slice(from);
  if (arrow && tail.startsWith('{')) { // a block body: exactly one return
    const block = tail.slice(0, skipBlock(tail) + 1);
    const returns = [...block.matchAll(/\breturn\s+/g)];
    if (returns.length !== 1) return null;
    const r = block.slice((returns[0].index ?? 0) + returns[0][0].length);
    return r.slice(0, statementEnd(r));
  }
  return tail.slice(0, statementEnd(tail));
}
/** Index of the brace closing the block that opens at 0. @param {string} s */
function skipBlock(s) {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"' || c === "'") { i = skipQuote(s, i); continue; }
    if (c === '`') { i = skipTemplate(s, i); continue; }
    if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return i;
  }
  return s.length - 1;
}
/** End of the expression statement: the first top-level ; or line break, or a closing bracket. @param {string} s */
function statementEnd(s) {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '"' || c === "'") { i = skipQuote(s, i); continue; }
    if (c === '`') { i = skipTemplate(s, i); continue; }
    if (c === '(' || c === '[' || c === '{') depth++;
    else if (c === ')' || c === ']' || c === '}') { if (depth === 0) return i; depth--; }
    else if (depth === 0 && (c === ';' || c === '\n')) return i;
  }
  return s.length;
}

/** @param {string} s */
const customOnly = (s) => CUSTOM_ONLY.test(s.replace(/\$\{[^}]*\}/g, 'x'));

/**
 * Whether a JS expression can only produce custom-property declarations: a
 * string or template literal of them, an object literal whose keys are all
 * custom properties, a ternary whose branches both qualify, or a call to (or
 * a reference of) a helper in the same file whose returned expression
 * qualifies. Anything else cannot be proven and fails.
 * @param {string} expr @param {string} file @param {number} [depth=0]
 * @returns {boolean}
 */
function permittedExpr(expr, file, depth = 0) {
  const v = unwrap(expr);
  if (!v || depth > 3) return false;
  const lit = /^`([\s\S]*)`$/.exec(v) || /^"([^"]*)"$/.exec(v) || /^'([^']*)'$/.exec(v);
  if (lit && (v[0] !== '`' || skipTemplate(v, 0) === v.length - 1)) return customOnly(lit[1]);
  const t = ternary(v);
  if (t) return permittedExpr(t[0], file, depth + 1) && permittedExpr(t[1], file, depth + 1);
  const obj = /^\{([\s\S]*)\}$/.exec(v);
  if (obj && skipBlock(v) === v.length - 1) {
    if (/\.\.\./.test(obj[1])) return false; // a spread cannot be proven
    const keys = [...obj[1].matchAll(/(?:^|[,{])\s*(?:'([^']+)'|"([^"]+)"|([\w$-]+)|\[[^\]]*\])\s*:/g)].map((m) => m[1] ?? m[2] ?? m[3] ?? '[computed]');
    return keys.length > 0 && keys.every((k) => k.startsWith('--'));
  }
  const ref = /^([A-Za-z_$][\w$]*)\s*(?:\([\s\S]*\))?$/.exec(v);
  if (ref) {
    const body = helperBody(ref[1], file);
    return body != null && permittedExpr(body, file, depth + 1);
  }
  return false;
}

/**
 * @param {string | undefined} str   a quoted or unquoted value
 * @param {string | undefined} obj   the inside of {…}
 * @param {string} file              the whole file, to resolve helpers
 */
function permitted(str, obj, file) {
  if (str != null) return customOnly(str);
  if (obj == null) return false;
  return permittedExpr(obj, file);
}

/* ---------- reading tags ---------- */

/** Replaces every match of re with spaces of the same length (line numbers stay). @param {string} text @param {RegExp} re */
const blankAll = (text, re) => text.replace(re, (m) => m.replace(/[^\n]/g, ' '));
/** [start, end) index ranges of the elements an opening/closing pair encloses. @param {string} text @param {string} tag */
function ranges(text, tag) {
  const out = [];
  const re = new RegExp(`<${tag}\\b[\\s\\S]*?</${tag}\\s*>`, 'gi');
  for (const m of text.matchAll(re)) out.push([m.index ?? 0, (m.index ?? 0) + m[0].length]);
  return out;
}
/** @param {number} i @param {number[][]} rs */
const within = (i, rs) => rs.some(([a, b]) => i >= a && i < b);

// one start tag with its attributes; quoted values may hold ">"
const TAG = /<([a-zA-Z][\w:-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*\/?>/g;
const ATTR = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

/** Index of the "<" opening the tag that holds position i, or -1 (text outside a tag). @param {string} s @param {number} i */
function tagStart(s, i) {
  const from = s.lastIndexOf('<', i);
  if (from < 0 || !/[A-Za-z]/.test(s[from + 1] || '')) return -1;
  // between the tag name and i: no ">" or ";" outside {…}, quotes and =>
  let between = s.slice(from, i).replace(/=>/g, '  ');
  between = between.replace(/"[^"\n]*"|'[^'\n]*'|`[^`]*`/g, '');
  let prev;
  do { prev = between; between = between.replace(/\{[^{}]*\}/g, ''); } while (between !== prev);
  return /[>;{}]/.test(between) ? -1 : from;
}
/** The source of the tag opening at `from` (to its ">" at depth 0). @param {string} s @param {number} from */
function tagSource(s, from) {
  let depth = 0;
  for (let i = from + 1; i < s.length; i++) {
    const c = s[i];
    if (c === '"' || c === "'") { i = skipQuote(s, i); continue; }
    if (c === '`') { i = skipTemplate(s, i); continue; }
    if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (c === '>' && depth === 0 && s[i - 1] !== '=') return s.slice(from, i + 1);
  }
  return s.slice(from);
}
/** The class attribute's literal text in a tag's source (class, className, quoted or {`…`}). @param {string} src */
function classIn(src) {
  const m = /\bclass(?:Name)?\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*[`'"]([^`'"]*)[`'"]\s*\})/.exec(src);
  return m ? (m[1] ?? m[2] ?? m[3] ?? '') : '';
}

/** @type {string[]} */
const failures = [];
let checked = 0;
/** @param {string} file @param {string} text @param {number} i @param {string} what @param {string} why */
const fail = (file, text, i, what, why) => failures.push(`${rel(file)}:${lineOf(text, i)} · ${what.slice(0, 80).replace(/\s+/g, ' ')}${why ? ' · ' + why : ''}`);
const WHERE = 'custom properties belong on .ev-fill / .ev-mid, a chart mark or inside a tool island (rule 1)';

/** Built HTML and Markdown: tag by tag. @param {string} file @param {string} raw */
function scanMarkup(file, raw) {
  let text = blankAll(raw, /<!--[\s\S]*?-->/g);
  text = blankAll(text, /(<(script|style)\b[^>]*>)[\s\S]*?(<\/\2\s*>)/gi);
  if (extname(file) === '.md') {
    // fenced code and code spans are text, not markup
    text = blankAll(text, /^(\s*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\2[ \t]*$/gm);
    text = blankAll(text, /`[^`\n]+`/g);
  }
  const svg = ranges(text, 'svg');
  const islands = ranges(text, 'astro-island');
  for (const t of text.matchAll(TAG)) {
    const at = t.index ?? 0;
    const name = t[1].toLowerCase();
    let style = null, cls = '';
    for (const a of (t[2] || '').matchAll(ATTR)) {
      const key = a[1].toLowerCase();
      const value = a[2] ?? a[3] ?? a[4] ?? '';
      if (key === 'style') style = value;
      else if (key === 'class') cls = value;
    }
    if (style === null) continue;
    if (!customOnly(style)) { fail(file, text, at, t[0], 'sets real properties'); continue; }
    if (!(MARK_CLASS.test(cls) || SVG_TAGS.has(name) || within(at, svg) || within(at, islands))) fail(file, text, at, t[0], WHERE);
  }
}

/** Code files (.astro .tsx .ts .mjs .js .mdx): as text. @param {string} file @param {string} text */
function scanCode(file, text) {
  const island = file.startsWith(ISLANDS + sep);
  const svg = ranges(text, 'svg');
  /** @param {number} i  where the attribute sits */
  const placed = (i) => {
    if (island || within(i, svg)) return true;
    const from = tagStart(text, i);
    if (from < 0) return false;
    const src = tagSource(text, from);
    const name = (/^<([A-Za-z][\w:-]*)/.exec(src) || [])[1] || '';
    return SVG_TAGS.has(name.toLowerCase()) || MARK_CLASS.test(classIn(src));
  };
  const check = (i, m, ok) => {
    if (!ok) fail(file, text, i, m, 'sets real properties or cannot be proven to set custom properties only');
    else if (!placed(i)) fail(file, text, i, m, WHERE);
  };
  for (const m of text.matchAll(STYLE_TIGHT)) {
    const i = m.index ?? 0;
    check(i, m[0], permitted(m[1] ?? m[2] ?? m[3] ?? m[5], m[4], text));
  }
  for (const m of text.matchAll(STYLE_SPACED)) {
    const i = m.index ?? 0;
    // `const style = …` / `style = x;` is an assignment; inside a tag it is an attribute
    if (tagStart(text, i) < 0) continue;
    check(i, m[0], permitted(m[1] ?? m[2] ?? m[3] ?? m[5], m[4], text));
  }
  for (const m of text.matchAll(SPREAD)) fail(file, text, m.index ?? 0, m[0], 'a spread cannot be proven to set custom properties only');
  // in a component file, a props object with a style key may be spread
  // later ({...props}): its value must be custom properties too
  if (/\.(?:tsx|jsx|astro)$/.test(file)) {
    for (const m of text.matchAll(OBJKEY)) {
      const from = (m.index ?? 0) + m[0].length;
      const rest = text.slice(from);
      let end = rest.length;
      eachTop(rest, (c, k) => { if (c === ',' || c === ';' || c === '\n') { end = k; return true; } return false; });
      const expr = rest.slice(0, end);
      if (!permittedExpr(expr, text)) fail(file, text, m.index ?? 0, `style:${expr}`, 'a style object sets real properties or cannot be proven to set custom properties only');
      else if (!island) fail(file, text, m.index ?? 0, `style:${expr}`, WHERE);
    }
  }
  for (const m of text.matchAll(CALL)) {
    const from = (m.index ?? 0) + m[0].length;
    const obj = text.slice(from, from + skipBlock(text.slice(from)) + 1);
    const inner = obj.slice(1, -1);
    // the top-level `style:` of the props object
    let at = -1;
    eachTop(inner, (_c, k) => { if (/^style\s*:/i.test(inner.slice(k)) && !/[\w$]/.test(inner[k - 1] || '')) { at = k; return true; } return false; });
    if (at < 0) continue;
    const valueFrom = at + inner.slice(at).indexOf(':') + 1;
    const rest = inner.slice(valueFrom);
    let end = rest.length;
    eachTop(rest, (c, k) => { if (c === ',') { end = k; return true; } return false; });
    const expr = rest.slice(0, end);
    const ok = permittedExpr(expr, text);
    const i = from + 1 + at;
    if (!ok) fail(file, text, i, `style:${expr}`, 'sets real properties or cannot be proven to set custom properties only');
    else if (!(island || MARK_CLASS.test(obj))) fail(file, text, i, `style:${expr}`, WHERE);
  }
}

/** @param {string} file @param {string} text */
function scanText(file, text) {
  checked++;
  if (MARKUP_EXT.has(extname(file))) scanMarkup(file, text);
  else scanCode(file, text);
}

/**
 * The offenders in one file's text, without touching the disk; `file` is a
 * path (its extension picks markup or code; a path under
 * src/components/tools/ is an island). For tests/unit/lint-style.test.mjs.
 * @param {string} file @param {string} text @returns {string[]}
 */
export function lintText(file, text) {
  const before = failures.length;
  scanText(resolve(root, file), text);
  return failures.splice(before);
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) main();

function main() {
const sources = walk(join(root, 'src')).filter((p) => SRC_EXT.has(extname(p)));
for (const p of sources) scanText(p, readFileSync(p, 'utf8'));
const distFiles = existsSync(DIST) ? walk(DIST).filter((p) => extname(p) === '.html') : [];
for (const p of distFiles) scanText(p, readFileSync(p, 'utf8'));

if (failures.length) {
  for (const f of failures) console.error(`FAIL · inline style · ${f}`);
  console.error(`\nlint:style failed · ${failures.length} inline style attribute${failures.length === 1 ? '' : 's'} (only custom-property declarations on an evidence bar or chart mark, or inside a tool island, are allowed, e.g. <span class="ev-fill" style="--w: 40%">).`);
  process.exit(1);
}
console.log(`lint:style passed · ${checked} files checked (${sources.length} source, ${distFiles.length} built page${distFiles.length === 1 ? '' : 's'}${existsSync(DIST) ? ` in ${rel(DIST)}` : ', no dist'}).`);
}
