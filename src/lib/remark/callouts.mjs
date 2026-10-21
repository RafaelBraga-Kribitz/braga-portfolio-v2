// src/lib/remark/callouts.mjs — Obsidian callouts and ==marks== for the
// Sätteri mdast phase (Astro 7's default Markdown processor; the file sits
// under remark/ because it does what a remark plugin would do).
//
// Authoring (Obsidian syntax):
//   > [!type] Title            → <div class="callout" data-callout="type">
//   > [!type|wide] Title       → … data-callout-metadata="wide"
//   > [!faq]- Question         → <details class="callout" data-callout="faq">
//                                (- closed, + open; the summary is the title)
//   > [!spec] Model inputs     → list items "Term — value" become <dl><dt><dd>
//   > [!metrics] Key figures   → list items "value — label" become
//                                <li><b>value</b><span>label</span></li>;
//                                ==value== keeps its <mark> inside <b> and the
//                                item gets class="key" (the earned figure)
//   > [!bookmark] Next         → the single link becomes the card:
//                                <a href><b>text</b><span class="sub">rest</span>
//                                <span class="glyph" aria-hidden="true">→</span></a>
//   > [!cta] Call to action    → <a href>text <span class="glyph">↗</span></a>
//   > [!bars] Fig. 01-01-1 · … → the evidence figure of the Site specimen
//                                (pattern 05), not a callout: see "bars" below
//   ==text== in a paragraph    → <mark>text</mark> (list items and table
//                                cells too; headings stay plain)
//   a callout inside a callout → built by the outer one, any depth
//
// Two passes, in order: marks first (so a metrics value can carry its mark),
// then the callouts. Both build plain mdast/custom nodes that the processor
// renders through data.hName / data.hProperties (the vocabulary of
// design-system/components.css, section 3, and charts.css, section 1; no
// class is invented here).
import { number, percent, currency, unit as withUnit } from '../format.mjs';

/** Inline node types a text node may sit inside and still be "in a paragraph". */
const INLINE = new Set(['emphasis', 'strong', 'delete', 'link', 'linkReference', 'superscript', 'subscript']);
const MARK = /==([^=\n]+?)==/g;
const MARKER = /^\[!([A-Za-z0-9_-]+)(?:\|([^\]]*))?\]([+-])?[ \t]*/;
const SEPARATOR = /\s+[—–]\s+|\s+[—–]$/; // "Term — value" (em or en dash); a dash at the end of a text node hands the rest to the next node
const EXTERNAL = /^[a-z][a-z0-9+.-]*:/i;    // an absolute URL (http:, https:, mailto:) gets ↗

/** @param {string} type */
const titleCase = (type) => type.charAt(0).toUpperCase() + type.slice(1);

/**
 * A fresh, mutable copy of a materialised subtree (positions are not read, so
 * a JSON round trip loses nothing the renderer needs).
 * @template T
 * @param {T} nodes
 * @returns {T}
 */
const clone = (nodes) => JSON.parse(JSON.stringify(nodes));

/** @param {string} tag @param {Record<string, unknown>} [props] @param {any[]} [children] */
const el = (tag, props, children = []) => ({
  type: `bk-${tag}`,
  data: { hName: tag, ...(props && Object.keys(props).length ? { hProperties: props } : {}) },
  children,
});
/** @param {string} value */
const text = (value) => ({ type: 'text', value });
/** @param {string} value */
const mark = (value) => ({ type: 'mark', data: { hName: 'mark' }, children: [text(value)] });

/**
 * Splits text nodes on ==…== into text and mark nodes. Pure.
 * @param {any[]} nodes
 * @returns {{ nodes: any[], changed: boolean }}
 */
function markify(nodes) {
  const out = [];
  let changed = false;
  for (const n of nodes) {
    if (n.type !== 'text' || !MARK.test(n.value)) { out.push(n); MARK.lastIndex = 0; continue; }
    MARK.lastIndex = 0;
    const parts = n.value.split(MARK);
    parts.forEach((p, i) => { if (i % 2) out.push(mark(p)); else if (p) out.push(text(p)); });
    changed = true;
  }
  return { nodes: out, changed };
}

