#!/usr/bin/env node
// ============================================================
// lint:style — no inline style attributes (BUILD-BRIEF §6 rule 1)
//
// No dependencies. Scans every .astro .tsx .ts .md .mdx .mjs .js file under
// src/ and, when it exists, every .html file under dist/ (or under the
// folder given as --dist <dir>). Fails on every style= / style={ attribute
// except one whose value consists only of custom-property declarations,
// the ONE permitted form:
//   style="--w: 40%; --x: 0%"       (.ev-fill / .ev-mid / chart marks)
//   style={`--w: ${w}%`}            (the same, computed)
//   style={{ '--w': w }}            (Preact islands only)
// A {…} expression passes only when it provably yields custom properties:
// a literal, a ternary of literals, or a same-file helper returning one
//   style={b.x ? `--x: ${b.x}; --w: ${b.w}` : `--w: ${b.w}`}
//   style={geometry(b)}   with   const geometry = (b) => `--w: ${b.w}`
// An attribute is `style=` written tight (as markup and JSX write it). In
// markup (.md .mdx .html) spaces around the = count too; in code files a
// spaced `style = …` is a variable assignment, not an attribute.
//
// Built HTML: the subtree <span class="katex-html" aria-hidden="true"> is
// KaTeX's own layout (struts and vlists: generated, hidden from assistive
// technology; the MathML beside it is the accessible tree) and is exempt.
// Everything else in the page, every code block and table included, must
// be clean. Exits 1 and prints file:line for each offender.
// ============================================================
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, extname, resolve } from 'node:path';
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
const MARKUP_EXT = new Set(['.md', '.mdx', '.html']);
/** @param {string} text @param {number} idx */
const lineOf = (text, idx) => text.slice(0, idx).split('\n').length;

// the value of a style attribute: "…" | '…' | `…` | {…} (two levels of
// nested braces, enough for style={{ '--w': `${x}%` }}) | unquoted
const VALUE = String.raw`(?:"([^"]*)"|'([^']*)'|` + '`([^`]*)`' + String.raw`|\{((?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*)\}|([^\s"'` + '`' + String.raw`{}<>=][^\s>]*))`;
// not part of a longer name or a property access (el.style, data-style, $style)
const LEAD = String.raw`(?<![\w$.:-])style`;
const STYLE_TIGHT = new RegExp(`${LEAD}=${VALUE}`, 'g');
const STYLE_SPACED = new RegExp(`${LEAD}\\s*=\\s*${VALUE}`, 'g');

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

/** Ranges of KaTeX's HTML layer in a built page: <span class="katex-html" …> to its closing </span>. @param {string} html */
function katexRanges(html) {
  /** @type {[number, number][]} */
  const ranges = [];
  const tag = /<span\b[^>]*>|<\/span>/g;
  let depth = 0;
  let start = -1;
  for (const m of html.matchAll(tag)) {
    const i = m.index ?? 0;
    if (m[0][1] === '/') {
      if (depth > 0 && --depth === 0) { ranges.push([start, i + m[0].length]); start = -1; }
      continue;
    }
    if (depth > 0) depth++;
    else if (/class="[^"]*\bkatex-html\b/.test(m[0])) { depth = 1; start = i; }
  }
  return ranges;
}
/** @param {[number, number][]} ranges @param {number} i */
const inRanges = (ranges, i) => ranges.some(([a, b]) => i >= a && i < b);

/** @type {string[]} */
const failures = [];
let checked = 0;
/** @param {string} file @param {boolean} html */
function scan(file, html) {
  const text = readFileSync(file, 'utf8');
  const ranges = html ? katexRanges(text) : [];
  const re = MARKUP_EXT.has(extname(file)) ? STYLE_SPACED : STYLE_TIGHT;
  checked++;
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0;
    if (permitted(m[1] ?? m[2] ?? m[3] ?? m[5], m[4], text)) continue;
    if (html && inRanges(ranges, i)) continue;
    failures.push(`${rel(file)}:${lineOf(text, i)} · ${m[0].slice(0, 80).replace(/\s+/g, ' ')}`);
  }
}

const sources = walk(join(root, 'src')).filter((p) => SRC_EXT.has(extname(p)));
for (const p of sources) scan(p, false);
const distFiles = existsSync(DIST) ? walk(DIST).filter((p) => extname(p) === '.html') : [];
for (const p of distFiles) scan(p, true);

if (failures.length) {
  for (const f of failures) console.error(`FAIL · inline style · ${f}`);
  console.error(`\nlint:style failed · ${failures.length} inline style attribute${failures.length === 1 ? '' : 's'} (only custom-property declarations are allowed, e.g. style="--w: 40%").`);
  process.exit(1);
}
console.log(`lint:style passed · ${checked} files checked (${sources.length} source, ${distFiles.length} built page${distFiles.length === 1 ? '' : 's'}${existsSync(DIST) ? ` in ${rel(DIST)}` : ', no dist'}).`);