/**
 * The first block ancestor of a text node, walking up through inline nodes.
 * @param {any} node @param {any} ctx
 */
function blockAncestor(node, ctx) {
  let p = ctx.parent(node);
  while (p && INLINE.has(p.type)) p = ctx.parent(p);
  return p;
}

/** Blocks whose text may carry ==marks== (Obsidian highlights there too; headings stay plain). */
const MARK_BLOCKS = new Set(['paragraph', 'tableCell']);

/** Pass 1: ==text== → <mark> inside paragraphs (list items included) and table cells. */
export const marks = {
  name: 'bk-marks',
  text(node, ctx) {
    if (!node.value.includes('==')) return;
    const block = blockAncestor(node, ctx);
    if (!block || !MARK_BLOCKS.has(block.type)) return;
    const { nodes, changed } = markify([clone(node)]);
    if (changed) ctx.replaceNode(node, nodes);
  },
};

/**
 * Splits a paragraph's inline children at the first "Term — value" separator.
 * @param {any[]} inline
 * @returns {{ before: any[], after: any[] } | null}
 */
function splitAtSeparator(inline) {
  for (let i = 0; i < inline.length; i++) {
    const n = inline[i];
    if (n.type !== 'text') continue;
    const m = SEPARATOR.exec(n.value);
    if (!m) continue;
    const before = inline.slice(0, i);
    const head = n.value.slice(0, m.index);
    const tail = n.value.slice(m.index + m[0].length);
    if (head) before.push(text(head));
    const after = tail ? [text(tail)] : [];
    after.push(...inline.slice(i + 1));
    return { before, after };
  }
  return null;
}

/**
 * The inline children of a list item: its first paragraph (a tight item).
 * @param {any} item
 */
const itemInline = (item) => {
  const p = item.children && item.children.find((c) => c.type === 'paragraph');
  return p ? p.children : [];
};

/**
 * Splits the first paragraph of the blockquote into the marker, the title
 * (the rest of the first line) and the content that follows.
 * @param {any[]} blocks  cloned blockquote children
 */
function parseHead(blocks) {
  const first = blocks[0];
  if (!first || first.type !== 'paragraph' || !first.children.length) return null;
  const t0 = first.children[0];
  if (t0.type !== 'text') return null;
  const m = MARKER.exec(t0.value);
  if (!m) return null;
  const type = m[1].toLowerCase();
  const metadata = (m[2] || '').trim();
  const fold = m[3] || '';
  // the title runs to the end of the first line; the content starts after it
  const rest = t0.value.slice(m[0].length);
  const nl = rest.indexOf('\n');
  const title = [];
  const contentInline = [];
  if (nl >= 0) {
    if (rest.slice(0, nl)) title.push(text(rest.slice(0, nl)));
    const tail = rest.slice(nl + 1);
    if (tail) contentInline.push(text(tail));
    contentInline.push(...first.children.slice(1));
  } else {
    if (rest) title.push(text(rest));
    let i = 1;
    for (; i < first.children.length; i++) {
      const n = first.children[i];
      if (n.type === 'text' && n.value.includes('\n')) {
        const k = n.value.indexOf('\n');
        if (n.value.slice(0, k)) title.push(text(n.value.slice(0, k)));
        if (n.value.slice(k + 1)) contentInline.push(text(n.value.slice(k + 1)));
        contentInline.push(...first.children.slice(i + 1));
        break;
      }
      title.push(n);
    }
  }
  const content = blocks.slice(1);
  if (contentInline.length) content.unshift({ type: 'paragraph', children: contentInline });
  return { type, metadata, fold, title, content };
}

/**
 * spec: the first list → <dl>.
 * @param {any[]} content @param {any} ctx @param {any} node
 */
function specList(content, ctx, node) {
  const i = content.findIndex((b) => b.type === 'list');
  if (i < 0) return;
  const rows = [];
  for (const item of content[i].children) {
    const inline = itemInline(item);
    const split = splitAtSeparator(inline);
    if (!split) {
      ctx.report({ message: 'spec callout: a list item has no "Term — value" separator', node, severity: 'warning' });
      rows.push(el('dt', {}, inline), el('dd', {}, []));
      continue;
    }
    rows.push(el('dt', {}, split.before), el('dd', {}, split.after));
  }
  content[i] = el('dl', {}, rows);
}

/**
 * metrics: the first list → <ul><li class?><b>value</b><span>label</span></li>.
 * @param {any[]} content @param {any} ctx @param {any} node
 */
function metricsList(content, ctx, node) {
  const i = content.findIndex((b) => b.type === 'list');
  if (i < 0) return;
  const items = [];
  for (const item of content[i].children) {
    const inline = itemInline(item);
    const split = splitAtSeparator(inline) || { before: inline, after: [] };
    if (!splitAtSeparator(inline)) ctx.report({ message: 'metrics callout: a list item has no "value — label" separator', node, severity: 'warning' });
    const key = split.before.some((n) => n.type === 'mark');
    items.push(el('li', key ? { className: ['key'] } : {}, [el('b', {}, split.before), el('span', {}, split.after)]));
  }
  content[i] = el('ul', {}, items);
}

/**
 * The first link in the content, with the inline nodes around it.
 * @param {any[]} content
 */
function findLink(content) {
  for (let b = 0; b < content.length; b++) {
    const block = content[b];
    if (block.type !== 'paragraph') continue;
    const i = block.children.findIndex((n) => n.type === 'link');
    if (i < 0) continue;
    return { block: b, index: i, link: block.children[i], inline: block.children };
  }
  return null;
}

/** Drops a leading separator (dash, dot, colon, spaces) from a run of inline nodes. */
function trimLead(nodes) {
  const out = clone(nodes);
  while (out.length && out[0].type === 'text') {
    out[0].value = out[0].value.replace(/^[\s—–·:]+/, '');
    if (out[0].value) break;
    out.shift();
  }
  return out;
}

/** @param {string} url */
const glyph = (url) => el('span', { className: ['glyph'], ariaHidden: 'true' }, [text(EXTERNAL.test(url) ? '↗' : '→')]);

/**
 * bookmark: the single link becomes the whole card.
 * @param {any[]} content @param {any} ctx @param {any} node
 */
function bookmarkLink(content, ctx, node) {
  const found = findLink(content);
  if (!found) { ctx.report({ message: 'bookmark callout: no link in the content', node, severity: 'warning' }); return; }
  let sub = trimLead(found.inline.slice(found.index + 1));
  if (!sub.length) {
    const next = content[found.block + 1];
    if (next && next.type === 'paragraph') { sub = next.children; content.splice(found.block + 1, 1); }
  }
  const children = [el('b', {}, found.link.children)];
  if (sub.length) children.push(el('span', { className: ['sub'] }, sub));
  children.push(glyph(found.link.url));
  content[found.block] = el('a', { href: found.link.url, ...(found.link.title ? { title: found.link.title } : {}) }, children);
}

/**
 * cta: the single link becomes the button.
 * @param {any[]} content @param {any} ctx @param {any} node
 */
function ctaLink(content, ctx, node) {
  const found = findLink(content);
  if (!found) { ctx.report({ message: 'cta callout: no link in the content', node, severity: 'warning' }); return; }
  content[found.block] = el('a', { href: found.link.url }, [...found.link.children, text(' '), glyph(found.link.url)]);
}

/* ---------------------------------------------------------------------------
   bars · the evidence figure (Site specimen 05) in Markdown

     > [!bars] Fig. 01-01-1 · Skill mentions          ← kicker (p.label)
     > SQL and Python lead the snapshot.              ← finding (p.evidence-heading)
     > - SQL — 40                                     ← one bar per item: label — value
     > - Python — 35
     >
     > scale: 0–100 · unit: % · centre: no            ← optional meta lines
     > accent: SQL
     > caption: Share of 720 core postings.
     > source: supplied project record, 16 Sep 2026.

   becomes the DOM charts.css styles (section 1):

     <figure class="evidence" data-width="wide">
       <p class="label">…</p><p class="evidence-heading display">…</p>
       <div class="ev-bars"><div class="ev-bar" [data-accent]>
         <span class="ev-label">SQL</span>
         <span class="ev-track"><span class="ev-fill" style="--w: 40%"></span>[<span class="ev-mid"></span>]</span>
         <span class="ev-value">40%</span></div>…</div>
       <figcaption>caption<br><b>Source:</b> source</figcaption>
     </figure>

   Values are bare numbers (decimal point "." or ",", no grouping, "−" or
   "-" for a negative; the declared unit may follow) and are printed through
   src/lib/format.mjs in the document's language. Geometry is the only
   inline style, custom properties only: --w (and --x when the fill does not
   start at the left edge). centre: yes draws the zero line at 50% and grows
   each bar left or right from it on a symmetric scale (−m–m). Defaults:
   scale 0–100 for unit %, else 0 to the largest value; centred, ± the
   largest magnitude. A malformed value, a value outside the scale or an
   unknown line fails the build, naming the file.
   ------------------------------------------------------------------------- */

const SOURCE = { en: 'Source', de: 'Quelle' };
const META_KEY = /^\s*(scale|unit|centre|center|accent|caption|source)\s*:\s*/i;
const NUM = String.raw`[+−-]?\d+(?:[.,]\d+)?`;

/** Plain text of inline nodes. @param {any[]} nodes @returns {string} */
const plain = (nodes) => nodes.map((n) => (typeof n.value === 'string' ? n.value : Array.isArray(n.children) ? plain(n.children) : '')).join('');

/**
 * Splits inline nodes into lines at soft line breaks ("\n" in a text node)
 * and hard breaks.
 * @param {any[]} inline @returns {any[][]}
 */
function splitLines(inline) {
  /** @type {any[][]} */
  const out = [[]];
  for (const n of inline) {
    if (n.type === 'break') { out.push([]); continue; }
    if (n.type !== 'text' || !n.value.includes('\n')) { out[out.length - 1].push(n); continue; }
    n.value.split('\n').forEach((part, i) => {
      if (i > 0) out.push([]);
      if (part) out[out.length - 1].push(text(part));
    });
  }
  return out.filter((l) => plain(l).trim() !== '');
}

/** Drops leading characters from a run of inline nodes. @param {any[]} nodes @param {number} count */
function dropChars(nodes, count) {
  const out = clone(nodes);
  let left = count;
  while (left > 0 && out.length && out[0].type === 'text') {
    if (out[0].value.length > left) { out[0].value = out[0].value.slice(left); left = 0; break; }
    left -= out[0].value.length;
    out.shift();
  }
  return out;
}

/** "−28" / "3,5" / "40" → a number and its authored decimals. @param {string} s */
function parseNumber(s) {
  const m = new RegExp(`^${NUM}$`).exec(s.trim());
  if (!m) return null;
  const t = s.trim().replace('−', '-').replace(',', '.');
  const frac = t.split('.')[1];
  return { value: Number(t), digits: frac ? frac.length : 0 };
}

/**
 * The evidence figure for a [!bars] callout.
 * @param {{ title: any[], content: any[] }} head @param {any} ctx
 */
function barsFigure(head, ctx) {
  const lang = ctx.data && ctx.data.astro && ctx.data.astro.frontmatter && ctx.data.astro.frontmatter.lang === 'de' ? 'de' : 'en';
  const where = ctx.fileURL ? ctx.fileURL.pathname : 'markdown';
  /** @param {string} msg */
  const fail = (msg) => { throw new Error(`bars callout in ${where}: ${msg}`); };

  const content = head.content;
  const listAt = content.findIndex((b) => b.type === 'list');
  if (listAt < 0) fail('no list of "label — value" items');

  // the finding: the paragraphs before the list, as one heading
  const heading = [];
  for (const b of content.slice(0, listAt)) {
    if (b.type !== 'paragraph') fail(`unexpected ${b.type} before the list`);
    if (heading.length) heading.push(text(' '));
    heading.push(...b.children);
  }

  // meta lines: the paragraphs after the list, and lines a bar item swallowed
  // (a meta line written straight under the last item continues its paragraph)
  /** @type {any[][]} */
  const metaLines = [];
  /** @type {{ label: any[], raw: string }[]} */
  const items = [];
  for (const item of content[listAt].children) {
    const lines = splitLines(itemInline(item));
    if (!lines.length) continue;
    const split = splitAtSeparator(lines[0]);
    if (!split) fail(`the item “${plain(lines[0]).trim()}” has no "label — value" separator (a spaced em or en dash)`);
    items.push({ label: split.before, raw: plain(split.after).trim() });
    metaLines.push(...lines.slice(1));
  }
  for (const b of content.slice(listAt + 1)) {
    if (b.type !== 'paragraph') fail(`unexpected ${b.type} after the list`);
    metaLines.push(...splitLines(b.children));
  }
  if (!items.length) fail('the list has no items');

  /** @type {Record<string, string>} */
  const meta = {};
  /** @type {Record<'caption' | 'source', any[]>} */
  const rich = { caption: [], source: [] };
  for (const line of metaLines) {
    const first = plain(line);
    const m = META_KEY.exec(first);
    if (!m) fail(`a line is not one of scale, unit, centre, accent, caption, source: “${first.trim()}”`);
    const key = m[1].toLowerCase();
    if (key === 'caption' || key === 'source') { rich[key] = dropChars(line, m[0].length); continue; }
    // "scale: 0–100 · unit: % · centre: no": key: value pairs joined by the middle dot
    for (const pair of first.split('·')) {
      const p = /^\s*([a-z]+)\s*:\s*(.*?)\s*$/i.exec(pair);
      const k = p ? p[1].toLowerCase() : '';
      if (!p || !['scale', 'unit', 'centre', 'center', 'accent'].includes(k)) fail(`“${pair.trim()}” is not scale, unit, centre or accent`);
      meta[k === 'center' ? 'centre' : k] = p[2];
    }
  }

  const u = (meta.unit ?? '').trim();
  const centreRaw = (meta.centre ?? 'no').trim().toLowerCase();
  if (!['yes', 'no', 'true', 'false'].includes(centreRaw)) fail(`centre is yes or no, not “${meta.centre}”`);
  const centre = centreRaw === 'yes' || centreRaw === 'true';

  /** strips the declared unit after a figure. @param {string} s */
  const bare = (s) => (u && s.endsWith(u) ? s.slice(0, -u.length) : s).replace(/[\s ]+$/, '');
  const bars = items.map((it) => {
    const n = parseNumber(bare(it.raw));
    if (!n) fail(`“${it.raw}” is not a number (write digits, a decimal point and an optional minus: 40, 3.5, −28)`);
    return { ...it, ...n };
  });

  // the scale
  let lo; let hi;
  if (meta.scale) {
    const s = new RegExp(`^(${NUM})\\s*(?:–|—|-|to)\\s*(${NUM})$`).exec(bare(meta.scale.trim()));
    const a = s && parseNumber(s[1]);
    const b = s && parseNumber(s[2]);
    if (!a || !b || !(b.value > a.value)) fail(`scale “${meta.scale}” is not "low–high" with low below high`);
    lo = a.value; hi = b.value;
  } else if (centre) {
    const m = Math.max(...bars.map((b) => Math.abs(b.value)));
    lo = -m; hi = m;
  } else {
    lo = 0; hi = u === '%' ? 100 : Math.max(...bars.map((b) => b.value));
  }
  if (!(hi > lo)) fail('the scale is empty (every value is zero)');
  if (centre && lo !== -hi) fail(`a centred scale is symmetric around zero (−${hi}–${hi}), not ${lo}–${hi}`);

  let accent = -1;
  if (meta.accent) {
    accent = bars.findIndex((b) => plain(b.label).trim().toLowerCase() === meta.accent.trim().toLowerCase());
    if (accent < 0) fail(`accent “${meta.accent}” names no bar`);
  }

  /** @param {number} v */
  const pct = (v) => `${Number(v.toFixed(2))}%`;
  /** @param {number} v @param {number} digits */
  const show = (v, digits) => {
    const s = u === '%' ? percent(v, lang, digits) : u === '€' ? currency(v, lang, digits) : u ? withUnit(v, u, lang, digits) : number(v, lang, digits);
    return centre && v > 0 ? `+${s}` : s;
  };

  const rows = bars.map((b, i) => {
    if (b.value < lo || b.value > hi) fail(`“${plain(b.label).trim()} — ${b.raw}” lies outside the scale ${lo}–${hi}`);
    let x; let w;
    if (centre) { w = (Math.abs(b.value) / (hi - lo)) * 100; x = b.value < 0 ? 50 - w : 50; }
    else { w = ((b.value - lo) / (hi - lo)) * 100; x = 0; }
    const style = x ? `--x: ${pct(x)}; --w: ${pct(w)}` : `--w: ${pct(w)}`;
    const track = [el('span', { className: ['ev-fill'], style }, [])];
    if (centre) track.push(el('span', { className: ['ev-mid'] }, []));
    return el('div', i === accent ? { className: ['ev-bar'], dataAccent: '' } : { className: ['ev-bar'] }, [
      el('span', { className: ['ev-label'] }, b.label),
      el('span', { className: ['ev-track'] }, track),
      el('span', { className: ['ev-value'] }, [text(show(b.value, b.digits))]),
    ]);
  });

  const caption = [];
  if (rich.caption.length) caption.push(...rich.caption);
  if (rich.source.length) {
    if (caption.length) caption.push(el('br', {}, []));
    caption.push(el('b', {}, [text(`${SOURCE[lang]}:`)]), text(' '), ...rich.source);
  }

  const children = [];
  if (head.title.length) children.push(el('p', { className: ['label'] }, head.title));
  if (heading.length) children.push(el('p', { className: ['evidence-heading', 'display'] }, heading));
  children.push(el('div', { className: ['ev-bars'] }, rows));
  if (caption.length) children.push(el('figcaption', {}, caption));
  return el('figure', { className: ['evidence'], dataWidth: 'wide' }, children);
}

/**
 * Builds the callout for a blockquote's (cloned) children, or null when the
 * blockquote is an ordinary quotation. Callouts nested inside are built here
 * too: a node replaced in a pass cannot be replaced again from inside.
 * @param {any[]} blocks @param {any} ctx @param {any} node
 */
function build(blocks, ctx, node) {
  const head = parseHead(blocks);
  if (!head) return null;
  if (head.type === 'bars') return barsFigure(head, ctx);
  const { type, metadata, fold } = head;
  const content = head.content;
  nest(content, ctx, node);
  const title = head.title.length ? head.title : [text(type === 'cta' ? 'Call to action' : titleCase(type))];
  if (type === 'spec') specList(content, ctx, node);
  else if (type === 'metrics') metricsList(content, ctx, node);
  else if (type === 'bookmark') bookmarkLink(content, ctx, node);
  else if (type === 'cta') ctaLink(content, ctx, node);
  const faq = type === 'faq';
  const props = { className: ['callout'], dataCallout: type };
  if (metadata) props.dataCalloutMetadata = metadata;
  if (faq && fold === '+') props.open = true;
  return el(faq ? 'details' : 'div', props, [
    el(faq ? 'summary' : 'div', { className: ['callout-title'] }, title),
    el('div', { className: ['callout-content'] }, content),
  ]);
}

/**
 * Replaces, in place, every callout blockquote below these nodes.
 * @param {any[]} nodes @param {any} ctx @param {any} node
 */
function nest(nodes, ctx, node) {
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n.type === 'blockquote') {
      const built = build(n.children, ctx, node);
      if (built) { nodes[i] = built; continue; }
    }
    if (Array.isArray(n.children)) nest(n.children, ctx, node);
  }
}

/** Whether a blockquote opens with a callout marker. @param {any} bq */
const isCallout = (bq) => {
  const first = bq.children && bq.children[0];
  const t0 = first && first.type === 'paragraph' && first.children && first.children[0];
  return !!t0 && t0.type === 'text' && MARKER.test(t0.value);
};

/** Pass 2: the callouts. */
export const callouts = {
  name: 'bk-callouts',
  blockquote(node, ctx) {
    // a callout inside a callout is built by the outer one (nest)
    for (let p = ctx.parent(node); p; p = ctx.parent(p)) {
      if (p.type === 'blockquote' && isCallout(p)) return;
    }
    const built = build(clone(node.children), ctx, node);
    if (built) ctx.replaceNode(node, built); // else an ordinary quotation stays a <blockquote>
  },
};

export default [marks, callouts];
